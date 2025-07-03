"use client";
import { Button } from "@/components/ui/button";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";
import {
  BatteryCharging,
  Lightbulb,
  MessageSquareQuote,
  Zap,
} from "lucide-react";
import TextReveal from "@/components/text-reveal";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();

  const pic1RawX = useTransform(scrollY, [-20, 500], [0, 550]);
  const pic2RawX = useTransform(scrollY, [-20, 500], [0, 720]);

  const pic1X = useSpring(pic1RawX, { damping: 20, stiffness: 80 });
  const pic2X = useSpring(pic2RawX, { damping: 20, stiffness: 80 });

  const features = [
    {
      icon: Lightbulb,
      title: "Expert-Led Solutions",
      description:
        "We bring over 30 years of hands-on electrochemical expertise to tackle complex challenges with precision and insight.",
    },
    {
      icon: Zap,
      title: "From Idea to Impact",
      description:
        "Whether you’re in early-stage R&D or scaling to production, we accelerate innovation into real-world energy solutions.",
    },
    {
      icon: BatteryCharging,
      title: "Efficient and Sustainable",
      description:
        "Our strategies focus on reducing costs, boosting energy performance, and promoting environmental responsibility.",
    },
    {
      icon: MessageSquareQuote,
      title: "Clear, Collaborative Consulting",
      description:
        "We work side-by-side with you to ensure every solution is transparent, tailored, and technically sound.",
      tooltip: true,
    },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ensureVideoPlays = async () => {
      try {
        if (video.readyState >= 2) {
          await video.play();
        } else {
          video.addEventListener(
            "canplay",
            async () => {
              try {
                await video.play();
              } catch (error) {
                console.log("Video play failed:", error);
              }
            },
            { once: true },
          );
        }
      } catch (error) {
        console.log("Video play failed:", error);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        ensureVideoPlays();
      }
    };

    const handleFocus = () => {
      if (video.paused) {
        ensureVideoPlays();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video.paused) {
            ensureVideoPlays();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (video) {
      observer.observe(video);
    }

    const timer = setTimeout(ensureVideoPlays, 100);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const textItems = [
    {
      text: "Madden Electrochemical Consulting drives invention and innovation from early-stage R&D to scale-up and production. Our dedicated team of consultants have over thirty years of experience that we leverage to tackle technical challenges for our clients with efficient and cost-effective solutions.",
    },
  ];

  return (
    <div className="w-full h-full" ref={containerRef}>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/dither.webm" type="video/webm" />
            <source src="/dither.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="0,45 100,25 100,100 0,100"
              className="fill-primary-foreground 2xl:hidden"
            />
            <polygon
              points="0,62 100,25 100,100 0,100"
              className="fill-primary-foreground hidden 2xl:block"
            />
          </svg>
        </div>

        <div className="w-full h-screen z-20 flex">
          <div className="2xl:w-1/2 w-full h-full flex flex-col absolute left-0 2xl:pl-56 2xl:pr-16 md:px-20 px-8 md:p-56 2xl:justify-normal justify-center items-center 2xl:items-normal 2xl:pt-44">
            <div className="flex flex-col gap-10  2xl:w-full xl:w-3/4 sm:w-4/5 2xl:h-min">
              <TextGenerateEffect
                className="2xl:text-9xl xl:text-7xl md:text-6xl sm:text-5xl text-4xl text-primary-foreground font-outline font-bold text-center 2xl:text-left"
                words="Turn your ideas into reality."
              />
              <TextGenerateEffect
                className="text-primary 2xl:text-2xl xl:text-lg lg:text-md text-sm leading-relaxed 2xl:text-left text-center 2xl:p-0"
                words="Madden Electrochemical Consulting helps inventors turn ideas into sustainable energy solutions, from R&D to production, with expert electrochemistry and recycling strategies."
                duration={0.25}
                staggerDur={0.05}
              />
              <HoverAnimatedButton />
            </div>

            <TooltipProvider>
              <div className="grid grid-cols-4 sm:grid-cols-4 md:gap-20 gap-8 bottom-0 absolute pb-10 md:pb-20 2xl:pb-10">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Tooltip key={idx}>
                      <div>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center text-center w-20">
                            <Icon className="text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {feature.title}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{feature.description}</p>
                        </TooltipContent>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
          <div className="w-1/2 h-screen absolute right-0 z-40 2xl:flex items-center justify-center hidden">
            <motion.div
              className="absolute"
              style={{ top: "22%", right: "25%" }}
              initial={{ x: -20, filter: "blur(10px)", opacity: 0 }}
              animate={{ x: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            >
              <motion.div style={{ x: pic1X }}>
                <Image
                  src="/Picture1.jpg"
                  alt="pic"
                  width={325}
                  height={325}
                  className="rounded-xl border-secondary-foreground shadow-2xl"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute"
              style={{ top: "35%", right: "40%" }}
              initial={{ x: -20, filter: "blur(10px)", opacity: 0 }}
              animate={{ x: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.div style={{ x: pic2X }}>
                <Image
                  src="/Picture2.jpg"
                  alt="pic2"
                  width={350}
                  height={350}
                  className="rounded-xl border-secondary-foreground shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="h-full py-20 w-full bg-primary-foreground 2xl:px-56 md:px-20 px-8 flex flex-col justify-center"
        id="services-section"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Our Services
        </h2>
        <p className="text-secondary-foreground text-lg mb-10 lg:w-1/2">
          Efficient. Impactful. Sustainable. We optimize energy, cut carbon, and
          drive independence for a greener future.
        </p>
        <ProjectsGrid />
      </section>

      <section
        className="h-full py-20 w-full bg-primary-foreground gap-20 md:px-20 px-8 2xl:px-96 flex flex-col justify-center"
        id="mission-section"
        style={{ position: "relative" }}
      >
        <TextReveal
          textItems={textItems}
          pixelsPerWord={8}
          revealOffset={240}
          className="text-2xl md:text-4xl lg:text-5xl leading-loose md:leading-relaxed"
        />
        <TextReveal
          textItems={[
            {
              text: "Contact Us",
              contact: true,
              mailto: "example@email.com",
            },
          ]}
          revealOffset={400}
          className="text-2xl md:text-4xl lg:text-5xl"
        />
      </section>
    </div>
  );
}

const HoverAnimatedButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        pathLength: { duration: 0.2 },
      },
    },
  };

  return (
    <Button
      size="lg"
      className="relative overflow-hidden bg-muted shadow-md hover:shadow-lg transition duration-200 hover:bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleScroll}
    >
      <div className="flex items-center">
        <span>Explore our solutions!</span>
        <motion.div
          initial={{ width: 0, marginLeft: 0 }}
          animate={{
            width: isHovered ? "24px" : 0,
            marginLeft: isHovered ? "8px" : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute top-1/2 -translate-y-1/2"
        style={{ right: "16px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.path
          d="M12 5v14"
          variants={pathVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        />
        <motion.path
          d="m19 12-7 7-7-7"
          variants={pathVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        />
      </motion.svg>
    </Button>
  );
};

function ProjectsGrid() {
  const projects = [
    {
      key: "makerspace",
      title: "Makerspace",
      icon: Lightbulb,
      description: "Explore the endless capabilities of our workshops.",
      img: "/makerspace.png",
      href: "/makerspace",
    },
    {
      key: "wcet",
      title: "Washington Clean Energy Testbeds",
      icon: Zap,
      description: "We collaborate with WCET to create better products.",
      img: "/WCET.png",
      href: "https://www.wcet.washington.edu/",
    },
    {
      key: "consulting",
      title: "Consulting",
      icon: MessageSquareQuote,
      description: "We can help you find the most effective solution for you.",
      img: "/consulting.png",
      href: "/consulting",
    },
    {
      key: "other",
      title: "Other Projects",
      icon: BatteryCharging,
      description: "Batteries, Solar, Fuel Cells, and more!",
      img: "/other.png",
      href: "https://www.coolamps.tech/about",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
      {projects.map((project) => {
        const spanClass =
          project.key === "makerspace" || project.key === "other"
            ? "md:col-span-2"
            : "md:col-span-1";
        const commonClasses = `${spanClass} group block p-6 rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`;

        // Determine wrapper component and props
        const Wrapper = project.href.startsWith("http") ? "a" : Link;
        const wrapperProps = project.href.startsWith("http")
          ? {
              href: project.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: commonClasses,
            }
          : { href: project.href, className: commonClasses };

        return (
          <Wrapper key={project.key} {...wrapperProps}>
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-primary-foreground-foreground bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 group-hover:scale-101 transition-transform duration-300">
              <Image
                src={project.img}
                alt={`${project.title} image`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <project.icon className="h-4 w-4 text-neutral-500 group-hover:text-primary transition-colors duration-300" />
                <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
