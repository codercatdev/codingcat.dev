import Image from 'next/image';
import { Media, MediaType } from '@/models/media.model';

export default function MediaGrid({
  medias,
}: {
  medias: Media[];
}): JSX.Element {
  const videoLoader = ({ src }: { src: string }) => {
    return src;
  };
  return (
    <section className="grid content-start w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit">
      {medias && medias.length > 0 ? (
        <>
          {medias.map((m) => (
            <>
              {m.type == MediaType.photo &&
                m.cloudinary &&
                m.cloudinary.path &&
                m.cloudinary.height &&
                m.cloudinary.width && (
                  <div key={m.id} className="w-full max-w-md">
                    {
                      <Image
                        src={m.cloudinary?.path}
                        alt={m.cloudinary?.original_filename}
                        width={m.cloudinary?.width}
                        height={m.cloudinary?.height}
                        layout="responsive"
                        className=""
                      />
                    }
                  </div>
                )}
              {m.type == MediaType.video &&
                m.cloudinary &&
                m.cloudinary.thumbnail_url &&
                m.cloudinary.height &&
                m.cloudinary.width && (
                  <div key={m.id} className="w-full max-w-md">
                    {
                      <Image
                        loader={({ src }) =>
                          src.replace('/c_limit,h_60,w_90', '')
                        }
                        src={m.cloudinary?.thumbnail_url}
                        alt={m.cloudinary?.original_filename}
                        width={m.cloudinary?.width}
                        height={m.cloudinary?.height}
                        layout="responsive"
                        className=""
                      />
                    }
                  </div>
                )}
              {m.type == MediaType.video && m.video && (
                <div key={m.id} className="w-full max-w-md">
                  {
                    <Image
                      loader={videoLoader}
                      src={`https://img.youtube.com/vi/${m.video.url.replace(
                        'https://youtu.be/',
                        ''
                      )}/0.jpg`}
                      alt={m.video.url}
                      width="1920"
                      height="1080"
                      layout="responsive"
                      className=""
                      unoptimized
                    />
                  }
                </div>
              )}
            </>
          ))}
        </>
      ) : (
        <>No Media yet.</>
      )}
    </section>
  );
}
