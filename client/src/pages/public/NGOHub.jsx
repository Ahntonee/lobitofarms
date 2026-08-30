import usePageBySlug from '../../hooks/usePageBySlug';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function NGOHub() {
  const { page, error, reload } = usePageBySlug('ngo');

  if (error) return <ErrorState message="Could not load this page." onRetry={reload} />;
  if (!page) return <LoadingState />;

  return <BlockRenderer blocks={page.blocks} />;
}
