jQuery.sap.require("common.SearchKostl");

sap.ui.jsfragment("fragment.COMMON_SEARCH_KOSTL", {
	createContent: function (oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var curDate = new Date();

		var oFilterBar = new sap.m.Toolbar({
			content: [
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({
					text: "{i18n>LABEL_00159}"	// 기준일자
				}).addStyleClass("L2P13Font"),

				new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Datum", {
					value: dateFormat.format(curDate),
					valueFormat: "yyyy-MM-dd",
					displayFormat: gDtfmt,
					width: "150px"
				}),
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({ text: "{i18n>LABEL_00175}" }).addStyleClass("L2P13Font"),	// 코스트센터
				new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Stext", {
					width: "170px"
				}).attachBrowserEvent("keyup", common.SearchKostl.onKeyUp),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_KOSTL_SearchButton", {
					icon: "sap-icon://search",
					text: "{i18n>LABEL_00104}",	// 검색
					customData: [{ key: "Persa", value: oController._vPersa }],
					press: common.SearchKostl.SearchKostl
				}),
				new sap.m.ToolbarSpacer({ width: "10px" })
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COMMON_SEARCH_KOSTL_COLUMNLIST", {
			counter: 10,
			cells: [
				new sap.m.Text({ text: "{Kostl}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font"),
				new sap.m.Text({ text: "{Ktext}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font"),
				new sap.m.Text({ text: "{Ltext}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_COMMON_SEARCH_KOSTL_TABLE", {
			inset: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>LABEL_00901}",	// No data found
			showNoData: true,
			fixedLayout: false,
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_00176}" }).addStyleClass("L2P13Font"),	// 코스트센터 코드
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_00177}" }).addStyleClass("L2P13Font"),	// 코스트센터 이름
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_00178}" }).addStyleClass("L2P13Font"),	// 코스트센터 설명
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				})
			]
		});

		oTable.setModel(sap.ui.getCore().getModel("ZHR_COMMON_SRV"));

		oTable.attachUpdateStarted(function () {
			if (!oController.BusyDialog) {
				oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_00049}" }));	// 검색중입니다. 잠시만 기다려주십시오.
				oController.getView().addDependent(oController.BusyDialog);
			}
			if (!oController.BusyDialog.isOpen()) {
				oController.BusyDialog.open();
			}
		});
		oTable.attachUpdateFinished(function () {
			if (oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		});

		var oTablePanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			height: "500px",
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oFilterBar, oTablePanel]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Dialog", {
			contentWidth: "800px",
			contentHeight: "570px",
			showHeader: true,
			title: "{i18n>LABEL_00175}",	// 코스트센터
			beforeOpen: common.SearchKostl.onBeforeOpenSearchKostlDialog,
			beginButton: new sap.m.Button({
				icon: "sap-icon://accept",
				text: "{i18n>LABEL_00118}",	// 선택
				press: common.SearchKostl.onConfirm
			}),
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				text: "{i18n>LABEL_00119}",	// 취소
				press: common.SearchKostl.onClose
			}),
			content: [oLayout]
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
