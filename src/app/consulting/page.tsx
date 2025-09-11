import Image from "next/image";
import config from "@/config/consulting-config.json";

export default function Consulting() {
  return (
    <>
      <div className="bg-primary-foreground h-full w-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col w-full mb-12">
            <span className={config.styling.titleClasses}>
              {config.article.title}
            </span>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={config.article.mainImage.src}
                alt={config.article.mainImage.alt}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            {config.article.paragraphs.map((paragraph, index) => (
              <p key={index} className={config.styling.paragraphClasses}>
                {paragraph}
              </p>
            ))}
          </div>

          {config.article.additionalImages.length > 0 && (
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {config.article.additionalImages.map((image, index) => (
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
