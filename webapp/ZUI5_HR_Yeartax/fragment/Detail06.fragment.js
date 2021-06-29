sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail06", {
	/** 모의실행 **/
	createContent : function(oController) {
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "700px",
			widths : ["", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "양식"})],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "추가소득"})],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Label3"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "다운로드"})],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Label3")]		
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "예상세액조회"})],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input({
													value : "{IAmt01}",
													width : "100%",
													maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "YeartaxPdfForm", "IAmt01"),
													liveChange : function(oEvent){
														var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
														
														oEvent.getSource().setValue(common.Common.numberWithCommas(value));
													}
												})],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Data2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										new sap.m.Button({
											text : "프린트",
											type : "Default",
											press : oController.onPressSearch6
										}).addStyleClass("button-light")
									 ],
									 hAlign : "Center",
									 vAlign : "Middle"	
								 }).addStyleClass("Data2")]		
					})]
		})
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oContent,
					   new sap.ui.core.HTML({content : "<div style='height:10px'></div>"}),
					   new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Detail6_PDF")]
		});
		
		oLayout.setModel(oController._DetailJSonModel);
		oLayout.bindElement("/Data");
		
		return oLayout;
	}

});
