import qrCode from '../images/qrcode.png';

export default {
    id: 'slide-4a',
    label: 'Sketch Code',
    // sketch: cppnSketch,
    items: [
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