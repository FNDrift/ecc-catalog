import { useEffect, useState } from 'react';

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
            <div className="preview-meta">
                <p className="variation-desc">{variation?.description || ''}</p>
                <ul className="highlight-list">
                    {(variation?.highlights || []).map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            </div>
            <div className="preview-frame">
                {showImage ? (
                    <img
                        className="preview-image"
                        src={src}
                        alt={vehicle ? `${vehicle.model} - ${variation.name}` : ''}
                        onError={() => setImageBroken(true)}
                    />
                ) : null}
                <div className={'preview-placeholder' + (showImage ? ' hidden' : '')}>{placeholderText}</div>
            </div>
        </div>
    );
}
