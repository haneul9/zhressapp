jQuery.sap.require("sap.m.MessageBox");

sap.ui.define(["../common/Common", "../common/CommonController", "../common/JSONModelHelper", "../common/PageHelper"], function (Common, CommonController, JSONModelHelper, PageHelper) {
    "use strict";

    return CommonController.extend("ZUI5_HR_EvalPro.List", {
        PAGEID: "EvalProList",
        _BusyDialog: new sap.m.BusyDialog(),
        _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
        _Bukrs: "",

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

            this.getView().addStyleClass("sapUiSizeCompact");
        },

        onBeforeShow: function (oEvent) {
            var oController = this;

            if (!oController._ListCondJSonModel.getProperty("/Data")) {
                var oPhoto = "";

                // new JSONModelHelper()
                //     .url("/odata/v2/Photo?$filter=userId eq '" + oController.getView().getModel("session").getData().Pernr + "' and photoType eq '1'")
                //     .select("photo")
                //     .setAsync(false)
                //     .attachRequestCompleted(function () {
                //         var data = this.getData().d;

                //         if (data && data.results.length) {
                //             oPhoto = "data:text/plain;base64," + data.results[0].photo;
                //         } else {
                //             oPhoto = "images/male.jpg";
                //         }
                //     })
                //     .attachRequestFailed(function () {
                //         oPhoto = "images/male.jpg";
                //     })
                //     .load();

                var vData = {
                    Data: Object.assign({ photo: oPhoto }, oController.getView().getModel("session").getData())
                };

                // ???????????? combobox
                var oAppid = sap.ui.getCore().byId(oController.PAGEID + "_Appid");
                var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");

                var createData = { TableIn: [] };
                oModel.create("/AppraisalMasterListSet", createData, {
                    success: function (data, res) {
                        if (data && data.TableIn) {
                            if (data.TableIn.results && data.TableIn.results.length) {
                                for (var i = 0; i < data.TableIn.results.length; i++) {
                                    oAppid.addItem(new sap.ui.core.Item({ key: data.TableIn.results[i].Appid, text: data.TableIn.results[i].Apptx }));
                                }

                                vData.Data.Appid = data.TableIn.results[0].Appid;
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

                if (oController.Error == "E") {
                    oController.Error = "";
                    sap.m.MessageBox.error(oController.ErrorMessage);
                }

                oController._ListCondJSonModel.setData(vData);
            }
        },

        onAfterShow: function (oEvent) {
            var oController = this;

            oController.onPressSearch(oEvent);
        },

        onPressSearch: function (oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.List");
            var oController = oView.getController();

            var oData = oController._ListCondJSonModel.getProperty("/Data");

            // data ?????????
            oController._ListCondJSonModel.setProperty("/Data/Tapnum", "-");
            oController._ListCondJSonModel.setProperty("/Data/Appnum", "-");
            oController._ListCondJSonModel.setProperty("/Data/Nppnum", "-");
            oController._ListCondJSonModel.setProperty("/Data/Apavrg", "-");
            oController._ListCondJSonModel.setProperty("/Data/Taptt", "");
            oController._ListCondJSonModel.setProperty("/Data/Sndflg", "X"); // ??????????????????
            oController._ListCondJSonModel.setProperty("/Data/Pntfr", 0); // ??????????????????
            oController._ListCondJSonModel.setProperty("/Data/Pntto", 0); // ??????????????????

            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
            var oJSONModel = oTable.getModel();
            var vData = { Data: [] };

            oTable.destroyColumns();

            var search = function () {
                var createData = { TableIn1: [], TableIn2: [] };
                createData.IPernr = oData.Pernr;
                createData.IAppid = oData.Appid;

                var check = "";

                var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
                oModel.create("/AppraisalPeopleListSet", createData, {
                    success: function (data, res) {
                        if (data) {
                            if (data.TableIn1 && data.TableIn1.results && data.TableIn1.results.length) {
                                oController._ListCondJSonModel.setProperty("/Data/Tapnum", data.TableIn1.results[0].Tapnum);
                                oController._ListCondJSonModel.setProperty("/Data/Appnum", data.TableIn1.results[0].Appnum);
                                oController._ListCondJSonModel.setProperty("/Data/Nppnum", data.TableIn1.results[0].Nppnum);
                                oController._ListCondJSonModel.setProperty("/Data/Apavrg", data.TableIn1.results[0].Apavrg);
                                oController._ListCondJSonModel.setProperty("/Data/Taptt", data.TableIn1.results[0].Taptt);
                                oController._ListCondJSonModel.setProperty("/Data/Sndflg", data.TableIn1.results[0].Sndflg);
                                oController._ListCondJSonModel.setProperty("/Data/Pntfr", parseFloat(data.TableIn1.results[0].Pntfr)); // ??????????????????
                                oController._ListCondJSonModel.setProperty("/Data/Pntto", parseFloat(data.TableIn1.results[0].Pntto)); // ??????????????????
                            }

                            if (data.TableIn2 && data.TableIn2.results && data.TableIn2.results.length) {
                                for (var i = 0; i < data.TableIn2.results.length; i++) {
                                    if (data.TableIn2.results[i].Appnm == "2") {
                                        check = "X";
                                    }

                                    data.TableIn2.results[i].Score = data.TableIn2.results[i].Score != "" ? (parseFloat(data.TableIn2.results[i].Score) == 0 ? "-" : parseFloat(data.TableIn2.results[i].Score)) : "";
                                    data.TableIn2.results[i].PreScore = data.TableIn2.results[i].PreScore != "" ? (parseFloat(data.TableIn2.results[i].PreScore) == 0 ? "-" : parseFloat(data.TableIn2.results[i].PreScore)) : "";

                                    vData.Data.push(data.TableIn2.results[i]);
                                }
                            } else {
                                oController._ListCondJSonModel.setProperty("/Data/Sndflg", "X");
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

                // ??????, ??????, ??????, ??????
                var col_info = [
                    { id: "Appnm", label: "{i18n>LABEL_24011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Pernr", label: "{i18n>LABEL_24012}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Ename", label: "{i18n>LABEL_24013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "PGradeTxt", label: "{i18n>LABEL_24014}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                if (check == "X") {
                    // 1?????????, 2?????????
                    col_info.push({ id: "PreScore", label: "{i18n>LABEL_24015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true });
                    col_info.push({ id: "Score", label: "{i18n>LABEL_24016}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true });
                } else {
                    // 1?????????
                    col_info.push({ id: "Score", label: "{i18n>LABEL_24015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true });
                }

                common.makeTable.makeColumn(oController, oTable, col_info);

                oJSONModel.setData(vData);
                oTable.bindRows("/Data");
                oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

                oController._BusyDialog.close();

                if (oController.Error == "E") {
                    oController.Error = "";
                    sap.m.MessageBox.error(oController.ErrorMessage);
                    return;
                }
            };

            oController._BusyDialog.open();
            setTimeout(search, 100);
        },

        onPressSave: function (oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.List");
            var oController = oView.getController();

            var oData = oController._ListCondJSonModel.getProperty("/Data");
            var oApavrg = oData.Apavrg != "-" ? parseFloat(oData.Apavrg) : "";

            // if(oApavrg == "") return;

            // validation check
            if (oData.Pntto < oApavrg && oData.Pntfr > oApavrg) {
                sap.m.MessageBox.error(oData.Taptt);
                return;
            }

            if (oData.Nppnum != "-" && parseInt(oData.Nppnum) != 0) {
                sap.m.MessageBox.error(oData.Taptt);
                return;
            }

            var process = function () {
                var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
                var createData = { TableIn: [] };
                createData.IPernr = oView.getModel("session").getData().Pernr;
                createData.IAppid = oData.Appid;

                var detail = {};
                detail.Appid = oData.Appid;
                detail.Appnr = oView.getModel("session").getData().Pernr;
                detail.Sendt = "/Date(" + common.Common.getTime(new Date()) + ")/";

                createData.TableIn.push(detail);

                oModel.create("/AppraisalSendSet", createData, {
                    success: function (data, res) {
                        if (data) {
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

                oController._BusyDialog.close();

                if (oController.Error == "E") {
                    oController.Error = "";
                    sap.m.MessageBox.error(oController.ErrorMessage);
                    return;
                }

                sap.m.MessageBox.success(oController.getBundleText("MSG_24006"), {
                    // ?????????????????? ?????????????????????.
                    onClose: oController.onPressSearch
                });
            };

            var beforeSave = function (fVal) {
                if (fVal && fVal == "YES") {
                    oController._BusyDialog.open();
                    setTimeout(process, 100);
                }
            };

            sap.m.MessageBox.confirm(oController.getBundleText("MSG_24005"), {
                // ?????????????????? ???????????????????
                actions: ["YES", "NO"],
                onClose: beforeSave
            });
        },

        onPressTable: function (oEvent, Flag) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_EvalPro.List");
            var oController = oView.getController();

            var oData;

            if (Flag && Flag == "X") {
                oData = oEvent.getSource().getCustomData()[0].getValue();
            } else {
                var sPath = oEvent.getParameters().rowBindingContext.sPath;
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

                oData = oTable.getModel().getProperty(sPath);
            }

            sap.ui
                .getCore()
                .getEventBus()
                .publish("nav", "to", {
                    id: "ZUI5_HR_EvalPro.Detail",
                    data: {
                        FromPageId: "ZUI5_HR_EvalPro.List",
                        Pernr: oData.Pernr,
                        Appid: oData.Appid,
                        Appnm: oData.Appnm,
                        Sndflg: oController._ListCondJSonModel.getProperty("/Data/Sndflg")
                    }
                });
        },

        getLocalSessionModel: Common.isLOCAL()
            ? function () {
                  return new JSONModelHelper({ name: "20120222" });
                  // return new JSONModelHelper({name: "20120220"});
                  // return new JSONModelHelper({name: "911105"});
              }
            : null
    });
});
