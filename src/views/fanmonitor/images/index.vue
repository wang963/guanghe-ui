<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="图片名" prop="imageName">
        <el-input v-model="queryParams.imageName" placeholder="请输入图片名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt">
        <el-date-picker clearable v-model="queryParams.updatedAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['fanmonitor:images:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['fanmonitor:images:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['fanmonitor:images:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['fanmonitor:images:export']">导出</el-button>
      </el-col>
      <!-- 识别信息 -->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-camera" size="mini" :disabled="multiple" @click="showEnhanceType('detection')"
          v-hasPermi="['fanmonitor:images:detection']">图片检测</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-picture" size="mini" :disabled="multiple" @click="showEnhanceType('enhance')"
          v-hasPermi="['fanmonitor:images:detection']">图片增强</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="imagesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="图片地址" align="center" prop="imagePath" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imagePath" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="图片名" align="center" prop="imageName" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['fanmonitor:images:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['fanmonitor:images:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改图片识别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="图片地址" prop="imagePath">
          <image-upload v-model="form.imagePath" />
        </el-form-item>
        <el-form-item label="图片名" prop="imageName">
          <el-input v-model="form.imageName" placeholder="请输入图片名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  增强类型选择框  -->
    <el-dialog :title="title" :visible.sync="enhance_open" width="300px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-form-item label="增强类型" prop="enhance_type">
          <el-select v-model="enhance_type">
            <el-option
              v-for="dict in dict.type.img_enhance_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEnhanceType">确 定</el-button>
        <el-button @click="cancelEnhanceType">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listImages, getImages, delImages, addImages, updateImages, detectImg, enhanceImg } from "@/api/fanmonitor/images";

export default {
  name: "Images",
  dicts: ['img_enhance_type'],
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
      // 图片识别表格数据
      imagesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示选择增强类型界面
      enhance_open: false,
      enhance_type: 'None',
      operation: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        imageName: null,
        createdAt: null,
        updatedAt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        imagePath: [
          { required: true, message: "图片地址不能为空", trigger: "blur" }
        ],
        imageName: [
          { required: true, message: "图片名不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询图片识别列表 */
    getList() {
      this.loading = true;
      listImages(this.queryParams).then(response => {
        this.imagesList = response.rows;
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
        id: null,
        imagePath: null,
        imageName: null,
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
      this.reset();
      this.open = true;
      this.title = "添加图片识别";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getImages(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改图片识别";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateImages(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addImages(this.form).then(response => {
              if (response.code != 500) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError("请求失败");
              }

            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除图片识别编号为"' + ids + '"的数据项？').then(function () {
        return delImages(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fanmonitor/images/export', {
        ...this.queryParams
      }, `images_${new Date().getTime()}.xlsx`)
    },

    /* 打开选择增强类型对话框 */
    showEnhanceType(operation) {
      this.operation = operation
      this.enhance_open = true
      this.title = "选择增强类型"
    },

    /* 选择增强类型_取消 */
    cancelEnhanceType() {
      this.enhance_open = false
      this.enhance_type = 'None'
      this.title = ''
      this.operation = ''
    },

    /* 选择增强类型_确定 */
    submitEnhanceType() {
      if (this.operation == 'detection') {
          this.detection()
      } else if (this.operation == 'enhance') {
          this.enhance()
      }
      this.operation = ''
    },

    /** 调用图片检测接口 */
    detection() {
      // 直接调用 detectionimg 函数
      detectImg(this.ids, this.enhance_type)
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("识别成功");
        })
        .catch(() => {
          this.$modal.msgError("识别失败");
        }).finally(() => {
          this.enhance_open = false
      })
    },

    /** 调用图片增强接口 */
    enhance() {
      // 直接调用 detectionimg 函数
      enhanceImg(this.ids, this.enhance_type)
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("增强成功");
        })
        .catch(() => {
          this.$modal.msgError("增强失败");
        }).finally(() => {
        this.enhance_open = false
      })
    }

  }
};
</script>
