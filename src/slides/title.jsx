import cppnSketch from "../sketches/cppn.js";

export default {
    id: 'title',
    label: 'The ✨ of CPPNs',
    sketch: cppnSketch,
    items: [
        {
            id: 'heading',
            gridArea: '2 / 2 / 3 / 12',
            className: 'centered',
            component: <h1>The ✨ of CPPNs</h1>,
        },
        {
            id: 'subtitle',
            gridArea: '3 / 2 / 4 / 12',
            className: 'centered',
            component: (
                <h2>
                    How I learned to love composition of functions
                </h2>
            ),
        },
        {
            id: 'author',
            gridArea: '6 / 9 / 7 / 13',
            className: 'right',
            component: (
                <div>
                    <h3>Allan Pichardo</h3>
                    <p><a href="https://instagram.com/mylovemhz">@mylovemhz</a></p>
                </div>
            ),
        },
    ],
}