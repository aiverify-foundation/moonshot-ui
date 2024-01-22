import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { throttle } from '../lib/throttle';

enum WindowState {
  drag,
  resize,
  default,
}

function Window(props: {
  id?: string;
  name: string;
  initialXY?: [number, number];
  initialWindowSize?: [number, number];
  backgroundColor?: string;
  boxShadowStyle?: string;
  resizeHandleSize?: number;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  contentAreaStyles?: React.CSSProperties;
  resizeable?: boolean;
  disableCloseIcon?: boolean;
  onCloseClick?: () => void;
  onWindowChange?: (x: number, y: number, width: number, height: number, id: string) => void;
}) {
  const {
    id,
    name,
    initialXY = [180, 140],
    initialWindowSize = [640, 470],
    styles,
    contentAreaStyles,
    resizeable = true,
    backgroundColor = '#00000080',
    boxShadowStyle = '0px 10px 10px #00000047',
    children,
    resizeHandleSize = 10,
    disableCloseIcon = false,
    onCloseClick,
    onWindowChange,
  } = props;
  const [windowState, setWindowState] = useState<WindowState>(WindowState.default);
  const [initialPosition, setInitialPosition] = useState(initialXY);
  const [windowSize, setWindowSize] = useState(initialWindowSize);
  const windowRef = useRef<HTMLDivElement>(null);
  const prevMouseXY = useRef([0, 0]);

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    if (!windowRef.current) return;
    prevMouseXY.current = [e.clientX, e.clientY];
    setWindowState(WindowState.drag);
  }

  function handleContentAreaMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function handleCloseIconMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleResizeMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    if (!windowRef.current) return;
    prevMouseXY.current = [e.clientX, e.clientY];
    setWindowState(WindowState.resize);
  }

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!windowRef.current || windowState !== WindowState.resize) return;
    const dx = e.clientX - prevMouseXY.current[0];
    const dy = e.clientY - prevMouseXY.current[1];
    prevMouseXY.current = [e.clientX, e.clientY];
    setWindowSize((prev) => [prev[0] + dx, prev[1] + dy]);
  };

  function handleMouseUp() {
    if (!windowRef.current || windowState !== WindowState.drag) return;
    setWindowState(WindowState.default);
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
    const windowDomRect = windowRef.current.getBoundingClientRect();
    setInitialPosition([windowDomRect.x, windowDomRect.y]);
    windowRef.current.style.removeProperty('transform');
    if (onWindowChange) {
      onWindowChange(windowDomRect.x, windowDomRect.y, windowSize[0], windowSize[1], id || name);
    }
  }

  function handleResizeMouseUp() {
    if (!windowRef.current || windowState !== WindowState.resize) return;
    setWindowState(WindowState.default);
    document.body.removeEventListener('mousemove', handleResizeMouseMove);
    document.body.removeEventListener('mouseup', handleResizeMouseUp);
    if (onWindowChange) {
      onWindowChange(
        initialPosition[0],
        initialPosition[1],
        windowSize[0],
        windowSize[1],
        id || name
      );
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!windowRef.current || windowState !== WindowState.drag) return;

    windowRef.current.style.transform = `translate(${e.clientX - prevMouseXY.current[0]}px, ${
      e.clientY - prevMouseXY.current[1]
    }px)`;
  }

  useEffect(() => {
    if (windowState === WindowState.drag) {
      document.body.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseup', handleMouseUp);
    } else if (windowState === WindowState.resize) {
      document.body.addEventListener('mousemove', handleResizeMouseMove);
      document.body.addEventListener('mouseup', handleResizeMouseUp);
    }
  }, [windowState]);

  useEffect(() => {
    setInitialPosition(initialXY);
  }, []);

  return (
    <div
      ref={windowRef}
      style={{
        userSelect: 'none',
        position: 'absolute',
        left: initialPosition[0],
        top: initialPosition[1],
        backgroundColor,
        boxShadow: boxShadowStyle,
        backdropFilter: 'blur(10px)',
        width: windowSize[0],
        height: windowSize[1],
        padding: 15,
        paddingTop: 5,
        color: '#FFF',
        ...styles,
      }}
      onMouseDown={handleMouseDown}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: 14,
            paddingBottom: 5,
          }}>
          {name}
        </div>
        {!disableCloseIcon ? (
          <Image
            src="icons/close_icon.svg"
            alt="close"
            width={16}
            height={16}
            style={{
              cursor: 'pointer',
            }}
            onClick={onCloseClick}
            onMouseDown={handleCloseIconMouseDown}
          />
        ) : null}
      </div>
      <div
        style={{
          background: '#ebeaea',
          width: '99.8%',
          height: '94.5%',
          overflowY: 'scroll',
          overflow: 'hidden',
          ...contentAreaStyles,
        }}
        onMouseDown={handleContentAreaMouseDown}>
        {children}
      </div>
      {resizeable ? (
        <div
          style={{
            width: resizeHandleSize,
            height: resizeHandleSize,
            cursor: 'se-resize',
            borderRight: '2px solid white',
            borderBottom: '2px solid white',
            bottom: 0,
            right: 0,
            position: 'absolute',
          }}
          onMouseDown={handleResizeMouseDown}
        />
      ) : null}
    </div>
  );
}

export { Window };
