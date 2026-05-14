export function VehicleRail({ vehicles, selectedId, onSelect }) {
    return (
        <aside className="vehicle-rail" aria-label="Vehicle list">
            <div className="rail-head">
                <span className="label">Platforms</span>
            </div>
            <div className="vehicle-list">
                {vehicles.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        className={'vehicle-card' + (v.id === selectedId ? ' active' : '')}
                        onClick={() => onSelect(v.id)}
                    >
                        <span className="vehicle-card-make">{v.make || 'Vehicle'}</span>
                        <span className="vehicle-card-model">{v.model}</span>
                        <span className="vehicle-card-count">
                            {v.variations.length === 1 ? '1 kit option' : `${v.variations.length} kit options`}
                        </span>
                    </button>
                ))}
            </div>
            <p className={'empty-state' + (vehicles.length === 0 ? '' : ' hidden')}>No vehicles match your search.</p>
        </aside>
    );
}
