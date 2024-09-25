<template>
    <ul
        class="equipmentLabel"
        ref="demo"
        :class="{ hide: labelHide }"
        @click="labelHide = true"
    >
        <li></li>
        <li class="labelInfo">
            <div>
                <header>
                    <div class="en">{{ nowLabelData.name }}</div>
                </header>
                <ul>
                    <li><span>温度：{{ nowLabelData.value }}{{ nowLabelData.unit }}</span></li>
                    <li><span>时间：{{ nowLabelData.time }}</span> </li>
                    <li><span>告警：{{ nowLabelData.alarm }}</span> </li>
                </ul>
            </div>
        </li>
    </ul>
</template>
<script>
/* eslint-disable */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass, EffectComposer, OutlinePass } from "three-outlinepass";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import TWEEN from "@tweenjs/tween.js";

export default {
    name: "TTurebine",
    inject: ["global"],
    props: ['labelData'],
    data() {
        return {
            matrixTurbine: null,//风机模型
            wireframe: null,
            metal: null,
            mouse: new THREE.Vector2(),
            raycaster: new THREE.Raycaster(),//射线投射器，用于检测鼠标点击的3D对象
            equipment: null,//设备模型
            equipmentMaterialMap: new Map(),//存储设备材质
            wholeGroup: new THREE.Group(),//存储风机和设备的整体组
            plane: null,
            wholeGroupall: new THREE.Group(),
            turbineLabel: null,//风机标签
            labelHide: true,//标签隐藏状态
            nowLabelData: {

            }
        };
    },
    methods: {
        //外壳  加载风机模型，并将其添加到 wholeGroup 中
        loadTurbine() {
            const loader = new GLTFLoader()
            const onProgress=xhr=>{
                this.$emit("progress",xhr.loaded/xhr.total*100)
            }
            loader.load(`./model/untitled1.glb`, object => {
                this.$emit("complete")
                this.matrixTurbine = object;
                let mesh = object.scene;
                this.mesh = mesh;
                this.metal = mesh.getObjectByName("颜色材质");
                this.wireframe = mesh.getObjectByName("线框材质");
               //  this.wireframe.visible = false;
                this.metal.visible = false;
                // this.turbineAnimation = object.animations;
                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
               // const plane = object.scene.getObjectByName("polySurface136");
              //  mesh.remove(plane);
                this.wholeGroup.add(mesh);
                mesh.position.set(0, 0, -2.42);
                this.changeAnimation(mesh, "Anim_0");//为模型启动一个名为 "Anim_0" 的动画
            },onProgress);

        },
        //设备  加载设备模型，遍历模型的子对象并存储材质信息，然后将模型添加到 wholeGroup 中。
        loadEquipment() {
            let loader = new GLTFLoader();
            loader.load(`${process.env.BASE_URL}model/equipment.glb`, object => {
                let mesh = object.scene;
                this.equipment = mesh;

                mesh.traverse(child => {
                  //判断否为一个可渲染的几何体
                    if (child.isMesh) {
                        const material = child.material.clone();
                        child.material = material;
                        this.equipmentMaterialMap.set(child.name, child);
                    }
                });

                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
                this.wholeGroup.add(mesh);
                mesh.position.set(0, 0, -2.42);
            });
        },
        //底部平面 加载底部平面模型，并将其添加到场景中
        loadingPlane() {
            let loader = new GLTFLoader();
            loader.load(`${process.env.BASE_URL}model/plane.glb`, object => {
                let mesh = object.scene;
                // this.equipment = mesh;
                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
                this.global.scene.add(mesh);
                mesh.position.set(0, 0, -2.42);
            });
        },
        //添加和改变风机旋转动画
        changeAnimation(turbine, animationName) {
            const animations = this.matrixTurbine.animations;
            const mixer = new THREE.AnimationMixer(turbine);
            const clip = THREE.AnimationClip.findByName(
                animations,
                animationName
            );
            const key = "AA";
            if (clip) {
                const action = mixer.clipAction(clip);
                action.play();
                this.global.mixers.set(key, mixer);
            } else {
                this.global.mixers.delete(key);
            }
        },
      //处理设备点击事件，计算鼠标点击位置，并使用射线投射器检测与设备模型的交互。
        onEquipmentClick(event) {

            const [w, h] = [window.innerWidth-100, window.innerHeight-100];
           // const { w, h } = this.global.rendererSize;
            const { mouse, global, equipment, raycaster } = this;
            const equipmentList  = new Map();

            equipment.traverse(child => {
                    if (child.isMesh) {
                        const material = child.material.clone();
                        child.material = material;

                        equipmentList.set(child.name, child);
                    }
                });


            this.mouse.x = (event.layerX / w) * 2 - 1;
            this.mouse.y = -(event.layerY /h) * 2 + 1;



            raycaster.setFromCamera(this.mouse, global.camera);
            const intersects = raycaster.intersectObject(equipment, true);

            if (intersects.length <= 0) return false;

            const selectedObject = intersects[0].object;

            equipmentList.forEach(child => {
               child.material.emissive.setHex(child.currentHex)
              })
            if (!selectedObject) return false
            if (selectedObject.isMesh) {

               console.log(selectedObject.name);
                this.outline([selectedObject]);
                this.nowLabelData = this.labelData[selectedObject.name];

                this.updateLabal(intersects[0]);
                selectedObject.currentHex = selectedObject.currentHex ?? selectedObject.material.emissive.getHex();
                selectedObject.material.emissive.setHex(0xff0000)

            }


        },
      //对选中的对象进行轮廓高亮处理
        outline(selectedObjects, color = 0x15c5e8) {
            const { renderer, camera, scene } = this.global;
            const [w, h] = [window.innerWidth, window.innerHeight];
            var compose = new EffectComposer(renderer);
            var renderPass = new RenderPass(scene, camera);
            var outlinePass = new OutlinePass(
                new THREE.Vector2(w, h),
                scene,
                camera,
                selectedObjects
            );
            outlinePass.renderToScreen = true;
            outlinePass.selectedObjects = selectedObjects;
            compose.addPass(renderPass);
            compose.addPass(outlinePass);
            const params = {
                edgeStrength: 10,
                edgeGlow: 0,
                edgeThickness: 50.0,
                pulsePeriod: 1,
                usePatternTexture: false
            };
            outlinePass.edgeStrength = params.edgeStrength;
            outlinePass.edgeGlow = params.edgeGlow;
            outlinePass.visibleEdgeColor.set(color);
            outlinePass.hiddenEdgeColor.set(color);
            compose.render(scene, camera);
            this.$set(this.global, "compose", compose);
        },
        //过度动画  使用 TWEEN 创建平滑动画。
        animation(oldObject, newObject, time, update, complete) {
            var tween = new TWEEN.Tween(oldObject);
            tween.to(newObject, time);
            tween.onUpdate(function(object) {
                update && update(object);
            });
            tween.onComplete(function() {
                complete && complete();
            });
            tween.easing(TWEEN.Easing.Linear.None);
            tween.start();
        },
        //更新风机的偏航角
        updataTurbineYawAngle() {
            setInterval(() => {
                const curAngle = this.wholeGroup.rotation.z;
                const newAngle = parseInt(Math.random() * 90) * (Math.PI / 180);
                const update = data => {
                    // let polySurface189 = this.wholeGroup.getObjectByName("polySurface189")
                    // console.log();
                    // polySurface189.rotation.y = data.angle;
                    this.wholeGroup.rotation.z = data.angle;
                };
                const complete = () => {
                    // this.turbineYawAngle.set(entityId, newAngle);
                };
                this.animation(
                    { angle: curAngle },
                    { angle: newAngle },
                    2000,
                    update,
                    complete
                );
            }, 5000);
        },
        createCssObject(str) {
            const dom = $(str)[0];
            let CSSObject = new CSS2DObject(dom);
            // console.log("CSSObject", CSSObject);
            return CSSObject;
        },
      //创建风机的标签，并将其添加到场景中
        createTurbineLabel() {
            let label = new CSS2DObject(this.$refs.demo);
            this.turbineLabel = label;
            this.global.scene.add(label);
        },
      //更新标签的位置和显示内容
        updateLabal(intersect) {
            this.labelHide = false;
            const point = intersect.point;
            this.turbineLabel.position.set(point.x, point.y, point.z);
        },
      //设置设备告警效果，定期闪烁设备材质的颜色
        alarm() {

            setInterval(() => {

                if (equipment) {
                    equipment.material.emissive.setHex(equipment.currentHex);
                }
                equipment.currentHex = equipment.material.emissive.getHex();
                equipment.material.emissive.setHex(0xff0000);
                setTimeout(() => {
                    if (equipment)
                        equipment.material.emissive.setHex(
                            equipment.currentHex
                        );
                }, 4000);
            }, 5000);
        }
    },
    mounted() {
      /* 加载风机、设备、平面模型，并创建标签。
      最后将风机和设备的整体组添加到场景中，并绑定设备点击事件的处理函数 */
        this.loadTurbine();
        this.loadEquipment();
        this.loadingPlane();
       // this.updataTurbineYawAngle();
        this.createTurbineLabel();
       // this.alarm();
        this.global.scene.add(this.wholeGroup);
        document.addEventListener("click", this.onEquipmentClick);
    }
};
</script>
<style lang="scss" scoped>
.hide {
    display: none;
}
.show {
    display: block !important;
}
.equipmentLabel {
    z-index: 999;
    // display: flex;
    width: 988px;
    height: 451px;
    // background-color: red;
    & > li:nth-child(1) {
        color: #fff;
        width: 191.5px;
        height: 225.5px;
        background-image: url("../../../../assets/images/1.png");
        background-size: 191.5px auto;
        position: absolute;
        right: 302.5px;
        top: 0px;
    }
    .labelInfo {
        width: 302.5px;
        height: 225.5px;
        background-image: url("../../../../assets/images/2.png");
        background-size: 302.5px auto;
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 10px;
        box-sizing: border-box;
        & > div {
            width: 100%;
            height: 100%;
            background-color: #04669e73;
            border: 1px solid #15c5e8;
            box-sizing: border-box;
            padding: 20px 20px;
            header {
                width: 100%;
                // height: 40px;
                text-align: left;
                font-size: 14px;
                line-height: 20px;
                color: #fff;
                border-bottom: 1px dashed aqua;
                padding-bottom: 14px;
                .en {
                    font-size: 12px;
                    color: aqua;
                }
            }
            ul {
                width: 100%;
                color: #fff;
                li {
                    line-height: 30px;
                    font-size: 14px;
                    display: flex;
                    // justify-content: space-between;
                    text-align: left;
                    align-items: left;
                    span: {
                        width: 100%;
                    }

                }
            }
        }
    }
}
</style>
