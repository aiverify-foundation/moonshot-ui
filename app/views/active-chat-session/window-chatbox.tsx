import { Window } from '@/app/components/window';
import {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

type ChatboxProps = {
  windowId: string;
  name: string;
  initialXY: [number, number];
  initialSize: [number, number];
  initialScrollTop: number;
  styles?: React.CSSProperties;
  onCloseClick: () => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

const ChatBox = forwardRef(
  (
    props: PropsWithChildren<ChatboxProps>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const {
      windowId,
      name,
      initialXY,
      initialSize,
      initialScrollTop,
      onCloseClick,
      children,
      styles,
      onWheel,
      onWindowChange,
    } = props;
    const scrollDivRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => scrollDivRef.current);

    return (
      <Window
        ref={scrollDivRef}
        resizeable
        id={windowId}
        name={name}
        initialXY={initialXY}
        initialWindowSize={initialSize}
        initialScrollTop={initialScrollTop}
        onCloseClick={onCloseClick}
        onWheel={onWheel}
        onWindowChange={onWindowChange}
        disableCloseIcon
        styles={{
          zIndex: 100,
          ...styles,
        }}>
        {children}
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
      className="snap-top"
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
  const {
    backgroundColor = '#3498db',
    dotColor = '#FFFFFF',
    styles,
  } = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
