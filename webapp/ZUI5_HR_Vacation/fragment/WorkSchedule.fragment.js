sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.WorkSchedule", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "500px",
			draggable : true,
			content : [],
			title : oBundleText.getText("LABEL_48054"), // 근무일정 조회
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"), // 닫기
							 press : function(){oDialog.close();}
						 }).addStyleClass("button-default")]
		});
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		// oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}
});
