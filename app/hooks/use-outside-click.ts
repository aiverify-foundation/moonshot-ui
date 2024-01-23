import { useEffect } from 'react';

function useOutsideClick(elementIds: string[], callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutsideAll = elementIds.every((id) => {
        const element = document.getElementById(id);
        return element && event.target instanceof Node && !element.contains(event.target);
      });

      if (isOutsideAll) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementIds, callback]);
}

export default useOutsideClick;
