jQuery.sap.require("common.Common");
jQuery.sap.require("common.ZHR_TABLES");

sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActtionSubjectList", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.ActtionSubjectList
	 */
	_colModel: [
		{ id: "Pchk", label: "", plabel: "", span: 0, type: "Checkbox", width: "4%" },
		{ id: "Cfmyn", label: "{i18n>LABEL_02041}", plabel: "", span: 0, type: "string", width: "4%" },
		{ id: "Ename", label: "{i18n>LABEL_02070}", plabel: "", span: 0, type: "string", width: "10%", align: sap.ui.core.TextAlign.Begin },
		{ id: "Acttx", label: "{i18n>LABEL_02024}", plabel: "", span: 0, type: "string", width: "10%", align: sap.ui.core.TextAlign.Begin },
		{ id: "Actda1", label: "{i18n>LABEL_02014}", plabel: "", span: 0, type: "string", width: "10%" },
		{ id: "Batyp", label: "{i18n>LABEL_02045}", plabel: "", span: 0, type: "string", width: "6%" },
		{ id: "Todo1", label: "{i18n>LABEL_02271}", plabel: "", span: 0, type: "string", width: "10%" },
		{ id: "Todo2", label: "{i18n>LABEL_02272}", plabel: "", span: 0, type: "string", width: "10%" },
		{ id: "Todo3", label: "{i18n>LABEL_02218}", plabel: "", span: 0, type: "string", width: "10%" },
		{ id: "Todo4", label: "{i18n>LABEL_02273}", plabel: "", span: 0, type: "string", width: "10%", align: sap.ui.core.TextAlign.Begin },
		{ id: "Todo5", label: "{i18n>LABEL_02274}", plabel: "", span: 0, type: "string", width: "8%" },
		{ id: "Todo6", label: "{i18n>LABEL_02275}", plabel: "", span: 0, type: "string", width: "8%" }
	],

	createContent: function (oController) {
		var SubjectHandler = oController.getSubjectHandler();

		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(oController, this._colModel);

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_SubjectList", {
			enableColumnReordering: false,
			enableColumnFreeze: false,
			showNoData: true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay: false,
			visibleRowCount: 15,
			rowHeight: 37,
			enableBusyIndicator: true,
			firstVisibleRowChanged: SubjectHandler.afterScroll.bind(SubjectHandler)
		})
		.setModel(sap.ui.getCore().getModel("ActionSubjectList"))
		.bindRows("/ActionSubjectListSet");

		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

		// Column id: Pchk, index: 0
		oTable.getColumns()[0].setTemplate(
			new sap.m.CheckBox({
				selected: "{Pchk}",
				select: oController.toggleCheckbox
			}).addStyleClass("FontFamily")
		);

		// Checkbox select all Add
		oTable.getColumns()[0].removeAllMultiLabels();
		oTable.getColumns()[0].addMultiLabel(
			new sap.m.CheckBox(oController.PAGEID + "_checkAll", {
				select: oController.checkAll
			})
		);

		// Column id: Cfmyn, index: 1
		oTable.getColumns()[1].setTemplate(
			new sap.ui.core.Icon({
				size: "1.0rem",
				src: {
					path: "Cfmyn",
					formatter: function (fVal) {
						if (fVal == "X") {
							// 완료
							return "sap-icon://accept";
						} else if (fVal == "E") {
							// 오류
							return "sap-icon://error";
						} else if (fVal == "L") {
							// 잠금
							return "sap-icon://locked";
						} else {
							return null;
						}
					}
				},
				color: {
					path: "Cfmyn",
					formatter: function (fVal) {
						if (fVal == "X") {
							// 완료
							return "#8DC63F";
						} else if (fVal == "E") {
							// 오류
							return "#F45757";
						} else if (fVal == "L") {
							// 잠금
							return "#54585A";
						} else {
							return "";
						}
					}
				},
				alt: {
					path: "Cfmyn",
					formatter: function (fVal) {
						if (fVal == "X") {
							// 완료
							return oController.getBundleText("LABEL_02149");
						} else if (fVal == "E") {
							// 오류
							return oController.getBundleText("LABEL_02150");
						} else if (fVal == "L") {
							// 잠금
							return oController.getBundleText("LABEL_02151");
						} else {
							return "";
						}
					}
				}
			})
		);

		// Column id: Ename, index: 2
		oTable.getColumns()[2].setTemplate(
			new sap.m.Link({
				text: "{Ename}({Pernr})"
			})
				.addStyleClass("L2PFontFamily L2PFontColorBlue")
				.attachBrowserEvent("click", oController.onInfoViewPopup)
		);

		// Column id: Batyp, index: 5
		oTable.getColumns()[5].setTemplate(
			new sap.ui.commons.TextView({
				text: {
					path: "Batyp",
					formatter: function (fVal) {
						if (fVal == "A") {
							return "After";
						} else {
							return "Before";
						}
					}
				},
				textAlign: sap.ui.core.TextAlign.Center,
				design: sap.ui.commons.TextViewDesign.Bold,
				semanticColor: {
					path: "Batyp",
					formatter: function (fVal) {
						if (fVal == "A") {
							return sap.ui.commons.TextViewColor.Critical;
						} else {
							return sap.ui.commons.TextViewColor.Default;
						}
					}
				}
			})
		);

		oTable.addEventDelegate({
			onAfterRendering: function () {
				jQuery.sap.delayedCall(100, null, function() {
					SubjectHandler.onAfterRenderingTable();
				});
			}
		}, oTable);

		return oTable;
	}
});
