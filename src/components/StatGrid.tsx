type StatGridProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function StatGrid({ items }: StatGridProps) {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-card">
          <div className="stat-card__value">{item.value}</div>
          <div className="stat-card__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
