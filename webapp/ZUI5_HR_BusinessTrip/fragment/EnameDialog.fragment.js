sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.EnameDialog", {

	createContent: function(oController) {

		var EnameDialogHandler = oController.EnameDialogHandler;

		return  new sap.m.SelectDialog({
			// contentWidth: "1600px",
			contentHeight: "50%",
			// noDataText: oController.getBundleText("MSG_19012"), // 조회된 출장자 목록이 없습니다.
			title: oController.getBundleText("LABEL_19315"), // 출장자 선택
			// titleAlignment: sap.m.TitleAlignment.Auto,
			search: EnameDialogHandler.onSearch.bind(EnameDialogHandler),
			confirm: EnameDialogHandler.onConfirm.bind(EnameDialogHandler),
			// cancel: EnameDialogHandler.onCancel,
			// showClearButton: true,
			draggable: true,
			resizable: true,
			growing: false,
			items: {
				path: "/EnameList",
				template: new sap.m.StandardListItem({
					selected: "{selected}",
					title: "{Innam}",
					description: "{Inper}, " + oController.getBundleText("LABEL_00156") + " : {Inogx}", // {사번}, 부서명 : {부서명}
					type: sap.m.ListType.Active
				}),
				sorter: {
					path: "Innam",
					descending: false
				}
			}			
		})
		.setModel(EnameDialogHandler.getModel());
	}

});

});