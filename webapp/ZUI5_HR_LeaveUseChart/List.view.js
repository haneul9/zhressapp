$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_LeaveUseChart.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_LeaveUseChart.List";
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
                                new sap.m.Label({text: oBundleText.getText("LABEL_27002")}), // 인사영역
                                new sap.m.ComboBox(oController.PAGEID + "_Werks", {
                                    width: "200px",
                                    selectedKey: "{Werks}",
                                    editable : (gAuth == "H" ? true : false)
                                }),
                                new sap.m.Label({
							    	text: oBundleText.getText("LABEL_48002"), // 부서/사원
							    }),
                                new sap.m.Input({
                                    width: "200px",
                                    value: "{Ename}",
                                    showValueHelp: true,
                                    valueHelpOnly: true,
                                    valueHelpRequest: oController.searchOrgehPernr,
                                    editable : {
                                    	path : "Chief",
                                    	formatter : function(fVal){
                                    		return ($.app.APP_AUTH == "M" && fVal == "") ? false : true;
                                    	}
                                    }
                                }),
							    new sap.m.Label({text: oBundleText.getText("LABEL_41003")}), // 조회연월
                                new sap.m.DatePicker({
									valueFormat : "yyyyMM",
						            displayFormat : "yyyy.MM",
						            value : "{Zyymm}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
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
        
    	// 월별 연차사용률 월별 추이			
		var oToolbar = new sap.m.Toolbar(oController.PAGEID + "_Toolbar1", {
				height : "40px",
				visible : {
					path : "Key",
				    formatter : function(fVal){
					   if(fVal == "1") return true;
					   else if(fVal == "2") return true;
					   else if(fVal == "3") return false;
					   else return false;
				    }
				},
				content : [new sap.m.Text({text : oBundleText.getText("LABEL_41008")}).addStyleClass("sub-title"),
						   new sap.m.ToolbarSpacer(),
						   new sap.m.SegmentedButton(oController.PAGEID + "_SegmentButton1", {
							   width : "100px",
							   items : [
								   new sap.m.SegmentedButtonItem({
									   icon : "sap-icon://chart-table-view",
									   key : "1",
									   press : oController.onPressSegmentedButton
								   }),
								   new sap.m.SegmentedButtonItem({
									   icon : "sap-icon://bar-chart",
									   key : "2",
									   press : oController.onPressSegmentedButton
								   }),
								   new sap.m.SegmentedButtonItem({
									   icon : "sap-icon://table-view",
									   key : "3",
									   press : oController.onPressSegmentedButton
								   })
							   ],
							   selectedKey : "{Key}",
							   visible : {
								   path : "Key",
								   formatter : function(fVal){
									   if(fVal == "1") return true;
									   else if(fVal == "2") return true;
									   else if(fVal == "3") return false;
									   else return false;
								   }
							   }
						   })]
	    }).addStyleClass("toolbarNoBottomLine");
					   
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : oBundleText.getText("LABEL_41003"),
					value : "{Zyymm}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_41004"),
					value : "{Monrte}"  
				},
				{
					name : oBundleText.getText("LABEL_41005"),
					value : "{Cumrte}"  
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var formatPattern = sap.viz.ui5.format.ChartFormatter.DefaultPattern;
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart", {
			width : "100%",
			height : "400px",
			vizType : "combination",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_41004"), oBundleText.getText("LABEL_41005")]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_41003")]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
