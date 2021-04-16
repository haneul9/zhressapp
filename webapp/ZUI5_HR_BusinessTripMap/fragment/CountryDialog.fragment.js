sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.CountryDialog", {

	createContent: function(oController) {

		var CountryDialogHandler = oController.CountryDialogHandler;

		return new sap.m.SelectDialog({
			// contentWidth: "1600px",
			contentHeight: "50%",
			title: oController.getBundleText("LABEL_19701"), // 국가 선택
			search: CountryDialogHandler.onSearch.bind(CountryDialogHandler),
			confirm: CountryDialogHandler.onConfirm.bind(CountryDialogHandler),
			// cancel: CountryDialogHandler.onCancel,
			// showClearButton: true,
			draggable: true,
			resizable: true,
			growing: true,
			items: {
				path: '/CountryList',
				template: new sap.m.StandardListItem({
					selected: "{selected}",
					title: "{Text} ({Code})",
					type: sap.m.ListType.Active
				}),
				sorter: {
					path: 'Text',
					descending: false
				}
			}
		})
		.setModel(CountryDialogHandler.getModel());
	}

});

});