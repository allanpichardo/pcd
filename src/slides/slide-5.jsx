import cppnSketch from "../sketches/cppn.js";
import cppnStudies from "../images/cppn-studies-1.jpg";

export default {
    id: 'slide-5',
    label: 'CPPN Studies',
    // sketch: cppnSketch,
    items: [
        {
            id: 'sketch',
            gridArea: '1 / 1 / 7 / 13',
            className: 'lightbox',
            component: (
                <img src={cppnStudies} />
            ),
        },
    ],
}