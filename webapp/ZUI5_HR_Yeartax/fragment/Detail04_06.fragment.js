sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_06", {
	/** 특별공제 - 주택자금 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			width : "100%",
			widths : ["", "", "150px", "150px", "150px", "40%"],
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
									 content : [new sap.m.Label({text : "내역입력"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "기타금액"}).addStyleClass("FontFamily")],
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
									 content : [new sap.m.Text({text : "주택임차차입금"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 2
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "금융기관 원리금 상환액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_ZzrepayNts", {
													value : "{ZzrepayNts}",
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
															sap.m.MessageBox.error("숫자만 입력하여 주십시오.");
															oEvent.getSource().setValue("");
															return;
														} else {
															oEvent.getSource().setValue(common.Common.numberWithCommas(value));
														}
													},
													textAlign : "End"
											    }),
											    new sap.ui.layout.HorizontalLayout({
											    	content : [new sap.ui.core.Icon({
														    		src : "sap-icon://pdf-attachment",
														    		size : "17px",
														    		color : "#333333",
														    		visible : { 
														    			path : "ZzrepayNto",
														    			formatter : function(fVal){
														    				return fVal && fVal != "" ? true : false;
														    			}
														    		}
														       }).addStyleClass("PaddingRight5 PaddingTop7"),
														       new sap.m.Input(oController.PAGEID + "_ZzrepayNto", {
														    	   value : "{ZzrepayNto}",
														    	   editable : false,
														    	   width : "100px",
														    	   textAlign : "End"
														       }).addStyleClass("FontFamily")]
											    })],
									 hAlign : "Right",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Button({
										 			 text : "삭제",
													 //visible : {
														//  parts : [{path : "Pystat"}, {path : "Yestat"}],
														//  formatter : function(fVal1, fVal2){
														// 	 if(fVal1 == "1" && fVal2 == "1") 
														// 		 return true;
														// 	 else 
														// 		 return false;
														//  }
													 //},
													 visible : false,
													 type : "Default",
													 press : oController.onPressDelete
												 })],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_ZzrepayOth", {
										 			 value : "{ZzrepayOth}",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 },
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Top"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• 연말 현재 무주택 세대의 세대주(세대주가 주택 관련 공제를 받지 않은 경우 세대원)가 국민주택규모의 주택(주거용 오피스텔 포함) 임차에 필요한 " +
														   "전세보증금을 금융기관이나 개인에게 차입한 경우 차입금의 원리금(원금+이자)의 40% 소득공제"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도 : 연 300만원(주택마련저축공제 납입액과 통합)"
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Top",
									 rowSpan : 2
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "개인간 원리금 상환액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
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
														 oController.onPressOpenSubty(oEvent, "P0881E6", "E6");
													 }
												}).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Indpa", {
													 value : "{Indpa}",
													 editable : false,
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "월세액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "지출액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data2"),
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
														 oController.onPressOpenSubty(oEvent, "P0881E5", "E5");
													 }
												}).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Mrntd", {
													 value : "{Mrntd}",
													 editable : false,
													 textAlign : "End"
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.FormattedText({
												 	htmlText : "<span style='color:#32363A' class='FontFamily'>• 연말 현재 무주택 세대의 세대주(세대주가 주택 관련 공제를 받지 않은 경우 세대원)인 총 급여액이 " +
												 			   "7천만원 이하의 근로자가 국민주택규모의 주택 또는 </span>" +
												 			   "<span class='FontFamily colorRed'>기준시가 3억원 이하</span>" +
												 			   "<span style='color:#32363A' class='FontFamily'>의 주택을 임차하기 위해 지급한 월세액의 10% 세액공제</span>" +
												 			   "<br>" +
												 			   "<span style='color:#32363A' class='FontFamily PaddingLeft5'>(총급여액 5500만원 이하자는 12% 세액공제)</span>"
												}),
										 		new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
										 		new sap.m.Text({text : "• 공제한도 : 연 750만원"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					})]
		});
		
		return oMatrix;
	}

});
