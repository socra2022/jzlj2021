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
            >资源场申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >资源场管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>

    <div id="select">
      <button
        @click="resourceInfoDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button>
      <span>资源场名称：</span>
      <input
        v-model="select_resourceName"
        type="text"
        class="input-style"
        placeholder="请输入资源场名称"
      />
      <span>资源场类型：</span>
      <input
        v-model="select_resourceAttrbute"
        type="text"
        class="input-style"
        placeholder="请输入资源场类型"
      />
      <span>资源场位置：</span>
      <input
        v-model="select_qmDeptNo"
        type="text"
        class="input-style"
        placeholder="请输入资源场位置"
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
        :cell-style="this.cellStyle"
        max-height="600"
      >
        <el-table-column
          type="index"
          label="ID"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="carId" label="ID" width="55" align="center"></el-table-column> -->
        <el-table-column
          prop="resourcePlantName"
          label="资源场名称"
        ></el-table-column>
        <el-table-column
          prop="resourcePlantAddress"
          label="资源场位置"
        ></el-table-column>
        <el-table-column
          prop="resourcePlantType"
          label="资源场类型"
        ></el-table-column>
        <el-table-column
          prop="dailyAcceptance"
          label="每日收纳量"
          width="120"
        ></el-table-column>
        <el-table-column prop="dailyOutput" label="日产出量"></el-table-column>
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
              @click="getMessage(scope.row.resourcePlantId)"
              >详情</el-button
            >
            <el-button
              type="text"
              icon="el-icon-eleme"
              @click="getEF(scope.row.resourcePlantId)"
              >电子围栏</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateResourceId(scope.row.resourcePlantId)"
              >更改</el-button
            >
            <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewResourceId(scope.row.resourcePlantId)"
              >审核</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.resourcePlantId)"
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
      :visible.sync="resourceInfoDialog"
      width="60%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="resourceInfoFormRef"
        :rules="resourceInfoFormRules"
        :model="resourceInfoForm"
        :inline="true"
      >
        <el-form-item label="资源场名称" prop="resourcePlantName">
          <el-input v-model="resourceInfoForm.resourcePlantName"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="resourcePlantAddress">
          <el-input v-model="resourceInfoForm.resourcePlantAddress"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="resourcePlantLong">
          <el-input v-model.number="resourceInfoForm.resourcePlantLong"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="resourcePlantLat">
          <el-input v-model.number="resourceInfoForm.resourcePlantLat"></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="resourceInfoForm.legalPerson"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="responsiblePerson">
          <el-input v-model="resourceInfoForm.responsiblePerson"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="resourcePlantType">
          <el-input v-model="resourceInfoForm.resourcePlantType"></el-input>
        </el-form-item>
        <el-form-item label="每日收纳量" prop="dailyAcceptance">
          <el-input v-model="resourceInfoForm.dailyAcceptance"></el-input>
        </el-form-item>
        <el-form-item label="日产出量" prop="dailyOutput">
          <el-input v-model="resourceInfoForm.dailyOutput"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="content">
          <el-input v-model="resourceInfoForm.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="efDialog = true"
            >设置电子围栏</el-button
          >
          <el-button type="primary" @click="addData">确认提交</el-button>
          <el-button @click="resetResourceInfoForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="resourceInfoDialog2"
      width="60%"
      title="请修改申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="resourceInfoFormRef2"
        :rules="resourceInfoFormRules2"
        :model="resourceInfoForm2"
        :inline="true"
      >
        <el-form-item label="资源场序号" prop="resourcePlantId">
          <el-input
            :disabled="true"
            v-model="resourceInfoForm2.resourcePlantId"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源场名称" prop="resourcePlantName">
          <el-input v-model="resourceInfoForm2.resourcePlantName"></el-input>
        </el-form-item>
        <el-form-item label="资源场位置" prop="resourcePlantAddress">
          <el-input v-model="resourceInfoForm2.resourcePlantAddress"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="resourcePlantLong">
          <el-input v-model.number="resourceInfoForm2.resourcePlantLong"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="resourcePlantLat">
          <el-input v-model.number="resourceInfoForm2.resourcePlantLat"></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="resourceInfoForm2.legalPerson"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="responsiblePerson">
          <el-input v-model="resourceInfoForm2.responsiblePerson"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="resourcePlantType">
          <el-input v-model="resourceInfoForm2.resourcePlantType"></el-input>
        </el-form-item>
        <el-form-item label="每日收纳量" prop="dailyAcceptance">
          <el-input v-model="resourceInfoForm2.dailyAcceptance"></el-input>
        </el-form-item>
        <el-form-item label="日产出量" prop="dailyOutput">
          <el-input v-model="resourceInfoForm2.dailyOutput"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="content">
          <el-input v-model="resourceInfoForm2.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="efDialog = true"
            >修改电子围栏</el-button
          >
          <el-button type="primary" @click="updateData">确认修改</el-button>
          <el-button @click="resetResourceInfoForm2">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 显示详情 -->
    <el-dialog
      :visible.sync="resourceInfoDialog3"
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="resourceInfoForm2" :inline="true">
        <el-form-item label="资源场序号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantId
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="资源厂名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="位置">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantAddress
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="经度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantLong
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="纬度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantLat
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="法人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.legalPerson
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="负责人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.responsiblePerson
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="类型">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.resourcePlantType
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="每日收纳量">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.dailyAcceptance
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="日产出量">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.dailyOutput
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.inputName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.inputTime
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="备注">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              resourceInfoForm2.content
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="审核状态">
          ：&nbsp;&nbsp;
          <span style="color: red" v-if="resourceInfoForm2.reviewStatus == 0"
            >待审核</span
          >
          <span style="color: red" v-if="resourceInfoForm2.reviewStatus == 1"
            >审核通过</span
          >
          <span style="color: red" v-if="resourceInfoForm2.reviewStatus == 2"
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
        <div class="way1">
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
        </div>
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
  </div>
