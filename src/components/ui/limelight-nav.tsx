import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults (Exact 1-to-1 match with reference screenshot) ---

export const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 9.75L12 3L20.25 9.75V20.25A1.5 1.5 0 0 1 18.75 21.75H5.25A1.5 1.5 0 0 1 3.75 20.25V9.75Z" />
  </svg>
);

export const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className = '',
  limelightClassName = '',
  iconContainerClassName = '',
  iconClassName = '',
}: LimelightNavProps) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setInternalActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      style={{ width: '320px', height: '72px' }}
      className={`relative flex items-center justify-between rounded-[22px] bg-white border border-slate-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.06)] px-3 select-none overflow-hidden ${className}`}
    >
      {/* ─── MOVING LIMELIGHT SPOTLIGHT FIXTURE & BEAM (EXACT MATCH TO REFERENCE IMAGE) ─── */}
      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 w-24 pointer-events-none flex flex-col items-center ${
          isReady ? 'transition-[left] duration-300 ease-out' : ''
        } ${limelightClassName}`}
        style={{ left: '-999px' }}
      >
        {/* Top Black Capsule Fixture */}
        <div className="w-[52px] h-[7px] rounded-full bg-[#0F0F0F] shadow-[0_2px_4px_rgba(0,0,0,0.4)] mt-[1px]" />

        {/* Downward Grey Spotlight Beam */}
        <div
          className="w-24 h-[60px] pointer-events-none"
          style={{
            clipPath: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.08) 65%, rgba(0, 0, 0, 0) 100%)'
          }}
        />

        {/* Base Light Pool Soft Blur Shadow */}
        <div
          className="w-20 h-4 rounded-full -mt-5 opacity-70 blur-[8px]"
          style={{ background: 'rgba(0, 0, 0, 0.45)' }}
        />
      </div>

      {/* ─── NAV ITEMS ─── */}
      {items.map(({ id, icon, label, onClick }, index) => {
        const isActive = activeIndex === index;
        return (
          <a
            key={id}
            ref={(el) => { navItemRefs.current[index] = el; }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className={`relative z-20 flex-1 h-full cursor-pointer items-center justify-center ${iconContainerClassName}`}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {cloneElement(icon as React.ReactElement<any>, {
              className: `w-7 h-7 transition-all duration-200 ${
                isActive
                  ? 'text-black opacity-100'
                  : 'text-[#94A3B8] opacity-70 hover:opacity-100'
              } ${(icon as React.ReactElement<any>).props?.className || ''} ${iconClassName}`,
              strokeWidth: isActive ? 2.6 : 2
            })}
          </a>
        );
      })}
    </nav>
  );
};
