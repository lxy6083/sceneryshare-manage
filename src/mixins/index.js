import {getByPrimaryKey} from "../api";

export const mixin = {
    methods: {
        //提示信息
        notify(title, type) {
            this.$notify({
                title,
                type
            })
        },
        //根据相对路径获取绝对路径
        getUrl(url) {
            return `${this.$store.state.HOST}/${url}`;
        },
        //获取性别的中文
        changeSex(sex) {
            if (sex == 0) {
                return '女';
            }
            return '男';
        },
        //截取生日的日期部分
        formatBirth(date) {
            return String(date).substr(0, 10);
        },

        //获取所在地区
        getLocation(province, city, district) {
            return province + ' ' + city + ' ' + district;
        },

        //获取景区地址
        getScenery(province, city, district, scenery) {
            return province + ' ' + city + ' ' + district + ' ' + scenery;
        },

        //图片上传前的校验
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif');
            if (!isJPG) {
                this.$message.error('上传的头像只能是JPG、PNG、GIF格式的');
                return false;
            }
            const isLt2M = (file.size / 1024 / 1024) < 5;
            if (!isLt2M) {
                this.$message.error('上传的头像大小不能超过5M');
                return false;
            }
            return true;
        },

        //图片上传成功之后刷新页面，提示信息
        handleAvatarSuccess(res, file) {
            let _this = this;
            if (res.code == 1) {
                _this.getData();
                _this.notify('头像上传成功', 'success');
            } else {
                _this.notify('头像上传失败', 'error');
            }
        },
        //弹出删除窗口
        handleDelete(id) {
            this.index = id;
            this.delVisible = true;
        },

        //将已经选择的赋值给
        handleSelectionChange(value) {
            this.multipleSelection = value;
        },

        //批量删除已经选择的项
        delAll() {
            for (let item of this.multipleSelection) {
                this.handleDelete(item.id);
                this.delRow();
            }
            this.multipleSelection = [];
        },
        //获取景点类别的中文
        changeType(type) {
          switch (type) {
            case 1: return '历史遗址';
            case 2: return '建筑物';
            case 3: return '博物馆';
            case 4: return '民族民俗';
            case 5: return '宗教';
            case 6: return '节事节气';
            case 7: return '地文景观';
            case 8: return '水域风光';
            case 9: return '生物景观';
            case 10: return '天象与气候';
            case 11: return '主题公园';
            case 12: return '旅游度假区';
            case 13: return '美食';
            case 14: return '探险';
            case 15: return '刺激';
            case 16: return '游乐园';
            case 17: return '电影院';
            case 18: return '赌场';
            case 19: return '购物中心';
            case 20: return '表演中心';
            case 21: return '文化遗产';
            case 22: return '自然遗产';
            case 23: return '文化和自然双重遗产';
            case 24: return '非物质文化遗产';
            case 25: return '文化景观遗产';
          }
        },
        //获取父级景点的名称
        getParentScenery(id) {
          let result = '无';
          this.tempData.forEach(item => {
            if (item.id === id) {
              result = item.name;
            }
          })
          return result;
        },
        //获取天气的中文
        changeWeather(weather) {
          switch (weather) {
            case 1: return '晴';
            case 2: return '多云';
            case 3: return '阴';
            case 4: return '阵雨';
            case 5: return '雷阵雨';
            case 6: return '雷阵雨伴有冰雹';
            case 7: return '雨夹雪';
            case 8: return '小雨';
            case 9: return '中雨';
            case 10: return '大雨';
            case 11: return '暴雨';
            case 12: return '大暴雨';
            case 13: return '特大暴雨';
            case 14: return '阵雪';
            case 15: return '小雪';
            case 16: return '中雪';
            case 17: return '大雪';
            case 18: return '暴雪';
            case 19: return '雾';
            case 20: return '冻雪';
            case 21: return '沙尘暴';
            case 22: return '浮尘';
            case 23: return '扬沙';
            case 24: return '强沙尘暴';
            case 25: return '霾';
          }
        },
        //获取时段的中文
        changeTimeBucket(timeBucket) {
          switch (timeBucket) {
            case 1: return '23:00-1:00(子)';
            case 2: return '1:00-3:00(丑)';
            case 3: return '3:00-5:00(寅)';
            case 4: return '5:00-7:00(卯)';
            case 5: return '7:00-9:00(辰)';
            case 6: return '9:00-11:00(巳)';
            case 7: return '11:00-13:00(午)';
            case 8: return '13:00-15:00(未)';
            case 9: return '15:00-17:00(申)';
            case 10: return '17:00-19:00(酉)';
            case 11: return '19:00-21:00(戌)';
            case 12: return '21:00-23:00(亥)';
          }
        },
        //季节
        changeSeason(season) {
          switch (season) {
            case 1: return '春';
            case 2: return '夏';
            case 3: return '秋';
            case 4: return '冬';
          }
        },
        //朝向
        changeBearing(bearing) {
          switch (bearing) {
            case 1: return '东';
            case 2: return '南';
            case 3: return '西';
            case 4: return '北';
            case 5: return '东南';
            case 6: return '东北';
            case 7: return '西南';
            case 8: return '西北';
          }
        }
    }
}
