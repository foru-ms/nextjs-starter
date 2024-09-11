import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Threads({ data, limit = Infinity }) {
    const [threads, setThreads] = useState(data || []);

    useEffect(() => {
        setThreads(data);
    }, [data]);

    return (
        <>
            {threads?.slice(0, limit)?.map((thread) => (
                <Link href={`/thread/${thread.id}`} key={thread.id}>
                    <div className="p-5 transition duration-150 ease-in-out hover:bg-gray-100">
                        <div className="md:flex items-center">
                            <div className="w-full">
                                <div className="md:flex items-center justify-between mt-4 md:mt-0 w-full">
                                    <h5 className="text-gray-800 text-base">{thread.title}</h5>
                                    <div className=" text-gray-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon icon-tabler icon-tabler-bookmark"
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
                                            <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="md:mt-1 mt-3 flex  items-center text-gray-600">
                                    <p className="text-gray-600 text-xs">
                                        by <span className="text-blue-500">{thread.user?.username}</span>
                                    </p>
                                    <div className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                                    <p className="text-gray-600 text-xs">{thread.createdAt}</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-gray-600 text-sm">
                            {thread.body.length > 100 ? thread.body.substring(0, 100) + '...' : thread.body}
                        </p>
                        <div className="mt-3 md:flex items-center text-gray-600">
                            <div className="flex items-center md:my-0 my-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-message"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
                                    <line x1={8} y1={9} x2={16} y2={9} />
                                    <line x1={8} y1={13} x2={14} y2={13} />
                                </svg>
                                <p className="ml-2 text-gray-600 text-xs ">{thread._count?.Post} posts</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}
