import { useEffect, useMemo, useState } from 'react';
import { KitPreview } from './components/KitPreview.jsx';
import { ShopHeader } from './components/ShopHeader.jsx';
import { VehicleRail } from './components/VehicleRail.jsx';
import { formatPrice, useCatalog, vehicleSearchText } from './hooks/useCatalog.js';

export default function App() {
    const { catalog, loadError, selectedVehicleId, setSelectedVehicleId, variationIndex, setVariationIndex } = useCatalog();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVehicles = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return catalog.vehicles;
        return catalog.vehicles.filter((v) => vehicleSearchText(v).includes(q));
    }, [catalog.vehicles, searchQuery]);

    useEffect(() => {
        if (filteredVehicles.length === 0) return;
        const exists = filteredVehicles.some((v) => v.id === selectedVehicleId);
        if (!exists) {
            setSelectedVehicleId(filteredVehicles[0].id);
            setVariationIndex(0);
        }
    }, [filteredVehicles, selectedVehicleId, setSelectedVehicleId, setVariationIndex]);

    const selectedVehicle = useMemo(
        () => catalog.vehicles.find((v) => v.id === selectedVehicleId) || null,
        [catalog.vehicles, selectedVehicleId]
    );

    useEffect(() => {
        if (!selectedVehicle?.variations?.length) return;
        if (variationIndex >= selectedVehicle.variations.length) {
            setVariationIndex(0);
        }
    }, [selectedVehicle, variationIndex, setVariationIndex]);

    function handleSelectVehicle(id) {
        setSelectedVehicleId(id);
        setVariationIndex(0);
    }

    const variation = selectedVehicle?.variations?.[variationIndex];
    const hasVariations = Boolean(selectedVehicle?.variations?.length);

    return (
        <div className="page">
            <ShopHeader shop={catalog.shop} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="layout">
                <VehicleRail vehicles={filteredVehicles} selectedId={selectedVehicleId} onSelect={handleSelectVehicle} />
                <main className="detail-panel">
                    {loadError ? (
                        <div className="detail-empty">
                            <p>Catalog could not be loaded.</p>
                        </div>
                    ) : !selectedVehicle && catalog.vehicles.length === 0 ? (
                        <div className="detail-empty">
                            <p>No vehicles in catalog.</p>
                        </div>
                    ) : !selectedVehicle ? (
                        <div className="detail-empty">
                            <p>Select a vehicle to preview conversion kits.</p>
                        </div>
                    ) : !hasVariations ? (
                        <div className="detail-content">
                            <div className="detail-header">
                                <div className="detail-header-main">
                                    <p className="vehicle-make">{selectedVehicle.make || ''}</p>
                                    <h2 className="vehicle-model">{selectedVehicle.model}</h2>
                                    <p className="vehicle-desc">{selectedVehicle.description || ''}</p>
                                </div>
                            </div>
                            <div className="preview-block">
                                <div className="preview-frame">
                                    <div className="preview-placeholder">No kit options yet</div>
                                </div>
                                <div className="preview-meta">
                                    <h3 className="variation-title">No kits listed</h3>
                                    <p className="variation-desc">Add variations for this vehicle in public/data/kits.json.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="detail-content">
                            <div className="detail-header">
                                <div className="detail-header-main">
                                    <p className="vehicle-make">{selectedVehicle.make || ''}</p>
                                    <h2 className="vehicle-model">{selectedVehicle.model}</h2>
                                    <p className="vehicle-desc">{selectedVehicle.description || ''}</p>
                                </div>
                                {variation ? (
                                    <div className="detail-header-aside">
                                        <span className="header-kit-label">Selected kit</span>
                                        <div className="header-kit-row">
                                            <h3 className="header-kit-title">{variation.name}</h3>
                                            {variation.price !== undefined && variation.price !== null && variation.price !== '' ? (
                                                <span className="price-pill">{formatPrice(variation.price)}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="variation-section">
                                <span className="label">Kit options</span>
                                <div className="tab-bar" role="tablist">
                                    {selectedVehicle.variations.map((varn, index) => (
                                        <button
                                            key={varn.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={index === variationIndex}
                                            className={'tab-btn' + (index === variationIndex ? ' active' : '')}
                                            onClick={() => setVariationIndex(index)}
                                        >
                                            {varn.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {variation ? <KitPreview vehicle={selectedVehicle} variation={variation} /> : null}
                        </div>
                    )}
                </main>
            </div>
            <p className={'load-error' + (loadError ? '' : ' hidden')}>
                Could not load catalog. Check that data/kits.json is available in public/data after build.
            </p>
        </div>
    );
}
