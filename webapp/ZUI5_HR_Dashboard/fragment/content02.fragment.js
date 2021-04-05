sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oLegend = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
												 	content : [new sap.m.ToolbarSpacer(),
												 			   new sap.ui.core.Icon({
												 			   	   width : "13px",
												 			   	   height : "13px",
												 			   	   src : "sap-icon://circle-task-2",
												 			   	   color : "#7fcad7"
												 			   }),
												 			   new sap.m.Text({text : oBundleText.getText("LABEL_05103")}).addStyleClass("Font12"), // 목표
												 			   new sap.ui.core.Icon({
												 			   	   width : "13px",
												 			   	   height : "13px",
												 			   	   src : "sap-icon://circle-task-2",
												 			   	   color : "#9ed0aa"
												 			   }),
												 			   new sap.m.Text({text : oBundleText.getText("LABEL_05104")}).addStyleClass("Font12"), // 활동
												 			   new sap.ui.core.Icon({
												 			   	   width : "13px",
												 			   	   height : "13px",
												 			   	   src : "sap-icon://circle-task-2",
												 			   	   color : "#ffb400"
												 			   }),
												 			   new sap.m.Text({text : oBundleText.getText("LABEL_05105")}).addStyleClass("Font12")] // 실적
												}).addStyleClass("toolbarNoBottomLine")],
									 hAlign : "End",
									 vAlign : "Middle"
								 })]
					})]
		});
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content2", {
			horizontal : false,
			vertical : true,
			width : "",
			height : "615px",
			content : []
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   height : "50px",
						   content : [new sap.m.ToolbarSpacer({width : "18px"}),
									  new sap.m.Text({text : oBundleText.getText("LABEL_05106")}).addStyleClass("dashboard_title_text"), // 목표관리
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Button({
									  	  icon : "sap-icon://list",
									  	  type : "Ghost",
									  	  //press : oContrler.onPressDetail2
									  	  press : function(oEvent){
									  	  	  var url = "/sf/customExternalModule?urlName=EvalGoal&moduleId=PERFORMANCE";
									  	  	  
									  	  	  if(common.Common.getOperationMode() == "DEV"){
													window.open("https://hcm10preview.sapsf.com" + url);
											  } else {
													window.open("https://performancemanager10.successfactors.com" + url);
											  }
									  	  }
									  }),
									  new sap.m.ToolbarSpacer({width : "10px"})]
					   }).addStyleClass("dashboard_title"),
					   new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
					   oScrollContainer,
					   oLegend]
		}).addStyleClass("dashboard_layout2");
		
		return oContent;
	}
});
