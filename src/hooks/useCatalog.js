import { useEffect, useState } from 'react';

const imageModules = import.meta.glob('../images/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    import: 'default'
});

const imageUrlByName = Object.fromEntries(
    Object.entries(imageModules).flatMap(([path, url]) => {
        const fileName = path.split('/').pop() || '';
        const stem = fileName.replace(/\.[^.]+$/, '');
        return [
            [stem, url],
            [stem.toLowerCase(), url]
        ];
    })
);

function resolveImage(src) {
    const key = String(src || '').trim();
    if (!key) return '';
    return imageUrlByName[key] || imageUrlByName[key.toLowerCase()] || key;
}

function normalizeVehicle(raw) {
    const id = String(raw.id || '').trim();
    const variations = Array.isArray(raw.variations) ? raw.variations : [];
    return {
        id,
        make: raw.make != null ? String(raw.make) : '',
        model: raw.model != null ? String(raw.model) : id,
        description: raw.description != null ? String(raw.description) : '',
        variations: variations.map((v, i) => ({
            id: String(v.id || 'var-' + i),
            name: v.name != null ? String(v.name) : 'Option ' + (i + 1),
            price: v.price,
            image: resolveImage(v.image),
            description: v.description != null ? String(v.description) : '',
            highlights: Array.isArray(v.highlights) ? v.highlights.map(String) : []
        }))
    };
}

function kitsJsonUrl() {
    const base = import.meta.env.BASE_URL || '/';
    const normalized = base.endsWith('/') ? base : base + '/';
    return normalized + 'data/kits.json';
}

export function formatPrice(value) {
    if (value === undefined || value === null || value === '') return '';
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return '$' + n.toLocaleString();
}

export function vehicleSearchText(v) {
    return [v.make, v.model, v.description, v.id, ...v.variations.map((x) => [x.name, x.description, x.id].join(' '))]
        .join(' ')
        .toLowerCase();
}

export function useCatalog() {
    const [catalog, setCatalog] = useState({ shop: {}, vehicles: [] });
    const [loadError, setLoadError] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [variationIndex, setVariationIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(kitsJsonUrl(), { cache: 'no-store' });
                if (!res.ok) throw new Error('bad status');
                const data = await res.json();
                const vehicles = Array.isArray(data.vehicles) ? data.vehicles.map(normalizeVehicle).filter((v) => v.id) : [];
                if (cancelled) return;
                setLoadError(false);
                setCatalog({
                    shop: data.shop && typeof data.shop === 'object' ? data.shop : {},
                    vehicles
                });
                if (vehicles.length > 0) {
                    setSelectedVehicleId(vehicles[0].id);
                    setVariationIndex(0);
                } else {
                    setSelectedVehicleId(null);
                }
            } catch {
                if (cancelled) return;
                setLoadError(true);
                setSelectedVehicleId(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return {
        catalog,
        loadError,
        selectedVehicleId,
        setSelectedVehicleId,
        variationIndex,
        setVariationIndex
    };
}
