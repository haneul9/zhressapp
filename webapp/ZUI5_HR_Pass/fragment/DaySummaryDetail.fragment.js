sap.ui.define([
	"common/ZHR_TABLES"
], function (ZHR_TABLES) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_Pass.fragment.DaySummaryDetail", {

		createContent: function (oController) {

			return new sap.m.Popover({
				title: "",
				placement: sap.m.PlacementType.Auto,
				content: new sap.m.FlexBox({
					width: "auto",
					items: [
						this.getSummaryTable(oController)
					]
				}),
				contentWidth: "400px",
				endButton: new sap.m.Button({
					icon: "sap-icon://decline",	
					press: function (oEvent) {
						oEvent.getSource().getParent().getParent().close();
					}
				})
			}).addStyleClass("custom-tooltip");
		},

		getSummaryTable: function(oController) {
			var CondoHandler = oController.CondoHandler;
			
			var oSummaryTable = new sap.ui.table.Table(oController.PAGEID + "_SummaryDetailTable", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.setModel(new sap.ui.model.json.JSONModel())
			.bindRows("/summarys");

			var columnModels = [
				{ id: "Contx", label: "{i18n>LABEL_09033}", plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "60%", templateGetter: "getCondoDetailTitle", templateGetterOwner: CondoHandler },
				{ id: "Confm", label: "{i18n>LABEL_09049}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" },
				{ id: "Resev", label: "{i18n>LABEL_09050}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" }
			];

			ZHR_TABLES.makeColumn(oController, oSummaryTable, columnModels);

			return oSummaryTable;
		}
	});

});
