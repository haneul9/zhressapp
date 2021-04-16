sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(Common, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ WBS: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, initData, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/WBS/SubCode", initData.subCode || ""); // 검색 : 비용항목
		this.oModel.setProperty("/WBS/Code",    initData.code || "");    // 검색 : WBS코드
		this.oModel.setProperty("/WBS/Text",    initData.text || "");

		oController.WBSDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "WBSDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.WBSDialog",
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

		$.app.byId("WBSTable").setBusy(true, 0);

		return Common.getPromise(function () {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // WBS코드 목록 조회
				"/BtBaseSet",
				{
					ICodeT: $.app.byId("WBSGroup").getSelectedButton().data("selectedWBSGroup"),
					ISubCode: this.oModel.getProperty("/WBS/SubCode"),
					ICode: this.oModel.getProperty("/WBS/Code"),
					IText: this.oModel.getProperty("/WBS/Text"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [],
					TableIn03: [], // WBS List
					TableIn04: [],
					TableIn05: [],
					TableIn06: [],
					TableIn07: [],
					TableIn08: [],
					TableIn09: []
				},
				{
					success: function (oData) {
						var TableIn03 = Common.getTableInResults(oData, "TableIn03");
						this.oModel.setProperty("/WBS/List", TableIn03);

						Common.adjustVisibleRowCount($.app.byId("WBSTable").setBusy(false), 5, TableIn03.length);
					}.bind(this),
					error: function (oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/WBS/List", []);

						Common.adjustVisibleRowCount($.app.byId("WBSTable").setBusy(false), 1, 1);
					}
				}
			);
		}.bind(this));
	},

	clickTableCell: function(oEvent) {

		var p = oEvent.getParameter("rowBindingContext").getProperty();
		return Common.getPromise(function() {
			if (this.callback) {
				this.callback({
					code: p.Posid,
					text: p.Post1
				});
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});