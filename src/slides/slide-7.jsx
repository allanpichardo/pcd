import FlowerGenerator from '../FlowerGenerator.jsx';

const t = '(x, y) ➡ (r, θ) = 🌸'

export default {
  id: 'slide-7',
  label: 'Flower Generator',
  items: [
    {
      id: 'title',
      gridArea: '1 / 1 / 2 / 12',
      className: '',
      component: <h1>{t}</h1>,
    },
    {
      id: 'flower',
      gridArea: '2 / 1 / 6 / 13',
      component: <FlowerGenerator />,
    },
  ],
};
