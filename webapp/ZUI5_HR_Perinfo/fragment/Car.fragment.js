sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Car", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		// 사용연료
		var oFuel = new sap.m.ComboBox({
						selectedKey : "{Fuel}",
		            	editable: {
						    path: "disyn",
							formatter: function(v) {
								if(v === "1") return true;
								else return false;
							}
		    	    	},
	    	    	    items : {
					 		path : "/Fuel",
					 		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
						} 
					});
		var oFuel2 = new sap.m.ComboBox({
						selectedKey : "{Fuel2}",
		            	editable: {
						    path: "disyn",
							formatter: function(v) {
								if(v === "1") return true;
								else return false;
							}
		    	    	},
		    	    	items : {
					 		path : "/Fuel",
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
												 	content : [new sap.m.Text({text : "{i18n>LABEL_37029}"}).addStyleClass("Font15 FontBold"), // 차량관리
												 			   new sap.m.ToolbarSpacer(),
												 			   new sap.m.Button({text : "{i18n>LABEL_37042}", // 신규
												 								visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}],
																						formatter : function(v1, v2, v3) {
																						if(v1 == "E" && v2 === "2" && v3 === "3" ) return true;
																						else return false;
																					}
																	    	     },
												 								press : function(){
																		 				oController._CarJSonModel.setProperty("/Data/disyn","1");				 	
												 								}}).addStyleClass("button-light"),
												 			   new sap.m.Button({text : "{i18n>LABEL_00102}", // 수정
												 							    visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}],
																						formatter : function(v1, v2, v3) {
																						if(v1 == "E" && v2 === "2" && v3 === "2") return true;
																						else return false;
																					}
																	    	     },
												 								press : function(){
																		 				oController._CarJSonModel.setProperty("/Data/disyn","1");				 	
												 								}}).addStyleClass("button-light"),
								 								new sap.m.Button({text : "{i18n>LABEL_08003}", // 삭제   	
								 												visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}, {path : "actmode"}],
																						formatter : function(v1, v2, v3) {
																						if(v1 == "E" && v2 === "2" && v3 === "2") return true;
																						else return false;
																					}
																	    	     }, 
												 								press : function(){
												 									oController.onSaveCar("D");
												 								}}).addStyleClass("button-light"),
								 								new sap.m.Button({text : "{i18n>LABEL_02152}", // 저장
								 												visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}],
																					formatter: function(v1, v2) {
																						if(v1 == "E" && v2 === "1") return true;
																						else return false;
																					}
																	    	     }, 
												 								 press : function(){
												 								 	oController.onSaveCar("A");
												 								 }}).addStyleClass("button-light"), 
												 				new sap.m.Button({text : "{i18n>LABEL_08004}", // 취소
												 								visible: {
																				    parts : [{path: "Auth"}, {path: "disyn"}],
																					formatter: function(v1, v2) {
																						if(v1 == "E" && v2 === "1") return true;
																						else return false;
																					}
																	    	     }, 
												 								 press : function(){
																		 				oController.onPressSearchCar();				 	
												 								 }}).addStyleClass("button-light"), 
												 			   
												 			   ] 
												}).addStyleClass("toolbarNoBottomLine h-40px"),
												new sap.ui.core.HTML({content : "<div style='height:5px' />"})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
												 	content : [new sap.m.Text({text : "{i18n>LABEL_37030}" }).addStyleClass("Font15")] // 기본차량 
												}).addStyleClass("toolbarNoBottomLine"),
												new sap.ui.core.HTML({content : "<div style='height:5px' />"})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37031}" })], // 차량 명
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	new sap.m.Input({
								 	 				value : "{Cartype}",
								 	 				width : "250px",
								 	 				maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Cartype"),
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
									 content : [new sap.m.Text({text : "{i18n>LABEL_37032}"})], // 차량번호
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
  								 	 		new sap.m.Toolbar({
  								 	 			height : "45px",
											 	content : [	new sap.m.Input({
								 	 				value : "{Carnum}",
								 	 				maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Carnum"),
								 	 				width : "250px",
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
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37033}" })], // OD지원
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	
											 		new sap.m.CheckBox({
									 	 				selected : "{Odsupport}",
									 	 				editable: false }),
									 	 			new sap.m.ToolbarSpacer({width:"20px" }),	
								 	 				new sap.m.Input({
									 	 				value : "{Odamount }",
									 	 				width : "250px",
									 	 				editable: false
								 					})
								 				] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37034}" })], // 주차증
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	
	 										 	 	new sap.m.CheckBox({
									 	 				selected : "{Parkticket}",
									 	 				editable: false
								 					})
								 				] 
											}).addStyleClass("toolbarNoBottomLine")
										],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37035}" })], // 배기량
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	  content : [
   								 	 		new sap.m.Toolbar({
   								 	 			height : "45px",
											 	content : [	
	 										 	 	new sap.m.Input({
								 	 					value : "{Bagirang}",
								 	 					width : "250px",
							 	 						maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Bagirang"),
								 	 					type : sap.m.InputType.Number,
								 	 					textAlign : sap.ui.core.TextAlign.End,
								 	 				    editable: {
														    path: "disyn",
															formatter: function(v) {
																if(v === "1") return true;
																else return false;
															}
										    	    	}
	 										 	 	}),
	 										 	 	new sap.m.Text({text : "CC"})
								 				] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37041}" })], // 사용연료
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
 								 	 		new sap.m.Toolbar({
 								 	 			height : "45px",
											 	content : [	oFuel ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37036}" })], // 하이브리드
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 	new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	
	 										 	 	new sap.m.CheckBox({
									 	 				selected : "{Hybrid}",
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
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.core.HTML({content : "<div style='height:5px' />"}),
									 			new sap.m.Toolbar({
									 				height : "45px",
												 	content : [new sap.m.Text({text : "{i18n>LABEL_37040}" }).addStyleClass("Font15")] // 추가차량 
												}).addStyleClass("toolbarNoBottomLine"),
												new sap.ui.core.HTML({content : "<div style='height:5px' />"})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text :"{i18n>LABEL_37031}" })], // 차량 명
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 		new sap.m.Toolbar({
								 	 			height : "45px",
											 	content : [	new sap.m.Input({
								 	 				value : "{Addcartype}",
								 	 				maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Addcartype"),
								 	 				width : "250px",
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
									 content : [new sap.m.Text({text : "{i18n>LABEL_37032}" })], // 차량번호
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
  								 	 		new sap.m.Toolbar({
  								 	 			height : "45px",
											 	content : [	new sap.m.Input({
								 	 				value : "{Addcarnum}",
							 	 					maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Addcarnum"),
								 	 				width : "250px",
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
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37035}"})], // 배기량
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	  content : [
   								 	 		new sap.m.Toolbar({
   								 	 			height : "45px",
											 	content : [	
	 										 	 	new sap.m.Input({
								 	 					value : "{Bagirang2}",
								 	 					maxLength : common.Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoCarmanagerTableIn", "Bagirang2"),
								 	 					width : "250px",
								 	 					type : sap.m.InputType.Number,
								 	 					textAlign : sap.ui.core.TextAlign.End,
								 	 				    editable: {
														    path: "disyn",
															formatter: function(v) {
																if(v === "1") return true;
																else return false;
															}
										    	    	}
	 										 	 	}),
	 										 	 	new sap.m.Text({text : "CC"})
								 				] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37041}" })], // 사용연료
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
							     new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
 								 	 		new sap.m.Toolbar({
 								 	 			height : "45px",
											 	content : [	oFuel2 ] 
											}).addStyleClass("toolbarNoBottomLine")
								 	 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37036}"})], // 하이브리드
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
								 	 	new sap.m.Toolbar({
								 	 		height : "45px",
											 	content : [	
	 										 	 	new sap.m.CheckBox({
									 	 				selected : "{Hybrid2}",
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
						cells : []
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_37037}"})], // 기타1
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
							 	 		new sap.m.Toolbar({
							 	 			height : "45px",
										 	content : [	
 										 	 	new sap.m.Input({
								 	 				 value : "{Etc1}",
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
									 content : [new sap.m.Text({text : "{i18n>LABEL_37038}"})], // 기타2
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
  							 	 		new sap.m.Toolbar({
  							 	 			height : "45px",
										 	content : [	
 										 	 	new sap.m.Input({
								 	 				 value : "{Etc2}",
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
									 content : [new sap.m.Text({text : "{i18n>LABEL_37039}" })], // 기타3
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [
  							 	 		new sap.m.Toolbar({
  							 	 			height : "45px",
										 	content : [	
 										 	 	new sap.m.Input({
								 	 				 value : "{Etc3}",
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
					})
					]
		});
		
		oMatrix.setModel(oController._CarJSonModel);
		oMatrix.bindElement("/Data");
		
		return oMatrix;
	}
});
