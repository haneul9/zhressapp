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
        
        // summary
        var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
        	columns : 7,
        	width : "100%",
        	widths : ["", "", "", "", "", "", ""],
        	rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
        			new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63003"), textAlign : "Center"}).addStyleClass("font-bold")], // 소정근로시간\n(평일X8H)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63004"), textAlign : "Center"}).addStyleClass("font-bold")], // 근무시간(평일)\n(A)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63005"), textAlign : "Center"}).addStyleClass("font-bold")], // 연장근로\n(B)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63006"), textAlign : "Center"}).addStyleClass("font-bold")], // 휴일근로\n(C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63007"), textAlign : "Center"}).addStyleClass("font-bold")], // 연장+휴일\n(B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63008"), textAlign : "Center"}).addStyleClass("font-bold")], // 근로시간합계\n(A+B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63010"), textAlign : "Center"}).addStyleClass("font-bold")], // 비고
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2")]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Ctrnm}"})], // 소정근로시간\n(평일X8H)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Wrktm}"})], // 근무시간(평일)\n(A)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Exttm}"})], // 연장근로\n(B)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Holtm}"})], // 휴일근로\n(C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Extholtm}"})], // 연장+휴일\n(B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Tottm}"})], // 근로시간합계\n(A+B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({ // 비고
							        			 	// text : "{Notes}"
							        			 	text : {
							        			 		parts : [{path : "Ctrnm"}, {path : "Tottm"}, {path : "Notes"}],
							        			 		formatter : function(fVal1, fVal2, fVal3){
							        			 			this.removeStyleClass("color-info-red color-blue");
							        			 			
							        			 			if(fVal1 && fVal2){
							        			 				if(fVal1.replace(":", "") > fVal2.replace(":", "")){
							        			 					this.addStyleClass("color-info-red");
							        			 				} else {
							        			 					this.addStyleClass("color-blue");
							        			 				}
							        			 			}
							        			 			
							        			 			return fVal3;
							        			 		}
							        			 	}
							        		 	}).addStyleClass("font-bold")],
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data")]
		        	})]
        });
        
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
			rowSettingsTemplate : [new sap.ui.table.RowSettings({
									   highlight : {
									   		path : "Monyn",
									   		formatter : function(fVal){
									   			return fVal != "" ? "Error" : "None";
									   		}
									   }
								   })],
			extension : [new sap.m.Toolbar({
							 height : "40px",
							 content : [new sap.m.MessageStrip({
										 	type : "Error",
										 	text : oBundleText.getText("MSG_69001") // 작업 후에는 반드시 저장하여 주십시오. 저장이 완료되면 수정이 Clear 됩니다.
										}),
										new sap.m.ToolbarSpacer(),
										new sap.m.Button({
		                                    text: oBundleText.getText("LABEL_69014"), // 근무일정 일괄입력
		                                    press : oController.onOpenWorktime
		                                }).addStyleClass("button-light"),
										new sap.m.Button({
		                                    text: oBundleText.getText("LABEL_00101"), // 저장
		                                    press : oController.onPressSave
		                                }).addStyleClass("button-dark")]
						 }).addStyleClass("toolbarNoBottomLine mb-10px")],
			noData: oBundleText.getText("LABEL_00901") // No data found
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Checkbox", label: "", plabel: "", resize: true, span: 0, type: "checkbox", sort: true, filter: true, width : "60px"},
						// 수정, 일자, 요일, 근태
						{id: "Monyn", label: oBundleText.getText("LABEL_69002"), plabel: "", resize: true, span: 0, type: "icon", sort: true, filter: true, width : "60px"},
						{id: "Datum", label: oBundleText.getText("LABEL_69003"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
						{id: "Weektx", label: oBundleText.getText("LABEL_69004"), plabel: "", resize: true, span: 0, type: "weektx", sort: true, filter: true, width : "60px"},
						{id: "Atext", label: oBundleText.getText("LABEL_69005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// 시작시간, 종료시간, 점심시간, 추가휴게
						{id: "Beguz", label: oBundleText.getText("LABEL_69006"), plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
						{id: "Enduz", label: oBundleText.getText("LABEL_69007"), plabel: "", resize: true, span: 0, type: "timepicker", sort: true, filter: true},
						{id: "Lnctm", label: oBundleText.getText("LABEL_69008"), plabel: "", resize: true, span: 0, type: "combobox", sort: true, filter: true},
						{id: "Adbtm", label: oBundleText.getText("LABEL_69009"), plabel: "", resize: true, span: 0, type: "input", sort: true, filter: true},
						// 소정근로, 연장근로, 휴일근로
						{id: "Wrktm", label: oBundleText.getText("LABEL_69010"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Exttm", label: oBundleText.getText("LABEL_69011"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true},
						{id: "Holtm", label: oBundleText.getText("LABEL_69012"), plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oMatrix1, oTable]
			        });
			        
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});