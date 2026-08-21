import React from 'react';
import { render, cleanup } from '@testing-library/react';
import HelpdeskView from './HelpdeskView';
import { RedmineHelpdeskWidgetFactory } from './widget';
import Api from '@plone/volto/helpers/Api/Api';
import { expandToBackendURL } from '@plone/volto/helpers/Url/Url';
import '@testing-library/jest-dom';

const { mockApiGet, mockApiPost, mockWidgetStart } = vi.hoisted(() => ({
  mockApiGet: vi.fn(),
  mockApiPost: vi.fn(),
  mockWidgetStart: vi.fn(),
}));

vi.mock('@eeacms/volto-redmine-helpdesk/captcha/widget', () => ({}));

vi.mock('@plone/volto/helpers/Url/Url', () => ({
  expandToBackendURL: vi.fn((url) => url),
}));

vi.mock('@plone/volto/helpers/Api/Api', () => ({
  default: vi.fn().mockImplementation(() => ({
    get: mockApiGet,
    post: mockApiPost,
  })),
}));

vi.mock('./widget', () => ({
  RedmineHelpdeskWidgetFactory: vi.fn(),
}));

describe('HelpdeskView', () => {
  let mockWidget;
  let originalGetElementById;
  let helpdeskContainer;
  let submitHandler;
  let emailField;
  let subjectField;
  let descriptionField;
  let usernameField;
  let closeButton;
  let discreetLabel;
  let customFields;
  let containerSection;
  let form;
  let solutionInput;

  const renderView = (data = {}) => render(<HelpdeskView data={data} />);

  const setupForm = () => {
    emailField = { id: 'email', required: false };
    subjectField = { id: 'subject', required: false };
    descriptionField = { id: 'description', required: false };
    usernameField = { className: '' };
    closeButton = { style: {} };
    discreetLabel = { style: {} };
    solutionInput = { value: 'captcha-token' };

    customFields = {
      children: { tracker_id: { id: 'tracker_id' } },
      insertBefore: vi.fn(),
    };

    containerSection = {
      children: {
        privacy_policy_fields: { id: 'privacy_policy_fields' },
        custom_fields: customFields,
        submit_button: { id: 'submit_button' },
      },
      insertBefore: vi.fn(),
    };

    const formChildren = [
      emailField,
      subjectField,
      descriptionField,
      { id: 'username' },
    ];
    formChildren.container = containerSection;

    form = {
      children: formChildren,
      email: emailField,
      subject: subjectField,
      description: descriptionField,
      username: usernameField,
      insertBefore: vi.fn(),
      getElementsByClassName: vi.fn((className) => {
        if (className === 'close-button') {
          return [closeButton];
        }
        if (className === 'discreet') {
          return [discreetLabel];
        }
        return [];
      }),
      querySelector: vi.fn((selector) => {
        if (selector === '.frc-captcha') {
          return document.querySelector(selector);
        }
        if (selector === '.frc-captcha-solution') {
          return solutionInput;
        }
        return null;
      }),
      setAttribute: vi.fn(),
      addEventListener: vi.fn((eventName, handler) => {
        if (eventName === 'submit') {
          submitHandler = handler;
        }
      }),
    };

    helpdeskContainer = {
      style: {},
      contentWindow: {
        document: {
          body: {
            children: [form],
          },
        },
      },
    };
  };

  const runTimer = async () => {
    await vi.advanceTimersByTimeAsync(1000);
    expect(mockApiGet).toHaveBeenCalledWith('@captchakey');
  };

  beforeEach(() => {
    vi.useFakeTimers();
    cleanup();
    submitHandler = null;
    setupForm();

    mockApiGet.mockReset();
    mockApiGet.mockResolvedValue('friendly-site-key');
    mockApiPost.mockReset();
    mockApiPost.mockResolvedValue(JSON.stringify(true));
    mockWidgetStart.mockReset();
    Api.mockClear();
    Api.mockImplementation(() => ({
      get: mockApiGet,
      post: mockApiPost,
    }));

    mockWidget = {
      load: vi.fn(),
      config: vi.fn(),
      toggle: vi.fn(),
      configuration: { project: 'configured-project' },
    };
    RedmineHelpdeskWidgetFactory.mockReset();
    RedmineHelpdeskWidgetFactory.mockReturnValue(mockWidget);

    global.window.friendlyChallenge = {
      WidgetInstance: vi.fn().mockImplementation(() => ({
        start: mockWidgetStart,
      })),
    };

    originalGetElementById = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'helpdesk_ticket_container') {
        return helpdeskContainer;
      }
      return originalGetElementById(id);
    });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes the widget with default values', () => {
    renderView();

    expect(RedmineHelpdeskWidgetFactory).toHaveBeenCalledWith({
      widget_button: expect.any(HTMLButtonElement),
    });
    expect(mockWidget.load).toHaveBeenCalled();
    expect(mockWidget.toggle).toHaveBeenCalled();
    expect(mockWidget.config).toHaveBeenCalledWith(
      expect.objectContaining({
        attachment: false,
        base_url: 'https://taskman.eionet.europa.eu',
        color: '#004B87',
        identify: { customFieldValues: {} },
        privacyPolicy:
          '<p>I agree with the <a href="/en/about/official-documents/contact-us-privacy-statement">privacy statement</a></p>',
        redmineProjectId: 161,
        redmineProjectLabel: 'Eea enquiries',
        redmineProjectTrackerId: 6,
        redmineProjectTrackerLabel: 'Support',
        translation: expect.objectContaining({
          createButtonLabel: 'Submit question',
          createErrorLabel: 'Something went wrong :(...',
          createSuccessDescription: 'Thank you for your question!',
          createSuccessLabel: 'Your question was successfully created',
          descriptionLabel: 'What question do you have?',
          emailLabel: 'Please put your email here',
          nameLabel: 'Enter your name here (Optional)',
          subjectLabel: 'Subject',
        }),
      }),
    );
  });

  it('uses the provided custom values', () => {
    renderView({
      nameLabel: 'Custom Name',
      emailLabel: 'Custom Email',
      descriptionLabel: 'Custom Description',
      submitLabel: 'Custom Submit',
      successDescriptionLabel: 'Custom Success Description',
      errorLabel: 'Custom Error',
      subjectLabel: 'Custom Subject',
      successLabel: 'Custom Success',
      redmineProjectId: 999,
      redmineProjectLabel: 'Custom Project',
      redmineProjectTrackerId: 77,
      redmineProjectTrackerLabel: 'Custom Tracker',
      redmineUrl: 'https://redmine.example.com',
      privacyPolicy: 'Custom policy',
    });

    expect(mockWidget.config).toHaveBeenCalledWith(
      expect.objectContaining({
        base_url: 'https://redmine.example.com',
        privacyPolicy: 'Custom policy',
        redmineProjectId: 999,
        redmineProjectLabel: 'Custom Project',
        redmineProjectTrackerId: 77,
        redmineProjectTrackerLabel: 'Custom Tracker',
        translation: {
          createButtonLabel: 'Custom Submit',
          createErrorLabel: 'Custom Error',
          createSuccessDescription: 'Custom Success Description',
          createSuccessLabel: 'Custom Success',
          descriptionLabel: 'Custom Description',
          emailLabel: 'Custom Email',
          nameLabel: 'Custom Name',
          subjectLabel: 'Custom Subject',
        },
      }),
    );
  });

  it('runs the delayed setup and submits when captcha verification succeeds', async () => {
    renderView();

    await runTimer();

    const captchaElement = document.querySelector('.frc-captcha');
    expect(captchaElement).toBeInTheDocument();
    expect(closeButton.style.display).toBe('none');
    expect(emailField.required).toBe(true);
    expect(subjectField.required).toBe(true);
    expect(descriptionField.required).toBe(true);
    expect(usernameField.className).toBe('form-control');
    expect(discreetLabel.style.color).toBe('#666');
    expect(discreetLabel.style.fontSize).toBe('85%');
    expect(discreetLabel.style.fontWeight).toBe('normal');
    expect(discreetLabel.style.display).toBe('block');
    expect(form.insertBefore).toHaveBeenCalledTimes(3);
    expect(containerSection.insertBefore).toHaveBeenCalledWith(
      captchaElement,
      containerSection.children.submit_button,
    );
    expect(customFields.insertBefore).toHaveBeenCalledTimes(2);
    expect(expandToBackendURL).toHaveBeenCalledWith('@captchakey');
    expect(Api).toHaveBeenCalledTimes(1);
    expect(window.friendlyChallenge.WidgetInstance).toHaveBeenCalledWith(
      captchaElement,
      { sitekey: 'friendly-site-key' },
    );
    expect(mockWidgetStart).toHaveBeenCalled();
    expect(helpdeskContainer.style.minHeight).toBe('720px');
    expect(helpdeskContainer.style.width).toBe('100%');
    expect(submitHandler).toEqual(expect.any(Function));

    const event = {
      preventDefault: vi.fn(),
      target: { setAttribute: vi.fn() },
    };

    await expect(submitHandler(event)).resolves.toBe(true);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(expandToBackendURL).toHaveBeenCalledWith('@captchaverify');
    expect(mockApiPost).toHaveBeenCalledWith('@captchaverify', {
      data: JSON.stringify({ solution: 'captcha-token' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(helpdeskContainer.contentWindow.RedmineHelpdeskIframe).toEqual({
      action: 'configuration',
      configuration: mockWidget.configuration,
    });
    expect(event.target.setAttribute).toHaveBeenCalledWith(
      'onSubmit',
      'submitTicketForm(); return false;',
    );
  });

  it('returns false when captcha verification fails', async () => {
    mockApiPost.mockResolvedValue(JSON.stringify(false));

    renderView();

    await runTimer();

    const event = {
      preventDefault: vi.fn(),
      target: { setAttribute: vi.fn() },
    };

    await expect(submitHandler(event)).resolves.toBe(false);
    expect(event.target.setAttribute).not.toHaveBeenCalled();
  });

  it('clears the delayed setup timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const view = renderView();

    view.unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
