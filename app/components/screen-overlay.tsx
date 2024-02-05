type ScreenOverlayProps = {
  zIndex: number;
  bgColor?: string;
  children?: React.ReactNode;
};

function ScreenOverlay(props: ScreenOverlayProps) {
  const { children, bgColor = 'transparent', zIndex } = props;
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen opacity-40"
        style={{
          backgroundColor: bgColor,
          zIndex,
        }}
      />
      {children}
    </>
  );
}

export { ScreenOverlay };
