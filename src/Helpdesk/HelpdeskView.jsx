import React from 'react';
import { RedmineHelpdeskWidgetFactory } from './widget';
import '../captcha/widget';

const HelpdeskView = (props) => {
  React.useEffect(() => {
    const widget_button = document.getElementById('widget_button');
    const redmineWidget = RedmineHelpdeskWidgetFactory({ widget_button });

    redmineWidget.load();

    redmineWidget.config({
      color: '#004B87',
      translation: {
        nameLabel: 'Enter your name here (Optional)',
        emailLabel: 'Please put your email here',
        descriptionLabel: 'What question do you have?',
        createButtonLabel: 'Submit question',
        createSuccessDescription: 'Thank you for your question!',
        createErrorLabel: 'Something went wrong :(...',
        subjectLabel: 'Subject',
        createSuccessLabel: 'Your question was successfully created',
      },
      identify: {
        customFieldValues: {},
      },
      attachment: false,
    });

    // if (widget_button !== null) {
    //   widget_button.click();
    //   widget_button.style.display = "none";
    // }
    redmineWidget.toggle();

    const captcha = document.querySelector('.frc-captcha');
    const options = {
      sitekey: 'FCMR3DVP81RFD3ML',
    };
    const WidgetInstance = window.friendlyChallenge.WidgetInstance;
    const captcha_widget = new WidgetInstance(captcha, options);
    captcha_widget.start();

    // add code from button click
    setTimeout(() => {
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
      let message = document.createElement('span');
      form.insertBefore(message, form.getElementsByClassName('flash')[0]);

      message.outerHTML =
        "<span class='discreet note'><strong>Note</strong>: " +
        'Our online form is currently displayed in English since the EEA working ' +
        'language is English and that most of our information and content is in ' +
        'English. You may nevertheless address us in one of the 24 EU official ' +
        'languages but kindly note that the time to process your enquiry might ' +
        'be slightly longer. Our expected response time is 15 working days.</span>';

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

      form.children.container.insertBefore(
        document.querySelector('.frc-captcha'),
        form.children.container.children.submit_button,
      );
    }, 1000);
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
