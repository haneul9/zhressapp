jQuery.sap.require("sap.f.GridContainerSettings");

sap.ui.jsview("ZUI5_HR_MyDashboard.DashboardList", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_MyDashboard.DashboardList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		var oGridContainer = new sap.f.GridContainer(oController.PAGEID + "_GridContainer", {
			containerQuery : true,
			snapToRow : true,
			items : [new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content01", oController)], // 목표/평가 진행 단계
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 20,
										   rows : 3,
										   minRows : 3
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
						 content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content02", oController)], // Timeline
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 5,
										   minRows : 6
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content03", oController)], // 조직 목표
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 5,
										   minRows : 6
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content04", oController)], // 개인 MBO
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 5,
										   minRows : 6
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content05", oController)], // 평가현황(점수)
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 3,
										   minRows : 3
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content06", oController)], // 평가현황(등급)
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 3,
										   minRows : 3
									   })]
					})]
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["", "100%", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [oGridContainer],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]	
					})]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			title: "평가 Overview",
			// customHeader : [new sap.m.Bar()],
			showHeader : false,
			content: [oGridContainer],
			footer : [new sap.m.Bar()]
		});
		
		oPage.addStyleClass("WhiteBackground");
		
		// oPage.setModel(oController._ListCondJSonModel);
		// oPage.bindElement("/Data");

		return oPage;
	}

});