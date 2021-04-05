sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.MainCostCenterDialog", {

	createContent: function(oController) {

		var MainCostCenterDialogHandler = oController.MainCostCenterDialogHandler;

		return  new sap.m.SelectDialog({
			// contentWidth: "1600px",
			contentHeight: "50%",
			// noDataText: oController.getBundleText("MSG_19013"), // 조회된 코스트센터 목록이 없습니다.
			title: oController.getBundleText("LABEL_19401", oController.getBundleText("LABEL_19305")), // {0} 코스트센터 선택, 소속부서
			// titleAlignment: sap.m.TitleAlignment.Auto,
			search: MainCostCenterDialogHandler.onSearch.bind(MainCostCenterDialogHandler),
			confirm: MainCostCenterDialogHandler.onConfirm.bind(MainCostCenterDialogHandler),
			// cancel: MainCostCenterDialogHandler.onCancel,
			// showClearButton: true,
			draggable: true,
			resizable: true,
			growing: false,
			items: {
				path: "/MainCostCenter/List",
				template: new sap.m.StandardListItem({
					selected: "{selected}",
					title: "{Ltext}({Kostl})",
					description: "{Orgtx}({Orgeh})", // {부서명}({부서코드})
					type: sap.m.ListType.Active
				}),
				sorter: {
					path: "Kostl",
					descending: false
				}
			}
			// .addStyleClass("custom-dialog-search")
		})
		.setModel(MainCostCenterDialogHandler.getModel());
	}

});

});