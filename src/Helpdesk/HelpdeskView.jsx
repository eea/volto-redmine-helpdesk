/* eslint-disable */
import React from 'react';
import { RedmineHelpdeskWidgetFactory } from './widget';
import '../captcha/widget';
import { expandToBackendURL, Api } from '@plone/volto/helpers';

const HelpdeskView = (props) => {
  React.useEffect(() => {
    const widget_button = document.getElementById('widget_button');
    const redmineWidget = RedmineHelpdeskWidgetFactory({ widget_button });

    redmineWidget.load();
    redmineWidget.config({
      color: '#004B87',
      translation: {
        nameLabel: props.data.nameLabel
          ? props.data.nameLabel
          : 'Enter your name here (Optional)',
        emailLabel: props.data.emailLabel
          ? props.data.emailLabel
          : 'Please put your email here',
        descriptionLabel: props.data.descriptionLabel
          ? props.data.descriptionLabel
          : 'What question do you have?',
        createButtonLabel: props.data.submitLabel
          ? props.data.submitLabel
          : 'Submit question',
        createSuccessDescription: props.data.successDescriptionLabel
          ? props.data.successDescriptionLabel
          : 'Thank you for your question!',
        createErrorLabel: props.data.errorLabel
          ? props.data.errorLabel
          : 'Something went wrong :(...',
        subjectLabel: props.data.subjectLabel
          ? props.data.subjectLabel
          : 'Subject',
        createSuccessLabel: props.data.successLabel
          ? props.data.successLabel
          : 'Your question was successfully created',
      },
      identify: {
        customFieldValues: {},
      },
      attachment: false,
      redmineProjectId: props.data.redmineProjectId
        ? props.data.redmineProjectId
        : 161,
      redmineProjectLabel: props.data.redmineProjectLabel
        ? props.data.redmineProjectLabel
        : 'Eea enquiries',
      redmineProjectTrackerLabel: props.data.redmineProjectTrackerLabel
        ? props.data.redmineProjectTrackerLabel
        : 'Support',
      redmineProjectTrackerId: props.data.redmineProjectTrackerId
        ? props.data.redmineProjectTrackerId
        : 6,
      base_url: props.data.redmineUrl
        ? props.data.redmineUrl
        : 'https://taskman.eionet.europa.eu',
      privacyPolicy: props.data.privacyPolicy
        ? props.data.privacyPolicy
        : '<p>I agree with the <a href="/en/about/official-documents/contact-us-privacy-statement">privacy statement</a></p>',
    });

    redmineWidget.toggle();

    // add code from button click
    const timer = setTimeout(async () => {
      const helpdesk_container = document.getElementById(
        'helpdesk_ticket_container',
      );
      const form = helpdesk_container.contentWindow.document.body.children[0];

      widget_button.style.display = 'none';
      helpdesk_container.style.minHeight = '900px';
      form.getElementsByClassName('close-button')[0].style.display = 'none';

      // add asterisk + required on fields
      let asterisk_span = document.createElement('span');
      asterisk_span.innerHTML = '<span class="asterisk"></span>';

      for (let item of form.children) {
        if (['email', 'username', 'description'].indexOf(item.id) !== -1) {
          let clone = asterisk_span.cloneNode();

          item.required = true;
          item.parentNode.insertBefore(clone, item.nextSibling);
          clone.outerHTML = '<span class="asterisk"></span>';
        }
      }

      // custom note/messages
      let policy = document.createElement('span');
      form.children.container.insertBefore(
        policy,
        form.children.container.children.privacy_policy_fields,
      );
      policy.outerHTML =
        "<p><span class='discreet'>* mandatory fields</span></p>";

      let discreets = form.getElementsByClassName('discreet');
      for (let item in discreets) {
        if (item === 'length') {
          break;
        }
        discreets[item].style.color = '#666';
        discreets[item].style.fontSize = '85%';
        discreets[item].style.fontWeight = 'normal';
        discreets[item].style.display = 'block';
      }

      // custom fields
      let enquiry_field = document.createElement('p');
      enquiry_field.innerHTML =
        '<p class="custom_field" data-error-key="Type of Enquiry" data-require="false">' +
        '<label for="issue_custom_field_values_83">' +
        '<span>Select what best describes your field of work</span></label>' +
        '<select name="issue[custom_field_values][83]" id="issue_custom_field_values_83" class="user_cf">' +
        '</select></p>';
      let enquiry_values = [
        '',
        'Research and scientific representatives',
        'Students',
        'Citizens',
        'Media representatives, publishing houses and portals',
        'Industry and private sector representatives',
        'Civil society representatives (NGOs and interest groups)',
        'Governmental representatives National politicians, diplomats',
        'Representatives of EU bodies and agencies',
        'Representatives of inter-governmental organisations',
      ];

      for (let value of enquiry_values) {
        let option = document.createElement('option');
        option.text = value;
        option.value = value;
        enquiry_field.getElementsByClassName('user_cf')[0].add(option);
      }

      form.children.container.children.custom_fields.insertBefore(
        enquiry_field,
        form.children.container.children.custom_fields.children.tracker_id,
      );
      enquiry_field.outerHTML = enquiry_field.innerHTML;

      let topics_field = document.createElement('p');
      topics_field.innerHTML =
        '<p class="custom_field" data-error-key="Enquiry Topics" data-require="false">' +
        '<label for="issue_custom_field_values_82">' +
        '<span>Select what best describes the topic of your question</span></label>' +
        '<select name="issue[custom_field_values][82]" id="issue_custom_field_values_82" class="user_cf">' +
        '</select></p>';
      let topics_values = [
        '',
        'Agriculture',
        'Air',
        'Biodiversity and ecosystems',
        'Chemicals',
        'Climate change adaptation',
        'Climate change mitigation',
        'Energy',
        'Forests',
        'Environment and health',
        'Industry',
        'Land use and soil',
        'Water and marine environment',
        'Noise',
        'Sustainable production and consumption',
        'Transport',
        'Urban environment',
        'Resource efficiency and waste',
        'EMAS',
        'Copernicus',
      ];

      for (let value of topics_values) {
        let option = document.createElement('option');
        option.text = value;
        option.value = value;
        topics_field.getElementsByClassName('user_cf')[0].add(option);
      }

      form.children.container.children.custom_fields.insertBefore(
        topics_field,
        form.children.container.children.custom_fields.children.tracker_id,
      );
      topics_field.outerHTML = topics_field.innerHTML;
      if (document.querySelector('.frc-captcha')) {
        form.children.container.insertBefore(
          document.querySelector('.frc-captcha'),
          form.children.container.children.submit_button,
        );
      }
      const captcha = form.querySelector('.frc-captcha');

      let options = async function () {
        var url = expandToBackendURL('@captchakey');
        const api = new Api();
        let key = await api.get(url);
        return { sitekey: key };
      };

      let result = await options();
      const WidgetInstance = window.friendlyChallenge.WidgetInstance;
      const captcha_widget = new WidgetInstance(captcha, result);
      captcha_widget.start();

      document.getElementById('widget_button').click();
      document.getElementById('widget_button').style.cssText = '';
      document.getElementById('widget_button').style.display = 'none';

      document.getElementById('helpdesk_widget').style.cssText = '';
      document.getElementById('helpdesk_ticket_container').style.position = '';
      document.getElementById('helpdesk_ticket_container').style.minHeight =
        '720px';
      // document.getElementById('helpdesk_ticket_container').style.minWidth =
      //   '500px';
      document.getElementById('helpdesk_ticket_container').style.width = '100%';

      let verifyCaptcha = async function () {
        var url = expandToBackendURL('@captchaverify');
        const api = new Api();
        const helpdesk_container = document.getElementById(
          'helpdesk_ticket_container',
        );
        const form = helpdesk_container.contentWindow.document.body.children[0];
        const solution =
          form.querySelector('.frc-captcha-solution').value || '.NOTFOUND';

        const post_options = {
          data: JSON.stringify({ solution: solution }),
          headers: { 'Content-Type': 'application/json' },
        };
        const result = JSON.parse(await api.post(url, post_options));
        return result;
      };

      async function verify(event) {
        event.preventDefault();
        let result = await verifyCaptcha();
        if (result) {
          return true;
        } else {
          return false;
        }
      }

      form.addEventListener('submit', verify);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="frc-captcha"></div>
      <div id="helpdesk_widget"></div>
      <button id="widget_button"></button>
    </>
  );
};

export default HelpdeskView;
