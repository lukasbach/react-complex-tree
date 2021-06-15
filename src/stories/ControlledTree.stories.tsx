import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ControlledTreeEnvironment } from '../ControlledTreeEnvironment';


export default {
  title: 'Tree',
  component: ControlledTreeEnvironment,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

export const Example = () => <ControlledTreeEnvironment />