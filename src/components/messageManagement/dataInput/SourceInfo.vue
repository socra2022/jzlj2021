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
            >工地申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >工地管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <!-- <button
        @click="sourceInfoDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button> -->
      <!-- TODO: 搜索框  -->
      <!-- <span>车牌号：</span>
      <input
        v-model="select_carNo"
        type="text"
        class="input-style"
        placeholder="请输入车牌号"
      /> -->
      <span>工地名称：</span>
      <input
        v-model="select_sourceName"
        type="text"
        class="input-style"
        placeholder="请输入工地名称"
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
        <el-table-column prop="sourceName" label="工地名称"></el-table-column>
        <el-table-column
          prop="sourceAttrbute"
          label="工程类别"
          min-width="300"
        ></el-table-column>
        <el-table-column prop="qmDeptNo" label="质量监管部门"></el-table-column>
        <el-table-column
          prop="sourceType"
          label="产生垃圾类型"
        ></el-table-column>
        <el-table-column
          prop="wasteTotal"
          label="垃圾总量（万方）"
        ></el-table-column>
        <el-table-column prop="adminUnit" label="建设单位"></el-table-column>
        <el-table-column
          prop="constructionUnit"
          label="施工单位"
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
              @click="getMessage(scope.row.sourceId)"
              >详情</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateSourceId(scope.row.sourceId)"
              >更改</el-button
            >
            <el-button
              v-if="rolen === 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getReviewSourceId(scope.row.sourceId)"
              >审核</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.sourceId)"
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
      :visible.sync="sourceInfoDialog"
      width="40%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="sourceInfoFormRef"
        :rules="sourceInfoFormRules"
        :model="sourceInfoForm"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="工地名称" prop="sourceName">
            <el-input
              v-model="sourceInfoForm.sourceName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-form-item label="工地地址" prop="sourceAddress">
              <el-input
                v-model="sourceInfoForm.sourceAddress"
                class="handle-input mr10"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="12" :offset="1">
          <el-form-item label="工地位置经度" prop="sourceLong">
            <el-input
              v-model="sourceInfoForm.sourceLong"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="工地位置纬度" prop="sourceLat">
            <el-input
              v-model="sourceInfoForm.sourceLat"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-button type="success" @click="mapVisible = true">定位点</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="12" :offset="1">
          <el-form-item label="工程类别" prop="sourceAttrbute">
            <el-input
              v-model="sourceInfoForm.sourceAttrbute"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12" :offset="1">
            <el-form-item label="质量监管部门" prop="qmDeptNo">
              <el-input
                v-model="sourceInfoForm.qmDeptNo"
                class="handle-input mr10"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-form-item label="产生垃圾类型" prop="sourceType">
              <el-input
                v-model="sourceInfoForm.sourceType"
                class="handle-input mr10"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12" :offset="1">
            <el-form-item label="垃圾总量（万方）" prop="wasteTotal">
              <el-input
                v-model="sourceInfoForm.wasteTotal"
                class="handle-input mr10"
                style="width:300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-form-item label="申报提交时间" prop="startDate">
              <el-date-picker
                v-model="sourceInfoForm.startDate"
                type="datetime"
                placeholder="选择日期时间"
                class="handle-input mr10"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:300px"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row :gutter="50">
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位" prop="adminUnit">
            <el-input
              v-model="sourceInfoForm.adminUnit"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位法人" prop="adminLegalName">
            <el-input
              v-model="sourceInfoForm.adminLegalName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位联系电话" prop="adminPhoneNo">
            <el-input
              v-model="sourceInfoForm.adminPhoneNo"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位" prop="constructionUnit">
            <el-input
              v-model="sourceInfoForm.constructionUnit"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位法人" prop="constructionLegalName">
            <el-input
              v-model="sourceInfoForm.constructionLegalName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位联系电话" prop="constructionPhoneNo">
            <el-input
              v-model="sourceInfoForm.constructionPhoneNo"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="录入人" prop="inputName">
          <el-input
            v-model="sourceInfoForm.inputName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="录入时间" prop="inputTime">
          <el-date-picker
            v-model="sourceInfoForm.inputTime"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-col :span="24" :offset="1">
          <el-form-item label="审核状态" prop="reviewStatus">
            <el-radio-group v-model="sourceInfoForm.reviewStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" :offset="4">
          <el-form-item>
            <el-button type="primary" @click="addData">确认提交</el-button>
            <el-button @click="resetSourceInfoForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>

    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="sourceInfoDialog2"
      width="40%"
      title="请修改申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="sourceInfoFormRef2"
        :rules="sourceInfoFormRules2"
        :model="sourceInfoForm2"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="工地名称" prop="sourceName">
            <el-input
              v-model="sourceInfoForm2.sourceName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="工地地址" prop="sourceAddress">
            <el-input
              v-model="sourceInfoForm2.sourceAddress"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="工地位置经度" prop="sourceLong">
            <el-input
              v-model="sourceInfoForm2.sourceLong"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">        
          <el-form-item label="工地位置纬度" prop="sourceLat">
            <el-input
              v-model="sourceInfoForm2.sourceLat"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-button type="success" @click="mapVisible = true">定位点</el-button>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="工程类别" prop="sourceAttrbute">
            <el-input
              v-model="sourceInfoForm2.sourceAttrbute"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="质量监管部门" prop="qmDeptNo">
            <el-input
              v-model="sourceInfoForm2.qmDeptNo"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="产生垃圾类型" prop="sourceType">
            <el-input
              v-model="sourceInfoForm2.sourceType"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="垃圾总量（万方）" prop="wasteTotal">
            <el-input
              v-model="sourceInfoForm2.wasteTotal"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="申报提交时间" prop="startDate">
            <el-date-picker
              v-model="sourceInfoForm2.startDate"
              type="datetime"
              placeholder="选择日期时间"
              class="handle-input mr10"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:300px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位" prop="adminUnit">
            <el-input
              v-model="sourceInfoForm2.adminUnit"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位法人" prop="adminLegalName">
            <el-input
              v-model="sourceInfoForm2.adminLegalName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="建设单位联系电话" prop="adminPhoneNo">
            <el-input
              v-model="sourceInfoForm2.adminPhoneNo"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位" prop="constructionUnit">
            <el-input
              v-model="sourceInfoForm2.constructionUnit"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位法人" prop="constructionLegalName">
            <el-input
              v-model="sourceInfoForm2.constructionLegalName"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="施工单位联系电话" prop="constructionPhoneNo">
            <el-input
              v-model="sourceInfoForm2.constructionPhoneNo"
              class="handle-input mr10"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="录入人" prop="inputName">
          <el-input
            v-model="sourceInfoForm2.inputName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="录入时间" prop="inputTime">
          <el-date-picker
            v-model="sourceInfoForm2.inputTime"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-col :span="24" :offset="1">
          <el-form-item label="审核状态" prop="reviewStatus">
            <el-radio-group v-model="sourceInfoForm2.reviewStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="3">
          <el-form-item>
            <el-button type="primary" @click="updateData">确认修改</el-button>
            <el-button @click="resetSourceInfoForm2">取消修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>

    <!-- 显示详情  -->
    <el-dialog
      :visible.sync="sourceInfoDialog3"
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="sourceInfoForm2" :inline="true">
        <el-form-item label="工地名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工地地址">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceAddress
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工地位置经度">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.sourceLong
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工地位置纬度">
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
        <el-form-item label="申报提交时间">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.startDate | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="建设单位">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.adminUnit
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="建设单位法人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.adminLegalName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="建设单位联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.adminPhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="施工单位">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.constructionUnit
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="施工单位法人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.constructionLegalName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="施工单位联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              sourceInfoForm2.constructionPhoneNo
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
          >
        </el-form-item>
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
        <el-radio :label="0">待审核</el-radio>
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">审核不通过</el-radio>
      </el-radio-group>

      <span slot="footer">
        <el-button type="primary" @click="review">确认</el-button>
        <el-button @click="reviewDialog = false">取消</el-button>
      </span>
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
          :showAddressBar="true"
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
import {
  selectSourceDataByInputName,
  insertSourceData,
  updateSourceData,
  deleteSourceDataById,
  selectAllSourceData,
  selectSourceDataByPage,
  updateSourceReviewStatus,
  selectOneSourceData
} from "../../../assets/axios/index";

