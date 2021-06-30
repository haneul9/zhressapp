sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_09", {
	/** 세액감면 및 세액공제 - 퇴직연금 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "150px", "40%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "항목"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "구분"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "내역입력"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "금액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "항목별 요약설명 및 공제조건"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "세액공제"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 2
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "퇴직연금"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Button({
													 text : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 if(fVal1 == "1" && fVal2 == "1") 
																 return "입력";
															 else 
																 return "조회";
														 }
													 },
													 type : "Default",
													 press : function(oEvent){
														 oController.onPressOpenSubty(oEvent, "P0881E1", "E1");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Retpe", {
													 editable : false,
													 value : "{Retpe}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										 		new sap.m.Text({
													text : "• 퇴직연금 :근로자퇴직급여보장법에 따른 확정기여형퇴직연금(DC), 개인형퇴직연금(IRP)에 납입한 금액(회사부담액 제외)" + 
														   "\n과학기술인공제회법에 따른 과학기술인연금에 납입한 금액"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 연금저축 : 연금저축에 납입한 보험료(2001.1.1 이후 가입분)"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span class='FontFamily colorRed'>• 공제율 및 공제한도 : 만 50세 이상 연금계좌세액공제 한도 확대</span>"
												}),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.ui.commons.layout.MatrixLayout({
													columns : 4,
													width : "100%",
													widths : ["", "30%", "30%", ""],
													rows : [new sap.ui.commons.layout.MatrixLayoutRow({
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "총급여액"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "만 50세 미만\n세액공제대상 납입한도", textAlign : "Center"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "만 50세 이상\n세액공제대상 납입한도", textAlign : "Center"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "공제율"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Label3")]	
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "5.5천만원 이하"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "400만원\n(퇴직연금 포함 연 700만원)", textAlign : "Center"})],
																			 hAlign : "Center",
																			 vAlign : "Middle",
																			 rowSpan : 2
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "600만원\n(퇴직연금 포함 연 900만원)", textAlign : "Center"}).addStyleClass("colorRed")],
																			 hAlign : "Center",
																			 vAlign : "Middle",
																			 rowSpan : 2
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "15%"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Data2")]	
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "1.2억원 이하"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "12%"})],
																			 hAlign : "Center",
																			 vAlign : "Middle",
																			 rowSpan : 2	
																		 }).addStyleClass("Data2")]	
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "1.2억원 초과"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"	
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "300만원 (퇴직연금 포함 연 700만원)", textAlign : "Center"})],
																			 hAlign : "Center",
																			 vAlign : "Middle",
																			 colSpan : 2
																		 }).addStyleClass("Data2")]	
															})]
												})
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "• 납입액의 12% 세액공제(총 급여액이 5500만원 이하는 15%)"
												// }).addStyleClass("FontFamily"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "• 공제한도 : 퇴직연금 + 연금저축 = 연 700만원"
												// }),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "(단, 연금저축은 1억 2천만원 이하자는 400만원, 초과자는 300만원 공제한도 적용)"
												// }).addStyleClass("FontFamily PaddingLeft5")
										],
									 hAlign : "Begin",
									 vAlign : "Top",
									 rowSpan : 2
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						// height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "연금저축"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Button({
													 text : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 if(fVal1 == "1" && fVal2 == "1") 
																 return "입력";
															 else 
																 return "조회";
														 }
													 },
													 type : "Default",
													 press : function(oEvent){
														 oController.onPressOpenSubty(oEvent, "P0881E202", "E2");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fpern", {
													 value : "{Fpern}",
													 editable : false,
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					})]
		});
		
		return oMatrix;
	}

});
