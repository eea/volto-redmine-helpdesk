import React from 'react';
import { render, act, waitFor, cleanup } from '@testing-library/react';
import HelpdeskView from './HelpdeskView';
import { RedmineHelpdeskWidgetFactory } from './widget';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/helpers', () => {
  return {
    expandToBackendURL: jest.fn((url) => url),
    Api: {
      get: jest.fn(() => Promise.resolve('someKey')),
      post: jest.fn(() => Promise.resolve(JSON.stringify(true))),
    },
  };
});

global.window.friendlyChallenge = {
  WidgetInstance: jest.fn().mockImplementation(() => {
    return {
      start: jest.fn(),
    };
  }),
};

jest.mock('./widget', () => ({
  RedmineHelpdeskWidgetFactory: jest.fn(),
}));

describe('HelpdeskView', () => {
  let mockWidget;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockWidget = { load: jest.fn(), config: jest.fn(), toggle: jest.fn() };
    RedmineHelpdeskWidgetFactory.mockReturnValue(mockWidget);
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(container);
    container = null;
  });

  it('should execute timer-based logic', () => {
    const mockHelpdeskContainer = {
      style: {},
      contentWindow: {
        document: {
          body: {
            children: [
              {
                getElementsByClassName: jest.fn(() => [{ style: {} }]),
                children: [],
                insertBefore: jest.fn(),
              },
            ],
          },
        },
      },
    };

    const mockWidgetButton = {
      style: {},
    };

    global.document.getElementById = jest.fn((id) => {
      switch (id) {
        case 'helpdesk_ticket_container':
          return mockHelpdeskContainer;
        case 'widget_button':
          return mockWidgetButton;
        default:
          return null;
      }
    });

    render(<HelpdeskView data={{}} />);

    jest.runAllTimers();
  });

  it('should initialize RedmineHelpdeskWidgetFactory', () => {
    render(<HelpdeskView data={{}} />);

    expect(RedmineHelpdeskWidgetFactory).toHaveBeenCalled();
    expect(mockWidget.load).toHaveBeenCalled();
    expect(mockWidget.config).toHaveBeenCalled();
    expect(mockWidget.toggle).toHaveBeenCalled();
  });

  it('should pass correct default values to RedmineHelpdeskWidgetFactory', () => {
    render(<HelpdeskView data={{}} />);

    const expectedConfig = expect.objectContaining({
      color: '#004B87',
      translation: expect.objectContaining({
        nameLabel: 'Enter your name here (Optional)',
      }),
      redmineProjectId: 161,
    });

    expect(mockWidget.config).toHaveBeenCalledWith(expectedConfig);
  });

  it('should pass custom values to RedmineHelpdeskWidgetFactory', () => {
    const customData = {
      nameLabel: 'Custom Name Label',
      emailLabel: 'Custom Email Label',
      descriptionLabel: 'Custom Description Label',
      submitLabel: 'Custom Create Button Label',
      successDescriptionLabel: 'Custom Create Success Description',
      errorLabel: 'Custom Create Error Label',
      subjectLabel: 'Custom Subject Label',
      successLabel: 'Custom Create Success Label',
      redmineProjectLabel: 'Custom Redmine Project Label',
      redmineProjectTrackerLabel: 'Custom Redmine Project Tracker Label',
      redmineUrl: 'Custom Redmine Url',
      privacyPolicy: 'Custom Privacy Policy',
      redmineProjectTrackerId: 999,
      redmineProjectId: 161,
    };

    render(<HelpdeskView data={customData} />);

    const expectedConfig = expect.objectContaining({
      attachment: false,
      base_url: 'Custom Redmine Url',
      color: '#004B87',
      identify: { customFieldValues: {} },
      privacyPolicy: 'Custom Privacy Policy',
      redmineProjectId: 161,
      redmineProjectLabel: 'Custom Redmine Project Label',
      redmineProjectTrackerId: 999,
      redmineProjectTrackerLabel: 'Custom Redmine Project Tracker Label',
      translation: {
        createButtonLabel: 'Custom Create Button Label',
        createErrorLabel: 'Custom Create Error Label',
        createSuccessDescription: 'Custom Create Success Description',
        createSuccessLabel: 'Custom Create Success Label',
        descriptionLabel: 'Custom Description Label',
        emailLabel: 'Custom Email Label',
        nameLabel: 'Custom Name Label',
        subjectLabel: 'Custom Subject Label',
      },
    });

    expect(mockWidget.config).toHaveBeenCalledWith(expectedConfig);
  });

  it('should execute timer-based logic', async () => {
    const { container } = render(<HelpdeskView data={{}} />);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(container.querySelector('#helpdesk_widget')).not.toBeNull();
      expect(container.querySelector('#widget_button')).not.toBeNull();
    });
  });
});
