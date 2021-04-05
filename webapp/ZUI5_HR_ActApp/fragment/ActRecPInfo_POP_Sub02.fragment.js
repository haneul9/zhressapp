sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Sub02", {

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

		/////// 입학일자
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02067}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oBegda = new sap.m.DatePicker(oController.PAGEID + "_Sub02_Begda", {
			width: "95%",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			enabled: !oController._DISABLED,
			change: oController.changeDate,
			customData: { key: "Seqnr", value: "" }
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oBegda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 졸업일자
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02069}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oEndda = new sap.m.DatePicker(oController.PAGEID + "_Sub02_Endda", {
			width: "95%",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			change: oController.changeDate,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oEndda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 학력
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02260}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oSlart = new sap.m.Select(oController.PAGEID + "_Sub02_Slart", {
			width: "95%",
			change: oController.onChangeSlart,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oSlart.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Slart")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oSlart
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 학위
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02168}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oSlabs = new sap.m.Select(oController.PAGEID + "_Sub02_Slabs", {
			width: "95%",
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oSlabs
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 교육기관명/위치
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02339}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oSchcd = new sap.m.Input(oController.PAGEID + "_Sub02_Schcd", {
			width: "95%",
			showValueHelp: false,
			valueHelpOnly: false,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Schcd", value: "" })
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oSchcd
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02165}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oSland = new sap.m.Input(oController.PAGEID + "_Sub02_Sland", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Sland", value: "" })
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oSland
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		/////// 전공
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02170}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oZzcolnm = new sap.m.Input(oController.PAGEID + "_Sub02_Zzcolnm", {
			width: "95%",
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [oZzcolnm]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 최종학력
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02231}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oHLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});
		oHLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content: [new sap.m.CheckBox(oController.PAGEID + "_Sub02_Zzfinyn", {}).addStyleClass("L2PFontFamily")]
			})
		);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [oHLayout]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);

		var oRequestPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02194}", design: "Bold" }).addStyleClass("L2PFontFamily L2PFontBold"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oRequestLayout]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub02_Dialog", {
			content: [oRequestPanel],
			contentWidth: "1024px",
			contentHeight: "230px",
			showHeader: true,
			beforeOpen: oController.onBeforeOpenDialog,
			title: "{i18n>LABEL_02194}",
			beginButton: new sap.m.Button({ 
				text: "{i18n>LABEL_02152}", 
				icon: "sap-icon://save", 
				press: oController.onPressSave 
			}),
			endButton: new sap.m.Button({ 
				text: "{i18n>LABEL_02050}", 
				icon: "sap-icon://decline", 
				press: oController.onClose 
			})
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
