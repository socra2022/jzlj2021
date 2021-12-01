<template>
  <div>
    <!-- 面包屑导航 -->
    <div id="title">
      <div class="crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-if="(this.rolen !== 'admin') & (this.rolen !== 'superadmin')"
          >
            <i class="el-icon-lx-text"></i> 申报入口
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
          >
            <i class="el-icon-lx-text"></i> 申报管理
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="(this.rolen !== 'admin') & (this.rolen !== 'superadmin')"
            >运输企业申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >运输企业管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <button v-if="rolen !== 'admin'" @click="carInfoDialog = true" class="add-btu ml">
        <i class="el-icon-circle-plus"></i> 新增
      </button>
      <span>公司编号：</span>
      <input
        v-model="select_companyId"
        type="text"
        class="input-style"
        placeholder="请输入公司编号"
      />
      <span>公司名称：</span>
      <input
        v-model="select_company"
        type="text"
        class="input-style"
        placeholder="请输入公司名称"
      />
      <span>联系人：</span>
      <input
        v-model="select_linkman"
        type="text"
        class="input-style"
        placeholder="请输入联系人"
      />
      <!-- <button class="select-btu ml">查询</button>
      <button class="add-btu ml">新增</button>
      <button class="edit-btu ml">修改</button>
      <button class="delete-btu ml">删除</button> -->
    </div>

    <!-- 表格 -->
    <div id="mytable">
      <!-- 这块分页和truck怎么不一样 -->
      <el-table
        :data="tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)"
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
        <!-- <el-table-column prop="carId" label="ID" width="55" align="center"></el-table-column> -->
        <el-table-column prop="carCompanyID" label="公司编号"></el-table-column>
        <el-table-column prop="carCompanyName" label="公司名称"></el-table-column>
        <el-table-column prop="contact" label="联系人"></el-table-column>
        <el-table-column prop="contactNumber" label="联系电话"></el-table-column>
        <el-table-column
          prop="reviewStatus"
          label="审核状态"
          align="center"
          :filters="[
            { text: '待审核', value: 0 },
            { text: '审核通过', value: 1 },
            { text: '审核未通过', value: 2 },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.reviewStatus === 0
                  ? 'info'
                  : scope.row.reviewStatus === 1
                  ? 'success'
                  : scope.row.reviewStatus === 2
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.reviewStatus | reviewStatusFormat }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-document"
              @click="getMessage(scope.row.carCompanyID)"
              >详情</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateCarId(scope.row.carCompanyID)"
              >更改</el-button
            >
            <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewCarId(scope.row.carCompanyID)"
              >审核</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.carCompanyID)"
              >删除</el-button
            >
          </template>
        </el-table-column>
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

    <!-- 申报表单-->
    <el-dialog
      :visible.sync="carInfoDialog"
      append-to-body
      width="60%"
      title="请填写申报信息"
      label-width="80px"
    >
      <el-form
        ref="carInfoFormRef"
        :rules="carInfoFormRules"
        :model="carInfoForm"
        :inline="true"
      >
        <!-- <el-form-item label="公司编号" prop="carCompanyID">
          <el-input v-model="carInfoForm.carCompanyID" class="handle-input mr10"></el-input>
        </el-form-item>-->
        <el-form-item label="公司名称" prop="carCompanyName">
          <el-input
            v-model="carInfoForm.carCompanyName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="carInfoForm.contact" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input
            v-model="carInfoForm.contactNumber"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addData">确认提交</el-button>
          <el-button @click="resetCarInfoForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="carInfoDialog2"
      append-to-body
      width="60%"
      title="请修改申报信息"
      label-width="80px"
    >
      <el-form
        ref="carInfoFormRef2"
        :rules="carInfoFormRules2"
        :model="carInfoForm2"
        :inline="true"
      >
        <el-form-item label="公司名称" prop="carCompanyName">
          <el-input
            v-model="carInfoForm2.carCompanyName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="carInfoForm2.contact" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input
            v-model="carInfoForm2.contactNumber"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData">确认修改</el-button>
          <el-button @click="resetCarInfoForm2">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 显示详情 -->
    <el-dialog
      :visible.sync="carInfoDialog3"
      append-to-body
      width="60%"
      title="申报信息详情"
      label-width="80px"
    >
      <el-form :model="carInfoForm2" :inline="true">
        <el-form-item label="公司编号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carCompanyID
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="公司名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carCompanyName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.contact
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.contactNumber
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.inputName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.inputTime | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="审核状态">
          ：&nbsp;&nbsp;
          <span style="color: red" v-if="carInfoForm2.reviewStatus === 0">待审核</span>
          <span style="color: red" v-if="carInfoForm2.reviewStatus === 1">审核通过</span>
          <span style="color: red" v-if="carInfoForm2.reviewStatus === 2"
            >审核未通过</span
          > </el-form-item
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </el-form>
    </el-dialog>
    <!-- 管理员修改审核状态 -->
    <!-- 切换状态的对话框 -->
    <el-dialog
      title="请确定审核状态"
      :visible.sync="reviewDialog"
      append-to-body
      width="40%"
    >
      <el-radio-group v-model="reviewStatusRadio">
        <el-radio :label="0">待定</el-radio>
        <el-radio :label="1">准予通过</el-radio>
        <el-radio :label="2">不准予通过</el-radio>
      </el-radio-group>

      <span slot="footer">
        <el-button type="primary" @click="review">确认</el-button>
        <el-button @click="reviewDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectCompanyDataByInputName,
  selectAllCompanyData,
  insertCompanyData,
  updateCompanyData,
  deleteCompanyDataById,
  updateCompanyReviewStatus,
} from "../../../assets/axios/index";
// 导入js方法
// 求当前时间的方法
import getNowtime from "../../../assets/js/index";
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
      // 角色---登录后获取
      rolen: window.sessionStorage.usern,
      username: window.sessionStorage.namen,

      // 获取的数据
      allData: [],
      // 渲染表格的数据
      tableData: [],
      // 备用数据
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

      // 查询功能的绑定值--使用watch监听
      select_companyId: "",
      select_company: "",
      select_linkman: "",

      // 填写申报信息的对话框
      carInfoDialog: false,
      // 表单绑定值
      carInfoForm: {
        carCompanyID: "",
        carCompanyName: "",
        contact: "",
        contactNumber: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
      },
      // 修改申报信息的对话框
      carInfoDialog2: false,
      // 表单绑定值
      carInfoForm2: {
        carCompanyID: "",
        carCompanyName: "",
        contact: "",
        contactNumber: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
      },
      // 表单验证规则2
      carInfoFormRules2: {
        carCompanyName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        contact: [{ required: true, message: "不能为空!", trigger: "blur" }],
        contactNumber: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },
      // 表单验证规则
      carInfoFormRules: {
        carCompanyName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        contact: [{ required: true, message: "不能为空!", trigger: "blur" }],
        contactNumber: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },

      // 打开查看详情的对话框
      carInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentCarId: 0,
    };
  },
  //   过滤器，单独写在方法外面
  filters: {
    // 显示审核状态的过滤器----
    reviewStatusFormat: function (value) {
      if (value === 0) {
        let value = "待审核";
        return value;
      }
      if (value === 1) {
        let value = "审核通过";
        return value;
      }
      if (value === 2) {
        let value = "审核未通过";
        return value;
      }
    },
  },
  //   监听事件 搜索栏
  watch: {
    // 监听查询输入框--实现查询筛选功能
    select_companyId: function () {
      console.log(this.select_carId);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_companyId;
      let input2 = this.select_linkman;
      let input3 = this.select_company;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carCompanyID.toString().indexOf(input1) != -1) {
          if (this.tableData[i].contact.toString().indexOf(input2) != -1) {
            if (this.tableData[i].carCompanyName.toString().indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_linkman: function () {
      // console.log(this.select_carNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_companyId;
      let input2 = this.select_linkman;
      let input3 = this.select_company;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carCompanyID.toString().indexOf(input1) != -1) {
          if (this.tableData[i].contact.toString().indexOf(input2) != -1) {
            if (this.tableData[i].carCompanyName.toString().indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_company: function () {
      // console.log(this.select_company);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_companyId;
      let input2 = this.select_linkman;
      let input3 = this.select_company;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carCompanyID.toString().indexOf(input1) != -1) {
          if (this.tableData[i].contact.toString().indexOf(input2) != -1) {
            if (this.tableData[i].carCompanyName.toString().indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
  },
  created() {
    this.getData();
  },
  methods: {
    // 请求数据方法
    getData() {
      // 根据用户名来判断请求的数据
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        selectCompanyDataByInputName(this.username, false).then((res) => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          //console.log(this.subTableData);
        });
      } else {
        //如果是管理员，则请求所有的数据
        selectAllCompanyData(false).then((res) => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          // console.log(this.allData);
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.subTableData);
        });
      }
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
      return row.reviewStatus === value;
    },
    // 点击取消和X按钮，重置表单
    resetCarInfoForm() {
      this.$refs.carInfoFormRef.resetFields();
    },
    // 点击取消和X按钮，重置表单
    resetCarInfoForm2() {
      this.$refs.carInfoFormRef2.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      // 封装插入的数据
      let data = {
        carCompanyName: this.carInfoForm.carCompanyName,
        contact: this.carInfoForm.contact,
        contactNumber: this.carInfoForm.contactNumber,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        reviewStatus: 0,
      };
      //console.log("要插入的数据格式:" + JSON.stringify(data));
      insertCompanyData(data)
        .then(() => {
          this.$message({
            message: "提交成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
          // 关闭对话框
          this.carInfoDialog = false;
          // 重置表单
          this.resetCarInfoForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 删除一条数据
    handleDelete(id) {
      //console.log("plplplpl:" + id);
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          // 根据id找到index
          let index = this.allData.findIndex((item) => {
            if (item.carCompanyID == id) {
              return true;
            }
          });
          //console.log("plplplpl:" + index);
          // 判断是否能删除
          if (window.sessionStorage.namen !== this.allData[index].inputName) {
            this.$message({
              message: "对不起，您无权删除该数据！",
              type: "danger",
              offset: 300,
              center: true,
              duration: 1000,
            });
          } else {
            deleteCompanyDataById(this.allData[index].carCompanyID)
              .then(() => {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                  offset: 300,
                  center: true,
                  duration: 1000,
                });
              })
              .then(() => {
                // 重新渲染表格
                this.getData();
              });
          }
        })
        .catch(() => {});
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateCarId(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carCompanyID == id) {
          return true;
        }
      });
      this.carInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.carInfoDialog2 = true;
    },
    // 修改表单
    updateData() {
      let data = {
        carCompanyID: this.carInfoForm2.carCompanyID,
        carCompanyName: this.carInfoForm2.carCompanyName,
        contact: this.carInfoForm2.contact,
        contactNumber: this.carInfoForm2.contactNumber,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        reviewStatus: 0,
      };
      updateCompanyData(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
          // 关闭对话框
          this.carInfoDialog2 = false;
          // 重置表单
          this.resetCarInfoForm2();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 查看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carCompanyID == id) {
          return true;
        }
      });
      this.carInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.carInfoDialog3 = true;
    },

    // 管理员进行审核操作
    getReviewCarId(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carCompanyID == id) {
          return true;
        }
      });
      this.reviewDialog = true;
      this.reviewStatusRadio = this.allData[index].reviewStatus;
      this.currentCarId = this.allData[index].carCompanyID;
      //console.log(this.reviewStatusRadio);
    },
    review() {
      let data = {
        CAR_COMPANY_ID: this.currentCarId,
        REVIEW_STATUS: this.reviewStatusRadio,
      };
      //console.log(this.reviewStatusRadio);
      updateCompanyReviewStatus(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
        })
        .then(() => {
          this.reviewDialog = false;
          this.getData();
        });
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
// 表格样式
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
  /* display: flex;
  justify-content: initial; */
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
