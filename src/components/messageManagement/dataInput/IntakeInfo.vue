<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
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
          <el-breadcrumb-item>消纳场管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <div id="select">
      <!-- <button
        @click="intakeDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button> -->
      <!-- <span>消纳厂序号:</span>
      <input
        v-model="select_intakeName"
        type="text"
        placeholder="请输入消纳厂序号"
        class="input-style"
      /> -->
      <span>消纳厂名称:</span>
      <input
        v-model="select_intakeAttrbute"
        type="text"
        class="input-style"
        placeholder="请输入消纳厂名称"
      />
      <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
    </div>
    <div id="mytable">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        border
        class="table"
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
        <el-table-column
          prop="id"
          align="center"
          label="消纳厂序号"
        ></el-table-column>
        <el-table-column
          prop="intakePlantName"
          align="center"
          label="消纳厂名称"
        ></el-table-column>
        <el-table-column
          prop="intakePlantAddress"
          align="center"
          label="位置"
        ></el-table-column>
        <el-table-column
          prop="intakePlantLong"
          align="center"
          label="经度"
        ></el-table-column>
        <el-table-column
          prop="intakePlantLat"
          align="center"
          label="纬度"
        ></el-table-column>
        <el-table-column
          prop="reviewStatus"
          label="审核状态"
          align="center"
          :filters="[
            { text: '待审核', value: 0 },
            { text: '审核通过', value: 1 },
            { text: '审核未通过', value: 2 }
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
              @click="getMessage(scope.row.intakePlantId)"
              >详情</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateIntakeId(scope.row.intakePlantId)"
              >更改</el-button
            >
            <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewIntakeId(scope.row.intakePlantId)"
              >审核</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.intakePlantId)"
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
    <!-- 申报表单 -->

    <el-dialog
      :visible.sync="intakeDialog"
      width="40%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="intakeFormRef"
        :rules="intakeFormRules"
        :model="intakeForm"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="消纳厂序号" prop="id">
            <el-input v-model="intakeForm.id" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="消纳厂名称" prop="intakePlantName">
            <el-input v-model="intakeForm.intakePlantName" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="位置" prop="intakePlantAddress">
            <el-input v-model="intakeForm.intakePlantAddress" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="经度" prop="intakePlantLong">
            <el-input v-model="intakeForm.intakePlantLong" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="纬度" prop="intakePlantLat">
            <el-input v-model="intakeForm.intakePlantLat" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-button type="success" @click="mapVisible = true" >定位点</el-button>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="联系人" prop="intakeLinkman">
            <el-input v-model="intakeForm.intakeLinkman" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="联系电话" prop="intakePhoneNo">
            <el-input v-model="intakeForm.intakePhoneNo" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :offset="1">
          <el-form-item label="审核状态" prop="reviewStatus">
            <el-radio-group v-model="intakeForm.reviewStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">准予通过</el-radio>
              <el-radio :label="2">不准予通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="备注" prop="content">
            <el-input v-model="intakeForm.content" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="3">
          <el-form-item>
            <el-button type="primary" @click="addData">确认提交</el-button>
            <el-button @click="resetIntakeForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>
    <!-- 显示详情 -->
    <el-dialog
      :visible.sync="intakeDialog3"
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="intakeForm2" :inline="true">
        <el-form-item label="消纳厂序号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.id
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="消纳厂名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakePlantName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="位置">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakePlantAddress
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="经度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakePlantLong
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="纬度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakePlantLat
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakeLinkman
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.intakePhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.inputName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              intakeForm2.inputTime
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="审核状态">
          ：&nbsp;&nbsp;
          <span style="color: red" v-if="intakeForm2.reviewStatus === 0"
            >待审核</span
          >
          <span style="color: red" v-if="intakeForm2.reviewStatus === 1"
            >审核通过</span
          >
          <span style="color: red" v-if="intakeForm2.reviewStatus === 2"
            >审核未通过</span
          > </el-form-item
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </el-form>
    </el-dialog>
    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="intakeDialog2"
      width="40%"
      title="请修改申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="intakeFormRef2"
        :rules="intakeFormRules2"
        :model="intakeForm2"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="消纳厂序号" prop="id">
            <el-input :disabled="true" v-model="intakeForm2.id" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="消纳厂名称" prop="intakePlantName">
            <el-input v-model="intakeForm2.intakePlantName" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="位置" prop="intakePlantAddress">
            <el-input v-model="intakeForm2.intakePlantAddress" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="经度" prop="intakePlantLong">
            <el-input v-model.number="intakeForm2.intakePlantLong" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="纬度" prop="intakePlantLat">
            <el-input v-model.number="intakeForm2.intakePlantLat" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-button type="success" @click="mapVisible = true">定位点</el-button>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="备注" prop="content">
            <el-input v-model="intakeForm2.content" style="width:300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :offset="1">
          <el-form-item label="审核状态" prop="reviewStatus">
            <el-radio-group v-model="intakeForm2.reviewStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item>
            <el-button type="primary" @click="updateData">确认修改</el-button>
            <el-button @click="resetIntakeForm2">取消修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>
    <!-- 管理员修改审核状态 -->
    <!-- 切换状态的对话框 -->
    <el-dialog
      title="请确定审核状态"
      :visible.sync="reviewDialog"
      width="40%"
      append-to-body
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
    <!-- 设置电子围栏-选择设置方法的对话框 -->
    <el-dialog
      title="请选择绘制电子围栏方法"
      :visible.sync="efDialog"
      width="60%"
      append-to-body
    >
      <div>
        <!-- <div class="way1">
          <span>方法一：输入电子围栏坐标</span>
          <el-input
            placeholder="请输入经纬度坐标"
            v-model="ef_way1"
            class="handle-input4 mr10"
          ></el-input>
          <el-button type="primary" @click="saveWay1">确认</el-button>
          <p class="way1_p">
            注：请使用百度地图坐标，不同经纬度以英文逗号分隔：经度;纬度;经度;纬度
            <br />如116.412732;39.911707;116.39455;39.910932;116.403461;39.921336(至少三个点)
          </p>
        </div> -->
        <div class="way2">
          方法二：画图绘制电子围栏
          <el-button
            class="way2_btn"
            type="primary"
            @click="(showef = true), (isClickChangeEf = true)"
            >选择</el-button
          >
          <el-button class="way2_btn" type="primary" @click="saveWay2"
            >确定</el-button
          >
        </div>
      </div>
      <div class="showef" v-if="!showef">
        <baidu-map
          class="bm-view"
          @click="getClickInfo"
          :scroll-wheel-zoom="true"
          :zoom="15"
          :center="efCenter"
        >
          <bm-map-type
            :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
            anchor="BMAP_ANCHOR_TOP_RIGHT"
          ></bm-map-type>
          <bm-polygon
            :path="polygonPath"
            stroke-color="blue"
            :stroke-opacity="1"
            :stroke-weight="2"
            :editing="true"
            @lineupdate="updatePolygonPath"
          />
        </baidu-map>
      </div>
      <div class="showef">
        <label v-if="showef">
          地址：
          <input v-model="keyword" />
        </label>
        <baidu-map
          class="map"
          :center="{ lng: 114.067, lat: 22.617 }"
          :scroll-wheel-zoom="true"
          :zoom="14"
          @mousemove="syncPolyline"
          @click="paintPolyline"
          @rightclick="newPolyline"
          v-if="showef"
        >
          <bm-map-type
            :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
            anchor="BMAP_ANCHOR_TOP_RIGHT"
          ></bm-map-type>
          <bm-control>
            <el-button type="primary" @click="toggle('polyline')">{{
              polyline.editing ? "停止绘制" : "开始绘制"
            }}</el-button>
            <el-button type="primary" @click="del">重新绘制</el-button>
          </bm-control>
          <bm-local-search
            :keyword="keyword"
            :auto-viewport="true"
            :location="location"
            zoom="12.8"
            style="display: none"
          ></bm-local-search>
          <bm-polyline
            :path="path"
            v-for="path of polyline.paths"
            :key="path.toString()"
          ></bm-polyline>
        </baidu-map>
      </div>
    </el-dialog>

    <el-dialog
      title="定位设置"
      :visible.sync="mapVisible"
      id="mapDialog"
      width="50%"
      append-to-body
    >
      <el-input
        placeholder="请输入搜索地址"
        v-model="mapName"
        @keydown.enter.native="seachEnterFun"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="mapNameChange"
        ></el-button>
      </el-input>
      <baidu-map
        class="map"
        :center="center"
        :zoom="zoom"
        @ready="handler"
        :scroll-wheel-zoom="true"
        @click="clickEvent"
        ak="33B192o1jPaqOHASGGAIkoMuwi8W76j3"
      >
        <!-- 地图控件位置 -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!-- 城市列表 -->
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
        <!-- 定位当前位置 -->
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="false"
          :autoLocation="true"
          @locationSuccess="getLoctionSuccess"
        ></bm-geolocation>
        <!-- 地图容器 -->
        <!-- <bm-view :style="{width:'100%',height: this.clientHeight+'px',flex: 1,marginBottom:'-30px'}"></bm-view> -->
        <bm-view
          :style="{
            width: '100%',
            height: '365px',
            flex: 1,
            marginBottom: '-30px'
          }"
        ></bm-view>
      </baidu-map>

      <div slot="footer" class="dialog-footer">
        <div class="demo-input-suffix">
          <el-link type="danger">lng：</el-link
          ><el-input
            class="lineinput"
            style="width:150px"
            size="mini"
            v-model.number="locData.longitude"
          ></el-input>
          <el-link type="danger">lat：</el-link
          ><el-input
            class="lineinput"
            style="width:150px"
            size="mini"
            v-model.number="locData.latitude"
          ></el-input>
          <el-link type="danger">address：</el-link
          ><el-input
            class="lineinput"
            style="width:200px"
            size="mini"
            v-model="locData.address"
          ></el-input>
        </div>
        <el-button
          type="warning"
          size="small"
          icon="el-icon-close"
          @click.native="mapVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-check"
          @click.native="findlocation"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 导入请求方法
