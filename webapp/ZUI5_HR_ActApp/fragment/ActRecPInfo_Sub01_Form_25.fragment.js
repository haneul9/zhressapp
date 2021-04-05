sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub01_Form_25", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.ActRecPInfo_Sub01_Form_25
	 */

	createContent: function (oController) {
		var oCell = null,
			oRow = null;

		var oPersonalLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 4,
			widths: ["15%", "35%", "15%", "35%"]
		});

		var oContactLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 4,
			widths: ["15%", "35%", "15%", "35%"]
		});

		var oAddressLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 4,
			widths: ["15%", "35%", "15%", "35%"]
		});

		//        var oEmergencyLayout = new sap.ui.commons.layout.MatrixLayout({
		//			width : "100%",
		//			layoutFixed : false,
		//			columns : 4,
		//			widths: ["15%","35%","15%","35%"],
		//		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		///// TITLE
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02298}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oAnred = new sap.m.Select(oController.PAGEID + "_Sub01_Form_25_Anred", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oAnred.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Anred")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oAnred
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 영문 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02212}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oVorna = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Vorna", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Vorna"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oVorna
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 영문 중간이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02255}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oMidnm = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Midnm", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Midnm"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oMidnm
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 영문 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02299}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oNachn = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Nachn", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Nachn"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oNachn
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// Known As
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "Known As" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oRufnm = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Rufnm", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Rufnm"), //40,
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oRufnm
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 성별
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02089}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oGesch1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_25_Gesch1", {
			groupName: "Gesch",
			select: oController.changeModifyContent,
			text: "{i18n>LABEL_02112}"
		});
		var oGesch2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_25_Gesch2", {
			groupName: "Gesch",
			select: oController.changeModifyContent,
			text: "{i18n>LABEL_02082}"
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [oGesch1, new sap.m.ToolbarSpacer({ width: "10px" }), oGesch2]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02088}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oGbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_25_Gbdat", {
			width: "95%",
			valueFormat: "yyyy-MM-dd",
			displayFormat: gDtfmt,
			change: oController.changeModifyDate,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oGbdat
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 국적
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02300}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oNatio = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Natio", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.displayCodeSearchDialog,
			enabled: !oController._DISABLED
		}).addStyleClass("L2PFontFamily");
		oNatio.addCustomData(new sap.ui.core.CustomData({ key: "Natio", value: "" }));
		oNatio.addCustomData(new sap.ui.core.CustomData({ key: "Title", value: "{i18n>LABEL_02300}" }));

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oNatio
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		///// 신분증번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "NRIC", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oPerid = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Perid", {
			type: "Text",
			width: "95%",
			maxLength: 11,
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oPerid
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 결혼여부
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02235}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oFamst = new sap.m.Select(oController.PAGEID + "_Sub01_Form_25_Famst", {
			width: "95%",
			enabled: !oController._DISABLED,
			change: oController.onChangeFamst
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oFamst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Famst")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oFamst
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);

		/////////////////////////

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		///// Primary 휴대폰번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02090}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oTelno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Telno", {
			type: "Text",
			width: "95%",
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oTelno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 전화번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "Secondary Phone Number" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oHndno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Hndno", {
			type: "Text",
			width: "95%",
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oHndno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oContactLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		///// 이메일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02301}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oEmail = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Email", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Email"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oEmail
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// Communication Language
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02302}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oSprsl = new sap.m.Select(oController.PAGEID + "_Sub01_Form_25_Sprsl", {
			width: "95%",
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oSprsl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({ key: "{Ecode}", text: "{Etext}" }), null, [new sap.ui.model.Filter("Field", "EQ", "Sprsl")]);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oSprsl
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oContactLayout.addRow(oRow);

		////////////////////////

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 상세주소 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02176}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oStras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Stras", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Stras"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oStras
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 지역 -> 주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "State", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oState = new sap.m.Select(oController.PAGEID + "_Sub01_Form_25_State", {
			width: "95%",
			change: oController.changeModifyContent,
			enabled: !oController._DISABLED
		})
			.addStyleClass("L2PFontFamily")
			.setModel(sap.ui.getCore().getModel("EmpCodeList"));

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oState
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oAddressLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 상세주소2 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02176}", required: false }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oLocat = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Locat", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Locat"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oLocat
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 우편번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02132}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oPstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Pstlz", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Pstlz"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oPstlz
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oAddressLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		/////// 주소2 -> 시
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02121}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oOrt01 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Ort01", {
			type: "Text",
			width: "95%",
			maxLength: common.Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "RecruitingSubjects", "Ort01"),
			liveChange: oController.changeModifyContent,
			enabled: !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oOrt01
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		/////// 주소-국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02165}", required: true }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_25_Land1", {
			width: "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({ key: "Land1", value: "" })
		}).addStyleClass("L2PFontFamily");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: oLand1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oAddressLayout.addRow(oRow);

		var oPersonalPanel = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "2rem" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Middle,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			content: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_02193}", design: "Bold" }).addStyleClass("L2PFontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Text({
						text: "{i18n>MSG_02016}"
					}).addStyleClass("L2PFontFamily L2PFontColorLightRed L2PFontFamilyBold")
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oPersonalPanel.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: oPersonalLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oPersonalPanel.addRow(oRow);

		var oContactPanel = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "2rem" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Middle,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			content: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: new sap.m.Label({ text: "{i18n>LABEL_02303}", design: "Bold" }).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oContactPanel.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: oContactLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oContactPanel.addRow(oRow);

		var oAddressPanel = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "2rem" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Middle,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			content: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: new sap.m.Label({ text: "{i18n>LABEL_02303}", design: "Bold" }).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oAddressPanel.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: oAddressLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oAddressPanel.addRow(oRow);

		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [oPersonalPanel, oContactPanel, oAddressPanel] //, 			           oEmergencyPanel]
		}).addStyleClass("");
		oRow.addCell(oCell);

		oLayout.addRow(oRow);

		return oLayout;
	}
});
