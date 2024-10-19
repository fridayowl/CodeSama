import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonProps {
    feature: string;
    onClose: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ feature, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Coming Soon</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        &times;
                    </button>
                </div>
                <div className="flex items-center justify-center mb-4">
                    <Clock size={48} className="text-blue-500" />
                </div>
                <p className="text-center text-gray-600 mb-4">
                    The {feature} feature is coming soon! We're working hard to bring you this functionality.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;