<template>
  <div>
    <commonTable
      :option="option"
      :data="dataParent"
      :page="pageParent"
      ref="commonTable"
      @selectionChange="selectionChange"
      @changeSize="changeSize"
      @changeCurrent="changeCurrent"
      @searchTable="searchTable"
    >
      <div slot="menu" slot-scope="{ row }">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="openImagePreview(row.imgpath, row.id)"
        >查看
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-popover
          placement="top"
          width="400"
          v-model="row.visible"
          trigger="click">
          <p>选择处置方式</p>
          <div>
            <el-radio-group>
              <el-radio>已处理</el-radio>
              <el-radio>忽略</el-radio>
              <el-radio>继续观察</el-radio>
            </el-radio-group>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="row.visible = false">确定</el-button>
          </div>
          <el-button size="mini" type="text" icon="el-icon-edit" slot="reference">删除</el-button>
        </el-popover>
      </div>
    </commonTable>
  </div>
</template>

<script>
import commonTable from "@/components/commonTable/commonTable.vue";
import { option } from "./config";
import {commonGet,commonPost} from "@/api/commonApi";
export default {
  name: "alerts",
  components: {
    commonTable,
  },
  data() {
    return {
      option: option,
      pageParent: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      dataParent: [],
      selectionList: [],
      query: {},
    };
  },
  created() {
    this.onLoadParent(this.pageParent);
  },
  methods: {
    openImagePreview(imgSrc, alertId) {
      // listObjects(alertId).then(response => {
      //   this.objs = response.rows // 假设返回的数据存储在 rows 中
      //   this.currentImageSrc = imgSrc // 设置当前图片源
      //   this.isImagePreviewVisible = true // 打开弹窗
      // }).catch(error => {
      //   this.$modal.msgError('获取报警信息失败')
      // })
    },

    handleCancel(row) {
      row.visible = false
    },






    searchTable(query) {
      this.query = query;
      this.onLoadParent(this.pageParent);
    },
    changeSize(size) {
      this.pageParent.pageSize = size;
      this.onLoadParent(this.pageParent);
    },
    changeCurrent(current) {
      this.pageParent.currentPage = current;
      this.onLoadParent(this.pageParent);
    },
    refreshTable() {
      this.onLoadParent(this.pageParent);
    },
    selectionChange(selection) {
      this.selectionList = selection;
    },
    // selectionClear() {
    //   this.selectionList = [];
    //   this.$refs.commonTable.clearTable();
    // },


    onLoadParent(page) {
      commonGet('/fanmonitor/alerts/listDto',{
        pageNum: this.pageParent.currentPage,
        pageSize: this.pageParent.pageSizes,
        ...this.query
      }).then(res=>{
        if(res.code ===200) {
          let result = res.rows
          result.forEach(item=>item.visible = false)
            this.pageParent.total = res.total;
            this.dataParent = result;
            // this.selectionClear();
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
