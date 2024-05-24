import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { updateFocusedWindowId } from '@/lib/redux/slices/windowsSlice';
import { Icon, IconName } from './IconSVG';
import { debounce } from '@app/lib/throttle';
import { Z_Index } from '@views/moonshot-desktop/constants';

enum WindowState {
  drag,
  resize,
  default,
}

type WindowProps = {
  id: string;
  name?: string;
  header?: React.ReactNode;
  initialXY?: [number, number];
  initialWindowSize?: [number, number];
  initialScrollTop?: number;
  zIndex?: number | 'auto';
  minWidth?: number;
  minHeight?: number;
  backgroundColor?: string;
  styles?: React.CSSProperties;
  contentAreaStyles?: React.CSSProperties;
  headerAreaStyles?: React.CSSProperties;
  resizeable?: boolean;
  disableCloseIcon?: boolean;
  draggable?: boolean;
  leftFooterText?: string;
  footerHeight?: number;
  disableFadeIn?: boolean;
  disableOnScroll?: boolean;
  children?: React.ReactNode;
  topBar?: React.ReactNode;
  resizeHandlerColor?: React.CSSProperties['color'];
  onWholeWindowClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onCloseClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    id: string
  ) => void;
};

const Window = forwardRef<HTMLDivElement, WindowProps>(
  (props: WindowProps, ref) => {
    const {
      id,
      name,
      header,
      initialXY,
      initialWindowSize = [640, 470],
      initialScrollTop = 0,
      zIndex,
      styles,
      contentAreaStyles,
      resizeable = true,
      backgroundColor,
      resizeHandlerColor,
      children,
      topBar,
      headerAreaStyles,
      disableCloseIcon = false,
      draggable = true,
      leftFooterText,
      footerHeight,
      disableFadeIn = false,
      disableOnScroll = false,
      onCloseClick,
      onWheel,
      onWindowChange,
      onWholeWindowClick,
    } = props;
    const [windowState, setWindowState] = useState<WindowState>(
      WindowState.default
    );
    const [initialPosition, setInitialPosition] = useState(initialXY);
    const [windowSize, setWindowSize] =
      useState<[number, number]>(initialWindowSize);
    const windowRef = useRef<HTMLDivElement>(null);
    const scrollDivRef = useRef<HTMLDivElement>(null);
    const prevMouseXY = useRef([0, 0]);
    const focusedWindowId = useAppSelector(
      (state) => state.windows.focusedWindowId
    );
    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => scrollDivRef.current as HTMLDivElement);
    const windowSizeRef = useRef(windowSize);
    const windowPositionRef = useRef(initialXY);

    // TODO - this should not be encapsulated in this component. pass the function in from caller instead
    function dispatchFocusedWindowId() {
      if (focusedWindowId !== id) {
        dispatch(updateFocusedWindowId(id));
      }
    }

    function handleMouseDown(e: React.MouseEvent) {
      if (!draggable) return;
      e.stopPropagation();
      if (!windowRef.current) return;
      prevMouseXY.current = [e.clientX, e.clientY];
      windowRef.current.style.zIndex = Z_Index.FocusedWindow.toString();
      setWindowState(WindowState.drag);
      dispatchFocusedWindowId();
    }

    function handleContentAreaMouseDown(e: React.MouseEvent) {
      e.stopPropagation();
      dispatchFocusedWindowId();
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
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
      const windowDomRect = windowRef.current.getBoundingClientRect();
      setInitialPosition([windowDomRect.x, windowDomRect.y]);
      windowRef.current.style.removeProperty('transform');
      if (onWindowChange) {
        onWindowChange(
          windowDomRect.x,
          windowDomRect.y,
          windowSizeRef.current[0],
          windowSizeRef.current[1],
          scrollDivRef.current?.scrollTop || 0,
          id
        );
      }
      setWindowState(WindowState.default);
    }

    function handleResizeMouseUp() {
      if (!windowRef.current || windowState !== WindowState.resize) return;
      document.body.removeEventListener('mousemove', handleResizeMouseMove);
      document.body.removeEventListener('mouseup', handleResizeMouseUp);
      if (
        onWindowChange &&
        windowPositionRef.current &&
        windowSizeRef.current
      ) {
        onWindowChange(
          windowPositionRef.current[0],
          windowPositionRef.current[1],
          windowSizeRef.current[0],
          windowSizeRef.current[1],
          scrollDivRef.current?.scrollTop || 0,
          id
        );
      }
      setWindowState(WindowState.default);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!windowRef.current || windowState !== WindowState.drag) return;
      windowRef.current.style.transform = `translate(${e.clientX - prevMouseXY.current[0]}px, ${
        e.clientY - prevMouseXY.current[1]
      }px)`;
    }

    const handleScrollStop = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (onWindowChange && initialPosition) {
        onWindowChange(
          initialPosition[0],
          initialPosition[1],
          windowSize[0],
          windowSize[1],
          target.scrollTop,
          id
        );
      }
    };

    const debouncedOnScroll = debounce(handleScrollStop, 200);

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
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollTop = initialScrollTop;
      }
    }, [initialScrollTop]);

    useEffect(() => {
      setWindowSize(initialWindowSize);
    }, [initialWindowSize]);

    useEffect(() => {
      setInitialPosition(initialXY);
    }, [initialXY]);

    useEffect(() => {
      windowSizeRef.current = windowSize;
    }, [windowSize]);

    useEffect(() => {
      windowPositionRef.current = initialPosition;
    }, [initialPosition]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (windowRef.current) {
          windowRef.current.classList.remove('fadeScaleInAnimation');
        }
      }, 200); // Ensure the animation duration matches the fadeScaleInAnimation duration defined in global.css

      return () => clearTimeout(timer);
    }, []);

    return (
      <div
        id={id}
        ref={windowRef}
        onClick={onWholeWindowClick}
        className={`absolute pt-0 text-white 
          min-w-96 shadow-moongray-800
          dark:shadow-moongray-900/30 bg-moongray-950 backdrop-blur-sm 
          ${disableFadeIn ? '' : 'fadeScaleInAnimation'}
        `}
        style={{
          left: initialPosition ? initialPosition[0] : undefined,
          top: initialPosition ? initialPosition[1] : undefined,
          backgroundColor,
          width: windowSize[0],
          height: windowSize[1],
          ...styles,
          zIndex: focusedWindowId === id ? Z_Index.FocusedWindow : zIndex,
        }}
        onMouseDown={handleMouseDown}>
        <div className="flex flex-col w-full h-full">
          <div
            className="flex flex-col w-full mb-6 bg-moongray-1000"
            style={headerAreaStyles}>
            <div className="flex px-3 justify-between w-full">
              {header || (
                <div className="flex items-center h-8 text-lg mt-1 mb-1">
                  {name}
                </div>
              )}
              {!disableCloseIcon ? (
                <Icon
                  color="#FFFFFF"
                  name={IconName.Close}
                  size={18}
                  onClick={onCloseClick}
                  onMouseDown={handleCloseIconMouseDown}
                />
              ) : null}
            </div>
            {topBar ? <div className="pb-2 px-3">{topBar}</div> : null}
          </div>
          <div
            ref={scrollDivRef}
            className="h-full px-4 overflow-x-hidden overflow-y-auto
              bg-white size-full custom-scrollbar snap-mandatory"
            style={{
              ...contentAreaStyles,
            }}
            onMouseDown={handleContentAreaMouseDown}
            onScroll={!disableOnScroll ? debouncedOnScroll : undefined}
            onWheel={onWheel}>
            {children}
          </div>
          <div
            className="flex items-center justify-start text-xs text-white/70 px-3"
            style={footerHeight !== undefined ? { height: footerHeight } : {}}>
            {leftFooterText}
          </div>
          {resizeable ? (
            <div
              className="
                w-3 h-3
                absolute border-b-2 border-r-2
                border-solid bottom-[6px] right-[6px] cursor-se-resize 
                border-moongray-950"
              onMouseDown={handleResizeMouseDown}
              style={{
                borderColor: resizeHandlerColor,
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
);

Window.displayName = 'Window';
export { Window };
