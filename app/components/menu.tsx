import Image from 'next/image';
import { useState } from 'react';

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: '39px',
        width: 130,
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
      }}
      onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <div
        style={{
          height: 25,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          gap: 10,
        }}>
        <Image
          src="icons/hamburger_icon.svg"
          alt="cookbooks"
          width={10}
          height={10}
          style={{
            cursor: 'pointer',
          }}
        />
        <div>Moonshot</div>
      </div>

      {isMenuOpen ? (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            width: 160,
            top: '100%',
            left: 20,
            boxShadow: '0px 3px 6px #00000029',
          }}>
          <div
            style={{
              padding: '12px 25px',
              paddingTop: 13,
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
            Create Cookbook
          </div>
          <div
            style={{
              padding: '12px 25px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
            Create Recipe
          </div>
          <div
            style={{
              padding: '12px 25px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
            Create Endpoint
          </div>
          <div
            style={{
              padding: '12px 25px',
              paddingBottom: 12,
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
            Run Cookbook
          </div>
          <div style={{ padding: '12px 25px', paddingBottom: 12 }}>
            New Chat Session
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Menu;
