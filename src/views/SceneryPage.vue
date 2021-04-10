<template>
  <div class="table">
    <!-- 操作区域 -->
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选用户" class="handle-input"></el-input>
        <el-select
          v-model="sort.sortName"
          placeholder="请选择排序字段"
          class="handle-select"
          size="mini"
          @change="handleSort">
          <el-option
            v-for="item in sortNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select
          v-model="sort.type"
          placeholder="请选择排序方式"
          class="handle-select"
          size="mini"
          @change="handleSort">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- 列表区域 -->
    <el-table size="mini" ref="multipleTable" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="100"></el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="120"></el-table-column>
      <el-table-column prop="content" label="文字内容" align="left">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="pic" label="图片/小视频" align="center" width="120">
        <template slot-scope="scope">
          <div class="pic" v-if="scope.row.pic.toLowerCase().endsWith('jpg')||scope.row.pic.toLowerCase().endsWith('jpeg')||scope.row.pic.toLowerCase().endsWith('png')||scope.row.pic.toLowerCase().endsWith('gif')">
            <el-image :src="getUrl(scope.row.pic)" :preview-src-list="[getUrl(scope.row.pic)]" style="width:100%" />
          </div>
          <div class="pic" v-if="scope.row.pic.toLowerCase().endsWith('mp4')">
            <video :src="getUrl(scope.row.pic)" style="width:100%" @click="playVideo(scope.row.pic)"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sceneryName" label="景点名称" align="center"></el-table-column>
      <el-table-column prop="weather" label="天气" align="center" width="120">
        <template slot-scope="scope">
          {{ changeWeather(scope.row.weather) }}
        </template>
      </el-table-column>
      <el-table-column prop="timeBucket" label="时段" align="center" width="120">
        <template slot-scope="scope">
          {{ changeTimeBucket(scope.row.timeBucket) }}
        </template>
      </el-table-column>
      <el-table-column prop="season" label="季节" align="center" width="50">
        <template slot-scope="scope">
          {{ changeSeason(scope.row.season) }}
        </template>
      </el-table-column>
      <el-table-column prop="bearing" label="方位" align="center" width="50">
        <template slot-scope="scope">
          {{ changeBearing(scope.row.bearing) }}
        </template>
      </el-table-column>
      <el-table-column prop="essence" label="设置/取消精华" align="center" width="160">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.essence"
            :active-value="1"
            :inactive-value="0"
            active-text="精华"
            inactive-text="非精华"
            @change="toggleEssence(scope.row.essence, scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="审核" align="center" width="160">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            :active-value="1"
            :inactive-value="0"
            active-text="可见"
            inactive-text="不可见"
            @change="toggleVisible(scope.row.visible, scope.row.id)"
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
    <!-- 修改弹框区域 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="sceneryId" label="景点" size="mini">
          <el-select v-model="editForm.sceneryId" placeholder="请选择">
            <el-option
              v-for="item in scenery"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="weather" label="天气" size="mini">
          <el-select v-model="editForm.weather" placeholder="请选择">
            <el-option
              v-for="item in weather"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="timeBucket" label="时段" size="mini">
          <el-select v-model="editForm.timeBucket" placeholder="请选择">
            <el-option
              v-for="item in timeBucket"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="season" label="季节" size="mini">
          <el-select v-model="editForm.season" placeholder="请选择">
            <el-option
              v-for="item in season"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bearing" label="方位" size="mini">
          <el-select v-model="editForm.bearing" placeholder="请选择">
            <el-option
              v-for="item in bearing"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="saveEdit">确定</el-button>
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
    <!-- 视频弹框区域 -->
    <el-dialog title="视频播放" :visible.sync="videoVisible" width="800px"  @close="closePlay" center>
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @play=" onPlayerPlay( $event)"
        @pause=" onPlayerPause( $event)"
        @statechanged=" playerStateChanged( $event)"
      ></video-player>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShareByUserId,
  deleteShare,
  getSceneryById,
  toggleEssence,
  getAllShare,
  getByPrimaryKey,
  getCountByUserId, toggleVisible, getAllScenery, updateShare
} from '../api/index';
import {mixin} from '../mixins/index';
import VDistpicker from 'v-distpicker';
import {mapGetters} from 'vuex'
import {bearing, season, timeBucket, weather} from "../assets/js/options";
export default {
  mixins: [mixin],
  data () {
    return {
      userId: '',
      userName: '',
      delVisible: false,  //删除弹框是否可见
      videoVisible: false,  //视频播放弹框是否可见
      tableData: [],
      tempDate: [],
      select_word: '',
      pageSize: 5,  //默认的每页记录数
      currentPage: 1, //默认当前页码
      index: '',  //当前选择项
      multipleSelection: [],  //选择批量删除的项
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: this.url //url地址
          }
        ],
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      filtrateData: [],       //筛选数据
      sort: {                 //排序信息
        sortName: '',         //排序字段
        type: '',             //排序方式
      },
      sortNameOptions: [
        {
          value: 'username',
          label: '用户名'
        },
        {
          value: 'createTime',
          label: '创建时间'
        },
        {
          value: 'count',
          label: '用户总动态数'
        }
      ],
      typeOptions: [
        {
          value: 'up',
          label: '升序',
        },
        {
          value: 'down',
          label: '降序',
        }
      ],
      editForm: {
        id: '',
        sceneryId: '',
        weather: '',
        timeBucket: '',
        season: '',
        bearing: '',
      },
      scenery: [],        // 景点列表
      weather: [],        //天气
      timeBucket: [],     //时段
      season: [],         //季节
      bearing: [],        //方位
      editDialogVisible: false,

    }
  },
  computed: {
    data() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    ...mapGetters([
      'url',
      'isPlay'
    ]),
    player () {
      return this. $refs.videoPlayer.player
    }
  },
  components: {
    VDistpicker
  },
  created() {
    this.getData();
    this.getAllScenery();
    this.weather = weather;
    this.timeBucket = timeBucket;
    this.season = season;
    this.bearing = bearing;
  },
  watch: {
    select_word: function() {
      if (this.select_word === '') {
        this.tableData = this.tempDate;
        this.filtrateData = this.tempDate;
      } else if (this.sort.sortName === '' && this.sort.type === '') {
        this.tableData = [];
        for (let item of this.tempDate) {
          if (item.username.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
        this.filtrateData = this.tableData;
      } else {
        this.tableData = [];
        for (let item of this.filtrateData) {
          if (item.username.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
      this.filtrateData = this.tableData;
    }
  },
  methods: {
    onPlayerPlay ( player) {
    },
    onPlayerPause ( player) {
    },
    playerStateChanged ( player) {
    },
    //删除用户
    delRow() {
      deleteShare(this.index)
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
    //获取并更改当前页
    handleCurrentChange(value) {
      this.currentPage = value;
    },
    //获取所有的动态
    getData() {
      this.tempDate = [];
      this.tableData = [];
      getAllShare()
      .then(res => {
        this.tempDate = res;
        this.currentPage = 1;
        this.getSceneryName();
        this.getUserInfo();
        this.getCountByUserId();
        this.tableData = this.tempDate;
        this.filtrateData = this.tempDate;
        console.log(this.filtrateData);
      })
    },
    //获取所有的景点
    getAllScenery() {
      getAllScenery()
      .then(res => {
        this.scenery = res;
      })
    },
    //获取景点名
    getSceneryName() {
      this.tempDate.forEach(item => {
        getSceneryById(item.sceneryId)
          .then(res => {
            this.$set(item,'sceneryName',res.name);
            this.$set(item,'scenery',res);
          })
      })
    },
    //获取用户信息
    getUserInfo() {
      this.tempDate.forEach(item => {
        console.log(item.userId);
        getByPrimaryKey(item.userId)
        .then(res => {
          this.$set(item,'username',res.username);
          this.$set(item,'user',res);
        })
      })
    },
    //获取用户动态数
    getCountByUserId() {
      this.tempDate.forEach(item => {
        getCountByUserId(item.userId)
        .then(res => {
          this.$set(item,'count',res);
        })
      })
    },
    //播放视频
    playVideo(url) {
      if(url.endsWith('mp4')) {
        this.$store.commit('setUrl',this.$store.state.HOST + url);
        this.playerOptions.sources[0].src = this.url;
        this.videoVisible = true;
      }else {
        return false;
      }
    },
    //关闭弹框时关闭视频
    closePlay() {
      this.$refs.videoPlayer.player.pause();
    },
    //设置/取消精华
    toggleEssence(essence, id) {
      toggleEssence(essence,id)
      .then(res => {
        if (res === true) {
          this.notify('切换成功', 'success');
        } else {
          this.notify('切换失败', 'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    //是否可见
    toggleVisible(visible, id) {
      toggleVisible(visible,id)
        .then(res => {
          if (res === true) {
            this.notify('切换成功', 'success');
          } else {
            this.notify('切换失败', 'error');
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //处理修改
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editForm = {
        id: row.id,
        sceneryId: row.sceneryId,
        weather: row.weather,
        timeBucket: row.timeBucket,
        season: row.season,
        bearing: row.bearing
      }
    },
    //上传修改
    saveEdit() {
      let params = new URLSearchParams();
      params.append('id',this.editForm.id);
      params.append('sceneryId', this.editForm.sceneryId);
      params.append('weather', this.editForm.weather);
      params.append('timeBucket', this.editForm.timeBucket);
      params.append('season', this.editForm.season);
      params.append('bearing', this.editForm.bearing);
      updateShare(params)
      .then(res => {
        if (res.code === 1) {
          this.notify(res.msg,'success');
          this.editDialogVisible = false;
          this.getData();
        } else {
          this.notify(res.msg,'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    //处理排序
    handleSort() {
      if (this.sort.sortName === 'username') {
        switch (this.sort.type) {
          case 'up':
            this.tableData = this.filtrateData.sort(function (a, b) {
              return a.username < b.username ? -1 : a.username > b.username ? 1 : 0;
          })
                break;
          case 'down': this.tableData = this.filtrateData.sort(function (a, b) {
              return a.username < b.username ? 1 : a.username > b.username ? -1 : 0;
          })
        }
      } else if (this.sort.sortName === 'createTime') {
        switch (this.sort.type) {
          case 'up': this.tableData = this.filtrateData.sort(function (a, b) {
            return a.createTime < b.createTime ? -1 : a.createTime > b.createTime ? 1 : 0;
          })
            break;
          case 'down': this.tableData = this.filtrateData.sort(function (a, b) {
            return a.createTime < b.createTime ? 1 : a.createTime > b.createTime ? -1 : 0;
          })
        }
      } else if (this.sort.sortName === 'count') {
        switch (this.sort.type) {
          case 'up': this.tableData = this.filtrateData.sort(function (a, b) {
            return a.count - b.count;
          })
            break;
          case 'down': this.tableData = this.filtrateData.sort(function (a, b) {
            return b.count - a.count;
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .pic {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .pic img {
    height: 100%;
    cursor: pointer;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
    margin: 0 10px;
  }

  .handle-select {
    width: 150px;
    display: inline-block;
    margin: 0 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }

</style>
