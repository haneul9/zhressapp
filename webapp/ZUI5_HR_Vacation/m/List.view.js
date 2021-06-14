$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_Vacation.m.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_Vacation.m.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_LEAVE_APPL_SRV");
		$.app.setModel("ZHR_BATCHAPPROVAL_SRV");
		
		var oFilter = new sap.m.FlexBox({
			fitContainer: true,
			items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.FlexBox({
								items: [
									new sap.m.DateRangeSelection({
	                                    displayFormat: gDtfmt,
	                                    dateValue: "{Begda}",
	                                    secondDateValue: "{Endda}",
	                                    delimiter: "~"
	                                })
								]
							}).addStyleClass("search-field-group"),
							new sap.m.FlexBox({
								items: [
									new sap.m.Button({
										icon : "sap-icon://search",
										press : oController.onPressSearch
									}).addStyleClass("button-search")
								]
							}).addStyleClass("button-group")
						]
					})
				]
		}).addStyleClass("search-box-mobile h-auto");
		
		// 신청내역
        var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: true,
			growingThreshold: 5,
			mode: "MultiSelect",
            columns: [
                new sap.m.Column ({
                    width: "40%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "60%",
                    hAlign: "End"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
                    press : oController.onSelectTable,
                    cells: [
                        new sap.m.VBox({
                        	items : [new sap.m.Text({ // 구분
                        				 text: "{Delapptx}"
                        			 }),
			                         new sap.m.Text({ // 결재상태
			                         	 text : "{Stext1}"
			                         })]
                        }),
                        new sap.m.VBox({
                        	items : [new sap.m.Text({ // 근태기간
			                             text: "{Period}"
			                         }),
			                         new sap.m.Text({ // 근태
			                         	 text : {
			                         	 	parts : [{path : "Beguz"}, {path : "Enduz"}, {path : "Atext"}],
			                         	 	formatter : function(fVal1, fVal2, fVal3){
			                         	 		var tmp = "";
			                         	 		
			                         	 		if((fVal1 && fVal2) && (fVal1 != "" && fVal2 != "")){
			                         	 			tmp = "(" + fVal1.substring(0,2) + ":" + fVal1.substring(2,4) + " ~ " + fVal2.substring(0,2) + ":" + fVal2.substring(2,4) + ") ";
			                         	 		}
			                         	 		
			                         	 		tmp = tmp + fVal3;
			                         	 		
			                         	 		return tmp;
			                         	 	}
			                         	 }
			                         })]
                        })
                    ]
                })
            }
        });
        
        oTable.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.FlexBox({
						justifyContent : "SpaceBetween",
						items : [new sap.m.FlexBox({
									 items : [new sap.m.Label({
							                      text: oBundleText.getText("LABEL_48065"), // 신청내역
							                      design: "Bold"
							                  }).addStyleClass("sub-title")]
								 }),
				                 new sap.m.FlexBox({
				                 	 alignItems : "End",
				                 	 items : [new sap.m.Button({
							                 	  text: oBundleText.getText("LABEL_48045"), // 신규신청
							                 	  press : oController.onPressNew
							                  }).addStyleClass("button-light pr-5px"),
							                  new sap.m.Button({
				                                    text: oBundleText.getText("LABEL_48046"), // 삭제신청
				                                    press : oController.onPressDelete
				                              }).addStyleClass("button-light")]
				                 })]
					}).addStyleClass("info-box"),
	                oTable]
        });
        
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
						contentContainerStyleClass: "app-content-container-mobile",
			            contentItems: [new sap.m.VBox({
							               items : [oFilter, oLayout]
							           })]
			        });
			
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});