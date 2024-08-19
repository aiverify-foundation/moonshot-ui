import React, { PropsWithChildren, forwardRef } from 'react';
import { Window } from '@/app/components/window';
import { colors } from '@/app/customColors';

type ChatboxProps = {
  windowId: string;
  name: string;
  disableCloseIcon?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  initialXY: [number, number];
  initialSize: [number, number];
  initialScrollTop: number;
  disableOnScroll?: boolean;
  styles?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  resizeHandlerColor?: React.CSSProperties['color'];
  onCloseClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
  onWholeWindowClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

const Container = forwardRef(
  (props: PropsWithChildren<ChatboxProps>, ref: React.Ref<HTMLDivElement>) => {
    const {
      windowId,
      name,
      disableCloseIcon = true,
      initialXY,
      initialSize,
      initialScrollTop,
      disableOnScroll,
      draggable,
      resizable,
      onCloseClick,
      children,
      styles,
      headerStyle,
      resizeHandlerColor,
      onWheel,
      onWindowChange,
      onWholeWindowClick,
    } = props;

    return (
      <Window
        resizeable={resizable}
        draggable={draggable}
        disableFadeIn
        id={windowId}
        header={<div className="flex items-center h-7 text-sm">{name}</div>}
        initialXY={initialXY}
        initialWindowSize={initialSize}
        initialScrollTop={initialScrollTop}
        disableOnScroll={disableOnScroll}
        onCloseClick={onCloseClick}
        onWheel={onWheel}
        onWindowChange={onWindowChange}
        onWholeWindowClick={onWholeWindowClick}
        disableCloseIcon={disableCloseIcon}
        footerHeight={17}
        backgroundColor={colors.chatboxbg}
        resizeHandlerColor={resizeHandlerColor}
        styles={{
          zIndex: 100,
          ...styles,
        }}
        contentAreaStyles={{
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: '0.7rem',
          marginRight: '0.7rem',
        }}
        headerAreaStyles={{
          marginBottom: 14,
          ...headerStyle,
        }}>
        <div
          ref={ref}
          id="chatContainer"
          className="h-full overflow-y-auto custom-scrollbar bg-chatboxbg">
          {children}
        </div>
      </Window>
    );
  }
);

type TalkBubbleProps = {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  fontColor?: React.CSSProperties['color'];
  fontSize?: React.CSSProperties['fontSize'];
  textAlign?: React.CSSProperties['textAlign'];
  marginBottom?: React.CSSProperties['marginBottom'];
  marginTop?: React.CSSProperties['marginTop'];
  border?: React.CSSProperties['border'];
  borderRadius?: React.CSSProperties['borderRadius'];
  padding?: React.CSSProperties['padding'];
  styles?: React.CSSProperties;
};

function TalkBubble(props: PropsWithChildren<TalkBubbleProps>) {
  const {
    fontColor = '#FFF',
    backgroundColor = 'darkslategrey',
    fontSize,
    textAlign = 'left',
    marginBottom = 25,
    marginTop = 0,
    border = 'none',
    borderRadius = 14,
    padding = '12px 16px',
    children,
    styles,
  } = props;
  return (
    <div
      style={{
        textAlign,
        color: fontColor,
        padding,
        fontSize,
        backgroundColor,
        margin: 0,
        marginTop,
        marginBottom,
        borderRadius,
        width: 'fit-content',
        minWidth: '35%',
        border,
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
  const { backgroundColor = '#94a3b8', dotColor = '#FFFFFF', styles } = props;
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

const Chat = {
  TalkBubble,
  LoadingAnimation,
  Container,
};
Container.displayName = 'Container';

export { Chat };
