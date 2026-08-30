import usePageBySlug from '../../hooks/usePageBySlug';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function Home() {
  const { page, error, reload } = usePageBySlug('home');

  if (error) return <ErrorState message="Could not load the home page content." onRetry={reload} />;
  if (!page) return <LoadingState label="Loading Lobito Farms…" />;

  return <BlockRenderer blocks={page.blocks} />;
}
