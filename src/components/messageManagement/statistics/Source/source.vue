<template>
  <div id="content">
    <div id="row">
      <div>
        <div class="title">各个产生源垃圾总量柱状图</div>
        <div class="mychart">
          <bar></bar>
        </div>
      </div>
      <div>
        <div class="title">建筑垃圾周产生量占比堆叠条形图</div>
        <div class="mychart">
          <stbar></stbar>
        </div>
      </div>
      <div>
        <div class="title">产生源建筑垃圾量变化折线图</div>
        <div class="mychart">
          <lineare></lineare>
        </div>
      </div>
    </div>
    <div id="row">
      <div>
        <div class="title">产生源垃圾类型占比饼图</div>
        <div class="mychart">
          <pie></pie>
        </div>
      </div>
      <div>
        <div class="title">产生源垃圾排放状态漏斗图</div>
        <div class="mychart">
          <funnel></funnel>
        </div>
      </div>
      <div>
        <div class="title">产生源垃圾经纬度散点图</div>
        <div class="mychart">
          <scatter></scatter>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import bar from "./bar";
import pie from "./pie";
import stbar from "./stackedbar";
import lineare from "./line";
import funnel from "./funnel";
import scatter from "./scatter";

export default {
  components: {
    bar,
    pie,
    stbar,
    lineare,
    funnel,
    scatter,
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
