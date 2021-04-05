sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppRequest"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
		},

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

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02140}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Reqno", {}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02187}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Title", {}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02139}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Orgeh", {}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02141}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.Text(oController.PAGEID + "_Reqda", {}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oRequestLayout.addRow(oRow);

			var oRequestPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.ui.core.Icon({
							src: "sap-icon://accounting-document-verification",
							size: "1.0rem",
							color: "#666666"
						}),
						new sap.m.Label({ text: "{i18n>LABEL_02001}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oRequestLayout]
			});

			var oAddInfoLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 2,
				widths: ["15%", "85%"]
			});

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>NOTET}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.TextArea(oController.PAGEID + "_Notet", {
					width: "100%",
					cols: 100,
					rows: 4,
					liveChange: oController.onChangeData,
					placeholder: "{i18n>MSG_02007}"
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oAddInfoLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>NOTEB}" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: new sap.m.TextArea(oController.PAGEID + "_Noteb", {
					width: "100%",
					cols: 100,
					rows: 4,
					liveChange: oController.onChangeData,
					placeholder: "{i18n>MSG_02008}"
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oAddInfoLayout.addRow(oRow);

			var oAddInfoPanel = new sap.m.Panel({
				expandable: true,
				expanded: true,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02028}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oAddInfoLayout]
			});

			var oSortLayout = new sap.ui.commons.layout.MatrixLayout({
				width: "100%",
				layoutFixed: false,
				columns: 4,
				widths: ["15%", "35%", "15%", "35%"]
			});

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02164}" + " 1" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oSortControl1 = new sap.ui.commons.layout.HorizontalLayout({
				content: [
					new sap.m.Select(oController.PAGEID + "_Srtf1", {
						width: "250px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortSet",
							template: new sap.ui.core.Item({ key: "{Srtfc}", text: "{Srtft}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
					new sap.ui.core.HTML({ content: "<div style='width:10px'></div>", preferDOM: false }),
					new sap.m.Select(oController.PAGEID + "_Srtt1", {
						width: "130px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortTypeSet",
							template: new sap.ui.core.Item({ key: "{Srttc}", text: "{Srttt}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
				]
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oSortControl1
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02164}" + " 2" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oSortControl2 = new sap.ui.commons.layout.HorizontalLayout({
				content: [
					new sap.m.Select(oController.PAGEID + "_Srtf2", {
						width: "250px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortSet",
							template: new sap.ui.core.Item({ key: "{Srtfc}", text: "{Srtft}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
					new sap.ui.core.HTML({ content: "<div style='width:10px'></div>", preferDOM: false }),
					new sap.m.Select(oController.PAGEID + "_Srtt2", {
						width: "130px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortTypeSet",
							template: new sap.ui.core.Item({ key: "{Srttc}", text: "{Srttt}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
				]
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [oSortControl2]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oSortLayout.addRow(oRow);

			oRow = new sap.ui.commons.layout.MatrixLayoutRow();

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02164}" + " 3" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oSortControl3 = new sap.ui.commons.layout.HorizontalLayout({
				content: [
					new sap.m.Select(oController.PAGEID + "_Srtf3", {
						width: "250px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortSet",
							template: new sap.ui.core.Item({ key: "{Srtfc}", text: "{Srtft}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
					new sap.ui.core.HTML({ content: "<div style='width:10px'></div>", preferDOM: false }),
					new sap.m.Select(oController.PAGEID + "_Srtt3", {
						width: "130px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortTypeSet",
							template: new sap.ui.core.Item({ key: "{Srttc}", text: "{Srttt}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
				]
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [oSortControl3]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02164}" + " 4" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
			oRow.addCell(oCell);

			var oSortControl4 = new sap.ui.commons.layout.HorizontalLayout({
				content: [
					new sap.m.Select(oController.PAGEID + "_Srtf4", {
						width: "250px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortSet",
							template: new sap.ui.core.Item({ key: "{Srtfc}", text: "{Srtft}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
					new sap.ui.core.HTML({ content: "<div style='width:10px'></div>", preferDOM: false }),
					new sap.m.Select(oController.PAGEID + "_Srtt4", {
						width: "130px",
						change: oController.onChangeData,
						items: {
							path: "/ActionAppReqSortTypeSet",
							template: new sap.ui.core.Item({ key: "{Srttc}", text: "{Srttt}" })
						}
					})
						.addStyleClass("L2PFontFamily")
						.setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
				]
			});

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [oSortControl4]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);

			oSortLayout.addRow(oRow);

			var oSortPanel = new sap.m.Panel({
				expandable: true,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02164}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oSortLayout]
			});

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
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "{i18n>LABEL_02039}" }).addStyleClass("L2PFontFamily"),
						hAlign: sap.ui.core.TextAlign.Center,
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
				expandable: true,
				expanded: true,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						new sap.m.Label({ text: "{i18n>LABEL_02276}", design: "Bold" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer()
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [oTable]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oRequestPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oAddInfoPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oSortPanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					oActTypePanel,
					new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
					sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.AttachFilePanel", oController)
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
						text: "{i18n>LABEL_02191}"
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
