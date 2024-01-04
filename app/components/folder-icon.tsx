import Image from 'next/image';

function FolderIcon(props: { name: string; onClick?: () => void }) {
  const { name, onClick } = props;
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
        src="icons/folder_icon.svg"
        alt="cookbooks"
        width={50}
        height={50}
        style={{
          cursor: 'pointer',
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

export default FolderIcon;
