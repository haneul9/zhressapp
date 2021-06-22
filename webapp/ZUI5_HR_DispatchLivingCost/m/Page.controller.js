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

            TableModel: new JSONModelHelper(),
            FinishModel: new JSONModelHelper(),
            LogModel: new JSONModelHelper(),

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
                var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");

                oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
                this.onTableSearch();
            },

            onChecked: function (oEvent) {
                // Checkbox선택시 다른Checkbox 비활성화
                var oController = this;
                var vIndex = oEvent.getSource().mBindingInfos.selected.binding.oContext.getPath().slice(6);

                oController.FinishModel.setData({ FormData: [] });

                this.TableModel.getProperty("/Data").forEach(function (ele, index) {
                    if (index === parseInt(vIndex) && oEvent.getSource().getSelected() === true) {
                        oController.TableModel.setProperty("/Data/" + index + "/Check", "X");
                        oController.FinishModel.setData({ FormData: ele });
                    } else oController.TableModel.setProperty("/Data/" + index + "/Check", "");
                });
            },

            onPressSer: function () {
                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IBukrs = vBukrs;
                sendObject.IEmpid = vPernr;
                sendObject.IConType = "1";
                sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
                sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
                // Navigation property
                sendObject.DispatchApplyExport = [];
                sendObject.DispatchApplyTableIn1 = [];

                oModel.create("/DispatchApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.DispatchApplyTableIn1) {
                            Common.log(oData);
                            var rDatas = oData.DispatchApplyTableIn1.results;
                            oController.TableModel.setData({ Data: rDatas });
                        }

                        oController.LogModel.setData({ Data: oData.DispatchApplyExport.results[0] });
                        if (oData.DispatchApplyExport.results[0].EClose === "X") {
                            sap.m.MessageBox.alert(oController.getBundleText("MSG_00072"), { title: oController.getBundleText("MSG_08107") });
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
                //신청
                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix())
                    });
            },

            onPressEnd: function () {
                // 조기종료 신청
                var oController = this;

                if (
                    this.TableModel.getProperty("/Data").every(function (e) {
                        return Common.checkNull(e.Check);
                    })
                ) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_59016"), {
                        title: oController.getBundleText("LABEL_00149")
                    });
                    return;
                }

                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix()),
                        data: {
                            RowData: oController.FinishModel.getProperty("/FormData"),
                            Gubun: "E"
                        }
                    });
            },

            onSelectedRow: function (oEvent) {
                var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
                var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));

                sap.ui.getCore().getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix()),
                        data: {
                            RowData: oRowData,
                            Gubun: "N"
                        }
                    });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20063005" });
                  }
                : null
        });
    }
);
