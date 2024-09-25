<template>
  <el-dialog :visible.sync="isVisible" width="80%">
    <div class="image-preview-container">
      <div class="image-wrapper">
        <img :src="'/dev-api'+imgSrc" alt="Preview" class="preview-image" />
        <div class="overlay" v-if="objs.length">
          <div
            v-for="(obj, index) in objs"
            :key="index"
            class="bounding-box"
            :style="boundingBoxStyle(obj.position)"
          >
            <span class="label">{{ obj.label }} ({{ (obj.confidence * 100).toFixed(2) }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImagePreviewModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    objs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isVisible: this.visible, // 使用本地数据属性
    };
  },
  watch: {
    visible(newVal) {
      this.isVisible = newVal; // 监听 prop 的变化
    },
    isVisible(newVal) {
      this.$emit('update:visible', newVal); // 当本地属性变化时，通知父组件
    },
  },
  methods: {
    boundingBoxStyle(position) {
      return {
        position: 'absolute',
        left: `${position[0]}px`,
        top: `${position[1]}px`,
        width: `${position[2] - position[0]}px`,
        height: `${position[3] - position[1]}px`,
        border: '2px solid rgba(0, 0, 255, 0.7)',
        color: 'blue',
      };
    },
  },
};
</script>

<style scoped>
.image-preview-container {
  position: relative;
}
.preview-image {
  width: 100%;
  height: auto;
}
.bounding-box {
  position: absolute;
  border: 2px solid rgba(0, 0, 255, 0.7);
  color: blue;
}
.label {
  background-color: rgba(0, 0, 255, 0.5);
  color: white;
  padding: 2px 5px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
