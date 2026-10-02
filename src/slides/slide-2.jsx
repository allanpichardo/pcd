import cppnSketch from "../sketches/cppn.js";

export default {
    id: 'slide-2',
    label: 'f(g(h(x, y, z))) = 🔥',
    sketch: cppnSketch,
    items: [
        {
            id: 'title',
            gridArea: '1 / 1 / 2 / 12',
            className: '',
            component: <h1>f(g(h(x, y, z))) = 🔥</h1>,
        },
        {
            id: 'subtitle',
            gridArea: '3 / 1 / 7 / 6',
            className: '',
            component: (
                <p>
                    A <strong>C</strong>ompositional <strong>P</strong>attern-<strong>P</strong>roducing <strong>N</strong>etwork
                    is an artificial neural network that maps coordinates (x,y,z) into pixel colors or geometric patterns.
                </p>
            ),
        },
    ],
}