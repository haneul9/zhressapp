sap.ui.jsview("ZUI5_HR_EvalPro.Detail", {
	
	getControllerName: function() {
		return "ZUI5_HR_EvalPro.Detail";
	},

	createContent: function(oController) {
		
		var oSummary = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24028") + ": {Begda} ~ {Endda}"})], // 고과기간
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 5
								 }).addStyleClass("paddingLeft10 paddingRight10")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24017")})], // 소속
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label border_left0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24012")})], // 사번
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24013")})], // 성명
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24014")})], // 직급
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24018")})], // 그룹입사일
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label border_right0")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{Orgtx}"})], // 소속
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data border_left0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Pernr}"})], // 사번
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Ename}"})], // 성명
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{PGradeTxt}"})], // 직급
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Dardt}"})], // 그룹입사일
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data border_right0")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24019")})], // 합계점수
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label border_left0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.HorizontalLayout({
											 	 	content : [new sap.m.Text({
														 	 	   text : {
															 	 	   	path : "Score",
															 	 	   	formatter : function(fVal){
															 	 	   		this.removeStyleClass("FontRed");
															 	 	   		
															 	 	   		if(fVal <= 70 || fVal >= 90){
															 	 	   			this.addStyleClass("FontRed");
															 	 	   		}
															 	 	   		
															 	 	   		return fVal;
															 	 	   	}
														 	 	   }
														 	   }).addStyleClass("paddingRight10 FontBold"),
														 	   new sap.m.Text({text : oBundleText.getText("LABEL_24007")})] // 점
											 	})],
									 hAlign : "Center",
									 vAlign : "Middle"
								}).addStyleClass("Data"),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.Text({text : oBundleText.getText("LABEL_24020")})], // 평가자 의견사항
									hAlign : "Center",
									vAlign : "Middle"
								}).addStyleClass("Label"),
								new sap.ui.commons.layout.MatrixLayoutCell({
								 	content : [new sap.m.TextArea({
											 	   value : "{Ztext}",
											 	   width : "100%",
											 	   rows : 4,
											 	   maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL2_SRV", "AppraisalSheetTableIn1", "Ztext"),
											 	   editable : {
											 	 		path : "Sndflg",
											 	 		formatter : function(fVal){
											 	 			return fVal == "" ? true : false;
											 	 		}
											 	    }
											 	})],
								 	hAlign : "Begin",
								 	vAlign : "Middle",
								 	colSpan : 2
								}).addStyleClass("paddingTop10 paddingBottom10 Data border_right0")]
					})]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Content").addStyleClass("mt-8px");
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Button({
											  	  icon : "sap-icon://nav-back",
											  	  type : "Default",
											  	  press : oController.onBack
											  }),
											  new sap.ui.core.HTML({content : "<div style='width:10px' />"}),
											  new sap.m.Text({text: oBundleText.getText("LABEL_24001")}).addStyleClass("app-title")] // 전문직 평가
								  }).addStyleClass("app-title-container"),
								  new sap.ui.core.HTML({content : "<div style='height:40px' />"}),
								  oSummary,
								  oLayout,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._DetailJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});