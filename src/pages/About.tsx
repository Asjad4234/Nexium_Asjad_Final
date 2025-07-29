import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const About = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-r from-brand-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">About Smart Recipe Generator</h1>
                        <div className="w-20"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* App Logo and Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-100 rounded-full mb-6">
                            <Image
                                src="/favicon.ico"
                                alt="Smart Recipe Generator Logo"
                                width={48}
                                height={48}
                                className="rounded-lg"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Smart Recipe Generator
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            An AI-powered recipe generation platform that creates delicious, personalized recipes 
                            based on your available ingredients and dietary preferences.
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">AI Recipe Generation</h4>
                                        <p className="text-gray-600 text-sm">Powered by Google Gemini AI to create unique recipes from your ingredients</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">Dietary Preferences</h4>
                                        <p className="text-gray-600 text-sm">Support for vegetarian, vegan, gluten-free, and other dietary restrictions</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">Smart Ingredient Management</h4>
                                        <p className="text-gray-600 text-sm">Comprehensive ingredient database with validation and suggestions</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">Recipe Chat Assistant</h4>
                                        <p className="text-gray-600 text-sm">Get cooking tips, substitutions, and answers to your recipe questions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h3>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                                    <p className="text-gray-600 text-sm">Next.js, React, TypeScript, Tailwind CSS</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                                    <p className="text-gray-600 text-sm">Next.js API Routes, MongoDB, NextAuth.js</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">AI & Automation</h4>
                                    <p className="text-gray-600 text-sm">Google Gemini AI, n8n Workflows</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                                    <p className="text-gray-600 text-sm">Google OAuth, NextAuth.js</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">How It Works</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">Select Ingredients</h4>
                                <p className="text-gray-600 text-sm">Choose from our extensive ingredient database or add your own</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">Set Preferences</h4>
                                <p className="text-gray-600 text-sm">Specify dietary restrictions and cooking preferences</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">Generate Recipes</h4>
                                <p className="text-gray-600 text-sm">AI creates personalized recipes with instructions and tips</p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center bg-brand-50 rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Start Cooking?</h3>
                        <p className="text-gray-600 mb-6">
                            Create your first AI-generated recipe today and discover new culinary possibilities!
                        </p>
                        <button
                            onClick={() => router.push('/CreateRecipe')}
                            className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors"
                        >
                            Create Your First Recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 