import cppnStudies from "../images/cppn-studies-1.jpg";
import machinegaze from "../images/face.mp4";

export default {
    id: 'slide-6',
    label: 'Machine Gaze',
    items: [
        {
            id: 'face',
            gridArea: '1 / 1 / 7 / 13',
            className: 'lightbox',
            component: (
                <video src={machinegaze} autoPlay={true} loop={true} muted={true} />
            ),
        },
    ],
}