import tableSVG from '@plone/volto/icons/table.svg';

import { HelpdeskView, HelpdeskEdit } from './Helpdesk';

export default (config) => {
  config.blocks.blocksConfig.helpdesk = {
    id: 'helpdesk',
    title: 'Helpdesk Block',
    icon: tableSVG,
    group: 'common',
    view: HelpdeskView,
    edit: HelpdeskEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
