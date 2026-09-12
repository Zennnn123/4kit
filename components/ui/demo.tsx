import React, { useState } from 'react';
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";
import { 
  Component, 
  SpotlightFilterButton, 
  SpotlightFilter, 
  SpotlightNav 
} from "./spotlight-button";

function Demo() {
  return <SignIn1 />;
}

const DemoOne = () => {
  return <Component />;
};

export const DemoFilterButton = () => {
  const [activeCategory, setActiveCategory] = useState<'food' | 'supermarket' | 'pharmacy' | 'bakery'>('food');
  const [filterCount, setFilterCount] = useState(2);

  const colors = {
    food: '#DC2626',
    supermarket: '#059669',
    pharmacy: '#2563EB',
    bakery: '#D97706',
  };

  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-6 p-6 bg-zinc-100">
      <div className="flex gap-2">
        {(Object.keys(colors) as Array<keyof typeof colors>).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize shadow-sm"
            style={{ backgroundColor: colors[cat] }}
          >
            {cat}
          </button>
        ))}
      </div>

      <SpotlightFilterButton
        accentColor={colors[activeCategory]}
        count={filterCount}
        onClick={() => setFilterCount((c) => (c > 0 ? 0 : 3))}
      />
    </div>
  );
};

export { Demo, DemoOne, SignIn1 };
export default Demo;
