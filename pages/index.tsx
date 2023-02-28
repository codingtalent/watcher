import Loading from '../components/Shared/Loading';
import clsx from 'clsx';
import React, { useState } from 'react';

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

const fetchPoolsData = async (blockchain, dateRange) => {
  /*const { data: dailyChanges } = await apiQuery({
    query: DailyChangeQuery,
    variables: {
      profileId: Number(profileId),
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    }
  });

  return dailyChanges.DailyChange ?? defaultPublicationData(startDate, endDate);*/
};

export default function Web(data:any) {

  const [blockchain, setBlockchain] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [poolData, setPoolData] = useState([]);

  const changeBlockchain = (e:Event, value:string) => {
    e.preventDefault();
    setBlockchain(value);
    setLoading(true);
    if(blockchain!='' && dateRange!=''){
      (async () => {
        setLoading(true);
        fetchPoolsData(blockchain, dateRange);
      })()
    }
  }
  const changeDate = (e:Event, value:string) => {
    e.preventDefault();
    setDateRange(value);
    if(blockchain!='' && dateRange!=''){
      (async () => {
        setLoading(true);
        fetchPoolsData(blockchain, dateRange);
      })()
    }
  }

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
              <FilterItem key="d1" onClick={(e:Event) => changeDate(e,'1')} name="Today" current={dateRange == '1'} />
              <FilterItem key="d2" onClick={(e:Event) => changeDate(e,'-1')} name="Yesterday" current={dateRange == '-1'} />
              <FilterItem key="d3" onClick={(e:Event) => changeDate(e,'7')} name="7 Days" current={dateRange == '7'} />
              <FilterItem key="d4" onClick={(e:Event) => changeDate(e,'15')} name="15 Days" current={dateRange == '15'} />
              <FilterItem key="d5" onClick={(e:Event) => changeDate(e,'30')} name="30 Days" current={dateRange == '30'} />
            </div>
          </div>
          <div className="md:px-4 xl:px-4 mt-2">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="border border-gray-300 bg-gray-200 capitalize">
                  <th className="text-left font-normal w-2/12 pl-4 py-2">pool_name</th>
                  <th className="text-left font-normal w-1/12">fee_rate</th>
                  <th className="text-left font-normal w-4/12">pool</th>
                  <th className="text-left font-normal w-1/12">block_time</th>
                  <th className="text-left font-normal w-3/12">tx_hash</th>
                  <th className="text-right font-normal w-1/12"></th>
                </tr>
              </thead>
              <tbody>
                {(poolData ?? []).map((item, i) => (
                  <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`pool{i}`}>
                    <td className="pl-4 py-2"></td>
                    <td className=""></td>
                    <td>Latest Swap</td>
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
