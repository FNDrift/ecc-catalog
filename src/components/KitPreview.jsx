import { useEffect, useState } from 'react';
import { formatPrice } from '../hooks/useCatalog.js';

export function KitPreview({ vehicle, variation }) {
    const [imageBroken, setImageBroken] = useState(false);
    const src = variation?.image || '';

    useEffect(() => {
        setImageBroken(false);
    }, [vehicle?.id, variation?.id, src]);

    const showImage = src && !imageBroken;
    const placeholderText = !src
        ? 'No image URL for this kit'
        : vehicle?.variations?.length === 0
          ? 'No kit options yet'
          : 'Image failed to load';

    return (
        <div className="preview-block">
            <div className="preview-frame">
                {showImage ? (
                    <img
                        className="preview-image"
                        src={src}
                        alt={vehicle ? `${vehicle.model} — ${variation.name}` : ''}
                        onError={() => setImageBroken(true)}
                    />
                ) : null}
                <div className={'preview-placeholder' + (showImage ? ' hidden' : '')}>{placeholderText}</div>
            </div>
            <div className="preview-meta">
                <div className="preview-title-row">
                    <h3 className="variation-title">{variation?.name}</h3>
                    {formatPrice(variation?.price) ? (
                        <span className="price-pill">{formatPrice(variation.price)}</span>
                    ) : null}
                </div>
                <p className="variation-desc">{variation?.description || ''}</p>
                <ul className="highlight-list">
                    {(variation?.highlights || []).map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
