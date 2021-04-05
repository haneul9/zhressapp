sap.ui.jsfragment("fragment.EmpProfile", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) { 
		jQuery.sap.require("common.SearchEmpProfile");
		jQuery.sap.require("common.JSONModelHelper");
		jQuery.sap.require("common.makeTable");
		jQuery.sap.includeStyleSheet("css/dashboard.css");
		 
		common.SearchEmpProfile.oController = oController;
		
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
																		   	   				 new sap.m.Text({text : "{title}"}).addStyleClass("Font15 paddingLeft5 paddingTop3")]
																		   	  }).addStyleClass("paddingTop3"),
															   				  new sap.m.Text({text : "{department} / {custom01}"}).addStyleClass("info2")]
															   }).addStyleClass("paddingLeft10 paddingTop3")]
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText(common.SearchEmpProfile.PAGEID + "_Status", {
											 	 	width: "42px", 
											 	 	height: "42px",
											 	 	htmlText: "<em>Loading</em>"
											 	 }).addStyleClass("spinner-evalresult")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.commons.layout.MatrixLayout({
													columns : 5,
													width : "100%",
													widths : ["", "", "", "", ""],
													rows : [new sap.ui.commons.layout.MatrixLayoutRow({
													 			height : "35px",
															 	cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	 content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18002")}).addStyleClass("FontFamily")], // 그룹 입사일자
																	 	 	 hAlign : "Center",
																	 	 	 vAlign : "Middle"
																	 	 }).addStyleClass("Label"),
																	 	 new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	 content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18003")}).addStyleClass("FontFamily")], // 그룹 근속년수
																	 	 	 hAlign : "Center", 
																	 	 	 vAlign : "Middle"
																	 	 }).addStyleClass("Label"),
																	 	 new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	 content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18004")}).addStyleClass("FontFamily")], // 자사 입사일자
																	 	  	 hAlign : "Center", 
																	 	  	 vAlign : "Middle"
																	 	 }).addStyleClass("Label"),
																	 	 new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	 content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18005")}).addStyleClass("FontFamily")], // 자사 근속년수
																	 	  	 hAlign : "Center", 
																	 	  	 vAlign : "Middle"
																	 	 }).addStyleClass("Label"),
																	 	 new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	 content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18006")}).addStyleClass("FontFamily")], // 입사구분
																	 	  	 hAlign : "Center", 
																	 	  	 vAlign : "Middle"
																	 	 }).addStyleClass("Label")]
															 }),
															 new sap.ui.commons.layout.MatrixLayoutRow({
															 	 height : "35px",
															 	 cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : "{Gentd}"}).addStyleClass("FontFamily")],
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Data"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : "{Gdura}"}).addStyleClass("FontFamily")],
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Data"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : "{Jentd}"}).addStyleClass("FontFamily")],
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Data"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : "{Jdura}"}).addStyleClass("FontFamily")],
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Data"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : "{Enttp}"}).addStyleClass("FontFamily")],
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Data")]
															 }),
															 new sap.ui.commons.layout.MatrixLayoutRow({
															 	 height : "35px",
															 	 cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 	 	  content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18015")}).addStyleClass("FontFamily")], // Grade
																	 	 	  hAlign : "Center",
																	 	 	  vAlign : "Middle"
																	 	  }).addStyleClass("Label"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	  content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18016")}).addStyleClass("FontFamily")], // 최종승진일
																	 	  	  hAlign : "Center",
																	 	  	  vAlign : "Middle"
																	 	  }).addStyleClass("Label"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	  content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18017")}).addStyleClass("FontFamily")], // 직급체류기간
																	 	  	  hAlign : "Center",
																	 	  	  vAlign : "Middle"
																	 	  }).addStyleClass("Label"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	  content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18018")}).addStyleClass("FontFamily")], // 생년월일
																	 	  	  hAlign : "Center",
																	 	  	  vAlign : "Middle"
																	 	  }).addStyleClass("Label"),
																	 	  new sap.ui.commons.layout.MatrixLayoutCell({
																	 	  	  content : [new sap.m.Text({text : common.SearchEmpProfile.oBundleText.getText("LABEL_18019")}).addStyleClass("FontFamily")], // 결혼여부
																	 	  	  hAlign : "Center",
																	 	  	  vAlign : "Middle"
																	 	  }).addStyleClass("Label")]
															 }),
															 new sap.ui.commons.layout.MatrixLayoutRow({
															 	 height : "35px",
															 	 cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		 	  content : [new sap.m.Text({text : "{Grade}"}).addStyleClass("FontFamily")],
																		 	  hAlign : "Center",
																		 	  vAlign : "Middle"
																		  }).addStyleClass("Data"),
																		  new sap.ui.commons.layout.MatrixLayoutCell({
																		 	  content : [new sap.m.Text({text : "{Aprdt}"}).addStyleClass("FontFamily")],
																		 	  hAlign : "Center",
																		 	  vAlign : "Middle"
																		  }).addStyleClass("Data"),
																		  new sap.ui.commons.layout.MatrixLayoutCell({
																		 	  content : [new sap.m.Text({text : "{Jkdur}"}).addStyleClass("FontFamily")],
																		 	  hAlign : "Center",
																		 	  vAlign : "Middle"
																		  }).addStyleClass("Data"),
																		  new sap.ui.commons.layout.MatrixLayoutCell({
																		 	  content : [new sap.m.Text({text : "{Ages}"}).addStyleClass("FontFamily")],
																		 	  hAlign : "Center",
																		 	  vAlign : "Middle"
																		  }).addStyleClass("Data"),
																		  new sap.ui.commons.layout.MatrixLayoutCell({
																		 	  content : [new sap.m.Text({text : "{Fatxt}"}).addStyleClass("FontFamily")],
																		 	  hAlign : "Center",
																		 	  vAlign : "Middle"
																		  }).addStyleClass("Data")]
															 })]
												 })],
									 colSpan : 3
								 })]
					})]
		});
		
		oHeader.setModel(common.SearchEmpProfile._JSONModel);
		oHeader.bindElement("/Data");

		common.SearchEmpProfile._StatusMessage = new sap.m.MessagePopover({
													 placement : "Bottom",
													 items : {
												 		 path : "/Data",
												 	 	 template : new sap.m.MessageItem({type : "{Type}", title : "{Text}"})
													 }
												 }).addStyleClass("sapUiSizeCompact");
		common.SearchEmpProfile._StatusMessage.setModel(common.SearchEmpProfile._MessageJSONModel);
		
		var oSectionLayout = new sap.uxap.ObjectPageLayout(common.SearchEmpProfile.PAGEID + "_ObjectPageLayout", {
			enableLazyLoading : false,
			showTitleInHeaderContent : false,
			alwaysShowContentHeader : true,
			useIconTabBar :	false,
			headerContent : [oHeader],
			sections : [new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18007"), // 학력사항
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("1")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18008"), // 발령사항
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("2")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18009"), // 평가
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("3")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18010"), // 포상
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("4")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18011"), // 징계
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("5")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18012"), // 사외경력
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("6")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18013"), // 자격사항
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("7")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							showTitle : false,
							title : common.SearchEmpProfile.oBundleText.getText("LABEL_18014"), // 외국어
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEmpProfile.makeContent("8")]
										   })]
						})]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [oSectionLayout]
		});
		
		oLayout.addStyleClass("sapUiSizeCompact");
		
		var oDialog = new sap.m.Dialog({
			title : common.SearchEmpProfile.oBundleText.getText("LABEL_18001"), // 사원 프로파일
			contentWidth : "1500px",
			contentHeight : "1500px",
			content : [oLayout],
			beforeOpen : common.SearchEmpProfile.onBeforeOpen,
			afterOpen : common.SearchEmpProfile.onAfterOpen,
			endButton : [new sap.m.Button({
							 type : "Emphasized",
							 text : common.SearchEmpProfile.oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })]
		});
		
		oDialog.setModel(common.SearchEmpProfile._JSONModel);
		
		oDialog.addEventDelegate({
			onAfterRendering : function(){
				var isIE = (navigator.userAgent.toLowerCase().indexOf("trident") != -1) ? true : false;
				if(isIE == true){
					oSectionLayout.addStyleClass("custom_objectlayout2");
				}
			}
		});
		
		return oDialog; 
	}
});
