$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_FlexworktimeStatus.m.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_FlexworktimeStatus.m.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_FLEX_TIME_SRV");
		
		var oCalendar = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [new sap.m.Toolbar({
						   height : "40px",
						   content : [new sap.m.Button({
									   	  type : "Transparent",
										  icon : "sap-icon://nav-back",
										  press : function(oEvent){
												oController.onSetYearMonth(-1);
										  },
										  tooltip : " "
									  }),
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Text({
									  	  text : {
								  	  		 parts : [{path : "Year"}, {path : "Month"}],
								  	  		 formatter : function(fVal1, fVal2){
								  	  		 	 return fVal1 + "." + (fVal2 < 10 ? "0" + fVal2 : fVal2);
								  	  		 }
									  	  }
									  }).addStyleClass("font-bold"),
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Button({
									  	  type : "Transparent",
										  icon : "sap-icon://navigation-right-arrow",
										  press : function(oEvent){
												oController.onSetYearMonth(1);
										  },
										  tooltip : " "
									  })]
					   }).addStyleClass("toolbarNoBottomLine"),
					   new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Calendar")]
		});
		
		// 휴가쿼터 현황
        var oTable1 = new sap.m.Table(oController.PAGEID + "_Table1", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: false,
			// growingThreshold: 5,
			mode: "None",
            columns: [
                new sap.m.Column ({
                    width: "30%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "70%",
                    hAlign: "End"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    cells: [
                        new sap.m.Text({ // 쿼터명
                            textAlign: "Begin",
                            text: "{Ktext}"
                        }),
                        new sap.m.Text({ // 발생/사용/잔여
                            textAlign: "Begin",
                            text: {
                            	parts : [{path : "Crecnt"}, {path : "Usecnt"}, {path : "Balcnt"}],
                            	formatter : function(fVal1, fVal2, fVal3){
                            		return  oBundleText.getText("LABEL_69023") + " " + parseFloat(fVal1) + " / " +
                            				oBundleText.getText("LABEL_69024") + " " + parseFloat(fVal2) + " / " +
                            				oBundleText.getText("LABEL_69025") + " " + parseFloat(fVal3)
                            	}
                            }
                        })
                    ]
                })
            }
        });
        
        oTable1.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout1 = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.Label({
	                    text: oBundleText.getText("LABEL_69020"), // 휴가쿼터 현황
	                    design: "Bold"
	                }).addStyleClass("sub-title"),
	                oTable1]
        }).addStyleClass("pt-10px");
        
        // 근태수당 현황
        var oTable2 = new sap.m.Table(oController.PAGEID + "_Table2", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: false,
			mode: "None",
            columns: [
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "End"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    cells: [
                        new sap.m.Text({
                            textAlign: "Begin",
                            text: "{Text}"
                        }),
                        new sap.m.Text({
                            textAlign: "Begin",
                            text: "{Value}"
                        })
                    ]
                })
            }
        });
        
        oTable2.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout2 = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.Label({
	                    text: oBundleText.getText("LABEL_69021"), // 근태수당 현황
	                    design: "Bold"
	                }).addStyleClass("sub-title"),
	                oTable2]
        }).addStyleClass("pt-10px");
        
        // 자율출퇴근 현황
		 var oTable3 = new sap.m.Table(oController.PAGEID + "_Table3", {
            inset: false,
			rememberSelections: false,
			noDataText: oBundleText.getText("LABEL_00901"),
			growing: false,
			mode: "None",
            columns: [
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "Begin"
                }),
                new sap.m.Column ({
                    width: "50%",
                    hAlign: "End"
                })
            ],
            items: {
                path: "/Data",
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Active,
                    counter: 5,
                    cells: [
                        new sap.m.Text({
                            textAlign: "Begin",
                            text: "{Text}"
                        }),
                        new sap.m.Text({
                            textAlign: "Begin",
                            text: "{Value}"
                        })
                    ]
                })
            }
        });
        
        oTable3.setModel(new sap.ui.model.json.JSONModel());
        
        var oLayout3 = new sap.m.VBox({
			fitContainer: true,
			items: [new sap.m.Label({
	                    text: oBundleText.getText("LABEL_69022"), // 자율출퇴근 현황
	                    design: "Bold"
	                }).addStyleClass("sub-title"),
	                oTable3]
        }).addStyleClass("pt-10px");
        
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
						contentContainerStyleClass: "app-content-container-mobile",
			            contentItems: [new sap.m.VBox({
							               items : [oCalendar, oLayout1, oLayout2, oLayout3]
							           })]
			        });
			        
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});