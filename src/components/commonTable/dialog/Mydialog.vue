<template>
  <div class="my-dialog" v-show="value">
      <transition>
       <div v-show="value" class="dialog-contenet" :style="{width:width+ 'px',marginTop:top}" :class="{'outside-right':isRight, 'outside-left': !isRight}">
        <div class="dialog-tt">
           <slot name="title">
            <h4>{{title}}</h4>
           </slot>
            <el-button type="text" icon="el-icon-close" @click="closeModal"></el-button>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div v-if="!footerHide">
          <slot name="footer">
            <div class="footer" >
              <el-button type="primary" size="small" @click="closeModal">确定</el-button>
              <el-button  size="small"  @click="closeModal">取消</el-button>
             </div>
          </slot>
        </div>
       </div>
      </transition>
    <div class="mask" @click="closeModal"></div>
  </div>
</template>

<script>
  export default {
    props: {
      value:{
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '1200px'
      },
      isRight:{
        type: Boolean,
        default: false
      },
      top:{
        type:String,
        default: '15vh'
      },
      title:{
        type:String,
        default: '提示'
      },
      footerHide: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeModal() {
        this.$emit('input', false)  
      }
    },
  }
</script>

<style lang="scss" scoped>
.my-dialog{
  .dialog-contenet{
    position: fixed;
    top: 0;
    background-color: #fff;
    z-index: 7777;
    .dialog-tt{
      position: relative;
      button{
        position: absolute;
        right: 15px;
        top: 10px;
        font-size: 20px;
        color: #333;
        padding: 5px;
        &:hover{
          background-color: #ecf5ff;
          color:#409eff;
        }
      }
    }
    .content{
      padding: 20px;
    }
    .footer{
      text-align: right;
      padding: 10px 20px;
      button{
        margin-right: 20px;
      }
    }
  
}
 .outside-right{
    right:0;
    height:100%;
 }
 .outside-left{
    left: 50%;
    transform: translate(-50%);
 }
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    opacity: .5;
    z-index: 6666;
  }
}
.v-enter-active,.v-leave-active {
		transition: all 1s ease;
}
.v-enter, .v-leave-to{
		transform: translateX(100px);
}
.tt-popover{
  padding: 5px 10px;
  background:#000;
  color:#fff;
}
</style>