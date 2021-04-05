sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppAnnounce"].join(".");

	sap.ui.jsview(SUB_APP_ID, {

		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			//발령유형/사유 그룹핑
			var oMajorGroup = new sap.m.Select({
				selectedKey: "{Grpn1}",
				change: oController.onChangeGrpn1
			}).addStyleClass("L2PFontFamily");
			oMajorGroup.addItem(new sap.ui.core.Item({ key: "0000", text: "{i18n>LABEL_02035}" }));

			var oMinorGroup = new sap.m.Select({
				selectedKey: "{Grpn2}",
				enabled: {
					parts: [{ path: "Farea" }, { path: "Posgr" }],
					formatter: function (f1, f2) {
						if (f1 == true || f2 == true) {
							return false;
						} else {
							return true;
						}
					}
				},
				change: oController.onChangeGrpn2
			}).addStyleClass("L2PFontFamily");
			oMinorGroup.addItem(new sap.ui.core.Item({ key: "0000", text: "{i18n>LABEL_02035}" }));

			for (var i = 1; i < 10; i++) {
				oMajorGroup.addItem(new sap.ui.core.Item({ key: i, text: i }));
				oMinorGroup.addItem(new sap.ui.core.Item({ key: i, text: i }));
			}

			var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_ColumnList", {
				counter: 10,
				cells: [
					new sap.m.Text({
						text: "{Acttx}",
						textAlign: "Begin"
					}).addStyleClass("L2PFontFamily"),
					oMajorGroup,
					oMinorGroup,
					new sap.m.Input({
						width: "99%",
						value: "{Grpt1}",
						enabled: "{Grpt1E}",
						liveChange: oController.onChangeData
					}).addStyleClass("L2PFontFamily"),
					new sap.m.Input({
						width: "99%",
						value: "{Grpt2}",
						enabled: {
							parts: [{ path: "Farea" }, { path: "Posgr" }],
							formatter: function (f1, f2) {
								if (f1 == true || f2 == true) {
									return false;
								} else {
									return true;
								}
							}
						},
						liveChange: oController.onChangeData
					}).addStyleClass("L2PFontFamily"),
					new sap.m.CheckBox({
						selected: "{Posgr}",
						enabled: {
							parts: [{ path: "Grpn2" }, { path: "Farea" }],
							formatter: function (f1, f2) {
								if ((f1 != "" && f1 != "0000") || f2 == true) {
									return false;
								} else {
									return true;
								}
							}
						},
						select: oController.onChangeData
					}).addStyleClass("L2PFontFamily")
				]
			});
			
			var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
				inset: false,
				backgroundDesign: sap.m.BackgroundDesign.Translucent,
				showSeparators: sap.m.ListSeparators.All,
				showNoData: false,
				columns: [
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02013}" }).addStyleClass("L2PFontFamily"),
						demandPopin: true,
						hAlign: sap.ui.core.TextAlign.Begin,
						width: "40%",
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02036}" }).addStyleClass("L2PFontFamily"),
						demandPopin: true,
						width: "120px",
						hAlign: sap.ui.core.TextAlign.Center,
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02037}" }).addStyleClass("L2PFontFamily"),
						demandPopin: true,
						width: "120px",
						hAlign: sap.ui.core.TextAlign.Center,
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02038}" }).addStyleClass("L2PFontFamily"),
						demandPopin: true,
						hAlign: sap.ui.core.TextAlign.Center,
						//width: "150px",
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02039}" }).addStyleClass("L2PFontFamily"),
						hAlign: sap.ui.core.TextAlign.Center,
						//width: "80px",
						demandPopin: true
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02125}" }).addStyleClass("L2PFontFamily"),
						hAlign: sap.ui.core.TextAlign.Center,
						width: "100px",
						demandPopin: true
					})
				],
				items: {
					path: "/ActionAppGroupingSet",
					template: oColumnList
				}
			});
			oTable.setModel(sap.ui.getCore().getModel("ActionAppGrouping"));

			var oActTypePanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({ src: "sap-icon://group-2", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02276}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oTable]
			});

			var oRow, oCell;

			var oAttchFileExpLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 2,
				widths: ["40%", "60%"]
			});

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02043}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.CheckBox(oController.PAGEID + "_Attyn").addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			oAttchFileExpLayout.addRow(oRow);

			var oAttchFileExpPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({ src: "sap-icon://attachment", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>LABEL_02126}", design: "Bold" }).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oAttchFileExpLayout]
			});

			var oListPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						// new sap.ui.core.Icon({ src: "sap-icon://collaborate", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>MSG_02002}" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer({ width: "15px" }),
						new sap.ui.core.Icon({ src: "sap-icon://accept", size: "1.0rem", color: "#8DC63F" }),
						new sap.m.Label({ text: "{i18n>LABEL_02149}" }).addStyleClass("L2PFontFamily"),
						new sap.ui.core.Icon({ src: "sap-icon://error", size: "1.0rem", color: "#F45757" }),
						new sap.m.Label({ text: "{i18n>LABEL_02150}" }).addStyleClass("L2PFontFamily"),
						new sap.ui.core.Icon({ src: "sap-icon://locked", size: "1.0rem", color: "#54585A" }),
						new sap.m.Label({ text: "{i18n>LABEL_02151}" }).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActtionSubjectList", oController)]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oActTypePanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oAttchFileExpPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oListPanel
				]
			});

			var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
						text: "{i18n>LABEL_02152}",
						press: oController.onPressSave
					}),
					new sap.m.Button(oController.PAGEID + "_PREVIEW_BTN", {
						text: "{i18n>LABEL_02127}",
						press: oController.onPressPreview
					}),
					new sap.m.Button(oController.PAGEID + "_ANNOUNCE_BTN", {
						text: "{i18n>LABEL_02032}",
						press: oController.onPressAnnounce
					}),
					new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
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
					contentMiddle: new sap.m.Text({
						text: "{i18n>LABEL_02185}"
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
