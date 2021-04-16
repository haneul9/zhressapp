sap.ui.define([
	"common/Common",
	"common/Formatter",
	"common/moment-with-locales",
	"common/PickOnlyDatePicker",
	"common/ZHR_TABLES"
], function(
	Common,
	Formatter,
	momentjs,
	PickOnlyDatePicker,
	ZHR_TABLES
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.CurrencyDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19661"), // 통화 검색
			contentWidth: "600px",
			contentHeight: "380px",
			content: this.getContent(oController),
			draggable: true,
			endButton: [
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						oDialog.close();
					}
				})
				.addStyleClass("button-default")
			]
		})
		.addStyleClass("custom-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var oModel = oController.CurrencyDialogHandler.getModel();
		return [
			this.getSearchHBox(oController).setModel(oModel),
			this.getCurrencyTable(oController).setModel(oModel)
		];
	},

	getSearchHBox: function(oController) {

		var CurrencyDialogHandler = oController.CurrencyDialogHandler,
		Dtfmt = oController.getSessionInfoByKey("Dtfmt");

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({ text: "{i18n>LABEL_19662}" }), // 환율 기준일
						new PickOnlyDatePicker({
							dateValue: "{/Currency/IDatum}",
							displayFormat: Dtfmt,
							placeholder: Dtfmt,
							width: "150px"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: CurrencyDialogHandler.onBeforeOpen.bind(CurrencyDialogHandler),
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px");
	},

	getCurrencyTable: function(oController) {

		var CurrencyDialogHandler = oController.CurrencyDialogHandler,
		oTable = new sap.ui.table.Table("CurrencyTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 5,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			cellClick: CurrencyDialogHandler.clickTableCell.bind(CurrencyDialogHandler)
		})
		.addStyleClass("mt-30px")
		.bindRows("/Currency/SearchList");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Waers", label: "{i18n>LABEL_19663}"/* 통화 코드 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" },
			{ id: "Ltext", label: "{i18n>LABEL_19664}"/* 통화 명칭 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "Erate", label: "{i18n>LABEL_19665}"/* 환율      */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "30%", align: sap.ui.core.HorizontalAlign.Right }
		]);

		return oTable;
	}

});

});