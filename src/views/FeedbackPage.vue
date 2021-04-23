<template>
  <div class="feedback">
    <!-- 列表区域 -->
    <el-table size="mini" ref="multipleTable" border style="width:100%" height="520px" :data="data">
      <el-table-column prop="username" label="用户名" align="center" width="120"></el-table-column>
      <el-table-column prop="opinion" label="用户意见">
        <template slot-scope="scope" >
          <div v-html="scope.row.opinion">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="feedback" label="管理员回复">
        <template slot-scope="scope" >
          <div v-html="scope.row.feedback">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="reply(scope.row.id)">回复</el-button>
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
        :total="feedback.length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog title="回复" :visible.sync="replyVisible" width="400px" center>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="replyData.feedback">
      </el-input>
      <el-button type="primary" size="mini" @click="saveReply" style="margin-top: 10px">回复</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {getAllFeedback, getByPrimaryKey, reply} from "../api";
import {mixin} from "../mixins";

export default {
  mixins: [mixin],
  data() {
    return {
      feedback: [],         //显示在表格中的数据
      select_word: '',      //筛选的关键词
      pageSize: 5,          //默认的每页记录数
      currentPage: 1,       //默认当前页码
      replyData: {
        id: '',
        feedback: ''
      },
      replyVisible: false,
    }
  },
  computed: {
    data() {
      return this.feedback.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getAllFeedback()
      .then(res => {
        this.feedback = res;
        this.getUserName();
        console.log(this.feedback);
      })
    },

    getUserName() {
      this.feedback.forEach(item => {
        getByPrimaryKey(item.userId)
        .then(res => {
          this.$set(item,'username',res.username);
        })
      })
    },

    reply(id) {
      this.replyVisible = true;
      this.replyData.id = id;
    },

    saveReply() {
      let params = new URLSearchParams();
      params.append('id',this.replyData.id);
      params.append('reply',this.replyData.feedback);
      params.append('adminId',localStorage.getItem('adminId'));
      reply(params)
      .then(res => {
        if (res.code === 1) {
          this.notify(res.msg,'success');
          this.getData();
        } else {
          this.notify(res.msg, 'error');
        }
      })
      .catch(err => {
        this.notify(err,'error');
      })
    },
    //获取并更改当前页
    handleCurrentChange(value) {
      this.currentPage = value;
    },
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
