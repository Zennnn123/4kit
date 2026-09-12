import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  ShoppingBag,
  Pill,
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Compass,
  ClipboardList,
  User,
  X,
  Plus,
  Minus,
  Star,
  Truck,
  Sparkles,
  PhoneCall,
  FastForward,
  Award,
  CreditCard,
  Bell,
  HelpCircle,
  ShoppingBasket,
  Zap,
  ChevronRight,
  AlertTriangle,
  Check,
  Percent,
  Heart,
  Play,
  Flame,
  Cake,
  Soup,
  Pizza,
  Dices,
  type LucideIcon
} from 'lucide-react';

import { CATEGORY_THEMES, CategoryTheme } from './theme/colors';
import { SpotlightNav, SpotlightNavItem, SpotlightFilter, SpotlightFilterButton, LeverFilterToggle, MultiOrderIcon } from './components/ui/spotlight-button';
import {
  STORES_BY_CATEGORY,
  MENU_ITEMS_BY_CATEGORY,
  MULTI_STORE_BUNDLES,
  DIET_ITEMS,
  CRAVINGS_ITEMS,
  CUISINE_COLLECTIONS,
  SWIGGY_MIND_DISHES,
  Store,
  MenuItem,
  MultiStoreBundle,
  TRIVANDRUM_FOOD_MENU_ITEMS,
  ALL_TRIVANDRUM_FOOD_DISHES,
  TVM_LOCALITIES,
  getDistanceBetweenLocalities,
  calculateDistanceKm
} from './data/catalog';

type ScreenType = 'home' | 'discover' | 'stores' | 'menu' | 'cart' | 'tracker' | 'profile' | 'multiorder';

export interface SpinReward {
  code: string;
  title: string;
  desc: string;
  discountPercent?: number;
  discountAmount?: number;
  color: string;
}

const SPIN_WHEEL_REWARDS: SpinReward[] = [
  { code: 'SPIN25', title: 'FLAT 25% OFF', desc: 'Get 25% off on your entire food order!', discountPercent: 25, color: '#DC2626' },
  { code: 'FREEDEL', title: 'FREE DELIVERY', desc: 'Zero delivery charges on your current order!', discountAmount: 40, color: '#059669' },
  { code: 'SAVE100', title: 'FLAT ₹100 OFF', desc: 'Flat ₹100 instant discount on orders above ₹299!', discountAmount: 100, color: '#7C3AED' },
  { code: 'FREEDESSERT', title: 'FREE DESSERT', desc: 'Free Neyyappam or Gelato with your next order!', discountAmount: 50, color: '#DB2777' },
  { code: 'SPIN30', title: '30% OFF COMBOS', desc: '30% off on all Multi-Store & Gourmet combos!', discountPercent: 30, color: '#2563EB' },
  { code: 'GOLDSPIN', title: '1-MO GOLD FREE', desc: 'Free 4Kit Gold membership with zero delivery fees!', discountAmount: 75, color: '#D97706' }
];

export interface VectorSymbol {
  id: string;
  type: 'spicy' | 'sweet' | 'chicken' | 'noodles' | 'burgers';
  name: string;
  bgColor: string;
  icon: React.ElementType;
}

const SYMBOL_PRESETS: Record<string, VectorSymbol> = {
  spicy: { id: 'spicy', type: 'spicy', name: 'Spicy Chili', bgColor: '#DC2626', icon: Flame },
  sweet: { id: 'sweet', type: 'sweet', name: 'Sugar Cake', bgColor: '#EC4899', icon: Cake },
  chicken: { id: 'chicken', type: 'chicken', name: 'Biriyani', bgColor: '#D97706', icon: Utensils },
  noodles: { id: 'noodles', type: 'noodles', name: 'Noodles', bgColor: '#0284C7', icon: Soup },
  burgers: { id: 'burgers', type: 'burgers', name: 'Burgers', bgColor: '#EAB308', icon: Pizza }
};

const KERALA_DISH_REEL = [
  { name: 'Spicy Kerala Biriyani', symbol: SYMBOL_PRESETS.spicy },
  { name: 'Sugar Sweet Cake', symbol: SYMBOL_PRESETS.sweet },
  { name: 'Fiery Chicken Alfaham', symbol: SYMBOL_PRESETS.chicken },
  { name: 'Hot Noodle Soup', symbol: SYMBOL_PRESETS.noodles },
  { name: 'Gourmet Burger Combo', symbol: SYMBOL_PRESETS.burgers }
];

const KERALA_SIDE_REEL = [
  { name: 'Sugar Cake', symbol: SYMBOL_PRESETS.sweet },
  { name: 'Spicy Chili', symbol: SYMBOL_PRESETS.spicy },
  { name: 'Chicken Roast', symbol: SYMBOL_PRESETS.chicken },
  { name: 'Ramen Noodles', symbol: SYMBOL_PRESETS.noodles }
];

const KERALA_PERK_REEL = [
  { name: 'Hot Noodles', symbol: SYMBOL_PRESETS.noodles },
  { name: 'Cheesy Burgers', symbol: SYMBOL_PRESETS.burgers },
  { name: 'Spicy Chili', symbol: SYMBOL_PRESETS.spicy },
  { name: 'Sweet Cake', symbol: SYMBOL_PRESETS.sweet }
];

const BUBBLE_CATEGORIES = [
  { id: 'food', name: 'Food', icon: Utensils, theme: CATEGORY_THEMES.food },
  { id: 'supermarket', name: 'Groceries', icon: ShoppingBag, theme: CATEGORY_THEMES.supermarket },
  { id: 'pharmacy', name: 'Pharmacy', icon: Pill, theme: CATEGORY_THEMES.pharmacy }
];

