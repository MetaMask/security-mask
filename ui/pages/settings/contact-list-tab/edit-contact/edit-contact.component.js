import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Identicon from '../../../../components/ui/identicon';
import Button from '../../../../components/ui/button/button.component';
import TextField from '../../../../components/ui/text-field';
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer';
import {
  isBurnAddress,
  isValidHexAddress,
} from '../../../../../shared/modules/hexstring-utils';
import CheckBox from '../../../../components/ui/check-box';
import { Label, Text } from '../../../../components/component-library';
import {
  AlignItems,
  FLEX_DIRECTION,
  TextColor,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import Box from '../../../../components/ui/box';

export default class EditContact extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    addToAddressBook: PropTypes.func,
    removeFromAddressBook: PropTypes.func,
    history: PropTypes.object,
    name: PropTypes.string,
    address: PropTypes.string,
    chainId: PropTypes.string,
    memo: PropTypes.string,
    viewRoute: PropTypes.string,
    listRoute: PropTypes.string,
    tags: PropTypes.array,
  };

  static defaultProps = {
    name: '',
    memo: '',
    tags: [],
  };

  state = {
    newName: this.props.name,
    newAddress: this.props.address,
    newMemo: this.props.memo,
    newTags: this.props.tags,
    error: '',
  };

  addAllowList() {
    if (this.state.newTags.length === 0) {
      this.setState({
        newTags: [...this.state.newTags, 'allowList'],
      });
    }
    if (this.state.newTags.length > 0) {
      if (this.state.newTags.includes('blockList')) {
        this.setState(
          {
            newTags: [],
          },
          () => {
            this.setState({
              newTags: [...this.state.newTags, 'allowList'],
            });
          },
        );
      } else {
        this.setState({ newTags: [] });
      }
    }
  }

  addBlockList() {
    if (this.state.newTags.length === 0) {
      this.setState({
        newTags: [...this.state.newTags, 'blockList'],
      });
    }
    if (this.state.newTags.length > 0) {
      if (this.state.newTags.includes('allowList')) {
        this.setState(
          {
            newTags: [],
          },
          () => {
            this.setState({
              newTags: [...this.state.newTags, 'blockList'],
            });
          },
        );
      } else {
        this.setState({ newTags: [] });
      }
    }
  }

  render() {
    const { t } = this.context;
    const {
      address,
      addToAddressBook,
      chainId,
      history,
      listRoute,
      memo,
      name,
      tags,
      removeFromAddressBook,
      viewRoute,
    } = this.props;
    if (!address) {
      return <Redirect to={{ pathname: listRoute }} />;
    }

    return (
      <div className="settings-page__content-row address-book__edit-contact">
        <div className="settings-page__header address-book__header--edit">
          <Identicon address={address} diameter={60} />
          <Button
            type="link"
            className="settings-page__address-book-button"
            onClick={async () => {
              await removeFromAddressBook(chainId, address);
              history.push(listRoute);
            }}
          >
            {t('deleteAccount')}
          </Button>
        </div>
        <div className="address-book__edit-contact__content">
          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label">
              {t('userName')}
            </div>
            <TextField
              type="text"
              id="nickname"
              placeholder={this.context.t('addAlias')}
              value={this.state.newName}
              onChange={(e) => this.setState({ newName: e.target.value })}
              fullWidth
              margin="dense"
            />
          </div>

          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label">
              {t('ethereumPublicAddress')}
            </div>
            <TextField
              type="text"
              id="address"
              value={this.state.newAddress}
              error={this.state.error}
              onChange={(e) => this.setState({ newAddress: e.target.value })}
              fullWidth
              multiline
              rows={4}
              margin="dense"
              classes={{
                inputMultiline:
                  'address-book__view-contact__address__text-area',
                inputRoot: 'address-book__view-contact__address',
              }}
            />
          </div>

          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label--capitalized">
              {t('memo')}
            </div>
            <TextField
              type="text"
              id="memo"
              placeholder={memo}
              value={this.state.newMemo}
              onChange={(e) => this.setState({ newMemo: e.target.value })}
              fullWidth
              margin="dense"
              multiline
              rows={3}
              classes={{
                inputMultiline: 'address-book__view-contact__text-area',
                inputRoot: 'address-book__view-contact__text-area-wrapper',
              }}
            />
          </div>
          <Box
            flexDirection={FLEX_DIRECTION.ROW}
            alignItems={AlignItems.flexStart}
            padding={6}
            gap={2}
          >
            <CheckBox
              value={this.state.newTags}
              onClick={() => {
                this.addAllowList();
              }}
              id="allow-list-checkbox"
              checked={this.state.newTags.includes('allowList')}
            />
            <Label htmlFor="allow-list-checkbox">
              <Text
                variant={TextVariant.bodyMdBold}
                as="span"
                color={TextColor.successDefault}
              >
                Allow List
              </Text>
            </Label>
          </Box>
          <Box
            flexDirection={FLEX_DIRECTION.ROW}
            alignItems={AlignItems.flexStart}
            paddingLeft={6}
            paddingRight={6}
            gap={2}
          >
            <CheckBox
              id="block-list-checkbox"
              value={this.state.newTags}
              onClick={() => {
                this.addBlockList();
              }}
              checked={this.state.newTags.includes('blockList')}
            />
            <Label htmlFor="block-list-checkbox">
              <Text
                variant={TextVariant.bodyMdBold}
                as="span"
                color={TextColor.errorDefault}
              >
                Block List
              </Text>
            </Label>
          </Box>
        </div>
        <PageContainerFooter
          cancelText={this.context.t('cancel')}
          onSubmit={async () => {
            if (
              this.state.newAddress !== '' &&
              this.state.newAddress !== address
            ) {
              // if the user makes a valid change to the address field, remove the original address
              if (
                !isBurnAddress(this.state.newAddress) &&
                isValidHexAddress(this.state.newAddress, {
                  mixedCaseUseChecksum: true,
                })
              ) {
                await removeFromAddressBook(chainId, address);
                await addToAddressBook(
                  this.state.newAddress,
                  this.state.newName || name,
                  this.state.newMemo || memo,
                  this.state.newTags || tags,
                );
                history.push(listRoute);
              } else {
                this.setState({ error: this.context.t('invalidAddress') });
              }
            } else {
              // update name
              await addToAddressBook(
                address,
                this.state.newName || name,
                this.state.newMemo || memo,
                this.state.newTags || tags,
              );
              history.push(listRoute);
            }
          }}
          onCancel={() => {
            history.push(`${viewRoute}/${address}`);
          }}
          submitText={this.context.t('save')}
          disabled={
            (this.state.newName === name &&
              this.state.newAddress === address &&
              this.state.newMemo === memo &&
              this.state.newTags === tags) ||
            !this.state.newName.trim()
          }
        />
      </div>
    );
  }
}
