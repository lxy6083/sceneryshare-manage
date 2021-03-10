<template>
  <div class="table">
    <!-- 操作区域 -->
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关内容" class="handle-input"></el-input>
      </div>
    </div>
    <!-- 列表区域 -->
    <el-table size="mini" ref="multipleTable" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="content" label="文字内容" align="center"></el-table-column>
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
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{getScenery(scope.row.province, scope.row.city, scope.row.district, scope.row.scenery)}}
        </template>
      </el-table-column>
      <el-table-column prop="weather" label="天气" align="center" width="50"></el-table-column>
      <el-table-column prop="timeBucket" label="时段" align="center" width="50"></el-table-column>
      <el-table-column prop="season" label="季节" align="center" width="50"></el-table-column>
      <el-table-column prop="bearing" label="方位" align="center" width="50"></el-table-column>
      <el-table-column prop="up" label="点赞数" align="center" width="50"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="120"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center" width="120"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
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
import {getSceneryByUserId, deleteScenery} from '../api/index';
import {mixin} from '../mixins/index';
import VDistpicker from 'v-distpicker';
import {mapGetters} from 'vuex'
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
      return this. $refs. videoPlayer. player
    }
  },
  components: {
    VDistpicker
  },
  created() {
    this.userId = this.$route.query.id;
    this.userName = this.$route.query.name;
    this.getData();
  },
  watch: {
    select_word: function() {
      if (this.select_word === '') {
        this.tableData = this.tempDate;
      } else {
        this.tableData = [];
        for (let item of this.tempDate) {
          if (item.content.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
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
    //获取并更改当前页
    handleCurrentChange(value) {
      this.currentPage = value;
    },
    //查询用户的动态
    getData() {
      this.tempDate = [];
      this.tableData = [];
      getSceneryByUserId(this.userId)
      .then(res => {
        this.tableData = res;
        this.tempDate = res;
        this.currentPage = 1;
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
    margin: 0px 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }

</style>