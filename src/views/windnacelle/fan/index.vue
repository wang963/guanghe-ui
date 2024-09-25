<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="风机编码" prop="fanName">
        <el-input
          v-model="queryParams.fanName"
          placeholder="请输入风机编码"
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
          v-hasPermi="['windnacelle:fan:add']"
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
          v-hasPermi="['windnacelle:fan:edit']"
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
          v-hasPermi="['windnacelle:fan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['windnacelle:fan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="风机名称" align="center" prop="fanName" width="230" show-overflow-tooltip/>
      <el-table-column label="电站" align="center" prop="siteName" width="230" show-overflow-tooltip/>
      <el-table-column label="线路" align="center" prop="lineName" width="180" show-overflow-tooltip/>
      <el-table-column label="装机容量" align="center" prop="capacity" />
      <el-table-column label="经度" align="center" prop="latitude" />
      <el-table-column label="纬度" align="center" prop="longitude" />
      <el-table-column label="机型" align="center" prop="fanModel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_fan_model" :value="scope.row.fanModel"/>
        </template>
      </el-table-column>
      <el-table-column label="品牌型号" align="center" prop="fanBrand">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_fan_brand" :value="scope.row.fanBrand"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['windnacelle:fan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['windnacelle:fan:remove']"
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

    <!-- 添加或修改风机维护对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="风机名称" prop="fanName">
          <el-input v-model="form.fanName" placeholder="请输入风机名称" />
        </el-form-item>
        <el-form-item label="装机容量" prop="capacity">
          <el-input v-model="form.capacity" placeholder="请输入装机容量" />
        </el-form-item>
        <el-form-item label="所属场站" prop="siteId">
          <el-select v-model="form.siteId"  placeholder="请选择场站">
                <el-option
                  v-for="item in siteOptions"
                  :key="item.siteId"
                  :label="item.siteName"
                  :value="item.siteId"
                ></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="所属线路" prop="lineId">
          <el-select v-model="form.lineId"  placeholder="请选择线路">
                <el-option
                  v-for="item in lineOptions"
                  :key="item.lineId"
                  :label="item.lineName"
                  :value="item.lineId"
                ></el-option>
              </el-select>
        </el-form-item>

        <el-form-item label="经度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="机型" prop="fanModel">
          <el-select v-model="form.fanModel" placeholder="请选择机型">
            <el-option
              v-for="dict in dict.type.sys_fan_model"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌型号" prop="fanBrand">
          <el-select v-model="form.fanBrand" placeholder="请选择品牌型号">
            <el-option
              v-for="dict in dict.type.sys_fan_brand"
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
  </div>
</template>

<script>
import { listFan,listLine,listSite,getFan, delFan, addFan, updateFan } from "@/api/windnacelle/fan";

export default {
  name: "Fan",
  dicts: ['sys_fan_model', 'sys_fan_brand'],
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
      // 风机维护表格数据
      fanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 站点选项
      siteOptions: [],
      // 线路选项
      lineOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fanName: null,
        lineId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fanName: [
          { required: true, message: "风机编码不能为空", trigger: "blur" }
        ],
        lineId: [
          { required: true, message: "线路不能为空", trigger: "blur" }
        ],

        siteId: [
          { required: true, message: "电站不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    listSite().then(response => {
      this.siteOptions = response.rows;
    });
    listLine().then(response => {
      this.lineOptions = response.rows;
    });
  },
  methods: {
    /** 查询风机维护列表 */
    getList() {
      this.loading = true;
      listFan(this.queryParams).then(response => {
        this.fanList = response.rows;
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
        fanId: null,
        fanName: null,
        siteId: null,
        lineId: null,
        capacity: null,
        latitude: null,
        longitude: null,
        fanModel: null,
        fanBrand: null
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
      this.ids = selection.map(item => item.fanId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加风机维护";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fanId = row.fanId || this.ids
      getFan(fanId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改风机维护";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fanId != null) {
            updateFan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFan(this.form).then(response => {
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
      const fanIds = row.fanId || this.ids;
      this.$modal.confirm('是否确认删除风机维护编号为"' + fanIds + '"的数据项？').then(function() {
        return delFan(fanIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('windnacelle/fan/export', {
        ...this.queryParams
      }, `fan_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
