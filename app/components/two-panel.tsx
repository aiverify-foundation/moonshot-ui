import React, { useState, useRef, useEffect } from 'react';

type TwoPanelProps = {
  disableResize?: boolean;
  children: React.ReactNode[];
  initialDividerPosition?: number;
};

function TwoPanel({
  children,
  disableResize = false,
  initialDividerPosition = 40,
}: TwoPanelProps) {
  const [dividerPosition, setDividerPosition] = useState(
    initialDividerPosition
  );
  const dividerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    if (disableResize) return;
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || disableResize) return;
    const containerRect = containerRef.current.getBoundingClientRect();
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

  useEffect(() => {
    setDividerPosition(initialDividerPosition);
  }, [initialDividerPosition]);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full select-none">
      <div
        className="h-full"
        style={{ width: `${dividerPosition}%` }}>
        {children[0]}
      </div>
      <div
        ref={dividerRef}
        onMouseDown={startResizing}
        className={`
          ${disableResize ? 'cursor-default' : 'cursor-col-resize'} h-full w-2 bg-transparent`}
      />
      <div
        className="h-full"
        style={{
          width: `${100 - dividerPosition}%`,
        }}>
        {children[1]}
      </div>
    </div>
  );
}

export default TwoPanel;
