import Link from 'next/link';
import React from 'react';

interface LinkTextProps {
  href: string;
  refresh?: boolean;
  children?: React.ReactNode;
}
const LinkText = ({ href, refresh = false, children }: LinkTextProps) => {
  return (
    <>
      {refresh ? (
        <a href={href} style={{ textDecoration: 'none' }}>
          {children}
        </a>
      ) : (
        <Link href={href}>
          <a style={{ textDecoration: 'none' }}>{children}</a>
        </Link>
      )}
    </>
  );
};
export default LinkText;
