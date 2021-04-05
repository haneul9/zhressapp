sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRetirePersonInfo"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var oCell, oRow;

			var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 2
			});

			var oCustomListItem = new sap.m.CustomListItem({
				content: new sap.suite.ui.commons.BusinessCard({
					firstTitle: new sap.ui.commons.Label({ text: "{Ename}" }).addStyleClass("L2PFontFamily L2PFontFamilyBold"),
					iconPath: "images/person.png",
					secondTitle: {
						parts: [{ path: "Zzjobgrtx" }, { path: "Zzcaltltx" }, { path: "Zzpsgrptx" }],
						formatter: function (v1, v2, v3) {
							if (v1 == undefined || v2 == undefined || v3 == undefined) return "";
							return v1 + " / " + v2 + " / " + v3;
						}
					},
					content: new sap.ui.commons.Label({ text: "{Fulln}" }).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PFontFamily")
			});

			var oList = new sap.m.List(oController.PAGEID + "_List", {
				showNoData: true,
				noDataText: "{i18n>MSG_02005}",
				mode: sap.m.ListMode.MultiSelect,
				selectionChange: oController.onSelectPersonList,
				rememberSelections: false,
				items: {
					path: "/ActionSubjectListSet",
					template: oCustomListItem
				}
			}).addStyleClass("L2PListMinWidth");
			oList.setModel(sap.ui.getCore().getModel("ActionSubjectList_Temp"));

			var oLeftScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_LeftScrollContainer", {
				content: oList,
				width: "100%",
				height: "500px",
				horizontal: false,
				vertical: true
			});

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Top,
				content: [oLeftScrollContainer]
			}).addStyleClass("WhiteBackground");

			oRow.addCell(oCell);

			var oInputLayout = new sap.ui.commons.layout.VerticalLayout();

			var oIssuedDatePanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({ src: "sap-icon://calendar", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02014}", design: "Bold", width: "95px" }).addStyleClass("L2PFontFamily"),
						new sap.m.DatePicker(oController.PAGEID + "_Actda", {
							width: "200px",
							valueFormat: "yyyy.MM.dd",
							displayFormat: gDtfmt,
							change: oController.onChangeActda
						}),
						new sap.m.Button(oController.PAGEID + "_ChangeDate", {
							text: "{i18n>LABEL_02100}",
							type: "Emphasized",
							visible: false,
							press: oController.onPressChangeDate
						})
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: []
			});

			oInputLayout.addContent(oIssuedDatePanel);

			var oCell1, oRow1;

			var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: true,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			});

			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02345}" })]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [
					new sap.m.Input(oController.PAGEID + "_Massg", {
						width: "95%",
						enabled: false,
						showValueHelp: true,
						valueHelpOnly: true,
						valueHelpRequest: oController.onDisplaySearchRetrsDialog,
						customData: new sap.ui.core.CustomData({ key: "Massg", value: "" })
					})
				]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oIssuedTypeMatrix.addRow(oRow1);

			var oActTypeReasonPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({ src: "sap-icon://accounting-document-verification", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02345}", design: "Bold" }).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oIssuedTypeMatrix]
			});

			oInputLayout.addContent(oActTypeReasonPanel);

			var oIssuedHistoryMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
				width: "100%",
				layoutFixed: true,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			});

			var oActdHistoryPanel = new sap.m.Panel(oController.PAGEID + "_ControlPanel", {
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({ src: "sap-icon://expense-report", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02004}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer({ width: "10px" }),
						new sap.m.Label({ text: "{i18n>MSG_02006}", visible: true }).addStyleClass("L2P12Font L2P12Notice"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Label({ text: "{i18n>LABEL_02005}", visible: true }).addStyleClass("L2PFontFamily"),
						new sap.m.Switch(oController.PAGEID + "_Input_Switch", { visible: true, enabled: false, change: oController.onChangeSwitch }),
						new sap.m.ToolbarSpacer({ width: "10px" })
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oIssuedHistoryMatrix]
			});

			oInputLayout.addContent(oActdHistoryPanel);

			var oRightScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_RightScrollContainer", {
				content: oInputLayout,
				width: "100%",
				height: "500px",
				horizontal: false,
				vertical: true
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Top,
				content: [oRightScrollContainer]
			});

			oRow.addCell(oCell);

			oMainLayout.addRow(oRow);

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [oMainLayout]
			});

			var oFooterBar = new sap.m.Bar({
				contentLeft: [
					new sap.m.Button(oController.PAGEID + "_ADDPERSON_BTN", {
						text: "{i18n>LABEL_02029}",
						press: oController.addPerson
					}),
					new sap.m.Button(oController.PAGEID + "_ALLSELECT_BTN", {
						text: "{i18n>LABEL_02030}",
						press: oController.onPressAllSelect
					}),
					new sap.m.Button(oController.PAGEID + "_ALLUNSELECT_BTN", {
						text: "{i18n>LABEL_02031}",
						press: oController.onPressAllUnSelect
					})
				],
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_SAVEPERSON_BTN", {
						text: "{i18n>LABEL_02152}",
						enabled: false,
						press: oController.onPressSave
					}),
					new sap.m.Button({
						text: "{i18n>LABEL_02048}",
						press: oController.navToBack
					})
				]
			});

			var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
				content: [oLayout],
				customHeader: new sap.m.Bar({
					contentLeft: new sap.m.Button({
						icon: "sap-icon://nav-back",
						press: oController.navToBack
					}),
					contentMiddle: new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
						text: "{i18n>LABEL_02007}"
					}).addStyleClass("L2PPageTitle"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: Common.displayHelp
					})
				}).addStyleClass("L2PHeaderBar"),
				footer: oFooterBar
			}).addStyleClass("WhiteBackground");

			return oPage;
		}
	});
});
