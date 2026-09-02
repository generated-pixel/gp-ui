import { Meta, StoryObj } from '@storybook/angular';
import { GpInputText } from '../components/form/input-text/input-text';

const meta: Meta<GpInputText> = {
  title: 'Forms/InputText',
  component: GpInputText,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<GpInputText>;

export const Default: Story = {
  args: {
    placeholder: 'Enter username'
  }
};

export const Clearable: Story = {
  args: {
    placeholder: 'Type and clear',
    clearable: true
  }
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Search...',
    iconLeft: 'search'
  }
};
