sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content06", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : oBundleText.getText("LABEL_05115"), // 점수
					value : "{Grade}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_05116"), // 업적
					value : "{Count1}"  
				},
				{
					name : oBundleText.getText("LABEL_05117"), // 역량
					value : "{Count2}"
				},
				{
					name : oBundleText.getText("LABEL_05118"), // 다면
					value : "{Count3}"
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame(oController.PAGEID + "_Chart6", {
			width: "300px",
			height: "236px",
			vizType : "line",
			uiConfig : {
				applicationSet : "fiori",
				showErrorMessage : true
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [oBundleText.getText("LABEL_05116"), oBundleText.getText("LABEL_05117"), oBundleText.getText("LABEL_05118")]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : [oBundleText.getText("LABEL_05115")]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
//	                    formatString:formatPattern.SHORTFLOAT,
	                    visible: true
	                },
	                colorPalette :  ["#408AD4", "#E8C23E", "#8ED648"],
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
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content6", {
			horizontal : false,
			vertical : true,
			width : "",
			// height : (window.innerHeight - 650) + "px",
			content : [oVizFrame]
		}).addStyleClass("dashboard_content1");
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   height : "50px",
						   content : [new sap.m.ToolbarSpacer({width : "18px"}),
						   			  new sap.m.Text({text : oBundleText.getText("LABEL_05114")}).addStyleClass("dashboard_title_text"), // 평가현황
						   			  new sap.m.ToolbarSpacer(),
									  new sap.m.Button({
									  	  icon : "sap-icon://display-more",
									  	  type : "Ghost",
									  	  press : function(){
										  	  	// window.open(
										  	  	// 	(common.Common.getOperationMode() == "DEV" ? "https://hcm10preview.sapsf.com" : "https://performancemanager10.successfactors.com")
										  	  	// 		+ "/sf/customExternalModule?urlName=Eval360ReviewApp&moduleId=PERFORMANCE"
										  	  	// );

												var url = "";
												if(common.Common.isLOCAL() == true){
													url = "/webapp/index.html?popup=Eval360ReviewApp.html&mid=1860&pernr=" + oController.getSessionInfoByKey("Pernr");
												} else {
													url = "/index.html?popup=Eval360ReviewApp.html&mid=1860";
												}
	
												window.open(url);
									  	  }
									  }),
									  new sap.m.ToolbarSpacer({width : "10px"})]
					   }).addStyleClass("dashboard_title"),
					   oScrollContainer]
		}).addStyleClass("dashboard_layout1");
		
		return oContent;
	}
});
