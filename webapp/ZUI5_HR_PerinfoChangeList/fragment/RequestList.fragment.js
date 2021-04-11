sap.ui.define([
	"../../common/PickOnlyDateRangeSelection",
	"../../common/ZHR_TABLES",
	"../../control/ODataFileUploader",
	"../delegate/ViewTemplates",
	"../../common/Common"
], function(
	PickOnlyDateRangeSelection,
	ZHR_TABLES,
	ODataFileUploader,
	ViewTemplates
) {
"use strict";

sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), { 

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
					    new sap.m.Label({text: "{i18n>LABEL_19501}"}), // 기간
						new PickOnlyDateRangeSelection({
							displayFormat: "{Dtfmt}",
							secondDateValue: "{Endda}",
							dateValue: "{Begda}",
							delimiter: "~",
							width: "210px"
						}),
						new sap.m.Label({text: "{i18n>LABEL_50005}"}), // 진행상태
						new sap.m.ComboBox({
							width: "150px",
							selectedKey: "{Status}",
							items: [
				    			new sap.ui.core.ListItem({key: "0", text: "{i18n>LABEL_66002}"}),
				    			new sap.ui.core.ListItem({key: "1", text: "{i18n>LABEL_66003}"}),
				    			new sap.ui.core.ListItem({key: "2", text: "{i18n>LABEL_66004}"}),
				    			new sap.ui.core.ListItem({key: "3", text: "{i18n>LABEL_66005}"}),
				    			new sap.ui.core.ListItem({key: "4", text: "{i18n>LABEL_66006}"})
							]
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: oController.onPressSearch,
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-24px")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},

	getInfoHBox: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: ""}).addStyleClass("sub-title")
						.addStyleClass("color-blue")
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: oController.onPressDetail.bind(oController),
							text: "{i18n>LABEL_66007}" // 상세
						})
						.addStyleClass("button-light"),
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");
	},

	getTable: function(oController) {

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			selectionMode: sap.ui.table.SelectionMode.Single,
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
			cellClick: oController.onPressDetail.bind(oController)
		})
		.addStyleClass("mt-10px")
		.setModel(oController._ApplyJSonModel)
		.bindRows("/Data");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Idx",      label: "{i18n>LABEL_66008}"/* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "8%" },
			{ id: "ReqName",  label: "{i18n>LABEL_66009}"/* 신청내용 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "15%" },
			{ id: "AppDate",    label: "{i18n>LABEL_66010}"/* 신청일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "18%" },
			{ id: "AppType",       label: "{i18n>LABEL_66011}"/* 신청구분     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%" },
			{ id: "Status", label: "{i18n>LABEL_66012}"/* 진행상태   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%" },
			{ id: "ReqDate",       label: "{i18n>LABEL_66013}"/* 반영일   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "18%"},
			{ id: "Admin",     label: "{i18n>LABEL_66014}"/* 담당자   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "16%" },
		]);

		return oTable;
	}

});

});