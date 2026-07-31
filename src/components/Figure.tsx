import Image from 'next/image';
import { basePath } from '@/lib/profile';

type Props = {
  /** Public path, e.g. /case-studies/ivory/feature3.webp — basePath applied here. */
  src: string;
  /** Descriptive alt text. Required: these images are evidence, and search
   *  engines and screen readers both need to know what they show. */
  alt: string;
  /** Visible caption under the image. */
  caption?: string;
  /** Aspect ratio of the frame, e.g. "16/10". Images are contained, never
   *  cropped, so a rough ratio is fine. */
  ratio?: string;
  /** Render two side by side on wide screens by wrapping in <FigureRow>. */
  compact?: boolean;
};

/**
 * A screenshot inside a case-study body — used to break the narrative up
 * topic by topic rather than leaning on a single hero image.
 */
export default function Figure({ src, alt, caption, ratio = '16/10', compact }: Props) {
  return (
    <figure className={`cs-figure${compact ? ' is-compact' : ''}`}>
      <div className="cs-figure-frame" style={{ aspectRatio: ratio }}>
        <Image
          src={`${basePath}${src}`}
          alt={alt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 44rem, 100vw"
          className="object-contain"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Puts two compact figures side by side on wider screens. */
export function FigureRow({ children }: { children: React.ReactNode }) {
  return <div className="cs-figure-row">{children}</div>;
}
