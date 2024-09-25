<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="监控id" prop="cameraId">
        <el-select v-model="queryParams.cameraId" placeholder="请选择监控id" clearable>
          <el-option v-for="dict in cameras" :key="dict.cameraId" :label="dict.cameraName" :value="dict.cameraId" />
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入IP地址" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="APP" prop="app">
        <el-input v-model="queryParams.app" placeholder="请输入APP" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="stream" prop="stream">
        <el-input v-model="queryParams.stream" placeholder="请输入stream" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="视频流" prop="streamUrl">
        <el-input v-model="queryParams.streamUrl" placeholder="请输入视频流" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="算法ID" prop="algorithmId">
        <el-input v-model="queryParams.algorithmId" placeholder="请输入算法ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="置信度" prop="confidence">
        <el-input v-model="queryParams.confidence" placeholder="请输入置信度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="告警间隔" prop="alarmIntervalSeconds">
        <el-input v-model="queryParams.alarmIntervalSeconds" placeholder="请输入告警间隔" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt">
        <el-date-picker clearable v-model="queryParams.updatedAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['fanmonitor:camera:add']">新增拉流配置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['fanmonitor:camera:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['fanmonitor:camera:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['fanmonitor:camera:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="updateForAlgorithm"
          v-hasPermi="['fanmonitor:camera:edit']">新增算法配置</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cameraList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监控名称" align="center" prop="cameraName">
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.cameras" :value="scope.row.cameraId "/>
        </template> -->
      </el-table-column>
      <el-table-column label="IP地址" align="center" prop="ip" />
      <el-table-column label="APP" align="center" prop="app" />
      <el-table-column label="stream" align="center" prop="stream" />
      <el-table-column label="视频流" align="center" prop="streamUrl" />
      <el-table-column label="算法ID" align="center" prop="algorithmId" />
      <el-table-column label="置信度" align="center" prop="confidence" />
      <el-table-column label="告警间隔" align="center" prop="alarmIntervalSeconds" />
      <el-table-column label="告警区域" align="center" prop="alarmArea" />
      <!-- <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['fanmonitor:camera:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="submitDeleteStream(scope.row)"
            v-hasPermi="['fanmonitor:camera:remove']">删除拉流配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改摄像机配置信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="监控id" prop="cameraId">
          <el-select v-model="form.cameraId" placeholder="请选择监控id">
            <el-option v-for="dict in cameras" :key="dict.cameraId" :label="dict.cameraName"
              :value="dict.cameraId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="APP" prop="app">
          <el-input v-model="form.app" placeholder="请输入APP" />
        </el-form-item>
        <el-form-item label="stream" prop="stream">
          <el-input v-model="form.stream" placeholder="请输入stream" />
        </el-form-item>
        <el-form-item label="视频流" prop="streamUrl">
          <el-input v-model="form.streamUrl" placeholder="请输入视频流" />
        </el-form-item>
        <!-- <el-form-item label="算法ID" prop="algorithmId">
          <el-input v-model="form.algorithmId" placeholder="请输入算法ID" />
        </el-form-item>
        <el-form-item label="置信度" prop="confidence">
          <el-input v-model="form.confidence" placeholder="请输入置信度" />
        </el-form-item>
        <el-form-item label="告警间隔" prop="alarmIntervalSeconds">
          <el-input v-model="form.alarmIntervalSeconds" placeholder="请输入告警间隔" />
        </el-form-item>
        <el-form-item label="告警区域" prop="alarmArea">
          <el-input v-model="form.alarmArea" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增算法配置  -->
    <el-dialog :title="title" :visible.sync="opened" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules2" label-width="80px">
        <el-form-item label="监控id" prop="cameraId">
          <el-select v-model="form.cameraId" placeholder="请选择监控id">
            <el-option v-for="dict in cameras" :key="dict.cameraId" :label="dict.cameraName"
              :value="dict.cameraId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" readonly="" />
        </el-form-item>
        <el-form-item label="APP" prop="app">
          <el-input v-model="form.app" placeholder="请输入APP" readonly="" />
        </el-form-item>
        <el-form-item label="stream" prop="stream">
          <el-input v-model="form.stream" placeholder="请输入stream" readonly="" />
        </el-form-item>
        <el-form-item label="视频流" prop="streamUrl">
          <el-input v-model="form.streamUrl" placeholder="请输入视频流" readonly="" />
        </el-form-item>
        <el-form-item label="算法ID" prop="algorithmId">
          <el-input v-model="form.algorithmId" placeholder="请输入算法ID" />
        </el-form-item>
        <el-form-item label="置信度" prop="confidence">
          <el-input v-model="form.confidence" placeholder="请输入置信度" />
        </el-form-item>
        <el-form-item label="告警间隔" prop="alarmIntervalSeconds">
          <el-input v-model="form.alarmIntervalSeconds" placeholder="请输入告警间隔" />
        </el-form-item>
        <el-form-item label="告警区域" prop="alarmArea">
          <el-input v-model="form.alarmArea" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAlgorithm">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCameras, listCamera, getCamera, delCamera, addCamera, updateCamera, addAlgorithm,deleteStream } from "@/api/fanmonitor/camera";

export default {
  name: "Camera",
  dicts: ['sys_camera'],
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
      // 摄像机配置信息表格数据
      cameraList: [],
      cameras: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      opened: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cameraId: null,
        ip: null,
        app: null,
        stream: null,
        streamUrl: null,
        algorithmId: null,
        confidence: null,
        alarmIntervalSeconds: null,
        alarmArea: null,
        createdAt: null,
        updatedAt: null
      },
      // 表单参数
      form: {},
      // 新增拉流配置表单校验
      rules: {
        cameraId: [
          { required: true, message: "监控id不能为空", trigger: "change" }
        ],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        app: [
          { required: true, message: "APP不能为空", trigger: "blur" }
        ],
        stream: [
          { required: true, message: "stream不能为空", trigger: "blur" }
        ],
        streamUrl: [
          { required: true, message: "视频流不能为空", trigger: "blur" }
        ],
      },
      //新增算法配置表单检验
      rules2: {
        algorithmId: [
          { required: true, message: "算法id不能为空", trigger: "change" }
        ],
        confidence: [
          { required: true, message: "置信度不能为空", trigger: "blur" }
        ],
        alarmIntervalSeconds: [
          { required: true, message: "告警间隔不能为空", trigger: "blur" }
        ],
        alarmArea: [
          { required: true, message: "告警区域不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    getCameras().then(response => {
      this.cameras = response.rows;
    })
  },
  methods: {
    /** 查询摄像机配置信息列表 */
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
    cancelAdd() {
      this.opened = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        cameraId: null,
        ip: null,
        app: null,
        stream: null,
        streamUrl: null,
        algorithmId: null,
        confidence: null,
        alarmIntervalSeconds: null,
        alarmArea: null,
        createdAt: null,
        updatedAt: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      debugger;
      this.reset();
      this.open = true;
      this.title = "添加摄像机配置信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCamera(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改摄像机配置信息";
      });
    },
    /** 新增算法配置按钮操作 */
    updateForAlgorithm(row) {
      this.reset();
      const id = row.id || this.ids
      getCamera(id).then(response => {
        this.form = response.data;
        this.opened = true;
        this.title = "新增算法配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCamera(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            })
              .catch(error => {
                this.open = false;
                this.$modal.msgError("修改失败: " + (error.response ? error.response.data.message : "未知错误"));
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

    /** 新增算法配置 */
    addAlgorithm() {
      setTimeout(() => {
        this.opened = false;
      },100)
      addAlgorithm(this.form).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.opened = false;
        this.getList();
      })
        .catch(error => {
          this.open = false;
          this.$modal.msgError("修改失败: " + (error.response ? error.response.data.message : "未知错误"));
        }
        );
    },



    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除摄像机配置信息编号为"' + ids + '"的数据项？').then(function () {
        return delCamera(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fanmonitor/camera/export', {
        ...this.queryParams
      }, `camera_${new Date().getTime()}.xlsx`)
    },
    submitDeleteStream(row){
      const id = row.id;
      deleteStream(id).then(response => {
        this.$modal.msgSuccess("删除成功");
        this.getList();
      })
    }
  }
}

</script>
