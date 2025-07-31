import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

/**
 * FloatingActionButtons Component
 * 
 * This component provides:
 * - A "Create Recipe" button (always visible).
 * - A "Scroll to Top" button (appears after scrolling down).
 */
const FloatingActionButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300); // Show scroll button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-50">
      {/* "Create Recipe" Button (Always Visible) */}
      <button
        onClick={() => router.push('/CreateRecipe')}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110"
        aria-label="Create Recipe"
      >
        <PlusIcon className="h-7 w-7" />
      </button>

      {/* Scroll to Top Button (Appears on Scroll) */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-white text-orange-600 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-xl hover:bg-gray-50 border border-gray-200 transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to Top"
        >
          <ArrowUpIcon className="h-7 w-7" />
        </button>
      )}
    </div>
  );
};

export default FloatingActionButtons;
