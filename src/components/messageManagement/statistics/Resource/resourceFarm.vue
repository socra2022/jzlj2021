
<template>
  <div id="content">
    <div id="row">
      <div>
        <div class="title">资源场总量柱状图</div>
        <div class="mychart">
          <snbar></snbar>
        </div>
      </div>
      <div>
        <div class="title">资源场周产生量占比堆叠条形图</div>
        <div class="mychart">
          <lineChart></lineChart>
        </div>
      </div>
      <div>
        <div class="title">资源场资源变化折线图</div>
        <div class="mychart">
          <barChart></barChart>
        </div>
      </div>
    </div>
    <div id="row">
      <div>
        <div class="title">各资源场占比饼图</div>
        <div class="mychart">
          <pie></pie>
        </div>
      </div>
      <div>
        <div class="title">资源场处理状态漏斗图</div>
        <div class="mychart">
          <radarChart></radarChart>
        </div>
      </div>
      <div>
        <div class="title">资源场资源分类环形图</div>
        <div class="mychart">
          <repie></repie>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import viw from '../View'
import pie from "./resourcepie";
import radarChart from "./resourceC2";
import barChart from "./resourceC3"; //雷达图
import lineChart from "./resourceline";
import snbar from "./resourcebar2";
import repie from "./resourcepie2";
// import Vew from '../View'
export default {
  components: {
    pie,
    radarChart,
    barChart,
    lineChart,
    snbar,
    repie,
    // Vew
  },
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
}
</style>
