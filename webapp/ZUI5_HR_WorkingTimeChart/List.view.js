$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_WorkingTimeChart.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_WorkingTimeChart.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_WORKSCHEDULE_SRV");
		
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
                                    width: "150px",
                                    selectedKey: "{Werks}",
                                    editable : (gAuth == "H" ? true : false)
                                }),
                                new sap.m.Label({text: oBundleText.getText("LABEL_00122")}), // 소속부서
                                new sap.m.MultiInput(oController.PAGEID + "_Orgeh",{
                                	width : "200px",
									showValueHelp : true,
									valueHelpOnly: true,
									valueHelpRequest : oController.displayMultiOrgSearchDialog
							    }),
							    new sap.m.Label({text: oBundleText.getText("LABEL_41002")}), // 대상자
                                new sap.m.MultiInput(oController.PAGEID + "_Ename", {
                                	width : "150px",
									showValueHelp: true,
					        	    valueHelpOnly: true,
					        	    enableMultiLineMode : true,
									valueHelpRequest : oController.onSearchUser
							    }),
							    new sap.m.Label({text: oBundleText.getText("LABEL_46002")}), // 근무구분
                                new sap.m.ComboBox({
                                	width : "150px",
									selectedKey : "{Wrkty}",
									items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_46003")}),  // 선택적근로
											 new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_46004")})], // 고정근로
									change : function(oEvent){
										if(oEvent.getSource().getSelectedItem()){
											var dates = oController.onTimeDatePeriod(oController._ListCondJSonModel.getProperty("/Data/Begda"));
											oController._ListCondJSonModel.setProperty("/Data/Begda", dates[0]);
											oController._ListCondJSonModel.setProperty("/Data/Endda", dates[1]);
										}
									}
							    }),
							    new sap.m.Label({text: oBundleText.getText("LABEL_46005")}), // Week
                                new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
						            value : "{Begda}",
									width : "150px",
									textAlign : "Begin",
									change : oController.onChangeDate
							    }),
							    new sap.m.Text({text : " ~ "}).addStyleClass("pt-8px pl-5px pr-5px"),
							    new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
						            value : "{Endda}",
									width : "150px",
									textAlign : "Begin",
									change : oController.onChangeDate,
									editable : false
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
        
    	// 기본/연장시간 추이
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
				content : [new sap.m.Text({text : oBundleText.getText("LABEL_46006")}).addStyleClass("sub-title"), // 기본/연장시간 추이
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
					name : oBundleText.getText("LABEL_46008"), // 주차
					value : "{Weektx}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_46010"), // 연장근무
					value : "{Addhr}"  
				},
				{
					name : oBundleText.getText("LABEL_46009"), // 기본근무
					value : "{Bashr}"  
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
			vizType : "stacked_column",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_46010"), oBundleText.getText("LABEL_46009")]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_46008")]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
//	                    formatString:formatPattern.SHORTFLOAT,
	                    visible: true
	                },
	                colorPalette :  ["#ff8888", "#5CBAE6"],
	                dataShape: {
		                primaryAxis: ["bar", "bar"]
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
		
		// 근무시간 상세현황
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
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_46007")}).addStyleClass("sub-title"), // 근무시간 상세현황
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
						   items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_46011")}),	// 부서별
							   		new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_46012")})]	// 직원별
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
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Button({
											  	  icon : "sap-icon://nav-back",
											  	  type : "Default",
											  	  press : oController.onBack,
											  	  visible : {
												  	  	path : "FromPageId",
												  	  	formatter : function(fVal){
												  	  		return (fVal && fVal != "") ? true : false;
												  	  	}
											  	  }
											  }),
											  new sap.ui.core.HTML({
											  	  content : "<div style='width:10px' />",
											  	  visible : {
											  	  		path : "FromPageId",
											  	  		formatter : function(fVal){
											  	  			return (fVal && fVal != "") ? true : false;
											  	  		}
											  	  }
											  }),
											  new sap.m.Text({text: oBundleText.getText("LABEL_46001")}).addStyleClass("app-title")] // 근로시간현황
								  }).addStyleClass("app-title-container"),
								  oFilter,
								  //new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  new sap.ui.layout.VerticalLayout({
									  content : [oContent1, oLayout]
								  }),
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