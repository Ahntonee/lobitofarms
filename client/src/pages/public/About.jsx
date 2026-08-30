import usePageBySlug from '../../hooks/usePageBySlug';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import PageHeader from '../../components/ui/PageHeader';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function About() {
  const { page, error, reload } = usePageBySlug('about');

  if (error) return <ErrorState message="Could not load this page." onRetry={reload} />;
  if (!page) return <LoadingState />;

  return (
    <>
      <PageHeader eyebrow="Our Story" title={page.title} />
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
