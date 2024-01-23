type ScreenOverlayProps = {
  children?: React.ReactNode;
};

function ScreenOverlay({ children }: ScreenOverlayProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1000,
      }}>
      {children}
    </div>
  );
}

export { ScreenOverlay };
