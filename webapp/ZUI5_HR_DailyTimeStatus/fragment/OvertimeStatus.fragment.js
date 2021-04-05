sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.OvertimeStatus", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_OvertimeStatusTable", {
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
		
						// No, 사번, 성명, 직급, 직급구분, 소속부서
		var col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "50px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_00110"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "HgradeT", label: oBundleText.getText("ZHGRADE"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx", label: oBundleText.getText("LABEL_43081"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 기본, 연장, 소계
						{id: "Hrs20", label: oBundleText.getText("LABEL_43083"), plabel: "", resize: true, span: 3, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs21", label: oBundleText.getText("LABEL_43084"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs22", label: oBundleText.getText("LABEL_43085"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						// 평일(기본, 연장, 소계)
						{id: "Hrs30", label: oBundleText.getText("LABEL_43057"), plabel: oBundleText.getText("LABEL_43083"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs31", label: oBundleText.getText("LABEL_43057"), plabel: oBundleText.getText("LABEL_43084"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs32", label: oBundleText.getText("LABEL_43057"), plabel: oBundleText.getText("LABEL_43085"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						// 휴일(기본, 연장, 소계)
						{id: "Hrs40", label: oBundleText.getText("LABEL_43079"), plabel: oBundleText.getText("LABEL_43083"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs41", label: oBundleText.getText("LABEL_43079"), plabel: oBundleText.getText("LABEL_43084"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs42", label: oBundleText.getText("LABEL_43079"), plabel: oBundleText.getText("LABEL_43085"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						// 한도(기본, 연장)
						{id: "Hrs10", label: oBundleText.getText("LABEL_43086"), plabel: oBundleText.getText("LABEL_43083"), resize: true, span: 2, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Hrs11", label: oBundleText.getText("LABEL_43086"), plabel: oBundleText.getText("LABEL_43084"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						// 심야
						{id: "Hrs50", label: oBundleText.getText("LABEL_43034"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				common.makeTable.setRowspan();  
				
			}
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1500px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_43082"), // 추가근무 상세현황
			content : [oTable],
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"),
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
