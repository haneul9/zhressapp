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
		
						// No,  상태, 근무일자, 사번, 성명, 근무형태
		var col_info = [{id: "No", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Status", label: oBundleText.getText("LABEL_67004"), plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true},
						{id: "Begda", label: oBundleText.getText("LABEL_67005"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
						{id: "Pernr", label: oBundleText.getText("LABEL_00191"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_00121"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Rtext", label: oBundleText.getText("LABEL_67006"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 입문시간, 출문시간, 근태여부, 신청유형
						{id: "Entbg", label: oBundleText.getText("LABEL_67007"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
						{id: "Enten", label: oBundleText.getText("LABEL_67008"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
						{id: "Tprog1", label: oBundleText.getText("LABEL_67009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						{id: "Tprog1", label: oBundleText.getText("LABEL_67010"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						// 출근시간, 퇴근시간, 인정시간, 반려사유
						{id: "Enfbg", label: oBundleText.getText("LABEL_67011"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
						{id: "Enfen", label: oBundleText.getText("LABEL_67012"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
						{id: "Time", label: oBundleText.getText("LABEL_67013"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						{id: "Retrn", label: oBundleText.getText("LABEL_67014"), plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "30%"}];
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oTable]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});