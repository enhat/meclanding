"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import config from "@/config/team-config.json";

export default function Team() {
  return (
    <>
      <div className="bg-primary-foreground h-full w-full p-8 md:px-20 pb-0 pt-24 md:pb-24 2xl:px-56 flex flex-col justify-center">
        <div>
          <div className="flex flex-col w-full">
            <span className={config.styling.heroTextClasses.heading}>
              {config.hero.heading}
            </span>
          </div>
          <AnimatedTestimonials testimonials={config.testimonials} />
        </div>
      </div>
    </>
  );
}
