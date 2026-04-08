import React from 'react';

jest.mock('./HelpdeskEdit', () => () => <div>Edit</div>);
jest.mock('./HelpdeskView', () => () => <div>View</div>);

const { HelpdeskEdit, HelpdeskView } = require('./index');
const HelpdeskEditComponent = require('./HelpdeskEdit');
const HelpdeskViewComponent = require('./HelpdeskView');

describe('Helpdesk exports', () => {
  it('re-exports the edit and view components', () => {
    expect(HelpdeskEdit).toBe(HelpdeskEditComponent);
    expect(HelpdeskView).toBe(HelpdeskViewComponent);
  });
});
