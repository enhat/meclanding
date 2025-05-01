"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Team() {
  return (
    <div className="bg-white h-screen w-full px-56 flex flex-col justify-center">
      <div>
        <div className="flex flex-col w-full">
          <span className="text-6xl font-bold text-primary-foreground mb-6">
            Meet the team
          </span>
          {
            // <span className="text-primary-foreground text-lg mt-10">
            //   Our team at Madden Electrochemical Consulting are certified experts
            //   with PHDs from the University of Washington ensures that you're in
            //   the right hands.
            // </span>
          }
        </div>
        <AnimatedTestimonials
          testimonials={[
            {
              quote:
                "Tom found Madden Electrochemical Consulting to drive inventions from dreams to reality. He is a recognized expert in electrochemistry, batteries and fuel cells and holds over 40 patents. He’s served as a consultant for both start-ups and publicly traded companies with a track record in driving novel solutions to market. In addition, Dr. Madden has held several chief officer positions for battery companies, leading manufacturing and recycling at-scale. He earned a PhD in chemical engineering from the University of Washington and received executive education from the Yale School of Management. Operating out of Connecticut, Tom leads our collaborations with MakerspaceCT.",

              name: "Dr. Thomas Madden",
              designation: "Founder & Chief Operating Officer",
              src: "https://images.squarespace-cdn.com/content/v1/615b391c1eb7d52501648d10/e8b3063c-3420-4679-a53c-145bf114fc6e/IMG_3519.jpg?format=1500w",
            },
            {
              quote:
                "Nick has a passion for green energy technologies with the potential to change to world. He is an expert in solar energy, nanotechnology, and batteries and holds several patents. He has served as a senior chemist, director of R&D, and CTO for several acquired startups and has experience working in academia and national laboratories. Nick has consultant on a range of projects including nanotechnology for COVID-19 detection, perovskite photovoltaics, and spectral downconversion for silicon PV modules. He earned his PhD in chemistry from Columbia University as an NSF Fellow studying quantum dot technology. Operating out of Seattle, WA, Nick leads our collaborations with the Washington Clean Energy Testbeds.",
              name: "Dr. Nicholas Anderson",
              designation: "Chief Technology Officer",
              src: "https://images.squarespace-cdn.com/content/v1/615b391c1eb7d52501648d10/18ef01ca-46b6-4721-add3-c07d9c2cc397/59AB4803-21EE-4D0A-B0E3-9004B111F1C1.JPG?format=1500w",
            },
          ]}
        />
      </div>
    </div>
  );
}
