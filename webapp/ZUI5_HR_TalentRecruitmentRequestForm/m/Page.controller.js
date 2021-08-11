sap.ui.define(
    [
        "common/Common",
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            EmpModel : new JSONModelHelper(),
            TableModel: new JSONModelHelper(),

            getUserId: function () {
                return this.getSessionInfoByKey("name");
            },

            getUserGubun: function () {
                return this.getSessionInfoByKey("Bukrs3");
            },

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
            },

            onBeforeShow: function () {
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.EmpModel.setData({ User: {}});
                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IEmpid = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.ILangu = oController.getSessionInfoByKey("Langu");
                sendObject.IConType = "1";
                // Navigation property
                sendObject.BankAccountApplyNav1 = [];
                sendObject.BankAccountApplyNav2 = [];

                oModel.create("/BankAccountApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.BankAccountApplyNav1) {
                            Common.log(oData);
                            var rDatas = oData.BankAccountApplyNav1.results;
                            oController.TableModel.setData({ Data: rDatas });
                            oController.TableModel.setProperty("/BankList", oData.BankAccountApplyNav2.results);
                            oController.EmpModel.setProperty("/User/IBanka", oData.IBanka);
                            oController.EmpModel.setProperty("/User/IBankn", oData.IBankn);
                            oController.EmpModel.setProperty("/User/IBankl", oData.IBankl);
                            oController.EmpModel.setProperty("/User/Ename", oController.getSessionInfoByKey("Ename"));
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            onPressReq: function () {
                var oController = this;

                sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                    data: {
                        BankList: oController.TableModel.getProperty("/BankList"),
                        User: oController.EmpModel.getProperty("/User")
                    }
                });
            },

            onSelectedRow: function (oEvent) {
                var oController = $.app.getController();
                var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
                var oRowData = oController.TableModel.getProperty(vPath);
                var oCopiedRow = $.extend(true, {}, oRowData);
                
                sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                    data: {
                        RowData: oCopiedRow,
                        BankList: oController.TableModel.getProperty("/BankList")
                    }
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20090028" });
                  }
                : null
        });
    }
);
