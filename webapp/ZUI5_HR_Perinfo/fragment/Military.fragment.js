sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Military", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		// 계급
		var oMrank  = new sap.m.ComboBox({
			selectedKey : "{Mrank}",
			editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Mrank",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 }  
	   	});
   		// 군별
		var oSerty  = new sap.m.ComboBox({
			selectedKey : "{Serty}",
			editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Serty",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 }  
	   	});
   		// 병과
		var oJobcl  = new sap.m.ComboBox({
			selectedKey : "{Jobcl}",
			editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Jobcl",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 } 
	   	});
			// 역종
		var oZzarmy  = new sap.m.ComboBox({
			selectedKey : "{Zzarmy}",
			editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Zzarmy",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 }
	   	});
  		// 전역사유
		var oPreas  = new sap.m.ComboBox({
			selectedKey : "{Preas}",
			editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Preas",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 }
	   	}); 
		// 미필사유
		var oZznarmy  = new sap.m.ComboBox({
			selectedKey : "{Zznarmy}",
            editable: {
			    path: "disyn",
				formatter: function(v) {
					if(v === "1") return true;
					else return false;
				}
    	    },
    	    items : {
		 		path : "/Zznarmy",
		 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
			 }
		});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ["200px", "", "200px", ""],
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
													height : "45px",
												 	content : [new sap.m.Text({text : "{i18n>LABEL_02198}"}).addStyleClass("Font15 FontBold"), // 병역사항
												 			   new sap.m.ToolbarSpacer(),
												 			   new sap.m.Button({text : "{i18n>LABEL_37042}", // 신규
												 								visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}, {path: "Openf"}],
																						formatter : function(v1, v2, v3, v4) {
																						if(v1 == "E" && v2 === "2" && v3 === "3" && v4 === "Y") return true;
																						else return false;
																					}
																	    	     },
												 								press : function(){
																		 				oController._MilitaryJSonModel.setProperty("/Data/disyn","1");				 	
												 								}}).addStyleClass("button-light"),
												 			   new sap.m.Button({text : "{i18n>LABEL_00102}", // 수정
												 							    visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}, {path: "Openf"}],
																						formatter : function(v1, v2, v3, v4) {
																						if(v1 == "E" && v2 === "2" && v3 === "2" && v4 === "Y") return true;
																						else return false;
																					}
																	    	     },
												 								press : function(){
																		 				oController._MilitaryJSonModel.setProperty("/Data/disyn","1");				 	
												 								}}).addStyleClass("button-light"),
								 								new sap.m.Button({text : "{i18n>LABEL_08003}", // 삭제   	
								 												visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}, {path: "Openf"}],
																						formatter : function(v1, v2, v3, v4) {
																						if(v1 == "E" && v2 === "2" && v3 === "2" && v4 === "Y") return true;
																						else return false;
																					}
																	    	     }, 
												 								press : function(){
												 									oController.onSaveMilitary("D");
												 								}}).addStyleClass("button-light"),
								 								new sap.m.Button({text : "{i18n>LABEL_02152}", // 저장
								 												visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path: "Openf"}],
																					formatter: function(v1, v2, v3) {
																						if(v1 == "E" && v2 === "1" && v3 === "Y") return true;
																						else return false;
																					}
																	    	     }, 
												 								 press : function(){
												 								 	oController.onSaveMilitary("A");
												 								 }}).addStyleClass("button-light"), 
												 				new sap.m.Button({text : "{i18n>LABEL_08004}", // 취소
												 								visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path: "Openf"}],
																					formatter: function(v1, v2, v3) {
																						if(v1 == "E" && v2 === "1" && v3 === "Y") return true;
																						else return false;
																					}
																	    	     }, 
												 								 press : function(){
																		 				oController.onPressSearchMilitary(oController.getView().getModel("session").getData().Pernr);				 	
												 								 }}).addStyleClass("button-light"), 
												 			   
												 			   ] 
												})
								 			    .addStyleClass("toolbarNoBottomLine h-40px"),
												new sap.ui.core.HTML({content : "<div style='height:5px' />"})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37055}" })], // 군번
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	new sap.m.Input({
								 	 				value : "{Idnum}",
								 	 				width : "250px",
								 	 				maxLength : common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordMilitaryTableIn", "Idnum"),
								 	 				editable: {
													    path: "disyn",
														formatter: function(v) {
															if(v === "1") return true;
															else return false;
														}
										    	    } 
								 				})] 
											}).addStyleClass("toolbarNoBottomLine")
											],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_37056}",
															  	required :  {
																			    path: "disyn" ,
																				formatter: function(v1) {
																					if(v1 === "1") return true;
																					else return false;
																				}
																    	     } 
									 })], // 역종
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
  								 	 		new sap.m.Toolbar({
  								 	 			height : "45px",
											 	content : [ oZzarmy ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37057}" })], // 군별
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	oSerty ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_02115}" })], // 계급
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	oMrank] 
											}).addStyleClass("toolbarNoBottomLine")
										],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37057}" })], // 전역사유
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	  content : [
   								 	 		new sap.m.Toolbar({
   								 	 			height : "45px",
											 	content : [	oPreas ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37058}" })], // 병과
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
 								 	 		new sap.m.Toolbar({
											 	content : [	oJobcl ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37059}" })], // 근무부대
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 	new sap.m.Toolbar({
								 	 		height : "45px",
											 	content : [	
	 										 	 new sap.m.Input({
								 	 				value : "{Serut}",
							 	 					maxLength : common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordMilitaryTableIn", "Serut"),
								 	 				width : "250px",
							 	 				    editable: {
													    path: "disyn",
														formatter: function(v) {
															if(v === "1") return true;
															else return false;
														}
										    	    } 
								 				})
								 				] 
										}).addStyleClass("toolbarNoBottomLine")
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3 
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37057}" })], // 미필사유
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	  content : [
   								 	 		new sap.m.Toolbar({
   								 	 			height : "45px",
											 	content : [	oZznarmy ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37061}" })], // 면제사유
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
 								 	 		new sap.m.Toolbar({
 								 	 			height : "45px",
											 	content : [	
													 		new sap.m.Input({
										 	 				value : "{Rsexp}",
									 	 					maxLength : common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordMilitaryTableIn", "Rsexp"),
										 	 				width : "250px",
									 	 				    editable: {
															    path: "disyn",
																formatter: function(v) {
																	if(v === "1") return true;
																	else return false;
																}
												    	    } 
										 				})
											 		] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37062}" })], // 복무기간
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	  content : [
   								 	 		new sap.m.Toolbar({
   								 	 			height : "45px",
											 	content : [	
											 			new sap.m.DatePicker({
										 	 				value : "{Begda}",
											 				valueFormat: "yyyy-MM-dd",
															displayFormat: gDtfmt,
															width: "150px",
															editable: {
													    	    path: "disyn",
																formatter: function(v) {
																	if(v === "1") return true;
																	else return false;
																}
												    	    } 
											 			}),
										 				new sap.m.Text({text : "~" ,  textAlign : "Center" }),
										 				new sap.m.DatePicker({
										 	 				value : "{Endda}",
											 				valueFormat: "yyyy-MM-dd",
															displayFormat: gDtfmt,
															width: "150px",
															editable: {
													    	    path: "disyn",
																formatter: function(v) {
																	if(v === "1") return true;
																	else return false;
																}
												    	    } 
											 			})
											 		] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37063}" })], // ROTC
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
 								 	 		new sap.m.Toolbar({
 								 	 			height : "45px",
											 	content : [	
													 		new sap.m.CheckBox({
											 	 				selected : "{Zrotc}",
											 	 				editable: {
																    path: "disyn",
																	formatter: function(v) {
																		if(v === "1") return true;
																		else return false;
																	}
													    	    } 
										 					})
											 		] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})
					]
		});
		
		oMatrix.setModel(oController._MilitaryJSonModel);
		oMatrix.bindElement("/Data");
		
		return oMatrix;
	}
});
