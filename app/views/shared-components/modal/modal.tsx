import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

type ModalProps = {
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  bgColor: React.CSSProperties['backgroundColor'];
  textColor: React.CSSProperties['color'];
  heading: string;
  children: React.ReactNode;
  enableScreenOverlay: boolean;
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
    heading,
    children,
    primaryBtnLabel,
    secondaryBtnLabel,
    enableScreenOverlay,
    onPrimaryBtnClick,
    onSecondaryBtnClick,
    onCloseIconClick,
  } = props;
  return (
    <>
      {enableScreenOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999]" />
      )}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[260px] z-[1000] rounded-[15px] 
        p-6 shadow-lg"
        style={{ width, height, backgroundColor: bgColor, color: textColor }}>
        <header className="flex justify-between mb-3">
          <h1 className="text-[1.4rem] font-normal">{heading}</h1>
          <Icon
            name={IconName.Close}
            onClick={onCloseIconClick}
          />
        </header>
        <main>{children}</main>
        <footer className="absolute bottom-0 left-0 flex justify-end items-center gap-2 p-4 w-full">
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
      </div>
    </>
  );
}

export { Modal };
