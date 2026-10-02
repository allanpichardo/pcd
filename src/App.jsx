import { useEffect, useState } from 'react';
import Slide from './Slide.jsx';
import cppnSketch from './sketches/cppn.js';

const slides = [
  {
    id: 'title',
    title: 'lorem ipsum',
    author: 'Allan Pichardo',
    sketch: cppnSketch,
  },
];

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        (event.target instanceof HTMLElement && (
          event.target.isContentEditable ||
          event.target.closest('input, textarea, select')
        ))
      ) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSlideIndex((index) => Math.min(index + 1, slides.length - 1));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSlideIndex((index) => Math.max(index - 1, 0));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[slideIndex];

  return (
    <main className="presentation" aria-live="polite" aria-atomic="true">
      <Slide key={slide.id} {...slide} />
    </main>
  );
}
