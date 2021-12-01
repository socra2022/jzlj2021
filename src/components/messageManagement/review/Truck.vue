<template>
  <div>
    <!-- 面包屑 -->
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
            >运输车辆申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >运输车辆管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <button @click="carInfoDialog = true" v-if="rolen !== 'admin'" class="add-btu ml">
        <i class="el-icon-circle-plus"></i> 新增
      </button>
      <span>车牌号：</span>
      <input
        v-model="select_carNo"
        type="text"
        class="input-style"
        placeholder="请输入车牌号"
      />
      <span>公司名称：</span>
      <input
        v-model="select_company"
        type="text"
        class="input-style"
        placeholder="请输入公司名称"
      />
      <!-- <button class="select-btu ml">查询</button>
      <button class="add-btu ml">新增</button>
      <button class="edit-btu ml">修改</button>
      <button class="delete-btu ml">删除</button> -->
    </div>
    <!-- 表格 -->
    <div id="mytable">
      <el-table
        :data="tableData"
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
        <el-table-column prop="carNo" label="车牌号"></el-table-column>
        <el-table-column
          prop="company"
          label="公司名称"
          min-width="300"
        ></el-table-column>
        <el-table-column prop="carType" label="车辆类型"></el-table-column>
        <el-table-column label="使用状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
            <el-tag type="info" v-if="scope.row.status === 1">未启用</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">资质异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fromIp" label="终端编号" width="150"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="phoneNo" label="联系电话"></el-table-column>
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
              @click="getMessage(scope.row.carId)"
              >详情</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateCarId(scope.row.carId)"
              >更改</el-button
            >
            <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewCarId(scope.row.carId)"
              >审核</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.carId)"
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
      width="60%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="carInfoFormRef"
        :rules="carInfoFormRules"
        :model="carInfoForm"
        :inline="true"
      >
        <!-- <el-form-item label="车辆编号" prop="carId">
          <el-input v-model="carInfoForm.carId" class="handle-input mr10"></el-input>
        </el-form-item>-->
        <el-form-item label="核定载重" prop="loadCapacity">
          <el-input
            v-model.number="carInfoForm.loadCapacity"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车长" prop="carLong">
          <el-input
            v-model.number="carInfoForm.carLong"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车高" prop="carHigh">
          <el-input
            v-model.number="carInfoForm.carHigh"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车宽" prop="carWidth">
          <el-input
            v-model.number="carInfoForm.carWidth"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="carType">
          <el-input v-model="carInfoForm.carType" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="司机名称" prop="driverName">
          <el-input v-model="carInfoForm.driverName" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="所属车队" prop="motorcadeId">
          <el-input
            v-model="carInfoForm.motorcadeId"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="carInfoForm.company" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNo">
          <el-input v-model="carInfoForm.carNo" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="终端IP" prop="fromIp">
          <el-input v-model="carInfoForm.fromIp" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="使用状态" prop="status">
          <el-radio-group v-model="carInfoForm.status">
            <el-radio label="启用"></el-radio>
            <el-radio label="未启用"></el-radio>
            <el-radio label="资质异常"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="carInfoForm.linkman" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNo">
          <el-input v-model="carInfoForm.phoneNo" class="handle-input mr10"></el-input>
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
      width="60%"
      title="请修改申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="carInfoFormRef2"
        :rules="carInfoFormRules2"
        :model="carInfoForm2"
        :inline="true"
      >
        <el-form-item label="车辆编号" prop="carId">
          <el-input
            :disabled="true"
            v-model.number="carInfoForm2.carId"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="核定载重" prop="loadCapacity">
          <el-input
            v-model.number="carInfoForm2.loadCapacity"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车长" prop="carLong">
          <el-input
            v-model.number="carInfoForm2.carLong"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车高" prop="carHigh">
          <el-input
            v-model.number="carInfoForm2.carHigh"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车宽" prop="carWidth">
          <el-input
            v-model.number="carInfoForm2.carWidth"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="carType">
          <el-input v-model="carInfoForm2.carType" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="司机名称" prop="driverName">
          <el-input
            v-model="carInfoForm2.driverName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属车队" prop="motorcadeId">
          <el-input
            v-model="carInfoForm2.motorcadeId"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="carInfoForm2.company" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNo">
          <el-input v-model="carInfoForm2.carNo" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="终端IP" prop="fromIp">
          <el-input v-model="carInfoForm2.fromIp" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="使用状态" prop="status">
          <el-radio-group v-model="carInfoForm2.status">
            <el-radio label="启用"></el-radio>
            <el-radio label="未启用"></el-radio>
            <el-radio label="资质异常"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="carInfoForm2.linkman" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNo">
          <el-input v-model="carInfoForm2.phoneNo" class="handle-input mr10"></el-input>
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
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="carInfoForm2" :inline="true">
        <el-form-item label="车辆编号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carId
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="核定载重">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.loadCapacity
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="车长">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carLong
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="车高">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carHigh
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="车宽">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carWidth
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="车型">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carType
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="司机名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.driverName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="所属车队">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.motorcadeId
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="所属公司">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.company
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="车牌号码">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.carNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="终端IP">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.fromIp
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="使用状态">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.status
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.linkman
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              carInfoForm2.phoneNo
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
  selectCarDataByInputName,
  insertCarData,
  updateCarData,
  deleteCarDataById,
  updateCarReviewStatus,
  selectAllCarDataByPage,
  selectNumOfAllCarData,
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
        height: "2.3vh",
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
      select_carId: "",
      select_carNo: "",
      select_company: "",

      // 填写申报信息的对话框
      carInfoDialog: false,
      // 表单绑定值
      carInfoForm: {
        carId: "",
        loadCapacity: "",
        carLong: "",
        carHigh: "",
        carWidth: "",
        carType: "",
        driverName: "",
        motorcadeId: "",
        company: "",
        carNo: "",
        fromIp: "",
        status: "",
        linkman: "",
        phoneNo: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
      },
      // 表单验证规则
      carInfoFormRules: {
        loadCapacity: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carLong: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carHigh: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carWidth: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carType: [{ required: true, message: "不能为空!", trigger: "blur" }],
        driverName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        motorcadeId: [{ required: true, message: "不能为空!", trigger: "blur" }],
        company: [{ required: true, message: "不能为空!", trigger: "blur" }],
        carNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        fromIp: [{ required: true, message: "不能为空!", trigger: "blur" }],
        status: [{ required: true, message: "不能为空!", trigger: "change" }],
        linkman: [{ required: true, message: "不能为空!", trigger: "blur" }],
        phoneNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },
      // 修改申报信息的对话框
      carInfoDialog2: false,
      // 表单绑定值
      carInfoForm2: {
        carId: "",
        loadCapacity: "",
        carLong: "",
        carHigh: "",
        carWidth: "",
        carType: "",
        driverName: "",
        motorcadeId: "",
        company: "",
        carNo: "",
        fromIp: "",
        status: "",
        linkman: "",
        phoneNo: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
      },
      // 表单验证规则
      carInfoFormRules2: {
        loadCapacity: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carLong: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carHigh: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carWidth: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        carType: [{ required: true, message: "不能为空!", trigger: "blur" }],
        driverName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        motorcadeId: [{ required: true, message: "不能为空!", trigger: "blur" }],
        company: [{ required: true, message: "不能为空!", trigger: "blur" }],
        carNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        fromIp: [{ required: true, message: "不能为空!", trigger: "blur" }],
        status: [{ required: true, message: "不能为空!", trigger: "change" }],
        linkman: [{ required: true, message: "不能为空!", trigger: "blur" }],
        phoneNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },
      // 打开查看详情的对话框
      carInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentCarId: 0,

      // 从首页监听的审核状态值
      reviewS: 4,
    };
  },
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
  created() {
    this.getData();
  },
  methods: {
    // 请求数据方法
    async getData() {
      // 根据用户名来判断请求的数据
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        await selectCarDataByInputName(
          this.username,
          true,
          this.currentPage,
          this.PageSize
        ).then((res) => {
          //console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          //console.log(this.subTableData);
        });
      } else {
        //如果是管理员，则请求所有的数据---分页请求
        await selectNumOfAllCarData()
          .then((res) => {
            this.totalCount = res.data.respBody;
          })
          .then({});
        await selectAllCarDataByPage(true, this.currentPage, this.PageSize).then(
          (res) => {
            console.log(res);
            this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
            this.tableData = JSON.parse(JSON.stringify(this.allData));
            // this.totalCount = this.tableData.length;
            // 备份数据
            this.subTableData = JSON.parse(JSON.stringify(this.tableData));
            //console.log(this.subTableData);
          }
        );
      }
    },

    // 前端分页功能
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;

      // 改变每页显示条数时请求数据
      selectAllCarDataByPage(true, this.currentPage, this.PageSize).then((res) => {
        //console.log(res);
        this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
        this.tableData = JSON.parse(JSON.stringify(this.allData));
        // this.totalCount = this.tableData.length;
        // 备份数据
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        // console.log(this.subTableData);
      });
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      //console.log(this.currentPage);
      // 改变页码时请求数据
      selectAllCarDataByPage(true, this.currentPage, this.PageSize).then((res) => {
        //console.log(res);
        this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
        this.tableData = JSON.parse(JSON.stringify(this.allData));
        // this.totalCount = this.tableData.length;
        // 备份数据
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        // console.log(this.subTableData);
      });
    },

    // 根据标签筛选
    filterTag(value, row) {
      return row.reviewStatus === value;
    },

    // 表单
    // 点击取消和X按钮，重置表单
    resetCarInfoForm() {
      this.$refs.carInfoFormRef.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      // 封装状态值
      let status = 0;
      if (this.carInfoForm.status === "未启用") {
        status = 1;
      }
      if (this.carInfoForm.status === "资质异常") {
        status = 2;
      }
      // 封装插入的数据
      let data = {
        loadCapacity: this.carInfoForm.loadCapacity,
        carLong: this.carInfoForm.carLong,
        carHigh: this.carInfoForm.carHigh,
        carWidth: this.carInfoForm.carWidth,
        carType: this.carInfoForm.carType,
        driverName: this.carInfoForm.driverName,
        motorcadeId: this.carInfoForm.motorcadeId,
        company: this.carInfoForm.company,
        carNo: this.carInfoForm.carNo,
        fromIp: this.carInfoForm.fromIp,
        status: status,
        linkman: this.carInfoForm.linkman,
        phoneNo: this.carInfoForm.phoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        reviewStatus: 0,
      };
      //console.log(data);
      insertCarData(data)
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
    // 点击取消和X按钮，重置表单
    resetCarInfoForm2() {
      this.$refs.carInfoFormRef2.resetFields();
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateCarId(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carId == id) {
          return true;
        }
      });
      // console.log(this.allData[index]);
      // 修改状态值 0-启用。。。
      if (this.allData[index].status === 0) {
        this.allData[index].status = "启用";
      }
      if (this.allData[index].status === 1) {
        this.allData[index].status = "未启用";
      }
      if (this.allData[index].status === 2) {
        this.allData[index].status = "资质异常";
      }
      this.carInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.carInfoDialog2 = true;
    },
    // 修改表单
    updateData() {
      // 封装状态值
      let status = 0;
      if (this.carInfoForm2.status === "未启用") {
        status = 1;
      }
      if (this.carInfoForm2.status === "资质异常") {
        status = 2;
      }
      // 封装插入的数据
      let data = {
        carId: this.carInfoForm2.carId,
        loadCapacity: this.carInfoForm2.loadCapacity,
        carLong: this.carInfoForm2.carLong,
        carHigh: this.carInfoForm2.carHigh,
        carWidth: this.carInfoForm2.carWidth,
        carType: this.carInfoForm2.carType,
        driverName: this.carInfoForm2.driverName,
        motorcadeId: this.carInfoForm2.motorcadeId,
        company: this.carInfoForm2.company,
        carNo: this.carInfoForm2.carNo,
        fromIp: this.carInfoForm2.fromIp,
        status: status,
        linkman: this.carInfoForm2.linkman,
        phoneNo: this.carInfoForm2.phoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        review_Status: 0,
      };
      // console.log(data);
      updateCarData(data)
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
    // 删除一条数据
    handleDelete(id) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          // 根据id找到index
          let index = this.allData.findIndex((item) => {
            if (item.carId == id) {
              return true;
            }
          });
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
            deleteCarDataById(this.allData[index].carId)
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
    // 参看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carId == id) {
          return true;
        }
      });
      // console.log(this.allData[index]);
      // 修改状态值 0-启用。。。
      if (this.allData[index].status === 0) {
        this.allData[index].status = "启用";
      }
      if (this.allData[index].status === 1) {
        this.allData[index].status = "未启用";
      }
      if (this.allData[index].status === 2) {
        this.allData[index].status = "资质异常";
      }
      this.carInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.carInfoDialog3 = true;
    },

    // 管理员进行审核操作
    getReviewCarId(id) {
      // 根据id找到index
      let index = this.allData.findIndex((item) => {
        if (item.carId == id) {
          return true;
        }
      });
      this.reviewDialog = true;
      this.reviewStatusRadio = this.allData[index].reviewStatus;
      this.currentCarId = this.allData[index].carId;
      //console.log(this.reviewStatusRadio);
    },
    // 更改审核状态
    review() {
      let data = {
        CAR_ID: this.currentCarId,
        REVIEW_STATUS: this.reviewStatusRadio,
      };
      //console.log(this.reviewStatusRadio);
      updateCarReviewStatus(data)
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
  watch: {
    select_carNo: function () {
      // console.log(this.select_carNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input2 = this.select_carNo;
      let input3 = this.select_company;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carNo.toString().indexOf(input2) != -1) {
          if (this.tableData[i].company.toString().indexOf(input3) != -1) {
            table.push(this.tableData[i]);
          }
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      // this.totalCount = this.tableData.length;
      // this.currentPage = 1;
    },
    select_company: function () {
      // console.log(this.select_company);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input2 = this.select_carNo;
      let input3 = this.select_company;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carNo.toString().indexOf(input2) != -1) {
          if (this.tableData[i].company.toString().indexOf(input3) != -1) {
            table.push(this.tableData[i]);
          }
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      // this.totalCount = this.tableData.length;
      // this.currentPage = 1;
    },

    reviewS: function () {
      if (this.reviewS !== 4) this.filterTag(this.reviewS);
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

    // border: none;
    // color: #ffffff;
  }
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #b3b3b3; /* placeholder字体大小  */
  font-size: 1.111vh;
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
#mytable > div.el-table.table.el-table--fit.el-table--border.el-table--fluid-height.el-table--scrollable-y.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none{
  height: 55vh;
}
</style>
