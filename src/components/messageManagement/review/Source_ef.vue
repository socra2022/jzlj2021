<template>
  <div style="height: 100%">
    <div id="title">
      <span class="span11">产生源编号：{{ sourceid }}</span>
      <span class="span21">工程名称：{{ sourcename }}</span>
      <img src="../../../../static/img/icon26.png" alt="箭头" />
    </div>
    <div class="bm-div">
      <baidu-map
        class="bm-view"
        @click="getClickInfo"
        :scroll-wheel-zoom="true"
        :zoom="16"
        :center="efCenter"
      >
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_RIGHT"
        ></bm-map-type>
        <bm-polygon
          :path="polygonPath"
          stroke-color="red"
          :stroke-opacity="1"
          :stroke-weight="2"
          fillColor="red"
          :fillOpacity="0.7"
          :editing="true"
          @lineupdate="updatePolygonPath"
        />
      </baidu-map>
    </div>
  </div>
</template>

<script>
// 导入请求数据的方法
import { selectOneSourceData, selectByIdAndSOrI } from "../../../assets/axios/index";
export default {
  data() {
    return {
      id: window.sessionStorage.efId,
      sourceData: [],
      // id和名称
      sourceid: "",
      sourcename: "",
      // 中心点坐标
      efCenter: { lng: 114.067, lat: 22.617 },
      // 坐标集
      polygonPath: [],
      // 请求到的经纬度数据
      efData: [],
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    // 获取是点击的那一个工地
    getData() {
      // 请求点击的产生源基本信息
      selectOneSourceData(this.id).then((res) => {
        //console.log(res.data);
        this.sourceData = JSON.parse(JSON.stringify(res.data.respBody));
        this.sourceid = this.sourceData[0].sourceId;
        this.sourcename = this.sourceData[0].sourceName;

        // 请求点击的产生源的经纬度坐标信息
        selectByIdAndSOrI(1,this.id).then((res) => {
          this.efData = JSON.parse(JSON.stringify(res.data.respBody));
          this.efCenter = { lng: 114.067, lat: 22.617 };
          this.polygonPath = [];
          // 获取经纬度
          let lngList = [];
          let latList = [];
          for (let i = 0; i < this.efData.length; i++) {
            lngList.push(this.efData[i].lng);
            latList.push(this.efData[i].lat);
          }
          // 求显示中心
          let clng = 0;
          let clat = 0;
          for (let i = 0; i < lngList.length; i++) {
            clng += parseFloat(lngList[i]);
            clat += parseFloat(latList[i]);
          }
          // console.log(clng);
          this.efCenter = {
            lng: clng / lngList.length,
            lat: clat / lngList.length,
          };
          //console.log(this.efCenter);
          let path = [];
          for (let i = 0; i < lngList.length; i++) {
            let one = {
              lng: lngList[i],
              lat: latList[i],
            };
            path.push(one);
          }
          this.polygonPath = path;
          //console.log(this.polygonPath);
        });
      });
    },

    //点击获取到当前经纬度
    getClickInfo(e) {
      //   console.log(e.point.lng);
      //   console.log(e.point.lat);
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath();
      //console.log(this.polygonPath);
    },
    addPolygonPoint() {
      this.polygonPath.push({ lng: 114.067, lat: 22.617 });
    },
  },
};
</script>

<style lang="scss" scoped>
#title {
  width: 50.542vw;
  height: 4.259vh;
  margin: 0.0926vh 0 0 0.052vw;
  // background-color: #fff;
  background: url("../../../../static/img/icon27.png") no-repeat;
  background-position: center;
  background-size: 50.542vw 4.259vh;
  display: flex;
  align-items: center;
  color: #ffffff;
    .span11 {
        margin-left: 1.5625vw;
    /* margin-left: 5px; */
    /* font-size: 20px; */
    }
    .span21 {
    margin-left: 1.51vw;
    /* font-size: 20px; */
    }
    img {
        margin-left: 1vw;
    }
}
.bm-div {
  height: 100%;
}
.bm-view {
  width: 100%;
//   height: 94.5%;
height: 80.56vh;
//   margin-top: 10px;
}
</style>
