sap.ui.define([
	"common/Common",
	"common/PageHelper"
], function (Common, PageHelper) {
    "use strict";
    
    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

    sap.ui.jsview(SUB_APP_ID, {
        getControllerName: function () {
			return SUB_APP_ID;
        },

        getInputBox : function(oController){
            return new sap.m.VBox({
				items: [
                    new sap.m.VBox({
                        items:[
                            new sap.ui.commons.layout.MatrixLayout(oController.PAGEID+"_Mat",{columns:2})
                        ]
                    })                
                ]
            }).addStyleClass("vbox-form-mobile");
        },
        
        createContent: function(oController) {

            return new PageHelper({
                idPrefix: "Detail-",
                title: "{i18n>LABEL_07001}",    // 평가이력
                showNavButton: true,
                navBackFunc: oController.navBack.bind(oController),
                contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                contentItems: [
                     this.getInputBox(oController)
                ]
            })
            .setModel(oController.oModel);
        }

	});
});