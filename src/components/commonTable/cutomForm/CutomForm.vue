<template>
  <div>
    <el-form
      :label-width="labelWidth || '100px'"
      :inline="true"
      :model="formObj"
      :rules="rules"
      ref="elForm"
    >
      <el-row>
        <template v-for="item in formArr">
          <CutomFormItem
            :raw="item"
            :key="item.prop"
            :isSearch="isSearch"
            :formObj="formObj"
            :searchCol="searchCol"
            ref="formItem"
            @changeValue="changeValue"
            @changeDisRelated="changeDisRelated"
          ></CutomFormItem>
        </template>
        <template>
          <el-col
            :offset="searchBtnOffset || 0"
            :span="actionSpan || 4"
            v-if="isSearch"
          >
            <div style="text-align: right; margin-right: 10px">
              <el-button
                type="primary"
                @click="onSubmit"
                size="small"
                icon="el-icon-search"
                >查询</el-button
              >
              <el-button size="small" icon="el-icon-delete" @click="clear"
                >清空</el-button
              >
            </div>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import CutomFormItem from "./CutomFormItem.vue";
export default {
  props: {
    formArr: {
      type: Array,
    },
    isSearch: {
      type: Boolean,
      default: true,
    },
    editData: {
      type: Object,
    },
    searchCol: {
      type: Number,
    },
    labelWidth: {
      type: String,
    },
    actionSpan: {
      type: String,
    },
    searchBtnOffset: {
      type: String,
    },
  },
  components: {
    CutomFormItem,
  },
  data() {
    return {
      formObj: {},
      rules: {},
    };
  },
  created() {
    this.formArr.forEach((item) => {
      this.$set(this.formObj, item.prop, "");
      if (this.editData) {
        if (typeof this.editData[item.prop] === "boolean") {
          this.$set(this.formObj, item.prop, this.editData[item.prop]);
        } else {
          this.$set(this.formObj, item.prop, this.editData[item.prop] || "");
        }
      }
      if (!this.isSearch) {
        if (item.rules && item.rules.length) {
          this.rules[item.prop] = item.rules;
        }
      }
    });
  },
  methods: {
    onSubmit() {
      this.$emit("searchTable", this.formObj);
    },
    changeDisRelated(val, prop) {
      this.formArr.forEach((item, index) => {
        if (item.prop === prop) {
          item.disabled = val;
          this.formObj[prop] = "";
          this.$refs.formItem[index].input = "";
        }
      });
    },
    clear() {
      Object.keys(this.formObj).forEach((item) => {
        if (typeof this.formObj[item] !== "boolean") {
          this.$set(this.formObj, item, "");
        }
      });
      this.$refs.formItem.forEach((item) => {
        item.input = "";
        item.checkedList = [];
      });
      this.$emit("searchTable", this.formObj);
    },
    changeValue(key, value, flag) {
      if (!this.isSearch) {
        Object.keys(this.editData).forEach((item) => {
          if (item + "Name" === key) {
            this.editData[item] = value;
          }
        });
        this.editData[key] = value;
      }
      this.$set(this.formObj, key, value);
      if (flag) {
        this.$emit("searchTable", this.formObj);
      }
    },
    validate() {
      return this.$refs.elForm.validate();
    },
  },
};
</script>

<style lang="scss" scoped></style>
