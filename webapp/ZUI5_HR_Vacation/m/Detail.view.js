$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_Vacation.m.Detail", {
	
	getControllerName: function() {
		return "ZUI5_HR_Vacation.m.Detail";
	},

	createContent: function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["105px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48014")})], // 근태코드
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.ComboBox(oController.PAGEID + "_Awart", {
											 	 	selectedKey : "{Awart}",
											 	 	value : "{Atext}",
											 	 	width : "65%",
											 	 	change : oController.onChangeAwart,
											 	 	editable : {
											 	 		path : "Status1",
				                               	   		formatter : function(fVal){
				                               	   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
				                               	   		}
											 	 	}
											 	}),
											 	new sap.m.ComboBox({
											 	 	selectedKey : "{Half}",
											 	 	width : "35%",
											 	 	items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_48048")}),  // 오전
											 	 			 new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_48049")})], // 오후
											 	 	editable : {
											 	 		parts : [{path : "Status1"}, {path : "Halfc"}],
				                               	   		formatter : function(fVal1, fVal2){
				                               	   			if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
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
											 	 	// change : oController.onChangeHalf
											 	}).addStyleClass("pl-3px")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48021")})], // 근태기간
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.HBox({
											 	 	items : [new sap.m.DatePicker({
															     valueFormat : "yyyy-MM-dd",
													             displayFormat : gDtfmt,
													             value : "{Begda}",
															     width : "100%",
															     textAlign : "Begin",
															     change : oController.onChangeDate,
														 	     editable : {
														 	 		path : "Status1",
							                               	   		formatter : function(fVal){
							                               	   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
							                               	   		}
														 	     }
														     }),
														     new sap.ui.core.HTML({content : "<div style='width:3px'/>"}),
														     new sap.m.DatePicker({
															     valueFormat : "yyyy-MM-dd",
													             displayFormat : gDtfmt,
													             value : "{Endda}",
															     width : "100%",
															     textAlign : "Begin",
															     change : oController.onChangeDate,
														 	     editable : {
														 	 		path : "Status1",
							                               	   		formatter : function(fVal){
							                               	   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
							                               	   		}
														 	    }
														     })]
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48050")})], // 근태시간
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.HBox({
											 	 	items : [new sap.m.TimePicker({
																 valueFormat : "HHmm",
																 displayFormat : "HH:mm",
													             value : "{Beguz}",
													             minutesStep : 5,
													             //width : "95px",
													             textAlign : "Begin",
													             change : oController.onChangeTime2,
													             editable : {
													             	parts : [{path : "Status1"}, {path : "Halfc"}],
													             	formatter : function(fVal1, fVal2){
													             		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
													             			return (fVal2 && fVal2 == "X") ? true : false;
													             		} else {
													             			return false;
													             		}
													             	}
													             }
														     }),
														     new sap.ui.core.HTML({content : "<div style='width:3px' />"}),
														     new sap.m.TimePicker({
																 valueFormat : "HHmm",
																 displayFormat : "HH:mm",
													             value : "{Enduz}",
													             minutesStep : 5,
													             //width : "95px",
													             textAlign : "Begin",
													             change : oController.onChangeTime2,
													             editable : {
													             	parts : [{path : "Status1"}, {path : "Halfc"}],
													             	formatter : function(fVal1, fVal2){
													             		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
													             			return (fVal2 && fVal2 == "X") ? true : false;
													             		} else {
													             			return false;
													             		}
													             	}
													             }
														     }),
														     new sap.m.Text({
														    	 text : "({EAbshr}:{EAbsmm})",
														    	 visible : {
														    	 	parts : [{path : "EAbshr"}, {path : "EAbsmm"}],
														    	 	formatter : function(fVal1, fVal2){
														    	 		return (fVal1 && fVal2 && fVal1 != "" && fVal2 != "") ? true : false;
														    	 	}
														    	 }
														     }).addStyleClass("pl-2px pt-3px")]
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48017")})], // 휴가일수
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
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
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48018")})], // 휴일일수
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
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
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48051")})], // 경조일수
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
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
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48019"), required : true})], // 연락처
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
											 	 	value : "{Telnum}",
											 	 	width : "100%",
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_LEAVE_APPL_SRV", "VacationApplyTab1", "Telnum"),
											 	 	editable : {
											 	 		path : "Status1",
											 	 		formatter : function(fVal){
											 	 			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
											 	 		}
											 	 	}
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
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
												 	required : true
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
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
											 	 			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
											 	 		}
											 	 	}
											 	}),
											 	new sap.m.ComboBox(oController.PAGEID + "_Encard", {
											 		selectedKey : "{Encard}",
											 		width : "30%",
											 	 	editable : {
											 	 		path : "Status1",
											 	 		formatter : function(fVal){
											 	 			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
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
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_48022")})], // 근태사유
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input({
												    value : "{Bigo}",
												    width : "100%",
												    maxLength : common.Common.getODataPropertyLength("ZHR_LEAVE_APPL_SRV", "VacationApplyTab1", "Bigo"),
												    editable : {
												   		path : "Status1",
												   		formatter : function(fVal){
												   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
												   		}
												    }
											    })],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_AppNameRow", {
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_48066}", required : true})], // 결재자
									 hAlign : "Begin",
									 vAlign : "Middle"
								}),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.ComboBox(oController.PAGEID + "_AppName", {
												   selectedKey : "{AppName}",
												   width : "100%",
												   editable : {
												   		path : "Status1",
												   		formatter : function(fVal){
												   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
												   		}
												   }
											   })],
									hAlign : "Begin",
									vAlign : "Middle"
								})]
					}).addStyleClass("displayNone"),					
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_MessageRow", {
						// height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 // ※ 자녀출생의 경우 출산일을 반드시 기입하여 주시기 바랍니다.
									 content : [new sap.m.Text({text : oBundleText.getText("MSG_48003")}).addStyleClass("font-bold font-13px color-red")], 
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 }).addStyleClass("pl-10px pr-10px")]
					}).addStyleClass("displayNone")]
		});
		
        var oLayout1 = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.FlexBox({
						justifyContent : "SpaceBetween",
						items : [new sap.m.Label({
				                     text: oBundleText.getText("LABEL_48001"), // 근태신청
				                     design: "Bold"
				                 }).addStyleClass("sub-title"),
				                 new sap.m.HBox({
				                 	 items : [new sap.m.Button({
									 	 	      text : oBundleText.getText("LABEL_48015"), // 근무일정
									 	 	      press : oController.onPressSchedule
									 	      }).addStyleClass("button-light pt-3px pl-5px"),
							                  new sap.m.Button({
			                               	      text : oBundleText.getText("LABEL_48023"), // 계산
			                               	      visible : {
			                               	   		path : "Status1",
			                               	   		formatter : function(fVal){
			                               	   			return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
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
			                                  }).addStyleClass("button-default pt-3px pl-5px")]
				                 })]
					}).addStyleClass("info-box"),
	                oMatrix]
        });
		
        // 대근신청
		var oTable2 = new sap.m.Table(oController.PAGEID + "_Table2", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: false,
			mode: "None",
            columns: [
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "Begin"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    cells: [
                    	new sap.m.VBox({
                        	width : "100%",
                        	items : [new sap.m.HBox({
		                        		 items : [new sap.m.Text({ // 일자
						                              textAlign: "Begin",
						                              text : {
														 parts : [{path : "Datum"}, {path : "Offck"}],
														 formatter : function(fVal1, fVal2){
														 	this.removeStyleClass("color-red font-bold");
														 	if(fVal2 && fVal2 == "X"){
														 		this.addStyleClass("color-red font-bold");
														 	}
														 	
														 	if(fVal1){
														 		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
														 		return dateFormat.format(fVal1);
														 	} else {
														 		return "";
														 	}
														 }
													 }
						                         }).addStyleClass("pb-5px")]
		                        	 }),
			                         new sap.m.HBox({
			                         	 items : [new sap.m.Text({ // 계
						                         	  text : "{Wtsum}"
						                          }).addStyleClass("pb-5px")]
			                         }),
			                         new sap.m.HBox({
	                                 	 items : [new sap.m.Text({ // 한도체크
						                         	  text : "{LigbnTx}"
						                          }).addStyleClass("pb-5px")]
	                                 })]
                        }),
                        new sap.m.VBox({
                        	width : "100%",
                        	items : [new sap.m.HBox({
		                        		 items : [new sap.m.Input({ // 대근자
				                                      width: "100%",
				                                      value: "{Awtxt}",
				                                      showValueHelp: true,
				                                      valueHelpOnly: true,
				                                      valueHelpRequest: function(oEvent){
				                                    		oController.searchOrgehPernr(oEvent, "X");
				                                      },
				                                      customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
				                                      editable : {
				                                      	  parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
				                                      	  formatter : function(fVal1, fVal2, fVal3){
				                                      	  	if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
				                                      	  		if(fVal2 == "1" || fVal2 == "2"){
				                                      	  			return true;
				                                      	  		} else if(fVal3 == "X"){
				                                      	  			return true;
				                                      	  		} else {
				                                      	  			return false;
				                                      	  		}
				                                      	  	} else {
				                                      	  		return false;
				                                      	  	}
				                                      	  }
				                                      }
				                                })]
		                        	 }),
	                                 new sap.m.HBox({
		                        		 items : [new sap.m.TimePicker({
													  valueFormat : "HHmm",
													  displayFormat : "HH:mm",
											          value : "{Beguz}",
											          minutesStep : 10,
											          width : "100%", 
											          textAlign : "Begin",
					                                  editable : {
					                                   	parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
					                                   	formatter : function(fVal1, fVal2, fVal3){
					                                   		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
					                                   			if(fVal2 == "1" || fVal2 == "2"){
					                                   				return true;
					                                   			} else if(fVal3 == "X"){
					                                   				return true;
					                                   			} else {
					                                   				return false;
					                                   			}
					                                   		} else {
					                                   			return false;
					                                   		}
					                                   	}
					                                  },
					                                  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
					                                  change : oController.onChangeTime
												  }),
												  new sap.ui.core.HTML({content : "<div style='width:3px'/>"}),
												  new sap.m.TimePicker({
													  valueFormat : "HHmm",
													  displayFormat : "HH:mm",
											          value : "{Enduz}",
											          minutesStep : 10,
											          width : "100%", 
											          textAlign : "Begin",
					                                  editable : {
					                                   	parts : [{path : "Status1"}, {path : "Cntgb"}, {path : "Flag"}],
					                                   	formatter : function(fVal1, fVal2, fVal3){
					                                   		if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
					                                   			if(fVal2 == "1" || fVal2 == "2"){
					                                   				return true;
					                                   			} else if(fVal3 == "X"){
					                                   				return true;
					                                   			} else {
					                                   				return false;
					                                   			}
					                                   		} else {
					                                   			return false;
					                                   		}
					                                   	}
					                                  },
					                                  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
					                                  change : oController.onChangeTime
												  })]
		                        	 }),
		                        	 new sap.m.HBox({
		                        	 	 items : [new sap.m.ComboBox({
													  selectedKey : "{Cntgb}",
													  width : "100%",
													  editable : {
													  	 parts : [{path : "Status1"}, {path : "Flag"}],
													  	 formatter : function(fVal1, fVal2){
													  	 	if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
													  	 		return fVal2 == "A" ? true : false;
													  	 	} else {
													  	 		return false;
													  	 	}
													  	 }
													  },
													  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
													  change : oController.onChangeCntgb,
													  items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_48042")}), // 1명
													  		   new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_48043")}), // 2명
													  		   new sap.ui.core.Item({key : "0", text : oBundleText.getText("LABEL_48044")})] // 없음
												 })]
		                        	 })]
                        })
                    ]
                })
            }
        });
        
        oTable2.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout2 = new sap.m.VBox({
			fitContainer: true,
			visible : "{Panel2Visible}",
			items: [new sap.m.FlexBox({
						justifyContent : "SpaceBetween",
						items : [new sap.m.Label({
				                     text: oBundleText.getText("LABEL_48024"), // 대근신청
				                     design: "Bold"
				                 }).addStyleClass("sub-title"),
				                 new sap.m.Button({
									 text : oBundleText.getText("LABEL_48033"), // 한도체크
									 visible : {
										path : "Status1",
										formatter : function(fVal){
											return (fVal == "" || fVal == "AA" || fVal == "JJ") ? true : false;
										}
									 },
									 press : oController.onPressVacationCover
								 }).addStyleClass("button-light")]
					}).addStyleClass("info-box"),
	                oTable2]
        });
        
		// 휴가쿼터
        var oTable3 = new sap.m.Table(oController.PAGEID + "_Table3", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: false,
			// growingThreshold: 5,
			mode: "None",
            columns: [
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "End"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    cells: [
                        new sap.m.VBox({
                        	items : [new sap.m.Text({ // 쿼터명
			                             textAlign: "Begin",
			                             text: "{Ktext}"
			                         })]
                        }),
                        new sap.m.VBox({
                        	items : [new sap.m.Text({ // 발생/사용/잔여
			                             textAlign: "Begin",
			                             text: {
			                            	parts : [{path : "Anzhl"}, {path : "Kverb"}, {path : "Reman"}],
			                            	formatter : function(fVal1, fVal2, fVal3){
			                            		return  oBundleText.getText("LABEL_69023") + " " + parseFloat(fVal1) + " / " +
			                            				oBundleText.getText("LABEL_69024") + " " + parseFloat(fVal2) + " / " +
			                            				oBundleText.getText("LABEL_69025") + " " + parseFloat(fVal3)
			                            	}
			                             }
			                         })]
                        })
                    ]
                })
            }
        });
        
        oTable3.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout3 = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.FlexBox({
						items : [new sap.m.Label({
				                     text: oBundleText.getText("LABEL_48025"), // 휴가쿼터
				                     design: "Bold"
				                 }).addStyleClass("sub-title")]
					}).addStyleClass("info-box"),
	                oTable3]
        });
        
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
						showNavButton: true,
						navBackFunc: oController.onBack,
						title : {
							parts : [{path : "Status1"}, {path : "Delapp"}, {path : "Flag"}],
							formatter : function(fVal1, fVal2, fVal3){
								if(fVal3 && fVal3 == "D"){
									return oBundleText.getText("LABEL_48064"); // 근태 삭제신청
								} else {
									if(fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ"){
										return oBundleText.getText("LABEL_48013"); // 근태신청 신규등록
									} else {
										if(fVal2 == ""){
											return oBundleText.getText("LABEL_48006") + " " + oBundleText.getText("LABEL_48045") + " " + oBundleText.getText("LABEL_48055"); // 근태 신규신청 조회
										} else {
											return oBundleText.getText("LABEL_48006") + " " + oBundleText.getText("LABEL_48046") + " " + oBundleText.getText("LABEL_48055"); // 근태 삭제신청 조회
										}
									}
								}
							}
						},
						headerButton : new sap.m.HBox({
										   items : [new sap.m.Button({
													   	text: oBundleText.getText("LABEL_00152"), // 신청
													   	press : function(oEvent){
											 	 			oController.onPressSave(oEvent, "C");
											 	 		},
													   	visible : {
													   		parts : [{path : "Status1"}, {path : "Flag"}, {path : "Delapp"}, {path : "ListStatus"}],
											 	 			formatter : function(fVal1, fVal2, fVal3, fVal4){
											 	 				if(fVal2 && fVal2 == "D"){
											 	 					return true;
											 	 				} else if(fVal3 != ""){
											 	 					return (fVal4 == "" || fVal4 == "AA" || fVal4 == "JJ") ? true : false;	
											 	 				} else {
											 	 					return (fVal1 == "" || fVal1 == "AA" || fVal1 == "JJ") ? true : false;
											 	 				}
											 	 			}
													   	}
													}).addStyleClass("button-dark"),
													new sap.m.Button({
											 	 		text : oBundleText.getText("LABEL_00103"), // 삭제
											 	 		visible : {
											 	 			path : "Status1",
											 	 			parts : [{path : "Status1"}, {path : "Delapp"}, {path : "ListStatus"}],
											 	 			formatter : function(fVal, fVal2, fVal3){
											 	 				if(fVal2 && fVal2 != ""){
											 	 					return (fVal3 == "AA" || fVal3 == "JJ") ? true : false;
											 	 				} else {
											 	 					return (fVal == "AA" || fVal == "JJ") ? true : false;
											 	 				}
											 	 			}
											 	 		},
											 	 		press : function(oEvent){
											 	 			oController.onPressSave(oEvent, "D");
											 	 		}
											 		}).addStyleClass("button-default")]
									   }).addStyleClass("app-nav-button-right"),
						contentStyleClass: "sub-app-content",
                		contentContainerStyleClass: "app-content-container-mobile custom-title-left",
			            contentItems: [new sap.m.VBox({
							               items : [oLayout1, oLayout2, oLayout3]
							           }).addStyleClass("vbox-form-mobile")]
			        });
			        
		oPage.setModel(oController._DetailJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});