sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"../common/PageHelper",
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
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oReqBtn = $.app.byId(oController.PAGEID + "_onPressReqBtn");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			
			oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업

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
					
					if (oData && oData.CultureTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.CultureTableIn1.results;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}

					var rDatas2 = oData.CultureExport.results[0];
					oController.DetailModel.setData({LogData: rDatas2});
					
					if(oData.CultureTableIn1 && rDatas2) oController.getBetrg2TView();
					
					var rDatas3 = oData.CultureTableIn3.results;
					oController.TextViewModel.setData({Data: rDatas3});
					
					if(oController.TableModel.getData().Data.every(function(e){ return e.Spmon !== oController.DetailModel.getData().LogData.ESpmon})){
						if(oController.DetailModel.getProperty("/LogData/EButton") === "X"){
							oReqBtn.setVisible(true);
							return;
						}
					}
					oReqBtn.setVisible(false);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					oReqBtn.setVisible(false);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
			Common.adjustAutoVisibleRowCount.call(oTable);
		},
		
		getDatePicker: function() {
			var oController = $.app.getController();
			
			var oUsedtDate =  new sap.m.DatePicker({
				dateValue: "{Usedt}",
				textAlign: "Center",
				valueFormat: "yyyy-MM-dd",
				placeholder:"yyyy-mm-dd",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				editable: {
					path: "/FormData/Status",
					formatter: function(v) {
						if(v === "10" || !v) return true;
						else return false; 
					}
				}
			});
			
			return oUsedtDate;
		},
		
		getContents: function() {

			return new sap.m.Input({
				value: "{Usetx}",
				maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CultureTableIn2", "Usetx", false),
				editable: {
					path: "/FormData/Status",
					formatter: function(v) {
						if(v === "10" || !v) return true;
						else return false; 
					}
				}
			});
		},
		
		getPrice: function() {
			var oController = $.app.getController();
				
			return new sap.m.Input(oController.PAGEID + "_BetrgInput", {
				value: {
					path: "Betrg",
					formatter: function(v) {
						if(v) return Common.numberWithCommas(v);
						else return ;
					}, 
				},
				liveChange: oController.getAddPrice,
				maxLength: 9,
				textAlign: "End",
				editable: {
					path: "/FormData/Status",
					formatter: function(v) {
						if(v === "10" || !v) return true;
						else return false; 
					}
				}
			});
		},
		getAddPrice: function(oEvent) {
			var oController = $.app.getController();
			var vEBetrg = Number(oController.DetailModel.getData().LogData.EBetrg.replace(/,/g, ""));
			var vPrice = 0;
			
			if(oEvent){
				var vPath = oEvent.getSource().getBindingContext().getPath();
				var vInputValue = oEvent.getSource().getValue();
				oController.DetailModel.setProperty(vPath + "/Betrg", vInputValue.replace(/,/g, ""));
				
				if(isNaN(vInputValue.replace(/,/g, "")))
					oController.DetailModel.setProperty(vPath + "/Betrg", vInputValue.replace(/[^0-9]/g, ""));
			}
			
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
		
		getPayMethod: function() {
			var oController = $.app.getController();
			
			return	new sap.m.FlexBox({
				items: [
					new sap.m.RadioButtonGroup({
			 			columns : 2,
						width: "150px",
						select : oController.onChangeData,
			 			buttons : [
							new sap.m.RadioButton({
								text : "{i18n>LABEL_21023}",
								textAlign: "Center",
								selected: {
									path: "Usecd",
									formatter: function(v) {
										if(v === "M") return true;
										else return false;
									}
								}, 
								useEntireWidth : true, 
								width : "auto"
							}),
			 				new sap.m.RadioButton({
								text : "{i18n>LABEL_21024}",
								textAlign: "Center",
								selected: {
									path: "Usecd",
									formatter: function(v) {
										if(v === "C") return true;
										else return false;
									}
								}, 
								useEntireWidth : true, 
								width : "auto"
							})
						],
						editable: {
							path: "/FormData/Status",
							formatter: function(v) {
								if(v === "10" || !v) return true;
								else return false; 
							}
						}
					})
				]
			});
		},
		
		onChangeData: function(oEvent) {
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
		
		getBetrg2TView: function() {
			var oController = $.app.getController();
				
			var vEBetrg = oController.DetailModel.getData().LogData.EBetrg;
			var vBetrg2 = "";
			var vLength = oController.TableModel.getData().Data.length;
			
			for(var i=0 ; i<vLength; i++){
				if(Number(oController.TableModel.getProperty("/Data")[i].Betrg1.replace(/,/g, "")) >= Number(vEBetrg.replace(/,/g, ""))) vBetrg2 = vEBetrg;
				else vBetrg2 = oController.TableModel.getProperty("/Data")[i].Betrg1.replace(/,/g, "");
				oController.TableModel.setProperty("/Data/" + i + "/Betrg2", vBetrg2.replace(/,/g, ""));
			}
		},
		
		getTextView: function() {
			var oController = $.app.getController();
			var oTextFlexBox = $.app.byId(oController.PAGEID + "_TextFlexBox");
			var vLength = oController.TextViewModel.getData().Data.length;
			
			for(var i=0; i<vLength; i++){
				if(i === 0) {
					oTextFlexBox.addItem(
						new sap.m.Label({
							text: oController.TextViewModel.getData().Data[i].Text,
							textAlign: "Begin",
						//	design: "Bold"
						}).addStyleClass("color-info-red font-medium")
					);
				}else{
					oTextFlexBox.addItem(
						new sap.m.Text({
							text: oController.TextViewModel.getData().Data[i].Text,
							textAlign: "Begin",
						}).addStyleClass("ml-4px mr-4px")
					);
				}
			}
		},
		
		onSelectedRow: function(oEvent) { // Row선택
			var oView = $.app.byId("ZUI5_HR_CulturalLivingExpenses.List"),
				oController = $.app.getController();
			var oContext = oEvent.mParameters.rowIndex;
			var oRowData = oController.TableModel.getProperty("/Data/" + oContext);	
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun(); 
			var vRowIndex = oEvent.mParameters.rowBindingContext.sPath.slice(6);
			
			oController.DetailModel.setProperty("/TableData", []);
			oController.DetailModel.setProperty("/FormData", []);
			oController.TextViewModel.setProperty("/FileData", {});
			oController.DetailModel.setProperty("/LogData/Gubun","");
			oController.DetailModel.setProperty("/FormData", oRowData);
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.CulturalLivingExpensesDetail", oController);
				oView.addDependent(oController._DetailModel);
				oController.getTextView();
			}
			var oRewirteBtn = $.app.byId(oController.PAGEID + "_RewirteBtn"),
				oRequestBtn = $.app.byId(oController.PAGEID + "_RequestBtn"),
				oSaveBtn= $.app.byId(oController.PAGEID + "_SaveBtn");
				
			if(oRowData.Spmon !== oController.DetailModel.getProperty("/LogData/ESpmon")){
				if(oController.DetailModel.getProperty("/LogData/EButton") !== "X")
					oRewirteBtn.setVisible(false);
					
				oSaveBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				
			}
			
			if(oRowData.Status === "10" && Common.checkNull(!oRowData.Notes) && oRowData.Spmon !== oController.DetailModel.getProperty("/LogData/ESpmon"))
				oRewirteBtn.setVisible(true); 
			
			oController.onPressBtnVisble();
			var oDetailTable = $.app.byId(oController.PAGEID + "_DetailTable");
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IGubun = "L";
			sendObject.IBukrs = vBukrs2;
			sendObject.ISpmon = oController.TableModel.getProperty("/Data")[vRowIndex].Spmon;
			// Navigation property
			sendObject.CultureTableIn2 = [];
			sendObject.CultureTableIn4 = [];
			
			oModel.create("/CultureImportSet", sendObject, {
				success: function(oData, oResponse) {
				if (oData && oData.CultureTableIn2) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas = oData.CultureTableIn2.results;
						var dataLength = rDatas.length;
						oDetailTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength); //rowcount가 10개 미만이면 그 갯수만큼 row적용
						
						oController.DetailModel.setProperty("/TableData", rDatas);
						oController.TextViewModel.setProperty("/FileData", oData.CultureTableIn4.results);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});
			
			oController._DetailModel.open();
		},
		
		onPressBtnVisble: function() {
			var oController = $.app.getController();
			var vStatus = oController.DetailModel.getProperty("/FormData/Status");
			oController.DetailModel.setProperty("/TableData/Status", vStatus);
		},
		
		onPressReqBtn: function() { //신청버튼
			var oView = $.app.byId("ZUI5_HR_CulturalLivingExpenses.List"),
				oController = $.app.getController();
			var oReqBtn = $.app.byId(oController.PAGEID + "_onPressReqBtn");
			
			if(oController.TableModel.getData().Data !== undefined){
				if(oController.TableModel.getData().Data.some(function(e){ return e.Spmon === oController.DetailModel.getData().LogData.ESpmon})){
					oReqBtn.setVisible(false);
					return;
				}
			}
			
			// Data setting
			oController.DetailModel.setProperty("/TableData", []);
			oController.DetailModel.setProperty("/FormData", []);
			oController.TextViewModel.setProperty("/FileData", {});
			oController.DetailModel.setProperty("/LogData/Gubun","");
			
			var vDate = oController.DetailModel.getProperty("/LogData/ESpmon");
			oController.DetailModel.setProperty("/FormData/Spmon", vDate);
			oController.DetailModel.setProperty("/FormData/StatusT", "신규");
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.CulturalLivingExpensesDetail", oController);
				oView.addDependent(oController._DetailModel);
				oController.getTextView();
			}
			oController.onPressBtnVisble();
			oController._DetailModel.open();
			oController.onPressAddRow();
		},
		
		onPressAddRow: function() { // Row추가
			var oController = $.app.getController();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var oDetailTable = $.app.byId(oController.PAGEID + "_DetailTable");
			var vDate = oController.DetailModel.getProperty("/FormData/Spmon");
			var vYear = Number(vDate.slice(0,4));
			var vMonth = Number(vDate.slice(4,6));
			var vPernr = oController.getUserId();
			
			if(oController.nullCheck()) return;
			
			oTableData.push({"Usedt": new Date(vYear, vMonth-1, 1), "Usetx": "", "Betrg": "", "UsecdT": "", "Pernr": vPernr, "Spmon": vDate});	
			oController.DetailModel.setProperty("/TableData",oTableData);
			
			var dataLength = oController.DetailModel.getData().TableData.length;
			oDetailTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength);
		},
		
		onPressDelRow: function(oEvent) {
			var oController = $.app.getController();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var oDetailTable = $.app.byId(oController.PAGEID + "_DetailTable");
			var dataLength = oController.DetailModel.getData().TableData.length;
			
			if(Common.checkNull(oDetailTable.getSelectedIndices())){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21013"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return;
			}
			
			if(dataLength <= 1 ){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_21001"), {
					title: oController.getBundleText("LABEL_09030")
				});
				return;
			}
			var vIndex = 0;
			oDetailTable.getSelectedIndices().forEach(function(elem,index,arr) {
				if(index === 0) vIndex = elem;
				else vIndex = elem - index;
				
				oTableData.splice(vIndex, 1);
			});
			oDetailTable.clearSelection();
			oController.DetailModel.setProperty("/TableData",oTableData);
			dataLength = oTableData.length;
			oDetailTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength);
			oController.getAddPrice();
		},
		
		onPressDialogRewrite: function() {//Dialog 재작성
			var oController = $.app.getController();
			oController.DetailModel.setProperty("/FormData/Status", "10");
			oController.onBeforeOpenDetailDialog();
			
			var oSaveBtn= $.app.byId(oController.PAGEID + "_SaveBtn");
				
			if(oController.DetailModel.getProperty("/FormData").Spmon !== oController.DetailModel.getProperty("/LogData/ESpmon")){
				oSaveBtn.setVisible(false);
			}
		},
		
		onPressDialogDelete: function() {//Dialog 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var vSpmon = oController.DetailModel.getProperty("/FormData/Spmon");
			var oFormData = oController.DetailModel.getProperty("/FormData");
			var sendObject = {};
			
			BusyIndicator.show(0);
			var onPressDialogCancel = function (fVal) {
				if (fVal && fVal == "삭제") {
					
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "D";
					sendObject.IBukrs = vBukrs2;
					sendObject.ISpmon = vSpmon;
					// Navigation property
					sendObject.CultureTableIn1 = [Common.copyByMetadata(oModel, "CultureTableIn1", oFormData)];
					sendObject.CultureTableIn2 = oTableData;
					
					oModel.create("/CultureImportSet", sendObject, {
						async: true,
						success: function (oData, response) {
							oController._DetailModel.close();
							oController.onTableSearch();
							BusyIndicator.hide();
						},
						error: function (oError) {
							BusyIndicator.hide();
							Common.log(oError);
						}
					});
				}
				BusyIndicator.hide();
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_21014"), {
				title: oController.getBundleText("LABEL_21022"),
				actions: ["삭제", "취소"],
				onClose: onPressDialogCancel
			});
		},
		
		onPressDialogReq: function() {//Dialog 신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var vSpmon = oController.DetailModel.getProperty("/FormData/Spmon");
			var oFormData = oController.DetailModel.getProperty("/FormData"),
				oCopiedData = {};
			var sendObject = {};
			delete oTableData.Status;
			delete oTableData.vPay;
			
			oCopiedData = Object.assign({}, oFormData);
			
			
			if(oController.nullCheck()) return;
			
			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_21007"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}
			BusyIndicator.show(0);
			var onPressDialogReq = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == "신청") {
					// 첨부파일 저장
					sendObject.CultureTableIn4 = [{Appnm: AttachFileAction.uploadFile.call(oController)}];
					if(!sendObject.CultureTableIn4) return false;
					
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "C";
					sendObject.IBukrs = vBukrs2;
					sendObject.ISpmon = vSpmon;
					// Navigation property
					sendObject.CultureTableIn1 = [Common.copyByMetadata(oModel, "CultureTableIn1", oCopiedData)];
					
					oTableData.forEach(function(elem) {elem.Waers = "KRW"});
					// oTableData.forEach(function(elem) {elem.Usedt.setDate(elem.Usedt.getDate() + 1)});
					sendObject.CultureTableIn2 = oTableData;
					
					oModel.create("/CultureImportSet", sendObject, {
						async: true,
						success: function (oData, response) {
							oController._DetailModel.close();
							oController.onTableSearch();
							BusyIndicator.hide();
						},
						error: function (oError) {
							Common.log(oError);
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_21006"), {
				title: oController.getBundleText("LABEL_21022"),
				actions: ["신청", "취소"],
				onClose: onPressDialogReq
			});
		},
		
		onPressDialogSave: function() {// Dialog 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2= oController.getUserGubun();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var vSpmon = oController.DetailModel.getProperty("/FormData/Spmon");
			var oFormData = oController.DetailModel.getProperty("/FormData"),
				oCopiedData = {};
			var sendObject = {};
			delete oTableData.Status;
			delete oTableData.vPay;
			
			oCopiedData = Object.assign({}, oFormData);
			
			if(oController.nullCheck()) return;
			
			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_21007"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}
			BusyIndicator.show(0);
			var onPressDialogReq = function (fVal) {
				if (fVal && fVal == "저장") {
					// 첨부파일 저장
					sendObject.CultureTableIn4 = [{Appnm: AttachFileAction.uploadFile.call(oController)}];
					if(!sendObject.CultureTableIn4) return false;
					
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "S";
					sendObject.IBukrs = vBukrs2;
					sendObject.ISpmon = vSpmon;
					// Navigation property
					sendObject.CultureTableIn1 = [Common.copyByMetadata(oModel, "CultureTableIn1", oCopiedData)];
					
					oTableData.forEach(function(elem) {elem.Waers = "KRW"});
					// oTableData.forEach(function(elem) {elem.Usedt.setDate(elem.Usedt.getDate() + 1)});
					sendObject.CultureTableIn2 = oTableData;
					
					oModel.create("/CultureImportSet", sendObject, {
						async: true,
						success: function (oData, response) {
							oController._DetailModel.close();
							oController.onTableSearch();
							BusyIndicator.hide();
						},
						error: function (oError) {
							Common.log(oError);
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_21012"), {
				title: oController.getBundleText("LABEL_21022"),
				actions: ["저장", "취소"],
				onClose: onPressDialogReq
			});
		},
		
		onPressDialogCancel: function() {//Dialog 신청취소
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2= oController.getUserGubun();
			var oTableData = oController.DetailModel.getProperty("/TableData");
			var vSpmon = oController.DetailModel.getProperty("/FormData/Spmon");
			var oFormData = oController.DetailModel.getProperty("/FormData");
			var sendObject = {};
			
			BusyIndicator.show(0);
			var onPressDialogCancel = function (fVal) {
				if (fVal && fVal == "신청취소") {
					
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "R";
					sendObject.IBukrs = vBukrs2;
					sendObject.ISpmon = vSpmon;
					// Navigation property
					sendObject.CultureTableIn1 = [Common.copyByMetadata(oModel, "CultureTableIn1", oFormData)];
					sendObject.CultureTableIn2 = oTableData;
					
					oModel.create("/CultureImportSet", sendObject, {
						async: true,
						success: function (oData, response) {
							oController._DetailModel.close();
							oController.onTableSearch();
							BusyIndicator.hide();
						},
						error: function (oError) {
							BusyIndicator.hide();
							Common.log(oError);
						}
					});
				}
				BusyIndicator.hide();
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_21009"), {
				title: oController.getBundleText("LABEL_21022"),
				actions: ["신청취소", "취소"],
				onClose: onPressDialogCancel
			});
		},
		
		nullCheck: function() {
			var oController = $.app.getController();
			var vCheckVal = false;
			var vLength = oController.DetailModel.getProperty("/TableData").length;
			
			for(var i=0; i<vLength; i++){
				if(Common.checkNull(oController.DetailModel.getProperty("/TableData")[i].Usedt)){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_21002"), {
						title: oController.getBundleText("LABEL_09030")
					});
					vCheckVal = true;
					break;
				}
				
				if(Common.checkNull(oController.DetailModel.getProperty("/TableData")[i].Usetx)){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_21003"), {
						title: oController.getBundleText("LABEL_09030")
					});
					vCheckVal = true;
					break;
				}
				
				if(Common.checkNull(oController.DetailModel.getProperty("/TableData")[i].Betrg)){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_21004"), {
						title: oController.getBundleText("LABEL_09030")
					});
					vCheckVal = true;
					break;
				}
				
				if(Common.checkNull(oController.DetailModel.getProperty("/TableData")[i].UsecdT)){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_21005"), {
						title: oController.getBundleText("LABEL_09030")
					});
					vCheckVal = true;
				}
			}
				
			return vCheckVal;
		},
		
		onBeforeOpenDetailDialog: function(oEvent) {
			var vStatus = this.DetailModel.getProperty("/FormData/Status"),
				vAppnm = this.TextViewModel.getProperty("/FileData/0/Appnm") || "";

			AttachFileAction.setAttachFile(this, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "100",
				Editable: (!vStatus || vStatus === "10") ? true : false
			});
		},
		
		 onAfterOpenDetailDialog: function(oEvent) {
		 	var oDetailTable = $.app.byId(this.PAGEID + "_DetailTable");

			oDetailTable.getRows().forEach(function(elem,index) {
		 		oDetailTable.getRows()[index].getCells()[0].$().find("INPUT").attr("disabled", true);
		 	});
		 },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20200151"});// 35110041 00192025 20200151 20170068
		} : null
	});
});