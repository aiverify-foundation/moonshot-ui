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
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            position: 'absolute',
            top: '100%',
            left: 20,
            boxShadow: '0px 3px 6px #00000029',
          }}>
          <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)', padding: 20 }}>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 16,
                paddingLeft: 20,
                marginBottom: 20,
                color: '#068afd',
              }}>
              Benchmarking
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 200,
                top: '100%',
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
                }}>
                Run Cookbook
              </div>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 16,
                paddingLeft: 20,
                marginBottom: 20,
                color: '#f94d4d',
              }}>
              Red Teaming
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 200,
                top: '100%',
              }}>
              <div
                style={{
                  padding: '12px 25px',
                  paddingTop: 13,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                Manual Red Teaming
              </div>
              <div
                style={{
                  padding: '12px 25px',
                }}>
                Automated Red Teaming
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Menu;
