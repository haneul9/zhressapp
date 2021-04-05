sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionOrgDocumentFilter", {
	createContent: function (oController) {
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ADVF_Dialog", {
			title: "{i18n>LABEL_02084}",
			confirm: oController.onConfirmFilterDialog
		});

		for (var i = 0; i < oController._vDisplayControl.length; i++) {
			var Fieldname = common.Common.underscoreToCamelCase(oController._vDisplayControl[i].Fieldname),
				TextFieldname = Fieldname + "_Tx";

			var oFilterItem = new sap.m.ViewSettingsFilterItem(oController.PAGEID + "_AODF_" + TextFieldname, {
				text: "{i18n>" + oController._vDisplayControl[i].Fieldname + "}",
				key: TextFieldname
			});
			oDialog.addFilterItem(oFilterItem);
		}

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
