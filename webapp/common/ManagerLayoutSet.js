jQuery.sap.declare("common.ManagerLayoutSet");

common.ManagerLayoutSet = {
	/**
	 * @memberOf common.ManagerLayoutSet
	 */

	managerLayoutSet: function (oController) {
		var oMpanel = sap.ui.getCore().byId(oController.PAGEID + "_M_PANEL");
		oMpanel.removeAllContent();
		oMpanel.destroyContent();
		var _visibleYn = false;

		oMpanel.addContent(
			new sap.m.Toolbar({
				height: "30px",
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.ui.core.Icon({ src: "sap-icon://notification", size: "1.0rem", color: "#666666" }),
					new sap.m.Label({ text: "참조사항", design: "Bold" }).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PToolbarNoBottomLine L2PPaddingLeft10")
		);

		oMpanel.addContent(
			new sap.m.Toolbar({
				height: "21px",
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "신청문서 신청 시 아래 담당자에게 요청 메일이 발송됩니다." }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine L2PPaddingLeft2rem")
		);

		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var filterString = "/?$filter=";
		filterString += "Appty%20eq%20%27" + oController._vAppty + "%27";

		oModel.read(
			"/GetManagingStaffSet" + filterString,
			null,
			null,
			false,
			function (oData, oResponse) {
				vCount = oData.results.length;
				if (oData && oData.results.length > 0) {
					_visibleYn = true;
					console.log(_visibleYn);
					for (var i = 0; i < oData.results.length; i++) {
						oMpanel.addContent(
							new sap.m.Toolbar({
								height: "21px",
								design: sap.m.ToolbarDesign.Auto,
								content: [
									new sap.ui.core.Icon({ src: "sap-icon://hr-approval", size: "1.0rem", color: "#666666" }),
									new sap.m.Label({ text: oData.results[i].Mailt }).addStyleClass("L2P13Font")
								]
							}).addStyleClass("L2PToolbarNoBottomLine L2PPaddingLeft2rem")
						);
					}
				} else {
					oMpanel.addContent(
						new sap.m.Toolbar({
							height: "21px",
							design: sap.m.ToolbarDesign.Auto,
							content: [
								new sap.m.Label({ text: "현재 신청관리 담당자가 등록되어 있지 않습니다." }).addStyleClass("L2P13Font")
							]
						}).addStyleClass("L2PToolbarNoBottomLine L2PPaddingLeft2rem")
					);
				}
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);
		oMpanel.setVisible(_visibleYn);
	}
};
