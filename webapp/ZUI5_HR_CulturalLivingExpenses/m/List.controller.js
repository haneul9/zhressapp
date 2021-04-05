sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/AttachFileAction",
	"../../common/JSONModelHelper",
	"../../common/PageHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, PageHelper, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "List",
		
		TableModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		TextViewModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs2;
		},
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			
			this.onTableSearch();
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oReqBtn = $.app.byId(oController.PAGEID + "_onPressReqBtn");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "L";
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.CultureExport = [];
			sendObject.CultureTableIn1 = [];
			sendObject.CultureTableIn3 = [];
			sendObject.CultureTableIn4 = [];
			
			oModel.create("/CultureImportSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 5;
					if (oData && oData.CultureTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.CultureTableIn1.results;
						dataLength = rDatas1.length;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}else{
						oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업
					}
					
					var rDatas2 = oData.CultureExport.results[0];
					oController.DetailModel.setData({LogData: rDatas2});
					
					var rDatas3 = oData.CultureTableIn3.results;
					oController.TextViewModel.setData({Data: rDatas3});
					
					if(Common.checkNull(!oController.TableModel.getData().Data) || oController.TableModel.getData().Data !== undefined){
						if(oController.TableModel.getData().Data.some(function(e){ return e.Spmon === oController.DetailModel.getData().LogData.ESpmon})){
							oReqBtn.setVisible(false);
							return;
						}
						else oReqBtn.setVisible(true);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					oReqBtn.setVisible(false);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onSelectedRow: function(oEvent) { // Row선택
			var	oController = $.app.getController();
			var vPath = oEvent.mParameters.listItem.oBindingContexts.undefined.sPath;
			var oRowData = oController.TableModel.getProperty(vPath);	
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun(); 
			
			oController.DetailModel.setProperty("/TableData", []);
			oController.DetailModel.setProperty("/InputData", []);
			oController.DetailModel.setProperty("/FormData", []);
			oController.TextViewModel.setProperty("/FileData", {});
			oController.DetailModel.setProperty("/LogData/Gubun","");
			oController.DetailModel.setProperty("/FormData", oRowData);
			
			oController.onPressBtnVisble();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "L";
			sendObject.IBukrs = vBukrs2;
			sendObject.ISpmon = oController.TableModel.getProperty(vPath).Spmon;
			// Navigation property
			sendObject.CultureTableIn2 = [];
			sendObject.CultureTableIn4 = [];
			
			oModel.create("/CultureImportSet", sendObject, {
				success: function(oData, oResponse) {
				if (oData && oData.CultureTableIn2) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas = oData.CultureTableIn2.results;
						
						oController.DetailModel.setProperty("/TableData", rDatas);
						oController.TextViewModel.setProperty("/FileData", oData.CultureTableIn4.results);
					}
				},
				error: function(oResponse) { 
					Common.log(oResponse);
				}
			});
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LivingExpensesApply"].join($.app.getDeviceSuffix()),
				data: oRowData
            });
		},
		
		onPressBtnVisble: function() {
			var oController = $.app.getController();
			var vStatus = oController.DetailModel.getProperty("/FormData/Status");
			oController.DetailModel.setProperty("/TableData/Status", vStatus);
		},
		
		onPressReqBtn: function(oEvent) { //신청버튼
			var oController = $.app.getController();
			var oReqBtn = $.app.byId(oController.PAGEID + "_onPressReqBtn");
			
			if(oController.TableModel.getData().Data !== undefined){
				if(oController.TableModel.getData().Data.some(function(e){ return e.Spmon === oController.DetailModel.getData().LogData.ESpmon})){
					oReqBtn.setVisible(false);
					return;
				}
			}
			
			// Data setting
			oController.DetailModel.setProperty("/TableData", []);
			oController.DetailModel.setProperty("/InputData", []);
			oController.TextViewModel.setProperty("/FileData", {});
			oController.DetailModel.setProperty("/FormData", {});
			oController.DetailModel.setProperty("/LogData/Gubun","");
			
			var vDate = oController.DetailModel.getProperty("/LogData/ESpmon");
			oController.DetailModel.setProperty("/FormData/Spmon", vDate);
			oController.DetailModel.setProperty("/FormData/StatusT", "신규");
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LivingExpensesApply"].join($.app.getDeviceSuffix()),
            });

			oController.onPressBtnVisble();
		},
		
		onPressDialogSave: function(oEvent) { //Dialog 저장
			var oView = $.app.getView(),
				oController = $.app.getController();
			var oInputData = oController.DetailModel.getProperty("/InputData");
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var vDate = oController.DetailModel.getProperty("/FormData/Spmon");
			var vPernr = oController.getUserId();
			
			if(oController.nullCheck()) return;
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.LivingExpensesAdd", oController);
				oView.addDependent(oController._DetailModel);
			}
			
			oTableData.push({"Usedt": oInputData.Usedt, "Usetx": oInputData.Usetx, "Betrg": oInputData.Betrg, "UsecdT": oInputData.UsecdT, "Pernr": vPernr, "Spmon": vDate});
			oController.DetailModel.setProperty("/TableData",oTableData);
			oController.getAddPrice();
			oController._DetailModel.close();
			
		},
		
		nullCheck: function() {
			var oController = $.app.getController();
			
			if(Common.checkNull(oController.DetailModel.getProperty("/InputData").Usedt)){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21002"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return true;
			}
			
			if(Common.checkNull(oController.DetailModel.getProperty("/InputData").Usetx)){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21003"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return true;
			}
			
			if(Common.checkNull(oController.DetailModel.getProperty("/InputData").Betrg)){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21004"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return true;
			}
			
			if(Common.checkNull(oController.DetailModel.getProperty("/InputData").UsecdT)){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21005"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return true;
			}
		},
		
		getAddPrice: function() {
			var oController = $.app.getController();
			var vEBetrg = Number(oController.DetailModel.getData().LogData.EBetrg.replace(/,/g, ""));
			var vPrice = 0;
			
			oController.DetailModel.getProperty("/TableData").forEach(function(elem) {
				vPrice += Number(elem.Betrg.replace(/[^\d]/g, ""));
			});
			
			oController.DetailModel.setProperty("/FormData/Betrg1",String(vPrice));

			var vPrice2 = vPrice <= vEBetrg ? vPrice : vEBetrg;
			oController.DetailModel.setProperty("/FormData/Betrg2",String(vPrice2));
			
			if(vPrice <= vEBetrg) oController.DetailModel.setProperty("/LogData/Gubun","");
			
			if(Common.checkNull(!oController.DetailModel.getProperty("/LogData/Gubun"))) return;
			
			if(vPrice > vEBetrg){
				oController.DetailModel.setProperty("/LogData/Gubun","X");
				var vMsg = oController.getBundleText("MSG_21008");
				vMsg = vMsg.replace(/&&&/g, oController.DetailModel.getData().LogData.EBetrg);
				
				sap.m.MessageBox.alert(vMsg, {
					title: oController.getBundleText("LABEL_09030")
				});
			}else oController.DetailModel.setProperty("/LogData/Gubun","");
			
			
		},

		InputCost: function(oEvent) {
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.DetailModel.setProperty("/InputData/Betrg", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
		},
		
		onChangeData: function(oEvent) { //checkBox누를때마다 변동되는값
			var oController = $.app.getController();
			var vPath = oEvent.getSource().getBindingContext().getPath();
			
			if(oEvent.mParameters.selectedIndex === 0){
				oController.DetailModel.setProperty(vPath + "/UsecdT", "현금");
				oController.DetailModel.setProperty(vPath + "/Usecd", "M");
			}else{
				oController.DetailModel.setProperty(vPath + "/UsecdT", "카드");
				oController.DetailModel.setProperty(vPath + "/Usecd", "C");
			}
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20200151"});// 35110041 00192025 20200151 20170068
		} : null
	});
});