import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import HelpdeskSchema from './Schema';

class HelpdeskEdit extends Component {
    render() {
        const schema = HelpdeskSchema(this.props);

        return (
          <>
            Helpdesk widget. See sidebar for configuration.

            <SidebarPortal selected={this.props.selected}>
              <BlockDataForm
                schema={schema}
                title={schema.title}
                onChangeField={(id, value) => {
                  this.props.onChangeBlock(this.props.block, {
                    ...this.props.data,
                    [id]: value,
                  });
                }}
                onChangeBlock={this.props.onChangeBlock}
                formData={this.props.data}
              />
            </SidebarPortal>
          </>
        );
    }
}

export default HelpdeskEdit;
