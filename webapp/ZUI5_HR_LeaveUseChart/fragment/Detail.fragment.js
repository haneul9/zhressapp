sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.Detail", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			sort : oController.onTableSort
		}).addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// No, 사번, 성명, 직위, 직급, 소속부서, 발생개수
		var col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ZtitleT", label: oBundleText.getText("LABEL_41019"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_41020"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Crecnt", label: oBundleText.getText("LABEL_41021"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 당월사용(개수, %), 누적사용(개수, %), 잔여
						{id: "Curcnt", label: oBundleText.getText("LABEL_41042"), plabel: oBundleText.getText("LABEL_41044"), resize: true, span: 2, type: "link", sort: true, filter: true, width : "100px"},
						{id: "Currte", label: oBundleText.getText("LABEL_41042"), plabel: "%", resize: true, span: 0, type: "link", sort: true, filter: true, width : "100px"},
						{id: "Usecnt", label: oBundleText.getText("LABEL_41043"), plabel: oBundleText.getText("LABEL_41044"), resize: true, span: 2, type: "link", sort: true, filter: true, width : "100px"},
						{id: "Userte", label: oBundleText.getText("LABEL_41043"), plabel: "%", resize: true, span: 0, type: "link", sort: true, filter: true, width : "100px"},
						{id: "Balcnt", label: oBundleText.getText("LABEL_41045"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				common.makeTable.setRowspan();
				
				// for(var i=0; i<col_info.length; i++){
				// 	var color = "";
					
				// 	switch(col_info[i].id){
				// 		case "Cur06":
				// 		case "Crecnt":
				// 		case "Balcnt":
				// 			color = "rgba(255, 250, 193, 0.4)";  
				// 			break;
				// 		case "Cum06":
				// 		case "Usecnt07":
				// 			color = "rgba(255, 216, 216, 0.4)";  
				// 			break;
				// 		case "Usecnt":
				// 			color = "rgba(186, 238, 154, 0.4)";  
				// 			break;
				// 		default:
				// 			color = "";
				// 			break;
				// 	}
					
				// 	if(color == "") continue;
					
				// 	$("tr[id^='" + oController.PAGEID + "_DetailTable-rows'] > td[id$='col" + i +"']").css("background-color", color);
					
				// }	
			}
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1300px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_41041"), // 휴가사용 상세현황
			content : [oTable],
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"),
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
