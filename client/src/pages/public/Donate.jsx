import BlockRenderer from '../../components/blocks/BlockRenderer';
import usePageBySlug from '../../hooks/usePageBySlug';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function Donate() {
  const { page, error, reload } = usePageBySlug('ngo-donate');

  if (error) return <ErrorState message="Could not load this page." onRetry={reload} />;
  if (!page) return <LoadingState />;

  return <BlockRenderer blocks={page.blocks} />;
}
