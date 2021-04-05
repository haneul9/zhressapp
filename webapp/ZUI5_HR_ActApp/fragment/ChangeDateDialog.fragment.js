sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ChangeDateDialog", {
	/**
	 * @memberOf fragment.ChangeDateDialog
	 */

	createContent: function (oController) {
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CD_Dialog", {
			content: [
				new sap.m.DatePicker(oController.PAGEID + "_CD_Actda", {
					width: "200px",
					valueFormat: "yyyy-MM-dd",
					displayFormat: gDtfmt,
					change: oController.changeDate
				})
			],
			contentWidth: "200px",
			contentHeight: "80px",
			showHeader: true,
			title: "{i18n>LABEL_02203}",
			beforeOpen: oController.onBeforeOpenChangeDateDialog,
			beginButton: new sap.m.Button(oController.PAGEID + "_CD_ConfirmBtn", {
				text: "{i18n>LABEL_02053}",
				icon: "sap-icon://accept",
				press: oController.onChangeActionDate
			}),
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onCDClose
			})
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