</template>

<script>
import {
  selectResourceDataByInputName,
  insertResourceData,
  updateResourceData,
  deleteResourceDataById,
  selectAllResourceData,
  updateResourceReviewStatus,
  selectByIdAndSOrI,
  insertEfData,
  deleteEfData
} from "../../../assets/axios/index";
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
        lineHeight: "3.0vh",
        textAlign: "center",
        height: "5.0vh"
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
      select_resourceName: "",
      select_resourceAttrbute: "",
      select_qmDeptNo: "",

      // 填写申报信息的对话框
      resourceInfoDialog: false,
      // 表单绑定值
      resourceInfoForm: {
        resourcePlantId: "",
        resourcePlantName: "",
        resourcePlantAddress: "",
        resourcePlantLat: "",
        resourcePlantLong: "",
        legalPerson: "",
        responsiblePerson: "",
        resourcePlantType: "",
        dailyAcceptance: "",
        dailyOutput: "",
        inputName: "",
        inputTime: "",
        content: "",
        reviewStatus: ""
      },
      // 表单验证规则
      resourceInfoFormRules: {
        resourcePlantName: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcePlantAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        legalPerson: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        responsiblePerson: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcePlantType: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcePlantLat: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        resourcePlantLong: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ]
      },
      // 修改申报信息的对话框
      resourceInfoDialog2: false,
      // 表单绑定值
      resourceInfoForm2: {
        resourcePlantId: "",
        resourcePlantName: "",
        resourcePlantAddress: "",
        legalPerson: "",
        responsiblePerson: "",
        resourcePlantType: "",
        dailyAcceptance: "",
        dailyOutput: "",
        inputName: "",
        inputTime: "",
        content: "",
        reviewStatus: "",
        resourcePlantLat: "",
        resourcePlantLong: ""
      },
      // 表单验证规则
      resourceInfoFormRules2: {
        resourcePlantName: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcePlantAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        legalPerson: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        responsiblePerson: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcePlantType: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        resourcPlantLat: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        resourcePlantLong: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ]
      },
      // 打开查看详情的对话框
      resourceInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentResourceId: 0,

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
      isClickChangeEf: false
    };
  },
  filters: {
    //修改时间格式的过滤器
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
    select_resourceName: function() {
      // console.log(this.select_resourceName);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_resourceName;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].resourcePlantName.indexOf(input) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_resourceAttrbute: function() {
      // console.log(this.select_resourceAttrbute);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_resourceAttrbute;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].resourcePlantType.indexOf(input) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_qmDeptNo: function() {
      // console.log(this.select_qmDeptNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_qmDeptNo;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].resourcePlantAddress.indexOf(input) != -1) {
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
        selectResourceDataByInputName(this.username).then(res => {
          // //console.log(res.data);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.subTableData);
        });
      } else {
        //如果是管理员，则请求所有的数据
        selectAllResourceData(false).then(res => {
          // console.log(res.data);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.subTableData);
        });
      }
    },

    // 请求数据方法2 --用于更新电子围栏数据
    getData2() {
      // 根据用户名来判断请求的数据
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        selectResourceDataByInputName(this.username)
          .then(res => {
            // console.log(res.data);
            this.allData = JSON.parse(JSON.stringify(res.data.respBody));
            this.tableData = JSON.parse(JSON.stringify(this.allData));
            this.totalCount = this.tableData.length;
            // 备份数据
            this.subTableData = JSON.parse(JSON.stringify(this.tableData));
            //console.log(this.subTableData);
          })
          .then(() => {
            // 保存经纬度数据
            // 封装数据
            let data = [];
            for (let i = 0; i < this.lngList.length; i++) {
              let onedata = {
                id: this.allData[this.allData.length - 1].resourcePlantId,
                sorI: 2,
                lng: this.lngList[i],
                lat: this.latList[i],
                inputName: window.sessionStorage.namen,
                inputTime: getNowtime()
              };
              data.push(onedata);
            }
            // console.log.log(data);
            insertEfData(data);
          });
      } else {
        //如果是管理员，则请求所有的数据
        selectAllResourceData(false)
          .then(res => {
            // console.log(res.data);
            this.allData = JSON.parse(JSON.stringify(res.data.respBody));
            this.tableData = JSON.parse(JSON.stringify(this.allData));
            this.totalCount = this.tableData.length;
            // 备份数据
            this.subTableData = JSON.parse(JSON.stringify(this.tableData));
            // console.log(this.subTableData);
          })
          .then(() => {
            // 保存经纬度数据
            // 封装数据
            let data = [];
            for (let i = 0; i < this.lngList.length; i++) {
              let onedata = {
                id: this.allData[this.allData.length - 1].resourcePlantId,
                sorI: 2,
                lng: this.lngList[i],
                lat: this.latList[i],
                inputName: window.sessionStorage.namen,
                inputTime: getNowtime()
              };
              data.push(onedata);
            }
            insertEfData(data);
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
      // let page = {
      //   page: this.currentPage,
      //   size: this.PageSize,
      // };
      // findAll(page).then((res) => {
      //   //console.log(res);
      //   this.allData = JSON.parse(JSON.stringify(res.data));
      //   this.tableData = JSON.parse(JSON.stringify(this.allData));
      //   // this.totalCount = this.tableData.length;
      //   // 备份数据
      //   this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      //   // console.log(this.subTableData);
      // });
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },
    //console.log(this.currentPage);
    // 改变页码时请求数据
    //   let page = {
    //     page: this.currentPage,
    //     size: this.PageSize,
    //   };
    //   findAll(page).then((res) => {
    //     //console.log(res);
    //     this.allData = JSON.parse(JSON.stringify(res.data));
    //     this.tableData = JSON.parse(JSON.stringify(this.allData));
    //     // this.totalCount = this.tableData.length;
    //     // 备份数据
    //     this.subTableData = JSON.parse(JSON.stringify(this.tableData));
    //     // console.log(this.subTableData);
    //   });
    // },

    // 根据标签筛选
    filterTag(value, row) {
      return row.reviewStatus == value;
    },

    // 表单
    // 点击取消和X按钮，重置表单
    resetResourceInfoForm() {
      this.$refs.resourceInfoFormRef.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      // 封装插入的数据
      let data = {
        resourcePlantName: this.resourceInfoForm.resourcePlantName,
        resourcePlantAddress: this.resourceInfoForm.resourcePlantAddress,
        resourcePlantLat: this.resourceInfoForm.resourcePlantLat,
        resourcePlantLong: this.resourceInfoForm.resourcePlantLong,
        legalPerson: this.resourceInfoForm.legalPerson,
        responsiblePerson: this.resourceInfoForm.responsiblePerson,
        resourcePlantType: this.resourceInfoForm.resourcePlantType,
        dailyAcceptance: this.resourceInfoForm.dailyAcceptance,
        dailyOutput: this.resourceInfoForm.dailyOutput,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        content: this.resourceInfoForm.content,
        reviewStatus: 0
      };
      insertResourceData(data)
        .then(() => {
          this.$message({
            message: "提交成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.resourceInfoDialog = false;
          // 重置表单
          this.resetResourceInfoForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData2();
        });
    },
    // 点击取消和X按钮，重置表单
    resetResourceInfoForm2() {
      this.$refs.resourceInfoFormRef2.resetFields();
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateResourceId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.resourcePlantId == id) {
          return true;
        }
      });

      this.resourceInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      //渲染电子围栏
      selectByIdAndSOrI(
        0,
        parseInt(this.resourceInfoForm2.resourcePlantId)
      ).then(res => {
        this.efData = JSON.parse(JSON.stringify(res.data.respBody));
        //console.log(this.efData);
        this.efCenter = { lng: 114.067, lat: 22.617 };
        this.polygonPath = [];
        // 获取经纬度
        let lngList = [];
        let latList = [];
        for (let i = 0; i < this.efData.length; i++) {
          lngList.push(this.efData[i].lng);
          latList.push(this.efData[i].lat);
        }
        // 求显示中心
        let clng = 0;
        let clat = 0;
        for (let i = 0; i < lngList.length; i++) {
          clng += parseFloat(lngList[i]);
          clat += parseFloat(latList[i]);
        }
        //console.log(clng);
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
      });
      //将是否点击修改电子围栏绑定值设置为false
      this.isClickChangeEf = false;
      // 打开对话框
      this.resourceInfoDialog2 = true;
    },
    // 修改表单
    updateData() {
      let data = {
        resourcePlantId: this.resourceInfoForm2.resourcePlantId,
        resourcePlantName: this.resourceInfoForm2.resourcePlantName,
        resourcePlantAddress: this.resourceInfoForm2.resourcePlantAddress,
        resourcePlantLat: this.resourceInfoForm2.resourcePlantLat,
        resourcePlantLong: this.resourceInfoForm2.resourcePlantLong,
        legalPerson: this.resourceInfoForm2.legalPerson,
        responsiblePerson: this.resourceInfoForm2.responsiblePerson,
        resourcePlantType: this.resourceInfoForm2.resourcePlantType,
        dailyAcceptance: this.resourceInfoForm2.dailyAcceptance,
        dailyOutput: this.resourceInfoForm2.dailyOutput,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        content: this.resourceInfoForm2.content,
        reviewStatus: 0
      };
      updateResourceData(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.resourceInfoDialog2 = false;
          // 重置表单
          this.resetResourceInfoForm2();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
      // console.log(this.isClickChangeEf);
      if (this.isClickChangeEf) {
        // 先删除电子围栏数据-再插入--达到更新的目的
        deleteEfData(2, this.resourceInfoForm2.resourcePlantId).then(() => {
          // 保存经纬度数据
          // 封装数据
          let data = [];
          for (let i = 0; i < this.lngList.length; i++) {
            let onedata = {
              id: this.resourceInfoForm2.resourcePlantId,
              sorI: 2,
              lng: this.lngList[i],
              lat: this.latList[i],
              inputName: window.sessionStorage.namen,
              inputTime: getNowtime()
            };
            data.push(onedata);
          }
          insertEfData(data);
        });
      }
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
            if (item.resourcePlantId == id) {
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
              duration: 1000
            });
          } else {
            let resourcePlantId = this.allData[index].resourcePlantId;
            //删除电子围栏
            deleteResourceDataById(resourcePlantId)
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
            deleteEfData(2, resourcePlantId);
          }
        })
        .catch(() => {});
    },
    // 参看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.resourcePlantId == id) {
          return true;
        }
      });
      // console.log(this.allData[index]);
      // 修改状态值 0-启用。。。
      // if (this.allData[index].status === 0) {
      //   this.allData[index].status = "启用";
      // }
      // if (this.allData[index].status === 1) {
      //   this.allData[index].status = "未启用";
      // }
      // if (this.allData[index].status === 2) {
      //   this.allData[index].status = "资质异常";
      // }
      this.resourceInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.resourceInfoDialog3 = true;
    },

    // 管理员进行审核操作
    getReviewResourceId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.resourcePlantId == id) {
          return true;
        }
      });
      this.reviewDialog = true;
      this.reviewStatusRadio = this.allData[index].reviewStatus;
      this.currentResourceId = this.allData[index].resourcePlantId;
      //console.log("hhhh" + this.reviewStatusRadio);
    },
    // 更改审核状态
    review() {
      updateResourceReviewStatus(this.currentResourceId, this.reviewStatusRadio)
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
        if (item.resourcePlantId == id) {
          return true;
        }
      });
      let resourceid = this.allData[index].resourcePlantId;
      // 将点击的id保存在vuex中
      this.$store.commit("set_efId", resourceid);
      this.$router.replace("/gs_resource_ef");
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
      //console.log(this.efCenter);
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
      // console.log(e.point.lng);
      // console.log(e.point.lat);
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath();
      //console.log(this.polygonPath);
    },
    // 绘制电子围栏的方法
    toggle(name) {
      this[name].editing = !this[name].editing;
    },
    syncPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        return;
      }
      const path = paths[paths.length - 1];
      if (!path.length) {
        return;
      }
      if (path.length === 1) {
        path.push(e.point);
      }
      this.$set(path, path.length - 1, e.point);
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      paths[paths.length - 1].push(e.point);
      // console.log(this.polyline);
    },
    del() {
      this.polyline = {
        editing: false,
        paths: []
      };
    }
    //  watch: {
    //   // 监听查询输入框--实现查询筛选功能
    //   select_resourceName: function () {
    //     // console.log(this.select_resourceName);
    //     this.tableData = JSON.parse(JSON.stringify(this.subTableData));
    //     let input2= this.select_resourceName;
    //     let input3= this.select_resourceAttrbute;
    //     let input4=this.select_qmDeptNo;
    //     let table = [];
    //     for (let i = 0; i < this.tableData.length; i++) {
    //       if (this.tableData[i].resourceName.toString.indexOf(input2) != -1) {
    //         if (this.tableData[i].select_resourceAttrbute.toString.indexOf(input3) != -1){
    //            if (this.tableData[i].select_qmDeptNo.toString.indexOf(input4) != -1)
    //         table.push(this.tableData[i]);
    //       }}
    //     }
    //     this.tableData =JSON.parse(JSON.stringify(table));
    //     // this.totalCount = this.tableData.length;
    //     // this.currentPage = 1;
    //   },
    //   select_resourceAttrbute: function () {
    //     // console.log(this.select_resourceAttrbute);
    //     this.tableData = JSON.parse(JSON.stringify(this.subTableData));
    //     let input2= this.select_resourceName;
    //     let input3= this.select_resourceAttrbute;
    //     let input4=this.select_qmDeptNo;
    //     let table = [];
    //     for (let i = 0; i < this.tableData.length; i++) {
    //      if (this.tableData[i].resourceName.toString.indexOf(input2) != -1) {
    //         if (this.tableData[i].select_resourceAttrbute.toString.indexOf(input3) != -1){
    //           if (this.tableData[i].select_qmDeptNo.toString.indexOf(input4) != -1)
    //         table.push(this.tableData[i]);
    //       }
    //     }}

    //    this.tableData =JSON.parse(JSON.stringify(table));
    //   },
    //   select_qmDeptNo: function () {
    //     // console.log(this.select_qmDeptNo);
    //     this.tableData = JSON.parse(JSON.stringify(this.subTableData));
    //     let input2= this.select_resourceName;
    //     let input3= this.select_resourceAttrbute;
    //     let table = [];
    //     for (let i = 0; i < this.tableData.length; i++) {
    //      if (this.tableData[i].resourceName.toString.indexOf(input2) != -1) {
    //         if (this.tableData[i].select_resourceAttrbute.toString.indexOf(input3) != -1){
    //           if (this.tableData[i].select_qmDeptNo.toString.indexOf(input4) != -1)
    //         table.push(this.tableData[i]);
    //       }
    //     }
    //   }
    //     this.tableData =JSON.parse(JSON.stringify(table));
    //   },

    //   reviewS: function () {
    //     if (this.reviewS !== 4) this.filterTag(this.reviewS);
    //   },
    // },
  }
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
.element.style {
}
</style>
