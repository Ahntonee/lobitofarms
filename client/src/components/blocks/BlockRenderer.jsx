import HeroBlock from './HeroBlock';
import StatCountersBlock from './StatCountersBlock';
import CardGridBlock from './CardGridBlock';
import TestimonialCarouselBlock from './TestimonialCarouselBlock';
import CtaBannerBlock from './CtaBannerBlock';
import TextImageBlock from './TextImageBlock';
import GalleryGridBlock from './GalleryGridBlock';

export const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  stat_counters: StatCountersBlock,
  card_grid: CardGridBlock,
  testimonial_carousel: TestimonialCarouselBlock,
  cta_banner: CtaBannerBlock,
  text_image: TextImageBlock,
  gallery_grid: GalleryGridBlock,
};

export const BLOCK_TYPES = Object.keys(BLOCK_COMPONENTS);

export default function BlockRenderer({ blocks = [] }) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map((block) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block._id || block.order} config={block.config} />;
      })}
    </>
  );
}
