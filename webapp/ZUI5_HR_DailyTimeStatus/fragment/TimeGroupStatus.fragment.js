sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.TimeGroupStatus", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_TimeGroupStatusTable", {
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
		
						// No, 소속부서, 사번, 성명, 직급, 직급구분
		var col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "150px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_41020"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "HgradeT", label: oBundleText.getText("ZHGRADE"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 근태유형
						{id: "Atext", label: oBundleText.getText("LABEL_43061"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "150px"},
						// 시작시간, 종료시간, 시간, 사유
						{id: "Beguz", label: oBundleText.getText("LABEL_43062"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Enduz", label: oBundleText.getText("LABEL_43063"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Stdaz", label: oBundleText.getText("LABEL_43064"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Dtrsn", label: oBundleText.getText("LABEL_43065"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin", width : "250px"}];
						// 대휴발생일
						// {id: "1", label: oBundleText.getText("LABEL_43066"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true}
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1300px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_43060"), // 근태유형별 상세현황
			content : [oTable],
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"),
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
