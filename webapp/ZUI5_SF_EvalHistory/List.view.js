$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_SF_EvalHistory.List", {
	
	getControllerName: function() {
		return "ZUI5_SF_EvalHistory.List";
	},
	
	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL_SRV");
		
		// var oHeader = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 3,
		// 	width : "100%",
		// 	widths : ["360px", "", "45px"],
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.ui.layout.HorizontalLayout({
		// 										 	content : [new sap.m.Image({
		// 														   src : "{photo}",
		// 														   width : "55px",
		// 														   height : "55px"
		// 													   }).addStyleClass("roundImage"),
		// 													   new sap.ui.layout.VerticalLayout({
		// 													   	   content : [new sap.ui.layout.HorizontalLayout({
		// 																   	   	  content : [new sap.m.Text({text : "{nickname}"}).addStyleClass("Font20 FontBold"),
		// 																   	   				 new sap.m.Text({text : "{title}"}).addStyleClass("Font15 paddingLeft5 paddingtop6")]
		// 																   	  }).addStyleClass("paddingTop3"),
		// 													   				  new sap.m.Text({text : "{department} / {custom01}"}).addStyleClass("info2 paddingTop8")]
		// 													   }).addStyleClass("paddingLeft10 paddingTop3")]
		// 										})],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle"
		// 						 }),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell(),
		// 						 new sap.ui.commons.layout.MatrixLayoutCell({
		// 						 	 content : [new sap.m.FormattedText(oController.PAGEID + "_Status", {
		// 									 	 	width: "42px",
		// 									 	 	height: "42px", 
		// 									 	 	htmlText: "<em>Loading</em>"
		// 									 	 }).addStyleClass("spinner-evalresult")],
		// 						 	 hAlign : "Begin",
		// 						 	 vAlign : "Middle"
		// 						 })]
		// 			})]
		// });
		
		// var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
		// 	enableColumnReordering : false,
		// 	enableColumnFreeze : false,
		// 	columnHeaderHeight : 35,
		// 	showNoData : true,
		// 	selectionMode: "None",
		// 	showOverlay : false,
		// 	enableBusyIndicator : true,
		// 	visibleRowCount : 1,
		// 	cellClick : oController.onCellClick,
		// 	extension : []
		// }).addStyleClass("sapUiSizeCompact");
		
		// oTable.setModel(new sap.ui.model.json.JSONModel());
		// oTable.bindRows("/Data");
		
		// 				// 평가연도, 역량, 조직, 업적, 종합
		// var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},
		// 				{id: "Appye", label : oBundleText.getText("LABEL_07301"), plabel : "", span : 0, type : "string", sort : true, filter : true},
		// 				{id: "Grade2", label : oBundleText.getText("LABEL_07308"), plabel : "", span : 0, type : "string", sort : true, filter : true},
		// 				{id: "Grade7", label : oBundleText.getText("LABEL_07306"), plabel : "", span : 0, type : "string", sort : true, filter : true},
		// 				{id: "Grade1", label : oBundleText.getText("LABEL_07307"), plabel : "", span : 0, type : "string", sort : true, filter : true},
		// 				{id: "Grade6", label : oBundleText.getText("LABEL_07309"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
		// common.makeTable.makeColumn(oController, oTable, col_info);
		
		// var oContent = new sap.m.FlexBox({
		// 	  justifyContent: "Center",
		// 	  fitContainer: true,
		// 	  items: [new sap.m.FlexBox({
		// 				  direction: "Column",
		// 				  items: [new sap.m.FlexBox({
		// 							  alignItems: "End",
		// 							  fitContainer: true,
		// 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_07001")}).addStyleClass("app-title")] // 평가이력
		// 						  }).addStyleClass("app-title-container"),
		// 						  new sap.ui.core.HTML({content : "<div style='height:40px' />"}),
		// 				  		  oHeader, new sap.ui.core.HTML({content : "<div style='height:40px' />"}), 
		// 				  		  oTable, new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
		// 			  }).addStyleClass("app-content-container")]
		// }).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			// content: [oContent]
			content : [sap.ui.jsfragment("fragment.EvalHistory", oController).getContent()]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});