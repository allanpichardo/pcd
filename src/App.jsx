import { useEffect, useState } from 'react';
import Slide from './Slide.jsx';
import title from './slides/title.jsx';
import slide2 from './slides/slide-2.jsx';
import slide3 from './slides/slide-3.jsx';
import slide4 from './slides/slide-4.jsx';
import slide5 from "./slides/slide-5.jsx";
import slide6 from "./slides/slide-6.jsx";
import slide7 from './slides/slide-7.jsx';
import slide4a from "./slides/slide-4a.jsx";

const slides = [
    title,
    slide2,
    slide3,
    slide4a,
    slide4,
    slide5,
    slide6,
    slide7
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
