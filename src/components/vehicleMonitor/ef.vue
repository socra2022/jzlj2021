<template>
  <div id="ef">
    <div id="selectBar">
      <span>围栏类型：</span>
      <select v-model="selectedType" class="selectInput">
        <option :value="item" v-for="(item, index) in efTypes" :key="index">
          {{ item }}
        </option>
      </select>
      <span>围栏名称：</span>
      <select v-model="selectedName" id="fenceName" class="selectInput">
        <option :value="item.name" v-for="(item, index) in efNames" :key="index" :id="item.id">
          {{ item.name }}
        </option>
      </select>
      <img src='../../../static/img/icon26.png' alt="arrow">
    </div>
    <div id="bmap">
<<<<<<< HEAD
      <baidu-map class="bm-view"  :scroll-wheel-zoom="true" :zoom="16" :center="efCenter">
=======
      <baidu-map class="bm-view"  :scroll-wheel-zoom="true" :zoom="14" :center="efCenter">
>>>>>>> f9fc1df (12yuetijiao)
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bm-polygon :path="polygonPath" stroke-color="red" :stroke-opacity="1" :stroke-weight="2" fillColor="red" :fillOpacity="0.7"  />
      </baidu-map>
    </div>
  </div>
</template>

<script>
// 引入接口信息
import {
  selectAllSourceDataNew,
  selectAllIntakeDataNew,
  selectAllResourceDataNew,
  // eslint-disable-next-line no-unused-vars
  selectByIdAndSOrI
} from '../../assets/axios/index'
export default {
  data () {
    return {
      rawData: [],
      // 围栏类型
      selectedType: '',
      efTypes: ['消纳场', '产生源', '资源场'],
      SorI: 0,
      // 围栏名称
      selectedName: '',
      efNames: [],
      // 百度地图所需要的围栏属性
<<<<<<< HEAD
      // 中心点坐标
      efCenter: { lng: 114.067, lat: 22.617 },
=======
      // 中心点坐标116.521832, 35.402216
      efCenter: { lng: 116.592832, lat: 35.403346  },
>>>>>>> f9fc1df (12yuetijiao)
      // 坐标集
      polygonPath: [],
      // 请求到的经纬度数据
      efData: []
    }
  },
  watch: {
    selectedType: function () {
      // 监测围栏类型变化，获取相应类型围栏数据
      if (this.selectedType === '产生源') {
        this.efNames = []
        selectAllSourceDataNew(false).then((res) => {
          let rawData = JSON.parse(JSON.stringify(res.data.respBody))
          for (let i = 0; i < rawData.length; ++i) {
            let { sourceId: id, sourceName: name } = rawData[i]
            this.efNames.push({ id: id, name: name })
          }
        })
        this.SorI = 1
      } else if (this.selectedType === '消纳场') {
        this.efNames = []
        selectAllIntakeDataNew(false).then((res) => {
          let rawData = JSON.parse(JSON.stringify(res.data.respBody))
          for (let i = 0; i < rawData.length; ++i) {
            let { intakePlantId: id, intakePlantName: name } = rawData[i]
            this.efNames.push({ id: id, name: name })
          }
        })
        this.SorI = 0
      } else if (this.selectedType === '资源场') {
        this.efNames = []
        selectAllResourceDataNew(false).then((res) => {
          let rawData = JSON.parse(JSON.stringify(res.data.respBody))
          for (let i = 0; i < rawData.length; ++i) {
            let { resourcePlantId: id, resourcePlantName: name } = rawData[i]
            this.efNames.push({ id: id, name: name })
          }
        })
        this.SorI = 2
      }
    },
    selectedName: function () {
      // 监测围栏名字变化，渲染地图控件
      let tempDom = document.getElementById('fenceName')
      let index = tempDom.selectedIndex
      let tempId = tempDom.options[index].id
      selectByIdAndSOrI(this.SorI, tempId).then((res) => {
        this.efData = JSON.parse(JSON.stringify(res.data.respBody))
        this.showef()
      })
    }
  },
  methods: {
    showef () {
<<<<<<< HEAD
      this.efCenter = { lng: 114.067, lat: 22.617 }
=======
      this.efCenter = { lng: 116.592832, lat: 35.403346  }
>>>>>>> f9fc1df (12yuetijiao)
      this.polygonPath = []
      // 获取经纬度
      let lngList = []
      let latList = []
      for (let i = 0; i < this.efData.length; i++) {
        lngList.push(this.efData[i].lng)
        latList.push(this.efData[i].lat)
      }
      // 求显示中心
      let clng = 0
      let clat = 0
      for (let i = 0; i < lngList.length; i++) {
        clng += parseFloat(lngList[i])
        clat += parseFloat(latList[i])
      }
      // console.log(clng);
      this.efCenter = {
        lng: clng / lngList.length,
        lat: clat / lngList.length
      }
      // console.log(this.efCenter);
      let path = []
      for (let i = 0; i < lngList.length; i++) {
        let one = {
          lng: lngList[i],
          lat: latList[i]
        }
        path.push(one)
      }
      this.polygonPath = path
    }
  }
}
</script>

<style lang="scss" scoped>
#ef {
  height: 85vh;
  width: 82.76vw;
  border: 0.1vh solid #3dcaf5;
  #selectBar {
    height: 4.259vh;
    width: 82.76vw;
    margin: 0.0926vh auto;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    background: url("../../../static/img/icon27.png");
    background-size: 82.76vw 4.259vh;
    span {
      font-size: 1.667vh;
      color: rgb(255, 255, 255);
      margin: auto 1vw;
    }
    img {
      margin: 0vh 1vw;
    }
    .selectInput {
      margin-left: 0.147vw;
      width: 9.271vw;
      height: 2.963vh;
      // background-color: transparent;
      // color: #ffffff;
      font-size: 1.111vh;
      outline: none;
      border: solid #ffffff 0.052vw;
      font-family: MicrosoftYaHei;
      padding-left: 0.625vw;
      // opacity: 0.6;
      border-radius: 0.278vh;
    }
  }
  #bmap {
    height: 80.741vh;
    width: 82.76vw;
    margin: 0.0926vh auto;
    .bm-view {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
