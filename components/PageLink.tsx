'use client';

import { forwardRef, MouseEvent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageLoading } from './PageLoadingProvider';

interface PageLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(
  ({ href, children, onClick, ...props }, ref) => {
    const router = useRouter();
    const { startLoading } = usePageLoading();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      // Don't override external links or special clicks
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        onClick?.(e);
        return;
      }

      e.preventDefault();
      
      // Call custom onClick if provided
      onClick?.(e);

      // Start loading animation
      startLoading();

      // Navigate after a tiny delay to ensure loading state is visible
      setTimeout(() => {
        router.push(href);
      }, 50);
    };

    return (
      <NextLink ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </NextLink>
    );
  }
);

PageLink.displayName = 'PageLink';

export default PageLink;
