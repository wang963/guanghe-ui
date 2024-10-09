<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="告警时间" prop="alert_time">
        <el-date-picker clearable v-model="queryParams.alert_time" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择告警时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="设备名称" prop="device_name">
        <el-input v-model="queryParams.device_name" placeholder="请输入设备名称" clearable
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摄像头区域" prop="camera">
        <el-input v-model="queryParams.camera" placeholder="请输入摄像头区域" clearable
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['fanmonitor:alerts:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                   v-hasPermi="['fanmonitor:alerts:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="alertsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="风机编号" align="center" prop="fanName"/>
      <el-table-column label="告警时间" align="center" prop="alert_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.alert_time, '{y}-{m}-{d} {h}:{mi}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="摄像头区域" align="center" prop="camera"/>
      <!--      <el-table-column label="摄像头IP地址" align="center" prop="cam_ipv4"/>-->
      <el-table-column label="告警信息" align="center" prop="alg_name"/>
            <el-table-column label="告警图片" align="center" prop="imgpath">
              <template slot-scope="scope">
                <image-preview :src="scope.row.imgpath" :width="50" :height="50"
                               @click.native="openImagePreview(scope.row.imgpath, scope.row.id)"
                />
              </template>
            </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="openImagePreview(scope.row.imgpath, scope.row.id)"
            >查看
            </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popover
            placement="top"
            width="400"
            v-model="scope.row.visible"
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
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="scope.row.visible = false">确定</el-button>
            </div>
            <el-button size="mini" type="text" icon="el-icon-edit" slot="reference">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <image-preview-modal
      :visible.sync="isImagePreviewVisible"
      :imgSrc="currentImageSrc"
      :objs="objs"
    />

  </div>


</template>


<script>
import { listAlerts, delAlerts, listObjects } from '@/api/fanmonitor/alerts'
import ImagePreviewModal from '@/views/fanmonitor/alerts/ImagePreviewModal.vue' // 引入弹窗组件

export default {
  name: 'Alerts',
  components: {
    ImagePreviewModal // 注册弹窗组件
  }, data() {
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
      // 告警信息表格数据
      alertsList: [],
      // 弹出层标题
      title: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alert_time: null,
        device_name: null,
        camera: null,
        imgs: null,
        imgpath: null
      },
      // 表单参数
      form: {},
      isImagePreviewVisible: false, // 控制弹窗显示
      currentImageSrc: '', // 当前图片源
      objs: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询告警信息列表 */
    getList() {
      this.loading = true
      listAlerts(this.queryParams).then(response => {
        let result = response.rows
        result.forEach(item=>item.visible = false)
        this.alertsList = result
        this.total = response.total
        this.loading = false
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        alert_time: null,
        device_id: null,
        device_name: null,
        camera: null,
        cam_ipv4: null,
        alg_name: null,
        imgs: null
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除告警信息编号为"' + ids + '"的数据项？').then(function() {
        return delAlerts(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fanmonitor/alerts/export', {
        ...this.queryParams
      }, `alerts_${new Date().getTime()}.xlsx`)
    },
    /** 查询告警信息并绘制图片 */
    openImagePreview(imgSrc, alertId) {
      listObjects(alertId).then(response => {
        this.objs = response.rows // 假设返回的数据存储在 rows 中
        this.currentImageSrc = imgSrc // 设置当前图片源
        this.isImagePreviewVisible = true // 打开弹窗
      }).catch(error => {
        this.$modal.msgError('获取报警信息失败')
      })
    },

    handleCancel(row) {
      row.visible = false
    }
  }
}
</script>
