<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部件名称" prop="componentName">
        <el-select v-model="queryParams.componentName" placeholder="请选择部件名称" clearable>
          <el-option
            v-for="dict in dict.type.sys_wind_component"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="厂家" prop="componentFactory">
        <el-input
          v-model="queryParams.componentFactory"
          placeholder="请输入厂家"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="型号" prop="componentModel">
        <el-input
          v-model="queryParams.componentModel"
          placeholder="请输入型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['windnacelle:component:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['windnacelle:component:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['windnacelle:component:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['windnacelle:component:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="componentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="风机" align="center" prop="fanName" />
      <el-table-column label="部件名称" align="center" prop="componentName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_wind_component" :value="scope.row.componentName"/>
        </template>
      </el-table-column>
      <el-table-column label="厂家" align="center" prop="componentFactory" />
      <el-table-column label="型号" align="center" prop="componentModel" show-overflow-tooltip/>
      <el-table-column label="温度上限" align="center" prop="temperatureUpper" />
      <el-table-column label="温度下限" align="center" prop="temperatureLower" />
      <el-table-column label="部件照片" align="center" prop="cimage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.cimage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="关联摄像头" align="center" prop="cameraId" />
      <el-table-column label="关联视频标记" align="center" prop="cameraTag" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['windnacelle:component:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['windnacelle:component:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改风机部件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择风机" prop="fanId">
          <el-select v-model="form.fanId"  placeholder="选择风机">
                <el-option
                  v-for="item in fanOptions"
                  :key="item.fanId"
                  :label="item.fanName"
                  :value="item.fanId"
                ></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="部件名称" prop="componentName">
          <el-select v-model="form.componentName" placeholder="请选择部件名称">
            <el-option
              v-for="dict in dict.type.sys_wind_component"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家" prop="componentFactory">
          <el-input v-model="form.componentFactory" placeholder="请输入厂家" />
        </el-form-item>
        <el-form-item label="型号" prop="componentModel">
          <el-input v-model="form.componentModel" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="温度上限" prop="temperatureUpper">
          <el-input v-model="form.temperatureUpper" placeholder="请输入温度上限" />
        </el-form-item>
        <el-form-item label="温度下限" prop="temperatureLower">
          <el-input v-model="form.temperatureLower" placeholder="请输入温度下限" />
        </el-form-item>
        <el-form-item label="部件照片" prop="cimage">
          <image-upload v-model="form.cimage"/>
        </el-form-item>
        <el-form-item label="关联视频" prop="cameraTag">
          <el-input v-model="form.cameraTag" placeholder="请输入关联视频标记" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listComponent,listFan, getComponent, delComponent, addComponent, updateComponent } from "@/api/windnacelle/component";

export default {
  name: "Component",
  dicts: ['sys_wind_component'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 风机部件表格数据
      componentList: [],
     // 线路选项
      fanOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fanId: null,
        componentName: null,
        componentFactory: null,
        componentModel: null,
        temperatureUpper: null,
        temperatureLower: null,
        cimage: null,
        cameraId: null,
        cameraTag: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fanId: [
          { required: true, message: "风机不能为空", trigger: "change" }
        ],
        componentName: [
          { required: true, message: "部件名称不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    listFan().then(response => {
      this.fanOptions = response.rows;
    });
  },
  methods: {
    /** 查询风机部件列表 */
    getList() {
      this.loading = true;
      listComponent(this.queryParams).then(response => {
        this.componentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        componentId: null,
        fanId: null,
        componentName: null,
        componentFactory: null,
        componentModel: null,
        temperatureUpper: null,
        temperatureLower: null,
        cimage: null,
        cameraId: null,
        cameraTag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.componentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加风机部件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const componentId = row.componentId || this.ids
      getComponent(componentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改风机部件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.componentId != null) {
            updateComponent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addComponent(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const componentIds = row.componentId || this.ids;
      this.$modal.confirm('是否确认删除风机部件编号为"' + componentIds + '"的数据项？').then(function() {
        return delComponent(componentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('windnacelle/component/export', {
        ...this.queryParams
      }, `component_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