const GROCERY_MIND_CATEGORIES = [
  { id: 'groc_1', name: 'Dairy & Milk', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&h=160&fit=crop' },
  { id: 'groc_2', name: 'Fresh Veggies', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=160&h=160&fit=crop' },
  { id: 'groc_3', name: 'Farm Fruits', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=160&h=160&fit=crop' },
  { id: 'groc_4', name: 'Snacks & Chips', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=160&h=160&fit=crop' },
  { id: 'groc_5', name: 'Cold Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160&h=160&fit=crop' },
  { id: 'groc_6', name: 'Bread & Bakes', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&h=160&fit=crop' },
  { id: 'groc_7', name: 'Atta & Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&h=160&fit=crop' },
  { id: 'groc_8', name: 'Instant Food', img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=160&h=160&fit=crop' }
];

const PHARMACY_MIND_CATEGORIES = [
  { id: 'pharm_1', name: 'First Aid', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=160&h=160&fit=crop' },
  { id: 'pharm_2', name: 'Pain Relief', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&h=160&fit=crop' },
  { id: 'pharm_3', name: 'Vitamins', img: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=160&h=160&fit=crop' },
  { id: 'pharm_4', name: 'Cough & Cold', img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=160&h=160&fit=crop' },
  { id: 'pharm_5', name: 'Skin Care', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=160&h=160&fit=crop' },
  { id: 'pharm_6', name: 'Baby Wellness', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=160&h=160&fit=crop' },
  { id: 'pharm_7', name: 'Oral Care', img: 'https://images.unsplash.com/photo-1559591937-e1032338f0d5?w=160&h=160&fit=crop' },
  { id: 'pharm_8', name: 'Immunity', img: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=160&h=160&fit=crop' }
];

const SAMPLE_SEARCHES = ['Biriyani', 'Porotta', 'Fish Nirvana', 'Alfaham', 'Beef', 'Puttu', 'Dosa'];

const PromoCardOutlinesPattern = ({
  category = 'food',
  textColor = '#FFFFFF',
  patternId = 'promo_pat'
}: {
  category?: string;
  textColor?: string;
  patternId?: string;
}) => {
  const isWhite = textColor === '#FFFFFF';
  const strokeColor = isWhite ? '#FFFFFF' : textColor;
  const strokeOpacity = isWhite ? 0.25 : 0.22;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width="110"
          height="90"
          patternUnits="userSpaceOnUse"
        >
          {category === 'food' ? (
            <>
              {/* Row 1: Burger outline at (20, 15) */}
              <g
                transform="translate(20, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M4 13 C4 5 26 5 26 13 Z" />
                <path d="M2 16 C5 18 8 16 11 18 C14 16 17 18 20 16 C23 18 26 16 28 16" />
                <line x1="3" y1="20" x2="27" y2="20" />
                <path d="M5 23 C5 27 25 27 25 23 Z" />
              </g>

              {/* Row 1: Steaming Bowl outline at (75, 15) */}
              <g
                transform="translate(75, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <ellipse cx="15" cy="11" rx="12" ry="3.5" />
                <path d="M3 11 C4 22 26 22 27 11" />
                <path d="M10 7 C9 3 13 1 12 -2" />
                <path d="M15 7 C14 3 18 1 17 -2" />
                <path d="M20 7 C19 3 23 1 22 -2" />
              </g>

              {/* Row 2: Pizza Slice at (45, 45) */}
              <g
                transform="translate(45, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M4 6 Q15 3 26 6" />
                <path d="M4 6 L15 28 L26 6" />
                <circle cx="15" cy="12" r="2" />
                <circle cx="12" cy="18" r="1.5" />
                <circle cx="18" cy="19" r="1.5" />
              </g>

              {/* Row 2: Taco outline at (100, 45) */}
              <g
                transform="translate(100, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M3 18 C3 7 25 7 25 18" />
                <path d="M6 15 C9 12 19 12 22 15" />
                <line x1="3" y1="18" x2="25" y2="18" />
              </g>

              {/* Row 3: Cold Drink Cup at (20, 75) */}
              <g
                transform="translate(20, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M6 9 L9 26 L21 26 L24 9 Z" />
                <path d="M4 9 L26 9" />
                <path d="M14 9 L17 2 L22 0.5" />
              </g>

              {/* Row 3: Crossed Cutlery at (75, 75) */}
              <g
                transform="translate(75, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M6 4 L6 11 M10 4 L10 11 M8 4 L8 11 M5 11 C5 14 11 14 11 11 L8 24" />
                <path d="M20 4 C23 6 23 11 20 13 L20 24" />
              </g>
            </>
          ) : category === 'supermarket' ? (
            <>
              {/* Row 1: Milk Carton at (20, 15) */}
              <g
                transform="translate(20, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="6" y="8" width="16" height="20" rx="2" />
                <path d="M9 8 L9 3 L19 3 L19 8" />
                <line x1="6" y1="15" x2="22" y2="15" />
              </g>

              {/* Row 1: Fresh Apple at (75, 15) */}
              <g
                transform="translate(75, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <circle cx="14" cy="15" r="9" />
                <path d="M14 6 Q16 2 19 3" />
                <path d="M14 6 Q10 2 11 0" />
              </g>

              {/* Row 2: Grocery Bag at (45, 45) */}
              <g
                transform="translate(45, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="5" y="9" width="18" height="17" rx="2" />
                <path d="M9 9 C9 4 19 4 19 9" />
                <line x1="9" y1="15" x2="19" y2="15" />
              </g>

              {/* Row 2: Carrot at (100, 45) */}
              <g
                transform="translate(100, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M7 8 Q14 26 14 26 Q14 26 21 8 Z" />
                <path d="M11 8 Q14 3 13 0 M17 8 Q14 3 15 0" />
              </g>

              {/* Row 3: Bread Loaf at (20, 75) */}
              <g
                transform="translate(20, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <ellipse cx="14" cy="14" rx="13" ry="7" />
                <path d="M8 11 L11 17 M14 10 L17 17 M20 11 L23 17" />
              </g>

              {/* Row 3: Beverage Can at (75, 75) */}
              <g
                transform="translate(75, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="7" y="5" width="14" height="20" rx="3" />
                <ellipse cx="14" cy="5" rx="7" ry="2" />
                <ellipse cx="14" cy="25" rx="7" ry="2" />
              </g>
            </>
          ) : (
            <>
              {/* Row 1: Capsule Pill at (20, 15) */}
              <g
                transform="translate(20, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="4" y="6" width="20" height="12" rx="6" transform="rotate(-30 14 12)" />
                <line x1="14" y1="6" x2="14" y2="18" transform="rotate(-30 14 12)" />
              </g>

              {/* Row 1: Medicine Bottle at (75, 15) */}
              <g
                transform="translate(75, 15) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="7" y="8" width="14" height="18" rx="3" />
                <rect x="10" y="3" width="8" height="5" rx="1" />
                <line x1="14" y1="12" x2="14" y2="20" />
                <line x1="10" y1="16" x2="18" y2="16" />
              </g>

              {/* Row 2: First Aid Cross at (45, 45) */}
              <g
                transform="translate(45, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="4" y="6" width="20" height="18" rx="3" />
                <path d="M9 6 L9 3 L19 3 L19 6" />
                <line x1="14" y1="11" x2="14" y2="19" />
                <line x1="10" y1="15" x2="18" y2="15" />
              </g>

              {/* Row 2: Thermometer at (100, 45) */}
              <g
                transform="translate(100, 45) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="11" y="2" width="6" height="18" rx="3" />
                <circle cx="14" cy="21" r="4.5" />
                <line x1="14" y1="8" x2="14" y2="18" />
              </g>

              {/* Row 3: Heartbeat Pulse at (20, 75) */}
              <g
                transform="translate(20, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <path d="M2 14 L7 14 L10 7 L14 21 L17 11 L20 14 L25 14" />
              </g>

              {/* Row 3: Syringe / Dropper at (75, 75) */}
              <g
                transform="translate(75, 75) scale(0.55)"
                stroke={strokeColor}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              >
                <rect x="8" y="6" width="8" height="16" rx="1" transform="rotate(45 12 14)" />
                <line x1="12" y1="2" x2="12" y2="6" transform="rotate(45 12 14)" />
                <line x1="12" y1="22" x2="12" y2="26" transform="rotate(45 12 14)" />
              </g>
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

/* ─── 4KIT FLOATING VIEW ORDER OUTLINES (DISHES, GROCERIES, PHARMACY) & DRIFT ─── */
const ViewOrderDishesTile = ({
  category = 'food',
  strokeColor
}: {
  category?: string;
  strokeColor: string;
}) => {
  return (
    <svg
      width="260"
      height="52"
      viewBox="0 0 260 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      {category === 'supermarket' ? (
        <>
          {/* 1. Milk Carton with Spout at x: 14, y: 10 */}
          <g transform="translate(14, 10) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="8" width="16" height="20" rx="2" />
            <path d="M9 8 L9 3 L19 3 L19 8" />
            <line x1="6" y1="16" x2="22" y2="16" />
            <path d="M11 12 Q14 10 17 12" />
          </g>

          {/* 2. Fresh Apple with Leaf at x: 56, y: 23 */}
          <g transform="translate(56, 23) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6 C8 6 4 11 4 17 C4 23 10 26 14 26 C18 26 24 23 24 17 C24 11 20 6 14 6 Z" />
            <path d="M14 6 Q16 2 19 3" />
            <path d="M14 6 Q12 2 10 1" />
          </g>

          {/* 3. Grocery Paper Bag with Baguette & Greens at x: 102, y: 8 */}
          <g transform="translate(102, 8) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="10" width="18" height="17" rx="2" />
            <path d="M9 10 L9 4 L14 4 L14 10" />
            <path d="M15 10 L18 2" />
            <line x1="5" y1="16" x2="23" y2="16" />
          </g>

          {/* 4. Fresh Carrot with Greens at x: 146, y: 24 */}
          <g transform="translate(146, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 8 Q14 26 14 26 Q14 26 21 8 Z" />
            <path d="M11 8 Q14 3 13 0 M17 8 Q14 3 15 0" />
            <line x1="10" y1="13" x2="16" y2="13" />
            <line x1="11" y1="18" x2="15" y2="18" />
          </g>

          {/* 5. Crusty Bread Loaf at x: 190, y: 9 */}
          <g transform="translate(190, 9) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="14" cy="15" rx="13" ry="8" />
            <path d="M7 12 L11 18 M12 10 L16 18 M17 11 L21 17" />
          </g>

          {/* 6. Honey / Jam Jar at x: 232, y: 24 */}
          <g transform="translate(232, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="8" width="16" height="18" rx="3" />
            <rect x="8" y="4" width="12" height="4" rx="1" />
            <rect x="9" y="13" width="10" height="7" rx="1" />
          </g>
        </>
      ) : category === 'pharmacy' ? (
        <>
          {/* 1. Capsule Pill at x: 14, y: 10 */}
          <g transform="translate(14, 10) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="6" width="20" height="12" rx="6" transform="rotate(-30 14 12)" />
            <line x1="14" y1="6" x2="14" y2="18" transform="rotate(-30 14 12)" />
            <circle cx="10" cy="11" r="1" fill={strokeColor} />
          </g>

          {/* 2. Medicine Syrup Bottle at x: 56, y: 23 */}
          <g transform="translate(56, 23) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="7" y="8" width="14" height="18" rx="3" />
            <rect x="10" y="3" width="8" height="5" rx="1" />
            <path d="M14 12 L14 20" />
            <path d="M10 16 L18 16" />
          </g>

          {/* 3. First Aid Cross Kit at x: 102, y: 8 */}
          <g transform="translate(102, 8) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="6" width="20" height="18" rx="3" />
            <path d="M9 6 L9 3 L19 3 L19 6" />
            <line x1="14" y1="11" x2="14" y2="19" />
            <line x1="10" y1="15" x2="18" y2="15" />
          </g>

          {/* 4. Stethoscope at x: 146, y: 24 */}
          <g transform="translate(146, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3 L6 11 C6 16 11 20 16 20 C21 20 23 16 23 11 L23 3" />
            <circle cx="16" cy="24" r="3" />
            <line x1="16" y1="20" x2="16" y2="21" />
          </g>

          {/* 5. Clinical Thermometer at x: 190, y: 9 */}
          <g transform="translate(190, 9) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="11" y="2" width="6" height="18" rx="3" />
            <circle cx="14" cy="21" r="4.5" />
            <line x1="14" y1="7" x2="14" y2="17" />
            <line x1="15" y1="10" x2="17" y2="10" />
            <line x1="15" y1="14" x2="17" y2="14" />
          </g>

          {/* 6. Heartbeat ECG Pulse Wave at x: 232, y: 24 */}
          <g transform="translate(232, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 14 L6 14 L9 7 L13 21 L16 10 L19 14 L24 14" />
            <circle cx="24" cy="14" r="1.5" fill={strokeColor} />
          </g>
        </>
      ) : (
        <>
          {/* 1. Burger outline at x: 14, y: 10 */}
          <g transform="translate(14, 10) scale(0.65)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11 C4 4 24 4 24 11 Z" />
            <path d="M3 14 C6 16 9 14 12 16 C15 14 18 16 21 14 C23 15 25 14 25 14" />
            <line x1="4" y1="18" x2="24" y2="18" />
            <path d="M5 21 C5 25 23 25 23 21 Z" />
          </g>

          {/* 2. Pizza Slice outline at x: 58, y: 24 */}
          <g transform="translate(58, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5 Q14 2 24 5" />
            <path d="M4 5 L14 25 L24 5" />
            <circle cx="14" cy="11" r="1.8" />
            <circle cx="11" cy="17" r="1.3" />
            <circle cx="17" cy="18" r="1.3" />
          </g>

          {/* 3. Steaming Dum Biriyani Bowl at x: 104, y: 8 */}
          <g transform="translate(104, 8) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="14" cy="12" rx="11" ry="3.5" />
            <path d="M3 12 C4 23 24 23 25 12" />
            <path d="M9 7 C8 4 12 2 11 0" />
            <path d="M14 7 C13 4 17 2 16 0" />
            <path d="M19 7 C18 4 22 2 21 0" />
          </g>

          {/* 4. Cold Drink Cup with Straw at x: 148, y: 23 */}
          <g transform="translate(148, 23) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9 L8 25 L18 25 L21 9 Z" />
            <line x1="3" y1="9" x2="23" y2="9" />
            <path d="M13 9 L15 2 L20 1" />
            <path d="M7 16 Q13 18 19 16" />
          </g>

          {/* 5. Crossed Cutlery at x: 192, y: 9 */}
          <g transform="translate(192, 9) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3 L6 10 M10 3 L10 10 M8 3 L8 10 M5 10 C5 13 11 13 11 10 L8 23" />
            <path d="M19 3 C22 5 22 10 19 12 L19 23" />
          </g>

          {/* 6. Taco / Roll at x: 232, y: 24 */}
          <g transform="translate(232, 24) scale(0.62)" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18 C3 7 23 7 23 18" />
            <path d="M6 15 C9 12 17 12 20 15" />
            <line x1="3" y1="18" x2="23" y2="18" />
          </g>
        </>
      )}
    </svg>
  );
};

const ViewOrderDishesPattern = ({ category = 'food' }: { category?: string }) => {
  const darkStrokeColor =
    category === 'supermarket'
      ? '#022416'
      : category === 'pharmacy'
      ? '#081638'
      : '#260404';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1
      }}
      aria-hidden="true"
    >
      {/* Light Side (Left): Crisp translucent white outlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0.26) 38%, rgba(0,0,0,0.06) 65%, transparent 88%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0.26) 38%, rgba(0,0,0,0.06) 65%, transparent 88%)',
          pointerEvents: 'none'
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 'auto'
          }}
          animate={{ x: [-260, 0] }}
          transition={{
            duration: 26,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          <ViewOrderDishesTile category={category} strokeColor="#FFFFFF" />
          <ViewOrderDishesTile category={category} strokeColor="#FFFFFF" />
          <ViewOrderDishesTile category={category} strokeColor="#FFFFFF" />
          <ViewOrderDishesTile category={category} strokeColor="#FFFFFF" />
        </motion.div>
      </div>

      {/* Dark Side (Right): Deep category-tailored dark outlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          WebkitMaskImage: 'linear-gradient(to right, transparent 18%, rgba(0,0,0,0.12) 48%, rgba(0,0,0,0.46) 75%, rgba(0,0,0,0.68) 100%)',
          maskImage: 'linear-gradient(to right, transparent 18%, rgba(0,0,0,0.12) 48%, rgba(0,0,0,0.46) 75%, rgba(0,0,0,0.68) 100%)',
          pointerEvents: 'none'
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 'auto'
          }}
          animate={{ x: [-260, 0] }}
          transition={{
            duration: 26,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          <ViewOrderDishesTile category={category} strokeColor={darkStrokeColor} />
          <ViewOrderDishesTile category={category} strokeColor={darkStrokeColor} />
          <ViewOrderDishesTile category={category} strokeColor={darkStrokeColor} />
          <ViewOrderDishesTile category={category} strokeColor={darkStrokeColor} />
        </motion.div>
      </div>
    </div>
  );
};

/* ─── TOP APP ECOSYSTEM OUTLINES BACKGROUND (Delivery Rider on Scooter, Shops & Customers) ─── */
const TopEcosystemOutlinesBackground = ({
  primaryColor = '#DC2626'
}: {
  primaryColor?: string;
}) => {
  return (
    <div className="top-ecosystem-outlines-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 480 145"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <linearGradient id="ecosystemGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════
            CONTINUOUS GROUND BASELINE (y: 62) - ALL ELEMENTS REST FIRMLY ON THE GROUND
           ═══════════════════════════════════════════════════════════════ */}
        <line x1="8" y1="62" x2="472" y2="62" stroke={primaryColor} strokeWidth="1.8" opacity={0.45} />

        {/* ═══════════════════════════════════════════════════════════════
            UPPER HERO STAGE (y: 2 to 62) - PROMINENTLY VISIBLE ABOVE & AROUND 4KIT LOGO
            - Left: The Local 4Kit Partner Shop (x: 10 to 110, on ground y: 62)
            - Left-Center: Authentic Delivery Rider on Scooter (x: 125 to 195, wheels on ground y: 62)
            - Center Sky (Above 4Kit): Delivery Trajectory, Clouds & Birds
            - Right: Customer at Home Doorstep Waving (x: 345 to 470, on ground y: 62)
           ═══════════════════════════════════════════════════════════════ */}

        {/* ─── A. LOCAL 4KIT SHOP & MERCHANT (LEFT, ON GROUND) ─── */}
        <g stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" opacity={0.44}>
          {/* Store rooftop cornice */}
          <line x1="12" y1="18" x2="108" y2="18" strokeWidth="1.6" />
          <circle cx="15" cy="15" r="1.8" strokeWidth="1.2" />
          <circle cx="105" cy="15" r="1.8" strokeWidth="1.2" />

          {/* Store Signboard */}
          <rect x="25" y="6" width="66" height="11" rx="2.5" strokeWidth="1.3" />
          <circle cx="28" cy="9" r="0.6" strokeWidth="0.6" />
          <circle cx="88" cy="9" r="0.6" strokeWidth="0.6" />
          <text
            x="58"
            y="14"
            fontSize="6.5"
            fontWeight="900"
            letterSpacing="0.8"
            fill={primaryColor}
            stroke="none"
            textAnchor="middle"
            opacity={0.6}
          >
            4KIT MART
          </text>

          {/* Striped Storefront Awning */}
          <path
            d="M 10 19 L 110 19 L 111 33 C 103 38 95 38 87 33 C 79 38 71 38 63 33 C 55 38 47 38 39 33 C 31 38 23 38 10 33 Z"
            strokeWidth="1.6"
          />
          <line x1="39" y1="19" x2="39" y2="33" strokeWidth="1.1" />
          <line x1="63" y1="19" x2="63" y2="33" strokeWidth="1.1" />
          <line x1="87" y1="19" x2="87" y2="33" strokeWidth="1.1" />

          {/* Shop walls down to ground y: 62 */}
          <line x1="14" y1="33" x2="14" y2="62" strokeWidth="1.6" />
          <line x1="106" y1="33" x2="106" y2="62" strokeWidth="1.6" />

          {/* Shop Display Window with fresh goods */}
          <rect x="18" y="38" width="38" height="20" rx="2.5" strokeWidth="1.4" />
          <line x1="37" y1="38" x2="37" y2="58" strokeWidth="1" />
          <rect x="22" y="44" width="5" height="9" rx="1" strokeWidth="1.1" />
          <circle cx="31" cy="49" r="2.8" strokeWidth="1.1" />
          <ellipse cx="46" cy="50" rx="5" ry="3" strokeWidth="1.1" />

          {/* Shop Entrance Door */}
          <rect x="62" y="36" width="38" height="26" rx="2" strokeWidth="1.4" />
          <rect x="67" y="39" width="14" height="13" rx="1.5" strokeWidth="1" />
          <line x1="77" y1="52" x2="77" y2="56" strokeWidth="1.6" />

          {/* Merchant at the entrance holding out an order */}
          <circle cx="89" cy="43" r="3.8" strokeWidth="1.3" />
          <path d="M 85 40 Q 89 35 93 40" strokeWidth="1.2" />
          <path d="M 85 47 L 83 62 L 95 62 L 93 47 Z" strokeWidth="1.3" />
          <path d="M 85 49 L 80 54" strokeWidth="1.3" />
          {/* Order bag */}
          <rect x="76" y="54" width="7" height="8" rx="1" strokeWidth="1.2" />
          <path d="M 78 54 Q 79.5 51 81 54" strokeWidth="1" />

          {/* Produce crate on ground */}
          <rect x="110" y="50" width="13" height="12" rx="1.5" strokeWidth="1.2" />
          <line x1="110" y1="55" x2="123" y2="55" strokeWidth="0.9" />
          <path d="M 113 50 Q 115 43 118 46" strokeWidth="1.1" />
        </g>

        {/* ─── B. AUTHENTIC DELIVERY RIDER ON SCOOTER / MOTORBIKE (ON GROUND y: 62) ─── */}
        <g stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" opacity={0.52}>
          {/* Speed wind trails behind scooter */}
          <line x1="102" y1="28" x2="122" y2="28" strokeWidth="1.3" strokeDasharray="4 3" opacity={0.35} />
          <line x1="108" y1="35" x2="124" y2="35" strokeWidth="1.5" opacity={0.4} />
          <line x1="104" y1="42" x2="123" y2="42" strokeWidth="1.3" strokeDasharray="5 3" opacity={0.35} />
          <line x1="114" y1="54" x2="126" y2="54" strokeWidth="1.4" opacity={0.4} />
          {/* Ground dust puff behind rear tire */}
          <path d="M 127 60 Q 123 57 127 54 Q 123 51 120 54" strokeWidth="1.1" opacity={0.3} />

          {/* Rear Wheel (r: 8, cy: 54 -> bottom touches ground at y: 62!) */}
          <circle cx="140" cy="54" r="8" strokeWidth="2.2" />
          <circle cx="140" cy="54" r="3.2" strokeWidth="1.3" />
          <circle cx="140" cy="54" r="1.2" strokeWidth="1.4" />

          {/* Front Wheel (r: 8, cy: 54 -> bottom touches ground at y: 62!) */}
          <circle cx="184" cy="54" r="8" strokeWidth="2.2" />
          <circle cx="184" cy="54" r="3.2" strokeWidth="1.3" />
          <circle cx="184" cy="54" r="1.2" strokeWidth="1.4" />

          {/* Rear Curved Mudguard / Fender */}
          <path d="M 130 54 C 130 42 150 42 150 52" strokeWidth="1.6" />

          {/* Front Curved Mudguard / Fender */}
          <path d="M 176 52 C 176 43 192 43 192 52" strokeWidth="1.6" />

          {/* Scooter Low Flat Footboard (between wheels) */}
          <line x1="148" y1="55" x2="174" y2="55" strokeWidth="2.6" />

          {/* Scooter Body Fairing & Engine Cowl */}
          <path d="M 144 50 L 144 38 C 150 32 163 32 169 41 L 172 55" strokeWidth="1.8" />

          {/* Scooter Ergonomic Seat Cushion */}
          <path d="M 141 38 C 150 35 164 36 169 39" strokeWidth="2.2" />

          {/* Front Apron Shield & Steering Column */}
          <path d="M 174 54 L 180 30 L 176 24" strokeWidth="2.2" />
          {/* Handlebar & Grips */}
          <line x1="171" y1="23" x2="181" y2="23" strokeWidth="2.2" />
          {/* Side Mirror */}
          <path d="M 178 23 L 176 18 C 174 18 174 15 176 15 C 178 15 178 18 176 18" strokeWidth="1.2" />

          {/* Modern Headlight on Handlebar */}
          <path d="M 180 25 L 185 24 L 185 28 L 180 28 Z" strokeWidth="1.4" />
          {/* Headlight Forward Beam Rays */}
          <line x1="188" y1="24" x2="198" y2="22" strokeWidth="1.2" opacity={0.35} />
          <line x1="189" y1="26" x2="204" y2="26" strokeWidth="1.2" opacity={0.4} />
          <line x1="188" y1="29" x2="199" y2="31" strokeWidth="1.2" opacity={0.35} />

          {/* 4Kit Insulated Delivery Box (Mounted securely on rear rack) */}
          <rect x="125" y="21" width="18" height="17" rx="3" strokeWidth="1.8" />
          <line x1="125" y1="26" x2="143" y2="26" strokeWidth="1.2" />
          <path d="M 131 21 L 131 18 L 137 18 L 137 21" strokeWidth="1.2" />
          {/* "4" Logo embossed on delivery box */}
          <text
            x="134"
            y="34"
            fontSize="8"
            fontWeight="900"
            textAnchor="middle"
            fill={primaryColor}
            stroke="none"
            opacity={0.7}
          >
            4
          </text>

          {/* Anatomical Volumetric Delivery Man on the Scooter */}
          {/* Full-face aerodynamic motorcycle helmet with visor & chin guard */}
          <path
            d="M 148 16 C 148 8 165 7 167 16 C 167 21 163 24 156 24 C 150 24 148 20 148 16 Z"
            strokeWidth="1.8"
          />
          {/* Aerodynamic helmet visor */}
          <path d="M 156 12 C 165 13 165 19 157 19" strokeWidth="1.4" />
          {/* Helmet chin strap & neck collar */}
          <path d="M 152 24 L 151 26" strokeWidth="1.4" />
          <path d="M 156 24 L 157 26" strokeWidth="1.4" />

          {/* Volumetric Rider Jacket (Athletic torso leaning into ride) */}
          {/* Jacket Back line curving forward */}
          <path d="M 149 26 C 143 30 141 35 143 40" strokeWidth="1.8" />
          {/* Jacket Front / Chest line with muscular arch */}
          <path d="M 157 26 C 161 29 162 34 160 40" strokeWidth="1.8" />
          {/* Jacket bottom hem resting on saddle */}
          <path d="M 143 40 C 149 41 155 41 160 40" strokeWidth="1.5" />
          {/* Jacket central zipper */}
          <line x1="154" y1="26" x2="152" y2="40" strokeWidth="1.1" strokeDasharray="2 1.5" />

          {/* Volumetric Arm reaching to handlebar (Bicep + Forearm + Gloved Hand) */}
          {/* Upper arm (bicep sleeve) */}
          <path d="M 156 27 L 165 30" strokeWidth="1.6" />
          <path d="M 154 31 L 163 34" strokeWidth="1.6" />
          {/* Forearm angled down to handlebar grip */}
          <path d="M 165 30 L 174 24" strokeWidth="1.6" />
          <path d="M 163 34 L 172 27" strokeWidth="1.6" />
          {/* Wrist cuff */}
          <line x1="172" y1="27" x2="174" y2="24" strokeWidth="1.2" />
          {/* Gloved hand firmly gripping handlebar */}
          <path d="M 173 23 C 176 22 177 25 174 26 Z" strokeWidth="1.4" />

          {/* Volumetric Leg & Sneaker (Thigh + Knee + Calf + Riding Shoe on footboard) */}
          {/* Thigh resting on scooter cushion */}
          <path d="M 147 40 C 153 39 160 39 166 42" strokeWidth="1.8" />
          <path d="M 144 42 C 150 43 157 44 164 46" strokeWidth="1.8" />
          {/* Knee contour */}
          <path d="M 166 42 C 168 44 167 46 164 46" strokeWidth="1.6" />
          {/* Lower leg / Shin & Calf in trousers */}
          <path d="M 166 44 L 164 54" strokeWidth="1.7" />
          <path d="M 163 46 C 163 49 160 52 160 54" strokeWidth="1.7" />
          {/* Pant leg cuff */}
          <line x1="160" y1="54" x2="164" y2="54" strokeWidth="1.2" />
          {/* Riding shoe / Sneaker planted flat on footboard (y: 55) */}
          <path d="M 158 55 L 158 53 L 167 53 C 169 53 170 55 167 55 Z" strokeWidth="1.4" />
        </g>

        {/* ─── C. CENTER SKY (DIRECTLY ABOVE 4KIT LOGO) ─── */}
        <g stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" opacity={0.35}>
          {/* Dashed delivery journey trajectory over the sky */}
          <path d="M 90 22 Q 240 -3 390 22" strokeDasharray="4 4" strokeWidth="1.3" />

          {/* Fluffy clouds in the sky */}
          <path d="M 222 10 C 222 5 231 3 236 7 C 241 3 252 5 252 10 Z" strokeWidth="1.2" />

          {/* Soaring birds */}
          <path d="M 214 15 Q 217 11 220 14 Q 223 11 226 14" strokeWidth="1.2" />
          <path d="M 256 14 Q 259 10 262 13 Q 265 10 268 13" strokeWidth="1.2" />
        </g>

        {/* ─── D. HAPPY CUSTOMER & HOME (RIGHT, ON GROUND) ─── */}
        <g stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" opacity={0.44}>
          {/* Traditional Kerala pitched roof */}
          <path d="M 345 32 L 385 10 L 425 32" strokeWidth="1.8" />
          <line x1="385" y1="10" x2="385" y2="6" strokeWidth="1.4" />
          <circle cx="385" cy="5" r="1.5" strokeWidth="1" />
          <line x1="342" y1="33" x2="428" y2="33" strokeWidth="1.3" />

          {/* Chimney & smoke wisp */}
          <path d="M 408 22 L 408 10 L 416 10 L 416 28" strokeWidth="1.3" />
          <path d="M 412 8 Q 414 4 417 5 Q 420 2 417 -2" strokeWidth="1" strokeDasharray="2 2" opacity={0.3} />

          {/* Upper circular attic window */}
          <circle cx="385" cy="23" r="6" strokeWidth="1.2" />
          <line x1="385" y1="17" x2="385" y2="29" strokeWidth="0.9" />
          <line x1="379" y1="23" x2="391" y2="23" strokeWidth="0.9" />

          {/* House walls down to ground y: 62 */}
          <line x1="348" y1="33" x2="348" y2="62" strokeWidth="1.6" />
          <line x1="422" y1="33" x2="422" y2="62" strokeWidth="1.6" />

          {/* Front door & porch steps on ground */}
          <rect x="358" y="38" width="28" height="24" rx="2" strokeWidth="1.3" />
          <circle cx="363" cy="51" r="1.2" strokeWidth="1" />
          <rect x="354" y="60" width="36" height="2" rx="1" strokeWidth="1.1" />

          {/* Picture Window with Flower Planter Box */}
          <rect x="392" y="42" width="22" height="15" rx="1.5" strokeWidth="1.2" />
          <path d="M 392 45 Q 396 49 396 57" strokeWidth="0.9" />
          <rect x="390" y="57" width="26" height="5" rx="1" strokeWidth="1.1" />
          <circle cx="395" cy="56" r="1.5" strokeWidth="0.9" />
          <circle cx="403" cy="55.5" r="1.8" strokeWidth="0.9" />
          <circle cx="411" cy="56" r="1.5" strokeWidth="0.9" />

          {/* Customer standing on porch step on ground waving eagerly */}
          <circle cx="368" cy="43" r="3.8" strokeWidth="1.3" />
          <path d="M 364 42 C 364 38 372 38 372 42" strokeWidth="1.2" />
          <path d="M 364 47 L 372 47 L 374 61 L 362 61 Z" strokeWidth="1.3" />
          {/* Raised arm waving */}
          <path d="M 364 49 L 354 44 L 350 36" strokeWidth="1.5" />
          <path d="M 350 36 C 347 34 352 30 354 33" strokeWidth="1.2" />
          {/* Sparkles of excitement */}
          <path d="M 345 31 Q 343 28 347 28" strokeWidth="1.1" />
          <path d="M 353 30 Q 356 28 355 31" strokeWidth="1.1" />
          {/* Phone in other hand */}
          <rect x="372" y="51" width="3" height="5" rx="0.8" strokeWidth="0.9" />

          {/* Kerala Coconut Palm Tree rooted on ground y: 62 */}
          <path d="M 436 62 Q 430 35 435 8" strokeWidth="2.2" />
          <line x1="433" y1="46" x2="437" y2="47" strokeWidth="1.1" />
          <line x1="431" y1="32" x2="435" y2="33" strokeWidth="1.1" />
          <line x1="432" y1="18" x2="436" y2="19" strokeWidth="1.1" />
          {/* Palm Fronds */}
          <path d="M 435 8 Q 418 3 405 7" strokeWidth="1.5" />
          <path d="M 435 8 Q 415 -5 404 -10" strokeWidth="1.5" />
          <path d="M 435 8 Q 445 -8 452 -15" strokeWidth="1.5" />
          <path d="M 435 8 Q 455 -2 462 4" strokeWidth="1.5" />
          <path d="M 435 8 Q 448 6 456 12" strokeWidth="1.5" />
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            LOWER BAND (y: 62 to 145) - DIRECTLY RELATED DELIVERY ECOSYSTEM
            "ALL THE THINGS BELOW THERE MAKE SOMETHING RELATED TO IT"
            - Scenic winding road and connecting dashed journey trail
            - GPS destination pin marker
            - Delivery parcel packages on the route
            - Milestone kilometer marker
            - Streetlamps
           ═══════════════════════════════════════════════════════════════ */}
        <g stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round">
          {/* Continuous scenic delivery highway */}
          <path
            d="M 10 76 Q 130 92 240 82 Q 350 72 470 82"
            strokeWidth="1.8"
            opacity={0.32}
          />
          {/* Road dashed centerlines */}
          <line x1="25" y1="81" x2="55" y2="83" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />
          <line x1="85" y1="86" x2="115" y2="87" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />
          <line x1="145" y1="87" x2="175" y2="85" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />
          <line x1="295" y1="78" x2="325" y2="77" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />
          <line x1="355" y1="77" x2="385" y2="79" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />
          <line x1="415" y1="81" x2="445" y2="83" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.25} />

          {/* Dashed delivery flight / GPS journey trail from shop to customer */}
          <path
            d="M 105 58 Q 240 100 365 58"
            strokeDasharray="4 4"
            strokeWidth="1.4"
            opacity={0.3}
          />

          {/* GPS Pin marker over route */}
          <g transform="translate(233, 76) scale(0.85)" opacity={0.4}>
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="9" r="2.5" strokeWidth="1.2" />
          </g>

          {/* Delivery parcel boxes on the roadside */}
          <rect x="110" y="90" width="16" height="13" rx="2" strokeWidth="1.3" opacity={0.32} />
          <line x1="118" y1="90" x2="118" y2="103" strokeWidth="1" opacity={0.28} />
          <line x1="110" y1="96" x2="126" y2="96" strokeWidth="1" opacity={0.28} />

          <rect x="350" y="90" width="18" height="14" rx="2" strokeWidth="1.3" opacity={0.32} />
          <line x1="359" y1="90" x2="359" y2="104" strokeWidth="1" opacity={0.28} />
          <line x1="350" y1="97" x2="368" y2="97" strokeWidth="1" opacity={0.28} />

          {/* Milestone kilometer stone */}
          <path d="M 28 92 C 28 86 38 86 38 92 L 38 106 L 28 106 Z" strokeWidth="1.3" opacity={0.32} />
          <text
            x="33"
            y="99"
            fontSize="5"
            fontWeight="900"
            textAnchor="middle"
            fill={primaryColor}
            stroke="none"
            opacity={0.45}
          >
            4K
          </text>

          {/* Roadside streetlamp */}
          <line x1="440" y1="78" x2="440" y2="110" strokeWidth="1.4" opacity={0.28} />
          <path d="M 440 84 C 446 81 446 72 438 70" strokeWidth="1.2" opacity={0.28} />
          <path d="M 436 72 L 441 72 L 443 78 L 434 78 Z" strokeWidth="1" opacity={0.28} />
        </g>
      </svg>
    </div>
  );
};

/* ─── APP-WIDE SUBTLE WATERMARK OUTLINES BACKGROUND (Very little noticeable, elegant lifestyle outlines) ─── */
const AppSubtleOutlinesBackground = ({
  strokeColor = '#0F172A'
}: {
  strokeColor?: string;
}) => {
  return (
    <div className="app-subtle-outlines-layer" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <pattern
            id="app_subtle_wallpaper_pattern"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* 1. Delivery Scooter */}
            <g
              transform="translate(18, 15) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <circle cx="8" cy="22" r="5.5" />
              <circle cx="28" cy="22" r="5.5" />
              <path d="M 13 22 L 23 22" />
              <path d="M 28 22 L 24 10 L 21 10" />
              <path d="M 25 12 L 28 12" />
              <path d="M 14 18 C 17 14 21 14 23 18" />
              <rect x="5" y="10" width="10" height="9" rx="2" />
              <line x1="10" y1="10" x2="10" y2="7" />
              <line x1="8" y1="7" x2="12" y2="7" />
            </g>

            {/* 2. Hot Steaming Coffee / Tea Mug */}
            <g
              transform="translate(74, 16) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <path d="M 5 10 L 7 24 C 7 27 21 27 21 24 L 23 10 Z" />
              <path d="M 23 13 C 27 13 27 20 23 20" />
              <line x1="3" y1="27" x2="25" y2="27" />
              <path d="M 9 7 C 9 4 12 3 11 0" />
              <path d="M 14 7 C 14 4 17 3 16 0" />
              <path d="M 19 7 C 19 4 22 3 21 0" />
            </g>

            {/* 3. Grocery Shopping Tote Bag */}
            <g
              transform="translate(128, 16) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <rect x="5" y="10" width="20" height="20" rx="3" />
              <path d="M 10 10 C 10 4 20 4 20 10" />
              <path d="M 15 17 L 15 23 M 12 20 L 18 20" strokeWidth="1.2" />
            </g>

            {/* 4. Bakery Croissant */}
            <g
              transform="translate(34, 68) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <path d="M 4 22 C 3 14 11 7 18 7 C 25 7 33 14 32 22 C 29 18 25 15 18 15 C 11 15 7 18 4 22 Z" />
              <path d="M 12 11 C 13 14 13 17 12 20" />
              <path d="M 18 7 C 18 11 18 15 18 19" />
              <path d="M 24 11 C 23 14 23 17 24 20" />
            </g>

            {/* 5. Restaurant Cloche (Food Cover Platter) */}
            <g
              transform="translate(94, 68) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <circle cx="16" cy="7" r="2.5" />
              <path d="M 5 21 C 5 12 27 12 27 21 Z" />
              <line x1="2" y1="23" x2="30" y2="23" />
            </g>

            {/* 6. Crossed Cutlery (Fork & Spoon) */}
            <g
              transform="translate(138, 72) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <path d="M 4 5 L 8 13 L 18 26" />
              <path d="M 4 5 L 6 9 M 8 5 L 8 9 M 12 5 L 10 9" />
              <path d="M 18 5 C 15 5 14 9 17 12 L 5 26" />
            </g>

            {/* 7. Health Capsule & Plus */}
            <g
              transform="translate(18, 120) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <rect x="4" y="6" width="22" height="12" rx="6" transform="rotate(-35 15 12)" />
              <line x1="15" y1="6" x2="15" y2="18" transform="rotate(-35 15 12)" />
              <path d="M 24 20 L 24 26 M 21 23 L 27 23" strokeWidth="1.2" />
            </g>

            {/* 8. Fresh Organic Apple */}
            <g
              transform="translate(74, 122) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <path d="M 14 7 C 9 7 5 11 5 17 C 5 24 10 27 14 27 C 18 27 23 24 23 17 C 23 11 19 7 14 7 Z" />
              <path d="M 14 7 C 14 3 17 2 17 2" />
              <path d="M 16 3 C 19 3 20 5 18 6" />
            </g>

            {/* 9. Store Awning / Kirana Shop */}
            <g
              transform="translate(126, 122) scale(0.65)"
              stroke={strokeColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.045}
            >
              <path d="M 4 10 L 26 10 L 28 16 C 24 19 22 19 19 16 C 16 19 14 19 11 16 C 8 19 6 19 2 16 Z" />
              <line x1="11" y1="10" x2="11" y2="16" strokeWidth="1" />
              <line x1="19" y1="10" x2="19" y2="16" strokeWidth="1" />
              <line x1="5" y1="16" x2="5" y2="27" />
              <line x1="25" y1="16" x2="25" y2="27" />
              <rect x="11" y="19" width="8" height="8" rx="1" />
              <line x1="3" y1="27" x2="27" y2="27" />
            </g>

            {/* 10. Subtle Micro Sparks */}
            <path d="M 58 46 L 58 50 M 56 48 L 60 48" stroke={strokeColor} strokeWidth="1" opacity={0.035} />
            <path d="M 116 48 L 116 52 M 114 50 L 118 50" stroke={strokeColor} strokeWidth="1" opacity={0.035} />
            <path d="M 15 95 L 15 99 M 13 97 L 17 97" stroke={strokeColor} strokeWidth="1" opacity={0.035} />
            <path d="M 72 96 L 72 100 M 70 98 L 74 98" stroke={strokeColor} strokeWidth="1" opacity={0.035} />
            <path d="M 152 142 L 152 146 M 150 144 L 154 144" stroke={strokeColor} strokeWidth="1" opacity={0.035} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#app_subtle_wallpaper_pattern)" />
      </svg>
    </div>
  );
};

const CommunityFooterWatermark = ({ 
  activeCategory = 'food',
  primaryColor = '#DC2626' 
}: { 
  activeCategory?: string; 
  primaryColor?: string; 
}) => {
  const contentMap: Record<string, { title1: string; title2: string; item1: string; item2: string; item3: string }> = {
    food: {
      title1: 'A better place',
      title2: 'for everyone',
      item1: 'Happy Customers',
      item2: 'Rider Safety & Fair Pay',
      item3: 'Empowering Local Restaurants'
    },
    supermarket: {
      title1: 'Fresh essentials',
      title2: 'for every home',
      item1: 'Instant 10-Min Pantry',
      item2: 'Rider Safety & Fair Pay',
      item3: 'Empowering Local Kiranas'
    },
    pharmacy: {
      title1: 'Care & wellness',
      title2: 'when you need it',
      item1: '24/7 Express First Aid',
      item2: 'Rider Safety & Fair Pay',
      item3: 'Empowering Local Chemists'
    }
  };

  const content = contentMap[activeCategory] || contentMap.food;

  return (
    <div className="community-footer-watermark" style={{ textAlign: 'center', padding: '48px 20px 110px', background: 'transparent', width: '100%', userSelect: 'none' }}>
      {/* Category-Adaptive Soft Watermark Tagline */}
      <div 
        style={{ 
          fontSize: 34, 
          fontWeight: 900, 
          fontFamily: "'Space Grotesk', 'Outfit', var(--font-title), sans-serif", 
          letterSpacing: '-0.04em', 
          color: '#CBD5E1', 
          lineHeight: 1.15,
          marginBottom: 14,
          opacity: 0.85
        }}
      >
        {content.title1} <br />
        <span style={{ color: primaryColor, opacity: 0.9 }}>{content.title2}</span>
      </div>

      {/* 3 Pillars rendered in Indie Flower handwritten font */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px auto 0' }}>
        <span style={{ fontSize: 22, fontFamily: "'Indie Flower', cursive, sans-serif", fontWeight: 700, color: '#64748B', letterSpacing: '0.2px' }}>
          {content.item1}
        </span>
        <span style={{ fontSize: 22, fontFamily: "'Indie Flower', cursive, sans-serif", fontWeight: 700, color: '#64748B', letterSpacing: '0.2px' }}>
          {content.item2}
        </span>
        <span style={{ fontSize: 22, fontFamily: "'Indie Flower', cursive, sans-serif", fontWeight: 700, color: '#64748B', letterSpacing: '0.2px' }}>
          {content.item3}
        </span>
      </div>
    </div>
  );
};

const TVM_AREAS = [
  'Palayam',
  'Vazhuthacaud',
  'Statue',
  'Kowdiar',
  'Vellayambalam',
  'Sasthamangalam',
  'Pattom',
  'Kesavadasapuram',
  'Chalai',
  'Thampanoor',
  'Kuravankonam',
  'Kazhakkoottam',
  'Lulu Mall',
  'Kovalam'
];

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeCategory, setActiveCategory] = useState<string>('food');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [placeholderIndex, setPlaceholderIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(['tvm_1', 'tvm_3']);
  
  // User Selected Delivery Location in Trivandrum
  const [userLocation, setUserLocation] = useState<string>('Palayam');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Cart with Max 10 items limit for multi-store express
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; qty: number; sauce?: string; store?: string }[]>([
    { id: 'm_tvm_1_1', name: 'Malabar Chicken Dum Biriyani', price: 240, qty: 1, sauce: 'Zam Zam', store: 'Zam Zam Restaurant' }
  ]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string>('Standard');
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoFinished, setVideoFinished] = useState<boolean>(false);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  
  // Universal Multi-Tab Filters (Location, Price, Diet, Sugar)
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filterRating48, setFilterRating48] = useState<boolean>(false);
  const [filterFreeDelivery, setFilterFreeDelivery] = useState<boolean>(false);
  const [filterFastETA, setFilterFastETA] = useState<boolean>(false);
  const [filterLocality, setFilterLocality] = useState<string>('All');
  const [filterMaxDistKm, setFilterMaxDistKm] = useState<number>(15); // max distance in km
  const [filterPriceRange, setFilterPriceRange] = useState<string>('All'); // 'All' | 'under150' | '150-300' | '300-500' | 'above500'
  const [filterDiet, setFilterDiet] = useState<string>('All'); // 'All' | 'veg' | 'non-veg' | 'vegan' | 'keto' | 'high-protein'
  const [filterSugar, setFilterSugar] = useState<string>('All'); // 'All' | 'sugar-free' | 'low-sugar' | 'sweet' | 'diabetic-friendly'
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'eta' | 'price_low' | 'price_high' | 'dist'>('default');
  const [activeQuickFilterId, setActiveQuickFilterId] = useState<string>('all');

  // Multi-Store Order Builder State (Within 5km constraint & scoped to category)
  const [showCustomStoreBuilder, setShowCustomStoreBuilder] = useState<boolean>(false);
  const [customStore1, setCustomStore1] = useState<string>('Zam Zam Restaurant');
  const [customStore2, setCustomStore2] = useState<string>('Azad Restaurant');

  // Gamification & Spin Wheel State
  const [showSpinWheelModal, setShowSpinWheelModal] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<SpinReward | null>(null);

  // Cravings Roulette / Kerala Slot Machine State
  const [showSlotMachineModal, setShowSlotMachineModal] = useState<boolean>(false);
  const [isLeverPulled, setIsLeverPulled] = useState<boolean>(false);
  const [rouletteMood, setRouletteMood] = useState<string | null>('spicy');
  const [rouletteDish, setRouletteDish] = useState<MenuItem | null>(null);
  const [isRouletteSpinning, setIsRouletteSpinning] = useState<boolean>(false);
  const [slotReel1, setSlotReel1] = useState<VectorSymbol>(SYMBOL_PRESETS.spicy);
  const [slotReel2, setSlotReel2] = useState<VectorSymbol>(SYMBOL_PRESETS.chicken);
  const [slotReel3, setSlotReel3] = useState<VectorSymbol>(SYMBOL_PRESETS.sweet);
  const [slotSpinningReel1, setSlotSpinningReel1] = useState<boolean>(false);
  const [slotSpinningReel2, setSlotSpinningReel2] = useState<boolean>(false);
  const [slotSpinningReel3, setSlotSpinningReel3] = useState<boolean>(false);
  const [useVideoMode, setUseVideoMode] = useState<boolean>(true);
  const [horizontalOffsetX, setHorizontalOffsetX] = useState<number>(0);
  const slotVideoRef = useRef<HTMLVideoElement | null>(null);

  const horizontalTrackDishes = useMemo(() => {
    return [
      ...ALL_TRIVANDRUM_FOOD_DISHES,
      ...ALL_TRIVANDRUM_FOOD_DISHES,
      ...ALL_TRIVANDRUM_FOOD_DISHES,
      ...ALL_TRIVANDRUM_FOOD_DISHES
    ];
  }, []);

  // Discover Screen Budget Filter State
  const [discoverMaxPrice, setDiscoverMaxPrice] = useState<number>(99);
  const [discoverVegOnly, setDiscoverVegOnly] = useState<boolean>(false);
  const [discoverTopRated, setDiscoverTopRated] = useState<boolean>(false);

  const triggerSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);

    const randomIndex = Math.floor(Math.random() * SPIN_WHEEL_REWARDS.length);
    const sliceAngle = 360 / SPIN_WHEEL_REWARDS.length;
    const extraRotations = 1800;
    const targetSliceCenter = randomIndex * sliceAngle + sliceAngle / 2;
    const finalDegree = wheelRotation + extraRotations + (360 - (wheelRotation % 360) - targetSliceCenter);

    setWheelRotation(finalDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const reward = SPIN_WHEEL_REWARDS[randomIndex];
      setWonReward(reward);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }, 3600);
  };

  const triggerCravingsRoulette = (moodTag: string = 'spicy') => {
    if (isRouletteSpinning) return;
    setRouletteMood(moodTag);
    setIsRouletteSpinning(true);
    setIsLeverPulled(true);
    setTimeout(() => setIsLeverPulled(false), 450);
    setRouletteDish(null);

    // Pick a random winning card index in the track array (e.g. index 24 to 38)
    const winIndex = 24 + Math.floor(Math.random() * 15);
    const finalDish = horizontalTrackDishes[winIndex];

    // Reset offset first if far right to allow repeated spins smoothly
    if (Math.abs(horizontalOffsetX) > 3000) {
      setHorizontalOffsetX(0);
    }

    // Each card is 130px wide + 12px gap = 142px total step.
    // Center indicator line is at ~170px from left inside the 380px container.
    const targetOffset = -(winIndex * 142 - 125);
    setTimeout(() => {
      setHorizontalOffsetX(targetOffset);
    }, 50);

    setTimeout(() => {
      setIsRouletteSpinning(false);
      setRouletteDish(finalDish);
      try {
        confetti({ particleCount: 140, spread: 95, origin: { y: 0.6 } });
      } catch (e) {}
    }, 6500);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeTheme: CategoryTheme = CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES.food;
  const currentStores: Store[] = STORES_BY_CATEGORY[activeCategory] || STORES_BY_CATEGORY.food;

  const activeNavIndex = useMemo(() => {
    switch (currentScreen) {
      case 'home': return 0;
      case 'discover': return 1;
      case 'multiorder': return 2;
      case 'cart':
      case 'tracker': return 3;
      case 'profile': return 4;
      default: return 0;
    }
  }, [currentScreen]);

  const categoryPlaceholders = useMemo(() => {
    if (activeCategory === 'supermarket') {
      return ["Search for 'Organic Milk'", "Search for 'Avocados'", "Search for 'Fresh Eggs'", "Search for 'Sourdough'"];
    }
    if (activeCategory === 'pharmacy') {
      return ["Search for 'Vitamin C'", "Search for 'Chamomile Tea'", "Search for 'First Aid'", "Search for 'Electrolytes'"];
    }
    return ["Search for 'Biriyani'", "Search for 'Porotta'", "Search for 'Shawarma'", "Search for 'Fish Nirvana'", "Search for 'Alfaham'"];
  }, [activeCategory]);

  // Rotating placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categoryPlaceholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [categoryPlaceholders]);

  const toggleFavorite = (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  // Compute store distances from user location
  const storesWithDistance = useMemo(() => {
    return currentStores.map((st) => {
      const stLoc = st.locality || (st.categoryTag.split('•')[0].trim());
      const dist = getDistanceBetweenLocalities(userLocation, stLoc);
      return { ...st, distKm: dist };
    });
  }, [currentStores, userLocation]);

  // Primary store for multi-store 5km calculation
  const store1Obj = useMemo(() => {
    return currentStores.find((s) => s.name === customStore1) || currentStores[0];
  }, [currentStores, customStore1]);

  const store1Locality = store1Obj?.locality || (store1Obj?.categoryTag?.split('•')[0]?.trim()) || 'Palayam';

  // Stores available within 5km of Store 1
  const storesWithin5kmOfStore1 = useMemo(() => {
    return currentStores.map((st) => {
      const stLoc = st.locality || (st.categoryTag.split('•')[0].trim());
      const dist = getDistanceBetweenLocalities(store1Locality, stLoc);
      return { ...st, distFromStore1: dist };
    });
  }, [currentStores, store1Locality]);

  const validStore2Options = useMemo(() => {
    return storesWithin5kmOfStore1.filter((s) => s.name !== customStore1 && s.distFromStore1 <= 5.0);
  }, [storesWithin5kmOfStore1, customStore1]);

  // Selected Store 2 distance
  const currentStore2Distance = useMemo(() => {
    const found = storesWithin5kmOfStore1.find((s) => s.name === customStore2);
    return found ? found.distFromStore1 : 0;
  }, [storesWithin5kmOfStore1, customStore2]);

  // Filtered Stores calculation
  const filteredStores = useMemo(() => {
    return storesWithDistance.filter((store) => {
      if (filterRating48 && store.rating < 4.8) return false;
      if (filterFreeDelivery && store.deliveryFee !== 'Free') return false;
      if (filterFastETA) {
        const num = parseInt(store.eta, 10);
        if (!isNaN(num) && num > 15) return false;
      }
      if (filterLocality !== 'All' && !(store.locality || store.categoryTag).toLowerCase().includes(filterLocality.toLowerCase())) {
        return false;
      }
      if (store.distKm > filterMaxDistKm) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'eta') return parseInt(a.eta, 10) - parseInt(b.eta, 10);
      if (sortBy === 'dist') return a.distKm - b.distKm;
      return 0;
    });
  }, [storesWithDistance, filterRating48, filterFreeDelivery, filterFastETA, filterLocality, filterMaxDistKm, sortBy]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterRating48) count++;
    if (filterFreeDelivery) count++;
    if (filterFastETA) count++;
    if (filterLocality !== 'All') count++;
    if (filterMaxDistKm < 15) count++;
    if (filterPriceRange !== 'All') count++;
    if (filterDiet !== 'All') count++;
    if (filterSugar !== 'All') count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [filterRating48, filterFreeDelivery, filterFastETA, filterLocality, filterMaxDistKm, filterPriceRange, filterDiet, filterSugar, sortBy]);

  const resetAllFilters = () => {
    setFilterRating48(false);
    setFilterFreeDelivery(false);
    setFilterFastETA(false);
    setFilterLocality('All');
    setFilterMaxDistKm(15);
    setFilterPriceRange('All');
    setFilterDiet('All');
    setFilterSugar('All');
    setSortBy('default');
  };

  const renderSectionList = (sections: { id: string; title: string; subtitle: string; icon: LucideIcon; badgeColor: string; stores: (Store & { distKm?: number })[] }[]) => {
    return sections.map((sec) => {
      const SectionIcon = sec.icon;
      return (
        <div key={sec.id} className="store-section-group" style={{ marginBottom: 10 }}>
          <div className="store-section-header" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, padding: '0 2px' }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `${sec.badgeColor}18`,
              border: `1px solid ${sec.badgeColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <SectionIcon size={14} color={sec.badgeColor} />
            </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 13.5,
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15
            }}>
              {sec.title}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, marginTop: 1 }}>
              {sec.subtitle}
            </div>
          </div>
        </div>

        <div className="store-cards-list" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {sec.stores.map((store) => (
            <motion.div
              key={store.id}
              className="swiggy-rest-card"
              whileHover={{ y: -3 }}
              onClick={() => {
                setSelectedStore(store);
                setCurrentScreen('menu');
              }}
            >
              <div className="swiggy-rest-img-col">
                <img src={store.image} alt={store.name} className="swiggy-rest-img" />
                <button
                  className={`swiggy-fav-btn ${favorites.includes(store.id) ? 'favorited' : ''}`}
                  onClick={(e) => toggleFavorite(store.id, e)}
                >
                  <Heart size={14} fill={favorites.includes(store.id) ? '#FFFFFF' : 'none'} />
                </button>
                {store.discountTag && (
                  <div className="swiggy-discount-ribbon">{store.discountTag}</div>
                )}
              </div>

              <div className="swiggy-rest-info-col">
                <div className="swiggy-rest-title-row">
                  <div className="swiggy-rest-name">{store.name}</div>
                </div>

                <div className="swiggy-rating-row">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  <span>{store.rating} ({store.reviewCount || '1.2K+'}) • {store.eta}</span>
                </div>

                <div className="swiggy-cuisines-text">
                  {store.categoryTag.split('•').slice(1).join('•').trim() || 'South Indian, Biriyani'}
                </div>

                <div className="swiggy-loc-dist">
                  {store.locality || store.categoryTag.split('•')[0].trim()} • {store.distKm} km from {userLocation}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  });
};

  const renderCategorizedStoreSections = (storesList: (Store & { distKm?: number })[]) => {
    if (activeCategory === 'supermarket') {
      const freshStores = storesList.filter(s => /dairy|fresh|bread|milk|produce|fruit/i.test(s.name + ' ' + s.categoryTag));
      const budgetStores = storesList.filter(s => !freshStores.includes(s) && (/margin|pothys|spices|under|200|budget/i.test(s.name + ' ' + s.categoryTag) || s.discountTag));
      const remainingStores = storesList.filter(s => !freshStores.includes(s) && !budgetStores.includes(s));

      const sections = [
        { id: 'fresh', title: 'Daily Fresh & Dairy Nest!', subtitle: 'Farm Fresh Milk, Organic Produce & Breads', icon: ShoppingBag, badgeColor: '#10B981', stores: freshStores },
        { id: 'budget', title: 'Pocket-Friendly Pantry Deals Under ₹200!', subtitle: 'Essential staples & snacks at unbeatable prices', icon: Percent, badgeColor: '#F59E0B', stores: budgetStores },
        { id: 'mega', title: 'Mega Supermarkets & Big Savings!', subtitle: 'Hypermarket imports & all-in-one store deals', icon: ShoppingBag, badgeColor: '#3B82F6', stores: remainingStores }
      ].filter(s => s.stores.length > 0);

      if (sections.length === 0) {
        sections.push({ id: 'all', title: 'All Supermarket Merchants', subtitle: 'Fresh groceries delivered to your door', icon: ShoppingBag, badgeColor: activeTheme.primary, stores: storesList });
      }

      return renderSectionList(sections);
    }

    if (activeCategory === 'pharmacy') {
      const fitnessStores = storesList.filter(s => /vitamin|fitness|protein|wellness|dermat/i.test(s.name + ' ' + s.categoryTag));
      const budgetStores = storesList.filter(s => !fitnessStores.includes(s) && (/aid|first aid|hygiene|under|200|care/i.test(s.name + ' ' + s.categoryTag) || s.discountTag));
      const remainingStores = storesList.filter(s => !fitnessStores.includes(s) && !budgetStores.includes(s));

      const sections = [
        { id: 'fitness', title: 'Health Boosters & Fitness Rewards!', subtitle: 'Vitamins, Protein Supplements & Skincare', icon: Heart, badgeColor: '#3B82F6', stores: fitnessStores },
        { id: 'budget', title: 'Pocket-Friendly Care Under ₹200!', subtitle: 'First Aid, Daily Hygiene & Care Products', icon: Percent, badgeColor: '#10B981', stores: budgetStores },
        { id: 'express', title: 'Essential Medicines & First Aid', subtitle: 'Trusted local pharmacies with express delivery', icon: Pill, badgeColor: '#EC4899', stores: remainingStores }
      ].filter(s => s.stores.length > 0);

      if (sections.length === 0) {
        sections.push({ id: 'all', title: 'All Pharmacy Merchants', subtitle: 'Health & medical supplies delivered fast', icon: Pill, badgeColor: activeTheme.primary, stores: storesList });
      }

      return renderSectionList(sections);
    }

    // Default / Food category: 4 themed sections
    const sweetsStores = storesList.filter(s =>
      /sweet|ice cream|creamery|bakery|cake|waffle|dessert|baskin|donut|pastry|paul/i.test(s.name + ' ' + s.categoryTag)
    );

    const budgetStores = storesList.filter(s =>
      !sweetsStores.includes(s) && (
        /under|99|budget|pocket|ambiswamy|saravana|margin|buhari|tiffin|veg/i.test(s.name + ' ' + s.categoryTag) ||
        (s.discountTag && (s.discountTag.includes('FLAT') || s.discountTag.includes('40%') || s.discountTag.includes('50%') || s.discountTag.includes('60%')))
      )
    );

    const biriyaniSpicyStores = storesList.filter(s =>
      !sweetsStores.includes(s) && !budgetStores.includes(s) && (
        /biriyani|spicy|dum|halais|paragon|imperial|kebab|tandoori|grill|chicken|meat|fish|coastal/i.test(s.name + ' ' + s.categoryTag)
      )
    );

    const remainingStores = storesList.filter(s =>
      !sweetsStores.includes(s) && !budgetStores.includes(s) && !biriyaniSpicyStores.includes(s)
    );

    const sections = [
      {
        id: 'sweets',
        title: 'Craving Sweets & Tasty Treats?',
        subtitle: 'Artisanal Ice Creams, Bakery, Waffles & Desserts',
        icon: Cake,
        badgeColor: '#EC4899',
        stores: sweetsStores
      },
      {
        id: 'budget',
        title: 'Pocket-Friendly Eats Under ₹200!',
        subtitle: 'Delicious local meals that love your wallet',
        icon: Percent,
        badgeColor: '#10B981',
        stores: budgetStores
      },
      {
        id: 'spicy',
        title: 'Trivandrum Biriyani & Spicy Feasts!',
        subtitle: 'Aromatic Dum Biriyanis, Malabar Spices & Fiery Curries',
        icon: Flame,
        badgeColor: '#EF4444',
        stores: biriyaniSpicyStores
      },
      {
        id: 'quick',
        title: 'Lightning Fast & Quick Delights!',
        subtitle: 'Delivered in 15 mins or less right to your door',
        icon: Zap,
        badgeColor: '#3B82F6',
        stores: remainingStores
      }
    ].filter(s => s.stores.length > 0);

    if (sections.length === 0) {
      sections.push({
        id: 'all',
        title: 'All Merchants Near You',
        subtitle: 'Top rated stores delivered fast',
        icon: Utensils,
        badgeColor: activeTheme.primary,
        stores: storesList
      });
    }

    return renderSectionList(sections);
  };

  // Filter dishes by diet, sugar, price, search
  const currentStoreDishes: MenuItem[] = useMemo(() => {
    const baseDishes = (selectedStore && TRIVANDRUM_FOOD_MENU_ITEMS[selectedStore.id])
      ? TRIVANDRUM_FOOD_MENU_ITEMS[selectedStore.id]
      : (MENU_ITEMS_BY_CATEGORY[activeCategory] || ALL_TRIVANDRUM_FOOD_DISHES);

    return baseDishes.filter((dish) => {
      if (filterDiet !== 'All' && dish.diet !== filterDiet) return false;
      if (filterSugar !== 'All' && dish.sugar !== filterSugar) return false;
      if (filterPriceRange === 'under150' && dish.price >= 150) return false;
      if (filterPriceRange === '150-300' && (dish.price < 150 || dish.price > 300)) return false;
      if (filterPriceRange === '300-500' && (dish.price < 300 || dish.price > 500)) return false;
      if (filterPriceRange === 'above500' && dish.price <= 500) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0;
    });
  }, [selectedStore, activeCategory, filterDiet, filterSugar, filterPriceRange, sortBy]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.qty, 0);
  }, [cartItems]);

  const spotlightNavItems: SpotlightNavItem[] = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, onClick: () => setCurrentScreen('home') },
    { id: 'discover', label: 'Discover', icon: Compass, onClick: () => setCurrentScreen('discover') },
    { id: 'multiorder', label: 'Multi-Order', icon: MultiOrderIcon, badge: 'New', onClick: () => setCurrentScreen('multiorder') },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: totalCartCount > 0 ? totalCartCount : undefined, onClick: () => setCurrentScreen('cart') },
    { id: 'profile', label: 'Profile', icon: User, onClick: () => setCurrentScreen('profile') },
  ], [totalCartCount]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  }, [cartItems]);

  const cartCategory = useMemo(() => {
    if (cartItems.length > 0) {
      const hasPharm = cartItems.some(i => i.id.startsWith('pharm') || /pharm|med|care|pill|supplement/i.test(i.store || ''));
      if (hasPharm) return 'pharmacy';
      const hasGroc = cartItems.some(i => i.id.startsWith('groc') || /market|fresh|super|grocery|pantry/i.test(i.store || ''));
      if (hasGroc) return 'supermarket';
      return 'food';
    }
    return activeCategory || 'food';
  }, [cartItems, activeCategory]);

  // Unique stores in cart for multi-store delivery fee calculation
  const distinctStoresInCart = useMemo(() => {
    const stores = new Set(cartItems.map((i) => i.store || i.sauce || 'Main Merchant'));
    return stores.size;
  }, [cartItems]);

  // Delivery charge calculation: Increases as customer adds merchants and items
  const dynamicDeliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    let base = 0; // free base for gold promo or ₹30 standard
    if (distinctStoresInCart > 1) {
      base += (distinctStoresInCart - 1) * 25; // +₹25 per extra pickup store
    }
    // Surcharge if > 4 items (+₹5 per extra heavy item)
    if (totalCartCount > 4) {
      base += (totalCartCount - 4) * 5;
    }
    return base;
  }, [distinctStoresInCart, totalCartCount, cartItems.length]);

  const finalCartTotal = cartSubtotal + dynamicDeliveryFee;

  const canGoBack = currentScreen !== 'home' || searchQuery.trim() !== '';

  const handleGoBack = () => {
    if (searchQuery.trim() !== '') {
      setSearchQuery('');
      return;
    }
    setCurrentScreen('home');
  };

  const getItemQty = (id: string) => {
    const found = cartItems.find((x) => x.id === id);
    return found ? found.qty : 0;
  };

  const updateItemQty = (item: MenuItem, delta: number) => {
    if (delta > 0 && totalCartCount >= 10) {
      setLimitWarning('Maximum 10 items limit reached for express delivery.');
      setTimeout(() => setLimitWarning(null), 3500);
      return;
    }

    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      if (idx === -1) {
        if (delta > 0) {
          return [
            ...prev,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              qty: 1,
              sauce: selectedSauce,
              store: item.storeName || (selectedStore ? selectedStore.name : '4Kit Store')
            }
          ];
        }
        return prev;
      }
      const next = [...prev];
      const newQty = next[idx].qty + delta;
      if (newQty <= 0) return next.filter((x) => x.id !== item.id);
      next[idx].qty = newQty;
      return next;
    });
  };

  const addModalItemToCart = () => {
    if (!selectedDish) return;
    updateItemQty(selectedDish, 1);
    setSelectedDish(null);
  };

  const addBundleToCart = (bundle: MultiStoreBundle) => {
    if (totalCartCount + bundle.items.length > 10) {
      setLimitWarning('Adding this bundle exceeds the 10 item express limit.');
      setTimeout(() => setLimitWarning(null), 3500);
      return;
    }
    const newItems = bundle.items.map((bi) => ({
      id: `${bi.id}_${Date.now()}`,
      name: bi.name,
      price: bi.price,
      qty: 1,
      sauce: bi.store,
      store: bi.store
    }));
    setCartItems((prev) => [...prev, ...newItems]);
    setCurrentScreen('cart');
  };

  const addCustomMultiStoreOrder = () => {
    if (totalCartCount + 2 > 10) {
      setLimitWarning('Maximum 10 items limit reached.');
      setTimeout(() => setLimitWarning(null), 3500);
      return;
    }

    const dish1 = ALL_TRIVANDRUM_FOOD_DISHES.find((d) => d.storeName === customStore1) || ALL_TRIVANDRUM_FOOD_DISHES[0];
    const dish2 = ALL_TRIVANDRUM_FOOD_DISHES.find((d) => d.storeName === customStore2) || ALL_TRIVANDRUM_FOOD_DISHES[1];

    setCartItems((prev) => [
      ...prev,
      { id: `c_item_1_${Date.now()}`, name: dish1.name, price: dish1.price, qty: 1, sauce: customStore1, store: customStore1 },
      { id: `c_item_2_${Date.now()}`, name: dish2.name, price: dish2.price, qty: 1, sauce: customStore2, store: customStore2 }
    ]);
    setShowCustomStoreBuilder(false);
    setCurrentScreen('cart');
  };

  const handleConfirmOrder = () => {
    setShowOrderSuccessModal(true);
    setIsVideoPlaying(true);
    setVideoFinished(false);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setVideoFinished(true);
    try {
      confetti({ particleCount: 220, spread: 120, origin: { y: 0.5 } });
    } catch (_) {}
  };

  const skipVideo = () => {
    handleVideoEnd();
  };

  const proceedToTracker = () => {
    setShowOrderSuccessModal(false);
    setIsVideoPlaying(false);
    setVideoFinished(false);
    setCurrentScreen('tracker');
  };

  const selectCategory = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery('');
    setActiveQuickFilterId('all');
    setFilterRating48(false);
    setFilterFastETA(false);
    setFilterFreeDelivery(false);
    setFilterMaxDistKm(15);
    setFilterPriceRange('All');
    setFilterDiet('All');
    setFilterSugar('All');
    setSortBy('default');
  };

  // Category promotional specials banners tailored in 4Kit colors with smooth color loop ending on Full White
  const categorySpecials = useMemo(() => {
    if (activeCategory === 'supermarket') {
      return [
        {
          id: 'spec_groc_1',
          title: 'Fresh Farm Specials',
          subtitle: 'Up to 40% OFF Daily Groceries & Fruits',
          bg: 'linear-gradient(135deg, #FFFFFF 0%, #E6F4EA 100%)',
          cta: 'SHOP FRESH',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=320&h=220&fit=crop',
          textColor: '#022C22',
          btnBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_groc_2',
          title: 'Dairy & Breads Fast',
          subtitle: 'Farm Milk & Sourdough in 15 mins',
          bg: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)',
          cta: 'ORDER NOW',
          image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=320&h=220&fit=crop',
          textColor: '#022C22',
          btnBg: '#022C22',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_groc_3',
          title: 'Organic Pantry Essentials',
          subtitle: 'FLAT ₹100 Cashback on Grains & Pulses',
          bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          cta: 'EXPLORE',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(180deg, #FEF08A 0%, #FACC15 100%)',
          btnColor: '#022C22'
        },
        {
          id: 'spec_groc_4',
          title: 'Exotic Fruits & Berries',
          subtitle: 'Imported Avocados, Kiwis & Strawberries',
          bg: 'linear-gradient(135deg, #065F46 0%, #022C22 100%)',
          cta: 'GRAB DEALS',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)',
          btnColor: '#022C22'
        },
        {
          id: 'spec_groc_5',
          title: 'Snacks & Beverages Zone',
          subtitle: 'Buy 1 Get 1 Free on Artisan Chips & Drinks',
          bg: 'linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)',
          cta: 'VIEW SNACKS',
          image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=320&h=220&fit=crop',
          textColor: '#022C22',
          btnBg: '#064E3B',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_groc_6',
          title: 'Household & Cleaning',
          subtitle: 'Up to 50% OFF Top Hygiene Brands',
          bg: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)',
          cta: 'STOCK UP',
          image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
          btnColor: '#064E3B'
        }
      ];
    }
    if (activeCategory === 'pharmacy') {
      return [
        {
          id: 'spec_pharm_1',
          title: 'Health & Wellness Specials',
          subtitle: 'Up to 50% OFF Vitamins & Supplements',
          bg: 'linear-gradient(135deg, #FFFFFF 0%, #E8F0FE 100%)',
          cta: 'ORDER MEDS',
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=320&h=220&fit=crop',
          textColor: '#172554',
          btnBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_pharm_2',
          title: '24/7 First Aid Express',
          subtitle: 'Delivered in 10 mins to your doorstep',
          bg: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)',
          cta: 'EXPLORE',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=320&h=220&fit=crop',
          textColor: '#172554',
          btnBg: '#0F172A',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_pharm_3',
          title: 'Personal Care & Skincare',
          subtitle: 'Dermatologist Recommended Essentials',
          bg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          cta: 'SHOP CARE',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
          btnColor: '#0F172A'
        },
        {
          id: 'spec_pharm_4',
          title: 'Baby Care & Nutrition',
          subtitle: 'Diapers, Formulas & Baby Foods',
          bg: 'linear-gradient(135deg, #1E40AF 0%, #172554 100%)',
          cta: 'VIEW BABY',
          image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_pharm_5',
          title: 'Fitness & Sports Health',
          subtitle: 'Protein Powders, Shakers & Hydration',
          bg: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)',
          cta: 'GET FIT',
          image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=320&h=220&fit=crop',
          textColor: '#172554',
          btnBg: '#172554',
          btnColor: '#FFFFFF'
        },
        {
          id: 'spec_pharm_6',
          title: 'Senior Care & Monitors',
          subtitle: 'BP Monitors, Glucometers & Wellness Tools',
          bg: 'linear-gradient(135deg, #1E40AF 0%, #172554 100%)',
          cta: 'CARE NOW',
          image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=320&h=220&fit=crop',
          textColor: '#FFFFFF',
          btnBg: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 100%)',
          btnColor: '#1E1B4B'
        }
      ];
    }
    return [
      {
        id: 'spec_food_1',
        title: 'Dinner & Chef Specials',
        subtitle: 'Up to 60% OFF Top Trivandrum Kitchens',
        bg: 'linear-gradient(135deg, #FFFFFF 0%, #FEE2E2 100%)',
        cta: 'ORDER NOW',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=320&h=220&fit=crop',
        textColor: '#7F1D1D',
        btnBg: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
        btnColor: '#FFFFFF'
      },
      {
        id: 'spec_food_2',
        title: 'Malabar Dum Biriyani Feast',
        subtitle: 'FLAT ₹50 OFF + Free Delivery',
        bg: 'linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)',
        cta: 'GRAB DEAL',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=320&h=220&fit=crop',
        textColor: '#450A0A',
        btnBg: '#0F172A',
        btnColor: '#FFFFFF'
      },
      {
        id: 'spec_food_3',
        title: 'Multi-Store Express',
        subtitle: 'Combine 2 Stores in 1 Order (5km Radius)',
        bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        cta: 'BUILD BUNDLE',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=320&h=220&fit=crop',
        textColor: '#FFFFFF',
        btnBg: 'linear-gradient(180deg, #FDE047 0%, #EAB308 100%)',
        btnColor: '#1C1917'
      },
      {
        id: 'spec_food_4',
        title: 'Late Night Cravings 24/7',
        subtitle: 'Burgers, Pizzas & Shakes Delivered Hot',
        bg: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
        cta: 'ORDER LATE',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=320&h=220&fit=crop',
        textColor: '#FFFFFF',
        btnBg: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
        btnColor: '#431407'
      },
      {
        id: 'spec_food_5',
        title: 'Dessert & Ice Cream Heaven',
        subtitle: 'Buy 2 Get 1 Free on Sundaes & Cakes',
        bg: 'linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)',
        cta: 'TREAT YOURSELF',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=320&h=220&fit=crop',
        textColor: '#450A0A',
        btnBg: '#450A0A',
        btnColor: '#FFFFFF'
      },
      {
        id: 'spec_food_6',
        title: 'Healthy Bowls & Salads',
        subtitle: 'Keto, Vegan & High-Protein Meal Kits',
        bg: 'linear-gradient(135deg, #BE123C 0%, #881337 100%)',
        cta: 'EAT CLEAN',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=320&h=220&fit=crop',
        textColor: '#FFFFFF',
        btnBg: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
        btnColor: '#78350F'
      }
    ];
  }, [activeCategory]);

  const promoCarouselRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Triple duplicated list for seamless infinite horizontal scrolling (left and right)
  const infiniteSpecials = useMemo(() => {
    return [
      ...categorySpecials.map((item) => ({ ...item, uniqueKey: `set0_${item.id}` })),
      ...categorySpecials.map((item) => ({ ...item, uniqueKey: `set1_${item.id}` })),
      ...categorySpecials.map((item) => ({ ...item, uniqueKey: `set2_${item.id}` })),
    ];
  }, [categorySpecials]);

  // Center scroll position on middle set when activeCategory changes
  useEffect(() => {
    const container = promoCarouselRef.current;
    if (container) {
      const setWidth = container.scrollWidth / 3;
      if (setWidth > 0) {
        container.scrollLeft = setWidth;
      }
    }
  }, [activeCategory, categorySpecials]);

  const handleCarouselScroll = () => {
    const container = promoCarouselRef.current;
    if (!container) return;
    const setWidth = container.scrollWidth / 3;
    if (setWidth <= 0) return;

    if (container.scrollLeft >= setWidth * 2 - 10) {
      container.scrollLeft -= setWidth;
    } else if (container.scrollLeft <= 10) {
      container.scrollLeft += setWidth;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = promoCarouselRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = promoCarouselRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
    handleCarouselScroll();
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--active-primary', activeTheme.primary);
    root.style.setProperty('--active-dark', activeTheme.dark);
    root.style.setProperty('--active-gradient', activeTheme.gradient);
    root.style.setProperty('--active-glow', activeTheme.glow);
    root.style.setProperty('--active-light-bg', activeTheme.lightBg);
  }, [activeCategory, activeTheme]);

  const splashVideoRef = useRef<HTMLVideoElement | null>(null);

  const finishSplash = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  return (
    <div className="app-container">
      {/* ─── 4KIT CINEMATIC VIDEO LOGO SPLASH SCREEN (MUTED / NO SOUND) ─── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="kit4-splash-screen"
            onClick={finishSplash}
          >
            <div className="splash-video-wrapper">
              <video
                ref={splashVideoRef}
                src="/splash_logo.mp4"
                autoPlay
                playsInline
                muted
                onEnded={finishSplash}
                className="splash-video-element"
              />
            </div>

            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="splash-skip-btn"
              onClick={(e) => {
                e.stopPropagation();
                finishSplash();
              }}
            >
              Skip &gt;
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ITEM LIMIT WARNING NOTIFICATION ─── */}
      <AnimatePresence>
        {limitWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2000,
              width: 'min(calc(100% - 32px), 440px)'
            }}
          >
            <div className="multi-item-limit-alert" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
              <AlertTriangle size={18} color="#DC2626" />
              <span>{limitWarning}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── APP-WIDE SUBTLE WATERMARK OUTLINES (Very little noticeable, elegant background pattern) ─── */}
      <AppSubtleOutlinesBackground strokeColor={activeTheme.primary} />

      {/* ─── TOP APP ECOSYSTEM OUTLINES BACKGROUND (Fading from top to search bar) ─── */}
      <TopEcosystemOutlinesBackground primaryColor={activeTheme.primary} />

      {/* ─── 4KIT HERO HEADER ─── */}
      <div className="kit4-hero-header">
        <div className="ios-status-bar">
          <span>9:41</span>
          <span>100%</span>
        </div>
        <div className="kit4-logo-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
          {canGoBack && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              className="header-back-circle-btn"
              onClick={handleGoBack}
              title="Go Back"
              style={{ position: 'absolute', left: 0 }}
            >
              <ChevronLeft size={20} color="var(--text-primary)" />
            </motion.button>
          )}
          <div 
            className="kit4-brand-logo" 
            onClick={() => { setCurrentScreen('home'); setSearchQuery(''); }} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div 
              className="kit4-brand-logo-img"
              style={{ 
                height: 38, 
                width: 62, 
                backgroundColor: activeTheme.primary,
                WebkitMaskImage: 'url(/4kit_logo.png)',
                maskImage: 'url(/4kit_logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                transition: 'background-color 0.35s ease, transform 0.2s ease',
                display: 'block'
              }} 
              title="4Kit Logo"
            />
          </div>
        </div>

        {/* Location Selector Box */}
        <div className="header-location-box" onClick={() => setShowLocationModal(true)}>
          <div className="location-left">
            <div className="location-icon-circle" style={{ background: activeTheme.primary }}>
              <MapPin size={18} color="#FFFFFF" />
            </div>
            <div>
              <div className="location-title">{userLocation}, Thiruvananthapuram</div>
              <div className="location-address">Deliver in 15 mins • Tap to change locality</div>
            </div>
          </div>
          <div style={{ color: activeTheme.primary, fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center' }}>
            Change <ChevronRight size={16} style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      {/* ─── SCREEN CONTENT ROUTING ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', position: 'relative', zIndex: 10 }}
        >
          {/* ═════════ 1. HOME SCREEN ═════════ */}
          {currentScreen === 'home' && (
            <>
              {/* Sleek Mobile Segmented Category Bar (Unified, No Emojis, No Clunky Boxes) */}
              <div className="kit4-segmented-nav">
                {BUBBLE_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`kit4-segmented-tab ${isActive ? 'active' : ''}`}
                      onClick={() => selectCategory(cat.id)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSegmentIndicator"
                          className="kit4-segmented-indicator"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="kit4-segmented-content">
                        <IconComp size={16} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{cat.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar + Quick Veg Toggle (Swiggy Native Style - Opaque Solid White) */}
              <div className="glovo-search-container" style={{ padding: '4px 14px 4px', background: '#FFFFFF', position: 'relative', zIndex: 20 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div className="glovo-search-bar" style={{ flex: 1, padding: '7px 12px', background: '#FFFFFF', position: 'relative', zIndex: 21 }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                      className="search-input-field"
                      style={{ background: '#FFFFFF' }}
                      placeholder={categoryPlaceholders[placeholderIndex]}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
                        onClick={() => setSearchQuery('')}
                      >
                        <X size={14} color="#6B7280" />
                      </button>
                    )}
                  </div>

                  {activeCategory === 'food' && (
                    <button
                      type="button"
                      className={`quick-veg-switch ${filterDiet === 'veg' ? 'active' : ''}`}
                      onClick={() => setFilterDiet(filterDiet === 'veg' ? 'All' : 'veg')}
                      title="Toggle Pure Veg Only"
                    >
                      <span className="veg-dot" />
                      <span>VEG</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Trending Cravings Discovery Strip */}
              <div className="trending-cravings-strip" style={{ background: '#FFFFFF', position: 'relative', zIndex: 20 }}>
                {(activeCategory === 'food'
                  ? ['Biriyani', 'Porotta', 'Al Faham', 'Burgers', 'Shawarma', 'Dosa', 'Falooda', 'Ice Cream']
                  : activeCategory === 'supermarket'
                  ? ['Milk & Curd', 'Fresh Veggies', 'Snacks', 'Soft Drinks', 'Bread & Eggs', 'Atta & Rice']
                  : ['First Aid', 'Pain Relief', 'Vitamins', 'Cough & Cold', 'Baby Care', 'Skin Care']
                ).map((craving) => (
                  <span
                    key={craving}
                    className={`craving-pill ${searchQuery.toLowerCase() === craving.toLowerCase() ? 'active' : ''}`}
                    onClick={() => setSearchQuery(searchQuery === craving ? '' : craving)}
                  >
                    {craving}
                  </span>
                ))}
              </div>

              {searchQuery.trim() !== '' ? (
                /* Dynamic Search Results Feed */
                <div style={{ padding: '0 16px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: 16, color: activeTheme.primary }}>
                      Search Results for "{searchQuery}"
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: activeTheme.primary }}>
                      {
                        [...Object.values(MENU_ITEMS_BY_CATEGORY).flat(), ...CRAVINGS_ITEMS].filter(
                          (item, idx, self) =>
                            self.findIndex((x) => x.id === item.id) === idx &&
                            item.diet !== 'keto' &&
                            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).length
                      } items found
                    </span>
                  </div>
                  {
                    [...Object.values(MENU_ITEMS_BY_CATEGORY).flat(), ...CRAVINGS_ITEMS].filter(
                      (item, idx, self) =>
                        self.findIndex((x) => x.id === item.id) === idx &&
                        item.diet !== 'keto' &&
                        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -3 }}
                        className="diet-card"
                        style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB', padding: 16 }}
                        onClick={() => setSelectedDish(item)}
                      >
                        <img src={item.image} alt={item.name} className="diet-img" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                            <span className="diet-badge-pill" style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', textTransform: 'uppercase' }}>
                              {item.category}
                            </span>
                            {item.storeName && (
                              <span className="distance-pill-badge">
                                 {item.storeName}
                              </span>
                            )}
                          </div>
                          <div style={{ fontFamily: 'var(--font-title)', fontSize: 15, color: activeTheme.primary }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 6px' }}>{item.desc}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 900, color: activeTheme.primary, fontSize: 16 }}>₹{item.price}</span>
                            <button
                              className="add-item-btn"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateItemQty(item, 1);
                              }}
                            >
                              Add item
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              ) : (
                <>
                  {/* ─── "WHAT'S ON YOUR MIND?" CIRCULAR ITEMS (CATEGORY ADAPTIVE TOP DISCOVERY) ─── */}
                  <div className="swiggy-mind-section" style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                    <div className="swiggy-mind-header">
                      {activeCategory === 'food' ? 'Popular Cravings in Trivandrum' : activeCategory === 'supermarket' ? 'Explore Grocery Aisles' : 'Healthcare & Daily Wellness'}
                    </div>
                    <div className="swiggy-mind-scroll">
                      {(activeCategory === 'food'
                        ? SWIGGY_MIND_DISHES
                        : activeCategory === 'supermarket'
                          ? GROCERY_MIND_CATEGORIES
                          : PHARMACY_MIND_CATEGORIES
                      ).map((item) => (
                        <motion.div
                          key={item.id}
                          className="swiggy-mind-item"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchQuery(item.name)}
                        >
                          <img src={item.img} alt={item.name} className="swiggy-mind-circle-img" />
                          <div className="swiggy-mind-label">{item.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ─── 4KIT CATEGORY SPECIALS PROMO CAROUSEL (Seamless Horizontal Scrolling) ─── */}
                  <div
                    ref={promoCarouselRef}
                    className="category-promo-carousel"
                    onScroll={handleCarouselScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                  >
                    {infiniteSpecials.map((banner) => {
                      const bannerCategory = banner.id.includes('groc')
                        ? 'supermarket'
                        : banner.id.includes('pharm')
                        ? 'pharmacy'
                        : banner.id.includes('food')
                        ? 'food'
                        : activeCategory;

                      return (
                        <div
                          key={banner.uniqueKey}
                          className="category-promo-card"
                          style={{
                            background: banner.bg,
                            color: banner.textColor || '#FFFFFF'
                          }}
                          onClick={() => {
                            if (banner.id.includes('food_3')) {
                              setCurrentScreen('multiorder');
                            } else {
                              setCurrentScreen('home');
                            }
                          }}
                        >
                          {/* ─── Vector Outlines Pattern on Background (Distinct for groceries, pharmacy, food) ─── */}
                          <PromoCardOutlinesPattern
                            category={bannerCategory}
                            textColor={banner.textColor || '#FFFFFF'}
                            patternId={`pat_${banner.uniqueKey}`}
                          />

                        <div className="category-promo-left">
                          <div className="category-promo-title" style={{ color: banner.textColor || '#FFFFFF' }}>
                            {banner.title}
                          </div>
                          <div className="category-promo-sub" style={{ color: banner.textColor || '#FFFFFF' }}>
                            {banner.subtitle}
                          </div>
                          <button
                            className="category-promo-cta-btn"
                            style={{
                              background: banner.btnBg || '#FFFFFF',
                              color: banner.btnColor || '#1F2937'
                            }}
                          >
                            {banner.cta}
                          </button>
                        </div>
                        <img src={banner.image} alt={banner.title} className="category-promo-img" />
                      </div>
                    );
                  })}
                  </div>

                  {/* ─── FOOD MOOD & CRAVINGS ROULETTE SLOT MACHINE HERO BANNER (FOOD ONLY) ─── */}
                  {activeCategory === 'food' && (
                    <div style={{ padding: '0 14px', margin: '6px 0 10px' }}>
                      <div className="gamble-hero-card">
                        {/* ─── Vector Dish Outlines Pattern & Corner Watermarks ─── */}
                        <svg
                          className="gamble-dishes-pattern-bg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 400 180"
                          preserveAspectRatio="xMidYMid slice"
                          aria-hidden="true"
                        >
                          <defs>
                            <pattern id="gambleDishPattern" width="90" height="90" patternUnits="userSpaceOnUse">
                              {/* Mini Burger Outline */}
                              <g transform="translate(10, 10) scale(0.65)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
                                <path d="M4 14 C4 6 26 6 26 14 Z" />
                                <path d="M2 17 C5 19 8 17 11 19 C14 17 17 19 20 17 C23 19 26 17 28 17" />
                                <line x1="3" y1="21" x2="27" y2="21" />
                                <path d="M5 24 C5 28 25 28 25 24 Z" />
                              </g>
                              {/* Mini Biriyani/Soup Pot Outline */}
                              <g transform="translate(55, 10) scale(0.65)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
                                <ellipse cx="15" cy="11" rx="12" ry="3.5" />
                                <path d="M3 11 C4 22 26 22 27 11" />
                                <path d="M10 7 C9 3 13 1 12 -2" />
                                <path d="M15 7 C14 3 18 1 17 -2" />
                                <path d="M20 7 C19 3 23 1 22 -2" />
                              </g>
                              {/* Mini Pizza Slice Outline */}
                              <g transform="translate(10, 55) scale(0.65)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
                                <path d="M4 6 Q15 3 26 6" />
                                <path d="M4 6 L15 28 L26 6" />
                                <circle cx="15" cy="12" r="2" />
                                <circle cx="12" cy="18" r="1.5" />
                                <circle cx="18" cy="19" r="1.5" />
                              </g>
                              {/* Mini Drink Cup with Straw Outline */}
                              <g transform="translate(55, 55) scale(0.65)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
                                <path d="M6 9 L9 26 L21 26 L24 9 Z" />
                                <path d="M4 9 L26 9" />
                                <path d="M14 9 L17 2 L22 0.5" />
                              </g>
                            </pattern>
                          </defs>

                          {/* Background Repeating Dishes Pattern */}
                          <rect width="100%" height="100%" fill="url(#gambleDishPattern)" />

                          {/* Large Left Watermark: Steaming Handi Pot with Lid Outline */}
                          <g transform="translate(-8, 16) scale(1.35)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                            <ellipse cx="28" cy="30" rx="22" ry="6" />
                            <path d="M6 30 C7 54 49 54 50 30" />
                            <path d="M2 28 Q6 28 7 32 Q6 34 2 33" />
                            <path d="M54 28 Q50 28 49 32 Q50 34 54 33" />
                            {/* Steam curls */}
                            <path d="M18 22 C16 14 22 10 20 2" strokeDasharray="3 2" />
                            <path d="M28 20 C26 12 32 8 30 0" strokeDasharray="3 2" />
                            <path d="M38 22 C36 14 42 10 40 2" strokeDasharray="3 2" />
                          </g>

                          {/* Large Right Watermark: Gourmet Burger & Melting Cheese Outline */}
                          <g transform="translate(325, 20) scale(1.3)" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                            <path d="M4 22 C4 8 40 8 40 22 Z" />
                            <circle cx="16" cy="14" r="0.8" />
                            <circle cx="24" cy="13" r="0.8" />
                            <circle cx="28" cy="17" r="0.8" />
                            <path d="M2 25 Q7 28 12 25 Q17 28 22 25 Q27 28 32 25 Q37 28 42 25" />
                            <path d="M6 28 L38 28 L32 34 L26 28" />
                            <rect x="4" y="28" width="36" height="6" rx="3" />
                            <path d="M6 36 C6 44 38 44 38 36 Z" />
                          </g>

                        </svg>

                        {/* Foreground Hero Content */}
                        <div className="gamble-hero-content">
                          <div className="gamble-hero-title">
                            Can't decide what to eat? Let's make a Gamble
                          </div>
                          
                          <div className="gamble-hero-subtitle">
                            Spin IT &amp; let US randomly pick the perfect dish for your cravings!
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="gamble-hero-btn"
                            onClick={() => {
                              setShowSlotMachineModal(true);
                              triggerCravingsRoulette('spicy');
                            }}
                          >
                            <Dices size={20} strokeWidth={2.5} />
                            <span>GAMBLE</span>
                          </motion.button>

                          {isRouletteSpinning && !showSlotMachineModal && (
                            <div style={{ textAlign: 'center', padding: '8px 0 0', color: '#FFE600', fontWeight: 900, fontSize: 13 }}>
                              Rolling the Trivandrum Cravings Gamble Slot...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── MERCHANTS & STORES FEED (FOOD / ACTIVE CATEGORY) ON MAIN SCREEN ─── */}
                  <div className="stores-section" style={{ paddingTop: 4 }}>
                    <div className="section-header-row" style={{ marginBottom: 6 }}>
                      <div>
                        <h2 className="section-h2" style={{ fontSize: 15, margin: 0 }}>{activeTheme.name} Stores</h2>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginTop: 1 }}>
                          {filteredStores.length} merchants near {userLocation}
                        </div>
                      </div>
                      <LeverFilterToggle
                        isOn={showFilterModal || activeFilterCount > 0}
                        onToggle={() => setShowFilterModal(true)}
                        accentColor={activeTheme.primary}
                        darkColor={activeTheme.dark}
                        count={activeFilterCount}
                      />
                    </div>

                    {/* Category-Adaptive Spotlight Filter */}
                    <div style={{ marginBottom: 6 }}>
                      <SpotlightFilter
                        activeId={activeQuickFilterId}
                        accentColor={activeTheme.primary}
                        items={[
                          { id: 'all', label: 'All', icon: Sparkles },
                          { id: 'rating', label: '4.8+ Star', icon: Star, badge: filterRating48 ? 'On' : undefined },
                          { id: 'fast', label: '< 15 mins', icon: Clock, badge: filterFastETA ? 'On' : undefined },
                          { id: 'free_delivery', label: 'Free Delivery', icon: Truck, badge: filterFreeDelivery ? 'On' : undefined },
                          { id: 'distance', label: '< 5km', icon: MapPin, badge: filterMaxDistKm <= 5 ? '5km' : undefined },
                          { id: 'more', label: 'Filter', icon: SlidersHorizontal, badge: activeFilterCount > 0 ? activeFilterCount : undefined },
                        ]}
                        onSelect={(id) => {
                          if (id === 'all') {
                            setFilterRating48(false);
                            setFilterFastETA(false);
                            setFilterFreeDelivery(false);
                            setFilterMaxDistKm(15);
                            setActiveQuickFilterId('all');
                          } else if (id === 'rating') {
                            const next = !filterRating48;
                            setFilterRating48(next);
                            setActiveQuickFilterId(next ? 'rating' : 'all');
                          } else if (id === 'fast') {
                            const next = !filterFastETA;
                            setFilterFastETA(next);
                            setActiveQuickFilterId(next ? 'fast' : 'all');
                          } else if (id === 'free_delivery') {
                            const next = !filterFreeDelivery;
                            setFilterFreeDelivery(next);
                            setActiveQuickFilterId(next ? 'free_delivery' : 'all');
                          } else if (id === 'distance') {
                            const nextDist = filterMaxDistKm <= 5 ? 15 : 5;
                            setFilterMaxDistKm(nextDist);
                            setActiveQuickFilterId(nextDist <= 5 ? 'distance' : 'all');
                          } else if (id === 'more') {
                            setShowFilterModal(true);
                          }
                        }}
                      />
                    </div>

                    {renderCategorizedStoreSections(filteredStores)}
                  </div>

                  {/* ─── GLOBAL CUISINE EXPLORER (High-Density, Compact) ─── */}
                  <div style={{ margin: '12px 0 10px', padding: '0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 15, fontFamily: 'var(--font-title)', color: activeTheme.primary }}>
                        Cuisine Explorer (Trivandrum)
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: activeTheme.primary, cursor: 'pointer' }} onClick={() => setCurrentScreen('stores')}>
                        Explore All
                      </span>
                    </div>
                    <div className="cuisine-scroll-row">
                      {CUISINE_COLLECTIONS.map((cuis) => (
                        <motion.div
                          key={cuis.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="cuisine-pill-card"
                          onClick={() => setCurrentScreen('stores')}
                        >
                          <img
                            src={cuis.image}
                            alt={cuis.name}
                            className="cuisine-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop';
                            }}
                          />
                          <div className="cuisine-info">
                            <div className="cuisine-title">{cuis.name}</div>
                            <div className="cuisine-tagline">{cuis.tagline}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ─── POPULAR DESSERTS & SWEET TREATS (INR) (High-Density, Compact, Neat) ─── */}
                  <div style={{ padding: '0 16px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 15, fontFamily: 'var(--font-title)', color: activeTheme.primary }}>
                        Popular Desserts &amp; Sweet Treats
                      </div>
                      <span className="distance-pill-badge" style={{ color: '#BE185D', borderColor: '#FBCFE8', fontSize: 10, padding: '2px 8px' }}>Desserts</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {CRAVINGS_ITEMS.map((item) => {
                        const qty = getItemQty(item.id);
                        return (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="cravings-card"
                            onClick={() => setSelectedDish(item)}
                          >
                            <div className="cravings-img-wrap">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="cravings-img"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop';
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                <span className="cravings-badge-pink">{item.badge}</span>
                                {item.storeName && (
                                  <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.storeName}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontFamily: 'var(--font-title)', fontSize: 13.5, color: '#0F172A', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748B', margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.desc}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                  <span style={{ fontWeight: 900, color: '#BE123C', fontSize: 14.5 }}>₹{item.price}</span>
                                  <span style={{ fontSize: 10, color: '#9F1239', fontWeight: 700 }}>• Sweet Treat</span>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  {qty === 0 ? (
                                    <button
                                      className="cravings-add-btn"
                                      onClick={() => updateItemQty(item, 1)}
                                    >
                                      ADD +
                                    </button>
                                  ) : (
                                    <div className="cravings-counter-pill">
                                      <button className="cravings-counter-btn" onClick={() => updateItemQty(item, -1)}><Minus size={12} /></button>
                                      <span className="cravings-counter-qty">{qty}</span>
                                      <button className="cravings-counter-btn" onClick={() => updateItemQty(item, 1)}><Plus size={12} /></button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ═════════ 2. DISCOVER SCREEN (Budget Steals & Items under Certain Amount) ═════════ */}
          {currentScreen === 'discover' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              {/* Discover Budget Hero - Modern Cool Typography */}
              <div className="discover-budget-hero" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 24, padding: 22, color: '#FFFFFF', marginBottom: 20, boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '5px 14px',
                    borderRadius: 20,
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'Space Grotesk', 'Outfit', sans-serif"
                  }}>
                    <Compass size={14} color="#38BDF8" />
                    TRIVANDRUM BUDGET STEALS &amp; CRAVINGS
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk', 'Outfit', sans-serif", letterSpacing: '-0.02em', marginBottom: 8, color: '#FFFFFF', lineHeight: 1.25 }}>
                  Delicious Items Under Your Target Budget
                </h2>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>
                  Filter top Trivandrum dishes &amp; teatime snacks by price range, dietary preferences &amp; fast delivery.
                </div>
              </div>

              {/* Interactive Budget & Preference Filter System */}
              <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: 22, marginBottom: 20, border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SlidersHorizontal size={18} color={activeTheme.primary} />
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-title)', color: activeTheme.primary }}>
                      Filter Dishes by Price &amp; Preference
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: activeTheme.primary, background: activeTheme.lightBg, padding: '4px 12px', borderRadius: 12, border: `1px solid ${activeTheme.accentBorder}` }}>
                    {discoverMaxPrice >= 500 ? 'All Items' : `Max ₹${discoverMaxPrice}`}
                  </span>
                </div>

                {/* Price Range Filter Pills */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }} className="no-scrollbar">
                  {[
                    { label: 'All Items', val: 500 },
                    { label: 'Under ₹49 (Tea & Snacks)', val: 49 },
                    { label: 'Under ₹99 (Pocket Bites)', val: 99 },
                    { label: 'Under ₹149 (Quick Meals)', val: 149 },
                    { label: 'Under ₹199 (Full Combos)', val: 199 },
                    { label: 'Under ₹299 (Feasts)', val: 299 }
                  ].map((pill) => (
                    <button
                      key={pill.val}
                      className={`budget-price-chip ${discoverMaxPrice === pill.val ? 'active' : ''}`}
                      style={{
                        fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 12
                      }}
                      onClick={() => setDiscoverMaxPrice(pill.val)}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Quick Preference Filter Toggles */}
                <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    className={`quick-filter-btn ${discoverVegOnly ? 'active' : ''}`}
                    style={discoverVegOnly ? { background: '#059669', borderColor: '#059669', color: '#FFFFFF', fontWeight: 800 } : { fontSize: 12 }}
                    onClick={() => setDiscoverVegOnly(!discoverVegOnly)}
                  >
                    🍀 Pure Veg Only
                  </button>
                  <button
                    className={`quick-filter-btn ${discoverTopRated ? 'active' : ''}`}
                    style={discoverTopRated ? { background: '#D97706', borderColor: '#D97706', color: '#FFFFFF', fontWeight: 800 } : { fontSize: 12 }}
                    onClick={() => setDiscoverTopRated(!discoverTopRated)}
                  >
                    ⭐ Rating 4.5+
                  </button>
                </div>
              </div>

              {/* Dedicated Snacks Under ₹49 & ₹99 Section */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 15, color: activeTheme.primary, fontFamily: 'var(--font-title)' }}>
                    Popular Teatime &amp; Evening Snacks Under ₹99
                  </div>
                  <span className="rating-green-pill" style={{ background: '#FEF3C7', color: '#B45309', fontWeight: 800 }}>Trivandrum Favorites</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {ALL_TRIVANDRUM_FOOD_DISHES
                    .filter((d) => d.price <= 99 && (d.category === 'Breads' || d.category === 'Street Food' || d.category === 'Hot Beverages' || d.category.includes('Starters') || d.category.includes('Dessert')))
                    .filter((d) => !discoverVegOnly || d.diet === 'veg')
                    .filter((d) => !discoverTopRated || (d.rating && d.rating >= 4.5))
                    .slice(0, 6)
                    .map((snack) => (
                      <motion.div key={snack.id} whileHover={{ y: -3 }} style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 10, position: 'relative' }}>
                        <img src={snack.image} alt={snack.name} style={{ width: '100%', height: 100, borderRadius: 12, objectFit: 'cover', marginBottom: 8 }} />
                        <div style={{ fontSize: 13, color: activeTheme.primary, height: 36, overflow: 'hidden', lineHeight: 1.3, fontFamily: 'var(--font-title)' }}>{snack.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, margin: '4px 0' }}>{snack.storeName}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: activeTheme.primary, fontFamily: "'Space Grotesk', sans-serif" }}>₹{snack.price}</span>
                          <button
                            className="quick-filter-btn active"
                            style={{ padding: '4px 10px', fontSize: 12, background: activeTheme.primary, borderColor: activeTheme.primary }}
                            onClick={() => updateItemQty(snack, 1)}
                          >
                            + Add
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Full Budget Items Grid */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, color: activeTheme.primary, marginBottom: 12, fontFamily: 'var(--font-title)' }}>
                  All Trivandrum Items {discoverMaxPrice >= 500 ? '' : `Under ₹${discoverMaxPrice}`} ({
                    ALL_TRIVANDRUM_FOOD_DISHES
                      .filter((d) => d.price <= discoverMaxPrice)
                      .filter((d) => !discoverVegOnly || d.diet === 'veg')
                      .filter((d) => !discoverTopRated || (d.rating && d.rating >= 4.5)).length
                  } dishes)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ALL_TRIVANDRUM_FOOD_DISHES
                    .filter((d) => d.price <= discoverMaxPrice)
                    .filter((d) => !discoverVegOnly || d.diet === 'veg')
                    .filter((d) => !discoverTopRated || (d.rating && d.rating >= 4.5))
                    .slice(0, 15)
                    .map((dish) => (
                      <div key={dish.id} className="budget-dish-card">
                        <img src={dish.image} alt={dish.name} className="budget-dish-img" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: dish.diet === 'veg' ? '#D1FAE5' : '#FEE2E2', color: dish.diet === 'veg' ? '#065F46' : '#991B1B', fontWeight: 800 }}>
                              {dish.diet === 'veg' ? 'VEG' : 'NON-VEG'}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{dish.category}</span>
                          </div>
                          <div style={{ fontSize: 14, color: activeTheme.primary, marginBottom: 2, fontFamily: 'var(--font-title)' }}>{dish.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{dish.storeName} • {dish.storeLoc || 'Palayam'}</div>
                          <div style={{ fontSize: 15, fontWeight: 900, color: activeTheme.primary, marginTop: 4, fontFamily: "'Space Grotesk', sans-serif" }}>₹{dish.price}</div>
                        </div>
                        <button
                          className="shimmer-btn"
                          style={{ padding: '8px 14px', fontSize: 12, borderRadius: 12, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                          onClick={() => updateItemQty(dish, 1)}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ═════════ DEDICATED MULTI-ORDER SCREEN (Multi-Store Bundles & 5km Radius) ═════════ */}
          {currentScreen === 'multiorder' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              <div className="section-label-badge" style={{ marginBottom: 8, color: activeTheme.primary }}>
                <Zap size={14} color={activeTheme.primary} />
                <span>Multi-Store Express (Within 5km Radius)</span>
              </div>
              <h2 className="section-h2" style={{ marginBottom: 6 }}>Bundle 2 Stores in 1 Order</h2>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 600 }}>
                Combine dishes from nearby merchants within 5km of each other (up to 10 items max per order).
              </div>

              {/* Custom 2-Store Builder Button */}
              <button
                className="shimmer-btn"
                style={{ width: '100%', marginBottom: 20, padding: 16, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                onClick={() => setShowCustomStoreBuilder(true)}
              >
                <SlidersHorizontal size={18} /> Build Custom 2-Store Order (5km Radius)
              </button>

              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>
                Popular Curated Bundles in Thiruvananthapuram
              </div>

              {MULTI_STORE_BUNDLES.map((bundle) => (
                <motion.div
                  key={bundle.id}
                  whileHover={{ y: -4 }}
                  className="store-ios-card"
                  style={{ marginBottom: 18 }}
                >
                  <img src={bundle.image} alt={bundle.title} className="store-cover-img" />
                  <div className="store-card-content">
                    <div className="store-title-row">
                      <div className="store-name-text">{bundle.title}</div>
                      <div className="rating-green-pill" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                        {bundle.savings}
                      </div>
                    </div>
                    <div className="store-meta-line" style={{ marginBottom: 10 }}>
                      {bundle.subtitle}
                    </div>

                    <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 16, marginBottom: 14, border: '1px solid #E2E8F0' }}>
                      {bundle.items.map((it) => (
                        <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>
                          <span>• {it.name} ({it.store})</span>
                          <span>₹{it.price}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="shimmer-btn"
                      style={{ width: '100%', padding: 14, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                      onClick={() => addBundleToCart(bundle)}
                    >
                      <ShoppingBasket size={16} /> Add Multi-Store Bundle • ₹{bundle.price}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ═════════ 3. STORES LIST SCREEN (50 TVM Restaurants) ═════════ */}
          {currentScreen === 'stores' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              <div className="section-header-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 className="section-h2">{activeTheme.name} Stores</h2>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, marginTop: 2 }}>
                    {filteredStores.length} merchants near {userLocation}
                  </div>
                </div>
                <LeverFilterToggle
                  isOn={showFilterModal || activeFilterCount > 0}
                  onToggle={() => setShowFilterModal(true)}
                  accentColor={activeTheme.primary}
                  darkColor={activeTheme.dark}
                  count={activeFilterCount}
                />
              </div>

              {/* Quick Filter Chips Bar */}
              <div className="quick-filter-scroll">
                <button
                  className={`quick-filter-btn ${filterRating48 ? 'active' : ''}`}
                  style={filterRating48 ? { background: activeTheme.primary, borderColor: activeTheme.primary } : {}}
                  onClick={() => setFilterRating48(!filterRating48)}
                >
                  <Star size={12} /> 4.8+ Rating
                </button>
                <button
                  className={`quick-filter-btn ${filterFastETA ? 'active' : ''}`}
                  style={filterFastETA ? { background: activeTheme.primary, borderColor: activeTheme.primary } : {}}
                  onClick={() => setFilterFastETA(!filterFastETA)}
                >
                  <Clock size={12} /> &lt; 15 mins
                </button>
                <button
                  className={`quick-filter-btn ${filterFreeDelivery ? 'active' : ''}`}
                  style={filterFreeDelivery ? { background: activeTheme.primary, borderColor: activeTheme.primary } : {}}
                  onClick={() => setFilterFreeDelivery(!filterFreeDelivery)}
                >
                  <Truck size={12} /> Free Delivery
                </button>
                <button
                  className={`quick-filter-btn ${filterMaxDistKm <= 5 ? 'active' : ''}`}
                  style={filterMaxDistKm <= 5 ? { background: activeTheme.primary, borderColor: activeTheme.primary } : {}}
                  onClick={() => setFilterMaxDistKm(filterMaxDistKm <= 5 ? 15 : 5)}
                >
                   &lt; 5km Radius
                </button>
                {['Palayam', 'Kowdiar', 'Kazhakkoottam', 'Lulu Mall', 'Vazhuthacaud'].map((loc) => (
                  <button
                    key={loc}
                    className={`quick-filter-btn ${filterLocality === loc ? 'active' : ''}`}
                    style={filterLocality === loc ? { background: activeTheme.primary, borderColor: activeTheme.primary } : {}}
                    onClick={() => setFilterLocality(filterLocality === loc ? 'All' : loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {renderCategorizedStoreSections(filteredStores)}
            </div>
          )}

          {/* ═════════ 4. STORE MENU SCREEN (25 Dishes per Restaurant in INR) ═════════ */}
          {currentScreen === 'menu' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <button
                  style={{ background: 'none', border: 'none', color: activeTheme.primary, fontWeight: 900, cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onClick={() => setCurrentScreen('stores')}
                >
                  <ChevronLeft size={16} /> Back to Stores
                </button>
                <button
                  className="quick-filter-btn"
                  style={{ padding: '4px 10px', fontSize: 11, borderColor: activeTheme.primary, color: activeTheme.primary }}
                  onClick={() => setShowFilterModal(true)}
                >
                  <SlidersHorizontal size={12} /> Filter Dishes {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h2 className="section-h2">{selectedStore ? selectedStore.name : `${activeTheme.name} Menu`}</h2>
                {selectedStore && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginTop: 4 }}>
                     {selectedStore.locality || selectedStore.categoryTag.split('•')[0]} • 25 Curated Dishes Available
                  </div>
                )}
              </div>

              {currentStoreDishes.map((item) => {
                const qty = getItemQty(item.id);
                return (
                  <motion.div key={item.id} className="dish-menu-item">
                    <div className="dish-left" onClick={() => setSelectedDish(item)} style={{ cursor: 'pointer' }}>
                      <div className="dish-name">{item.name}</div>
                      <div className="dish-desc">{item.desc}</div>
                      <div className="dish-price" style={{ color: activeTheme.primary }}>₹{item.price}</div>
                    </div>
                    {qty === 0 ? (
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        className="add-item-btn"
                        onClick={() => updateItemQty(item, 1)}
                      >
                        Add item
                      </motion.button>
                    ) : (
                      <div className="dev21-counter-pill" style={{ borderColor: '#000000' }}>
                        <button className="counter-btn-trigger" style={{ background: '#000000' }} onClick={() => updateItemQty(item, -1)}><Minus size={14} /></button>
                        <span className="counter-qty-val" style={{ color: '#000000', fontWeight: 900 }}>{qty}</span>
                        <button className="counter-btn-trigger" style={{ background: '#000000' }} onClick={() => updateItemQty(item, 1)}><Plus size={14} /></button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ═════════ 5. CART & CHECKOUT SCREEN ═════════ */}
          {currentScreen === 'cart' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="section-h2">4Kit Checkout <ShoppingBag size={20} style={{ verticalAlign: 'middle', color: activeTheme.primary }} /></h2>
                <span className="distance-pill-badge" style={{ fontWeight: 900, background: activeTheme.lightBg, color: activeTheme.primary }}>
                  {totalCartCount}/10 Items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: 12 }}><ShoppingBag size={48} color={activeTheme.primary} /></div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Your cart is empty!</div>
                  <div style={{ fontSize: 13, marginBottom: 16 }}>Explore 50 Thiruvananthapuram restaurants & add delicious food.</div>
                  <button className="shimmer-btn" style={{ background: activeTheme.gradient }} onClick={() => setCurrentScreen('stores')}>
                    Browse Stores <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <>
                  {distinctStoresInCart > 1 && (
                    <div className="multi-store-distance-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Zap size={18} color={activeTheme.primary} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-primary)' }}>Multi-Store Order Active</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Bundled pickup from {distinctStoresInCart} nearby merchants</div>
                        </div>
                      </div>
                      <span className="distance-pill-badge within-range">Within 5km </span>
                    </div>
                  )}

                  {cartItems.map((ci) => (
                    <div key={ci.id} className="dish-menu-item">
                      <div style={{ flex: 1 }}>
                        <div className="dish-name">{ci.name}</div>
                        <div className="dish-desc">Merchant: <strong>{ci.store || ci.sauce || 'Main Merchant'}</strong></div>
                        <div className="dish-price" style={{ color: activeTheme.primary }}>₹{ci.price} x {ci.qty}</div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text-primary)' }}>₹{ci.price * ci.qty}</div>
                    </div>
                  ))}

                  {/* Bill Breakdown with Increasing Delivery Fee */}
                  <div style={{ background: '#FFFFFF', padding: 20, borderRadius: 24, marginTop: 16, border: '1.5px solid var(--food-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span>Item Subtotal ({totalCartCount} items)</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{cartSubtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span>
                        Delivery Fee {distinctStoresInCart > 1 ? `(${distinctStoresInCart} merchants bundled)` : ''}
                      </span>
                      <span style={{ color: dynamicDeliveryFee === 0 ? '#059669' : activeTheme.primary, fontWeight: 900 }}>
                        {dynamicDeliveryFee === 0 ? 'FREE' : `₹${dynamicDeliveryFee}`}
                      </span>
                    </div>
                    <div style={{ height: 1, background: '#E5E7EB', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                      <span>To Pay</span>
                      <span style={{ color: activeTheme.primary }}>₹{finalCartTotal}</span>
                    </div>
                  </div>

                  <button
                    className="shimmer-btn"
                    style={{ width: '100%', marginTop: 20, padding: 18, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                    onClick={handleConfirmOrder}
                  >
                    Confirm &amp; Place Order • ₹{finalCartTotal} <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* ═════════ 6. LIVE COURIER TRACKER ═════════ */}
          {currentScreen === 'tracker' && (
            <div className="stores-section" style={{ paddingTop: 20, textAlign: 'center' }}>
              <h2 className="section-h2" style={{ marginBottom: 6 }}>Live Courier Status</h2>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 600 }}>Order #4KIT-TVM-904 • ETA 11 mins</div>
              <div style={{ background: activeTheme.lightBg, border: `2px solid ${activeTheme.primary}`, padding: 28, borderRadius: 32, marginBottom: 24, boxShadow: activeTheme.glow }}>
                <motion.div animate={{ x: [-12, 12, -12] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ display: 'inline-block', marginBottom: 12 }}>
                  <Truck size={56} color={activeTheme.primary} />
                </motion.div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 18, color: activeTheme.primary }}>Nikhil is on the way to {userLocation}!</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 600 }}>Location: 0.8 km away • Arriving in 11 minutes</div>
              </div>
              <button className="shimmer-btn" style={{ width: '100%', padding: 16, background: activeTheme.gradient }} onClick={() => setCurrentScreen('home')}>
                Back to Home <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ═════════ 7. PROFILE & USER SETTINGS ═════════ */}
          {currentScreen === 'profile' && (
            <div className="stores-section" style={{ paddingTop: 16 }}>
              <div className="profile-header-card" style={{ background: '#FFFFFF', border: '1.5px solid var(--food-border)', borderRadius: 32, padding: 24, marginBottom: 20, boxShadow: 'var(--shadow-food-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: activeTheme.gradient, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, boxShadow: activeTheme.glow }}>
                    RK
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: activeTheme.primary }}>Rahul Kumar</h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEF3C7', color: '#B45309', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 800, marginTop: 4 }}>
                      <Award size={14} /> 4Kit Gold • {userLocation}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 20, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    <span>Reward Points (Gold Tier)</span>
                    <span style={{ color: activeTheme.primary }}>2,850 / 3,000 XP</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: activeTheme.primary, borderRadius: 9999 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 600 }}>
                    150 XP to Platinum • Unlimited Free Delivery Active in Thiruvananthapuram
                  </div>
                </div>
              </div>

              {/* Past Orders in INR */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>Previous Orders</h3>
                <div style={{ background: '#FFFFFF', border: '1.5px solid var(--food-border)', borderRadius: 24, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 800 }}>Zam Zam + Azad Restaurant</span>
                    <span style={{ color: activeTheme.primary, fontWeight: 900 }}>₹490</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Malabar Biriyani + Porotta Combo • Delivered Yesterday</div>
                  <button className="shimmer-btn" style={{ width: '100%', padding: 10, fontSize: 13, background: activeTheme.gradient }} onClick={() => setCurrentScreen('cart')}>
                    Re-order in 1-Click <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── COMMUNITY FOOTER WATERMARK AT THE VERY END OF EVERY TAB ─── */}
          <CommunityFooterWatermark activeCategory={activeCategory} primaryColor={activeTheme.primary} />
        </motion.div>
      </AnimatePresence>

      {/* ─── LOCATION PICKER MODAL (Thiruvananthapuram Localities) ─── */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dev21-modal-overlay" onClick={() => setShowLocationModal(false)}>
            <motion.div initial={{ y: 280 }} animate={{ y: 0 }} exit={{ y: 280 }} className="dev21-modal-drawer" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>Select Delivery Locality</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Thiruvananthapuram, Kerala</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowLocationModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {TVM_AREAS.map((area) => (
                  <div
                    key={area}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: userLocation === area ? activeTheme.lightBg : '#FFFFFF',
                      border: userLocation === area ? `2px solid ${activeTheme.primary}` : '1.5px solid #E5E7EB',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: userLocation === area ? activeTheme.primary : 'var(--text-primary)'
                    }}
                    onClick={() => {
                      setUserLocation(area);
                      setShowLocationModal(false);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <MapPin size={16} color={userLocation === area ? activeTheme.primary : '#6B7280'} />
                      <span>{area}</span>
                    </div>
                    {userLocation === area && <Check size={18} color={activeTheme.primary} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── UNIVERSAL FILTER MODAL (Location, Price, Diet, Sugar) ─── */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dev21-modal-overlay" onClick={() => setShowFilterModal(false)}>
            <motion.div initial={{ y: 320 }} animate={{ y: 0 }} exit={{ y: 320 }} className="dev21-modal-drawer" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>Filters &amp; Preferences</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Refine by location, price, diet &amp; sugar</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowFilterModal(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* 1. Location & Distance Filter */}
              <div style={{ marginBottom: 16 }}>
                <div className="filter-section-title">
                  <MapPin size={14} color={activeTheme.primary} />
                  <span>Delivery Locality / Distance from {userLocation}</span>
                </div>
                <div className="filter-chips-grid">
                  {[
                    { label: 'All Trivandrum', val: 15 },
                    { label: '< 2 km (Walking)', val: 2 },
                    { label: '< 5 km (Fast Express)', val: 5 },
                    { label: '< 10 km (City Wide)', val: 10 }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      className={`filter-chip-option ${filterMaxDistKm === opt.val ? 'active' : ''}`}
                      style={filterMaxDistKm === opt.val ? { background: activeTheme.primary, borderColor: activeTheme.primary, color: '#FFFFFF' } : {}}
                      onClick={() => setFilterMaxDistKm(opt.val)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <select className="store-select-dropdown" value={filterLocality} onChange={(e) => setFilterLocality(e.target.value)}>
                  <option value="All">All Localities</option>
                  {TVM_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* 2. Price Filter (INR) */}
              <div style={{ marginBottom: 16 }}>
                <div className="filter-section-title">
                  <span>Price Range (INR ₹)</span>
                </div>
                <div className="filter-chips-grid">
                  {[
                    { label: 'All Prices', val: 'All' },
                    { label: 'Under ₹150', val: 'under150' },
                    { label: '₹150 - ₹300', val: '150-300' },
                    { label: '₹300 - ₹500', val: '300-500' },
                    { label: 'Above ₹500', val: 'above500' }
                  ].map((pr) => (
                    <button
                      key={pr.label}
                      className={`filter-chip-option ${filterPriceRange === pr.val ? 'active' : ''}`}
                      style={filterPriceRange === pr.val ? { background: activeTheme.primary, borderColor: activeTheme.primary, color: '#FFFFFF' } : {}}
                      onClick={() => setFilterPriceRange(pr.val)}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Diet-Based Filter */}
              <div style={{ marginBottom: 16 }}>
                <div className="filter-section-title">
                  <span>Diet &amp; Nutrition</span>
                </div>
                <div className="filter-chips-grid">
                  {[
                    { label: 'All Diets', val: 'All' },
                    { label: ' Pure Veg', val: 'veg' },
                    { label: ' Non-Veg', val: 'non-veg' },
                    { label: ' 100% Vegan', val: 'vegan' },
                    { label: ' High Protein', val: 'high-protein' }
                  ].map((dt) => (
                    <button
                      key={dt.label}
                      className={`filter-chip-option ${filterDiet === dt.val ? 'active' : ''}`}
                      style={filterDiet === dt.val ? { background: activeTheme.primary, borderColor: activeTheme.primary, color: '#FFFFFF' } : {}}
                      onClick={() => setFilterDiet(dt.val)}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  style={{ flex: 1, padding: 14, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 9999, fontWeight: 800, cursor: 'pointer' }}
                  onClick={resetAllFilters}
                >
                  Reset
                </button>
                <button
                  className="shimmer-btn"
                  style={{ flex: 2, padding: 14, background: activeTheme.gradient }}
                  onClick={() => setShowFilterModal(false)}
                >
                  Apply Filters ({filteredStores.length} stores)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 5KM MULTI-STORE ORDER BUILDER DRAWER ─── */}
      <AnimatePresence>
        {showCustomStoreBuilder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dev21-modal-overlay" onClick={() => setShowCustomStoreBuilder(false)}>
            <motion.div initial={{ y: 280 }} animate={{ y: 0 }} exit={{ y: 280 }} className="dev21-modal-drawer" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontFamily: 'var(--font-title)', color: activeTheme.primary, letterSpacing: '-0.2px' }}>Multi-Store Order Builder (5km Limit)</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Combine 2 {activeCategory.toUpperCase()} merchants within 5km radius
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowCustomStoreBuilder(false)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>1. Primary Merchant ({activeTheme.name}):</label>
                <select className="store-select-dropdown" value={customStore1} onChange={(e) => setCustomStore1(e.target.value)}>
                  {currentStores.map((st) => (
                    <option key={`m1_${st.id}`} value={st.name}>{st.name} ({st.locality || st.categoryTag.split('•')[0].trim()})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                  2. Secondary Merchant (Only within 5.0 km of {customStore1}):
                </label>
                <select className="store-select-dropdown" value={customStore2} onChange={(e) => setCustomStore2(e.target.value)}>
                  {validStore2Options.map((st) => (
                    <option key={`m2_${st.id}`} value={st.name}>
                      {st.name} ({st.locality || st.categoryTag.split('•')[0].trim()} • {st.distFromStore1} km away)
                    </option>
                  ))}
                </select>
              </div>

              {/* 5KM Distance Verification Badge */}
              <div className="multi-store-distance-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} color={activeTheme.primary} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                      Distance between merchants: <strong>{currentStore2Distance} km</strong>
                    </div>
                    <div style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                       Valid for single courier pickup (&le; 5.0 km)
                    </div>
                  </div>
                </div>
                <span className="distance-pill-badge within-range">5km Verified</span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                 Express courier will collect both packages and deliver together (+₹25 multi-pickup surcharge applies). Max 10 items total.
              </div>

              <button
                className="shimmer-btn"
                style={{ width: '100%', padding: 16, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                onClick={addCustomMultiStoreOrder}
              >
                Add 2-Merchant Bundle to Cart <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DISH CUSTOMIZATION DRAWER ─── */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dev21-modal-overlay" onClick={() => setSelectedDish(null)}>
            <motion.div initial={{ y: 250 }} animate={{ y: 0 }} exit={{ y: 250 }} className="dev21-modal-drawer" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div><h3 style={{ fontSize: 18, fontFamily: 'var(--font-title)', color: activeTheme.primary, letterSpacing: '-0.2px' }}>{selectedDish.name}</h3></div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedDish(null)}><X size={20} /></button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>{selectedDish.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {(selectedDish.sauces || ['Spicy Chutney', 'Garlic Mayo', 'Coconut Chammanthi']).map((sauce) => (
                  <label key={sauce} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1.5px solid var(--food-border)', borderRadius: 12, cursor: 'pointer' }} onClick={() => setSelectedSauce(sauce)}>
                    {sauce} <input type="radio" checked={selectedSauce === sauce} readOnly />
                  </label>
                ))}
              </div>
              <button
                className="shimmer-btn"
                style={{ width: '100%', padding: 18, background: activeTheme.gradient, boxShadow: activeTheme.glow }}
                onClick={addModalItemToCart}
              >
                Add to Order • ₹{selectedDish.price} <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ORDER SUCCESS VIDEO / CELEBRATION MODAL ─── */}
      <AnimatePresence>
        {showOrderSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="video-modal-fullscreen">
            {isVideoPlaying && (
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} className="video-container-card">
                <button className="video-skip-pill" onClick={skipVideo}>
                  <FastForward size={14} /> Skip Animation
                </button>
                <video
                  ref={videoRef}
                  src="/placed_order.mp4"
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={(e) => { e.currentTarget.currentTime = 3; }}
                  onEnded={handleVideoEnd}
                  className="placed-video-element"
                />
              </motion.div>
            )}

            {videoFinished && (
              <motion.div initial={{ scale: 0.7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="nikhil-celebration-card">
                <div className="nikhil-card-glow-aura" />
                <div className="nikhil-avatar-ring">
                  <Truck size={38} color="#FFFFFF" />
                  <div className="nikhil-badge-online" />
                </div>
                <div className="nikhil-headline">Nikhil is on the way!</div>
                <div className="nikhil-subtext">
                  Arriving in <strong style={{ color: '#FFFFFF' }}>12 mins</strong> to {userLocation}
                </div>
                <div className="rider-status-box">
                  <div className="rider-info-row">
                    <div>
                      <div className="rider-name">Nikhil Sharma</div>
                      <div className="rider-rating"> 4.95 • Electric Scooter</div>
                    </div>
                    <button className="call-rider-btn" onClick={() => alert("Calling Nikhil (+91 98950-4KIT-NIKHIL)...")}>
                      <PhoneCall size={13} /> Call
                    </button>
                  </div>
                </div>
                <button className="shimmer-btn" style={{ width: '100%', padding: 16, fontSize: 15, background: activeTheme.gradient }} onClick={proceedToTracker}>
                  Track Live Order <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FLOATING VIEW ORDER BAR (Strictly Pinned above bottom dock on all screens when cart > 0) ─── */}
      <AnimatePresence>
        {totalCartCount > 0 && currentScreen !== 'cart' && currentScreen !== 'tracker' && !showOrderSuccessModal && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="glovo-cart-float-bar"
            style={{ background: activeTheme.gradient, boxShadow: activeTheme.glow }}
            onClick={() => setCurrentScreen('cart')}
          >
            {/* Animated Outlined Dishes/Groceries/Pharmacy (Lighter on left, darker on right, slow left-to-right drift) */}
            <ViewOrderDishesPattern category={activeCategory} />

            <div className="cart-left-wrap">
              <div className="cart-badge-yellow" style={{ color: activeTheme.primary }}>
                {totalCartCount}
              </div>
              <span className="cart-title-text">View Order</span>
            </div>
            <div className="cart-cta-text">
              <span>₹{finalCartTotal}</span>
              <ArrowRight size={18} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SPIN THE WHEEL INTERACTIVE DISCOUNT MODAL ─── */}
      <AnimatePresence>
        {showSpinWheelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="spin-modal-overlay" onClick={() => !isSpinning && setShowSpinWheelModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="spin-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{ position: 'absolute', top: 18, right: 18, background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                onClick={() => !isSpinning && setShowSpinWheelModal(false)}
                aria-label="Close"
              >
                <X size={18} color="#4B5563" />
              </button>

              <h3 style={{ fontSize: 25, fontFamily: 'var(--font-caacupe)', color: activeTheme.primary, marginBottom: 8, letterSpacing: '0.4px', lineHeight: 1.25 }}>
                Spin the Wheel for a Discount!
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 600, lineHeight: 1.4 }}>
                Spin IT &amp; let US randomly pick the perfect  dish for your cravings!
              </p>

              {/* Wheel Graphic */}
              <div className="spin-wheel-wrapper">
                <div className={`spin-wheel-pointer ${isSpinning ? 'spinning' : ''}`} />
                <svg
                  className="spin-wheel-svg"
                  viewBox="0 0 200 200"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? 'transform 3.6s cubic-bezier(0.18, 0.92, 0.2, 1)' : 'none'
                  }}
                >
                  {SPIN_WHEEL_REWARDS.map((rew, i) => {
                    const numSlices = SPIN_WHEEL_REWARDS.length;
                    const sliceAngle = 360 / numSlices;
                    const startAngle = i * sliceAngle;
                    const endAngle = (i + 1) * sliceAngle;
                    const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);
                    const textAngle = startAngle + sliceAngle / 2;
                    const textX = 100 + 65 * Math.cos((Math.PI * textAngle) / 180);
                    const textY = 100 + 65 * Math.sin((Math.PI * textAngle) / 180);

                    return (
                      <g key={rew.code}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                          fill={rew.color}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                        >
                          {rew.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <button
                  className={`spin-wheel-center-btn ${!isSpinning ? 'idle-pulse' : ''}`}
                  onClick={triggerSpinWheel}
                  disabled={isSpinning}
                >
                  {isSpinning ? 'SPINNING...' : 'SPIN!'}
                </button>
              </div>

              {/* Won Reward Banner */}
              {wonReward && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 20, padding: 16, marginTop: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#047857', marginBottom: 2 }}>
                     YOU WON: {wonReward.title}!
                  </div>
                  <div style={{ fontSize: 12, color: '#065F46', marginBottom: 12, fontWeight: 600 }}>{wonReward.desc}</div>
                  <button
                    className="shimmer-btn"
                    style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 14px rgba(5,150,105,0.4)' }}
                    onClick={() => {
                      setAppliedCoupon(wonReward);
                      setShowSpinWheelModal(false);
                      setLimitWarning(`Coupon ${wonReward.code} applied to cart!`);
                      setTimeout(() => setLimitWarning(null), 3500);
                    }}
                  >
                    Apply Coupon ({wonReward.code}) to Cart
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TRIVANDRUM CRAVINGS SLOT MACHINE INTERACTIVE MODAL ─── */}
      <AnimatePresence>
        {showSlotMachineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="spin-modal-overlay"
            style={{ zIndex: 9999 }}
            onClick={() => !isRouletteSpinning && setShowSlotMachineModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              className="slot-machine-modal-card"
              style={{
                background: 'linear-gradient(145deg, #1C0505 0%, #380A0A 50%, #170404 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 28,
                padding: '24px 0 20px',
                width: 'calc(100% - 32px)',
                maxWidth: 420,
                position: 'relative',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255, 255, 255, 0.14)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  zIndex: 40
                }}
                onClick={() => !isRouletteSpinning && setShowSlotMachineModal(false)}
              >
                <X size={18} color="#FFFFFF" />
              </button>

              {/* ─── FULL-BLEED EDGE-TO-EDGE SCROLLING REEL TRACK ─── */}
              <div style={{ position: 'relative', width: '100%', height: 165, overflow: 'hidden', margin: '20px 0' }}>
                {/* Center Golden Laser Pointer Line */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 2, background: '#FFE600', boxShadow: '0 0 12px #FFE600', zIndex: 30, pointerEvents: 'none' }} />

                {/* Left & Right Seamless Gradient Fades into Modal Container */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 45, background: 'linear-gradient(90deg, #1C0505 0%, rgba(28,5,5,0) 100%)', zIndex: 20, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 45, background: 'linear-gradient(270deg, #170404 0%, rgba(23,4,4,0) 100%)', zIndex: 20, pointerEvents: 'none' }} />

                {/* HORIZONTAL SCROLLING TAPE TRACK */}
                <motion.div
                  animate={{ x: horizontalOffsetX }}
                  transition={{ duration: 6.5, ease: [0.08, 0.82, 0.17, 1.0] }}
                  style={{ display: 'flex', gap: 12, padding: '10px 16px', alignItems: 'center', height: '100%' }}
                >
                  {horizontalTrackDishes.map((dish, idx) => {
                    return (
                      <div
                        key={`${dish.id}_${idx}`}
                        style={{
                          width: 130,
                          height: 135,
                          flexShrink: 0,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: 20,
                          padding: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          position: 'relative',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s'
                        }}
                      >
                        {/* Clean Circular Food Image Avatar */}
                        <div style={{ position: 'relative', width: 68, height: 68, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', marginBottom: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                          <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        {/* Clean Title Only (No Price Rate) */}
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 115, lineHeight: 1.15, textAlign: 'center' }}>
                          {dish.name}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* ACTION BUTTON: GAMBLE AGAIN */}
              <div style={{ padding: '0 20px' }}>
                <button
                  className="shimmer-btn"
                  style={{
                    width: '100%',
                    padding: 15,
                    fontSize: 16,
                    fontWeight: 900,
                    borderRadius: 16,
                    background: isRouletteSpinning ? '#334155' : 'linear-gradient(135deg, #FFE600 0%, #F59E0B 100%)',
                    boxShadow: isRouletteSpinning ? 'none' : '0 8px 24px rgba(255,230,0,0.35)',
                    color: '#000000',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: isRouletteSpinning ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isRouletteSpinning}
                  onClick={() => triggerCravingsRoulette(rouletteMood || 'spicy')}
                >
                  {isRouletteSpinning ? 'GAMBLING...' : 'GAMBLE AGAIN'}
                </button>

                {/* WINNING DISH RESULT DISPLAY CARD */}
                {rouletteDish && !isRouletteSpinning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{ background: 'rgba(255, 255, 255, 0.98)', borderRadius: 18, padding: 14, marginTop: 16, display: 'flex', gap: 14, alignItems: 'center', border: '1.5px solid #FFE600', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
                  >
                    <img src={rouletteDish.image} alt={rouletteDish.name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', marginBottom: 2, lineHeight: 1.2 }}>{rouletteDish.name}</div>
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{rouletteDish.storeName} • ₹{rouletteDish.price}</div>
                    </div>
                    <button
                      className="quick-filter-btn active"
                      style={{ padding: '10px 16px', background: '#FFE600', color: '#000000', borderColor: '#FFE600', fontWeight: 900, borderRadius: 14, boxShadow: '0 4px 12px rgba(255,230,0,0.4)', cursor: 'pointer' }}
                      onClick={() => {
                        updateItemQty(rouletteDish, 1);
                        setShowSlotMachineModal(false);
                      }}
                    >
                      + Add to Cart
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 4KIT 5-TAB SPOTLIGHT NAVIGATION DOCK ─── */}
      <div className="glovo-bottom-dock" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, width: '100%', maxWidth: '440px' }}>
        <SpotlightNav
          items={spotlightNavItems}
          activeIndex={activeNavIndex}
          onTabChange={(index) => {
            const screens: ScreenType[] = ['home', 'discover', 'multiorder', 'cart', 'profile'];
            if (screens[index]) setCurrentScreen(screens[index]);
          }}
          theme="white"
          size="md"
          accentColor={activeTheme.primary}
        />
      </div>
    </div>
  );
}
