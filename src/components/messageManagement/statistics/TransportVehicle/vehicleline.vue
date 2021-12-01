<template>
  <div id="line" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
import { numberOfVehicleUsed } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      xData: [],
      yData: []
    };
  },

  props: {},
  mounted() {
    let _this = this;
    // 生成要请求的表名数组
    let tableNames = [];
    for (let i = 6; i >= 0; i--) {
      _this.xData.push(
        _this
          .$moment()
          .add(-i, "days")
          .format("YYYY-MM-DD")
      );
      tableNames.push(
        "t_history_position_" +
          this.$moment()
            .add(-i, "days")
            .format("YYYYMMDD")
      );
    }
    // 生成 ajax 请求
    let requests = [];
    for (let i = 0; i < tableNames.length; i++) {
      let temp = numberOfVehicleUsed(tableNames[i]).then(res => {
        console.log(i, res);
        _this.yData[i] = res.data.respBody;
      });
      requests.push(temp);
    }

    Promise.all(requests).then(() => {
      _this.ready();
    });
  },
  methods: {
    ready: function() {
      let _this = this;
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("line"), "white");
      // 绘制图表
      var option = {
        title: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["1", "2", "3"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: _this.xData,
            axisLabel: {
              textStyle: {
                color: "white" //坐标值得具体的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "white" //坐标值得具体的颜色
              }
            }
          }
        ],
        series: [
          {
            //name:'1',
            type: "line",
            stack: "车辆使用数量",
            areaStyle: {},
            data: _this.yData
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style></style>
