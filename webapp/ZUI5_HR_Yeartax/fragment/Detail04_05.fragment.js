sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_05", {
	/** 특별공제 - 장기주택 저당차입금 이자상환액 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			width : "100%",
			widths : ["", "", "", "", "150px", "40%"],
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
									 vAlign : "Middle",
									 colSpan : 2
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
									 content : [new sap.m.Text({text : "장기주택 저당차입금\n이자상환액", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 9
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "2011년 이전 차입분"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 3
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "15년 미만\n(600만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P0881E8", "E8");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 9
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fprdo", {
													 editable : false,
													 value : "{Fprdo}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.FormattedText({
													htmlText : "<span style='color:#32363A' class='FontFamily'>• 연말 현재 무주택 또는 1주택을 보유한 세대의 세대주(세대주가 주택 관련 공제를 받지 않은 경우 세대원)가 </span>" +
															   "<span class='FontFamily colorRed'>기준시가 5억원 이하</span>" +
															   "<span style='color:#32363A' class='FontFamily'> 주택(14~18년 취득분: 4억원 이하, 13년 이전: 3억원 이하)을 담보로 차입하는 주택담보차입금의 이자상환액을 소득공제</span>"
												}),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "※ 13년 이전 차입금은 연도 중 2주택 보유기간이 3개월 이하 요건도 충족해야함"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 차입요건"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 차입금의 상환기간이 15년 이상일 것(또는 10년 이상)"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 소유권이전(또는 보존) 등기일로부터 3개월 이내 차입분일 것"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 주택과 장기주택저당차입금이 모두 근로자 본인 명의일 것"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도 : 연 300만원 ~ 1800만원(차입시기에 따라 한도적용)"
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Top",
									 rowSpan : 9
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "15년-29년\n(1,000만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								  new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Inttl", {
													 editable : false,
													 value : "{Inttl}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "30년이상\n(1,500만원한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Insln", {
													editable : false,
													value : "{Insln}",
													textAlign : "End"
												}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "2012년 이후 차입분"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle",
									   rowSpan : 2
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리ㆍ비거치상환대출\n(1,500만원한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Intfn", {
													   value : "{Intfn}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "기타대출\n(500만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Intot", {
													   value : "{Intot}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "2015년 이후"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle",
									   rowSpan : 4
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 & 비거치\n(1800만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2 PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn1", {
													   value : "{Infn1}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 / 비거치\n(1500만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2 PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn2", {
													   value : "{Infn2}",
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
									   content : [new sap.m.Text({text : "기타대출"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn4", {
													   value : "{Infn4}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 + 비거치\n(300만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("Data2 PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn3", {
													   value : "{Infn3}",
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
