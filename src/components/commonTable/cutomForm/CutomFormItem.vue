<template>
  <el-col :span="colWidth">
    <el-form-item
      :label="raw.label"
      :class="{ 'mr-b': isSearch }"
      v-if="raw.type === 'input' || !raw.type"
      :prop="raw.prop"
    >
      <el-input
        v-model="input"
        clearable
        :placeholder="`请输入${raw.label}`"
        :disabled="raw.disabled"
        size="small"
        @change="changeValue"
      ></el-input>
    </el-form-item>
    <el-form-item
      :class="{ 'mr-b': isSearch }"
      :label="raw.label"
      v-if="raw.type === 'textarea'"
      :prop="raw.prop"
    >
      <el-input
        v-model="input"
        type="textarea"
        clearable
        :placeholder="`请输入${raw.label}`"
        size="small"
        @change="changeValue"
      ></el-input>
    </el-form-item>
    <el-form-item
      :class="{ 'mr-b': isSearch }"
      :label="raw.label"
      v-if="raw.type === 'select'"
      :prop="raw.prop"
    >
      <el-select
        v-model="input"
        clearable
        :placeholder="`请选择${raw.label}`"
        @change="changeValue"
        size="small"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in optionList"
          :key="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="raw.label"
      :class="{ 'mr-b': isSearch }"
      v-if="raw.type === 'checked'"
      :prop="raw.prop"
    >
      <el-checkbox-group v-model="checkedList">
        <el-checkbox
          @change="changeList"
          :label="item.value"
          :name="raw.prop"
          v-for="item in raw.checkList"
          :key="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
      <!-- <el-input
          v-model="input"
          clearable
          :placeholder="`请输入${raw.label}`"
          size="small"
          @change="changeValue"
        ></el-input> -->
    </el-form-item>
    <el-form-item
      :class="{ 'mr-b': isSearch }"
      :label="raw.label"
      v-if="raw.type === 'selectMore'"
      :prop="raw.prop"
    >
      <el-select
        v-model="selectMore"
        multiple
        placeholder="请选择"
        collapse-tags
        :popper-append-to-body="false"
        @remove-tag="removeTag"
      >
        <el-option
          v-for="item in optionList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <el-checkbox v-model="item.check" @change="isChecked(item)">
            {{ item.label }}
          </el-checkbox>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :class="{ 'mr-b': isSearch }"
      :label="raw.label"
      v-if="raw.type === 'switch'"
      :prop="raw.prop"
    >
      <el-switch v-model="switchVal" @change="switchValue"></el-switch>
    </el-form-item>
  </el-col>
</template>

<script>
// import request from "@/router/request";
import {commonGet} from "@/api/commonApi";
export default {
  props: {
    raw: {
      type: Object,
      require: true,
    },
    formObj: {
      type: Object,
    },
    isSearch: {
      type: Boolean,
      default: true,
    },
    searchCol: {
      type: Number,
    },
  },
  computed: {
    colWidth() {
      let col = this.searchCol || 6;
      if (!this.isSearch) {
        col = 12;
        if (this.raw.span) {
          col = this.raw.span;
        }
      } else {
        if (this.raw.searchSpan) {
          col = this.raw.searchSpan;
        }
      }
      return col;
    },
  },
  data() {
    return {
      input: "",
      checkedList: [],
      optionList: [],
      selectMore: [],
      switchVal: true,
    };
  },
  created() {
    this.input = this.formObj[this.raw.prop] || "";
    if (this.raw.type === "switch") {
      if (this.isSearch) {
        this.switchVal = this.raw.defaultValue !== false;
        this.$emit("changeValue", this.raw.prop, this.switchVal);
      } else {
        console.log(this.formObj);
        this.switchVal = this.formObj[this.raw.prop];
      }
    }
    if (this.raw.isDeault) {
      this.selectMore = this.raw.isDeault;
      this.$emit("changeValue", this.raw.prop, this.selectMore);
    }
    if (this.raw.disList) {
      this.optionList = this.raw.disList;
    }
    if (this.raw.deafultValue) {
      this.input = this.raw.deafultValue;
      this.$emit("changeValue", this.raw.prop, this.input);
    }
    if (this.raw.dicUrl) {
      let props = this.raw.props;
      commonGet(this.raw.dicUrl).then((res) => {
        let result = res.data;
        if (result.code === 200) {
          let list = result.data;
          this.optionList = list.map((item) => {
            let check = false;
            if (this.raw.isDeault) {
              check = this.raw.isDeault.includes(item[props.value]);
            }
            return {
              label: item[props.label],
              value: item[props.value],
              check,
            };
          });
        }
      });
    }
  },
  methods: {
    changeList(val) {
      if (this.raw.related) {
        this.$emit("changeDisRelated", val, this.raw.related);
      }
      this.$emit("changeValue", this.raw.prop, this.checkedList);
    },
    changeValue() {
      this.$emit("changeValue", this.raw.prop, this.input);
    },
    switchValue() {
      this.$emit("changeValue", this.raw.prop, this.switchVal, this.isSearch);
    },
    isChecked(item) {
      if (item.check && this.selectMore.indexOf(item.value) == -1) {
        this.selectMore.push(item.value);
      } else if (!item.check) {
        this.selectMore.forEach((elm, idx) => {
          if (elm == item.value) {
            this.selectMore.splice(idx, 1);
          }
        });
      }
      this.$emit("changeValue", this.raw.prop, this.selectMore);
    },
    removeTag(value) {
      this.optionList.forEach((elm) => {
        if (elm.value == value) {
          elm.check = false;
        }
      });
      this.$emit("changeValue", this.raw.prop, this.selectMore);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  display: flex !important;
}
.mr-b {
  margin-bottom: 0 !important;
}
::v-deep .el-form-item__content {
  flex: 1;
}
::v-deep .el-form-item__label {
  width: 120px;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-select-dropdown__item {
  padding-left: 10px !important;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}
</style>
