<template>
  <div>
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
            >产生源申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >产生源管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>

    <!-- 筛选框 -->
    <div id="select">
      <button
        @click="sourceInfoDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button>
      <span>工程名称:</span>
      <input
        v-model="select_sourceName"
        type="text"
        placeholder="请输入工程名称"
        class="input-style"
      />
      <span>工程类别:</span>
      <input
        v-model="select_sourceAttrbute"
        type="text"
        placeholder="请输入工程类别"
        class="input-style"
      />
      <span>监管部门:</span>
      <input
        v-model="select_qmDeptNo"
        type="text"
        placeholder="请输入监管部门"
        class="input-style"
      />
    </div>

    <!-- 表格部分 -->
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
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="sourceName"
          align="center"
          label="工程名称"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="sourceAddress"
          align="center"
          label="位置"
        ></el-table-column>
        <el-table-column
          prop="sourceAttrbute"
          align="center"
          label="工程类别"
        ></el-table-column>
        <el-table-column
          prop="qmDeptNo"
          align="center"
          label="监管部门"
        ></el-table-column>
        <el-table-column
          prop="sourceType"
          align="center"
          label="类型"
        ></el-table-column>
        <el-table-column
          prop="wasteTotal"
          align="center"
          width="120"
          label="垃圾总量(万方)"
        ></el-table-column>
        <el-table-column align="center" width="120" label="申报提交时间">
          <template slot-scope="scope">{{
            scope.row.startDate | dateFormat1
          }}</template>
        </el-table-column>
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
            <!-- <el-button
              type="text"
              icon="el-icon-document"
              @click="getMessage(scope.row.sourceId)"
              >详情</el-button
            > -->
            <button @click="getMessage(scope.row.sourceId)" class="button deta">
              <i class="el-icon-document"></i> 详情
            </button>
            <button @click="getEF(scope.row.sourceId)" class="button emap">
              <i class="el-icon-eleme"></i>电子围栏
            </button>
            <button
              v-if="rolen !== 'admin'"
              @click="getUpdateSourceId(scope.row.sourceId)"
              class="button mod"
            >
              <i class="el-icon-edit"></i>更改
            </button>
            <!-- <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateSourceId(scope.row.sourceId)"
              >更改</el-button -->

            <!-- <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewSourceId(scope.row.sourceId)"
              >审核</el-button
            > -->
            <button
              v-if="rolen === 'admin'"
              @click="getReviewSourceId(scope.row.sourceId)"
              class="button rev"
            >
              <i class="el-icon-edit"></i>审核
            </button>
            <!-- <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.sourceId)"
              >删除</el-button
            > -->
            <button
              @click="handleDelete(scope.row.sourceId)"
              class="button del"
            >
              <i class="el-icon-delete"></i>删除
            </button>
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

    <!-- 表单部分 -->
    <!-- 显示详情 -->
    <el-dialog
      :visible.sync="sourceInfoDialog3"
      append-to-body
      width="60%"
      title="申报信息详情"
      label-width="80px"
    >
      <el-form :model="sourceInfoForm2" :inline="true">
        <el-form-item label="产生源编号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceId
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工地名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="产生源位置">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceAddress
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="经度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceLong
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="纬度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceLat
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工程类别">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceAttrbute
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="质量监管部门">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.qmDeptNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="产生垃圾类型">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceType
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="垃圾总量（万方）">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.wasteTotal
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="责任单位">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceCompany
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.linkman
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.phoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.inputName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="录入时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.inputTime | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="审核状态">
          ：&nbsp;&nbsp;
          <span style="color: red" v-if="sourceInfoForm2.reviewStatus === 0"
            >待审核</span
          >
          <span style="color: red" v-if="sourceInfoForm2.reviewStatus === 1"
            >审核通过</span
          >
          <span style="color: red" v-if="sourceInfoForm2.reviewStatus === 2"
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

    <!-- 用户新增 -->
    <!-- 申报表单-->
    <el-dialog
      :visible.sync="sourceInfoDialog"
      append-to-body
      width="60%"
      title="请填写申报信息"
      label-width="80px"
    >
      <el-form
        ref="sourceInfoFormRef"
        :rules="sourceInfoFormRules"
        :model="sourceInfoForm"
        :inline="true"
      >
        <!-- <el-form-item label="车辆编号" prop="sourceId">
          <el-input v-model="sourceInfoForm.sourceId" class="handle-input mr10"></el-input>
        </el-form-item>-->
        <el-form-item label="工地名称" prop="sourceName">
          <el-input v-model="sourceInfoForm.sourceName"></el-input>
        </el-form-item>
        <el-form-item label="产生源位置" prop="sourceAddress">
          <el-input v-model="sourceInfoForm.sourceAddress"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="sourceLong">
          <el-input v-model.number="sourceInfoForm.sourceLong"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="sourceLat">
          <el-input v-model.number="sourceInfoForm.sourceLat"></el-input>
        </el-form-item>
        <el-form-item label="工程类别" prop="sourceAttrbute">
          <el-input v-model="sourceInfoForm.sourceAttrbute"></el-input>
        </el-form-item>
        <el-form-item label="质量监管部门" prop="qmDeptNo">
          <el-input v-model="sourceInfoForm.qmDeptNo"></el-input>
        </el-form-item>
        <el-form-item label="产生垃圾类型" prop="sourceType">
          <el-input v-model="sourceInfoForm.sourceType"></el-input>
        </el-form-item>
        <el-form-item label="垃圾总量（万方）" prop="wasteTotal">
          <el-input v-model.number="sourceInfoForm.wasteTotal"></el-input>
        </el-form-item>
        <el-form-item label="责任单位" prop="sourcCompany">
          <el-input v-model="sourceInfoForm.sourcCompany"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input
            v-model="sourceInfoForm.linkman"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNo">
          <el-input
            v-model="sourceInfoForm.phoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="efDialog = true"
            >设置电子围栏</el-button
          >
          <el-button type="primary" @click="addData">确认提交</el-button>
          <el-button @click="resetSourceInfoForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 更改表单 -->
    <el-dialog
      :visible.sync="sourceInfoDialog2"
      append-to-body
      width="60%"
      title="请修改申报信息"
      label-width="80px"
    >
      <el-form
        ref="sourceInfoFormRef2"
        :rules="sourceInfoFormRules2"
        :model="sourceInfoForm2"
        :inline="true"
      >
        <el-form-item label="产生源编号" prop="sourceId">
          <el-input
            :disabled="true"
            v-model.number="sourceInfoForm2.sourceId"
          ></el-input>
        </el-form-item>
        <el-form-item label="工地名称" prop="sourceName">
          <el-input v-model="sourceInfoForm2.sourceName"></el-input>
        </el-form-item>
        <el-form-item label="产生源位置" prop="sourceAddress">
          <el-input v-model="sourceInfoForm2.sourceAddress"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="sourceLong">
          <el-input v-model.number="sourceInfoForm2.sourceLong"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="sourceLat">
          <el-input v-model.number="sourceInfoForm2.sourceLat"></el-input>
        </el-form-item>
        <el-form-item label="工程类别" prop="sourceAttrbute">
          <el-input v-model="sourceInfoForm2.sourceAttrbute"></el-input>
        </el-form-item>
        <el-form-item label="质量监管部门" prop="qmDeptNo">
          <el-input v-model="sourceInfoForm2.qmDeptNo"></el-input>
        </el-form-item>
        <el-form-item label="产生垃圾类型" prop="sourceType">
          <el-input v-model="sourceInfoForm2.sourceType"></el-input>
        </el-form-item>
        <el-form-item label="垃圾总量（万方）" prop="wasteTotal">
          <el-input v-model.number="sourceInfoForm2.wasteTotal"></el-input>
        </el-form-item>
        <el-form-item label="责任单位" prop="sourceCompany">
          <el-input v-model="sourceInfoForm2.sourceCompany"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="sourceInfoForm2.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNo">
          <el-input v-model="sourceInfoForm2.phoneNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="efDialog = true"
            >修改电子围栏</el-button
          >
          <el-button type="primary" @click="updateData">确认修改</el-button>
          <el-button @click="resetSourceInfoForm2">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置电子围栏-选择设置方法的对话框 -->
    <el-dialog
      title="请选择绘制电子围栏方法"
      :visible.sync="efDialog"
      append-to-body
      width="60%"
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
// 导入请求方法
import {
  selectSourceDataByInputName,
  insertSourceData,
  updateSourceData,
  deleteSourceDataById,
  selectAllSourceData,
  updateSourceReviewStatus,
  selectByIdAndSOrI,
  insertEfData,
  deleteEfData
} from "../../../assets/axios/index";
// 导入js方法
// 求当前时间的方法
import getNowtime from "../../../assets/js/index";
export default {
  data() {
    return {
      // 角色---登录后获取
      rolen: window.sessionStorage.usern,
      username: window.sessionStorage.namen,
      //表格绑定样式
      headerStyle: {
        border: "0.093vh solid #067EA5",
        fontSize: "1.296vh",
        fontFamily: "Microsoft YaHei",
        // fontWeight: "bold",
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
        // fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: "3.333vh",
        textAlign: "center",
        height: "5.741vh"
      },
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
      pageSizes: [4, 10, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 4,

      // 查询功能的绑定值--使用watch监听
      select_sourceName: "",
      select_sourceAttrbute: "",
      select_qmDeptNo: "",
      // 填写申报信息的对话框
      sourceInfoDialog: false,
      // 表单绑定值 （新增）
      sourceInfoForm: {
        sourceId: "",
        sourceName: "",
        sourceAddress: "",
        sourceLat: "",
        sourceLong: "",
        sourceAttrbute: "",
        qmDeptNo: "",
        sourceType: "",
        wasteTotal: "",
        startDate: "",
        sourcCompany: "",
        linkman: "",
        phoneNo: "",
        inputName: "",
        inputTime: "",
        reviewStatus: ""
      },
      // 表单验证规则 新增
      sourceInfoFormRules: {
        sourceName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        sourceAttrbute: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        qmDeptNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceType: [{ required: true, message: "不能为空!", trigger: "blur" }],
        wasteTotal: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        startDate: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourcCompany: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "不能为空!", trigger: "blur" }],
        phoneNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceLat: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        sourceLong: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ]
      },
      // 修改申报信息的对话框
      sourceInfoDialog2: false,
      // 表单绑定值
      sourceInfoForm2: {
        sourceId: "",
        sourceName: "",
        sourceAddress: "",
        sourceLat: "",
        sourceLong: "",
        sourceAttrbute: "",
        qmDeptNo: "",
        sourceType: "",
        wasteTotal: "",
        startDate: "",
        sourcCompany: "",
        linkman: "",
        phoneNo: "",
        inputName: "",
        inputTime: "",
        reviewStatus: ""
      },
      // 修改表单验证规则
      sourceInfoFormRules2: {
        sourceName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceAddress: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        sourceAttrbute: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        qmDeptNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceType: [{ required: true, message: "不能为空!", trigger: "blur" }],
        wasteTotal: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        startDate: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourcCompany: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "不能为空!", trigger: "blur" }],
        phoneNo: [{ required: true, message: "不能为空!", trigger: "blur" }],
        sourceLat: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        sourceLong: [
          { required: true, message: "不能为空!", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ]
      },
      // 打开查看详情的对话框
      sourceInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentSourceId: 0,

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
  created() {
    this.getData();
  },
  methods: {
    //分页功能
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
    // 请求表格数据方法
    getData() {
      // 根据用户名来判断请求的数据
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        selectSourceDataByInputName(this.username).then(res => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          //console.log(this.subTableData);
        });
      } else {
        //如果是管理员，则请求所有的数据
        selectAllSourceData(false).then(res => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.subTableData);
        });
      }
    },

    // 查看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.sourceId == id) {
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
      this.sourceInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.sourceInfoDialog3 = true;
    },
    // 管理员进行审核操作
    getReviewSourceId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.sourceId == id) {
          return true;
        }
      });
      this.reviewDialog = true;
      this.reviewStatusRadio = this.allData[index].reviewStatus;
      this.currentSourceId = this.allData[index].sourceId;
      //console.log(this.reviewStatusRadio);
    },
    // 更改审核状态
    review() {
      updateSourceReviewStatus(this.currentSourceId, this.reviewStatusRadio)
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

    // 新增表单的重置
    // 点击取消和X按钮，重置表单
    resetSourceInfoForm() {
      this.$refs.sourceInfoFormRef.resetFields();
    },
    // 提交表单--增加数据 申报
    addData() {
      // 封装插入的数据
      let data = {
        sourceId: 0,
        sourceName: this.sourceInfoForm.sourceName,
        sourceAddress: this.sourceInfoForm.sourceAddress,
        sourceLong: this.sourceInfoForm.sourceLong,
        sourceLat: this.sourceInfoForm.sourceLat,
        sourceAttrbute: this.sourceInfoForm.sourceAttrbute,
        qmDeptNo: this.sourceInfoForm.qmDeptNo,
        sourceType: this.sourceInfoForm.sourceType,
        wasteTotal: this.sourceInfoForm.wasteTotal,
        startDate: new Date(),
        sourcCompany: this.sourceInfoForm.sourcCompany,
        linkman: this.sourceInfoForm.linkman,
        phoneNo: this.sourceInfoForm.phoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        reviewStatus: 0
      };
      console.log(data);
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
          this.sourceInfoDialog = false;
          // 重置表单
          this.resetSourceInfoForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData2();
        });
    },

    // 点击取消和X按钮，重置修改表单
    resetSourceInfoForm2() {
      this.$refs.sourceInfoFormRef2.resetFields();
    },
    // 获取需要更新数据的id-并把信息显示在对话框中
    getUpdateSourceId(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.sourceId == id) {
          return true;
        }
      });
      //console.log(this.allData[index]);
      this.sourceInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      //渲染电子围栏
      selectByIdAndSOrI(1, parseInt(this.sourceInfoForm2.sourceId)).then(
        res => {
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
        }
      );
      //将是否点击修改电子围栏绑定值设置为false
      this.isClickChangeEf = false;
      // 打开对话框
      this.sourceInfoDialog2 = true;
    },
    // 更改按钮
    // 修改表单
    updateData() {
      // 封装插入的数据
      let data = {
        sourceId: this.sourceInfoForm2.sourceId,
        sourceName: this.sourceInfoForm2.sourceName,
        sourceAddress: this.sourceInfoForm2.sourceAddress,
        sourceLong: this.sourceInfoForm.sourceLong,
        sourceLat: this.sourceInfoForm.sourceLat,
        sourceAttrbute: this.sourceInfoForm2.sourceAttrbute,
        qmDeptNo: this.sourceInfoForm2.qmDeptNo,
        sourceType: this.sourceInfoForm2.sourceType,
        wasteTotal: this.sourceInfoForm2.wasteTotal,
        sourcCompany: this.sourceInfoForm2.sourceCompany,
        linkman: this.sourceInfoForm2.linkman,
        phoneNo: this.sourceInfoForm2.phoneNo,
        inputName: window.sessionStorage.namen,
        inputTime: new Date(),
        reviewStatus: 0
      };
      updateSourceData(data)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000
          });
          // 关闭对话框
          this.sourceInfoDialog2 = false;
          // 重置表单
          this.resetSourceInfoForm2();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });

      // console.log(this.isClickChangeEf);
      if (this.isClickChangeEf) {
        // 先删除电子围栏数据-再插入--达到更新的目的
        deleteEfData(1, this.sourceInfoForm2.sourceId).then(() => {
          // 保存经纬度数据
          // 封装数据
          let data = [];
          for (let i = 0; i < this.lngList.length; i++) {
            let onedata = {
              id: this.sourceInfoForm2.sourceId,
              sorI: 1,
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
    // 删除按钮
    // 删除一条数据
    handleDelete(id) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          // 根据id找到index
          let index = this.allData.findIndex(item => {
            if (item.sourceId == id) {
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
            let sourceId = this.allData[index].sourceId;
            deleteSourceDataById(sourceId)
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
            // 删除电子围栏数据
            deleteEfData(1, sourceId);
          }
        })
        .catch(() => {});
    },

    // 电子围栏
    getEF(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.sourceId == id) {
          return true;
        }
      });
      let sourceid = this.allData[index].sourceId;
      // 将点击的id保存在vuex中
      this.$store.commit("set_efId", sourceid);
      this.$router.replace("/gs_source_ef");
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
  },
  filters: {
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
    select_sourceName: function() {
      // console.log(this.select_sourceName);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_sourceName;
      let input2 = this.select_sourceAttrbute;
      let input3 = this.select_qmDeptNo;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sourceName.indexOf(input1) != -1) {
          if (this.tableData[i].sourceAttrbute.indexOf(input2) != -1) {
            if (this.tableData[i].qmDeptNo.indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_sourceAttrbute: function() {
      // console.log(this.select_sourceAttrbute);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_sourceName;
      let input2 = this.select_sourceAttrbute;
      let input3 = this.select_qmDeptNo;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sourceName.indexOf(input1) != -1) {
          if (this.tableData[i].sourceAttrbute.indexOf(input2) != -1) {
            if (this.tableData[i].qmDeptNo.indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    select_qmDeptNo: function() {
      // console.log(this.select_qmDeptNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input1 = this.select_sourceName;
      let input2 = this.select_sourceAttrbute;
      let input3 = this.select_qmDeptNo;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sourceName.indexOf(input1) != -1) {
          if (this.tableData[i].sourceAttrbute.indexOf(input2) != -1) {
            if (this.tableData[i].qmDeptNo.indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
// 按钮颜色设置
.button {
  width: 4.896vw;
  height: 2.963vh;
  
  border-radius: 1.481vh;
  border: none;
  font-size: 1.296vh;
  font-family: Microsoft YaHei;
  // font-weight: bold;
  color: #ffffff;
  outline: none;
}
.deta{
    background: #24A04B;
}
.emap{
    background: #0566B3;
}
.mod{
    background: dodgerblue;
}
.del{
    background:#B77036;
}
.rev{
    background: aquamarine;
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
/* 去除不靠两边的样式 */
.container {
  min-width: 100%;
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
