jQuery.sap.declare("common.SearchUser1");

jQuery.sap.require("common.Common");

common.SearchUser1 = {
    /**
     * @memberOf common.SearchUser1
     */

    oController: null,
    EsBusyDialog: new sap.m.BusyDialog(),

    fPersaEnabled: true,
    searchAuth: null,

    vHeight: 330,
    clicks: 0,
    _vSPath: -1,

    initModels: function () {
        // Set Model
        if (!sap.ui.getCore().getModel("EmpSearchResult")) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "EmpSearchResult");
        }
        if (!sap.ui.getCore().getModel("EmpSearchCodeList")) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "EmpSearchCodeList");
        }
        $.app.byId(common.SearchUser1.oController.PAGEID + "_EmpSearchResult_Table").setModel(sap.ui.getCore().getModel("EmpSearchResult"));
    },

    searchFilterBar: function () {
        var oController = common.SearchUser1.oController;
        var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_ES_Dialog");
        var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
        var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
        var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat2");
        var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
        var oZhgrade = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zhgrade");
        var vActda = oController._vActda ? oController._vActda : new Date().setHours(9);

        var oFilters = [
			new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
			new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Bukrs2")),
			new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, $.app.APP_ID == "ZUI5_HR_HRDoc.Page" ? "A" : common.SearchUser1.searchAuth ? common.SearchUser1.searchAuth : $.app.getAuth()),
			new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()),
			new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(vActda))
		];

        if (oEname.getValue() != "") {
            if (oEname.getValue().length < 2) {
                sap.m.MessageBox.alert(oController.getBundleText("MSG_00064")); // 성명은 2자 이상이어야 합니다.
                return;
            }

            oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, oEname.getValue()));
        }

        if (oStat2 && oStat2.getSelectedKey() != "0000") {
            oFilters.push(new sap.ui.model.Filter("Stat2", sap.ui.model.FilterOperator.EQ, oStat2.getSelectedKey()));
        }

        if (oPersg && oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0" && oPersg.getSelectedKey() != "") {
            oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
        }
        
        if(oZhgrade && oZhgrade.getSelectedKey() != "0000" && oZhgrade.getSelectedKey() != "0" && oZhgrade.getSelectedKey() != ""){
        	oFilters.push(new sap.ui.model.Filter("Zhgrade", sap.ui.model.FilterOperator.EQ, oZhgrade.getSelectedKey()));
        }

        var oSubFilters = [];
        oFulln.getTokens().forEach(function (token) {
            oSubFilters.push(new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, token.getKey()));
        });
        if (oSubFilters.length) {
            oFilters.push(new sap.ui.model.Filter({
                filters: oSubFilters,
                and: false
            }));
        }

        if (oFilters.length < 4) {
            sap.m.MessageBox.alert(oController.getBundleText("MSG_00063")); // 최소한 2개이상의 검색조건이 있어야 합니다.
            return;
        }

        oTable.clearSelection();
        oDialog.setBusyIndicatorDelay(0);
        oDialog.setBusy(true);

        var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
        var vEmpSearchResult = {
            EmpSearchResultSet: []
        };

        common.Common.getPromise(
            function () {
                $.app.getModel("ZHR_COMMON_SRV").read("/EmpSearchResultSet", {
                    async: false,
                    filters: oFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            vEmpSearchResult.EmpSearchResultSet = oData.results.map(function (elem) {
                                return $.extend(true, elem, {
                                    Chck: false
                                });
                            });
                            mEmpSearchResult.setData(vEmpSearchResult);
                        }
                    },
                    error: function (oResponse) {
                        common.Common.log(oResponse);
                    }
                });
            }.bind(this)
        ).then(function () {
            oDialog.setBusy(false);
        });
    },

    loadPersaControl: function () {
        var oController = common.SearchUser1.oController;
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var aFilters = [
			new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
			new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Bukrs2"))
		];

        oPersa.setEnabled(common.SearchUser1.fPersaEnabled);

        if (common.SearchUser1.searchAuth === "A") {
            aFilters.push(new sap.ui.model.Filter("Mtype", sap.ui.model.FilterOperator.EQ, "A"));
        }

        $.app.getModel("ZHR_COMMON_SRV").read("/WerksListAuthSet", {
            async: false,
            filters: aFilters,
            success: function (oData) {
                if (oData && oData.results.length) {
                    oData.results.forEach(function (elem) {
                        oPersa.addItem(new sap.ui.core.Item({
                            key: elem.Persa,
                            text: elem.Pbtxt
                        }));
                    });

                    if (!oController._vPersa || common.SearchUser1.searchAuth === "A") {
                        oPersa.setSelectedKey(oPersa.getItemAt(0).getKey());
                        if((common.SearchUser1.searchAuth !== "A"))
                            oController._vPersa = oPersa.getItemAt(0).getKey();
                    } else {
                        oPersa.setSelectedKey(oController._vPersa);
                    }
                }
            },
            error: function (Res) {
                common.Common.log(Res);
                
                if(Res.response.body){
					var ErrorMessage = Res.response.body;
					var ErrorJSON = JSON.parse(ErrorMessage);
					
					if(ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length){
						sap.m.MessageBox.error(ErrorJSON.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.error(ErrorMessage);
					}
				}
            }
        });
    },

    loadCommonControls: function () {
        var oController = common.SearchUser1.oController;
        var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat2");
        var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
        var oZhgrade = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zhgrade");
        
        var vActda = oController._vActda ? oController._vActda : new Date().setHours(9);
        var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
        var vEmpCodeList = {
            EmpCodeListSet: []
        };
        var oFilters = [];

        oStat2.removeAllItems();
        oStat2.destroyItems();
        oPersg.removeAllItems();
        oPersg.destroyItems();
        oZhgrade.removeAllItems();
        oZhgrade.destroyItems();

        var oControls = [
            {
                text: "Stat2",
                object: oStat2
            }, // 재직구분
            {
                text: "Persg",
                object: oPersg
            }, // 사원그룹
            {
            	text : "Zhgrade",
            	object: oZhgrade
            } // 직급구분
		];

        oFilters = [
			new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
			new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(vActda))
		];

        var oSubFilters = [];
        oControls.forEach(function (control) {
            oSubFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, control.text));
        });
        if (oSubFilters.length) {
            oFilters.push(new sap.ui.model.Filter({
                filters: oSubFilters,
                and: false
            }));
        }

        $.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
            async: false,
            filters: oFilters,
            success: function (oData) {
                if (oData && oData.results) {
                    vEmpCodeList.EmpCodeListSet = oData.results;
                    mEmpCodeList.setData(vEmpCodeList);
                }
            },
            error: function (oResponse) {
                common.Common.log(oResponse);
            }
        });

        oControls.forEach(function (control) {
            control.object.addItem(new sap.ui.core.Item({
                key: "0000",
                text: oController.getBundleText("LABEL_00193")
            })); // -- 선택 --

            vEmpCodeList.EmpCodeListSet.filter(function (elem) {
                return elem.Field === control.text;
            }).forEach(function (elem) {
                control.object.addItem(new sap.ui.core.Item({
                    key: elem.Ecode,
                    text: elem.Etext
                }));
            });
        });

        oStat2.setSelectedKey("3"); // 재직자 선택
    },

    onAfterOpenSearchDialog: function () {
        var oController = common.SearchUser1.oController;

        // Set Model
        common.SearchUser1.initModels();

        // 인사영역
        if (common.SearchUser1._vPersa) {
            oController._vPersa = common.SearchUser1._vPersa;
        }
        common.SearchUser1.loadPersaControl();

        // 재직구분, 사원그룹
        common.SearchUser1.loadCommonControls();

        if (oController._vEnamefg && oController._vEnamefg == "X") {
            var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
            oEname.setValue(oController._oControl.getValue());
            common.SearchUser1.searchFilterBar();
        }
    },

    onBeforeCloseSearchDialog: function () {
        var oController = common.SearchUser1.oController;
        var oSearchTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
        var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
        var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat2");
        var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
        var oZhgrade = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zhgrade");

        if (oSearchTable) oSearchTable.clearSelection();
        oEname.setValue("");
        oFulln.removeAllTokens();
        oFulln.destroyTokens();
        oFulln.setValue("");

        oStat2.removeAllItems();
        oStat2.destroyItems();
        if (oPersg) {
            oPersg.removeAllItems();
            oPersg.destroyItems();
        }
        
        if(oZhgrade){
        	oZhgrade.removeAllItems();
        	oZhgrade.destroyItems();
        	oZhgrade.setSelectedKey("0000");
        }

        oPersa.destroyItems();

        // common.SearchUser1._vPersa = null;
        // common.SearchUser1.fPersaEnabled = true;

        var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
        mEmpSearchResult.setData(null);
    },

    onClose: function () {
        var oDialog = sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog");
        if (oDialog) oDialog.close();
    },

    onKeyUp: function (oEvent) {
        if (oEvent.which == 13) {
            common.SearchUser1.searchFilterBar();
        }
    },

    onChangePersa: function () {
        // 재직구분, 사원그룹
        common.SearchUser1.loadCommonControls();
    },

    onClick: function (oEvent) {
        var oController = common.SearchUser1.oController;
        var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        var vContext = oEvent.getParameters().rowBindingContext;
        var oTableModel = oTable.getModel();
        if (vContext == undefined || oTableModel.getProperty(vContext.sPath) == null) {
            return;
        }

        common.SearchUser1.clicks = common.SearchUser1.clicks + 1;

        if (common.SearchUser1.clicks == 1) {
            setTimeout(common.SearchUser1.clearClicks, 500);
        } else if (common.SearchUser1.clicks == 2) {
            common.SearchUser1._vSPath = vContext.sPath;
        }
    },

    clearClicks: function () {
        common.SearchUser1.clicks = 0;
        common.SearchUser1._vSPath = -1;
    },

    onDblClick: function () {
        var oController = common.SearchUser1.oController;
        var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        if (common.SearchUser1._vSPath == null || common.SearchUser1._vSPath == -1) return;
        var vIndex = common.SearchUser1._vSPath.replace("/EmpSearchResultSet/", "");
        oTable.clearSelection();
        oTable.setSelectedIndex(parseInt(vIndex));
        oController.onESSelectPerson.bind(oController)(sap.ui.getCore().getModel("EmpSearchResult").getProperty(common.SearchUser1._vSPath));
    },

    onESSelectPerson: function () {
        var core = sap.ui.getCore(),
        oController = common.SearchUser1.oController,
        oTable = core.byId(oController.PAGEID + "_EmpSearchResult_Table"),
        vIndex = oTable.getSelectedIndex();
        if (vIndex === -1) {
            sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상을 선택하세요.
            return;
        } else {
            common.SearchUser1._vSPath = oTable.getContextByIndex(vIndex).getPath();
        }
        oController.onESSelectPerson.call(oController, core.getModel("EmpSearchResult").getProperty(common.SearchUser1._vSPath));
    }

};