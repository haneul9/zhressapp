sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_02", {
	/** 세액감면 및 세액공제 - 의료비 **/
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
									 content : [new sap.m.Text({text : "의료비 세액공제"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 3
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "본인 / 65세 이상 부양가족 / \n장애인 / 건강보험산정특례자 의료비", textAlign : "Center"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P0812ListY15");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 3
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fmdoh", {
													 editable : false,
													 value : "{Fmdoh}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• 근로자가 본인 또는 기본공제 대상자(나이/소득제한없음)를 위하여 지출한 의료비로 총 급여액의 3%를 초과하는 금액의 15%(난임시술비의 경우 20%) 세액공제"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span class='FontFamily colorBlue'>• 의료비 지출금액 중 보험사로부터 지급받은 실손의료보험금은 공제금액에서 제외</span><br>" +
															   "<span class='FontFamily colorBlue PaddingLeft5'>(수령한 보험금은 My홈택스 또는 보험사를 통해 확인가능 : 실손보험 수익자 기준으로 조회)</span>"
												}),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 본인/만 65세이상자/장애인/건강보험산정특례자/난임시술비 의료비 : 전액공제"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "- 그 밖의 부양가족 의료비 : 연 700만원"
												}).addStyleClass("FontFamily PaddingLeft5"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.FormattedText({
													htmlText : "<span style='color:#32363a' class='FontFamily PaddingLeft5'>- 안경,렌즈 구입비(인당 50만원),</span>" + 
																"<span class='FontFamily colorRed'> 산후조리비용(출산 1회당 200만원, 총급여 7천만원 이하자)</span>"
												})],
									 hAlign : "Begin",
									 vAlign : "Top",
									 rowSpan : 3
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "그 밖의 공제대상자 의료비"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fmded", {
													 editable : false,
													 value : "{Fmded}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "난임 시술비"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fmsft", {
													editable : false,
													value : "{Fmsft}",
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
