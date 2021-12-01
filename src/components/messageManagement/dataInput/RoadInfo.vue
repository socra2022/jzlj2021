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
            >路线信息</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >路线信息</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <!-- <button
        @click="routeInfoDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button> -->
      <span>路线名称：</span>
      <input
        v-model="select_roadName"
        type="text"
        class="input-style"
        placeholder="请输入路线名称"
      />
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
        <!-- <el-table-column prop="routeName" label="路线名称"></el-table-column> -->
        <!-- <el-table-column prop="routeDesign" label="路线设计"></el-table-column> -->
        <el-table-column
          prop="routeConvertedDesign"
          label="路线设计"
        ></el-table-column>
        <!-- <el-table-column
          prop="lngLat"
          label="经纬度"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column prop="inputName" label="录入人"></el-table-column>
        <el-table-column prop="inputTime" label="录入时间"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-document"
              @click="getMessage(scope.row.routeId)"
              >详情</el-button
            >
            <el-button
              type="text"
              icon="el-icon-document"
              @click="getRouteInfoById(scope.row.routeId)"
              >路线录入</el-button
            >
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="routeBoundVehicle(scope.row.routeId)"
              >绑定车辆</el-button
            >
            <!-- <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateRouteId(scope.row.routeId)"
              >更改</el-button
            > -->
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.routeId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 申报表单********停用  -->
    <el-dialog
      :visible.sync="routeInfoDialog"
      width="60%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="routeInfoFormRef"
        :rules="routeInfoFormRules"
        :model="routeInfoForm"
        :inline="true"
      >
        <el-form-item label="路线名称" prop="routeName">
          <el-input
            v-model.number="routeInfoForm.routeName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="路线设计" prop="routeDesign">
          <el-input
            v-model.number="routeInfoForm.routeDesign"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="lngLat">
          <el-input
            v-model.number="routeInfoForm.lngLat"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addData">确认提交</el-button>
          <el-button @click="resetrouteInfoForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改表单********停用  -->
    <el-dialog
      :visible.sync="routeInfoDialog2"
      width="60%"
      title="请修改申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="routeInfoFormRef2"
        :rules="routeInfoFormRules2"
        :model="routeInfoForm2"
        :inline="true"
      >
        <el-form-item label="路线名称" prop="routeName">
          <el-input
            v-model.number="routeInfoForm2.routeName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="路线设计" prop="routeDesign">
          <el-input
            v-model.number="routeInfoForm2.routeDesign"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="lngLat">
          <el-input
            v-model.number="routeInfoForm2.lngLat"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData">确认修改</el-button>
          <el-button @click="resetrouteInfoForm2">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 路线录入-->
    <el-dialog
      :visible.sync="routeInputDialog"
      width="86%"
      title="请录入路线"
      label-width="80px"
      append-to-body
    >
      <div class="method1" style="display:none"><p>方法1：输入信息绘制</p></div>
      <el-button
        type="success"
        plain
        class="button2"
        @click="newRoute2"
        style="display:none"
        >生成路线</el-button
      >
      <el-button
        type="primary"
        plain
        class="button3"
        @click="clear2"
        style="display:none"
        >清空地图</el-button
      >
      <el-button
        type="danger"
        plain
        class="button4"
        @click="addRoute"
        style="display:none"
        >提交数据</el-button
      >
      <span class="waypoints" style="display:none"
        >途经点：{{ waypoints2 }}</span
      >
      <div class="input-route" style="display:none">
        <div class="input-box">
          请输入起点：<el-input
            class="input"
            id="suggestId1"
            v-model="start2"
          ></el-input>
        </div>
        <div class="input-box">
          请输入途经点：
          <div class="way">
            <el-input
              class="input plus input1"
              id="suggestId2"
              v-model="waypoint"
              value=""
            ></el-input
            ><el-button class="plus" type="primary" @click="addWaypoint"
              >+</el-button
            >
          </div>
        </div>
        <div class="input-box">
          请输入终点：<el-input
            class="input"
            id="suggestId3"
            v-model="end2"
          ></el-input>
        </div>
      </div>
      <!-- 方法2 -->
      <div class="all">
        <p>开始绘制后请在地图上按路线设计顺序选取途径点</p>
        <div id="route">路线设计 ：{{ this.routeConvertedDesign }}</div>
        <div id="map">
          <el-button type="primary" plain class="button" @click="clickSetMark">
            {{ listen ? "开始绘制" : "停止绘制" }}
          </el-button>
          <el-button type="success" plain class="button2" @click="newRoute"
            >生成路线</el-button
          >
          <el-button type="primary" plain class="button3" @click="clear"
            >清空地图</el-button
          >
          <el-button type="danger" plain class="button4" @click="addRoute"
            >提交数据</el-button
          >
          <div id="mapview"></div>
          <div id="input">
            <div id="r-result">
              <el-input
                type="text"
                id="suggestId"
                placeholder="请输入搜索的地址"
                v-model="input"
                clearable
              >
              </el-input>
              <div id="searchResultPanel"></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 绑定车辆 -->
    <el-dialog
      :visible.sync="routeBoundVeDialog"
      width="60%"
      title="请填写绑定车辆"
      label-width="80px"
      append-to-body
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="terminalData"
        ref="terminalData"
        :rules="routeVeRule"
      >
        <el-form-item label="路线ID">
          <el-input
            v-model="terminalData.routeId"
            style="width:20vw;maigin-left:auto"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="终端ID" prop="terminalId">
          <el-input
            v-model="terminalData.terminalId"
            style="width:20vw"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="公司选择" prop="company">
          <el-select
            v-model="value"
            clearable
            placeholder="请选择"
            style="width:20vw;maigin-left:auto"
          >
            <el-option
              v-for="item in companyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆选择" prop="car">
          <el-transfer
            v-model="pickedCar"
            :titles="['未选车辆', '已选车辆']"
            :data="companyCarList"
          ></el-transfer>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="postRouteBoundVe">提交</el-button>
          <el-button @click="resetTermialFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 显示详情  -->
    <el-dialog
      :visible.sync="routeInfoDialog3"
      width="86%"
      title="路线详情"
      label-width="80px"
      append-to-body
    >
      <div class="all_det">
        <div id="route_det">路线设计 ：{{ this.routeConvertedDesign }}</div>
        <div id="map_det">
          <div id="mapview_det"></div>
        </div>
      </div>
    </el-dialog>
    <!-- <el-dialog
      :visible.sync="routeInfoDialog3"
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="routeInfoForm2" :inline="true">
        <el-form-item label="路线名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeInfoForm2.routeName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="路线设计">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeInfoForm2.routeDesign
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="经纬度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeInfoForm2.lngLat
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item> -->
    <!-- <el-form-item label="录入人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeInfoForm2.inputName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeInfoForm2.inputTime | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getAllrouteData,
  updateOrInsertRoad,
  getRouteDataByPage,
  getRouteById,
  getConvertedRoute,
  getAllConvertedrouteData,
  updateRouteById,
  delRoadById,
  routeBoundVe,
  routeBoundVes,
  alreadyCar,
  selectAllCompanyData,
  selectCarNoByCompany
} from "../../../assets/axios/index";
// 坐标相互转换方法
import CoordinateUtil from "../../../assets/js/bd092wgs84";
import wgs2bd from "../../../assets/js/wgs842bd09";
// 导入js方法
// 求当前时间的方法
import getNowtime from "../../../assets/js/index";
import ContentVue from "../../home/Content.vue";
export default {
  data() {
    return {
      // Watch监听绑定数据
      select_roadName: "",
      // 地图
      map: "",
      map_det: "",
      //表格绑定样式
      headerStyle: {
        border: "0.093vh solid #067EA5",
        fontSize: "1.296vh",
        fontFamily: "Microsoft YaHei",
        fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: "3.333vh",
        textAlign: "center"
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
        height: "2.3vh"
      },
      //************************ */
      //   转换的路线名
      routeConvertedDesign: "",
      //   控制路线录入对话框显示
      routeInputDialog: false,
      //   驾车实例
      driving: "",
      //   存储点击的坐标
      input: "",
      //   返回的路线点
      path: [],
      //   绘制
      polyline: "",
      polyline1: "",
      //   存放从后端读取的wgs坐标
      pts: [],
      //   转换成bd09坐标
      pts1: [],
      //   路线长度
      length: 0,

      //   录入的路线名
      roadName: "",
      points: [],
      //   监听判断
      listen: true,
      //   监听函数内方法名
      drawpoint: "",
      //   路线开始点
      start: "",
      //   路线结束点
      end: "",
      //   途经点
      waypoints: [],

      //   输入方法***********
      start2: "",
      end2: "",
      waypoint: "",
      waypoints2: [],
      // *********************
      //   拿到的每条路线的数据
      //   上传的roadaddress数据
      routeInfoForm3: {
        routeId: "",
        routeName: "",
        routeDesign: "",
        routeConvertedDesign: "",
        lngLat: "",
        inputName: "",
        inputTime: "",
        content: ""
      },
      //   路线geojson
      eachart: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: []
        }
      },
      //   起点
      m1: "",
      // 终点
      m2: "",
      mp2: "",
      mp1: "",

      // 根据路线id查询到的已经绑定的车辆列表
      alreadyCarList:[],
      //   公司列表
      companyList: [],
      //   选中的公司
      value: "",
      //   公司车辆列表
      companyCarList: [],
      // 选中的车辆
      pickedCar: [],
      //****************************************************** */
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
      select_sourceId: "",
      select_sourceNo: "",
      select_company: "",

      // 填写申报信息的对话框
      routeInfoDialog: false,
      // 表单绑定值
      routeInfoForm: {
        routeId: "",
        routeName: "",
        routeDesign: "",
        routeConvertedDesign: "",
        lngLat: "",
        inputName: "",
        inputTime: "",
        content: ""
      },
      // 表单验证规则
      routeInfoFormRules: {
        routeName: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        routeDesign: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        lngLat: [{ required: true, message: "不能为空！", trigger: "blur" }]
      },
      //   绑定路线表单验证
      routeVeRule: {
        terminalId: [
          { required: true, message: "请输入正确终端ID", trigger: "blur" },
          { len: 11, message: "终端ID长度为11字符", trigger: "blur" }
        ]
      },

      // 修改申报信息的对话框
      routeInfoDialog2: false,
      // 表单绑定值
      routeInfoForm2: {
        routeId: "",
        routeName: "",
        routeDesign: "",
        routeConvertedDesign: "",
        lngLat: "",
        inputName: "",
        inputTime: "",
        content: ""
      },
      // 表单验证规则
      routeInfoFormRules2: {
        routeName: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        routeDesign: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        lngLat: [{ required: true, message: "不能为空！", trigger: "blur" }]
      },
      // 打开查看详情的对话框
      routeInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      //  绑定车辆对话框
      routeBoundVeDialog: false,
      //   绑定车辆提交数据
      terminalData: {
        routeId: "",
        terminalId: ""
      },
      postBoundData: [],
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个sourceId
      currentSourceId: 0,

      // 从首页监听的审核状态值
      reviewS: 4
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    //   ********************地图部分方法******************************************************
    init() {
      this.map = new BMap.Map("mapview");
      this.map.centerAndZoom("济宁", 11);
      this.map.enableScrollWheelZoom(true);

      this.map.clearOverlays();
      //   console.log("init方法执行")

      // 渲染从后端拿到的路线
      // 坐标转换********

      console.log("pts", this.pts);
      if (this.pts.length == 0) {
        return false;
      } else {
        for (var i = 0; i < this.pts.length; i++) {
          let list = [];
          if (this.pts == []) {
            return false;
          } else {
            const res = wgs2bd.getbd09xy(this.pts[i][1], this.pts[i][0]);
            list.push(res.lng);
            list.push(res.lat);
            this.pts1.push(list);
          }
        }

        //   生成起终点标记
        this.mp1 = this.pts1[0];
        this.mp2 = this.pts1[this.pts1.length - 1];
        var start = new BMap.Point(this.mp1[0], this.mp1[1]);
        var end = new BMap.Point(this.mp2[0], this.mp2[1]);
        this.m1 = new BMap.Marker(start); //起点
        this.m2 = new BMap.Marker(end); //终点
        // console.log(this.m2);
        this.map.addOverlay(this.m1);
        this.map.addOverlay(this.m2);
        let lab1 = new BMap.Label("起点", { position: start });
        let lab2 = new BMap.Label("终点", { position: end });
        this.map.addOverlay(lab1);
        this.map.addOverlay(lab2);
        // 生成坐标点
        let trackPoint1 = [];
        for (var i = 0; i < this.pts1.length; i++) {
          trackPoint1.push(new BMap.Point(this.pts1[i][0], this.pts1[i][1]));
        }
        this.polyline1 = new BMap.Polyline(trackPoint1, {
          strokeColor: "red",
          strokeWeight: 6,
          strokeOpacity: 0.5
        });
        this.map.addOverlay(this.polyline1);
      }

      var that = this;
      // 搜索方法
      function G(id) {
        return document.getElementById(id);
      }
      var ac = new BMap.Autocomplete({
        input: "suggestId",
        location: this.map
      }); //建立一个自动完成的对象
      var ac1 = new BMap.Autocomplete({
        input: "suggestId1",
        location: this.map
      });
      var ac2 = new BMap.Autocomplete({
        input: "suggestId2",
        location: this.map
      });
      var ac3 = new BMap.Autocomplete({
        input: "suggestId3",
        location: this.map
      });
      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      var that = this;
      function setPlace() {
        // that.map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          that.map.centerAndZoom(pp, 15);
          let myIcon = new BMap.Icon(
            "../../../../static/img/point2.png",
            new BMap.Size(32, 32),
            {
              anchor: new BMap.Size(10, 20)
            }
          );
          that.map.addOverlay(new BMap.Marker(pp, { icon: myIcon })); //添加标注
          let lab1 = new BMap.Label(that.input, { position: pp });

          that.map.addOverlay(lab1);
        }
        var local = new BMap.LocalSearch(that.map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },
    init_det() {
      this.map_det = new BMap.Map("mapview_det");
      this.map_det.centerAndZoom("济宁", 11);
      this.map_det.enableScrollWheelZoom(true);

      this.map_det.clearOverlays();
      //   console.log("init方法执行")

      // 渲染从后端拿到的路线
      // 坐标转换********

      console.log("pts", this.pts);
      if (this.pts.length == 0) {
        return false;
      } else {
        for (var i = 0; i < this.pts.length; i++) {
          let list = [];
          if (this.pts == []) {
            return false;
          } else {
            const res = wgs2bd.getbd09xy(this.pts[i][1], this.pts[i][0]);
            list.push(res.lng);
            list.push(res.lat);
            this.pts1.push(list);
          }
        }

        //   生成起终点标记
        this.mp1 = this.pts1[0];
        this.mp2 = this.pts1[this.pts1.length - 1];
        var start = new BMap.Point(this.mp1[0], this.mp1[1]);
        var end = new BMap.Point(this.mp2[0], this.mp2[1]);
        this.m1 = new BMap.Marker(start); //起点
        this.m2 = new BMap.Marker(end); //终点
        // console.log(this.m2);
        this.map_det.addOverlay(this.m1);
        this.map_det.addOverlay(this.m2);
        let lab1 = new BMap.Label("起点", { position: start });
        let lab2 = new BMap.Label("终点", { position: end });
        this.map_det.addOverlay(lab1);
        this.map_det.addOverlay(lab2);
        // 生成坐标点
        let trackPoint1 = [];
        for (var i = 0; i < this.pts1.length; i++) {
          trackPoint1.push(new BMap.Point(this.pts1[i][0], this.pts1[i][1]));
        }
        this.polyline1 = new BMap.Polyline(trackPoint1, {
          strokeColor: "red",
          strokeWeight: 6,
          strokeOpacity: 0.5
        });
        this.map_det.addOverlay(this.polyline1);
      }
    },

    // 点击获取经纬度坐标  实现同一个按钮 开启关闭
    drawpoints(e) {
      console.log(e.point);
      if (JSON.stringify(this.points).indexOf(JSON.stringify(e.point)) == -1) {
        this.points.push(e.point);
      }
      console.log(this.points);
      for (var i = 0; i < this.points.length; i++) {
        var point = new BMap.Marker(this.points[i]);
        this.map.addOverlay(point);
      }
    },
    clickSetMark() {
      var that = this;
      if (this.listen == true) {
        console.log("执行的是1");
        this.map.setDefaultCursor("crosshair");
        this.map.addEventListener("click", this.drawpoints);
        this.$message({
          message: "开始选点",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      } else {
        console.log(this.listen);
        this.map.removeEventListener("click", this.drawpoints);
        this.map.setDefaultCursor("pointer");
        this.$message({
          message: "关闭选点",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      }
      this.listen = !this.listen;
    },

    // 生成路线
    newRoute() {
      if (this.points.length > 0) {
        // 从点击坐标中获取起终点以及途经点并进行驾车规划
        this.start = this.points[0];
        this.end = this.points[this.points.length - 1];
        // 左闭右开
        this.waypoints = this.points.slice(1, this.points.length - 1);
        this.driving = new BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map, autoViewport: true }
        });
        this.driving.search(this.start, this.end, {
          waypoints: this.waypoints
        });
        var that = this;
        //   搜索完成后的回调函数
        this.driving.setSearchCompleteCallback(function() {
          for (var i = 0; i < that.points.length - 1; i++) {
            var list = that.driving
              .getResults()
              .getPlan(0)
              .getRoute(i)
              .getPath();
            for (var k = 0; k < list.length; k++) {
              that.path.push(list[k]);
            }
          }
          for (var i = 0; i < that.points.length - 1; i++) {
            var len = that.driving
              .getResults()
              .getPlan(0)
              .getRoute(i)
              .getDistance();
            that.length = that.length + len;
          }

          console.log("路线距离");
          console.log(that.length);
          console.log(that.path.length);
          console.log(that.path);
          //   拿到轨迹后进行坐标转换并存入路段里
          for (var i = 0; i < that.path.length; i++) {
            let list = [];
            const res = CoordinateUtil.getWgs84xy(
              that.path[i].lng,
              that.path[i].lat
            );
            list.push(res.lng);
            list.push(res.lat);
            that.eachart.geometry.coordinates.push(list);
          }
        });
        // console.log("打印数据");
        // console.log(that.eachart.geometry.coordinates);
        // 关闭地图点击
        this.map.removeEventListener("click", this.drawpoint);
        this.map.setDefaultCursor("pointer");
        this.listen = true;
      } else {
        this.$message({
          message: "无数据",
          type: "warning",
          offset: 300,
          center: true,
          duration: 1000
        });
      }
    },
    newRoute2() {
      this.driving = new BMap.DrivingRoute(this.map, {
        renderOptions: { map: this.map, autoViewport: true }
      });
      this.driving.search(this.start2, this.end2, {
        waypoints: this.waypoints2
      });
      var that = this;
      //   搜索完成后的回调函数
      this.driving.setSearchCompleteCallback(function() {
        for (var i = 0; i < that.waypoints2.length + 1; i++) {
          var list = that.driving
            .getResults()
            .getPlan(0)
            .getRoute(i)
            .getPath();
          for (var k = 0; k < list.length; k++) {
            that.path.push(list[k]);
          }
        }
        for (var i = 0; i < that.waypoints2.length + 1; i++) {
          var len = that.driving
            .getResults()
            .getPlan(0)
            .getRoute(i)
            .getDistance();
          that.length = that.length + len;
        }

        console.log("路线距离");
        console.log(that.length);
        console.log(that.path.length);
        console.log(that.path);
        //   拿到轨迹后进行坐标转换并存入路段里
        for (var i = 0; i < that.path.length; i++) {
          let list = [];
          const res = CoordinateUtil.getWgs84xy(
            that.path[i].lng,
            that.path[i].lat
          );
          list.push(res.lng);
          list.push(res.lat);
          that.eachart.geometry.coordinates.push(list);
        }
      });
    },
    // 增加途径点
    addWaypoint() {
      this.waypoints2.push(this.waypoint);
      this.waypoint = "";
    },
    // 上传数据
    addRoute() {
      var json = JSON.stringify(this.eachart);
      this.routeInfoForm3[0].lngLat = json;
      console.log(this.routeInfoForm3[0]);
      //   let data = {
      //     content: "string",
      //     inputName: "string",
      //     inputTime: new Date(),
      //     roadAddress: json,
      //     roadId: 0,
      //     roadName: this.roadName
      //   };
      updateRouteById(this.routeInfoForm3[0]).then(() => {
        this.getData();
        this.$message({
          message: "提交成功！",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      });
    },
    // 清除标记
    clear() {
      this.map.clearOverlays();
      (this.path = []),
        (this.points = []),
        (this.waypoints = []),
        (this.start = []),
        (this.end = []);
      this.eachart.geometry.coordinates = [];
      // 关闭地图点击
      this.map.removeEventListener("click", this.drawpoint);
      this.map.setDefaultCursor("pointer");
      this.listen = true;
    },
    clear2() {
      this.map.clearOverlays();
      this.start2 = "";
      this.end2 = "";
      this.waypoints2 = [];
    },
    // **********************************end************************************************************
    // 请求数据方法
    async getData() {
      await getAllrouteData()
        .then(res => {
          this.totalCount = res.data.respBody.length;
        })
        .then({});
      await getConvertedRoute(true, this.currentPage, this.PageSize).then(
        res => {
          console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          //   console.log("tabledata", this.tableData);
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      );
    },

    // 前端分页功能
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;

      // 改变每页显示条数时请求数据
      getConvertedRoute(true, this.currentPage, this.PageSize).then(res => {
        //console.log(res);
        this.allData = JSON.parse(JSON.stringify(res.data.respBody));
        this.tableData = JSON.parse(JSON.stringify(this.allData));
        // this.totalCount = this.tableData.length;
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      });
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // 改变页码时请求数据
      getConvertedRoute(true, this.currentPage, this.PageSize).then(res => {
        //console.log(res);
        this.allData = JSON.parse(JSON.stringify(res.data.respBody));
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
    resetrouteInfoForm() {
      this.$refs.routeInfoFormRef.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      let isLegal = true;
      this.$refs["routeInfoFormRef"].validate(valid => {
        if (!valid) {
          this.$message({
            message: "请按照规范完善表单！",
            type: "warning",
            duration: 2000
          });
          isLegal = false;
        }
      });
      if (!isLegal) {
        return;
      }

      // 封装插入的数据
      let data = {
        routeId: "",
        routeName: this.routeInfoForm.sourceName,
        routeDesign: this.routeInfoForm.routeDesign,
        lngLat: this.routeInfoForm.lngLat,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime()
      };

      insertSourceData(data)
        .then(() => {
          this.$message({
            message: "提交成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.routeInfoDialog = false;
          // 重置表单
          this.resetrouteInfoForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 点击取消和X按钮，重置表单
    resetrouteInfoForm2() {
      this.$refs.routeInfoFormRef2.resetFields();
    },
    updateData() {
      // 封装插入的数据
      let data = {
        routeId: this.routeInfoForm2.routeId,
        routeName: this.routeInfoForm2.routeName,
        routeDesign: this.routeInfoForm2.routeDesign,
        lngLat: this.routeInfoForm2.lngLat,
        routeConvertedDesign: "",
        inputName: this.routeInfoForm2.inputName,
        inputTime: getNowtime(),
        content: this.routeInfoForm2.content
      };
      console.log(data);
      updateRouteById(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.routeInfoDialog2 = false;
          // 重置表单
          this.resetrouteInfoForm2();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateRouteId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.routeId == id) {
          return true;
        }
      });
      this.routeInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.routeInfoDialog2 = true;
    },
    // 路线信息表单  路线录入
    getRouteInfoById(id) {
      let index = this.allData.findIndex(item => {
        if (item.routeId == id) {
          return true;
        }
      });
      this.routeConvertedDesign = this.allData[index].routeConvertedDesign;
      getRouteById(id)
        .then(res => {
          this.routeInputDialog = true;
          this.pts = [];
          this.pts1 = [];
          this.routeInfoForm3 = JSON.parse(JSON.stringify(res.data.respBody));
          console.log(this.routeInfoForm3);
          if (this.routeInfoForm3[0].lngLat == "") {
            return false;
          } else {
            let json = JSON.parse(this.routeInfoForm3[0].lngLat);
            console.log(json);
            if (json != null) {
              this.pts = json.geometry.coordinates;
            } else {
              this.pts = [];
            }
          }

          //   console.log(this.pts);
        })
        .then(() => {
          this.init();
        });
    },
    // 删除一条数据
    handleDelete(id) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          // 根据id找到index
          let index = this.allData.findIndex(item => {
            if (item.routeId == id) {
              return true;
            }
          });
          delRoadById(this.allData[index].routeId)
            .then(() => {
              this.$message({
                message: "删除成功！",
                type: "success",
                offset: 300,
                center: true,
                duration: 1000
              });
            })
            .then(() => {
              // 重新渲染表格
              this.getData();
            });
        })
        .catch(() => {});
    },

    // 参看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.routeId == id) {
          return true;
        }
      });
      this.routeInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.routeConvertedDesign = this.allData[index].routeConvertedDesign;

      getRouteById(id)
        .then(res => {
          this.routeInfoDialog3 = true;
          this.pts = [];
          this.pts1 = [];
          this.routeInfoForm3 = JSON.parse(JSON.stringify(res.data.respBody));
          console.log(this.routeInfoForm3);
          if (this.routeInfoForm3[0].lngLat == "") {
            return false;
          } else {
            let json = JSON.parse(this.routeInfoForm3[0].lngLat);
            console.log(json);
            if (json != null) {
              this.pts = json.geometry.coordinates;
            } else {
              this.pts = [];
            }
          }

          //   console.log(this.pts);
        })
        .then(() => {
          this.init_det();
        });
    },
    // 路线绑定车辆
    routeBoundVehicle(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.routeId == id) {
          return true;
        }
      });
      selectAllCompanyData(false).then(res => {
        // console.log(res.data.respBody);
        let arr = res.data.respBody;
        for (let i = 0; i < arr.length; i++) {
          let arrObject = {
            value: arr[i].carCompanyName,
            label: arr[i].carCompanyName
          };
          this.companyList.push(arrObject);
        }
        // arr.forEach(e => {
        //   this.companyList.push(e.carCompanyName);
        // });
        // console.log(this.companyList);
      });
      this.terminalData.routeId = this.allData[index].routeId;
      alreadyCar(this.terminalData.routeId).then((res)=>{
          this.alreadyCarList = res.data.respBody
          console.log("aleadyCarList",this.alreadyCarList)
      })
      this.terminalData.terminalId = "";
      this.routeBoundVeDialog = true;
    },
    // 重置表单
    resetTermialFrom() {
      this.terminalData.terminalId = "";
    },
    // 提交绑定信息  批量绑定
    postRouteBoundVe() {
      for (let i = 0; i < this.pickedCar.length; i++) {
        let carInfo = {
          carNo: this.companyCarList[this.pickedCar[i]].label,
          routeId: this.terminalData.routeId,
          terminalId: this.companyCarList[this.pickedCar[i]].terminalId
        };
        this.postBoundData.push(carInfo);
      }
      console.log("提交的信息", this.postBoundData);
      routeBoundVes(this.postBoundData).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "添加成功",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
        } else {
          this.$message({
            message: "提交失败，请正确输入信息",
            type: "danger",
            offset: 300,
            center: true,
            duration: 1000
          });
        }
      });
      //   this.$refs["terminalData"].validate(valid => {
      //     if (valid) {
      //     }
      //   });
    }
  },
  watch: {
    select_roadName: function() {
      // console.log(this.select_carNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input2 = this.select_roadName;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].routeConvertedDesign.toString().indexOf(input2) !=
          -1
        ) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      // this.totalCount = this.tableData.length;
      // this.currentPage = 1;
    },
    // 车辆绑定监听
    value: function() {
      selectCarNoByCompany(this.value, false).then(res => {
        this.companyCarList = [];
        // console.log(res.data.respBody);
        let arr = res.data.respBody;
        console.log("arr", arr);
        for (let i = 0; i < arr.length; i++) {
          let arrKey = {
            key: i,
            routeId: this.terminalData.routeId,
            label: arr[i].carNo,
            terminalId: arr[i].terminalId
          };
          this.companyCarList.push(arrKey);
        }
        console.log(this.companyCarList);
      });
    },

    reviewS: function() {
      if (this.reviewS !== 4) this.filterTag(this.reviewS);
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-input-suffix {
  // position: margin-bottom;
  bottom: 10px;
}

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

.input-route {
  margin-top: 2vh;
  width: 100%;
  .input-box {
    float: left;
    margin-left: 5vw;
    width: 20vw;
    .way {
      width: 18vw;
      .input1 {
        width: 15vw;
      }
      .plus {
        float: left;
      }
    }
  }

  .input-button {
    float: right;
  }
}
.method1 {
  color: red;
  margin-bottom: 1vh;
  .waypoints {
    margin-left: 10vw;
  }
}
.all {
  height: 75vh;
  width: 82.76vw;
  overflow: hidden;
  p {
    color: red;
  }
  #route {
    height: 3vh;
    line-height: 3vh;
    width: auto;
    border: 1px solid blue;
    color: black;
    text-align: center;
    vertical-align: middle;
    font: bold;
  }
  #map {
    position: relative;
    height: 85vh;
    width: 82.76vw;
    // float: left;
    border: 0.1vh solid #3dcaf5;
    transition: 0.5s;
    #mapview {
      position: absolute;
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
    #input {
      position: absolute;
      top: 8%;
      left: 50px;
      // height: 13.889vh;
      // width: 1.302vw;
      z-index: 999;
      #searchResultPanel {
        position: absolute;
        border: 1px solid #c0c0c0;
        width: 150px;
        height: auto;
        display: none;
      }
    }
    // #searchResultPanel {
    // //   position: absolute;
    //   border: 1px solid #c0c0c0;
    //   width: 150px;
    //   height: auto;
    //   display: none;
    //   z-index: 999;
    // }
  }
}
.all_det {
  height: 75vh;
  width: 82.76vw;
  overflow: hidden;
  p {
    color: red;
  }
  #route_det {
    height: 3vh;
    line-height: 3vh;
    width: auto;
    border: 1px solid blue;
    color: black;
    text-align: center;
    vertical-align: middle;
    font: bold;
  }
  #map_det {
    position: relative;
    height: 85vh;
    width: 82.76vw;
    // float: left;
    border: 0.1vh solid #3dcaf5;
    transition: 0.5s;
    #mapview_det {
      position: absolute;
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
  }
}
canvas {
  width: auto !important;
  max-width: none !important;
}
</style>
<style>
/* 解决搜索框层级问题 */
.tangram-suggestion-main {
  z-index: 999999;
}

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
#mytable
  > div.el-table.table.el-table--fit.el-table--border.el-table--fluid-height.el-table--scrollable-y.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small
  > div.el-table__body-wrapper.is-scrolling-none {
  height: 55vh;
}
/* //.button {
    //     z-index: 999;
    //     position: absolute;
    //     bottom: 10vh;
    //     margin-left: 2vh;
    //     padding: 1vh 1vh;
    //     border-radius: 0.25vh;
    //     background-color: #fff;
    //     box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
    //   }
    //   .button2 {
    //     z-index: 999;
    //     position: absolute;
    //     bottom: 12rem;
    //     margin-left: 7.5rem;
    //     padding: 1rem 1rem;
    //     border-radius: 0.25rem;
    //     background-color: #fff;
    //     box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
    //   }
    //   .button3 {
    //     z-index: 999;
    //     position: absolute;
    //     bottom: 8.5rem;
    //     margin-left: 2rem;
    //     padding: 1rem 1rem;
    //     border-radius: 0.25rem;
    //     background-color: #fff;
    //     box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
    //   }
    //   .button4 {
    //     z-index: 999;
    //     position: absolute;
    //     bottom: 8.5rem;
    //     margin-left: 7.5rem;
    //     padding: 1rem 1rem;
    //     border-radius: 0.25rem;
    //     background-color: #fff;
    //     box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
    //   } */
</style>
