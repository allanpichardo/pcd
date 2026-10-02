# CPPN presentation

A client-rendered React presentation for Processing Community Day, built with Vite and p5.js.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm run build` to build into `dist/`, and `npm run preview` to view the production build locally.

## Slides

Add slide objects to the `slides` array in `src/App.jsx`. Each has a unique `id`, an accessible `label`, and an `items` array. The slide fills the viewport with a fixed grid of 12 equal columns and 6 equal rows, with no outer padding or gaps.

Each item has a unique `id` within its slide, a CSS `gridArea` string, and a `component` containing a JSX element. Supply component props directly in JSX. Optional `className` and `style` apply to the item's wrapper for alignment, padding, and stacking. Content components control their own appearance.

```jsx
{
  id: 'functions',
  label: 'Composing functions',
  items: [
    {
      id: 'heading',
      gridArea: '1 / 2 / 2 / 12',
      style: { display: 'flex', alignItems: 'center' },
      component: <h2>Composing functions</h2>,
    },
    {
      id: 'explanation',
      gridArea: '2 / 2 / 6 / 7',
      style: { padding: '1rem' },
      component: <p>Each function transforms the previous function's output.</p>,
    },
    {
      id: 'diagram',
      gridArea: '2 / 8 / 6 / 12',
      style: { display: 'grid', placeItems: 'center' },
      component: <img src="/diagram.svg" alt="A chain of composed functions" />,
    },
  ],
}
```

The image URL above is an example; supply your own asset and size it within its component.

`gridArea` uses `row-start / column-start / row-end / column-end`. End lines are exclusive: `2 / 8 / 6 / 12` spans rows 2–5 and columns 8–11. Six rows have seven grid lines, and twelve columns have thirteen, so the complete grid spans `1 / 1 / 7 / 13`.

Items can overlap. Later items draw above earlier ones unless you set `style.zIndex`. An item's explicit `gridArea` takes precedence over `style.gridArea`. The grid keeps the same row and column counts at every viewport size; use responsive CSS within your components as needed.

Use the left and right arrow keys to move through the deck. Navigation stops at either end. With the initial single slide, both arrows keep the title slide on screen.

## Backgrounds

An optional slide-level `sketch` accepts a p5 instance-mode function, such as the imported `cppnSketch`. The canvas and black overlay fill the viewport beneath the grid items. `overlayOpacity` defaults to `0.4`; set it to `0` for an undimmed background.

`src/Slide.jsx` owns the canvas and removes the p5 instance when a slide unmounts. `src/sketches/cppn.js` contains the supplied CPPN sketch, retaining the 100 × 100 canvas, random weights, activation functions, and animation timing.

Edit `src/styles.css` to change typography or item classes. Change item `gridArea` values in `src/App.jsx` to rearrange content.
