import React, { useState, useRef, useEffect } from 'react';

type ThreePanelProps = {
  disableResize?: boolean;
  children: React.ReactNode[];
  initialDividerPositions?: number[];
};

function ThreePanel({
  children,
  disableResize = false,
  initialDividerPositions = [33, 66],
}: ThreePanelProps) {
  const [dividerPositions, setDividerPositions] = useState(
    initialDividerPositions
  );
  const dividerRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = (index: number) => (e: React.MouseEvent) => {
    if (disableResize) return;
    e.preventDefault();
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || disableResize) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newDividerPosition =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setDividerPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        newPositions[index] = newDividerPosition;
        return newPositions;
      });
    };

    const stopResizing = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  // useEffect(() => {
  //   return () => {
  //     document.removeEventListener('mousemove', () => {});
  //     document.removeEventListener('mouseup', () => {});
  //   };
  // }, []);

  useEffect(() => {
    setDividerPositions(initialDividerPositions);
  }, [initialDividerPositions]);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full">
      <div
        className="h-full"
        style={{ width: `${dividerPositions[0]}%` }}>
        {children[0]}
      </div>
      <div
        ref={dividerRefs[0]}
        onMouseDown={startResizing(0)}
        className={`${
          disableResize ? 'cursor-default' : 'cursor-col-resize'
        } h-full w-2 bg-transparent`}
      />
      <div
        className="h-full"
        style={{
          width: `${dividerPositions[1] - dividerPositions[0]}%`,
        }}>
        {children[1]}
      </div>
      <div
        ref={dividerRefs[1]}
        onMouseDown={startResizing(1)}
        className={`${
          disableResize ? 'cursor-default' : 'cursor-col-resize'
        } h-full w-2 bg-transparent`}
      />
      <div
        className="h-full"
        style={{
          width: `${100 - dividerPositions[1]}%`,
        }}>
        {children[2]}
      </div>
    </div>
  );
}

export { ThreePanel };
