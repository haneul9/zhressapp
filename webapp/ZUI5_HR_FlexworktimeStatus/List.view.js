$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_FlexworktimeStatus.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_FlexworktimeStatus.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_FLEX_TIME_SRV");
		
		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_69013")}), // 대상연월
							    new sap.m.DatePicker({
									valueFormat : "yyyyMM",
						            displayFormat : "yyyy.MM",
						            value : "{Zyymm}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
								}),
								new sap.m.Label({
									text: oBundleText.getText("LABEL_48002"), // 부서/사원
									visible : {
                                    	path : "Werks",
                                    	formatter : function(fVal){
                                    		if(gAuth == "M"){
                                    			return true;	
                                    		} else {
                                    			if(fVal && fVal.substring(0,1) != "D"){
	                                    			return true;
	                                    		} else {
	                                    			return false;
	                                    		}
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
                                    		if(gAuth == "M"){
                                    			return true;	
                                    		} else {
                                    			if(fVal && fVal.substring(0,1) != "D"){
	                                    			return true;
	                                    		} else {
	                                    			return false;
	                                    		}
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
		
						// 수정, 일자, 요일, 근태
		var col_info = [{id: "Monyn", label: oBundleText.getText("LABEL_69002"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "50px"},
						{id: "Datum", label: oBundleText.getText("LABEL_69003"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
						{id: "Weektx", label: oBundleText.getText("LABEL_69004"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "50px"},
						{id: "Atext", label: oBundleText.getText("LABEL_69005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 시작시간, 종료시간, 점심시간, 추가휴게
						{id: "Beguz", label: oBundleText.getText("LABEL_69006"), plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
						{id: "Enduz", label: oBundleText.getText("LABEL_69007"), plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
						{id: "Lnctm", label: oBundleText.getText("LABEL_69008"), plabel: "", resize: true, span: 0, type: "combobox", sort: true, filter: true},
						{id: "Adbtm", label: oBundleText.getText("LABEL_69009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 소정근로, 연장근로, 휴일근로
						{id: "Wrktm", label: oBundleText.getText("LABEL_69010"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Exttm", label: oBundleText.getText("LABEL_69011"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Holtm", label: oBundleText.getText("LABEL_69012"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oTable]
			        });
			        
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});