sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "sap/m/MessageBox",
	"sap/ui/export/Spreadsheet"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, Spreadsheet) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		EmpModel : new JSONModelHelper(),
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
			this.EmpModel.setData({ User: {}});
			this.onTableSearch();
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

			oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.ILangu = oController.getSessionInfoByKey("Langu");
			sendObject.IConType = "1";
			// Navigation property
			sendObject.BankAccountApplyNav1 = [];
			sendObject.BankAccountApplyNav2 = [];
			
			oModel.create("/BankAccountApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.BankAccountApplyNav1) {
						Common.log(oData);
						var rDatas = oData.BankAccountApplyNav1.results;
						oController.TableModel.setData({Data: rDatas}); 
						oController.TableModel.setProperty("/BankList", oData.BankAccountApplyNav2.results);
						oController.EmpModel.setProperty("/User/IBanka", oData.IBanka);
						oController.EmpModel.setProperty("/User/IBankn", oData.IBankn);
						oController.EmpModel.setProperty("/User/IBankl", oData.IBankl);
						oController.EmpModel.setProperty("/User/Ename", oController.getSessionInfoByKey("Ename"));
					}

				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
        },

		onPressReq: function() { //신청
			var oController = this;

			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
				data: {
					BankList: oController.TableModel.getProperty("/BankList"),
					User: oController.EmpModel.getProperty("/User")
				}
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
					RowData: oCopiedRow,
					BankList: oController.TableModel.getProperty("/BankList")
				}
            });
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