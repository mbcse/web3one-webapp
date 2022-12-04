import React, { useState } from 'react'
import Push from "./push"
import actions from 'redux/actions'
import { connect } from 'redaction'
import { FormattedMessage } from 'react-intl'
import cssModules from 'react-css-modules'
import styles from './WalletConnectAccount.scss'
import { AddressFormat, AddressType } from 'domain/address'
import { ethers } from "ethers";
import {BalancesDto } from '@biconomy/node-client'
// import { ethers } from "ethers";
// import { useEffect, useState } from "react";
import {
  ChainId
} from "@biconomy/core-types";

import SmartAccount from "@biconomy/smart-account";

// import ENSAddress from '@ensdomains/react-ens-address'
// <ENSAddress provider={window.web3 || window.ethereum} />


import { useENSName } from 'use-ens-name';

const MyComponent = ({ address }) => {
  const name = useENSName(address)

  return <div>ENS name: {name}</div>
}



import {
  metamask,
  externalConfig as config
} from 'helpers'

import { Button } from 'components/controls'
import Address from 'components/ui/Address/Address'
import Copy from 'components/ui/Copy/Copy'
import CloseIcon from 'components/ui/CloseIcon/CloseIcon'
import InlineLoader from 'components/loaders/InlineLoader/InlineLoader'
import { string } from 'prop-types'

type ComponentState = {
  isPending: boolean
  balanceUpdating: boolean
  smartAddress: string
}

@connect(({
  ui: { dashboardModalsAllowed },
  user: { metamaskData }
}) => ({
  dashboardModalsAllowed,
  metamaskData,
}))
@cssModules(styles, { allowMultiple: true })
class WalletConnectAccount extends React.Component<any, ComponentState> {
  constructor(props) {
    super(props)

    this.state = {
      isPending: false,
      balanceUpdating: false,
      smartAddress: ""
    }
  }

  handleClose = () => {
    const {
      name,
    } = this.props

    actions.modals.close(name)
  }

  handleConnect = () => {
    this.setState(() => ({
      isPending: true, 
    }))

    metamask.handleConnectMetamask({
      callback: () => {
        this.setState(() => ({
          isPending: false,
        }))
      },
    })
  }

  handleDisconnect = () => {
    this.setState(() => ({
      isPending: true,
    }))

    metamask.handleDisconnectWallet(this.handleClose)
  }

  updateBalance = async () => {
    const { metamaskData } = this.props

    this.setState(() => ({
      balanceUpdating: true,
    }))

    await actions[metamaskData.currency.toLowerCase()].getBalance()

    setTimeout(() => {
      this.setState(() => ({
        balanceUpdating: false,
      }))
    }, 300)
  }


 getSmartAccount = async () => {
  var providerEth2 = window.ethereum;
  console.log('providerEth2 = ', providerEth2)
  
  if(providerEth2){
    providerEth2
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
          console.log(`Selected account is ${accounts[0]}`);
      })
      .catch((err) => {
          console.log(err);
          return;
      });
  }
  
  let walletProvider;
  if(providerEth2)  
    walletProvider = new ethers.providers.Web3Provider(providerEth2);
  
  console.log('walletProvider = ', walletProvider)
  
  let options = {
    activeNetworkId: ChainId.GOERLI,
    supportedNetworksIds: [ ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI
  ]}
  
  let smartAccount = new SmartAccount(walletProvider, options);
  console.log('first smartAccount = ', smartAccount)
  smartAccount = await smartAccount.init();
  const address = smartAccount.address;
  
  console.log('address = ', address)
  console.log('type of address', typeof address)
  this.setState(() => ({
    smartAddress: address, 
  }))



  const balanceParams: BalancesDto =
  {
    chainId: ChainId.POLYGON_MUMBAI, // chainId of your choice
    eoaAddress: address,

    tokenAddresses: [], 
  };

  const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
  console.info("getAlltokenBalances", balFromSdk);

  const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
  console.info("getTotalBalanceInUsd", usdBalFromSdk);

} 


