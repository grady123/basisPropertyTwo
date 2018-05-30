(function () {
    'use strict';
    var T = new AllFunc();
    var ID = {
        userId: 1
    };
    var pageId = "#basis_one";
    var url = './parts/index/basis_one.html';
    var LoginInfo = T.LoginInfo;
    console.log(LoginInfo);
    var a = 0,
        b = 0;
    T.AutoLogin(ID, 8080, function () {
        T.Load(url, pageId, basisfun);
    });

    function basisfun() {
        Vue.filter('money', function (d, i) {
            i = i || 2;
            var f = parseFloat(d, 10);
            if (!f) {
                return '0.00';
            }
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            var temp = s.split(".");
            temp[1] = temp[1].slice(0, i);
            s = temp.join(".");
            return s;
        });
        Vue.filter('money2', function (v, i) {
            v = (v - 0).toFixed(i);
            return v;
        });
        var ms = {
            //查找初始组织数据
            tissue: function () {
                T.MyGet('api/org_tree_data_query_auth.json', function (res) {
                    if (res.status == 0) {
                        this.name = res.data[0].orgUnitName;
                        this.orgId = res.data[0].id;
                        this.orgUnitLevel = res.data[0].orgUnitLevel;
                        indexVue.tissue1();
                    } else {
                        T.Tip(res.message);
                    }
                }.bind(this), ID);
            },
            //查找初始基础参数数据
            tissue1: function () {
                T.MyGet('api/get_item.json', function (res) {
                    if (res.status == 0) {
                        this.itemName = res.data.list[0].itemName;
                        this.itemId = res.data.list[0].itemId;
                        this.paidDate = res.data.paidDate;
                        indexVue.getData();
                    } else {
                        T.Tip(res.message);
                    }
                }.bind(this));
            },
            //获取组织架构
            selChange: function () {
                T.AllData.selectUnitstatus = false;
                var callBack = function (data) {
                    // if(data.orgUnitLevel==4||data.orgUnitLevel==5){T.Tip("不能选择项目级别！"); return;}
                    indexVue.name = data.name;
                    indexVue.orgId = data.id;
                    indexVue.orgUnitLevel = data.orgUnitLevel;
                };
                T.AllData.selectUnit(ID.userId, this.name, callBack)
            },
            projectSelChange: function () {
                T.AllData.selectUnitstatus2 = false;
                var callBack = function (data) {
                    indexVue.itemName = data.name;
                    indexVue.itemId = data.id;
                };
                T.AllData.selectUnit2(ID.userId, this.itemName, callBack)
            },
            echarts: function () {
                var nhCharts = echarts.init(document.getElementById('unitNhChartsone'), 'oneWalden');
                //组织
                var num = 0;
                var organizationOption = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    dataZoom: [{
                            type: this.chart.orgName.length > 9 ? 'slider' : 'inside',
                            show: true,
                            startValue: 0,
                            endValue: this.chart.orgName.length > 9 ? 10 : 5,
                            //start:0,
                            //end:25,
                            zoomLock: true,
                            showDetail: false,
                            handleSize: 0,
                            fillerColor: 'rgba(0,0,0,0.2)',
                            height: 10,
                            bottom: 0
                        },
                        {
                            type: 'inside',
                            zoomLock: true
                        }
                    ],
                    xAxis: [{

                        type: 'category',
                        // data :['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                        data: this.chart.orgName,
                        axisLabel: {
                            interval: '0',
                            formatter: function (value) {
                                var str = '';
                                if (value == null) {
                                    return
                                }
                                return value.split("").join("\n");
                            },
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    grid: { // 控制图的大小，调整下面这些值就可以，
                        x: this.num2,
                        x2: 40,
                        y: 20,
                        y2: this.num // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                    },
                    yAxis: [{
                            type: 'value',
                            //nameLocation:'start',
                            axisLabel: {
                                formatter: function (val, index) {
                                    if (num < val) {
                                        num = val;
                                    }
                                    indexVue.num2 = num.toString().length * 8 + 20;
                                    var text = '';
                                    if (index === 0) {
                                        text = '万元';
                                    } else {
                                        text = val;
                                    }
                                    return text;
                                }

                            }
                        },
                        {
                            type: 'value',
                            show: true,
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: function (val, index) {
                                    var text = '';
                                    if (index === 0) {
                                        text = '%';
                                    } else {
                                        text = val;
                                    }
                                    return text;
                                }

                            },
                        }
                    ],
                    series: [{
                            name: '年饱和',
                            type: 'bar',
                            // data:[987,789,885,752,625,755,545,785,546,562,455,428],
                            data: this.chart.saturationByYear,
                            barGap: '-100%',
                            barCategoryGap: '50%',
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    color: '#D8EFFF',
                                    barBorderRadius: [3, 3, 0, 0]
                                }
                            }
                        },
                        {
                            name: '实收',
                            type: 'bar',
                            // data:[546,645,456,654,522,454,522,546,665,542,672,250],
                            data: this.chart.totalPaid,
                            hoverAnimation: false,
                            stack: 'add',
                            //barGap: '-100%',
                            //barCategoryGap:'50%',
                            itemStyle: {
                                normal: {
                                    color: '#6DC56E',
                                    barBorderRadius: [3, 3, 0, 0]
                                }
                            }
                        },
                        /*		{
                                    name:'减免',
                                    type:'bar',
                                    //data:[321,123,423,213,213,210,213,312,350,383,231,123],
                                    data :this.chart.derate,
                                    hoverAnimation:false,
                                    stack: 'add',
                                    //barGap: '-100%',
                                    //barCategoryGap:'50%',
                                    itemStyle:{
                                        normal:{
                                            color:'#138815',
                                            barBorderRadius:[3,3,0,0]
                                        }
                                    }

                                },*/
                        {
                            name: '累计收缴率',
                            type: 'line',
                            yAxisIndex: 1,
                            hoverAnimation: false,
                            "symbolSize": "6",
                            "lineStyle": {
                                "normal": {
                                    "width": "2",
                                    color: '#FF723A'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#FF723A'
                                }
                            },
                            symbol: 'circle',
                            // data:[12,545,5,64,545,65,258,2,252,454,645,52]
                            data: this.chart.totalPaidPercent,
                        }
                    ],

                };
                nhCharts.setOption(organizationOption, true);
                nhCharts.resize();
            },
            //动态改变数据走势图的高度
            xaxisDataChange: function (val) {
                var n = 2;
                for (var i = 0; i < val.length; i++) {
                    for (var k = 0; k < val[i].length; k++) {
                        if (n < k) {
                            n = k;
                        }
                    }
                }
                //默认是6rem的高度     跟据文字的多少来改变高度
                document.getElementById('unitNhChartsone1').style.height = 5 + (n * 18 / 100) + 'rem';
                //默认this.num是35   出现两个文字
                this.num = 32 + (n * 12);
                this.echarts();
            },

            //底部按钮点击展开和收缩列表事件
            accordion: function () {
                if (this.bottomBtnData.bSign) {
                    this.bottomBtnData.text = '收起列表';
                    this.bottomBtnData.bSign = false;
                    this.bottomBtnData.len = this.listdata.length;
                } else {
                    this.bottomBtnData.text = '展开列表';
                    this.bottomBtnData.bSign = true;
                    this.bottomBtnData.len = 8;
                }
            },
            //列表项目切换
            getlist: function (id, name, Level) {
                // if(Level==4||Level==5){return;}
                this.name = name;
                this.orgId = id;
                this.orgUnitLevel = Level;
            },
            //获取主页数据
            getData: function () {
                T.MyGet("api/query_paid.json", function (res) {
                    if (res.status == 0) {
                        var data = res.data;
                        //百分比
                        this.totalPaidPercent = data.totalPaidPercent;
                        // this.totalPaidPercent=this.setMoney(this.totalPaidPercent,1);
                        this.totalPaidPercent = this.totalPaidPercent.toFixed(2);
                        this.front = this.totalPaidPercent.toString().split('.')[0];
                        this.behind = this.totalPaidPercent == 0 ? '' : '.' + this.totalPaidPercent.toString().split('.')[1];
                        //其他数据
                        this.prePaidNextYears = data.prePaidNextYears;
                        this.totalPaid = data.totalPaid;
                        this.saturationByYear = data.saturationByYear;
                        //列表
                        this.listdata = data.list;

                        //chart数据
                        var chart = this.chart;
                        chart.orgName = [];
                        chart.saturationByYear = [];
                        chart.totalPaid = [];
                        chart.totalPaidPercent = [];
                        $.each(this.listdata, function (index, val) {
                            chart.orgName.push(val.orgName);
                            // chart.saturationByYear.push(indexVue.setMoney(val.saturationByYear,2));
                            // chart.totalPaid.push(indexVue.setMoney(val.totalPaid,2));
                            // chart.totalPaidPercent.push(indexVue.setMoney(val.totalPaidPercent,1));
                            chart.saturationByYear.push(val.saturationByYear.toFixed(2));
                            chart.totalPaid.push(val.totalPaid.toFixed(2));
                            chart.totalPaidPercent.push(val.totalPaidPercent.toFixed(2));

                        });
                        indexVue.$nextTick(function () {
                            this.echarts()
                        });
                    } else {
                        T.Tip(res.message);
                    }
                }.bind(this), {
                    "userId": ID.userId,
                    "orgId": this.orgId,
                    "itemId": this.itemId,
                    "order": this.order
                });
            },
            //精确金额
            setMoney: function (d, i) {
                var f = parseFloat(d, 10);
                if (!f) {
                    return '0.00';
                }
                var s = f.toString();
                var rs = s.indexOf('.');
                if (rs < 0) {
                    rs = s.length;
                    s += '.';
                }
                while (s.length <= rs + 2) {
                    s += '0';
                }
                var temp = s.split(".");
                temp[1] = temp[1].slice(0, i);
                s = temp.join(".");
                return s;
            }
        };
        //	配置参数
        var indexVue = {
            el: '#basisone',
            data: {
                order: 1,
                name: "",
                itemName: "",
                paidDate: "",
                orgId: "",
                itemId: "",
                orgUnitLevel: "",
                totalPaidPercent: "",
                prePaidNextYears: "",
                totalPaid: "",
                saturationByYear: "",
                //表格X轴底部高度
                num: 35,
                num2: 50,
                bottomBtnData: {
                    "text": "展开全部",
                    "bSign": true,
                    "len": 8
                },
                //组织列表数据
                listdata: [],
                front: "",
                behind: "",

                //	图表数据
                chart: {
                    orgName: [],
                    totalPaidPercent: [],
                    totalPaid: [],
                    saturationByYear: []
                }
            },
            created: function () {
                this.tissue();
            },
            methods: ms,
            watch: {
                'chart.orgName': function (curVal, oldVal) {
                    this.xaxisDataChange(this.chart.orgName);
                },
                //组织维度
                'name': {
                    handler: function (curVal, oldVal) {
                        if (a == 0) {
                            a++;
                            return;
                        }
                        if (curVal == oldVal) return;
                        this.getData();
                    },
                    deep: true
                },
                //物业维度
                'itemName': {
                    handler: function (curVal, oldVal) {
                        if (b == 0) {
                            b++;
                            return;
                        }
                        if (curVal == oldVal) return;
                        this.getData();
                    },
                    deep: true
                },
                //物业维度
                'order': {
                    handler: function (curVal, oldVal) {
                        if (curVal == oldVal) return;
                        this.getData();
                    },
                    deep: true
                }
            }
        };
        indexVue = new Vue(indexVue);
        indexVue.$nextTick(function () {
            $(".go1").on("click", function () {
                T.GoPage(false, 'up');
            });
            this.echarts();
        });
        // 这里面写工作代码
    }
})();