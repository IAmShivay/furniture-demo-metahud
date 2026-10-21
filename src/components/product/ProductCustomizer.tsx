'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Check, Info, TreePine, Paintbrush, Palette, Wrench, Cpu, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/cartUtils';

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

interface CustomizationSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

interface ProductCustomizerProps {
  customization: CustomizationSection[];
  onCustomizationChange: (customization: any, totalCost: number) => void;
  className?: string;
}

const ICONS: Record<string, React.ElementType> = {
  'wood-type': TreePine, 'finish-type': Paintbrush, 'color-option': Palette,
  'assembly-option': Wrench, 'hardware-upgrades': Cpu, 'protection-plan': Shield,
};

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  customization: sections,
  onCustomizationChange,
  className = '',
}) => {
  const [selected, setSelected] = useState<Record<string, string | string[]>>({});
  const [tooltip, setTooltip] = useState<string | null>(null);
  const callbackRef = useRef(onCustomizationChange);
  callbackRef.current = onCustomizationChange;

  const compute = useCallback((sel: Record<string, string | string[]>) => {
    let cost = 0;
    const data: any = {};
    for (const sec of sections) {
      const s = sel[sec.id];
      if (!s) continue;
      if (sec.type === 'single' && typeof s === 'string') {
        const o = sec.options.find(x => x.id === s);
        if (o) { cost += o.price; data[sec.id] = { optionId: o.id, name: o.name, price: o.price }; }
      } else if (Array.isArray(s)) {
        data[sec.id] = s.map(id => { const o = sec.options.find(x => x.id === id); if (o) cost += o.price; return o ? { optionId: o.id, name: o.name, price: o.price } : null; }).filter(Boolean);
      }
    }
    return { cost, data };
  }, [sections]);

  const handleSelect = useCallback((sectionId: string, optionId: string, type: 'single' | 'multiple') => {
    setSelected(prev => {
      let next: Record<string, string | string[]>;
      if (type === 'single') {
        next = { ...prev, [sectionId]: optionId };
      } else {
        const cur = (prev[sectionId] as string[]) || [];
        next = { ...prev, [sectionId]: cur.includes(optionId) ? cur.filter(id => id !== optionId) : [...cur, optionId] };
      }
      const { cost, data } = compute(next);
      callbackRef.current(data, cost);
      return next;
    });
  }, [compute]);

  if (!sections.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {sections.map((sec) => {
        const Icon = ICONS[sec.id] || Palette;
        return (
          <div key={sec.id}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-gray-800">{sec.title}</span>
              {sec.required && <span className="text-[10px] text-red-500 font-bold">*</span>}
              {sec.type === 'multiple' && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Multi-select</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {sec.options.map((opt) => {
                const sel = selected[sec.id];
                const active = Array.isArray(sel) ? sel.includes(opt.id) : sel === opt.id;
                const disabled = opt.available === false;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelect(sec.id, opt.id, sec.type)}
                    className={`
                      inline-flex items-center gap-1.5 pl-2 pr-3 py-2 rounded-xl border-2 text-sm transition-colors
                      ${active ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'}
                      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                      {active && <Check className="w-3 h-3 text-white" />}
                    </span>
                    {opt.image && <img src={opt.image} alt="" className="w-6 h-6 rounded object-cover" />}
                    <span className="font-medium">{opt.name}</span>
                    <span className={`text-xs font-semibold ${opt.price > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Free'}
                    </span>
                    {opt.description && (
                      <span
                        className="relative ml-0.5"
                        onMouseEnter={(e) => { e.stopPropagation(); setTooltip(opt.id); }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={(e) => { e.stopPropagation(); setTooltip(tooltip === opt.id ? null : opt.id); }}
                      >
                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-amber-600 cursor-help" />
                        {tooltip === opt.id && (
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg z-50 pointer-events-none">
                            {opt.description}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ProductCustomizer);
