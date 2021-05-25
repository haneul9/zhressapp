sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_P088102", {
	/** 세액감면 및 세액공제 - 교육비 **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P088102Table", {
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
							 					oController.onAddLine(oEvent, "P088102", "02");
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
							 					oController.onDeleteLine(oEvent, "P088102", "02");
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
			 			{id: "Haned", label : "장애인여부", plabel : "", span : 0, type : "checkbox2", editable : false, sort : true, filter : true, width : "100px"},
			 			{id: "Edulv", label : "교육단계", plabel : "", span : 0, type : "combobox", editable : false, sort : true, filter : true, width : "250px"},
			 			{id: "Exsty1", label : "교육구입비", plabel : "", span : 0, type : "radiobutton", editable : true, sort : true, filter : true, width : "100px"},
			 			{id: "Exsty2", label : "현장학습", plabel : "", span : 0, type : "radiobutton", editable : true, sort : true, filter : true, width : "100px"},
			 			{id: "Ntsam", label : "국세청금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Otham", label : "기타금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		// var oColumn = new sap.ui.table.Column({
		// 	hAlign : "Center",
		// 	flexible : false,
  //      	autoResizable : true,
  //      	resizable : true,
		// 	showFilterMenuEntry : true,
		// 	multiLabels : [new sap.ui.commons.TextView({text : "교육단계", textAlign : "Center"}).addStyleClass("FontFamily")],
		// 	width : "250px",
		// 	template : [new sap.m.ComboBox({
		// 					items : { 
		// 						path : "ZHR_YEARTAX_SRV>/EdulvCode",
		// 						template: new sap.ui.core.ListItem({
		// 			                          key: "{ZHR_YEARTAX_SRV>Zcode}",
		// 			                          text: "{ZHR_YEARTAX_SRV>Ztext}"
		// 			                      }),
		// 			            templateShareable : false
		// 		            },       
		// 		            selectedKey : "{Edulv}",
		// 		            width : "100%",
		// 		            customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
		// 		            change : function(oEvent){
		// 		            	var oIdx = oEvent.getSource().getCustomData()[0].getValue();
				            	
		// 		            	oTable.getModel().setProperty("/Data/" + oIdx + "/Exsty1", false);
		// 		            	oTable.getModel().setProperty("/Data/" + oIdx + "/Exsty2", false);
		// 		            }
		// 				}).addStyleClass("FontFamily")]
		// });		
		// oTable.addColumn(oColumn);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1300px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(교육비)",
			beginButton : [new sap.m.Button({
								text : "저장",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P088102", "02");
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