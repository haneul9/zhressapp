sap.ui.jsfragment("fragment.360Review", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.Search360Review");
		jQuery.sap.require("common.JSONModelHelper");
		jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");
		jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChartData");
		
		var oHeader = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["360px", "360px", ""],
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
															   				  new sap.m.Text({text : "({userId}) {department}"}).addStyleClass("info2")]
															   }).addStyleClass("paddingLeft10")]
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
														 	   })]
											 	})]
								 })]
					})]
		});
		
		var oSectionLayout = new sap.uxap.ObjectPageLayout("ObjectPageLayout", {
			enableLazyLoading : false,
			showTitleInHeaderContent : false,
			alwaysShowContentHeader : true,
			useIconTabBar :	false,
			headerContent : [oHeader],
			sections : [new sap.uxap.ObjectPageSection({
							title : common.Search360Review.oBundleText.getText("LABEL_06118"), // 직무 만족도
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.Search360Review.makeMatrix1("0").bindElement("/Data/0")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							title : common.Search360Review.oBundleText.getText("LABEL_06119"), // 협업 만족도
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.Search360Review.makeMatrix1("1").bindElement("/Data/1")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							title : common.Search360Review.oBundleText.getText("LABEL_06120"), // 리더십 만족도
							visible : {
								path : "section2",
								formatter : function(fVal){
									return fVal == "X" ? true : false;
								}
							},
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.Search360Review.makeMatrix2().bindElement("/Data/2")]
										   })]
						}),
						new sap.uxap.ObjectPageSection({
							title : common.Search360Review.oBundleText.getText("LABEL_06121"), // 강점/보완점
							subSections : [new sap.uxap.ObjectPageSubSection({
											   title : "",	
											   blocks : [common.Search360Review.makeMatrix3().bindElement("/Data/3")]
										   })]
						})]
		});
		
		oSectionLayout.bindElement("/Data/0");
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [oSectionLayout]
		});
		
		var oDialog = new sap.m.Dialog({
			title : common.Search360Review.oBundleText.getText("LABEL_06124"), // 다면평가 문서
			contentWidth : "1500px",
			contentHeight : "1500px",
			content : [oLayout],
			beforeOpen : common.Search360Review.onBeforeOpen,
			afterOpen : common.Search360Review.onAfterOpen,
			endButton : [new sap.m.Button({
							 type : "Default",
							 text : common.Search360Review.oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })]
		});
		
		oDialog.setModel(common.Search360Review._JSONModel);
		oDialog.addStyleClass("sapUiSizeCompact");
		
		oDialog.addEventDelegate({
			onAfterRendering : function(){
				var isIE = (navigator.userAgent.toLowerCase().indexOf("trident") != -1) ? true : false;
				if(isIE == true){
					oSectionLayout.addStyleClass("custom_objectlayout");
				}
			}
		});
		
		return oDialog;
	}
});
