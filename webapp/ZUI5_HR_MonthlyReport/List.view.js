$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_MonthlyReport.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_MonthlyReport.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_DASHBOARD_SRV");
		
		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_60008")}), // 대상기간
                                new sap.m.Input({
						         	value : "{Zyymm}",
						         	placeholder : "YYYY.MM",
						         	maxLength : 7,
                                	width : "200px",
                                	submit : oController.onPressSearch,
						         	liveChange : function(oEvent){
						         		if(oEvent.getParameters().value.length == 6 && oEvent.getParameters().value.indexOf(".") == -1){
						         			oEvent.getSource().setValue(oEvent.getParameters().value.substring(0,4) + "." + oEvent.getParameters().value.substring(4,6));
						         		}
						         	}
								}),
							    new sap.m.Label({text: oBundleText.getText("LABEL_48002") }), // 부서/사원
                                new sap.m.Input({
                                    width: "200px",
                                    value: "{Ename}",
                                    showValueHelp: true,
                                    valueHelpOnly: true,
                                    valueHelpRequest: oController.searchOrgehPernr
                                })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch,
                                    text: oBundleText.getText("LABEL_00104") // 검색
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
        
        var oLayout = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Layout").addStyleClass("mt-10px");
        
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oLayout]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});