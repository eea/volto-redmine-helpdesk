const HelpdeskSchema = ({ data }) => {
  const { variation = 'default' } = data;

  return {
    title: 'Helpdesk',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'nameLabel', 'emailLabel', 'subjectLabel', 'descriptionLabel',
					'submitLabel', 'errorLabel', 'successLabel', 'successDescriptionLabel'
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
	  	}
    },
    required: [],
  };
};

export default HelpdeskSchema;
