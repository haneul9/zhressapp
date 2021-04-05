sap.ui.jsfragment("fragment.EvalHistory", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.SearchEvalHistory");
		jQuery.sap.require("common.makeTable");
		
		common.SearchEvalHistory.oController = oController;
		
		var oHeader = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["360px", "", "45px"],
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
																		   	   				 new sap.m.Text({text : "{title}"}).addStyleClass("Font15 paddingLeft5 paddingtop6")]
																		   	  }).addStyleClass("paddingTop3"),
															   				  new sap.m.Text({text : "{department} / {custom01}"}).addStyleClass("info2 paddingTop8")]
															   }).addStyleClass("paddingLeft10 paddingTop3")]
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText(common.SearchEvalHistory.PAGEID + "_Status", {
											 	 	width: "42px",
											 	 	height: "42px", 
											 	 	htmlText: "<em>Loading</em>"
											 	 }).addStyleClass("spinner-evalresult")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		
		var oTable = new sap.ui.table.Table(common.SearchEvalHistory.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: "None",
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			cellClick : common.SearchEvalHistory.onCellClick,
			extension : [new sap.m.Toolbar({
							 height : "45px",
							 content : [new sap.m.ToolbarSpacer(),
										new sap.ui.layout.HorizontalLayout({
											content : [new sap.ui.core.Icon({
														   src : "sap-icon://information",
														   size : "14px",
														   color : "#0a6ed1"
													   }).addStyleClass("paddingTop4 paddingRight10"),
													   new sap.m.Text({text : oBundleText.getText("MSG_07009")})] // 해당 평가연도 클릭 시, 자세한 평가결과를 확인 가능합니다. (2020년 이후)
										}).addStyleClass("custom-messagestrip")]
						 })]
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 평가연도, 조직, 역량, 업적, 종합
		var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},
						{id: "Appye", label : oBundleText.getText("LABEL_07301"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Grade7", label : oBundleText.getText("LABEL_07306"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Grade2", label : oBundleText.getText("LABEL_07308"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Grade1", label : oBundleText.getText("LABEL_07307"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Grade6", label : oBundleText.getText("LABEL_07309"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: "Column",
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_07001")}).addStyleClass("app-title")] // 평가이력
								  }).addStyleClass("app-title-container"),
								  new sap.ui.core.HTML({content : "<div style='height:40px' />"}),
						  		  oHeader, new sap.ui.core.HTML({content : "<div style='height:40px' />"}), 
						  		  oTable, new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
					  }).addStyleClass("app-content-container")]
		}).addStyleClass("app-content-body");
		
		oContent.setModel(common.SearchEvalHistory._JSONModel);
		oContent.bindElement("/Data");
		
		var oDialog = new sap.m.Dialog({
			title : "", 
			contentWidth : "1500px",
			contentHeight : "1500px",
			content : [oContent],
			beforeOpen : common.SearchEvalHistory.onBeforeOpen,
			afterOpen : common.SearchEvalHistory.onAfterOpen,
			beginButton : [],
			endButton : [new sap.m.Button({
							 type : "Emphasized",
							 text : oBundleText.getText("LABEL_06122"), // 닫기
							 press : function(){oDialog.close();}
						 })]
		});
		
		// oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}
});
