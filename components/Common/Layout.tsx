import Head from 'next/head';
//import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
//import { Toaster } from 'react-hot-toast';
import Aside from '../Shared/Navbar/aside';
import Navbar from '../Shared/Navbar';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  //const { resolvedTheme } = useTheme();

  return (
    <>
      <Head>
        <meta name="theme-color" content='#ffffff' />
      </Head>
      <div id="content-wrapper" className='w-full mx-auto h-screen flex overflow-hidden bg-gray-50'>
        <Aside />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
