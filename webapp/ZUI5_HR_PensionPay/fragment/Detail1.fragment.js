sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail1", {
	
	createContent: function (oController) {
		var oHeader = new sap.m.FlexBox({
			justifyContent: "SpaceBetween",
			alignContent: "End",
			alignItems: "End",
			fitContainer: true,
			items: [new sap.m.FlexBox({
						items: [new sap.m.Label({
									text: oBundleText.getText("LABEL_17004"), // 연도별 불입 내역 
									design: "Bold"
								}).addStyleClass("sub-title")]
					})]
		}).addStyleClass("info-box");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: oBundleText.getText("LABEL_00901") // No data found
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 연도, 개인부담금, 회사지원금, 합계
		var col_info = [{id: "Zyear", label: oBundleText.getText("LABEL_17006"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "SelfAmtT", label: oBundleText.getText("LABEL_17007"), plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align : "End"},
						{id: "SuppAmtT", label: oBundleText.getText("LABEL_17008"), plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align : "End"},
						{id: "TotalAmtT", label: oBundleText.getText("LABEL_17009"), plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align : "End"}];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info);
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [oHeader, oTable]
		});
		
		return oContent;
	}
});
     