<template>
  <div id="content">
    <div id="row">
      <div>
        <div class="title">异常电子联单统计饼状图</div>
        <div class="mychart">
          <pie></pie>
        </div>
      </div>
      <div>
        <div class="title">电子联单处置状况饼状图</div>
        <div class="mychart">
          <pie2></pie2>
        </div>
      </div>
      <div>
        <div class="title">车辆申报状态饼状图</div>
        <div class="mychart">
          <pie3></pie3>
        </div>
      </div>
    </div>
    <div id="row">
      <div>
        <div class="title">周电子联单统计折线图</div>
        <div class="mychart">
          <billline></billline>
        </div>
      </div>
      <div>
        <div class="title">周电子联单统计柱状图</div>
        <div class="mychart">
          <billbar></billbar>
        </div>
      </div>
      <div>
        <div class="title">周电子联单统计折线图</div>
        <div class="mychart">
          <billbar2></billbar2>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
import pie from "./electronicpie1";
import pie2 from "./electronicpie2";
import pie3 from "./electronicpie3";
import billline from "./electronicline";
import billbar from "./electronicbar1";
import billbar2 from "./electronicbar2";

export default {
  components: {
    pie,
    pie2,
    pie3,
    billline,
    billbar,
    billbar2,
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
