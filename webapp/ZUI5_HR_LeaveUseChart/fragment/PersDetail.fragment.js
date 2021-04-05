sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.PersDetail", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_PersDetailTable", {
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
		}).addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// No, 사번, 성명, 직급구분, 직급, 소속부서, 근태일자, 근태사유, 시작시간, 종료시간, 시간, 일수, 상세사유
		var col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "HgradeT", label: oBundleText.getText("LABEL_41054"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_41020"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Datum", label: oBundleText.getText("LABEL_41047"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
						{id: "Atext", label: oBundleText.getText("LABEL_41048"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Beguz", label: oBundleText.getText("LABEL_41049"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Enduz", label: oBundleText.getText("LABEL_41050"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Stdaz", label: oBundleText.getText("LABEL_41051"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// {id: "Abrtg", label: oBundleText.getText("LABEL_41052"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Dtrsn", label: oBundleText.getText("LABEL_41053"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1300px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_41046"), // 일자별 휴가사용 상세현황
			content : [oTable],
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"),
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
