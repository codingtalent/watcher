import '../styles/globals.css'
import Loading from '../components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense, useEffect} from 'react';
import Head from "next/head";

const Providers: any = lazy(() => import('../components/Common/Providers'));

const MyApp = ({ Component, pageProps }: AppProps) => {

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
