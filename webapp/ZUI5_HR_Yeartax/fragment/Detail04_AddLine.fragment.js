sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_AddLine", {
	
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddLineTable", {
			enableColumnReordering : false,
			enableGrouping : false,
			enableColumnFreeze : false,
			enableBusyIndicator : true,
			showOverlay : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: "MultiToggle",
			visibleRowCount : 1
		}).addStyleClass("sapUiSizeCompact");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Regno", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "500px",
			contentHeight : "500px",
			draggable : false,
			content : [oTable],
			title : "대상자 선택",
			beginButton : [new sap.m.Button({
								text : "선택",
								press : oController.onSaveAddLine
						   }).addStyleClass("button-dark")],			
			endButton : [new sap.m.Button({text : "닫기", press : function(oEvent){oDialog.close();}}).addStyleClass("button-default")]
		});
		
		oDialog.addStyleClass("custom-dialog-popup");
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}

});
