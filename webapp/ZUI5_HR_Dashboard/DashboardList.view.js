jQuery.sap.require("sap.f.GridContainerSettings");

sap.ui.jsview("ZUI5_HR_Dashboard.DashboardList", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_Dashboard.DashboardList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		var oTitle = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_05101")}).addStyleClass("title")], // 목표/평가 Dashboard
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "2rem"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
													content : [new sap.m.Text({text : oBundleText.getText("LABEL_05102"), textAlign : "Begin"}).addStyleClass("dashboard_title_text paddingRight10 paddingTop3"), // 평가연도
															   new sap.m.Select(oController.PAGEID + "_Year", {
															   	   selectedKey : "{Year}",
															   	   items : [],
												 			   	   width : "130px",
												 			   	   change : oController.onSearchUserList
															   })]
												})],
									 hAlign : "Begin",
									 vAlign : "Bottom"
								 })]
					})]
		}).addStyleClass("marginLeft1rem marginRight1rem");
		
		var oContent = new sap.f.GridContainer(oController.PAGEID + "_GridContainer", {
			containerQuery : true,
			snapToRow : true,
			layout : [new sap.f.GridContainerSettings({gap : "15px"})],
			items : [new sap.ui.layout.VerticalLayout({
					     content : [oTitle],
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										    columns : 16,
										    rows : 1,
										    minRows : 1
									    })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content01", oController)], // timeline
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										    columns : 4,
										    rows : 8,
										    minRows : 8
									    })]
					 }),
					 new sap.ui.layout.VerticalLayout({
						 content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content02", oController)], // 목표관리
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 8,
										   minRows : 8
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content03", oController)], // 평가관리
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 4,
										   minRows : 4
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content05", oController)], // 업적평가등급
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 4,
										   minRows : 4
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content04", oController)], // 종합평가
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 4,
										   minRows : 4
									   })]
					 }),
					 new sap.ui.layout.VerticalLayout({
					     content : [new sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content06", oController)], // 평가점수
					     layoutData : [new sap.f.GridContainerItemLayoutData({
										   columns : 4,
										   rows : 4,
										   minRows : 4
									   })]
					})]
		});
		
		// var oMatrix = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 1,
		// 	width : "100%",
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [oContent],
		// 							 hAlign : "Center",
		// 							 vAlign : "Middle"
		// 						 })] 
		// 			})]
		// });
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			// title: "{i18n>LABEL_03101}",
			title : "평가 Overview",
			showHeader : false,
			content: [new sap.m.ScrollContainer(oController.PAGEID + "_ScrollContainer", {
						  horizontal : true,
						  vertical : false,
						  width : "100%",
						  content : [new sap.m.FlexBox({
									     justifyContent : "Center",
									     fitContainer : true,
									     items : [oContent]
								     })]
					  })],
			// content : [new sap.m.FlexBox({
			// 			   justifyContent : "Center",
			// 			   fitContainer : true,
			// 			   items : [oContent]
			// 		   })],
			footer : []
		});
		
		oPage.addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}

});