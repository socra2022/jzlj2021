<template>
  <div id="realTimeTrack">
    <!-- 百度地图 -->
    <div id="map">
      <div id="bm-view"></div>
    </div>
    <!-- 右侧控制栏 -->
    <div id="controlBar">
      <div id="example">
        <p>车辆状态</p>
        <section>
          <div><img src="../../../static/img/bus_purple_s.png" alt="Online Car" /><span>在线</span></div>
          <div><img src="../../../static/img/bus_gray_s.png" alt="Offline Car" /><span>离线</span></div>
        </section>
        <section>
          <div><img src="../../../static/img/bus_orange_s.png" alt="Overspeed Car" /><span>超速</span></div>
          <div><img src="../../../static/img/bus_yellow_s.png" alt="Stop Car" /><span>停车</span></div>
        </section>
      </div>
      <div id="selectCar">
        <p>选择车辆</p>
        <div id="companyAndCar">
          <el-checkbox-group @change="changeCheckstate" v-model="checkedList">
            <el-collapse v-model="showingCompany" v-for="item in companiesAndCars" :key="item.companyId" accordion>
              <el-collapse-item :name="item.companyName">
                <template slot="title">
                  {{item.companyName}}
                </template>
                <div v-for="car in item.cars" :key="car.carId">
                  <div class="singleCar">
                    <el-checkbox :label="car.carNo"></el-checkbox>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-checkbox-group>
        </div>
        <!-- <div id="pager">
          <el-pagination :page-size="8" :pager-count="3" layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div> -->
      </div>
    </div>
    <div id="CustomControl" style="padding: 7px"></div>
    <div id="switch" style="line-height: 30px">
      <span>跟随视角：</span>
      <el-switch v-model="followingView.isTrue"></el-switch>
    </div>
    <div id="change">
      <span>切换跟随车辆：</span>
      <!-- <el-button type="primary" icon="el-icon-refresh" circle></el-button> -->
      <el-button round size="mini" icon="el-icon-refresh" @click="changeFollowingCar"></el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import {
  selectAllCompanyData,
  selectCarNoByCompany,
  // eslint-disable-next-line no-unused-vars
  // selectHTData,
  selectHTDataNew
} from '../../assets/axios/index'
// 车辆实体类
class CarInstance {
  constructor (index = 0, name = '', dom = null, positionData = [], rotation = 0, state = false, dispaly = true, infoWindowDom = null) {
    this.index = index // 遍历的游标
    this.name = name // 车辆名称
    this.dom = dom // 对应 BaiduMap 中的dom节点
    this.positionData = positionData // 轨迹数据
    this.rotation = rotation // 车辆当前旋转角度
    this.state = state // 是否读完所有轨迹
    this.dispaly = dispaly // 是否显示
    this.infoWindowDom = infoWindowDom // 存储信息窗dom节点
  }
  // 运动函数
  next () {
    this.index++
    if (this.index >= this.positionData.length) {
      // 当前轨迹已读完
      this.state = true
    } else {
      let { carLat: latA, carLong: lngA } = this.positionData[this.index - 1]
      let positionA = { lng: lngA, lat: latA }
      let { carLat: latB, carLong: lngB } = this.positionData[this.index]
      let positionB = { lng: lngB, lat: latB }
      let pt = new BMap.Point(lngB, latB)
      this.dom.setPosition(pt) // 渲染位置信息
      this.rotation = this.getRotation(positionA, positionB)
      this.dom.setRotation(this.rotation) // 渲染角度信息
      this.infoWindowDom.setContent(this.getMessageWindow()) // 渲染信息窗内容
    }
  }
  // 计算车头旋转角度
  getRotation (positionA, positionB) {
    var y = positionB.lng - positionA.lng
    var x = positionB.lat - positionA.lat
    var tanV = y / x
    var angle = Math.atan(tanV)
    angle = (angle / Math.PI * 180)
    if (x >= 0) {
      angle = angle - 90
    } else {
      angle = angle - 270
    }
    return angle
  }
  // 返回渲染的信息窗口
  getMessageWindow () {
    let index = this.index
    return `<p style="line-height: 20px"><span style="font-weight: bold;">速度：</span>${this.name}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">速度：</span>${this.positionData[index].speed}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">经度：</span>${this.positionData[index].carLong}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">纬度：</span>${this.positionData[index].carLat}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">举升状态：</span>${this.positionData[index].lift}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">箱体密闭：</span>${this.positionData[index].airtight}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">轨迹ID：</span>${this.positionData[index].trailId}</p>` +
      `<p style="line-height: 20px"><span style="font-weight: bold;">上传时间：</span>${this.positionData[index].inputTime}</p>`
  }
}
export default {
  /* eslint-disable no-undef */
  data () {
    return {
      map: null, // 地图控件
      showingCompany: '', // 手风琴绑定
      companiesAndCars: [], // 右侧控制菜单渲染数据 companies And cars
      // ['深圳市万达建筑工程有限公司','深圳市永庆建设工程有限公司','深圳市万达建筑工程有限公司','深圳市安圳达运输有限公司','深圳市万达建筑工程有限公司','深圳市万达建筑工程有限公司','深圳市安圳达运输有限公司','深圳市隆盛建筑工程有限公司']
      selectedCars: ['粤BHP557', '粤BHC873', '粤BJB442', '粤BJH186', '粤BJC420', '粤BJV878', '粤BHT510', '粤BGP635'], // 已选的渲染车辆列表
      checkedList: ['粤BHP557', '粤BHC873', '粤BJB442', '粤BJH186', '粤BJC420', '粤BJV878', '粤BHT510', '粤BGP635'], // 右侧控制菜单 checkBox-group 数组
      // selectedCars: ['粤BHP557'],
      // checkedList: ['粤BHP557'],
      carInstances: {}, // 渲染队列
      followingView: { isTrue: false, carName: '粤BGP635', key: 0 }, // 跟随视角
      timer: null
    }
  },
  created: function () {
    // 初始化页面数据
    this.initData()
  },
  mounted: function () {
    // 初始化百度地图
    this.initBaiDuMap()
    this.run()
  },
  beforeRouteLeave (to, from, next) {
    // 离开路由前清除定时器
    clearInterval(this.timer)
    next()
  },
  methods: {
    // 初始化百度地图
    initBaiDuMap: function () {
      // let _this = this
      this.map = new BMap.Map('bm-view') // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(114.035761, 22.56381), 10) // 初始化地图,设置中心点坐标和地图级别
      // 添加地图类型-右上角
      this.map.addControl(
        new BMap.MapTypeControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          mapTypes: [
            BMAP_NORMAL_MAP, // 地图
            BMAP_SATELLITE_MAP, // 卫星地图
            BMAP_HYBRID_MAP // 混合地图
          ]
        })
      )
      // 添加比例尺-左上角
      let scaleControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      })
      this.map.addControl(scaleControl)
      // 添加缩放平移-左上角
      let navigationControl = new BMap.NavigationControl()
      this.map.addControl(navigationControl)
      // 添加城市列表-右下角
      let offset = new BMap.Size(10, 20)
      this.map.addControl(
        new BMap.CityListControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          offset: offset
        })
      )

      // 添加自定义视角跟随控件
      // 定义一个控件类
      function ZoomControl () {
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT
        this.defaultOffset = new BMap.Size(10, 60)
      }
      // 通过JavaScript的prototype属性继承于BMap.Control
      ZoomControl.prototype = new BMap.Control()

      // 自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
      // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
      ZoomControl.prototype.initialize = function (map) {
        // 创建一个dom元素
        let div = document.getElementById('CustomControl')
        // 子元素1：控制是否开启跟随视角
        let e1 = document.getElementById('switch')
        div.appendChild(e1)
        // 子元素2：切换跟随车辆
        let e2 = document.getElementById('change')
        div.appendChild(e1)
        div.appendChild(e2)
        // 设置样式
        div.style.boxShadow = '2px 4px 6px 2px rgba(27, 142, 236, 0.7)'
        div.style.borderRadius = '2px'
        div.style.background = 'transparent'
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div)
        // 将DOM元素返回
        return div
      }
      // 创建控件元素
      var myZoomCtrl = new ZoomControl()
      // 添加到地图中
      this.map.addControl(myZoomCtrl)

      this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.map.enableInertialDragging() // 启用地图惯性拖拽
      this.map.enableContinuousZoom() // 开启连续缩放效果
    },
    // 初始化数据请求以渲染右侧表格 (selectCompany -> selectCars)
    initData: function () {
      // 获取公司数据
      selectAllCompanyData(false).then((res) => {
        let rawData = JSON.parse(JSON.stringify(res.data.respBody))
        console.log(rawData)
        for (let i = 0; i < 10; ++i) {
          let { carCompanyID, carCompanyName } = rawData[i]
          // 获取公司下车辆数据
          selectCarNoByCompany(carCompanyName, false).then((res2) => {
              
            let rawData2 = JSON.parse(JSON.stringify(res2.data.respBody))
            console.log(rawData2)
            this.companiesAndCars.push({ companyId: carCompanyID, companyName: carCompanyName, cars: rawData2 })
          })
        }
      }).catch((e) => {
        console.log('initData方法出错：', e.message)
      })
    },
    // 自定义百度地图组件中绑定的切换跟随车辆的方法
    changeFollowingCar: function () {
      let _this = this
      let validArray = []
      for (let key in _this.carInstances) {
        if (_this.carInstances[key].dispaly) {
          validArray.push(_this.carInstances[key].name)
        }
      }
      let finalKey = _this.followingView.key % validArray.length
      _this.followingView.carName = validArray[finalKey]
      _this.followingView.key++
    },
    // 增加车辆到渲染队列
    addCar: async function (carName) {
      let _this = this
      // 根据渲染队列是否存在车辆选择方法
      if (carName in this.carInstances) {
        // 已经存在，调用dom中显示方法
        console.log(carName, '隐身——> 显示')
        _this.carInstances[carName].dom.show()
        _this.carInstances[carName].dom.dispaly = true
      } else {
        // 不存在，新增车辆到渲染队列
        console.log(carName, '新建到队列')
        // 小车图标 (anchor:偏移量，保证车辆中心对应坐标点)
        let myIcon = new BMap.Icon('../../../static/img/bus_purple_s.png', new BMap.Size(52, 26), { anchor: new BMap.Size(21.5, 10) })
        // 创建Marker标注，使用小车图标
        let pt = new BMap.Point(0, 0)
        _this.carInstances[carName] = new CarInstance(0, carName, new BMap.Marker(pt, { icon: myIcon }), [], 0, false, true)
        // 将小车加到 map 中,并启动可拖拽
        // _this.carInstances[carName].dom.enableDragging()
        _this.map.addOverlay(_this.carInstances[carName].dom)
        await selectHTDataNew(carName, false, '2019-12-09 00:00:00', '2019-12-09 03:50:00').then((res) => {
          let rawData = JSON.parse(JSON.stringify(res.data.respBody))
    
          for (let i = 0; i < rawData.length; ++i) {
            // 坐标转换
            let { carLong: rawLng, carLat: rawLat } = rawData[i]
            let { lat, lng } = this.wgs2bd(rawLat, rawLng)
            rawData[i].carLong = lng
            rawData[i].carLat = lat
            // 时间格式规范
            rawData[i].inputTime = this.$moment(rawData[i].inputTime).format('YYYY-MM-DD HH:mm:ss')
          }
          _this.carInstances[carName].positionData = rawData
          let { carLat, carLong } = _this.carInstances[carName].positionData[0]
          let pt = new BMap.Point(carLat, carLong)
          _this.carInstances[carName].dom.setPosition(pt)
          _this.carInstances[carName].dom.setTitle(carName) // 设置车辆Title,hover显示Title
        })
        // 为小车添加点击相应的信息窗并赋值信息窗dom节点
        let opts = {
          width: 250, // 信息窗口宽度
          height: 160, // 信息窗口高度
          offset: { width: 8, height: -8 } // 偏移量
          // title: `<h2>${carName}</h2>` // 信息窗口标题
        }
        let infoWindow = new BMap.InfoWindow(_this.carInstances[carName].getMessageWindow(), opts) // 创建信息窗口对象
        infoWindow.disableAutoPan() // 关闭打开信息窗时自动平移
        _this.carInstances[carName].infoWindowDom = infoWindow
        _this.carInstances[carName].dom.addEventListener('click', function () {
          _this.carInstances[carName].dom.openInfoWindow(infoWindow) // 开启信息窗口
        })
      }
    },
    // 减少车辆从渲染队列
    removeCar: function (carName) {
      if (carName in this.carInstances) {
        this.carInstances[carName].dom.hide()
        this.carInstances[carName].dom.dispaly = false
      } else {
      }
      if (carName === this.followingView.carName) {
        this.changeFollowingCar(this)
      }
    },
    // 驱动函数
    run: async function () {
      let _this = this

      // 初始化遍历原始数组，渲染队列
      this.selectedCars.map((carName) => {
        _this.addCar(carName)
      })

      // 开始运行
      _this.timer = setInterval(() => {
        for (let key in _this.carInstances) {
          // 跟随视角方法
          if (_this.followingView.isTrue && (_this.followingView.carName === key) && _this.carInstances[key].dispaly) {
            let index = _this.carInstances[key].index
            let { carLat, carLong } = _this.carInstances[key].positionData[index]
            let point = new BMap.Point(carLong, carLat)
            _this.map.setCenter(point)
          }
          // 车辆移动
          _this.carInstances[key].next()
        }
      }, 1000)
    },
    // 多选按钮群绑定值改变回调函数
    changeCheckstate: function (array) {
      if (array.length === this.selectedCars.length) {
        return
      }
      if (array.length > this.selectedCars.length) {
        // 增加车辆 -> 渲染页面
        let carName = this.compare(array, this.selectedCars)[0]
        this.addCar(carName)
        this.$message({
          message: '成功！车辆 “' + carName + '” 加入渲染队列',
          type: 'success',
          duration: 2000
        })
      } else {
        // 减少车辆
        let carName = this.compare(this.selectedCars, array)[0]
        this.removeCar(carName)
        this.$message({
          message: '成功！车辆 “' + carName + '” 退出渲染队列',
          type: 'warning',
          duration: 2000
        })
      }
      this.selectedCars = array
    },
    // 获得两数组的不同的元素，arrA > arrB
    compare: function (arrA, arrB) {
      return arrA.filter((temp) => {
        return arrB.indexOf(temp) === -1
      })
    },
    // ***************  坐标转换的系列函数(wsg -> gcj -> bd)  ******************
    transformLat: function (x, y) {
      const PI = 3.14159265358979324
      var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
      ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
      ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
      return ret
    },
    transformLon: function (x, y) {
      const PI = 3.14159265358979324
      var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
      ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
      ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
      return ret
    },
    delta: function (lat, lon) {
      // Krasovsky 1940
      //
      // a = 6378245.0, 1/f = 298.3
      // b = a * (1 - f)
      // ee = (a^2 - b^2) / a^2;
      const PI = 3.14159265358979324
      var a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
      var ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
      var dLat = this.transformLat(lon - 105.0, lat - 35.0)
      var dLon = this.transformLon(lon - 105.0, lat - 35.0)
      var radLat = lat / 180.0 * PI
      var magic = Math.sin(radLat)
      magic = 1 - ee * magic * magic
      var sqrtMagic = Math.sqrt(magic)
      dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
      dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
      return { lat: dLat, lng: dLon }
    },
    // WGS-84 to GCJ-02
    wgs2gcj: function (wgsLat, wgsLon) {
      var d = this.delta(wgsLat, wgsLon)
      return { lat: wgsLat + d.lat, lng: wgsLon + d.lng }
    },
    // GCJ-02 to BD-09
    gcj2bd: function (gcjLat, gcjLon) {
      const xPI = 3.14159265358979324 * 3000.0 / 180.0
      var x = gcjLon
      var y = gcjLat
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPI)
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPI)
      var bdLon = z * Math.cos(theta) + 0.0065
      var bdLat = z * Math.sin(theta) + 0.006
      return { lat: bdLat, lng: bdLon }
    },
    wgs2bd: function (wgsLat, wgsLng) {
      let result = this.gcj2bd(wgsLat, wgsLng)
      let { lat, lng } = this.wgs2gcj(result.lat, result.lng)
      return { lat: lat, lng: lng }
    }
    // *************** END  坐标转换的系列函数(wsg -> gcj -> bd) END ******************
  }
}
</script>

