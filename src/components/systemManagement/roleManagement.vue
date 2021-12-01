<template>
  <div>
    <!-- 面包屑 -->
    <div id="title">
      <div class="crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <img src="../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <span>角色名：</span>
      <input
        type="text"
        class="input-style"
        placeholder="请输入角色名"
        v-model="roleName"
      />
      <button class="add-btu ml" @click="addDialog = true">新增</button>
      <button class="delete-btu ml" @click="deleteData">删除</button>
    </div>
    <!-- 表格 -->
    <div id="mytable">
      <el-table
        :data="
          tableData
        "
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          align="center"
          label="角色描述"
        ></el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">  
            <el-button @click="setPagePower(scope.$index,scope.row)"  
            class="detailTxtBtn" 
            type="text" 
            size="small">权限配置</el-button>
            <el-button 
              type="text" 
              icon="el-icon-edit" 
              style="color:#FFFF"
              @click="openUpdateDialog(scope.row.id)">更改</el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete" 
              class="red"
              style="color:#FF0000" 
              @click="deleteOneData(scope.row.id)">删除
            </el-button>
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

    <!-- 新增表单 -->
    <el-dialog
      :visible.sync="addDialog"
      append-to-body
      width="60%"
      title="请填写信息"
      label-width="80px"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" :inline="true">
        <el-row :gutter="20">
          <el-form-item label="角色名称" prop="roleName" >
            <el-col :span="20">
              <el-input v-model.number="addForm.roleName"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="角色描述" prop="roleDesc">
            <el-col :span="24" >
              <el-input type="textarea" v-model="addForm.roleDesc" style="width:360px;" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" :offset="6">
          <el-form-item>
            <el-col :offset="11" >
              <el-button type="primary" @click="addData">确认提交</el-button>
              <el-button @click="cancelAddData">重置</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 修改一条数据的对话框 -->
    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="updateDialog"
      append-to-body
      width="60%"
      title="请修改信息"
      label-width="80px"
    >
      <el-form
        ref="updateFormRef"
        :rules="updateFormRules"
        :model="updateForm"
        :inline="true"
      >
        <el-row :gutter="20">
          <el-form-item label="角色名称">
            <el-col :span="20">
              <el-input v-model="updateForm.roleName"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="角色描述">
            <el-col :span="24" >
              <el-input type="textarea" v-model="updateForm.roleDesc" style="width:360px;" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item>
            <el-col :offset="9" >
              <el-button type="primary" @click="updateData">确认修改</el-button>
              <el-button @click="cancelUpdateData">取消修改</el-button>
            </el-col>
          </el-form-item>
        </el-row>
        </el-form>
    </el-dialog>

     <!-- 权限配置 -->
    <el-dialog
      :close-on-click-modal="true"

      title="权限配置"
      append-to-body
      :visible.sync="pageDialogVisible"
      width="800px"
    >
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="pagePowerArray"
          filterable
          :titles="['未关联', '已关联']"
          :button-texts="['到左边', '到右边']"
          :props="{key: 'id',label: 'sourcedesc'}"
          :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"

          :data="pageArray"
        >
          <span slot-scope="{ option }">{{ option.sourcedesc }}</span>
          <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
          <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="pageDialogVisible = false">关闭</el-button>
        <el-button type="primary" size="small" @click.native="powerSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { Message } from "element-ui";
