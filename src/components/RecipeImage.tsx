import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRecipeSpecificImage, getLocalImage, getFallbackImage } from '../utils/imageUtils';

interface RecipeImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    recipeName?: string; // Add recipe name for specific image matching
    ingredients?: string[]; // Add ingredients for better keyword matching
    sizes?: string; // Add sizes prop for Next.js Image optimization
}

const RecipeImage: React.FC<RecipeImageProps> = ({
    src,
    alt,
    className = '',
    priority = false,
    fill = false,
    width,
    height,
    style = {},
    recipeName = '',
    ingredients = [],
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState<string>('');
    
    useEffect(() => {
        // Try to get a recipe-specific image first, then fallback to local images
        const loadImage = () => {
            try {
                // First, try to get a recipe-specific image
                if (recipeName) {
                    const specificImage = getRecipeSpecificImage(recipeName, ingredients);
                    setImageSrc(specificImage);
                    return;
                }
                
                // If no recipe name, use local images
                const localImage = getLocalImage();
                setImageSrc(localImage);
            } catch (error) {
                console.error('Failed to load local image:', error);
                // Final fallback to static image
                setImageSrc(getFallbackImage());
            }
        };
        
        loadImage();
    }, [recipeName, ingredients]);
    
    const getImageSrc = () => {
        return imageSrc || getFallbackImage();
    };

    const handleError = () => {
        if (!imageError) {
            setImageError(true);
            // Try fallback image on error
            setImageSrc(getFallbackImage());
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Ensure the container has proper styling for fill layout
    const containerStyle = fill ? {
        position: 'relative' as const,
        width: '100%',
        height: '100%',
        minHeight: 'inherit',
        ...style
    } : style;

    return (
        <div 
            className={`${className} ${fill ? 'relative w-full h-full' : ''}`}
            style={containerStyle}
        >
            <Image
                src={getImageSrc()}
                alt={alt}
                fill={fill}
                width={width}
                height={height}
                sizes={fill ? sizes : undefined}
                style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    ...(fill && { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 })
                }}
                priority={priority}
                onError={handleError}
                onLoad={handleLoad}
                className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 animate-pulse flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-3 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                        <div className="text-orange-600 text-sm mt-3 font-medium">Loading...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeImage; 