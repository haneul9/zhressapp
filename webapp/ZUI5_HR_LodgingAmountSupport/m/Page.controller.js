sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            SearchModel : new JSONModelHelper(),
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
                this.SearchModel.setData({ User: {}});
                this.setZyears();
                this.onTableSearch();
            },

            onPressSer: function () {
                this.onTableSearch();
            },

            setZyears: function() {
                var oController = $.app.getController();
                var vZyear = new Date().getFullYear(),
                    vConvertYear = "",
                    aYears = [];
    
                Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                    vConvertYear = String(vZyear - idx);
                    aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
                });
    
                oController.SearchModel.setProperty("/Zyears", aYears);
                oController.SearchModel.setProperty("/User/Zyear", String(vZyear));
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IEmpid = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.IYear = oController.SearchModel.getProperty("/User/Zyear");
                sendObject.IConType = "1";
                // Navigation property
                sendObject.RoomChargeNav1 = [];

                oModel.create("/RoomChargeApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.RoomChargeNav1) {
                            Common.log(oData);
                            var rDatas = oData.RoomChargeNav1.results;
                            oController.TableModel.setData({ Data: rDatas });
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
                sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
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
                        RowData: oCopiedRow
                    }
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20200015" });
                  }
                : null
        });
    }
);
