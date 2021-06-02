sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_P0812ListY15", {
	/** 세액감면 및 세액공제 - 의료비 **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P0812ListY15Table", {
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
							 					oController.onAddLine(oEvent, "P0812ListY15");
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
							 					oController.onDeleteLine(oEvent, "P0812ListY15");
							 				}
							 		   }).addStyleClass("button-light"),
							 		   new sap.m.ToolbarSpacer(),
							 		   new sap.m.Text({
							 			   text : "데이터(라인 추가/삭제) 수정 후 반드시 저장버튼을 클릭해야 데이터가 반영됩니다."
							 		   }).addStyleClass("colorBlue Font14")]
						 }) .addStyleClass("ToolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("FontFamily sapUiSizeCompact");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "80px"},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "100px"},
			 			{id: "Supnr", label : "사업자등록번호", plabel : "", span : 0, type : "supnr", editable : true, sort : true, filter : true},
			 			{id: "Supnm", label : "상호명", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Mepcd", label : "증빙코드", plabel : "", span : 0, type : "combobox", editable : true, sort : true, filter : true, width : "300px"},
			 			{id: "Mecnt", label : "건수", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true, width : "80px"},
			 			{id: "Meamt", label : "금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true, width : "130px"},
			 			// {id: "Mesty", label : "안경구입비", plabel : "", span : 0, type : "radiobutton2", editable : true, sort : true, filter : true, width : "100px"},
			 			// {id: "Surpg", label : "난임시술비", plabel : "", span : 0, type : "radiobutton2", editable : true, sort : true, filter : true, width : "100px"},
						{id: "Medty", label : "의료비 유형", plabel : "", span : 0, type : "combobox", editable : true, sort : true, filter : true, width : "200px"},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		// // 의료종류
		// var oColumn = new sap.ui.table.Column({
		// 	hAlign : "Center",
		// 	flexible : false,
  //      	autoResizable : true,
  //      	resizable : true,
		// 	showFilterMenuEntry : true,
		// 	multiLabels : [new sap.ui.commons.TextView({text : "의료종류", textAlign : "Center"}).addStyleClass("FontFamily")],
		// 	width : "160px",
		// 	template : [new sap.m.ComboBox({
		// 					items : { 
		// 						path : "ZHR_YEARTAX_SRV>/MedtyCode",
		// 						template: new sap.ui.core.ListItem({
		// 			                          key: "{ZHR_YEARTAX_SRV>Zcode}",
		// 			                          text: "{ZHR_YEARTAX_SRV>Ztext}"
		// 			                      }),
		// 			            templateShareable : false
		// 		            },       
		// 		            selectedKey : "{Medty}",
		// 		            width : "100%"
		// 				}).addStyleClass("FontFamily")]
		// });
		
		// oTable.addColumn(oColumn);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1300px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(의료비)",
			beginButton : [new sap.m.Button({
								text : "저장",
								type : "Emphasized",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P0812ListY15");
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
