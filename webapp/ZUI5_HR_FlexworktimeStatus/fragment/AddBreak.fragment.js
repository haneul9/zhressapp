sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.AddBreak", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddBreakTable", {
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
		}).addStyleClass("mt-8px sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 시작시간, 종료시간, 시간, 비고, 삭제
		var col_info = [{id: "Beguz", label: oBundleText.getText("LABEL_69006"), plabel: "", resize: true, span: 0, type: "timepicker2", sort: true, filter: true},
						{id: "Enduz", label: oBundleText.getText("LABEL_69007"), plabel: "", resize: true, span: 0, type: "timepicker2", sort: true, filter: true},
						{id: "Adbtm", label: oBundleText.getText("LABEL_69016"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Notes", label: oBundleText.getText("LABEL_69017"), plabel: "", resize: true, span: 0, type: "note", sort: true, filter: true, width : "400px"},
						{id: "",	  label: oBundleText.getText("LABEL_00103"), plabel: "", resize: true, span: 0, type: "delete", sort: true, filter: true, width : "60px"}];
						
		oController.makeTable(oController, oTable, col_info);
		
		var oJSONModel = new sap.ui.model.json.JSONModel();
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "400px", "60px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_69018")})], // 합계
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : 2
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
								 	 	text : {
								 	 		path : "Adbtm",
								 	 		formatter : function(fVal){
								 	 			return (fVal && fVal != "") ? (fVal.substring(0,2) + ":" + fVal.substring(2,4)) : "";
								 	 		}
								 	 	}
								 	 })],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}).addStyleClass("table-footer")
					  .bindElement("/Data/0")]
		});
		
		oMatrix.setModel(oJSONModel);
		oTable.setFooter(oMatrix);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "900px",
			contentHeight : "",
			title : oBundleText.getText("LABEL_69015"), // 추가휴게시간
			content : [oTable],
			buttons : [new sap.m.Button({
						   text : oBundleText.getText("LABEL_00101"), // 저장
						   press : oController.onSaveBreak
					   }).addStyleClass("button-dark"),
					   //new sap.m.Button({
						  // text : oBundleText.getText("LABEL_00103"), // 삭제
						  // press : function(oEvent){
						  // 		oController.onDeleteBreak(oEvent, oTable); 
						  // }
					   //}).addStyleClass("button-default"),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_00133"), // 닫기
						   press : function(){oDialog.close();}
					   }).addStyleClass("button-default custom-button-divide")]
		}).addStyleClass("custom-dialog-popup");
		
		oDialog.setModel(oJSONModel);
		oDialog.bindElement("/Data/0");
		
		return oDialog;
	}
});
