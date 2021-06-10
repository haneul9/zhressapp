jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper"], 
	function (Common, CommonController, JSONModelHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_FlexworktimeStatus.m.Detail", {

		PAGEID: "ZUI5_HR_FlexworktimeStatusDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		
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
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			if(oEvent.data.Data){
				var oData = $.extend(true, {}, oEvent.data.Data);
					oData.Atext = oData.Offyn == "X" ? "OFF" : (oData.Atext == "" ? oController.getBundleText("LABEL_69041") : oData.Atext); // 정상근무
				oController._DetailJSonModel.setProperty("/Data", oData);
			}
			
			oController._DetailJSonModel.setProperty("/Data/FromPageId", oEvent.data.FromPageId ? oEvent.data.FromPageId : "ZUI5_HR_FlexworktimeStatus.m.List");

			// 2021-05-18 과거근무 변경신청인 경우 결재자 리스트 생성
			var oAppNameRow = sap.ui.getCore().byId(oController.PAGEID + "_AppNameRow");
				oAppNameRow.addStyleClass("displayNone");
			var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
				oAppName.destroyItems();
				oAppName.setValue("");

			if(oData.Offyn == "1"){
				var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
				var createData = {ApprlistNav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.IExtryn = "X"; // 선택적근로제의 경우 내/외부 구분없이 리스트 생성
					createData.IMobyn = "X";
					createData.IZappSeq = "99";
					createData.IAppkey = (oData.Appkey1 ? oData.Appkey1 : "");

				if(oData.Status == "00"){
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Datum)) + ")\/";
					createData.IPrcty = "2";
				} else {
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
					createData.IPrcty = "1";
				}

				oModel.create("/ApprListSet", createData, {
					success: function(data, res){
						if(data){
							if(data.ApprlistNav && data.ApprlistNav.results){
								var data1 = data.ApprlistNav.results;
								
								if(data1){
									for(var i=0; i<data1.length; i++){
										oAppName.addItem(new sap.ui.core.Item({key : data1[i].AppName, text : data1[i].AppText}));

										if(data1[i].Defyn == "X"){
											oController._DetailJSonModel.setProperty("/Data/AppName", data1[i].AppName);
										}
									}
								}
							}
						}
					},
					error: function (oError) {
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
				});
	
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}

				// if(oAppName.getItems().length > 0){
					oAppNameRow.removeStyleClass("displayNone");
				// }
			}
			
			// 추가휴게시간, 근로시간현황
			var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oJSONModel1 = oTable1.getModel();
			var vData1 = {Data : []};
			
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel2 = oTable2.getModel();
			var vData2 = {Data : []};
			
			if(oEvent.data.Data2){
				var data1 = oEvent.data.Data2;
				
				for(var i=0; i<data1.length; i++){
					if(data1[i].Austy == "A"){
						vData2.Data.push({
							Text : oController.getBundleText("LABEL_69015"),  // 추가휴게시간
							Value : (data1[i].Adbtm && data1[i].Adbtm != "" ? data1[i].Adbtm.substring(0,2) + ":" + data1[i].Adbtm.substring(2,4) : "")
						});
					} else {
						data1[i].Idx = i;
						data1[i].Offyn = oController._DetailJSonModel.getProperty("/Data/Offyn");
						vData1.Data.push(data1[i]);
					}
				}
				// 추가휴게는 5개까지 입력할 수 있음
				var oOffyn = oController._DetailJSonModel.getProperty("/Data/Offyn");
				if((oOffyn == "" || oOffyn == "1" || oOffyn == "2") && vData1.Data.length != 5){
					for(var i=vData1.Data.length; i<5; i++){
						var detail = {};
							detail.Idx = vData1.Data.length;
							detail.Offyn = oOffyn;
							detail.Datum = oController._DetailJSonModel.getProperty("/Data/Datum");
							detail.Beguz = "";
							detail.Enduz = "";
							detail.Notes = "";
							
							vData1.Data.push(detail);
					}
				}
				
				if(vData2.Data.length == 0){
					vData2.Data.push({Text : oController.getBundleText("LABEL_69015"), Value : ""}); // 추가휴게시간
				}
				
				var oWrktm = oController._DetailJSonModel.getProperty("/Data/Wrktm"); // 평일근로시간
					oWrktm = oWrktm && oWrktm != "" ? oWrktm.substring(0,2) + ":" + oWrktm.substring(2,4) : "";
				var oExttm = oController._DetailJSonModel.getProperty("/Data/Exttm"); // 연장근로시간
					oExttm = oExttm && oExttm != "" ? oExttm.substring(0,2) + ":" + oExttm.substring(2,4) : "";
				var oHoltm = oController._DetailJSonModel.getProperty("/Data/Holtm"); // 휴일근로시간
					oHoltm = oHoltm && oHoltm != "" ? oHoltm.substring(0,2) + ":" + oHoltm.substring(2,4) : "";
				
				vData2.Data.push({Text : oController.getBundleText("LABEL_69028"), Value : oWrktm}); // 평일근로시간
				vData2.Data.push({Text : oController.getBundleText("LABEL_69029"), Value : oExttm}); // 연장근로시간
				vData2.Data.push({Text : oController.getBundleText("LABEL_69030"), Value : oHoltm}); // 휴일근로시간
			}
			
			oJSONModel1.setData(vData1);
			oJSONModel2.setData(vData2);
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			// oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.m.Detail",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();	
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		// 시작/종료시간 변경 시 법정휴게시간 세팅
		onSetLnctm : function(oEvent, m){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();	
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			} else if(oEvent && m){
				if(parseInt(oEvent.getParameters().value.substring(2,4)) % m != 0){
					sap.m.MessageBox.error(oController.getBundleText("MSG_69009").replace("MM", m)); // 시간은 MM분 단위로 입력하여 주십시오.
					oEvent.getSource().setValue("");
					return;
				}
			}
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			if(oData.Beguz && oData.Enduz){
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = ((oData.Year + "") + (oData.Month < 10 ? ("0"+oData.Month) : (oData.Month+"")));
					createData.Langu = oData.Langu;
					createData.Prcty = "4";
					
				var detail = {};
					detail.Datum = "\/Date(" + common.Common.getTime(oData.Datum) + ")\/";
					detail.Beguz = oData.Beguz;
					detail.Enduz = oData.Enduz;
					detail.Lnctm = oData.Lnctm;
				createData.FlexWorktime1Nav.push(detail);
				
				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results && data.FlexWorktime1Nav.results.length){
								var data1 = data.FlexWorktime1Nav.results[0];
								
								oController._DetailJSonModel.setProperty("/Data/Lnctm", data1.Lnctm);
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
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			}
		},
		
		// 수정여부 필드값 변경
		// 1 근무일정 2 추가휴게 3 둘다변경
		setMonyn : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();
			
			var oMonyn = oController._DetailJSonModel.getProperty("/Data/Monyn");
				oMonyn = oMonyn == "" ? Flag : (oMonyn == Flag ? Flag : "3");
			
			oController._DetailJSonModel.setProperty("/Data/Monyn", oMonyn);
		},
		
		// 추가휴게 시작/종료시간 변경 시 시간 계산
		onChangeTime : function(oEvent, m){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();	
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			} else if(oEvent && m && oEvent.getParameters().value){
				if(parseInt(oEvent.getParameters().value.substring(2,4)) % m != 0){
					sap.m.MessageBox.error(oController.getBundleText("MSG_69009").replace("MM", m)); // 시간은 MM분 단위로 입력하여 주십시오.
					oEvent.getSource().setValue("");
					return;
				}
			}
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if((oData.Beguz == "" && oData.Enduz == "") || (oData.Beguz != "" && oData.Enduz != "")){
				// 추가휴게시간
				var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
				var oJSONModel1 = oTable1.getModel();
				var oTableData = oJSONModel1.getProperty("/Data");
				var vData = {Data : []};
				
				// 근로시간현황
				var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
				var oJSONModel2 = oTable2.getModel();
				
				var oFilter = oController._DetailJSonModel.getProperty("/Data");
				
				var createData = {FlexWorktime2Nav : []};
					createData.Langu = oFilter.Langu;
					createData.Werks = oFilter.Werks;
					createData.Pernr = oFilter.Pernr;
					createData.Zyymm = ((oFilter.Year + "") + (oFilter.Month < 10 ? ("0"+oFilter.Month) : (oFilter.Month+"")));
					createData.Prcty = "3";
					
				for(var i=0; i<oTableData.length; i++){
					var detail = {};
						detail.Werks = createData.Werks;
						detail.Pernr = createData.Pernr;
						detail.Zyymm = createData.Zyymm;
						detail.Datum = "\/Date(" + common.Common.getTime(oTableData[i].Datum) + ")\/";
						detail.Beguz = oTableData[i].Beguz;
						detail.Enduz = oTableData[i].Enduz;
						detail.Notes = oTableData[i].Notes;
						
					createData.FlexWorktime2Nav.push(detail);
				}
				
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Idx = i;
									data2[i].Offyn = oFilter.Offyn;
									
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									if(data2[i].Austy == "A"){
										oJSONModel2.setProperty("/Data/0/Value", data2[i].Adbtm == "" ? "" : data2[i].Adbtm.substring(0,2) + ":" + data2[i].Adbtm.substring(2,4));
									} else {
										vData.Data.push(data2[i]);
									}
								}
								// 합계가 넘어오지 않은 경우 추가휴게시간 초기화
								if(data2.length == 5){
									oJSONModel2.setProperty("/Data/0/Value", "");
								}
							}
						}
					},
					error: function (oError) {
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
				});
				
				oJSONModel1.setData(vData);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					oJSONModel2.setProperty("/Data/0/Value", "");
					return;
				}
				
			}
		},
		
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// 추가휴게시간
			var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_Table1").getModel().getProperty("/Data");
			
			// validation check
			if(oData.Monyn == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_69007")); // 변경사항이 없습니다.
				return;
			} else if(oData.Beguz > oData.Enduz){
				sap.m.MessageBox.error(oController.getBundleText("MSG_69002")); // 시작시간이 종료시간 이후인 경우 저장이 불가합니다.
				return;
			}

			var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// if(oAppName.getItems().length != 0){
				if(!oData.AppName){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // 결재자를 선택하여 주십시오.
					return;
				}
			// }
			
			var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : [], FlexWorktime5Nav : []}; 
			
			for(var i=0; i<oData2.length; i++){
				if(oData2[i].Austy == "A" || (oData2[i].Beguz == "" && oData2[i].Enduz == "")) continue;
				
				if(oData2[i].Beguz > oData2[i].Enduz){
					sap.m.MessageBox.error(oController.getBundleText("MSG_69002")); // 시작시간이 종료시간 이후인 경우 저장이 불가합니다.
					return;
				}
				
				var detail = {};
					detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/";
					detail.Beguz = oData2[i].Beguz;
					detail.Enduz = oData2[i].Enduz;
					detail.Adbtm = oData2[i].Adbtm;
					detail.Notes = oData2[i].Notes;
				
				if(oData.Offyn == "1"){
					createData.FlexWorktime5Nav.push(detail);
				} else {
					createData.FlexWorktime2Nav.push(detail);
				}
			}
			// Prcty Monyn 5 : 과거근무 변경신청
			var onProcess = function(){
				createData.Werks = oData.Werks;
				createData.Pernr = oData.Pernr;
				createData.Zyymm = (oData.Year + "") + (oData.Month < 10 ? ("0" + oData.Month) : (oData.Month + ""));
				createData.Prcty = oData.Offyn == "1" ? "5" : "2";
				
				var oAdbtm = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data/0/Value");
				
				createData.FlexWorktime1Nav.push({
					Datum : "\/Date(" + common.Common.getTime(oData.Datum) + ")\/",
					Beguz : oData.Beguz,
					Enduz : oData.Enduz,
					Lnctm : oData.Lnctm,
					Chgrsn : oData.Chgrsn,
					Adbtm : oAdbtm == "" ? "" : oAdbtm.replace(":", ""),
					Monyn : oData.Offyn == "1" ? "5" : oData.Monyn,
					Appkey1 : oData.Appkey1,
					AppName : oData.AppName ? oData.AppName : ""
				});
				
				var oChief = "";
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							oChief = data.Chief == "00000000" ? "" : data.Chief;
						}
					},
					error: function (oError) {
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
				});
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}

				// 2021-06-01 근무시간 변경 시 조직장에게 push 알림 발송
				if(oData.Monyn == "1" || oData.Monyn == "3"){
					var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getSessionInfoByKey("Dtfmt")});
					var oPush = [], oLnctm = "", oAdbtm = "";
					switch(oData.Lnctm){ // 법정휴게
						case "1":
							oLnctm = "00:30";
								break;
						case "2":
							oLnctm = "01:00";
							break;
						case "3":
							oLnctm = "01:30";
							break;
						case "4":
							oLnctm = "02:00";
							break;
						default:
							oLnctm = "-";
							break;
					};
					
					// 추가휴게
					oAdbtm = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data/0/Value");
					oAdbtm = oAdbtm == "" ? "-" : oAdbtm;
					
					// title : [Hi HR] ${Ename} 근무시간 변경 알림
					// body : ${Datum} ${Time} (법정휴게 ${Lnctm}, 추가휴게 ${Adbtm})
					oPush.push({
						title : oController.getBundleText("MSG_69011").interpolate(oData.Ename),
						body : oController.getBundleText("MSG_69012")
								.interpolate(dateFormat.format(oData.Datum), 
											 (oData.Beguz.substring(0,2) + ":" + oData.Beguz.substring(2,4) + "~" + oData.Enduz.substring(0,2) + ":" + oData.Enduz.substring(2,4)),
											 oLnctm,
											 oAdbtm)
					});

					if(oController.sendPush(oPush, oChief) == false) return;
				}
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onBack
				});
			};
			
			var confirmMessage = "", successMessage = "";
			if(oData.Offyn == "1"){
				confirmMessage = oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
				successMessage = oController.getBundleText("MSG_00061"); // 신청되었습니다.
			} else {
				confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
				successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				}
			});
		},

		// 2021-06-01 근무시간 변경 시 조직장에게 push 알림 발송
		sendPush : function(oPush, oChief){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.Detail");
			var oController = oView.getController();
			
			if(oChief != ""){
				var oModel = $.app.getModel("ZHR_COMMON_SRV");

				// 조직장 token 조회
				var createData = {AppPushAlarmTokenSet : [{Pernr : oChief}], AppPushAlarmLogSet : []};
					createData.IPernr = oController.getSessionInfoByKey("Pernr");
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = "1";
				var oToken = "";

				oModel.create("/AppPushAlarmHeaderSet", createData, {
					success: function(data){
						if(data){
							if(data.AppPushAlarmTokenSet && data.AppPushAlarmTokenSet.results){
								var data1 = data.AppPushAlarmTokenSet.results;
								
								oToken = data1[0].Token;
							}
						}
					},
					error: function (oError) {
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
				});

				if(oController.Error == "E"){
					oController.Error = "";
					MessageBox.error(oController.ErrorMessage);
					return false;
				}

				if(oToken != ""){
					createData.IConType = "2";

					for(var i=0; i<oPush.length; i++){
						if(Common.sendPush({
							title: oPush[i].title,
							body: oPush[i].body,
							token: oToken
						}) != false){
							createData.AppPushAlarmLogSet.push({Pernr : oChief, HeadTxt : oPush[i].title, BodyTxt : oPush[i].body});
						} 
					}

					oModel.create("/AppPushAlarmHeaderSet", createData, {
						success: function(data){
							if(data){
								
							}
						},
						error: function (oError) {
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
					});

					if(oController.Error == "E"){
						oController.Error = "";
						MessageBox.error(oController.ErrorMessage);
						return false;
					}
				} else {
					Common.log("조직장", oChief ," HI HR APP 미설치");
				}
			}
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});