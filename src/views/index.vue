<template>
  <div class="app-container home">
    <Three3d :labelData="timeData"></Three3d>
  </div>
</template>

<script>
import {listTemperature} from "../api/fanmonitor/alarm";

import Three3d from "@/components/three3d/index.vue";
export default {
  name: "Index",
  components: { Three3d },
  data() {
    return {
      // 版本号
      version: "3.8.8",
      timeData: {/*
        "变桨系统": {
            name: "变桨系统",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
           "转子": {
            name: "转子",
            value: "20",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
        "主轴": {
            name: "主轴",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "齿轮箱": {
            name: "齿轮箱",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
        "风冷装置": {
            name: "风冷装置",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "油冷装置": {
            name: "油冷装置",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "发电机": {
            name: "发电机",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "偏航电机": {
            name: "偏航电机",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "控制柜": {
            name: "控制柜",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        }*/
    }
    };
  },
  methods: {
    /* goTarget(href) {
      window.open(href, "_blank");
    }, */
    getTimeData(){
      listTemperature().then(response => {
        this.timeData = response
        console.log(response)
      })
      /*this.timeData= {
        "变桨系统": {
            name: "变桨系统",
            value: Math.random() * 90,
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
         "转子": {
            name: "转子",
            value: Math.random() * 90,
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
        "主轴": {
            name: "主轴",
            value: Math.random() * 90,
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "齿轮箱": {
            name: "齿轮箱",
            value: Math.random() * 90,
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"

        },
        "风冷装置": {
            name: "风冷装置",
            value: "21",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "油冷装置": {
            name: "油冷装置",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "发电机": {
            name: "发电机",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "偏航电机": {
            name: "偏航电机",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        },
        "控制柜": {
            name: "控制柜",
            value: "11",
            alarm: "温度超限",
            time: "11:30",
            unit: "°C"
        }
      }*/

    }
  },

  mounted(){
    this.getTimeData();
    // 模拟调用接口数据
    /* setInterval(() => {
         this.getTimeData();
         console.log("1111111111");
    }, 5000); */
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

