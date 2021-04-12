sap.ui.jsfragment("fragment.EvalResult2", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.SearchEvalResult");
		jQuery.sap.require("common.JSONModelHelper");
		jQuery.sap.require("common.makeTable");
		jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");
		jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChartData");
		jQuery.sap.includeStyleSheet("css/dashboard.css");
		
		common.SearchEvalResult.oController = oController;
		
		var oHeader = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["360px", "360px", "", "50px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Image({
																   src : "{photo}",
																   width : "55px",
																   height : "55px"
															   }).addStyleClass("roundImage"),
															   new sap.ui.layout.VerticalLayout({
															   	   content : [new sap.ui.layout.HorizontalLayout({
																		   	   	  content : [new sap.m.Text({text : "{nickname}"}).addStyleClass("Font20 FontBold"),
																		   	   				 new sap.m.Text({text : "{title}"}).addStyleClass("Font15 paddingLeft5 paddingTop2")]
																		   	  }),
															   				  new sap.m.Text({text : "{department} / {custom01}"}).addStyleClass("info2")]
															   }).addStyleClass("paddingLeft10 paddingTop3")]
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).bindElement("/user"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.VerticalLayout({
											 	 	content : [new sap.suite.ui.microchart.ColumnMicroChart({
														 	 	   showTopLabels: true,
																   showBottomLabels: true,
																   allowColumnLabels: true,
																   columns : {
																   		path : "/summary",
																   		template : new sap.suite.ui.microchart.ColumnMicroChartData({
																			   		   color : {
																			   		   		path : "key",
																			   		   		formatter : function(fVal){
																			   		   			return fVal == "9" ? "Good" : "Neutral";
																			   		   		}
																			   		   },
																			   		   label : "{label}",
																			   		   value : "{value}",
																			   		   displayValue : "{value}"
																			   	   }) 
																   }
														 	   })],
													visible : {
														path : "Key",
														formatter : function(fVal){
															return fVal == "2" ? true : false;
														}
													}
											 	})]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText(common.SearchEvalResult.PAGEID + "_Status", {width: "42px", height: "42px", htmlText: "<em>Loading</em>"}).addStyleClass("spinner-evalresult")],
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		oHeader.setModel(common.SearchEvalResult._JSONModel);
		oHeader.bindElement("/user");
		
		common.SearchEvalResult._StatusMessage = new sap.m.MessagePopover({
													 placement : "Bottom",
													 items : {
												 		path : "/Data",
												 		template : new sap.m.MessageItem({type : "{Type}", title : "{Text}"})
													 }
												 }).addStyleClass("sapUiSizeCompact");
		common.SearchEvalResult._StatusMessage.setModel(common.SearchEvalResult._MessageJSONModel);
		
		var oTable = new sap.ui.table.Table(common.SearchEvalResult.PAGEID + "_Table", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "Single",
				selectionBehavior : "RowOnly",
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1,
				cellClick : common.SearchEvalResult.onCellClick
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// (선택여부), 평가연도, 업적평가, 역량평가, 다면평가, 1차평가, 2차평가, 평가세션
		var col_info = [{id: "Select", label : "", plabel : "", span : 0, type : "select", sort : false, filter : false, width : "50px"},
						{id: "Appye", label : common.SearchEvalResult.oBundleText.getText("LABEL_12101"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade1", label : common.SearchEvalResult.oBundleText.getText("LABEL_12102"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade2", label : common.SearchEvalResult.oBundleText.getText("LABEL_12103"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade3", label : common.SearchEvalResult.oBundleText.getText("LABEL_12104"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade4", label : common.SearchEvalResult.oBundleText.getText("LABEL_12105"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade5", label : common.SearchEvalResult.oBundleText.getText("LABEL_12106"), plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Grade6", label : common.SearchEvalResult.oBundleText.getText("LABEL_12107"), plabel : "", span : 0, type : "string", sort : false, filter : false}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		///////////////////////////////////////////////////////
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			widths : [""],
			rows : [//new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oHeader]})]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({content : [oTable]})]
					})]
		});
		
		var oSectionLayout = new sap.uxap.ObjectPageLayout(common.SearchEvalResult.PAGEID + "ObjectPageLayout", {
			enableLazyLoading : false,
			showTitleInHeaderContent : false,
			alwaysShowContentHeader : true,
			useIconTabBar :	true,
			headerContent : [oContent],
			navigate : common.SearchEvalResult.onChangeSection,
			sections : [new sap.uxap.ObjectPageSection(common.SearchEvalResult.PAGEID + "ObjectPageLayoutSection1", {
							customAnchorBarButton : [new sap.m.Button({
														 text : {
														 	path : "Key",
														 	formatter : function(fVal){
														 		if(fVal){
														 			if(this.sId.indexOf("clone") != -1){
														 				this.removeStyleClass("objectPageCustom_Select objectPageCustom_NoSelect");
																 		if(fVal == "1"){
																 			this.addStyleClass("objectPageCustom_Select");
																 		} else {
																 			this.addStyleClass("objectPageCustom_NoSelect");
																 		}
														 			}
														 		}
														 		
														 		return common.SearchEvalResult.oBundleText.getText("LABEL_12108"); // 업적 & 역량평가
														 	}
														 }
													 })],
							title : common.SearchEvalResult.oBundleText.getText("LABEL_12108"), // 업적 & 역량평가
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.SearchEvalResult.makeMatrix4().bindElement("/Data2")]
										   })]
						}),
						new sap.uxap.ObjectPageSection(common.SearchEvalResult.PAGEID + "ObjectPageLayoutSection2", {
							customAnchorBarButton : [new sap.m.Button({
														 text : {
														 	path : "Key",
														 	formatter : function(fVal){
														 		if(fVal){
														 			if(this.sId.indexOf("clone") != -1){
														 				this.removeStyleClass("objectPageCustom_Select objectPageCustom_NoSelect");
																 		if(fVal == "2"){
																 			this.addStyleClass("objectPageCustom_Select");
																 		} else {
																 			this.addStyleClass("objectPageCustom_NoSelect");
																 		}
														 			}
														 		}
														 		
														 		return common.SearchEvalResult.oBundleText.getText("LABEL_12104"); // 다면평가
														 	}
														 }
													 })],
							title : common.SearchEvalResult.oBundleText.getText("LABEL_12104"), // 다면평가
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [new sap.ui.layout.VerticalLayout({
														   	 content : [common.SearchEvalResult.makeMatrix1("0").bindElement("/Data/0"), // 업적평가
														   				new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
														   				common.SearchEvalResult.makeMatrix1("1").bindElement("/Data/1"), // 역량평가
														   				new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
														   				new sap.ui.layout.VerticalLayout({
																			visible : {
																				path : "/Data/0/section2",
																				formatter : function(fVal){
																					return fVal == "X" ? true : false;
																				}
																			},
														   					content : [common.SearchEvalResult.makeMatrix2().bindElement("/Data/2"),	 // 리더십 만족도
														   							   new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
														   				}),
														   				common.SearchEvalResult.makeMatrix3().bindElement("/Data/3")]     // 강점/보완점
														 })]
										   })]
						})]
		}).addStyleClass("objectlayout_evalresult");
		oSectionLayout.setModel(common.SearchEvalResult._JSONModel);
		oSectionLayout.bindElement("/user");
		
		var oDialog = new sap.m.Dialog({
			title : common.SearchEvalResult.oBundleText.getText("LABEL_12100"), // 평가결과 조회
			contentWidth : "1500px",
			contentHeight : "1500px",
			content : [oSectionLayout],
			beforeOpen : common.SearchEvalResult.onBeforeOpen,
			afterOpen : common.SearchEvalResult.onAfterOpen,
			endButton : [new sap.m.Button({
							 type : "Emphasized",
							 text : "프린트", // 프린트
							 press : oController.onPrint
						 }),
						 new sap.m.Button({
							 type : "Emphasized",
							 text : common.SearchEvalResult.oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })
						 
						]
		});
		
		oDialog.setModel(common.SearchEvalResult._JSONModel);
		
		oDialog.addEventDelegate({
			onAfterRendering : function(){
				
			}
		});
		
		return oDialog;
	}
});
