import { ImageProps } from 'next/image';
import Image from 'next/image';

// This component is created to handle the basePath issue with Next.js Image component.
// Next.js Image component doesn't automatically handle basePath, so we need to
// prepend it manually to ensure correct asset loading in different environments.
// In this case, we are using NEXT_PUBLIC_BASE_PATH from the .env

function SvgImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return <Image src={`${basePath}${src}`} {...rest} alt={alt} />;
}

export { SvgImage };
