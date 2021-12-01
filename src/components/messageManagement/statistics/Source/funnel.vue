<template>
    <div id="funnel" style="width: 100%;height:100%;"></div>
</template>

<script type="text/javascript">
import axios from 'axios'
export default{
    data(){
        return{
            data:[],
            data99:[],
            yes:[],
            no:[]
        }
    },

    props:{

    },
    mounted(){
        this.ready()
    },
    methods:{

            ready:function(){
            // axios({
            // headers: {
            //     token: this.$store.state.token
            // },
            // method: "get",
            // url:'http://localhost:8877/sourceInfo/si'
            // })
            // .then(response => {
            //     for(var i=0;i<response.data.data.length;i++){
            //         // this.data.push({'name':response.data.data[i]['sourceCompany']})
            //         this.data.push(response.data.data[i]['sourceCompany'])
            //     };
            //     for(var j=0;j<this.data.length;j++){
            //         if(this.data[j]=='已排放'){
            //             this.yes.push(this.data[j])
            //         }else{
            //             this.no.push(this.data[j])
            //         }
            //     }
            this.data99=[
                {value: 40, name: '已排放'},
                {value: 200, name: '未排放'}
            ]

                // console.log('-----'+JSON.stringify(this.no))
            var echarts = require('echarts');
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('funnel'),'black');
            // 绘制图表
            var option = {
                color:['rgb(195,53,49)','rgb(97,160,168)'],
                title: {
                    // text: '产生源垃圾类型占比饼图',
                    // subtext: '数据来源：深圳市'
                },
                legend: {
                    textStyle: {
                        color: 'white'
                    }
                },
                tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
                },
                feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            },


                series: [{
                    name:'垃圾排放状态',
                    type: 'funnel',
                    top: 50,
                    bottom: 50,
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    radius: '70%',
                    center: ['50%', '50%'],
                    data: [
                        // {value: this.yes.length, name: '已排放'},
                        // {value: this.no.length, name: '未排放'}
                          {value: 40, name: '已排放'},
                          {value: 200, name: '未排放'}
                    ],

                }]
            };
            myChart.setOption(option);
            // }
            // ).catch(error => console.log(error))


        }
    }
}
</script>

<style>

</style>
