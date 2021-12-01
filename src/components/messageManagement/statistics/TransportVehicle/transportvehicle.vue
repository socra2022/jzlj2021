<template>
  <div id="content">
    <div id="row">
      <div>
        <div class="title">车辆审核状态占比饼图</div>
        <div class="mychart">
          <bar></bar>
        </div>
      </div>
      <div>
        <div class="title">车辆报警数量变化图</div>
        <div class="mychart">
          <stline></stline>
        </div>
      </div>
      <div>
        <div class="title">车辆报警状态占比饼图</div>
        <div class="mychart">
          <pieare></pieare>
        </div>
      </div>
    </div>
    <div id="row">
      <div>
        <div class="title">车辆使用数量漏斗图</div>
        <div class="mychart">
          <lineare></lineare>
        </div>
      </div>
      <div>
        <div class="title">车辆使用状态占比饼图</div>
        <div class="mychart">
          <carscatter></carscatter>
        </div>
      </div>

      <div>
        <div class="title">运输车辆每周统计柱状图</div>
        <div class="mychart">
          <stbar></stbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import bar from "./vehiclebar";
import pieare from "./vehiclepie2";
import stline from "./vehicleline2";
import carscatter from "./vehiclescatter";
import stbar from "./vehiclestackedbar";
import lineare from "./vehicleline";
//import pie from './vehiclepie'
// import Vew from './consumeView.vue'

export default {
  components: {
    bar,
    stbar,
    carscatter,
    lineare,
    pieare,
    stline
    // pie,

    // Vew
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
}
</style>
