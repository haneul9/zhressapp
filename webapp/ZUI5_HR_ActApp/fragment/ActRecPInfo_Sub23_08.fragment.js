sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub23_08", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 *
	 * 개인 추가 정보
	 *
	 * @memberOf fragment.ActRecPInfo_Sub23_08
	 */

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

		/////// 민족(인종)
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02315}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oRacky = new sap.m.Select(oController.PAGEID + "_Sub23_Racky", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oRacky.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Racky")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oRacky
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 병역상태
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02316}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oMilsa = new sap.m.Select(oController.PAGEID + "_Sub23_Milsa", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oMilsa.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Milsa")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oMilsa
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 장애여부
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02317}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oDisab = new sap.m.Select(oController.PAGEID + "_Sub23_P08disty", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oDisab.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [
			new sap.ui.model.Filter("Field", "EQ", "P08disty")
		]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [oDisab]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		return oRequestLayout;
	}
});
