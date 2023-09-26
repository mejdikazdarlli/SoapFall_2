import { CARviewer} from './MKViewer.js';
import { Raycaster,Vector3} from './THREE/three.module.js';
import { TWEEN } from './THREE/tween.module.min.js';
function _(elm){return document.getElementById(elm)}


_("MKViewer").addEventListener('pointerdown', onDocumentMouseclick);
_("MKViewer").addEventListener('touchstart', onDocumentTouchstart);

_("MKViewer").onpointermove = (event) => {onDocumentMouseMove(event)}

function onDocumentTouchstart(event) {
    event.preventDefault();
    onDocumentMouseclick(event.touches[0]);
}

let Viewer = new CARviewer(elm)
Viewer.initScene()
Viewer.animate()
Viewer.render = function () {
    TWEEN.update()
    Viewer.renderer.render(Viewer.scene, Viewer.camera);
}
var raycaster, mouse = { x: 0, y: 0 };
raycaster = new Raycaster();
var intersects = []
let TWEEN_DURATION = 3500
let doorHasBeenAnimated = false;
let cameraHasMoved = false;
const cameraAnimationDuration = 2000;

function onDocumentMouseclick(event) {
    if (doorHasBeenAnimated) {
        return;
    }
    const blackScreen = document.querySelector(".blackScreen");
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    const camera = Viewer.camera;

    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true);

    if (intersects.length > 0) {
        let door = intersects[0].object;
        let doorFrame = Viewer.scene.getObjectByName("door-frame");

        if (door.name === "door") {
            doorHasBeenAnimated = true;
            if (!cameraHasMoved) {
                cameraHasMoved = true;
                const doorPosition = doorFrame.position.clone();
                const doorLookAt = doorFrame.getWorldPosition(new Vector3());
                const initialCameraPosition = camera.position.clone();
                const initialCameraLookAt = new Vector3().copy(camera.getWorldDirection(new Vector3()));

                new TWEEN.Tween(door.rotation)
                    .to({ y: door.rotation.y + 1 }, TWEEN_DURATION)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();

                new TWEEN.Tween(initialCameraPosition)
                    .to(doorPosition, cameraAnimationDuration)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(() => {
                        camera.position.copy(initialCameraPosition);
                    })
                    .start();
                new TWEEN.Tween(initialCameraLookAt)
                    .to(doorLookAt, cameraAnimationDuration)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(() => {
                        camera.lookAt(initialCameraLookAt);
                    })
                    .start()
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
                        window.location.href = window.location.hostname +"/SoapFall_2/"+"RestRoom/index.html";
                    })
                    .start();
            }
        }
    }
}
function onDocumentMouseMove(event) {
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true)
    if (intersects.length > 0)
        {
        if (intersects[0].object.name==="door"){
            _("MKViewer").style.cursor = "pointer"
        }else{_("MKViewer").style.cursor = "default"}
        }
}


