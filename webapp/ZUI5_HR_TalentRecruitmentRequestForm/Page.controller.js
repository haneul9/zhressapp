sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "sap/m/MessageBox",
	"sap/ui/export/Spreadsheet",
	"common/SearchOrg"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, Spreadsheet, SearchOrg) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",

		PersNumModel: new JSONModelHelper(),
		TableModel: new JSONModelHelper(),
		
		_Columns: [],
		
		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs3");
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
				}, this);
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {			
			var oMultiInput = $.app.byId(this.PAGEID + "_Orgeh");
			if(!oMultiInput.getTokens()[0]) {
				oMultiInput.destroyTokens();

				oMultiInput
				.addToken(
					new sap.m.Token({
						key: this.getSessionInfoByKey("Orgeh"),
						text: this.getSessionInfoByKey("Stext")
					})
				);
			}
			this.onTableSearch();
        },

		onPressSer: function() {
			this.onTableSearch();
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oDeptInput = $.app.byId(oController.PAGEID + "_Orgeh");
			var oModel = $.app.getModel("ZHR_HRDOC_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

			if(Common.checkNull(oDeptInput.getTokens()[0])){
				return MessageBox.error(oController.getBundleText("MSG_77007"), { title: oController.getBundleText("LABEL_00149")});
			}

			oController.TableModel.setData({Data: []}); 
			oController.PersNumModel.setData({Data: {}});
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IOrgeh = oDeptInput.getTokens()[0].mProperties.key;
			sendObject.IConType = "1";
			// Navigation property
			sendObject.EmpRecruitNav = [];
			sendObject.EmpRecruitNav2 = [];
			sendObject.EmpRecruitNav3 = [];
			
			oModel.create("/NewEmpRecruitSet", sendObject, {
				success: function(oData) {
					if (oData && oData.EmpRecruitNav) {
						Common.log(oData);
						var rDatas = oData.EmpRecruitNav.results;
						var vNum1 = 0,
							vNum2 = 0,
							vNum3 = 0,
							vNum4 = 0,
							vNum5 = 0,
							vNum6 = 0,
							vNum7 = 0,
							vNum8 = 0,
							vNum9 = 0,
							oDataList = {};

						rDatas.forEach(function(e) {
							switch(e.Recsta) {
								case "10" :
									vNum1 = vNum1 + 1;
									break;
								case "20" :
									vNum2 = vNum2 + 1;
									break;
								case "21" :
									vNum3 = vNum3 + 1;
									break;
								case "30" :
									vNum4 = vNum4 + 1;
									break;
								case "31" :
									vNum5 = vNum5 + 1;
									break;
								case "32" :
									vNum6 = vNum6 + 1;
									break;
								case "40" :
									vNum7 = vNum7 + 1;
									break;
								case "41" :
									vNum8 = vNum8 + 1;
									break;
								case "42" :
									vNum9 = vNum9 + 1;
									break;
							}
							oDataList = {
								Num1 : vNum1,
								Num2 : vNum2,
								Num3 : vNum3,
								Num4 : vNum4,
								Num5 : vNum5,
								Num6 : vNum6,
								Num7 : vNum7,
								Num8 : vNum8,
								Num9 : vNum9
							};
						});
						
						oController.PersNumModel.setData({Data: oDataList});
						oController.TableModel.setData({Data: rDatas});
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
        },

		onPressReq: function() { //신청
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix())
            });
		},
		
		onSelectedRow: function(oEvent) {
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var oCopiedRow = $.extend(true, {}, oRowData);
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
				data: {
					RowData: oCopiedRow
				}
            });
		},

		// 소속부서 검색
		displayMultiOrgSearchDialog: function (oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_TalentRecruitmentRequestForm.Page");
			var oController = oView.getController();

			SearchOrg.oController = oController;
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vActionType = "Single";
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				oView.addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

        onPressExcelDownload : function(){ // Excel 다운로드
			var oController = this;
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();

            if (!oJSONModel.getProperty("/Data") || oJSONModel.getProperty("/Data").length === 0) {
                MessageBox.warning(oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
                return;
            }
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oController.getBundleText("LABEL_75001") + ".xlsx" // 급여계좌변경신청
			};
	
			var oSpreadsheet = new Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20090028"});
		} : null
	});
});