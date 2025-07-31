// SearchBar Component
import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';
import useWindowSize from './Hooks/useWindowSize';

interface SearchBarProps {
    searchVal: string
    setSearchVal: (val: string) => void
    handleSearch: () => void
    totalRecipes: number
}

const SearchBar = ({ searchVal, setSearchVal, handleSearch, totalRecipes }: SearchBarProps) => {
    const { width } = useWindowSize(); // Get window width
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="relative flex-1 w-full">
                        {/* Magnifying Glass Icon */}
                        <svg className="absolute left-6 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>

                        {/* Input Field */}
                        <input
                            className="w-full pl-16 pr-16 py-5 text-lg text-gray-900 placeholder-gray-500 bg-white/50 border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder={width < 565 ? 'Search recipes...' : 'Search recipes by name, ingredient, or type...'}
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />

                        {/* Clear Button (X Icon) */}
                        {searchVal.trim() && (
                            <div className="absolute right-6 flex items-center space-x-3">
                                {totalRecipes > 0 && (
                                    <span className="text-sm text-blue-600 font-semibold bg-blue-100 px-3 py-1.5 rounded-full">
                                        {totalRecipes} recipes
                                    </span>
                                )}
                                <button
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                                    onClick={() => setSearchVal('')}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        className="px-8 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl focus:ring-4 focus:outline-none focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl min-w-[140px]"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
