sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/moment-with-locales",
	"../../common/PickOnlyDateRangeSelection",
	"../../common/ZHR_TABLES",
	"../delegate/ViewTemplates"
], function(
	Common,
	Formatter,
	momentjs,
	PickOnlyDateRangeSelection,
	ZHR_TABLES,
	ViewTemplates
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.CardExpenseDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19581"), // 법인카드 거래내역
			contentWidth: "1200px",
			contentHeight: "420px",
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

		var oModel = oController.CardExpenseDialogHandler.getModel();
		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getCorpCardUsedTable(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var CardExpenseDialogHandler = oController.CardExpenseDialogHandler,
		Dtfmt = oController.getSessionInfoByKey("Dtfmt");

		return new sap.m.VBox({
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.VBox({
							layoutData: new sap.m.FlexItemData({ minWidth: "450px" }),
							width: "45%",
							items: [
								new sap.m.HBox({
									items: [
										ViewTemplates.getHeaderLabel("{i18n>LABEL_19582}", false, "110px"), // 카드번호
										new sap.m.Select({
											layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
											width: "300px",
											selectedKey: "{/CorpCardUsed/ICardNo}",
											items: {
												path: "/CorpCardSelectList",
												templateShareable: false,
												template: new sap.ui.core.ListItem({ key: "{CardNo}", text: {
													parts: [
														{ path: "CardComNm" },
														{ path: "CardNo" }
													],
													formatter: function(CardComNm, CardNo) {
														return CardNo ? (CardComNm + " (" + CardNo + ")") : CardComNm;
													}
												}})
											}
										})
									]
								})
								.addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										ViewTemplates.getHeaderLabel("{i18n>LABEL_19586}", false, "110px"), // 승인일
										new PickOnlyDateRangeSelection("CorpCardUsedPeriod", {
											layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
											displayFormat: Dtfmt,
											secondDateValue: "{/CorpCardUsed/IEndda}",
											dateValue: "{/CorpCardUsed/IBegda}",
											delimiter: "~",
											width: "300px"
										})
									]
								})
								.addStyleClass("search-field-group")
							]
						})
						.addStyleClass("search-inner-vbox"),
						new sap.m.VBox({
							layoutData: new sap.m.FlexItemData({ minWidth: "450px" }),
							width: "45%",
							items: [
								new sap.m.HBox({
									items: [
										ViewTemplates.getHeaderLabel("{i18n>LABEL_19583}", false, "110px"), // 국내외 구분
										new sap.m.RadioButtonGroup({
											select: CardExpenseDialogHandler.selectClDmtrRadioButton.bind(CardExpenseDialogHandler),
											selectedIndex: "{= ${/CorpCardUsed/IClDmtr} === '1' ? 0 : (${/CorpCardUsed/IClDmtr} === '2' ? 1 : -1) }",
											columns: 2,
											buttons: [
												new sap.m.RadioButton({
													text: "{i18n>LABEL_19584}", // 국내
													customData: new sap.ui.core.CustomData({ key: "selectedClDmtr", value: "1" })
												}),
												new sap.m.RadioButton({
													text: "{i18n>LABEL_19585}", // 해외
													customData: new sap.ui.core.CustomData({ key: "selectedClDmtr", value: "2" })
												})
											]
										})
									]
								})
								.addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										ViewTemplates.getHeaderLabel("{i18n>LABEL_19587}", false, "110px"), // 승인번호
										new sap.m.Input({
											layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
											maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtCorpCardUseListTableIn", "ApprNo"),
											value: "{/CorpCardUsed/IApprNo}",
											width: "300px"
										})
									]
								})
								.addStyleClass("search-field-group"),
							]
						})
						.addStyleClass("search-inner-vbox"),
						new sap.m.VBox({
							layoutData: new sap.m.FlexItemData({ minWidth: "100px" }),
							width: "10%",
							items: [
								new sap.m.Button({
									press: CardExpenseDialogHandler.onBeforeOpen.bind(CardExpenseDialogHandler),
									text: "{i18n>LABEL_00100}" // 조회
								})
								.addStyleClass("button-search")
							]
						})
						.addStyleClass("button-group-popup")
					]
				})
			]
		})
		.addStyleClass("search-box search-bg pb-7px mnw-1000px");
	},

	getCorpCardUsedTable: function(oController) {

		var CardExpenseDialogHandler = oController.CardExpenseDialogHandler,
		oTable = new sap.ui.table.Table("CorpCardUsedTable", {
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
			cellClick: CardExpenseDialogHandler.clickTableCell.bind(CardExpenseDialogHandler)
		})
		.addStyleClass("mt-30px")
		.bindRows("/CorpCardUsedList");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "UsedDate",   label: "{i18n>LABEL_19586}"/* 승인일   */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "15%", templateGetter: "getCardApprDateTemplate", templateGetterOwner: ViewTemplates },
			{ id: "ApprNo",     label: "{i18n>LABEL_19587}"/* 승인번호 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%" },
			{ id: "StoreName",  label: "{i18n>LABEL_19588}"/* 사업자명 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "UsedForAmt", label: "{i18n>LABEL_19589}"/* 결제금액 */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "15%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "UsedCurr",   label: "{i18n>LABEL_19590}"/* 현지통화 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "UsedAmt",    label: "{i18n>LABEL_19591}"/* 정산금액 */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "15%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExpensCurr", label: "{i18n>LABEL_19592}"/* 정산통화 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" }
		]);

		return oTable;
	}

});

});