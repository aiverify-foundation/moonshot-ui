import Link, { LinkProps } from 'next/link';

// LinkProps omit some of the html attributes props
type CustomLinkProps = {
  href: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
} & LinkProps;

export const CustomLink = ({
  href,
  style,
  className,
  onMouseLeave,
  ...props
}: CustomLinkProps) => {
  if (!process.env.NEXT_PUBLIC_BASE_PATH) {
    return (
      <Link
        href={href}
        style={style}
        className={className}
        onMouseLeave={onMouseLeave}
        {...props}
      />
    );
  }
  // Check if the href is an external link
  const isExternal =
    typeof href === 'string' &&
    (href.startsWith('http') || href.startsWith('//'));
  const modifiedHref = isExternal
    ? href
    : `${process.env.NEXT_PUBLIC_BASE_PATH}${href}`;
  return (
    <Link
      href={modifiedHref}
      style={style}
      className={className}
      onMouseLeave={onMouseLeave}
      {...props}
    />
  );
};
