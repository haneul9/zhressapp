jQuery.sap.declare("common.SearchPrdArea");

jQuery.sap.require("common.Common");

/**
 * 제품지역의 Dialog를 위한 JS 이다.
 * @Create By 정명구
 */

common.SearchPrdArea = {
	/**
	 * @memberOf common.SearchPrdArea
	 */

	oController: null,
	vCallControlId: "",

	/*
	 * 검색어를 이용하여 사원을 검섹 처리
	 * 검색 대상은 조직 및 사원명이다.
	 */
	onSearchPrdArea: function (oEvent) {
		var sValue = oEvent.getParameter("value");

		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Zzprdar"));
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));

		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},

	/*
	 * 제품지역 Dialog를 Close한다.
	 */
	onCancelPrdArea: function (oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(null);
	},

	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirmPrdArea: function (oEvent) {
		var aContexts = oEvent.getParameter("selectedContexts");

		if (aContexts.length) {
			var vZzprdar = aContexts[0].getProperty("Ecode");
			var vZzprdartx = aContexts[0].getProperty("Etext");

			var oControl = sap.ui.getCore().byId(common.SearchPrdArea.vCallControlId);
			if (oControl) {
				oControl.removeAllCustomData();
				oControl.setValue(vZzprdartx);

				var vTmp = common.SearchPrdArea.vCallControlId.split("_");
				var vKey = common.SearchPrdArea.vCallControlId.replace(vTmp[0] + "_", "");

				oControl.addCustomData(new sap.ui.core.CustomData({ key: vKey, value: vZzprdar }));
			}
		}

		common.SearchPrdArea.onCancelPrdArea(oEvent);
	}
};
