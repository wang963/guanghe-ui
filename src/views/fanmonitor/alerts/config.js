export const option = {
  height: "auto", //高度自适应
  calcHeight: 250,
  searchMenuSpan: 4, // 查询表单的宽度
  alertShow: true, //阴影
  border: true, //边框
  index: true, //序号
  // selection: true, // 选择
  menuWidth: 400, // 操作栏宽度
  searchHide: false,//是否显示查询
  dialogWidth: 800, //新增编辑弹窗的宽度
  // dropSort: true, //拖拽
  column: [
    {
      label: "告警时间", //中文名称
      prop: "alert_time", //英文名称
      align: "left", //名称位置
      sortable: false, // 是否可以排序
      overHidden: true,
      search: true,
      width: 100, //表格宽度
      span: 24, // 查询条件宽度
    },
    {
      label: "设备名称",
      prop: "workOrderTask",
      align: "left",
      search: false,//是否是查询条件
      sortable: false,
      overHidden: true,
      width: 120,
      span: 24,
    },
    {
      label: "摄像头区域",
      prop: "camera",
      align: "left",
      search: false,
      sortable: false,
      overHidden: true,
      width: 300,
      span: 24,
    },
    {
      label: "风机编号",
      prop: "fanName",
      align: "left",
      search: false,
      sortable: false,
      overHidden: true,
      width: 100,
      span: 24,
    },
    {
      label: "告警信息",
      prop: "alg_name",
      align: "left",
      search: true,
      sortable: false,
      overHidden: true,
      width: 100,
      span: 24,
    },
  ],
};
