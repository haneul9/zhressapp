sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail02", {
	
	createContent: function(oController) {
		
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : oBundleText.getText("LABEL_12116"), // 평가 항목
					value : "{Compgrptx}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_12117"), // 1차평가점수
					value : "{Comppnt1}"  
				},
				{
					name : oBundleText.getText("LABEL_12118"), // 동일 Grade 평균 점수
					value : "{Comppnt2}"
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart", {
			width: "100%",
			height: "350px",
			vizType : "radar",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_12116")]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_12117"), oBundleText.getText("LABEL_12118")]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
	                    visible: false
	                },
	                colorPalette :  ["#ffcd56", "#4bc0c0"],
	                polarAxis : {
	                	label : {
	                		style : {
	                			color : "#333333",
	                			fontSize : "16px",
	                			fontWeight : "500"
	                		}
	                	}
	                },
	                gridline: {
	                	color : "#e6e6e6"
	                }
				},
				legend: {
					visible : true
				},
				legendGroup: {
					layout : {
						alignment: "center",
						position: "bottom"
					}
				},
	            valueAxis: {
	                label: {
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
	            }
			}
		});
		
		oVizFrame.setModel(new sap.ui.model.json.JSONModel());
		
		var oPopOver = new sap.viz.ui5.controls.Popover();
			oPopOver.connect(oVizFrame.getVizUid());
			
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
									 				 height : "44px",
												 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_15008")}).addStyleClass("Font18 Font700")] // 역량평가
												 }).addStyleClass("toolbarNoBottomLine padding0")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oVizFrame],
									 hAlign : "Begin",
									 vAlign : "Top"
								 })]
					})]
		});
		
		return oMatrix;
	}
});
     