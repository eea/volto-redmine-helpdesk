import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HelpdeskEdit from './HelpdeskEdit';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  SidebarPortal: ({ children }) => <div>{children}</div>,
}));

jest.mock('@plone/volto/components/manage/Form/BlockDataForm', () => {
  return ({ onChangeField }) => (
    <button onClick={() => onChangeField('testField', 'testValue')}>
      Change Field
    </button>
  );
});

describe('HelpdeskEdit component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<HelpdeskEdit />);
    expect(
      getByText('Helpdesk widget. See sidebar for configuration.'),
    ).toBeInTheDocument();
  });

  it('renders SidebarPortal and BlockDataForm', () => {
    const { container } = render(<HelpdeskEdit />);
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('updates block data correctly', () => {
    const mockOnChangeBlock = jest.fn();
    const { getByText } = render(
      <HelpdeskEdit
        onChangeBlock={mockOnChangeBlock}
        block="testBlock"
        data={{}}
      />,
    );

    fireEvent.click(getByText('Change Field'));

    expect(mockOnChangeBlock).toHaveBeenCalledWith('testBlock', {
      testField: 'testValue',
    });
  });
});
