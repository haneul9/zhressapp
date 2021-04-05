sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail05", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_60008")}), // 대상기간
                                new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
						            value : "{Begda}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
							    }),
							    new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
						            value : "{Endda}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
							    }).addStyleClass("pl-5px"),
							    new sap.m.Label({text: oBundleText.getText("LABEL_48002") }), // 부서/사원
                                new sap.m.Input({
                                    width: "200px",
                                    value: "{Ename}",
                                    showValueHelp: true,
                                    valueHelpOnly: true,
                                    valueHelpRequest: oController.searchOrgehPernr
                                }),
							    new sap.m.Label({text: oBundleText.getText("LABEL_60029") }), // 조회구분
                                new sap.m.ComboBox({
                                    selectedKey : "{Type}",
                                    width : "200px",
                                    items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_60030")}), // 일별
                                    		 new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_60031")}), // 주별
                                    		 new sap.ui.core.Item({key : "3", text : oBundleText.getText("LABEL_60032")})] // 평균
                                })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch5,
                                    text: oBundleText.getText("LABEL_00100") // 조회
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
		
		////////////////////////////////////////////////////
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oFilter, new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Layout5")]
		});
		
		oLayout.setModel(oController._ListCondJSonModel);
		oLayout.bindElement("/Data5");
		
		return oLayout;
	}
});
