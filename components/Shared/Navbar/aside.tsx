import type { FC } from 'react';
import Link from 'next/link';
import Menu from '../Navbar/menu';
//import Menu from '@components/Shared/Navbar/menu';
import Image from 'next/image'
import Logo from '../../../public/icon.svg';

const Aside: FC = () => {
  return (
    <aside className='bg-gray-500 hidden md:order-first h-screen md:flex md:flex-col w-60'>
      <div className='flex-grow-0 flex-shrink-0 text-center border-b-2 border-gray-300'>
        <Link href="/" className="inline-block my-10 text-white">
          LOGO
          {/*<Image
            className="w-auto h-10 mt-2 mb-8"
            src={Logo}
            alt="Uniswap New Pools Watcher"
          priority/>*/}
        </Link>
      </div>
      <div className='flex-grow w-inherit overflow-y-auto h-full mt-4'>
        <Menu />
      </div>
    </aside>
  );
};

export default Aside;
