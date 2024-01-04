import Image from 'next/image';

function Icon(props: { name: string; iconPath: string; onClick?: () => void }) {
  const { name, iconPath, onClick } = props;
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
        width={40}
        height={40}
        style={{
          cursor: 'pointer',
          marginBottom: 10,
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
