'use client';

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SlotSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  disabledOptions?: readonly string[];
  className?: string;
  gridCols?: number;
}

export default function SlotSelect({
  value,
  onChange,
  options,
  placeholder = '-',
  disabled = false,
  disabledOptions,
  className = '',
  gridCols
}: SlotSelectProps) {
  const isGrid = gridCols && gridCols > 1;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>
        <ListboxButton
          className={`w-full h-8 px-1.5 text-xs rounded-md
            bg-slate-50 border border-slate-200 text-center
            hover:border-slate-300
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40 focus:border-[var(--brand-500)]
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors
            ${!value ? 'text-slate-400' : 'text-slate-700 font-medium'}`}
        >
          <span className="block truncate">{value || placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5">
            <ChevronDownIcon className="h-3 w-3 text-slate-300" aria-hidden="true" />
          </span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className={`z-[9999] mt-1 overflow-auto rounded-xl bg-white
            shadow-xl shadow-slate-200/50
            ring-1 ring-slate-200
            focus:outline-none text-xs
            transition ease-out duration-150 data-[closed]:opacity-0 data-[closed]:scale-95 ${
            isGrid ? 'p-2' : 'max-h-48 min-w-[80px] py-1'
          }`}
        >
          {isGrid ? (
            <>
              {/* Clear / placeholder button */}
              <button
                type="button"
                onClick={() => onChange('')}
                className="w-full mb-1.5 py-1.5 text-center text-xs text-slate-400
                  hover:text-red-500 hover:bg-red-50
                  border border-dashed border-slate-200 hover:border-red-300
                  rounded-lg transition-colors"
              >
                Clear
              </button>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {options.map((option) => {
                  const isOptionDisabled = disabledOptions?.includes(option) ?? false;
                  return (
                  <ListboxOption
                    key={option}
                    value={option}
                    disabled={isOptionDisabled}
                    className={({ active, selected }) =>
                      isOptionDisabled
                        ? 'select-none py-1.5 px-1 text-center rounded-lg text-slate-300 cursor-not-allowed line-through'
                        : `cursor-pointer select-none py-1.5 px-1 text-center rounded-lg transition-colors ${
                        selected
                          ? 'bg-[var(--brand-700)] text-white font-semibold shadow-sm'
                          : active
                            ? 'bg-slate-100 text-slate-800'
                            : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {option}
                  </ListboxOption>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <ListboxOption
                value=""
                className={({ active }) =>
                  `cursor-pointer select-none py-1.5 px-3 transition-colors ${
                    active ? 'bg-slate-50 text-slate-600' : 'text-slate-400'
                  }`
                }
              >
                {placeholder}
              </ListboxOption>
              {options.map((option) => {
                const isOptionDisabled = disabledOptions?.includes(option) ?? false;
                return (
                <ListboxOption
                  key={option}
                  value={option}
                  disabled={isOptionDisabled}
                  className={({ active, selected }) =>
                    isOptionDisabled
                      ? 'select-none py-1.5 px-3 text-slate-300 cursor-not-allowed line-through'
                      : `cursor-pointer select-none py-1.5 px-3 transition-colors ${
                      selected
                        ? 'bg-[var(--brand-200)]/20 text-[var(--brand-700)] font-medium'
                        : active
                          ? 'bg-slate-50 text-slate-800'
                          : 'text-slate-600'
                    }`
                  }
                >
                  {option}
                </ListboxOption>
                );
              })}
            </>
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}





