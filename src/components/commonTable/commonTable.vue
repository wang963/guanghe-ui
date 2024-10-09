<template>
  <div class="box-content">
    <el-card class="box-card" :shadow="showShadow ? 'never' : 'always'">
      <div slot="header" class="clearfix">
        <div class="search-box" v-if="!option.searchHide">
          <CutomForm
            @searchTable="searchTable"
            :searchBtnOffset="option.searchBtnOffset"
            :formArr="formArr"
            :isSearch="true"
            :searchCol="option.searchCol"
            :labelWidth="option.labelWidth"
            :actionSpan="option.actionSpan"
            v-show="isSearchFlag"
          ></CutomForm>
        </div>
        <div class="action">
          <div class="left-box">
            <!-- <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              v-if="option.addBtn"
              >新增</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              v-if="option.delBtn"
              >删除</el-button
            > -->
            <slot name="menuLeft"></slot>
          </div>

          <div class="right-box">
            <slot name="menuRight"></slot>
            <div v-if="option.actionBtn">
              <el-button
                icon="el-icon-refresh"
                size="small"
                circle
                @click="refreshTable"
              ></el-button>
              <!-- <el-button icon="el-icon-s-operation" size="small" circle @click="setColum"></el-button> -->
              <el-button
                icon="el-icon-search"
                size="small"
                circle
                @click="isShowSearch"
              ></el-button>
            </div>
          </div>
        </div>
        <div class="info" v-if="option.alertShow">
          <el-alert :closable="false" type="success">
            <div slot="title" class="alert-title">
              <p>
                当前表格已选择 <span>{{ count }}</span
                >项
              </p>
              <el-button type="text" size="small" @click="clearTable"
                >清空</el-button
              >
            </div>
          </el-alert>
        </div>
      </div>
      <div class="table-content">
        <CutomTable
          ref="tableDom"
          @sortChange="sortChange"
          @changeSize="changeSize"
          @changeCurrent="changeCurrent"
          :smart="showShadow"
          @update="update"
          :propsKey="propsKey"
          :page="page"
          :option="copyOption"
          :isSearchFlag="isSearchFlag"
          :data="data"
          @selectionChange="selectionChange"
          @getCurrentRow="getCurrentRow"
        >
          <template slot="name" slot-scope="raw">
            <slot :name="raw.column.property" :row="raw.row"></slot>
          </template>
          <template slot="menu" slot-scope="raw">
            <slot name="menu" :row="raw.row" :index="raw.index"></slot>
          </template>
        </CutomTable>
      </div>
    </el-card>
    <Mydialog
      title="提示111"
      v-model="dialogFlag"
      top="0"
      :footerHide="true"
      :isRight="true"
      width="600"
    >
      <div slot="title" class="header-tt">
        <h5>列隐藏</h5>
      </div>
      <div class="table-box">
        <el-table
          :data="columnData"
          ref="tableRef"
          border
          size="small"
          height="600"
          style="width: 100%"
        >
          <el-table-column prop="name" align="center" label="列名">
          </el-table-column>
          <el-table-column label="隐藏" align="center">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.check"
                @change="changeName('hide', scope)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="冻结" align="center">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.check"
                @change="changeName('fixed', scope)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="过滤" align="center">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.check"
                @change="changeName('filter', scope)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.check"
                @change="changeName('sortable', scope)"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </Mydialog>
  </div>
</template>

<script>
import CutomForm from "./cutomForm/CutomForm";
import CutomTable from "./cutomTable/CutomTable";
import Mydialog from "./dialog/Mydialog";
export default {
  props: {
    option: {
      type: Object,
    },
    data: {
      type: Array,
      default: () => [],
    },
    page: {
      type: Object,
    },
    propsKey: {
      type: String,
    },
    showShadow: {
      type: Boolean,
    },
  },
  name: "commonTable",
  components: {
    CutomForm,
    CutomTable,
    Mydialog,
  },
  created() {
    this.formArr = this.option.column.filter((item) => item.search);
    this.copyOption = JSON.parse(JSON.stringify(this.option));
    this.columnData = this.option.column.map((item) => {
      return {
        name: item.label,
        prop: item.prop,
      };
    });
  },
  watch: {
    option: {
      handler() {
        this.copyOption = JSON.parse(JSON.stringify(this.option));
      },
      deep: true,
    },
  },
  data() {
    return {
      isSearchFlag: true,
      dialogFlag: false,
      selection: [],
      columnData: [],
      copyOption: {},
    };
  },
  computed: {
    count() {
      return this.selection.length;
    },
  },
  methods: {
    clearTable() {
      this.$refs.tableDom.clearSelection();
      this.selection = [];
    },
    changeSize(size) {
      this.$emit("changeSize", size);
    },
    changeCurrent(current) {
      this.$emit("changeCurrent", current);
    },
    update(data) {
      this.$emit("rowUpdate", data);
    },
    sortChange(column) {
      this.$emit("sortChange", column);
    },
    rowEdit(row, index) {
      this.$refs.tableDom.eidtInfo(row, index);
    },
    searchTable(query) {
      this.$emit("searchTable", query);
    },
    refreshTable() {
      this.$emit("refreshTable");
    },
    changeName(name, row) {
      let isCheck = row.check;
      let columnName = this.columnData[row.$index].prop;
      this.hideColum(columnName, isCheck, name);
    },
    selectionChange(selection) {
      this.selection = selection;
      this.$emit("selectionChange", selection);
    },
    getCurrentRow(row) {
      this.$emit("getCurrentRow", row);
    },
    hideColum(columnName, flag, name) {
      this.copyOption.column.forEach((item) => {
        if (item.prop === columnName) {
          this.$set(item, name, !flag);
        }
      });
    },
    isShowSearch() {
      this.isSearchFlag = !this.isSearchFlag;
    },
    setColum() {
      this.dialogFlag = true;
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box-card {
  ::v-deep .el-card__header {
    border-bottom: none;
  }
  ::v-deep .el-card__body {
    padding: 0 20px;
  }
  .action {
    display: flex;
    justify-content: space-between;
  }
  .info {
    margin-top: 10px;
    .el-alert--success.is-light {
      background-color: #ecf5ff;
      color: #409eff;
      border-color: #d9ecff;
    }
    .el-alert {
      padding: 0;
    }
    .alert-title {
      display: flex;
      p {
        margin: 0;
        padding: 0;
        line-height: 32px;
        font-weight: 700;
        span {
          font-size: 14px;
          padding: 0 5px;
        }
      }
      button {
        font-weight: 700;
        margin-left: 10px;
      }
    }
  }
}
.header-tt {
  position: relative;
  padding: 15px 20px;
  h5 {
    margin: 0;
    padding: 0;
  }
}
.search-box {
  padding: 10px 0;
}
</style>
