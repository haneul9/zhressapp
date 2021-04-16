sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(Common, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ SubCostCenter: {} }),
	dialogTitle: null,
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, initData, callback) {

		this.oController = oController;
		this.dialogTitle = initData.dialogTitle;
		this.callback = callback;

		this.oModel.setProperty("/SubCostCenter/SubCode", initData.subCode || ""); // 검색 : 사업영역
		this.oModel.setProperty("/SubCostCenter/Code",    initData.code || "");    // 검색 : 코스트센터
		this.oModel.setProperty("/SubCostCenter/Text",    initData.text || "");

		oController.SubCostCenterDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "SubCostCenterDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.SubCostCenterDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.oModel;
	},

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	onBeforeOpen: function() {

		$.app.byId("SubCostCenterTable").setBusy(true, 0);

		this.oDialog.setTitle(this.oController.getBundleText("LABEL_19401", this.dialogTitle || " ")); // {0} 코스트센터 선택

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 비용귀속부서 코스트센터 코드 목록 조회
				"/BtBaseSet",
				{
					ICodeT: "002",
					ISubCode: this.oModel.getProperty("/SubCostCenter/SubCode"),
					ICode: this.oModel.getProperty("/SubCostCenter/Code"),
					IText: this.oModel.getProperty("/SubCostCenter/Text"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [], // SubCostCenter List
					TableIn03: [],
					TableIn04: [],
					TableIn05: [],
					TableIn06: [],
					TableIn07: [],
					TableIn08: [],
					TableIn09: []
				},
				{
					success: function(oData) {
						var TableIn02 = Common.getTableInResults(oData, "TableIn02");
						this.oModel.setProperty("/SubCostCenter/List", TableIn02);

						Common.adjustVisibleRowCount($.app.byId("SubCostCenterTable").setBusy(false), 5, TableIn02.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/SubCostCenter/List", []);

						Common.adjustVisibleRowCount($.app.byId("SubCostCenterTable").setBusy(false), 1, 1);
					}
				}
			);
		}.bind(this));
	},

	clickTableCell: function(oEvent) {

		var p = oEvent.getParameter("rowBindingContext").getProperty();
		return Common.getPromise(function () {
			if (this.callback) {
				this.callback({
					code: p.Kostl,
					text: p.KostlT
				});
			}
		}.bind(this))
		.then(function () {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});