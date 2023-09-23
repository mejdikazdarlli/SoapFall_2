import { CARviewer} from './MKViewer.js';
import { TWEEN } from './THREE/tween.module.min.js';
function _(elm){return document.getElementById(elm)}
let Viewer = new CARviewer(elm)
Viewer.initScene()
Viewer.animate()
 Viewer.render = function () {
    Viewer.renderer.render(Viewer.scene, Viewer.camera);
   TWEEN.update()
 }         
const cameraAnimationDuration = 500;
const blackScreen = document.querySelector(".blackScreen");
window.Next = () => {
    new TWEEN.Tween({ opacity: 0 })
    .to({ opacity: 1 }, cameraAnimationDuration)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((obj) => {
        blackScreen.style.opacity = obj.opacity.toFixed(2);
    })
    .onStart(() => {
        blackScreen.style.display = "block";
    })
    .onComplete(() => {
        window.location.href = "RestRoomDoor/index.html";
    })
    .start();
}
