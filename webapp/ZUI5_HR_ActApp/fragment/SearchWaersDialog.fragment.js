sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SearchWaersDialog", {
	createContent: function (oController) {
		var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Waers_StandardList", {
			title: "{Etext}",
			info: "{Ecode}"
		});

		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Waers_Dialog", {
			title: "{i18n>LABEL_02346}",
			contentWidth: "150px",
			search: oController.onSearchWaers,
			confirm: oController.onConfirmWaers,
			cancel: oController.onCancelWaers,
			items: {
				path: "/EmpCodeListSet",
				template: oStandardList,
				filters: [
					new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Waers"),
					new sap.ui.model.Filter("Ecode", sap.ui.model.FilterOperator.NE, "0000")
				]
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		return oDialog;
	}
});
