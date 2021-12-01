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
            >运输核准单申报</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="(this.rolen === 'admin') | (this.rolen === 'superadmin')"
            >运输核准单管理</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <button
        @click="applyInfoDialog = true"
        v-if="rolen !== 'admin'"
        class="add-btu ml"
      >
        <i class="el-icon-circle-plus"></i> 新增
      </button>
      <span>申请编号：</span>
      <input
        v-model="select_applyNo"
        type="text"
        class="input-style"
        placeholder="请输入申请编号"
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
        <el-table-column prop="applyNo" label="申请编号"></el-table-column>
        <el-table-column
          prop="carCompanyName"
          label="运输单位名称"
        ></el-table-column>
        <el-table-column
          prop="routeName"
          label="运输路线名称"
        ></el-table-column>
        <el-table-column prop="sourceName" label="工地名称"></el-table-column>
        <el-table-column
          prop="intakePlantName1"
          label="消纳场所1"
        ></el-table-column>
        <el-table-column
          prop="disposalScale"
          label="处置规模"
        ></el-table-column>
        <el-table-column prop="inputName" label="录入人"></el-table-column>
        <el-table-column prop="inputTime" label="录入时间"></el-table-column>
        <el-table-column prop="content" label="备注"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-document"
              @click="getMessage(scope.row.applyId)"
              >详情</el-button
            >
            <el-button
              v-if="rolen !== 'admin'"
              type="text"
              icon="el-icon-edit"
              @click="getUpdateApplyId(scope.row.applyId)"
              >更改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.applyId)"
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
      :visible.sync="applyInfoDialog"
      width="65%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="applyInfoFormRef"
        :rules="applyInfoFormRules"
        :model="applyInfoForm"
        :inline="true"
      >
        <!--  -->
        <el-form-item label="申请编号" prop="applyNo">
          <el-input
            v-model.number="applyInfoForm.applyNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker
            v-model="applyInfoForm.applyDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker> </el-form-item
        ><br />

        <!-- CarCompany  -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请人（运输单位）信息</span>
          </div> </el-form-item
        ><br />
        <el-form-item label="单位名称" prop="carCompanyName">
          <el-input
            v-model="applyInfoForm.carCompanyName"
            class="handle-input mr10"
            style="margin-left:32px; width:190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="carCompanyUnitcode">
          <el-input
            v-model="applyInfoForm.carCompanyUnitcode"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="法定代表人姓名" prop="legalName">
          <el-input
            v-model="applyInfoForm.legalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="legalPhoneNo">
          <el-input
            v-model="applyInfoForm.legalPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="legalCertNo">
          <el-input
            v-model="applyInfoForm.legalCertNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="委托代理人姓名" prop="agentName">
          <el-input
            v-model="applyInfoForm.agentName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="agentPhoneNo">
          <el-input
            v-model="applyInfoForm.agentPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="agentCertNo">
          <el-input
            v-model="applyInfoForm.agentCertNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />

        <!-- SourceInfo -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">建设施工单位信息</span>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="工地名称" prop="sourceName">
          <el-input
            v-model="applyInfoForm.sourceName"
            class="handle-input mr10"
            style="margin-left:16px; width:190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="工地位置" prop="sourceAddress">
          <el-input
            v-model="applyInfoForm.sourceAddress"
            class="handle-input mr10"
            style="margin-left:16px; width:190px"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="建设单位名称" prop="adminUnit">
          <el-input
            v-model="applyInfoForm.adminUnit"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="adminLegalName">
          <el-input
            v-model="applyInfoForm.adminLegalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="adminPhoneNo">
          <el-input
            v-model="applyInfoForm.adminPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="施工单位名称" prop="constructionUnit">
          <el-input
            v-model="applyInfoForm.constructionUnit"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="constructionLegalName">
          <el-input
            v-model="applyInfoForm.constructionLegalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="constructionPhoneNo">
          <el-input
            v-model="applyInfoForm.constructionPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />

        <!-- 申请处置情况 -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请处置情况</span>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="处置规模" prop="disposalScale">
          <el-input
            v-model="applyInfoForm.disposalScale"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置期限" prop="disposalDate">
          <el-date-picker
            v-model="applyInfoForm.disposalStartDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="applyInfoForm.disposalEndDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          >
          </el-date-picker>
        </el-form-item>
        <br />

        <!-- Road -->
        <el-form-item label="运输路段" prop="roadName">
          <el-input
            v-model="applyInfoForm.roadName"
            class="handle-input mr10"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <el-button type="success" @click="addRoad(applyInfoForm.roadName, true)"
          >添加</el-button
        >
        <el-button type="warning" @click="deleteRoad(true)">删除</el-button>
        <el-button type="primary" @click="resetRoute(true)">重置</el-button>
        <br />

        <!-- Route -->
        <el-form-item label="运输路线：" prop="routeDesign">
          {{ this.routeDesignView }}
        </el-form-item>
        <el-form-item label="运输路线名称：" prop="routeName">
          <el-input
            v-model="applyInfoForm.routeName"
            class="handle-input mr10"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <br />

        <!-- Intake -->
        <el-form-item label="消纳场所1" prop="intakePlantName1">
          <el-input
            v-model="applyInfoForm.intakePlantName1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman1">
          <el-input
            v-model="applyInfoForm.intakeLinkman1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo1">
          <el-input
            v-model="applyInfoForm.intakePhoneNo1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="消纳场所2" prop="intakePlantName2">
          <el-input
            v-model="applyInfoForm.intakePlantName2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman2">
          <el-input
            v-model="applyInfoForm.intakeLinkman2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo2">
          <el-input
            v-model="applyInfoForm.intakePhoneNo2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="消纳场所3" prop="intakePlantName3">
          <el-input
            v-model="applyInfoForm.intakePlantName3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman3">
          <el-input
            v-model="applyInfoForm.intakeLinkman3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo3">
          <el-input
            v-model="applyInfoForm.intakePhoneNo3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="备注" prop="content">
          <el-input
            v-model="applyInfoForm.content"
            class="handle-input mr10"
            style="margin-left:36px;width:190px"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" @click="addData">确认提交</el-button>
          <el-button @click="resetApplyInfoForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="applyInfoDialog2"
      width="65%"
      title="请填写申报信息"
      label-width="80px"
      append-to-body
    >
      <el-form
        ref="applyInfoFormRef2"
        :rules="applyInfoFormRules2"
        :model="applyInfoForm2"
        :inline="true"
      >
        <!--  -->
        <el-form-item label="申请编号" prop="applyNo">
          <el-input
            v-model.number="applyInfoForm2.applyNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker
            v-model="applyInfoForm2.applyDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker> </el-form-item
        ><br />

        <!-- CarCompany  -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请人（运输单位）信息</span>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="单位名称" prop="carCompanyName">
          <el-input
            v-model="applyInfoForm2.carCompanyName"
            class="handle-input mr10"
            style="margin-left:32px; width:190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="carCompanyUnitcode">
          <el-input
            v-model="applyInfoForm2.carCompanyUnitcode"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="法定代表人姓名" prop="legalName">
          <el-input
            v-model="applyInfoForm2.legalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="legalPhoneNo">
          <el-input
            v-model="applyInfoForm2.legalPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="legalCertNo">
          <el-input
            v-model="applyInfoForm2.legalCertNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="委托代理人姓名" prop="agentName">
          <el-input
            v-model="applyInfoForm2.agentName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="agentPhoneNo">
          <el-input
            v-model="applyInfoForm2.agentPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="agentCertNo">
          <el-input
            v-model="applyInfoForm2.agentCertNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />

        <!-- SourceInfo -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">建设施工单位信息</span>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="工地名称" prop="sourceName">
          <el-input
            v-model="applyInfoForm2.sourceName"
            class="handle-input mr10"
            style="margin-left:16px; width:190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="工地位置" prop="sourceAddress">
          <el-input
            v-model="applyInfoForm2.sourceAddress"
            class="handle-input mr10"
            style="margin-left:16px; width:190px"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="建设单位名称" prop="adminUnit">
          <el-input
            v-model="applyInfoForm2.adminUnit"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="adminLegalName">
          <el-input
            v-model="applyInfoForm2.adminLegalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="adminPhoneNo">
          <el-input
            v-model="applyInfoForm2.adminPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="施工单位名称" prop="constructionUnit">
          <el-input
            v-model="applyInfoForm2.constructionUnit"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="constructionLegalName">
          <el-input
            v-model="applyInfoForm2.constructionLegalName"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="constructionPhoneNo">
          <el-input
            v-model="applyInfoForm2.constructionPhoneNo"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />

        <!-- 申请处置情况 -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请处置情况</span>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="处置规模" prop="disposalScale">
          <el-input
            v-model="applyInfoForm2.disposalScale"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置期限" prop="disposalDate">
          <el-date-picker
            v-model="applyInfoForm2.disposalStartDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="applyInfoForm2.disposalEndDate"
            type="datetime"
            placeholder="选择日期时间"
            class="handle-input mr10"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          >
          </el-date-picker>
        </el-form-item>
        <br />

        <!-- Road -->
        <el-form-item label="运输路段" prop="roadName">
          <el-input
            v-model="applyInfoForm2.roadName"
            class="handle-input mr10"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <el-button
          type="success"
          @click="addRoad(applyInfoForm2.roadName, false)"
          >添加</el-button
        >
        <el-button type="warning" @click="deleteRoad(false)">删除</el-button>
        <el-button type="primary" @click="resetRoute(false)">重置</el-button>
        <br />

        <!-- Route -->
        <el-form-item label="运输路线：" prop="routeDesign">
          {{ this.routeDesignView2 }}
        </el-form-item>
        <el-form-item label="运输路线名称：" prop="routeName">
          <el-input
            v-model="applyInfoForm2.routeName"
            class="handle-input mr10"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <br />

        <!-- Intake -->
        <el-form-item label="消纳场所1" prop="intakePlantName1">
          <el-input
            v-model="applyInfoForm2.intakePlantName1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman1">
          <el-input
            v-model="applyInfoForm2.intakeLinkman1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo1">
          <el-input
            v-model="applyInfoForm2.intakePhoneNo1"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="消纳场所2" prop="intakePlantName2">
          <el-input
            v-model="applyInfoForm2.intakePlantName2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman2">
          <el-input
            v-model="applyInfoForm2.intakeLinkman2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo2">
          <el-input
            v-model="applyInfoForm2.intakePhoneNo2"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="消纳场所3" prop="intakePlantName3">
          <el-input
            v-model="applyInfoForm2.intakePlantName3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="intakeLinkman3">
          <el-input
            v-model="applyInfoForm2.intakeLinkman3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="intakePhoneNo3">
          <el-input
            v-model="applyInfoForm2.intakePhoneNo3"
            class="handle-input mr10"
          ></el-input>
        </el-form-item>
        <br />
        &nbsp;
        <el-form-item label="备注" prop="content">
          <el-input
            v-model="applyInfoForm2.content"
            class="handle-input mr10"
            style="margin-left:36px;width:190px"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" @click="updateData">确认提交</el-button>
          <el-button @click="resetApplyInfoForm2">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 显示详情  -->
    <el-dialog
      :visible.sync="applyInfoDialog3"
      width="60%"
      title="申报信息详情"
      label-width="80px"
      append-to-body
    >
      <el-form :model="applyInfoForm2" :inline="true">
        <el-form-item label="申请编号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.applyNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="申请日期">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.applyDate | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <!-- CarCompany -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请人（运输单位）信息</span>
          </div>
        </el-form-item>
        <el-form-item label="单位名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.carCompanyName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.carCompanyUnitcode
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="法定代表人（负责人）姓名">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.legalName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.legalPhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="身份证号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.legalCertNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="委托代理人姓名">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.agentName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.agentPhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="身份证号">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.agentCertNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <!-- CarCompany -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">建设施工单位信息</span>
          </div>
        </el-form-item>
        <el-form-item label="工地名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.sourceName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="工地位置">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.sourceAddress
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="建设单位名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.adminUnit
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="法定代表人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.adminLegalName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.adminPhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="施工单位名称">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.constructionUnit
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="法定代表人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.constructionLegalName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.constructionPhoneNo
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <!-- 申请处置情况 -->
        <el-form-item>
          <div class="tableTitle">
            <span class="midText">申请处置情况</span>
          </div>
        </el-form-item>
        <el-form-item label="处置规模">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.disposalScale
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="处置期限">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.disposalStartDate | dateFormat1
            }}&nbsp;&nbsp;</span
          >
          <span> -- </span>
          <span style="color: red"
            >&nbsp;&nbsp;{{
              applyInfoForm2.disposalEndDate | dateFormat1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="运输路线名称：">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.routeName
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="运输路线">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              routeDesignView2
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <!-- Intake -->
        <el-form-item label="消纳场所1">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePlantName1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="负责人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakeLinkman1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePhoneNo1
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="消纳场所2">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePlantName2
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="负责人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakeLinkman2
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePhoneNo2
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="消纳场所3">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePlantName3
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="负责人">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakeLinkman3
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <el-form-item label="联系电话">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.intakePhoneNo3
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
        <br />
        <el-form-item label="备注">
          ：&nbsp;&nbsp;
          <span style="color: red"
            >{{
              applyInfoForm2.content
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAllApply,
  selectAllApplyMore, // 多表查询
  selectApplyByPage,
  selectApplyByPageMore, // 多表查询
  insertApplyInfo,
  deleteApplyInfo,
  updateApplyInfo,
  updateOrInsertCarCompany,
  updateOrInsertSource,
  updateOrInsertRoute,
  updateOrInsertIntake,
  updateOrInsertRoad,
  getCarCompanyById,
  getSourceInfoById,
  getIntakeInfoById,
  getRouteById,
  getRoadById,
  updateCarData,
  updateRouteById,
  updateCompanyData,
  updateSourceData,
  updateIntakeData,
  insertIntakeData
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
      // select_applyId: "",
      select_applyNo: "",
      // select_company: "",

      // 填写申报信息的对话框
      applyInfoDialog: false,
      // 表单绑定值
      routeDesignRaw: [],
      routeDesignView: "",
      routeDesignIds: [],
      applyInfoForm: {
        // applyInfo 字段
        applyId: "",
        applyNo: "",
        applyDate: "",
        // carCompanyId: "",
        tranStartTime1: "",
        tranEndTime1: "",
        tranStartTime2: "",
        tranEndTime2: "",
        // routeId: "",
        // sourceId: "",
        // intakePlantId1: "",
        // intakePlantId2: "",
        // intakePlantId3: "",
        disposalStartDate: "",
        disposalEndDate: "",
        disposalScale: "",
        inputName: "",
        inputTime: "",
        content: "",

        // CarCompany 字段
        carCompanyId: "",
        carCompanyName: "",
        carCompanyUnitcode: "",
        legalName: "",
        legalPhoneNo: "",
        legalCertNo: "",
        agentName: "",
        agentPhoneNo: "",
        agentCertNo: "",
        // inputName: "",
        // inputTime: "",
        // reviewStatus: "",

        // SourceInfo 字段
        sourceId: "",
        sourceName: "",
        sourceAddress: "",
        adminUnit: "",
        adminLegalName: "",
        adminPhoneNo: "",
        constructionUnit: "",
        constructionLegalName: "",
        constructionPhoneNo: "",
        // inputName: "",
        // inputTime: "",
        // reviewStatus: "",

        // road 字段
        roadId: "",
        roadName: "",
        // roadAddress: "",
        // inputName: "",
        // inputTime: "",

        // route 字段
        routeId: "",
        routeName: "",
        routeDesign: "",
        // lngLat: "",
        // inputName: "",
        // inputTime: "",

        // IntakeInfo 字段
        id1: "",
        intakePlantId1: "",
        intakePlantName1: "",
        intakeLinkman1: "",
        intakePhoneNo1: "",

        id2: "",
        intakePlantId2: "",
        intakePlantName2: "",
        intakeLinkman2: "",
        intakePhoneNo2: "",

        id3: "",
        intakePlantId3: "",
        intakePlantName3: "",
        intakeLinkman3: "",
        intakePhoneNo3: ""
      },

      // 表单验证规则
      applyInfoFormRules: {
        applyNo: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        applyDate: [{ required: true, message: "不能为空！", trigger: "blur" }],
        carCompanyName: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        sourceName: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        routeDesign: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        intakePlantName1: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ]
      },
      // 修改申报信息的对话框
      applyInfoDialog2: false,
      // 表单绑定值
      // 表单绑定值
      routeDesignRaw2: [], // 路线的原始数组 [长江路，黄河路，北京路]
      routeDesignView2: "", // 路线的显示层：长江路-黄河路-北京路
      routeDesignIds2: [], // [1, 2, 3]
      applyInfoForm2: {
        // applyInfo 字段
        applyId: "",
        applyNo: "",
        applyDate: "",
        // carCompanyId: "",
        tranStartTime1: "",
        tranEndTime1: "",
        tranStartTime2: "",
        tranEndTime2: "",
        // routeId: "",
        // sourceId: "",
        // intakePlantId1: "",
        // intakePlantId2: "",
        // intakePlantId3: "",
        disposalStartDate: "",
        disposalEndDate: "",
        disposalScale: "",
        inputName: "",
        inputTime: "",
        content: "",

        // CarCompany 字段
        carCompanyId: "",
        carCompanyName: "",
        carCompanyUnitcode: "",
        legalName: "",
        legalPhoneNo: "",
        legalCertNo: "",
        agentName: "",
        agentPhoneNo: "",
        agentCertNo: "",
        // inputName: "",
        // inputTime: "",
        // reviewStatus: "",

        // SourceInfo 字段
        sourceId: "",
        sourceName: "",
        sourceAddress: "",
        adminUnit: "",
        adminLegalName: "",
        adminPhoneNo: "",
        constructionUnit: "",
        constructionLegalName: "",
        constructionPhoneNo: "",
        // inputName: "",
        // inputTime: "",
        // reviewStatus: "",

        // road 字段
        roadId: "",
        roadName: "",
        // roadAddress: "",
        // inputName: "",
        // inputTime: "",

        // route 字段
        routeId: "",
        routeName: "",
        routeDesign: "",
        // lngLat: "",
        // inputName: "",
        // inputTime: "",

        // IntakeInfo 字段
        id1: "",
        intakePlantId1: "",
        intakePlantName1: "",
        intakeLinkman1: "",
        intakePhoneNo1: "",

        id2: "",
        intakePlantId2: "",
        intakePlantName2: "",
        intakeLinkman2: "",
        intakePhoneNo2: "",

        id3: "",
        intakePlantId3: "",
        intakePlantName3: "",
        intakeLinkman3: "",
        intakePhoneNo3: ""
      },
      // 表单验证规则
      applyInfoFormRules2: {
        applyNo: [
          { required: true, message: "不能为空！", trigger: "blur" }
          // { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        applyDate: [{ required: true, message: "不能为空！", trigger: "blur" }],
        carCompanyName: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        sourceName: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        routeDesign: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ],
        intakePlantName1: [
          { required: true, message: "不能为空！", trigger: "blur" }
        ]
      },

      // 打开查看详情的对话框
      applyInfoDialog3: false,
      // 更改审核状态的对话框
      reviewDialog: false,
      // 更改审核状态的选择器绑定值
      reviewStatusRadio: 0,
      // 保存点击的是哪一个car_id
      currentapplyId: 0,

      // 从首页监听的审核状态值
      reviewS: 4
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
    // 路线操作方法, flag：false, 添加表单; true, 修改表单：
    addRoad(roadName, flag) {
      let that = this;
      // 传输数据到后端
      let roadInfo = { roadId: null, roadName };
      updateOrInsertRoad(roadInfo)
        .then(res => {
          let data = JSON.parse(JSON.stringify(res.data.respBody));
          if (res.data.success) {
            if (flag) {
              that.routeDesignIds.push(data);
              that.routeDesignRaw.push(roadName);
            } else {
              that.routeDesignIds2.push(data);
              that.routeDesignRaw2.push(roadName);
            }
          } else {
            console.log("road, 后端没有请求没有成功。");
          }
        })
        .catch(e => {
          console.log("推送roadName失败：", e.message);
        });
    },
    deleteRoad(flag) {
      if (flag) {
        this.routeDesignRaw.pop();
        this.routeDesignIds.pop();
      } else {
        this.routeDesignRaw2.pop();
        this.routeDesignIds2.pop();
      }
    },
    resetRoute(flag) {
      if (flag) {
        this.routeDesignRaw = [];
        this.routeDesignIds = [];
      } else {
        this.routeDesignRaw2 = [];
        this.routeDesignIds2 = [];
      }
    },

    // 请求数据方法
    async getData() {
      // 根据用户名来判断请求的数据
      //如果是管理员，则请求所有的数据---分页请求
      await selectAllApply()
        .then(res => {
          this.totalCount = res.data.respBody.length;
        })
        .then({});
      await selectApplyByPageMore(true, this.currentPage, this.PageSize).then(
        res => {
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
      selectApplyByPageMore(true, this.currentPage, this.PageSize).then(res => {
        this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
        this.tableData = JSON.parse(JSON.stringify(this.allData));
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      });
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      selectApplyByPageMore(true, this.currentPage, this.PageSize).then(res => {
        this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
        this.tableData = JSON.parse(JSON.stringify(this.allData));
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      });
    },

    // 根据标签筛选
    filterTag(value, row) {
      return row.reviewStatus === value;
    },

    // 表单
    // 点击取消和X按钮，重置表单
    resetApplyInfoForm() {
      this.resetRoute(true);
      if (this.$refs.applyInfoFormRef !== undefined) {
        this.$refs.applyInfoFormRef.resetFields();
      }
    },

    async preAddData() {
      let that = this;
      let requests = []; // 存放所有请求

      // CarCompany - 封装数据，ajax请求
      let {
        carCompanyName,
        carCompanyUnitcode,
        legalName,
        legalPhoneNo,
        legalCertNo,
        agentName,
        agentPhoneNo,
        agentCertNo
      } = this.applyInfoForm;
      let carCompanyData = {
        carCompanyName,
        carCompanyUnitcode,
        legalName,
        legalPhoneNo,
        legalCertNo,
        agentName,
        agentPhoneNo,
        agentCertNo
      };
      let requestCarCompany = updateOrInsertCarCompany(carCompanyData)
        .then(res => {
          if (res.data.success) {
            that.applyInfoForm.carCompanyId = res.data.respBody; // 获取返回的CarCompanyId
          } else {
            console.log("CarCompany后端没有请求没有成功。");
          }
        })
        .catch(e => {
          console.log("推送CarCompanyData失败：", e.message);
        });
      requests.push(requestCarCompany);
      // End - CarCompany

      // SourceInfo - 封装数据，ajax请求
      let {
        sourceName,
        sourceAddress,
        adminUnit,
        adminLegalName,
        adminPhoneNo,
        constructionUnit,
        constructionLegalName,
        constructionPhoneNo
      } = this.applyInfoForm;
      let sourceData = {
        sourceName,
        sourceAddress,
        adminUnit,
        adminLegalName,
        adminPhoneNo,
        constructionUnit,
        constructionLegalName,
        constructionPhoneNo
      };
      let requestSource = updateOrInsertSource(sourceData)
        .then(res => {
          if (res.data.success) {
            that.applyInfoForm.sourceId = res.data.respBody; // 获取返回的 sourceId
          } else {
            console.log("Source后端没有请求没有成功。");
          }
        })
        .catch(e => {
          console.log("推送sourceData失败：", e.message);
        });
      requests.push(requestSource);
      // End - sourceInfo

      // routeInfo - 封装数据，ajax请求
      let { routeDesign, routeName } = this.applyInfoForm;
      let routeData = { routeDesign, routeName };
      let requestRoute = updateOrInsertRoute(routeData)
        .then(res => {
          if (res.data.success) {
            that.applyInfoForm.routeId = res.data.respBody; // 获取返回的 routeId
          } else {
            console.log("routeInfo后端没有请求没有成功。");
          }
        })
        .catch(e => {
          console.log("推送routeInfo失败：", e.message);
        });
      requests.push(requestRoute);
      // End - routeInfo

      // intakeInfo * 3 - 封装数据，ajax请求
      if (
        this.applyInfoForm.intakePlantName1 != null &&
        this.applyInfoForm.intakePlantName1 != ""
      ) {
        let {
          intakePlantName1,
          intakeLinkman1,
          intakePhoneNo1
        } = this.applyInfoForm;
        let intakeData1 = {
          intakePlantName: intakePlantName1,
          intakeLinkman: intakeLinkman1,
          intakePhoneNo: intakePhoneNo1
        };
        let requestIntake1 = updateOrInsertIntake(intakeData1)
          .then(res => {
            if (res.data.success) {
              that.applyInfoForm.intakePlantId1 = res.data.respBody; // 获取返回的 routeId
            } else {
              console.log("intakeInfo1后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("推送intakeInfo1失败：", e.message);
          });
        requests.push(requestIntake1);
      }

      if (
        this.applyInfoForm.intakePlantName2 != null &&
        this.applyInfoForm.intakePlantName2 != ""
      ) {
        let {
          intakePlantName2,
          intakeLinkman2,
          intakePhoneNo2
        } = this.applyInfoForm;
        let intakeData2 = {
          intakePlantName: intakePlantName2,
          intakeLinkman: intakeLinkman2,
          intakePhoneNo: intakePhoneNo2
        };
        let requestIntake2 = updateOrInsertIntake(intakeData2)
          .then(res => {
            if (res.data.success) {
              that.applyInfoForm.intakePlantId2 = res.data.respBody; // 获取返回的 routeId
            } else {
              console.log("intakeInfo2后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("推送intakeInfo2失败：", e.message);
          });
        requests.push(requestIntake2);
      }

      if (
        this.applyInfoForm.intakePlantName3 != null &&
        this.applyInfoForm.intakePlantName3 != ""
      ) {
        let {
          intakePlantName3,
          intakeLinkman3,
          intakePhoneNo3
        } = this.applyInfoForm;
        let intakeData3 = {
          intakePlantName: intakePlantName3,
          intakeLinkman: intakeLinkman3,
          intakePhoneNo: intakePhoneNo3
        };
        let requestIntake3 = updateOrInsertIntake(intakeData3)
          .then(res => {
            if (res.data.success) {
              that.applyInfoForm.intakePlantId3 = res.data.respBody; // 获取返回的 routeId
            } else {
              console.log("intakeInfo3后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("推送intakeInfo3失败：", e.message);
          });
        requests.push(requestIntake3);
      }
      // End - intakeInfo

      // 并发发送请求
      return Promise.all(requests);
    },

    // 提交表单--增加数据
    async addData() {
      let that = this;
      // 表单验证
      let isLegal = true;
      await this.$refs["applyInfoFormRef"].validate(valid => {
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

      // pre PUT Data --> CarCompany, SourceInfo, routeInfo, IntakeInfo * 3
      await that.preAddData();

      // applyInfo - 封装数据，ajax请求
      let applyInfoData = {
        applyId: this.applyInfoForm.applyId,
        applyNo: this.applyInfoForm.applyNo,
        applyDate: this.applyInfoForm.applyDate,
        carCompanyId: this.applyInfoForm.carCompanyId,
        tranStartTime1: this.applyInfoForm.tranStartTime1,
        tranEndTime1: this.applyInfoForm.tranEndTime1,
        tranStartTime2: this.applyInfoForm.tranStartTime2,
        tranEndTime2: this.applyInfoForm.tranEndTime2,
        routeId: this.applyInfoForm.routeId,
        sourceId: this.applyInfoForm.sourceId,
        intakePlantId1: this.applyInfoForm.intakePlantId1,
        intakePlantId2: this.applyInfoForm.intakePlantId2,
        intakePlantId3: this.applyInfoForm.intakePlantId3,
        disposalStartDate: this.applyInfoForm.disposalStartDate,
        disposalEndDate: this.applyInfoForm.disposalEndDate,
        disposalScale: this.applyInfoForm.disposalScale,
        inputName: this.$user.getInfo().id,
        inputTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        content: this.applyInfoForm.content
      };
      insertApplyInfo(applyInfoData)
        .then(res => {
          if (res.data.success) {
            // 结束
            that.$message({
              message: "提交成功！",
              type: "success",
              offset: 300,
              center: true,
              duration: 1000
            });
            // 关闭对话框
            that.applyInfoDialog = false;
            // 重置表单
            that.resetApplyInfoForm(false);
          } else {
            console.log("routeInfo后端没有请求没有成功。");
          }
        })
        .then(() => {
          // 重新渲染表格
          that.getData();
        })
        .catch(e => {
          console.log("推送routeInfo失败：", e.message);
          that.$message({
            message: "核准单信息提交失败！",
            type: "error",
            offset: 300,
            center: true,
            duration: 1000
          });
        });

      // End - applyInfo
    },

    // 点击取消和X按钮，重置表单
    resetApplyInfoForm2() {
      this.resetRoute(false);
      if (this.$refs.applyInfoFormRef2 !== undefined) {
        this.$refs.applyInfoFormRef2.resetFields();
      }
    },

    // 更改、详情按钮需要的获取信息方法
    async getInfo(id) {
      // 清空表格2
      this.resetApplyInfoForm2();

      let that = this;
      // 根据id找到index
      let index = that.allData.findIndex(item => {
        if (item.applyId == id) {
          return true;
        }
      });

      // 获取已有数据
      for (let key in that.allData[index]) {
        that.applyInfoForm2[key] = that.allData[index][key];
      }
      // this.applyInfoForm2 = JSON.parse(JSON.stringify(this.allData[index]));
      // CarCompany 获取数据
      if (that.applyInfoForm2.carCompanyId !== "") {
        getCarCompanyById(that.applyInfoForm2.carCompanyId)
          .then(res => {
            if (res.data.success) {
              for (let key in res.data.respBody[0]) {
                that.applyInfoForm2[key] = res.data.respBody[0][key];
              }
            } else {
              console.log("根据id 查询 carCompany 后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("根据id 查询 carCompany 后端失败：", e.message);
          });
      }
      // Source 获取数据
      if (that.applyInfoForm2.sourceId !== "") {
        getSourceInfoById(that.applyInfoForm2.sourceId)
          .then(res => {
            if (res.data.success) {
              for (let key in res.data.respBody[0]) {
                that.applyInfoForm2[key] = res.data.respBody[0][key];
              }
            } else {
              console.log("根据id 查询 source 后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("根据id 查询 source 后端失败：", e.message);
          });
      }
      // route 获取数据
      if (that.applyInfoForm2.routeId !== "") {
        let res = await getRouteById(that.applyInfoForm2.routeId).catch(e => {
          console.log("根据id 查询 route 后端失败：", e.message);
        });
        that.resetRoute(false);
        if (res.data.success) {
          that.applyInfoForm2["routeName"] = res.data.respBody[0]["routeName"];
          that.applyInfoForm2.routeDesign = res.data.respBody[0]["routeDesign"];
          if (
            that.applyInfoForm2.routeDesign != null &&
            that.applyInfoForm2.routeDesign != ""
          ) {
            let temp = that.applyInfoForm2.routeDesign.split("|").map(Number);
            that.routeDesignIds2 = JSON.parse(JSON.stringify(temp));
            // 异步，根据顺序请求
            this.getRoadByOrder(that.routeDesignIds2);
          }
        } else {
          console.log("根据id 查询 route 后端没有请求没有成功。");
        }
      }
      // Intake1 获取数据
      if (that.applyInfoForm2.intakePlantId1 !== "") {
        getIntakeInfoById(that.applyInfoForm2.intakePlantId1)
          .then(res => {
            if (res.data.success) {
              for (let key in res.data.respBody[0]) {
                let newKey = key + "1";
                that.applyInfoForm2[newKey] = res.data.respBody[0][key];
              }
            } else {
              console.log("根据id 查询 intake1 后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("根据id 查询 intake1 后端失败：", e.message);
          });
      }

      // Intake2 获取数据
      if (that.applyInfoForm2.intakePlantId2 !== "") {
        getIntakeInfoById(that.applyInfoForm2.intakePlantId2)
          .then(res => {
            if (res.data.success) {
              for (let key in res.data.respBody[0]) {
                let newKey = key + "2";
                that.applyInfoForm2[newKey] = res.data.respBody[0][key];
              }
            } else {
              console.log("根据id 查询 intake2 后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("根据id 查询 intake2 后端失败：", e.message);
          });
      }

      // Intake3 获取数据
      if (that.applyInfoForm2.intakePlantId3 !== "") {
        getIntakeInfoById(that.applyInfoForm2.intakePlantId3)
          .then(res => {
            if (res.data.success) {
              for (let key in res.data.respBody[0]) {
                let newKey = key + "3";
                that.applyInfoForm2[newKey] = res.data.respBody[0][key];
              }
            } else {
              console.log("根据id 查询 intake3 后端没有请求没有成功。");
            }
          })
          .catch(e => {
            console.log("根据id 查询 intake3 后端失败：", e.message);
          });
      }
    },

    // 异步 根据顺序请求
    async getRoadByOrder(outArr) {
      let arr = JSON.parse(JSON.stringify(outArr));
      let that = this;
      let roadName = arr.shift();
      if (roadName != undefined) {
        await getRoadById(roadName).then(res => {
          that.routeDesignRaw2.push(res.data.respBody[0].roadName);
        });
        that.getRoadByOrder(arr);
      }
    },

    // 获取需要更新数据的id-并把信息显示在对话框中
    async getUpdateApplyId(id) {
      this.getInfo(id);
      this.applyInfoDialog2 = true;
    },

    // 修改表单
    async preUpdateData() {
      let that = this;
      let requests = [];

      // CarCompany - 封装数据，ajax请求
      let {
        carCompanyId,
        carCompanyName,
        carCompanyUnitcode,
        legalName,
        legalPhoneNo,
        legalCertNo,
        agentName,
        agentPhoneNo,
        agentCertNo
      } = this.applyInfoForm2;
      let carCompanyData = {
        carCompanyId,
        carCompanyName,
        carCompanyUnitcode,
        legalName,
        legalPhoneNo,
        legalCertNo,
        agentName,
        agentPhoneNo,
        agentCertNo
      };
      let requestCarCompany = updateCompanyData(carCompanyData)
        .then(res => {
          if (res.data.success) {
            console.log("更新CarCompany后端成功。");
          } else {
            console.log("更新CarCompany后端失败。");
          }
        })
        .catch(e => {
          console.log("更新CarCompanyData失败：", e.message);
        });
      requests.push(requestCarCompany);
      // End - CarCompany

      // SourceInfo - 封装数据，ajax请求
      let {
        sourceId,
        sourceName,
        sourceAddress,
        adminUnit,
        adminLegalName,
        adminPhoneNo,
        constructionUnit,
        constructionLegalName,
        constructionPhoneNo
      } = this.applyInfoForm2;
      let sourceData = {
        sourceId,
        sourceName,
        sourceAddress,
        adminUnit,
        adminLegalName,
        adminPhoneNo,
        constructionUnit,
        constructionLegalName,
        constructionPhoneNo
      };
      let requestSource = updateSourceData(sourceData)
        .then(res => {
          if (res.data.success) {
            console.log("更新Source后端成功。");
          } else {
            console.log("更新Source后端失败。");
          }
        })
        .catch(e => {
          console.log("更新sourceData失败：", e.message);
        });
      requests.push(requestSource);
      // End - sourceInfo

      // routeInfo - 封装数据，ajax请求
      let { routeId, routeDesign, routeName } = this.applyInfoForm2;
      let routeData = { routeId, routeDesign, routeName };
      let requestRoute = updateRouteById(routeData)
        .then(res => {
          if (res.data.success) {
            console.log("更新routeInfo成功。");
          } else {
            console.log("更新routeInfo失败。");
          }
        })
        .catch(e => {
          console.log("更新routeInfo失败：", e.message);
        });
      requests.push(requestRoute);
      // End - routeInfo

      // intakeInfo * 3 - 封装数据，ajax请求
      // intake 1
      if (
        this.applyInfoForm2.intakePlantName1 != null &&
        this.applyInfoForm2.intakePlantName1 != ""
      ) {
        let {
          intakePlantId1,
          intakePlantName1,
          intakeLinkman1,
          intakePhoneNo1
        } = this.applyInfoForm2;
        let isNull = false;
        if (intakePlantId1 == null || intakePlantId1 == "") {
          isNull = true;
        }
        let intakeData1 = {
          intakePlantId: intakePlantId1,
          intakePlantName: intakePlantName1,
          intakeLinkman: intakeLinkman1,
          intakePhoneNo: intakePhoneNo1
        };
        let requestIntake1 = updateOrInsertIntake(intakeData1)
          .then(res => {
            if (res.data.success) {
              //   if (isNull) {
              that.applyInfoForm2.intakePlantId1 = res.data.respBody;
              //   }
              console.log("更新intake1成功。");
            } else {
              console.log("更新intake1失败。");
            }
          })
          .catch(e => {
            console.log("更新intake1失败。", e.message);
          });
        requests.push(requestIntake1);
      }

      // intake 2
      if (
        this.applyInfoForm2.intakePlantName2 != null &&
        this.applyInfoForm2.intakePlantName2 != ""
      ) {
        let {
          intakePlantId2,
          intakePlantName2,
          intakeLinkman2,
          intakePhoneNo2
        } = this.applyInfoForm2;
        let isNull = false;
        if (intakePlantId2 == null || intakePlantId2 == "") {
          isNull = true;
        }
        let intakeData2 = {
          intakePlantId: intakePlantId2,
          intakePlantName: intakePlantName2,
          intakeLinkman: intakeLinkman2,
          intakePhoneNo: intakePhoneNo2
        };
        let requestIntake2 = updateOrInsertIntake(intakeData2)
          .then(res => {
            if (res.data.success) {
              //  if (isNull) {
              that.applyInfoForm2.intakePlantId2 = res.data.respBody;
              //  }
              console.log("更新intake2成功。");
            } else {
              console.log("更新intake2失败。");
            }
          })
          .catch(e => {
            console.log("更新intake2失败。", e.message);
          });
        requests.push(requestIntake2);
      }

      // intake 3
      if (
        this.applyInfoForm2.intakePlantName3 != null &&
        this.applyInfoForm2.intakePlantName3 != ""
      ) {
        let {
          intakePlantId3,
          intakePlantName3,
          intakeLinkman3,
          intakePhoneNo3
        } = this.applyInfoForm2;
        let isNull = false;
        if (intakePlantId3 == null || intakePlantId3 == "") {
          isNull = true;
        }
        let intakeData3 = {
          intakePlantId: intakePlantId3,
          intakePlantName: intakePlantName3,
          intakeLinkman: intakeLinkman3,
          intakePhoneNo: intakePhoneNo3
        };
        let requestIntake3 = updateOrInsertIntake(intakeData3)
          .then(res => {
            if (res.data.success) {
              // if (isNull) {
              that.applyInfoForm2.intakePlantId3 = res.data.respBody;
              //   }
              console.log("更新intake3成功。");
            } else {
              console.log("更新intake3失败。");
            }
          })
          .catch(e => {
            console.log("更新intake3失败。", e.message);
          });
        requests.push(requestIntake3);
      }
      // End - intakeInfo

      // 并发，发送请求。
      return Promise.all(requests);
    },

    async updateData() {
      let that = this;

      // 表单验证
      let isLegal = true;
      await this.$refs["applyInfoFormRef2"].validate(valid => {
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

      // pre PUT Data --> CarCompany, SourceInfo, routeInfo, IntakeInfo * 3
      await that.preUpdateData();

      // applyInfo - 封装数据，ajax请求
      let applyInfoData = {
        applyId: this.applyInfoForm2.applyId,
        applyNo: this.applyInfoForm2.applyNo,
        applyDate: this.applyInfoForm2.applyDate,
        carCompanyId: this.applyInfoForm2.carCompanyId,
        tranStartTime1: this.applyInfoForm2.tranStartTime1,
        tranEndTime1: this.applyInfoForm2.tranEndTime1,
        tranStartTime2: this.applyInfoForm2.tranStartTime2,
        tranEndTime2: this.applyInfoForm2.tranEndTime2,
        routeId: this.applyInfoForm2.routeId,
        sourceId: this.applyInfoForm2.sourceId,
        intakePlantId1: this.applyInfoForm2.intakePlantId1,
        intakePlantId2: this.applyInfoForm2.intakePlantId2,
        intakePlantId3: this.applyInfoForm2.intakePlantId3,
        disposalStartDate: this.applyInfoForm2.disposalStartDate,
        disposalEndDate: this.applyInfoForm2.disposalEndDate,
        disposalScale: this.applyInfoForm2.disposalScale,
        inputName: this.$user.getInfo().id,
        inputTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        content: this.applyInfoForm2.content
      };
      updateApplyInfo(applyInfoData)
        .then(res => {
          if (res.data.success) {
            // 结束
            that.$message({
              message: "提交成功！",
              type: "success",
              offset: 300,
              center: true,
              duration: 1000
            });
            // 关闭对话框
            that.applyInfoDialog2 = false;
            // 重置表单
            that.resetApplyInfoForm2();
          } else {
            console.log("applyInfo更新失败。");
          }
        })
        .then(() => {
          // 重新渲染表格
          that.getData();
        })
        .catch(e => {
          console.log("更新applyInfo失败：", e.message);
          that.$message({
            message: "核准单信息修改失败！",
            type: "error",
            offset: 300,
            center: true,
            duration: 1000
          });
        });

      // End - applyInfo
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
            if (item.applyId == id) {
              return true;
            }
          });
          // 判断是否能删除
          deleteApplyInfo(this.allData[index].applyId)
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
    async getMessage(id) {
      this.getInfo(id);
      this.applyInfoDialog3 = true;
    }
  },
  watch: {
    // 提交表单绑定的路段id数组
    routeDesignRaw: function() {
      // 视图层
      this.routeDesignView = this.routeDesignRaw.join("-");
      // 数据层
      this.applyInfoForm.routeDesign = this.routeDesignIds.join("|");
    },
    routeDesignRaw2: function() {
      this.routeDesignView2 = this.routeDesignRaw2.join("-");
      this.applyInfoForm2.routeDesign = this.routeDesignIds2.join("|");
    },

    select_applyNo: function() {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input2 = this.select_applyNo;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].applyNo.toString().indexOf(input2) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
    },

    reviewS: function() {
      if (this.reviewS !== 4) this.filterTag(this.reviewS);
    }
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

/* 申请表格式修改 */
.tableTitle {
  position: relative;
  margin: 0 auto;
  width: 900px;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
  display: block;
  float: clear;
}
.midText {
  position: absolute;
  text-align: center;
  left: 50%;
  background-color: #ffffff;
  padding: 0 auto;
  transform: translateX(-50%) translateY(-50%);
  font-weight: bold;
}
</style>
