'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LucideIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  iconSize?: number;
  className?: string;
  textSize?: string;
  pixelsPerWord?: number;
  revealOffset?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({
  textItems = [],
  iconSize = 36,
  className = 'w-full',
  textSize = 'text-5xl',
  pixelsPerWord = 15,
  revealOffset = 0,
}) => {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);
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
  }, [visibleWordCount, processedText]);

  if (allWords.length === 0) {
    return <div className={className} ref={componentRef}></div>;
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
      x: 50,
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
        size={iconSize}
        strokeWidth={2}
      />
    );
  };

  const content = (
    <div className='leading-[4]'>
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
              className={`inline-flex relative items-center mx-1 ${textSize} text-primary-foreground cursor-pointer`}
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
                  height: `${iconSize}px`,
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
                      className='absolute bottom-[-8px] left-0 h-1 bg-primary-foreground'
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
                className={`inline-block ${textSize} text-primary-foreground`}
                variants={textVariants}
                initial='hidden'
                animate={isHighlighted ? 'visible' : 'hidden'}
              >
                {word}
              </motion.span>
              <span className={`${textSize}`}> </span>
            </React.Fragment>
          );
        }
      })}
    </div>
  );

  if (isContactComponent) {
    return (
      <motion.div
        className={className}
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
    <div className={className} ref={componentRef}>
      {content}
    </div>
  );
};

export default TextReveal;
