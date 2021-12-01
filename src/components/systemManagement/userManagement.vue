<template>
  <div>
    <!-- 面包屑 -->
    <div id="title">
      <div class="crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <img src="../../../static/img/icon26.png" alt="箭头" />
    </div>
    <!-- 筛选框 -->
    <div id="select">
      <span>用户名：</span>
      <input
        type="text"
        class="input-style"
        placeholder="请输入用户名"
        v-model="userName"
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
          prop="username"
          align="center"
          label="用户名"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="联系方式"
        ></el-table-column>
        <el-table-column
          prop="organization"
          align="center"
          label="单位名称"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 0">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
        ></el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">  
            <el-button type="text" 
            icon="el-icon-edit" 
            @click="openUpdateDialog(scope.row.id)"
            style="color:#FFFF"
            >更改</el-button>
            <el-button type="text" 
            icon="el-icon-delete" 
            class="red" 
            @click="deleteUserById(scope.row.id)"
            style="color:#FF0000"
            >删除</el-button>
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
      width="40%"
      title="请填写信息"
      label-width="80px"
    >
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="用户名" prop="username">
            <el-input  style="width:400px" v-model="addForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="密码" prop="password" label-position="Right">
            <el-input style="width:400px" v-model="addForm.password" show-password></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="12" :offset="1">
          <el-form-item label="单位名称" prop="organization">
            <el-select style="width:400px" v-model="addForm.organization" placeholder="请选择">
              <el-option
                v-for="item in organizationNameList"
                :key="item.organizationId"
                :label="item.organization"
                :value="item.organizationId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="角色名称" prop="roleName">
            <el-select style="width:400px" v-model="addForm.roleId" placeholder="请选择">
              <el-option
                v-for="item in roleNameList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="联系电话" prop="mobile">
            <el-input style="width:400px" v-model.number="addForm.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="状态" prop="status">
            <el-radio v-model="addForm.status" label="1">正常</el-radio>
            <el-radio v-model="addForm.status" label="0">禁用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item prop="remark" label="备注">
            <el-input style="width:400px" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item>
            <el-button type="primary" @click="addData">确认提交</el-button>
            <el-button @click="cancelAddData">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>

    <!-- 修改表单 -->
    <el-dialog
      :visible.sync="updateDialog"
      append-to-body
      width="40%"
      title="请填写信息"
      label-width="80px"
    >
      <el-form
        ref="updateFormRef"
        :rules="updateFormRules"
        :model="updateForm"
        :inline="true"
      >
      <el-row :gutter="25">
        <el-col :span="12" :offset="1">
          <el-form-item label="用户名" prop="username">
              <el-input style="width:400px" v-model="updateForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="密码" prop="password">
              <el-input style="width:400px" v-model="updateForm.password" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="2">
          <el-button type="primary" @click="resetpassword">重置密码</el-button>
        </el-col>
        <el-col :span="12" :offset="1">  
          <el-form-item label="单位名称" prop="organization">
            <el-select style="width:400px" v-model="updateForm.organization" placeholder="请选择">
                <el-option
                v-for="item in organizationNameList"
                :key="item.organizationId"
                :label="item.organization"
                :value="item.organizationId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="角色名称" prop="roleName">
            <el-select style="width:400px" v-model="updateForm.roleId" placeholder="请选择">
            <el-option
                v-for="item in roleNameList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="联系电话" prop="mobile">
            <el-input style="width:400px" v-model.number="updateForm.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="状态" prop="status">
            <el-radio v-model="updateForm.status" label="1">正常</el-radio>
            <el-radio v-model="updateForm.status" label="0">禁用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item prop="remark" label="备注">
            <el-input style="width:400px" v-model="updateForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item>
            <el-button type="primary" @click="updateData">确认修改</el-button>
            <el-button @click="cancelUpdateData">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectUserByPage,
  selectOrgListByPage,
  deleteUserById,
  createUser,
  updateUser,
  deleteMUserById_get,
  deleteUserById_get,
  selectRoleListPage,
  selectAllUser,
  selectUserByPageNew,
} from "../../assets/axios/index";
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

      //监听用户名称
      userName: "",
      //点击的当前id
      currentId: 0,

      //增加数据的id
      nextTodoId: 3,

      //渲染组织名称选择器
      organizationNameList: [],
      roleNameList:[],

            //获取组织信息
      organizationForm: {
        organizationName:"",
      },

      //新增表单信息的对话框
      addDialog: false,
      // 表单绑定值
      addForm: {
        username: "",
        password: "",
        organization: "",
        // organizationName:"",
        organizationId:"",
        roleName: "",
        roleId:"",
        mobile: "",
        status: "1",
        remark: "",
      },
      // 表单验证规则
      addFormRules: {
        username: [{ required: true, message: "不能为空!", trigger: "blur" }],
        password: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },
      //新增表单信息的对话框
      updateDialog: false,
      // 表单绑定值
      updateForm: {
        username: "",
        password: "",
        organization: "",
        roleName: "",
        roleId:"",
        mobile: "",
        status: "1",
        remark: "",
      },
      // 表单验证规则
      updateFormRules: {
        username: [{ required: true, message: "不能为空!", trigger: "blur" }],
        password: [{ required: true, message: "不能为空!", trigger: "blur" }],
      },
      
      date:new Date()


    };



   
  },

  mounted () {
    var _this = this; //声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function() {
        _this.date = new Date();//修改数据date
    }, 1000);
  },
  beforeDestroy () {
    if(this.timer) {
        clearInterval(this.timer);//在vue实例销毁钱，清除我们的定时器
    }
  },

  created() {
    //请求数据
    this.getData();
    this.getOrData();
    this.getRoleData();
  },
  watch: {
    userName: function () {
      // 监听查询输入框--实现查询筛选功能
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let input = this.userName;
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].username.indexOf(input) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = JSON.parse(JSON.stringify(table));
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
  },

  methods: {
     //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
    dateFormat(time) {
      var date=new Date(time);
      var year=date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
        * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        * */
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },

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
      let page = {
        page: this.currentPage,
        size: this.PageSize,
      };
      selectAllUser(true, this.currentPage, this.PageSize).then(
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
      let page = {
        page: this.currentPage,
        size: this.PageSize,
      };
      selectAllUser(true, this.currentPage, this.PageSize).then(
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
      // await selectUserByPage().then((res) => {
      //   this.tableData = JSON.parse(JSON.stringify(res.data.respBody.records));
      //   this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      //   this.totalCount = this.tableData.length;
      //   console.log(this.tableData);
      // });
      await selectUserByPageNew()
        .then(res => {
          this.totalCount = res.data.respBody.length;
        })
        .then({});
      await selectAllUser(true, this.currentPage, this.PageSize).then(
        res => {
          console.log(res);
          this.allData = JSON.parse(JSON.stringify(res.data.respBody.records));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          // 备份数据
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      );
    },


        //请求组织所有数据
    async getOrData() {
      await selectOrgListByPage().then((res) => {
      let dataList = [];
      for (let i = 0; i < res.data.respBody.records.length; i++) {
        let one = {
          organizationId: res.data.respBody.records[i].id,
          organization: res.data.respBody.records[i].organizationName,
        };
        dataList.push(one);
      }
      this.organizationNameList = JSON.parse(JSON.stringify(dataList));
    });
    },
    //请求角色名称
    async getRoleData() {
      await selectRoleListPage().then((res) => {
      let dataList = [];
      for (let i = 0; i < res.data.respBody.records.length; i++) {
        let one = {
          roleId: res.data.respBody.records[i].id,
          roleName: res.data.respBody.records[i].roleName,
        };
        dataList.push(one);
      }
      this.roleNameList = JSON.parse(JSON.stringify(dataList));
    });
    },

    //取消新增数据
    cancelAddData() {
      this.addDialog = false;
      this.addForm = {
        username: "",
        password: "",
        organization: "",
        roleName: "",
        mobile: "",
        status: "1",
        remark:"",
      };
    },
    // 新增数据
    addData() {
      //封装数据
      let data = {
        createTime:  this.dateFormat(this.date),
        updateTime:  this.dateFormat(this.date),
        // updateTime: new Date(),
        // createTime: new Date(),
        updateUser: this.username,
        createUser: this.username,
        mobile: this.addForm.mobile,
        id: this.nextTodoId++,
        organization: this.addForm.organization,
        remark: this.addForm.remark,
        roleName: this.addForm.roleName,
        password: this.addForm.password,
        username: this.addForm.username,
        status: 1,
      };
      console.log(data)
      createUser(data)
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

    //取消更新数据
    cancelUpdateData() {
      this.updateDialog = false;
      this.updateForm = {
        username: "",
        password: "",
        organization: "",
        roleName: "",
        mobile: "",
        status: "1",
        remark:"",
      };
    },
    //更新数据
    updateData() {
      let data = {
        id: this.currentId,
        username: this.updateForm.username,
        password: this.updateForm.password,
        organization: this.updateForm.organization,
        roleName: this.updateForm.roleName,
        roleId:this.updateForm.roleId,
        mobile: this.updateForm.mobile,
        status: this.updateForm.status,
        remark: this.updateForm.remark,
        createTime: this.dateFormat(this.date),
        createUser: this.username,
        updateTime: this.dateFormat(this.date),
        updateUser: this.username,
      };
      //更新数据
      updateUser(data).then(() => {
          this.$message({
            message: "更改成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          });
        })
      .then(() => {
        //重新请求数据
        this.getData().then(() => {
          this.cancelUpdateData();
        });
      });
    },


    //删除一条数据
    // 删除一条数据
    deleteUserById(id) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        //删除数据
        deleteUserById_get(id)
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
        deleteMUserById_get(listData).then(() => {
          this.$message({
            message: "删除成功！",
            type: "success",
            offset: 300,
            center: true,
            duration: 1000,
          })
            this.multipleSelection = [];
            // 重新渲染表格
            this.getData();
        });
      });
    },

    resetpassword(){
      this.updateForm.password = "123456";
    }

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
/* .el-form-item__label {
        text-align: justify;
    } */
</style>


