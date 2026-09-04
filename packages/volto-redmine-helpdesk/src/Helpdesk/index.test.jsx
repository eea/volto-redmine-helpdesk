import React from 'react';

vi.mock('./HelpdeskEdit', () => ({ default: () => <div>Edit</div> }));
vi.mock('./HelpdeskView', () => ({ default: () => <div>View</div> }));

const { HelpdeskEdit, HelpdeskView } = await import('./index');
const HelpdeskEditComponent = (await import('./HelpdeskEdit')).default;
const HelpdeskViewComponent = (await import('./HelpdeskView')).default;

describe('Helpdesk exports', () => {
  it('re-exports the edit and view components', () => {
    expect(HelpdeskEdit).toBe(HelpdeskEditComponent);
    expect(HelpdeskView).toBe(HelpdeskViewComponent);
  });
});