//	                    formatString:formatPattern.SHORTFLOAT,
	                    visible: true
	                },
	                colorPalette :  ["#5CBAE6", "#ff9900"],
	                dataShape: {
		                primaryAxis: ["bar", "line"]
		            },
		            line : {
		            	marker:{
		            		size : 4
		            	},
		            	width : 1
		            }
				},
				// legend: {
				// 	label: {
				// 		style: {
				// 			fontFamily: "'Noto Sans CJK KR Regular', sans-serif"
				// 		}
				// 	}
				// },
				legendGroup: {
					layout : {
						alignment: "center",
						position: "bottom"
					}
				},
	            valueAxis: {
	                label: {
//	                    formatString: formatPattern.SHORTFLOAT
						allowDecimals : false
	                },
	                title: {
	                    visible: false
	                }
	            },
	            categoryAxis: {
	                title: {
	                    visible: false
	                }
	            },
	            title: {
	            	text : "",
	                visible: false
	            },
	            interaction : { 
	            	selectability : { 
	            		mode : "single" 
	            	} 
	            },
			}
		});
		
		oVizFrame.setModel(new sap.ui.model.json.JSONModel());

		var oPopOver = new sap.viz.ui5.controls.Popover();
			oPopOver.connect(oVizFrame.getVizUid());

		var oContent1 = new sap.m.ScrollContainer(oController.PAGEID + "_ScrollContainer", {
			horizontal : false,
			vertical : false,
			width : "100%",
			content : [oToolbar, oVizFrame],
			visible : {
			   path : "Key",
			   formatter : function(fVal){
				   if(fVal == "1") return true;
				   else if(fVal == "2") return true;
				   else if(fVal == "3") return false;
				   else return false;
			   }
		   }
		});
		
		// XX별 연차사용현황
		var oToolbar2 = new sap.m.Toolbar(oController.PAGEID + "_Detail", { 
			height : "40px",
			visible : {
				path : "Key",
			    formatter : function(fVal){
				   if(fVal == "1") return true;
				   else if(fVal == "2") return false;
				   else if(fVal == "3") return true;
				   else return false;
			    }
			},
			content : [new sap.m.Text({
						   text : {
						   		path : "Disty",
						   		formatter : function(fVal){	// 부서별 연차사용현황			  개인별 연차사용현황
						   			return fVal == "1" ? oBundleText.getText("LABEL_41039") : oBundleText.getText("LABEL_41040");
						   		}
						   }
					   }).addStyleClass("sub-title"),
					   new sap.m.ToolbarSpacer(),
					   new sap.ui.core.Icon({
						   src : "sap-icon://excel-attachment",
						   size : "1.0rem", 
						   color : "#002060",
						   press : oController.onExport
					   }).addStyleClass("cursorPointer"),
					   new sap.m.ToolbarSpacer({width : "5px"}),
					   new sap.m.ComboBox({
						   selectedKey : "{Disty}",
						   width : "130px",
						   change : oController.setTable,
						   items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_41006")}),	// 부서별
							   		new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_41007")})]	// 직원별
					   }),
					   new sap.m.SegmentedButton(oController.PAGEID + "_SegmentButton2", {
						   width : "100px",
						   items : [new sap.m.SegmentedButtonItem({
								        icon : "sap-icon://chart-table-view",
									    key : "1",
									    press : oController.onPressSegmentedButton
								    }),
								    new sap.m.SegmentedButtonItem({
									    icon : "sap-icon://bar-chart",
									    key : "2",
									    press : oController.onPressSegmentedButton
								    }),
								    new sap.m.SegmentedButtonItem({
									    icon : "sap-icon://table-view",
									    key : "3",
									    press : oController.onPressSegmentedButton
								    })],
						   selectedKey : "{Key}",
						   visible : {
							   path : "Key",
							   formatter : function(fVal){
								   if(fVal == "1") return false;
								   else if(fVal == "2") return false;
								   else if(fVal == "3") return true;
								   else return false;
							   }
						   }
					    })]
		}).addStyleClass("toolbarNoBottomLine");
		
		var oContent2 = new sap.m.ScrollContainer(oController.PAGEID + "_ScrollContainer2", {
			horizontal : false,
			vertical : false,
			width : "100%",
			content : []
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oToolbar2, oContent2],
		    visible : {
			   path : "Key",
			   formatter : function(fVal){
				   if(fVal == "1") return true;
				   else if(fVal == "2") return false;
				   else if(fVal == "3") return true;
				   else return false;
			   }
			}
		});
		
		var oDetail = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oContent1, oLayout]
		});
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oDetail]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
		
		// var oContent = new sap.m.FlexBox({
		// 	  justifyContent: "Center",
		// 	  fitContainer: true,
		// 	  items: [new sap.m.FlexBox({
		// 				  direction: sap.m.FlexDirection.Column,
		// 				  items: [new sap.m.FlexBox({
		// 							  alignItems: "End",
		// 							  fitContainer: true,
		// 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_41001")}).addStyleClass("app-title")] // 연차사용현황
		// 						  }).addStyleClass("app-title-container"),
		// 						  oFilter,
		// 						  //new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
		// 						  oContent1,
		// 						  oLayout,
		// 						  new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
		// 			  }).addStyleClass("app-content-container-wide")]
		// }).addStyleClass("app-content-body");
				
		// /////////////////////////////////////////////////////////

		// var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
		// 	// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
		// 	showHeader : false,
		// 	content: [oContent]
		// }).addStyleClass("app-content");
		
		// oPage.setModel(oController._ListCondJSonModel);
		// oPage.bindElement("/Data");

		// return oPage;
	}
});