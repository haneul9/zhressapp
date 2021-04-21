sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.PlaceSearchDialog", {

	createContent: function(oController) {

		var PlaceSearchDialogHandler = oController.PlaceSearchDialogHandler;

		return  new sap.m.SelectDialog({
			contentHeight: "50%",
			title: oController.getBundleText("LABEL_19631"), // 출장지
			search: PlaceSearchDialogHandler.onSearch.bind(PlaceSearchDialogHandler),
			confirm: PlaceSearchDialogHandler.onConfirm.bind(PlaceSearchDialogHandler),
			draggable: true,
			resizable: true,
			growing: false,
			items: {
				path: "/PlaceList",
				template: new sap.m.StandardListItem({
					title: "{title}",
					type: sap.m.ListType.Active
				})
			}			
		})
		.setModel(PlaceSearchDialogHandler.getModel());
	}

});

});