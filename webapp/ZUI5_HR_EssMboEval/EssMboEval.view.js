$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("ZUI5_HR_EssMboEval.fragment.content01");
$.sap.require("ZUI5_HR_EssMboEval.fragment.content02");
$.sap.require("common.EmpBasicInfoBox");
sap.ui.jsview("ZUI5_HR_EssMboEval.EssMboEval", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_EssMboEval.EssMboEval";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL2_SRV");
// 사원정보
		// var oHeader = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 1,
		// 	width : "100%",
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({ 
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.ui.layout.HorizontalLayout({
		// 										 	content : [new sap.m.Image(oController.PAGEID+"_HPhoto",{
		// 														   width : "55px",
		// 														   height : "55px"
		// 													   }).addStyleClass("roundImage"),
		// 													   new sap.ui.layout.VerticalLayout({
		// 													   	   content : [new sap.ui.layout.HorizontalLayout({
		// 																   	   	  content : [new sap.m.Text(oController.PAGEID+"_HEname").addStyleClass("Font20 FontBold"),
		// 																   	   				 new sap.m.Text(oController.PAGEID+"_HZpostT").addStyleClass("Font15 paddingLeft5 paddingTop5")]
		// 																   	  }).addStyleClass("paddingTop3"),
		// 													   				  new sap.m.Text(oController.PAGEID+"_HStext").addStyleClass("info2")]
		// 													   }).addStyleClass("paddingLeft10 paddingTop3")]
		// 										})],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("paddingLeft10")]
		// 			})]
		// });

		var oHeader = new common.EmpBasicInfoBox(oController.EmployeeModel);
		
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [new sap.m.IconTabFilter({
						 key : "1",
						 text : oBundleText.getText("LABEL_35002"), // 역량평가(1차)
						 design : "Vertical",
						 content : [
								ZUI5_HR_EssMboEval.fragment.content01.renderPanel(oController)
						 	]
					 }),
					 new sap.m.IconTabFilter({
						 key : "2",
						 text : oBundleText.getText("LABEL_35003"), // 역량평가(2차)
						 design : "Vertical",
						 content : [
							ZUI5_HR_EssMboEval.fragment.content02.renderPanel(oController)
						 	]
					 })],
			select : oController.handleIconTabBarSelect,
			content : []
		}).addStyleClass("tab-group");	

		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_35001")}).addStyleClass("app-title")] // 역량평가
								  }).addStyleClass("app-title-container"),
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oHeader,
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oIcontabbar
								  ]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}

});