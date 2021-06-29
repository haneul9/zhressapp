sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_11", {
	/** 그 밖의 소득공제 - 기타 **/
	createContent : function(oController) {
		
		// var oMatrix = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 6,
		// 	width : "100%",
		// 	widths : ["", "", "150px", "150px", "150px", "40%"],
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "항목"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "구분"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "내역입력"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "국세청 금액"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "기타 금액"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "항목별 요약설명 및 공제조건"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Label3")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "투자조합 출자공제"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle",
		// 							 rowSpan : 3
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2017년", textAlign : "Center"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Button({
		// 											 text : {
		// 												 parts : [{path : "Pystat"}, {path : "Yestat"}],
		// 												 formatter : function(fVal1, fVal2){
		// 													 if(fVal1 == "1" && fVal2 == "1") 
		// 														 return "입력";
		// 													 else 
		// 														 return "조회";
		// 												 }
		// 											 },
		// 											 type : "Default",
		// 											 press : function(oEvent){
		// 												 oController.onPressOpenSubty(oEvent, "P0881E9");
		// 											 }
		// 										 })],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle",
		// 							 rowSpan : 6
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Tinvs", {
		// 											 value : "{Tinvs}",
		// 											 editable : false,
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({
		// 											text : "• 거주자가 중소기업창업투자조합 등에 2014년 1월 1일 ~ 2016년 12월 31일까지 출자 또는 투자한 금액의 100분의 10에 상당하는 금액을 그 출자일 " +
		// 													"또는 투자일이 속하는 과세연도부터 2년이 되는 날이 속하는 과세연도까지 거주자가 선택하는 1과세연도의 종합소득금액에서 공제"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.ui.core.HTML({content : "<div style='height:1px' />"}),
		// 										new sap.m.Text({
		// 											text : "- 공제한도 : 근로소득금액의 50% (2013년 이전 40%)"
		// 										}).addStyleClass("FontFamily PaddingLeft5"),
		// 										new sap.ui.core.HTML({content : "<div style='height:1px' />"}),
		// 										new sap.m.Text({
		// 											text : "- 농어촌특별세 과세대상"
		// 										}).addStyleClass("FontFamily PaddingLeft5")],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle",
		// 							 rowSpan : 3
		// 						 }).addStyleClass("Data2 PaddingTop5 PaddingBottom10")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2018년"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("FontFamily"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Invst", {
		// 											 value : "{Invst}",
		// 											 editable : false,
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2019년"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Finvt", {
		// 											 value : "{Finvt}",
		// 											 editable : false,
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "벤처투자 출자공제"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle",
		// 							 rowSpan : 3
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2017년"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Pinvs", {
		// 											 value : "{Pinvs}",
		// 											 editable : false,
		// 											 textAlign : "End"
		// 										})],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({
		// 											 text : "• 중소기업창업투자조합, 벤처기업 등에 투자 시 출자 또는 투자 후 2년이 되는 날이 속하는 과세연도까지 선택하여 1과세연도에 공제"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
		// 										new sap.m.Text({
		// 											 text : "- 공제한도 : 소득금액의 50%"
		// 										}).addStyleClass("FontFamily PaddingLeft5")],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle",
		// 							 rowSpan : 3
		// 						 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2018년"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Vinvs", {
		// 											 value : "{Vinvs}",
		// 											 editable : false,
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "35px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "2019년"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_Finvs", {
		// 											value : "{Finvs}",
		// 											editable : false,
		// 											textAlign : "End"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2")]
		// 			}),
		// 			new sap.ui.commons.layout.MatrixLayoutRow({
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "기타"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({text : "소상공인/소상공인 부금"}).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_ZsmbfiNts", {
		// 											 value : "{ZsmbfiNts}",
		// 											 width : "100%",
		// 											 editable : {
		// 												 parts : [{path : "Pystat"}, {path : "Yestat"}],
		// 												 formatter : function(fVal1, fVal2){
		// 													 return fVal1 == "1" && fVal2 == "1" ? true : false;
		// 												 }
		// 											 },
		// 											 maxLength : 11,
		// 											 liveChange : function(oEvent){
		// 												 var value = oEvent.getParameters().value.replace(/,/g, "");
														 
		// 												 if(isNaN(value) == true){
		// 													 oEvent.getSource().setValue("");
		// 													 sap.m.MessageBox.error("숫자만 입력하여 주십시오.");
		// 													 return;
		// 												 } else {
		// 													 oEvent.getSource().setValue(common.Common.numberWithCommas(value));
		// 												 }
		// 											 },
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.ui.layout.HorizontalLayout({
		// 											content : [new sap.ui.core.Icon({
		// 															src : "sap-icon://pdf-attachment",
		// 															size : "17px",
		// 															color : "#333333",
		// 															visible : {
		// 																path : "ZsmbfiNto",
		// 																formatter : function(fVal){
		// 																	return fVal ? true : false;
		// 																}
		// 															}
		// 													   }).addStyleClass("PaddingRight5 PaddingTop7"),
		// 													   new sap.m.Input(oController.PAGEID + "_ZsmbfiNto", {
		// 														   value : "{ZsmbfiNto}",
		// 														   editable : false,
		// 														   width : "100px",
		// 														   textAlign : "End"
		// 													   }).addStyleClass("FontFamily")]
		// 										})],
		// 							 hAlign : "Right",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Input(oController.PAGEID + "_ZsmbfiOth", {
		// 											 value : "{ZsmbfiOth}",
		// 											 editable : {
		// 												 parts : [{path : "Pystat"}, {path : "Yestat"}],
		// 												 formatter : function(fVal1, fVal2){
		// 													 return fVal1 == "1" && fVal2 == "1" ? true : false;
		// 												 }
		// 											 },
		// 											 maxLength : 11,
		// 											 liveChange : function(oEvent){
		// 												 var value = oEvent.getParameters().value.replace(/,/g, "");
														 
		// 												 if(isNaN(value) == true){
		// 													 oEvent.getSource().setValue("");
		// 													 sap.m.MessageBox.error("숫자만 입력하여 주십시오.");
		// 													 return;
		// 												 } else {
		// 													 oEvent.getSource().setValue(common.Common.numberWithCommas(value));
		// 												 }
		// 											 },
		// 											 textAlign : "End"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.m.Input({
		// 											value : "",
		// 											editable : false
		// 									    }).addStyleClass("FontFamily")],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2"),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Text({
		// 											text : "• 거주자가 중소기업협동조합법 제 115조에 따른 소기업ㆍ소상공인 공제에 가입하여 해당 과세기간에 납부하는 공제부금"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
		// 										new sap.m.Text({
		// 											text : "• 공제금액 : 납입액 전액"
		// 										}).addStyleClass("FontFamily"),
		// 										new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
		// 										new sap.m.Text({
		// 											text : "• 공제한도 : 연 300만원"
		// 										}).addStyleClass("FontFamily")],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
		// 			})]
		// });
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "150px", "150px", "40%"],
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
									 content : [new sap.m.Label({text : "국세청 금액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "기타 금액"}).addStyleClass("FontFamily")],
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
									 content : [new sap.m.Text({text : "투자조합출자 등"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 2
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "2017년 투자분"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : ""}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : ""}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
											 	 	text : "• 투자조합 또는 벤처기업 등에 직접 출자 또는 투자하는 경우"
											 	}).addStyleClass("FontFamily"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "2020.12.31까지 출자금액의 10~100% 소득공제(소득금액의 50% 한도)"
											 	}).addStyleClass("FontFamily PaddingLeft5"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "• 출자 또는 투자 후 2년이 되는 날이 속하는 과세연도 중 하나의 과세연도를 선택하여 공제"
											 	}).addStyleClass("FontFamily"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "※ 투자조합출자 등 공제 금액은 해당 화면에서 직접 입력할 수 없으며, 소득공제자료는 연말정산 담당자에게 직접 제출해주시기 바랍니다." +
											 			   "\n(공제금액은 연말정산 예상결과 2페이지 [IV. 정산명세] 41.투자조합출자 등 항목에서 확인가능합니다.)"
											 	}).addStyleClass("FontFamily colorBlue")],
								 	 hAlign : "Begin",
								 	 vAlign : "Top",
								 	 rowSpan : 2
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "2018년 이후 투자분"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : ""}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : ""}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "소기업 소상공인 공제부금"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "납입액"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Input(oController.PAGEID + "_ZzsmbfiNts", {
													 value : "{ZzsmbfiNts}",
													 width : "100%",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 },
													 maxLength : 11,
													 liveChange : function(oEvent){
														 var value = oEvent.getParameters().value.replace(/,/g, "");
														 
														 if(isNaN(value) == true){
															 oEvent.getSource().setValue("");
															 sap.m.MessageBox.error("숫자만 입력하여 주십시오.");
															 return;
														 } else {
															 oEvent.getSource().setValue(common.Common.numberWithCommas(value));
														 }
													 },
													 textAlign : "End"
												}).addStyleClass("FontFamily"),
												new sap.ui.layout.HorizontalLayout({
													content : [new sap.ui.core.Icon({
																	src : "sap-icon://pdf-attachment",
																	size : "17px",
																	color : "#333333",
																	visible : {
																		path : "ZzsmbfiNto",
																		formatter : function(fVal){
																			return fVal ? true : false;
																		}
																	}
															   }).addStyleClass("PaddingRight5 PaddingTop7"),
															   new sap.m.Input(oController.PAGEID + "_ZzsmbfiNto", {
																   value : "{ZzsmbfiNto}",
																   editable : false,
																   width : "100px",
																   textAlign : "End",
																   visible : false
															   }).addStyleClass("FontFamily")]
												})],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_ZzsmbfiOth", {
													 value : "{ZzsmbfiOth}",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 },
													 maxLength : 11,
													 liveChange : function(oEvent){
														 var value = oEvent.getParameters().value.replace(/,/g, "");
														 
														 if(isNaN(value) == true){
															 oEvent.getSource().setValue("");
															 sap.m.MessageBox.error("숫자만 입력하여 주십시오.");
															 return;
														 } else {
															 oEvent.getSource().setValue(common.Common.numberWithCommas(value));
														 }
													 },
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({
											 	 	text : "• 사업기간이 1년 이상인 소기업, 소상공인 대표자가 노란우산공제에 가입한 경우"
											 	}).addStyleClass("FontFamily"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 	 	text : "• 공제한도"
											 	}).addStyleClass("FontFamily"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "- 근로소득금액 4천만원 이하 : 500만원"
											 	}).addStyleClass("FontFamily PaddingLeft5"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "- 4천만원 초과 1억원 이하 : 300만원"
											 	}).addStyleClass("FontFamily PaddingLeft5"),
											 	new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
											 	new sap.m.Text({
											 		text : "- 1억원 초과 : 200만원"
											 	}).addStyleClass("FontFamily PaddingLeft5")],
									 hAlign : "Begin",
									 vAlign : "Top"
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					})]
		});
		
		return oMatrix;
	}

});
