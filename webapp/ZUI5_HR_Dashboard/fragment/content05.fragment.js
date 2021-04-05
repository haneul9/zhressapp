sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content05", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : oBundleText.getText("LABEL_05109"), // 등급
					value : "{Grade}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_05113"), // 등급별 인원수
					value : "{Count}"  
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart5", {
			width: "300px",
			height: "236px",
			vizType : "column",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_05113")] // 등급별 인원수
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_05109")] // 등급
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
//	                    formatString:formatPattern.SHORTFLOAT,
	                    visible: true
	                },
	                colorPalette :  ["#95c7de"],
	                // dataShape: {
		            //     primaryAxis: ["bar"]
		            // },
		            // line : {
		            // 	marker:{
		            // 		size : 4
		            // 	},
		            // 	width : 1
		            // }
				},
				legend: {
					label: {
						style: {
							fontFamily: "'Noto Sans CJK KR Regular', sans-serif"
						}
					}
				},
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
			
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content5", {
			horizontal : false,
			vertical : false,
			width : "",
			// height : (window.innerHeight - 660) + "px",
			content : [oVizFrame]
		}).addStyleClass("dashboard_content1");
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   height : "50px",
						   content : [new sap.m.ToolbarSpacer({width : "18px"}),
									  new sap.m.Text({text : oBundleText.getText("LABEL_05112")}).addStyleClass("dashboard_title_text")] // 업적평가등급
					   }).addStyleClass("dashboard_title"),
					   oScrollContainer]
		}).addStyleClass("dashboard_layout1");
		
		return oContent;
	}
});
