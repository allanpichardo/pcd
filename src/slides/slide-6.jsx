import machinegaze from "../images/face.mp4";
import collage from "../images/instagram-CfDpLXnFLkm.mp4";
import cppnSketch from "../sketches/cppn.js";

export default {
    id: 'slide-6',
    label: 'Machine Gaze',
    // sketch: cppnSketch,
    items: [
        {
            id: 'title',
            gridArea: '1 / 1 / 2 / 12',
            className: '',
            component: <h1>training 🏋</h1>,
        },
        {
            id: 'collages',
            gridArea: '1 / 2 / 7 / 5',
            className: 'lightbox',
            component: (
                <video src={collage} autoPlay={true} loop={true} muted={true} />
            ),
        },
        {
            id: 'arrow',
            gridArea: '1 / 6 / 7 / 7',
            style: {alignSelf: 'center', justifySelf: 'center'},
            component: (
                <h1 style={{zIndex: 3}}>➡</h1>
            ),
        },
        {
            id: 'gaze',
            gridArea: '1 / 7 / 7 / 13',
            className: 'lightbox',
            component: (
                <video src={machinegaze} autoPlay={true} loop={true} muted={true} />
            ),
        },
    ],
}