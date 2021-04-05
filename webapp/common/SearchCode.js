jQuery.sap.declare("common.SearchCode");

jQuery.sap.require("common.Common");

/**
 * 사원검색의 Dialog를 위한 JS 이다.
 * @Create By 정명구
 */

common.SearchCode = {
	/**
	 * @memberOf common.SearchCode
	 */

	oController: null,
	vCallControlId: "",
	//	vMolga : null ,

	/*
	 * 검색어를 이용하여 사원을 검섹 처리
	 * 검색 대상은 조직 및 사원명이다.
	 */
	onSearchCode: function (oEvent) {
		var sValue = oEvent.getParameter("value");

		var oFilters = [];
		oFilters.push(
			new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Ecode", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			})
		);

		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},

	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onCancelCode: function (oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(null);
	},

	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirmCode: function (oEvent) {
		var aContexts = oEvent.getParameter("selectedContexts");

		if (aContexts.length) {
			var vCode = aContexts[0].getProperty("Ecode");
			var vCodetx = aContexts[0].getProperty("Etext");

			if (vCode == "") {
				vCodetx = "";
			}

			var oControl = sap.ui.getCore().byId(common.SearchCode.vCallControlId);
			if (oControl) {
				oControl.setValue(vCodetx);

				var oCustomData = oControl.getCustomData();

				var vItgrp = "";
				for (var i = 0; i < oCustomData.length; i++) {
					if (oCustomData[i].getKey() == "Itgrp") {
						vItgrp = oCustomData[i].getValue();
						break;
					}
				}
				var vKey = oCustomData[0].getKey();

				if (vItgrp == "") {
					oControl.removeAllCustomData();
					oControl.destroyCustomData();

					oControl.addCustomData(new sap.ui.core.CustomData({ key: vKey, value: vCode }));
					for (var i = 1; i < oCustomData.length; i++) {
						oControl.addCustomData(oCustomData[i]);
					}
				} else {
					var oModel = sap.ui.getCore().getModel("JSON_" + vItgrp);
					var pos1 = common.SearchCode.vCallControlId.lastIndexOf("-");
					var idx = common.SearchCode.vCallControlId.substring(pos1 + 1);
					oModel.setProperty("/TableDataList/" + idx + "/" + vKey, vCode);
				}

				if (vKey == "Host_werks") {
					common.SearchCode.oController.onSelectHost_werks(vCode);
				}
			}
			// 폴란드일 경우 국가 , 지역, 지역코드의 선택에 따라 특정 필드의 값을 초기화 시킴
			if (common.SearchCode.oController._vMolga == "46") {
				var vIds = common.SearchCode.vCallControlId.split("_");
				var vFieldname = vIds[vIds.length - 1];
				var vClearFieldNames = [];
				if (vFieldname == "Land1") {
					vClearFieldNames.push("State");
					vClearFieldNames.push("Counc");
					vClearFieldNames.push("Tery2");
					vClearFieldNames.push("Rctvc");
				} else if (vFieldname == "State") {
					vClearFieldNames.push("Counc");
					vClearFieldNames.push("Tery2");
					vClearFieldNames.push("Rctvc");
				} else if (vFieldname == "Counc") {
					vClearFieldNames.push("Tery2");
					vClearFieldNames.push("Rctvc");
				}

				for (var i = 0; i < vClearFieldNames.length; i++) {
					var oControl = sap.ui.getCore().byId(common.SearchCode.vCallControlId.replace(vFieldname, vClearFieldNames[i]));
					if (oControl) {
						oControl.setValue("");
						var oCustomData = oControl.getCustomData();
						var vKey = oCustomData[0].getKey();
						oControl.removeAllCustomData();
						oControl.destroyCustomData();
						oControl.addCustomData(new sap.ui.core.CustomData({ key: vKey, value: "" }));
					}
				}
			}
		}

		common.SearchCode.onCancelCode(oEvent);
	}
};
