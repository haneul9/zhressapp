sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"../../common/AttachFileAction",
		"sap/ui/core/IconPool",
		"sap/m/MessageBox",
		"sap/ui/core/BusyIndicator"
	],
	function (Common, CommonController, JSONModelHelper, AttachFileAction, IconPool, MessageBox, BusyIndicator) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "LivingExpensesApply"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "LivingExpensesApply",

			DetailModel: new JSONModelHelper(),
			TextViewModel: new JSONModelHelper(),

			getUserId: function() {
				
				return $.app.getController().getUserId();
			},
			
			getUserGubun: function() {
				
				return $.app.getController().getUserGubun();
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);
				
				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				BusyIndicator.show(0);
				
				this.onBeforeOpenFileUpload();
				
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				var	oListController = $.app.getController();
				var	oController = this.getView().getController();
				var oRewirteBtn = $.app.byId(oController.PAGEID + "_RewirteBtn"),
					oRequestBtn = $.app.byId(oController.PAGEID + "_RequestBtn"),
					oSaveBtn = $.app.byId(oController.PAGEID + "_SaveBtn");
				var oRowData = oListController.DetailModel.getProperty("/FormData");
				
				if(oRowData.Spmon !== oListController.DetailModel.getProperty("/LogData/ESpmon")){
					if(oListController.DetailModel.getProperty("/LogData/EButton") !== "X")
						oRewirteBtn.setVisible(false);
						
					oRequestBtn.setVisible(false);
					oSaveBtn.setVisible(false);
				}
				
				if(oRowData.Status === "10" && Common.checkNull(!oRowData.Notes) && oRowData.Spmon !== oListController.DetailModel.getProperty("/LogData/ESpmon"))
					oRewirteBtn.setVisible(true);
				
				Common.log("onAfterShow");
				BusyIndicator.hide();
			},
			
			navBack: function() {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
				});
			},
			
			onPressRewrite: function() {//Dialog 재작성
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				oListController.DetailModel.setProperty("/FormData/Status", "10");
				oController.onBeforeOpenFileUpload();
				
				var oSaveBtn= $.app.byId(oController.PAGEID + "_SaveBtn");
				
				if(oListController.DetailModel.getProperty("/FormData").Spmon !== oListController.DetailModel.getProperty("/LogData/ESpmon")){
					oSaveBtn.setVisible(false);
				}
			},
			
			onPressReq: function() {//Dialog 신청
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				var vBukrs2 = oController.getUserGubun();
				var oTableData = oListController.DetailModel.getProperty("/TableData");
				var vSpmon = oListController.DetailModel.getProperty("/FormData/Spmon");
				var oFormData = oListController.DetailModel.getProperty("/FormData"),
					oCopiedData = {};
				var sendObject = {};
				var oSendTable = [];
				delete oTableData.Status;
				delete oTableData.vPay;
				
				oCopiedData = Object.assign({}, oFormData);
				
				
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
						
						oTableData.forEach(function(elem) {
							elem.Waers = "KRW";
							oSendTable.push(Common.copyByMetadata(oModel, "CultureTableIn2", elem));
						});
						// oTableData.forEach(function(elem) {elem.Usedt.setDate(elem.Usedt.getDate() + 1)});
						oTableData.forEach(function(elem) {delete elem.Checked});
						sendObject.CultureTableIn2 = oSendTable;
						
						oModel.create("/CultureImportSet", sendObject, {
							async: true,
							success: function (oData, response) {
								oListController.onTableSearch();
								oController.navBack();
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
			
			onPressSave: function() {// Dialog 저장
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				var vBukrs2= oController.getUserGubun();
				var oTableData = oListController.DetailModel.getProperty("/TableData");
				var vSpmon = oListController.DetailModel.getProperty("/FormData/Spmon");
				var oFormData = oListController.DetailModel.getProperty("/FormData"),
					oCopiedData = {};
				var sendObject = {};
				var oSendTable = [];
				delete oTableData.Status;
				delete oTableData.vPay;
				delete oTableData.Checked;
				
				oCopiedData = Object.assign({}, oFormData);
				
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
						
						oTableData.forEach(function(elem) {
							elem.Waers = "KRW";
							oSendTable.push(Common.copyByMetadata(oModel, "CultureTableIn2", elem));
						});
						// oTableData.forEach(function(elem) {elem.Usedt.setDate(elem.Usedt.getDate() + 1)});
						oTableData.forEach(function(elem) {delete elem.Checked});
						sendObject.CultureTableIn2 = oSendTable;
						
						oModel.create("/CultureImportSet", sendObject, {
							async: true,
							success: function (oData, response) {
								oListController.onTableSearch();
								oController.navBack();
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
			
			onPressCancel: function() {//Dialog 신청취소
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				var vBukrs2= oController.getUserGubun();
				var oTableData = oListController.DetailModel.getProperty("/TableData");
				var vSpmon = oListController.DetailModel.getProperty("/FormData/Spmon");
				var oFormData = oListController.DetailModel.getProperty("/FormData");
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
						oTableData.forEach(function(elem) {delete elem.Checked});
						sendObject.CultureTableIn2 = oTableData;
						
						oModel.create("/CultureImportSet", sendObject, {
							async: true,
							success: function (oData, response) {
								oListController.onTableSearch();
								oController.navBack();
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
			onPressDelete: function() { // 삭제
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				var vBukrs2 = oController.getUserGubun();
				var oTableData = oListController.DetailModel.getProperty("/TableData");
				var vSpmon = oListController.DetailModel.getProperty("/FormData/Spmon");
				var oFormData = oListController.DetailModel.getProperty("/FormData");
				var sendObject = {};
				
				BusyIndicator.show(0);
				var onPressDelete = function (fVal) {
					if (fVal && fVal == "삭제") {
						
						// Header
						sendObject.IPernr = vPernr;
						sendObject.IGubun = "D";
						sendObject.IBukrs = vBukrs2;
						sendObject.ISpmon = vSpmon;
						// Navigation property
						sendObject.CultureTableIn1 = [Common.copyByMetadata(oModel, "CultureTableIn1", oFormData)];
						oTableData.forEach(function(elem) {delete elem.Checked});
						sendObject.CultureTableIn2 = oTableData;
						
						oModel.create("/CultureImportSet", sendObject, {
							async: true,
							success: function (oData, response) {
								oListController.onTableSearch();
								oController.navBack();
								BusyIndicator.hide();
							},
							error: function (oError) {
								oListController.onTableSearch();
								oController.navBack();
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
					onClose: onPressDelete
				});
			},

			onPressAddRow: function(oEvent) { //출 추가
				var oView = $.app.getView(),
					oController = $.app.getController();
				
				if (!oController._DetailModel) {
					oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.LivingExpensesAdd", oController);
					oView.addDependent(oController._DetailModel);
				}
				oController.DetailModel.setProperty("/InputData", []);
				oController._DetailModel.open();
			},
			
			onPressDelRow: function(oEvent) { //줄 삭제
				var oController = $.app.getController();
				var oTableData = oController.DetailModel.getProperty("/TableData");
				
				if(oTableData.every(function(elem) {return elem.Checked !== true})){
					sap.m.MessageBox.alert(oController.getBundleText("MSG_21013"), {
						title: oController.getBundleText("LABEL_09030")
					});
					return;
				}
				
				oTableData.forEach(function(elem, index, arr){
					if(elem.Checked === true)
						arr.splice(index, 1);
				})
				
				oController.DetailModel.setProperty("/TableData",oTableData);
				oController.getAddPrice();
			},
			
			onBeforeOpenFileUpload: function(oEvent) {
				var oListController = $.app.getController();
				var oController = this.getView().getController();
				var vStatus = oListController.DetailModel.getProperty("/FormData/Status"),
					vAppnm = oListController.TextViewModel.getProperty("/FileData/0/Appnm") || "",
					oTextData = oListController.TextViewModel.getData().Data;
	
				AttachFileAction.setAttachFile(oController, {
					Appnm: vAppnm,
					Required: true,
					Mode: "M",
					Max: 100,
					Editable: (!vStatus || vStatus === "10") ? true : false,
					HelpButton: true,
					HelpTextList: oTextData
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20200151"});// 35110041 00192025 20200151 20170068
			} : null
			 
		});
	}
);
