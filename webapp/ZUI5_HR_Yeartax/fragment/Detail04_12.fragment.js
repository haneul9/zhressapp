sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_12", {
	/** 그 밖의 소득공제 - 장기집합투자증권저축 **/
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
									 content : [new sap.m.Text({text : "장기집합투자증권저축"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "납입액"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P0881E7", "E7");
													 }
												 }).addStyleClass("button-light")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 3
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Ltais", {
										 			 value : "{Ltais}",
													 editable : false,
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• 가입당시 직전년도 총급여액이 5천만원 이하이며, 공제신청연도의 총급여액이 8천만원 이하인 근로자가 " +
														   "2015.12.31까지 장기집합투자증권저축에 가입한 경우 납입액의 40% 소득공제"
												}).addStyleClass("FontFamily"),
												new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												new sap.m.Text({
													text : "• 공제한도 : 연 240만원"
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data2 PaddingTop5 PaddingBottom5")]
					})]
		});
		
		return oMatrix;
	}

});
