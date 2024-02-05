type ScreenOverlayProps = {
  bgColor?: string;
  children?: React.ReactNode;
};

function ScreenOverlay({ children, bgColor = 'transparent' }: ScreenOverlayProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: bgColor,
        zIndex: 1000,
      }}>
      {children}
    </div>
  );
}

export { ScreenOverlay };
