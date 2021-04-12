$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_Vacation.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_Vacation.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_LEAVE_APPL_SRV");
		
		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_48002") }), // 부서/사원
                                new sap.m.Input({
                                    width: "140px",
                                    value: "{Ename}",
                                    showValueHelp: true,
                                    valueHelpOnly: true,
                                    valueHelpRequest: oController.searchOrgehPernr
                                }),
                                new sap.m.Label({text: oBundleText.getText("LABEL_48003")}), // 대상기간
                                new sap.m.DateRangeSelection({
                                    displayFormat: gDtfmt,
                                    dateValue: "{Begda}",
                                    secondDateValue: "{Endda}",
                                    delimiter: "~",
                                    width: "210px"
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
			noData: oBundleText.getText("LABEL_00901"), // No data found
			rowHeight: 37,
			columnHeaderHeight: 38,
			cellClick : oController.onPressTable,
			rowActionCount : 1,
			rowActionTemplate : [new sap.ui.table.RowAction({
									 items : [new sap.ui.table.RowActionItem({
											 	  type : "Navigation",
											 	  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
											 	  press : function(oEvent){
											 	  		oController.onPressTable(oEvent, "X");
											 	  }
											  })]
								 })],
			rowSettingsTemplate : [new sap.ui.table.RowSettings({
									   highlight : {
									   		path : "Status1",
									   		formatter : function(fVal){
									   			if(fVal == "AA"){ // 작성중
									   				return "Indication01";
									   			} else if(fVal == "00"){ // 결재중
									   				return "Indication02";
									   			} else if(fVal == "88"){ // 반려
									   				return "Indication03";
									   			} else if(fVal == "99"){ // 결재완료
									   				return "Indication04";
									   			} else {
									   				return "None";
									   			}
									   		}
									   }
								   })],
			extension : [new sap.m.Toolbar({
							 height : "52px",
							 content : [new sap.m.ToolbarSpacer(),
										new sap.m.HBox({
				                            items: [
				                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
				                                new sap.m.Label({text: oBundleText.getText("LABEL_00196")}).addStyleClass("custom-legend-item"), // 미결재
				                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
				                                new sap.m.Label({text: oBundleText.getText("LABEL_00197")}).addStyleClass("custom-legend-item"), // 결재중
				                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-purple"),
				                                new sap.m.Label({text: oBundleText.getText("LABEL_00201")}).addStyleClass("custom-legend-item"), // 담당자확인
				                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
				                                new sap.m.Label({text: oBundleText.getText("LABEL_00198")}).addStyleClass("custom-legend-item"), // 반려
				                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
				                                new sap.m.Label({text: oBundleText.getText("LABEL_00199")}).addStyleClass("custom-legend-item") // 결재완료
				                            ]
				                        }).addStyleClass("custom-legend-group mr-20px"),
				                        new sap.m.HBox({
				                            items: [
				                                new sap.m.Button({
				                                    text: oBundleText.getText("LABEL_00129"), // Excel
				                                    press: oController.onExport
				                                }).addStyleClass("button-light"),
				                                new sap.m.Button({
				                                    text: oBundleText.getText("LABEL_48045"), // 신규신청
				                                    press : oController.onPressNew
				                                }).addStyleClass("button-light"),
				                                new sap.m.Button({
				                                    text: oBundleText.getText("LABEL_48046"), // 삭제신청
				                                    // press : oController.onPressNew
				                                }).addStyleClass("button-light")
				                            ]
				                        }).addStyleClass("button-group")]
						 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 구분, 사번, 성명, 근태, 근태기간, 일수, 행선지, 연락처, 근태사유, 결재상태
		var col_info = [/*{id: "111", label: oBundleText.getText("LABEL_48047"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},*/
						{id: "Pernr", label: oBundleText.getText("LABEL_48004"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_48005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Atext", label: oBundleText.getText("LABEL_48006"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Period", label: oBundleText.getText("LABEL_48007"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%"},
						{id: "Kaltg", label: oBundleText.getText("LABEL_48008"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Desti", label: oBundleText.getText("LABEL_48009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Telnum", label: oBundleText.getText("LABEL_48010"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Bigo", label: oBundleText.getText("LABEL_48011"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "25%", align : "Begin"},
						{id: "Stext1", label: oBundleText.getText("LABEL_48012"), plabel: "", resize: true, span: 0, type: "link", sort: true, filter: true}];
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				oController._Columns = [];
				for(var i=0; i<col_info.length; i++){
					var column = {};
						column.label = col_info[i].plabel == "" ? col_info[i].label : (col_info[i].label + "-" + col_info[i].plabel);
						column.property = col_info[i].id;
						column.type = "string";
						column.width = 20;
					oController._Columns.push(column);
				}
			}
		});
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_48001")}).addStyleClass("app-title")] // 근태신청
								  }).addStyleClass("app-title-container"),
							//	  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oFilter,
							//	  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oTable,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			showHeader : false,
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});