// 导入js方法
// 求当前时间的方法
import getNowtime from "../../../assets/js/index";
import ContentVue from "../../home/Content.vue";
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
        height: "2.3vh"
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
      select_sourceId: "",
      select_sourceName: "",
      select_company: "",

      // 填写申报信息的对话框
      sourceInfoDialog: false,
      // 表单绑定值
      sourceInfoForm: {
        sourceName: "",
        sourceAddress: "",
        sourceLong: "",
        sourceLat: "",
        sourceAttrbute: "",
        qmDeptNo: "",
        sourceType: "",
        wasteTotal: "",
        startDate: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
        // 新增字段
        adminLegalName: "",
        adminPhoneNo: "",
        adminUnit: "",
        constructionLegalName: "",
        constructionPhoneNo: "",
        constructionUnit: ""
        // linkman: "",
        // phoneNo: "",
        // sourceCompany: "",
        // wasteComponent: "",
        // wasteUnit: "",
        // suggestion: "",
        // content: "",
      },
      // 表单验证规则
      sourceInfoFormRules: {
        sourceName: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        sourceAddress: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        sourceAttrbute: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        qmDeptNo: [{ required: true, message: "不能为空！", trigger: "blur" }],
        sourceType: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        startDate: [{ required: true, message: "不能为空！", trigger: "blur" }],
        inputName: [{ required: true, message: "不能为空！", trigger: "blur" }],
        inputTime: [{ required: true, message: "不能为空！", trigger: "blur" }],
        reviewStatus: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        wasteTotal: [{ required: true, message: "不能为空！", trigger: "blur" }]
      },

      // 修改申报信息的对话框
      sourceInfoDialog2: false,
      // 表单绑定值
      sourceInfoForm2: {
        sourceName: "",
        sourceAddress: "",
        sourceLong: "",
        sourceLat: "",
        sourceAttrbute: "",
        qmDeptNo: "",
        sourceType: "",
        wasteTotal: "",
        startDate: "",
        inputName: "",
        inputTime: "",
        reviewStatus: "",
        // 新增字段
        adminLegalName: "",
        adminPhoneNo: "",
        adminUnit: "",
        constructionLegalName: "",
        constructionPhoneNo: "",
        constructionUnit: ""
      },
      // 表单验证规则
      sourceInfoFormRules2: {
        // sourceName: [
        //   { required: true, message: "不能为空！", trigger: "blur" },
        // ],
        // startDate: [
        //   { required: true, message: "不能为空！", trigger: "blur" },
        // ],
        // inputTime: [
        //   { required: true, message: "不能为空！", trigger: "blur" },
        // ],

        // lng: [
        //   { type: "number", message: "必须为数字值！", trigger: "blur" },
        // ],
        // lat: [
        //   { type: "number", message: "必须为数字值！", trigger: "blur" },
        // ],
        // wasteTotal: [
        //   { type: "number", message: "必须为数字值！", trigger: "blur" },
        // ]

        sourceName: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        sourceAddress: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        sourceAttrbute: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        qmDeptNo: [{ required: true, message: "不能为空！", trigger: "blur" }],
        sourceType: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        startDate: [{ required: true, message: "不能为空！", trigger: "blur" }],
        reviewStatus: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        inputName: [{ required: true, message: "不能为空！", trigger: "blur" }],
        inputTime: [{ required: true, message: "不能为空！", trigger: "blur" }],
        wasteTotal: [{ required: true, message: "不能为空！", trigger: "blur" }]
      },
      // 打开查看详情的对话框
      sourceInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个sourceId
      currentSourceId: 0,

      // 从首页监听的审核状态值
      reviewS: 4,

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
  created() {
    this.getData();
  },
  methods: {
    // 请求数据方法
    async getData() {
      await selectAllSourceData()
        .then(res => {
          this.totalCount = res.data.respBody.length;
        })
        .then({});
      await selectSourceDataByPage(true, this.currentPage, this.PageSize).then(
        res => {
          console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
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
      selectSourceDataByPage(true, this.currentPage, this.PageSize).then(
        res => {
          //console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          // this.totalCount = this.tableData.length;
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      );
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // 改变页码时请求数据
      selectSourceDataByPage(true, this.currentPage, this.PageSize).then(
        res => {
          //console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          // this.totalCount = this.tableData.length;
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.subTableData);
        }
      );
    },

    // 根据标签筛选
    filterTag(value, row) {
      return row.reviewStatus === value;
    },

    // 表单
    // 点击取消和X按钮，重置表单
    resetSourceInfoForm() {
      this.$refs.sourceInfoFormRef.resetFields();
    },
    // 提交表单--增加数据
    addData() {
      // 封装状态值
      // let status = 0;
      // if (this.sourceInfoForm.reviewStatus === "审核通过") {
      //   status = 1;
      // }
      // if (this.sourceInfoForm.reviewStatus === "审核未通过") {
      //   status = 2;
      // }
      // 表单验证
      let isLegal = true;
      this.$refs["sourceInfoFormRef"].validate(valid => {
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
        sourceId: "",
        sourceName: this.sourceInfoForm.sourceName,
        sourceAddress: this.sourceInfoForm.sourceAddress,
        sourceLng: this.sourceInfoForm.sourceLong,
        sourceLat: this.sourceInfoForm.sourceLat,
        sourceAttrbute: this.sourceInfoForm.sourceAttrbute,
        qmDeptNo: this.sourceInfoForm.qmDeptNo,
        sourceType: this.sourceInfoForm.sourceType,
        wasteTotal: this.sourceInfoForm.wasteTotal,
        startDate: this.sourceInfoForm.startDate,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        reviewStatus: this.sourceInfoForm.reviewStatus,
        // 新增字段
        adminLegalName: this.sourceInfoForm.adminLegalName,
        adminPhoneNo: this.sourceInfoForm.adminPhoneNo,
        adminUnit: this.sourceInfoForm.adminUnit,
        constructionLegalName: this.sourceInfoForm.constructionLegalName,
        constructionPhoneNo: this.sourceInfoForm.constructionPhoneNo,
        constructionUnit: this.sourceInfoForm.constructionUnit
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
          this.sourceInfoDialog = false;
          // 重置表单
          this.resetSourceInfoForm();
        })
        .then(() => {
          // 重新渲染表格
          this.getData();
        });
    },
    // 点击取消和X按钮，重置表单
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

      if (this.allData[index].status === 0) {
        this.allData[index].status = "待审核";
      }
      if (this.allData[index].status === 1) {
        this.allData[index].status = "审核通过";
      }
      if (this.allData[index].status === 2) {
        this.allData[index].status = "审核未通过";
      }
      this.sourceInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      this.sourceInfoDialog2 = true;
    },
    // 修改表单
    updateData() {
      // // 封装状态值
      // let status = 0;
      // if (this.sourceInfoForm2.reviewStatus === "审核通过") {
      //   status = 1;
      // }
      // if (this.sourceInfoForm2.reviewStatus === "审核未通过") {
      //   status = 2;
      // }
      // 表单验证
      let isLegal = true;
      this.$refs["sourceInfoFormRef2"].validate(valid => {
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
        sourceId: this.sourceInfoForm2.sourceId,
        sourceName: this.sourceInfoForm2.sourceName,
        sourceAddress: this.sourceInfoForm2.sourceAddress,
        sourceLong: this.sourceInfoForm2.sourceLong,
        sourceLat: this.sourceInfoForm2.sourceLat,
        sourceAttrbute: this.sourceInfoForm2.sourceAttrbute,
        qmDeptNo: this.sourceInfoForm2.qmDeptNo,
        sourceType: this.sourceInfoForm2.sourceType,
        wasteTotal: this.sourceInfoForm2.wasteTotal,
        startDate: this.sourceInfoForm2.startDate,
        inputName: window.sessionStorage.namen,
        inputTime: getNowtime(),
        reviewStatus: this.sourceInfoForm2.reviewStatus,
        // 新增字段
        adminLegalName: this.sourceInfoForm2.adminLegalName,
        adminPhoneNo: this.sourceInfoForm2.adminPhoneNo,
        adminUnit: this.sourceInfoForm2.adminUnit,
        constructionLegalName: this.sourceInfoForm2.constructionLegalName,
        constructionPhoneNo: this.sourceInfoForm2.constructionPhoneNo,
        constructionUnit: this.sourceInfoForm2.constructionUnit
      };
      // console.log(data);
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
            if (item.sourceId == id) {
              return true;
            }
          });
          deleteSourceDataById(this.allData[index].sourceId)
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
          // // 判断是否能删除
          // if (window.sessionStorage.namen !== this.allData[index].inputName) {
          //   this.$message({
          //     message: "对不起，您无权删除该数据！",
          //     type: "danger",
          //     offset: 300,
          //     center: true,
          //     duration: 1000,
          //   });
          // } else {
          //   //
          // }
        })
        .catch(() => {});
    },
    // 参看详情
    getMessage(id) {
      // 根据id找到index
      let index = this.allData.findIndex(item => {
        if (item.sourceId == id) {
          return true;
        }
      });

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
      this.sourceInfoForm.sourceLong = this.locData.longitude;
      this.sourceInfoForm.sourceLat = this.locData.latitude;
      // this.sourceInfoForm.sourceAddress = this.locData.address;
      // this.locData.address = this.locData.address;
    },
    findlocation() {
      this.$emit("findlocdata", this.locData);
      this.mapVisible = false;
      this.sourceInfoForm.sourceLong = this.locData.longitude;
      this.sourceInfoForm.sourceLat = this.locData.latitude;
      // this.sourceInfoForm.sourceAddress = this.locData.address;
      this.sourceInfoForm2.sourceLong = this.locData.longitude;
      this.sourceInfoForm2.sourceLat = this.locData.latitude;
      // this.sourceInfoForm2.sourceAddress = this.locData.address;
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
  },
  watch: {
    select_sourceName: function() {
      // console.log(this.select_carNo);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.select_sourceName;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sourceName.indexOf(input) != -1) {
         
            table.push(this.tableData[i]);
          
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      // this.totalCount = this.tableData.length;
      // this.currentPage = 1;
    },
    select_company: function() {
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
#mytable
  > div.el-table.table.el-table--fit.el-table--border.el-table--fluid-height.el-table--scrollable-y.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small
  > div.el-table__body-wrapper.is-scrolling-none {
  height: 55vh;
}
/* .el-col{
  
} */
</style>
