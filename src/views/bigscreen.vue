<template>
  <div class="app-container home">


    <Three3d :labelData="timeData"></Three3d>
  </div>
</template>

<script>
import Three3d from "@/components/three3d/index.vue";
import {listTemperature} from "../api/fanmonitor/alarm";
export default {
  name: "Index",
  components: { Three3d },
  data() {
    return {
      // 版本号
      version: "3.8.8",
      timeData: {}
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getTimeData() {
      listTemperature().then(response => {
        this.timeData = response
        console.log(response)
      })
    }
  },
  mounted() {
    this.getTimeData()
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.three3d {
	width: 100vw;
	height: 100vh;
	background-color: #040b1a;
}
</style>

