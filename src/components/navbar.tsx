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

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    if (isMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    <>
      <nav
        className={cn(
          'left-0 w-full z-50 text-primary-foreground absolute top-0',
          !isHome && 'text-primary bg-primary-foreground static',
        )}
      >
        <div className='px-8 md:px-20 2xl:px-56 w-full h-20 md:h-28'>
          <div className='flex items-center justify-between h-full'>
            <Link
              href='/'
              className={cn(
                'text-3xl md:text-4xl font-bold text-primary-foreground',
                !isHome && 'text-primary',
              )}
            >
              mec
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:block'>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        'text-primary-foreground',
                        navigationMenuTriggerStyle(),
                        !isHome && 'text-primary',
                      )}
                    >
                      About
                    </NavigationMenuTrigger>
                    <AnimatePresence mode='wait'>
                      <NavigationMenuContent>
                        <ul className='grid gap-3 p-8 md:w-[350px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                          <li className='row-span-3'>
                            <NavigationMenuLink asChild>
                              <Link
                                href='/'
                                className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-8 no-underline outline-none focus:shadow-md'
                              >
                                <div className='mb-2 mt-4 text-lg font-medium'>
                                  MEC
                                </div>
                                <p className='text-sm leading-tight text-muted-foreground'>
                                  Efficient. Impactful. Sustainable. We optimize
                                  energy, cut carbon, and drive independence for
                                  a greener future.
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
                        'text-primary-foreground',
                        navigationMenuTriggerStyle(),
                        !isHome && 'text-primary',
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

            {/* Desktop Contact Link */}
            <span
              className={cn(
                'hidden md:block text-md font-bold leading-none text-primary-foreground',
                !isHome && 'text-primary',
              )}
            >
              <Link href={mailtoLink} className='no-underline'>
                Contact Us
              </Link>
            </span>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'p-2 focus:outline-none text-primary-foreground',
                  !isHome && 'text-primary',
                )}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='mobile-menu-container fixed inset-0 bg-white dark:bg-black z-50 md:hidden'
          >
            {/* Header with logo and close button on top of overlay */}
            <div className='absolute top-0 left-0 w-full z-10'>
              <div className='px-8 md:px-20 2xl:px-56 w-full h-20 md:h-28'>
                <div className='flex items-center justify-between h-full'>
                  <Link
                    href='/'
                    className='text-3xl md:text-4xl font-bold text-primary'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    mec
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className='p-2 focus:outline-none text-primary'
                    aria-label='Close menu'
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className='px-8 md:px-20 2xl:px-56 p-6'>
              {/* Menu Items */}
              <div className='space-y-6 mt-20 md:mt-28'>
                {/* About Section */}
                <div>
                  <h3 className='font-semibold text-lg text-primary mb-4'>
                    About
                  </h3>
                  <div className='space-y-3'>
                    <Link
                      href='/team'
                      className='block py-2 text-base hover:text-primary text-primary transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Who We Are
                    </Link>
                    {scrollSections.map((section) => (
                      <Link
                        key={section.id}
                        href={isHome ? section.href : '/'}
                        className='block py-2 text-base hover:text-primary text-primary transition-colors'
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
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h3 className='font-semibold text-lg text-primary mb-4'>
                    Services
                  </h3>
                  <div className='space-y-3'>
                    {components.map((component) => (
                      <Link
                        key={component.title}
                        href={component.href}
                        className='block py-2 text-base hover:text-primary text-primary transition-colors'
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {component.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Contact Section */}
                <div className='pt-6'>
                  <Link
                    href={mailtoLink}
                    className='block py-3 px-6 bg-primary text-primary-foreground rounded-full text-center font-medium hover:bg-primary/90 transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
