jQuery.sap.require("common.SearchOrg");

sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", {
	createContent: function (oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var curDate = new Date();

		var oFilterBar = new sap.m.Toolbar({
			content: [
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({
					text: "기준일자"
				}).addStyleClass("L2P13Font"),

				new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_ORG_Datum", {
					value: dateFormat.format(curDate),
					valueFormat: "yyyy-MM-dd",
					displayFormat: gDtfmt,
					width: "120px",
					enabled: false
				}),
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({ text: "검색어" }).addStyleClass("L2P13Font"),
				new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_ORG_Stext", {
					width: "150px"
				}).attachBrowserEvent("keyup", common.SearchOrg.onKeyUp),
				new sap.m.Label({ text: " (" + "검색 대상" + " : " + "소속" + ", " + "조직장" + ", " + "사번" + ")" }).addStyleClass(
					"L2P13Font"
				),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_ORG_SearchButton", {
					icon: "sap-icon://search",
					text: "검색",
					customData: [{ key: "Persa", value: oController._vPersa }],
					press: common.SearchOrg.searchOrg
				}),
				new sap.m.ToolbarSpacer({ width: "10px" })
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COMMON_SEARCH_ORG_COLUMNLIST", {
			counter: 10,
			cells: [
				new sap.m.Text({ text: "{Pbtxt}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font"),
				new sap.m.Text({ text: "{Orgeh}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font"),
				new sap.m.Text({ text: "{Fulln}", textAlign: sap.ui.core.TextAlign.Begin, tooltip: "{Short}" }).addStyleClass("L2P13Font"),
				new sap.m.Text({ text: "{EnameM}", textAlign: sap.ui.core.TextAlign.Begin }).addStyleClass("L2P13Font")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE", {
			inset: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "해당하는 데이터가 없습니다.",
			showNoData: true,
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "인사영역" }).addStyleClass("L2P13Font"),
					demandPopin: true,
					width: "20%",
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "소속부서" }).addStyleClass("L2P13Font"),
					demandPopin: true,
					width: "15%",
					hAlign: sap.ui.core.TextAlign.Center,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "소속" }).addStyleClass("L2P13Font"),
					demandPopin: true,
					width: "45%",
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "조직장" }).addStyleClass("L2P13Font"),
					demandPopin: true,
					width: "20%",
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				})
			]
		});

		oTable.setModel(sap.ui.getCore().getModel("ZL2P01GW9000_SRV"));

		oTable.attachUpdateStarted(function () {
			if (!oController.BusyDialog) {
				oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "검색중입니다. 잠시만 기다려주십시오." }));
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

		var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR", {
			upperCase: true,
			selectedKey: "1",
			select: common.SearchOrg.handleIconTabBarSelect,
			items: [
				new sap.m.IconTabFilter(oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR_KEY1", {
					key: "1",
					text: "조직명",
					content: [oTable]
				})
			]
		}); //.addStyleClass("L2PESDialog");

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oFilterBar, oTreeButtonBar, oIconTabBar]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog", {
			contentWidth: "900px",
			contentHeight: "500px",
			showHeader: true,
			title: "조직 검색",
			beforeOpen: common.SearchOrg.onBeforeOpenSearchOrgDialog,
			afterOpen: common.SearchOrg.onAfterOpenSearchOrgDialog,
			afterClose: common.SearchOrg.onAfterCloseSearchOrgDialog,
			beginButton: new sap.m.Button({
				icon: "sap-icon://accept",
				text: "선택",
				press: common.SearchOrg.onConfirm
			}),
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				text: "취소",
				press: common.SearchOrg.onClose
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
