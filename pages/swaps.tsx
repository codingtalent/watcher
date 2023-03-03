import { Context } from "vm";
import Loading from '../components/Shared/Loading';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const fetchSwapsData = async (blockchain: string, pool: string) => {
  let formatDate = moment().format('YYYY-MM-DD HH:00:00');
  const res = await axios.get("/api/dune/2056310?blockchain=" + blockchain + "&current_hour=" + 'default value' + "&pool=" + pool);
  return res.data;
};

export default function Web(data:any) {
  

  let { address, blockchain} = data;
  const [loading, setLoading] = useState(false);
  const [swapData, setSwapData] = useState([]);
  let intervalTimer:any = null;

  const timerQuery = (blockchain: string, address: string) => {
    intervalTimer = setInterval(() => {
      (async () => {
        let res = await fetchSwapsData(blockchain, address);
        if(res.data.result!=undefined){
          setSwapData(res.data.result.rows);
          clearInterval(intervalTimer);
          setLoading(false);
        }
      })()
    }, 9000);
  }

  useEffect(() => {
    (async () => {
      if(address!=''){
        setLoading(true);
        let res = await fetchSwapsData(blockchain, address);
        if(res.data.result==undefined){
          timerQuery(blockchain, address);
        }
        else{
          setSwapData(res.data.result.rows);
          setLoading(false);
        }
      }
    })()
  }, []);


  return (
    <div className="page_content">
      <div className="flex items-center text-left py-12 px-4 sm:px-6 lg:px-8">
        { loading && <Loading />}
        <div className="w-full space-y-8 mt-5">
          <h2 className="mt-6 text-left text-4xl font-bold tracking-tight text-gray-900">
            { address=='' ? (
              <span className="mr-2 italic">No Pool Address or Blockchain</span>
            ) : (
              <>
                <span className="mr-2">{blockchain}</span><span className="font-normal text-base">({address})</span>
              </>
            )}
          </h2>
          <div className="mt-2">
            <table className="w-full table-fixed border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="border border-gray-300 bg-gray-200 capitalize">
                  <th className="text-left font-normal w-1/12 pl-4 py-2">evt_block_time</th>
                  <th className="text-left font-normal w-1/12">fee</th>
                  <th className="text-left font-normal w-1/12">token0</th>
                  <th className="text-left font-normal w-1/12">token1</th>
                  <th className="text-left font-normal w-1/12">amount0</th>
                  <th className="text-left font-normal w-1/12">amount1</th>
                  <th className="text-left font-normal w-2/12">sender</th>
                  <th className="text-left font-normal w-2/12">recipient</th>
                  <th className="text-left font-normal w-1/12">evt_tx_hash</th>
                </tr>
              </thead>
              <tbody>
                {(swapData ?? []).map((item, i) => (
                  <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`swap{i}`}>
                    <td className="pl-4 py-2">{moment(item.evt_block_time).format("YYYY-MM-DD hh:mm")}</td>
                    <td className="">{item.fee}</td>
                    <td className="truncate">{item.token0}</td>
                    <td className="truncate">{item.token1}</td>
                    <td className="truncate">{item.amount0}</td>
                    <td className="truncate">{item.amount1}</td>
                    <td className="truncate">{item.sender}</td>
                    <td className="truncate">{item.recipient}</td>
                    <td className="truncate">{item.evt_tx_hash}</td>
                  </tr>
                ))}
                {
                  (!swapData || !swapData.length) && (
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
    address = '';
  }
 
  return {
    props: {
      address: address,
      blockchain: blockchain
    },
  }
}
