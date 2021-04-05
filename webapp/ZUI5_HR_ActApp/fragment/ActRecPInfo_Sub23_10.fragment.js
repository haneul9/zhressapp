sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub23_10", {
	
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * 개인 추가 정보
	 * @memberOf fragment.ActRecPInfo_Sub23_10
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

		/////// 장애여부 상태
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02317}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oDisab = new sap.m.Select(oController.PAGEID + "_Sub23_Disab", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oDisab.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Disab")]);

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

		/////// 보훈 유형  -- 미국만
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02318}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oVets1 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets1", {
			text: "{i18n>LABEL_02319}",
			groupName: "Vets",
			select: oController.onSelectVetsRadio,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		var oVets2 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets2", {
			text: "{i18n>LABEL_02320}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets3 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets3", {
			text: "{i18n>LABEL_02321}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets4 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets4", {
			text: "{i18n>LABEL_02322}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets5 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets5", {
			text: "{i18n>LABEL_02324}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets6 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets6", {
			text: "{i18n>LABEL_02325}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets7 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets7", {
			text: "{i18n>LABEL_02326}",
			select: oController.onSelectVetsCheckbox,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily L2PPaddingLeft10");

		var oVets8 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets8", {
			text: "{i18n>LABEL_02327}",
			groupName: "Vets",
			select: oController.onSelectVetsRadio,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		var oVets9 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets9", {
			text: "{i18n>LABEL_02328}",
			groupName: "Vets",
			select: oController.onSelectVetsRadio,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		var oVets10 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets10", {
			text: "{i18n>LABEL_02329}",
			groupName: "Vets",
			select: oController.onSelectVetsRadio,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		var oDcrdt = new sap.m.DatePicker(oController.PAGEID + "_Sub23_Dcrdt", {
			width: "200px",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			visibale: false,
			change: oController.changeModifyDate,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		var oVetsLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oVetsLayout.createRow(oVets1);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oVets2
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oVets3
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oVets4
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						oVets5,
						new sap.m.ToolbarSpacer({ width: "50px" }),
						new sap.m.Label(oController.PAGEID + "_Sub23_Dcrdt_Label", { text: "Discharge Date", visibale: false }),
						new sap.m.ToolbarSpacer({ width: "10px" }),
						oDcrdt
					]
				}).addStyleClass("L2PToolbarNoBottomLine")
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oVets6
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(
			new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oVets7
			}).addStyleClass("L2PPaddingLeft20")
		);
		oVetsLayout.createRow(oVets8);
		oVetsLayout.createRow(oVets9);
		oVetsLayout.createRow(oVets10);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 3,
			content: oVetsLayout
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		return oRequestLayout;
	}
});
