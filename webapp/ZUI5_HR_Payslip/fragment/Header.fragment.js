jQuery.sap.require("common.EmpBasicInfoBox");

sap.ui.jsfragment("ZUI5_HR_Payslip.fragment.Header", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	createContent : function(oController) {
		
		var oEmpBasicInfoBox = new common.EmpBasicInfoBox(oController._HeaderJSonModel).addStyleClass("mt-5px");
		
		return oEmpBasicInfoBox;
	}
});

