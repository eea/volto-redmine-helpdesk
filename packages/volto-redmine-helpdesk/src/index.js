import tableSVG from '@plone/volto/icons/table.svg';

import { HelpdeskView, HelpdeskEdit } from './Helpdesk';

const config = (config) => {
  config.blocks.blocksConfig.helpdesk = {
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
  };
  return config;
};

export default config;
