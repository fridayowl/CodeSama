import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import ComingSoon from './ComingSoon';

const GitCloneButton: React.FC = () => {
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleClone = () => {
        setShowComingSoon(true);
    };

    return (
        <>
            <button
                onClick={handleClone}
                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                style={{ marginTop: '10px' }} // Add margin-top of 10px
            >
                <GitBranch size={16} className="inline-block mr-1" />
                Clone
            </button>
            {showComingSoon && (
                <ComingSoon
                    feature="Git Clone"
                    onClose={() => setShowComingSoon(false)}
                />
            )}
        </>
    );
};

export default GitCloneButton;
