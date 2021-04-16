sap.ui.define([
	"common/PickOnlyDateRangeSelection",
	"common/ZHR_TABLES",
	"../delegate/OnRequest",
	"../delegate/ViewTemplates"
], function(
	PickOnlyDateRangeSelection,
	ZHR_TABLES,
	OnRequest,
	ViewTemplates
) {
"use strict";

sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), { // 출장 사전 신청

	createContent: function(oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
				this.getSearchHBox(oController),
				this.getInfoHBox(oController),
				this.getTable(oController)
			]
		});
	},

	getSearchHBox: function(oController) {

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_19101}"}), // 신청일
						new PickOnlyDateRangeSelection({
							displayFormat: "{Dtfmt}",
							secondDateValue: "{IEndda}",
							dateValue: "{IBegda}",
							delimiter: "~",
							width: "210px"
						}),
						new sap.m.Label({text: "{i18n>LABEL_19102}"}), // 결재상태
						new sap.m.ComboBox({
							width: "100px",
							selectedKey: "{IZzok}",
							items: {
								path: "ApprovalStatusList",
								templateShareable: false,
								template: new sap.ui.core.ListItem({key: "{Code}", text: "{Text}"})
							}
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: OnRequest.pressSearch.bind(oController),
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px")
		.setModel(oController.RequestSearchModel)
		.bindElement("/");
	},

	getInfoHBox: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_19004}"}).addStyleClass("sub-title") // 신청현황
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: OnRequest.pressRequestForm.bind(oController),
							text: "{i18n>LABEL_00152}" // 신청
						})
						.addStyleClass("button-light")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");
	},

	getTable: function(oController) {

		var oTable = new sap.ui.table.Table("RequestListTable", {
			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			rowSettingsTemplate: new sap.ui.table.RowSettings({
				highlight: {
					path: "Status1",
					formatter: function(Status1) {
						if (Status1 === "AA") { // 미결재
							return sap.ui.core.MessageType.None;
						} else if (Status1 === "99") { // 결재완료
							return sap.ui.core.MessageType.Success;
						} else if (Status1 === "88") { // 반려
							return sap.ui.core.MessageType.Warning;
						} else {
							return sap.ui.core.MessageType.Information;
						}
					}
				}
			}),
			cellClick: OnRequest.clickRequestListCell.bind(oController)
		})
		.addStyleClass("mt-10px")
		.setModel(oController.RequestListModel)
		.bindRows("/");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "DtRqst",      label: "{i18n>LABEL_19201}"/* 신청일     */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "8%", templateGetter: "getDateTextTemplate", templateGetterOwner: ViewTemplates },
			{ id: "BtStartdat",  label: "{i18n>LABEL_19202}"/* 출장시작일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "8%", templateGetter: "getDateTextTemplate", templateGetterOwner: ViewTemplates },
			{ id: "BtEnddat",    label: "{i18n>LABEL_19203}"/* 출장종료일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "8%", templateGetter: "getDateTextTemplate", templateGetterOwner: ViewTemplates },
			{ id: "Title",       label: "{i18n>LABEL_19204}"/* 출장명     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "21%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "BtPurpose1T", label: "{i18n>LABEL_19205}"/* 출장구분   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "ZzokT",       label: "{i18n>LABEL_19206}"/* 결재상태   */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "8%", templateGetter: "getColorTextTemplate", templateGetterOwner: this },
			{ id: "BtStatT",     label: "{i18n>LABEL_19207}"/* 승인상태   */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "8%", templateGetter: "getColorTextTemplate", templateGetterOwner: this },
			{ id: "Zzdocno",     label: "{i18n>LABEL_19208}"/* 신청번호   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "9%" },
			{ id: "BtrpnT",      label: "{i18n>LABEL_19209}"/* 신청자     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "BtbpnT",      label: "{i18n>LABEL_19210}"/* 출장자     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" }
		]);

		return oTable;
	},

	getColorTextTemplate: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.Center,
			text: {
				parts: [
					{ path: columnInfo.id },
					{ path: "UrlA" },
					{ path: "UrlA1" }
				],
				formatter: function(v, UrlA, UrlA1) {
					this.toggleStyleClass("mimic-link", !!UrlA || !!UrlA1);
					return v;
				}
			}
		});
	},

	getDateTextTemplate: function(columnInfo) {

		return new sap.m.Text({
			text: {
				path: columnInfo.id,
				formatter: function(pV) {
					if (!(pV instanceof Date)) {
						return "";
					}
					return sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" }).format(pV);
				}
			}
		});
	}

});

});