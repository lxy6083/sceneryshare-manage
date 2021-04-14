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
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <div class="chart-item">
            <h3>男女比例</h3>
            <ve-pie :data="sexRatio"></ve-pie>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-item">
            <h3>用户所在省份排行</h3>
            <ve-pie :data="sexRatio"></ve-pie>
          </div>
        </el-col>
      </el-row>
      <el-col :span="12">
        <div class="chart-item">
          <h3>最近七天新增数据变化</h3>
          <ve-line :data="latestWeekNew" :settings="latestWeekNewSettings" :extend="latestWeekNewExtend"></ve-line>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-item">
          <h3>最近七天总数据变化</h3>
          <ve-line :data="latestWeekSum" :settings="latestWeekSumSettings" :extend="latestWeekSumExtend"></ve-line>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getAllScenery, getAllShare, getAllUser, getLatestWeekNew} from "../api";

export default {
  name: "InfoStatistics",

  data() {
    return {
      userNum: '',      //用户数
      sceneryNum: '',   //景点数
      shareNum: '',      //动态数
      userOptions: [],   //用户表单的选项
      sexRatio: {        //男女比例
        columns: ['sex','num'],
        rows: [],
      },
      //所在区域排行
      //发送动态最多的用户排行
      //景点在动态中出现次数排行
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
  created() {
    this.getSum();
    this.getLatestWeekNew();
    this.getLatestWeekSum();

  },
  methods: {
    //获取总数
    getSum() {
      this.getUserNum();
      this.getShareNum();
      this.getSceneryNum();
    },
    //获取用户相关数据
    getUserNum() {
      getAllUser()
      .then(res => {
        this.userNum = res.length;
        this.sexRatio.rows = [];
        let male = 0;
        let female = 0;
        let provinceSort = {};
        for (let item of res) {
          if (item.sex === 0) {
            female++;
          } else {
            male++;
          }
          let province = item.province;
          if (provinceSort[province]) {
            provinceSort[province]++;
          } else {
            provinceSort[province] = 1;
          }
        }
        this.sexRatio.rows.push({'sex': '男', 'num': male});
        this.sexRatio.rows.push({'sex': '女', 'num': female});
        console.log(provinceSort)
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
        this.getLatestWeekSum();
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取最近七天总数
    getLatestWeekSum() {
      this.getSum();
      let rows = this.latestWeekNew.rows;
      let currentUserSum = this.userNum;
      let currentScenerySum = this.sceneryNum;
      let currentShareSum = this.shareNum;
      for (let i = rows.length - 1; i >= 0; i--) {
        if ( i - 1 < 0 || i === rows.length - 1) {
          this.latestWeekSum.rows.unshift({'日期': rows[i]['日期'],'用户数': currentUserSum, '景点数': currentScenerySum, '动态数': currentShareSum});
        } else {
          this.latestWeekSum.rows.unshift({'日期': rows[i]['日期'],'用户数': currentUserSum - rows[i+1]['用户数'], '景点数': currentScenerySum - rows[i+1]['景点数'], '动态数': currentShareSum - rows[i+1]['动态数']});
          currentUserSum -= rows[i]['用户数'];
          currentScenerySum -= rows[i]['景点数'];
          currentShareSum -= rows[i]['动态数'];
        }
      }
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

  .chart-item {
    position: relative;

  }

  .chart-item h3 {
    text-align: center;
  }

</style>
