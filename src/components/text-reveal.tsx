'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LucideIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextItem {
  text: string;
  contact?: boolean;
  icon?: LucideIcon;
  mailto?: string;
}

interface ProcessedTextItem {
  words: string[];
  contact?: boolean;
  icon?: LucideIcon;
  mailto?: string;
}

interface TextRevealProps {
  textItems?: TextItem[];
  iconSize?: number | 'auto'; // Allow 'auto' for adaptive sizing
  iconSizeMultiplier?: number; // Multiplier for auto sizing (default 1.2)
  className?: string;
  pixelsPerWord?: number;
  revealOffset?: number;
  leading?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose' | string;
  underlineThickness?: 'thin' | 'normal' | 'thick' | 'auto';
}

const TextReveal: React.FC<TextRevealProps> = ({
  textItems = [],
  iconSize = 'auto',
  iconSizeMultiplier = 1,
  className,
  pixelsPerWord = 15,
  revealOffset = 0,
  leading = 'normal',
  underlineThickness = 'auto',
}) => {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [computedIconSize, setComputedIconSize] = useState(24);
  const componentRef = useRef<HTMLDivElement>(null);
  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const initializedRef = useRef(false);
  const [hoveredItems, setHoveredItems] = useState<{
    [key: number]: boolean;
  }>({});

  // State to track if specific icons are visible
  const [iconStates, setIconStates] = useState<{
    [key: number]: 'visible' | 'hidden' | 'clicked';
  }>({});

  // Track previous visibility state to detect when items leave and re-enter view
  const previouslyVisibleRef = useRef<Set<number>>(new Set());

  // Helper function to get appropriate leading class
  const getLeadingClass = (leading: string) => {
    const leadingMap: { [key: string]: string } = {
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    };

    return leadingMap[leading] || leading;
  };

  // Helper function to get underline thickness based on text size
  const getUnderlineStyle = (thickness: string) => {
    if (thickness === 'auto') {
      // Auto-scaling based on font size using em units
      return {
        height: '0.08em',
        bottom: '-0.15em',
      };
    }

    const thicknessMap: { [key: string]: { height: string; bottom: string } } =
      {
        thin: { height: '1px', bottom: '-4px' },
        normal: { height: '2px', bottom: '-6px' },
        thick: { height: '4px', bottom: '-8px' },
      };

    return thicknessMap[thickness] || thicknessMap.normal;
  };

  // Calculate icon size based on text size
  useEffect(() => {
    if (iconSize === 'auto' && textMeasureRef.current) {
      const computedStyle = window.getComputedStyle(textMeasureRef.current);
      const fontSize = parseFloat(computedStyle.fontSize);
      const newIconSize = Math.round(fontSize * iconSizeMultiplier);
      setComputedIconSize(newIconSize);
    } else if (typeof iconSize === 'number') {
      setComputedIconSize(iconSize);
    }
  }, [iconSize, iconSizeMultiplier, className]);

  const processTextItems = (items: TextItem[]): ProcessedTextItem[] => {
    const processed: ProcessedTextItem[] = [];

    if (!items || items.length === 0) return processed;

    items.forEach((item) => {
      const words = item.text.split(' ');
      if (item.contact) {
        processed.push({
          words,
          contact: !!item.contact,
          icon: item.icon,
          mailto: item.mailto,
        });
      } else {
        words.forEach((word) => {
          processed.push({
            words: [word],
            contact: false,
          });
        });
      }
    });

    return processed;
  };

  const processedText = useMemo(() => processTextItems(textItems), [textItems]);
  const allWords = useMemo(
    () => processedText.flatMap((item) => item.words),
    [processedText],
  );
  const totalWordCount = useMemo(() => allWords.length, [allWords]);

  // Update visibility status based on scroll position
  useEffect(() => {
    const updateVisibleWords = () => {
      if (!componentRef.current || totalWordCount === 0) return;

      const componentRect = componentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const revealTriggerPoint = viewportHeight / 2 + revealOffset;
      const distanceFromTrigger = componentRect.top - revealTriggerPoint;

      if (distanceFromTrigger > 0) {
        setVisibleWordCount(0);
        return;
      }

      const scrolledPastTrigger = Math.abs(distanceFromTrigger);
      let newVisibleWordCount = Math.floor(scrolledPastTrigger / pixelsPerWord);
      newVisibleWordCount = Math.min(newVisibleWordCount, totalWordCount);
      setVisibleWordCount(newVisibleWordCount);

      if (!initializedRef.current && newVisibleWordCount > 0) {
        initializedRef.current = true;
      }
    };

    window.addEventListener('scroll', updateVisibleWords);
    window.addEventListener('resize', updateVisibleWords);

    updateVisibleWords();

    return () => {
      window.removeEventListener('scroll', updateVisibleWords);
      window.removeEventListener('resize', updateVisibleWords);
    };
  }, [totalWordCount, pixelsPerWord, revealOffset]);

  // Update icon states when visibility changes
  useEffect(() => {
    const currentlyVisible = new Set<number>();
    const updatedIconStates = { ...iconStates };

    processedText.forEach((item, itemIndex) => {
      if (!item.contact) return;

      const endWordIndex =
        processedText
          .slice(0, itemIndex)
          .reduce((acc, curr) => acc + curr.words.length, 0) +
        item.words.length -
        1;

      const isHighlighted = visibleWordCount > endWordIndex;

      // If item is currently highlighted
      if (isHighlighted) {
        currentlyVisible.add(itemIndex);

        // If this is the first time we're seeing this item or it's re-entering view
        if (
          !previouslyVisibleRef.current.has(itemIndex) &&
          updatedIconStates[itemIndex] !== 'clicked'
        ) {
          updatedIconStates[itemIndex] = 'visible';
        }
      }
      // If item is not highlighted and was previously visible
      else if (previouslyVisibleRef.current.has(itemIndex)) {
        // Reset the clicked state when item leaves view
        if (updatedIconStates[itemIndex] === 'clicked') {
          updatedIconStates[itemIndex] = 'hidden';
        }
      }
    });

    // Update previous visibility reference for next render
    previouslyVisibleRef.current = currentlyVisible;

    setIconStates(updatedIconStates);
  }, [visibleWordCount, processedText, iconStates]);

  if (allWords.length === 0) {
    return <div className={cn('w-full', className)} ref={componentRef}></div>;
  }

  const isContactComponent =
    processedText.length === 1 && processedText[0].contact;

  const textVariants = {
    hidden: {
      y: 10,
      opacity: 0.3,
      filter: 'blur(0px)',
      transition: { duration: 0.3 },
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.3 },
    },
  };

  const contactIconVariants = {
    initial: {
      y: 40,
      x: -40,
      opacity: 0,
      scale: 0.5,
      filter: 'blur(0px)',
    },
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      y: 7,
      x: -7,
      filter: 'blur(0px)',
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },
    exit: {
      y: -100,
      x: 100,
      opacity: 0,
      scale: 0.8,
      filter: 'blur(2px)',
      transition: {
        duration: 0.25,
        ease: 'easeIn',
      },
    },
  };

  const contactTextVariants = {
    hidden: {
      x: 0,
      filter: 'blur(0px)',
      opacity: 0.3,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.2,
      },
    },
    visible: {
      x: computedIconSize + 10, // Adjust text offset based on icon size
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const underlineVariants = {
    initial: {
      opacity: 0,
      width: '0%',
    },
    animate: {
      opacity: 1,
      width: '100%',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      width: '0%',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  const renderIcon = (IconComponent: LucideIcon) => {
    return (
      <IconComponent
        className='transition-all duration-300'
        size={computedIconSize}
        strokeWidth={2}
      />
    );
  };

  const underlineStyle = getUnderlineStyle(underlineThickness);

  const content = (
    <div className={getLeadingClass(leading)}>
      {/* Hidden text element for measuring font size */}
      <span
        ref={textMeasureRef}
        className={cn('opacity-0 absolute pointer-events-none', className)}
        aria-hidden='true'
      >
        M
      </span>

      {processedText.map((item, itemIndex) => {
        const startWordIndex = processedText
          .slice(0, itemIndex)
          .reduce((acc, curr) => acc + curr.words.length, 0);

        const endWordIndex = startWordIndex + item.words.length - 1;

        if (item.contact) {
          const isHighlighted = visibleWordCount > endWordIndex;
          const isHovered = hoveredItems[itemIndex] || false;
          const text = item.words.join(' ');
          const IconComponent = item.icon || Send;

          // Icon should be shown if it's in 'visible' state (not clicked yet)
          const shouldShowIcon =
            isHighlighted && iconStates[itemIndex] === 'visible';

          return (
            <motion.a
              key={itemIndex}
              href={item.mailto ? `mailto:${item.mailto}` : undefined}
              className={cn(
                'inline-flex relative items-center mx-1 text-primary cursor-pointer',
                className,
              )}
              onMouseEnter={() => {
                setHoveredItems((prev) => ({ ...prev, [itemIndex]: true }));
              }}
              onMouseLeave={() => {
                setHoveredItems((prev) => ({ ...prev, [itemIndex]: false }));
              }}
              onClick={() => {
                // Mark as clicked when clicked
                setIconStates((prev) => ({
                  ...prev,
                  [itemIndex]: 'clicked',
                }));
              }}
            >
              <div
                style={{
                  width: `0px`,
                  height: `${computedIconSize}px`,
                }}
              >
                <AnimatePresence>
                  {shouldShowIcon && (
                    <motion.div
                      className='absolute left-0'
                      key={`icon-${itemIndex}`}
                      initial='initial'
                      animate={isHovered ? 'hover' : 'animate'}
                      exit='exit'
                      variants={contactIconVariants}
                    >
                      {renderIcon(IconComponent)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.span
                className='relative inline-block'
                variants={contactTextVariants}
                animate={isHighlighted ? 'visible' : 'hidden'}
              >
                {text}
                <AnimatePresence>
                  {isHighlighted && (
                    <motion.span
                      className='absolute left-0 bg-primary-foreground'
                      style={{
                        height: underlineStyle.height,
                        bottom: underlineStyle.bottom,
                      }}
                      initial='initial'
                      animate='animate'
                      exit='exit'
                      variants={underlineVariants}
                    />
                  )}
                </AnimatePresence>
              </motion.span>
            </motion.a>
          );
        } else {
          const word = item.words[0];
          const isHighlighted = visibleWordCount > startWordIndex;

          return (
            <React.Fragment key={itemIndex}>
              <motion.span
                key={itemIndex}
                className={cn('inline-block text-primary', className)}
                variants={textVariants}
                initial='hidden'
                animate={isHighlighted ? 'visible' : 'hidden'}
              >
                {word}
              </motion.span>
              <span className={className}> </span>
            </React.Fragment>
          );
        }
      })}
    </div>
  );

  if (isContactComponent) {
    return (
      <motion.div
        className={cn('w-full', className)}
        ref={componentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={cn('w-full', className)} ref={componentRef}>
      {content}
    </div>
  );
};

export default TextReveal;
