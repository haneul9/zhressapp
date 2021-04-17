sap.ui.define([
	"common/Common",
	"common/PageHelper",
	"common/SearchUserMobile",
], function (Common, PageHelper, SearchUserMobile) {
    "use strict";
    
    var SUB_APP_ID = [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix());

    sap.ui.jsview(SUB_APP_ID, {
        getControllerName: function () {
			return SUB_APP_ID;
        },
        
        createContent: function(oController) {

			// var FacilityHandler = oController.getFacilityHandler();
				
            return new PageHelper({
                idPrefix: "FacilityDetail-",
                title: "{i18n>LABEL_00205}",    // 사원검색
                showNavButton: true,
                navBackFunc: SearchUserMobile.navBack,
                contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
                contentItems: [
                   sap.ui.jsfragment("fragment.EmployeeSearchMobile", oController)
                ]
			});
        },
	});
});