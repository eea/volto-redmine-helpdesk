import React from 'react';
import tableSVG from '@plone/volto/icons/table.svg';

jest.mock('./Helpdesk', () => {
  const HelpdeskView = () => <div>View</div>;
  const HelpdeskEdit = () => <div>Edit</div>;

  return {
    HelpdeskView,
    HelpdeskEdit,
  };
});

const config = require('./index').default;
const { HelpdeskView, HelpdeskEdit } = require('./Helpdesk');

describe('addon config', () => {
  it('registers the helpdesk block', () => {
    const addonConfig = {
      blocks: {
        blocksConfig: {},
      },
    };

    const result = config(addonConfig);

    expect(result).toBe(addonConfig);
    expect(result.blocks.blocksConfig.helpdesk).toEqual({
      id: 'helpdesk',
      title: 'Helpdesk Block',
      icon: tableSVG,
      group: 'common',
      view: HelpdeskView,
      edit: HelpdeskEdit,
      restricted: false,
      mostUsed: false,
      sidebarTab: 1,
      security: {
        addPermission: [],
        view: [],
      },
    });
  });
});
