jQuery.sap.require("common.SearchStell");

sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", {
	createContent: function (oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var curDate = new Date();

		var oFilterBar = new sap.m.Toolbar({
			content: [
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({
					text: "{i18n>LABEL_00159}"	// 기준일자
				}).addStyleClass("L2PFontFamily"),

				new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_STELL_Datum", {
					value: dateFormat.format(curDate),
					valueFormat: "yyyy-MM-dd",
					displayFormat: gDtfmt,
					width: "150px"
				}),
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Label({ text: "{i18n>LABEL_00172}" }).addStyleClass("L2PFontFamily"),	// 직무명
				new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_STELL_Stext", {
					width: "170px"
				}).attachBrowserEvent("keyup", common.SearchStell.onKeyUp),
				new sap.m.ToolbarSpacer({ width: "10px" }),
				new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_STELL_SearchButton", {
					icon: "sap-icon://search",
					text: "{i18n>LABEL_00104}",	// 검색
					customData: [{ key: "Persa", value: oController._vPersa }],
					press: common.SearchStell.searchStell
				}),
				new sap.m.ToolbarSpacer({ width: "10px" })
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var JSonModel = new sap.ui.model.json.JSONModel();
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE", {
			enableColumnReordering: false,
			enableColumnFreeze: false,
			columnHeaderHeight: 35,
			visibleRowCount: 12,
			showNoData: true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			noData: "No data found"
		});
		oTable.setModel(JSonModel);
		oTable.bindRows("/OrgListSet");

		var oColumn = new sap.ui.table.Column({
			hAlign: "Center",
			flexible: false,
			vAlign: "Middle",
			autoResizable: true,
			resizable: true,
			showFilterMenuEntry: true,
			sortProperty: "Stext",
			label: new sap.ui.commons.TextView({ text: "{i18n>LABEL_00173}", textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily"),	// 직무
			filterProperty: "Stext",
			template: new sap.ui.commons.TextView({
				text: "{Stext}",
				textAlign: "Center"
			}).addStyleClass("L2PFontFamily")
		});
		oTable.addColumn(oColumn);

		var oColumn = new sap.ui.table.Column({
			hAlign: "Center",
			flexible: false,
			vAlign: "Middle",
			autoResizable: true,
			resizable: true,
			showFilterMenuEntry: true,
			sortProperty: "Manjftx",
			label: new sap.ui.commons.TextView({ text: "Domain", textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily"),
			filterProperty: "Manjftx",
			template: new sap.ui.commons.TextView({
				text: "{Manjftx}",
				textAlign: "Center"
			}).addStyleClass("L2PFontFamily")
		});
		oTable.addColumn(oColumn);

		var oColumn = new sap.ui.table.Column({
			hAlign: "Center",
			flexible: false,
			vAlign: "Middle",
			autoResizable: true,
			resizable: true,
			showFilterMenuEntry: true,
			sortProperty: "Subjftx",
			label: new sap.ui.commons.TextView({ text: "Dimension", textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily"),
			filterProperty: "Subjftx",
			template: new sap.ui.commons.TextView({
				text: "{Subjftx}",
				textAlign: "Center"
			}).addStyleClass("L2PFontFamily")
		});
		oTable.addColumn(oColumn);

		var oTablePanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oFilterBar, oTablePanel]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog", {
			contentWidth: "800px",
			showHeader: true,
			title: "{i18n>LABEL_00174}",	// 직무검색
			beforeOpen: common.SearchStell.onBeforeOpenSearchStellDialog,
			afterOpen: common.SearchStell.onAfterOpenSearchStellDialog,
			beginButton: new sap.m.Button({
				icon: "sap-icon://accept",
				text: "{i18n>LABEL_00118}",	// 선택
				press: common.SearchStell.onConfirm
			}),
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				text: "{i18n>LABEL_00119}",	 // 취소
				press: common.SearchStell.onClose
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
