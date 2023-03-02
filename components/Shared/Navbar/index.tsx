//import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import {db, UserSwapsAlert} from '../../../lib/dexieDB';
import {
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export type NavbarProps = {
  alertNumber?: number
}


const Navbar: FC<NavbarProps> = () => {

  const [alertNumber, setAlertNumber] = useState(0);

  const queryAlert = async () => {
    let count: number = await db.getUserSwapsAlertCount();
    //console.log(count);
    setAlertNumber(count);
  }

  useEffect(() => {
    queryAlert();
    const timer = setInterval(() => {
      queryAlert();
    }, 1000 * 60);  //60 second

    return () => clearInterval(timer); // clearing interval

  });

  

  return (
    <nav className={`w-full mt-1 flex items-center justify-between md:justify-end md:px-4 xl:px-4 h-10 border-b-2 border-gray-300`}>
      {
        <>
          <div className="flex-grow md:flex space-x-2 hidden flex-row-reverse">
            <div className="relative cursor-pointer">
              <a href="/alert"><BellIcon className="inline w-8 h-8" />
              {
                alertNumber > 0 && (
                  <div className="rounded-full bg-red-500 text-white leading-3 text-center p-1 text-xs min-w-[20px] min-h-[20px] absolute right-[-4px] top-[-4px]">{alertNumber >99 ? `99+` : `${alertNumber}`}</div>
                )
              }</a>
            </div>
            {/*<div><MagnifyingGlassIcon className="inline w-6 h-6 mr-8" /></div>*/}
          </div>
        </>
      }
    </nav>
  );
};

export default Navbar;
