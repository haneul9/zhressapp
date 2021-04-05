sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Sub22", {
	
	createContent: function (oController) {
		var oCell = null,
			oRow = null;

		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 4,
			widths: ["15%", "35%", "15%", "35%"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 언어구분
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02262}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oQuali = new sap.m.Select(oController.PAGEID + "_Sub22_Quali", {
			width: "95%",
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2P13Font")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oQuali.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Quali")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oQuali
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 숙련도
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02295}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oAuspr = new sap.m.Select(oController.PAGEID + "_Sub22_Auspr", {
			width: "95%",
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2P13Font")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oAuspr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Auspr")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oAuspr
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		var oRequestPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02282}", design: "Bold" }).addStyleClass("L2P13Font"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oRequestLayout]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub22_Dialog", {
			content: [oRequestPanel],
			contentWidth: "700px",
			contentHeight: "368px",
			showHeader: true,
			beforeOpen: oController.onBeforeOpenDialog,
			title: "{i18n>LABEL_02282}",
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_02152}", icon: "sap-icon://save", press: oController.onPressSave }), //
			endButton: new sap.m.Button({ text: "{i18n>LABEL_02048}", icon: "sap-icon://sys-cancel-2", press: oController.onClose })
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
