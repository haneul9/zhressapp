sap.ui.jsfragment("commonFragment.EmployeeProfilePromotionFiles", {
	createContent: function (oController) {
		var oJSONModel = new sap.ui.model.json.JSONModel();
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_PromotionFilesTable", {
			enableColumnReordering: false,
			enableColumnFreeze: false,
			columnHeaderHeight: 35,
			showNoData: true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay: false,
			enableBusyIndicator: true,
			noData: "No data found",
			visibleRowCount: 8
		});
		oTable.setModel(oJSONModel);

		var oColumn = new sap.ui.table.Column({
			hAlign: "Begin",
			flexible: false,
			vAlign: "Middle",
			autoResizable: true,
			resizable: false,
			showFilterMenuEntry: false,
			width: "15%",
			label: [new sap.ui.commons.TextView({ text: "No", textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily")],
			template: [new sap.ui.commons.TextView({ text: "{Idx}", textAlign: "Center" }).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);

		var oColumn = new sap.ui.table.Column({
			hAlign: "Begin",
			flexible: false,
			vAlign: "Middle",
			autoResizable: true,
			resizable: false,
			showFilterMenuEntry: false,
			width: "85%",
			label: [new sap.ui.commons.TextView({ text: "첨부파일", textAlign: "Center", width: "100%" }).addStyleClass("L2PFontFamily")],
			template: [
				new sap.m.Link({
					text: "{Fname}",
					customData: new sap.ui.core.CustomData({ key: "Url", value: "{Url}" }),
					press: function (oEvent) {
						var vUrl = oEvent.getSource().getCustomData()[0].getValue();

						if (vUrl) window.open(vUrl);
					}
				}).addStyleClass("L2PFontFamily")
			]
		});
		oTable.addColumn(oColumn);

		var oDialog = new sap.m.Dialog({
			content: [oTable],
			contentWidth: "700px",
			showHeader: true,
			title: "첨부파일",
			endButton: new sap.m.Button({
				text: "닫기",
				press: function (oEvent) {
					oDialog.close();
				}
			})
		}).addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
