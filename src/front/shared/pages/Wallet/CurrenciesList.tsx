import CSSModules from 'react-css-modules'
import { FormattedMessage } from 'react-intl'
import config from 'app-config'
import {
  constants,
  metamask,
  externalConfig as exConfig,
} from 'helpers'
import actions from 'redux/actions'

import Button from 'components/controls/Button/Button'
import Tooltip from 'shared/components/ui/Tooltip/Tooltip'
import Table from 'components/tables/Table/Table'
import ConnectWalletModal from 'components/modals/ConnectWalletModal/ConnectWalletModal'
import Slider from './WallerSlider'
import Row from './Row/Row'
import styles from './Wallet.scss'
import axios from 'axios'
import TableData from './getNFTdata'

const addAllEnabledWalletsAfterRestoreOrCreateSeedPhrase = config?.opts?.addAllEnabledWalletsAfterRestoreOrCreateSeedPhrase
const noInternalWallet = config?.opts?.ui?.disableInternalWallet
const isWidgetBuild = config && config.isWidget

interface NFT {
  address: string;
  price: number;
  chain: string;

}

let nftData = true;
const nftDataList : NFT[] = [
  {
    address: 'fuenq7r4yrt023748hrtp1uf',
    price: 3.26,
    chain: 'ETH'
  },
  {
    address: 'fuenq7r4yrt023748hrtp1uf',
    price: 312.435556,
    chain: 'MATIC'
  },
  {
    address: 'fuenq7r4yrt023748hrtp1uf',
    price: 0.003,
    chain: 'BTC'
  },
  // {
  //   name: "WIZE",
  //   symbol: "WIZE",
  //   tokenId: "5439876705601306",
  //   amount: 1,
  //   contractType: "ERC721",
  //   "tokenAddress: "0xbe274599f30140dc818da797755bef2682a55f09",
  //   tokenUri: "https://nftstorage.link/ipfs/bafkreiaribcjkyqh3btcywdxmcsjxf5fb3zpwvauk72tlxv37bgf65bire",
  // }
];

// console.log(nftDataList[1].address)
// console.log(nftDataList[1].price)
// console.log(nftDataList[1].chain)

import React, { useState, useEffect } from 'react';

// function TableData() {
//     const [data, getData] = useState([]);
//     const URL = 'https://web3one.herokuapp.com/data/nft/POLYGON/0xAa81f641d4b3546F05260F49DEc69Eb0314c47De';

//     console.log('here we go?')

//     useEffect(() => {
//         fetchData()
//         console.log('fetching data')
//     }, [])

//     const fetchData = () => {
//        axios.get(URL).then((res) =>{
//                 console.log('api ka data = ', res.data);
//                 getData(res.data);
//           })
//     }

//     return (
//         <div style={{}}>
//             <h1>How to display JSON data to table in React JS</h1>
//             <tbody>
//                 <tr>
//                     <th>Name</th>
//                     <th>Symbol</th>
//                     <th>tokenId</th>
//                     <th>Amount</th>
//                     <th>contractType</th>
//                     <th>tokenAddress</th>
//                     <th>tokenUri</th>
//                 </tr>
//                 {data.map((item, i) => (
//                     <tr key={i}>
//                         <td>i.</td>
//                         <td>2</td>
//                         <td>3</td>
//                         <td>4</td>
//                     </tr>
//                 ))}
//             </tbody>
//         </div>
//     );
// }





type CurrenciesListProps = {
  multisigPendingCount: number
  goToСreateWallet: () => void
  hiddenCoinsList: string[]
  tableRows: IUniversalObj[]
}

function CurrenciesList(props: CurrenciesListProps) {
  const {
    tableRows,
    goToСreateWallet,
    multisigPendingCount,
  } = props

  const openAddCustomTokenModal = () => {
    actions.modals.open(constants.modals.AddCustomToken)
  }

  const handleRestoreMnemonic = () => {
    actions.modals.open(constants.modals.RestoryMnemonicWallet)
  }


  const showAssets = !(config?.opts?.ui?.disableInternalWallet)
    ? true
    : !!(metamask.isConnected())
  return (
    <div styleName="yourAssets">
      {showAssets && (
        <>
          {(exConfig && exConfig.opts && exConfig.opts.showWalletBanners) || isWidgetBuild ? (
            <Slider multisigPendingCount={multisigPendingCount} />
          ) : (
            ''
          )}
          <h3 styleName="yourAssetsHeading">
            <FormattedMessage id="YourAssets" defaultMessage="Your assets" />
          </h3>
          <div styleName="yourAssetsDescr">
            <FormattedMessage
              id="YourAssetsDescription"
              defaultMessage="Here you can safely store, send and receive assets"
            />
          </div>

          <Table
            className={`${styles.walletTable} data-tut-address`}
            rows={tableRows}
            rowRender={(row, index) => (
              <Row
                key={index}
                currency={row}
                itemData={row}
              />
            )}
          />
          <div styleName="addCurrencyBtnWrapper">
            <Button id="addCustomTokenBtn" onClick={openAddCustomTokenModal} transparent fullWidth>
              <FormattedMessage id="addCustomToken" defaultMessage="Add custom token" />
            </Button>
            {addAllEnabledWalletsAfterRestoreOrCreateSeedPhrase && !noInternalWallet && (
              <Button onClick={handleRestoreMnemonic} small link>
                <FormattedMessage id="ImportKeys_RestoreMnemonic" defaultMessage="Restore from 12-word seed" />
                &nbsp;
                <Tooltip id="ImportKeys_RestoreMnemonic_tooltip">
                  <span>
                    <FormattedMessage
                      id="ImportKeys_RestoreMnemonic_Tooltip"
                      defaultMessage="12-word backup phrase"
                    />
                    <br />
                    <br />
                    <div styleName="alertTooltipWrapper">
                      <FormattedMessage
                        id="ImportKeys_RestoreMnemonic_Tooltip_withBalance"
                        defaultMessage="Please, be causious!"
                      />
                    </div>
                  </span>
                </Tooltip>
              </Button>
            )}
            {!addAllEnabledWalletsAfterRestoreOrCreateSeedPhrase && (
              <Button id="addAssetBtn" onClick={goToСreateWallet} transparent fullWidth>
                <FormattedMessage id="addAsset" defaultMessage="Add currency" />
              </Button>
            )}
          </div>
        </>
      )}



      {
        nftData &&
        <>
          <hr/><br/>
          <button style={{height:'50px', width:'200px', backgroundColor:'#2B3A55', margin: '5px', borderRadius:'5px 5px 5px 5px', marginLeft:'5px', paddingLeft:'10px', border:'1px solid white'}}>My NFTs</button>
                 
          <TableData/>
        </>
      }



      {!showAssets && !metamask.isConnected() && (
        <ConnectWalletModal noCloseButton />
      )}
    </div>
  )
}

export default CSSModules(CurrenciesList, styles, { allowMultiple: true })
