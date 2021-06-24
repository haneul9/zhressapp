sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_P0881E9", {
	/** 그 밖의 소득공제(기타) **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P0881E9Table", {
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
				 			 visible : {
			 					parts : [{path : "Pystat"}, {path : "Yestat"}],
			 					formatter : function(fVal1, fVal2){
			 						return fVal1 == "1" && fVal2 == "1" ? true : false;
			 					}
				 			 },
							content : [new sap.m.Button({
											icon : "sap-icon://add",
											type : "Emphasized",
											text : "라인추가",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onAddLine2(oEvent, "P0881E9");
											}
									   }),
									   new sap.m.Button({
										    icon : "sap-icon://less",
										    type : "Emphasized",
										    text : "라인삭제",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onDeleteLine(oEvent, "P0881E9");
											}
									   }),
									   new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
										   text : "데이터(라인 추가/삭제) 수정 후 반드시 저장버튼을 클릭해야 데이터가 반영됩니다."
									   }).addStyleClass("colorBlue Font14")]
						 }).addStyleClass("ToolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("FontFamily");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : [new sap.ui.commons.TextView({text : "유형", textAlign : "Center"}).addStyleClass("FontFamily")],
			width : "250px",
			template : [new sap.m.ComboBox({
							items : { 
								path : "ZHR_YEARTAX_SRV>/PnstyCode/?$filter=Subty%20eq%20%27E9%27",
								template: new sap.ui.core.ListItem({
					                          key: "{ZHR_YEARTAX_SRV>Pnsty}",
					                          text: "{ZHR_YEARTAX_SRV>Pnstx}"
					                      }),
					            templateShareable : false
				            },       
				            selectedKey : "{Pnsty}",
				            width : "100%"
						}).addStyleClass("FontFamily")]
		});		
		oTable.addColumn(oColumn);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : [new sap.ui.commons.TextView({text : "금융사", textAlign : "Center"}).addStyleClass("FontFamily")],
			width : "250px",
			template : [new sap.m.ComboBox({
							items : { 
								path : "ZHR_YEARTAX_SRV>/FincoCode",
								template: new sap.ui.core.ListItem({
					                          key: "{ZHR_YEARTAX_SRV>Zcode}",
					                          text: "{ZHR_YEARTAX_SRV>Ztext}"
					                      }),
					            templateShareable : false
				            },       
				            selectedKey : "{Finco}",
				            width : "100%"
						}).addStyleClass("FontFamily")]
		});		
		oTable.addColumn(oColumn);
		
		var col_info = [{id: "Accno", label : "계좌번호", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Ntsam", label : "금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			// contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "그 밖의 소득공제(기타)",
			beginButton : [new sap.m.Button({
								icon : "sap-icon://save", 
								type : "Emphasized",
								text : "저장",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P0881E9");
								}
						   })],			
			endButton : [new sap.m.Button({icon: "sap-icon://decline", text : "닫기", type : "Emphasized", press : function(oEvent){oDialog.close();}})]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		oDialog.setModel(oController._DetailJSonModel);
		oDialog.bindElement("/Data");
		
		return oDialog;
	}

});
