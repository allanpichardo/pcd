import { useEffect, useId, useRef } from 'react';
import p5 from 'p5';

export default function Slide({ title, author, sketch }) {
  const sketchContainer = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!sketch) return;

    const instance = new p5(sketch, sketchContainer.current);
    return () => instance.remove();
  }, [sketch]);

  return (
    <section className="slide" aria-labelledby={titleId}>
      <div className="slide__sketch" ref={sketchContainer} aria-hidden="true" />
      <div className="slide__overlay" aria-hidden="true" />
      <h1 className="slide__title" id={titleId}>{title}</h1>
      {author && <p className="slide__author">{author}</p>}
    </section>
  );
}
