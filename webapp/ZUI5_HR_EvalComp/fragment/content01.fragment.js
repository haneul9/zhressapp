sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.content01", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table1", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			cellClick : oController.onPressTable,	
			rowActionCount : 1,
			rowActionTemplate : [new sap.ui.table.RowAction({
									 items : [new sap.ui.table.RowActionItem({
											 	  type : "Navigation",
											 	  press : function(oEvent){
											 	  		oController.onPressTable(oEvent, "X");
											 	  },
											 	  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
											  })]
								 })],
			// extension : [new sap.m.Toolbar({
			// 				 height : "50px",
			// 				 content : [new sap.m.ToolbarSpacer(),
			// 							new sap.m.Button({
			// 								text : oBundleText.getText("LABEL_26011"), // 대리자지정
			// 								press : oController.onOpenSearchTable
			// 							}).addStyleClass("button-dark"),
			// 							new sap.m.Button({
			// 								text : oBundleText.getText("LABEL_26012"), // 대리자삭제
			// 								press : oController.onPressDelete
			// 							}).addStyleClass("button-dark")]
			// 			 }).addStyleClass("toolbarNoBottomLine paddingBottom10")]
		}).addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 대상연도, 평가유형, 성명, 대리평가자, 평가그룹, 1차점수, 단계, 평가기간
		var col_info = [{id: "Apyear", label: oBundleText.getText("LABEL_26003"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Aptypet", label: oBundleText.getText("LABEL_26004"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "EeEname", label: oBundleText.getText("LABEL_26005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// {id: "EdEname", label: oBundleText.getText("LABEL_26006"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Apgupt", label: oBundleText.getText("LABEL_26007"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "CalcP", label: oBundleText.getText("LABEL_26008"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Apstatt", label: oBundleText.getText("LABEL_26009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Period", label: oBundleText.getText("LABEL_26010"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		return oTable;
	}
});
