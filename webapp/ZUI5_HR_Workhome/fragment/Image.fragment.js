sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Image", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oURL = "";
		if(common.Common.isLOCAL() == true){
   			oURL = "/webapp/ZUI5_HR_Workhome/manual/image.jpg";
   		} else {
   			oURL = "/ZUI5_HR_Workhome/manual/image.jpg";
   		}
		
		var oImage = new sap.m.Image({
			src : oURL,
			width : "600px"
		});
		
		var oDialog = new sap.m.Dialog({
			content : [oImage],
			title : "",
			endButton : [new sap.m.Button({
							 text : oBundleText.getText("LABEL_00133"), // 닫기
							 press : oController.openSMOIN
						 }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
		
	}
});
