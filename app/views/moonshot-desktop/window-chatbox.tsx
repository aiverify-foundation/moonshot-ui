import { Window } from '@/app/components/window';
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type ChatboxProps = {
  windowId: string;
  name: string;
  initialXY: [number, number];
  styles?: React.CSSProperties;
  onCloseClick: () => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  onDrop: (x: number, y: number, windowId: string) => void;
  onResize: (width: number, height: number, windowId: string) => void;
};

const ChatBox = forwardRef(
  (props: PropsWithChildren<ChatboxProps>, ref: React.Ref<HTMLDivElement>) => {
    const { windowId, name, initialXY, onCloseClick, children, styles, onWheel, onDrop, onResize } =
      props;
    const scrollDivRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => scrollDivRef.current);

    useEffect(() => {
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
      }
    }, [children]);

    return (
      <Window
        resizeable
        id={windowId}
        name={name}
        initialXY={initialXY}
        initialWindowSize={[500, 450]}
        onCloseClick={onCloseClick}
        onDrop={onDrop}
        onResize={onResize}
        disableCloseIcon
        styles={{
          zIndex: 100,
          ...styles,
        }}>
        <div
          ref={scrollDivRef}
          onWheel={onWheel}
          className="custom-scrollbar"
          style={{
            // scrollBehavior: 'smooth',
            padding: '15px 0 15px 15px',
            fontSize: 12,
            borderRadius: 20,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #444',
            height: '100%',
          }}>
          {children}
        </div>
      </Window>
    );
  }
);

type TalkBubbleProps = {
  backgroundColor: string;
  fontColor: string;
  styles?: React.CSSProperties;
};

function TalkBubble(props: PropsWithChildren<TalkBubbleProps>) {
  const { fontColor, backgroundColor, styles, children } = props;
  return (
    <div
      style={{
        color: fontColor,
        padding: '12px 16px',
        fontSize: 12,
        background: backgroundColor,
        margin: 0,
        marginBottom: 25,
        borderRadius: 14,
        width: 'fit-content',
        minWidth: '35%',
        ...styles,
      }}>
      {children}
    </div>
  );
}

type LoadingAnimationProps = {
  backgroundColor?: string;
  dotColor?: string;
  styles?: React.CSSProperties;
};

function LoadingAnimation(props: LoadingAnimationProps) {
  const { backgroundColor = '#3498db', dotColor = '#FFFFFF', styles } = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        ...styles,
      }}>
      <div
        style={{
          width: '65px',
          height: '35px',
          background: backgroundColor,
          borderRadius: 14,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 15,
        }}>
        <div
          className="dot dot1"
          style={{
            width: 5,
            height: 5,
            background: dotColor,
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
            animationDelay: '-0.4s',
          }}
        />
        <div
          className="dot dot2"
          style={{
            width: 5,
            height: 5,
            background: dotColor,
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
            animationDelay: '-0.2s',
          }}
        />
        <div
          className="dot dot3"
          style={{
            width: 5,
            height: 5,
            background: dotColor,
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
          }}
        />
      </div>
    </div>
  );
}

const ChatWindow = {
  TalkBubble,
  LoadingAnimation,
  ChatBox,
};
ChatBox.displayName = 'Chatbox';

export { ChatWindow };
