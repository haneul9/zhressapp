sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content01", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oProcessFlow = new sap.suite.ui.commons.ProcessFlow(oController.PAGEID + "_ProcessFlow", {
			wheelZoomable : false,
			lanes : [new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane0",{
						 position : 0,
						 laneId : "Lane0",
						 iconSrc : "sap-icon://activity-assigned-to-goal",
						 state : [{state: "Neutral", value: 100}],
						 text : "목표입력"
					 }),
					 new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane1",{
						 position : 1,
						 laneId : "Lane1",
						 iconSrc : "sap-icon://activity-2",
						 state : [{state: "Neutral", value: 100}],
						 text : "목표승인"
					 }),
					 new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane2",{
						 position : 2,
						 laneId : "Lane2",
						 iconSrc : "sap-icon://activity-individual",
						 state : [{state: "Neutral", value: 100}],
						 text : "본인평가"
					 }),
					 new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane3",{
						 position : 3,
						 laneId : "Lane3",
						 iconSrc : "sap-icon://activity-individual",
						 state : [{state: "Neutral", value: 100}],
						 text : "평가진행"
					 }),
					 new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane4",{
						 position : 4,
						 laneId : "Lane4",
						 iconSrc : "sap-icon://activity-individual",
						 state : [{state: "Neutral", value: 100}],
						 text : "결과확인"
					 }),
					 new sap.suite.ui.commons.ProcessFlowLaneHeader(oController.PAGEID + "_ProcessFlowLane5",{
						 position : 5,
						 laneId : "Lane5",
						 iconSrc : "sap-icon://activity-individual",
						 state : [{state: "Neutral", value: 100}],
						 text : "평가완료"
					 })]
		});
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content1", {
			horizontal : false,
			vertical : true,
			width : "",
			height : "",
			content : [oProcessFlow]
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   content : [new sap.m.Text({text : "목표/평가 진행 단계"}).addStyleClass("Font15 FontBold")]
					   }).addStyleClass("toolbarNoBottomLine"),
					   oScrollContainer]
		}).addStyleClass("layout2");
		
		return oContent;
	}
});
