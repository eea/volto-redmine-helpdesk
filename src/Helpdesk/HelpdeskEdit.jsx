import React from 'react';

import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import HelpdeskSchema from './Schema';

const HelpdeskEdit = (props) => {
  const schema = HelpdeskSchema(props);

  return (
    <>
      Helpdesk widget. See sidebar for configuration.
      <SidebarPortal selected={props.selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          onChangeBlock={props.onChangeBlock}
          formData={props.data}
        />
      </SidebarPortal>
    </>
  );
};

export default HelpdeskEdit;
