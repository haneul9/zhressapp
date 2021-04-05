jQuery.sap.require("control.ODataFileUploader");

sap.ui.define([
	"../common/Common",
	"../control/ODataFileUploader"
], function (Common, ODataFileUploader) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppUpload"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var icon1 = "images/OK.png";
			var icon2 = "images/No-entry.png";

			var oCell1, oRow1;
			var vMASSN = ["{i18n>LABEL_02102}", "{i18n>LABEL_02108}", "{i18n>LABEL_02109}", "{i18n>LABEL_02110}", "{i18n>LABEL_02111}"];
			var vMASSG = ["{i18n>LABEL_02103}", "{i18n>LABEL_02104}", "{i18n>LABEL_02105}", "{i18n>LABEL_02106}", "{i18n>LABEL_02107}"];

			var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: true,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			}).addStyleClass("act-tbl-write");;

			var oIssuedTypeMatrix2 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_IssuedTypeMatrix2", {
				width: "100%",
				layoutFixed: true,
				columns: 4,
				visible: false,
				widths: ["15%", "35%", "15%", "35%"]
			}).addStyleClass("act-tbl-write");;

			for (var i = 0; i < 1; i++) {
				oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [new sap.m.Label({ text: vMASSN[i] }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [
						new sap.m.Select(oController.PAGEID + "_Massn" + (i + 1), {
							width: "95%",
							change: oController.onChangeMassn
						})
					]
				}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [new sap.m.Label({ text: vMASSG[i] }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [
						new sap.m.Select(oController.PAGEID + "_Massg" + (i + 1), {
							width: "95%",
							enabled: false,
							change: oController.onChangeMassg
						})
					]
				}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oIssuedTypeMatrix.addRow(oRow1);
			}

			for (var k = 1; k < 5; k++) {
				oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [new sap.m.Label({ text: vMASSN[k] })]
				}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [
						new sap.m.Select(oController.PAGEID + "_Massn" + (k + 1), {
							width: "95%",
							change: oController.onChangeMassn
						})
					]
				}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [new sap.m.Label({ text: vMASSG[k] })]
				}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign: sap.ui.commons.layout.HAlign.Begin,
					vAlign: sap.ui.commons.layout.VAlign.Middle,
					content: [
						new sap.m.Select(oController.PAGEID + "_Massg" + (k + 1), {
							width: "95%",
							enabled: false,
							change: oController.onChangeMassg
						})
					]
				}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
				oRow1.addCell(oCell1);

				oIssuedTypeMatrix2.addRow(oRow1);
			}

			var oActTypeReasonPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
					//	new sap.ui.core.Icon({ src: "sap-icon://open-command-field", size: "1.0rem" }),
						new sap.m.Label({ text: "{i18n>LABEL_02013}" }).addStyleClass("L2PFontFamily act-sub-title"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Label({ text: "{i18n>LABEL_02280}", visible: true }).addStyleClass("L2PFontFamily"),
						new sap.m.Switch(oController.PAGEID + "_Reason_Switch", {
							visible: true,
							enabled: true,
							state: false,
							change: oController.onChangeReasonSwitch
						}),
						new sap.m.ToolbarSpacer({ width: "10px" })
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oIssuedTypeMatrix, oIssuedTypeMatrix2]
			});

			var oFileUploader = new ODataFileUploader(oController.PAGEID + "_EXCEL_UPLOAD_BTN", {
				name: "UploadFile",
				slug: "",
				maximumFileSize: 1,
				multiple: false,
				uploadOnChange: false,
				mimeType: [],
				fileType: ["csv", "xls", "xlsx"],
				buttonText: "{i18n>LABEL_02075}",
				width: "150px",
				icon: "sap-icon://upload",
				buttonOnly: true,
				change: oController.changeFile
			}).addStyleClass("L2PPaddingLeft1rem");

			var oButtonBar1 = new sap.m.Panel({
				visible: true,
				expandable: false,
				expanded: true,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN", {
							icon: "sap-icon://download",
							width: "200px",
							text: "{i18n>LABEL_02357}",
							press: oController.onPressDownload
						}),
						oFileUploader
					]
				}).addStyleClass("L2PToolbarNoBottomLine")
			});

			var oSwitchBar1 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_UploadNoticeBar1", {
				width: "100%",
				layoutFixed: true,
				columns: 2,
				widths: ["75%", "25%"]
			});

			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Text({ text: "{i18n>MSG_02150}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Bottom,
				rowSpan: 3,
				content: [oButtonBar1]
			}).addStyleClass("L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oSwitchBar1.addRow(oRow1);

			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Text({ text: "{i18n>MSG_02151}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oSwitchBar1.addRow(oRow1);

			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Text({ text: "{i18n>MSG_02152}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PPaddingLeft10");
			oRow1.addCell(oCell1);

			oSwitchBar1.addRow(oRow1);

			var oListTable = new sap.ui.table.Table(oController.PAGEID + "_TABLE", {
				enableColumnReordering: false,
				enableColumnFreeze: false,
				columnHeaderHeight: 35,
				//			rowHeight : 48,
				visibleRowCount: 14,
				selectionMode: sap.ui.table.SelectionMode.None
			});

			oListTable.addEventDelegate({
				onAfterRendering: function () {
					oController.onAfterRenderingListTable(oController);
				}
			});

			var oActdHistoryPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				backgroundDesign: "Transparent",
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [ 
					//	new sap.ui.core.Icon({ src: "sap-icon://open-command-field", size: "1.0rem" }),
						new sap.m.Label({ text: "{i18n>LABEL_02007}" }).addStyleClass("L2PFontFamily act-sub-title"),
						new sap.m.ToolbarSpacer({ width: "5px" }),
						new sap.m.Label({ text: "(" }).addStyleClass("L2PFontFamily L2PLabelMinWidth"),
						new sap.m.Image({ src: icon1, height: "16px", width: "16px" }),
						new sap.m.Label({ text: "Ready" + "," }).addStyleClass("L2PFontFamily"),
						new sap.m.Image({ src: icon2, height: "16px", width: "16px" }),
						new sap.m.Label({ text: "Error" + ", * " + "{i18n>LABEL_02358}" + " )" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer(), //
						new sap.m.Label({ text: "{i18n>LABEL_02361}", visible: true }).addStyleClass("L2PFontFamily"),
						new sap.m.Switch(oController.PAGEID + "_Input_Switch", { visible: true, enabled: false, change: oController.onChangeSwitch }),
						new sap.m.ToolbarSpacer({ width: "10px" })
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oSwitchBar1, oListTable]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [new sap.ui.core.HTML({ content: "<div style='height:15px;'> </div>", preferDOM: false }), oActTypeReasonPanel, oActdHistoryPanel]
			});

			var oFooterBar = new sap.m.Bar({
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
						text: "{i18n>LABEL_00101}",
						press: oController.onPressSave
					}),
					new sap.m.Button({
						text: "{i18n>LABEL_00119}",
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
						text: "{i18n>LABEL_02021}"
					}).addStyleClass("TitleFont"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: Common.displayHelp
					})
				}).addStyleClass("L2PHeader L2pHeaderPadding"),
				footer: oFooterBar
			}).addStyleClass("WhiteBackground");

			return oPage;
		}
	});
});
