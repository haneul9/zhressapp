jQuery.sap.declare("common.SearchUser1");

jQuery.sap.require("common.Common");
/**
 * 사원검색의 Dialog를 위한 JS 이다.
 * @Create By 정명구
 */

common.SearchUser1 = {
	/**
	 * @memberOf common.SearchUser1
	 */

	oController: null,
	EsBusyDialog: null,
	//Add by Wave2
	fPersaEnabled: true,

	vHeight: 330,

	vColumns: [
		{ id: "Ename", label: "성명", control: "txt", width: "180px", align: "left" }, //성명
		{ id: "Pernr", label: "사번", control: "txt", width: "80px", align: "left" }, //사번
		{ id: "Fulln", label: "소속", control: "txt", width: "180px", change: "OrgehC", align: "left" }, //소속
		{ id: "Pgtxt", label: "사원그룹", control: "txt", width: "100px", change: "PersgC", align: "left" }, //사원그룹
		{ id: "Pktxt", label: "사원하위그룹", control: "txt", width: "100px", change: "PersgC", align: "left" }, //사원하위그룹
		{ id: "Statx", label: "제직구분", control: "txt", width: "80px", change: "PersgC", align: "left" }, //재직구분
		{ id: "Btrtx", label: "인사 하위 영역", control: "txt", width: "100px", change: "BtrtlC", align: "left" }, //인사 하위 영역
		{ id: "Gbdat", label: "생년월일", control: "txt", width: "80px", align: "left" }, //생년월일
		{ id: "Geschtx", label: "성별", control: "txt", width: "60px", align: "left" }, //성별
		{ id: "Entda", label: "입사일", control: "txt", width: "80px", align: "left" }, //입사일
		{ id: "Retda", label: "퇴사일", control: "txt", width: "80px", align: "left" } //퇴사일
	],

	searchFilterBar: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });

		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");

		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var oFilters = [];
		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";

		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));

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

		if (oStat1 && oStat1.getSelectedKey() != "0000") {
			filterString += "%20and%20Stat1%20eq%20%27" + oStat1.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Stat1", sap.ui.model.FilterOperator.EQ, oStat1.getSelectedKey()));
		}

		if (oZzjobgr && oZzjobgr.getSelectedKey() != "0000" && oZzjobgr.getSelectedKey() != "0") {
			filterString += "%20and%20Zzjobgr%20eq%20%27" + oZzjobgr.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzjobgr", sap.ui.model.FilterOperator.EQ, oZzjobgr.getSelectedKey()));
		}

		if (oZzcaltl && oZzcaltl.getSelectedKey() != "0000" && oZzcaltl.getSelectedKey() != "0" && oZzcaltl.getSelectedKey() != "") {
			filterString += "%20and%20Zzcaltl%20eq%20%27" + oZzcaltl.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzcaltl", sap.ui.model.FilterOperator.EQ, oZzcaltl.getSelectedKey()));
		}

		if (oZzpsgrp && oZzpsgrp.getSelectedKey() != "0000" && oZzpsgrp.getSelectedKey() != "0" && oZzpsgrp.getSelectedKey() != "") {
			filterString += "%20and%20Zzpsgrp%20eq%20%27" + oZzpsgrp.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzpsgrp", sap.ui.model.FilterOperator.EQ, oZzpsgrp.getSelectedKey()));
		}

		if (oZzrollv && oZzrollv.getSelectedKey() != "0000" && oZzrollv.getSelectedKey() != "0" && oZzrollv.getSelectedKey() != "") {
			filterString += "%20and%20Zzrollv%20eq%20%27" + oZzrollv.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzrollv", sap.ui.model.FilterOperator.EQ, oZzrollv.getSelectedKey()));
		}

		if (oPersg && oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0" && oPersg.getSelectedKey() != "") {
			filterString += "%20and%20Persg%20eq%20%27" + oPersg.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
		}

		if (oPersk && oPersk.getSelectedKey() != "0000" && oPersk.getSelectedKey() != "0" && oPersk.getSelectedKey() != "") {
			filterString += "%20and%20Persk%20eq%20%27" + oPersk.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persk", sap.ui.model.FilterOperator.EQ, oPersk.getSelectedKey()));
		}

		if (oFilters.length < 4) {
			sap.m.MessageBox.alert("최소한 2개이상의 검색조건이 있어야 합니다.");
			return;
		}

		//		var oCheckHeader = sap.ui.getCore().byId(oController.PAGEID + "_ES_CheckHeader");
		//		oCheckHeader.setChecked(false);
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = { EmpSearchResultSet: [] };
		var readAfterProcess = function () {
			if (oController.EsBusyDialog.isOpen()) {
				oController.EsBusyDialog.close();
			}
		};

		if (!oController.EsBusyDialog) {
			oController.EsBusyDialog = new sap.m.Dialog({ showHeader: false });
			oController.EsBusyDialog.addContent(new sap.m.BusyIndicator({ text: "검색중입니다. 잠시만 기다려 주십시오." }));
			oController.getView().addDependent(oController.EsBusyDialog);
		} else {
			oController.EsBusyDialog.removeAllContent();
			oController.EsBusyDialog.destroyContent();
			oController.EsBusyDialog.addContent(new sap.m.BusyIndicator({ text: "검색중입니다. 잠시만 기다려 주십시오." }));
		}
		if (!oController.EsBusyDialog.isOpen()) {
			oController.EsBusyDialog.open();
		}

		oCommonModel.read(
			"/EmpSearchResultSet" + filterString,
			null,
			null,
			false,
			function (oData, oResponse) {
				if (oData && oData.results) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].Chck = false;
						vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
					}

					//							if(vEmpSearchResult.EmpSearchResultSet.length > 0) {
					//								mEmpSearchResult.setData(vEmpSearchResult);
					//							}
					mEmpSearchResult.setData(vEmpSearchResult);
				}
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);

		setTimeout(readAfterProcess, 300);

		//		clearSelection
	},

	onAfterOpenSearchDialog: function (oEvent) {
		console.log("!@#!@#!@#!@#");
		var oController = common.SearchUser1.oController;
		var a = $("__column36");
		console.log(a);
		a.css("paddingTop", "0px !important");
		common.SearchUser1.onAfterRendering();

		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");

		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");

		// selection 초기화
		var oSearchTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if (oSearchTable) {
			oSearchTable.clearSelection();
		}

		oStat1.removeAllItems();
		oStat1.destroyItems();

		//Add by Wave2
		oPersa.setEnabled(common.SearchUser1.fPersaEnabled);

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var vWave = "";
		if (common.SearchUser1.oController.Wave && common.SearchUser1.oController.Wave == "1") {
			vWave = "1";
		} else if (common.SearchUser1.oController.Wave && common.SearchUser1.oController.Wave == "2") {
			vWave = "2";
		}

		try {
			oCommonModel.read(
				"/PersAreaListSet/?$filter=Actty%20eq%20%271%27 and Wave eq '" + vWave + "'",
				//oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27",
				null,
				null,
				false,
				function (oData, oResponse) {
					if (oData && oData.results.length) {
						for (var i = 0; i < oData.results.length; i++) {
							oPersa.addItem(
								new sap.ui.core.Item({
									key: oData.results[i].Persa,
									text: oData.results[i].Pbtxt
								})
							);
						}
						if (oController._vPersa == "") {
							oPersa.setSelectedKey(oData.results[0].Persa);
							oController._vPersa = oData.results[0].Persa;
						} else {
							oPersa.setSelectedKey(oController._vPersa);
						}
					}
				},
				function (oResponse) {
					common.Common.log(oResponse);
				}
			);
		} catch (ex) {
			common.Common.log(ex);
		}

		//		oPersa.setSelectedKey(oController._vPersa);

		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20ICusrid%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "%27";
		filterString += "%20and%20ICusrse%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.csrf-token')) + "%27";
		filterString += "%20and%20ICusrpn%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "%27";
		filterString += "%20and%20ICmenuid%20eq%20%27" + $.app.getMenuId() + "%27";

		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = { EmpCodeListSet: [] };

		//		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		var vControls = ["Stat1", "Persg"];

		filterString += "%20and%20(";
		for (var i = 0; i < vControls.length; i++) {
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if (i != vControls.length - 1) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({ Field: vControls[i], Ecode: "0000", Etext: "-- 선택 --" });
		}
		filterString += ")";

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

		//		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		var oControls = [oStat1, oPersg];
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
	},

	onBeforeOpenSearchDialog: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");

		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");

		oEname.setValue("");
		oFulln.removeAllTokens();
		oFulln.destroyTokens();
		oFulln.setValue("");

		oStat1.removeAllItems();
		oStat1.destroyItems();
		if (oZzjobgr) {
			oZzjobgr.removeAllItems();
			oZzjobgr.destroyItems();
		}
		if (oZzcaltl) {
			oZzcaltl.removeAllItems();
			oZzcaltl.destroyItems();
		}
		if (oZzpsgrp) {
			oZzpsgrp.removeAllItems();
			oZzpsgrp.destroyItems();
		}
		if (oPersg) {
			oPersg.removeAllItems();
			oPersg.destroyItems();
		}
		if (oZzrollv) oZzrollv.destroyItems();
		if (oPersk) oPersk.destroyItems();

		oPersa.destroyItems();

		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		mEmpSearchResult.setData(null);
	},

	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onClose: function (oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog");
		if (oDialog) oDialog.close();
	},

	onExpandFilter: function (oEvent) {
		var oController = common.SearchUser1.oController;
		var fExpand = oEvent.getParameter("expand");

		if (fExpand) {
			$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight);
		} else {
			$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight + 160);
		}
	},

	onKeyUp: function (oEvent) {
		if (oEvent.which == 13) {
			common.SearchUser1.searchFilterBar();
		}
	},

	onAfterRendering: function () {
		var oController = common.SearchUser1.oController;

		common.SearchUser1.vHeight = window.innerHeight - 300;

		$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight);
	},

	onChangePersa: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		var oItem = oEvent.getParameter("selectedItem");

		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");

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

		oZzrollv.destroyItems();
		oPersk.destroyItems();

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var filterString = "/?$filter=Persa%20eq%20%27" + oItem.getKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20ICusrid%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "%27";
		filterString += "%20and%20ICusrse%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.csrf-token')) + "%27";
		filterString += "%20and%20ICusrpn%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "%27";
		filterString += "%20and%20ICmenuid%20eq%20%27" + $.app.getMenuId() + "%27";

		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = { EmpCodeListSet: [] };

		//		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		var vControls = ["Stat1", "Persg"];
		filterString += "%20and%20(";
		for (var i = 0; i < vControls.length; i++) {
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if (i != vControls.length - 1) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({ Field: vControls[i], Ecode: "0000", Etext: "-- 선택 --" });
		}
		filterString += ")";

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

		//		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		var oControls = [oStat1, oPersg];
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
	},

	onChangePersg: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		var oItem = oEvent.getParameter("selectedItem");

		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");

		oPersk.destroyItems();

		if (oItem.getKey() == "0000") return;

		var vActda = "";
		if (!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}

		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Field%20eq%20%27" + "Persk" + "%27";
		filterString += "%20and%20Excod%20eq%20%27" + oItem.getKey() + "%27";
		filterString += "%20and%20ICusrid%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "%27";
		filterString += "%20and%20ICusrse%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.odata.csrf-token')) + "%27";
		filterString += "%20and%20ICusrpn%20eq%20%27" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "%27";
		filterString += "%20and%20ICmenuid%20eq%20%27" + $.app.getMenuId() + "%27";

		oPersk.addItem(new sap.ui.core.Item({ key: "0000", text: "-- 선택 --" }));

		oCommonModel.read(
			"/EmpCodeListSet" + filterString,
			null,
			null,
			false,
			function (oData, oResponse) {
				if (oData && oData.results) {
					for (var i = 0; i < oData.results.length; i++) {
						oPersk.addItem(
							new sap.ui.core.Item({
								key: oData.results[i].Ecode,
								text: oData.results[i].Etext
							})
						);
					}
				}
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);
	},

	onClickMore: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var oControl = oEvent.getSource();
		var vText = oControl.getText();

		var oFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter6");

		if (vText == "More") {
			oFilter6.setVisible(true);
			oControl.setText("Hide");
		} else {
			oFilter6.setVisible(false);
			oControl.setText("More");
		}
	},

	onChangeCheckHeader: function (oEvent) {
		var oController = common.SearchUser1.oController;

		var oControl = oEvent.getSource();
		var vChecked = oControl.getChecked();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		var mEmpSearchResult = oTable.getModel();

		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vEmpSearchResultData = { EmpSearchResultSet: [] };
		for (var i = 0; i < vEmpSearchResult.length; i++) {
			vEmpSearchResult[i].Chck = vChecked;
			vEmpSearchResultData.EmpSearchResultSet.push(vEmpSearchResult[i]);
		}
		mEmpSearchResult.setData(vEmpSearchResultData);
	}
};
