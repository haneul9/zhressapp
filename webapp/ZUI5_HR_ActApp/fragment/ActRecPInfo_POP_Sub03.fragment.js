sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Sub03", {
	
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

		/////// 입사일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02072}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBegda = new sap.m.DatePicker(oController.PAGEID + "_Sub03_Begda", {
			width: "95%",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			enabled: !oController._DISABLED,
			change: oController.changeDate,
			customData: { key: "Seqnr", value: "" }
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBegda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 퇴사일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02146}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oEndda = new sap.m.DatePicker(oController.PAGEID + "_Sub03_Endda", {
			width: "95%",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			change: oController.changeDate,
			enabled: !oController._DISABLED
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oEndda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 회사명
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02051}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oArbgb = new sap.m.Input(oController.PAGEID + "_Sub03_Arbgb", {
			type: "Text",
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchCompanyDialog,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oArbgb
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02165}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub03_Land1", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Natio", value: "" })
		}).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oLand1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 직위
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02219}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oZzjbttx = new sap.m.Input(oController.PAGEID + "_Sub03_Zzjbttx", {
			type: "Text",
			width: "95%",
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oZzjbttx
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 직무
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02172}", required: true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oZzstell = new sap.m.Input(oController.PAGEID + "_Sub03_Zzstell", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.displayStellSearchDialog
		}).addStyleClass("L2P13Font");
		oZzstell.addCustomData(new sap.ui.core.CustomData({ key: "Zzstell", value: "" }));

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oZzstell
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		var oRequestPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02195}", design: "Bold" }).addStyleClass("L2P13Font"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oRequestLayout]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub03_Dialog", {
			content: [oRequestPanel],
			contentWidth: "1024px",
			contentHeight: "368px",
			showHeader: true,
			title: "{i18n>LABEL_02195}",
			beforeOpen: oController.onBeforeOpenDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_02152}", icon: "sap-icon://save", press: oController.onPressSave }), //
			endButton: new sap.m.Button({ text: "{i18n>LABEL_02048}", icon: "sap-icon://sys-cancel-2", press: oController.onClose })
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
