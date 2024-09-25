<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['windnacelle:camera:add']"
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
          v-hasPermi="['windnacelle:camera:edit']"
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
          v-hasPermi="['windnacelle:camera:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['windnacelle:camera:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cameraList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监控编号" align="center" prop="cameraName" />
      <el-table-column label="所属风机" align="center" prop="fanName" />
      <el-table-column label="安装位置" align="center" prop="position" />
      <el-table-column label="监控类型" align="center" prop="cameraType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_camera_type" :value="scope.row.cameraType"/>
        </template>
      </el-table-column>
      <el-table-column label="视频URL" align="center" prop="cameraUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['windnacelle:camera:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['windnacelle:camera:remove']"
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

    <!-- 添加或修改视频维护对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="监控编号" prop="cameraName">
          <el-input v-model="form.cameraName" placeholder="请输入监控编号" />
        </el-form-item>
        <el-form-item label="所属风机" prop="fanId">
          <el-select v-model="form.fanId"  placeholder="请选择风机">
                <el-option
                  v-for="item in fanOptions"
                  :key="item.fanId"
                  :label="item.fanName"
                  :value="item.fanId"
                ></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="视频类型" prop="cameraType">
          <el-select v-model="form.cameraType" placeholder="请选择视频类型">
            <el-option
              v-for="dict in dict.type.sys_camera_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入安装位置" />
        </el-form-item>
        <el-form-item label="视频URL" prop="cameraUrl">
          <el-input v-model="form.cameraUrl" placeholder="请输入视频URL" />
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
import { listCamera,listFan, getCamera, delCamera, addCamera, updateCamera } from "@/api/windnacelle/camera";

export default {
  name: "Camera",
  dicts: ['sys_camera_type'],
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
      // 视频维护表格数据
      cameraList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fanId: null,
      },
      // 线路选项
       fanOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cameraName: [
          { required: true, message: "监控编号不能为空", trigger: "blur" }
        ],
        cameraType: [
          { required: true, message: "监控类型不能为空", trigger: "change" }
        ],
        cameraUrl: [
          { required: true, message: "视频URL不能为空", trigger: "blur" }
        ]
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
    /** 查询视频维护列表 */
    getList() {
      this.loading = true;
      listCamera(this.queryParams).then(response => {
        this.cameraList = response.rows;
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
        cameraId: null,
        cameraName: null,
        fanId: null,
        position: null,
        cameraType: null,
        cameraUrl: null
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
      this.ids = selection.map(item => item.cameraId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加视频维护";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cameraId = row.cameraId || this.ids
      getCamera(cameraId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改视频维护";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cameraId != null) {
            updateCamera(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCamera(this.form).then(response => {
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
      const cameraIds = row.cameraId || this.ids;
      this.$modal.confirm('是否确认删除视频维护编号为"' + cameraIds + '"的数据项？').then(function() {
        return delCamera(cameraIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('windnacelle/camera/export', {
        ...this.queryParams
      }, `camera_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
