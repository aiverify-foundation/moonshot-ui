import React, { useState, useRef, useEffect } from 'react';

function TwoPanel({ children }) {
  const [dividerPosition, setDividerPosition] = useState(50);
  const dividerRef = useRef(null);
  const containerRef = useRef(null);

  const startResizing = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const containerRect =
      containerRef.current.getBoundingClientRect();
    const newDividerPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setDividerPosition(newDividerPosition);
  };

  const stopResizing = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full"
      style={{ userSelect: 'none' }}>
      <div style={{ width: `${dividerPosition}%`, height: '100%' }}>
        {children[0]}
      </div>
      <div
        ref={dividerRef}
        onMouseDown={startResizing}
        className="cursor-col-resize bg-gray-400"
        style={{ width: '5px', height: '100%' }}
      />
      <div
        style={{
          width: `${100 - dividerPosition}%`,
          height: '100%',
        }}>
        {children[1]}
      </div>
    </div>
  );
}

export default TwoPanel;
