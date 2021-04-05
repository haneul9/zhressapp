sap.ui.jsfragment("ZUI5_SF_EvalCollFin.fragment.Detail", {
	
	createContent: function (oController) {
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["1rem", "", "1rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({rowSpan : 5}),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_20027")}).addStyleClass("info1")], // 이의사유
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({rowSpan : 5})]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.TextArea({
												 	value : "{Isstxt}",
												 	width : "100%",
												 	growing : true,
												 	growingMaxLines : 10,
												 	editable : false
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_20028")}).addStyleClass("info1")], // 확인자 의견
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.TextArea({
												 	value : "{Rvtxt}",
												 	width : "100%",
												 	growing : true,
												 	growingMaxLines : 10,
												 	rows : 5,
												 	editable : {
												 		path : "Button",
												 		formatter : function(fVal){
												 			return fVal == "X" ? true : false;
												 		}
												 	},
												 	maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_SRV", "EvaAgreeList", "IRvtxt")
												})]
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "1rem"})]
		});
		
		var oDialog = new sap.m.Dialog({
			title : "",
			contentWidth : "1000px",
			content : [oContent],
			buttons : [new sap.m.Button({
						   type : "Emphasized",
						   text : oBundleText.getText("LABEL_20005"), // 인정
						   press : function(oEvent){
						   		oController.onPressSave(oEvent, "40");
						   },
						   visible : {
						   		path : "Button",
						   		formatter : function(fVal){
						   			return fVal == "X" ? true : false;
						   		}
						   }
					   }),
					   new sap.m.Button({
						   type : "Emphasized",
						   text : oBundleText.getText("LABEL_20004"), // 반려
						   press : function(oEvent){
						   		oController.onPressSave(oEvent, "50");
						   },
						   visible : {
						   		path : "Button",
						   		formatter : function(fVal){
						   			return fVal == "X" ? true : false;
						   		}
						   }
					   }),
					   new sap.m.Button({
					   	   type : "Emphasized",
					   	   text : oBundleText.getText("LABEL_00133"), // 닫기
					   	   press : function(oEvent){oDialog.close();}
					   })]
		});
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
     