<template>
  <div class="draggable">
    <el-table
      class="table-box"
      :key="renderKey"
      v-if="showTable"
      :data="tableData"
      :row-class-name="rowClassName"
      row-key="id"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      style="width: 100%"
      :height="tableHeight"
      ref="tableRef"
      :size="smart ? 'small' : 'medium'"
      header-cell-class-name="header-bg"
      :border="!option.dropSort"
    >
      <el-table-column
        type="index"
        align="center"
        v-if="option.index"
        label-class-name="show-index"
        fixed
        width="60"
      >
      </el-table-column>
      <el-table-column
        type="selection"
        fixed
        v-if="option.selection"
        align="center"
        width="60"
      >
      </el-table-column>
      <el-table-column
        v-if="option.showRadio"
        label="选择"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            :label="scope.$index"
            @change.native="getCurrentRow(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <template v-for="(item, index) in oldList">
        <el-table-column
          :key="`col_${index}`"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed || false"
          :sortable="sortMethod(item)"
          :align="item.align || 'left'"
          :min-width="item.width || 80"
          filter-placement="bottom-end"
          :filters="item.filterArr"
          :filter-method="item.filterArr && filterTag"
        >
          <template slot-scope="scope">
            <slot
              v-if="filterArr.includes(item.prop)"
              name="name"
              :index="scope.$index"
              :column="scope.column"
              :row="scope.row"
            >
            </slot>
            <div v-else>
              <p class="in-table-info filterSlot" v-if="item.overHidden">
                {{ scope.row[item.prop] }}
              </p>
              <el-popover
                v-if="!item.overHidden"
                :close-delay="0"
                popper-class="tt-popover"
                trigger="hover"
                placement="top"
                :content="scope.row[item.prop]"
              >
                <div slot="reference" class="name-wrapper">
                  <p class="in-table-info">{{ scope.row[item.prop] }}</p>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="!option.menuHide"
        fixed="right"
        label="操作"
        align="center"
        :width="option.menuWidth || 200"
      >
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            v-if="option.editBtn"
            @click="eidtInfo(scope)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            v-if="option.delBtn"
            >删除</el-button
          > -->
          <slot name="menu" :index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="!option.pageHide">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
    <div v-if="dialogVisible">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="option.dialogClickModal"
        append-to-body
        :fullscreen="fullscreen"
        :width="option.dialogWidth + 'px'"
      >
        <div slot="title" class="header-tt">
          <h3>{{ titleType === "edit" ? "编辑" : "新增" }}</h3>
          <el-button
            type="text"
            icon="el-icon-full-screen"
            @click="fullscreen = true"
            v-show="!fullscreen"
          ></el-button>
          <el-button
            type="text"
            icon="el-icon-news"
            @click="fullscreen = false"
            v-show="fullscreen"
          ></el-button>
        </div>
        <div class="form-box">
          <CutomForm
            :formArr="formArr"
            :label-width="option.labelWidth || '120px'"
            :isSearch="false"
            :editData="editData"
            ref="cutomForm"
          ></CutomForm>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="editSure"
            size="small"
            icon="el-icon-circle-check"
            >{{ titleType === "edit" ? "修 改" : "保存" }}</el-button
          >
          <el-button
            @click="dialogVisible = false"
            size="small"
            icon="el-icon-circle-close"
            >取 消</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import CutomForm from "../cutomForm/CutomForm";
