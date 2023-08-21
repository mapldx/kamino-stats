import axios from "axios";
import { useState, useEffect } from "react";

import LineChart from "../charts/pools/volume";
import TvlChart from "../charts/pools/tvl";

const PoolModal = ({ pool, onClose }) => {
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  const [data, setData] = useState(null);
  const [tvlData, setTvlData] = useState(null);
  const vol = `https://api.solscan.io/amm/ohlcv?address=${pool}&type=all&time_from=1692488822.595&time_to=1692575222.595&cluster=mainnet-beta`;
  const tvl = `https://api.solscan.io/amm/tvl?address=${pool}&type=all&time_from=1692479166.192&time_to=1692565566.192&cluster=mainnet-beta`

  const headers = {
    'authority': 'api.solscan.io',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'origin': 'https://solscan.io',
    'referer': 'https://solscan.io/',
    'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Brave";v="116"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  }

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: vol,
      headers: headers,
    };
    axios.request(config)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('An error occurred while fetching data:', error);
      });
    let config2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: tvl,
      headers: headers,
    };
    axios.request(config2)
      .then(response => {
        setTvlData(response.data);
      })
      .catch(error => {
        console.error('An error occurred while fetching data:', error);
      });
  }, []);

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="flex items-center justify-center h-1/2">
          {tvlData ? <TvlChart data={tvlData} /> : <div>Loading...</div>}
        </div>
        <div className="flex items-center justify-center h-1/2">
          {data ? <LineChart data={data} /> : <div>Loading...</div>}
        </div>
      </div>
    </div>
  );

};

export default PoolModal;