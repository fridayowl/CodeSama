import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import ComingSoon from './ComingSoon';

interface ShareFlowProps {
    canvasRef: React.RefObject<HTMLDivElement>;
}

const ShareFlow: React.FC<ShareFlowProps> = ({ canvasRef }) => {
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleShare = async () => {
        if (canvasRef.current) {
            try {
                const canvas = await html2canvas(canvasRef.current);
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = image;
                link.download = 'flow-screenshot.png';
                link.click();
            } catch (error) {
                console.error("Error creating screenshot:", error);
                setShowComingSoon(true);
            }
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                title="Share Flow"
            >
                <Share2 size={16} className="mr-2" />
                Share Flow
            </button>
            {showComingSoon && (
                <ComingSoon
                    feature="Flow Screenshot"
                    onClose={() => setShowComingSoon(false)}
                />
            )}
        </>
    );
};

export default ShareFlow;