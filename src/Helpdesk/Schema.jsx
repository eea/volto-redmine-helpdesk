const HelpdeskSchema = ({ data }) => {
  //const { variation = 'default' } = data;

  return {
    title: 'Helpdesk',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'nameLabel',
          'emailLabel',
          'subjectLabel',
          'descriptionLabel',
          'submitLabel',
          'errorLabel',
          'successLabel',
          'successDescriptionLabel',
          'redmineProjectLabel',
          'redmineProjectId',
          'redmineProjectTrackerLabel',
          'redmineProjectTrackerId',
        ],
      },
    ],
    properties: {
      nameLabel: {
        title: 'Enter your name label',
      },
      emailLabel: {
        title: 'Email label',
      },
      descriptionLabel: {
        title: 'Description label',
      },
      submitLabel: {
        title: 'Submit label',
      },
      successDescriptionLabel: {
        title: 'Success description label',
      },
      errorLabel: {
        title: 'Error label',
      },
      subjectLabel: {
        title: 'Subject label',
      },
      successLabel: {
        title: 'Success label',
      },
      redmineProjectLabel: {
        title: 'Redmine Project Name',
      },
      redmineProjectId: {
        title: 'Redmine Project Id',
        type: 'number',
      },
      redmineProjectTrackerLabel: {
        title: 'Redmine Tracker Name',
      },
      redmineProjectTrackerId: {
        title: 'Redmine Tracker Id',
        type: 'number',
      },
    },
    required: [],
  };
};

export default HelpdeskSchema;
