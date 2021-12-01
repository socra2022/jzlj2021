<template>
  <div id="realTimeTrack">
    <!-- 百度地图 -->
    <div id="map">
      <div id="bm-view"></div>
      <el-button
        type="primary"
        plain
        id="searchCar"
        @click="CarDialogVisible = true"
        >区域查车</el-button
      >
    </div>
    <!-- 右侧控制栏 -->
    <div id="controlBar">
      <div id="example">
        <p>车辆状态</p>
        <section>
          <div>
            <img
              src="../../../static/img/bus_purple_s.png"
              alt="Online Car"
            /><span>在线</span>
          </div>
          <div>
            <img
              src="../../../static/img/bus_gray_s.png"
              alt="Offline Car"
            /><span>离线</span>
          </div>
        </section>
        <section>
          <div>
            <img
              src="../../../static/img/bus_orange_s.png"
              alt="Overspeed Car"
            /><span>超速</span>
          </div>
          <div>
            <img
              src="../../../static/img/bus_yellow_s.png"
              alt="Stop Car"
            /><span>停车</span>
          </div>
        </section>
      </div>
      <!-- v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" -->
      <div id="selectCar">
        <p>选择车辆</p>
        <el-input
          v-model="filterText"
          size="mini"
          type="text"
          style="margin-left:1.5vw;width:12vw"
          placeholder="请输入公司名或车牌号"
        />
        <!-- <el-button @click="serch()" size="mini">搜索</el-button> -->
        <div id="companyAndCar">
          <el-tree
            show-checkbox
            node-key="id"
            :data="companiesAndCars"
            :props="defaultProps"
            @check="changeCheckstate"
            v-model="checkedList"
            :filter-node-method="filterNode"
            ref="tree"
          >
            <!-- <template slot="title">
              （{{ item.carnumbers.filter(filtercompaniesAndCars).length }} /
              {{ item.cars.length }}）
            </template> -->
          </el-tree>
        </div>
      </div>
    </div>
    <div id="CustomControl" style="padding: 7px"></div>
    <div id="switch" style="line-height: 30px">
      <span>跟随视角：</span>
      <el-switch v-model="followingView.isTrue"></el-switch>
    </div>
    <div id="change">
      <span>切换跟随车辆：</span>
      <el-button
        round
        size="mini"
        icon="el-icon-refresh"
        @click="changeFollowingCar"
      ></el-button>
    </div>
    <div id="search" v-show="searchTag"></div>
    <div id="searchCarList">
      <span style="inline-height:4.4vh">区域查车统计-{{ carLen }}辆</span>
      <el-button
        icon="el-icon-close"
        circle
        @click="remove"
        style="float:right"
      ></el-button>
      <el-table
        :data="tableData"
        height="250"
        stripe
        style="width: 100% "
        id="tableCon"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          prop="carNo"
          label="车牌号"
          width="80"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="terminalId"
          label="终端ID"
          width="100"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="uptime"
          label="定位时间"
          width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table>
    </div>
    <!-- 区域选车对话框 -->
    <el-dialog
      title="区域查车"
      :visible.sync="CarDialogVisible"
      width="30%"
      :modal-append-to-body="false"
      class="carDialog"
    >
      <div>
        <div id="position">
          <el-radio v-model="radio" label="1">定位查车</el-radio>
        </div>
        <div id="positionDate">
          <el-radio v-model="radio" label="2">定时定位查车</el-radio>
          <div id="datePicker">
            <el-date-picker
              v-model="startTime"
              type="datetime"
              default-value=""
              placeholder="选择开始时间"
              :picker-options="startPickerOptions"
              size="small"
            >
            </el-date-picker>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              placeholder="选择结束时间"
              :picker-options="endPickerOptions"
              size="small"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div id="shape">
        <span style="color:#004d99">区域类型</span>
        <div id="shapeRadio">
          <el-radio v-model="radio2" label="1" @change="getValue()"
            >矩形区域</el-radio
          >
          <el-radio v-model="radio2" label="2" @change="getValue()"
            >多边形区域</el-radio
          >
          <el-radio v-model="radio2" label="3" @change="getValue()"
            >圆形区域</el-radio
          >
        </div>
      </div>
      <div id="carFooter">
        <span slot="footer" class="dialog-footer">
          <el-button @click="CarDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm($event)">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :visible.sync="openupVideoDialog"
      append-to-body
      width="47%"
      height="15%"
      label-width="80px"
      @close="StopAll"
    >
      <div
        id="aaa"
        style="width:;height:55vh;background:#d3d3d3;margin:auto"
      ></div>
      <div style="margin-left:300px">
        <el-button @click="Init">初始化 </el-button>
        <el-button @click="StartPreview">开始播放</el-button>
        <el-button @click="StopAll">停止播放</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script
  type="text/javascript"
  src="http://219.151.22.122:8008/openapi/authservice/v1/config"
