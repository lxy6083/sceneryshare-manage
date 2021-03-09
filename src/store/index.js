import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        HOST: 'http://127.0.0.1:8888',
        isPlay: false, //视频播放状态
        url: '', //视频路径地址
    },
    getters: {
        isPlay: state => state.isPlay,
        url: state => state.url
    },
    mutations: {
        setIsPlay: (state, isPlay) => state.isPlay = isPlay,
        setUrl: (state, url) => state.url = url
    },
    actions: {},
    modules: {}
})