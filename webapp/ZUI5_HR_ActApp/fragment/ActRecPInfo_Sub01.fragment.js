sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub01", {
	
	createContent: function (oController) {
		var oCell = null,
			oRow = null;

		var oRequestPanel = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Sub01_RequestPanel", {
			hAlign: sap.ui.commons.layout.HAlign.Middle,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: []
		}).addStyleClass("L2PPadding05remLR");
		oRow.addCell(oCell);
		oRequestPanel.addRow(oRow);

		// eslint-disable-next-line no-unused-vars
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub01_COLUMNLIST", {
			type: sap.m.ListType.None,
			counter: 10,
			cells: [
				new sap.m.Text({
					text: { path: "Entda", formatter: common.Common.DateFormatter }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: { path: "Retda", formatter: common.Common.DateFormatter }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Pbtxt}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Orgehtx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzcaltltx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Stetx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzjobgrtx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Pgtxt}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Pktxt}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzautyptx}"
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_Sub01_TABLE", {
			inset: false,
			fixedLayout: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			noDataText: "{i18n>MSG_02004}",
			mode: sap.m.ListMode.None,
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02072}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Center,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02146}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Center,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02128}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Text({ text: "{i18n>LABEL_02071}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02080}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02073}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02081}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02134}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02135}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02227}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oTablePanel = new sap.m.Panel({
			visible: false,
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02215}", design: "Bold" }).addStyleClass("L2PFontFamily"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub01_LAYOUT", {
			width: "100%",
			content: [oRequestPanel, new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }), oTablePanel]
		});

		return oLayout;
	}
});
