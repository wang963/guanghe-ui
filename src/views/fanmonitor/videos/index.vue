<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <div class="videoArea">
        <!--
            <div class="gridBtn">
                <span>布局：</span>
                <span @click='splitScreen(24, 1)' :span='4' class='splitClass'><img :src="require('@/assets/images/1.png')"> 1 x 1</span>
                <span @click='splitScreen(12, 4)' :span='4' class='splitClass'><img :src="require('@/assets/images/1.png')"> 2 x 2</span>
                <span @click='splitScreen(8, 9)' :span='4' class='splitClass'><img :src="require('@/assets/images/1.png')"> 3 x 3</span>
                <span @click='splitScreen(6, 16)' :span='4' class='splitClass'><img :src="require('@/assets/images/1.png')"> 4 x 4</span>
              </div>
        -->
            <div class="playerList">
                <el-row>
                  <el-col :span="colSpan" v-for="i in playerNum" :key="i">
                    <el-card size="small" :class="{selectedCard: currentIndex === i}" :title="'视频监控'">
                      <easy-player
                        ref="player"
                        :video-title="videoList[i-1] ? videoList[i-1].title : ''"
                        :video-url="videoList[i-1] ?  videoList[i-1].url : ''"
                        style="height: 460px"
                        :autoplay="autoplay"
                        :muted="muted"
                        @error="restartPlayer"
                        @ended="restartPlayer"
                        />
                    </el-card>
                  </el-col>
                </el-row>
              </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {

  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: {
    EasyPlayer: () => import('@easydarwin/easyplayer'),
    Treeselect
    },
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },

     	 // 分屏布局
        playerNum: 2,
        colSpan: 12,
        currentIndex: 1,
         // 视频播放器
 	    	muted: false,
        autoplay: true,
        videoList: [
          { title: '视频1', url: 'http://vjs.zencdn.net/v/oceans.mp4'},
          { title: '视频2', url: 'http://data.mars3d.cn/file/video/lukou.mp4'},
          { title: '视频3', url: 'http://vjs.zencdn.net/v/oceans.mp4'}
		]

    };
  },

  created() {
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    	  splitScreen(span, num) {
        this.colSpan = span
        this.playerNum = num
        if (this.currentIndex > num) {
          this.currentIndex = 1
        }
      },
      restartPlayer() {
        let [player] = this.$refs.player
        player = player.getVueInstance()
        player.initPlayer()  // 重新初始化播放器
      },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

  }
};
</script>
