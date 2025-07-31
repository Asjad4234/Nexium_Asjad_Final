import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ClockIcon, FireIcon } from '@heroicons/react/24/solid';
import SearchBar from '../components/SearchBar';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Loading from '../components/Loading';
import PopularTags from '../components/PopularTags';
import { preloadImages } from '../utils/imageUtils';
import { staticRecipes, staticPopularTags, filterRecipesBySearch, filterRecipesByTag } from '../data/staticRecipes';
import { ExtendedRecipe } from '../types';

const Home = () => {
    const router = useRouter();
    const [searchVal, setSearchVal] = useState('');
    const [sortOption, setSortOption] = useState<'recent'>('recent');
    const [searchTrigger, setSearchTrigger] = useState<true | false>(false);
    const [activeTag, setActiveTag] = useState<string>('');
    const [filteredRecipes, setFilteredRecipes] = useState<ExtendedRecipe[]>(staticRecipes);
    const [loading, setLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastRecipeRef = useRef<HTMLDivElement | null>(null);

    // Preload local images for better performance
    useEffect(() => {
        preloadImages();
    }, []);

    // Filter recipes based on search query and active tag
    useEffect(() => {
        if (searchTrigger) {
            setLoading(true);
            // Simulate API delay
            setTimeout(() => {
                let filtered = staticRecipes;
                
                // First filter by tag if active
                if (activeTag) {
                    filtered = filterRecipesByTag(filtered, activeTag);
                }
                
                // Then filter by search query
                if (searchVal.trim()) {
                    filtered = filterRecipesBySearch(filtered, searchVal);
                }
                
                setFilteredRecipes(filtered);
                setLoading(false);
                setSearchTrigger(false);
            }, 300);
        }
    }, [searchVal, searchTrigger, activeTag]);

    // Reset recipes when search and tag are cleared
    useEffect(() => {
        if (!searchVal.trim() && !activeTag) {
            setFilteredRecipes(staticRecipes);
        }
    }, [searchVal, activeTag]);

    const handleSearch = useCallback(() => {
        if (!searchVal.trim()) return;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = null;
        }

        searchTimeout.current = setTimeout(() => {
            setSearchTrigger(true);
        }, 500);
    }, [searchVal]);

    const sortRecipes = (option: 'recent') => {
        if (sortOption === option) return;
        setSortOption(option);
        // For static data, we can sort by creation date
        const sorted = [...filteredRecipes].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFilteredRecipes(sorted);
    };

    const handleTagSearch = async (tag: string) => {
        // Clear search when clicking a tag
        setSearchVal('');
        
        if (activeTag === tag) {
            // If clicking the same tag, clear it
            setActiveTag('');
            setFilteredRecipes(staticRecipes);
        } else {
            // Set new active tag and filter recipes
            setActiveTag(tag);
            setLoading(true);
            setTimeout(() => {
                const filtered = filterRecipesByTag(staticRecipes, tag);
                setFilteredRecipes(filtered);
                setLoading(false);
            }, 300);
        }
    };

    const handleRecipeListUpdate = (recipe: ExtendedRecipe | null, deleteId?: string) => {
        if (deleteId) {
            setFilteredRecipes(prev => prev.filter(r => r._id !== deleteId));
        } else if (recipe) {
            setFilteredRecipes(prev => prev.map(r => r._id === recipe._id ? recipe : r));
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <div className="relative min-h-screen" style={{
                backgroundImage: 'url(/images/bg3.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                
                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
                    {/* Brand/Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Fresh Recipe Glow</h2>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Discover Amazing <span className="text-orange-500">Recipes</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                        From quick weeknight dinners to gourmet weekend projects, find the perfect recipe for every occasion.
                    </p>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <button 
                            onClick={() => {
                                const recipesSection = document.getElementById('recipes-section');
                                if (recipesSection) {
                                    recipesSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            Explore Recipes
                        </button>
                        <button 
                            onClick={() => router.push('/CreateRecipe')}
                            className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            Create Recipe
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search for delicious recipes..."
                                    className="flex-1 bg-transparent text-white placeholder-gray-300 px-4 py-3 outline-none"
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div id="recipes-section" className="bg-white">
                <div className="container mx-auto px-4 py-12">
                    {/* Results Count */}
                    {filteredRecipes.length > 0 && (
                        <div className="text-center mb-8">
                            <p className="text-gray-600 text-lg">
                                Found {filteredRecipes.length} delicious recipe{filteredRecipes.length !== 1 ? 's' : ''}
                                {activeTag && ` in "${activeTag}"`}
                                {searchVal.trim() && ` matching "${searchVal}"`}
                            </p>
                        </div>
                    )}

                    {/* Popular Tags */}
                    <PopularTags tags={staticPopularTags} onTagToggle={handleTagSearch} searchVal={searchVal} />

                    {/* Recipes Grid */}
                    <ViewRecipes
                        recipes={filteredRecipes}
                        handleRecipeListUpdate={handleRecipeListUpdate}
                        lastRecipeRef={lastRecipeRef}
                    />

                    {/* End Message */}
                    {!loading && filteredRecipes.length > 0 && (
                        <div className="text-center mt-12">
                            <p className="text-gray-500 text-lg">You've seen all the amazing recipes!</p>
                        </div>
                    )}

                    {/* No Results Message */}
                    {!loading && filteredRecipes.length === 0 && (searchVal.trim() || activeTag) && (
                        <div className="text-center mt-12">
                            <p className="text-gray-500 text-lg">
                                No recipes found
                                {activeTag && ` for "${activeTag}"`}
                                {searchVal.trim() && ` matching "${searchVal}"`}
                                . Try a different search term or category.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <FloatingActionButtons />

            {/* Show loading indicator when fetching */}
            {loading && <Loading />}
        </div>
    );
};

export default Home;
