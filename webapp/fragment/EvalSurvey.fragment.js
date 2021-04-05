sap.ui.jsfragment("fragment.EvalSurvey", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.SearchEvalSurvey");
		jQuery.sap.require("common.JSONModelHelper");
		jQuery.sap.require("common.makeTable");
		
		jQuery.sap.includeStyleSheet("css/dashboard.css"); // + "?" + new Date().getTime()
		
		common.SearchEvalSurvey.oController = oController;
		
		// title
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "14px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalSurvey.oBundleText.getText("LABEL_16002")}).addStyleClass("Font18 Font700 FontWhite")], // XXXX년도 평가 설문조사
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("survey")]
					}).bindElement("/Data/0"),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : common.SearchEvalSurvey.oBundleText.getText("LABEL_16003")}).addStyleClass("Font13 FontRed")], // * 필수항목
									 hAlign : "End",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"})]	
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["40px", "", "40px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	content : [new sap.m.FlexBox(common.SearchEvalSurvey.PAGEID + "_Content", {
												   justifyContent : "Start",
												   fitContainer : true,
												   items : []
											   })]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		var oDialog = new sap.m.Dialog(common.SearchEvalSurvey.PAGEID + "_SurveyDialog", {
			title : "", 
			contentWidth : "800px",
			contentHeight : "1500px",
			content : [oContent],
			beforeOpen : common.SearchEvalSurvey.onBeforeOpen,
			afterOpen : common.SearchEvalSurvey.onAfterOpen,
			beginButton : [new sap.m.Button({
							   type : "Emphasized",
							   text : common.SearchEvalSurvey.oBundleText.getText("LABEL_16001"), // 제출
							   press : common.SearchEvalSurvey.onPressSave
						   })],
			endButton : [new sap.m.Button({
							 type : "Emphasized",
							 text : common.SearchEvalSurvey.oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })]
		});
		
		oDialog.setModel(common.SearchEvalSurvey._JSONModel);
		oDialog.bindElement("/Data");
		
		// oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}
});
