sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Sub24_08", {
	
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

		/////// 예금주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02290}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oEmftx = new sap.m.Input(oController.PAGEID + "_Sub24_08_Emftx", {
			width: "95%",
			enabled: !oController._DISABLED,
			customData: { key: "Seqnr", value: "" }
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 3,
			content: oEmftx
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		////// Bank Country
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02331}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBanks = new sap.m.Input(oController.PAGEID + "_Sub24_08_Banks", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Banks", value: "" })
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBanks
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		////// Bank Key
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [
				new sap.m.Label(oController.PAGEID + "_Sub24_08_Bankl", { 
					text: "{i18n>LABEL_02291}", 
					required: true 
				}).addStyleClass("L2P13Font")
			]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBankl = new sap.m.Input(oController.PAGEID + "_Sub24_08_Bankl", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchBanklDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Bankl", value: "" })
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBankl
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		////// Bank Account
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [
				new sap.m.Label(oController.PAGEID + "_Sub24_08_Bankn", { 
					text: "{i18n>LABEL_02292}", 
					required: true 
				}).addStyleClass("L2P13Font")
			]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBankn = new sap.m.Input(oController.PAGEID + "_Sub24_08_Bankn", {
			width: "95%",
			maxLength: 18,
			enabled: !oController._DISABLED
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBankn
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		////// Building Society No.
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "Building Society No.", required: false }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBkont = new sap.m.Input(oController.PAGEID + "_Sub24_08_Pskto", {
			width: "95%",
			enabled: !oController._DISABLED
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBkont
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		////// Payment Method
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02332}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oZlsch = new sap.m.Select(oController.PAGEID + "_Sub24_08_Zlsch", {
			width: "95%",
			change: oController.onChangeZlsch
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oZlsch
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		////// Payment Currency
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02294}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oWaers = new sap.m.Input(oController.PAGEID + "_Sub24_08_Waers", {
			width: "95%",
			enabled: false,
			customData: new sap.ui.core.CustomData({ key: "Waers", value: "" })
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oWaers
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		var oRequestPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label(oController.PAGEID + "_POP_Sub24_08_PanelLabel", { text: "{i18n>LABEL_02284}", design: "Bold" }).addStyleClass("L2P13Font"),
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oRequestLayout]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub24_08_Dialog", {
			content: [oRequestPanel],
			contentWidth: "1024px",
			contentHeight: "368px",
			showHeader: true,
			title: "{i18n>LABEL_02284}",
			beforeOpen: oController.onBeforeOpenDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_02152}", icon: "sap-icon://save", press: oController.onPressSave }), //
			endButton: new sap.m.Button({ text: "{i18n>LABEL_02048}", icon: "sap-icon://sys-cancel-2", press: oController.onClose })
		});

		// if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		// }

		return oDialog;
	}
});
