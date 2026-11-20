import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HelpdeskEdit from './HelpdeskEdit';
import '@testing-library/jest-dom';

vi.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => {
  return { default: ({ children }) => <div>{children}</div> };
});

vi.mock('@plone/volto/components/manage/Form/BlockDataForm', () => {
  return {
    default: ({ onChangeField }) => (
      <button onClick={() => onChangeField('testField', 'testValue')}>
        Change Field
      </button>
    ),
  };
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
    const mockOnChangeBlock = vi.fn();
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