import {
  selectIntakeDataByInputName,
  insertIntakeData,
  updateIntakeData,
  deleteIntakeDataById,
  selectAllIntakeData,
  updateIntakeReviewStatus,
  selectByIdAndSOrI,
  insertEfData,
  deleteEfData
  //  findAll,
  // getNumOfAllData,
} from "../../../assets/axios/index";
// 导入js方法
// 求当前时间的方法
import getNowtime from "../../../assets/js/index";
import {
  BaiduMap,
  BmNavigation,
  BmView,
  BmGeolocation,
  BmCityList
} from "vue-baidu-map";

export default {
  name: "mapDialog",
  components: {
    BaiduMap,
    BmNavigation,
    BmView,
    BmGeolocation,
    BmCityList
  },

  data() {
    return {
      map: "",

      dialogMap: false,
      mapName: "",
      mapPointName: "",
      loading: true,
      mapGetshow: true,
      dialogName: "",

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
        height: "5.741vh"
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
      select_intakeName: "",
      select_intakeAttrbute: "",
      select_qmDeptNo: "",

      // 填写申报信息的对话框
      intakeDialog: false,
      // 表单绑定值
      intakeForm: {
        intakePlantId: "",
        id: "",
        intakePlantName: "",
        intakePlantAddress: "",
        intakePlantLong: "",
        intakePlantLat: "",
        intakeLinkman: "",
        intakePhoneNo: "",
        inputName: "",
        inputTime: "",
        content: "",
        reviewStatus: ""
      },
      // 表单验证规则
      intakeFormRules: {
        intakePlantId: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        intakePlantName: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        intakePlantAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        intakePlantLong: [
          { required: true, message: "不能为空!", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        intakePlantLat: [
          { required: true, message: "不能为空!", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        reviewStatus: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ]
      },
      // 修改申报信息的对话框
      intakeDialog2: false,
      // 表单绑定值
      intakeForm2: {
        intakePlantId: "",
        id: "",
        intakePlantName: "",
        intakePlantAddress: "",
        intakePlantLong: "",
        intakePlantLat: "",
        intakeLinkman: "",
        intakePhoneNo: "",
        inputName: "",
        inputTime: "",
        content: "",
        reviewStatus: ""
      },
      // 表单验证规则
      intakeFormRules2: {
        intakePlantName: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        // inputName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        // inputTime: [{ required: true, message: "不能为空!", trigger: "blur" }],
        intakePlantAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        intakePlantLong: [
          { required: true, message: "不能为空!", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        intakePlantLat: [
          { required: true, message: "不能为空!", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        reviewStatus: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ]
      },
      // 打开查看详情的对话框
      intakeDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentintakeId: 0,

      // 电子围栏
      // 电子围栏绘制方法对话框
      efDialog: false,
      // 电子围栏经纬度数据
      efData: [],
      // 方法一输入框绑定值
      ef_way1: "",
      // 保存经纬度的列表
      lngList: [],
      latList: [],

      // 电子围栏显示
      // 点集坐标
      polygonPath: [],
      // 中心点
      efCenter: { lng: 114.067, lat: 22.617 },
      // 控制显示是绘制还是展现
      showef: false,
      // 绘制电子围栏的绑定数据
      polyline: {
        editing: false,
        paths: []
      },
      // 地图搜索框绑定值
      location: "深圳",
      keyword: "", //搜索框关键词

      //是否点击修改电子围栏
      isClickChangeEf: false,

      center: { lng: 121.833138, lat: 39.081725 },
      zoom: 12,
      mapVisible: false,
      locData: {
        longitude: "",
        latitude: "",
        address: ""
      },
      clientHeight: document.documentElement.clientHeight - 90, // 屏幕高度
      iconUrl: "icon/map_marker_check.png"
    };
  },
  filters: {
    // 修改时间格式的过滤器
    datetimeFormat: function(value) {
      let time = new Date();
      let year = time.getFullYear();
      let mouth =
        time.getMonth() + 1 < 10
          ? "0" + (time.getMonth() + 1)
          : time.getMonth() + 1;
      let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      let hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      let min =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      let sec =
        time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
      let date = `${year}-${mouth}-${day} ${hour}:${min}:${sec}`;
      return date;
    },
    // 显示审核状态的过滤器----
    reviewStatusFormat: function(value) {
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
    }
  },
  watch: {
    // 监听查询输入框--实现查询筛选功能
    select_intakeName: function() {
      // console.log(this.select_intakeName);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_intakeName;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].intakePlantId.indexOf(input) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_intakeAttrbute: function() {
      // console.log(this.select_intakeAttrbute);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_intakeAttrbute;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].intakePlantName.indexOf(input) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 监听输入的坐标-实现实时显示电子围栏
    ef_way1: function() {
      this.efCenter = { lng: 114.067, lat: 22.617 };
      this.polygonPath = [];
      // 获取经纬度
      let result = this.ef_way1.split(";");
      let lngList = [];
      let latList = [];
      for (let i = 0; i < result.length / 2; i++) {
        lngList.push(result[2 * i]);
        latList.push(result[2 * i + 1]);
      }
      // 求显示中心
      let clng = 0;
      let clat = 0;
      for (let i = 0; i < lngList.length; i++) {
        clng += parseFloat(lngList[i]);
        clat += parseFloat(latList[i]);
      }
      // console.log(clng);
      this.efCenter = {
        lng: clng / lngList.length,
        lat: clat / lngList.length
      };
      //console.log(this.efCenter);
      let path = [];
      for (let i = 0; i < lngList.length; i++) {
        let one = {
          lng: lngList[i],
          lat: latList[i]
        };
        path.push(one);
      }
      this.polygonPath = path;
      //console.log(this.polygonPath);
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    // 请求数据方法
    getData() {
      // 根据用户名来判断请求的数据
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        selectIntakeDataByInputName(this.username).then(res => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          //console.log(this.subTableData);
        });
      } else {
        //如果是管理员，则请求所有的数据
        selectAllIntakeData(false).then(res => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          //console.log(this.allData);
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // //console.log(this.subTableData);
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
      // 改变每页显示条数时请求数据
      let page = {
        page: this.currentPage,
        size: this.PageSize
      };
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

    // 表单
    // 点击取消和X按钮，重置表单
    resetIntakeForm() {
      this.$refs.intakeFormRef.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      // 表单验证
      let isLegal = true;
      this.$refs["intakeFormRef"].validate(valid => {
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
        id: this.intakeForm.id,
        intakePlantName: this.intakeForm.intakePlantName,
        intakePlantAddress: this.intakeForm.intakePlantAddress,
        intakePlantLong: this.intakeForm.intakePlantLong,
        intakePlantLat: this.intakeForm.intakePlantLat,
        intakeLinkman: this.intakeForm.intakeLinkman,
        intakePhoneNo: this.intakeForm.intakePhoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        content: this.intakeForm.content,
        reviewStatus: this.intakeForm.reviewStatus
      };

      // console.log(data);
      insertIntakeData(data)
        .then(() => {
          this.$message({
            message: "提交成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.intakeDialog = false;
          // 重置表单
          this.resetIntakeForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 点击取消和X按钮，重置表单
    resetIntakeForm2() {
      this.$refs.intakeFormRef2.resetFields();
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateIntakeId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.intakePlantId == id) {
          return true;
        }
      });
      // console.log(this.allData[index]);
      this.intakeForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      // console.log(this.intakeForm2);
      //将是否点击修改电子围栏绑定值设置为false
      this.isClickChangeEf = false;
      // 打开对话框
      this.intakeDialog2 = true;
    },
    // 修改表单
    updateData() {
      // 表单验证
      let isLegal = true;
      this.$refs["intakeFormRef2"].validate(valid => {
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
        intakePlantName: this.intakeForm2.intakePlantName,
        intakePlantAddress: this.intakeForm2.intakePlantAddress,
        intakePlantLong: this.intakeForm2.intakePlantLong,
        intakePlantLat: this.intakeForm2.intakePlantLat,
        intakeLinkman: this.intakeForm2.intakeLinkman,
        intakePhoneNo: this.intakeForm2.intakePhoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        content: this.intakeForm2.content,
        reviewStatus: this.intakeForm2.reviewStatus,
        id: this.intakeForm2.id,
        intakePlantId: this.intakeForm2.intakePlantId
      };
      // console.log(data);
      updateIntakeData(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.intakeDialog2 = false;
          // 重置表单
          this.resetIntakeForm2();
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
        type: "warning"
      })
        .then(() => {
          // 根据id找到index
          let index = this.allData.findIndex(item => {
            if (item.intakePlantId == id) {
              return true;
            }
          });
          // 判断是否能删除
          // if (window.sessionStorage.namen !== this.allData[index].inputName) {
          //   this.$message({
          //     message: "对不起，您无权删除该数据！",
          //     type: "danger",
          //     offset: 300,
          //     center: true,
          //     duration: 1000,
          //   });
          // } else {
          let intakeId = this.allData[index].intakePlantId;
          deleteIntakeDataById(intakeId)
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
          // }
          // 删除电子围栏数据
          // deleteEfData(0, intakeId);
        })
        .catch(() => {});
    },
    // 参看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.intakePlantId == id) {
          return true;
        }
      });

      this.intakeForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.intakeDialog3 = true;
    },
    // 管理员进行审核操作
    getReviewIntakeId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.intakePlantId == id) {
          return true;
        }
      });
      this.reviewDialog = true;
      this.reviewStatusRadio = this.allData[index].reviewStatus;
      this.currentIntakeId = this.allData[index].intakePlantId;
      //console.log(this.reviewStatusRadio);
    },
    // 更改审核状态
    review() {
      updateIntakeReviewStatus(this.currentIntakeId, this.reviewStatusRadio)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
        })
        .then(() => {
          this.reviewDialog = false;
          //重新渲染表格
          this.getData();
        });
    },
    // 电子围栏
    // 设置电子方法一-保存经纬度数据
    saveWay1() {
      this.lngList = [];
      this.latList = [];
      // 获取经纬度
      let result = this.ef_way1.split(";");
      for (let i = 0; i < result.length / 2; i++) {
        this.lngList.push(result[2 * i]);
        this.latList.push(result[2 * i + 1]);
      }
      this.efDialog = false;
    },
    getEF(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.intakePlantId == id) {
          return true;
        }
      });
      // console.log("hehehehhe:" + "fine");
      let intakeid = this.allData[index].intakePlantId;
      // 将点击的id保存在vuex中
      this.$store.commit("set_efId", intakeid);
      this.$router.replace("/gs_intakeplant_ef");
    },
    // 方法2保存经纬度数据
    saveWay2() {
      this.lngList = [];
      this.latList = [];
      this.showef = false;
      for (let i = 0; i < this.polyline.paths[0].length; i++) {
        this.lngList.push(this.polyline.paths[0][i].lng);
        this.latList.push(this.polyline.paths[0][i].lat);
      }
      // 渲染电子围栏
      this.efCenter = { lng: 114.067, lat: 22.617 };
      this.polygonPath = [];
      // 求显示中心
      let clng = 0;
      let clat = 0;
      for (let i = 0; i < this.lngList.length; i++) {
        clng += parseFloat(this.lngList[i]);
        clat += parseFloat(this.latList[i]);
      }
      // console.log(clng);
      this.efCenter = {
        lng: clng / this.lngList.length,
        lat: clat / this.latList.length
      };
      // console.log(this.efCenter);
      let path = [];
      for (let i = 0; i < this.lngList.length; i++) {
        let one = {
          lng: this.lngList[i],
          lat: this.latList[i]
        };
        path.push(one);
      }
      this.polygonPath = path;
      //console.log(this.polygonPath);
    },
    // 电子围栏显示
    //点击获取到当前经纬度
    getClickInfo(e) {
      //console.log(e.point.lng);
      //console.log(e.point.lat);
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath();
      //console.log(this.polygonPath);
    },
    // 绘制电子围栏的方法
    // toggle(name) {
    //   this[name].editing = !this[name].editing;
    // },
    // syncPolyline(e) {
    //   if (!this.polyline.editing) {
    //     return;
    //   }
    //   const { paths } = this.polyline;
    //   if (!paths.length) {
    //     return;
    //   }
    //   const path = paths[paths.length - 1];
    //   if (!path.length) {
    //     return;
    //   }
    //   if (path.length === 1) {
    //     path.push(e.point);
    //   }
    //   this.$set(path, path.length - 1, e.point);
    // },
    // newPolyline(e) {
    //   if (!this.polyline.editing) {
    //     return;
    //   }
    //   const { paths } = this.polyline;
    //   if (!paths.length) {
    //     paths.push([]);
    //   }
    //   const path = paths[paths.length - 1];
    //   path.pop();
    //   if (path.length) {
    //     paths.push([]);
    //   }
    // },
    // paintPolyline(e) {
    //   if (!this.polyline.editing) {
    //     return;
    //   }
    //   const { paths } = this.polyline;
    //   !paths.length && paths.push([]);
    //   paths[paths.length - 1].push(e.point);
    //   // console.log(this.polyline);
    // },
    // del() {
    //   this.polyline = {
    //     editing: false,
    //     paths: [],
    //   };
    // },

    handler({ BMap, map }) {
      let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          console.log(r);
          _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
          _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
          _this.initLocation = true;
        },
        { enableHighAccuracy: true }
      );

      window.map = map;
    },
    //点击地图监听
    clickEvent(e) {
      map.clearOverlays();
      let Icon_0 = new BMap.Icon(
        "../static/img/point1.png",
        new BMap.Size(64, 64),
        { anchor: new BMap.Size(18, 32), imageSize: new BMap.Size(36, 36) }
      );
      var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat), {
        icon: Icon_0
      });
      map.addOverlay(myMarker);
      //用所定位的经纬度查找所在地省市街道等信息
      var point = new BMap.Point(e.point.lng, e.point.lat);
      var gc = new BMap.Geocoder();
      let _this = this;
      gc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        //console.log(rs.address);//地址信息
        _this.locData.address = rs.address;
      });
      this.locData.longitude = e.point.lng;
      this.locData.latitude = e.point.lat;
    },
    //定位成功回调
    getLoctionSuccess(point, AddressComponent, marker) {
      map.clearOverlays();
      let Icon_0 = new BMap.Icon(
        "../static/img/point1.png",
        new BMap.Size(64, 64),
        { anchor: new BMap.Size(18, 32), imageSize: new BMap.Size(36, 36) }
      );
      var myMarker = new BMap.Marker(
        new BMap.Point(point.point.lng, point.point.lat),
        { icon: Icon_0 }
      );
      map.addOverlay(myMarker);
      this.locData.longitude = point.point.lng;
      this.locData.latitude = point.point.lat;
      this.intakeForm.intakePlantLong = this.locData.longitude;
      this.intakeForm.intakePlantLat = this.locData.latitude;
    },
    findlocation() {
      this.$emit("findlocdata", this.locData);
      this.mapVisible = false;
      this.intakeForm.intakePlantLong = this.locData.longitude;
      this.intakeForm.intakePlantLat = this.locData.latitude;
      // this.intakeForm.intakePlantAddress = this.locData.address;
      this.intakeForm2.intakePlantLong = this.locData.longitude;
      this.intakeForm2.intakePlantLat = this.locData.latitude;
      // this.intakeForm2.intakePlantAddress = this.locData.address
    },
    mapShow() {
      this.mapVisible = true;
    },
    //搜索地图
    mapNameChange() {
      let that = this,
        point,
        marker = null;
      let local = new BMap.LocalSearch(map, {
        renderOptions: { map: map },
        onSearchComplete: res => {
          if (local.getResults() != undefined) {
            map.clearOverlays(); //清除地图上所有覆盖物
            if (local.getResults().getPoi(0)) {
              point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
              map.centerAndZoom(point, 10);
              marker = new BMap.Marker(point); // 创建标注
              map.addOverlay(marker); // 将标注添加到地图中
              marker.enableDragging(); // 可拖拽
            } else {
              alert("未匹配到地点!可拖动地图上的红色图标到精确位置");
            }
          } else {
            alert("未找到搜索结果");
          }
        }
      });
      local.search(this.mapName);
    },
    seachEnterFun(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.mapNameChange();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-input-suffix {
  position: margin-bottom;
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

    border: none;
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
.way1 {
  font-size: 16px;
  margin-bottom: 20px;
}
.handle-input4 {
  width: 400px;
}
.way1_p {
  margin-top: 10px;
  color: red;
}
.way2_btn {
  margin-left: 20px;
}
.bm-view {
  width: 100%;
  height: 300px;
}
.showef {
  margin-top: 20px;
}
.map {
  width: 100%;
  height: 300px;
}
</style>
