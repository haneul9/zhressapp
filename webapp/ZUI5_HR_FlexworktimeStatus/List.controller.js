jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/AttachFileAction",
    "../common/SearchOrg",
    "../common/SearchUser1",
    "../common/OrgOfIndividualHandler",
    "../common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_FlexworktimeStatus.List", {

		PAGEID: "ZUI5_HR_FlexworktimeStatusList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
		onInit: function () {
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Werks : $.app.getModel("session").getData().Persa,
						Bukrs : $.app.getModel("session").getData().Bukrs,
						Pernr : $.app.getModel("session").getData().Pernr,
						Ename : $.app.getModel("session").getData().Ename,                                                                                                           
						Langu : $.app.getModel("session").getData().Langu,
						Zyymm : today.getFullYear() + (today.getMonth() + 1 < 10 ? ("0" + (today.getMonth()+1)) : (today.getMonth()+1))
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.List",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []}, vData2 = [];
			
			var column = oTable.getColumns();
			for(var i=0; i<column.length; i++){
				column[i].setSorted(false);
				column[i].setFiltered(false);
			}
			
			var search = function(){
				oController._ListCondJSonModel.setProperty("/Data/Ctrnm", "");
				oController._ListCondJSonModel.setProperty("/Data/Wrktm", "");
				oController._ListCondJSonModel.setProperty("/Data/Exttm", "");
				oController._ListCondJSonModel.setProperty("/Data/Holtm", "");
				oController._ListCondJSonModel.setProperty("/Data/Extholtm", "");
				oController._ListCondJSonModel.setProperty("/Data/Tottm", "");
				oController._ListCondJSonModel.setProperty("/Data/Notes", "");
				
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
				var today = new Date();
				
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = oData.Zyymm;
					createData.Langu = oData.Langu;
					createData.Prcty = "1";

				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							oController._ListCondJSonModel.setProperty("/Data/Ctrnm", data.Ctrnm);
							oController._ListCondJSonModel.setProperty("/Data/Wrktm", data.Wrktm);
							oController._ListCondJSonModel.setProperty("/Data/Exttm", data.Exttm);
							oController._ListCondJSonModel.setProperty("/Data/Holtm", data.Holtm);
							oController._ListCondJSonModel.setProperty("/Data/Extholtm", data.Extholtm);
							oController._ListCondJSonModel.setProperty("/Data/Tottm", data.Tottm);
							oController._ListCondJSonModel.setProperty("/Data/Notes", data.Notes);
							
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results){
								var data1 = data.FlexWorktime1Nav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									data1[i].Checkbox = false;
									
									data1[i].Datum = data1[i].Datum ? new Date(common.Common.setTime(data1[i].Datum)) : null;
									
									data1[i].Adbtm = data1[i].Adbtm == "" ? "" : data1[i].Adbtm.substring(0,2) + ":" + data1[i].Adbtm.substring(2,4);
									
									if(data1[i].Offyn == ""){
										// 일자가 현재일 이전인 경우 OFFYN을 변경해서 데이터 선택이 불가능하게 변경한다.
										if((dateFormat.format(data1[i].Datum) * 1) < (dateFormat.format(today) * 1)){
											data1[i].Offyn = "1";
										} else if((dateFormat.format(data1[i].Datum) * 1) == (dateFormat.format(today) * 1)){
											data1[i].Offyn = "2"; // 현재일인 경우 시작시간만 변경 불가능
										}
									}
									
									vData.Data.push(data1[i]);
								}
							}
							
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									vData2.push(data2[i]);
								}
							}
						}
					},
					function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				);
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				
				var row = parseInt((window.innerHeight - 355) / 37);
				oTable.setVisibleRowCount(vData.Data.length < row ? vData.Data.length : row);
				
				oController._ListCondJSonModel.setProperty("/Data2", vData2);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			}
			
			// 테이블 내 수정 플래그 값이 존재하는 경우, confirm message 출력 이후 조회처리
			var tabledata = oJSONModel.getProperty("/Data"), oMonyn = "";
			if(tabledata){
				for(var i=0; i<tabledata.length; i++){
					if(tabledata[i].Monyn != ""){
						oMonyn = tabledata[i].Monyn;
					}
				}
			}
			
			if(oMonyn == ""){
				oController._BusyDialog.open();
				setTimeout(search, 100);
			} else {
				sap.m.MessageBox.confirm(oBundleText.getText("MSG_69008"), { // 저장하지 않은 수정사항이 존재합니다. 조회를 진행하시겠습니까?
					actions : ["YES", "NO"],
					onClose : function(fVal){
						if(fVal && fVal == "YES"){
							oController._BusyDialog.open();
							setTimeout(search, 100);
						}
					}
				});
			}
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
                oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
				oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
               
                if(o.Otype == "P"){
                	oController._ListCondJSonModel.setProperty("/Data/Pernr", o.Objid);
                } else if(o.Otype == "O"){
                	oController._ListCondJSonModel.setProperty("/Data/Orgeh", o.Objid);
                }
                
                oController._ListCondJSonModel.setProperty("/Data/Ename", o.Stext);
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		onChangeTime : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
			
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			oController.onChangeModyn(oEvent);
		},
		
		onTableSelectAll : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
			
			for(var i=0; i<oData.length; i++){
				if(oData[i].Offyn == "" || oData[i].Offyn == "2"){
					oJSONModel.setProperty("/Data/" + i + "/Checkbox", oEvent.getParameters().selected);
				}
			}
		},
		
		onSelectCheckbox : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var select = oEvent.getParameters().selected;
			var oAll = sap.ui.getCore().byId(oController.PAGEID + "_CheckBoxAll");
			
			if(select == false){
				oAll.setSelected(false);
			} else {
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel = oTable.getModel();
				var oData = oJSONModel.getProperty("/Data");
				
				var check = "";
				for(var i=0; i<oData.length; i++){
					if((oData[i].Offyn == "" || oData[i].Offyn == "2") && oData[i].Checkbox == true){
						check = "X";
					} else if((oData[i].Offyn == "" || oData[i].Offyn == "2") && oData[i].Checkbox == false){
						check = "";
						oAll.setSelected(false);
						break;
					}
				}
				
				if(check == "X"){
					oAll.setSelected(true);
				}
			}
		},
		
		onChangeModyn : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			oJSONModel.setProperty("/Data/" + oData.Idx + "/Monyn", (oData.Modyn == "1" ? "1" : (oData.Monyn == "2" ? "3" : "1")));
		},
		
		// 추가휴게시간
		openAddBreak : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(!oController._AddBreakDialog){
				oController._AddBreakDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.AddBreak", oController);
				oView.addDependent(oController._AddBreakDialog);
			}
			
			var oData2 = oController._ListCondJSonModel.getProperty("/Data2"), vData = [];
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			
			for(var i=0; i<oData2.length; i++){
				if(dateFormat.format(oData2[i].Datum) == dateFormat.format(oData.Datum)){
					vData.push(oData2[i]);
				}
			}
			
			vData.sort(function(a,b){
				var item1 = a.Austy, item2 = b.Austy;
				
				if(item1 > item2){
					return 1;
				} else if(item1 < item2){
					return -1;
				} else {
					return 0;
				}
			});
			
			var tableData = {Data : []}, data = {Data : []};
			
			if(vData.length == 0){
				for(var i=0; i<5; i++){
					tableData.Data.push({Datum : oData.Datum, Beguz : "", Enduz : ""});
				}
				
				data.Data.push({Datum : oData.Datum, Austy : "A"});
			} else {
				for(var i=0; i<vData.length; i++){
					if(vData[i].Austy == "A"){
						if(tableData.Data.length < 5){
							var length = 5 - tableData.Data.length;
							for(var j=0; j<length; j++){
								tableData.Data.push({Datum : oData.Datum, Beguz : "", Enduz : ""});
							}
						}
						
						data.Data.push(Object.assign({}, vData[i]));
						break;
					}
					
					tableData.Data.push(Object.assign({}, vData[i]));
				}
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable");
			var oJSONModel = oTable.getModel();
				oJSONModel.setData(tableData);
			
			oTable.setVisibleRowCount(tableData.Data.length);
			oTable.bindRows("/Data");
			
			oController._AddBreakDialog.getModel().setData(data);
			oController._AddBreakDialog.open();
		},
		
		// 추가휴게시간 - 시간계산
		onChangeTime2 : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
			
			var calTime = function(){
				var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
				var oController = oView.getController();
				
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable");
				var oJSONModel = oTable.getModel();
				var oData2 = oJSONModel.getProperty("/Data");
				
				var createData = {FlexWorktime2Nav : []};
					createData.Langu = oController._ListCondJSonModel.getProperty("/Data/Langu");
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Prcty = "3";
				
				for(var i=0; i<oData2.length; i++){
					var detail = {};
						detail.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
						detail.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
						detail.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Notes = oData2[i].Notes;
					
					createData.FlexWorktime2Nav.push(detail);
				}
				
				var vData = {Data : []}, vData2 = {Data : []};
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									if(data2[i].Austy == "A"){
										vData2.Data.push(data2[i]);
									} else {
										vData.Data.push(data2[i]);
									}
								}
								
								if(vData2.Data.length == 0){
									vData2.Data.push({Austy : "A", Datum : data2[0].Datum});
								}
							}
						}
					},
					function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				);
				
				oJSONModel.setData(vData);
				oTable.bindElement("/Data");
				
				oController._AddBreakDialog.getModel().setData(vData2);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
			
			if(oEvent){
				var oData = oEvent.getSource().getCustomData()[0].getValue();
				
				if(oData.Beguz && oData.Enduz){
					calTime();
				}
			} else {
				calTime();
			}
		},
		
		// 휴게시간 저장
		onSaveBreak : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var onProcess = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
				var oData = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable").getModel().getProperty("/Data");
				
				// validation check
				var save = [];
				for(var i=0; i<oData.length; i++){
					if(oData[i].Beguz != "" && oData[i].Enduz != ""){
						if(oData[i].Beguz > oData[i].Enduz){
							sap.m.MessageBox.error(oBundleText.getText("MSG_69002")); // 시작시간이 종료시간 이후인 경우 저장이 불가합니다.
							return;
						}
						
						save.push(oData[i]);
					}
				}
				
				save.push(oController._AddBreakDialog.getModel().getProperty("/Data/0"));
				
				// 추가휴게시간 데이터에서 저장한 일자와 동일한 날짜의 데이터 변경
				var breakData = oController._ListCondJSonModel.getProperty("/Data2"), newData = [];
				for(var i=0; i<breakData.length; i++){
					if(dateFormat.format(breakData[i].Datum) == dateFormat.format(save[0].Datum)){
						continue;
					} else {
						newData.push(breakData[i]);
					}
				}
				
				for(var i=0; i<save.length; i++){
					newData.push(save[i]);
				}
				
				oController._ListCondJSonModel.setProperty("/Data2", newData);
				
				// 리스트와 동일한 날짜의 수정여부 플래그, 추가휴게 값 변경
				var list = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var listmodel = list.getModel(), listdata = listmodel.getProperty("/Data");
				
				for(var i=0; i<listdata.length; i++){
					if(dateFormat.format(listdata[i].Datum) == dateFormat.format(save[0].Datum)){
						var adbtm = save[save.length-1].Adbtm;
						
						listmodel.setProperty("/Data/" + listdata[i].Idx + "/Monyn", (listdata[i].Monyn == "" ? "2" : (listdata[i].Monyn == "1" ? "3" : "2")));
						listmodel.setProperty("/Data/" + listdata[i].Idx + "/Adbtm", adbtm ? (adbtm.substring(0,2) + ":" + adbtm.substring(2,4)) : "");
						break;
					}
				}
				
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oBundleText.getText("MSG_00017"), { // 저장되었습니다.
					onClose : function(){
						oController._AddBreakDialog.close();
					}
				});
			}
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00058"), { // 저장하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		// 휴게시간 삭제
		onDeleteBreak : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();	
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddBreakTable");
			var oJSONModel = oTable.getModel();
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_69003")); // 삭제할 데이터를 선택하여 주십시오.
				return;
			}
			
			var onProcess = function(){
				for(var i=0; i<oIndices.length; i++){
					var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
					
					oJSONModel.setProperty(sPath + "/Beguz", "");
					oJSONModel.setProperty(sPath + "/Enduz", "");
					oJSONModel.setProperty(sPath + "/Adbtm", "");
					oJSONModel.setProperty(sPath + "/Notes", "");
				}
				
				// 휴게시간 재계산
				oController.onChangeTime2();
				
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oBundleText.getText("MSG_00021")); // 삭제되었습니다.
			}
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00059"), { // 삭제하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		// 근무일정 일괄입력
		onOpenWorktime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oData = oTable.getModel().getProperty("/Data");
			var oIndices = [];
			
			for(var i=0; i<oData.length; i++){
				if(oData[i].Checkbox == true){
					oIndices.push(oData[i].Idx);
				}
			}
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_69004")); // 일괄입력할 데이터를 선택하여 주십시오.
				return;
			}
			
			if(!oController._WorktimeDialog){
				oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Worktime", oController);
				oView.addDependent(oController._WorktimeDialog);
			}
			
			var vData = {Indices : oIndices, Data : {Beguz : "", Enduz : "", Lnctm : ""}};
			
			oController._WorktimeDialog.getModel().setData(vData);
			oController._WorktimeDialog.open();
		},
		
		// 근무일정 일괄입력 저장
		onSaveWorktime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._WorktimeDialog.getModel().getProperty("/Data");
			
			var oIndices = oController._WorktimeDialog.getModel().getProperty("/Indices");
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			
			// validation check
			if(oData.Beguz == "" || oData.Enduz == "" || oData.Lnctm == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_69005")); // 일괄입력할 데이터를 모두 입력하여 주십시오.
				return;
			} else if((oData.Beguz != "" && oData.Enduz != "") && (oData.Beguz > oData.Enduz)){
				sap.m.MessageBox.error(oBundleText.getText("MSG_69002")); // 시작시간이 종료시간 이후인 경우 저장이 불가합니다.
				return;
			}
			
			for(var i=0; i<oIndices.length; i++){
				var data = oJSONModel.getProperty("/Data/" + oIndices[i]);
				
				if(dateFormat.format(data.Datum) == dateFormat.format(new Date())){
					if(data.Beguz != oData.Beguz){
						sap.m.MessageBox.error(oBundleText.getText("MSG_69006")); // 현재일 데이터는 시작시간 변경이 불가합니다.
						return;
					}
				}
			}
			
			var onProcess = function(){
				for(var i=0; i<oIndices.length; i++){
					var tmp = oJSONModel.getProperty("/Data/" + oIndices[i]);
					
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Beguz", oData.Beguz);
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Enduz", oData.Enduz);
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Lnctm", (oData.Lnctm == "" ? "0" : oData.Lnctm));
					
					// 수정여부 변경
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Monyn", (tmp.Monyn == "" ? "1" : (tmp.Monyn == "2" ? "3" : "1")));
					
					// 선택여부 초기화
					oJSONModel.setProperty("/Data/" + oIndices[i] + "/Checkbox", false);
				}
				
				console.log(oJSONModel.getProperty("/Data"))
				
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oBundleText.getText("MSG_00017"), { // 저장되었습니다.
					onClose : function(){
						oController._WorktimeDialog.close();
					}
				});
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00058"), { // 저장하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var onProcess = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : []};
					createData.Werks = oController._ListCondJSonModel.getProperty("/Data/Werks");
					createData.Pernr = oController._ListCondJSonModel.getProperty("/Data/Pernr");
					createData.Zyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
					createData.Prcty = "2";
					
				var oData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data");
				for(var i=0; i<oData.length; i++){
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData[i].Datum) + ")\/";
						detail.Beguz = oData[i].Beguz;
						detail.Enduz = oData[i].Enduz;
						detail.Lnctm = oData[i].Lnctm;
						detail.Adbtm = oData[i].Adbtm ? oData[i].Adbtm.replace(":", "") : "";
						detail.Monyn = oData[i].Monyn;
					
					createData.FlexWorktime1Nav.push(detail);
				}
				
				var oData2 = oController._ListCondJSonModel.getProperty("/Data2");
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Austy == "A") continue;
					
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Adbtm = oData2[i].Adbtm ? oData2[i].Adbtm.replace(":", "") : "";
						detail.Notes = oData2[i].Notes;
					
					createData.FlexWorktime2Nav.push(detail);
				}
				console.log(createData)
				
				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							
						}
					},
					function (oError) {
				    	var Err = {};
				    	oController.Error = "E";
								
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
				);
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_00017"), { // 저장되었습니다.
					onClose : oController.onPressSearch
				});
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00058"), { // 저장하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},
		
		makeTable : function(oController, oTable, col_info){
			for(var i=0; i<col_info.length; i++){
				var oColumn = new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : false,
					sorted : false,
					hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
					width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : "")
				});
				
				if(col_info[i].id == "Checkbox"){
					oColumn.addMultiLabel(
						new sap.m.CheckBox(oController.PAGEID + "_CheckBoxAll", {
							width : "100%",
							select : oController.onTableSelectAll
						})
					);
				} else {
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}));
				}
				
				if(col_info[i].plabel != ""){
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}));
					oColumn.setHeaderSpan([col_info[i].span, 1]);
				}
				
				var oTemplate;
				
				switch(col_info[i].type){
					case "date":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											path : col_info[i].id, 
											type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
										},
										textAlign : "Center",
										tooltip : " "
									}).addStyleClass("FontFamily");
						break;
					case "timepicker":
						if(col_info[i].id == "Beguz"){
							oTemplate = new sap.m.TimePicker({
											valueFormat : "HHmm",
											displayFormat : "HH:mm",
								        	value : "{" + col_info[i].id + "}",
								        	minutesStep : 10,
								        	width : "100%", 
								        	textAlign : "Begin",
		                                	editable : {
			                                    path : "Offyn",
			                                    formatter : function(fVal){
			                                    	return fVal == "" ? true : false;
			                                    }
		                                	},
		                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
		                                	change : oController.onChangeTime
										});
						} else {
							oTemplate = new sap.m.TimePicker({
											valueFormat : "HHmm",
											displayFormat : "HH:mm",
								        	value : "{" + col_info[i].id + "}",
								        	minutesStep : 10,
								        	width : "100%", 
								        	textAlign : "Begin",
		                                	editable : {
			                                    path : "Offyn",
			                                    formatter : function(fVal){
			                                    	return (fVal == "" || fVal == "2") ? true : false;
			                                    }
		                                	},
		                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
		                                	change : oController.onChangeTime
										});
						}
						break;
					case "timepicker2":
						oTemplate = new sap.m.TimePicker({
										valueFormat : "HHmm",
										displayFormat : "HH:mm",
							        	value : "{" + col_info[i].id + "}",
							        	minutesStep : 10,
							        	width : "100%", 
							        	textAlign : "Begin",
	                                	customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
	                                	change : oController.onChangeTime2
									});
						break;
					case "combobox":
						oTemplate = new sap.m.ComboBox({
										selectedKey : "{" + col_info[i].id + "}",
										width : "100%",
										items : [new sap.ui.core.Item({key : "0", text : ""}),
												 new sap.ui.core.Item({key : "1", text : "01:00"}),
												 new sap.ui.core.Item({key : "2", text : "00:30"})],
										change : oController.onChangeModyn,  
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										}
									});
						break;
					case "time":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											path : col_info[i].id,
											formatter : function(fVal){
												return (!fVal || fVal == "") ? "" : (fVal.substring(0,2) + ":" + fVal.substring(2,4));
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					case "icon":
						oTemplate = new sap.ui.core.Icon({
										src : "sap-icon://accept",
										size : "14px",
										color : "#f00",
										visible : {
											path : col_info[i].id,
											formatter : function(fVal){
												return fVal && fVal != "" ? true : false;
											}
										}
									});
						break;
					case "checkbox":
						oTemplate = new sap.m.CheckBox({
										width : "100%",
										selected : "{" + col_info[i].id + "}",
										select : oController.onSelectCheckbox,
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										},
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
									});
						break;
					case "weektx":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											parts : [{path : col_info[i].id}, {path : "Offyn"}],
											formatter : function(fVal1, fVal2){
												this.removeStyleClass("color-red");
												
												if(fVal2 == "X"){
													this.addStyleClass("color-red");
												}
												
												return fVal1;
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					case "input":
						oTemplate = new sap.m.Input({
										value : "{" + col_info[i].id + "}",
										showValueHelp : true,
										valueHelpOnly : true,
										valueHelpRequest : oController.openAddBreak,
										customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return (fVal == "" || fVal == "2") ? true : false;
											}
										}
									});
						break;
					case "note":
						oTemplate = new sap.m.Input({
										value : "{" + col_info[i].id + "}",
										width : "100%",
										maxLength : common.Common.getODataPropertyLength("ZHR_FLEX_TIME_SRV", "AddBreakList", col_info[i].id)
									});
						break;
					default:
						oTemplate = new sap.ui.commons.TextView({
										text : "{" + col_info[i].id + "}",
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
				}
				
				oColumn.setTemplate(oTemplate);
				oTable.addColumn(oColumn);
			}	
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});