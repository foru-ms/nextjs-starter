import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Cookies from 'js-cookie';
import useForumsApi from "@/hooks/data/useForumsApi";

const Sidebar = () => {
    const [isMobileNavHidden, setIsMobileNavHidden] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const api = useForumsApi();

    const sidebarHandler = () => {
        setIsMobileNavHidden(!isMobileNavHidden);
    };

    
    useEffect(() => {
        const getUser = async (token) => {
            const userResponse = await api.fetchUser(token);
            if (userResponse?.id){
                setIsLoggedIn(true);
            }
        };
  
        const forumUserToken = Cookies.get('forumUserToken');
  
        forumUserToken && getUser(forumUserToken);
      }, []);

    return (
        <div className="min-h-screen border-r border-gray-100 sticky top-0 h-full bg-gray-100 z-20">
            <div className="relative top-0 min-h-screen bottom-0 flex items-center flex-col p-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-menu-2 cursor-pointer mt-4"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#718096"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={sidebarHandler}
                >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1={4} y1={6} x2={20} y2={6} />
                    <line x1={4} y1={12} x2={20} y2={12} />
                    <line x1={4} y1={18} x2={20} y2={18} />
                </svg>
                <ul aria-orientation="vertical" className="rounded py-8">
                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-1 hover:text-blue-700 focus:text-blue-700 focus:outline-none">
                        <Link href="/">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-grid"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x={4} y={4} width={6} height={6} rx={1} />
                                <rect x={14} y={4} width={6} height={6} rx={1} />
                                <rect x={4} y={14} width={6} height={6} rx={1} />
                                <rect x={14} y={14} width={6} height={6} rx={1} />
                            </svg>
                        </Link>
                    </li>
                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-6 py-1 hover:text-blue-700 focus:text-blue-700 focus:outline-none flex items-center">
                        <Link href={isLoggedIn ? `/logout` : `/login` }>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-users"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx={9} cy={7} r={4} />
                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
            <div
                className={`absolute top-0 min-h-screen ml-10 flex items-start flex-col bg-gray-100 transition duration-150 ease-in-out ${isMobileNavHidden ? 'hidden' : ''}`}
                id="mobile-nav"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-0 pointer-events-none icon icon-tabler icon-tabler-menu-2 cursor-pointer mt-8"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#718096"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={sidebarHandler}
                >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1={4} y1={6} x2={20} y2={6} />
                    <line x1={4} y1={12} x2={20} y2={12} />
                    <line x1={4} y1={18} x2={20} y2={18} />
                </svg>
                <ul
                    aria-orientation="vertical"
                    className="rounded py-8 pl-2 pr-32 whitespace-no-wrap"
                >
                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-blue-700 focus:text-blue-700 focus:outline-none">
                        <Link href="/" className="ml-2">
                            Home
                        </Link>
                    </li>
                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-6 py-2 hover:text-blue-700 focus:text-blue-700 focus:outline-none flex items-center">
                        {isLoggedIn ? (
                        <Link href="/logout" className="ml-2">Logout</Link>
                        ) : (
                            <Link href="/login" className="ml-2">Login/Register</Link>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;