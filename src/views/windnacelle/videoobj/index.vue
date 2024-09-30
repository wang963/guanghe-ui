<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="监控ID" prop="cameraId">
        <el-input
          v-model="queryParams.cameraId"
          placeholder="请输入监控ID"
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
          v-hasPermi="['windnacelle:videoobj:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['windnacelle:videoobj:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['windnacelle:videoobj:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['windnacelle:videoobj:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleVideoDetection"
          v-hasPermi="['windnacelle:videoobj:remove']"
        >视频检测
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleVideoEnhancement"
          v-hasPermi="['windnacelle:videoobj:remove']"
        >视频增强
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="videoobjList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="视频地址" align="center" prop="videoPath" v-if="videoobjList.length > 0"/>
      <el-table-column label="监控ID" align="center" prop="cameraId" v-if="videoobjList.length > 0"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['windnacelle:videoobj:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['windnacelle:videoobj:remove']"
          >删除
          </el-button>
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
    <!-- 添加或修改视频检测对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="视频地址" prop="videoPath">
          <el-input v-model="form.videoPath" placeholder="请输入视频地址"/>
        </el-form-item>
        <el-form-item label="监控id" prop="cameraId">
          <el-select v-model="form.cameraId" placeholder="请选择监控id">
            <el-option v-for="dict in cameras" :key="dict.cameraId" :label="dict.cameraName"
                       :value="dict.cameraId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测时长" prop="detectTime">
          <el-input v-model="form.detectTime" placeholder="请输入检测时长"/>
        </el-form-item>
        <el-form-item label="是否保存" prop="saveVideo">
          <el-select v-model="form.saveVideo" placeholder="请选择是否保存">
            <el-option
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 视频检测弹窗 -->
    <el-dialog :title="title" :visible.sync="enhance_open" width="300px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-form-item label="是否保存" prop="enhance_type">
          <el-select v-model="form.enhanceType" placeholder="请选择是否保存">
            <el-option label="True" value="True"></el-option>
            <el-option label="False" value="False"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detection">确 定</el-button>
        <el-button @click="cancelEnhanceType">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCameras,
  listVideoobj,
  getVideoobj,
  delVideoobj,
  addVideoobj,
  updateVideoobj,
  videoDetection,
  videoEnhancement
} from '@/api/windnacelle/videoobj'
export default {
  name: 'Videoobj',
  dicts: ['sys_yes_no'],
  data() {
    return {
      // 遮罩层
      loading: true,

      enhance_open: false,
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
      // 视频检测表格数据
      videoobjList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      cameras: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cameraId: null
      },
      // 表单参数
      form: {
        enhanceType: 'true'
      },
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
    getCameras().then(response => {
      this.cameras = response.rows
    })
  },
  methods: {
    /** 查询视频检测列表 */
    getList() {
      this.loading = true
      listVideoobj(this.queryParams).then(response => {
        this.videoobjList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        videoPath: null,
        cameraId: null,
        detectTime: null,
        saveVideo: null,
        timeStamp: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加视频检测'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getVideoobj(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改视频检测'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVideoobj(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addVideoobj(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            }).catch(error => {
              console.error(error); // 处理错误
              this.$modal.msgError('新增失败');
            });
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除视频检测编号为"' + ids + '"的数据项？').then(function() {
        return delVideoobj(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('windnacelle/videoobj/export', {
        ...this.queryParams
      }, `videoobj_${new Date().getTime()}.xlsx`)
    },
    /** 视频检测 */
    handleVideoDetection(row) {
      videoDetection(row).then(response => {
        this.form = response.data
      })
    },
    /** 视频增强 */
    handleVideoEnhancement(row) {
      videoEnhancement(row).then(response => {
        this.form = response.data
      })
    },
    detection(){
      // 获取用户选择的保存选项
      const saveOption = this.form.enhanceType;
      // 处理检测逻辑
      console.log("是否保存:", saveOption);
      // 这里可以添加 API 调用逻辑
    },
    cancelEnhanceType() {
      this.enhance_open = false; // 关闭弹窗
      this.form.enhanceType = ''; // 重置表单
    }
  }
}
</script>
