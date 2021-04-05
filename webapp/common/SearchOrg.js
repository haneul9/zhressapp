jQuery.sap.declare("common.SearchOrg");

jQuery.sap.require("common.Common");

var OrgTree = null;

common.SearchOrg = {

	oController: null,
	vActionType: "Multi",
	vCallControlId: "",
	vCallControlType: "MultiInput",
	vNoPersa: false,
	vPersa: "1000",

	searchOrg: function (oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		var _JSonModel = oTable.getModel();
		var vDatas = { OrgListSet: [] };
		var oFilters = [
			new sap.ui.model.Filter("Stype", sap.ui.model.FilterOperator.EQ, "1"),
			new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, common.SearchOrg.vPersa)
		];

		if (oStext.getValue() == "") {
			var vMsg = common.SearchOrg.oController.getBundleText("MSG_00037"); // 검색어를 입력해 주시기 바랍니다.
			sap.m.MessageBox.alert(vMsg);
			return;
		} else {
			oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, oStext.getValue()));
		}

		if (oDatum.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}

		oTable.setBusyIndicatorDelay(0);
		oTable.setBusy(true);

		common.Common.getPromise(
			function () {
				$.app.getModel("ZHR_COMMON_SRV").read("/OrgListSet", {
					async: false,
					filters: oFilters,
					success: function(data) {
						if (data && data.results.length) {
							vDatas.OrgListSet = data.results;
						}
					},
					error: function(res) {
						console.log(res);
					}
				});
			}.bind(this)
		).then(function () {
			_JSonModel.setData(vDatas);
			oTable.setModel(_JSonModel);
			oTable.bindRows("/OrgListSet");
			oTable.setBusy(false);
		});
	},

	searchOrgNext: function (oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if (oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 0);
		}
	},

	searchOrgPrev: function (oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if (oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 1);
		}
	},

	onClose: function (oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		if (oDialog) oDialog.close();
	},

	onKeyUp: function (oEvent) {
		if (oEvent.which == 13) {
			common.SearchOrg.searchOrg();
		}
	},

	onConfirm: function (oEvent) {
		var vSelectedOrg = [];
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oModel = oTable.getModel();
		var vContexts = oTable.getSelectedIndices();

		if (vContexts && vContexts.length) {
			vSelectedOrg = vContexts.map(function(ctx) {
				return oModel.getProperty(oTable.getContextByIndex(ctx).getPath());
			});
		} else {
			sap.m.MessageBox.alert(common.SearchOrg.oController.getBundleText("MSG_00038"));    // 부서를 선택해 주시기 바랍니다.
			return;
		}

		if (common.SearchOrg.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			
			if(common.SearchOrg.vActionType == "Single"){
				if(vContexts.length != 1){
					sap.m.MessageBox.error(common.SearchOrg.oController.getBundleText("MSG_00067")); // 부서를 하나만 선택하여 주십시오.
					return;
				}
				
				var data = oModel.getProperty(oTable.getContextByIndex(vContexts[0]).sPath);
				
				if(oMultiInput){
					oMultiInput.destroyTokens();
					oMultiInput.addToken(
						new sap.m.Token({
							key : data.Orgeh,
							text : data.Stext
						})
					);
				}
				
			} else {
				if (oMultiInput) {
					vSelectedOrg.forEach(function(elem) {
						oMultiInput.addToken(new sap.m.Token({
							key: elem.Orgeh,
							text: elem.Stext
						}));
					});
				}
			}
		} else if (common.SearchOrg.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			if (oInput) {
				if (vSelectedOrg && vSelectedOrg.length) {
					oInput.setValue(vSelectedOrg[0].Stext);
					oInput.removeAllCustomData();
					oInput.addCustomData(new sap.ui.core.CustomData({ key: "Orgeh", value: vSelectedOrg[0].Orgeh }));
				}
			}

			var vTempIds = common.SearchOrg.vCallControlId.split("_");
			var vPrefix = "";
			for (var i = 0; i < vTempIds.length - 1; i++) {
				vPrefix += vTempIds[i] + "_";
			}

			vPrefix = vPrefix.replace("Dis_", "");

			var oControl = sap.ui.getCore().byId(vPrefix + "Zzempwp");
			if (oControl) {
				var vDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum").getDateValue();
				var vZzempwp = "";
				var vZzempwptx = "";

				$.app.getModel("ZHR_COMMON_SRV").read("/OrgWorkplaceSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, vSelectedOrg[0].Orgeh),
						new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, vDatum)
					],
					success: function(oData) {
						if (oData && oData.results.length) {
							vZzempwp = oData.results[0].Objid;
							vZzempwptx = oData.results[0].Stext;
						}
					},
					error: function(oResponse) {
						common.Common.log(oResponse);
					}
				});

				if (vZzempwp != null && vZzempwp != "") {
					if (typeof oControl.setSelectedKey == "function") {
						oControl.setSelectedKey(vZzempwp);
					} else if (typeof oControl.setValue == "function") {
						oControl.setValue(vZzempwptx);
						var oCustomData = oControl.getCustomData();
						if (oCustomData) {
							oControl.removeAllCustomData();
							oControl.destroyCustomData();
							oControl.addCustomData(new sap.ui.core.CustomData({
								key: "Zzempwp",
								value: vZzempwp
							}));

							oCustomData.forEach(function(elem) {
								oControl.addCustomData(elem);
							});
						}
					}
				}
			}
			
			// 발령-조직변경 시 포지션 변경
			if(common.SearchOrg.vCallControlId == "ActAppPersonInfo_Orgeh"){
				var oPlans = sap.ui.getCore().byId(vPrefix + "Plans");
				if(oPlans){
						oPlans.destroyItems();
						oPlans.addItem(new sap.ui.core.Item({key : "0000", text : common.SearchOrg.oController.getBundleText("LABEL_02035")}));
						
					var oWerks = "";
	            	for(var i=0; i<common.SearchOrg.oController._vActiveControl.length; i++){
	            		if(common.SearchOrg.oController._vActiveControl[i].Fieldname == "WERKS"){
	            			oWerks = common.SearchOrg.oController._vActiveControl[i].Dcode;
	            		}
	            	}
						
					$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
						async: false,
						filters: [
							new sap.ui.model.Filter("Field", "EQ", "Plans"),
							new sap.ui.model.Filter("Persa", "EQ", oWerks), 
							new sap.ui.model.Filter("Excod", "EQ", vSelectedOrg[0].Orgeh),
							new sap.ui.model.Filter("Actda", "EQ", common.SearchOrg.oController._vActda),
						],
						success: function(oData) {
							if (oData && oData.results.length) {
								for(var i=0; i<oData.results.length; i++){
									oPlans.addItem(new sap.ui.core.Item({key : oData.results[i].Ecode, text: oData.results[i].Etext}))
								}
							}
						},
						error: function(oResponse) {
							common.Common.log(oResponse);
						}
					});
					
					oPlans.setSelectedKey("0000");
				}
			}
		}

		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		if (oDialog) oDialog.close();
	},

	onBeforeOpenSearchOrgDialog: function (oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");

		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		if (common.SearchOrg.oController._vActda != null) {
			oDatum.setValue(common.SearchOrg.oController._vActda);
		}

		// set Dtfmt
		if(!common.SearchOrg.oController._Dtfmt)
			common.SearchOrg.oController._Dtfmt = common.SearchOrg.oController.getSessionInfoByKey("Dtfmt");

		oTable.unbindRows();
		oStext.setValue("");
	},

	onAfterOpenSearchOrgDialog: function (oEvent) {},

	onAfterCloseSearchOrgDialog: function (oEvent) {
		common.SearchOrg.vNoPersa = false;
	}
};
