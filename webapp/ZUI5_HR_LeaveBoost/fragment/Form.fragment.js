sap.ui.jsfragment("ZUI5_HR_LeaveBoost.fragment.Form", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oDialog = new sap.m.Dialog({
			contentWidth : "1100px",
			contentHeight : "800px",
			title : oBundleText.getText("LABEL_52016"), // 연차 지정 통보서 출력
			content : [new sap.ui.layout.VerticalLayout(oController.PAGEID + "_FormLayout")],
			buttons : [new sap.m.Button({
						   text : oBundleText.getText("LABEL_00133"), // 닫기
						   press : function(){oDialog.close();}
					   }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
