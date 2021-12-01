<template>
  <div id="pie" style="width: 100%;height:100%;"></div>
</template>

<script type="text/javascript">
import axios from "axios";
import { sourcePie } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      data1: [],
      data99: []
    };
  },

  props: {},
  mounted() {
    this.ready();
  },
  methods: {
    ready: function() {
      sourcePie()
        .then(res => {
          let arr = res.data.respBody;
          console.log(arr);
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
              let k = {};
              k.value = arr[i].number;
              k.name = arr[i].sourceType;
              this.data1.push(k);
            }
          }
          console.log("饼图",this.data1);
        })
        .then(() => {
          var echarts = require("echarts");
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("pie"), "black");
          // 绘制图表
          var option = {
            title: {
            //   text: "某站点用户访问来源",
            //   subtext: "纯属虚构",
              left: "center"
            },
            tooltip: {
              trigger: "item"
            },
            legend: {
              orient: "vertical",
              left: "left",
             textStyle:{
                  color:"white"
              }
            },
            series: [
              {
                name: "产生源",
                type: "pie",
                radius: "50%",
                data: this.data1,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };
          //   var option = {
          //     // color: ["rgb(195,53,49)", "rgb(97,160,168)"],
          //     title: {
          //       // text: '产生源垃圾类型占比饼图',
          //       // subtext: '数据来源：深圳市'
          //     },
          //     legend: {
          //       textStyle: {
          //         color: "white"
          //       }
          //     },
          //     tooltip: {
          //       trigger: "item"
          //     },
          //     dataset: {
          //       // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          //       // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          //       // dimensions: ['type', 'value'],
          //       source: this.data1
          //     },

          //     series: [
          //       {
          //         name: "垃圾类型",
          //         type: "pie",
          //         radius: "70%",
          //         center: ["50%", "50%"],
          //         encode: {
          //           itemName: "type",
          //           value: "value"
          //         },
          //         // data: [
          //         //   { value: 40, name: "渣土" },
          //         //   { value: 200, name: "玻璃" }
          //         // ]
          //         data: this.data1
          //       }
          //     ]
          //   };
          myChart.setOption(option);
        });

      // }
      // ).catch(error => console.log(error))
    }
  }
};
</script>

<style></style>
