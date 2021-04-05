sap.ui.jsfragment("fragment.EvalResultAgree", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.SearchEvalResultAgree");
		jQuery.sap.require("common.JSONModelHelper");
		jQuery.sap.require("common.makeTable");
		jQuery.sap.includeStyleSheet("css/dashboard.css");
		
		common.SearchEvalResultAgree.oController = oController;
		
		var oHeader = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["360px", "", "45px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Image({
																   src : "{photo}",
																   width : "55px",
																   height : "55px"
															   }).addStyleClass("roundImage"),
															   new sap.ui.layout.VerticalLayout({
															   	   content : [new sap.ui.layout.HorizontalLayout({
																		   	   	  content : [new sap.m.Text({text : "{nickname}"}).addStyleClass("Font20 FontBold"),
																		   	   				 new sap.m.Text({text : "{title}"}).addStyleClass("Font15 paddingLeft5 paddingtop6")]
																		   	  }).addStyleClass("paddingTop3"),
															   				  new sap.m.Text({text : "{department} / {custom01}"}).addStyleClass("info2 paddingTop8")]
															   }).addStyleClass("paddingLeft10 paddingTop3")]
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText(common.SearchEvalResultAgree.PAGEID + "_Status", {
											 	 	width: "42px",
											 	 	height: "42px", 
											 	 	htmlText: "<em>Loading</em>"
											 	 }).addStyleClass("spinner-evalresult")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		
		// 평가결과
		var oTable = new sap.ui.table.Table(common.SearchEvalResultAgree.PAGEID + "_Table", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "None",
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "99.9%",
			widths : ["", "24px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.VerticalLayout(common.SearchEvalResultAgree.PAGEID + "_Content1")],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.VerticalLayout(common.SearchEvalResultAgree.PAGEID + "_Content2")],
								 	 hAlign : "Begin",
								 	 vAlign : "Top"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.VerticalLayout(common.SearchEvalResultAgree.PAGEID + "_Content3")],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.VerticalLayout(common.SearchEvalResultAgree.PAGEID + "_Content4")],
								 	 hAlign : "Begin",
								 	 vAlign : "Top"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
												 	height : "44px",
												 	visible : {
												 		path : "Flag",
												 		formatter : function(fVal){
												 			return fVal == null ? true : false;
												 		}
												 	},
												 	content : [new sap.m.Text({text : oBundleText.getText("LABEL_15013")}).addStyleClass("Font18 Font700")] // 이의제기 사유
												}).addStyleClass("toolbarNoBottomLine padding0")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.TextArea({
												 	value : "{Isstxt}",
												 	width : "100%",
												 	maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaResultAgreeTableIn", "Isstxt"),
												 	rows : 5,
												 	editable : {
												 		path : "Evstaus",
												 		formatter : function(fVal){
												 			return fVal == "30" ? true : false;
												 		}
												 	},
												 	visible : {
												 		path : "Flag",
												 		formatter : function(fVal){
												 			return fVal == null ? true : false;
												 		}
												 	}
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.core.HTML({
												 	content : "<div style='height:10px' />",
												 	visible : {
												 		path : "Flag",
												 		formatter : function(fVal){
												 			return fVal == null ? true : false;
												 		}
												 	}
												})]
								 })]
					})]
		});
		
		///////////////////////////////////////////////////////
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["3rem", "", "3rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oHeader]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
													 content : [new sap.m.Text({text : oBundleText.getText("LABEL_15001")}).addStyleClass("Font18 Font700"), // 평가결과
																new sap.m.ToolbarSpacer(),
																new sap.m.Button({
																	text : oBundleText.getText("LABEL_15002"), // 평가설문
																	type : "Emphasized",
																	width : "100px",
																	visible : {
																		parts : [{path : "Flag"}, {path : "Evstaus"}],
																		formatter : function(fVal1, fVal2){
																			if(fVal1 == "X"){
																				return false;
																			} else {
																				return fVal2 == "20" ? true : false;
																			}
																		}
																	},
																	press : common.SearchEvalResultAgree.onPressSurvey
																}).addStyleClass("button-height"),
																new sap.m.Button({
																	text : oBundleText.getText("LABEL_15003"), // 결과확인 2020-01-05 결과합의→결과확인 텍스트 변경
																	type : "Emphasized",
																	width : "100px",
																	visible : {
																		parts : [{path : "Flag"}, {path : "Evstaus"}],
																		formatter : function(fVal1, fVal2){
																			if(fVal1 == "X"){
																				return false;
																			} else {
																				return fVal2 == "30" ? true : false;
																			}
																		}
																	},
																	press : function(oEvent){
																		common.SearchEvalResultAgree.onPressSave(oEvent, "50");
																	}
																}).addStyleClass("button-height"),
																new sap.m.Button({
																	text : oBundleText.getText("LABEL_15004"), // 이의제기
																	type : "Emphasized",
																	width : "100px",
																	visible : {
																		parts : [{path : "Flag"}, {path : "Evstaus"}],
																		formatter : function(fVal1, fVal2){
																			if(fVal1 == "X"){
																				return false;
																			} else {
																				return fVal2 == "30" ? true : false;
																			}
																		}
																	},
																	press : function(oEvent){
																		common.SearchEvalResultAgree.onPressSave(oEvent, "40");
																	}
																}).addStyleClass("button-height"),
																new sap.m.MessageStrip({
																	type : "Information",
																	showIcon : true,
																	text : oBundleText.getText("MSG_15019"), // 종합평가 완료 시에만 결과확인 및 이의제기가 활성화 됩니다.
																	visible : {
																		path : "Evstaus",
																		parts : [{path : "Flag"}, {path : "Evstaus"}],
																		formatter : function(fVal1, fVal2){
																			if(fVal1 == "X"){
																				return false;
																			} else {
																				if(fVal2 == ""){
																					return true; 
																				} else if(fVal2 && parseFloat(fVal2) < 20){
																					return true;
																				} else {
																					return false;
																				}
																			}
																		}
																	}
																})]
												 }).addStyleClass("toolbarNoBottomLine padding0")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oTable]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		oContent.setModel(common.SearchEvalResultAgree._JSONModel);
		oContent.bindElement("/Data");
		
		var oDialog = new sap.m.Dialog({
			title : oBundleText.getText("LABEL_15001"), // 평가결과 확인/이의제기
			contentWidth : "1500px",
			contentHeight : "1500px",
			content : [new sap.m.FlexBox({
						   justifyContent : "Start",
						   fitContainer : true,
						   items : [oContent]
					   })],
			beforeOpen : common.SearchEvalResultAgree.onBeforeOpen,
			afterOpen : common.SearchEvalResultAgree.onAfterOpen,
			endButton : [new sap.m.Button({
							 type : "Emphasized",
							 text : oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })]
		});
		
		return oDialog;
	}
});
