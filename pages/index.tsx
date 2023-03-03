import Loading from '../components/Shared/Loading';
import clsx from 'clsx';
import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

export type ItemProps = {
  name: string
  current: boolean
  onClick?: any
}

const FilterItem = ({ name, current, onClick }: ItemProps) => {
  return (
    <div onClick={onClick}  className={clsx(
      'cursor-pointer leading-6 py-2 px-4 rounded',
      {
        'bg-blue-600 text-white ': current,
        'bg-blue-100 text-purple-800 ':
          !current
      }
    )}>{name}</div>
  );
};

const fetchPoolsData = async (blockchain: string, dateRange: number) => {
  let formatDate = moment().subtract(dateRange, 'days').format('YYYY-MM-DD');
  const res = await axios.get("/api/dune/2056212?blockchain=" + blockchain + "&start_datetime=" + formatDate).catch(function (error) {
    return { data: { data: {}}};
  });;
  
  /*let result = await fetch("/api/dune/2056212?blockchain=" + blockchain + "&start_datetime=" + formatDate,{
        method: 'get',
  })
  let res = await result.json() //必须通过此方法才可返回数据*/
  //console.log(res);
  return res.data;
};

export default function Web(data:any) {

  const [blockchain, setBlockchain] = useState('');
  const [dateRange, setDateRange] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [poolData, setPoolData] = useState([]);
  let intervalTimer:any = 0;

  const timerQuery = (blockchain: string, dateRange: number) => {
    intervalTimer = setInterval(() => {
      (async () => {
        let res = await fetchPoolsData(blockchain, dateRange);
        if(res.data.result!=undefined){
          setPoolData(res.data.result.rows);
          clearInterval(intervalTimer);
          setLoading(false);
        }
      })()
    }, 9000);
  }
  const changeBlockchain = (e:Event, value:string) => {
    e.preventDefault();
    setBlockchain(value);

    if(value!='' && dateRange!=-1){
      (async () => {
        setLoading(true);
        let res = await fetchPoolsData(value, dateRange);
        if(res.data.result==undefined){
          timerQuery(value, dateRange);
        }
        else{
          setPoolData(res.data.result.rows);
          setLoading(false);
        }
      })()
    }
  }
  const changeDate = (e:Event, value:number) => {
    e.preventDefault();
    setDateRange(value);
    if(blockchain!='' && value!=-1){
      (async () => {
        setLoading(true);
        let res = await fetchPoolsData(blockchain, value);
        //console.log(res);
        if(res.data.result==undefined){
          timerQuery(blockchain, value);
        }
        else{
          setPoolData(res.data.result.rows);
          setLoading(false);
        }
      })()
    }
  }
  //console.log(moment().subtract(1, 'months').format('YYYY-MM-DD'),moment().subtract(1, 'days').format('YYYY-MM-DD'));

  return (
    <div className="page_content">
      <div className="flex items-center text-left py-12 px-4 sm:px-6 lg:px-8">
        { loading && <Loading />}
        <div className="w-full space-y-8 mt-5">
          <h2 className="mt-6 text-left text-4xl font-bold tracking-tight text-gray-900">
            New Pools
          </h2>
          <div className="flex flex-col space-y-8">
            <div className="flex gap-4">
              <h3 className="leading-10">Select Blockchain</h3>
              <FilterItem key="ethereum" onClick={(e:Event) => changeBlockchain(e,'ethereum')} name="Ethereum" current={blockchain == 'ethereum'} />
              <FilterItem key="arbitrum" onClick={(e:Event) => changeBlockchain(e,'arbitrum')} name="Arbitrum" current={blockchain == 'arbitrum'} />
              <FilterItem key="optimism" onClick={(e:Event) => changeBlockchain(e,'optimism')} name="Optimism" current={blockchain == 'optimism'} />
              <FilterItem key="polygon" onClick={(e:Event) => changeBlockchain(e,'polygon')} name="Polygon" current={blockchain == 'polygon'} />
            </div>
            <div className="flex gap-4">
              <h3 className="leading-10">Date Range</h3>
              <FilterItem key="d1" onClick={(e:Event) => changeDate(e,0)} name="Today" current={dateRange == 0} />
              <FilterItem key="d2" onClick={(e:Event) => changeDate(e,1)} name="Yesterday" current={dateRange == 1} />
              <FilterItem key="d3" onClick={(e:Event) => changeDate(e,7)} name="7 Days" current={dateRange == 7} />
              <FilterItem key="d4" onClick={(e:Event) => changeDate(e,15)} name="15 Days" current={dateRange == 15} />
              <FilterItem key="d5" onClick={(e:Event) => changeDate(e,30)} name="30 Days" current={dateRange == 30} />
            </div>
          </div>
          <div className="mt-2">
            <table className="w-full border-collapse border border-gray-300 table-fixed text-sm">
              <thead>
                <tr className="border border-gray-300 bg-gray-200 capitalize">
                  <th className="text-left font-normal w-1/12 pl-4 py-2">pool_name</th>
                  <th className="text-left font-normal w-1/12">fee_rate</th>
                  <th className="text-left font-normal w-4/12">pool</th>
                  <th className="text-left font-normal w-1/12">block_time</th>
                  <th className="text-left font-normal w-3/12">tx_hash</th>
                  <th className="text-right font-normal w-2/12"></th>
                </tr>
              </thead>
              <tbody>
                {(poolData ?? []).map((item:any, i) => (
                  <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`pool${i}`}>
                    <td className="pl-4 py-2">{item.pool_name}</td>
                    <td className="">{item.fee_rate}</td>
                    <td className="">{item.pool}</td>
                    <td className="">{moment(item.block_time).format("YYYY-MM-DD")}</td>
                    <td className="" title={item.tx_hash}><div className="truncate w-11/12">{item.tx_hash}</div></td>
                    <td>
                      <a href={`/swaps?blockchain=${blockchain}&address=${item.pool}`} className="mr-2 text-blue-600">Latest Swap</a>
                      <a href={`/alert?blockchain=${blockchain}&address=${item.pool}`} className="text-blue-600">Swap Alert</a>
                    </td>
                  </tr>
                ))}
                {
                  (!poolData || !poolData.length) && (
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
