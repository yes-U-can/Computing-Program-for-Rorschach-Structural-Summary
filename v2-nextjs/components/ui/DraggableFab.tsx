'use client';

import { useRef, useCallback, useEffect, type ReactNode, type PointerEvent } from 'react';

const STORAGE_KEY = 'draggable-fab-position';
const DRAG_THRESHOLD = 5;
const MARGIN = 16;
const MOBILE_BOTTOM_EXTRA = 24;
const FRICTION = 0.92;
const MIN_VELOCITY = 0.3;
const VELOCITY_SAMPLES = 4;

interface DraggableFabProps {
  onClick: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}

interface Vec2 { x: number; y: number }
interface Sample { x: number; y: number; t: number }

/**
 * Draggable FAB — all drag/inertia movement is done via direct DOM
 * manipulation (no React re-renders during motion).
 */
export default function DraggableFab({ onClick, label, children, className = '' }: DraggableFabProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const pos = useRef<Vec2>({ x: 0, y: 0 });
  const dragActive = useRef(false);
  const didDrag = useRef(false);
  const startMouse = useRef<Vec2>({ x: 0, y: 0 });
  const startPos = useRef<Vec2>({ x: 0, y: 0 });
  const samples = useRef<Sample[]>([]);
  const raf = useRef(0);

  // ---- helpers (no state, no re-render) ----

  const getSize = useCallback(() => {
    const el = btnRef.current;
    return { w: el?.offsetWidth ?? 160, h: el?.offsetHeight ?? 48 };
  }, []);

  const clamp = useCallback((x: number, y: number): Vec2 => {
    const { w, h } = getSize();
    const bottomPadding =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
        ? MARGIN + MOBILE_BOTTOM_EXTRA
        : MARGIN;
    return {
      x: Math.max(MARGIN, Math.min(x, window.innerWidth - w - MARGIN)),
      y: Math.max(MARGIN, Math.min(y, window.innerHeight - h - bottomPadding)),
    };
  }, [getSize]);

  const applyPos = useCallback((p: Vec2) => {
    const el = btnRef.current;
    if (!el) return;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
  }, []);

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos.current));
  }, []);

  // ---- init ----

  useEffect(() => {
    let saved: Vec2 | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch { /* ignore */ }

    if (saved) {
      pos.current = clamp(saved.x, saved.y);
    } else {
      const { w, h } = getSize();
      pos.current = clamp(
        window.innerWidth - w - MARGIN,
        window.innerHeight - h - MARGIN
      );
    }
    applyPos(pos.current);

    // Start float animation after position is set
    const el = btnRef.current;
    if (el) {
      requestAnimationFrame(() => el.classList.add('fab-floating'));
    }
  }, [clamp, getSize, applyPos]);

  // Resize handler
  useEffect(() => {
    const onResize = () => {
      pos.current = clamp(pos.current.x, pos.current.y);
      applyPos(pos.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp, applyPos]);

  // Cleanup
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // ---- inertia (pure DOM) ----

  const startInertia = useCallback((vx: number, vy: number) => {
    let velX = vx;
    let velY = vy;

    const tick = () => {
      velX *= FRICTION;
      velY *= FRICTION;

      if (Math.abs(velX) < MIN_VELOCITY && Math.abs(velY) < MIN_VELOCITY) {
        save();
        // Resume float
        btnRef.current?.classList.add('fab-floating');
        return;
      }

      const next = clamp(pos.current.x + velX, pos.current.y + velY);
      if (next.x !== pos.current.x + velX) velX *= -0.3;
      if (next.y !== pos.current.y + velY) velY *= -0.3;

      pos.current = next;
      applyPos(next);
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
  }, [clamp, applyPos, save]);

  // ---- pointer handlers ----

  const onDown = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    if (raf.current) cancelAnimationFrame(raf.current);

    const el = btnRef.current;
    if (el) {
      el.classList.remove('fab-floating');
      el.setPointerCapture(e.pointerId);
    }

    dragActive.current = true;
    didDrag.current = false;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos.current };
    samples.current = [{ x: e.clientX, y: e.clientY, t: Date.now() }];
    e.preventDefault();
  }, []);

  const onMove = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!dragActive.current) return;

    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;

    if (!didDrag.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    if (!didDrag.current) {
      didDrag.current = true;
      const el = btnRef.current;
      if (el) {
        el.style.cursor = 'grabbing';
        el.style.transform = 'scale(1.07)';
      }
    }

    // Velocity tracking
    samples.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    if (samples.current.length > VELOCITY_SAMPLES) samples.current.shift();

    const next = clamp(startPos.current.x + dx, startPos.current.y + dy);
    pos.current = next;
    applyPos(next);
  }, [clamp, applyPos]);

  const onUp = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!dragActive.current) return;
    dragActive.current = false;

    const el = btnRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.transform = '';
    }

    if (didDrag.current) {
      // Compute velocity
      const s = samples.current;
      let vx = 0, vy = 0;
      if (s.length >= 2) {
        const last = s[s.length - 1], first = s[0];
        const dt = last.t - first.t;
        if (dt > 0) {
          vx = ((last.x - first.x) / dt) * 16;
          vy = ((last.y - first.y) / dt) * 16;
        }
      }

      if (Math.abs(vx) > MIN_VELOCITY || Math.abs(vy) > MIN_VELOCITY) {
        startInertia(vx, vy);
      } else {
        save();
        el?.classList.add('fab-floating');
      }
    } else {
      el?.classList.add('fab-floating');
      onClick();
    }
  }, [onClick, startInertia, save]);

  return (
    <button
      ref={btnRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      className={`fab-draggable fixed z-40 inline-flex items-center gap-2 rounded-2xl select-none touch-none ${className}`}
      style={{ cursor: 'grab' }}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
