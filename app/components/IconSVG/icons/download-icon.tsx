type DownloadIconProps = {
  fillColor?: string;
  width?: number;
  height?: number;
};

function DownloadIcon(props: DownloadIconProps) {
  const { fillColor = '#FFFFFF', width = 30, height = 30 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg">
      <g id="info" />
      <g id="icons">
        <g id="save">
          <path d="M11.2,16.6c0.4,0.5,1.2,0.5,1.6,0l6-6.3C19.3,9.8,18.8,9,18,9h-4c0,0,0.2-4.6,0-7c-0.1-1.1-0.9-2-2-2c-1.1,0-1.9,0.9-2,2    c-0.2,2.3,0,7,0,7H6c-0.8,0-1.3,0.8-0.8,1.4L11.2,16.6z" />
          <path d="M19,19H5c-1.1,0-2,0.9-2,2v0c0,0.6,0.4,1,1,1h16c0.6,0,1-0.4,1-1v0C21,19.9,20.1,19,19,19z" />
        </g>
      </g>
    </svg>
  );
}

export { DownloadIcon };
