sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail01", {
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
                                new sap.m.Input({
						         	value : "{Zyymm}",
						         	placeholder : "YYYY.MM",
						         	maxLength : 7,
                                	width : "200px",
                                	submit : oController.onPressSearch1,
						         	liveChange : function(oEvent){
						         		if(oEvent.getParameters().value.length == 6 && oEvent.getParameters().value.indexOf(".") == -1){
						         			oEvent.getSource().setValue(oEvent.getParameters().value.substring(0,4) + "." + oEvent.getParameters().value.substring(4,6));
						         		}
						         	}
								})
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch1,
                                    text: oBundleText.getText("LABEL_00100") // 조회
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table1", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			rowHeight: 37,
			columnHeaderHeight: 38
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		
		////////////////////////////////////////////////////
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oFilter, oTable]
		});
		
		oLayout.setModel(oController._ListCondJSonModel);
		oLayout.bindElement("/Data1");
		
		return oLayout;
	}
});
