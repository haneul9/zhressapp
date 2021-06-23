sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Cancel", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTextArea = new sap.m.TextArea({
			value : "{Bigo}",
			width : "100%",
			rows : 5,
			maxLength : common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "WorkhomeApplyTab", "Bigo")
		});

		// var oAppname = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 2,
		// 	width : "100%",
		// 	widths : ["20%", "80%"],
		// 	visible : "{AppNameyn}",
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		// 				height : "45px",
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							 content : [new sap.m.Label({text : "{i18n>LABEL_48066}", required : true})], // 결재자
		// 							 hAlign : "Begin",
		// 							 vAlign : "Middle"
		// 						}),
		// 						new sap.ui.commons.layout.MatrixLayoutCell({
		// 							content : [new sap.m.ComboBox(oController.PAGEID + "_AppName", {
		// 											selectedKey : "{AppName}",
		// 											width : "100%"
		// 										})],
		// 							hAlign : "Begin",
		// 							vAlign : "Middle"
		// 						})]	
		// 			})]
		// });
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "500px",
			draggable : true,
			content : [new sap.m.VBox({
						   items : [oTextArea]
					   })],
			title : "{i18n>LABEL_53015}", // 취소사유
			beginButton : [new sap.m.Button({
							   text : "{i18n>LABEL_53007}", // 취소처리
							   press : function(){
							   		oController.onPressDelete(null, "E");
							   }
						   }).addStyleClass("button-dark")],
			endButton : [new sap.m.Button({
							 text : "{i18n>LABEL_00133}", // 닫기
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default custom-button-divide")]
		});
		
		oDialog.addStyleClass($.app.getDeviceSystem() == "phone" ? "mobile-custom-dialog-popup" : "custom-dialog-popup");
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
		
	}
});
