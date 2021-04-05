sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content04", {
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
					value : "{Evatype}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_05110"), // 인원수
					value : "{Evapnt}"  
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		// var formatPattern = sap.viz.ui5.format.ChartFormatter.DefaultPattern;
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart4", {
			width: "300px",
			height: "236px",
			vizType : "donut",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "color",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_05109")] // 등급
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "size",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_05110")] // 인원수
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
	                    // formatString:formatPattern.SHORTFLOAT,
	                    visible: true
	                },
	                colorPalette :  ["#68c5d6", "#f9cd3d", "#9ed0aa", "#82b0df", "#f8c7da"], 
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
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content4", {
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
									  new sap.m.Text({text : oBundleText.getText("LABEL_05111")}).addStyleClass("dashboard_title_text"), // 종합평가
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Select({
									  	  selectedKey : "{Sessty}",
									  	  width : "150px",
									  	  items : [new sap.ui.core.Item({key : "A", text : oBundleText.getText("LABEL_12106")}),  // 2차평가
									  			   new sap.ui.core.Item({key : "B", text : oBundleText.getText("LABEL_12107")})], // 평가세션
									  	  change : oController.makeContent4
									  }),
									  new sap.m.Button({
									  	  icon : "sap-icon://user-edit",
									  	  type : "Ghost",
									  	  visible : true,
									  	  press : function(){
									  	  		var domain = (common.Common.getOperationMode() == "DEV" ? "hcm10preview.sapsf.com" : "performancemanager10.successfactors.com");
									  	  		window.open("https://" + domain + "/sf/customExternalModule?urlName=EvalComprehensive&moduleId=PERFORMANCE");
									  	  }
									  }),
									  new sap.m.ToolbarSpacer({width : "10px"})]
					   }).addStyleClass("dashboard_title"),
					   oScrollContainer]
		}).addStyleClass("dashboard_layout1");
		
		return oContent;
	}
});
