sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_04", {
	/** 세액감면 및 세액공제 - 신용카드 등 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "300px", "40%"],
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
						// height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "신용카드 등 사용금액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 7
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "㉮ 신용카드"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P088103", "03");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									//  content : [new sap.m.Input(oController.PAGEID + "_Crdcd", {
									// 				 editable : false,
									// 				 value : "{Crdcd}",
									// 				 textAlign : "End"
									// 			}).addStyleClass("FontFamily")],
									 content : [
										new sap.ui.commons.layout.MatrixLayout({
											columns : 2,
											width : "100%",
											widths : ["", ""],
											rows : [new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "3월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CrdcdM", {
																				   value : "{CrdcdM}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
												    new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "4월~7월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CrdcdA", {
																				   value : "{CrdcdA}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
													new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "그 외"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CrdcdO", {
																				   value : "{CrdcdO}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData")]		
													})]
										})
									 ],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										 		new sap.m.Text({
													text : "• 신용카드를 사용하여 그 대가를 지급하는 금액"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 근로자가 본인 또는 기본공제대상자(나이제한없음)를 위하여 지출한 신용카드 등 사용금액은 총급여액의 25%를 초과할 경우 아래의 공제율로 적용"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span class='FontFamily colorRed'>• 공제율 : 결제 월별 차등 적용 → 2020년 한시적 공제율 차등 상향</span>"
												}),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.ui.commons.layout.MatrixLayout({
													columns : 4,
													width : "100%",
													widths : ["50%", "", "", ""],
													rows : [new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "구분"})],
																			 hAlign : "Center",
																			 vAlign : "Middle",
																			 rowSpan : 2	
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "공제율"})],
																			hAlign : "Center",
																			vAlign : "Middle",
																			colSpan: 3
																		}).addStyleClass("Label3")]
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "3월"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "4~7월"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Label3"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "그 외"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Label3")]
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "신용카드"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "30%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "80%"})],
																			hAlign : "Center",
																			vAlign : "Middle",
																			rowSpan : 4
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
																			 content : [new sap.m.Text({text : "현금영수증,체크카드 등"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "60%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "30%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2")]
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "도서,공연,미술관 등*"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "60%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "30%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2")]
															}),
															new sap.ui.commons.layout.MatrixLayoutRow({
																height : "30px",
																cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			 content : [new sap.m.Text({text : "전통시장,대중교통"})],
																			 hAlign : "Center",
																			 vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "80%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2"),
																		 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : [new sap.m.Text({text : "40%"})],
																			hAlign : "Center",
																			vAlign : "Middle"
																		 }).addStyleClass("Data2")]
															})]
												}),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "• 공제율"
												// }).addStyleClass("FontFamily"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "- 신용카드 : 15%"
												// }).addStyleClass("FontFamily PaddingLeft5"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "- 직불카드 등, 현금영수증 : 30%"
												// }).addStyleClass("FontFamily PaddingLeft5"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.Text({
												// 	text : "- 전통시장, 대중교통 사용분 : 40%"
												// }).addStyleClass("FontFamily PaddingLeft5"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.FormattedText({
												// 	htmlText : "<span style='color:#32363A' class='FontFamily PaddingLeft5'>- 도서, 공연, </span>" + 
												// 			   "<span class='FontFamily colorRed'>박물관, 미술관 : 30% (박물관, 미술관은 2019년 7월 1일 이후 사용분부터 가능)<span>"
												// }),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "* 총 급여 7천만원 이하자만 적용"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도 : 총급여수준별로 차등적용 → 2020년 한시적 소득공제 한도 30만원 상향"
												}).addStyleClass("FontFamily colorRed"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 7천만원 이하 : MIN(총급여의 20%, 330만원)"
												}).addStyleClass("FontFamily PaddingLeft5 colorRed"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 7천만원 초과 ~ 1억2천만원 이하 : 280만원"
												}).addStyleClass("FontFamily PaddingLeft5 colorRed"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 1억2천만원 초과 : 230만원"
												}).addStyleClass("FontFamily PaddingLeft5 colorRed"),
												// new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												// new sap.m.FormattedText({
												// 	htmlText : "<span style='color:#32363A' class='FontFamily PaddingLeft5'>* 공제한도 초과금액이 있는 경우 전통시장, 대중교통, 도서, 공연, </span>" +
												// 			   "<span class='FontFamily colorRed'>박물관, 미술관</span>" +
												// 			   "<span style='color:#32363A' class='FontFamily'> 사용분은 각 100만원 추가공제(최대 300만원)</span>"
												// })
											],
									 hAlign : "Begin",
									 vAlign : "Top",
									 rowSpan : 7
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "㉯ 현금영수증\n(전통시장/대중교통 제외)", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5"),
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
														 oController.onPressOpenSubty(oEvent, "P088104", "04");
													}
												}).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									//  content : [new sap.m.Input(oController.PAGEID + "_Cashe", {
									// 				 editable : false,
									// 				 value : "{Cashe}",
									// 				 textAlign : "End"
									// 			}).addStyleClass("FontFamily")],
									 content : [
										new sap.ui.commons.layout.MatrixLayout({
											columns : 2,
											width : "100%",
											widths : ["", ""],
											rows : [new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "3월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CasheM", {
																				   value : "{CasheM}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
												    new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "4월~7월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CasheA", {
																				   value : "{CasheA}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
													new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "그 외"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_CasheO", {
																				   value : "{CasheO}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData")]		
													})]
										})
									 ],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉰ 직불카드 등\n(전통시장/대중교통 제외)", textAlign : "Center"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P088106", "06");
													 }
												}).addStyleClass("button-light")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									//   content : [new sap.m.Input(oController.PAGEID + "_Dbtcd", {
									// 				editable : false,
									// 				value : "{Dbtcd}",
									// 				textAlign : "End"
									// 			}).addStyleClass("FontFamily")],
									  content : [
										new sap.ui.commons.layout.MatrixLayout({
											columns : 2,
											width : "100%",
											widths : ["", ""],
											rows : [new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "3월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_DbtcdM", {
																				   value : "{DbtcdM}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
												    new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "4월~7월"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right border_bottom"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_DbtcdA", {
																				   value : "{DbtcdA}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData border_bottom")]		
													}),
													new sap.ui.commons.layout.MatrixLayoutRow({
														cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																	 content : [new sap.m.Text({text : "그 외"})],
																	 hAlign : "Center",
																	 vAlign : "Middle"	
																 }).addStyleClass("PeriodData border_right"),
																 new sap.ui.commons.layout.MatrixLayoutCell({
																	content : [new sap.m.Input(oController.PAGEID + "_DbtcdO", {
																				   value : "{DbtcdO}", editable : false, textAlign : "End"
																			   })],
																	hAlign : "Center",
																	vAlign : "Middle"	
																}).addStyleClass("PeriodData")]		
													})]
										})
									  ],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉱ 제로페이\n(전통시장/대중교통 제외)", textAlign : "Center"}).addStyleClass("FontFamily")],
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
															 oController.onPressOpenSubty(oEvent, "P088107", "07");
														 }
													}).addStyleClass("button-light")],
										  hAlign : "Center",
										  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									//    content : [new sap.m.Input({
									// 				   value : "{Eopyg}",
									// 				   editable : false,
									// 				   textAlign : "End"
									// 			  }).addStyleClass("FontFamily")],
									   content : [
											new sap.ui.commons.layout.MatrixLayout({
												columns : 2,
												width : "100%",
												widths : ["", ""],
												rows : [new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "3월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_EropyM", {
																					value : "{EropyM}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "4월~7월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_EropyA", {
																					value : "{EropyA}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "그 외"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_EropyO", {
																					value : "{EropyO}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData")]		
														})]
											})
									   ],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						//   height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉲ 전통시장 사용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									//    content : [new sap.m.Input(oController.PAGEID + "_Trdmk", {
									// 				   value : "{Trdmk}",
									// 				   editable : false,
									// 				   textAlign : "End"
									// 			  }).addStyleClass("FontFamily")],
									   content : [
											new sap.ui.commons.layout.MatrixLayout({
												columns : 2,
												width : "100%",
												widths : ["", ""],
												rows : [new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "3월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_TrdmkM", {
																					value : "{TrdmkM}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "4월~7월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_TrdmkA", {
																					value : "{TrdmkA}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "그 외"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_TrdmkO", {
																					value : "{TrdmkO}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData")]		
														})]
											})
									   ],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						//   height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉳ 대중교통 이용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									//    content : [new sap.m.Input(oController.PAGEID + "_Pubtr", {
									// 				   value : "{Pubtr}",
									// 				   editable : false,
									// 				   textAlign : "End"
									// 			  }).addStyleClass("FontFamily")],
									   content : [
											new sap.ui.commons.layout.MatrixLayout({
												columns : 2,
												width : "100%",
												widths : ["", ""],
												rows : [new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "3월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_PubtrM", {
																					value : "{PubtrM}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "4월~7월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_PubtrA", {
																					value : "{PubtrA}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "그 외"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_PubtrO", {
																					value : "{PubtrO}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData")]		
														})]
											})
									   ],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						//   height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉴ 도서공연 사용금액"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									//    content : [new sap.m.Input(oController.PAGEID + "_Bkspf", {
									// 				   value : "{Bkspf}",
									// 				   editable : false,
									// 				   textAlign : "End"
									// 			  }).addStyleClass("FontFamily")],
									   content : [
											new sap.ui.commons.layout.MatrixLayout({
												columns : 2,
												width : "100%",
												widths : ["", ""],
												rows : [new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "3월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_BkspfM", {
																					value : "{BkspfM}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "4월~7월"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right border_bottom"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_BkspfA", {
																					value : "{BkspfA}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_bottom")]		
														}),
														new sap.ui.commons.layout.MatrixLayoutRow({
															cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Text({text : "그 외"})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData border_right"),
																	new sap.ui.commons.layout.MatrixLayoutCell({
																		content : [new sap.m.Input(oController.PAGEID + "_BkspfO", {
																					value : "{BkspfO}", editable : false, textAlign : "End"
																				})],
																		hAlign : "Center",
																		vAlign : "Middle"	
																	}).addStyleClass("PeriodData")]		
														})]
											})
									   ],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					})]
		});
		
		return oMatrix;
	}

});
