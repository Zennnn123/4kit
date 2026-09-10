import React, { useState, useRef, useLayoutEffect } from 'react';
import { 
  Home, 
  Bookmark, 
  PlusCircle, 
  User, 
  Settings,
  SlidersHorizontal,
  Compass, 
  Layers, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Clock, 
  Truck, 
  MapPin, 
  LucideIcon 
} from 'lucide-react';

// Helper for dynamic RGBA transparency
export function hexToRgba(hex: string = '#DC2626', alpha: number = 1): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return `rgba(220, 38, 38, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper for dynamic dark shade computation
export function adjustBrightness(hex: string = '#DC2626', factor: number = 0.6): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  const r = Math.max(0, Math.min(255, Math.floor(parseInt(cleanHex.substring(0, 2), 16) * factor)));
  const g = Math.max(0, Math.min(255, Math.floor(parseInt(cleanHex.substring(2, 4), 16) * factor)));
  const b = Math.max(0, Math.min(255, Math.floor(parseInt(cleanHex.substring(4, 6), 16) * factor)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// 1. ORIGINAL PRIMITIVE NAVITEM (FROM USER SPECIFICATION)
// ─────────────────────────────────────────────────────────────
export interface NavItemProps {
  icon: React.ElementType;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  indicatorPosition: number;
  position: number;
  accentColor?: string;
  badge?: string | number | boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label,
  isActive = false, 
  onClick,
  indicatorPosition,
  position,
  accentColor,
  badge
}) => {
  const distance = Math.abs(indicatorPosition - position);
  const spotlightOpacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);

  const glowFrom = accentColor ? hexToRgba(accentColor, 0.4) : 'rgba(255, 255, 255, 0.4)';

  return (
    <button
      className="relative flex items-center justify-center w-12 h-12 mx-2 transition-all duration-400 focus:outline-none"
      onClick={onClick}
      type="button"
      aria-label={label}
    >
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-24 bg-gradient-to-b from-white/40 to-transparent blur-lg rounded-full transition-opacity duration-400 pointer-events-none"
        style={{
          opacity: spotlightOpacity,
          background: accentColor 
            ? `linear-gradient(to bottom, ${glowFrom} 0%, transparent 100%)` 
            : undefined,
          transitionDelay: isActive ? '0.1s' : '0s',
        }}
      />
      <Icon
        className={`w-6 h-6 transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
        }`}
        style={accentColor && isActive ? { color: accentColor } : undefined}
        strokeWidth={isActive ? 2.5 : 2}
      />
      {badge !== undefined && badge !== false && (
        <span 
          className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ring-2 ring-black shadow-sm"
          style={{ backgroundColor: accentColor || '#DC2626' }}
        >
          {badge === true ? '' : badge}
        </span>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// EXACT MECHANICAL 3D LEVER TOGGLE (FROM USER SCREENSHOT)
// ─────────────────────────────────────────────────────────────
export interface LeverFilterToggleProps {
  isOn?: boolean;
  onToggle?: (nextState: boolean) => void;
  accentColor?: string;
  darkColor?: string;
  count?: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const LeverFilterToggle: React.FC<LeverFilterToggleProps> = ({
  isOn: controlledIsOn,
  onToggle,
  accentColor = '#DC2626',
  darkColor,
  count = 0,
  showLabel = true,
  className = '',
  size = 'sm',
}) => {
  const [internalIsOn, setInternalIsOn] = useState(false);
  const isOn = controlledIsOn !== undefined ? controlledIsOn : internalIsOn;

  const handleToggle = () => {
    const next = !isOn;
    if (controlledIsOn === undefined) {
      setInternalIsOn(next);
    }
    onToggle?.(next);
  };

  const isSmall = size === 'sm';

  // Compute realistic dynamic 3D spherical lighting in the EXACT category color
  const darkShade = darkColor || adjustBrightness(accentColor, 0.55);
  const deepShadow = adjustBrightness(accentColor, 0.22);

  return (
    <div 
      className={`inline-flex items-center gap-2 select-none cursor-pointer group focus:outline-none transition-transform active:scale-95 ${className}`}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      aria-label="Filter Toggle Lever"
    >
      {/* 3D Mechanical Lever Assembly Container */}
      <div 
        className={`relative flex items-end justify-center ${
          isSmall ? 'w-[44px] h-[28px] pb-0.5' : 'w-[56px] h-[36px] pb-1'
        }`}
      >
        {/* Recessed Pill Metallic Slot Track */}
        <div 
          className={`relative rounded-full overflow-hidden transition-all duration-300 ${
            isSmall ? 'w-[40px] h-[13px]' : 'w-[50px] h-[16px]'
          }`}
          style={{
            background: 'linear-gradient(180deg, #383B40 0%, #5E636D 45%, #8B909A 100%)',
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.7), 
              inset 0 -1px 1px rgba(255,255,255,0.7),
              0 1px 3px rgba(0,0,0,0.12),
              0 0 0 1.5px #E2E4E8
            `,
          }}
        >
          {/* Internal Cavity Shadow Depth */}
          <div className="absolute inset-x-1.5 top-0 h-[3px] bg-black/45 blur-[1px] rounded-full pointer-events-none" />
          <div className="absolute inset-x-2 bottom-0 h-[1.5px] bg-white/30 rounded-full pointer-events-none" />
        </div>

        {/* Swinging Lever Arm (Rotates around base in slot) */}
        <div 
          className="absolute left-1/2 flex flex-col items-center pointer-events-none transition-transform duration-300"
          style={{
            bottom: isSmall ? '6px' : '8px',
            transformOrigin: '50% 100%',
            transform: isOn 
              ? 'translateX(-50%) rotate(22deg)' 
              : 'translateX(-50%) rotate(-22deg)',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Shiny 3D Ball Knob in Exact Category Theme Color */}
          <div 
            className={`relative rounded-full transition-all duration-300 z-10 ${
              isSmall ? 'w-[20px] h-[20px]' : 'w-[26px] h-[26px]'
            }`}
            style={{
              background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 8%, ${accentColor} 44%, ${darkShade} 86%, ${deepShadow} 100%)`,
              boxShadow: `
                0 4px 8px rgba(0, 0, 0, 0.35),
                0 1px 3px rgba(0, 0, 0, 0.2),
                inset -1.5px -2px 4px rgba(0, 0, 0, 0.5),
                inset 1px 1px 2px rgba(255, 255, 255, 0.85)
              `,
              filter: `drop-shadow(0 2px 5px ${hexToRgba(accentColor, 0.45)})`,
            }}
          >
            {/* Primary Sharp Specular Pinpoint Highlight */}
            <div 
              className={`absolute rounded-full bg-white blur-[0.2px] -rotate-12 pointer-events-none ${
                isSmall ? 'top-[3px] left-[5px] w-[4px] h-[2.5px]' : 'top-[4px] left-[7px] w-[5px] h-[3px]'
              }`} 
            />
            {/* Secondary Soft Ambient Reflected Highlight */}
            <div 
              className={`absolute rounded-full bg-white/30 blur-[0.8px] rotate-45 pointer-events-none ${
                isSmall ? 'bottom-[2px] right-[4px] w-[5px] h-[2px]' : 'bottom-[3px] right-[5px] w-[6px] h-[2.5px]'
              }`} 
            />
          </div>

          {/* Chrome Metallic Cylindrical Shaft */}
          <div 
            className={`-mt-[1.5px] rounded-b-xs shadow-xs ${
              isSmall ? 'w-[4px] h-[15px]' : 'w-[5.5px] h-[19px]'
            }`}
            style={{
              background: 'linear-gradient(90deg, #71717A 0%, #D4D4D8 25%, #FFFFFF 50%, #A1A1AA 75%, #52525B 100%)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
          />
        </div>

        {/* Soft Drop Shadow under Lever Base */}
        <div 
          className={`absolute bottom-[1.5px] bg-black/45 rounded-full blur-[1.5px] transition-all duration-300 pointer-events-none ${
            isSmall ? 'w-[8px] h-[3.5px]' : 'w-[10px] h-[4px]'
          }`}
          style={{
            left: isSmall ? (isOn ? '25px' : '11px') : (isOn ? '32px' : '14px'),
          }}
        />
      </div>

      {/* Filter Label in Exact Category Theme Color */}
      {showLabel && (
        <div className="flex items-center gap-1.5 font-extrabold text-sm tracking-tight">
          <span 
            className="transition-colors duration-300 select-none"
            style={{ 
              color: accentColor,
              textShadow: `0 1px 2px ${hexToRgba(accentColor, 0.15)}`
            }}
          >
            Filters
          </span>
          {count > 0 && (
            <span 
              className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {count}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. SPOTLIGHT FILTER BUTTON (REPLACING THE SCREENSHOT BUTTON)
// ─────────────────────────────────────────────────────────────
export interface SpotlightFilterButtonProps {
  onClick?: () => void;
  accentColor?: string;
  count?: number;
  label?: string;
  isActive?: boolean;
  className?: string;
}

export const SpotlightFilterButton: React.FC<SpotlightFilterButtonProps> = ({
  onClick,
  accentColor = '#DC2626',
  count = 0,
  label = 'Filters',
  isActive = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const glowFrom = hexToRgba(accentColor, isHovered || isActive ? 0.32 : 0.16);
  const glowMid = hexToRgba(accentColor, isHovered || isActive ? 0.10 : 0.03);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden group focus:outline-none ${className}`}
      style={{
        border: `1.5px solid ${accentColor}`,
        boxShadow: (isHovered || isActive) 
          ? `0 6px 22px ${hexToRgba(accentColor, 0.28)}, 0 2px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)` 
          : `0 3px 14px ${hexToRgba(accentColor, 0.14)}, 0 1px 3px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)`,
      }}
      aria-label={label}
    >
      {/* Top Gliding Indicator Bar in Category Color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300 pointer-events-none"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}`,
          width: isHovered || isActive ? '28px' : '18px',
          transform: 'translateY(-0.5px)',
        }}
      />

      {/* Downward Spotlight Ambient Cone */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-20 h-16 rounded-full blur-md pointer-events-none transition-all duration-350"
        style={{
          background: `linear-gradient(to bottom, ${glowFrom} 0%, ${glowMid} 60%, transparent 100%)`,
          opacity: isHovered || isActive ? 1 : 0.65,
          transform: isHovered ? 'translate(-50%, -20%) scale(1.1)' : 'translate(-50%, -30%) scale(1)',
        }}
      />

      {/* Sliders Icon in Dynamic Category Accent Color */}
      <SlidersHorizontal
        className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
        style={{
          color: accentColor,
          filter: `drop-shadow(0 1px 3px ${hexToRgba(accentColor, 0.35)})`,
        }}
        strokeWidth={2.4}
      />

      {/* Text Label */}
      <span
        className="font-bold text-sm tracking-tight transition-colors duration-200 select-none"
        style={{ color: accentColor }}
      >
        {label} {count > 0 ? `(${count})` : ''}
      </span>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. CATEGORY-ADAPTIVE SPOTLIGHT FILTER BAR
// ─────────────────────────────────────────────────────────────
export interface SpotlightFilterItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ElementType;
  badge?: number | string | boolean;
}

export interface SpotlightFilterProps {
  items?: SpotlightFilterItem[];
  activeId?: string;
  accentColor?: string;
  onSelect?: (id: string, index: number) => void;
  className?: string;
}

export const SpotlightFilter: React.FC<SpotlightFilterProps> = ({
  items = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'rating', label: '4.8+ Rated', icon: Star },
    { id: 'fast', label: '< 15 mins', icon: Clock },
    { id: 'free_delivery', label: 'Free Delivery', icon: Truck },
    { id: 'distance', label: '< 5km Radius', icon: MapPin },
    { id: 'more', label: 'Filter', icon: SlidersHorizontal },
  ],
  activeId = 'all',
  accentColor = '#DC2626',
  onSelect,
  className = '',
}) => {
  const activeIndex = Math.max(0, items.findIndex((i) => i.id === activeId));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const activeEl = itemRefs.current[activeIndex];
      const containerEl = containerRef.current;
      if (!activeEl || !containerEl) return;

      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      const left = activeRect.left - containerRect.left + (activeRect.width / 2) - 20;
      setIndicatorStyle({
        left: Math.max(4, left),
        width: 40,
        opacity: 1,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeIndex, items.length]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-between mx-auto select-none transition-all duration-300 rounded-[20px] px-2 h-[60px] bg-white/92 backdrop-blur-xl border border-zinc-200/90 shadow-[0_8px_26px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] ${className}`}
      style={{
        width: 'min(100%, 540px)',
      }}
    >
      {/* Gliding Top Indicator in Category Accent Color */}
      <div
        className="absolute top-0 h-[3px] rounded-full transition-all duration-350 ease-out pointer-events-none"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${hexToRgba(accentColor, 0.8)}, 0 2px 4px ${hexToRgba(accentColor, 0.4)}`,
          transform: 'translateY(-0.5px)',
        }}
      />

      {/* Filter Items */}
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeIndex === index;
        const distance = Math.abs(activeIndex - index);
        const spotlightOpacity = isActive ? 1 : Math.max(0, 0.65 - distance * 0.45);

        const glowFrom = hexToRgba(accentColor, 0.22);
        const glowMid = hexToRgba(accentColor, 0.06);

        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            className="relative flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 group focus:outline-none"
            onClick={() => onSelect?.(item.id, index)}
            aria-label={item.label}
          >
            {/* Spotlight Cone */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-11 h-16 rounded-2xl blur-md pointer-events-none transition-opacity duration-350"
              style={{
                opacity: spotlightOpacity,
                background: `linear-gradient(to bottom, ${glowFrom} 0%, ${glowMid} 60%, transparent 100%)`,
                transitionDelay: isActive ? '0.04s' : '0s',
              }}
            />

            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <Icon
                className="w-4 h-4 transition-all duration-200"
                style={{
                  color: isActive ? accentColor : '#9CA3AF',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  filter: isActive ? `drop-shadow(0 2px 6px ${hexToRgba(accentColor, 0.35)})` : 'none',
                }}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {item.badge !== undefined && item.badge !== false && (
                <span
                  className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {item.badge === true ? '' : item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className="mt-0.5 text-[10px] font-medium tracking-tight truncate max-w-full px-0.5 transition-colors duration-200"
              style={{
                color: isActive ? accentColor : '#6B7280',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. SPOTLIGHT NAVIGATION DOCK (5 TABS)
// ─────────────────────────────────────────────────────────────
export interface SpotlightNavItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ElementType;
  badge?: number | string | boolean;
  onClick?: () => void;
}

export interface SpotlightNavProps {
  items?: SpotlightNavItem[];
  activeIndex?: number;
  defaultIndex?: number;
  onTabChange?: (index: number, id: string) => void;
  className?: string;
  theme?: 'white' | 'glass' | 'transparent' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  accentColor?: string;
}

export const MultiOrderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="8" height="12" rx="2" />
    <rect x="13" y="4" width="8" height="16" rx="2" />
    <path d="M5.5 8V6a1.5 1.5 0 0 1 3 0v2" />
    <path d="M15.5 4V2.5a1.5 1.5 0 0 1 3 0V4" />
    <path d="M6 13h2" />
    <path d="M16 11h2" />
  </svg>
);

const DEFAULT_NAV_ITEMS: SpotlightNavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'multiorder', label: 'Multi-Order', icon: MultiOrderIcon, badge: 'New' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
];

export const SpotlightNav: React.FC<SpotlightNavProps> = ({
  items = DEFAULT_NAV_ITEMS,
  activeIndex: controlledIndex,
  defaultIndex = 0,
  onTabChange,
  className = '',
  theme = 'white',
  size = 'md',
  showLabels = true,
  accentColor,
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const activeEl = itemRefs.current[activeIndex];
      const containerEl = containerRef.current;
      if (!activeEl || !containerEl) return;

      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      const left = activeRect.left - containerRect.left + (activeRect.width / 2) - 22;
      setIndicatorStyle({
        left: Math.max(6, left),
        width: 44,
        opacity: 1,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeIndex, items.length]);

  const handleSelect = (index: number, item: SpotlightNavItem) => {
    if (controlledIndex === undefined) {
      setInternalIndex(index);
    }
    onTabChange?.(index, item.id);
    item.onClick?.();
  };

  const isDark = theme === 'dark';
  const effectiveAccent = accentColor || (isDark ? '#FFFFFF' : '#18181B');

  const sizeStyles = {
    sm: { barHeight: 'h-[58px]', btnSize: 'h-11 py-1', iconSize: 'w-5 h-5', fontSize: 'text-[10px]', spotlightWidth: 'w-10', spotlightHeight: 'h-16' },
    md: { barHeight: 'h-[66px]', btnSize: 'h-12 py-1', iconSize: 'w-[22px] h-[22px]', fontSize: 'text-[11px]', spotlightWidth: 'w-12', spotlightHeight: 'h-20' },
    lg: { barHeight: 'h-[74px]', btnSize: 'h-14 py-1.5', iconSize: 'w-6 h-6', fontSize: 'text-xs', spotlightWidth: 'w-14', spotlightHeight: 'h-24' },
  }[size];

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-zinc-950/90 text-white border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.5)]';
      case 'transparent':
        return 'bg-white/40 dark:bg-black/30 backdrop-blur-2xl text-zinc-900 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)]';
      case 'glass':
        return 'bg-white/75 backdrop-blur-2xl text-zinc-900 border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.07),inset_0_1px_1px_rgba(255,255,255,0.9)]';
      case 'white':
      default:
        return 'bg-white/92 backdrop-blur-xl text-zinc-900 border border-zinc-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-between mx-auto select-none transition-all duration-300 rounded-[20px] px-2 sm:px-3.5 ${
        sizeStyles.barHeight
      } ${getThemeClasses()} ${className}`}
      style={{
        width: 'min(calc(100% - 24px), 430px)',
      }}
    >
      {/* Gliding Top Indicator Bar */}
      <div
        className="absolute top-0 h-[3px] rounded-full transition-all duration-350 ease-out pointer-events-none"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          backgroundColor: effectiveAccent,
          boxShadow: accentColor ? `0 0 10px ${hexToRgba(accentColor, 0.8)}` : (isDark ? '0 0 10px rgba(255,255,255,0.85)' : '0 1px 4px rgba(0,0,0,0.25)'),
          transform: 'translateY(-0.5px)',
        }}
      />

      {/* Buttons */}
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeIndex === index;
        const distance = Math.abs(activeIndex - index);
        const spotlightOpacity = isActive ? 1 : Math.max(0, 0.65 - distance * 0.45);

        const glowColor = accentColor 
          ? hexToRgba(accentColor, 0.25)
          : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(24,24,27,0.18)');

        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            className={`relative flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer active:scale-95 group focus:outline-none ${sizeStyles.btnSize}`}
            onClick={() => handleSelect(index, item)}
            aria-label={item.label}
          >
            {/* Spotlight Beam */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 pointer-events-none rounded-2xl blur-md transition-opacity duration-350 ${
                sizeStyles.spotlightWidth
              } ${sizeStyles.spotlightHeight}`}
              style={{
                opacity: spotlightOpacity,
                background: `linear-gradient(to bottom, ${glowColor} 0%, transparent 100%)`,
                transitionDelay: isActive ? '0.04s' : '0s',
              }}
            />

            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <Icon
                className={`${sizeStyles.iconSize} transition-all duration-200 transform`}
                style={{
                  color: isActive ? effectiveAccent : (isDark ? '#A1A1AA' : '#9CA3AF'),
                  transform: isActive ? 'scale(1.10)' : 'scale(1)',
                }}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {item.badge !== undefined && item.badge !== false && item.badge !== 0 && (
                <span
                  className="absolute -top-1.5 -right-3 text-[10px] min-w-[17px] h-[17px] flex items-center justify-center font-bold px-1.5 py-0.2 rounded-full text-white ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: accentColor || '#DC2626' }}
                >
                  {item.badge === true ? '' : item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            {showLabels && (
              <span
                className={`mt-0.5 font-medium tracking-tight transition-colors duration-200 truncate max-w-full px-1 ${
                  sizeStyles.fontSize
                }`}
                style={{
                  color: isActive ? effectiveAccent : (isDark ? '#A1A1AA' : '#6B7280'),
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. DEFAULT EXPORT COMPONENT (EXACT MATCH FOR DEMO & SPEC)
// ─────────────────────────────────────────────────────────────
export const Component = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Bookmark, label: 'Bookmarks' },
    { icon: PlusCircle, label: 'Add' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="container">
      <nav className="relative flex items-center px-2 py-3 bg-black/90 backdrop-blur-sm rounded-md shadow-lg border border-white/10">
        <div 
          className="absolute top-0 h-[2px] bg-white transition-all duration-400 ease-in-out"
          style={{
            left: `${activeIndex * 64 + 16}px`,
            width: '48px',
            transform: 'translateY(-1px)',
          }}
        />
        {navItems.map((item, index) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            indicatorPosition={activeIndex}
            position={index}
          />
        ))}
      </nav>
      <style>{`
        html, body, :root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--active-light-bg, rgb(243 244 246));
          transition: background-color 0.35s ease;
        }
      `}</style>
    </div>
  );
};

export default SpotlightFilterButton;
