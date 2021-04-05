sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SelectDoctype", {
	
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.SelectMassn
	 */
	createContent: function (oController) {
		var mDocTypeList = sap.ui.getCore().getModel("DocTypeList");
		var vDocTypeList = mDocTypeList.getProperty("/DocTypeListSet");

		var oCell = null,
			oRadio = null;

		var oSelectLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: new sap.m.Label({ text: "{i18n>MSG_02015}" })
		}).addStyleClass("L2PPaddingLeft10");
		oSelectLayout.createRow(oCell);

		if (vDocTypeList && vDocTypeList.length) {
			for (var i = 0; i < vDocTypeList.length; i++) {
				oRadio = new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton" + (i + 1), {
					groupName: "DOCTYPE",
					text: vDocTypeList[i].Doctx,
					customData: [
						{ key: "Docty", value: vDocTypeList[i].Docty },
						{ key: "PageId", value: vDocTypeList[i].PageId }
					]
				});
				if (i == 0) {
					oRadio.setSelected(true);
				}

				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: oRadio
				}).addStyleClass("L2PPaddingLeft10");
				oSelectLayout.createRow(oCell);
			}
		}

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SM_Dialog", {
			content: [oSelectLayout],
			contentWidth: "400px",
			contentHeight: "300px",
			showHeader: true,
			title: "{i18n>LABEL_02206}",
			beginButton: new sap.m.Button({
				text: "{i18n>LABEL_02184}",
				icon: "sap-icon://complete",
				press: oController.onSMSelectType
			}),
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onSMClose
			})
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
