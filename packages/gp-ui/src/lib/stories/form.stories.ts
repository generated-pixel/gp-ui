import { Meta, StoryObj } from '@storybook/angular';
import { GpInputTextComponent } from '../components/form/input-text/input-text.component';

const meta: Meta<GpInputTextComponent> = {
  title: 'Forms/InputText',
  component: GpInputTextComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<GpInputTextComponent>;

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
