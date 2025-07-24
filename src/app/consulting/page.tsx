import Image from "next/image";

export default function Makerspace() {
  const articleData = {
    title: "Welcome to Our Consulting Services",
    mainImage: {
      src: "/consulting.png",
      alt: "Makerspace workspace with tools and equipment",
    },
    paragraphs: [
      "Our makerspace is a collaborative workspace where creativity meets technology. We provide access to tools, equipment, and expertise that enable individuals and teams to design, prototype, and create innovative solutions.",
      "Whether you're working on electronics, woodworking, 3D printing, or software development, our facility offers the resources you need to bring your ideas to life. Our community of makers, entrepreneurs, and innovators creates an environment of learning and collaboration.",
      "We believe in the power of hands-on learning and making. Our space is equipped with state-of-the-art tools including laser cutters, 3D printers, electronics workbenches, and traditional woodworking equipment. Members have access to training programs and workshops to develop their skills.",
      "Join our community of creators and turn your ideas into reality. From rapid prototyping to small-scale manufacturing, we support projects at every stage of development. Our expert staff and experienced members are always ready to help with technical challenges and creative problem-solving.",
    ],
    additionalImages: [
      { src: "/makerspace.png", alt: "tools" },
      { src: "/Picture1.jpg", alt: "test" },
    ],
  };

  return (
    <>
      <div className="bg-primary-foreground h-full w-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col w-full mb-12">
            <span className="text-6xl font-bold text-primary mb-6">
              {articleData.title}
            </span>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={articleData.mainImage.src}
                alt={articleData.mainImage.alt}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            {articleData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-primary text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {articleData.additionalImages.length > 0 && (
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articleData.additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
