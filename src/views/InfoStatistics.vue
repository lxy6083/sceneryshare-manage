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
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="12">
        <ve-line :data="latestWeekNew" :settings="latestWeekNewSettings" :extend="latestWeekNewExtend"></ve-line>
      </el-col>
      <el-col :span="12">
        <ve-line :data="latestWeekSum" :settings="latestWeekSumSettings" :extend="latestWeekSumExtend"></ve-line>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getAllScenery, getAllShare, getAllUser, getLatestWeekNew} from "../api";

export default {
  name: "InfoStatistics",
  created() {
    this.getSum();
  },
  data() {
    return {
      userNum: '',       //用户数
      sceneryNum: '',    //景点数
      shareNum: '',      //动态数
      latestWeekNewSettings: {
        stack: {
          '类别': ['用户数', '景点数', '动态数']
        }
      },
      latestWeekNew: {   //最近七天新增
        columns: ['日期', '用户数', '景点数', '动态数'],
        rows: [],
      },
      latestWeekNewExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        }
      },
      latestWeekSumSettings: {
        stack: {
          '类别': ['用户数', '景点数', '动态数']
        }
      },
      latestWeekSum: {   //最近七天总数变化
        columns: ['日期', '用户数', '景点数', '动态数'],
        rows: [],
      },
      latestWeekSumExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        }
      },
    }
  },
  methods: {
    //获取总数
    getSum() {
      this.getUserNum();
      this.getShareNum();
      this.getSceneryNum();
      this.getLatestWeekNew();
    },
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
    },
    //获取最近七天数据
    getLatestWeekNew() {
      getLatestWeekNew()
      .then(res => {
        for (let item of res) {
          this.latestWeekNew.rows.push({'日期': item.date, '用户数': item.user, '景点数': item.scenery, '动态数': item.share});
        }
        console.log(this.latestWeekNew);
        this.getLatestWeekSum();
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取最近七天总数
    getLatestWeekSum() {
      let rows = this.latestWeekNew.rows;
      let currentUserSum = this.userNum;
      let currentScenerySum = this.sceneryNum;
      let currentShareSum = this.shareNum;
      console.log(this.userNum,this.sceneryNum,this.shareNum);
      for (let i = rows.length - 1; i >= 0; i--) {
        console.log(currentUserSum,currentScenerySum,currentShareSum)
        console.log(rows[i]);
        if ( i - 1 < 0 || i === rows.length - 1) {
          this.latestWeekSum.rows.unshift({'日期': rows[i]['日期'],'用户数': currentUserSum, '景点数': currentScenerySum, '动态数': currentShareSum});
        } else {
          this.latestWeekSum.rows.unshift({'日期': rows[i]['日期'],'用户数': currentUserSum - rows[i+1]['用户数'], '景点数': currentScenerySum - rows[i+1]['景点数'], '动态数': currentShareSum - rows[i+1]['动态数']});
          currentUserSum -= rows[i]['用户数'];
          currentScenerySum -= rows[i]['景点数'];
          currentShareSum -= rows[i]['动态数'];
        }
      }
      console.log(this.latestWeekSum);
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
