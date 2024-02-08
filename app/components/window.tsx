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
  name: string;
  initialXY?: [number, number];
  initialWindowSize?: [number, number];
  initialScrollTop?: number;
  zIndex?: number | 'auto';
  minWidth?: number;
  minHeight?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  contentAreaStyles?: React.CSSProperties;
  resizeable?: boolean;
  disableCloseIcon?: boolean;
  draggable?: boolean; // Added this line
  leftFooterText?: string;
  disableFadeIn?: boolean;
  disableOnScroll?: boolean;
  onCloseClick?: () => void;
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
      initialXY = [180, 140],
      initialWindowSize = [640, 470],
      initialScrollTop = 0,
      zIndex,
      minWidth = 200,
      minHeight = 200,
      styles,
      contentAreaStyles,
      resizeable = true,
      backgroundColor,
      children,
      disableCloseIcon = false,
      draggable = true, // Added this line
      leftFooterText,
      disableFadeIn = false,
      disableOnScroll = false,
      onCloseClick,
      onWheel,
      onWindowChange,
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
    const selectedWindowId = useAppSelector(
      (state) => state.windows.focusedWindowId
    );
    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => scrollDivRef.current as HTMLDivElement);
    const windowSizeRef = useRef(windowSize);

    function handleMouseDown(e: React.MouseEvent) {
      if (!draggable) return; // Added this line
      e.stopPropagation();
      if (!windowRef.current) return;
      prevMouseXY.current = [e.clientX, e.clientY];
      windowRef.current.style.zIndex = Z_Index.FocusedWindow.toString();
      setWindowState(WindowState.drag);
      dispatch(updateFocusedWindowId(id));
    }

    function handleContentAreaMouseDown(e: React.MouseEvent) {
      e.stopPropagation();
      dispatch(updateFocusedWindowId(id));
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
        onWindowChange(
          windowDomRect.x,
          windowDomRect.y,
          windowSizeRef.current[0],
          windowSizeRef.current[1],
          scrollDivRef.current?.scrollTop || 0,
          id
        );
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
          windowSizeRef.current[0],
          windowSizeRef.current[1],
          scrollDivRef.current?.scrollTop || 0,
          id
        );
      }
    }

    function handleMouseMove(e: MouseEvent) {
      if (!windowRef.current || windowState !== WindowState.drag) return;
      windowRef.current.style.transform = `translate(${e.clientX - prevMouseXY.current[0]}px, ${e.clientY - prevMouseXY.current[1]
        }px)`;
    }

    const handleScrollStop = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (onWindowChange) {
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
      windowSizeRef.current = windowSize;
    }, [windowSize]);


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
        className={`absolute px-3 pt-0 ${!leftFooterText ? 'pb-4' : ''} text-white 
          shadow-lg select-none min-w-96 shadow-neutral-800/40 bg-fuchsia-900/70 
          dark:shadow-neutral-900/30 dark:bg-neutral-900/70 backdrop-blur-sm ${disableFadeIn ? '' : 'fadeScaleInAnimation'}`}
        style={{
          left: initialPosition[0],
          top: initialPosition[1],
          backgroundColor,
          width: windowSize[0],
          height: windowSize[1],
          ...styles,
          zIndex: selectedWindowId === id ? Z_Index.FocusedWindow : zIndex,
        }}
        onMouseDown={handleMouseDown}>
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between w-full">
            <div className="flex items-center h-8 text-sm">{name}</div>
            {!disableCloseIcon ? (
              <Icon
                lightModeColor="#FFFFFF"
                name={IconName.Close}
                size={18}
                onClick={onCloseClick}
                onMouseDown={handleCloseIconMouseDown}
              />
            ) : null}
          </div>
          <div
            ref={scrollDivRef}
            className="h-full overflow-x-hidden overflow-y-auto bg-white size-full custom-scrollbar snap-mandatory"
            style={{
              ...contentAreaStyles,
            }}
            onMouseDown={handleContentAreaMouseDown}
            onScroll={!disableOnScroll ? debouncedOnScroll : undefined}
            onWheel={onWheel}>
            {children}
          </div>
          <div className="text-xs text-white/70">{leftFooterText}</div>
          {resizeable ? (
            <div
              className="
                w-3.5 h-3.5
                absolute border-b-2 border-r-2
                border-solid bottom-1 right-1 cursor-se-resize 
                dark:border-neutral-400/30
                border-fuchsia-800"
              onMouseDown={handleResizeMouseDown}
            />
          ) : null}
        </div>
      </div>
    );
  }
);

Window.displayName = 'Window';
export { Window };
