sap.ui.define(["common/PageHelper"], function (PageHelper) {
    "use strict";

    sap.ui.jsview("ZUI5_HR_PensionPay.List", {
        getControllerName: function () {
            return "ZUI5_HR_PensionPay.List";
        },

        createContent: function (oController) {
            // 사용할 odata service 정의
            $.app.setModel("ZHR_BENEFIT_SRV");
            $.app.setModel("ZHR_COMMON_SRV");

            var oPage = new PageHelper({
                idPrefix: oController.PAGEID,
                contentItems: [new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Content", { content: [] })]
            });
            oPage.setModel(oController._ListCondJSonModel);
            oPage.bindElement("/Data");

            // var oContent = new sap.m.FlexBox({
            // 	  justifyContent: "Center",
            // 	  fitContainer: true,
            // 	  items: [new sap.m.FlexBox({
            // 				  direction: sap.m.FlexDirection.Column,
            // 				  items: [new sap.m.FlexBox({
            // 							  alignItems: "End",
            // 							  fitContainer: true,
            // 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_17001")}).addStyleClass("app-title")] // 개인연금
            // 						  }).addStyleClass("app-title-container"),
            // 						  new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Content", {
            // 							  content : []
            // 						  })]
            // 			  }).addStyleClass("app-content-container-wide")]
            // }).addStyleClass("app-content-body");

            // /////////////////////////////////////////////////////////

            // var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
            // 	// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
            // 	showHeader : false,
            // 	content: [oContent]
            // }).addStyleClass("app-content");

            return oPage;
        }
    });
});
