$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_EvalApResult.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_EvalApResult.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL2_SRV");
		
		// 사원정보
		// var oHeader = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 1,
		// 	width : "100%",
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
		// 																   	   	  content : [new sap.m.Text({text : "{Ename}"}).addStyleClass("Font20 FontBold"),
		// 																   	   				 new sap.m.Text({text : "{ZpostT}"}).addStyleClass("Font15 paddingLeft5 paddingTop5")]
		// 																   	  }).addStyleClass("paddingTop3"),
		// 													   				  new sap.m.Text({text : "{Stext} / {PGradeTxt}"}).addStyleClass("info2")]
		// 													   }).addStyleClass("paddingLeft10 paddingTop3")]
		// 										})],
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle"
		// 						 }).addStyleClass("paddingLeft10")]
		// 			})]
		// });
		
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
			noData: oBundleText.getText("LABEL_00901"), // No data found
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// 기초-안내문구
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
					   new sap.m.VBox({
					   	   width : "100%",
					   	   items : [new sap.m.Text({text : oBundleText.getText("MSG_07001")}).addStyleClass("FontBold Font15"), // 인사평가
					   				  new sap.m.Text({text : oBundleText.getText("MSG_07002")}).addStyleClass("paddingLeft10"), // 생산(연구)지원직: 1차(리더)+2차(팀장), 5단계(S,A,B,C,D)
					   				  new sap.m.Text({text : oBundleText.getText("MSG_07003")}).addStyleClass("paddingLeft10"), // 행정지원직: 1차(팀장) → 2차(임원), 5단계(S,A,B,C,D)
					   				  new sap.m.Text({text : oBundleText.getText("MSG_07005")}).addStyleClass("FontBold Font15 paddingTop10"), // 인사평가 결과반영
					   				  new sap.m.Text({text : oBundleText.getText("MSG_07006")}).addStyleClass("paddingLeft10")] // 행정지원직: 1차(팀장) → 2차(임원), 5단계(S,A,B,C,D)
					   }).addStyleClass("custom-OpenHelp-msgBox"),
					   new sap.ui.core.HTML({content : "<div style='height:10px' />"})],
			visible : {
				path : "Bukrs",
				formatter : function(fVal){
					return fVal == "A100" ? false : true;
				}
			}
		});
		
		// var oContent = new sap.m.FlexBox({
		// 	  justifyContent: "Center",
		// 	  fitContainer: true,
		// 	  items: [new sap.m.FlexBox({
		// 				  direction: sap.m.FlexDirection.Column,
		// 				  items: [new sap.m.FlexBox({
		// 							  alignItems: "End",
		// 							  fitContainer: true,
		// 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_07001")}).addStyleClass("app-title")] // 평가이력
		// 						  }).addStyleClass("app-title-container"),
		// 						  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
		// 						  oHeader,
		// 						  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
		// 						  oTable,
		// 						  oLayout]
		// 			  }).addStyleClass("app-content-container-wide")]
		// }).addStyleClass("app-content-body");
				
		// /////////////////////////////////////////////////////////

		// var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
		// 	customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
		// 	content: [oContent]
		// }).addStyleClass("app-content");
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oTable, oLayout]
			        });
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});