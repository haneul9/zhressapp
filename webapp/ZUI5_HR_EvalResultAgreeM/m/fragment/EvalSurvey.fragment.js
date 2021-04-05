jQuery.sap.require("common.SearchEvalSurvey");

sap.ui.jsfragment("ZUI5_HR_EvalResultAgreeM.m.fragment.EvalSurvey", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	createContent : function(oController) {
		common.SearchEvalSurvey.oController = oController;
		common.SearchEvalSurvey.userId = oController.Pernr;
		common.SearchEvalSurvey.Appye = oController.Appye;
		var vData = {Data : []};
			common.SearchEvalSurvey._JSONModel.setData(vData);
		var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label(oController.PAGEID +"_YearText",{
								// text: {
								// 	path : "{Appye}",
								// 	formatter : function(v){
								// 		return v + " " + oController.getBundleText("LABEL_16005");  // {Appye}년도 평가 설문조사
								// 	}
								// },
								design: "Bold"
							})
							// .setModel(common.SearchEvalSurvey._JSONModel).bindElement("/Data/0")
							// .setModel(oController._ResultModel).bindElement("/Data")
							.addStyleClass("sub-title ml-6px") 
						]
					}),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: common.SearchEvalSurvey.onMPressSave,
								text: "{i18n>LABEL_16001}" // 제출
							}),
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box"); 
			
			/*//////////////////////// 평가결과 내용///////////////////////////////////////////*/	
			var SurveyInfo = new sap.m.FlexBox(oController.PAGEID + "_Content", {
												   justifyContent : "Start",
												   fitContainer : true,
												   items : []
											   });
											   
			
			
			return new sap.m.VBox({
				width : "100%",
				items: [infoBox, SurveyInfo ],
				visible: {
				    path: "Evstaus",
					formatter: function(v) {
						if(v === "20" ) return true;
						else return false;
					}
	    	    }, 
			}).setModel(oController._ResultModel)
			.bindElement("/Data");
	}
});
