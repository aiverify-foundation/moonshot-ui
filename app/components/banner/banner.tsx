import clsx from 'clsx';
import { PropsWithChildren, ReactNode } from 'react';
import styles from './styles/banner.module.css';
import { Icon, IconName } from '@components/IconSVG';
import { Button, ButtonType } from '@components/button';

type BannerProps = {
  bannerText: string | ReactNode;
  bannerColor?: string;
  textColor?: string;
  buttonText: string;
  buttonColor?: string;
  buttonTextColor?: string;
};

function Banner(props: PropsWithChildren<BannerProps>) {
  const {
    bannerText,
    bannerColor = '#FFFFFF',
    textColor = '#000000',
    buttonText,
    buttonColor = '#000000',
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
          btnColor={buttonColor}
          textColor={buttonTextColor}
          mode={ButtonType.PRIMARY}
          text={buttonText}
          iconName={IconName.ArrowRight}
        />
      </figcaption>
    </figure>
  );
}

export { Banner };
