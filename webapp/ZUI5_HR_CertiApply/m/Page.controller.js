sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "sap/ui/core/BusyIndicator"
    ],
    function (Common, CommonController, JSONModelHelper, BusyIndicator) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            TableModel: new JSONModelHelper(),
            LogModel: new JSONModelHelper(),

            getUserId: function () {
                return this.getSessionInfoByKey("name");
            },

            getUserGubun: function () {
                return this.getSessionInfoByKey("Bukrs2");
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
                var vBukrs = this.getUserGubun();
                this.LogModel.setData({ Bukrs: vBukrs });

                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.IConType = "1";
                sendObject.ILangu = oController.getView().getModel("session").getData().Langu;
                sendObject.IMolga = oController.getView().getModel("session").getData().Molga;
                sendObject.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                sendObject.IEmpid = vPernr;
                // Navigation property
                sendObject.Export = [];
                sendObject.TableIn = [];
                sendObject.Export = [];

                oModel.create("/CertiAppSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.TableIn) {
                            var rDatas = oData.TableIn.results;
                            for (var i = 0; i < rDatas.length; i++) {
                                rDatas[i].Zcount = "" + rDatas[i].Zcount * 1;
                            }
                            oController.TableModel.setData({ Data: rDatas });
                        } else {
                            oController.TableModel.setData({ Data: [] });
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
                        id: [$.app.CONTEXT_PATH, "Apply"].join($.app.getDeviceSuffix()),
                        data: {}
                    });
            },

            onPressButton: function (oEvent) {
                // Row 의 Button 클릭
                var oController = $.app.getController();
                var vPath = oEvent.getSource().getBindingContext().sPath;
                var oRowData = oController.TableModel.getProperty(vPath);
                var oCopiedRow = $.extend(true, {}, oRowData);
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var onPrintPDF = function () {
                    var sendObject = {};
                    var tableIn = {};
                    tableIn.Pernr = oCopiedRow.Pernr;
                    tableIn.Subty = oCopiedRow.Subty;
                    tableIn.Objps = oCopiedRow.Objps;
                    tableIn.Sprps = oCopiedRow.Sprps;
                    tableIn.Seqnr = oCopiedRow.Seqnr;
                    tableIn.Begda = "/Date(" + Common.getTime(new Date(oCopiedRow.Begda)) + ")/";
                    tableIn.Endda = "/Date(" + Common.getTime(new Date(oCopiedRow.Endda)) + ")/";

                    // Header
                    sendObject.IUrlck = "X";
                    // Navigation property
                    sendObject.TableIn = [];
                    sendObject.TableIn.push(tableIn);
                    sendObject.Export = [];

                    oModel.create("/CertiPdfSet", sendObject, {
                        success: function (oData) {
                            if (oData && oData.Export && oData.Export.results.length > 0) {
                                var a = document.createElement("a");
                                a.href = "data:application/pdf;base64," + oData.Export.results[0].EPdf;
                                a.download = "다운로드";
                                a.click(); //Downloaded file

                                oController.onTableSearch();
                            }
                            BusyIndicator.hide();
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                            oController.onTableSearch();
                            BusyIndicator.hide();
                        }
                    });

                    BusyIndicator.hide();
                };

                if (oCopiedRow.Zstatus == "1") return;
                // 처리중
                else if (oCopiedRow.Zstatus == "2") {
                    // 재발급
                    // 기본값 설정
                    oCopiedRow.actmode = "X";
                    oController.ApplyModel.setData({ Data: oCopiedRow });
                    oController._ApplyDialog.open();
                } else if (oCopiedRow.Zstatus == "3") {
                    // 프린트
                    BusyIndicator.show(0);
                    onPrintPDF(oCopiedRow);
                }
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20140099" }); // 20190018 20063005 (기초) 35111238 35114489 35111012(첨단)
                  }
                : null
        });
    }
);
