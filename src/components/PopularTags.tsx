import { useState, useEffect } from "react";
import Image from 'next/image';
import useWindowSize from "./Hooks/useWindowSize";
import tagLoad from '../assets/tagload.gif';

interface Tag {
    _id: string;
    count: number;
}

interface PopularTagsProps {
    tags: Tag[];
    onTagToggle: (activeTag: string) => void;
    searchVal: string;
}

const PopularTags = ({ tags, onTagToggle, searchVal }: PopularTagsProps) => {
    const [activeTag, setActiveTag] = useState<string>('');

    const { width } = useWindowSize();

    useEffect(() => {
        if (!searchVal.trim()) {
            setActiveTag('');
        }
    }, [searchVal]);

    const handleTagClick = (tag: string) => {
        const newActiveTag = activeTag === tag ? '' : tag;
        setActiveTag(newActiveTag);
        onTagToggle(newActiveTag);
    };

    // Adjust tag display count based on screen size
    const sliceAmount = width < 640 ? 6 : width < 1024 ? 8 : 10;

    return (
        <div className='w-full mb-12'>
            <div className='text-center mb-8'>
                <h2 className='text-4xl font-bold text-gray-900 mb-3'>Popular Categories</h2>
                <p className='text-gray-600 text-lg'>Browse recipes by popular tags and dietary preferences.</p>
            </div>
            <div className='flex flex-wrap justify-center gap-3'>
                {tags.length === 0 ? (
                    <div className='flex items-center justify-center w-full py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500'></div>
                    </div>
                ) : (
                    tags.slice(0, sliceAmount).map(({ _id, count }) => (
                        <button
                            key={_id}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                                activeTag === _id
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                            }`}
                            onClick={() => handleTagClick(_id)}
                        >
                            {_id} 
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                activeTag === _id 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-orange-100 text-orange-700'
                            }`}>
                                {count}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default PopularTags;
