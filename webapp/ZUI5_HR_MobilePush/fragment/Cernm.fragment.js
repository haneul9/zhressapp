sap.ui.jsfragment("ZUI5_HR_MobilePush.fragment.Cernm", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
        var oContent = new sap.m.VBox({
            items : [new sap.m.Text({text : oController.getBundleText("MSG_72013")}).addStyleClass("pb-10px"), 
                     // {Ename} {Zposttx}님의 휴대폰에 비밀번호가 발송되었습니다. 확인 후 입력하세요.
                     new sap.m.Input({
                         value : "{Cernm2}",
                         width : "100%",  
                         maxLength : common.Common.getODataPropertyLength("ZHR_COMMON_SRV", "AppPushAlarmCheck", "Cernm"),
						 liveChange : function(oEvent){
							var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
							 
							oEvent.getSource().setValue(value);
						 }
                     })]
        });

		var oDialog = new sap.m.Dialog({
			contentWidth : "400px",
			title : "{i18n>LABEL_72001}", // Mobile Push 발송
			content : [oContent],
			buttons : [new sap.m.Button({
						   text : "{i18n>LABEL_00150}", // 확인
                           press : oController.onPushCheck
					   }).addStyleClass("button-dark"),
                       new sap.m.Button({
						   text : "{i18n>LABEL_00119}", // 취소
						   press : function(){oDialog.close();}
					   }).addStyleClass("button-default")]
		}).addStyleClass("custom-dialog-popup");

        oDialog.setModel(new sap.ui.model.json.JSONModel());
        oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