<style lang="scss" scoped>
#realTimeTrack {
  height: 85vh;
  width: 82.76vw;
  #map {
    position: relative;
    height: 85vh;
    width: 66.021vw;
    float: left;
    border: 0.1vh solid #3dcaf5;
    transition: 0.5s;
    #bm-view {
      height: 100%;
      width: 100%;
    }
  }
  #controlBar {
    position: relative;
    height: 85vh;
    width: 15vw;
    float: right;
    background-image: url("../../../static/img/icon32-1.png");
    background-position: center;
    background-size: 15vw 85vh;
    transition: 0.5s;
    p {
      height: 4vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      margin: 4vh 0vw 0vh 0vw;
    }
    #example {
      section {
        margin: 2vh 0vw 0vh 0vw;
        align-items: center;
        display: flex;
        justify-content: center;
        div {
          color: #ffffff;
          font-size: 1.296vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0vh 1vw;
          span {
            margin-left: 0.5vw;
            white-space: nowrap;
          }
        }
      }
    }
    #selectCar {
      width: 100%;
      height: 63.6vh;
      #companyAndCar {
        // border: solid 1px #fff;
        height: 59.4vh;
        overflow-y: scroll;
        .singleCar {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style>
.el-collapse {
  border: none;
}
.el-collapse-item__header {
  background: transparent !important;
  color: #fff;
  height: 6vh;
  line-height: 2.5vh;
  font-size: 1.111vh;
  border: none;
  padding-left: 0.5vw;
}
.el-collapse-item__content {
  color: #fff;
  max-height: 20vh;
  overflow-y: scroll;
  padding: 0;
  font-size: 1.111vh;
  line-height: 4vh;
  padding-left: 2vw;
  border: none;
}
.el-collapse-item__header.is-active {
  color: #3dcaf5 !important;
}
.el-collapse-item__wrap {
  background-color: transparent !important;
  border: none;
}
.el-checkbox {
  color: white;
}
.el-checkbox__label {
  font-size: 1.111vh;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #3dcaf5 !important;
}
</style>
