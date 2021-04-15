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
          <div class="chart-item">
            <h3>男女比例</h3>
            <ve-pie :data="sexRatio"></ve-pie>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-item">
            <h3>用户所在省份排行(前7)</h3>
            <ve-histogram
              :data="userProvinceSort"
              :extend="userProvinceSortExtend"
            />
          </div>
        </el-col>
      </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px">
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

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="12">
        <div class="chart-item">
          <h3>发送动态最多的用户排行(前7)</h3>
          <ve-histogram :data="shareUserSort" :extend="shareUserSortExtend"></ve-histogram>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-item">
          <h3>景点在动态中出现次数排行(前7)</h3>
          <ve-histogram :data="sceneryShareSort" :extend="sceneryShareSortExtend"></ve-histogram>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getAllScenery, getAllShare, getAllUser, getByPrimaryKey, getLatestWeekNew, getSceneryById} from "../api";

export default {
  name: "InfoStatistics",

  data() {
    return {
      userNum: '',      //用户数
      sceneryNum: '',   //景点数
      shareNum: '',      //动态数
      userOptions: [],   //用户表单的选项
      sexRatio: {        //男女比例
        columns: ['sex', 'num'],
        rows: [],
      },
      //所在区域排行（前7）
      userProvinceSort: {
        columns: ['省份', '用户数'],
        rows: [],
      },
      userProvinceSortExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        }
      },
      //发送动态最多的用户排行(前7)
      shareUserSort: {
        columns: ['用户名', '动态数'],
        rows: [],
      },
      shareUserSortExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        }
      },
      //景点在动态中出现次数排行
      sceneryShareSort: {
        columns: ['景点名', '出现次数'],
        rows: [],
      },
      sceneryShareSortExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            //换行显示
            formatter: function (value) {
              let result = ""; //拼接加\n返回的类目项
              let maxLength = 6; //每项显示文字个数
              let valLength = value.length; //X轴类目项的文字个数
              let rowNumber = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowNumber > 1) {
                //如果文字大于3,
                for (let i = 0; i < rowNumber; i++) {
                  let temp = ""; //每次截取的字符串
                  let start = i * maxLength; //开始截取的位置
                  let end = start + maxLength; //结束截取的位置
                  temp = value.substring(start, end) + "\n";
                  result += temp; //拼接生成最终的字符串
                }
                return result
              } else {
                return value
              }
            }
          }
        }
      },
      //最近七天新增数据变化
      latestWeekNewSettings: {
        // stack: {
        //   '类别': ['用户数', '景点数', '动态数']
        // }
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
      //最近七天总数据变化
      latestWeekSumSettings: {
        // stack: {
        //   '类别': ['用户数', '景点数', '动态数']
        // }
      },
      latestWeekSum: {   //最近七天总数变化
        columns: ['日期', '用户数', '景点数', '动态数'],
        rows: [],
      },
      latestWeekSumExtend: {
        yAxis: {
          type: 'value',
          minInterval: 1
        },

      }
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
        this.userProvinceSort.rows = [];
        let male = 0;
        let female = 0;
        let provinceSort = {};
        let provinceSortList = [];
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
        for (let prop in provinceSort) {
          provinceSortList.push({'省份': prop, '用户数': provinceSort[prop]});
        }
        provinceSortList = provinceSortList.sort((a, b) => {
          return b['用户数'] - a['用户数'];
        })
        if (provinceSortList.length > 7) {
          this.userProvinceSort.rows = provinceSortList.splice(0,7);
        } else {
          this.userProvinceSort.rows = provinceSortList;
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取景点相关信息
    getSceneryNum() {
      getAllScenery()
      .then(res => {
        this.sceneryNum = res.length;
      })
    },
    //获取动态相关信息
    getShareNum() {
      getAllShare()
      .then(res => {
        this.shareNum = res.length;
        this.shareUserSort.rows = [];
        this.sceneryShareSort.rows = [];
        let shareUser = {};
        let shareUserList = [];
        let sceneryShare = {};
        let sceneryShareList = [];
        for (let item of res) {
          let userId = item.userId;
          let sceneryId = item.sceneryId;
          if (shareUser[userId]) {
            shareUser[userId]++;
          } else {
            shareUser[userId] = 1;
          }
          if (sceneryShare[sceneryId]) {
            sceneryShare[sceneryId]++;
          } else {
            sceneryShare[sceneryId] = 1;
          }
        }
        for (let prop in shareUser) {
          getByPrimaryKey(prop)
            .then(result => {
              shareUserList.push({'用户名': result.username, '动态数': shareUser[prop]});
            })
          .catch(error => {
            console.log(error);
          })
        }
        for (let prop in sceneryShare) {
          getSceneryById(prop)
          .then(rst => {
            sceneryShareList.push({'景点名': rst.name, '出现次数': sceneryShare[prop]});
          })
          .catch(error => {
            console.log(error);
          })
        }

        setTimeout(() => {
          shareUserList = shareUserList.sort((a,b) => {
            return b['动态数'] - a['动态数'];
          })
          sceneryShareList = sceneryShareList.sort((a, b) => {
            return b['出现次数'] - a['出现次数'];
          })
          if (shareUserList.length > 7) {
            this.shareUserSort.rows = shareUserList.splice(0,7);
          } else {
            this.shareUserSort.rows = shareUserList.sort((a,b) => {
              return b['动态数'] - a['动态数'];
            })
          }
          if (sceneryShareList.length > 7) {
            this.sceneryShareSort.rows = sceneryShareList.splice(0,7);
          } else {
            this.sceneryShareSort.rows = sceneryShareList;
          }
        },100)


      })
    },
    //获取最近七天数据
    getLatestWeekNew() {
      getLatestWeekNew()
      .then(res => {
        this.latestWeekNew.rows = [];
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
    },
    // quickSort(arr) {
    //   if (arr.length <= 1) { return arr; }
    //   let pivotIndex = Math.floor(arr.length / 2);   //基准位置（理论上可任意选取）
    //   let pivot = arr.splice(pivotIndex, 1)[0];  //基准数
    //   let left = [];
    //   let right = [];
    //   for (let i = 0; i < arr.length; i++){
    //     if (arr[i] < pivot) {
    //       left.push(arr[i]);
    //     } else {
    //       right.push(arr[i]);
    //     }
    //   }
    //   return this.quickSort(left).concat([pivot], this.quickSort(right));  //链接左数组、基准数构成的数组、右数组
    // },
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

  .chart-item {
    background-color: #fff;
    padding: 10px;
  }
</style>
