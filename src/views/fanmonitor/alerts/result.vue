<template>
  <div>
    <commonTable
      :option="option"
      :data="dataParent"
      :page="pageParent"
      ref="commonTable"
      @selectionChange="selectionChange"
      @rowUpdate="rowUpdate"
      @changeSize="changeSize"
      @changeCurrent="changeCurrent"
      @refreshTable="refreshTable"
      @searchTable="searchTable"
    >
      <div slot="menu" slot-scope="{ row }">
        <!-- conveneNum>=1绿色 其他情况红色  -->
        <el-button type="primary" plain size="small" @click="toPreWork(row)"
          ><span
            class="circle"
            :style="{ background: row.conveneNum >= 1 ? 'blue' : 'red' }"
          ></span
          >工前会</el-button
        >

        <el-button type="primary" plain size="small" @click="toAfterWork(row)"
          >工后会</el-button
        >
        <!-- isHand === 1 绿色   ！==1 红色 -->
        <el-button type="primary" plain size="small" @click="searchJob(row)"
          ><span
            class="circle"
            :style="{ background: row.isHand === 1 ? 'blue' : 'red' }"
          ></span
          >查看工作包</el-button
        >
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleRowClick(row)"
          >查看规程</el-button
        >
      </div>
    </commonTable>
  </div>
</template>

<script>
// import commonTable from "@/components/commonTable/commonTable.vue";
// import { procedurePage } from "./resultApi";
import { option } from "./resultConfig";
export default {
  name: "App",
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
    handleRowClick(row) {
      this.$router.push({
        path: "/execute/regulation",
        query: {
          workOrderId: row.id,
          name: "工单规程-" + row.workOrderNbr + "-" + row.workOrderTask,
        },
      });
    },
    searchJob(row) {
      this.$router.push({
        path: "/execute/job",
        query: {
          workOrderNbr: row.workOrderNbr,
          workOrderTask: row.workOrderTask,
          name: "工作包-" + row.workOrderNbr + "-" + row.workOrderTask,
        },
      });
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
    selectionClear() {
      this.selectionList = [];
      this.$refs.commonTable.clearTable();
    },
    toPreWork(row) {
      this.$router.push({
        path: "/execute/pre-work",
        query: {
          workOrderNbr: row.workOrderNbr,
          workOrderTask: row.workOrderTask,
          name: "工前会-" + row.workOrderNbr + "-" + row.workOrderTask,
        },
      });
    },
    toAfterWork(row) {
      this.$router.push({
        path: "/execute/after-work",
        query: {
          workOrderNbr: row.workOrderNbr,
          workOrderTask: row.workOrderTask,
          name: "工后会-" + row.workOrderNbr + "-" + row.workOrderTask,
        },
      });
    },
    onLoadParent(page) {
      // this.loading = true;
      procedurePage(page.currentPage, page.pageSize).then((res) => {
        // this.loading = false;
        const data = res.data.data;
        this.pageParent.total = data.total;
        this.dataParent = data.records;
        this.selectionClear();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.name-box {
  p {
    margin: 0;
    padding: 0;
    line-height: 16px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin: 0 10px;
  font-size: 12px;
}
.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.el-icon-arrow-down {
  font-size: 13px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}

.virtualSelect .el-scrollbar .el-scrollbar__bar.is-vertical {
  width: 0;
}
</style>
