<template>
  <div class="scenery-management">
    <!-- 操作区域 -->
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关景点" class="handle-input"></el-input>
      </div>
    </div>
    <!-- 列表区域 -->
    <el-table size="mini" ref="multipleTable" border style="width:100%" height="520px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="景点名称" align="center"></el-table-column>
      <el-table-column prop="type" label="景点类别" align="center" width="100">
        <template slot-scope="scope">
          {{changeType(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column prop="coordinate" label="经纬度坐标" align="center" width="300"></el-table-column>
      <el-table-column prop="province" label="省" width="120" align="center"></el-table-column>
      <el-table-column prop="city" label="市" align="center" width="120"></el-table-column>
      <el-table-column prop="district" label="区" width="120" align="center"></el-table-column>
      <el-table-column prop="parentId" label="父级景点" align="center">
        <template slot-scope="scope">
          {{getParentScenery(scope.row.parentId)}}
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="审核" align="center" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.flag"
            :active-value="1"
            :inactive-value="0"
            active-text="可用"
            inactive-text="不可用"
            @change="toggleFlag(scope.row.flag, scope.row.id)"
          >
          </el-switch>
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
    <!-- 删除弹框区域 -->
    <el-dialog title="删除景点" :visible.sync="delVisible" width="400px" center>
      <div align="center">删除操作不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="delRow()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹框区域 -->
    <el-dialog title="修改景区信息" :visible.sync="editDialogVisible" width="400px" center>
      <el-tabs v-model="activeName">
        <el-tab-pane label="类型纠错" name="first">
          <el-select v-model="editData.type" placeholder="请选择">
            <el-option
              v-for="item in sceneryType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="updateType" style="margin-top: 10px">保存修改</el-button>
        </el-tab-pane>
        <el-tab-pane label="景点合并" name="second">
          <el-select v-model="editData.parentId" placeholder="请选择">
            <el-option
              v-for="item in firstSceneryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="updateParentId" style="margin-top: 10px">保存修改</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {deleteScenery, getAllScenery, getFirstScenery, toggleFlag, updateParentId, updateType} from "../api";
import {mixin} from "../mixins";
import {sceneryType} from "../assets/js/options";

export default {
  name: "SceneryManagement",
  mixins: [mixin],
  data() {
    return {
      tableData: [],          //显示在表格中的数据
      tempData: [],           //获取的所有信息
      select_word: '',        //筛选的关键词
      pageSize: 5,            //默认的每页记录数
      currentPage: 1,         //默认当前页码
      index: '',              //当前选择项
      multipleSelection: [],  //选择批量删除的项
      delVisible: false,      //删除弹框是否可见
      activeName: 'first',    //修改信息切换
      editDialogVisible: false, //修改弹框是否可见
      editData: {             //需要修改的信息
        id: '',               //景点id
        type: '',             //属性/类型
        parentId: ''          //父景点id
      },
      firstSceneryList: [],   //一级景点列表
      sceneryType: [],        //景点类型
    }
  },
  computed: {
    data() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  created() {
    this.getData();
    this.getFirstScenery();
    this.sceneryType = sceneryType;
  },
  watch: {
    select_word: function() {
      console.log(this.tempData);
      if (this.select_word === '') {
        this.tableData = [];
        this.tableData.push(...this.tempData);
      } else {
        this.tableData = [];
        this.tempData.forEach(item => {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item);
          }
        })
      }
    }
  },
  methods: {
    getData() {
      this.tableData = [];
      this.tempData = [];
      getAllScenery()
        .then(res => {
          this.tableData = res;
          this.tempData = res;
          this.currentPage = 1;
        })
    },
    //获取并更改当前页
    handleCurrentChange(value) {
      this.currentPage = value;
    },
    //删除景点
    delRow() {
      deleteScenery(this.index)
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
    //弹出删除窗口
    handleDelete(id) {
      this.index = id;
      this.delVisible = true;
    },

    //切换景点是否可用
    toggleFlag(flag, id) {
      toggleFlag(flag,id)
        .then(res => {
          if (res === true) {
            this.notify('切换成功','success');
            this.getData();
          } else {
            this.notify('切换失败','error');
            this.getData();
          }
        })
      .catch(err => {
        this.notify(err,'error');
        this.getData();
      })
    },

    //修改景点信息
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editData = {
        id: row.id,
        type: row.type,
        parentId: row.parentId
      }
    },

    //获取一级景点列表
    getFirstScenery() {
      getFirstScenery()
        .then(res => {
          this.firstSceneryList = res;
          this.firstSceneryList.unshift({id: null, name: '无'});
        })
        .catch(err => {
          console.log(err);
        })
    },

    //修改景点类型
    updateType() {
      updateType(this.editData.type,this.editData.id)
      .then(res => {
        if (res === true) {
          this.notify('景点类型修改成功', 'success');
          this.getData();
        } else {
          this.notify('景点类型修改失败', 'error');
          this.getData();
        }
      })
      .catch(err => {
        this.notify(err,'error');
      })
    },

    //修改父景点id
    updateParentId() {
      updateParentId(this.editData.parentId,this.editData.id)
      .then(res => {
        if (res === true) {
          this.notify('父景点修改成功', 'success');
          this.getData();
        } else {
          this.notify('父景点修改失败', 'error');
          this.getData();
        }
      })
        .catch(err => {
          this.notify(err,'error');
        })
    }
  },

}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
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
