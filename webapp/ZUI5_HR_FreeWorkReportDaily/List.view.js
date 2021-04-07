$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_FreeWorkReportDaily.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_FreeWorkReportDaily.List";
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
								new sap.m.Label({
									text: oBundleText.getText("LABEL_48002"), // 부서/사원
									visible : {
                                    	path : "Werks",
                                    	formatter : function(fVal){
                                    		if(fVal && fVal.substring(0,1) != "D"){
                                    			return true;
                                    		} else {
                                    			return false;
                                    		}
                                    	}
                                    }
								}),
                                new sap.m.Input({
                                    width: "140px",
                                    value: "{Ename}",
                                    showValueHelp: true,
                                    valueHelpOnly: true,
                                    valueHelpRequest: oController.searchOrgehPernr,
                                    visible : {
                                    	path : "Werks",
                                    	formatter : function(fVal){
                                    		if(fVal && fVal.substring(0,1) != "D"){
                                    			return true;
                                    		} else {
                                    			return false;
                                    		}
                                    	}
                                    }
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
		
						// 근무일자, 사번, 성명, 부서, 유형, 요일
		var col_info = [{id: "Begda", label: oBundleText.getText("LABEL_64013"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "110px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_00191"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
						{id: "Ename", label: oBundleText.getText("LABEL_00121"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00155"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Rtext", label: oBundleText.getText("LABEL_64014"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Day", label: oBundleText.getText("LABEL_64015"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						// 출근시간, 퇴근시간, 재근시간, 소명시간
						{id: "Entbg", label: oBundleText.getText("LABEL_64016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Enten", label: oBundleText.getText("LABEL_64017"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Norwk", label: oBundleText.getText("LABEL_64018"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "PrchkW", label: oBundleText.getText("LABEL_64019"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						// 근태명, 근태인정시간, 추가인정시간, 비근무시간(PC OFF), 추가비근무시간
						{id: "Absence", label: oBundleText.getText("LABEL_64020"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Comtm", label: oBundleText.getText("LABEL_64021"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						{id: "Etctt", label: oBundleText.getText("LABEL_64022"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						{id: "Nonwt2", label: oBundleText.getText("LABEL_64023"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						{id: "Brktm1", label: oBundleText.getText("LABEL_64024"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
						// 법정휴게시간, 근무시간, 정상여부, 비고
						{id: "Brktm2", label: oBundleText.getText("LABEL_64025"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
						{id: "Workt3", label: oBundleText.getText("LABEL_64026"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Error", label: oBundleText.getText("LABEL_64027"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Reqrn", label: oBundleText.getText("LABEL_64028"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin"}];
		
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