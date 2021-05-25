sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_P088103", {
	/** 세액감면 및 세액공제 - 신용카드 **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P088103Table", {
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
												oController.onAddLine(oEvent, "P088103", "03");
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
												oController.onDeleteLine(oEvent, "P088103", "03");
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
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Regno", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true},
			 			{id: "Cadme", label : "사용구분", plabel : "", span : 0, type : "combobox", editable : true, sort : true, filter : true, width : "250px"},
			 			{id: "Ntsam", label : "국세청금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Otham", label : "기타금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(신용카드)",
			beginButton : [new sap.m.Button({
								text : "저장",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P088103", "03");
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
