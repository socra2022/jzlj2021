<template>
  <div>
    <!-- 面包屑 -->
    <div id="title">
      <div class="crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-text"></i> 信息管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>电子联单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <span>申报编号：</span>
      <input
        v-model="select_APPLY_NO"
        type="text"
        class="input-style"
        placeholder="请输入申报编号"
      />
      <span>联单编号：</span>
      <input
        v-model="select_TRAN_ORDER_NO"
        type="text"
        class="input-style"
        placeholder="请输入联单编号"
      />
      <span>车牌号码：</span>
      <input
        v-model="select_VEHICLE_NO"
        type="text"
        class="input-style"
        placeholder="请输入车牌号码"
      />
      <span>工程名称：</span>
      <input
        v-model="select_CONSTRUCT_NAME"
        type="text"
        class="input-style"
        placeholder="请输入工程名称"
      />
    </div>
    <!-- 表格 -->
    <div id="mytable">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        max-height="600"
      >
        <el-table-column
          type="index"
          label="ID"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column prop="APPLY_NO" label="申报编号"></el-table-column>
        <el-table-column
          prop="APPLY_STATUS"
          label="车辆申报"
          :filters="[
            { text: '未申报', value: 0 },
            { text: '已申报', value: 1 },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.APPLY_STATUS === 0
                  ? 'info'
                  : scope.row.APPLY_STATUS === 1
                  ? 'success'
                  : ''
              "
              >{{ scope.row.APPLY_STATUS | APPLY_STATUS_Format }}</el-tag
            > </template
          >></el-table-column
        >
        <el-table-column
          prop="TRAN_ORDER_NO"
          label="联单编号"
        ></el-table-column>
        <el-table-column prop="SITE_COMFIRM" label="工地签认">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.SITE_COMFIRM === 0
                  ? 'info'
                  : scope.row.SITE_COMFIRM === 1
                  ? 'success'
                  : ''
              "
              >{{ scope.row.SITE_COMFIRM | SITE_COMFIRM_Format }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column prop="FIELD_COMFIRM" label="消纳场签认">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.FIELD_COMFIRM === 0
                  ? 'info'
                  : scope.row.FIELD_COMFIRM === 1
                  ? 'success'
                  : ''
              "
              >{{ scope.row.FIELD_COMFIRM | FIELD_COMFIRM_Format }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column prop="STATUS" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.STATUS === 1
                  ? 'success'
                  : scope.row.STATUS === 2
                  ? 'success'
                  : scope.row.STATUS === 3
                  ? 'success'
                  : scope.row.STATUS === 4
                  ? 'success'
                  : scope.row.STATUS === 5
                  ? 'success'
                  : scope.row.STATUS === 6
                  ? 'success'
                  : ''
              "
              >{{ scope.row.STATUS | STATUS_Format }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column prop="VEHICLE_NO" label="车牌号码"></el-table-column>
        <el-table-column prop="CAR_ATTRBUTE" label="车辆类型"></el-table-column>
        <el-table-column prop="CAR_QUALIFICATION" label="车辆资质">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.CAR_QUALIFICATION === 0
                  ? 'success'
                  : scope.row.CAR_QUALIFICATION === 1
                  ? 'danger'
                  : ''
              "
              >{{
                scope.row.CAR_QUALIFICATION | CAR_QUALIFICATION_Format
              }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column prop="COMPANY_QUALIFICATION" label="车企资质">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.COMPANY_QUALIFICATION === 0
                  ? 'success'
                  : scope.row.COMPANY_QUALIFICATION === 1
                  ? 'danger'
                  : ''
              "
              >{{
                scope.row.COMPANY_QUALIFICATION | COMPANY_QUALIFICATION_Format
              }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column
          prop="CONSTRUCT_NAME"
          label="工程名称"
        ></el-table-column>
        <el-table-column prop="CONSTRUCT_STATUS" label="工程状态">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.CONSTRUCT_STATUS === 0
                  ? 'success'
                  : scope.row.CONSTRUCT_STATUS === 1
                  ? 'danger'
                  : ''
              "
              >{{
                scope.row.CONSTRUCT_STATUS | CONSTRUCT_STATUS_Format
              }}</el-tag
            >
          </template>
          ></el-table-column
        >
        <el-table-column prop="SITE_NAME" label="工地名称"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="PageSize"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表格绑定样式
      headerStyle: {
        border: "0.093vh solid #067EA5",
        fontSize: "1.296vh",
        fontFamily: "Microsoft YaHei",
        fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: "3.333vh",
        textAlign: "center",
      },
      //行的样式
      cellStyle: {
        background: "rgb(34, 74, 138,0.1)",
        border: "0.093vh solid #067EA5",
        fontSize: "1.296vh",
        fontFamily: "Microsoft YaHei",
        fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: "3.333vh",
        textAlign: "center",
        height: "5.741vh",
      },
      // 渲染表格数据
      allData: [
        {
          APPLY_NO: 21025,
          APPLY_STATUS: 0,
          TRAN_ORDER_NO: 2020121203141212,
          SITE_COMFIRM: 1,
          FIELD_COMFIRM: 1,
          STATUS: 1,
          VEHICLE_NO: "鲁123456",
          CAR_ATTRBUTE: "新型泥头车",
          CAR_QUALIFICATION: 0,
          COMPANY_QUALIFICATION: 0,
          CONSTRUCT_NAME: "济宁市土建一工区",
          CONSTRUCT_STATUS: 0,
          SITE_NAME: "济宁市土建一工区",
        },
        {
          APPLY_NO: 21002,
          APPLY_STATUS: 0,
          TRAN_ORDER_NO: 2020121203141111,
          SITE_COMFIRM: 0,
          FIELD_COMFIRM: 0,
          STATUS: 2,
          VEHICLE_NO: "鲁120000",
          CAR_ATTRBUTE: "泥头车",
          CAR_QUALIFICATION: 1,
          COMPANY_QUALIFICATION: 0,
          CONSTRUCT_NAME: "济宁市土建一工区",
          CONSTRUCT_STATUS: 0,
          SITE_NAME: "深圳市土建一工区",
        },
        {
          APPLY_NO: 21026,
          APPLY_STATUS: 1,
          TRAN_ORDER_NO: 2020121203140000,
          SITE_COMFIRM: 1,
          FIELD_COMFIRM: 1,
          STATUS: 1,
          VEHICLE_NO: "鲁121111",
          CAR_ATTRBUTE: "新型泥头车",
          CAR_QUALIFICATION: 1,
          COMPANY_QUALIFICATION: 0,
          CONSTRUCT_NAME: "济宁市土建一工区",
          CONSTRUCT_STATUS: 1,
          SITE_NAME: "济宁市土建一工区",
        },
      ],
      tableData: [],
      subTableData: [],

      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 10, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 5,

      // 查询表单
      select_APPLY_NO: "",
      select_VEHICLE_NO: "",
      select_TRAN_ORDER_NO: "",
      select_CONSTRUCT_NAME: "",

      itemID: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      for (let i = 0; i < this.allData.length; i++) {
        this.allData[i].ID = i + 1;
      }
      // console.log(this.allData);
      this.tableData = JSON.parse(JSON.stringify(this.allData));
      this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      this.totalCount = this.allData.length;
    },

    // 前端分页功能
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },

    // 根据标签筛选
    filterTag(value, row) {
      return row.APPLY_STATUS === value;
      //   return row.SITE_COMFIRM === value;
    },
  },
  watch: {
    // 监听查询输入框--实现查询筛选功能
    select_APPLY_NO: function () {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_APPLY_NO;
      let input2 = this.select_VEHICLE_NO;
      let input3 = this.select_CONSTRUCT_NAME;
      let input4 = this.select_TRAN_ORDER_NO;

      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].APPLY_NO.toString().indexOf(input1) != -1) {
          if (this.tableData[i].VEHICLE_NO.toString().indexOf(input2) != -1) {
            if (
              this.tableData[i].CONSTRUCT_NAME.toString().indexOf(input3) != -1
            ) {
              if (
                this.tableData[i].TRAN_ORDER_NO.toString().indexOf(input4) != -1
              ) {
                table.push(this.tableData[i]);
              }
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 监听查询输入框--实现查询筛选功能
    select_VEHICLE_NO: function () {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));

      let input1 = this.select_APPLY_NO;
      let input2 = this.select_VEHICLE_NO;
      let input3 = this.select_CONSTRUCT_NAME;
      let input4 = this.select_TRAN_ORDER_NO;

      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].APPLY_NO.toString().indexOf(input1) != -1) {
          if (this.tableData[i].VEHICLE_NO.toString().indexOf(input2) != -1) {
            if (
              this.tableData[i].CONSTRUCT_NAME.toString().indexOf(input3) != -1
            ) {
              if (
                this.tableData[i].TRAN_ORDER_NO.toString().indexOf(input4) != -1
              ) {
                table.push(this.tableData[i]);
              }
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 监听查询输入框--实现查询筛选功能
    select_CONSTRUCT_NAME: function () {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_APPLY_NO;
      let input2 = this.select_VEHICLE_NO;
      let input3 = this.select_CONSTRUCT_NAME;
      let input4 = this.select_TRAN_ORDER_NO;

      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].APPLY_NO.toString().indexOf(input1) != -1) {
          if (this.tableData[i].VEHICLE_NO.toString().indexOf(input2) != -1) {
            if (
              this.tableData[i].CONSTRUCT_NAME.toString().indexOf(input3) != -1
            ) {
              if (
                this.tableData[i].TRAN_ORDER_NO.toString().indexOf(input4) != -1
              ) {
                table.push(this.tableData[i]);
              }
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 监听查询输入框--实现查询筛选功能
    select_TRAN_ORDER_NO: function () {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_APPLY_NO;
      let input2 = this.select_VEHICLE_NO;
      let input3 = this.select_CONSTRUCT_NAME;
      let input4 = this.select_TRAN_ORDER_NO;

      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].APPLY_NO.toString().indexOf(input1) != -1) {
          if (this.tableData[i].VEHICLE_NO.toString().indexOf(input2) != -1) {
            if (
              this.tableData[i].CONSTRUCT_NAME.toString().indexOf(input3) != -1
            ) {
              if (
                this.tableData[i].TRAN_ORDER_NO.toString().indexOf(input4) != -1
              ) {
                table.push(this.tableData[i]);
              }
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
  },
  filters: {
    // 显示审核状态的过滤器----
    APPLY_STATUS_Format: function (value) {
      if (value === 0) {
        let value = "未申报";
        return value;
      }
      if (value === 1) {
        let value = "已申报";
        return value;
      }
      if (value === 2) {
        let value = "待确定";
        return value;
      }
    },
    SITE_COMFIRM_Format: function (value) {
      if (value === 0) {
        let value = "未签认";
        return value;
      }
      if (value === 1) {
        let value = "已签认";
        return value;
      }
    },
    FIELD_COMFIRM_Format: function (value) {
      if (value === 0) {
        let value = "未签认";
        return value;
      }
      if (value === 1) {
        let value = "已签认";
        return value;
      }
    },
    STATUS_Format: function (value) {
      if (value === 1) {
        let value = "已生成";
        return value;
      }
      if (value === 2) {
        let value = "已激活";
        return value;
      }
      if (value === 3) {
        let value = "已出场";
        return value;
      }
      if (value === 4) {
        let value = "已取消";
        return value;
      }
      if (value === 5) {
        let value = "已激活";
        return value;
      }
      if (value === 6) {
        let value = "已删除";
        return value;
      }
    },
    CAR_QUALIFICATION_Format: function (value) {
      if (value === 0) {
        let value = "正常";
        return value;
      }
      if (value === 1) {
        let value = "异常";
        return value;
      }
    },
    COMPANY_QUALIFICATION_Format: function (value) {
      if (value === 0) {
        let value = "正常";
        return value;
      }
      if (value === 1) {
        let value = "异常";
        return value;
      }
    },
    CONSTRUCT_STATUS_Format: function (value) {
      if (value === 0) {
        let value = "在建";
        return value;
      }
      if (value === 1) {
        let value = "停工";
        return value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#title {
  width: 33.542vw;
  height: 4.259vh;
  margin: 0.0926vh 0 0 0.052vw;
  // background-color: #fff;
  background: url("../../../../static/img/icon27.png") no-repeat;
  background-position: center;
  background-size: 33.542vw 4.259vh;
  display: flex;
  align-items: center;
  color: #ffffff;
  .crumb {
    margin-left: 1.5625vw;
  }
  img {
    margin-left: 1vw;
  }
}
#select {
  height: 3.333vh;
  width: 78vw;
  // border: red solid 1px;
  margin-top: 2.315vh;
  display: flex;
  align-items: center;
  font-size: 1.296vh;
  color: #ffffff;
  span {
    margin-left: 1.615vw;
  }
  .input-style {
    margin-left: 0.147vw;
    width: 9.271vw;
    height: 2.963vh;
    background-color: transparent;
    color: #ffffff;
    // color: #ffffff;
    font-size: 1.111vh;
    outline: none;
    border: solid #ffffff 0.052vw;
    font-family: MicrosoftYaHei;
    padding-left: 0.625vw;
    opacity: 0.3;
    border-radius: 0.278vh;
  }
  .select-btu {
    width: 4.896vw;
    height: 2.963vh;
    background: #0566b3;
    border-radius: 1.481vh;
    border: none;
    font-size: 1.296vh;
    font-family: Microsoft YaHei;
    // font-weight: bold;
    outline: none;
    color: #ffffff;
  }
  .select-btu:hover,
  .select-btu:active {
    //添加数据按钮鼠标移入和激活样式
    width: 4.896vw;
    height: 2.963vh;
    opacity: 0.5;
  }
  .add-btu {
    width: 4.896vw;
    height: 2.963vh;
    background: #24a04b;
    border-radius: 1.481vh;
    border: none;
    font-size: 1.296vh;
    font-family: Microsoft YaHei;
    // font-weight: bold;
    color: #ffffff;
    outline: none;
  }
  .add-btu:hover,
  .add-btu:active {
    //添加数据按钮鼠标移入和激活样式
    width: 4.896vw;
    height: 2.963vh;
    opacity: 0.5;
  }
  .edit-btu {
    width: 4.896vw;
    height: 2.963vh;
    background: #0566b3;
    border-radius: 1.481vh;
    border: none;
    font-size: 1.296vh;
    font-family: Microsoft YaHei;
    // font-weight: bold;
    color: #ffffff;
    outline: none;
  }
  .edit-btu:hover,
  .edit-btu:active {
    //添加数据按钮鼠标移入和激活样式
    width: 4.896vw;
    height: 2.963vh;
    opacity: 0.5;
  }
  .delete-btu {
    width: 4.896vw;
    height: 2.963vh;
    background: #b77036;
    border-radius: 1.481vh;
    border: none;
    font-size: 1.296vh;
    font-family: Microsoft YaHei;
    // font-weight: bold;
    color: #ffffff;
    outline: none;
  }
  .delete-btu:hover,
  .delete-btu:active {
    //添加数据按钮鼠标移入和激活样式
    width: 4.896vw;
    height: 2.963vh;
    opacity: 0.5;
  }
  .ml {
    margin-left: 1.7vw;
  }
}
#mytable {
  width: 82.76vw;
  height: 69.444vh;
  .table {
    width: 79.323vw;
    height: 63.5vh;
    margin: 2.407vh 0 0 1.615vw;
    background: transparent !important;
    // border: 0.1vh solid #067EA5;

    border: none;
    // color: #ffffff;
  }
}
</style>
<style>
.el-breadcrumb__inner,
el-breadcrumb__item {
  color: #ffffff !important;
  font-size: 1.574vh !important;
}
.el-table th,
.el-table tr {
  background-color: rgba(61, 202, 245, 0.15) !important;
  border: 0.1vh solid #067ea5;
}
.el-table__row {
  background-color: transparent !important;
  border: 0.1vh solid #067ea5;
}
.pagination {
  /* margin: 2vh 0 0 59vw; */
  float: right;
  margin-right: 1.8vw;
}
.pagination span {
  color: #ffffff;
}
/* 删除表格下横线 */
.el-table::before {
  bottom: 0;
  width: 100%;
  height: 0px;
}
/* 删除表格右横线 */
.el-table--border,
.el-table--group {
  border: none;
}
.el-table__header-wrapper th:nth-last-of-type(2) {
  border-right: none;
}
.el-table--border td:nth-last-of-type(1) {
  border-right: none;
}
.el-table--border::after,
.el-table--group::after {
  width: 0;
}

/* 分页 */
</style>
