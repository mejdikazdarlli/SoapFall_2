import { CARviewer,mixer,clips} from './MKViewer.js';
// import { Raycaster,Vector3} from './THREE/three.module.js';
import * as THREE from './THREE/three.module.js';
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
    //Viewer.orbit.update()
    Viewer.renderer.render(Viewer.scene, Viewer.camera);
}

var raycaster, mouse = { x: 0, y: 0 };
raycaster = new THREE.Raycaster();
var intersects = []

function onDocumentMouseclick(event) {
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true);
    
    if (intersects.length > 0) {
            if(intersects[0].object.name==="showerHead"){
                
                _('message').style.top = "3%"
                setTimeout(() => {
                    _('message').style.top = "-10%"
                }, 4000);
            }
           
        }
}
_("soap").addEventListener('pointerdown', onSoapDropped);
function updateCameraFOV(value,camera) {
    camera.fov = value;
    camera.updateProjectionMatrix(); // Update the camera's projection matrix
}
let soapDropped = false;
function onSoapDropped(event) {
    var screenWidth = window.innerWidth;
    var referenceScreenWidth = 1080;
    var scaleFactor = screenWidth / referenceScreenWidth;
        let SaopOnFloor = Viewer.scene.getObjectByName("SaopOnFloor");
        let SaopOnFloorCAM = Viewer.scene.getObjectByName("SaopOnFloorCAM");
        let Saopdroping = Viewer.scene.getObjectByName("Saopdroping");
        let SaopinHand = Viewer.scene.getObjectByName("dropedSaop");
        let blackMen = Viewer.scene.getObjectByName("HG_Jack_RIGIFY");

        const blackMeninitialPosition =blackMen.position.clone()
        const blackMeninitialPositionTarget = new THREE.Vector3(1,0,0)

        const blackMeninitialRotation =blackMen.rotation.clone()
        const blackMeninitialRotationTarget = new THREE.Vector3(0,2.5,0)
        
        // Set the initial opacity to 0
        Saopdroping.material.opacity = 0;
        SaopinHand.material.opacity = 1;
        SaopinHand.material.transparent = true;
        
        const camera = Viewer.camera;
        let initialcameraFov = camera.fov;
        const initialCameraPosition = camera.position.clone();
        const initialCameraLookAt = new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3()));
        
        const SaopOnFloor_Position = SaopOnFloorCAM.position.clone();
        const SaopOnFloor_doorLookAt = SaopOnFloor.getWorldPosition(new THREE.Vector3());
        
        const initialOrbitTarget = Viewer.orbit.target.clone();

        const cameraUP_target = Viewer.scene.getObjectByName("cameraUP_target").getWorldPosition(new THREE.Vector3());
        const cameraUP = Viewer.scene.getObjectByName("cameraUP").position.clone();

        
        new TWEEN.Tween(initialCameraPosition)
            .to(SaopOnFloor_Position, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {camera.position.copy(initialCameraPosition);})
            .onComplete(()=>{
                Viewer.orbit.enabled= false
                let multiplVal
                if(screenWidth<300){multiplVal = 2.5}else if(screenWidth<900){multiplVal = 2} else{multiplVal=1}
                console.log(multiplVal)
                new TWEEN.Tween({ fov: initialcameraFov })
                .to({ fov: initialcameraFov/(scaleFactor*multiplVal) }, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((obj) => {
                    updateCameraFOV(obj.fov,camera); // Update the camera FOV during the animation
                })
                .start();

                new TWEEN.Tween(initialCameraPosition)
                .to(cameraUP, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {camera.position.copy(initialCameraPosition);})
                .onStart(()=>{ 
                    this.style.display = "none"
                    Saopdroping.material.opacity = 1
                    SaopinHand.material.opacity = 0
                    clips.forEach(clip => {
                        let action = mixer.clipAction(clip);
                        action.stop()
                        if (action._clip.name === "SaopdropingAction" && !soapDropped) {
                            action.reset();
                            action.clampWhenFinished = true;
                            action.timeScale = 1;
                            action.setLoop(THREE.LoopOnce, 1);
                            action.play();
                            soapDropped = true; // Set the flag to true so it won't play again
                        }
                });
                })
                .onComplete(()=>{
                    //Viewer.orbit.enabled= true
                    new TWEEN.Tween(blackMeninitialPosition)
                        .to(blackMeninitialPositionTarget, 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(() => {blackMen.position.copy(blackMeninitialPosition)})
                        .start();

                    new TWEEN.Tween(blackMeninitialRotation)
                    .to(blackMeninitialRotationTarget, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(() => {blackMen.rotation.copy(blackMeninitialRotation)})
                    .onComplete(() => {
                        startBubbleAnimations();
                    })
                    .start();
                    })
                .start();
            })
            .start();
        
        new TWEEN.Tween(initialCameraLookAt)
            .to(SaopOnFloor_doorLookAt, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.lookAt(initialCameraLookAt);
            })
            .onComplete(()=>{
                new TWEEN.Tween(initialCameraLookAt)
                .to(cameraUP_target, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(()=>{
                        if(screenWidth<900){
                            Saopdroping.scale.set(scaleFactor, scaleFactor, scaleFactor);
                        }
                })
                .onUpdate(() => {
                    camera.lookAt(initialCameraLookAt);
                })
                .start();
            })
            .start();
        
        new TWEEN.Tween(initialOrbitTarget)
            .to(SaopOnFloor_doorLookAt, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                Viewer.orbit.target.copy(initialOrbitTarget);
            })
            .start();
        
        // Tween for Saopdroping
        // new TWEEN.Tween(Saopdroping.position)
        //     .to(initialCameraLookAt, 2000)
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .onUpdate(() => {
        //         Saopdroping.position.copy(Saopdroping.position);
        //     })
        //     .start();
        
        // Tween for Saopdroping opacity
        // new TWEEN.Tween(Saopdroping.material)
        //     .to({ opacity: 1 }, 2000)
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .onStart(()=>{ this.style.display = "none"})
        //     .start()

        // Tween for SaopinHand opacity
        // new TWEEN.Tween(SaopinHand.material)
        //     .to({ opacity: 0 }, 2000)
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .start()
}

function onDocumentMouseMove(event) {
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true)
    if (intersects.length > 0)
        {
            if (intersects[0].object.name==="showerHead"){
                _("MKViewer").style.cursor = "pointer"
            }
            else{_("MKViewer").style.cursor = "default"}

        }
}


function startBubbleAnimations() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        const className = `animate-bubble${index + 1}`;
        setTimeout(() => {
            bubble.classList.add(className);
        }, index * 500); // Delay the start of each bubble animation
    });
}