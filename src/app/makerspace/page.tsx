import Image from "next/image";

export default function Makerspace() {
  return (
    <>
      <section className="w-full h-full bg-primary-foreground">
        <div className="h-screen w-full flex flex-col items-center p-20">
          <div className="relative w-1/2 h-3/4 overflow-hidden rounded-lg">
            <Image
              src="/makerspace.png"
              alt="makerspace image"
              fill // makes the image absolutely‐positioned to fill the parent
              className="object-cover object-center"
              priority // optional: for critical images
            />
          </div>
          <div className="relative w-1/2 h-3/4 text-primary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            ullamcorper sollicitudin orci, eget porttitor elit fringilla a.
            Suspendisse iaculis cursus lorem sed finibus. Vestibulum lorem nisl,
            mollis at mi at, congue blandit massa. Class aptent taciti sociosqu
            ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam
            hendrerit ipsum id risus consectetur sodales. Phasellus dui tellus,
            dictum id enim ac, ultricies sodales nulla. Suspendisse accumsan
            ligula et nibh suscipit, eu ultricies ipsum consectetur. In
            vestibulum, nisi a lobortis ornare, enim lacus ullamcorper metus, a
            pretium massa sem sed lorem. Praesent quam nunc, volutpat sed
            viverra eget, sagittis ac metus. Curabitur molestie consectetur
            accumsan. Proin ut erat non augue dapibus lobortis. Curabitur
            efficitur sed nisi at sollicitudin. Curabitur a semper orci. Nunc
            sit amet rutrum ex, iaculis malesuada nulla. Nam vel metus vel
            tortor placerat elementum. Sed vitae varius nunc. Nullam at justo
            dignissim, pellentesque augue in, varius eros. Phasellus lacus
            turpis, semper eget dui in, feugiat vehicula dui. Aenean tincidunt
            at ipsum sit amet faucibus. Nunc viverra dapibus finibus. Phasellus
            laoreet lectus vitae arcu vehicula elementum. Integer efficitur
            viverra convallis. Ut in volutpat enim. Nam lacinia nisl quis enim
            viverra maximus. Donec id arcu hendrerit, tincidunt lorem in,
            vestibulum diam. Vivamus gravida metus eu libero hendrerit, nec
            vulputate quam sagittis. Ut mattis, augue non semper sodales, ante
            ligula efficitur odio, dictum tempus tellus nunc ac purus. Sed
            elementum scelerisque arcu ac imperdiet. Maecenas vitae mauris
            risus. Mauris pretium rhoncus odio, at varius nibh sodales non.
            Phasellus porttitor ultrices metus, et semper purus cursus ac. Ut a
            rutrum ex. Praesent in lectus metus. Praesent laoreet magna id
            sapien molestie fermentum. Duis vitae finibus nisi. Vestibulum ante
            ipsum primis in faucibus orci luctus et ultrices posuere cubilia
            curae; Duis eget pellentesque diam, sed scelerisque nibh. Nullam a
            pretium dolor, ut molestie eros. Ut sit amet lectus consectetur,
            vestibulum nibh vel, faucibus neque. Vivamus accumsan ante felis,
            non suscipit leo commodo faucibus. Aliquam sed sollicitudin tortor.
            Sed vel sapien suscipit, sollicitudin erat quis, dapibus lacus. Nam
            pharetra efficitur tellus et finibus. Pellentesque quis leo in magna
            tincidunt venenatis quis ac risus. Nam vel nulla ac erat ultricies
            malesuada. Suspendisse potenti. Sed malesuada, sem et tristique
            efficitur, mi nunc efficitur justo, feugiat finibus lorem tellus
            eget ligula. Quisque imperdiet hendrerit lacinia. Duis rutrum
            consectetur ligula non mattis. In et sapien metus. Aliquam quis
            massa elit. Mauris dignissim rhoncus interdum. Suspendisse ultricies
            molestie interdum. Integer mollis lobortis vulputate. Pellentesque
            eu lobortis sem. Sed a libero bibendum, dapibus dui eu, placerat
            dolor. Etiam non euismod lectus, eget lobortis purus. Nunc dapibus,
            purus congue vulputate scelerisque, justo nisl eleifend sapien, id
            consequat leo quam in neque. Phasellus eget ultrices eros.
          </div>
        </div>
      </section>
    </>
  );
}
