import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click().type('/helpdesk{enter}');
    cy.get('#toolbar-save').click();

    cy.get('.toolbar-actions .edit').click();

    cy.get(
      '.block-editor-helpdesk .block.helpdesk[role="presentation"]',
    ).click();

    cy.get('#field-nameLabel').type('Custom name label');
    cy.get('#field-emailLabel').type('Custom email label');
    cy.get('#field-subjectLabel').type('Custom subject label');
    cy.get('#field-descriptionLabel').type('Custom description label');
    cy.get('#field-submitLabel').type('Custom submit label');
    cy.get('#field-errorLabel').type('Custom error label');
    cy.get('#field-successLabel').type('Custom success label');
    cy.get('#field-successDescriptionLabel').type(
      'Custom success description label',
    );
    cy.get('#field-redmineProjectLabel').type('Redmine project label');
    cy.get('#field-redmineProjectId').type('123');
    cy.get('#field-redmineProjectTrackerLabel').type(
      'Redmine project tracker label',
    );
    cy.get('#field-redmineProjectTrackerId').type('231');
    cy.get('.field-wrapper-privacyPolicy .slate-editor div[role="textbox"]')
      .click()
      .type('test');
    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');
    cy.contains('My Add-on Page');
    cy.wait(2000);
    cy.get('#helpdesk_ticket_container', { timeout: 10000 })
      .should('exist')
      .its('0.contentWindow.document.body')
      .should('not.be.empty');

    cy.get('#helpdesk_widget iframe#helpdesk_ticket_container').should('exist');
  });
});
