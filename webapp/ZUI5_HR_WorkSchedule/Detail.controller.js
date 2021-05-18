sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/WorkSchedule",
        "./delegate/PriorHandler",
        "./delegate/PostHandler",
        "common/SearchUser1",
        "common/SearchOrg",
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./delegate/ODataService",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
    ],
    function (Common, CommonController, JSONModelHelper, WorkSchedule, PriorHandler, PostHandler,
              SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, ODataService, MessageBox, BusyIndicator) {
        "use strict";

        return CommonController.extend($.app.CONTEXT_PATH + ".Detail", {
            PAGEID: "_Detail",

            oModel : new sap.ui.model.json.JSONModel(),
            oTarget : "",
            
            EmployeeSearchCallOwner: null,

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            getPriorHandler: function () {
                if (!this.PriorHandler) {
                    this.PriorHandler = PriorHandler.initialize(this);
                }

                return this.PriorHandler;
            },
            
            getPostHandler: function () {
                if (!this.PostHandler) {
                    this.PostHandler = PostHandler.initialize(this);
                }

                return this.PostHandler;
            },
            
            getOrgOfIndividualHandler: function() {

                return this.OrgOfIndividualHandler;
            },

            onBeforeShow: function (oEvent) {
                var oBegda, oEndda, today = new Date();
                if(oEvent.data.Data.Key == WorkSchedule.Tab.PRIOR){
                    oBegda = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
                    oEndda = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
                } else {
                    oBegda = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
                    oEndda = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
                }
                
                this.oModel.setData({
                	Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(), 
                    Data : {Key : oEvent.data.Data.Key, Dtfmt : "yyyy-MM-dd", Begda : oBegda, Endda : oEndda, Bukrs : this.getSessionInfoByKey("Bukrs3")},
                    Data1 : [],
                    Data2 : [],
                    Copy : null,
                    ApprStats : oEvent.data.ApprStats,
                    Faprss : oEvent.data.Faprss,
					Tprogs : oEvent.data.Tprogs,
					Hours : oEvent.data.Hours,
					Minutes : oEvent.data.Minutes
                });
                
                console.log("Detail : ", this.oModel.getData())
            },

            onAfterShow: function () {
                var oTable = sap.ui.getCore().byId(this.PAGEID + "_Table1");
                    oTable.setVisibleRowCount(0);
            },
            
            onBack : function(oController){
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");
            	sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : "ZUI5_HR_WorkSchedule.Tab",
				      data : {
				    	  FromPageId : "ZUI5_HR_WorkSchedule.Detail",
				    	  Key : oController.oModel.getProperty("/Data/Key")
				      }
				});
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
             searchOrgehPernr: function(callback) {
                this.oTarget = "X";
                this.EmployeeSearchCallOwner = null;
                
                setTimeout(function() {
                    var initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                            Zflag: true,
                            Zshft: true,
                            autoClose : false
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, this.addTarget.bind(this));
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");
                    oController.openOrgSearchDialog(oEvent);
            },

            changeDate : function(oEvent){
                if(oEvent && oEvent.getParameters().valid == false){
                    sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식입니다.
                    oEvent.getSource().setValue("");
                    return;
                }

                var oData = this.oModel.getProperty("/Data1");
                var pernr = [];
                for(var i=0; i<oData.length; i++){
                    if(i==0 || (oData[i].Pernr != oData[i-1].Pernr)){
                        pernr.push(oData[i].Pernr);
                    }
                }

                this.oModel.setProperty("/Copy", null);

                this.oModel.setProperty("/Data1", []);
                for(var i=0; i<pernr.length; i++){
                    this.addTarget({Objid : pernr[i]});
                }
            },

            addTarget : function(data){
                // 부서 선택 시 return
                if(data.Otype && data.Otype == "O"){
					return;
				}

                var result = ODataService.WorktimeApplySet.call(
                    this, 
                    WorkSchedule.ProcessType.CODE, 
                    {
                        Bfchk: this.oModel.getProperty("/Data/Key") == WorkSchedule.Tab.PRIOR ? WorkSchedule.PRIOR : WorkSchedule.POST,
                        Pernr: data.Objid,
                        Begda: moment(this.oModel.getProperty("/Data/Begda")).hours(10).toDate(),
                        Endda: moment(this.oModel.getProperty("/Data/Endda")).hours(10).toDate(),
                        Tttyp : "O"
                    }
                );

                var oController = this;
                setTimeout(function(){
                    var oData = oController.oModel.getProperty("/Data1");

                    // 이미 추가된 대상자가 있는 경우, 동일부서의 대상자만 추가할 수 있음
                    if(oData.length){
                        if(oData[0].Orgeh != result.Worktimetab1[0].Orgeh){
                            MessageBox.alert(oController.getBundleText("MSG_55021"), { // 동일부서 내의 대상자만 추가할 수 있습니다.
                                title: oController.getBundleText("LABEL_00149")
                            });
                            return;
                        }
                        
                        for(var i=0; i<oData.length; i++){
                            if(oData[i].Pernr == result.Worktimetab1[0].Pernr){
                                MessageBox.alert(oController.getBundleText("MSG_55022"), { // 이미 추가된 대상자입니다.
                                    title: oController.getBundleText("LABEL_00149")
                                });
                                return;
                            }
                        }
                    }         

                    // 사후신청: 승인된 사전신청건이 없는 일자인 경우 테이블에 추가하지 않음
                    if(oController.oModel.getProperty("/Data/Key") == WorkSchedule.Tab.POST){
                        var check = "";
                        for(var i=0; i<result.Worktimetab1.length; i++){
                            if(result.Worktimetab1[i].Cbchk == "2" || result.Worktimetab1[i].Status != ""){
                                check = "2";
                            } else {
                                check = check == "2" ? "X" : "";
                            }
                        }

                        if(check == ""){ // ${Ename}(${Pernr}), ${Datum} 승인된 사전신청건이 없습니다.
                            MessageBox.alert(oController.getBundleText("MSG_55023").interpolate(result.Worktimetab1[0].Ename, result.Worktimetab1[0].Pernr, sap.ui.getCore().byId(oController.PAGEID + "_Period").getValue()), { // ${Ename}(${Pernr}), ${Datum} 승인된 사전신청건이 없습니다.
                                title: oController.getBundleText("LABEL_00149")
                            });
                            return;
                        }
                    }

                    for(var i=0; i<result.Worktimetab1.length; i++){
                        var data1 = result.Worktimetab1[i];
                        
                        // 신청 또는 승인된 데이터는 테이블에 추가하지 않음
                        if(data1.Status == "00" || data1.Status == "99") continue;
                        
                        data1.Idx = oData.length;
                        data1.EditMode = data1.Status == "" || data1.Status == "AA" ? true : false;
                        data1.PlanTime = data1.Beguz ? "${start} ~ ${End}".interpolate(moment(data1.Beguz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Enduz.ms).subtract(9, "hours").format("HH:mm")) : "";
                        data1.InoutTime = data1.Enttm ? "${start} ~ ${End}".interpolate(moment(data1.Enttm.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Outtm.ms).subtract(9, "hours").format("HH:mm")) : "";
                        data1.WorkTime = data1.Wkbuz ? "${start} ~ ${End}".interpolate(moment(data1.Wkbuz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Wkeuz.ms).subtract(9, "hours").format("HH:mm")) : "";
                        data1.AddTime1 = data1.Trbuz ? "${start} ~ ${End}".interpolate(moment(data1.Trbuz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Treuz.ms).subtract(9, "hours").format("HH:mm")) : "";
                        data1.AddTime2 = data1.Trbu1 ? "${start} ~ ${End}".interpolate(moment(data1.Trbu1.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Treu1.ms).subtract(9, "hours").format("HH:mm")) : "";
                        
                        data1.WkbuzT = !Common.checkNull(data1.Wkbuzc) ? data1.Wkbuzc.substring(0, 2) : "00";
                        data1.WkbuzM = !Common.checkNull(data1.Wkbuzc) ? data1.Wkbuzc.substring(2, 4) : "00";
                        data1.WkeuzT = !Common.checkNull(data1.Wkeuzc) ? data1.Wkeuzc.substring(0, 2) : "00";
                        data1.WkeuzM = !Common.checkNull(data1.Wkeuzc) ? data1.Wkeuzc.substring(2, 4) : "00";

                        data1.TrbuzT = !Common.checkNull(data1.Trbuzc) ? data1.Trbuzc.substring(0, 2) : "00";
                        data1.TrbuzM = !Common.checkNull(data1.Trbuzc) ? data1.Trbuzc.substring(2, 4) : "00";
                        data1.TreuzT = !Common.checkNull(data1.Treuzc) ? data1.Treuzc.substring(0, 2) : "00";
                        data1.TreuzM = !Common.checkNull(data1.Treuzc) ? data1.Treuzc.substring(2, 4) : "00";

                        data1.Trbu1T = !Common.checkNull(data1.Trbu1c) ? data1.Trbu1c.substring(0, 2) : "00";
                        data1.Trbu1M = !Common.checkNull(data1.Trbu1c) ? data1.Trbu1c.substring(2, 4) : "00";
                        data1.Treu1T = !Common.checkNull(data1.Treu1c) ? data1.Treu1c.substring(0, 2) : "00",
                        data1.Treu1M = !Common.checkNull(data1.Treu1c) ? data1.Treu1c.substring(2, 4) : "00",

                        oData.push(data1);
                    }
                    
                    oController.oModel.setProperty("/Data1", oData);
                    sap.ui.getCore().byId(oController.PAGEID + "_Table1").bindRows("/Data1");
                    Common.adjustAutoVisibleRowCount.call(sap.ui.getCore().byId(oController.PAGEID + "_Table1"));

                    // 결재정보
                    if(oController.oModel.getProperty("/Data2").length == 0){
                        for(var i=0; i<result.Worktimetab2.length; i++){
                            var data2 = result.Worktimetab2[i];
                                data2.AprsqTx = oController.getBundleText("LABEL_32042").interpolate(data2.Aprsq);
                                data2.EditMode = oController.oModel.getProperty("/Data/Bukrs") == "A100" ? false : true;
                        }

                        oController.oModel.setProperty("/Data2", result.Worktimetab2);
                        
                        Common.adjustVisibleRowCount(sap.ui.getCore().byId(oController.PAGEID + "_ApprovalLineTable"), 3, oController.oModel.getProperty("/Data2").length);
                    }

                }, 0);
            },

            changeTprog: function(oEvent) {
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");
                var oControl = oEvent.getSource();
                var oData = oEvent.getSource().getCustomData()[0].getValue();

                oController.oModel.getProperty("/Tprogs").some(function(elem) {
                    if(elem.Code === oControl.getSelectedKey()) {
                        if(elem.Code == ""){
                           oController.oModel.setProperty("/Data1/" + oData.Idx + "/Beguz", "");           
                           oController.oModel.setProperty("/Data1/" + oData.Idx + "/Beguzc", "");
                           oController.oModel.setProperty("/Data1/" + oData.Idx + "/Enduz", "");
                           oController.oModel.setProperty("/Data1/" + oData.Idx + "/Enduzc", "");
                           oController.oModel.setProperty("/Data1/" + oData.Idx + "/PlanTime", "");
                        } else {
                            oController.oModel.setProperty("/Data1/" + oData.Idx + "/Beguz", elem.Beguz);
                            oController.oModel.setProperty("/Data1/" + oData.Idx + "/Beguzc", elem.Beguz.ms ? moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm") : "00:00");
                            oController.oModel.setProperty("/Data1/" + oData.Idx + "/Enduz", elem.Enduz);
                            oController.oModel.setProperty("/Data1/" + oData.Idx + "/Enduzc", elem.Enduz.ms ? moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm") : "00:00");
                            oController.oModel.setProperty("/Data1/" + oData.Idx + "/PlanTime", 
                                (elem.Beguz.ms ? moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm") : "00:00")
                                 + " ~ " + (elem.Enduz.ms ? moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm") : "00:00"));
                        }                      

                        return true;
                    }
                }.bind(oController));
            },

            copyData : function(){
                var oTable = sap.ui.getCore().byId(this.PAGEID + "_Table1");
                var oIndices = oTable.getSelectedIndices();

                if(oIndices.length != 1){
                    MessageBox.alert(this.getBundleText("MSG_55015")); // 한 건만 선택하세요.
                    return;
                }
                
                this.oModel.setProperty("/Copy", this.oModel.getProperty(oTable.getContextByIndex(oIndices[0]).sPath));

                MessageBox.success(this.getBundleText("MSG_55014"), { // 복사되었습니다.
                    onClose : function(){
                        oTable.clearSelection();
                    }
                });
            },

            pasteData : function(){
                var oTable = sap.ui.getCore().byId(this.PAGEID + "_Table1");
                var oIndices = oTable.getSelectedIndices();

                if(this.oModel.getProperty("/Copy") == null){
                    MessageBox.alert(this.getBundleText("MSG_55016")); // 먼저 복사 후 진행하세요.
                    return;
                } else if(oIndices.length == 0){
                    MessageBox.alert(this.getBundleText("MSG_55018")); // 데이터를 먼저 선택하세요.
                    return;
                }

                for(var i=0; i<oIndices.length; i++){
                    var oData = this.oModel.getProperty(oTable.getContextByIndex(oIndices[i]).sPath);

                    this.oModel.setProperty(oTable.getContextByIndex(oIndices[i]).sPath,
                        $.extend(true, {}, oData, {
                            Tprog : this.oModel.getProperty("/Copy/Tprog"),
                            PlanTime : this.oModel.getProperty("/Copy/PlanTime"),
                            InoutTime : this.oModel.getProperty("/Copy/InoutTime"),
                            Faprs : this.oModel.getProperty("/Copy/Faprs"),
                            Ovres : this.oModel.getProperty("/Copy/Ovres"),
                            WkbuzT : this.oModel.getProperty("/Copy/WkbuzT"),
                            WkbuzM : this.oModel.getProperty("/Copy/WkbuzM"),
                            WkeuzT : this.oModel.getProperty("/Copy/WkeuzT"),
                            WkeuzM : this.oModel.getProperty("/Copy/WkeuzM"),
                            TrbuzT : this.oModel.getProperty("/Copy/TrbuzT"),
                            TrbuzM : this.oModel.getProperty("/Copy/TrbuzM"),
                            TreuzT : this.oModel.getProperty("/Copy/TreuzT"),
                            TreuzM : this.oModel.getProperty("/Copy/TreuzM"),
                            Trbu1T : this.oModel.getProperty("/Copy/Trbu1T"),
                            Trbu1M : this.oModel.getProperty("/Copy/Trbu1M"),
                            Treu1T : this.oModel.getProperty("/Copy/Treu1T"),
                            Treu1M : this.oModel.getProperty("/Copy/Treu1M"),
                            Beguz : this.oModel.getProperty("/Copy/Beguz"),
                            Enduz : this.oModel.getProperty("/Copy/Enduz"),
                            Enttm : this.oModel.getProperty("/Copy/Enttm"),
                            Outtm : this.oModel.getProperty("/Copy/Outtm")
                        })
                    );
                }

                MessageBox.success(this.getBundleText("MSG_55017"), { // 붙여넣기 되었습니다.
                    onClose : function(){
                        oTable.clearSelection();
                    }
                });                
            },

            // 삭제, 결재취소 후 해당 라인 재조회
            resetTarget : function(oController, data){
                var returnData = data.Worktimetab1;
                var oData = oController.oModel.getProperty("/Data1");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});

                if(returnData.results){                    
                    for(var i=0; i<oData.length; i++){
                        for(var j=0; j<returnData.results.length; j++){
                            if(dateFormat.format(oData[i].Schda) == dateFormat.format(returnData.results[j].Schda) && oData[i].Pernr == returnData.results[j].Pernr){
                                var result = ODataService.WorktimeApplySet.call(
                                    oController, 
                                    WorkSchedule.ProcessType.CODE, 
                                    {
                                        Bfchk: oController.oModel.getProperty("/Data/Key") == WorkSchedule.Tab.PRIOR ? WorkSchedule.PRIOR : WorkSchedule.POST,
                                        Pernr: oData[i].Pernr,
                                        Begda: moment(oData[i].Schda).hours(10).toDate(),
                                        Endda: moment(oData[i].Schda).hours(10).toDate(),
                                        Tttyp : "O"
                                    }
                                );

                                var data1 = result.Worktimetab1[0];
                                        
                                data1.Idx = oData[i].Idx;
                                data1.EditMode = data1.Status == "" || data1.Status == "AA" ? true : false;
                                data1.PlanTime = data1.Beguz ? "${start} ~ ${End}".interpolate(moment(data1.Beguz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Enduz.ms).subtract(9, "hours").format("HH:mm")) : "";
                                data1.InoutTime = data1.Enttm ? "${start} ~ ${End}".interpolate(moment(data1.Enttm.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Outtm.ms).subtract(9, "hours").format("HH:mm")) : "";
                                data1.WorkTime = data1.Wkbuz ? "${start} ~ ${End}".interpolate(moment(data1.Wkbuz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Wkeuz.ms).subtract(9, "hours").format("HH:mm")) : "";
                                data1.AddTime1 = data1.Trbuz ? "${start} ~ ${End}".interpolate(moment(data1.Trbuz.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Treuz.ms).subtract(9, "hours").format("HH:mm")) : "";
                                data1.AddTime2 = data1.Trbu1 ? "${start} ~ ${End}".interpolate(moment(data1.Trbu1.ms).subtract(9, "hours").format("HH:mm"), moment(data1.Treu1.ms).subtract(9, "hours").format("HH:mm")) : "";
                                
                                data1.WkbuzT = !Common.checkNull(data1.Wkbuzc) ? data1.Wkbuzc.substring(0, 2) : "00";
                                data1.WkbuzM = !Common.checkNull(data1.Wkbuzc) ? data1.Wkbuzc.substring(2, 4) : "00";
                                data1.WkeuzT = !Common.checkNull(data1.Wkeuzc) ? data1.Wkeuzc.substring(0, 2) : "00";
                                data1.WkeuzM = !Common.checkNull(data1.Wkeuzc) ? data1.Wkeuzc.substring(2, 4) : "00";
        
                                data1.TrbuzT = !Common.checkNull(data1.Trbuzc) ? data1.Trbuzc.substring(0, 2) : "00";
                                data1.TrbuzM = !Common.checkNull(data1.Trbuzc) ? data1.Trbuzc.substring(2, 4) : "00";
                                data1.TreuzT = !Common.checkNull(data1.Treuzc) ? data1.Treuzc.substring(0, 2) : "00";
                                data1.TreuzM = !Common.checkNull(data1.Treuzc) ? data1.Treuzc.substring(2, 4) : "00";
        
                                data1.Trbu1T = !Common.checkNull(data1.Trbu1c) ? data1.Trbu1c.substring(0, 2) : "00";
                                data1.Trbu1M = !Common.checkNull(data1.Trbu1c) ? data1.Trbu1c.substring(2, 4) : "00";
                                data1.Treu1T = !Common.checkNull(data1.Treu1c) ? data1.Treu1c.substring(0, 2) : "00";
                                data1.Treu1M = !Common.checkNull(data1.Treu1c) ? data1.Treu1c.substring(2, 4) : "00";

                                oController.oModel.setProperty("/Data1/" + oData[i].Idx, data1);
                            }
                        }
                    }
                } 
                
                sap.ui.getCore().byId(oController.PAGEID + "_Table1").clearSelection();
            },

            onPressSave : function(oEvent, Prcty){
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
                var oIndices = oTable.getSelectedIndices();

                // validation check
                if(Prcty == WorkSchedule.ProcessType.DELETE || Prcty == WorkSchedule.ProcessType.APPROVE_CANCEL){
                    if(oIndices.length == 0){
                        MessageBox.error(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                } 
                
                var confirmMessage = "", successMessage = "";
                if(Prcty == WorkSchedule.ProcessType.SAVE){
                    confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
                    successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
                } else if(Prcty == WorkSchedule.ProcessType.DELETE){
                    confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
                    successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
                } else if(Prcty == WorkSchedule.ProcessType.APPROVE){
                    confirmMessage = oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
                    successMessage = oController.getBundleText("MSG_00061"); // 신청되었습니다.
                } else {
                    confirmMessage = oController.getBundleText("MSG_55008"); // 결재취소 하시겠습니까?
                    successMessage = oController.getBundleText("MSG_55009"); // 결재취소 하였습니다.
                }

                var payload = {Worktimetab1 : [], Worktimetab2 : []};
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

                if(Prcty == WorkSchedule.ProcessType.DELETE || Prcty == WorkSchedule.ProcessType.APPROVE_CANCEL) {
                    for(var i=0; i<oIndices.length; i++){
                        var oData = oController.oModel.getProperty(oTable.getContextByIndex(oIndices[i]).sPath);                    
                        
                        if(Prcty == WorkSchedule.ProcessType.DELETE && oData.Status != "AA"){
                            MessageBox.alert(oController.getBundleText("MSG_55020").interpolate(oData.Idx + 1), { // ${index}번째는 삭제 대상이 아닙니다.
                                title: oController.getBundleText("LABEL_00149")
                            });
                            return;
                        }

                        if(Prcty == WorkSchedule.ProcessType.APPROVE_CANCEL && oData.Status != "00"){
                            MessageBox.alert(oController.getBundleText("MSG_55007").interpolate(oData.Idx + 1)); // 결재가 진행되지 않은 건만 선택바랍니다.
                            return;
                        }
                        
                        payload.Worktimetab1.push($.extend(true, {}, Common.copyByMetadata(oModel, "WorktimeApplyTab1", oData), {
                            Schda: moment(oData.Schda).hours(10).toDate(),
                            Wkbuzc: oData.WkbuzT && oData.WkbuzM ? oData.WkbuzT + oData.WkbuzM : null,
                            Wkeuzc: oData.WkeuzT && oData.WkeuzM ? oData.WkeuzT + oData.WkeuzM : null,
                            Trbuzc: oData.TrbuzT && oData.TrbuzM && oData.TreuzT && oData.TreuzM ? oData.TrbuzT + oData.TrbuzM : null,
                            Treuzc: oData.TrbuzT && oData.TrbuzM && oData.TreuzT && oData.TreuzM ? oData.TreuzT + oData.TreuzM : null,
                            Trbu1c: oData.Trbu1T && oData.Trbu1M && oData.Treu1T && oData.Treu1M ? oData.Trbu1T + oData.Trbu1M : null,
                            Treu1c: oData.Trbu1T && oData.Trbu1M && oData.Treu1T && oData.Treu1M ? oData.Treu1T + oData.Treu1M : null
                        }));
                        
                    }
                } else {
                    var oData = oController.oModel.getProperty("/Data1");
                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getSessionInfoByKey("Dtfmt")});
                    for(var i=0; i<oData.length; i++){
                        // validation check
                        if(!oData[i].Tprog){ 
                            MessageBox.error(oController.getBundleText("MSG_55024") + " (" + oData[i].Ename + ", " + dateFormat.format(oData[i].Schda) + ")");
                             // 일근유형을 선택하세요.
                            return;
                        } else if(!oData[i].WkbuzT || !oData[i].WkbuzM || !oData[i].WkeuzT || !oData[i].WkeuzM){
                            MessageBox.error(oController.getBundleText("MSG_55025") + " (" + oData[i].Ename + ", " + dateFormat.format(oData[i].Schda) + ")"); 
                            // 근무시간을 입력하세요.
                            return;
                        } else if(!oData[i].Faprs){
                            MessageBox.error(oController.getBundleText("MSG_55026") + " (" + oData[i].Ename + ", " + dateFormat.format(oData[i].Schda) + ")");
                             // 사유구분을 선택하세요.
                            return;
                        } else if(!oData[i].Ovres || oData[i].Ovres.trim() == ""){
                            MessageBox.error(oController.getBundleText("MSG_55027") + " (" + oData[i].Ename + ", " + dateFormat.format(oData[i].Schda) + ")");
                             // 사유를 입력하세요.
                            return;
                        }

                        payload.Worktimetab1.push($.extend(true, {}, Common.copyByMetadata(oModel, "WorktimeApplyTab1", oData[i]), {
                            Schda: moment(oData[i].Schda).hours(10).toDate(),
                            Wkbuzc: oData[i].WkbuzT && oData[i].WkbuzM ? oData[i].WkbuzT + oData[i].WkbuzM : null,
                            Wkeuzc: oData[i].WkeuzT && oData[i].WkeuzM ? oData[i].WkeuzT + oData[i].WkeuzM : null,
                            Trbuzc: oData[i].TrbuzT && oData[i].TrbuzM && oData[i].TreuzT && oData[i].TreuzM ? oData[i].TrbuzT + oData[i].TrbuzM : null,
                            Treuzc: oData[i].TrbuzT && oData[i].TrbuzM && oData[i].TreuzT && oData[i].TreuzM ? oData[i].TreuzT + oData[i].TreuzM : null,
                            Trbu1c: oData[i].Trbu1T && oData[i].Trbu1M && oData[i].Treu1T && oData[i].Treu1M ? oData[i].Trbu1T + oData[i].Trbu1M : null,
                            Treu1c: oData[i].Trbu1T && oData[i].Trbu1M && oData[i].Treu1T && oData[i].Treu1M ? oData[i].Treu1T + oData[i].Treu1M : null
                        }));
                    }
                }

                if(payload.Worktimetab1.length == 0){
                    MessageBox.error(oController.getBundleText("MSG_32018")); // 조회된 데이터가 없습니다.
                    return;
                }

                var oData2 = oController.oModel.getProperty("/Data2");
                payload.Worktimetab2 = oData2.map(function (elem) {
                    return Common.copyByMetadata(oModel, "WorktimeApplyTab2", elem);
                });

                var Process = function(){
                        payload.IConType = Prcty;
                        payload.IBfchk = oController.oModel.getProperty("/Data/Key") == WorkSchedule.Tab.PRIOR ? "X" : "";
                        payload.ITttyp = "O";
                        payload.IEmpid = oController.getSessionInfoByKey("Pernr");

                    ODataService.WorktimeApplySetByProcess.call(
                        oController, 
                        payload, 
                        function (data, Prcty) {           
                            BusyIndicator.hide(); 
                            MessageBox.success(successMessage, {
                                title: oController.getBundleText("LABEL_00150"),
                                onClose: function () {
                                    if(data.Url) {
                                        Common.openPopup.call(oController, data.Url);
                                    }
            
                                    // this.search.call(this);
            
                                    // if(conType === WorkSchedule.ProcessType.SAVE) {
                                    //     this.searchDetailData.call(this);
                                    // } else if(conType !== WorkSchedule.ProcessType.APPROVE_CANCEL) {
                                    //     this.oDetailDialog.close();
                                    // }
                                    
                                    if(Prcty == WorkSchedule.ProcessType.DELETE || Prcty == WorkSchedule.ProcessType.APPROVE_CANCEL){
                                        oController.resetTarget(oController, data);
                                    } else {
                                        oController.onBack(oController);
                                    }
                                }.bind(this)
                            });
                        }, 
                        function (res) {
                            BusyIndicator.hide();
                            var errData = Common.parseError(res);
                            if (errData.Error && errData.Error === "E") {
                                MessageBox.error(errData.ErrorMessage, {
                                    title: oController.getBundleText("LABEL_00149")
                                });
                            }
            
                        }
                    );

                };

                MessageBox.show(confirmMessage, {
                    title: oController.getBundleText("LABEL_00149"),
                    actions: ["YES", "NO"],
                    onClose: function(fVal){
                        if(fVal && fVal == "YES"){
                            BusyIndicator.show(0);
                            setTimeout( Process, 50 );
                        }
                    }
                });
            },

            /**
             * @brief 결재라인 추가 버튼 event handler
             */
             pressAddApprovalLine: function(oController) {
                oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = this;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = null;

                if (!this._AddPersonDialog) {
                    this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
                    this.getView().addDependent(this._AddPersonDialog);
                }
        
                this._AddPersonDialog.open();
            },

            /**
             * @brief 결재라인 변경 버튼 event handler
             */
             pressApprovalLineModify: function(oEvent) {
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");

                oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = oController;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = {
                    sPath: oEvent.getSource().getBindingContext().getPath()
                };

                if (!oController._AddPersonDialog) {
                    oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
                    oController.getView().addDependent(oController._AddPersonDialog);
                }
        
                oController._AddPersonDialog.open();
            },

            /**
             * @brief 결재라인 삭제 버튼 event handler
             */
             pressApprovalLineDelete: function(oEvent) {
                var oController = $.app.getController($.app.CONTEXT_PATH + ".Detail");
                oController.oModel.setProperty(
                    "/Data2",
                    oController.oModel.getProperty("/Data2")
                        .filter(function(elem) {
                            return elem.Apper !== oEvent.getSource().getBindingContext().getProperty().Apper;
                        })
                        .map(function(elem, idx) {
                            return $.extend(true, elem, { 
                                AprsqTx: oController.getBundleText("LABEL_32042").interpolate(idx + 1) // ${v}차 결재자
                            });
                        }.bind(oController))
                );

                Common.adjustVisibleRowCount(sap.ui.getCore().byId(oController.PAGEID + "_ApprovalLineTable"), 3, oController.oModel.getProperty("/Data2").length);
            },

            onESSelectPerson: function(data) {
                if(this.oTarget == "X"){
                    this.addTarget({Objid : data.Pernr});

                    this.oTarget = "";
                    this.EmployeeSearchCallOwner = null;
                    SearchUser1.oTargetPaths = null;
                    SearchUser1.onClose();
                    this.OrgOfIndividualHandler.getDialog().close();
                } else {
                    this.setSelectionTagets(data);
                }

            },

            /**
             * @brief 공통-사원검색 callback function
             */
            setSelectionTagets: function(data) {
                var vApprovalLines = this.oModel.getProperty("/Data2"),
                    oTargetPaths = SearchUser1.oTargetPaths;

                if(vApprovalLines.some(function(elem) { return elem.Apper === data.Pernr; })) {
                    MessageBox.warning(this.getBundleText("MSG_00065")); // 중복된 결재자입니다.
                    return;
                }

                if(Common.checkNull(oTargetPaths)) {
                    // Line add
                    vApprovalLines.push({
                        Aprsq: String(vApprovalLines.length + 1),
                        AprsqTx: this.getBundleText("LABEL_32042").interpolate(vApprovalLines.length + 1),  // ${v}차 결재자
                        ApstaT: "",
                        Apper: data.Pernr,
                        Apnam: data.Ename,
                        Aporx: data.Fulln,
                        ApgrdT: data.ZpGradetx,
                        EditMode: this.oModel.getProperty("/Data/Bukrs") == "A100" ? false : true
                    });
                    this.oModel.refresh();
                    Common.adjustVisibleRowCount(sap.ui.getCore().byId(this.PAGEID + "_ApprovalLineTable"), 3, vApprovalLines.length);
                } else {
                    // Line modify
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apper", data.Pernr);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apnam", data.Ename);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Aporx", data.Fulln);
                    this.oModel.setProperty(oTargetPaths.sPath + "/ApgrdT", data.ZpGradetx);
                }

                this.EmployeeSearchCallOwner = null;
                SearchUser1.oTargetPaths = null;
                SearchUser1.onClose();

                // this.toggleIsPossibleSave();
            },

            /**
             * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
             */
            openOrgSearchDialog: function (oEvent) {
                SearchOrg.oController = this.oController;
                SearchOrg.vActionType = "Multi";
                SearchOrg.vCallControlId = oEvent.getSource().getId();
                SearchOrg.vCallControlType = "MultiInput";

                if (!this.oOrgSearchDialog) {
                    this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                    $.app.getView().addDependent(this.oOrgSearchDialog);
                }

                this.oOrgSearchDialog.open();
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModelHelper({ name: "35110494" });
            } : null
        });
    }
);