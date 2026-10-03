import PageHeader from '../ui/PageHeader';

export default function PageHeaderBlock({ config = {} }) {
  return <PageHeader eyebrow={config.eyebrow} title={config.title} subtitle={config.subtitle} />;
}
