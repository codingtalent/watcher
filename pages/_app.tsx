import '../styles/globals.css'
import Loading from '../components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense, useEffect} from 'react';
import Head from "next/head";
import {db, UserSwapsAlert, UserSwapsAlertDetails} from '../lib/dexieDB';
import axios from 'axios';
import moment from 'moment';

const Providers: any = lazy(() => import('../components/Common/Providers'));

const fetchSwapsAlertData = async (formatDate: string, blockchain: string, pool: string, amount: number) => {
  const res = await axios.get("/api/dune/2056547?blockchain=" + blockchain + "&current_hour_minute=" + 'formatDate' + "&pool=" + pool + "&trade_amount_usd=" + amount);
  return res.data;
};

const MyApp = ({ Component, pageProps }: AppProps) => {

  let intervalTimer:any = null;

  const timerQuery = async (blockchain: string, pool: string, amount: number) => {
    clearInterval(intervalTimer);
    let timestamp = moment().valueOf();
    let formatDate = moment().format('YYYY-MM-DD hh:mm:00');
    intervalTimer = setInterval(() => {
      (async () => {
        let res = await fetchSwapsAlertData(formatDate, blockchain, pool, amount);
        if(res.data.result!=undefined){
          if(res.data.result.rows.length > 0){
            let arr: UserSwapsAlertDetails[] = [];
            res.data.result.rows.forEach(element => {
              arr.push({
                block_time: element.block_time,
                amount_usd: element.amount_usd,
                token_pair: element.token_pair,
                taker: element.taker,
                tx_hash: element.tx_hash,
                project_contract_address: element.project_contract_address,
                timestamp: timestamp
              });
            });
            await db.setUserSwapsAlert(timestamp, arr);
          }
          clearInterval(intervalTimer);
        }
      })()
    }, 9000);
  }


  useEffect(() => {
    let intervalAlertTimer = setInterval(() => {
      (async () => {
        let swapsAlertPool:any = await db.getSwapsAlertPool();
        if(typeof(swapsAlertPool)!=undefined){
          timerQuery(swapsAlertPool.blockchain, swapsAlertPool.pool_address, swapsAlertPool.threshold);
        }
      })()
    }, 1000 * 60 * 5); // five minute

    return () => {
      clearInterval(intervalAlertTimer); // clearing interval
      clearInterval(intervalTimer);
    }

  });

  return (
    <>
      <Head><title>{pageProps.pageTitle?? 'Watcher'}</title></Head>
      <Suspense fallback={<Loading />}>
        <Providers {...pageProps}>
          <Component {...pageProps} />
        </Providers>
      </Suspense>
    </>
  );
};

export default MyApp;
