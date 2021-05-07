jQuery.sap.declare("common.SearchUser");

jQuery.sap.require("common.Common");
/**
 * ����˻��� Dialog�� ���� JS �̴�.
 * @Create By ����
 */

common.SearchUser = {
	/**
	 * @memberOf common.SearchUser
	 */

	oController: null,

	searchFilterBar: function (oEvent) {
		var oController = common.SearchUser.oController;

		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		var oRegno = sap.ui.getCore().byId(oController.PAGEID + "_ES_Regno");
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var oFilters = [
			new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
			new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
			new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
			new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
		];
		var filterString = "/?$filter=Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20ICusrid%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "%27";
		filterString += "%20and%20ICusrse%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "%27";
		filterString += "%20and%20ICusrpn%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "%27";
		filterString += "%20and%20ICmenuid%20eq%20%27" + $.app.getMenuId() + "%27";

		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));

		if (oPersa.getSelectedKey() != "") {
			filterString += "%20and%20Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		}

		if (oEname.getValue() != "") {
			if (oEname.getValue().length < 2) {
				sap.m.MessageBox.alert("성명은 2자 이상이어야 합니다.");
				return;
			}
			filterString += "%20and%20Ename%20eq%20%27" + encodeURI(oEname.getValue()) + "%27";
			oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, encodeURI(oEname.getValue())));
		}

		var oFulln_Tokens = oFulln.getTokens();
		if (oFulln_Tokens && oFulln_Tokens.length) {
			var oFulln_filterString = "";
			for (var i = 0; i < oFulln_Tokens.length; i++) {
				if (oFulln_filterString == "") oFulln_filterString = "%20and%20(";
				else oFulln_filterString += "%20or%20";
				oFulln_filterString += "Orgeh%20eq%20%27" + oFulln_Tokens[i].getKey() + "%27";
				oFilters.push(new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, oFulln_Tokens[i].getKey()));
			}
			if (oFulln_filterString != "") filterString += oFulln_filterString + ")";
		}

		if (oRegno.getValue() != "") {
			filterString += "%20and%20Regno%20eq%20%27" + oRegno.getValue() + "%27";
			oFilters.push(new sap.ui.model.Filter("Regno", sap.ui.model.FilterOperator.EQ, oRegno.getValue()));
		}

		if (oStat1.getSelectedKey() != "0000") {
			filterString += "%20and%20Stat1%20eq%20%27" + oStat1.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Stat1", sap.ui.model.FilterOperator.EQ, oStat1.getSelectedKey()));
		}

		if (oZzjobgr.getSelectedKey() != "0000" && oZzjobgr.getSelectedKey() != "0") {
			filterString += "%20and%20Zzjobgr%20eq%20%27" + oZzjobgr.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzjobgr", sap.ui.model.FilterOperator.EQ, oZzjobgr.getSelectedKey()));
		}

		if (oZzcaltl.getSelectedKey() != "0000" && oZzcaltl.getSelectedKey() != "0") {
			filterString += "%20and%20Zzcaltl%20eq%20%27" + oZzcaltl.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzcaltl", sap.ui.model.FilterOperator.EQ, oZzcaltl.getSelectedKey()));
		}

		if (oZzpsgrp.getSelectedKey() != "0000" && oZzpsgrp.getSelectedKey() != "0") {
			filterString += "%20and%20Zzpsgrp%20eq%20%27" + oZzpsgrp.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzpsgrp", sap.ui.model.FilterOperator.EQ, oZzpsgrp.getSelectedKey()));
		}

		if (oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0") {
			filterString += "%20and%20Persg%20eq%20%27" + oPersg.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
		}

		if (oFilters.length < 3) {
			sap.m.MessageBox.alert("최소한 2개이상의 검색조건이 있어야 합니다.");
			return;
		}

		var oCommonModel = $.app.getModel("ZL2P01GW9000_SRV");
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = { EmpSearchResultSet: [] };
		var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");

		oCommonModel.read(
			"/EmpSearchResultSet" + filterString,
			null,
			null,
			false,
			function (oData, oResponse) {
				if (oData && oData.results) {
					for (var i = 0; i < oData.results.length; i++) {
						var oneDate = oData.results[i];
						oneDate.Chck = false;
						vEmpSearchResult.EmpSearchResultSet.push(oneDate);
					}
					if (vEmpSearchResult.EmpSearchResultSet.length > 0) {
						mEmpSearchResult.setData(vEmpSearchResult);
					}
					if (oData.results.length > 6) {
						oPersonList.setVisibleRowCount(6);
					} else {
						oPersonList.setVisibleRowCount(oData.results.length);
					}
					oPersonList.bindRows("/EmpSearchResultSet");
				}
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);
	},

	onAfterOpenSearchDialog: function (oEvent) {
		var oController = common.SearchUser.oController;

		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");

		oStat1.removeAllItems();
		oStat1.destroyItems();

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";

		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		//mEmpCodeList.setData(null);
		var vEmpCodeList = { EmpCodeListSet: [] };

		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg"];

		filterString += "%20and%20(";
		for (var i = 0; i < vControls.length; i++) {
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if (i != vControls.length - 1) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({ Field: vControls[i], Ecode: "0000", Etext: "-- 선택 --" });
		}
		filterString += ")";

		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		oCommonModel.read(
			"/EmpCodeListSet" + filterString,
			null,
			null,
			false,
			function (oData, oResponse) {
				if (oData && oData.results) {
					for (var i = 0; i < oData.results.length; i++) {
						vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
					}
					mEmpCodeList.setData(vEmpCodeList);
				}
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);

		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg];

		for (var i = 0; i < vEmpCodeList.EmpCodeListSet.length; i++) {
			for (var j = 0; j < vControls.length; j++) {
				if (vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(
						new sap.ui.core.Item({ key: vEmpCodeList.EmpCodeListSet[i].Ecode, text: vEmpCodeList.EmpCodeListSet[i].Etext })
					);
				}
			}
		}
		oStat1.setSelectedKey("3");

		//		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
		//			if(vEmpCodeList.EmpCodeListSet[i].Field == "Stat1") {
		//				oStat1.addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
		//			}
		//		}
		//		oStat1.setSelectedKey("3");
		//
		//		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
		//			if(vEmpCodeList.EmpCodeListSet[i].Field == "Zzjobgr") {
		//				oZzjobgr.addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
		//			}
		//		}
		//
		//		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
		//			if(vEmpCodeList.EmpCodeListSet[i].Field == "Zzcaltl") {
		//				oZzcaltl.addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
		//			}
		//		}
		//
		//		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
		//			if(vEmpCodeList.EmpCodeListSet[i].Field == "Zzpsgrp") {
		//				oZzpsgrp.addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
		//			}
		//		}
		//
		//		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
		//			if(vEmpCodeList.EmpCodeListSet[i].Field == "Persg") {
		//				oPersg.addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
		//			}
		//		}

		//		oStat1.setModel(mEmpCodeList);
		//		oStat1.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Stat1")]);
		//		oStat1.setSelectedKey("3");

		//		oZzjobgr.setModel(mEmpCodeList);
		//		oZzjobgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Zzjobgr")]);
		//
		//		oZzcaltl.setModel(mEmpCodeList);
		//		oZzcaltl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Zzcaltl")]);
		//
		//		oZzpsgrp.setModel(mEmpCodeList);
		//		oZzpsgrp.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Zzpsgrp")]);
		//
		//		oPersg.setModel(mEmpCodeList);
		//		oPersg.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Persg")]);
	},

	onBeforeOpenSearchDialog: function (oEvent) {
		var oController = common.SearchUser.oController;

		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		var oRegno = sap.ui.getCore().byId(oController.PAGEID + "_ES_Regno");

		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");

		oEname.setValue("");
		oFulln.removeAllTokens();
		oFulln.destroyTokens();
		oRegno.setValue("");

		oStat1.removeAllItems();
		oZzjobgr.removeAllItems();
		oZzcaltl.removeAllItems();
		oZzpsgrp.removeAllItems();
		oPersg.removeAllItems();

		oStat1.destroyItems();
		oZzjobgr.destroyItems();
		oZzcaltl.destroyItems();
		oZzpsgrp.destroyItems();
		oPersg.destroyItems();

		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		mEmpSearchResult.setData(null);

		var oAllCheck = sap.ui.getCore().byId(oController.PAGEID + "_ES_All_CheckBox");
		oAllCheck.setChecked(false);

		var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		oPersonList.setVisibleRowCount(1);
	},

	/*
	 * ����˻� Dialog�� Close�Ѵ�.
	 */
	onClose: function (oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchUser.oController.PAGEID + "_ES_Dialog");
		if (oDialog) oDialog.close();
	},

	onExpandFilter: function (oEvent) {
		var oController = common.SearchUser.oController;
		var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		var vRows = oPersonList.getRows();

		var fExpand = oEvent.getParameter("expand");
		if (fExpand) {
			if (vRows.length > 6) {
				oPersonList.setVisibleRowCount(6);
			} else {
				oPersonList.setVisibleRowCount(vRows.length);
			}
		} else {
			if (vRows.length > 10) {
				oPersonList.setVisibleRowCount(10);
			} else {
				oPersonList.setVisibleRowCount(vRows.length);
			}
		}
	},

	onKeyUp: function (oEvent) {
		if (oEvent.which == 13) {
			common.SearchUser.searchFilterBar();
		}
	}
};
