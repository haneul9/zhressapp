sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_04", {
	/** 세액감면 및 세액공제 - 신용카드 등 **/
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
									 content : [new sap.m.Input(oController.PAGEID + "_Crdcd", {
													 editable : false,
													 value : "{Crdcd}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• 신용카드를 사용하여 그 대가를 지급하는 금액"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 근로자가 본인 또는 기본공제대상자(나이제한없을)를 위하여 지출한 신용카드 등 사용금액은 총급여액의 25%를 초과할 경우 아래의 공제율로 적용"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제율"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 신용카드 : 15%"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 직불카드 등, 현금영수증 : 30%"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 전통시장, 대중교통 사용분 : 40%"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span style='color:#32363A' class='FontFamily PaddingLeft5'>- 도서, 공연, </span>" + 
															   "<span class='FontFamily colorRed'>박물관, 미술관 : 30% (박물관, 미술관은 2019년 7월 1일 이후 사용분부터 가능)<span>"
												}),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도 : 총급여수준별로 차등적용"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 7천만원 이하 : min(총급여의 20%, 300만원)"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 7천만원 초과 ~ 1억2천만원 이하 : 250만원"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 총급여 1억2천만원 초과 : 200만원"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span style='color:#32363A' class='FontFamily PaddingLeft5'>* 공제한도 초과금액이 있는 경우 전통시장, 대중교통, 도서, 공연, </span>" +
															   "<span class='FontFamily colorRed'>박물관, 미술관</span>" +
															   "<span style='color:#32363A' class='FontFamily'> 사용분은 각 100만원 추가공제(최대 300만원)</span>"
												})],
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
									 content : [new sap.m.Input(oController.PAGEID + "_Cashe", {
													 editable : false,
													 value : "{Cashe}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
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
									  content : [new sap.m.Input(oController.PAGEID + "_Dbtcd", {
													editable : false,
													value : "{Dbtcd}",
													textAlign : "End"
												}).addStyleClass("FontFamily")],
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
									   content : [new sap.m.Input({
													   value : "{Eopyg}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉲ 전통시장 사용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Trdmk", {
													   value : "{Trdmk}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉳ 대중교통 이용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Pubtr", {
													   value : "{Pubtr}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉴ 도서공연 사용금액"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Bkspf", {
													   value : "{Bkspf}",
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
