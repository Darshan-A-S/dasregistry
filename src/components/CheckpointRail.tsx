export interface CheckpointItem {
  id: string;
  label: string;
}

export interface CheckpointRailProps {
  items?: CheckpointItem[];
  currentId?: string;
  onSelect?: (id: string) => void;
}

export function CheckpointRail({ items = [], currentId, onSelect }: CheckpointRailProps) {
  const gap = Math.max(1, 11 - items.length);
  return (
    <nav className="das-cp" style={{ gap }} aria-label="Chat checkpoints">
      {items.map((item) => {
        const current = item.id === currentId;
        return (
          <button
            key={item.id}
            type="button"
            className={["das-cp-btn", current && "das-cp-current"].filter(Boolean).join(" ")}
            aria-label={`Jump to ${item.label}`}
            aria-current={current ? "true" : undefined}
            onClick={() => onSelect?.(item.id)}
          >
            <span className="das-cp-line" aria-hidden="true" />
            <span className="das-cp-tip">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}