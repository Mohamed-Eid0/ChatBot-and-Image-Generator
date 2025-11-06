import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
        setError("Please enter a prompt.");
        return;
    };
    
    setError(null);
    setIsLoading(true);
    setImageUrl(null);

    const encodedPrompt = encodeURIComponent(prompt);
    // Pollinations.ai uses a simple URL-based API.
    // We add a random seed to get different images for the same prompt.
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${Date.now()}`;
    
    const img = new Image();
    img.src = url;

    img.onload = () => {
        setImageUrl(url);
        setIsLoading(false);
    };

    img.onerror = () => {
        setError("Could not generate image. Please try another prompt.");
        setIsLoading(false);
    };
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center h-full bg-white">
        <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Image Generator</h2>
            <p className="text-center text-gray-500 mb-6">Describe the image you want to create.</p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you need to create"
                    className="flex-1 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-emerald-500 rounded-full text-white font-semibold hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate
                </button>
            </div>
             {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-2xl mt-8">
        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
          {isLoading ? (
            <div className="text-center">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-gray-600">Generating your masterpiece...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12" />
              <p className="mt-2">Your generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

export default ImageGenerator;