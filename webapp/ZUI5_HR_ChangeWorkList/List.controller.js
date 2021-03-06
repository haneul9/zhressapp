sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/OrgOfIndividualHandler",
        "common/DialogHandler",
        "sap/m/MessageBox",
		"common/SearchOrg",
		"common/SearchUser1",
    ],
    function (Common, CommonController, JSONModelHelper, OrgOfIndividualHandler, DialogHandler, MessageBox, SearchOrg, SearchUser1) {
        "use strict";

        return CommonController.extend("ZUI5_HR_ChangeWorkList.List", {
            PAGEID: "ZUI5_HR_ChangeWorkListList",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _Columns: [],

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow
                    },
                    this
                );

                this.getView().addEventDelegate(
                    {
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
				gDtfmt = this.getSessionInfoByKey("Dtfmt");	
                // this.getView().addStyleClass("sapUiSizeCompact");
                // this.getView().setModel($.app.getModel("i18n"), "i18n");
            },

            onBeforeShow: function () {
                var oController = this;

                if (!oController._ListCondJSonModel.getProperty("/Data")) {
                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
                    var today = new Date();

                    var vData = {
                        Data: {
                            Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                            Pernr: "",
                            Orgeh: "",
                            Ename: "",
                            Langu: oController.getSessionInfoByKey("Langu"),
                            Begda: dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
                            Endda: dateFormat.format(new Date(today.getFullYear(), today.getMonth(), oController.getLastDate(today.getFullYear(), today.getMonth()))),
                            Persa : oController.getSessionInfoByKey("Persa")
                        }
                    };
                    
                    if(vData.Data.Persa.substring(0,1) == "D"){
						vData.Data.Pernr = oController.getSessionInfoByKey("Pernr");
						vData.Data.Ename = oController.getSessionInfoByKey("Ename");
					} else {
						vData.Data.Orgeh = oController.getSessionInfoByKey("Orgeh");
                        vData.Data.Ename = oController.getSessionInfoByKey("Stext");
					}

                    oController._ListCondJSonModel.setData(vData);
                }
            },

            onAfterShow: function (oEvent) {
                var oController = this;

                oController.onPressSearch(oEvent);
            },

            onBack: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeWorkList.List");
                var oController = oView.getController();

                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
                        data: {
                            FromPageId: "ZUI5_HR_ChangeWorkList.List",
                            Data: {}
                        }
                    });
            },

            SmartSizing: function () {},

            onChangeDate: function (oEvent) {
                if (oEvent && oEvent.getParameters().valid == false) {
                    MessageBox.error($.app.getController().getBundleText("MSG_02047")); // // ????????? ?????????????????????.
                    oEvent.getSource().setValue("");
                    return;
                }
            },

            onPressSearch: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeWorkList.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");
                if (!oData.Begda || !oData.Endda) {
                    MessageBox.error(oController.getBundleText("MSG_60001")); // ??????????????? ???????????? ????????????.
                    return;
                }

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                // filter, sort ??????
                var oColumn = oTable.getColumns();
                for (var i = 0; i < oColumn.length; i++) {
                    oColumn[i].setFiltered(false);
                    oColumn[i].setSorted(false);
                }

                var search = function () {
                    var oModel = $.app.getModel("ZHR_DASHBOARD_SRV");
                    var createData = { ChangeWorkNav: [] };
                    createData.IBukrs = oData.Bukrs;
                    createData.IPernr = oData.Pernr;
                    createData.IOrgeh = oData.Orgeh;
                    createData.IBegda = "/Date(" + Common.getTime(new Date(oData.Begda)) + ")/";
                    createData.IEndda = "/Date(" + Common.getTime(new Date(oData.Endda)) + ")/";
                    createData.ILangu = oData.Langu;

                    oModel.create("/ChangeWorkListSet", createData, {
                        success: function (data) {
                            if (data) {
                                if (data.ChangeWorkNav && data.ChangeWorkNav.results) {
                                    var data1 = data.ChangeWorkNav.results;

                                    for (var i = 0; i < data1.length; i++) {
                                        data1[i].Begda = new Date(Common.getTime(data1[i].Begda));
                                        data1[i].Endda = new Date(Common.getTime(data1[i].Endda));

                                        vData.Data.push(data1[i]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");

                    var height = parseInt(window.innerHeight - 130);
                    var count = parseInt((height - 35) / 38);

                    oTable.setVisibleRowCount(vData.Data.length < count ? vData.Data.length : count);

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            searchOrgehPernr: function (oController) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeWorkList.List");
                oController = oView.getController();

                var initData = {
                        Percod: oController.getSessionInfoByKey("Percod"),
                        Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                        Langu: oController.getSessionInfoByKey("Langu"),
                        Molga: oController.getSessionInfoByKey("Molga"),
                        Datum: new Date(),
                        Mssty: ""
                    },
                    callback = function (o) {
                        var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeWorkList.List");
                        var oController = oView.getController();

                        oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
                        oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");

                        if (o.Otype == "P") {
                            oController._ListCondJSonModel.setProperty("/Data/Pernr", o.Objid);
                        } else if (o.Otype == "O") {
                            oController._ListCondJSonModel.setProperty("/Data/Orgeh", o.Objid);
                        }

                        oController._ListCondJSonModel.setProperty("/Data/Ename", o.Stext);
                    };

                oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);
                DialogHandler.open(oController.OrgOfIndividualHandler);
            },

            getOrgOfIndividualHandler: function () {
                return this.OrgOfIndividualHandler;
            },

			/**
	         * @brief ??????-???????????? > ???????????? ?????? ?????? event handler
	         */
			displayMultiOrgSearchDialog: function (oEvent) {
				var oController = $.app.getController();
	
				SearchOrg.oController = oController;
				SearchOrg.vActionType = "Multi";
				SearchOrg.vCallControlId = oEvent.getSource().getId();
				SearchOrg.vCallControlType = "MultiInput";
	
				if (!oController.oOrgSearchDialog) {
					oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
					$.app.getView().addDependent(oController.oOrgSearchDialog);
				}
	
				oController.oOrgSearchDialog.open();
			},
	
			onESSelectPerson : function(data){
				var oController = $.app.getController();
	
				oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
				
				oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
				oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);
	
				oController.OrgOfIndividualHandler.getDialog().close();
				SearchUser1.onClose();
			},
			
            getUserId: function () {
                return $.app.getModel("session").getData().Pernr;
            },

            getLastDate: function (y, m) {
                var last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) last[1] = 29;

                return last[m];
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20180126"});
                      // return new JSONModelHelper({name: "20130126"});
                      return new JSONModelHelper({ name: "20090028" });
                  }
                : null
        });
    }
);
