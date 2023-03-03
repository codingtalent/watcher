import { Context } from "vm";
//import Loading from '../components/Shared/Loading';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {db, UserSwapsAlert, UserSwapsAlertPool} from '../lib/dexieDB';
import AlertList from "../components/Shared/AlertList";


const fetchUserSwapsAlertData = async () => {
  let userSwapsAlert = await db.getUserSwapsAlert();
  let userSwapsAlertDetailsData: any = [];
  if(userSwapsAlert.length>0){
    let timestampArr = [];
    for(let item of userSwapsAlert){
      timestampArr.push(item.timestamp);
    }
    userSwapsAlertDetailsData = await fetchUserSwapsAlertDetailsData(timestampArr);
  }
  return {'userSwapsAlert': userSwapsAlert, "userSwapsAlertDetails": userSwapsAlertDetailsData};
};
const fetchUserSwapsAlertDetailsData = async (timestamp: number[]) => {
  let userSwapsAlertDetails = await db.getUserSwapsAlertDetails(timestamp);
  return userSwapsAlertDetails;
};
const deleteUserSwapsAlertData = async (timestamp: number[]) => {
  await db.deleteUserSwapsAlertData(timestamp);
};

export default function Web(data:any) {
  
  const [alertData, setAlertData] = useState(new Array<UserSwapsAlert>());
  const [alertDetailsData, setAlertDetailsData] = useState([]);
  const [address, setAddress] = useState(data?.address);
  const [blockchain, setBlockchain] = useState(data?.blockchain);
  const [threshold, setThreshold] = useState(0);
  const [watchingItem, setWatchingItem] = useState({
    pool_address: '',
    blockchain: '',
    threshold: 0
  });
  const [isWatching, setIsWatching] = useState(false);
  useEffect(() => {

    (async () => {
      let userSwapsAlertPoolItem: any = await db.getSwapsAlertPool();
      if(typeof(userSwapsAlertPoolItem)!="undefined"){
        if(address==''){
          setAddress(userSwapsAlertPoolItem.pool_address);
          setBlockchain(userSwapsAlertPoolItem.blockchain);
          setThreshold(userSwapsAlertPoolItem.threshold);
        }
        setWatchingItem(userSwapsAlertPoolItem);
        setApplyState(userSwapsAlertPoolItem,userSwapsAlertPoolItem.blockchain, userSwapsAlertPoolItem.pool_address, userSwapsAlertPoolItem.threshold);
        let userSwapsAlertData = await fetchUserSwapsAlertData();
        setAlertData(userSwapsAlertData.userSwapsAlert);
        setAlertDetailsData(userSwapsAlertData.userSwapsAlertDetails);
      }
    })()
  }, []);
 

  const setApplyState = (item:any, bc:string, pool_address:string, th:number) => {
    if(item.blockchain==bc && 
      item.pool_address==pool_address && 
      item.threshold==th){
        setIsWatching(true);
    }
    else{
      setIsWatching(false);
    }
  }

  const changeBlockchain = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    let bc= e.target.value;
    setBlockchain(bc);
    setApplyState(watchingItem, bc, address, threshold);
  }
  const changeThreshold = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    let th = Number(e.target.value);
    setThreshold(th);;
    setApplyState(watchingItem, blockchain, address, th);
  }
  const applyAlertSetting = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(blockchain!='' && address!='' && threshold!=0){
      (async () => {
        let poolData: UserSwapsAlertPool = {
          threshold: Number(threshold),
          blockchain: blockchain,
          pool_address: address
        };
        setWatchingItem(poolData);
        setApplyState(poolData, blockchain, address, threshold);
        await db.setSwapsAlertPool(poolData);
      })()
    }
  }
  const dismissAlert = (e:React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    (async () => {
      alertData
      let timestampArr = [];
      for(let item of alertData){
        timestampArr.push(item.timestamp);
      }
      await db.deleteUserSwapsAlertData(timestampArr);
      let userSwapsAlertData = await fetchUserSwapsAlertData();
      setAlertData(userSwapsAlertData.userSwapsAlert);
      setAlertDetailsData(userSwapsAlertData.userSwapsAlertDetails);
    })() 
  }

  return (
    <div className="page_content">
      <div className="flex items-center text-left py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-8 mt-5">
          <h2 className="mt-6 text-left text-4xl font-bold tracking-tight text-gray-900">New Big Swap Alert</h2>
          <div className="flex gap-2">
            <select onChange={(e) => changeBlockchain(e)} value={blockchain} className="py-2 px-4 rounded border border-gray-200">
              <option value="">Select Blockchain</option>
              <option value="ethereum">Ethereum</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="polygon">Polygon</option>
            </select>
            <input type="text" placeholder="Pool Address" onChange={(e) => setAddress(e.target.value)} value={address} className="py-2 px-4 rounded border border-gray-200 w-96"/>
            <select onChange={(e) => changeThreshold(e)} value={threshold} className="py-2 px-4 rounded border border-gray-200">
              <option value="0">Select Alert Amount</option>
              <option value="1000">1000</option>
              <option value="10000">10000</option>
              <option value="100000">100000</option>
            </select>
            <button disabled={isWatching} onClick={(e) => applyAlertSetting(e)} className="py-2 px-4 rounded border border-gray-200 disabled:bg-gray-300 disabled:text-black disabled:cursor-text cursor-pointer bg-blue-900 text-white">{ isWatching ? "Watching" : "Apply"}</button>
          </div>
          <div className=" mt-2">
            { alertData.length > 0 && (
              <div className="text-right font-bold">
                <div className="cursor-pointer" onClick={(e) => dismissAlert(e)}>Dismiss</div>
              </div>
            )}
            {(alertData ?? []).map((item, i) => (
              <AlertList key={`alertData${i}`} timestamp={item.timestamp} list={
                alertDetailsData.filter((ditem:UserSwapsAlert)=>{
                  return ditem.timestamp == item.timestamp;
                })
              } />
            ))}
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
