'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import sharedConfig from '@/config/shared-config.json';

interface TextItem {
  text: string;
  contact?: boolean;
}

interface TextRevealProps {
  textItems?: TextItem[];
  className?: string;
  pixelsPerWord?: number;
  revealOffset?: number;
  iconSize?: number | 'auto';
  iconSizeMultiplier?: number;
  isContactButton?: boolean;
}

const TextReveal: React.FC<TextRevealProps> = ({
  textItems = [],
  className,
  pixelsPerWord = 15,
  revealOffset = 0,
  iconSize = 'auto',
  iconSizeMultiplier = 1,
  isContactButton = false,
}) => {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  const [computedIconSize, setComputedIconSize] = useState<number>(24);

  const componentRef = useRef<HTMLDivElement>(null);
  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const clickedAwaitingResetRef = useRef(false);
  const scrolledAwayRef = useRef(false);

  const allWords = React.useMemo(
    () => textItems.flatMap((item) => item.text.split(' ').filter(Boolean)),
    [textItems],
  );
  const totalWordCount = allWords.length;

  const email = sharedConfig.contact.email;
  const subject = sharedConfig.contact.subject;
  const body = sharedConfig.contact.body;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  useEffect(() => {
    if (iconSize === 'auto' && textMeasureRef.current) {
      const updateIconSize = () => {
        const el = textMeasureRef.current;
        if (!el) return;
        const computedStyle = window.getComputedStyle(el);
        const fontSize = parseFloat(computedStyle.fontSize) || 16;
        const newIconSize = Math.round(fontSize * iconSizeMultiplier);
        setComputedIconSize((prev) =>
          Math.abs(newIconSize - prev) > 1 ? newIconSize : prev,
        );
      };

      requestAnimationFrame(updateIconSize);

      let rafId: number | null = null;
      const handleResize = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            updateIconSize();
            rafId = null;
          });
        }
      };
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    } else if (typeof iconSize === 'number') {
      setComputedIconSize(iconSize);
    }
  }, [iconSize, iconSizeMultiplier]);

  useEffect(() => {
    const updateVisibleWords = () => {
      if (!componentRef.current || totalWordCount === 0) return;
      const rect = componentRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight / 2 + revealOffset;
      const distance = rect.top - triggerPoint;
      if (distance > 0) {
        setVisibleWordCount(0);
        return;
      }
      const scrolled = Math.abs(distance);
      const newCount = Math.min(
        Math.floor(scrolled / pixelsPerWord),
        totalWordCount,
      );
      setVisibleWordCount(newCount);
    };

    const handle = () => requestAnimationFrame(updateVisibleWords);
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle, { passive: true });
    updateVisibleWords();
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [totalWordCount, pixelsPerWord, revealOffset]);

  const isFullyVisible = visibleWordCount >= totalWordCount;

  useEffect(() => {
    if (iconClicked) {
      clickedAwaitingResetRef.current = true;
      scrolledAwayRef.current = false;
    }
    if (!iconClicked) {
      clickedAwaitingResetRef.current = false;
      scrolledAwayRef.current = false;
    }
  }, [iconClicked]);

  useEffect(() => {
    if (!clickedAwaitingResetRef.current) return;
    if (!isFullyVisible && !scrolledAwayRef.current) {
      scrolledAwayRef.current = true;
      return;
    }
    if (isFullyVisible && scrolledAwayRef.current) {
      setIconClicked(false);
      clickedAwaitingResetRef.current = false;
      scrolledAwayRef.current = false;
    }
  }, [isFullyVisible]);

  const handleClick = () => {
    setIconClicked(true);
  };

  if (!textItems.length) {
    return <div className={cn('w-full', className)} ref={componentRef} />;
  }

  const measureSpan = (
    <span
      ref={textMeasureRef}
      className={cn('opacity-0 absolute pointer-events-none')}
      aria-hidden='true'
    >
      M
    </span>
  );

  if (isContactButton) {
    const IconComponent = Send;

    return (
      <div className={cn('w-full', className)} ref={componentRef}>
        {measureSpan}
        <motion.a
          href={mailtoLink}
          className='inline-flex relative items-center text-primary cursor-pointer'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <div style={{ width: 0, height: `${computedIconSize}px` }}>
            <AnimatePresence>
              {isFullyVisible && (
                <motion.div
                  key='contact-icon'
                  className='absolute left-0'
                  initial={{ y: 40, x: -40, opacity: 0, scale: 0.5 }}
                  animate={
                    iconClicked
                      ? { y: -140, x: 140, opacity: 0, scale: 0.8 }
                      : isHovered
                        ? { y: 7, x: -7, opacity: 1, scale: 1 }
                        : { y: 0, x: 0, opacity: 1, scale: 1 }
                  }
                  exit={{ y: -100, x: 100, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <IconComponent size={computedIconSize} strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.span
            className='relative inline-block'
            animate={{
              x: isFullyVisible ? computedIconSize + 10 : 0,
              opacity: isFullyVisible ? 1 : 0.3,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {allWords.join(' ')}
            <AnimatePresence>
              {isFullyVisible && (
                <motion.span
                  className='absolute left-0 bg-primary-foreground'
                  style={{
                    height: '0.08em',
                    bottom: '-0.15em',
                  }}
                  initial={{ opacity: 0, width: '0%' }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </motion.span>
        </motion.a>
      </div>
    );
  }

  return (
    <div
      className={cn('w-full', className)}
      ref={componentRef}
      style={{ lineHeight: '1.75' }}
    >
      {measureSpan}
      {allWords.map((word, index) => (
        <React.Fragment key={index}>
          <motion.span
            className='inline-block text-primary'
            initial={{ y: 10, opacity: 0.3 }}
            animate={{
              y: visibleWordCount > index ? 0 : 10,
              opacity: visibleWordCount > index ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          >
            {word}
          </motion.span>
          <span> </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TextReveal;
