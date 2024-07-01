import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

type ModalProps = {
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  bgColor: React.CSSProperties['backgroundColor'];
  textColor: React.CSSProperties['color'];
  headingColor?: React.CSSProperties['color'];
  heading: string;
  hideCloseIcon?: boolean;
  children: React.ReactNode;
  enableScreenOverlay: boolean;
  overlayOpacity?: React.CSSProperties['opacity'];
  primaryBtnLabel?: string;
  secondaryBtnLabel?: string;
  onPrimaryBtnClick?: () => void;
  onSecondaryBtnClick?: () => void;
  onCloseIconClick: () => void;
};

function Modal(props: ModalProps) {
  const {
    width = 500,
    height = 260,
    bgColor,
    textColor,
    headingColor,
    heading,
    hideCloseIcon = false,
    children,
    primaryBtnLabel,
    secondaryBtnLabel,
    enableScreenOverlay,
    overlayOpacity = 0.3,
    onPrimaryBtnClick,
    onSecondaryBtnClick,
    onCloseIconClick,
  } = props;
  return (
    <>
      {enableScreenOverlay && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black z-[999]"
          style={{
            opacity: overlayOpacity,
          }}
        />
      )}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[260px] z-[1000] rounded-[15px] p-6"
        style={{
          width,
          height,
          backgroundColor: bgColor,
          color: textColor,
          boxShadow: '0 0 10px rgba(0,0,0,.5)',
        }}>
        <header
          className="flex justify-between mb-3"
          style={{ color: headingColor }}>
          <h1 className="text-[1.4rem] font-normal">{heading}</h1>
          {!hideCloseIcon ? (
            <Icon
              name={IconName.Close}
              onClick={onCloseIconClick}
            />
          ) : null}
        </header>
        <main style={{ height: 'calc(100% - 20px' }}>{children}</main>
        {(onSecondaryBtnClick || onPrimaryBtnClick) && (
          <footer className="absolute bottom-0 left-0 flex justify-end items-center gap-2 p-4 w-full mt-4">
            {onSecondaryBtnClick && (
              <Button
                mode={ButtonType.OUTLINE}
                onClick={onSecondaryBtnClick}
                text={secondaryBtnLabel || ''}
                hoverBtnColor={colors.moongray[700]}
                pressedBtnColor={colors.moongray[800]}
              />
            )}
            {onPrimaryBtnClick && (
              <Button
                mode={ButtonType.PRIMARY}
                onClick={onPrimaryBtnClick}
                text={primaryBtnLabel || ''}
                hoverBtnColor={colors.moongray[950]}
              />
            )}
          </footer>
        )}
      </div>
    </>
  );
}

export { Modal };
