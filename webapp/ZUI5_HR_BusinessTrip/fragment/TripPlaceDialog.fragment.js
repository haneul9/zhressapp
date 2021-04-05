sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.TripPlaceDialog", {

	createContent: function(oController) {

		var TripPlaceDialogHandler = oController.TripPlaceDialogHandler;

		return  new sap.m.SelectDialog({
			contentHeight: "50%",
			title: oController.getBundleText("LABEL_19631"), // 출장지 선택
			search: TripPlaceDialogHandler.onSearch.bind(TripPlaceDialogHandler),
			confirm: TripPlaceDialogHandler.onConfirm.bind(TripPlaceDialogHandler),
			draggable: true,
			resizable: true,
			growing: false,
			items: {
				path: "/TripPlaceList",
				template: new sap.m.StandardListItem({
					selected: "{selected}",
					title: "{PlaceName}",
					type: sap.m.ListType.Active
				})
			}			
		})
		.setModel(TripPlaceDialogHandler.getModel());
	}

});

});