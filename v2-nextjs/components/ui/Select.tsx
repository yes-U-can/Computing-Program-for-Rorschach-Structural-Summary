'use client';

import { Fragment, forwardRef } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ value, onChange, options, placeholder = 'Select...', disabled = false, className = '', size = 'md' }, ref) => {
    const selectedOption = options.find(opt => opt.value === value);

    const sizeStyles = {
      sm: 'py-1.5 px-2 text-sm min-h-[32px]',
      md: 'py-2 px-3 text-base min-h-[40px]'
    };

    return (
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className={`relative ${className}`}>
          <ListboxButton
            ref={ref}
            className={`relative w-full cursor-pointer rounded-lg bg-white text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4E73AA]/50 focus:border-[#4E73AA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${sizeStyles[size]}`}
          >
            <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}`}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  className={({ active, selected }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#C1D2DC]/20 text-slate-900' : 'text-slate-700'
                    } ${selected ? 'font-medium' : 'font-normal'}`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#2A5F7F]">
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    );
  }
);

Select.displayName = 'Select';

export default Select;
