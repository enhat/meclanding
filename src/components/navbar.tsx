'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ScrollSection = {
  id: string;
  title: string;
  href: string;
  description: string;
  offset?: number;
};

const getScrollOffsets = (): Record<string, number> => {
  return {
    'mission-section': 270,
  };
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'RD&D Consulting',
    href: '/services/rdd',
    description: 'Our consulting services',
  },
  {
    title: 'WCET Capabilities',
    href: '/services/wcet',
    description: 'Washington Clean Energy Testbeds',
  },
  {
    title: 'Makerspace',
    href: '/services/makerspace',
    description: 'Explore our innovative workspace',
  },
];

const scrollSections: ScrollSection[] = [
  {
    id: 'services-section',
    title: 'Our Projects',
    href: '#services-section',
    description: 'Pioneering work in clean energy technologies',
  },
  {
    id: 'mission-section',
    title: 'Our Mission',
    href: '#mission-section',
    description: 'Our commitment to sustainable innovation',
    offset: getScrollOffsets()['mission-section'],
  },
];

const email = 'example@example.com';
const subject = '';
const body = '';
const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
    onClick?: (e: React.MouseEvent) => void;
  }
>(({ className, title, children, href, onClick, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        href={href!}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ',
          className,
        )}
        onClick={onClick}
        {...props}
      >
        <div className='text-sm font-medium leading-none'>{title}</div>
        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = 'ListItem';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const scrollWithOffset = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsets = getScrollOffsets();
      const offset = offsets[sectionId] || 0;

      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition = sectionPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  React.useEffect(() => {
    setHasLoaded(true);

    if (isHome && window.location.hash) {
      const sectionId = window.location.hash.substring(1);

      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 500);

      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [isHome]);

  const scrollToSection = (sectionId: string) => {
    scrollWithOffset(sectionId);
  };

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleExternalSectionClick = (
    e: React.MouseEvent,
    sectionId: string,
  ) => {
    e.preventDefault();

    const targetUrl = '/';
    window.location.href = targetUrl;

    sessionStorage.setItem('scrollTarget', sectionId);
  };

  React.useEffect(() => {
    if (isHome && hasLoaded) {
      const scrollTarget = sessionStorage.getItem('scrollTarget');

      if (scrollTarget) {
        window.scrollTo({ top: 0, behavior: 'instant' });

        setTimeout(() => {
          scrollWithOffset(scrollTarget);
          sessionStorage.removeItem('scrollTarget');
        }, 500);
      }
    }
  }, [isHome, hasLoaded]);

  return (
    <nav
      className={cn(
        'absolute top-0 left-0 w-full z-50',
        !isHome && 'text-primary-foreground',
      )}
    >
      <div className='px-56 w-full h-28'>
        <div className='flex items-center justify-between h-full'>
          <Link
            href='/'
            className={cn(
              'text-4xl font-bold',
              !isHome && 'text-primary-foreground',
            )}
          >
            mec
          </Link>

          <div className='hidden md:block'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      !isHome && 'text-primary-foreground',
                    )}
                  >
                    About
                  </NavigationMenuTrigger>
                  <AnimatePresence mode='wait'>
                    <NavigationMenuContent>
                      <ul className='grid gap-3 p-6 md:w-[350px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                        <li className='row-span-3'>
                          <NavigationMenuLink asChild>
                            <Link
                              href='/'
                              className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                            >
                              <div className='mb-2 mt-4 text-lg font-medium'>
                                MEC
                              </div>
                              <p className='text-sm leading-tight text-muted-foreground'>
                                Efficient. Impactful. Sustainable. We optimize
                                energy, cut carbon, and drive independence for a
                                greener future.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href='/team' title='Who We Are'>
                          Meet the passionate team behind MEC
                        </ListItem>
                        {scrollSections.map((section) => (
                          <ListItem
                            key={section.id}
                            href={isHome ? section.href : '/'}
                            title={section.title}
                            onClick={(e) => {
                              if (isHome) {
                                handleSectionClick(e, section.id);
                              } else {
                                handleExternalSectionClick(e, section.id);
                              }
                            }}
                          >
                            {section.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </AnimatePresence>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      !isHome && 'text-primary-foreground',
                    )}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <AnimatePresence mode='wait'>
                    <NavigationMenuContent>
                      <ul className='grid w-[400px] gap-3 p-4 md:w-[350px] md:grid-cols-2 lg:w-[500px]'>
                        {components.map((component) => (
                          <ListItem
                            key={component.title}
                            href={component.href}
                            title={component.title}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </AnimatePresence>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <span
            className={cn(
              'text-md font-bold leading-none',
              !isHome && 'text-primary-foreground',
            )}
          >
            <Link href={mailtoLink} className='no-underline'>
              Contact Us
            </Link>
          </span>

          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 focus:outline-none'
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='absolute top-16 left-0 w-full bg-primary-foreground md:hidden'
              >
                <div className='px-4 pt-2 pb-4 space-y-2'>
                  <Link
                    href='/about'
                    className={cn(
                      'block py-2 hover:bg-accent',
                      !isHome && 'text-primary-foreground',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href='/services'
                    className={cn(
                      'block py-2 hover:bg-accent',
                      !isHome && 'text-primary-foreground',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    href='/team'
                    className={cn(
                      'block py-2 hover:bg-accent',
                      !isHome && 'text-primary-foreground',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Our Team
                  </Link>

                  {scrollSections.map((section) => (
                    <Link
                      key={section.id}
                      href={isHome ? section.href : '/'}
                      className={cn(
                        'block py-2 hover:bg-accent',
                        !isHome && 'text-primary-foreground',
                      )}
                      onClick={(e) => {
                        if (isHome) {
                          handleSectionClick(e, section.id);
                          setIsMenuOpen(false);
                        } else {
                          handleExternalSectionClick(e, section.id);
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {section.title}
                    </Link>
                  ))}

                  <Link
                    href='/contact'
                    className={cn(
                      'block py-2 hover:bg-accent',
                      !isHome && 'text-primary-foreground',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
