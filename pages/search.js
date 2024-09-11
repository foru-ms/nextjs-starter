import { useState, useCallback } from 'react';
import useForumsApi from '@/hooks/data/useForumsApi';

export default function Search({ onSearchResults }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('Threads');
    const [isSubmitting, setSubmittingState] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSubmittingState(true);
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: searchQuery,
                    type: searchType.toLowerCase()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const searchData = await response.json();
            console.log('Search results:', searchData);
            onSearchResults(searchData.threads);
        } catch (error) {
            console.error('Error searching:', error);
        }

        setSubmittingState(false);
    };

    return (
        <div className="w-full md:w-1/2 pb-3 md:pb-0 md:pr-3 md:border-r border-gray-300">
            <h3 className="text-xl text-gray-900 mb-2">
                Search for threads
            </h3>
            <form onSubmit={handleSearch}>
                <div className="flex flex-col">
                    <label
                        htmlFor="search"
                        className="hidden text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                    />
                    <div className="relative w-full mb-2">
                        <div className="absolute text-gray-600 flex items-center pl-4 h-full cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-search"
                                width={18}
                                height={18}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx={10} cy={10} r={7} />
                                <line x1={21} y1={21} x2={15} y2={15} />
                            </svg>
                        </div>
                        <input
                            id="search"
                            className="text-gray-600 focus:outline-none focus:border focus:border-blue-700 font-normal w-full h-10 flex items-center pl-12 text-sm border-gray-300 rounded border bg-gray-100"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-full md:w-1/2">
                        <div className="relative w-full z-10">
                            <div className="absolute z-0 inset-0 m-auto mr-2 xl:mr-4 z-0 w-5 h-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon cursor-pointer icon-tabler icon-tabler-chevron-down"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#a0aec0"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <select
                                aria-label="Selected tab"
                                className="relative z-10 cursor-pointer focus:outline-none focus:border-gray-800 focus:shadow-outline-gray text-sm form-select block w-full py-2 px-2 xl:px-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option key="threads" value="Threads" className="text-sm text-gray-600">
                                    Threads
                                </option>
                                <option key="posts" value="Posts" className="text-sm text-gray-600">
                                    Posts
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 md:flex justify-end">
                        <button
                            className="bg-gray-800 text-sm text-white rounded hover:bg-gray-600 transition duration-150 ease-in-out py-2 px-6 sm:mt-0 mt-4"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}