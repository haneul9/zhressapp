sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionOrgDocumentSort", {
	createContent: function (oController) {
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ADVS_Dialog", {
			title: "{i18n>LABEL_02162}",
			confirm: oController.onConfirmSortDialog
		});

		for (var i = 0; i < oController._vDisplayControl.length; i++) {
			var Fieldname = common.Common.underscoreToCamelCase(oController._vDisplayControl[i].Fieldname),
				TextFieldname = Fieldname + "_Tx";

			oDialog.addSortItem(
				new sap.m.ViewSettingsItem({
					text: oController._vDisplayControl[i].Label,
					key: TextFieldname
				})
			);
		}

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
