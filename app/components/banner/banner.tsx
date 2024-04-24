import { PropsWithChildren, ReactNode } from 'react';
import styles from './styles/banner.module.css';
import { IconName } from '@components/IconSVG';
import { Button, ButtonType } from '@components/button';

type BannerProps = {
  bannerText: string | ReactNode;
  bannerColor?: string;
  textColor?: string;
  buttonText: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonTextColor?: string;
};

function Banner(props: PropsWithChildren<BannerProps>) {
  const {
    bannerText,
    bannerColor = '#FFFFFF',
    textColor = '#000000',
    buttonText,
    buttonColor = '#000000',
    buttonHoverColor = '#EEEEEE',
    buttonTextColor = '#FFFFFF',
    children,
  } = props;

  return (
    <figure
      className={styles.banner}
      style={{ backgroundColor: bannerColor }}>
      {children}
      <figcaption className={styles.caption_container}>
        <p
          className={styles.caption_text}
          style={{ color: textColor }}>
          {bannerText}
        </p>
        <Button
          type="button"
          size="lg"
          btnColor={buttonColor}
          hoverBtnColor={buttonHoverColor}
          textColor={buttonTextColor}
          mode={ButtonType.PRIMARY}
          text={buttonText}
          rightIconName={IconName.ArrowRight}
        />
      </figcaption>
    </figure>
  );
}

export { Banner };
