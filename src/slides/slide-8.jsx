import ffaf from '../images/ffaf.mp4';

export default {
    id: 'slide-8',
    label: 'Machine Gaze',
    // sketch: cppnSketch,
    items: [
        {
            id: 'title',
            gridArea: '1 / 1 / 2 / 12',
            className: '',
            style: {zIndex: 2},
            component: <h1>🌹 shader</h1>,
        },
        {
            id: 'collages',
            gridArea: '1 / 1 / 7 / 13',
            className: 'lightbox',
            component: (
                <video src={ffaf} autoPlay={true} loop={true} muted={true} />
            ),
        },
    ],
}