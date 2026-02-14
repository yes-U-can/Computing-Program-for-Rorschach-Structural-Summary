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
      const viewportWidth = window.innerWidth;
      const edgePadding = 12;
      const top = rect.top - 8;

      // Keep tooltip within viewport by switching horizontal anchor near edges.
      if (rect.left < viewportWidth / 2) {
        setPosition({
          left: Math.max(edgePadding, rect.left),
          top,
          transform: 'translateY(-100%)',
        });
      } else {
        setPosition({
          right: Math.max(edgePadding, viewportWidth - rect.right),
          top,
          transform: 'translateY(-100%)',
        });
      }
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
          className={`fixed z-[9999] w-fit min-w-[12rem] max-w-[min(86vw,42rem)] p-3 bg-slate-800 text-white text-xs rounded-lg whitespace-pre-wrap break-words text-left normal-case shadow-lg ${className}`}
        >
          {content}
        </div>,
        portalRoot
      )}
    </>
  );
}
