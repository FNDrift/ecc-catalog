export function ShopHeader({ shop, searchQuery, onSearchChange }) {
    return (
        <header className="site-header">
            <div className="brand">
                <p className="brand-subtitle">{shop.subtitle || ''}</p>
                <h1 className="brand-title">{shop.name || 'ECC'}</h1>
                <p className="brand-tagline">{shop.tagline || ''}</p>
            </div>
            <div className="header-tools">
                <input
                    type="search"
                    className="input search-input"
                    placeholder="Search vehicles..."
                    autoComplete="off"
                    aria-label="Search vehicles"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </header>
    );
}
