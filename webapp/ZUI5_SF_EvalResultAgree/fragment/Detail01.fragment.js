sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail01", {
	
	createContent: function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "None",
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// No., 목표, 진척률, 1차평가
		var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "name", label : oBundleText.getText("LABEL_12109"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin"},
						{id: "done", label : oBundleText.getText("LABEL_12110"), plabel : "", span : 0, type : "progress", sort : true, filter : true, width : "200px"},
						{id: "rating", label : oBundleText.getText("LABEL_12112"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px"}];

		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
									 				height : "44px",
												 	content : [new sap.m.Text({text : oBundleText.getText("LABEL_15007")}).addStyleClass("Font18 Font700")] // 업적평가
												}).addStyleClass("toolbarNoBottomLine padding0")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oTable],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					})]	
		});
		
		return oMatrix;
	}
});
     