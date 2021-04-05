sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail02", {
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
						            value : "{Datum}",
									width : "200px",
									textAlign : "Begin",
									editable : false
							    })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch2,
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
			content : [oFilter, new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Layout2")]
		});
		
		oLayout.setModel(oController._ListCondJSonModel);
		oLayout.bindElement("/Data2");
		
		return oLayout;
	}
});
