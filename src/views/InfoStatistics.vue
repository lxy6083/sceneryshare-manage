<template>
  <div class="infoStatistics">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8">
        <el-card>
          <div class="content">
            <div class="content-center">
              <div class="number">
                {{ userNum }}
              </div>
              <div class="title">
                用户总数
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="content">
            <div class="content-center">
              <div class="number">
                {{ sceneryNum }}
              </div>
              <div class="title">
                景点总数
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="content">
            <div class="content-center">
              <div class="number">
                {{ shareNum }}
              </div>
              <div class="title">
                动态总数
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {getAllScenery, getAllShare, getAllUser} from "../api";

export default {
  name: "InfoStatistics",
  created() {
    this.getUserNum();
    this.getSceneryNum();
    this.getShareNum();
  },
  data() {
    return {
      userNum: '',      //用户数
      sceneryNum: '',   //景点数
      shareNum: ''      //动态数
    }
  },
  methods: {
    //获取用户总数
    getUserNum() {
      getAllUser()
      .then(res => {
        this.userNum = res.length;
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取景点总数
    getSceneryNum() {
      getAllScenery()
      .then(res => {
        this.sceneryNum = res.length;
      })
    },
    //获取动态总数
    getShareNum() {
      getAllShare()
      .then(res => {
        this.shareNum = res.length;
      })
    }
  }
}
</script>

<style scoped>
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 50px;
    font-size: 14px;
    color: darkgray;
  }

  .content .number {
    font-size: 30px;
    font-weight: bold;
  }

</style>
