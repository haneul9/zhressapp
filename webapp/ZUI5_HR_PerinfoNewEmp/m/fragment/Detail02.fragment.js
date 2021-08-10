sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail02", {
        createContent: function (oController) {
            return new sap.m.VBox({
                height: "100%",
                items: [this.getInfoHBox(oController)]
            });
        },

        getInfoHBox: function (oController) {
            return new sap.m.VBox({
                items: [
                	 new sap.m.VBox({
                         fitContainer: true,
                         items: [
                        	fragment.COMMON_ATTACH_FILES.renderer(oController, "001"), 
                        	fragment.COMMON_ATTACH_FILES.renderer(oController, "002"), 
                        	fragment.COMMON_ATTACH_FILES.renderer(oController, "003"), 
                        	fragment.COMMON_ATTACH_FILES.renderer(oController, "004")
                         ]
                    }).addStyleClass("custom-multiAttach-file-mobile")
                ]
            });
        }
    });
});