export default {
  props: {
    option: {
      type: Object,
    },
    smart: {
      type: Boolean,
    },
    data: {
      type: Array,
      default: () => [],
    },
    isSearchFlag: {
      type: Boolean,
    },
    page: {
      type: Object,
    },
    isShowColor: {
      type: Boolean,
      default: false,
    },
    propsKey: {
      type: String,
    },
  },
  components: {
    CutomForm,
  },
  data() {
    return {
      oldList: [],
      newList: [],
      tableData: [],
      tableItems: [],
      currentPage: 1,
      tableHeight: 300,
      dialogVisible: false,
      fullscreen: false,
      showTable: true,
      renderKey: Math.random().toFixed(8),
      scrollLeft: 0,
      titleType: "edit",
      formArr: [],
      radio: "",
      editData: null,
      filterArr: [
        "name",
        "code",
        "status",
        "srcProcedure",
        "refProcedures",
        "procedureName",
        "dept",
        "customCode",
        "major",
        "facility",
        "masters",
        "users",
        "type",
        "spv",
        "version",
        "summary",
        "updateTime",
        "qpApproved",
        "devList",
        "procedures",
        "erpCode",
        "bom",
        "guicheng",
        "mwo",
        "devInspectItemsList",
      ],
    };
  },
  computed: {
    sortMethod() {
      return function (item) {
        if (item.sortable === false) {
          return item.sortRequest ? "custom" : true;
        }
      };
    },
  },
  created() {
    //初始化数据
    this.tableData = this.data;
    // item.filterArritem.filterArr
    // 备份表头数据 用于拖拽
    this.makeHeader();
  },
  watch: {
    isSearchFlag(newVal) {
      if (this.option.height === "auto") {
        if (newVal) {
          this.tableHeight =
            document.documentElement.clientHeight -
            this.option.calcHeight +
            "px";
        } else {
          this.tableHeight =
            document.documentElement.clientHeight -
            this.option.calcHeight +
            60 +
            "px";
        }
      }
    },
    option: {
      handler() {
        this.makeHeader();
        // 初始化表单
        this.makeForm();
      },
      deep: true,
      immediate: true,
    },
    data: {
      handler() {
        this.tableData = this.data;
        this.radio = "";
      },
      deep: true,
    },
  },
  mounted() {
    if (this.option.height === "auto") {
      this.tableHeight =
        document.documentElement.clientHeight - this.option.calcHeight + "px";
      this.renderTable();
    }
    this.bindDrop();
  },
  methods: {
    makeForm() {
      let arr = this.option.column.filter((item) => item.editDisplay !== false);
      arr.forEach((item) => {
        item.start = item.start || 0;
      });
      arr.sort((a, b) => {
        return b.start - a.start;
      });
      this.formArr = arr;
    },
    rowClassName({ row }) {
      if (this.propsKey === "status" && row.status === 0) {
        return "rowName";
      }
      if (
        this.propsKey === "procedures" &&
        (!row.procedures || row.procedures.length < 1)
      ) {
        return "rowName";
      }

      return "";
    },
    handleSizeChange(size) {
      this.$emit("changeSize", size);
    },
    handleCurrentChange(current) {
      this.$emit("changeCurrent", current);
    },
    getCurrentRow(row) {
      this.$emit("getCurrentRow", row);
    },
    selectionChange(selection) {
      this.$emit("selectionChange", selection);
    },
    sortChange(column) {
      this.$emit("sortChange", column);
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    // headerDragend(newWidth, oldWidth, column, event){
    //   // this.oldList.forEach(item=>{
    //   //   if(item.prop === column.property) {
    //   //     item.width = newWidth
    //   //   }
    //   // })
    //   this.showTable = false
    //   this.$nextTick(()=>{
    //     this.showTable = true
    //     this.bindDrop()
    //   })
    // },
    editSure() {
      let ref = this.$refs.cutomForm;
      ref
        .validate()
        .then((res) => {
          if (res) {
            this.dialogVisible = false;
            this.$emit("update", this.editData);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    filterTag(value, row, column) {
      return row[column.property] === value;
    },
    makeHeader() {
      let arr = JSON.parse(JSON.stringify(this.option.column));
      this.tableItems = arr.filter((item) => item.hide !== false);
      //初始化过滤条件数据
      this.tableItems.forEach((item) => {
        if (item.filter === false) {
          let arr = this.tableData
            .map((row) => row[item.prop])
            .filter((row) => row);
          arr = [...new Set(arr)];
          item.filterArr = arr.map((key) => ({ text: key, value: key }));
        }
      });
      this.oldList = JSON.parse(JSON.stringify(this.tableItems));
      this.renderTable();
    },
    bindDrop() {
      this.scroll();
      if (this.option.dropSort) {
        setTimeout(() => {
          this.columnDrop();
          // this.rowDrop();
        }, 0);
        this.$nextTick(() => {
          let scroll = this.$el.querySelector(".el-table__body-wrapper");
          scroll.scrollLeft = this.scrollLeft;
          this.$refs.tableRef.doLayout();
        });
      }
    },
    scroll() {
      setTimeout(() => {
        this.$refs.tableRef.bodyWrapper.addEventListener(
          "scroll",
          this.scrollEvent
        );
      }, 100);
    },
    scrollEvent(e) {
      this.scrollLeft = e.target.scrollLeft;
    },
    eidtInfo(row, type) {
      this.titleType = type;
      this.editData = row;
      this.dialogVisible = true;
    },
    fullMidea() {
      this.fullscreen = true;
    },
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(
        ".draggable .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".draggable .el-table__row",
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
    // 重新渲染table
    renderTable() {
      this.renderKey = Math.random().toFixed(8);
      this.$nextTick(() => {
        this.bindDrop();
      });
    },
    // 列拖拽
    columnDrop() {
      let currentIndex = 0;
      if (this.option.index) {
        currentIndex++;
      }
      if (this.option.selection) {
        currentIndex++;
      }
      const wrapperTr = document.querySelector(
        ".draggable .el-table__header-wrapper tr"
      );
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        filter: ".el-table-column--selection",
        delay: 0,
        onEnd: (evt) => {
          const oldItem = this.oldList[evt.oldIndex - currentIndex];
          this.oldList.splice(evt.oldIndex - currentIndex, 1);
          this.oldList.splice(evt.newIndex - currentIndex, 0, oldItem);
          this.renderTable();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .rowName {
  color: red;
}
::v-deep .header-bg {
  color: rgba(0, 0, 0, 0.85);
  background-color: #fafafa !important;
}
::v-deep .header-bg .show-index {
  &::before {
    content: "序号";
    display: block;
  }
}
.header-tt {
  position: relative;
  padding: 15px 20px;
  h3 {
    margin: 0;
    padding: 0;
  }
  button {
    position: absolute;
    right: 45px;
    top: 20px;
    color: #909399;
    margin: 0;
    padding: 0;
  }
}
::v-deep .el-dialog__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
  text-align: right;
}
::v-deep .el-dialog__header {
  padding: 0;
  border-bottom: 1px solid #f0f0f0;
}
::v-deep .el-dialog__body {
  min-height: 200px;
}
.form-box {
  padding-bottom: 30px;
}
::v-deep .el-table__column-filter-trigger {
  line-height: 23px;
}
::v-deep .el-table .caret-wrapper {
  height: 23px;
}
::v-deep .el-table .sort-caret.ascending {
  border-top: 0;
}
::v-deep .el-table .sort-caret.descending {
  border-bottom: 0;
}
::v-deep .el-table .sort-caret {
  border-width: 4px;
}
.table-box {
  height: calc(100% - 70px);
}
.page {
  height: 70px;
  text-align: right;
  padding-top: 20px;
  box-sizing: border-box;
}
</style>
<style>
body .tt-popover {
  padding: 5px 10px;
  background: #000;
  color: #fff;
}
body .el-popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #000;
}
.in-table-info {
  width: 100%;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
