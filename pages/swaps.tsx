import { Context } from "vm";
import Loading from '../components/Shared/Loading';
import React, { useState } from 'react';


export default function Web(data:any) {
  
  let { address, blockchain, execution_id} = data;
  const [loading, setLoading] = useState(false);
  const [swapData, setSwapData] = useState([]);

  return (
    <div className="page_content">
      <div className="flex items-center text-left py-12 px-4 sm:px-6 lg:px-8">
        { loading && <Loading />}
        <div className="w-full space-y-8 mt-5">
          <h2 className="mt-6 text-left text-4xl font-bold tracking-tight text-gray-900">
            { address=='' ? (
              <span className="mr-2 italic">No Pool Address</span>
            ) : (
              <>
                <span className="mr-2">{blockchain}</span><span className="font-normal text-base">({address})</span>
              </>
            )}
          </h2>
          <div className="md:px-4 xl:px-4 mt-2">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="border border-gray-300 bg-gray-200 capitalize">
                  <th className="text-left font-normal w-1/12 pl-4 py-2">evt_block_time</th>
                  <th className="text-left font-normal w-2/12">pool</th>
                  <th className="text-left font-normal w-2/12">token0</th>
                  <th className="text-left font-normal w-1/12">token1</th>
                  <th className="text-left font-normal w-1/12">fee</th>
                  <th className="text-left font-normal w-1/12">amount0</th>
                  <th className="text-left font-normal w-1/12">amount1</th>
                  <th className="text-left font-normal w-1/12">sender</th>
                  <th className="text-left font-normal w-1/12">recipient</th>
                  <th className="text-left font-normal w-1/12">evt_tx_hash</th>
                </tr>
              </thead>
              <tbody>
                {(swapData ?? []).map((item, i) => (
                  <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`swap{i}`}>
                    <td className="pl-4 py-2"></td>
                    <td className=""></td>
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
  const {
    address = '',
    blockchain = ''
  } = context.query || {};
  
  let execution_id = 0;
  const blockChainList = ['ethereum', 'arbitrum', 'optimism', 'polygon'];
  if(blockChainList.indexOf(blockchain)>=0){
    //todo: ajax query
  }
  //const posts = await fetchPostDetails(profileId, startDate, endDate);
 
  return {
    props: {
      address: address,
      blockchain: blockchain,
      execution_id: execution_id
    },
  }
}
