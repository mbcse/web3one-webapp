import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableData = () => {
    const [data, getData] = useState([]);
    const URL = 'https://web3one.herokuapp.com/data/nft/POLYGON/0xAa81f641d4b3546F05260F49DEc69Eb0314c47De';

    console.log('here we go?')

    useEffect(() => {
        fetchData()
        console.log('fetching data')
    }, [])

    const fetchData = () => {
       axios.get(URL).then((res) =>{
                console.log('api ka data = ', res.data);
                getData(res.data);
          })
    }

    return (
        <div style={{}}>
            {/* <p>Chain: {data.chain}</p>
            <p>Explore Link: {data.explorerLink}</p> */}
            <tbody style={{padding: '15px'}}>
                <tr>
                    {/* <th>Name</th> */}
                    <th style={{textAlign:'center'}}>Symbol</th>
                    <th style={{textAlign:'center'}}>Token-Id</th>
                    <th style={{textAlign:'center'}}>Amount</th>
                    <th style={{textAlign:'center'}}>contract-Type</th>
                    <th style={{textAlign:'center'}}>Token Address</th>
                    <th style={{textAlign:'center'}}>TokenUri</th>
                </tr>
                
                {data && data.nftData && data.nftData.nfts && data.nftData.nfts.map((item, i) => (
                    <tr key={i}>
                        {/* <td>{item.name && item.name.substr(0,5)}...</td> */}
                        <td style={{textAlign:'center'}}>{item.symbol}</td>
                        <td style={{textAlign:'center'}}>{item.tokenId.substr(0,5)}...</td>
                        <td style={{textAlign:'center'}}>{item.amount}</td>
                        <td style={{textAlign:'center'}}>{item.contractType.substr(0,7)}...</td>
                        <td style={{textAlign:'center'}}>{item.tokenAddress.substr(0,10)}...</td>
                        <td style={{textAlign:'center'}}>{item.tokenUri.substr(0,15)}...</td>
                    </tr>
                ))}
            </tbody>
        </div>
    );
}

export default TableData;