jQuery.sap.require("common.Common");
jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.makeTable");
jQuery.sap.require("common.TMEmpBasicInfoBox");

sap.ui.jsview("ZUI5_HR_Vacation.Detail", {
	
	getControllerName: function() {
		return "ZUI5_HR_Vacation.Detail";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_LEAVE_APPL_SRV");
		
		var oHeader = new sap.m.HBox({
			width : "100%",
            justifyContent: "SpaceBetween",
            items: [new sap.m.HBox({
	                	justifyContent: "Start",
	                	width : "100%",
	                    items: [new common.TMEmpBasicInfoBox(oController._DetailJSonModel).addStyleClass("ml-10px mt-15px"),]
	                }),
	                new sap.m.HBox({
	                	justifyContent: "End",
	                    items: [new sap.m.Button({
						 	 	    text : oBundleText.getText("LABEL_48040"), // 대상자 변경
						 	 	    press : oController.searchOrgehPernr,
						 	 	    visible : {
						 	 	    	parts : [{path : "Status1"}, {path : "Werks"}],
						 	 	    	formatter : function(fVal1, fVal2){
						 	 	    		if(fVal2 && fVal2.substring(0,1) == "D"){
						 	 	    			return false;
						 	 	    		} else {
						 	 	    			return fVal1 == "" ? true : false;
						 	 	    		}
						 	 	    	}
						 	 	    }
						 	    }).addStyleClass("button-light"),
						 		new sap.m.Button({
						 	 	    text : oBundleText.getText("LABEL_48015"), // 근무일정
						 	 	    press : oController.onPressSchedule
						 	    }).addStyleClass("button-light"),
						 		new sap.m.Button({
						 	 		text : oBundleText.getText("LABEL_00152"), // 신청
						 	 		visible : {
						 	 			parts : [{path : "Status1"}, {path : "Flag"}, {path : "Delapp"}, {path : "ListStatus"}],
						 	 			formatter : function(fVal1, fVal2, fVal3, fVal4){
						 	 				if(fVal2 && fVal2 == "D"){
						 	 					return true;
						 	 				} else if(fVal3 != ""){
						 	 					return (fVal4 == "" || fVal4 == "AA") ? true : false;	
						 	 				} else {
						 	 					return (fVal1 == "" || fVal1 == "AA") ? true : false;
						 	 				}
						 	 			}
						 	 		},
						 	 		press : function(oEvent){
						 	 			oController.onPressSave(oEvent, "C");
						 	 		}
						 		}).addStyleClass("button-dark"),
						 		new sap.m.Button({
						 	 		text : oBundleText.getText("LABEL_00103"), // 삭제
						 	 		visible : {
						 	 			path : "Status1",
						 	 			parts : [{path : "Status1"}, {path : "Delapp"}, {path : "ListStatus"}],
						 	 			formatter : function(fVal, fVal2, fVal3){
						 	 				if(fVal2 && fVal2 != ""){
						 	 					return fVal3 == "AA" ? true : false;
						 	 				} else {
						 	 					return fVal == "AA" ? true : false;
						 	 				}
						 	 			}
						 	 		},
						 	 		press : function(oEvent){
						 	 			oController.onPressSave(oEvent, "D");
						 	 		}
						 		}).addStyleClass("button-delete"),
						 		new sap.m.Button({
						 	 		text : {
						 	 			path : "Status1",
						 	 			formatter : function(fVal){  // 취소						 이전
						 	 				return fVal == "" ? oBundleText.getText("LABEL_00119") : oBundleText.getText("LABEL_48053");
						 	 			}
						 	 		},
						 	 		press : oController.onBack
						 		}).addStyleClass("button-delete")]
	                }).addStyleClass("button-group pt-53px pr-25px")]
        });
		
		// 1. 근태신청
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["12%", "23%", "12%", "23%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
									 				height : "45px",
													content : [new sap.m.Text({text : oBundleText.getText("LABEL_48001")}).addStyleClass("sub-title")] // 근태신청
												}).addStyleClass("toolbarNoBottomLine")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({
												 	text : oBundleText.getText("LABEL_48014"), // 근태코드
												 	required : true,
												 	textDirection : "RTL"
												})],
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox(oController.PAGEID + "_Awart", {
											 	 	selectedKey : "{Awart}",
											 	 	width : "70%",
											 	 	change : oController.onChangeAwart,
											 	 	editable : {
											 	 		path : "Status1",
				                               	   		formatter : function(fVal){
				                               	   			return (fVal == "" || fVal == "AA") ? true : false;
				                               	   		}
											 	 	}
											 	}),
											 	new sap.m.ComboBox({
											 	 	selectedKey : "{Half}",
											 	 	width : "30%",
											 	 	items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_48048")}),  // 오전
											 	 			 new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_48049")})], // 오후
											 	 	editable : {
											 	 		parts : [{path : "Status1"}, {path : "Halfc"}],
				                               	   		formatter : function(fVal1, fVal2){
				                               	   			if(fVal1 == "" || fVal1 == "AA"){
				                               	   				if(fVal2 && fVal2 == "H"){
				                               	   					return true;
				                               	   				} else {
				                               	   					return false;
				                               	   				}
				                               	   			} else {
				                               	   				return false;
				                               	   			}
				                               	   		}
											 	 	},
											 	 	change : oController.onChangeHalf
											 	}).addStyleClass("pl-5px")],
									hAlign : "Begin",
									vAlign : "Middle"
								}).addStyleClass("Data"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Label({
												   text : oBundleText.getText("LABEL_48021"), // 근태기간
												   required : true,
												   textDirection : "RTL"
												})],
									hAlign : "End",
									vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.HBox({
												   items : [
													   	new sap.m.DatePicker({
														   valueFormat : "yyyy-MM-dd",
												           displayFormat : gDtfmt,
												           value : "{Begda}",
														   width : "150px",
														   textAlign : "Begin",
														   change : oController.onChangeDate,
													 	   editable : {
													 	 		path : "Status1",
						                               	   		formatter : function(fVal){
						                               	   			return (fVal == "" || fVal == "AA") ? true : false;
						                               	   		}
													 	   }
													   }),
													   new sap.m.DatePicker({
														   valueFormat : "yyyy-MM-dd",
												           displayFormat : gDtfmt,
												           value : "{Endda}",
														   width : "150px",
														   textAlign : "Begin",
														   change : oController.onChangeDate,
													 	   editable : {
													 	 		path : "Status1",
						                               	   		formatter : function(fVal){
						                               	   			return (fVal == "" || fVal == "AA") ? true : false;
						                               	   		}
													 	   }
													   }).addStyleClass("pl-5px"),
						                               new sap.m.Button({
						                               	   text : oBundleText.getText("LABEL_48023"), // 계산
						                               	   visible : {
						                               	   		path : "Status1",
						                               	   		formatter : function(fVal){
						                               	   			return (fVal == "" || fVal == "AA") ? true : false;
						                               	   		}
						                               	   },
						                               	   press : function(oEvent){
						                               	   		var persa = $.app.getModel("session").getData().Persa;
						                               	   			persa = persa.substring(0,1);
						                               	   			
						                               	   		if(persa == "D"){
						                               	   			oController.onPressCheckAbsence(oEvent);
						                               	   		} else {
						                               	   			oController.onPressOvertimePe(oEvent);
						                               	   		}
						                               	   }
						                               }).addStyleClass("button-default pt-3px pl-5px")
												   ]
											   })],
				                    hAlign : "Begin",
				                    vAlign : "Middle"
								}).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48017")})], // 근태일수 → 휴가일수
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({   // X일
											 	 	text : "{Kaltg} " + oBundleText.getText("LABEL_48035"),
											 	 	visible : {
											 	 		path : "Kaltg",
											 	 		formatter : function(fVal){
											 	 			return fVal && fVal != "" ? true : false;
											 	 		}
											 	 	}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48050")})], // 근태시간
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										            value : "{Beguz}",
										            minutesStep : 5,
										            width : "100px",
										            textAlign : "Begin",
										            change : oController.onChangeTime2,
										            editable : {
										            	parts : [{path : "Status1"}, {path : "Halfc"}],
										            	formatter : function(fVal1, fVal2){
										            		if(fVal1 == "" || fVal1 == "AA"){
										            			return (fVal2 && fVal2 == "X") ? true : false;
										            		} else {
										            			return false;
										            		}
										            	}
										            }
											    }),
											    new sap.m.TimePicker({
													valueFormat : "HHmm",
													displayFormat : "HH:mm",
										            value : "{Enduz}",
										            minutesStep : 5,
										            width : "100px",
										            textAlign : "Begin",
										            change : oController.onChangeTime2,
										            editable : {
										            	parts : [{path : "Status1"}, {path : "Halfc"}],
										            	formatter : function(fVal1, fVal2){
										            		if(fVal1 == "" || fVal1 == "AA"){
										            			return (fVal2 && fVal2 == "X") ? true : false;
										            		} else {
										            			return false;
										            		}
										            	}
										            }
											    }).addStyleClass("pl-5px pr-5px"),
											    new sap.m.Text({
											    	text : "({EAbshr}:{EAbsmm})",
											    	visible : {
											    		parts : [{path : "EAbshr"}, {path : "EAbsmm"}],
											    		formatter : function(fVal1, fVal2){
											    			return (fVal1 && fVal2 && fVal1 != "" && fVal2 != "") ? true : false;
											    		}
											    	}
											    }).addStyleClass("pt-10px")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48018")})], // 휴일일수
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
											 	 	text : "{Hldtg} " + oBundleText.getText("LABEL_48035") + " " + "{Holyt}", // X일
											 	 	visible : {
											 	 		path : "Hldtg",
											 	 		formatter : function(fVal){
											 	 			return fVal && fVal != "" ? true : false;
											 	 		}
											 	 	}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48051")})], // 경조일수
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
											 	 	text :"{Kjdate}" + oBundleText.getText("LABEL_48035"), // 일
											 	 	visible : {
											 	 		path : "Kjdate",
											 	 		formatter : function(fVal){
											 	 			return fVal && fVal != "" ? true : false;
											 	 		}
											 	 	}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({
												 	text : oBundleText.getText("LABEL_48019"), // 연락처
												 	required : true,
												 	textDirection : "RTL"
												})],
									 hAlign : "End",
									 vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Telnum}",
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_LEAVE_APPL_SRV", "VacationApplyTab1", "Telnum"),
											 	 	editable : {
											 	 		path : "Status1",
											 	 		formatter : function(fVal){
											 	 			return (fVal == "" || fVal == "AA") ? true : false;
											 	 		}
											 	 	}
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({
												 	text : {
												 		path : "Awart",
												 		formatter : function(fVal){
												 			if(fVal == "1424"){ // 출장
												 				return oBundleText.getText("LABEL_48020"); // 행선지/출입카드신청
												 			} else {
												 				return oBundleText.getText("LABEL_48052"); // 행선지
												 			}
												 		}
												 	},
												 	required : true,
												 	textDirection : "RTL"
												})],
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Desti}",
											 	 	width : {
											 	 		path : "Awart",
											 	 		formatter : function(fVal){
											 	 			return fVal == "1424" ? "70%" : "100%";
											 	 		}
											 	 	},
												    maxLength : common.Common.getODataPropertyLength("ZHR_LEAVE_APPL_SRV", "VacationApplyTab1", "Desti"),
											 	 	editable : {
											 	 		path : "Status1",
											 	 		formatter : function(fVal){
											 	 			return (fVal == "" || fVal == "AA") ? true : false;
											 	 		}
											 	 	}
											 	}),
											 	new sap.m.ComboBox(oController.PAGEID + "_Encard", {
											 		selectedKey : "{Encard}",
											 		width : "30%",
											 	 	editable : {
											 	 		path : "Status1",
											 	 		formatter : function(fVal){
											 	 			return (fVal == "" || fVal == "AA") ? true : false;
											 	 		}
											 	 	},
											 	 	visible : {
											 	 		path : "Awart",
											 	 		formatter : function(fVal){
											 	 			return fVal == "1424" ? true : false;
											 	 		}
											 	 	},
											 	}).addStyleClass("pl-5px")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48022")})], // 근태사유
									 hAlign : "End",
									 vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Input({
												   value : "{Bigo}",
												   width : "100%",
												   maxLength : common.Common.getODataPropertyLength("ZHR_LEAVE_APPL_SRV", "VacationApplyTab1", "Telnum"),
												   editable : {
												   		path : "Status1",
												   		formatter : function(fVal){
												   			return (fVal == "" || fVal == "AA") ? true : false;
												   		}
												   }
											   })],
									hAlign : "Begin",
									vAlign : "Middle",
									colSpan : 3
								}).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_MessageRow", {
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("MSG_48003")}).addStyleClass("font-bold color-red")], // ※ 자녀출생의 경우 출산일을 반드시 기입하여 주시기 바랍니다.
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 }).addStyleClass("pl-10px pr-10px")]
					}).addStyleClass("displayNone")]
		});
		
		var oPanel1 = new sap.m.Panel({
			expandable : false,
			expanded : true,
			content : [oMatrix]
		});
        
        // 2. 대근신청
    	var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
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
			extension : [new sap.m.Toolbar({
							 height : "45px",
							 content : [new sap.m.Text({text : oBundleText.getText("LABEL_48024")}).addStyleClass("sub-title"), // 대근신청
										new sap.m.ToolbarSpacer(),
										new sap.m.Button({
											text : oBundleText.getText("LABEL_48033"), // 한도체크
											visible : {
												path : "Status1",
												formatter : function(fVal){
													return (fVal == "" || fVal == "AA") ? true : false;
												}
											},
											press : oController.onPressVacationCover
										}).addStyleClass("button-light")]
						 }).addStyleClass("toolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("mt-8px");
		
		oTable2.setModel(new sap.ui.model.json.JSONModel());
		oTable2.bindRows("/Data");
		
						// 일자, 대근자, OT시간, 연장근로, 소정근로, 연장체크, 계, 한도체크, 인원
		var col_info2 = [{id: "Datum", label: oBundleText.getText("LABEL_48026"), plabel: "", resize: true, span: 0, type: "date", sort: false, filter: false},
						 {id: "Awper", label: oBundleText.getText("LABEL_48027"), plabel: "", resize: true, span: 0, type: "pernr", sort: false, filter: false},
						 {id: "", label: oBundleText.getText("LABEL_48028"), plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width : "210px"},
						 {id: "Ovtim", label: oBundleText.getText("LABEL_48029"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
						 {id: "Wt40", label: oBundleText.getText("LABEL_48030"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
						 {id: "Wt12", label: oBundleText.getText("LABEL_48031"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
						 {id: "Wtsum", label: oBundleText.getText("LABEL_48032"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
						 {id: "LigbnTx", label: oBundleText.getText("LABEL_48033"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
						 {id: "Cntgb", label: oBundleText.getText("LABEL_48034"), plabel: "", resize: true, span: 0, type: "combobox", sort: false, filter: false}];
		
		oController.makeColumn(oController, oTable2, col_info2);
		
		var oPanel2 = new sap.m.Panel({
			expandable : false,
			expanded : true,
			content : [oTable2],
			visible : "{Panel2Visible}"
		});
		
		// 3. 휴가쿼터
		var oTable3 = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
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
			extension : [new sap.m.Toolbar({
							 height : "45px",
							 content : [new sap.m.Text({text : oBundleText.getText("LABEL_48025")}).addStyleClass("sub-title")] // 휴가쿼터
						 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("mt-8px");
		
		oTable3.setModel(new sap.ui.model.json.JSONModel());
		oTable3.bindRows("/Data");
		
						// 구분, 발생(만근/가산/이월), 사용, 잔여
		var col_info3 = [{id: "Ktext", label: oBundleText.getText("LABEL_48036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "200px"},
						 {id: "Anzhl", label: oBundleText.getText("LABEL_48037"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "200px"},
						 {id: "Kverb", label: oBundleText.getText("LABEL_48038"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "200px"},
						 {id: "Reman", label: oBundleText.getText("LABEL_48039"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "200px"}];
		
		common.makeTable.makeColumn(oController, oTable3, col_info3);
		
		var oPanel3 = new sap.m.Panel({
			expandable : false,
			expanded : true,
			content : [oTable3]
		});
		
		var titleitem = [
			new sap.m.FlexBox({
			  	 justifyContent : "Start",
				 alignItems: "End",
				 fitContainer: true,
			  	 items : [
			  	  	new sap.m.Button({
					  	  icon : "sap-icon://nav-back",
					  	  type : "Default",
					  	  press : oController.onBack,
					  	  visible : {
						  	  	path : "FromPageId",
						  	  	formatter : function(fVal){
						  	  		return (fVal && fVal != "") ? true : false;
						  	  	}
					  	  }
					  }),
					  new sap.ui.core.HTML({
					  	  content : "<div style='width:10px' />",
					  	  visible : {
					  	  		path : "FromPageId",
					  	  		formatter : function(fVal){
					  	  			return (fVal && fVal != "") ? true : false;
					  	  		}
					  	  }
					  }),
					  new sap.m.FormattedText({
					  	  htmlText : {
					  	  		parts : [{path : "Status1"}, {path : "Delapp"}, {path : "Flag"}],
					  	  		formatter : function(fVal1, fVal2, fVal3){
					  	  			if(fVal3 && fVal3 == "D"){
			  	  						// 근태 삭제신청
					  	  				return "<span class='app-title'>" + oBundleText.getText("LABEL_48064") + "</span>";
					  	  			} else {
					  	  				if(fVal1 == "" || fVal1 == "AA"){
						  	  						// 근태신청 신규등록
						  	  				return "<span class='app-title'>" + oBundleText.getText("LABEL_48013") + "</span>";
						  	  			} else {
						  	  				if(fVal2 == ""){
				  	  							// 근태 조회
							  	  				return "<span class='app-title'>" + oBundleText.getText("LABEL_48006") + "</span>" +
							  	  					   //"<span class='app-title color-signature-blue'> " + oBundleText.getText("LABEL_48045") + "</span>" + // 신규신청
							  	  					   "<span class='app-title'> " + oBundleText.getText("LABEL_48055") + "</span>";
						  	  				} else {
						  	  					// 근태 삭제신청 조회
							  	  				return "<span class='app-title'>" + oBundleText.getText("LABEL_48006") + "</span>" +
							  	  					   "<span class='app-title color-red'> " + oBundleText.getText("LABEL_48046") + "</span>" +
							  	  					   "<span class='app-title'> " + oBundleText.getText("LABEL_48055") + "</span>";
						  	  				}
						  	  			}
					  	  			}
					  	  		}
					  	  }
					  })
			  	  ]
			  })
		];
			  
		if((!sap.ui.Device.system.phone && !sap.ui.Device.system.tablet) && parent && window._use_emp_info_box === true) {
			window._CommonEmployeeModel = new common.EmployeeModel();
			window._CommonEmployeeModel.retrieve(parent._gateway.pernr());

			titleitem.push(new common.EmpBasicInfoBox(window._CommonEmployeeModel));
		};
		
		var title = new sap.m.FlexBox({
			justifyContent : "SpaceBetween",
			alignContent : "Start",
			alignItems : "Center",
			fitContainer: true,
			items : titleitem
		}).addStyleClass("app-title-container");
			
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  justifyContent : "Center",
						  fitContainer: true,
						  items: [
						  	new sap.m.FlexBox(oController.PAGEID + "app-content-container", {
								direction: "Column",
								items: [title, oHeader, oPanel1, oPanel2, oPanel3, new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
							}).addStyleClass("app-content-container-wide")]
					  })]
		}).addStyleClass("app-content-body");
			
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			showHeader : false,
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._DetailJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});