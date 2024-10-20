
import { useEffect, useState } from 'react';
import KeyboardShortcuts from './KeyboardShortcuts';
import { ExtendedBlockData } from './DesignCanvas';

interface KeyboardNavigationProps {
  blocks: ExtendedBlockData[];
  onBlockSelect: (id: string) => void;
  onBlockVisibilityToggle: (id: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPan: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onToggleSettingsPanel: () => void;
}

export function useKeyboardNavigation({
  blocks,
  onBlockSelect,
  onBlockVisibilityToggle,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPan,
  onToggleSettingsPanel
}: KeyboardNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentType, setCurrentType] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmd = event.metaKey || event.ctrlKey;

      if (isCmd) {
        switch (event.key) {
          case 'b':
            cycleBlocks(null);
            break;
          case 'c':
            cycleBlocks('class');
            break;
          case 'f':
            cycleBlocks('class_function');
            break;
          case 'k':
            cycleBlocks('code');
            break;
          case 'v':
            toggleCurrentBlockVisibility();
            break;
          case '=':
            onZoomIn();
            break;
          case '-':
            onZoomOut();
            break;
          case '0':
            onResetZoom();
            break;
          case 'ArrowUp':
            onPan('up');
            break;
          case 'ArrowDown':
            onPan('down');
            break;
          case 'ArrowLeft':
            onPan('left');
            break;
          case 'ArrowRight':
            onPan('right');
            break;
          case ',':
            onToggleSettingsPanel();
            break;
        }
      } else if (currentIndex !== -1) {
        switch (event.key) {
          case 'ArrowRight':
            navigateBlocks(1);
            break;
          case 'ArrowLeft':
            navigateBlocks(-1);
            break;
          case 'Enter':
            selectCurrentBlock();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blocks, currentIndex, currentType]);

  const cycleBlocks = (type: string | null) => {
    if (type === currentType) {
      // If the same key is pressed again, move to the next block of the same type
      navigateBlocks(1);
    } else {
      // If a different key is pressed, reset to the first block of the new type
      setCurrentType(type);
      const filteredBlocks = type ? blocks.filter(block => block.type === type) : blocks;
      setCurrentIndex(filteredBlocks.length > 0 ? 0 : -1);
      if (filteredBlocks.length > 0) {
        onBlockSelect(filteredBlocks[0].id);
      }
    }
  };

  const navigateBlocks = (direction: number) => {
    const filteredBlocks = currentType
      ? blocks.filter(block => block.type === currentType)
      : blocks;

    if (filteredBlocks.length === 0) return;

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredBlocks.length - 1;
    if (newIndex >= filteredBlocks.length) newIndex = 0;

    setCurrentIndex(newIndex);
    onBlockSelect(filteredBlocks[newIndex].id);
  };

  const selectCurrentBlock = () => {
    const filteredBlocks = currentType
      ? blocks.filter(block => block.type === currentType)
      : blocks;

    if (currentIndex >= 0 && currentIndex < filteredBlocks.length) {
      onBlockSelect(filteredBlocks[currentIndex].id);
    }
  };

 const toggleCurrentBlockVisibility = () => {
    const filteredBlocks = currentType
      ? blocks.filter(block => block.type === currentType)
      : blocks;

    if (currentIndex >= 0 && currentIndex < filteredBlocks.length) {
      onBlockVisibilityToggle(filteredBlocks[currentIndex].id);
    }
  };

  return { currentIndex, currentType };
}