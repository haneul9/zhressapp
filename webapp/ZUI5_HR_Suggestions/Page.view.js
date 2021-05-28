sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/PickOnlyDateRangeSelection"
], function (PageHelper, ZHR_TABLES, PickOnlyDateRangeSelection) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_ColModel: [
			{id: "Znumb", label: "{i18n>LABEL_56024}" /* No. */,		plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "3%"},
			{id: "Title", label: "{i18n>LABEL_56006}" /* 제목 */,       plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Zgood", label: "{i18n>LABEL_56020}" /* 좋아요 */,       plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true, width: "5%", templateGetter: "setThumUp"},
			{id: "Zbed",  label: "{i18n>LABEL_56021}" /* 싫어요 */,       plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true, width: "5%", templateGetter: "setThumDown"},
			{id: "Zreply",label: "{i18n>LABEL_56023}" /* 댓글횟수 */,   plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "5%"},
			{id: "Zread", label: "{i18n>LABEL_56022}" /* 조회횟수 */,   plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "5%"},
			{id: "Sdate", label: "{i18n>LABEL_56007}" /* 등록일 */,		plabel: "", resize: true, span: 0, type: "date",	sort: true,  filter: true,  width: "8%"},
			{id: "Aedtm", label: "{i18n>LABEL_56008}" /* 최종변경일/시 */, plabel: "", resize: true, span: 0, type: "template", sort: true,  filter: true,  width: "13%", templateGetter: "getChangeDate"}
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {

			$.app.setModel("ZHR_COMMON_SRV");

			var vYear = new Date().getFullYear();
			var vMonth = new Date().getMonth()+1;
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_56002}"}), // 검색어(제목)
							new sap.m.Input(oController.PAGEID + "_SearchInput",{
								width: "200px",
								value: "{ITitle}"
							}),
							new sap.m.Label({text: "{i18n>LABEL_56003}"}), // 등록일
							new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "250px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, vMonth-2, 1),
								secondDateValue: new Date(vYear, vMonth, 0)
							})
						]
					}).addStyleClass("search-field-group mr-10px"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								text: "{i18n>LABEL_56004}" // 조회
							}).addStyleClass("button-search"),
							new sap.m.Button({
								press: oController.onPressNotice.bind(oController),
								tooltip: " ",
								icon: "sap-icon://bell" // 알림
							}).addStyleClass("button-light w-36px ml-8px")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px mt-16px");

			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.End,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.Button({
						press: oController.onPressRegi.bind(oController),
						text: "{i18n>LABEL_56005}" // 등록
					}).addStyleClass("button-light")
				]
			}).addStyleClass("mt-10px");

			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				cellClick: oController.onSelectedRow,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTable, this._ColModel);
			
			return new PageHelper({
				contentItems: [
					oSearchBox,
					infoBox,
					oTable
				]
			});
		}
	});
});
