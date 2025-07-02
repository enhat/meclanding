'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
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
  iconSize?: number | 'auto';
  iconSizeMultiplier?: number;
  className?: string;
  pixelsPerWord?: number;
  revealOffset?: number;
  leading?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose' | string;
  underlineThickness?: 'thin' | 'normal' | 'thick' | 'auto';
}

const rafThrottle = (func: () => void) => {
  let rafId: number | null = null;
  return function () {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func();
        rafId = null;
      });
    }
  };
};

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
  const [hoveredItems, setHoveredItems] = useState<{
    [key: number]: boolean;
  }>({});
  const [iconStates, setIconStates] = useState<{
    [key: number]: 'visible' | 'hidden' | 'clicked';
  }>({});
  const previouslyVisibleRef = useRef<Set<number>>(new Set());

  const getLeadingClass = useCallback((leading: string) => {
    const leadingMap: { [key: string]: string } = {
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    };
    return leadingMap[leading] || leading;
  }, []);

  const getUnderlineStyle = useCallback((thickness: string) => {
    if (thickness === 'auto') {
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
  }, []);

  const processTextItems = useCallback(
    (items: TextItem[]): ProcessedTextItem[] => {
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
    },
    [],
  );

  const processedText = useMemo(
    () => processTextItems(textItems),
    [textItems, processTextItems],
  );
  const allWords = useMemo(
    () => processedText.flatMap((item) => item.words),
    [processedText],
  );
  const totalWordCount = useMemo(() => allWords.length, [allWords]);
  const underlineStyle = useMemo(
    () => getUnderlineStyle(underlineThickness),
    [underlineThickness, getUnderlineStyle],
  );

  useEffect(() => {
    if (iconSize === 'auto' && textMeasureRef.current) {
      const updateIconSize = () => {
        if (textMeasureRef.current) {
          const computedStyle = window.getComputedStyle(textMeasureRef.current);
          const fontSize = parseFloat(computedStyle.fontSize);
          const newIconSize = Math.round(fontSize * iconSizeMultiplier);

          if (Math.abs(newIconSize - computedIconSize) > 1) {
            setComputedIconSize(newIconSize);
          }
        }
      };
      requestAnimationFrame(updateIconSize);
    } else if (typeof iconSize === 'number') {
      setComputedIconSize(iconSize);
    }
  }, [iconSize, iconSizeMultiplier, computedIconSize]);

  const updateVisibleWords = useCallback(() => {
    if (!componentRef.current || totalWordCount === 0) return;

    const componentRect = componentRef.current.getBoundingClientRect();
    const revealTriggerPoint = window.innerHeight / 2 + revealOffset;
    const distanceFromTrigger = componentRect.top - revealTriggerPoint;

    if (distanceFromTrigger > 0) {
      if (visibleWordCount !== 0) {
        setVisibleWordCount(0);
      }
      return;
    }

    const scrolledPastTrigger = Math.abs(distanceFromTrigger);
    let newVisibleWordCount = Math.floor(scrolledPastTrigger / pixelsPerWord);
    newVisibleWordCount = Math.min(newVisibleWordCount, totalWordCount);

    if (newVisibleWordCount !== visibleWordCount) {
      setVisibleWordCount(newVisibleWordCount);
    }
  }, [totalWordCount, pixelsPerWord, revealOffset, visibleWordCount]);

  useEffect(() => {
    const throttledUpdate = rafThrottle(updateVisibleWords);

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    updateVisibleWords();

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [updateVisibleWords]);

  useEffect(() => {
    const currentlyVisible = new Set<number>();
    const updatedIconStates = { ...iconStates };
    let hasChanges = false;

    processedText.forEach((item, itemIndex) => {
      if (!item.contact) return;

      const endWordIndex =
        processedText
          .slice(0, itemIndex)
          .reduce((acc, curr) => acc + curr.words.length, 0) +
        item.words.length -
        1;

      const isHighlighted = visibleWordCount > endWordIndex;

      if (isHighlighted) {
        currentlyVisible.add(itemIndex);

        if (
          !previouslyVisibleRef.current.has(itemIndex) &&
          updatedIconStates[itemIndex] !== 'clicked'
        ) {
          updatedIconStates[itemIndex] = 'visible';
          hasChanges = true;
        }
      } else if (previouslyVisibleRef.current.has(itemIndex)) {
        if (updatedIconStates[itemIndex] === 'clicked') {
          updatedIconStates[itemIndex] = 'hidden';
          hasChanges = true;
        }
      }
    });

    previouslyVisibleRef.current = currentlyVisible;

    if (hasChanges) {
      setIconStates(updatedIconStates);
    }
  }, [visibleWordCount, processedText, iconStates]);

  const handleMouseEnter = useCallback((itemIndex: number) => {
    setHoveredItems((prev) => {
      if (prev[itemIndex]) return prev;
      return { ...prev, [itemIndex]: true };
    });
  }, []);

  const handleMouseLeave = useCallback((itemIndex: number) => {
    setHoveredItems((prev) => {
      if (!prev[itemIndex]) return prev;
      return { ...prev, [itemIndex]: false };
    });
  }, []);

  const handleClick = useCallback((itemIndex: number) => {
    setIconStates((prev) => ({
      ...prev,
      [itemIndex]: 'clicked',
    }));
  }, []);

  const renderIcon = useCallback(
    (IconComponent: LucideIcon) => {
      return (
        <IconComponent
          className='transition-all duration-300'
          size={computedIconSize}
          strokeWidth={2}
        />
      );
    },
    [computedIconSize],
  );

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
      x: computedIconSize + 10,
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

  const content = (
    <div className={getLeadingClass(leading)}>
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
              onMouseEnter={() => handleMouseEnter(itemIndex)}
              onMouseLeave={() => handleMouseLeave(itemIndex)}
              onClick={() => handleClick(itemIndex)}
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
