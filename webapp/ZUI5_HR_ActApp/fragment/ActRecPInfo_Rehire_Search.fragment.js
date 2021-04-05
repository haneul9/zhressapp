sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Rehire_Search", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.ActRecPInfo_Rehire_Search
	 */
	createContent: function (oController) {
		var oCell = null,
			oRow = null;

		var oPeridLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 2,
			widths: ["40%", "60%"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 신분증 번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label(oController.PAGEID + "_Rehire_Idnum_Label", { text: "{i18n>LABEL_02131}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oPerid = new sap.m.Input(oController.PAGEID + "_Rehire_Perid", {
			width: "70%"
		});

		var oPerid2 = new sap.m.Input(oController.PAGEID + "_Rehire_Perid2", {
			width: "25%"
		});

		var oPeridToolbar = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [oPerid, oPerid2]
		}).addStyleClass("L2PToolbarNoBottomLine");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oPeridToolbar
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPeridLayout.addRow(oRow);

		var oPeridPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({
						text: "{i18n>LABEL_02344}",
						design: "Bold"
					}).addStyleClass("L2P13Font"),
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oPeridLayout]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Rehire_Dialog", {
			title: "{i18n>LABEL_02145}",
			showHeader: true,
			contentWidth: "600px",
			contentHeight: "180px",
			content: [oPeridPanel],
			beforeOpen: oController.onBeforeOpenRehireSearch,
			beginButton: new sap.m.Button({
				text: "{i18n>LABEL_02053}",
				press: oController.onConfirmRehire
			}),
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				press: oController.onCancelRehire
			})
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
