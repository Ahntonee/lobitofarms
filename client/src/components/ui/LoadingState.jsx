export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 text-muted-warm">
      <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="text-center py-5">
      <p className="text-danger mb-3">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-primary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="text-center py-5 text-muted-warm">
      <p className="mb-0">{message}</p>
    </div>
  );
}
