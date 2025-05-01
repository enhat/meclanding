"use client";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";
import { Lightbulb, MessageSquareQuote, Zap } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import TextReveal from "@/components/text-reveal";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Offset by -20 to prevent jank on reload when scrolled
  const pic1RawX = useTransform(scrollY, [-20, 500], [0, 550]);
  const pic2RawX = useTransform(scrollY, [-20, 500], [0, 720]);

  const pic1X = useSpring(pic1RawX, { damping: 20, stiffness: 80 });
  const pic2X = useSpring(pic2RawX, { damping: 20, stiffness: 80 });

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
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/dither.webm" type="video/webm" />
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
              points="0,62 100,25 100,100 0,100"
              className="fill-primary"
            />
          </svg>
        </div>

        <div className="w-full h-screen z-20 flex">
          <div className="w-1/2 h-screen absolute left-0 flex flex-col pl-56 pr-16 gap-16 pt-44 ">
            <TextGenerateEffect
              className="text-9xl text-primary font-outline font-bold"
              words="Turn your ideas into reality"
            />
            <span className="text-muted text-2xl leading-relaxed">
              Madden Electrochemical Consulting helps innovators turn ideas into
              sustainable energy solutions, from R&D to production, with expert
              electrochemistry and recycling strategies.
            </span>
            <HoverAnimatedButton />
          </div>

          <div className="w-1/2 h-screen absolute right-0 z-40 flex items-center justify-center">
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
                  className="rounded-xl border border-primary-foreground"
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
                  className="rounded-xl border border-primary-foreground"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="h-screen w-full bg-primary px-56 flex flex-col justify-center"
        id="services-section"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
          Our Services
        </h2>
        <p className="text-primary-foreground text-lg mb-10 md:w-1/2">
          Efficient. Impactful. Sustainable. We optimize energy, cut carbon, and
          drive independence for a greener future.
        </p>
        <ProjectsGrid />
      </section>

      <section
        className="h-screen w-full bg-primary gap-20 px-96 flex flex-col justify-center"
        style={{ position: "relative" }}
      >
        <TextReveal textItems={textItems} pixelsPerWord={10} revealOffset={0} />
        <TextReveal
          textItems={[
            {
              text: "Contact Us",
              contact: true,
              mailto: "example@email.com",
            },
          ]}
          revealOffset={170}
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
      className="relative overflow-hidden"
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
      title: "Makerspace",
      description: "Explore the endless capabilities of our workshops.",
      header: <Skeleton />,
      icon: <Lightbulb className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Washington Clean Energey Testbeds",
      description: "We collaborate with WCET to create better products.",
      header: <Skeleton />,
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Consulting",
      description: "We can help you find the most effective solution for you.",
      header: <Skeleton />,
      icon: <MessageSquareQuote className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Other Projects",
      description: "Batteries, Solar, Fuel Cells, and more!",
      header: <Skeleton />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-battery-charging-icon lucide-battery-charging h-4 w-4 text-neutral-500"
        >
          <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
          <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" />
          <path d="m11 7-3 5h4l-3 5" />
          <line x1="22" x2="22" y1="11" y2="13" />
        </svg>
      ),
    },
  ];

  return (
    <BentoGrid className="m-0">
      {projects.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 0 || i === 3 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
