$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("ZUI5_HR_MssMboEval.fragment.content01");
$.sap.require("ZUI5_HR_MssMboEval.fragment.content02");
$.sap.require("sap.f.GridContainerSettings");
$.sap.require("common.EmpBasicInfoBoxCustom");
sap.ui.jsview("ZUI5_HR_MssMboEval.MssMboEval", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_MssMboEval.MssMboEval";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL2_SRV");
		var oMyPage1=ZUI5_HR_MssMboEval.fragment.content01.renderPanel(oController,"41","1");
		var oMyPage2=ZUI5_HR_MssMboEval.fragment.content01.renderPanel(oController,"42","2");
		var oMyPage3=ZUI5_HR_MssMboEval.fragment.content01.renderPanel(oController,"43","3");
		var oMyPage4=ZUI5_HR_MssMboEval.fragment.content02.renderPanel(oController,"42","2a");
		var oMyPage5=ZUI5_HR_MssMboEval.fragment.content02.renderPanel(oController,"43","3a");
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [new sap.m.IconTabFilter({
						 key : "1",
						 text : oBundleText.getText("LABEL_36002"), // 1차
						 design : "Vertical",
						 content : [
							oMyPage1
						 	]
					 }),
					 new sap.m.IconTabFilter({
						 key : "2",
						 text : oBundleText.getText("LABEL_36003"), // 2차
						 design : "Vertical",
						 content : [
							oMyPage2
						 	]
					 }),
					 new sap.m.IconTabFilter({
						key : "2a",
						text : oBundleText.getText("LABEL_36004"), // 2차확정
						design : "Vertical",
						content : [
							oMyPage4
							]
					}),
					new sap.m.IconTabFilter({
						key : "3",
						text : oBundleText.getText("LABEL_36005"), // 3차
						design : "Vertical",
						content : [
							oMyPage3
							]
					}),
					new sap.m.IconTabFilter({
						key : "3a",
						text : oBundleText.getText("LABEL_36006"), // 3차확정
						design : "Vertical",
						content : [
						   oMyPage5
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
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_36001")}).addStyleClass("app-title")] // 업적평가담당자
								  }).addStyleClass("app-title-container"),
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