></script>
<script>
//引入Dialog可拖拽
import "../../assets/js/directives.js";
// 导入百度转84
import CoordinateUtil from "../../assets/js/bd092wgs84.js";
/* eslint-disable no-undef */
import {
  selectAllCompanyData,
  selectCarNoByCompany,
  // eslint-disable-next-line no-unused-vars
  // selectHTData,
  selectHTDataNew,
  selectREData2,
  selectcarnoByTerminalId,
  selectcarno,
  getRectangle,
  getCircle,
  getHisRectangle,
  getHisCircle,
  getPolygonRegiona,
  getHisPolygonRegiona,
  getVideo
} from "../../assets/axios/index";
import VideoPlayer from "../../assets/js/videoPlayer.js";
// 车辆实体类
class CarInstance {
  constructor(
    index = 0,
    name = "",
    dom = null,
    positionData = [],
    rotation = 0,
    state = false,
    dispaly = true,
    infoWindowDom = null
  ) {
    this.index = index; // 遍历的游标
    this.name = name; // 车辆名称
    this.dom = dom; // 对应 BaiduMap 中的dom节点
    this.positionData = positionData; // 轨迹数据
    this.rotation = rotation; // 车辆当前旋转角度
    this.state = state; // 是否读完所有轨迹
    this.dispaly = dispaly; // 是否显示
    this.infoWindowDom = infoWindowDom; // 存储信息窗dom节点
  }
  // 运动函数
  next() {
    this.index++;
    if (this.index >= this.positionData.length) {
      // 当前轨迹已读完
      this.state = true;
    } else {
      let { carLat: latA, carLong: lngA } = this.positionData[this.index - 1];
      let positionA = { lng: lngA, lat: latA };
      let { carLat: latB, carLong: lngB } = this.positionData[this.index];
      let positionB = { lng: lngB, lat: latB };
      let pt = new BMap.Point(lngB, latB);
      this.dom.setPosition(pt); // 渲染位置信息
      this.rotation = this.getRotation(positionA, positionB);
      this.dom.setRotation(this.rotation); // 渲染角度信息
      this.infoWindowDom.setContent(this.getMessageWindow());
    }
  }
  // 计算车头旋转角度
  getRotation(positionA, positionB) {
    var y = positionB.lng - positionA.lng;
    var x = positionB.lat - positionA.lat;
    var tanV = y / x;
    var angle = Math.atan(tanV);
    angle = (angle / Math.PI) * 180;
    if (x >= 0) {
      angle = angle - 90;
    } else {
      angle = angle - 270;
    }
    return angle;
  }
  // 返回渲染的信息窗口
  getMessageWindow() {
    let index = this.index;

    index = 0;
    // let curCar = this.positionData[index].carNo;
    this.positionData[index].carLong = parseFloat(
      this.positionData[index].carLong
    ).toFixed(4);
    this.positionData[index].carLat = parseFloat(
      this.positionData[index].carLat
    ).toFixed(4);
    let direct = this.positionData[index].direction;
    let tmp = direct / 90;
    if (tmp == 4 || tmp == 0) {
      direct = "正北";
    } else if (tmp > 3 && tmp < 4) {
      direct = "北偏西" + (360 - direct) + "度";
    } else if (tmp > 2 && tmp < 3) {
      direct = "南偏西" + (direct - 180) + "度";
    } else if (tmp > 1 && tmp < 2) {
      direct = "南偏东" + (180 - direct) + "度";
    } else if (tmp < 1) {
      direct = "北偏东" + direct + "度";
    } else if (tmp == 3) {
      direct = "正西";
    } else if (tmp == 2) {
      direct = "正南";
    } else {
      direct = "正东";
    }
    var address = "地址解析失败";
    let lat = this.positionData[index].carLat,
      lon = this.positionData[index].carLong;
    var geoc = new BMap.Geocoder();
    geoc.getLocation(new BMap.Point(lon, lat), result => {
      if (result) {
        this.addr = result.address;
      } else {
        this.addr = "地址解析失败";
      }
    });
    address = this.addr;

    // 车辆状态
    let status = this.positionData[index].status;
    // 1.空载还是重载
    let isEmpty = "";
    // 2.密闭还是打开
    let isOpen = "";
    // 3.平放还是举升
    let isFlat = "";
    let isEmpty0 = this.positionData[index].loadState;
    let isOpen0 = this.positionData[index].airtight;
    let isFlat0 = this.positionData[index].lift;
    if (isEmpty0 == 1) {
      isEmpty = "重载";
    } else if (isEmpty0 == 0) {
      isEmpty = "空载";
    } else {
      isEmpty = "未知";
    }
    if (isOpen0 == 1) {
      isOpen = "打开";
    } else if (isOpen0 == 0) {
      isOpen = "密闭";
    } else {
      isOpen = "未知";
    }
    if (isFlat0 == 1) {
      isFlat = "举升";
    } else if (isFlat0 == 0) {
      isFlat = "平放";
    } else {
      isFlat = "未知";
    }
    // if (!status) {
    //   isEmpty = "无数据";
    //   isOpen = "无数据";
    //   isFlat = "无数据";
    // } else {
    //   isEmpty = status[27] ? "重载" : "空载";
    //   isOpen = status[28] ? "打开" : "密闭";
    //   isFlat = status[29] ? "举升" : "平放";
    // }

    //   let dianwo=function(){

    // }
    return (
      // '<input type="button" id="btn" value="点我">'+
      '<button type="submit" id="btn" style="margin-bottom:5px"   >监控视频</button>' +
      `<p style="line-height: 8px"><span style="font-weight: bold;">车牌号：</span>${this.positionData[index].carno}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">速度：</span>${this.positionData[index].speed}km/h</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">经度：</span>${this.positionData[index].carLong}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">纬度：</span>${this.positionData[index].carLat}</p>` +
      // `<p style="line-height: 20px"><span style="font-weight: bold;">方向：</span>${this.positionData[index].direction}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">方向：</span>${direct}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">高度：</span>${this.positionData[index].height}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">车箱空载状态：</span>${isEmpty}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">车箱打开状态：</span>${isOpen}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">车箱平放状态：</span>${isFlat}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">轨迹ID：</span>${this.positionData[index].terminalId}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">详细地址：</span>${address}</p>` +
      `<p style="line-height: 8px"><span style="font-weight: bold;">上传时间：</span>${this.positionData[index].uptime}</p>`
    );
  }
  monitor() {}
}
export default {
  /* eslint-disable no-undef */
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      filterText: "",
      terminalId2carno: {},
      map: null, // 地图控件
      showingCompany: "", // 手风琴绑定
      companiesAndCars: [], // 右侧控制菜单渲染数据 companies And cars
      // ['深圳市万达建筑工程有限公司','深圳市永庆建设工程有限公司','深圳市万达建筑工程有限公司','深圳市安圳达运输有限公司','深圳市万达建筑工程有限公司','深圳市万达建筑工程有限公司','深圳市安圳达运输有限公司','深圳市隆盛建筑工程有限公司']
      // selectedCars:["鲁H18696","鲁H72H58","鲁H11J61","鲁H18K79","鲁H98E29","鲁H90K69","鲁H02J61","鲁H05K88","鲁H63E72","鲁H11J61","鲁H98E29","鲁H90K69","鲁H02S61","鲁H23J86","鲁H39J96","鲁H27J08","鲁H59E96","鲁H81G89","鲁H89H62","鲁H62E37","鲁H73F78","鲁H83E16","鲁H26B57","鲁H39C18","鲁H16D22","鲁H09C23","鲁H83B20","鲁H35E95","鲁H05E83","鲁H05E29","鲁HG1668","鲁H26J66","鲁H86J63","鲁H02H23","鲁H26J55","鲁H35E53","鲁H18E36","鲁H05E55","鲁H31D67","鲁H86J87","鲁H35R51","鲁H03U56","鲁H60Y77","鲁H92T26","鲁H50V60","鲁H77A98","鲁H65L99","鲁H98P58","鲁H89P88","鲁H18Z96","鲁H29T92","鲁H23Y57","鲁H07D89","鲁H12P37","鲁H77H76","鲁H76G81","鲁H77J81","鲁H13N53","鲁H17H59","鲁H61K65","鲁H07E08","鲁H31H73","鲁H17K69","鲁H05G58","鲁H17H51","鲁H07K80","鲁H15J88","鲁H62J86","鲁H50E11","鲁H00J03","鲁H39G88","鲁H37K17","鲁H02F31","鲁H07E79","鲁H59K98","鲁H30F00","鲁H77K95","鲁H35F78","鲁H67E80","鲁H27E29","鲁H85G39","鲁H70H37","鲁H52J35","鲁H73H71","鲁H32G08","鲁H95J19","鲁H19H93","鲁H88E36","鲁H89E02","鲁H29E53","鲁H23G40","鲁H52M52","鲁H31G83","鲁H91G12","鲁H29N95","鲁H26T62","鲁H70P22","鲁H06Y59","鲁H96L37","鲁H73N66","鲁HJ9035","鲁H17N78","鲁H50N07","鲁H27T33","鲁H99X37","鲁HH5137","鲁H21T06","鲁H08R86","鲁H25V09","鲁H17Z98","鲁H31X91","鲁H00M86","鲁H20M17","鲁H01Y59","鲁H55S82","鲁H26T31","鲁H05D11","鲁H87R58","鲁HC3029","鲁H35W20","鲁H81U13","鲁H03N10","鲁H60Q02","鲁H10C05","鲁H71W05","鲁H28Z92","鲁H82N86","鲁H01E05","鲁H39F27","鲁H79J06","鲁H00J35","鲁H60A87","鲁H87A55","鲁H83D81","鲁H55B51","鲁H09A71","鲁H07T17","鲁H82B50","鲁H17C23","鲁H03A65","鲁H37R89","鲁H81R25","鲁H00U21","鲁H25P27","鲁H78L81","鲁HQ9276","鲁HD9222","鲁HD9010","鲁H20A33","鲁H03C49","鲁H46C61","鲁H40A66","鲁H32D03","鲁H12C34","鲁H10D30","鲁H26D13","鲁H30R15"],
      // checkedList:["鲁H18696","鲁H72H58","鲁H11J61","鲁H18K79","鲁H98E29","鲁H90K69","鲁H02J61","鲁H05K88","鲁H63E72","鲁H11J61","鲁H98E29","鲁H90K69","鲁H02S61","鲁H23J86","鲁H39J96","鲁H27J08","鲁H59E96","鲁H81G89","鲁H89H62","鲁H62E37","鲁H73F78","鲁H83E16","鲁H26B57","鲁H39C18","鲁H16D22","鲁H09C23","鲁H83B20","鲁H35E95","鲁H05E83","鲁H05E29","鲁HG1668","鲁H26J66","鲁H86J63","鲁H02H23","鲁H26J55","鲁H35E53","鲁H18E36","鲁H05E55","鲁H31D67","鲁H86J87","鲁H35R51","鲁H03U56","鲁H60Y77","鲁H92T26","鲁H50V60","鲁H77A98","鲁H65L99","鲁H98P58","鲁H89P88","鲁H18Z96","鲁H29T92","鲁H23Y57","鲁H07D89","鲁H12P37","鲁H77H76","鲁H76G81","鲁H77J81","鲁H13N53","鲁H17H59","鲁H61K65","鲁H07E08","鲁H31H73","鲁H17K69","鲁H05G58","鲁H17H51","鲁H07K80","鲁H15J88","鲁H62J86","鲁H50E11","鲁H00J03","鲁H39G88","鲁H37K17","鲁H02F31","鲁H07E79","鲁H59K98","鲁H30F00","鲁H77K95","鲁H35F78","鲁H67E80","鲁H27E29","鲁H85G39","鲁H70H37","鲁H52J35","鲁H73H71","鲁H32G08","鲁H95J19","鲁H19H93","鲁H88E36","鲁H89E02","鲁H29E53","鲁H23G40","鲁H52M52","鲁H31G83","鲁H91G12","鲁H29N95","鲁H26T62","鲁H70P22","鲁H06Y59","鲁H96L37","鲁H73N66","鲁HJ9035","鲁H17N78","鲁H50N07","鲁H27T33","鲁H99X37","鲁HH5137","鲁H21T06","鲁H08R86","鲁H25V09","鲁H17Z98","鲁H31X91","鲁H00M86","鲁H20M17","鲁H01Y59","鲁H55S82","鲁H26T31","鲁H05D11","鲁H87R58","鲁HC3029","鲁H35W20","鲁H81U13","鲁H03N10","鲁H60Q02","鲁H10C05","鲁H71W05","鲁H28Z92","鲁H82N86","鲁H01E05","鲁H39F27","鲁H79J06","鲁H00J35","鲁H60A87","鲁H87A55","鲁H83D81","鲁H55B51","鲁H09A71","鲁H07T17","鲁H82B50","鲁H17C23","鲁H03A65","鲁H37R89","鲁H81R25","鲁H00U21","鲁H25P27","鲁H78L81","鲁HQ9276","鲁HD9222","鲁HD9010","鲁H20A33","鲁H03C49","鲁H46C61","鲁H40A66","鲁H32D03","鲁H12C34","鲁H10D30","鲁H26D13","鲁H30R15"],
      selectedCars: [],
      checkedList: [],
      // 存放多选框选中的车辆
      array: [],

      // 区域查车

      //   返回的点坐标  圆心，半径，其他形状用数组
      centerPoint: "",
      radius: "",
      pointArr: [],
      //   查到的车辆数
      carLen: "",

      CarDialogVisible: false,
      radio: "1",
      radio2: "1",
      //   时间选择
      startTime: "",
      endTime: "",
      startPickerOptions: {
        disabledDate: time => {
          if (this.endTime) {
            return (
              time.getTime() > new Date(this.endTime).getTime() ||
              time.getTime() <
                new Date(this.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        }
      },
      endPickerOptions: {
        disabledDate: time => {
          if (this.startTime) {
            return (
              time.getTime() < new Date(this.startTime).getTime() ||
              time.getTime() >
                new Date(this.startTime).getTime() + 1 * 24 * 60 * 60 * 1000
            );
          }
        }
      },
      //   绘制样式
      styleOptions: {
        strokeColor: "black", //边线颜色。
        fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      },
      //   鼠标绘制工具
      myDrawingManager: {},
      //   控制搜出的车的显示与否
      searchTag: true,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      // 点聚合需要
      markers: [],
      markerClusterer: "",
      companyArray: [],
      carInstances: {}, // 渲染队列
      followingView: { isTrue: false, carName: "鲁H73B77", key: 0 }, // 跟随视角
      timer: null,
      addcar_timer: null,
      // Loading 遮罩层
      loading: true,
      // 更新的车辆信息
      rawData: [],
      addr: "",
      // 是否有数据添加
      // flag: 0,
      select_carId: "",
      // 公司在线车辆
      online: [],
      // 上一次选中的array长度
      last_tmplen: 0,
      //******************************************车载监控 **************************************/
      openupVideoDialog: false,
      videoPlayer: "",
      signName: "",
      token: "",
      carList: [],
      selectedCarNo: "",
      carNoList: [
        "鲁H29T92",
        "鲁H18Z96",
        "鲁H09W07",
        "鲁H70U13",
        "鲁H28Z92",
        "鲁H68Z82",
        "鲁H03N19",
        "鲁H23H13",
        "鲁H31N73",
        "鲁H25N73",
        "鲁H53N56",
        "鲁H35N37",
        "鲁H18U71",
        "鲁H18W22",
        "鲁H15L72"
      ],
      selectCar: false,
      data: "",
      curCar: ""
    };
  },
  created: function() {
    // 初始化页面数据
    this.initData();
    //this.getSign();
    //  this.getSign();
    // this.Init();
  },
  mounted: function() {
    // 初始化百度地图
    this.initBaiDuMap();
  },
  beforeRouteLeave(to, from, next) {
    // 离开路由前清除定时器
    // clearInterval(this.addcar_timer)
    clearInterval(this.timer);
    next();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //   区域选车方法区域*********************************************************************
    getValue() {
      console.log(this.radio2);
    },

    // 确定按钮的功能
    confirm(event) {
      this.CarDialogVisible = false;
      console.log("开始画图");
      //   console.log(this.radio2);
      //   console.log(typeof this.$moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"));
      this.startTime =
        this.$moment(this.startTime)
          .format("YYYY-MM-DD HH:mm:ss")
          .slice(0, 10) +
        " " +
        this.$moment(this.startTime)
          .format("YYYY-MM-DD HH:mm:ss")
          .slice(11, 20);
      this.endTime =
        this.$moment(this.endTime)
          .format("YYYY-MM-DD HH:mm:ss")
          .slice(0, 10) +
        " " +
        this.$moment(this.endTime)
          .format("YYYY-MM-DD HH:mm:ss")
          .slice(11, 20);
      this.myDrawingManager.open();
      if (this.radio2 == 1) {
        //   矩形
        this.myDrawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
      } else if (this.radio2 == 2) {
        this.myDrawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
      } else if (this.radio2 == 3) {
        this.myDrawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
      }
    },
    overlaycomplete(e) {
      console.log("完成绘制");
      this.myDrawingManager.close();
      this.searchTag = true;
      if (this.radio == 1) {
        if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
          const res = CoordinateUtil.getWgs84xy(
            e.overlay.getCenter().lng,
            e.overlay.getCenter().lat
          );
          getCircle(res.lat, res.lng, e.overlay.getRadius()).then(res => {
            this.tableData = res.data.respBody;
            this.carLen = this.tableData.length;
            console.log(res);
          });
          // console.log("圆心是", e.overlay.getCenter());
          // console.log("半径是", e.overlay.getRadius());
        } else if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
          var path = e.overlay.getPath();
          let res = [];
          res.push(CoordinateUtil.getWgs84xy(path[0].lng, path[0].lat));
          res.push(CoordinateUtil.getWgs84xy(path[2].lng, path[2].lat));
          getRectangle(res[1].lat, res[1].lng, res[0].lat, res[0].lng).then(
            res => {
              this.tableData = res.data.respBody;
              this.carLen = this.tableData.length;
              console.log(this.tableData);
            }
          );

          console.log("获取的点是", res);
        } else if (e.drawingMode == BMAP_DRAWING_POLYGON) {
          var path = e.overlay.getPath();
          var data = [];
          path.forEach(item => {
            data.push({ lat: item.lat, lng: item.lng });
          });
          var data1 = JSON.stringify(data);
          console.log(data1);
          getPolygonRegiona(data1).then(res => {
            this.tableData = res.data.respBody;
            this.carLen = this.tableData.length;
            console.log(this.tableData);
          });
        }
      } else if (this.radio == 2) {
        if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
          const res = CoordinateUtil.getWgs84xy(
            e.overlay.getCenter().lng,
            e.overlay.getCenter().lat
          );
          getHisCircle(
            res.lat,
            res.lng,
            this.endTime,
            e.overlay.getRadius(),
            this.startTime
          ).then(res => {
            this.tableData = res.data.respBody;
            this.carLen = this.tableData.length;
            console.log(res);
          });
        } else if (e.drawingMode == BMAP_DRAWING_RECTANGLE) {
          var path = e.overlay.getPath();
          let res = [];
          res.push(CoordinateUtil.getWgs84xy(path[0].lng, path[0].lat));
          res.push(CoordinateUtil.getWgs84xy(path[2].lng, path[2].lat));
          getHisRectangle(
            res[1].lat,
            res[1].lng,
            this.endTime,
            res[0].lat,
            res[0].lng,
            this.startTime
          ).then(res => {
            this.tableData = res.data.respBody;
            this.carLen = this.tableData.length;
            console.log(this.tableData);
          });

          console.log("获取的点是", res);
        } else if (e.drawingMode == BMAP_DRAWING_POLYGON) {
          var path = e.overlay.getPath();
          var data = [];
          path.forEach(item => {
            data.push({ lat: item.lat, lng: item.lng });
          });
          var data1 = JSON.stringify(data);
          console.log(data1);
          getHisPolygonRegiona(this.endTime, this.startTime, data1).then(
            res => {
              //   console.log(res);
              this.tableData = res.data.respBody;
              this.carLen = this.tableData.length;
              console.log(this.tableData);
            }
          );
        }
      }
    },
    remove() {
      this.searchTag = false;
      this.map.clearOverlays();
      this.tableData = [];
    },
    // **************************************************************************************
    filterNode(value, data) {
      // 如果什么都没填就直接返回
      //if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      //if (data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) return true;
      // 否则要去判断它是不是选中节点的子节点
      //return this.checkBelongToChooseNode(value, data, node);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 初始化百度地图
    initBaiDuMap: function() {
      // let _this = this
      this.map = new BMap.Map("bm-view"); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(116.521832, 35.402216), 10); // 初始化地图,设置中心点坐标和地图级别
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
      );
      // 添加比例尺-左上角
      let scaleControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      });
      this.map.addControl(scaleControl);
      // 添加缩放平移-左上角
      let navigationControl = new BMap.NavigationControl();
      this.map.addControl(navigationControl);
      // 添加城市列表-右下角
      let offset = new BMap.Size(10, 20);
      this.map.addControl(
        new BMap.CityListControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          offset: offset
        })
      );

      // 添加自定义视角跟随控件
      // 定义一个控件类
      function ZoomControl() {
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new BMap.Size(10, 60);
      }
      // 通过JavaScript的prototype属性继承于BMap.Control
      ZoomControl.prototype = new BMap.Control();

      // 自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
      // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
      ZoomControl.prototype.initialize = function(map) {
        // 创建一个dom元素
        let div = document.getElementById("CustomControl");
        // 子元素1：控制是否开启跟随视角
        let e1 = document.getElementById("switch");
        div.appendChild(e1);
        // 子元素2：切换跟随车辆
        let e2 = document.getElementById("change");
        div.appendChild(e1);
        div.appendChild(e2);
        // 设置样式
        div.style.boxShadow = "2px 4px 6px 2px rgba(27, 142, 236, 0.7)";
        div.style.borderRadius = "2px";
        div.style.background = "transparent";
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
      };
      // 创建控件元素
      var myZoomCtrl = new ZoomControl();
      // 添加到地图中
      this.map.addControl(myZoomCtrl);
      // 区域查车*********************************
      function CarListControl() {
        (this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT),
          (this.defaultOffset = new BMap.Size(10, 60));
      }
      CarListControl.prototype = new BMap.Control();
      CarListControl.prototype.initialize = function(map) {
        let div = document.getElementById("search");
        let e = document.getElementById("searchCarList");
        div.appendChild(e);
        div.style.boxShadow = "2px 4px 6px 2px rgba(27, 142, 236, 0.7)";
        div.style.borderRadius = "2px";
        div.style.background = "transparent";
        // div.style.width = "500px"
        // div.style.height = "500px"
        map.getContainer().appendChild(div);
        return div;
      };
      var carListCtrl = new CarListControl();
      this.map.addControl(carListCtrl);
      //   加载完隐藏
      this.searchTag = false;
      //   *************************
      this.map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      this.map.enableInertialDragging(); // 启用地图惯性拖拽
      this.map.enableContinuousZoom(); // 开启连续缩放效果
      //   点聚合类
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });
      //   区域查车***************************************************
      this.myDrawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        // enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5) //偏离值
        },
        circleOptions: this.styleOptions, //圆的样式
        polylineOptions: this.styleOptions, //线的样式
        polygonOptions: this.styleOptions, //多边形的样式
        rectangleOptions: this.styleOptions //矩形的样式
      });
      this.myDrawingManager.addEventListener(
        "overlaycomplete",
        this.overlaycomplete
        // this.map.addEventListener("rightclick", function(e) {this.map.removeOverlay(e);})
      );
      //   *************************************************
    },
    // 全选框
    handleChange: function(val) {
      // console.log('kkkkk',val)
    },
    // 过滤出指定公司在线车辆
    filtercompaniesAndCars: function(caritem) {
      return this.online.includes(caritem);
      // return true
    },
    debounce: function(func, wait) {
      let timer;
      return function() {
        let context = this; // 注意 this 指向
        let args = arguments; // arguments中存着e

        if (timer) clearInterval(timer);

        timer = setInterval(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    // 初始化数据请求以渲染右侧表格 (selectCompany -> selectCars)
    initData: async function() {
      // 获取公司数据
      selectAllCompanyData(false)
        .then(res => {
          // 获取car_info表数据
          selectcarno()
            .then(res => {
              let tmp = JSON.parse(JSON.stringify(res.data.respBody));
              for (let i = 0; i < tmp.length; i++) {
                this.terminalId2carno[tmp[i].terminalId] = tmp[i].carNo;
              }
            })
            .then(() => {
              // 获取实时表数据加入初始渲染列表
              selectREData2()
                .then(res => {
                  let rawDatatmp = JSON.parse(
                    JSON.stringify(res.data.respBody)
                  );
                  for (let i = 0; i < rawDatatmp.length; i++) {
                    // 去掉acc=0
                    // if(rawDatatmp[i].acc>0){
                    // 不去掉
                    // if(rawDatatmp[i].acc>0){
                    if (!rawDatatmp[i].carno) {
                      // rawDatatmp[i].carno=this.terminalId2carno[rawDatatmp[i].terminalId]
                      let tmpid = this.terminalId2carno[
                        rawDatatmp[i].terminalId
                      ];
                      if (tmpid != "") {
                        // 初始化进入页面为空白，无车辆加载
                        // this.selectedCars.push(tmpid)
                        // this.checkedList.push(tmpid)
                        // 初始化在线车辆数(除去离线和无数据的车辆)
                        let carnumber = tmpid;
                        let updatetime = Date.parse(rawDatatmp[i].uptime);
                        let now = Date.now() - 5 * 60 * 1000;
                        if (updatetime >= now) {
                          this.online.push(carnumber);
                        }
                      }
                    } else {
                      // 初始化进入页面为空白，无车辆加载
                      // this.selectedCars.push(rawDatatmp[i].carno)
                      // this.checkedList.push(rawDatatmp[i].carno)
                      // 初始化在线车辆数(除去离线和无数据的车辆)
                      let carnumber = rawDatatmp[i].carno;
                      let updatetime = Date.parse(rawDatatmp[i].uptime);
                      if (carnumber == "鲁H10Y58") {
                        //console.log("=====================================");
                        //console.log(updatetime);
                        //console.log(rawDatatmp[i]);
                      }
                      let now = Date.now() - 5 * 60 * 1000;
                      if (updatetime >= now) {
                        this.online.push(carnumber);
                      }
                    }

                    // }
                  }
                  // console.log(this.online)

                  for (let carName of this.online) {
                    for (let item of this.companiesAndCars) {
                      if (item.carnumbers.includes(carName)) {
                        //this.label=this.companiesAndCars.companyName;
                        item.ischecked[carName] = "true";
                      }
                    }
                  }
                })
                .then(() => {
                  // this.run();
                  //     });
                  // });

                  let rawData = JSON.parse(JSON.stringify(res.data.respBody));
                  for (let i = 0; i < rawData.length; i++) {
                    if (rawData[i].carCompanyName) {
                      let { carCompanyId, carCompanyName } = rawData[i];
                      // 获取公司下车辆数据
                      selectCarNoByCompany(carCompanyName, false).then(res2 => {
                        let rawData2 = JSON.parse(
                          JSON.stringify(res2.data.respBody)
                        );

                        let carnumbers = [],
                          ischecked = {},
                          rawData2tmp = [];
                        for (let i = 0; i < rawData2.length; i++) {
                          rawData2[i].id = rawData2[i].terminalId;
                          rawData2[i].label = rawData2[i].carNo + "(OFF)";
                          // rawData2[i].disabled = true;
                          if (!carnumbers.includes(rawData2[i].carNo)) {
                            carnumbers.push(rawData2[i].carNo);
                            ischecked[rawData2[i].carNo] = "false";
                            rawData2tmp.push(rawData2[i]);
                          }
                        }
                        rawData2 = JSON.parse(JSON.stringify(rawData2tmp));
                        if (rawData2.length) {
                          let onlinelabel =
                            carCompanyName +
                            "（" +
                            carnumbers.filter(this.filtercompaniesAndCars)
                              .length +
                            "/" +
                            rawData2.length +
                            "）";

                          this.companiesAndCars.push({
                            id: carCompanyId,
                            // companyName: carCompanyName,
                            label: onlinelabel,
                            // cars: rawData2,
                            children: rawData2,
                            carnumbers: carnumbers,
                            ischecked: ischecked
                          });
                        }
                        for (let carName of this.online) {
                          for (let item of this.companiesAndCars) {
                            if (item.carnumbers.includes(carName)) {
                              for (let carno of item.children) {
                                if (carno.label.indexOf(carName) != -1) {
                                  // carno.disabled = false;
                                  carno.label = carno.label.slice(0, 7);
                                } else {
                                  // carno.disabled=true
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  }

                  this.run();
                });
            });
        })
        .catch(e => {
          console.log("initData方法出错：", e.message);
        });
    },
    // 自定义百度地图组件中绑定的切换跟随车辆的方法
    changeFollowingCar: function() {
      let _this = this;
      let validArray = [];
      for (let key in _this.carInstances) {
        if (_this.carInstances[key].dispaly) {
          validArray.push(_this.carInstances[key].name);
        }
      }
      let finalKey = _this.followingView.key % validArray.length;
      _this.followingView.carName = validArray[finalKey];
      _this.followingView.key++;
    },
    // 点聚合方法
    markerClustererProduct() {
      //   this.map.clearOverlays();
      this.markerClusterer.clearMarkers(this.markers);
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });

      //   console.log("点聚合", this.markers);
    },
    // 增加车辆到渲染队列
    addCar: async function(carName) {
      // if (this.online.includes(carName)) {
      if (1) {
        let _this = this;
        // 根据渲染队列是否存在车辆选择方法
        if (carName in this.carInstances) {
          // 已经存在，调用dom中显示方法
          // console.log(carName, '隐身——> 显示')
          _this.carInstances[carName].dom.show();
          _this.carInstances[carName].dom.dispaly = true;
          if (
            _this.cnki(_this.markers, _this.carInstances[carName].name) == 0
          ) {
            _this.markers.push(_this.carInstances[carName].dom); //点聚合
          }
          _this.markerClustererProduct();
          let rawData = [];
          for (let i = 0; i < _this.rawData.length; i++) {
            // 去掉acc=0
            // if(_this.rawData[i].carno==carName && _this.rawData[i].acc>0){
            // 不去掉
            if (_this.rawData[i].carno == carName) {
              rawData.push(_this.rawData[i]);
            }
          }

          if (
            JSON.stringify(rawData).indexOf("carLat") != -1 &&
            parseInt(rawData[0].carLat) !== 0 &&
            parseInt(rawData[0].carLong) !== 0
          ) {
            _this.carInstances[carName].positionData = rawData;
            let { carLat, carLong, direction } = _this.carInstances[
              carName
            ].positionData[0];
            let pt = new BMap.Point(carLong, carLat);
            _this.carInstances[carName].dom.setPosition(pt);
            _this.carInstances[carName].dom.setRotation(direction + 90);
            _this.carInstances[carName].dom.setTitle(carName); // 设置车辆Title,hover显示Title

            // _this.flag = 1;
          } else {
            for (let item of _this.companiesAndCars) {
              if (item.carnumbers.includes(carName)) {
                item.ischecked[carName] = "false";
              }
            }
          }

          // 为小车添加点击相应的信息窗并赋值信息窗dom节点
          let opts = {
            width: 280, // 信息窗口宽度
            height: 290, // 信息窗口高度
            offset: { width: 8, height: -8 } // 偏移量
            // title: `<h2>${carName}</h2>` // 信息窗口标题
          };
          if (
            JSON.stringify(_this.carInstances[carName].positionData).indexOf(
              "carLat"
            ) != -1
          ) {
            let infoWindow = new BMap.InfoWindow(
              _this.carInstances[carName].getMessageWindow(),
              opts
            ); // 创建信息窗口对象

            //**********@##$%%^&&**************************@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
            infoWindow.disableAutoPan(); // 关闭打开信息窗时自动平移
            _this.carInstances[carName].infoWindowDom = infoWindow;
            _this.carInstances[carName].dom.addEventListener(
              "click",
              function() {
                _this.carInstances[carName].dom.openInfoWindow(infoWindow); // 开启信息窗口

                if (!infoWindow.isOpen()) {
                  //如果没有打开，则监听打开事件，获取按钮，添加事件
                  infoWindow.addEventListener("open", function(e) {
                    document.getElementById("btn").onclick = function() {
                      // alert(77777777777);
                      console.log("开启了1");
                      _this.openupVideoDialog = true;
                      _this.getSign();
                      _this.Init();
                    };
                  });
                } else {
                  //如果没有打开，则监听打开事件，获取按钮，添加事件
                  // document.getElementById("btn").onclick = function (e) {
                  //   that.openVideoDialog();

                  // }
                  document.getElementById("btn").onclick = function() {
                    console.log("点击1");
                    if (_this.carNoList.indexOf(_this.curCar) != -1) {
                      _this.openupVideoDialog = true;
                      _this.getSign();
                    } else {
                      _this.$message({
                        message: "该车辆还没有安装视频",
                        type: "warning"
                      });
                    }
                    //  _this.Init();
                  }; // 渲染信息窗内容
                }
              }
            );
          }
        } else {
          // 不存在，新增车辆到渲染队列
          // console.log(carName, '新建到队列')
          // 小车图标 (anchor:偏移量，保证车辆中心对应坐标点)
          let myIcon = new BMap.Icon(
            "../../../static/img/bus_purple_s.png",
            new BMap.Size(52, 26),
            { anchor: new BMap.Size(21.5, 10) }
          );
          // 创建Marker标注，使用小车图标
          let pt = new BMap.Point(0, 0);

          let rawData = [];
          for (let i = 0; i < _this.rawData.length; i++) {
            // 去掉acc=0
            // if(_this.rawData[i].carno==carName && _this.rawData[i].acc>0){
            // 不去掉
            if (_this.rawData[i].carno == carName) {
              rawData.push(_this.rawData[i]);
            }
          }

          // var nowtime = Date.parse(new Date());
          if (
            JSON.stringify(rawData).indexOf("carLat") != -1 &&
            parseInt(rawData[0].carLat) !== 0 &&
            parseInt(rawData[0].carLong) !== 0
          ) {
            var updatetime = Date.parse(rawData[0].uptime);
            var now = Date.now() - 5 * 60 * 1000;
            if (rawData[0].speed <= 5 && updatetime > now) {
              let myIcon_stop = new BMap.Icon(
                "../../../static/img/bus_yellow_s.png",
                new BMap.Size(52, 26),
                { anchor: new BMap.Size(21.5, 10) }
              );
              // _this.map.removeOverlay(_this.carInstances[carName].dom);
              // _this.carInstances[carName] = new CarInstance(0, carName, new BMap.Marker(pt, { icon: myIcon_stop }), [], 0, false, true)
              let pt = new BMap.Point(0, 0);
              _this.carInstances[carName] = new CarInstance(
                0,
                carName,
                new BMap.Marker(pt, { icon: myIcon_stop }),
                [],
                0,
                false,
                true
              );
              for (var i = 0; i < this.markers.length; i++) {}
              _this.carInstances[carName].dom.carName =
                _this.carInstances[carName].name;
              if (
                _this.cnki(_this.markers, _this.carInstances[carName].name) == 0
              ) {
                _this.markers.push(_this.carInstances[carName].dom); //点聚合
              } //点聚合
              _this.markerClustererProduct();
              _this.map.addOverlay(_this.carInstances[carName].dom);
            } else if (rawData[0].speed >= 80 && updatetime > now) {
              let myIcon_over = new BMap.Icon(
                "../../../static/img/bus_orange_s.png",
                new BMap.Size(52, 26),
                { anchor: new BMap.Size(21.5, 10) }
              );
              // _this.map.removeOverlay(_this.carInstances[carName].dom);
              let pt = new BMap.Point(0, 0);
              _this.carInstances[carName] = new CarInstance(
                0,
                carName,
                new BMap.Marker(pt, { icon: myIcon_over }),
                [],
                0,
                false,
                true
              );
              _this.carInstances[carName].dom.carName =
                _this.carInstances[carName].name;
              if (
                _this.cnki(_this.markers, _this.carInstances[carName].name) == 0
              ) {
                _this.markers.push(_this.carInstances[carName].dom); //点聚合
              } //点聚合
              _this.markerClustererProduct();
              _this.map.addOverlay(_this.carInstances[carName].dom);
            } else if (updatetime < now) {
              let myIcon_offline = new BMap.Icon(
                "../../../static/img/bus_gray_s.png",
                new BMap.Size(52, 26),
                { anchor: new BMap.Size(21.5, 10) }
              );
              // _this.map.removeOverlay(_this.carInstances[carName].dom);
              let pt = new BMap.Point(0, 0);
              _this.carInstances[carName] = new CarInstance(
                0,
                carName,
                new BMap.Marker(pt, { icon: myIcon_offline }),
                [],
                0,
                false,
                true
              );
              _this.carInstances[carName].dom.carName =
                _this.carInstances[carName].name;
              if (
                _this.cnki(_this.markers, _this.carInstances[carName].name) == 0
              ) {
                _this.markers.push(_this.carInstances[carName].dom); //点聚合
              } //点聚合
              _this.markerClustererProduct();
              _this.map.addOverlay(_this.carInstances[carName].dom);
            } else {
              let myIcon_online = new BMap.Icon(
                "../../../static/img/bus_purple_s.png",
                new BMap.Size(52, 26),
                { anchor: new BMap.Size(21.5, 10) }
              );
              let pt = new BMap.Point(0, 0);
              _this.carInstances[carName] = new CarInstance(
                0,
                carName,
                new BMap.Marker(pt, { icon: myIcon_online }),
                [],
                0,
                false,
                true
              );
              _this.carInstances[carName].dom.carName =
                _this.carInstances[carName].name;
              if (
                _this.cnki(_this.markers, _this.carInstances[carName].name) == 0
              ) {
                _this.markers.push(_this.carInstances[carName].dom); //点聚合
              } //点聚合
              _this.markerClustererProduct();
              _this.map.addOverlay(_this.carInstances[carName].dom);
            }
            _this.carInstances[carName].positionData = rawData;
            let { carLat, carLong, direction } = _this.carInstances[
              carName
            ].positionData[0];
            let pt = new BMap.Point(carLong, carLat);
            _this.carInstances[carName].dom.setPosition(pt);
            _this.carInstances[carName].dom.setRotation(direction + 90);
            _this.carInstances[carName].dom.setTitle(carName); // 设置车辆Title,hover显示Title
            // }

            // 为小车添加点击相应的信息窗并赋值信息窗dom节点
            let opts = {
              width: 280, // 信息窗口宽度
              height:290, // 信息窗口高度
              offset: { width: 8, height: -8 } // 偏移量
              // title: `<h2>${carName}</h2>` // 信息窗口标题
            };
            if (
              JSON.stringify(_this.carInstances[carName].positionData).indexOf(
                "carLat"
              ) != -1
            ) {
              let infoWindow = new BMap.InfoWindow(
                _this.carInstances[carName].getMessageWindow(),
                opts
              ); // 创建信息窗口对象
              infoWindow.disableAutoPan(); // 关闭打开信息窗时自动平移
              _this.carInstances[carName].infoWindowDom = infoWindow;
              _this.carInstances[carName].dom.addEventListener(
                "click",
                function() {
                  console.log(_this.carInstances[carName]);
                  _this.curCar = _this.carInstances[carName].name;
                  _this.carInstances[carName].dom.openInfoWindow(infoWindow); // 开启信息窗口

                  if (!infoWindow.isOpen()) {
                    //如果没有打开，则监听打开事件，获取按钮，添加事件
                    infoWindow.addEventListener("open", function(e) {
                      document.getElementById("btn").onclick = function() {
                        // alert(77777777777);
                        console.log("开启了2");
                        _this.openupVideoDialog = true;
                        _this.getSign();
                      };
                    });
                  } else {
                    document.getElementById("btn").onclick = function() {
                      console.log("点击2");
                      if (_this.carNoList.indexOf(_this.curCar) != -1) {
                        _this.openupVideoDialog = true;
                        _this.getSign();
                        // _this.Init();
                      } else {
                        _this.$message({
                          message: "该车辆还没有安装视频",
                          type: "warning"
                        });
                      }

                      //  _this.Init();
                    }; // 渲染信息窗内容
                  }
                }
              );
              //*****************************************监控 */
              //     dianwo(){
              //    let that = this;

              //           };
              //****************************************** */
              // _this.flag = 1;
            } else {
              for (let item of _this.companiesAndCars) {
                if (item.carnumbers.includes(carName)) {
                  item.ischecked[carName] = "false";
                }
              }
            }
          }
        }
      }
    },
    // 删除数组元素
    removeByVal(arrylist, val) {
      for (var i = 0; i < arrylist.length; i++) {
        if (arrylist[i].carName == val) {
          arrylist.splice(i, 1);
          break;
        }
      }
    },
    // 检查数组是否已经含有某值
    cnki(arrylist, val) {
      let flag = 0;
      for (var i = 0; i < arrylist.length; i++) {
        if (arrylist[i].carName == val) {
          flag = 1;
        }
      }
      return flag;
    },
    // 减少车辆从渲染队列
    removeCar: function(carName) {
      if (carName in this.carInstances) {
        this.carInstances[carName].dom.hide();
        this.carInstances[carName].dom.dispaly = false;
        this.removeByVal(this.markers, carName);
        this.markerClustererProduct();
      } else {
      }
      if (carName === this.followingView.carName) {
        this.changeFollowingCar(this);
      }
    },
    // 驱动函数
    run: async function() {
      let _this = this;

      this.addcar_timer = setInterval(() => {
        selectREData2()
          .then(res => {
            this.online = [];
            let rawDatatmp = JSON.parse(JSON.stringify(res.data.respBody));
            let rawData = [];
            for (let i = 0; i < rawDatatmp.length; i++) {
              if (!rawDatatmp[i].carno) {
                rawDatatmp[i].carno =
                  _this.terminalId2carno[rawDatatmp[i].terminalId];
              }
              // if(rawDatatmp[i].carno==carName && rawDatatmp[i].acc>0){
              //   rawData.push(rawDatatmp[i])
              // }
              let carnumber = rawDatatmp[i].carno;
              let updatetime = Date.parse(rawDatatmp[i].uptime);
              let now = Date.now() - 5 * 60 * 1000;
              // if(updatetime>=now && rawDatatmp[i].lon && rawDatatmp[i].lat){
              if (updatetime >= now) {
                this.online.push(carnumber);
              }
            }
            for (let item of this.companiesAndCars) {
              for (let caritem of item.children) {
                caritem.label = caritem.label.slice(0, 7) + "(OFF)";
                // caritem.disabled = true;
              }
            }

            for (let item of this.companiesAndCars) {
              let onlinecount = 0,
                startindex = item.label.indexOf("（");
              for (let carName of this.online) {
                if (item.carnumbers.includes(carName)) {
                  for (let carno of item.children) {
                    if (carno.label.indexOf(carName) != -1) {
                      // carno.disabled = false;
                      carno.label = carno.label.slice(0, 7);
                      onlinecount++;
                      break;
                    }
                  }
                }
              }
              item.label =
                item.label.slice(0, startindex) +
                "（" +
                onlinecount +
                "/" +
                item.children.length +
                "）";
            }

            rawData = JSON.parse(
              JSON.stringify(rawDatatmp)
                .replace(/lat/g, "carLat")
                .replace(/lon/g, "carLong")
            );
            for (let i = 0; i < rawData.length; ++i) {
              // 坐标转换
              let { carLong: rawLng, carLat: rawLat } = rawData[i];
              let { lat, lng } = this.wgs2bd(rawLat, rawLng);
              rawData[i].carLong = lng;
              rawData[i].carLat = lat;
              // 时间格式规范
              rawData[i].uptime = this.$moment(rawData[i].uptime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            }
            this.rawData = JSON.parse(JSON.stringify(rawData));
            // if(JSON.stringify(rawData).indexOf('carLat')!=-1){
            //   _this.carInstances[carName].positionData = rawData
            //   let { carLat, carLong , direction} = _this.carInstances[carName].positionData[0]
            //   let pt = new BMap.Point(carLong,carLat)
            //   _this.carInstances[carName].dom.setPosition(pt)
            //   _this.carInstances[carName].dom.setRotation(direction)
            //   _this.carInstances[carName].dom.setTitle(carName) // 设置车辆Title,hover显示Title
            // }

            // 初始化遍历原始数组，渲染队列
            this.selectedCars.map(carName => {
              this.addCar(carName);
            });
          })
          .then(() => {
            this.loading = false;
            // // 初始化遍历原始数组，渲染队列
            // this.selectedCars.map((carName) => {
            //   _this.addCar(carName)
            // })

            // // 选择框状态为true
            // for(let item of this.companiesAndCars){
            //   for(let key in item.ischecked){
            //     item.ischecked[key]='true'
            //   }
            // }
          });
      }, 10000);
      // 开始运行
      _this.timer = setInterval(() => {
        for (let key in _this.carInstances) {
          // 跟随视角方法
          if (
            _this.followingView.isTrue &&
            _this.followingView.carName === key &&
            _this.carInstances[key].dispaly
          ) {
            let index = _this.carInstances[key].index;
            let { carLat, carLong } = _this.carInstances[key].positionData[
              index
            ];
            let point = new BMap.Point(carLong, carLat);
            _this.map.setCenter(point);
          }
          // 车辆移动
          _this.carInstances[key].next();
        }
      }, 1000);
    },
    // 多选按钮群绑定值改变回调函数
    changeCheckstate: async function(pickedCar, temp) {
      console.log("pickedCar", pickedCar);
      // console.log('checked',checked);
      console.log("temp", temp);
      // this.flag = 0;

      if ("children" in pickedCar) {
        // 若对象是公司，选出未在数组中的车辆，push到数组中去
        for (let j = 0; j < pickedCar.children.length; j++) {
          //console.log(this.array);
          if (this.array.indexOf(pickedCar.children[j].carNo) == -1) {
            //console.log(666);
            this.array.push(pickedCar.children[j].carNo);
            //console.log('没有');
          }
        }

        // if (this.array.length > this.selectedCars.length) {
        if (temp.checkedNodes.length > this.last_tmplen) {
          console.log("公司增加方法执行");
          // 增加车辆 -> 渲染页面

          // let noneCar=[];

          for (let i = 0; i < pickedCar.children.length; i++) {
            // let oneCar = [];
            this.companyArray.push(pickedCar.children[i].carNo);
            // let carName = this.compare(this.companyArray, this.selectedCars)[0];
            let len = this.compare(this.companyArray, this.selectedCars).length;
            let carName = this.compare(this.companyArray, this.selectedCars)[
              len - 1
            ];
            this.addCar(carName);

            // if(this.flag!=1){
            //   for (let item of this.companiesAndCars) {
            //   if (item.carnumbers.includes(carName)) {
            //     item.ischecked[carName] = "false";
            //   }
            // }
            //   // ischecked[pickedCar.children[i].carNo]="false";
            //   // alert(pickedCar.children[i].carNo+"无数据")
            //  noneCar.push(carName);
            // }
          }
          this.$message({
            message:
              "成功！公司 “" +
              pickedCar.label.slice(0, pickedCar.label.indexOf("（")) +
              "” 的车辆加入渲染队列",
            type: "success",
            duration: 2000
          });
          // if(noneCar.length!=0){
          //   alert(noneCar+"无数据");
          // };
        } else {
          console.log("公司减少方法执行", this.array);
          // 减少车辆
          // console.log('pickedCar',pickedCar);

          for (let i = 0; i < pickedCar.children.length; i++) {
            // console.log(pickedCar.children[i].carNo);

            this.removeCar(pickedCar.children[i].carNo);

            for (let j = 0; j < this.companyArray.length; j++) {
              if (this.array[j] == pickedCar.children[i].carNo) {
                this.array.splice(j, 1);
              }
            }
          }

          // let carName = this.compare(this.selectedCars,pickedCar)[0];
          //   this.removeCar(carName);

          this.$message({
            message:
              "成功！公司 “" +
              pickedCar.label.slice(0, pickedCar.label.indexOf("（")) +
              "” 的车辆退出渲染队列",
            type: "warning",
            duration: 2000
          });
          this.selectedCars = [];
          this.selectedCars.length = 0;
        }

        //选中所有车辆
        this.selectedCars = JSON.parse(JSON.stringify(this.array));
      } else {
        // 若对象是 车辆， 则...

        //console.log('pickedcar',pickedCar);

        if (this.array.indexOf(pickedCar.carNo) == -1) {
          this.array.push(pickedCar.carNo);
        } else {
          let index = this.array.indexOf(pickedCar.carNo);
          this.array.splice(index, 1);
          console.log("有了");
        }

        if (this.array.length == this.selectedCars.length) {
          console.log("啥也不干");
          return;
        }

        if (this.array.length > this.selectedCars.length) {
          console.log("增加方法执行");
          // 增加车辆 -> 渲染页面
          let carName = this.compare(this.array, this.selectedCars)[0];
          await this.addCar(carName);
          // if (this.flag == 1) {
          this.$message({
            message: "成功！车辆 “" + carName + "” 加入渲染队列",
            type: "success",
            duration: 2000
          });
          // } else {
          //   this.$message({
          //     message: "车辆暂无数据，请重新选择",
          //     type: "warning",
          //     duration: 2000
          //   });
          //   // alert("无数据！");
          //   for (let item of this.companiesAndCars) {
          //     if (item.carnumbers.includes(carName)) {
          //       item.ischecked[carName] = "false";
          //     }
          //   }
          // }
        } else {
          console.log("减少方法执行");
          // 减少车辆
          let carName = this.compare(this.selectedCars, this.array)[0];
          console.log("方法执行", carName);
          this.removeCar(carName);
          this.$message({
            message: "成功！车辆 “" + carName + "” 退出渲染队列",
            type: "warning",
            duration: 2000
          });
        }
        this.selectedCars = JSON.parse(JSON.stringify(this.array));
      }

      this.last_tmplen = temp.checkedNodes.length;

      // this.array.push(pickedCar.carNo)
    },
    // 获得两数组的不同的元素，arrA > arrB
    compare: function(arrA, arrB) {
      return arrA.filter(temp => {
        return arrB.indexOf(temp) === -1;
      });
    },
    // ***************  坐标转换的系列函数(wsg -> gcj -> bd)  ******************
    transformLat: function(x, y) {
      const PI = 3.14159265358979324;
      var ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    },
    transformLon: function(x, y) {
      const PI = 3.14159265358979324;
      var ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((x / 12.0) * PI) +
          300.0 * Math.sin((x / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    },
    delta: function(lat, lon) {
      // Krasovsky 1940
      //
      // a = 6378245.0, 1/f = 298.3
      // b = a * (1 - f)
      // ee = (a^2 - b^2) / a^2;
      const PI = 3.14159265358979324;
      var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
      var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
      var dLat = this.transformLat(lon - 105.0, lat - 35.0);
      var dLon = this.transformLon(lon - 105.0, lat - 35.0);
      var radLat = (lat / 180.0) * PI;
      var magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      var sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
      dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
      return { lat: dLat, lng: dLon };
    },
    // WGS-84 to GCJ-02
    wgs2gcj: function(wgsLat, wgsLon) {
      var d = this.delta(wgsLat, wgsLon);
      return { lat: wgsLat + d.lat, lng: wgsLon + d.lng };
    },
    // GCJ-02 to BD-09
    gcj2bd: function(gcjLat, gcjLon) {
      const xPI = (3.14159265358979324 * 3000.0) / 180.0;
      var x = gcjLon;
      var y = gcjLat;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPI);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPI);
      var bdLon = z * Math.cos(theta) + 0.0065;
      var bdLat = z * Math.sin(theta) + 0.006;
      return { lat: bdLat, lng: bdLon };
    },
    wgs2bd: function(wgsLat, wgsLng) {
      let result = this.gcj2bd(wgsLat, wgsLng);
      let { lat, lng } = this.wgs2gcj(result.lat, result.lng);
      return { lat: lat, lng: lng };
    },
    // *************** END  坐标转换的系列函数(wsg -> gcj -> bd) END ******************

    //*****************车载监控************************* */
    // openVideoDialog() {
    //   this.openupVideoDialog = true;
    // },
    getSign() {
      //let url="http://219.151.22.122:8008/openapi/authservice/v1/config";
      // window.jsonpCallback=(data)=>{
      //   console.log(data);
      // }
      // this.$jsonp("http://219.151.22.122:8008/openapi/authservice/v1/config",{
      //    callbackName:"jsonpCallback"
      //   //
      // })
      // this.$axios.defaults.baseURL = "/api";
      // var that = this;
      // this.$axios
      //   .get("/authservice/v1/config")
      //   .then(res => {
      //     // console.log(json);
      //     that.signName = res.data.sign;
      //    // console.log(that.signName);
      //   })
      //   .then(() => {
      //    // console.log(this.signName);
      //     this.$axios
      //       .post(
      //         "/authservice/login",
      //         {
      //           username: "济宁鹏翔",
      //           password:
      //             "Z8d+TYngTI5qI27rAc+XxPddgwhTy8Xcn42EjRsUM8adxJ3h/Lenl5c49BAAVXyRqEZRVegwBcVcOBDVfsbgGhga9eMzte7PzK/O8aakshNXxj7/4l2QR/k8Q1uRRzXiwqeHXYgHSmDYoovbuZ0O4kc3yZyuo/cOVIWpe4ZHdcQ="
      //         },
      //         {
      //           headers: {
      //             "Content-Type": "application/json",
      //             sign: this.signName
      //           }
      //         }
      //       )
      //       .then(res => {
      //         //console.log(res.data);
      //         this.token = res.data.token;
      //         //console.log(this.token);
      //         this.$axios
      //           .get("/gpsservice/v1/baseVehicle/QueryVehicleInfo", {
      //             headers: {
      //               Authorization: "Bearer" + " " + this.token
      //             }
      //           })
      //           .then(res => {
      //             console.log(res);
      //             this.carList = res.data;
      //             //所有车辆信息
      //             // for (let i = 0; i < this.carList.length; i++) {
      //             //   this.carNoList.push(this.carList[i].licenseplateNo); //车牌号信息
      //             // }
      //             // console.log(this.carNoList);
      //             this.selectCar = true;
      //           });
      //       });
      //   });
      getVideo().then(res => {
        //console.log(res.data.respBody);
        this.carList = res.data.respBody;
      });
    },
    Init() {
      this.videoPlayer = new VideoPlayer();
      // console.log("sss");
      // console.log(this.videoPlayer);
      this.videoPlayer.init(document.getElementById("aaa"), {
        type: "liveview"
      });
      this.videoPlayer.on("messageCallback", function msgCallBack(res) {
        debugger;
      });
      this.videoPlayer.on("changeVideoState", function changeVideoState(res) {
        //debugger;
        if (res.code == 0) {
          console.log(
            "通道：" +
              res.data.channel +
              "结果：" +
              res.code +
              ",播放状态：" +
              res.data.state
          );
        } else {
          console.log("通道：" + res.data.channel + "播放失败：" + res.code);
        }
      });
    },
    StartPreview() {
      for (let i = 0; i < this.carList.length; i++) {
        if (this.curCar == this.carList[i].licenseplateNo) {
          this.data = {
            channel: this.carList[i].videoChannel
              .split(",")
              .map(function(index) {
                return Number(index) - 1;
              }),
            devicetype: 202,
            id: "14407698214",
            color: "02",
            title: this.carList[i].licenseplateNo,
            name: this.carList[i].licenseplateNo,
            gtip: "219.151.22.122",
            gtport: 21700,
            carlicense: this.carList[i].licenseplateNo,
            phone: this.carList[i].phoneNo
          };
        }
      }
      //console.log(this.data);

      this.videoPlayer.open(
        this.data
        //   {
        //   channel: [3, 0, 2],
        //   devicetype: 202,
        //   id: "14407698214",
        //   color: "02",
        //   title: this.curCar,
        //   name: this.curCar,
        //   gtip: "219.151.22.122",
        //   gtport: 21700,
        //   carlicense: "鲁H23H13",
        //   phone: "14407698214"
        // }
      );
    },
    StopAll() {
      this.videoPlayer.closeAll();
    }

    // },
    // video: function() {
    //   let video = document.getElementById("btn");
    //   video.onclick = function() {
    //     alert(77777777);
    //   };
    // }
  }
};
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
    #searchCar {
      margin-top: -5vh;
      margin-left: 3vw;
      position: absolute;
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
        height: 55vh;
        overflow-y: scroll;
        .singleCar {
          cursor: pointer;
        }
      }
    }
  }
  .carDialog {
    #position {
      padding: 1vh;
    }
    #positionDate {
      margin-top: 2vh;
      padding: 1vh;
      border: 1px solid rgba(255, 238, 238, 0.99);
      border-radius: 5px;
      #datePicker {
        margin-top: 1vh;
        margin-left: 2vw;
      }
    }
    #carFooter {
      text-align: center;
    }
    #shape {
      margin-top: 2vh;
      padding: 1vh;
      border: 1px solid rgba(255, 238, 238, 0.99);
      border-radius: 5px;
      #shapeRadio {
        margin-top: 2vh;
      }
    }
    #carFooter {
      margin-top: 2vh;
    }
  }
}
</style>

<style>
.el-collapse {
  border: none;
}
/* 点击后的当前节点的样式 */
.el-tree-node.is-current > .el-tree-node__content {
  background: none !important;
  color: rgb(64, 158, 255);
}
/* 点击后的当前节点的子节点的背景颜色 */
.el-tree-node:focus > .el-tree-node__content {
  background: none;
  color: rgb(64, 158, 255);
}
/* 鼠标悬浮的当前节点  */
.el-tree-node__content:hover {
  /* background: #1571db!important; */
  background: none;
  color: rgb(64, 158, 255);
}
.el-tree {
  background: none;
  color: white;
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
.el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 5px;
}
/* .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: blue;
  border-radius: 3px;
} */
</style>
