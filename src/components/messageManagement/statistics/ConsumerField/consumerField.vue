<template>
  <div id="content">
    <div id="row">
      <div>
        <div class="title">近几年该地消纳场总垃圾数量趋势分析</div>
        <div class="mychart">
          <div id="test" ref="myEchart3"></div>
        </div>
      </div>
      <div>
        <div class="title">一周内消纳场消纳垃圾数量统计</div>
        <div class="mychart">
          <div id="test" ref="myEchart4"></div>
        </div>
      </div>
      <div>
        <div class="title">各消纳场不同类型垃圾量统计</div>
        <div class="mychart">
          <div id="test" ref="myEchart5"></div>
        </div>
      </div>
    </div>
    <div id="row">
      <div>
        <div class="title">消纳场审核量占比饼图</div>
        <div class="mychart">
          <div id="test" ref="myEchart6"></div>
        </div>
      </div>
      <div>
        <div class="title">影响因子分析折线图</div>
        <div class="mychart">
          <div id="test" ref="myEchart"></div>
        </div>
      </div>
      <div>
        <div class="title">消纳场位置经纬度散点图</div>
        <div class="mychart">
          <div id="test" ref="myEchart2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import echarts from "echarts";
import {
  selectAllIntakeData,
  intakeReview
} from "../../../../assets/axios/index";
export default {
  components: {
    // pie,
  },
  data() {
    return {
      allData: "",
      allReviewData: "",
      chart: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      chart6: null,
      data6: [],
      data2: [],
      toAudit: "",
      unReview: "",
      review: ""
    };
  },
  created() {
    this.getData();
    intakeReview()
      .then(res => {
        this.allReviewData = JSON.parse(JSON.stringify(res.data.respBody));
        this.toAudit = this.allReviewData[1].number; //25待审核
        this.review = this.allReviewData[2].number; //审核通过
        console.log(this.toAudit);
        this.data2 = [
          { value: this.review, name: "审核通过" },
          { value: this.toAudit, name: "待审核" }

          // { value: 55, name: "1-2全线消纳" }
        ];
        console.log(this.data2);
      })
      .then(() => {
        this.initChart();
      });
  },
  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (!this.chart2) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    this.chart2.dispose();
    this.chart2 = null;
  },
  methods: {
    getData() {
      selectAllIntakeData(false)
        .then(res => {
          this.allData = JSON.parse(JSON.stringify(res.data.respBody));
          console.log(this.allData);
          for (let i = 0; i < this.allData.length; i++) {
            if (this.allData[i].intakePlantLong != null) {
              this.data6.push([
                this.allData[i].intakePlantLong,
                this.allData[i].intakePlantLat
              ]);
            }
            // this.data6.map(this.allData[i].intakePlantLat,this.allData[i].intakePlantLong)
          }
          console.log(this.data6);
        })
        .then(() => {
          this.initChart();
        });
    },

    initChart() {
      this.chart = echarts.init(this.$refs.myEchart);
      // 把配置和数据放这里
      this.chart.setOption({
        // color: ['#3398DB'],
        // title:{
        //     text: '各消纳场因子分析折线图',
        //     subtext: '实验数据'
        // },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["因子1", "因子2", "因子3", "因子4", "因子5"],
          textStyle: {
            color: "white"
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] }
            // magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},

            // restore : {show: true},
            // saveAsImage : {show: true}
          },
          x: "right", // 水平安放位置，默认为全图右对齐，可选为：
          // 'center' ¦ 'left' ¦ 'right'
          // ¦ {number}（x坐标，单位px）
          y: "bottom" // 垂直安放位置，默认为全图顶端，可选为：'top' ¦ 'bottom' ¦ 'center'
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            position: "center",
            axisLabel: {
              textStyle: {
                color: "white"
              }
            }
          }
        ],
        grid: {
          left: "15%"
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "white"
              }
            }
          }
        ],
        series: [
          {
            name: "因子1",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "因子2",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "因子3",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "因子4",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "因子5",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }),
        (this.chart2 = echarts.init(this.$refs.myEchart2));
      this.chart2.setOption({
        legend: {
          textStyle: {
            color: "white"
          }
        },
        grid: { left: "24%", right: "15%" },
        tooltip: {
          //c表示数值
          formatter: "经纬度: ({c})"
        },

        xAxis: {
          type: "value",
          // minInterval: 1,
          name: "经度",
          nameTextStyle: {
            color: "white",
            fontSize: 14
          },
          axisLabel: {
            textStyle: {
              fontSize: 11,
              color: "white" //坐标值得具体的颜色
            }
          },
          min: function(value) {
            return value.min;
          },
          max: function(value) {
            return value.max;
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          name: "纬度",
          nameTextStyle: {
            color: "white",
            fontSize: 14
          },
          axisLabel: {
            textStyle: {
              fontSize: 11,
              color: "white" //坐标值得具体的颜色
            }
          },
          min: function(value) {
            return value.min.toFixed(1);
          },
          max: function(value) {
            return value.max.toFixed(1);
          },
          splitLine: {
            show: false
          }
        },
        // dataset:{
        // source:this.data
        //     } ,
        series: [
          {
            symbolSize: 20,
            // name:'垃圾排放状态',
            type: "scatter",
            encode: {
              x: "x",
              y: "y"
            },
            data: this.data6
          }
        ]
      }),
        (this.chart3 = echarts.init(this.$refs.myEchart3));
      this.chart3.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["2013", "2014", "2015", "2016", "2017", "2018", "2019"],
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        grid: { left: "15%" },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            areaStyle: {}
          }
        ]
      }),
        (this.chart4 = echarts.init(this.$refs.myEchart4));
      this.chart4.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        series: [
          {
            data: [150, 140, 160, 180, 185, 190, 195],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          }
        ]
      }),
        (this.chart5 = echarts.init(this.$refs.myEchart5));
      this.chart5.setOption({
        title: {
          // text: '基础雷达图'
          // subtext: '数据来源：深圳市'
        },
        tooltip: {},
        legend: {
          data: ["大铲湾临时装船点", "1-2全线消纳", "潼湖区消纳场所"],
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#ffffff",
            fontSize: 10
          }
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          radius: 80,

          indicator: [
            { name: "渣土", max: 60 },
            { name: "混凝土块", max: 60 },
            { name: "玻璃", max: 60 },
            { name: "泥浆", max: 60 },
            { name: "废金属", max: 60 },
            { name: "费竹木", max: 60 }
          ]
        },
        series: [
          {
            // name: '各资源厂不同类型建筑垃圾量统计',
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: [43, 10, 28, 35, 50, 19],
                name: "大铲湾临时装船点",
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,0,0.6)"
                    // lineStyle: {
                    //     color: 'rgba(255,225,0,.3)',
                    // },
                  }
                }
              },
              {
                value: [57, 18, 28, 25, 30, 23],
                name: "1-2全线消纳",
                itemStyle: {
                  normal: {
                    color: "rgba(10,255,400,0.6)"
                    // lineStyle: {
                    //     color: 'rgba(255,225,0,.3)',
                    // },
                  }
                }
              },
              {
                value: [50, 14, 28, 30, 40, 21],
                name: "潼湖区消纳场所",
                normal: {
                  color: "rgba(0,255,255,0.6)"
                  // lineStyle: {
                  //     color: 'rgba(255,225,0,.3)',
                  // },
                }
              }
            ]
          }
        ]
      }),
        (this.chart6 = echarts.init(this.$refs.myEchart6));
      this.chart6.setOption({
        // title: {
        //   // text: '某站点用户访问来源',
        //   // subtext: '纯属虚构',
        //   left: "center"
        // },
        // tooltip: {
        //   trigger: "item"
        // },
        // legend: {
        //   orient: "vertical",
        //   left: "left"
        // },
        // series: [
        //   {
        //     name: "访问来源",
        //     type: "pie",
        //     radius: "50%",
        //     data: this.data2,
        //     emphasis: {
        //       itemStyle: {
        //         shadowBlur: 10,
        //         shadowOffsetX: 0,
        //         shadowColor: "rgba(0, 0, 0, 0.5)"
        //       }
        //     }
        //   }
        // ]
        title: {
          // subtext: '电子联单数量：123456(条)',
          // left: 'right',
          // subtextStyle:{
          //     fontSize:12
          // }
        },
        tooltip: {
          trigger: "item",
          // grid:"left",
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["rgb(82,204,102)", "rgb(255,170,0)"],
        legend: {
          orient: "vertical",
          left: "left",
          // data: ["潼湖区消纳场所1", "大铲湾临时装船点", "1-2全线消纳"],
          data: ["审核通过","待审核" ],
          textStyle: {
            color: "#ffffff",
            fontSize: 12
          }
        },
        grid: {
           left:"90%",
        },
        series: [
          {
            //name: '电子联单详情',
            type: "pie",
            radius: "55%",
            center: ["47.85%", "60%"],
            data:this.data2,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        // type: 'line',
        // areaStyle: {}
        // }],
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#row {
  width: 100%;
  height: 38vh;
  margin: 3vh 0vw 3vh 0vw;
  // border: maroon 1px solid;
  display: flex;
}
#row > div {
  height: 38vh;
  width: 25vw;
  margin-left: 2vw;
  background: rgba(255, 255, 255, 0.1);
}
.title {
  color: white;
  height: 2.5vh;
  font-weight: bold;
  font-size: 2.389vh;
  text-align: center;
  margin-top: 0.5vh;
}
.mychart {
  height: 33vh;
  width: 22vw;
  margin: 2vh 0vw 0vh 2vw;
  #test {
    height: 100%;
    width: 100%;
  }
}
</style>
