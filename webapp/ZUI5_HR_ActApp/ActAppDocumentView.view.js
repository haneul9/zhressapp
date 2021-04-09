sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppDocumentView"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var oProcessFlow = new sap.suite.ui.commons.ProcessFlow(oController.PAGEID + "_ProcessFlow", {
				foldedCorners: true,
				scrollable: false,
				wheelZoomable: false
			});

			var oPFLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PFLAYOUT", {
				width: "100%",
				content: [oProcessFlow]
			});

			var oStatusPanel = new sap.m.Panel(oController.PAGEID + "_StatusPanel", {
				expandable: true,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.m.Label(oController.PAGEID + "_StatusPanel_Title", {
							text: "{i18n>LABEL_02189}"
						//	design: "Bold"
						}).addStyleClass("L2PFontFamily act-sub-title") 
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oPFLayout]
			});

			var oCell = null,
				oRow = null;

			var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			}).addStyleClass("act-tbl-read");

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02128}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Persa", {
					width: "300px"
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02139}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Orgeh", {
					width: "300px"
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			var oReqno = new sap.m.Text(oController.PAGEID + "_Reqno", {
				width: "300px"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02140}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oReqno
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oTitle = new sap.m.Text(oController.PAGEID + "_Title", {
				width: "300px"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02187}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oTitle
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			var oActda = new sap.m.Text(oController.PAGEID + "_Actda", {
				width: "300px"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02014}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oActda
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oReqda = new sap.m.Text(oController.PAGEID + "_Reqda", {
				width: "300px"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02141}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oReqda
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			var oUnote = new sap.m.Text(oController.PAGEID + "_Notes", {
				width: "942px"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02208}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				colSpan: 3,
				content: oUnote
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			var oRequestPanel = new sap.m.Panel({
				expandable: true,
				expanded: true,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						//new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
						new sap.m.Label({ text: "{i18n>LABEL_02001}" }).addStyleClass("L2PFontFamily act-sub-title"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oRequestLayout]
			});

			var oListPanel = new sap.m.Panel({
				expandable: true,
				expanded: true,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						//new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
						new sap.m.Label({ text: "{i18n>LABEL_02007}" }).addStyleClass("L2PFontFamily act-sub-title"),
						new sap.m.ToolbarSpacer({ width: "15px" }),						
					//	new sap.m.Image({ src: "images/Apply.gif" }),
						new sap.ui.core.Icon({ src: "sap-icon://accept", size: "1.0rem", color: "#8DC63F" }),
						new sap.m.Label({ text: "{i18n>LABEL_02149}" }).addStyleClass("L2PFontFamily"),						
					//	new sap.m.Image({ src: "images/Error.png" }),
						new sap.ui.core.Icon({ src: "sap-icon://error", size: "1.0rem", color: "#F45757" }),
						new sap.m.Label({ text: "{i18n>LABEL_02150}" }).addStyleClass("L2PFontFamily"),
					//	new sap.m.Image({ src: "images/Lock.png" }),
						new sap.ui.core.Icon({ src: "sap-icon://locked", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02151}" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_View_Rec_Btn", {
							text: "{i18n>LABEL_02211}",
							icon: "sap-icon://personnel-view",
							press: oController.viewRecPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_Add_Btn", {
							text: "{i18n>LABEL_02074}",
							icon : "sap-icon://excel-attachment",
							press : oController.downloadExcel
						})
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActtionSubjectList", oController)]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oStatusPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oRequestPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oListPanel
				]
			});

			var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
				contentLeft: [
					new sap.m.Button(oController.PAGEID + "_STATUS_BTN", {
						text: "{i18n>LABEL_02099}",
						press: oController.onChangeStatus
					})
				],
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
						text: "{i18n>LABEL_02017}",
						press: oController.onPressCompelte
					}),
					new sap.m.Button(oController.PAGEID + "_ANNOUNCE_BTN", {
						text: "{i18n>LABEL_02032}",
						press: oController.onPressAnnounce
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
					contentMiddle: new sap.m.Text({
						text: "{i18n>LABEL_02190}"
					}).addStyleClass("L2PPageTitle"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: Common.displayHelp
					})
				}).addStyleClass("L2PHeaderBar"),
				footer: oFooterBar
			});
			return oPage;
		}
	});
});
