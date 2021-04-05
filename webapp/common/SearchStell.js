jQuery.sap.declare("common.SearchStell");

jQuery.sap.require("common.Common");

var StellTree = null;
var StellTreePer = null;

common.SearchStell = {
	/**
	 * @memberOf common.SearchStell
	 */
	vPersa: "1000",
	oController: null,
	vActionType: "Multi",
	vCallControlId: "",
	vCallControlType: "MultiInput",

	searchStell: function (oEvent) {
		var oFilters = [];

		var oDatum = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");

		var vPersa = common.SearchStell.oController._vPersa;
		var oMultiInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);

		var filterString = "?$filter=Stype eq '1' and Persa eq '" + common.SearchStell.vPersa + "'";
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

		if (oDatum.getValue() != "") {
			filterString += " and Datum%20eq%20datetime%27" + dateFormat.format(new Date(oDatum.getValue())) + "T00%3a00%3a00%27";
			oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}

		if (oStext.getValue() != "") {
			filterString += " and Stext eq '" + encodeURIComponent(oStext.getValue()) + "'";
			oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, oStext.getValue()));
		}

		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		oTable.setBusy(true);

		var _JSonModel = oTable.getModel();
		var vDatas = { JoblistSet: [] };

		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/JobListSet" + filterString;
		oModel.read(
			oPath,
			null,
			null,
			true,
			function (data, res) {
				if (data && data.results.length) {
					for (var i = 0; i < data.results.length; i++) {
						vDatas.JoblistSet.push(data.results[i]);
					}

					_JSonModel.setData(vDatas);
					oTable.setModel(_JSonModel);
					oTable.bindRows("/JoblistSet");	
				}

				oTable.setBusy(false);
			},
			function (res) {
				_JSonModel.setData({ JoblistSet: [] });
				oTable.setModel(_JSonModel);
				oTable.bindRows("/JoblistSet");

				oTable.setBusy(false);
				console.log(res);
			}
		);
	},

	onClose: function (oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if (oDialog) oDialog.close();
	},

	onKeyUp: function (oEvent) {
		if (oEvent.which == 13) {
			common.SearchStell.searchStell();
		}
	},

	onConfirm: function (oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		var oModel = oTable.getModel();
		var vContexts = oTable.getSelectedIndices();
		var vSelectedStell = [];

		if (vContexts && vContexts.length) {
			for (var i = 0; i < vContexts.length; i++) {
				var _selPath = oTable.getContextByIndex(vContexts[i]).sPath;
				var vStellInfo = {};
				vStellInfo.Stell = oModel.getProperty(_selPath + "/Stell");
				vStellInfo.Stext = oModel.getProperty(_selPath + "/Stext");

				vSelectedStell.push(vStellInfo);
			}
		} else {
			sap.m.MessageBox.alert(common.SearchStell.oController("MSG_00039")); // 직무를 선택해 주시기 바랍니다.
			return;
		}

		if (common.SearchStell.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);
			if (oMultiInput) {
				for (var i = 0; i < vSelectedStell.length; i++) {
					oMultiInput.addToken(
						new sap.m.Token({
							key: vSelectedStell[i].Stell,
							text: vSelectedStell[i].Stext,
							editable: false
						})
					);
				}
			}
		} else if (common.SearchStell.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);
			if (oInput) {
				if (vSelectedStell && vSelectedStell.length) {
					oInput.setValue(vSelectedStell[0].Stext);
					oInput.removeAllCustomData();
					var vTmp = common.SearchStell.vCallControlId.split("_");
					var vTmpId = common.SearchStell.vCallControlId.replace(vTmp[0] + "_", "");

					oInput.addCustomData(new sap.ui.core.CustomData({ key: vTmpId, value: vSelectedStell[0].Stell }));
					oInput.addCustomData(new sap.ui.core.CustomData({ key: "Subjftx", value: vSelectedStell[0].SubStext }));
					oInput.addCustomData(new sap.ui.core.CustomData({ key: "Manjftx", value: vSelectedStell[0].MainStext }));
				}
			}
		}

		var oDialog = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if (oDialog) oDialog.close();
	},

	onBeforeOpenSearchStellDialog: function (oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");

		var oDatum = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		if (common.SearchStell.oController._vActda != null) {
			oDatum.setValue(common.SearchStell.oController._vActda);
		}

		oTable.unbindRows();
		oStext.setValue("");
	},

	onAfterOpenSearchStellDialog: function (oEvent) {}
};
