import qrCode from '../images/qrcode.png';
import cppnSketch from "../sketches/cppn.js";

export default {
    id: 'slide-4a',
    label: 'Sketch Code',
    sketch: cppnSketch,
    items: [
        {
            id: 'title',
            gridArea: '1 / 1 / 2 / 12',
            className: '',
            component: <h1>sketch</h1>,
        },
        {
            id: 'sketch',
            gridArea: '1 / 1 / 7 / 13',
            className: 'lightbox',
            component: (
                <img src={qrCode} />
            ),
        },
    ],
}