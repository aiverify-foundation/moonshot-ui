import Image from 'next/image';

type IconProps = {
  name: string;
  iconPath: string;
  width?: number;
  height?: number;
  gapSize?: number;
  onClick?: () => void;
};

function Icon(props: IconProps) {
  const { name, iconPath, onClick, width = 40, height = 40, gapSize = 10 } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '25px 0',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFF',
      }}
      onClick={onClick}>
      <Image
        src={iconPath}
        alt={name}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
          marginBottom: gapSize,
        }}
      />
      <div
        style={{
          fontSize: 12,
        }}>
        {name}
      </div>
    </div>
  );
}

export default Icon;