componentDidMount(): void {
  this.getSmartAccount()
}


  render() {
    const {
      dashboardModalsAllowed,
      metamaskData: {
        isConnected,
        address,
        balance,
        currency,
      },
    } = this.props

    const { isPending, balanceUpdating, smartAddress } = this.state

    const web3Type = metamask.web3connect.getProviderType()
    const isAvailableNetwork = metamask.isAvailableNetwork()

    const walletAddress = isAvailableNetwork ?
      (
        <Copy text={address}>
          <span>
            <Address
              address={address}
              format={AddressFormat.Full}
              type={AddressType.Metamask}
            />
          </span>
        </Copy>
      ) :
      <FormattedMessage id="incorrectNetwork" defaultMessage='Please choose correct network' />

    const walletBalance = isAvailableNetwork ?
      `${balance} ${currency}` :
      '0'

    const chainName = isAvailableNetwork ?
      config.evmNetworks[currency].chainName :
      <FormattedMessage id="UnknownNetworkConnectedWallet" defaultMessage="Unknown Network" />

    return (
      <div styleName={`modalOverlay ${dashboardModalsAllowed ? "modalOverlay_dashboardView" : ""}`}>
        <div styleName={`modal ${dashboardModalsAllowed ? "modal_dashboardView" : ""}`}>
          <div styleName="header">
            <div styleName="headerContent">
              <h3 styleName="title">
                <FormattedMessage
                  id="WalletConnectAccountTitle"
                  defaultMessage="CONNECTED ACCOUNT"
                />
              </h3>
              <CloseIcon onClick={this.handleClose} />
            </div>
          </div>
          <div styleName="content">
            <div styleName="infoWrapper">
              <div styleName="parameter">
                <FormattedMessage id="YourWalletbalance" defaultMessage="Balance" />:{' '}
                {isPending ? (
                  '-'
                ) : (
                  <>
                    <button styleName="updateBalanceButton" onClick={this.updateBalance}>
                      <i className="fas fa-sync-alt" />
                    </button>
                    {balanceUpdating ? (
                      <span styleName="balanceLoader"><InlineLoader /></span>
                    ) : (
                      <span styleName="value">{walletBalance}</span>
                    )}
                  </>
                )}
              </div>
              <p styleName="parameter">
                <FormattedMessage id="network" defaultMessage="Network" />:{' '}
                {isPending ? '-' : <span styleName="value">{chainName}</span>}
              </p>
              <p styleName="parameter">
                <FormattedMessage id="menu.wallet" defaultMessage="Wallet" />:{' '}
                {isPending ? '-' : <span styleName="value">{web3Type}</span>}
              </p>
            </div>

            <div style={{height:'50px', width:'500px', backgroundColor:'#453C67', margin:'5px', borderRadius:'5px 5px 5px 5px', marginLeft:'5px', paddingLeft:'10px', border:'1px solid white'}}>
              Signer Address: <p style={{color:'#F2F7A1'}}>{walletAddress}</p>
            </div>


            <div style={{height:'50px', width:'500px', backgroundColor:'#453C67', margin: '5px', borderRadius:'5px 5px 5px 5px', marginLeft:'5px', paddingLeft:'10px', border:'1px solid white'}}>
            Smart Account Address: <p style={{color:'#F2F7A1'}}>{smartAddress}</p>
            </div>


                    



            <div>
              {
                isConnected ? (
                  <Button blue onClick={this.handleDisconnect}>
                    <FormattedMessage id="MetamaskDisconnect" defaultMessage="Disconnect wallet" />
                  </Button>
                ) : (
                  <Button blue onClick={this.handleConnect}>
                    <FormattedMessage id="Exchange_ConnectAddressOption" defaultMessage="Connect Wallet" />
                  </Button>
                )
              }
            </div>
            <div>
              {
                isConnected && 
                  <h1> ENS </h1>

              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WalletConnectAccount
