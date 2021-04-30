$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_RationaleApproval.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_RationaleApproval.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_BATCHAPPROVAL_SRV");
		
		oController.setupView.call(oController);

		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_67002")}), // 결재건수
                                new sap.m.Input({
									value : "{Count}",
									width : "150px",
									editable : false
							    })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSave,
                                    text: oBundleText.getText("LABEL_67003") // 결재
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "MultiToggle",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			rowHeight: 37,
			columnHeaderHeight: 38,
			fixedColumnCount : 5,
			rowSelectionChange : oController.onSelectionChange
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oTable]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});