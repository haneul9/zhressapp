sap.ui.jsfragment("ZUI5_HR_Pregnant.fragment.Message", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		/** 
			※ 임신기간 중 연장근로 및 야간, 휴일근로는 제한됩니다.
			※ 단축근무 개시일은 임신 초기와 임신 후기에 나누어 신청할 수 있습니다. (일 2시간)
			• 임신 초기 : 임신일로부터 12주(84일차) 이내
			• 임신 후기 : 임신 36주(246일차)로부터 출산일까지
			※ 등록신청 시 임신일과 출산예정일을 포함한 의료기관의 진단서를 첨부해야 합니다.
		**/
		var oMessage = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.FormattedText({
						   htmlText : "<span>" + oBundleText.getText("MSG_39001") + "</span><br/>" +
									  "<span>" + oBundleText.getText("MSG_39002") + "</span><br/>" +
									  "<span style='padding-left:10px'>" + oBundleText.getText("MSG_39003") + "</span>" +
									  "<span style='color:#0070bd'> " + oBundleText.getText("MSG_39004") + "</span>" +
									  "<span> " + oBundleText.getText("MSG_39005") + "</span>" +
									  "<span style='color:#0070bd; font-weight:bold;'> " + oBundleText.getText("MSG_39006") + "</span><br/>" +
									  "<span style='padding-left:10px'>" + oBundleText.getText("MSG_39003") + "</span>" +
									  "<span style='color:#0070bd'> " + oBundleText.getText("MSG_39007") + "</span>" +
									  "<span> " + oBundleText.getText("MSG_39008") + "</span>" +
									  "<span style='color:#0070bd; font-weight:bold;'> " + oBundleText.getText("MSG_39009") + "</span><br/>" +
									  "<span>" + oBundleText.getText("MSG_39010") + "</span>"
					   })]	
		}).addStyleClass("p-15px");
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oMessage],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}).addStyleClass("custom-OpenHelp-msgBox")]
		})
		
		return oMatrix;
	}
});
