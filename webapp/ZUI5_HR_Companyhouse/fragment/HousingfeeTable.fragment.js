sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_Companyhouse.fragment.HousingfeeTable", {
		_FeeModel: [
			{id: "Zyymm",	label: "{i18n>LABEL_14021}"/* 대상기간 */,	  plabel: "", resize: true, span: 0, type: "template", sort: true,  filter: true,  width: "auto", templateGetter: "getMonthFormatter"},
			{id: "Bet01", 	label: "{i18n>LABEL_14011}"/* 사택료 */,	  plabel: "", resize: true, span: 0, type: "money",  sort: true,  filter: true,  width: "9%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet02", 	label: "{i18n>LABEL_14012}"/* 전기료 */,	  plabel: "", resize: true, span: 0, type: "money",  sort: true,  filter: true,  width: "8%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet03",	label: "{i18n>LABEL_14013}"/* 가스료 */,	  plabel: "", resize: true, span: 0, type: "money", sort: true,  filter: true,  width: "8%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet04",	label: "{i18n>LABEL_14014}"/* 난방료 */,	  plabel: "", resize: true, span: 0, type: "money", sort: true,  filter: true,  width: "8%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet05",	label: "{i18n>LABEL_14015}"/* 수도료 */,      plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "8%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet06",	label: "{i18n>LABEL_14016}"/* TV공청료 */,    plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet07",	label: "{i18n>LABEL_14017}"/* TV시청료 */,    plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet08",	label: "{i18n>LABEL_14018}"/* 음식물수수료 */,plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "13%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet09",	label: "{i18n>LABEL_14019}"/* 기타 */,		  plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "8%", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Bet10",	label: "{i18n>LABEL_14020}"/* 합계 */,		  plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "9%", align: sap.ui.core.HorizontalAlign.Right}
		],
		
		createContent: function (oController) {
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "100%",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
				.addStyleClass("mt-18px")
				.setModel(oController.FeeModelTable)
				.bindRows("/Data");
				
			ZHR_TABLES.makeColumn(oController, oTable, this._FeeModel);
			
		return oTable;
		}
	});
});