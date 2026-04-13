import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Helpdesk Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Helpdesk Block: Add and save', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Helpdesk Test');
    cy.get('.documentFirstHeading').contains('Helpdesk Test');

    cy.getSlate().click();

    // Add helpdesk block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.helpdesk')
      .click({ force: true });

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Helpdesk Test');
  });
});