sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub03", {
	
	createContent: function (oController) {
		//Global 일자 관련하여 소스 수정함. 2015.10.19
		jQuery.sap.require("common.Common");
		//수정완료

		// eslint-disable-next-line no-unused-vars
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub03_COLUMNLIST", {
			type: sap.m.ListType.None,
			counter: 10,
			cells: [
				new sap.m.Text({
					text: { path: "Begda", formatter: common.Common.DateFormatter }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: { path: "Endda", formatter: common.Common.DateFormatter }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Landx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Arbgb}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzjbttx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Stltx}"
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_Sub03_TABLE", {
			inset: false,
			fixedLayout: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>MSG_02004}",
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02072}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02146}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02165}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02051}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02219}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02172}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oTablePanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02195}", design: "Bold" }).addStyleClass("L2PFontFamily"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub03_LAYOUT", {
			width: "100%",
			content: [oTablePanel]
		});

		return oLayout;
	}
});
