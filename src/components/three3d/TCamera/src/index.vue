<script>
import { PerspectiveCamera } from "three";
export default {
    name: "TCamera",
    inject: ["global"],
    mounted() {
      //渲染器的宽度和高度
      const { w, h } = this.global.rendererSize;

      //初始化相机
      const camera = new PerspectiveCamera(20, w / h, 1, 2000);

      //设置相机位置
      camera.position.set(-2,3,2)

      // 设置相机名称
      camera.name = "camera";

      // 将相机保存到全局状态中
      this.global.camera = camera;
    },
    render(){
        return null;// 不渲染任何 DOM 元素
    }
};
</script>
