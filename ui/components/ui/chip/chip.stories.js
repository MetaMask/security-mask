import React, { useState } from 'react';

import {
  TypographyVariant,
  SEVERITIES,
  Color,
  BorderColor,
  BackgroundColor,
  TextColor,
} from '../../../helpers/constants/design-system';

import ApproveIcon from '../icon/approve-icon.component';
import InfoIcon from '../icon/info-icon.component';
import Identicon from '../identicon';
import { ChipWithInput } from './chip-with-input';

import README from './README.mdx';

import Chip from '.';

export default {
  title: 'Components/UI/Chip',

  component: Chip,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    leftIcon: {
      control: {
        type: 'select',
      },
      options: ['ApproveIcon'],
      mapping: {
        ApproveIcon: (
          <ApproveIcon size={24} color="var(--color-success-default)" />
        ),
      },
    },
    rightIcon: {
      control: {
        type: 'select',
      },
      options: ['Identicon'],
      mapping: {
        Identicon: (
          <Identicon
            address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
            diameter={25}
          />
        ),
      },
    },
    label: {
      control: 'text',
    },
    labelProps: {
      color: {
        control: {
          type: 'select',
        },
        options: Object.values(Color),
      },
      variant: {
        color: {
          control: {
            type: 'select',
          },
          options: Object.values(TypographyVariant),
        },
      },
    },
    borderColor: {
      control: {
        type: 'select',
      },
      options: Object.values(BorderColor),
    },
    backgroundColor: {
      control: {
        type: 'select',
      },
      options: Object.values(BackgroundColor),
    },
    children: {
      control: 'text',
    },
  },
};

export const DefaultStory = (args) => <Chip {...args} />;

DefaultStory.storyName = 'Default';

DefaultStory.args = {
  label: 'Chip',
  borderColor: BorderColor.borderDefault,
  backgroundColor: BackgroundColor.backgroundAlternative,
  labelProps: {
    color: TextColor.textDefault,
    variant: TypographyVariant.H6,
  },
};

export const WithLeftIcon = () => (
  <Chip
    label="Done!"
    borderColor={BorderColor.successDefault}
    leftIcon={<ApproveIcon size={24} color="var(--color-success-default)" />}
  />
);

export const WithRightIcon = () => (
  <Chip
    label="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
    borderColor={BorderColor.borderDefault}
    rightIcon={
      <Identicon
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        diameter={25}
      />
    }
  />
);

export const WithBothIcons = () => (
  <Chip
    label="Account 1"
    borderColor={BorderColor.borderDefault}
    rightIcon={<InfoIcon size={24} severity={SEVERITIES.INFO} />}
    leftIcon={
      <Identicon
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        diameter={25}
      />
    }
  />
);
export const WithInput = (args) => {
  const [inputValue, setInputValue] = useState('Chip with input');
  return (
    <ChipWithInput
      {...args}
      inputValue={inputValue}
      setInputValue={setInputValue}
    />
  );
};

WithInput.args = {
  borderColor: BorderColor.borderDefault,
};
