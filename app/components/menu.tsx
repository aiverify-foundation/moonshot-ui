import { useState } from 'react';
import { Icon, IconName } from './IconSVG';

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div
      className="flex gap-3 justify-center
      items-center h-10 cursor-pointer w-40 
      bg-fuschia-900 dark:bg-none"
      onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <div className="h-6 flex justify-center items-center gap-2.5">
        <Icon
          name={IconName.BurgerMenu}
          size={15}
        />
        <div className="dark:text-white font-medium text-fuchsia-950">
          Moonshot
        </div>
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
          <div
            style={{
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              padding: 20,
            }}>
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
