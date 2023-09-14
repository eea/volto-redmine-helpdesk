import { RedmineHelpdeskWidgetFactory } from './widget';
import load_formExt from './helpdesk_widget/load_form.pro';

jest.mock('./helpdesk_widget/load_form.pro', () => {
  return {};
});
describe('RedmineHelpdeskWidgetFactory', () => {
  let api;
  let widgetButton;
  let mockAppendChild;
  let mockXHR = {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    response: {
      projects: {
        someLabel: '1',
      },
      projects_data: {
        1: {},
      },
    },
    status: 200,
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="helpdesk_widget"></div>';
    widgetButton = document.createElement('button');
    widgetButton.id = 'widget_button';
    document.getElementById('helpdesk_widget').appendChild(widgetButton);

    api = RedmineHelpdeskWidgetFactory({
      widget_button: widgetButton,
    });
    mockAppendChild = jest
      .spyOn(document.head, 'appendChild')
      .mockImplementation(() => {});
    window.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    expect(api.widget).not.toBeNull();
    expect(api.widget_button).toBe(widgetButton);
  });

  it('should create widget button', () => {
    api.create_widget_button();
    const button = document.getElementById('widget_button');
    expect(button).not.toBeNull();
    expect(button.style.backgroundColor).toBe('rgb(126, 131, 135)');
  });

  it('should create loading div', () => {
    api.create_loading_div();
    const loadingDiv = document.getElementById('loading_div');
    expect(loadingDiv).not.toBeNull();
    expect(loadingDiv.style.display).toBe('none');

    api.config({
      color: '#123456',
      icon: '<i class="icon"></i>',
      position: 'topLeft',
    });

    expect(api.widget_button.style.backgroundColor).toBe('rgb(18, 52, 86)');
    expect(api.widget_button.innerHTML).toBe('<i class="icon"></i>');
    expect(api.widget.style.top).toBe('20px');
    expect(api.widget.style.left).toBe('20px');

    api.config({
      color: '#123456',
      icon: '<i class="icon"></i>',
      position: 'topRight',
    });

    expect(api.widget.style.top).toBe('20px');
    expect(api.widget.style.right).toBe('20px');

    api.config({
      color: '#123456',
      icon: '<i class="icon"></i>',
      position: 'bottomLeft',
    });

    expect(api.widget.style.bottom).toBe('20px');
    expect(api.widget.style.left).toBe('20px');

    api.config({
      color: '#123456',
      icon: '<i class="icon"></i>',
      position: 'bottomRight',
    });

    expect(api.widget.style.bottom).toBe('20px');
    expect(api.widget.style.right).toBe('20px');

    api.config({
      color: '#123456',
      icon: '<i class="icon"></i>',
      position: 'somethingElse',
    });

    expect(api.widget.style.bottom).toBe('20px');
    expect(api.widget.style.right).toBe('20px');
  });

  it('should decorate widget button', () => {
    api.decorate_widget_button();
    expect(api.widget.style.position).toBe('fixed');
    expect(api.widget.style.bottom).toBe('20px');
    expect(api.widget.style.right).toBe('20px');
  });

  it('should create iframe', () => {
    api.create_iframe();
    const iframe = api.iframe;
    iframe.onload();
    expect(iframe).not.toBeNull();
    expect(iframe.style.opacity).toBe('0');
  });

  it('should decorate iframe', () => {
    api.create_iframe();
    api.decorate_iframe();
    const iframe = api.iframe;
    expect(iframe.style.position).toBe('absolute');
    expect(iframe.style.opacity).toBe('0');
  });

  it('should create a form element', () => {
    api.create_form();
    expect(api.form).not.toBeNull();
    expect(api.form.tagName).toBe('FORM');
  });

  it('should fill form', () => {
    api.schema = {
      projects: {
        'Test Project': 1,
      },
      projects_data: {
        1: {
          trackers: { Bug: 1 },
        },
      },
    };
    api.configuration = {
      redmineProjectId: 1,
      redmineProjectTrackerId: 1,
      privacyPolicy: 'https://example.com/privacy-policy',
    };
    api.fill_form();
    const form = api.form;
    expect(form).not.toBeNull();
    expect(form.method).toBe('post');
  });

  it('should apply avatar correctly', () => {
    api.configuration = { user_avatar: 'some_avatar' };
    api.apply_avatar();
  });

  it('should return the correct translation when provided', () => {
    api.config({
      translation: {
        greeting: 'Hello',
        farewell: 'Goodbye',
      },
    });

    const greetingTranslation = api.translation('greeting');
    const farewellTranslation = api.translation('farewell');

    expect(greetingTranslation).toBe('Hello');
    expect(farewellTranslation).toBe('Goodbye');
  });

  it('should return null when no translation is provided', () => {
    api.config({
      translation: {},
    });

    const missingTranslation = api.translation('missingField');
    expect(missingTranslation).toBeNull();
  });

  it('should return null when translation configuration is not set', () => {
    api.config({});

    const missingTranslation = api.translation('missingField');
    expect(missingTranslation).toBeNull();
  });

  it('should return the correct identification when provided', () => {
    api.config({
      identify: {
        userId: '123',
        userName: 'John',
      },
    });

    const userId = api.identify('userId');
    const userName = api.identify('userName');

    expect(userId).toBe('123');
    expect(userName).toBe('John');
  });

  it('should return null when no identification is provided', () => {
    api.config({
      identify: {},
    });

    const missingId = api.identify('missingField');
    expect(missingId).toBeNull();
  });

  it('should return null when identification configuration is not set', () => {
    api.config({});

    const missingId = api.identify('missingField');
    expect(missingId).toBeNull();
  });

  it('should load schema successfully', () => {
    api.loading_div = { style: { display: 'none' } };
    api.create_iframe();
    api.schema = {
      projects: {},
    };
    api.configuration = {
      redmineProjectLabel: 'someLabel',
      redmineProjectId: '1',
      redmineProjectTrackerLabel: 'someTrackerLabel',
      redmineProjectTrackerId: '10',
      privacyPolicy: 'https://example.com/privacy-policy',
    };
    api.load_schema();
    expect(mockXHR.open).toHaveBeenCalledWith('GET', load_formExt, true); // Replace load_formExt with the actual value
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onreadystatechange();
    expect(api.schema).toEqual({
      projects: {
        someLabel: 1,
      },
      projects_data: {
        1: {
          trackers: {
            someTrackerLabel: 10,
          },
        },
      },
    });
    expect(api.loaded).toBe(true);
  });

  it('should handle load schema failure', () => {
    api.loading_div = { style: { display: 'none' } };
    api.load_schema();
    mockXHR.status = 404;

    mockXHR.onreadystatechange();
    expect(api.schema).toEqual({});
    expect(api.loaded).toBe(false);
  });

  it('should hide loading div and show widget button after loading schema', () => {
    api.loading_div = { style: { display: 'none' } };
    api.widget_button = { style: { display: 'none' } };

    api.load_schema();
    mockXHR.onreadystatechange();

    expect(api.loading_div.style.display).toBe('none');
    expect(api.widget_button.style.display).toBe('block');
  });

  it('should append element to iframe when iframe is defined', () => {
    const mockIframe = {
      contentWindow: {
        document: {
          body: {
            appendChild: jest.fn(),
          },
        },
      },
    };
    api.iframe = mockIframe;

    // Create a mock element to append
    const mockElement = {};

    // Call the function
    api.appendToIframe(mockElement);

    // Verify that the element was appended to the iframe's body
    expect(
      mockIframe.contentWindow.document.body.appendChild,
    ).toHaveBeenCalledWith(mockElement);
  });

  it('should do nothing when iframe is null', () => {
    // Set iframe to null
    api.iframe = null;

    // Create a mock element to append
    const mockElement = {};

    // Call the function
    api.appendToIframe(mockElement);

    // Verify that nothing happened (no error should be thrown)
    expect(true).toBe(true);
  });

  it('should do nothing when iframe is undefined', () => {
    // Set iframe to undefined
    api.iframe = undefined;

    // Create a mock element to append
    const mockElement = {};

    // Call the function
    api.appendToIframe(mockElement);

    // Verify that nothing happened (no error should be thrown)
    expect(true).toBe(true);
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: { redmineUserID: 2 },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: { nameValue: 'user1' },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: { emailValue: 'user1@gmail.com' },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: { subjectValue: 'subject1' },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: { issueCategory: 'category1' },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should create form elements when projects are available', () => {
    api.schema = {
      projects: { project1: 1 },
      projects_data: {
        1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: {
        projectValue: 'project1',
      },
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.fill_form();
  });

  it('should not create form elements when no projects are available', () => {
    api.schema = { projects: {} };

    api.fill_form();
  });

  it('should call appendToIframe after a timeout', () => {
    jest.useFakeTimers();
    api.schema = {
      projects: {
        project1: 'project1',
      },
      projects_data: {
        project1: {
          trackers: { tracker1: 1 },
        },
      },
    };
    api.configuration = {
      identify: {
        projectValue: 'project1',
        trackerValue: 'tracker1',
      },
      privacyPolicy: 'https://example.com/privacy-policy',
    };
    api.form = {};

    api.fill_form();

    jest.advanceTimersByTime(1);
  });

  it('should apply avatar when avatar exists and request is successful', () => {
    api.configuration = { base_url: 'http://example.com' };
    api.configuration['user_avatar'] = 'avatar123';
    api.apply_avatar();
    mockXHR.status = 200;

    expect(mockXHR.open).toHaveBeenCalledWith(
      'GET',
      'http://example.com/helpdesk_widget/avatar/avatar123',
      true,
    );

    mockXHR.onreadystatechange();

    const button = document.getElementById('widget_button');
    expect(button.style.backgroundSize).toBe('cover');
    expect(button.style.backgroundImage).toBe(
      'url(http://example.com/helpdesk_widget/avatar/avatar123)',
    );
    expect(button.innerHTML).toBe('&nbsp;');
  });

  it('should not apply avatar when request is unsuccessful', () => {
    api.configuration['user_avatar'] = 'avatar123';
    mockXHR.status = 404;
    api.apply_avatar();

    mockXHR.onreadystatechange();

    const button = document.getElementById('widget_button');
    expect(button.style.backgroundSize).toBe('15px 15px');
    expect(button.innerHTML).toBe('?');
  });

  it('should not apply avatar when avatar does not exist', () => {
    api.apply_avatar();
    const button = document.getElementById('widget_button');
    expect(button.style.lineHeight).toBe('54px');
    expect(button.style.backgroundSize).toBe('15px 15px');
    expect(button.innerHTML).toBe('?');
  });

  it('should not apply avatar when avatar does not exist', () => {
    mockXHR.readyState = 3;
    api.apply_avatar();
    mockXHR.onreadystatechange();

    const button = document.getElementById('widget_button');
    expect(button.style.lineHeight).toBe('54px');
    expect(button.style.backgroundSize).toBe('15px 15px');
    expect(button.innerHTML).toBe('?');
  });

  it('should append stylesheets to iframe head', () => {
    api.configuration = {
      base_url: 'http://example.com',
    };

    api.append_stylesheets();

    expect(mockAppendChild).not.toHaveBeenCalled();
  });

  it('should apply animation by appending a link element to head', () => {
    api.configuration = { base_url: 'http://example.com' };
    api.apply_animation();

    expect(mockAppendChild).toHaveBeenCalled();

    const appendedElement = mockAppendChild.mock.calls[0][0];

    expect(appendedElement.tagName).toBe('LINK');
    expect(appendedElement.href).toBe(
      'http://example.com/helpdesk_widget/animation.css',
    );
    expect(appendedElement.rel).toBe('stylesheet');
    expect(appendedElement.type).toBe('text/css');
  });

  it('should append stylesheets to iframe head', () => {
    api.configuration = {
      base_url: 'http://example.com',
      styles: 'some styles',
    };
    api.iframe = {
      contentWindow: {
        document: {
          head: {
            appendChild: mockAppendChild,
          },
        },
      },
    };
    api.append_stylesheets();

    const appendedLinkElement = mockAppendChild.mock.calls[0][0];
    expect(appendedLinkElement.tagName).toBe('LINK');
    expect(appendedLinkElement.href).toBe(
      'http://example.com/helpdesk_widget/widget.css',
    );
    expect(appendedLinkElement.rel).toBe('stylesheet');
    expect(appendedLinkElement.type).toBe('text/css');

    const appendedStyleElement = mockAppendChild.mock.calls[1][0];
    expect(appendedStyleElement.tagName).toBe('STYLE');
    expect(appendedStyleElement.innerHTML).toBe('some styles');
    expect(appendedStyleElement.type).toBe('text/css');
  });

  it('should append scripts to iframe head', () => {
    api.configuration = { base_url: 'http://example.com' };
    api.iframe = {
      contentWindow: {
        document: {
          head: {
            appendChild: mockAppendChild,
          },
        },
      },
    };
    api.append_scripts();

    expect(setTimeout).toHaveBeenCalledTimes(1);

    jest.runAllTimers();

    expect(mockAppendChild).toHaveBeenCalledTimes(2);

    const appendedScriptElement = mockAppendChild.mock.calls[0][0];
    expect(appendedScriptElement.tagName).toBe('SCRIPT');
    expect(appendedScriptElement.src).toBe(
      'http://example.com/helpdesk_widget/iframe.js',
    );
    expect(appendedScriptElement.type).toBe('text/javascript');

    const appendedConfigScriptElement = mockAppendChild.mock.calls[1][0];
    expect(appendedConfigScriptElement.tagName).toBe('SCRIPT');
    expect(appendedConfigScriptElement.innerHTML).toBe(
      'var RedmineHelpdeskIframe = {configuration: ' +
        JSON.stringify(api.configuration) +
        '}',
    );
  });

  it('should create and append title div if title is provided', () => {
    api.configuration = { title: 'Test Title' };
    api.form = {
      appendChild: mockAppendChild,
    };

    api.create_form_title();

    expect(mockAppendChild).toHaveBeenCalledTimes(1);

    const appendedTitleDiv = mockAppendChild.mock.calls[0][0];
    expect(appendedTitleDiv.tagName).toBe('DIV');
    expect(appendedTitleDiv.id).toBe('title');
    expect(appendedTitleDiv.className).toBe('title');
    expect(appendedTitleDiv.innerHTML).toBe('Test Title');
  });

  it('should not append title div if no title is provided', () => {
    api.configuration = {};

    api.create_form_title();

    expect(mockAppendChild).not.toHaveBeenCalled();
  });

  it('should create and append container div and its children', () => {
    api.form = {
      appendChild: mockAppendChild,
      getElementsByClassName: jest.fn(() => [{ remove: jest.fn() }]),
    };
    api.schema = {
      projects_data: {
        1: {
          trackers: { 'Test Tracker': 2 },
        },
      },
    };
    api.configuration = {
      identify: true,
      redmineProjectTrackerLabel: 'Test Tracker',
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.create_form_hidden = jest.fn();
    api.create_form_select = jest.fn();
    api.load_custom_fields = jest.fn();
    api.create_form_submit = jest.fn();
    api.create_attch_link = jest.fn();
    api.create_form_privacy_policy = jest.fn();

    api.load_project_data(1, 2);

    expect(mockAppendChild).toHaveBeenCalledTimes(1);

    expect(api.create_form_hidden).toHaveBeenCalled();
    expect(api.create_form_privacy_policy).toHaveBeenCalled();
    expect(api.load_custom_fields).toHaveBeenCalled();
    expect(api.create_form_submit).toHaveBeenCalled();
    expect(api.create_attch_link).toHaveBeenCalled();
  });

  it('should not create hidden tracker_id if tracker is not in schema', () => {
    api.form = {
      appendChild: mockAppendChild,
      getElementsByClassName: jest.fn(() => [{ remove: jest.fn() }]),
    };
    api.schema = {
      projects_data: {
        1: {
          trackers: { 'Test Tracker': 2 },
        },
      },
    };
    api.configuration = {
      identify: true,
      redmineProjectTrackerLabel: 'Nonexistent Tracker',
      privacyPolicy: 'https://example.com/privacy-policy',
    };

    api.create_form_hidden = jest.fn();
    api.load_custom_fields = jest.fn();
    api.create_form_submit = jest.fn();
    api.create_attch_link = jest.fn();
    api.create_form_privacy_policy = jest.fn();

    api.load_project_data(1, 2);

    expect(api.create_form_hidden).not.toHaveBeenCalledWith(
      expect.anything(),
      'tracker_id',
      'tracker_id',
      'form-control trackers',
      expect.anything(),
    );
  });

  it.only('should call load_project_data with correct project_id and tracker_id', () => {
    api.form = {
      getElementsByClassName: jest.fn(),
      appendChild: jest.fn(),
    };
    const mockContainerDiv = {
      getElementsByClassName: jest.fn(),
    };

    mockContainerDiv.getElementsByClassName.mockReturnValue([
      { value: 'mockTrackerId' },
    ]);
    api.form.getElementsByClassName.mockReturnValueOnce([mockContainerDiv]);

    api.form.getElementsByClassName.mockReturnValueOnce([
      { value: 'mockProjectId' },
    ]);

    api.configuration = {
      redmineProjectId: null,
    };

    api.reload_project_data();

    expect(api.load_project_data).toHaveBeenCalledWith(
      'mockProjectId',
      'mockTrackerId',
    );
    expect(api.arrange_iframe).toHaveBeenCalled();
  });

  it('should use redmineProjectId from configuration if available', () => {
    api.configuration = {
      redmineProjectId: 'configProjectId',
    };
    api.form = {
      getElementsByClassName: jest.fn(),
      appendChild: jest.fn(),
    };

    api.reload_project_data();

    expect(api.load_project_data).toHaveBeenCalledWith(
      'configProjectId',
      'configProjectId',
    );
  });
});
