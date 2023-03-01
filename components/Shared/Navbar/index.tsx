import { useRouter } from 'next/router';
import type { FC } from 'react';
import {
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
//import { useEffect, useState, useRef, Fragment } from 'react';

/*function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}*/

export type NavbarProps = {
  addressName?: string
  addressHandle?: string
}


const Navbar: FC<NavbarProps> = () => {
  //const router = useRouter();
  //const isIndexPage = router.pathname === '/'
  

  return (
    <nav className={`w-full mt-1 flex items-center justify-between md:justify-end md:px-4 xl:px-4 h-10 border-b-2 border-gray-300`}>
      {
        <>
          <div className="flex-grow md:flex space-x-2 hidden flex-row-reverse">
            <div><BellIcon className="inline w-6 h-6" /></div>
            {/*<div><MagnifyingGlassIcon className="inline w-6 h-6 mr-8" /></div>*/}
          </div>
        </>
      }
    </nav>
  );
};

export default Navbar;
