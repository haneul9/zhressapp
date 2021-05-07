sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.WorkSchedule", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var changeMonyn = function(){
			var oMonyn = oController._WorkScheduleDialog.getModel().getProperty("/Data/0/Monyn");
				oMonyn = (!oMonyn || oMonyn == "") ? "1" : (oMonyn == "2" ? "3" : "1");
				
			oController._WorkScheduleDialog.getModel().setProperty("/Data/0/Monyn", oMonyn);	
		};
		
		var oJSONModel = new sap.ui.model.json.JSONModel();
		
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["", "", "", "460px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "40px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
												 	content : [new sap.m.Text({text : "{i18n>LABEL_69038}"}).addStyleClass("sub-title")] // 근무일정
												}).addStyleClass("toolbarNoBottomLine")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_69006}"})], // 시작시간
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_69007}"})], // 종료시간
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_69008}"})], // 점심시간
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_69049}"})], // 변경사유
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										        	value : "{Beguz}",
										        	minutesStep : 30,
										        	width : "100%", 
										        	textAlign : "Begin",
				                                	editable : {
					                                    path : "Offyn",
					                                    formatter : function(fVal){
					                                    	return (fVal == "" || fVal == "1") ? true : false;
					                                    }
				                                	},
				                                	change : function(oEvent){
				                                		oController.onChangeTime(oEvent, "30");
				                                		
				                                		if(oEvent.getParameters().value > "1330"){
				                                			oController._WorkScheduleDialog.getModel().setProperty("/Data/0/Lnctm", "0");
				                                		}
				                                		
				                                		changeMonyn();
				                                	}
												})], // 시작시간
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										        	value : "{Enduz}",
										        	minutesStep : 10,
										        	width : "100%", 
										        	textAlign : "Begin",
				                                	editable : {
					                                    path : "Offyn",
					                                    formatter : function(fVal){
					                                    	return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
					                                    }
				                                	},
				                                	change : function(oEvent){
				                                		oController.onChangeTime(oEvent, "10");
				                                		changeMonyn();
				                                	}
												})], // 종료시간
									 hAlign : "Begin",
									 vAlign : "Middle" 
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.ComboBox({
													selectedKey : "{Lnctm}",
													width : "100%",
													items : [new sap.ui.core.Item({key : "0", text : ""}),
															 new sap.ui.core.Item({key : "1", text : "00:30"}),
															 new sap.ui.core.Item({key : "2", text : "01:00"}),
															 new sap.ui.core.Item({key : "3", text : "01:30"}),
															 new sap.ui.core.Item({key : "4", text : "02:00"})],
													editable : {
														path : "Offyn",
														parts : [{path : "Offyn"}, {path : "Beguz"}],
														formatter : function(fVal1, fVal2){
															if(fVal2 > "1330"){
																 return false;
															} else {
																return (fVal1 == "" || fVal1 == "1" || fVal1 == "2") ? true : false;
															}
														}
													},
													change : changeMonyn
												})], // 점심시간
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input({
													value : "{Chgrsn}",
													width : "100%",
													editable : {
														path : "Offyn",
														formatter : function(fVal){
															return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
														}
													},
													change : changeMonyn,
													maxLength : common.Common.getODataPropertyLength("ZHR_FLEX_TIME_SRV", "FlexworktimeDetail", "Chgrsn")
												})], // 변경사유
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		}).setModel(oJSONModel)
		  .bindElement("/Data/0");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddBreakTable2", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}", // No data found
			extension : [new sap.m.Toolbar({
							 height : "40px",
							 content : [new sap.m.Text({
										 	text : "{i18n>LABEL_69015}" // 추가휴게시간
										}).addStyleClass("sub-title")]
						 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("mt-8px sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 시작시간, 종료시간, 시간, 비고, 삭제
		var col_info = [{id: "Beguz", label: "{i18n>LABEL_69006}", plabel: "", resize: true, span: 0, type: "timepicker2", sort: true, filter: true},
						{id: "Enduz", label: "{i18n>LABEL_69007}", plabel: "", resize: true, span: 0, type: "timepicker2", sort: true, filter: true},
						{id: "Adbtm", label: "{i18n>LABEL_69016}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Notes", label: "{i18n>LABEL_69017}", plabel: "", resize: true, span: 0, type: "note", sort: true, filter: true, width : "400px"},
						{id: "",	  label: "{i18n>LABEL_00103}", plabel: "", resize: true, span: 0, type: "delete", sort: true, filter: true, width : "60px"}];
						
		oController.makeTable(oController, oTable, col_info);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "400px", "60px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_69018}"})], // 합계
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : 2
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
								 	 	text : {
								 	 		path : "Adbtm",
								 	 		formatter : function(fVal){
								 	 			if(fVal){
								 	 				fVal = fVal.replace(":", "");
								 	 			};
								 	 			
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
			contentWidth : "1000px",
			contentHeight : "",
			title : {
				path : "Offyn",
				formatter : function(fVal){
										// 과거근무 변경신청				   // 근무 변경
					return fVal == "1" ? oController.getBundleText("LABEL_69047") : oController.getBundleText("LABEL_69048"); 
				}
			},
			initialFocus : oMatrix1,
			content : [oMatrix1, oTable],
			buttons : [new sap.m.Button({
						   text : "{i18n>LABEL_00152}", // 신청
						   visible : {
							   	path : "Offyn",
							   	formatter : function(fVal){
							   		return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
							   	}
						   },
						   press : oController.onSaveWorkSchedule
					   }).addStyleClass("button-dark"),
					   new sap.m.Button({
						   text : "{i18n>LABEL_00133}", // 닫기
						   press : function(){oDialog.close();},
						   visible : {
							   	path : "Offyn",
							   	formatter : function(fVal){
							   		return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
								}	
						   }
					   }).addStyleClass("button-default custom-button-divide"),
					   new sap.m.Button({
							 text : "{i18n>LABEL_00133}", // 닫기
							 press : function(){oDialog.close();},
							   visible : {
								   	path : "Offyn",
								   	formatter : function(fVal){
								   		return (fVal == "" || fVal == "1" || fVal == "2") ? false : true;
									}	
							 }
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		oDialog.setModel(oJSONModel);
		oDialog.bindElement("/Data/0");
		
		return oDialog;
	}
});
