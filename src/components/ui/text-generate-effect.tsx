'use client';
import { useEffect, useRef } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  onComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  onComplete?: () => void;
}) => {
  const staggerDur = 0.15;
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Ref for the timeout
  const totalDuration = wordsArray.length * staggerDur + 1; //0.2 = stagger delay

  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(staggerDur),
      },
    );

    // Set a timeout to call onComplete after the entire sequence
    timeoutId.current = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, totalDuration * 1000); // Convert to milliseconds
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [
    // scope.current,
    onComplete,
    wordsArray.length,
    duration,
    animate,
    filter,
    totalDuration,
  ]); //

  const renderWords = () => (
    <motion.div ref={scope} style={{ display: 'inline-block' }}>
      {wordsArray.map((word, index) => (
        <motion.span
          key={index}
          style={{
            opacity: 0,
            filter: filter ? 'blur(10px)' : 'none',
            display: 'inline-block',
            whiteSpace: 'pre-wrap',
          }}
        >
          {word + ' '}
        </motion.span>
      ))}
    </motion.div>
  );

  return (
    <div className={cn('font-bold', className)}>
      <div className='mt-4'>
        <div className='dark:text-white text-black '>{renderWords()}</div>
      </div>
    </div>
  );
};
