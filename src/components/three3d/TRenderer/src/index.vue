<template>
    <div>
        <slot></slot>
        <div ref="container"></div>
    </div>
</template>
<script>
import { WebGLRenderer, Clock } from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";//2D 标签渲染类
//import TWEEN from "@tweenjs/tween.js";

export default {
    name: "TRenderer",
    props: { //获取父组件的SIZE
        size: {
            type: Object,
            default: () => {
                return {
                    w: 1024,
                    h: 740
                };
            },
            validator: function(size) {
                return size.w && size.h ? true : false;
            }
        }
    },
    provide() {
        return {
            global: this.global
        };
    },
    data() {
        let renderer = new WebGLRenderer({ antialias: true, alpha: true });//创建renderer
        renderer.shadowMap.enabled = true; //在场景中使用阴影贴图
        renderer.setSize(this.size.w, this.size.h);//设置尺寸
        return {
            renderer,
            global: {
                renderer,
                rendererSize: this.size,
                rendererDom: renderer.domElement,
                scene: null,
                camera: null,
                mixers: new Map(),
                compose: null,
                CSSRender: new CSS2DRenderer()
            },
            clock: new Clock()
        };
    },
    methods: {
        render() {
            const { scene, camera, stats, compose, CSSRender } = this.global;
            if (scene && camera) {
                this.renderer.render(scene, camera);
                CSSRender.render(scene, camera);
            }
            stats && stats.update();
            var delta = new Clock().getDelta();
            // console.log(compose);
            compose && compose.render(delta);
            requestAnimationFrame(this.render);
            const mixerUpdateDelta = this.clock.getDelta();
            this.global.mixers.forEach(mixer => {
                mixer.update(mixerUpdateDelta);
            });
           // TWEEN.update();
        }
    },
    mounted() {
        const { size } = this;
        const { CSSRender } = this.global;
 
        console.log(size);
        console.log("11111111111111111111111111111111111");
        CSSRender.setSize(size.w, size.h);
        CSSRender.domElement.style.position = "absolute";
        CSSRender.domElement.style.top = 0;
        this.$refs.container.appendChild(CSSRender.domElement);
        this.$refs.container.appendChild(this.renderer.domElement);
        this.render();
    }
};
</script>
<style lang='scss' scoped>
</style>