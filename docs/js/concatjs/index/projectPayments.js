(function() {
    'use strict';
    var T = new AllFunc();
    var all_data = {};
    T.AllData.selectUnitstatus2 = false;
    T.AllData.selectUnit2 = function(Id, nowName, callBack) {
        all_data.userId = Id;
        all_data.nowProject = nowName;
        T.MyGet('../../api/get_item.json', getData);

        function getData(d) {
            $.each(d.data.list,function (i,v) {
               v.childrenList=[];
               v.hasPermission=false;
               v.isAttach=true;
               v.orgNodePath='';
               v.orgUnitLevel=1;
               v.orgUnitLevelDesc='';
               v.pid='';
            });
            var a={
                data:{
                    childrenList:d.data.list,
                    hasPermission:false,
                    itemId:1178,
                    isAttach:true,
                    orgNodePath:'',
                    orgUnitLevel:1,
                    orgUnitLevelDesc:'',
                    itemName:'',
                    pid:0
                },
                isSuccess:true,
                message:'',
                status:0
            };

            all_data.data = a.data;
            all_data.navGroup = [];//记录位置 对应数据
            all_data.navGroupName = []; //位置库中对应公司的名字
            all_data.nameList =[]; //列表里显示的名字
            all_data.navGroup.push(all_data.data); //root库
            all_data.keys = "" ;
            for (var i = 0; i < all_data.navGroup.length; i++) {
                all_data.navGroupName.push({name:all_data.navGroup[i].itemName})
            }
            for (var i = 0; i < all_data.navGroup[all_data.navGroup.length-1].childrenList.length; i++) {
                all_data.nameList.push({name:all_data.navGroup[all_data.navGroup.length-1].childrenList[i].itemName,max:all_data.navGroup[all_data.navGroup.length-1].childrenList[i].childrenList.length,hasPer:all_data.navGroup[all_data.navGroup.length-1].childrenList[i].hasPermission})
            } // 循环装入倒数第一级的childrenlist 中的选项
            if (T.AllData.selectUnitstatus2 === false) {
                T.Load('./parts/index/projectSelect.html', "#projectSelect", function() {
                    var projectSelect = new Vue({
                        el: "#selBody",
                        data: all_data,
                        methods: {
                            getProject: function(index) {
                                var _Arr = {};
                                _Arr.id = all_data.navGroup[all_data.navGroup.length-1].childrenList[index].itemId;
                                _Arr.name = all_data.navGroup[all_data.navGroup.length-1].childrenList[index].itemName;
                                _Arr.pid = all_data.navGroup[all_data.navGroup.length-1].childrenList[index].pid;
                                _Arr.orgUnitLevel = all_data.navGroup[all_data.navGroup.length-1].childrenList[index].orgUnitLevel;
                                _Arr.orgUnitLevelDesc = all_data.navGroup[all_data.navGroup.length-1].childrenList[index].orgUnitLevelDesc;
                                var _temp =[];
                                for (var i = 0; i < all_data.navGroup.length; i++) {
                                    _temp.push(all_data.navGroup[i].itemName)
                                };
                                _temp.push(_Arr.name)
                                _Arr.groupList = _temp;
                                callBack(_Arr)
                                T.GoPage();
                            },
                            groupAdd:function(i){
                                all_data.navGroupName.push(all_data.nameList[i])
                                all_data.nameList = [] //清空
                                all_data.navGroup.push(all_data.navGroup[all_data.navGroup.length-1].childrenList[i]) //增加位置记录
                                for (var a = 0; a < all_data.navGroup[all_data.navGroup.length-1].childrenList.length; a++) { //读取增加项目的子集
                                    all_data.nameList.push({name:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].itemName,max:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].childrenList.length,hasPer:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].hasPermission });
                                }
                            },
                            goBack: function() {
                                T.GoPage();
                            },
                            searchShow : function(index){
                                if(all_data.keys === "" || all_data.nameList[index].name.indexOf(all_data.keys) >=0 ){
                                    return true;
                                }else{
                                    return false;
                                }
                            },
                            cutList:function(index){
                                if(all_data.navGroup.length === 1 ){
                                    if (all_data.navGroup[all_data.navGroup.length-1].hasPermission ==true){
                                      var _Arr = {};
                                      _Arr.groupList = []
                                      _Arr.id = all_data.navGroup[all_data.navGroup.length-1].itemId;
                                      _Arr.name = all_data.navGroup[all_data.navGroup.length-1].itemName;
                                      _Arr.pid = all_data.navGroup[all_data.navGroup.length-1].pid;
                                      _Arr.orgUnitLevel = all_data.navGroup[all_data.navGroup.length-1].orgUnitLevel;
                                      _Arr.orgUnitLevelDesc = all_data.navGroup[all_data.navGroup.length-1].orgUnitLevelDesc;
                                      _Arr.groupList.push(_Arr.name)
                                      callBack(_Arr)
                                      T.GoPage();
                                    }else{
                                      return;
                                    }
                                }
                                all_data.navGroup.length = index+1;
                                all_data.navGroupName.length = index+1;
                                all_data.nameList = [] //清空
                                for (var a = 0; a < all_data.navGroup[all_data.navGroup.length-1].childrenList.length; a++) { //读取增加项目的子集
                                    all_data.nameList.push({name:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].itemName,max:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].childrenList.length,hasPer:all_data.navGroup[all_data.navGroup.length-1].childrenList[a].hasPermission});
                                }
                            }
                        },
                        created: function shwoPage() {
                            document.getElementById('selBody').style.display = 'block'
                        }
                    });
                    T.AllData.selectUnitstatus2 = true;
                });
            }
            T.GoPage("#projectSelect", 'right');
        };
    }
})();
