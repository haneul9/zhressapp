jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.Common");

sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", {
	createContent: function (oController) {
		var oLayout = new sap.ui.commons.layout.VerticalLayout().addStyleClass("p-20px");

		var oIssuedDateMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_IssuedDate", {
			width: "100%",
			layoutFixed: true,
			columns: 2,
			widths: ["26%", "74%"]
		}).addStyleClass("act-tbl-read"); 

		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02014}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: new sap.m.Text(oController.PAGEID + "_AD_Actda", { width: "200px", textAlign: "Left" }).addStyleClass(
				"L2PFontFamily"
			)
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oIssuedDateMatrix.addRow(oRow);

		var oIssuedDatePanel = new sap.m.Panel({
			expandable: true,
			expanded: true,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_02014}", design: "Bold", width: "95px", size: "14px" }).addStyleClass("L2PFontFamily")
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oIssuedDateMatrix]
		});

		oLayout.addContent(oIssuedDatePanel);

		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_IssuedTyp", {
			width: "100%",
			layoutFixed: true,
			columns: 2,
			widths: ["26%", "74%"]
		}).addStyleClass("act-tbl-read");

		var oActTypeReasonPanel = new sap.m.Panel({
			expandable: true,
			expanded: true,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_02013}", design: "Bold", size: "14px" }).addStyleClass("L2PFontFamily")
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oIssuedTypeMatrix]
		});

		oLayout.addContent(oActTypeReasonPanel);

		var oActDetailMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_MatrixLayout", {
			width: "100%",
			layoutFixed: true,
			columns: 3,
			widths: ["26%", "37%", "37%"]
		}).addStyleClass("act-tbl-list");

		var oActHistoryPanel = new sap.m.Panel({
			expandable: true,
			expanded: true,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_02004}", design: "Bold", size: "14px" }).addStyleClass("L2PFontFamily")
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oActDetailMatrix]
		});

		oLayout.addContent(oActHistoryPanel);

		var oPopover = new sap.m.Popover({
			title: "{i18n>LABEL_02200}",
			placement: sap.m.PlacementType.Auto,
			content: oLayout,
			contentWidth: "1000px",
			contentHeight: "680px",
			afterOpen: oController.onAfterOpenPopover,
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				press: function (oEvent) {
					oEvent.getSource().getParent().getParent().close();
				}
			})
		});

		if (!jQuery.support.touch) {
			oPopover.addStyleClass("sapUiSizeCompact");
		}

		return oPopover;
	}
});
