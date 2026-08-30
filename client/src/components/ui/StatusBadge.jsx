const LABELS = {
  draft: 'Draft',
  in_review: 'In Review',
  published: 'Published',
  archived: 'Archived',
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status} text-uppercase`} style={{ fontSize: '0.7rem' }}>{LABELS[status] || status}</span>;
}