import {
    selectRoleListPage,
    updateRole,
    deleteRoleById,
    deleteRoleByRoleName,
    createRole,
    deleteOneRole,
    deleteOneRole_get,
    deleteRoleById_get,
    getPagesourceListByRoleId,
    getNoPagesourceListByRoleId,
    getPageSourceList,
    addPower,
    delByRoleIdJoinPsourceIdList,
    selecttRoleListByPage,
    selectRoleListPageNew,
}from "../../assets/axios/index";
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

      // 渲染表格的数据
      tableData: [],
      // 备用数据
      subTableData: [],
      multipleSelection: [],

      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 10, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 5,

      //监听角色名称
      roleName: "",
      //点击的当前id
      currentId: 0,

      //增加数据的id
      nextTodoId: 9,
      pageDialogVisible:false,

      //新增表单信息的对话框
      addDialog: false,
      // 表单绑定值
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 表单验证规则2
      // required: true 表示必填项
      // trigger: 'blur’表示当失去焦点时触发
      addFormRules: {
        roleName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        roleDesc: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },

      // 修改申报信息的对话框
      updateDialog: false,
      // 表单绑定值
      updateForm: {
        roleName: "",
        roleDesc: "",
      },
      // 表单验证规则2
      updateFormRules: {
        roleName: [{ required: true, message: "不能为空!", trigger: "blur" }],
        roleDesc: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },

      pagePowerArray:[],
      selectId:"",
      pageArray:[],
      total: 0,
    };
  },
  mounted(){
    this.handleSearch();
  },
  created() {
    //请求数据
    this.getData();
    selectRoleListPage().then((res) => {
      let dataList = [];
      for (let i = 0; i < res.data.respBody.records.length; i++) {
        let one = {
          id: i,
          organizationName: res.data.respBody.records[i].organizationName,
        };
        dataList.push(one);
      }
      this.organizationNameList = JSON.parse(JSON.stringify(dataList));
    });
  },
  watch: {
  roleName: function () {
    // 监听查询输入框--实现查询筛选功能
    this.tableData = JSON.parse(JSON.stringify(this.subTableData));
    let input = this.roleName;
    let table = [];
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].roleName.indexOf(input) != -1) {
        table.push(this.tableData[i]);
      }
    }
    this.tableData = JSON.parse(JSON.stringify(table));
    this.totalCount = this.tableData.length;
    this.currentPage = 1;
  },
},

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      selecttRoleListByPage(true, this.currentPage, this.PageSize).then(
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
      //console.log(this.currentPage);
      // 改变页码时请求数据
      // let page = {
      //   page: this.currentPage,
      //   size: this.PageSize,
      // };
      selecttRoleListByPage(true, this.currentPage, this.PageSize).then(
        res => {
          //console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          // this.totalCount = this.tableData.length;
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      );
    },

    
    //请求所有数据
    async getData() {
      // await selectRoleListPage().then((res) => {
      //   this.tableData = JSON.parse(JSON.stringify(res.data.respBody.records));
      //   this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      //   this.totalCount = this.tableData.length;
      //   console.log(this.tableData);
      // });
      // await selecttRoleListByPage(true, this.currentPage, this.PageSize).then(
      //   res => {
      //     console.log(res);
      //     this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
      //     this.tableData = JSON.parse(JSON.stringify(this.allData));
      //     // 备份数据
      //     this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      //   }
      // );
      await selectRoleListPageNew()
        .then(res => {
          this.totalCount = res.data.respBody.length;
        })
        .then({});
      await selecttRoleListByPage(true, this.currentPage, this.PageSize).then(
        res => {
          console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      );
    },

    //取消新增数据
    cancelAddData() {
      this.addDialog = false;
      this.addForm = {
        roleName: "",
        roleDesc: "",
      };
    },

    //新增数据
    addData() {
      // 表单验证
     let isLegal = true;
     this.$refs["addFormRef"].validate(valid => {
        if (!valid) {
          this.$message({
            message: "请按照规范完善表单！",
            type: "warning",
            duration: 2000
          });
          isLegal = false;
        }
      });
      if (!isLegal) {
        return;
      }
      //封装数据
      let data = {
        // id: this.nextTodoId++,
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc ,
        // status: 1,
        // updateTime: new Date(),
        // updateUser: this.username,
      }
      console.log(data);
      createRole(data)
        .then(() => {
          this.$message({
            message: "添加成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
        })
        .then(() => {
          // 重新渲染表格
          this.getData().then(() => {
            this.cancelAddData();
          });
        });
    },
    //更改一条数据
    openUpdateDialog(id) {
      this.currentId = id;
      // 根据id找到index
      let index = this.tableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      this.updateForm = this.tableData[index];
      this.updateDialog = true;
    },
   //取消修改
    cancelUpdateData() {
      this.updateDialog = false;
      this.updateForm = {
        roleName: "",
        roleDesc: "",
      };
    },

    //更新一条数据
    updateData() {
      // 表单验证
     let isLegal = true;
     this.$refs["updateFormRef"].validate(valid => {
        if (!valid) {
          this.$message({
            message: "请按照规范完善表单！",
            type: "warning",
            duration: 2000
          });
          isLegal = false;
        }
      });
      if (!isLegal) {
        return;
      }
      // console.log(this.updateForm);
      let data = {
        id: this.currentId,
        roleName: this.updateForm.roleName,
        roleDesc: this.updateForm.roleDesc,
      };
      //更新数据
      updateRole(data).then(() => {
          this.$message({
            message: "更改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
          // 关闭对话框
          this.updateDialog = false;
          // 重置表单
          this.cancelUpdateData();
        })
        .then(() => {
        //重新请求数据
          this.getData().then(() => {
          // this.cancelUpdateData();
        });
      });
    },

    // 删除一条数据
    deleteOneData(id) {
      // console.log(id);
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        //删除数据
        console.log(id);
        deleteOneRole_get(id)
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
      });
    },

    //删除多条数据
    deleteData() {
      //封装数据
      let listData = [];
      for (const iter of this.multipleSelection) {
        listData.push(iter.id);
      }
      console.log(listData);
      //删除数据
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        deleteRoleById_get(listData).then(() => {
          // Message.success("成功")
          this.$message({
            message: "删除成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          })
          // Message({
          //   message: "删除成功！",
          //   type: "success",
          //   offset: 300,
          //   center: true,
          //   duration: 1000,
          // })
          // .then(() => {
            this.multipleSelection = [];
            // 重新渲染表格
            this.getData();
          // });
        });
      });
    },

    // handleSizeChange(val) {
    //   this.limit = val;
    //   this.search();
    // },
    // handleCurrentChange(val) {
    //   this.page = val;
    //   this.search();
    // },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
      //获取列表
      search: function() {
        let that = this;
        that.loading = true;
        let params={
          pageSize:this.limit,
          pageNo:this.page
        };
        selectRoleListPage(params)
          .then(function(result) {
            that.loading = false;
            if (result && result.code == 200) {
              that.total=result.respBody.total
              that.roleData = result.respBody.records;
            }
          })
          .catch(function(error) {
            that.loading = false;
            console.log(error);
          });
      },
      // showAddDialog: function() {
      //   let that = this;
      //   this.$nextTick(() => {
      //     if(that.$refs["addForm"]!=undefined)
      //     {
      //     that.$refs["addForm"].resetFields();
      //     }
      //   });
      //   this.addFormVisible = true;
      // },
      // showEditDialog: function(index, row) {
      //   let that = this;
      //   that.editForm = Object.assign({}, row);
      //   that.editForm.status = that.editForm.status + "";
      //   that.editForm.sex = that.editForm.sex + "";
      //   that.editFormVisible = true;
      // },
      setPagePower:function(index, row){
        let that = this;
        this.pageDialogVisible = true;
        this.pagePowerArray=[];
        this.selectId=row.id;
        let params = {roleid: row.id,pageNo:1,pageSize:100};
        // 获取所有关联
        getPageSourceList(params)
          .then(function(result) {
            console.log("body2", result);
            if (result.data.code === 200) {
              that.pageArray = result.data.respBody.records;
            } 
            else {
              that.$message.error({
                showClose: true,
                message: result.message,
                duration: 2000
              });
            }
          })
          .catch(function(error) {
            that.loading = false;
            console.log(error);
            that.$message.error({
              showClose: true,
              message: "请求出现异常",
              duration: 2000
            });
        });
        // 获取关联权限
        getPagesourceListByRoleId(params)
          .then(function(result) {
            console.log("body1", result);
            // that.loading = false;
            if (result.data.code === 200) {
              if (result.data.respBody != null && result.data.respBody.records.length > 0) {
                for (let i = 0; i < result.data.respBody.records.length; i++) {
                  //that.pageArray.push(result.respBody[i]);
                  that.pagePowerArray.push(result.data.respBody.records[i].id);
                }
              }
            } 
            else {
              that.$message.error({
                showClose: true,
                message: result.message,
                duration: 2000
              });
            }
          })
          .catch(function(error) {
            that.loading = false;
            console.log(error);
            that.$message.error({
              showClose: true,
              message: "请求出现异常",
              duration: 2000
            });
          });
      },

      powerSubmit:function(){
        let that=this;
        if (this.pagePowerArray.length < 1) {
          this.$message.error({
                    showClose: true,
                    message: "请至少选择一项",
                    duration: 2000
                  });
          return;
        }

       let ids= this.pagePowerArray.map(item => item).toString();
        let params={
          roleId:this.selectId+"",
          pSourceIdList:ids,
        };
        addPower(params).then(function (result) {
          that.menuloading = false;
          if (result.data.code === 200) {
            that.$message.success({
              showClose: true,
              message: "新增成功",
              duration: 2000
            });
            that.pageDialogVisible= false;
            that.handleSearch();
          } 
          else {
            that.$message.error({
              showClose: true,
              message: result.message,
              duration: 2000
            });
          }
        });
      },
      changeCheckBox: function(val) {
        this.multipleSelection = val;
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
  background: url("../../../static/img/icon27.png") no-repeat;
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
  border: 0.1vh solid #067EA5;
}
.el-table__row {
  background-color: transparent !important;
  border: 0.1vh solid #067EA5;
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
.el-col {
  border-radius: 4px;
}
</style>


