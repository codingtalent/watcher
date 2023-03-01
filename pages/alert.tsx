import { Context } from "vm";
//import Loading from '../components/Shared/Loading';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {db, UserSwapsAlert} from '../lib/dexieDB';


const fetchSwapsData = async (blockchain, dateRange) => {
  //const res = await axios.get("http://localhost:3000/api/products");
  const res = await axios.get("/api/hello");

  return res;
};

export default function Web(data:any) {
  
  useEffect(() => {

    
    (async () => {
      //let userSwapsAlertList: UserSwapsAlert = await db.getUserSwapsAlert();
      //setPublications(posts);

      //setLensLoading(false);
    })()
  }, []);
  
  const [alertData, setAlertData] = useState([]);
  const [address, setAddress] = useState(data?.address);
  const [blockchain, setBlockchain] = useState(data?.blockchain);
  const [threshold, setThreshold] = useState('');
  let intervalTimer:any = null;




  return (
    <div className="page_content">
      <div className="flex items-center text-left py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-8 mt-5">
          <h2 className="mt-6 text-left text-4xl font-bold tracking-tight text-gray-900">New Big Swap Alert</h2>
          <div className="flex gap-2">
            <select value={blockchain} className="py-2 px-4 rounded border border-gray-200">
              <option value="">Select Blockchain</option>
              <option value="ethereum">Ethereum</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="polygon">Polygon</option>
            </select>
            <input type="text" placeholder="Pool Address" value={address} className="py-2 px-4 rounded border border-gray-200 w-96"/>
            <select value={threshold} className="py-2 px-4 rounded border border-gray-200">
              <option value="">Select Alert Amount</option>
              <option value="1000">1000</option>
              <option value="10000">10000</option>
              <option value="100000">100000</option>
            </select>
            <input type="button" value="Apply" className="py-2 px-4 rounded border border-gray-200 cursor-pointer bg-blue-900 text-white"/>
          </div>
          <div className=" mt-2">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="border border-gray-300 bg-gray-200 capitalize">
                  <th className="text-left font-normal w-1/12 pl-4 py-2">block_time</th>
                  <th className="text-left font-normal w-1/12">amount_usd</th>
                  <th className="text-left font-normal w-1/12">token_pair</th>
                  <th className="text-left font-normal w-3/12">taker</th>
                  <th className="text-left font-normal w-3/12">tx_hash</th>
                  <th className="text-left font-normal w-3/12">project_contract_address</th>
                </tr>
              </thead>
              <tbody>
                {(alertData ?? []).map((item, i) => (
                  <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`swap{i}`}>
                    <td className="pl-4 py-2"></td>
                    <td className=""></td>
                  </tr>
                ))}
                {
                  (!alertData || !alertData.length) && (
                    <tr>
                      <td colSpan={12} className="italic font-light text-center py-6">
                        No Data!
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context:Context) {
  let {
    address = '',
    blockchain = ''
  } = context.query || {};

  const blockChainList = ['ethereum', 'arbitrum', 'optimism', 'polygon'];
  if(blockChainList.indexOf(blockchain)==-1){
    blockchain = '';
  }
  return {
    props: {
      address: address,
      blockchain: blockchain
    },
  }
}
