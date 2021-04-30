$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_EvalPro.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_EvalPro.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL2_SRV");
		
		// 평가방법
		var oPanel1 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : oBundleText.getText("LABEL_24008")}).addStyleClass("FontBold font-15px")] // 평가방법
							 }).addStyleClass("toolbarNoBottomLine")],
			content : [new sap.ui.commons.layout.MatrixLayout({
						   columns : 1,
						   width : "100%",
						   rows : [new sap.ui.commons.layout.MatrixLayoutRow({
								   	   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
										   	   		content : [new sap.m.VBox({
										   	   								  // - 사원을 클릭하시면 개인별 평가화면이 나타납니다.
																   items : [new sap.m.Text({text : "{i18n>MSG_24001}"}),
																			  // - 모든 인사 평가를 완료하신 후 '평가완료처리' 버튼을 클릭하시면 평가가 완료됩니다.
																			new sap.m.Text({text : "{i18n>MSG_24002}"})]
															   }).addStyleClass("custom-OpenHelp-msgBox mt-0")],
													 hAlign : "Begin",
													 vAlign : "Middle"
										   	    })]
								   })]
					    })]
		});
		
		// 평가대상 대상자 명단
		var oSummary2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.HorizontalLayout({
											 	 	content : [new sap.ui.core.Icon({
														 	 	   src : "sap-icon://list",
														 	 	   size : "1rem",
														 	 	   color : "#32363A"
														 	   }).addStyleClass("paddingRight10 paddingtop6"),
														 	   new sap.m.Text({text : "{i18n>LABEL_24001}"}).addStyleClass("paddingRight10 paddingTop4"), // 전문직 평가
														 	   new sap.m.Select(oController.PAGEID + "_Appid", {
														 	   	   selectedKey : "{Appid}",
														 	   	   width : "300px",
														 	   	   change : oController.onPressSearch
														 	   }),
														 	   new sap.m.Text({
														 	   	   text : "{i18n>MSG_24007}", // 평가가 완료되었습니다.
														 	   	   visible : {
														 	   	   		parts : [{path : "Sndflg"}, {path : "Tapnum"}],
														 	   	   		formatter : function(fVal1, fVal2){
														 	   	   			if(fVal2 == "0"){
														 	   	   				return false;
														 	   	   			} else {
														 	   	   				return fVal1 == "" ? false : true;
														 	   	   			}
														 	   	   		}
														 	   	   }
														 	   }).addStyleClass("FontRed FontBold paddingLeft10 paddingTop4")]
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								  	 content : [new sap.m.Text({text : "{Taptt}"}).addStyleClass("FontBold FontRed")],
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		
		var oSummary = new sap.ui.commons.layout.MatrixLayout({
			columns : 8,
			width : "100%",
			widths : ["", "", "", "", "", "", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_24002}"})], // 평가대상
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{Tapnum} " + oController.getBundleText("LABEL_24006")})], // 명
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_24003}"})], // 평가인원
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{Appnum} " + oController.getBundleText("LABEL_24006")})], // 명
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_24004}"})], // 미평가인원
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{Nppnum} " + oController.getBundleText("LABEL_24006")})], // 명
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_24005}"})], // 평균
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{Apavrg} " + oController.getBundleText("LABEL_24007")})], // 점
								 	 hAlign : "End",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data border_right0")]	
					})]
		}).addStyleClass("mt-6px");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}", // No data found
			cellClick : oController.onPressTable,
			rowActionCount : 1,
			rowActionTemplate : [new sap.ui.table.RowAction({
									 items : [new sap.ui.table.RowActionItem({
											 	  type : "Navigation",
											 	  press : function(oEvent){
											 	  		oController.onPressTable(oEvent, "X");
											 	  },
											 	  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})]
											  })]
								 })]
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var oPanel2 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 height : "40px",
								 content : [new sap.m.Text({text : "{i18n>LABEL_24009}"}).addStyleClass("FontBold font-15px"), // 평가대상 대상자 명단
											new sap.m.ToolbarSpacer(),
											new sap.m.Button({
												text : "{i18n>LABEL_24010}", // 평가확정처리
												// type : "Emphasized",
												press : oController.onPressSave,
												visible : {
													path : "Sndflg",
													formatter : function(fVal){
														return fVal == "" ? true : false;
													}
												},
											}).addStyleClass("button-dark"),
											new sap.m.ToolbarSpacer({width : "10px"})]
							 }).addStyleClass("toolbarNoBottomLine")],
			content : [oSummary2, oSummary, oTable]
		});
				
		/////////////////////////////////////////////////////////
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [new sap.ui.core.HTML({content : "<div style='height:10px' />"}), oPanel1, oPanel2]
			        });
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});