sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub02", {
	
	createContent: function (oController) {
		//Global 일자 관련하여 소스 수정함. 2015.10.19
		jQuery.sap.require("common.Common");
		//수정완료

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Sub02_TABLE", {
			noData: "No data found",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			visibleRowCount: 1,
			showNoData: true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay: false,
			enableBusyIndicator: true
		})
			.setModel(oController._Sub02TableJson)
			.bindRows("/Data");

		var vColumnInfo = [
			{ id: "Begda", label: "{i18n>LABEL_02067}", plabel: "", span: 0, type: "date", sort: true, filter: true, width: "10%" },
			{ id: "Endda", label: "{i18n>LABEL_02069}", plabel: "", span: 0, type: "date", sort: true, filter: true, width: "10%" },
			{ id: "Sltxt", label: "{i18n>LABEL_02260}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "10%" },
			{ id: "Stext", label: "{i18n>LABEL_02168}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "10%" },
			{ id: "Landx", label: "{i18n>LABEL_02165}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "10%" },
			{ id: "Insti", label: "{i18n>LABEL_02339}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "15%" },
			{ id: "Zzmajor", label: "{i18n>LABEL_02170}", plabel: "", span: 0, type: "string", sort: true, filter: true, width: "" },
			{ id: "Zzlmark", label: "{i18n>LABEL_02314}", plabel: "", span: 0, type: "icon", sort: true, filter: true, width: "6%" }
		];

		for (var i = 0; i < vColumnInfo.length; i++) {
			var oColumn = new sap.ui.table.Column({
				hAlign: "Center",
				flexible: false,
				autoResizable: true,
				resizable: false,
				showFilterMenuEntry: false
			});

			oColumn.setLabel(new sap.ui.commons.TextView({ text: vColumnInfo[i].label, textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily"));
			if (vColumnInfo[i].width && vColumnInfo[i].width != "") {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			if (vColumnInfo[i].filter == true) {
				oColumn.setFilterProperty(vColumnInfo[i].id);
			}

			if (vColumnInfo[i].sort == true) {
				oColumn.setSortProperty(vColumnInfo[i].id);
			}
			if (vColumnInfo[i].type == "string") {
				oColumn.setTemplate(
					new sap.ui.commons.TextView({
						text: "{" + vColumnInfo[i].id + "}",
						textAlign: "Center"
					}).addStyleClass("L2PFontFamily")
				);
			} else if (vColumnInfo[i].type == "date") {
				oColumn.setTemplate(
					new sap.ui.commons.TextView({
						text: {
							path: vColumnInfo[i].id,
							type: new sap.ui.model.type.Date({ pattern: "yyyy.MM.dd" })
						},
						textAlign: "Center"
					}).addStyleClass("L2PFontFamily")
				);
			} else if (vColumnInfo[i].type == "icon") {
				oColumn.setTemplate(
					new sap.ui.core.Icon({
						src: "sap-icon://accept",
						visible: {
							path: vColumnInfo[i].id,
							formatter: function (fVal) {
								if (fVal == "X" || fVal == true) {
									return true;
								} else {
									return false;
								}
							}
						}
					})
				);
			}
			oTable.addColumn(oColumn);
		}

		var oTablePanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_02194}", design: "Bold" }).addStyleClass("L2PFontFamily"),
					new sap.m.Label({ text: "(" + "{i18n>MSG_02001}" + ")" }).addStyleClass("L2PFontFamily"),
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub02_LAYOUT", {
			width: "100%",
			content: [oTablePanel]
		});

		return oLayout;
	}
});
