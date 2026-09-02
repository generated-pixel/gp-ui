import { Meta, StoryObj } from '@storybook/angular';
import { GpButton } from '../components/button/button/button';

const meta: Meta<GpButton> = {
  title: 'Buttons/Button',
  component: GpButton,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'contrast']
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'text', 'tonal', 'elevated']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<GpButton>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    severity: 'primary',
    variant: 'filled'
  }
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Button',
    severity: 'primary',
    variant: 'outlined'
  }
};

export const Loading: Story = {
  args: {
    label: 'Loading State',
    loading: true
  }
};

export const WithIcon: Story = {
  args: {
    label: 'Download Report',
    icon: 'download',
    severity: 'success'
  }
};
