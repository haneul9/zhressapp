sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_OpenHelpRoomHASS.fragment.ManagerSearch", {
		
		_colModel: [
			{id: "Ename", 	label: "{i18n>LABEL_25015}" /* 관리자 */,	 plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "auto"},
			{id: "Orgtx", 	label: "{i18n>LABEL_25016}" /* 소속 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "250px"},
			{id: "ZtitleT", label: "{i18n>LABEL_25017}" /* 직위 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		],
		createContent: function (oController) {
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 5,
				showOverlay: false,
				showNoData: true,				
			    width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.setModel(oController.ManagerModel)
			.bindRows("/Data")
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_25003}",
				contentWidth: "500px",
				contentHeight: "275px",
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_25018}", // 닫기
					}).addStyleClass("button-default"),
				],
				content: [
					oTable
				]
			}).addStyleClass("custom-dialog-popup");
			
			return oDialog;
		}
	});
});
