export function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">⌕</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children && <div className="empty-actions">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty-state error-state" role="alert">
      <h3>مشکلی پیش آمد</h3>
      <p>{message || 'دریافت اطلاعات انجام نشد.'}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          تلاش دوباره
        </button>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-media" />
      <div className="card-body">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
      </div>
    </div>
  );
}
