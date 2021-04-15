$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_OvertimeReport.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_OvertimeReport.List";
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
                                })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch,
                                    text: oBundleText.getText("LABEL_00100") // 조회
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
        
    	var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: oBundleText.getText("LABEL_00901") // No data found
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 사번, 성명, 부, 과
		var col_info = [{id: "Pernr", label: oBundleText.getText("LABEL_48004"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_48005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Stext", label: oBundleText.getText("LABEL_61002"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Stext1", label: oBundleText.getText("LABEL_61003"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 일자, 출근, 퇴근, 호출, 시간, 초과, 심야, 연장근무내역
						{id: "Begda", label: oBundleText.getText("LABEL_61004"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
						{id: "Beguz", label: oBundleText.getText("LABEL_61005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Enduz", label: oBundleText.getText("LABEL_61006"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Call", label: oBundleText.getText("LABEL_61007"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Stdaz", label: oBundleText.getText("LABEL_61008"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Ovtim", label: oBundleText.getText("LABEL_61009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Ngtim", label: oBundleText.getText("LABEL_61010"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Jobco", label: oBundleText.getText("LABEL_61011"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "30%", align : "Begin"}];
		
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