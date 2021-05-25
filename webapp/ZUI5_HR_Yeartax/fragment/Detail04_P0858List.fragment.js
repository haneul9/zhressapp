sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_P0858List", {
	/** 세액감면 및 세액공제(기부금) **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P0858ListTable", {
			enableColumnReordering : false,
			enableGrouping : false,
			enableColumnFreeze : false,
			enableBusyIndicator : true,
			showOverlay : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: "MultiToggle",
			visibleRowCount : 1,
			noData : "No data found",
			extension : [new sap.m.Toolbar({
							 height : "40px",
							 content : [new sap.m.Button({
											text : "라인추가",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onAddLine(oEvent, "P0858List");
											}
									   }).addStyleClass("button-light"),
									   new sap.m.Button({
										    text : "라인삭제",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onDeleteLine(oEvent, "P0858List");
											}
									   }).addStyleClass("button-light"),
									   new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
										   text : "데이터(라인 추가/삭제) 수정 후 반드시 저장버튼을 클릭해야 데이터가 반영됩니다."
									   }).addStyleClass("colorBlue Font14")]
						 }).addStyleClass("ToolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("sapUiSizeCompact");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "85px"},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "100px"},
			 			{id: "Regno", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true, width : "130px"},
			 			{id: "Docod", label : "기부금유형", plabel : "", span : 0, type : "combobox", editable : true, sort : true, filter : true, width : "200px"},
			 			{id: "Donum", label : "사업자등록번호", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Donam", label : "기부처명", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Doamt", label : "금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true, width : "130px"},
			 			{id: "Flnts", label : "국세청자료", plabel : "", span : 0, type : "checkbox", editable : true, sort : true, filter : true, width : "105px"},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(기부금)",
			beginButton : [new sap.m.Button({
								text : "저장",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P0858List");
								}
						   }).addStyleClass("button-dark")],			
			endButton : [new sap.m.Button({text : "닫기", press : function(oEvent){oDialog.close();}}).addStyleClass("button-default")]
		});
		
		oDialog.addStyleClass("custom-dialog-popup");
		oDialog.setModel(oController._DetailJSonModel);
		oDialog.bindElement("/Data");
		
		return oDialog;
	}

});
