sap.ui.define(
    [
    
    ],
    function () {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail02", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                return new sap.m.VBox(oController.PAGEID + "_FilesBox", {
                    width: "100%",
                    // height: "280px",
                    fitContainer: true,
                    items: [
                    	new sap.m.HBox({
                    		height : "36px",
                     		justifyContent : "SpaceBetween",
                     		width : "100%",
                    		items : [
                    			new sap.m.HBox({
                					justifyContent: "Start",
                         			items : [
                         				new sap.m.Text({text : "{i18n>LABEL_76003}"}).addStyleClass("sub-title") // 입사서류
                         			]
                         		})
                    		]
                     	}),
                        new sap.m.VBox({
                            fitContainer: true,
                            items: [
                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "001"), 
                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "002"), 
                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "003"), 
                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "004")
                            ]
                        }).addStyleClass("custom-multiAttach-file")
                    ]
                });
            }
        });
    }
);
