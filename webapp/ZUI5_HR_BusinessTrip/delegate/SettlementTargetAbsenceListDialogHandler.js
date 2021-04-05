/* global moment:true */
sap.ui.define([
	"../../common/Common",
	"../../common/moment-with-locales",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Common, momentjs, MessageBox, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ Absence: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, callback) {

		this.oController = oController;
		this.callback = callback;

		if (!oController.SettlementTargetAbsenceListDialogHandler) {
			this.oModel.setProperty("/Absence/Dtfmt", oController.getSessionInfoByKey("Dtfmt"));
			this.oModel.setProperty("/Absence/IBegda", moment().startOf("date").subtract(1, "months").add(1, "days").toDate());
			this.oModel.setProperty("/Absence/IEndda", moment().startOf("date").toDate());

			oController.SettlementTargetAbsenceListDialogHandler = this;
		}

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "SettlementTargetAbsenceListDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.SettlementTargetAbsenceListDialog",
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

		$.app.byId("SettlementTargetAbsenceListTable").setBusy(true, 0);

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtSettlementSet",
				{
					IConType: $.app.ConType.READ,
					IPernr: this.oController.getSessionInfoByKey("name"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					IBegda: Common.adjustGMTOdataFormat(this.oModel.getProperty("/Absence/IBegda")),
					IEndda: Common.adjustGMTOdataFormat(this.oModel.getProperty("/Absence/IEndda")),
					TableIn07: []
				},
				{
					async: true,
					success: function(oData) {
						var TableIn07 = Common.getTableInResults(oData, "TableIn07");
						this.oModel.setProperty("/Absence/List", TableIn07);

						Common.adjustVisibleRowCount($.app.byId("SettlementTargetAbsenceListTable").setBusy(false), 5, TableIn07.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log("SettlementTargetAbsenceListDialogHandler.onBeforeOpen error", oResponse);

						this.oModel.setProperty("/Absence/List", []);

						Common.adjustVisibleRowCount($.app.byId("SettlementTargetAbsenceListTable").setBusy(false), 1, 1);
					}.bind(this)
				}
			);
		}.bind(this));
	},

	clickTableCell: function(oEvent) {

		var p = oEvent.getParameter("rowBindingContext").getProperty();
		return Common.getPromise(function() {
			if (this.callback) {
				this.callback({
					isFromAbsence: true,
					BtStartdat: p.Begda,
					BtEnddat: p.Endda,
					Btbpn: p.Pernr
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