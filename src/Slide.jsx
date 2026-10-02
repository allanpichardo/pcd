import { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function Slide({ label, items = [], sketch, overlayOpacity = 0.4 }) {
  const sketchContainer = useRef(null);

  useEffect(() => {
    if (!sketch) return;

    const instance = new p5(sketch, sketchContainer.current);
    return () => instance.remove();
  }, [sketch]);

  return (
    <section className="slide" aria-label={label}>
      <div className="slide__sketch" ref={sketchContainer} aria-hidden="true" />
      <div className="slide__overlay" style={{ opacity: overlayOpacity }} aria-hidden="true" />
      {items.map(({ id, gridArea, component, className, style }) => (
        <div
          key={id}
          className={['slide__item', className].filter(Boolean).join(' ')}
          style={{ ...style, gridArea }}
        >
          {component}
        </div>
      ))}
    </section>
  );
}
