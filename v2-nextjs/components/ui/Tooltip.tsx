'use client';

import { useState, useRef, ReactNode, CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export default function Tooltip({ children, content, className = '' }: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({});
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top - 8, // Position above the trigger, with a small gap
        transform: 'translateX(-50%) translateY(-100%)',
      });
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      {visible && portalRoot && createPortal(
        <div
          style={position}
          className={`fixed z-[9999] w-72 p-3 bg-slate-800 text-white text-xs rounded-lg whitespace-pre-line text-left normal-case shadow-lg ${className}`}
        >
          {content}
        </div>,
        portalRoot
      )}
    </>
  );
}
