# CPPN presentation

A client-rendered React presentation for Processing Community Day, built with Vite and p5.js.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm run build` to build into `dist/`, and `npm run preview` to view the production build locally.

## Slides

Add slide objects to the `slides` array in `src/App.jsx`. Each has a unique `id`, a `title`, an optional `author`, and an optional p5 instance-mode `sketch`.

Use the left and right arrow keys to move through the deck. Navigation stops at either end. With the initial single slide, both arrows keep the title slide on screen.

`src/Slide.jsx` owns the canvas and removes the p5 instance when a slide unmounts. `src/sketches/cppn.js` contains the supplied CPPN sketch, retaining the 100 × 100 canvas, random weights, activation functions, and animation timing. CSS stretches it across the viewport beneath an 80% black overlay.

Edit `src/styles.css` to change the title, author placement, or overlay.
