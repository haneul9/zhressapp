sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_LeaveReinstatement.fragment.LeaveReinHistory", {
		
		_colModel: [
			{id: "Begda",    label: "{i18n>LABEL_42034}" /* 발령일 */,	 plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "20%"},
			{id: "Mntxt",    label: "{i18n>LABEL_42035}" /* 발령유형 */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "20%"},
			{id: "Mgtxt",    label: "{i18n>LABEL_42036}" /* 발령사유 */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "25%"},
			{id: "Stext2",   label: "{i18n>LABEL_42037}" /* 부서 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "PGradeTxt",label: "{i18n>LABEL_42038}" /* 직급 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "10%"}
		],
		createContent: function (oController) {
			
			var oHistoryTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
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
			.setModel(oController.HistoryModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oHistoryTable, this._colModel);
			
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_42033}",
				contentWidth: "850px",
				contentHeight: "280px",
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_25018}", // 닫기
					}).addStyleClass("button-default"),
				],
				content: [
					oHistoryTable
				]
			}).addStyleClass("custom-dialog-popup");
			

			return oDialog;
		}
	});
});
