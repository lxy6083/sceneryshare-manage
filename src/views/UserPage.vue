<template>
  <div class="table">
    <!-- 操作区域 -->
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关用户" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加用户</el-button>
      </div>
    </div>
    <!-- 列表区域 -->
    <el-table size="mini" ref="multipleTable" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="用户头像" width="110" align="center">
        <template slot-scope="scope">
          <div class="user-avatar">
            <img :src="getUrl(scope.row.avatar)" style="width:100%"/>
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
            <el-button size="mini">更新头像</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="120"></el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">
          {{changeSex(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{formatBirth(scope.row.birthday)}}
        </template>
      </el-table-column>
      <el-table-column label="所在地" align="center">
        <template slot-scope="scope">
          {{getLocation(scope.row.province, scope.row.city, scope.row.district)}}
        </template>
      </el-table-column>
      <el-table-column label="动态管理" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="sceneryEdit(scope.row.id,scope.row.username)">景区动态</el-button>
          <el-button size="mini" type="primary" @click="casualEdit(scope.row.id,scope.row.username)">随拍动态</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination 
        background
        layout="total,prev,pager,next" 
        :current-page="currentPage" 
        :page-size="pageSize" 
        :total="tableData.length" 
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 注册弹框区域 -->
    <el-dialog title="添加用户" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="registerRules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="registerForm.username" placeholder="1-11位字符"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input type="password" v-model="registerForm.password" placeholder="以字母开头，长度在6~16之间，只能包含字母、数字和英文字符"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号" size="mini">
          <el-input v-model="registerForm.mobile" placeholder="11位以1开头的手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="birthday" label="生日" size="mini">
          <el-date-picker v-model="registerForm.birthday" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="所在地" size="mini" class="pro_ct_dis">
          <v-distpicker :province="registerForm.province" :city="registerForm.city" :area="registerForm.district" @province="onChangeProvince" @city="onChangeCity" @area="onChangeDistrict"></v-distpicker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="submitForm('registerForm')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹框区域 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px" :rules="editRules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="editForm.username" placeholder="1-11位字符"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别" size="mini">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号" size="mini">
          <el-input v-model="editForm.mobile" placeholder="11位以1开头的手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="editForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="生日" size="mini">
          <el-date-picker v-model="editForm.birthday" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="所在地" size="mini" class="pro_ct_dis">
          <v-distpicker :province="editForm.province" :city="editForm.city" :area="editForm.district" @province="onEditChangeProvince" @city="onEditChangeCity" @area="onEditChangeDistrict"></v-distpicker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="submitForm('editForm')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框区域 -->
    <el-dialog title="删除用户" :visible.sync="delVisible" width="400px" center>
      <div align="center">删除操作不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="delRow()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteUser, getAllUser, setUser, updateUser} from '../api/index';
import {mixin} from '../mixins/index';
import VDistpicker from 'v-distpicker';
export default {
  mixins: [mixin],
  data () {
    var checkPassword = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('密码不能为空'));
      } else {
        if (value.length < 6 || value.length > 16) {
          callback(new Error('密码长度在6-16位之间'));
        }
        var reg = /^[a-zA-Z][a-zA-Z0-9_.@~!?]{5,15}$/;
				if (!reg.test(value)) {
					callback(new Error('请输入有效的密码'));
        }
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        var reg = /^1[0-9]{10}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        }
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      } else {
        var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        }
        callback();
      }
    };
    return {
      centerDialogVisible: false, //添加用户弹框是否显示
      editDialogVisible: false, //修改信息弹框是否显示
      delVisible: false,
      registerForm: { //添加框
        username: '',
        password: '',
        sex: 0,
        mobile: '',
        email: '',
        birthday: '',
        province: '',
        city: '',
        district: '',
      },
      editForm: { //修改框
        id: '',
        username: '',
        sex: 0,
        mobile: '',
        email: '',
        birthday: '',
        province: '',
        city: '',
        district: '',
      },
      //添加校验规则
      registerRules: {
        username: [{ min: 1, max: 11, message: '字符长度在6-16之间', trigger: 'blur'},
        {requiered: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{validator: checkPassword, trigger: 'blur'}],
        mobile: [{validator: checkMobile, trigger: 'blur'}],
        email: [{validator: checkEmail, trigger: 'blur'}]
      },
      //修改校验规则
      editRules: {
        username: [{ min: 1, max: 11, message: '字符长度在6-16之间', trigger: 'blur'},
        {requiered: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{validator: checkPassword, trigger: 'blur'}],
        mobile: [{validator: checkMobile, trigger: 'blur'}],
        email: [{validator: checkEmail, trigger: 'blur'}]
      },
      tableData: [],
      tempDate: [],
      select_word: '',
      pageSize: 5,  //默认的每页记录数
      currentPage: 1, //默认当前页码
      index: '',  //当前选择项
      multipleSelection: [],  //选择批量删除的项
    }
  },
  computed: {
    data() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  components: {
    VDistpicker
  },
  created() {
    this.getData();
  },
  watch: {
    select_word: function() {
      if (this.select_word === '') {
        this.tableData = this.tempDate;
      } else {
        this.tableData = [];
        for (let item of this.tempDate) {
          if (item.username.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
    }
  },
  methods: {
    //转向随拍动态管理页面
    casualEdit(id,name) {
      this.$router.push({
        path: '/casual',
        query: {
          id,
          name
        }
      })
    },
    //转向风景动态管理页面
    sceneryEdit(id,name) {
      this.$router.push({
        path: '/scenery',
        query: {
          id,
          name
        }
      })
    },
    //删除用户
    delRow() {
      deleteUser(this.index)
      .then(res => {
        if (res == 1) {
          this.notify('删除成功', 'success');
          this.getData();
        } else {
          this.notify('删除失败', 'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
      this.delVisible = false;
    },
    //处理编辑操作
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editForm = {
        id: row.id,
        username: row.username,
        sex: row.sex,
        mobile: row.mobile,
        email: row.email,
        birthday: row.birthday,
        province: row.province,
        city: row.city,
        district: row.district,
      }
    },
    //修改保存
    editSave() {
      let d = new Date(this.editForm.birthday);
      let dateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      let params = new URLSearchParams();
      params.append('id',this.editForm.id);
      params.append('username',this.editForm.username);
      params.append('sex',this.editForm.sex);
      params.append('mobile',this.editForm.mobile);
      params.append('email',this.editForm.email);
      params.append('birthday',dateTime);
      params.append('province',this.editForm.province);
      params.append('city',this.editForm.city);
      params.append('district',this.editForm.district);
      updateUser(params)
      .then(res => {
        if (res.code == 1) {
          this.notify(res.msg, 'success');
          this.getData();
        } else {
          this.notify(res.msg, 'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
      this.editDialogVisible = false;
    },
    //获取并更改当前页
    handleCurrentChange(value) {
      this.currentPage = value;
    },
    //查询用户
    getData() {
      this.tempDate = [];
      this.tableData = [];
      getAllUser().then(res => {
        this.tableData = res;
        this.tempDate = res;
        this.currentPage = 1;
      })
    },
    //添加用户
    addUser() {
      let d = this.registerForm.birthday;
      let dateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      let params = new URLSearchParams();
      params.append('username',this.registerForm.username);
      params.append('password',this.registerForm.password);
      params.append('sex',this.registerForm.sex);
      params.append('mobile',this.registerForm.mobile);
      params.append('email',this.registerForm.email);
      params.append('birthday',dateTime);
      params.append('province',this.registerForm.province);
      params.append('city',this.registerForm.city);
      params.append('district',this.registerForm.district);
      params.append('avatar','/avatarImages/defaultAvatar.jpg');
      setUser(params)
      .then(res => {
        if (res.code == 1) {
          this.notify(res.msg, 'success');
          this.getData();
        } else {
          this.notify(res.msg, 'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
      this.centerDialogVisible = false;
    },
    onChangeProvince(data) {
      this.registerForm.province = data.value;
    },
    onChangeCity(data) {
      this.registerForm.city = data.value;
    },
    onChangeDistrict(data) {
      this.registerForm.district = data.value;
    },
    onEditChangeProvince(data) {
      this.editForm.province = data.value;
    },
    onEditChangeCity(data) {
      this.editForm.city = data.value;
    },
    onEditChangeDistrict(data) {
      this.editForm.district = data.value;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (formName === 'registerForm') {
          if (valid && this.registerForm.district !== '区') {
            this.addUser();
          } else if(this.registerForm.district === '区') {
            this.notify('请选择所在地区','error');
          }
        } else if (formName === 'editForm') {
          if (valid && this.editForm.district !== '区') {
            this.editSave();
          } else if(this.editForm.district === '区') {
            this.notify('请选择所在地区','error');
          }
        }
      });
    },
    //更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/user/updateUserAvatar?id=${id}`;
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .user-avatar {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .user-avatar img {
    height: 100%;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
    margin: 0px 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }
</style>