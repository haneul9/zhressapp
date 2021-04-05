sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRecDocument"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();

			var oCell = null,
				oRow = null;

			var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			}).addStyleClass("act-tbl-write");

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02128}", required: true }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Select(oController.PAGEID + "_Persa", {
					width: "95%",
					change: oController.onChangePersa
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02139}", required: true }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Select(oController.PAGEID + "_Orgeh", {
					width: "95%",
					change: oController.onChangeOrgeh
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			var oReqno = new sap.m.Input(oController.PAGEID + "_Reqno", {
				type: "Text",
				width: "95%"
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02140}", required: true, labelFor: oReqno }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oReqno
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oTitle = new sap.m.Input(oController.PAGEID + "_Title", {
				width: "95%",
				valueStateText: "Required Field"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02187}", required: true, labelFor: oTitle }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oTitle
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "40px" });

			var oActda = new sap.m.DatePicker(oController.PAGEID + "_Actda", {
				width: "95%",
				value: dateFormat.format(curDate),
				valueFormat: "yyyy-MM-dd",
				displayFormat: "yyyy.MM.dd",
				change: oController.onChangeDate.bind(oController)
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02014}", required: true, labelFor: oActda }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oActda
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oUnote = new sap.m.Input(oController.PAGEID + "_Notes", {
				width: "95%"
			}).addStyleClass("L2PFontFamily");

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "Remarks" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oUnote
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			var oRequestPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
					//	new sap.ui.core.Icon({
					//		src: "sap-icon://accounting-document-verification", 
					//		size: "1.0rem"
					//	}), //actDesign icon 삭제
						new sap.m.Label({ text: "{i18n>LABEL_02001}" }).addStyleClass("L2PFontFamilyBold act-sub-title"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_Save_Btn", {
							text: "{i18n>LABEL_02152}",
							icon: "sap-icon://save",
							press: oController.onPressSave
						}),
						new sap.m.ToolbarSpacer({ width: "5px" })
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oRequestLayout]
			});

			var oSyncToolbar = new sap.m.Toolbar(oController.PAGEID + "_SyncToolbar", {
				visible: false,
				design: sap.m.ToolbarDesign.Transparent,
				content: [
					new sap.m.ToolbarSpacer(),
					new sap.m.Button(oController.PAGEID + "_Sync_Rec_Btn", {
						text: "{i18n>LABEL_02337}",
						icon: "sap-icon://synchronize",
						press: oController.syncRecPerson,
						visible: false,
						type: "Default"
					})
				]
			}).addStyleClass("L2PToolbarNoBottomLine");

			var oListPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
					//	new sap.ui.core.Icon({ src: "sap-icon://collaborate", size: "1.0rem", color: "#666666" }), //actDesign icon 삭제
						new sap.m.Label({ text: "{i18n>LABEL_02007}"}).addStyleClass("L2PFontFamily act-sub-title"), //actDesign design: "Bold" 삭제
						new sap.m.ToolbarSpacer({ width: "15px" }),
						new sap.ui.core.Icon({ src: "sap-icon://accept", size: "1.0rem", color: "#8DC63F" }),
					//	new sap.m.Image({ src: "images/Apply.gif" }),
						new sap.m.Label({ text: "{i18n>LABEL_02149}" }).addStyleClass("L2PFontFamily act-gray20-color"),
						new sap.ui.core.Icon({ src: "sap-icon://error", size: "1.0rem", color: "#F45757" }),
					//	new sap.m.Image({ src: "images/Error.png" }),
						new sap.m.Label({ text: "{i18n>LABEL_02150}" }).addStyleClass("L2PFontFamily act-gray20-color"),
						new sap.ui.core.Icon({ src: "sap-icon://locked", size: "1.0rem", color: "#54585A" }),
					//	new sap.m.Image({ src: "images/Lock.png" }),
						new sap.m.Label({ text: "{i18n>LABEL_02151}" }).addStyleClass("L2PFontFamily act-gray20-color"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_Add_Rec_Btn", {
							text: "{i18n>LABEL_02027}",
							icon: "sap-icon://add-contact",
							press: oController.addRecPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_Mod_Rec_Btn", {
							text: "{i18n>LABEL_02243}",
							icon: "sap-icon://edit",
							press: oController.modifyRecPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_View_Rec_Btn", {
							text: "{i18n>LABEL_02211}",
							icon: "sap-icon://personnel-view",
							press: oController.viewRecPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_Add_Btn", {
							text: "{i18n>LABEL_02026}",
							icon: "sap-icon://add",
							press: oController.addPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_Mod_Btn", {
							text: "{i18n>LABEL_02323}",
							icon: "sap-icon://edit",
							press: oController.modifyPerson,
							visible: false
						}),
						new sap.m.Button(oController.PAGEID + "_Del_Btn", {
							text: "{i18n>LABEL_02059}",
							icon: "sap-icon://delete",
							press: oController.deletePerson,
							visible: false
						})
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActtionSubjectList", oController)]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oRequestPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oSyncToolbar,
					oListPanel
				]
			});

			var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
				contentLeft: [
					new sap.m.Button(oController.PAGEID + "_Excel_Btn", {
						text: "{i18n>LABEL_02074}",
						icon: "sap-icon://excel-attachment",
						visible: false,
						press: oController.downloadExcel
					})
				],
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_UPLOAD_BTN", {
						text: "{i18n>LABEL_02021}",
						press: oController.onPressUpload
					}),
					/*new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
						text: "{i18n>LABEL_02142}",
						press: oController.onPressRequest
					}),*/
					new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
						text: "{i18n>LABEL_02017}",
						press: oController.onPressComplete
					}),
					new sap.m.Button(oController.PAGEID + "_REQUESTDELETE_BTN", {
						text: "{i18n>LABEL_02143}",
						press: oController.onPressDelete
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
						text: "{i18n>LABEL_02257}"
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
