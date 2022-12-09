import worldID from "@worldcoin/id";
import WalletConnect from '@walletconnect/client'
import { buildQRData } from '@worldcoin/id'


function update(signal){
  
  worldID.update({
  signal,
  advanced_use_raw_signal: true,
  })
  
}


function connect(){
  // Create a connector
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
  })

  const url = buildQRData(connector) 
}

export default function WorldCoinComponent {
  worldID.init("worldid-container",{
  action_id: "wid_staging_fMy8wNwerwerwrAKLjcb7tVyI",
});
  
  return (<connect/>)
}
