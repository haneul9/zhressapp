sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/AttachFileAction",
        "sap/m/MessageBox",
        "common/DialogHandler",
        "common/ApprovalLinesHandler"
    ],
    function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, DialogHandler, ApprovalLinesHandler) {
        "use strict";

        return CommonController.extend("ZUI5_HR_Pregnant.List", {
            PAGEID: "ZUI5_HR_Pregnant",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            UploadFileModel: new JSONModelHelper(),
            _Bukrs: "",

            EmployeeSearchCallOwner: null,

            getApprovalLinesHandler: function() {
                return this.ApprovalLinesHandler;
            },

            onESSelectPerson: function(data) {
                return this.EmployeeSearchCallOwner 
                ? this.EmployeeSearchCallOwner.setSelectionTagets(data)
                : null;
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner 
                ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
                : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
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

                // this.getView().addStyleClass("sapUiSizeCompact");
                // this.getView().setModel($.app.getModel("i18n"), "i18n");
            },

            onBeforeShow: function () {
                var oController = this;

                if (!oController._ListCondJSonModel.getProperty("/Data")) {
                    var vData = { Data: {} };

                    oController._ListCondJSonModel.setData(vData);
                }

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("1");
            },

            onAfterShow: function (oEvent) {
                var oController = this;

                oController.onPressSearch1(oEvent);
            },

            onChangeDate: function (oEvent, field) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oData = oController._ListCondJSonModel.getProperty("/Data");

                var oField = [];
                var createData = { PregnantApplyTableIn: [] };
                createData.IBukrs = oController.getSessionInfoByKey("Bukrs3");
                createData.IPernr = oController.getSessionInfoByKey("Pernr");
                createData.IEmpid = oController.getSessionInfoByKey("Pernr");
                createData.ILangu = oController.getSessionInfoByKey("Langu");

                var detail = {};

                if (oEvent.getParameters().valid == false) {
                    MessageBox.error(oController.getBundleText("MSG_02047")); // ????????? ?????????????????????.
                    oEvent.getSource().setValue("");
                    return;
                }

                switch (field) {
                    case "Preen": // ??????(??????)??? - ????????? ????????? ?????? ??????
                        if (!oData.Preen || oData.Preen == "") {
                            oController._ListCondJSonModel.setProperty("/Data/Prebg", "");
                            oController._ListCondJSonModel.setProperty("/Data/Pampm", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh2", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh2", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begshp", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh2p", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endshp", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh2p", "");
                            oController._ListCondJSonModel.setProperty("/Data/EditFalse", "");
                            return;
                        }

                        createData.IConType = "A";

                        detail = { Pernr: oController.getSessionInfoByKey("Pernr"), Preen: "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/" };
                        if (oData.Status1 == "AA") {
                            detail.Subty = oData.Subty;
                            detail.Objps = oData.Objps;
                            detail.Sprps = oData.Sprps;
                            detail.Begda = "/Date(" + Common.getTime(oData.Begda) + ")/";
                            detail.Endda = "/Date(" + Common.getTime(oData.Endda) + ")/";
                            detail.Seqnr = oData.Seqnr;
                        }

                        createData.PregnantApplyTableIn.push(detail);

                        // "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2",
                        oField = ["Preen", "Prebg", "Begsh2p", "Begshp", "Endsh2p", "Endshp", "Prebn"];
                        break;
                    case "Prebg": // ???????????????
                        if (!oData.Preen || !oData.Prebg) {
                            return;
                        }

                        createData.IConType = "B";

                        detail = { Pernr: oController.getSessionInfoByKey("Pernr"), Preen: "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/", Prebg: "/Date(" + Common.getTime(new Date(oData.Prebg)) + ")/" };
                        if (oData.Status1 == "AA") {
                            detail.Subty = oData.Subty;
                            detail.Objps = oData.Objps;
                            detail.Sprps = oData.Sprps;
                            detail.Begda = "/Date(" + Common.getTime(oData.Begda) + ")/";
                            detail.Endda = "/Date(" + Common.getTime(oData.Endda) + ")/";
                            detail.Seqnr = oData.Seqnr;
                        }

                        createData.PregnantApplyTableIn.push(detail);

                        // "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2",
                        oField = ["Preen", "Prebg", "Begsh2p", "Begshp", "Endsh2p", "Endshp", "Prebn"];
                        break;
                    default:
                        // ???????????? ?????? ??? ????????? ??????????????? ?????? ?????????
                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                        var value = oEvent.getParameters().value;
                        if (value != "") {
                            value = dateFormat.format(new Date(value)) * 1;

                            if (value < dateFormat.format(new Date()) * 1) {
                                MessageBox.error(oController.getBundleText("MSG_39019")); // ????????? ?????? ????????? ?????? ??????????????????.
                                oEvent.getSource().setValue("");
                            }
                        }
                }

                if (oField.length != 0) {
                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                oController._ListCondJSonModel.setProperty("/Data/Eretcode", data.Eretcode);
                                oController._ListCondJSonModel.setProperty("/Data/Erettext", data.Erettext);

                                if (data.PregnantApplyTableIn && data.PregnantApplyTableIn.results) {
                                    var datas = data.PregnantApplyTableIn.results[0];
                                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                                    // ???????????????, ???????????????
                                    datas.Preen = datas.Preen ? dateFormat.format(new Date(Common.setTime(datas.Preen))) : "";
                                    datas.Prebg = datas.Prebg ? dateFormat.format(new Date(Common.setTime(datas.Prebg))) : "";

                                    // ??????????????????
                                    datas.Begsh = datas.Begsh ? dateFormat.format(new Date(Common.setTime(datas.Begsh))) : "";
                                    datas.Endsh = datas.Endsh ? dateFormat.format(new Date(Common.setTime(datas.Endsh))) : "";
                                    datas.Begsh2 = datas.Begsh2 ? dateFormat.format(new Date(Common.setTime(datas.Begsh2))) : "";
                                    datas.Endsh2 = datas.Endsh2 ? dateFormat.format(new Date(Common.setTime(datas.Endsh2))) : "";

                                    // ??????????????????
                                    datas.Begshp = datas.Begshp ? dateFormat.format(new Date(Common.setTime(datas.Begshp))) : "";
                                    datas.Begsh2p = datas.Begsh2p ? dateFormat.format(new Date(Common.setTime(datas.Begsh2p))) : "";
                                    datas.Endshp = datas.Endshp ? dateFormat.format(new Date(Common.setTime(datas.Endshp))) : "";
                                    datas.Endsh2p = datas.Endsh2p ? dateFormat.format(new Date(Common.setTime(datas.Endsh2p))) : "";

                                    // ????????? ?????? ?????? ????????? 1??? ??????
                                    datas.Prebn = datas.Prebn == "0" ? "1" : datas.Prebn;

                                    for (var i = 0; i < oField.length; i++) {
                                        oController._ListCondJSonModel.setProperty("/Data/" + oField[i], datas[oField[i]]);
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

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (oController._ListCondJSonModel.getProperty("/Data/Eretcode") != "") {
                        MessageBox.error(oController._ListCondJSonModel.getProperty("/Data/Erettext"), {
                            title : oController.getBundleText("LABEL_02093") // ??????
                        });
                    }

                    // ??????????????? - ????????? ??????
                    oController.onCheckPreen();
                    // ?????????????????? ??????
                    oController.onChangePampm();
                }

                if (oController._ListCondJSonModel.getProperty("/Data/Eretcode") == "X") {
                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_FileRow")
                        .addStyleClass("displayNone");
                } else {
                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_FileRow")
                        .removeStyleClass("displayNone");
                }
            },

            // ??????(??????)?????? ????????? ???????????? ???????????????, ??????????????????, ?????????????????? ?????? ??????
            onCheckPreen: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                var oPreen = oController._ListCondJSonModel.getProperty("/Data/Preen");

                if (!oPreen || oPreen == "") return;

                oPreen = dateFormat.format(new Date(oPreen)) * 1;

                if (oPreen <= dateFormat.format(new Date()) * 1) {
                    oController._ListCondJSonModel.setProperty("/Data/EditFalse", "X");

                    var field = ["Prebg", "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2", "Begshp", "Begsh2p", "Endshp", "Endsh2p"];
                    for (var i = 0; i < field.length; i++) {
                        oController._ListCondJSonModel.setProperty("/Data/" + field[i], "");
                    }
                } else {
                    oController._ListCondJSonModel.setProperty("/Data/EditFalse", "");
                }
            },

            onPressSearch1: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                // filter, sort ??????
                var oColumns = oTable.getColumns();
                for (var i = 0; i < oColumns.length; i++) {
                    oColumns[i].setFiltered(false);
                    oColumns[i].setSorted(false);
                }

                var search = function () {
                    var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                    var createData = { PregnantApplyTableIn: [] };
                    createData.IConType = "1";
                    createData.IBukrs = oController.getSessionInfoByKey("Bukrs3");
                    createData.IMolga = oController.getSessionInfoByKey("Molga");
                    createData.IEmpid = oController.getSessionInfoByKey("Pernr");
                    createData.IPernr = oController.getSessionInfoByKey("Pernr");
                    createData.ILangu = oController.getSessionInfoByKey("Langu");

                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                if (data.PregnantApplyTableIn && data.PregnantApplyTableIn.results) {
                                    for (var i = 0; i < data.PregnantApplyTableIn.results.length; i++) {
                                        data.PregnantApplyTableIn.results[i].Idx = i + 1;

                                        data.PregnantApplyTableIn.results[i].Begda = data.PregnantApplyTableIn.results[i].Begda ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begda)) : null;
                                        data.PregnantApplyTableIn.results[i].Endda = data.PregnantApplyTableIn.results[i].Endda ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endda)) : null;

                                        data.PregnantApplyTableIn.results[i].Prebg = data.PregnantApplyTableIn.results[i].Prebg ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Prebg)) : null;
                                        data.PregnantApplyTableIn.results[i].Preen = data.PregnantApplyTableIn.results[i].Preen ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Preen)) : null;

                                        // ?????????????????? 12?????????
                                        data.PregnantApplyTableIn.results[i].Begsh = data.PregnantApplyTableIn.results[i].Begsh ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh = data.PregnantApplyTableIn.results[i].Endsh ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh)) : null;
                                        // ??????????????????
                                        data.PregnantApplyTableIn.results[i].Begshp = data.PregnantApplyTableIn.results[i].Begshp ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begshp)) : null;
                                        data.PregnantApplyTableIn.results[i].Endshp = data.PregnantApplyTableIn.results[i].Endshp ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endshp)) : null;

                                        // ?????????????????? 36?????????
                                        data.PregnantApplyTableIn.results[i].Begsh2 = data.PregnantApplyTableIn.results[i].Begsh2 ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh2)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh2 = data.PregnantApplyTableIn.results[i].Endsh2 ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh2)) : null;
                                        // ??????????????????
                                        data.PregnantApplyTableIn.results[i].Begsh2p = data.PregnantApplyTableIn.results[i].Begsh2p ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh2p)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh2p = data.PregnantApplyTableIn.results[i].Endsh2p ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh2p)) : null;

                                        vData.Data.push(data.PregnantApplyTableIn.results[i]);
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
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

                    // Common.adjustViewHeightRowCount({
                    //                 tableControl: oTable,
                    //                 viewHeight: 34,
                    //                 dataCount: vDetailList.length
                    //             });

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

            onSelectTable: function (oEvent, Flag) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oData;

                if (Flag && Flag == "X") {
                    oData = oEvent.getSource().getCustomData()[0].getValue();
                } else {
                    var sPath = oEvent.getParameters().rowBindingContext.sPath;
                    var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

                    oData = oTable.getModel().getProperty(sPath);
                }

                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                oData.Prebg = oData.Prebg ? dateFormat.format(oData.Prebg) : "";
                oData.Preen = oData.Preen ? dateFormat.format(oData.Preen) : "";
                oData.Begsh = oData.Begsh ? dateFormat.format(oData.Begsh) : "";
                oData.Endsh = oData.Endsh ? dateFormat.format(oData.Endsh) : "";
                oData.Begshp = oData.Begshp ? dateFormat.format(oData.Begshp) : "";
                oData.Endshp = oData.Endshp ? dateFormat.format(oData.Endshp) : "";
                oData.Begsh2 = oData.Begsh2 ? dateFormat.format(oData.Begsh2) : "";
                oData.Endsh2 = oData.Endsh2 ? dateFormat.format(oData.Endsh2) : "";
                oData.Begsh2p = oData.Begsh2p ? dateFormat.format(oData.Begsh2p) : "";
                oData.Endsh2p = oData.Endsh2p ? dateFormat.format(oData.Endsh2p) : "";

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("2");

                oController.onPressSearch2(oData);
            },

            onPressSearch2: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var vData = { Data: {} };
                if (oEvent == undefined) {
                    vData.Data.Status1 = "";
                    vData.Data.Prebn = "1";
                    vData.Data.Reqdt = new Date(); // ???????????? ??? ???????????? ??????????????? ??????
                } else {
                    vData.Data = oEvent;
                }

                oController._ListCondJSonModel.setData(vData);

                // ?????????????????? ?????????
                var oPampm = sap.ui.getCore().byId(oController.PAGEID + "_Pampm");
                oPampm.destroyItems();
                var oModel = $.app.getModel("ZHR_COMMON_SRV");
                var createData = { NavCommonCodeList: [] };
                createData.ICodeT = "058";
                createData.IDatum = vData.Data.Reqdt ? "/Date(" + Common.getTime(new Date(vData.Data.Reqdt)) + ")/" : "/Date(" + Common.getTime(new Date()) + ")/";
                createData.ILangu = oController.getSessionInfoByKey("Langu");

                oModel.create("/CommonCodeListHeaderSet", createData, {
					success: function (data) {
                        if (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                    oPampm.addItem(
                                        new sap.ui.core.Item({
                                            key: data.NavCommonCodeList.results[i].Code,
                                            text: data.NavCommonCodeList.results[i].Text
                                        })
                                    );
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

                if (oController.Error == "E") {
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                }

                // ??????????????? ?????? ?????? ??????
                createData = { NavCommonCodeList: [] };
                createData.ICodeT = "058";
                createData.ICodty = "PT_MATE";
                createData.IDatum = vData.Data.Reqdt ? "/Date(" + Common.getTime(new Date(vData.Data.Reqdt)) + ")/" : "/Date(" + Common.getTime(new Date()) + ")/";
                createData.ILangu = oController.getSessionInfoByKey("Langu");

                oModel.create("/CommonCodeListHeaderSet", createData, {
					success: function (data) {
                        if (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                oController._ListCondJSonModel.setProperty("/Data/Prebgyn", data.NavCommonCodeList.results[0].Code);
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

                // ????????? ????????? ????????? ?????? ????????? - ????????? ??????
                if (vData.Data.Status1 == "AA") {
                    oController.onCheckPreen();
                }

                AttachFileAction.setAttachFile(oController, {
                    Appnm: vData.Data.Appnm ? vData.Data.Appnm : "",
                    Required: true,
                    Mode: "M",
                    Max: "1",
                    Editable: vData.Data.Status1 == "" || vData.Data.Status1 == "AA" ? true : false
                });
            },

            // ???????????? ??????
            onPressApply: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("2");
                oController.onPressSearch2();
            },

            // ?????????????????? ??????
            onChangePampm: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                // ???????????? ?????? ?????? ??? ?????????????????? ?????????
                if (!oController._ListCondJSonModel.getProperty("/Data/Pampm") || oController._ListCondJSonModel.getProperty("/Data/Pampm") == "" || oController._ListCondJSonModel.getProperty("/Data/Pampm") == "9") {
                    oController._ListCondJSonModel.setProperty("/Data/Begsh", "");
                    oController._ListCondJSonModel.setProperty("/Data/Endsh", "");
                    oController._ListCondJSonModel.setProperty("/Data/Begsh2", "");
                    oController._ListCondJSonModel.setProperty("/Data/Endsh2", "");
                } else {
                    var oData = oController._ListCondJSonModel.getProperty("/Data");

                    var check = function (date) {
                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                        var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                        var date1 = dateFormat.format(new Date(date)) * 1;
                        var date2 = dateFormat.format(new Date()) * 1;

                        if (date1 < date2) {
                            return dateFormat2.format(new Date());
                        } else {
                            return date;
                        }
                    };

                    if (oData.Begshp) {
                        oController._ListCondJSonModel.setProperty("/Data/Begsh", check(oData.Begshp));
                    }

                    if (oData.Endshp) {
                        oController._ListCondJSonModel.setProperty("/Data/Endsh", check(oData.Endshp));
                    }

                    if (oData.Begsh2p) {
                        oController._ListCondJSonModel.setProperty("/Data/Begsh2", check(oData.Begsh2p));
                    }

                    if (oData.Endsh2p) {
                        oController._ListCondJSonModel.setProperty("/Data/Endsh2", check(oData.Endsh2p));
                    }
                }
            },

            // Flag : S ??????, C ??????, D ??????
            onRequest : function(Flag){
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");

                if (Flag != "D") {
                    // validation check
                    if (oData.Eretcode == "Z") {
                        MessageBox.error(oData.Erettext);
                        return;
                    }

                    if (!oData.Preen || oData.Preen == "") {
                        MessageBox.error(oController.getBundleText("MSG_39015")); // ??????(??????)?????? ???????????? ????????????.
                        return;
                    } else if ((!oData.EditFalse || oData.EditFalse == "") && (!oData.Prebg || oData.Prebg == "")) {
                        MessageBox.error(oController.getBundleText("MSG_39016")); // ?????????????????? ???????????? ????????????.
                        return;
                    } else if (oData.Prebn == "" || oData.Prebn == "0") {
                        MessageBox.error(oController.getBundleText("MSG_39017")); // ???????????? ???????????? ????????????.
                        return;
                    } else if (!oData.EditFalse || oData.EditFalse == "") {
                        if (!oData.Pampm || oData.Pampm == "") {
                            MessageBox.error(oController.getBundleText("MSG_39018")); // ????????????????????? ???????????? ????????????.
                            return;
                        } else if (oData.Pampm != "9") {
                            // ???????????? ????????? ???????????? ?????? ??????, ?????????????????? ??? ????????? ??????????????? ??????.
                            if ((oData.Begsh && !oData.Endsh) || (!oData.Begsh && oData.Endsh) || (oData.Begsh2 && !oData.Endsh2) || (!oData.Begsh2 && oData.Endsh2)) {
                                MessageBox.error(oController.getBundleText("MSG_39020")); // ????????????????????? ???????????? ????????????.
                                return;
                            } else if (!oData.Begsh && !oData.Endsh && !oData.Begsh2 && !oData.Endsh2) {
                                MessageBox.error(oController.getBundleText("MSG_39020")); // ????????????????????? ???????????? ????????????.
                                return;
                            } else {
                                // ????????????????????? ?????????????????? ??????
                                var check = function (d1, d2, flag) {
                                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });

                                    var date1 = dateFormat.format(new Date(d1)) * 1;
                                    var date2 = dateFormat.format(new Date(d2)) * 1;

                                    if (flag == "1") {
                                        if (date1 < date2) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if (date1 > date2) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                };

                                if (oData.Begsh && oData.Endsh) {
                                    if (check(oData.Begsh, oData.Begshp, "1") == false || check(oData.Endsh, oData.Endshp, "2") == false) {
                                        MessageBox.error(oController.getBundleText("MSG_39022")); // ??????????????????(12?????????) ?????? ????????????????????? ????????? ??????????????????. ??????????????? ????????????.
                                        return;
                                    }
                                }

                                if (oData.Begsh2 && oData.Endsh2) {
                                    if (check(oData.Begsh2, oData.Begsh2p, "1") == false || check(oData.Endsh2, oData.Endsh2p, "2") == false) {
                                        MessageBox.error(oController.getBundleText("MSG_39023")); // ??????????????????(36?????????) ?????? ????????????????????? ????????? ??????????????????. ??????????????? ????????????.
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    if (oData.Eretcode !== "X") {
                        if (AttachFileAction.getFileLength(oController) === 0) {
                            MessageBox.error(oController.getBundleText("MSG_39021"), {
                                // ??????????????? ????????? ????????????.
                                title: oController.getBundleText("LABEL_00149") // ??????
                            });
                            return;
                        }
                    }
                }

                if(Flag == "C" && Common.isExternalIP()) {   // ????????? ?????? ???????????? ??????
                    setTimeout(function() {
                        var initData = {
                            Mode: "P", // PC ??? P, Mobile - M
                            Pernr: oController.getSessionInfoByKey("Pernr"),
                            Empid: oController.getSessionInfoByKey("Pernr"),
                            Bukrs: oController.getSessionInfoByKey("Bukrs3"),
                            ZappSeq: "02"
                        },
                        callback = function(o) {
                            oController.onPressSave.call(oController, Flag, o);   // ????????? Dialog?????? ?????? ?????? ????????? ?????? ?????? Function
                        };
            
                        oController.ApprovalLinesHandler = ApprovalLinesHandler.get(oController, initData, callback);
                        DialogHandler.open(oController.ApprovalLinesHandler);
                    }, 0);
                } else {
                    oController.onPressSave.call(oController, Flag, []); // ???????????? ?????? ?????? ?????? Function ??????
                }
            },

            // Flag : S ??????, C ??????, D ??????
            onPressSave: function (Flag, vAprdatas) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");

                var confirmMessage = "",
                    successMessage = "";

                if (Flag == "S") {
                    confirmMessage = oController.getBundleText("MSG_00058"); // ?????????????????????????
                    successMessage = oController.getBundleText("MSG_00017"); // ?????????????????????.
                } else if (Flag == "C") {
                    confirmMessage = oController.getBundleText("MSG_00060"); // ?????????????????????????
                    successMessage = oController.getBundleText("MSG_00061"); // ?????????????????????.
                } else {
                    confirmMessage = oController.getBundleText("MSG_39013"); // ?????????????????????????
                    successMessage = oController.getBundleText("MSG_39014"); // ?????????????????????.
                }

                var onProcess = function () {
                    var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                    var vExtryn = Common.isExternalIP() === true ? "X" : "";
                    var oUrl = "";
                    
                    var createData = { PregnantApplyTableIn: [], PregnantApplyTableIn2 : (vAprdatas ? vAprdatas : []) };
                    if (Flag == "D") {
                        createData.IConType = "4";
                    } else {
                        createData.IConType = oData.Status1 == "AA" ? "2" : "3";
                        if (Flag == "C") {
                            createData.IAppck = "X";
                        }
                    }

                    createData.IPernr = oController.getSessionInfoByKey("Pernr");
                    createData.IEmpid = oController.getSessionInfoByKey("Pernr");
                    createData.IMolga = oController.getSessionInfoByKey("Molga");
                    createData.IBukrs = oController.getSessionInfoByKey("Bukrs3");
                    createData.ILangu = oController.getSessionInfoByKey("Langu");
                    createData.IBegda = oData.Begda ? "/Date(" + Common.getTime(oData.Begda) + ")/" : null;
                    createData.IEndda = oData.Endda ? "/Date(" + Common.getTime(oData.Endda) + ")/" : null;
                    createData.IExtryn = vExtryn;

                    var detail = {};
                        detail.Pernr = oController.getSessionInfoByKey("Pernr");
                        detail.Preen = "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/"; // ???????????????
                        detail.Prebg = oData.Prebg ? "/Date(" + Common.getTime(new Date(oData.Prebg)) + ")/" : null; // ???????????????
                        detail.Prebn = oData.Prebn; // ?????????
                        detail.Pampm = oData.Pampm; // ??????????????????
                        detail.Mptyp = oData.Mptyp ? oData.Mptyp : ""; // ??????????????????

                        // ??????????????????
                        detail.Begsh = oData.Begsh ? "/Date(" + Common.getTime(new Date(oData.Begsh)) + ")/" : null;
                        detail.Endsh = oData.Endsh ? "/Date(" + Common.getTime(new Date(oData.Endsh)) + ")/" : null;
                        detail.Begshp = oData.Begshp ? "/Date(" + Common.getTime(new Date(oData.Begshp)) + ")/" : null;
                        detail.Endshp = oData.Endshp ? "/Date(" + Common.getTime(new Date(oData.Endshp)) + ")/" : null;

                        // ??????????????????
                        detail.Begsh2 = oData.Begsh2 ? "/Date(" + Common.getTime(new Date(oData.Begsh2)) + ")/" : null;
                        detail.Endsh2 = oData.Endsh2 ? "/Date(" + Common.getTime(new Date(oData.Endsh2)) + ")/" : null;
                        detail.Begsh2p = oData.Begsh2p ? "/Date(" + Common.getTime(new Date(oData.Begsh2p)) + ")/" : null;
                        detail.Endsh2p = oData.Endsh2p ? "/Date(" + Common.getTime(new Date(oData.Endsh2p)) + ")/" : null;

                        detail.Reque = oData.Reque; // ????????????

                    if (oData.Reqdt) {
                        detail.Reqdt = "/Date(" + Common.getTime(oData.Reqdt) + ")/"; // ????????????
                    } else {
                        detail.Reqdt = "/Date(" + Common.getTime(new Date()) + ")/"; // ????????????
                    }

                    if (Flag != "D") {
                        if (oData.Eretcode != "X" && AttachFileAction.getFileLength(oController) > 0) {
                            // ???????????? ??????
                            detail.Appnm = AttachFileAction.uploadFile.call(oController);
                            if (!detail.Appnm) {
                                oController._BusyDialog.close();
                                return;
                            }
                        }
                    }

                        detail.Begda = oData.Begda ? "/Date(" + Common.getTime(oData.Begda) + ")/" : null;
                        detail.Endda = oData.Endda ? "/Date(" + Common.getTime(oData.Endda) + ")/" : null;

                    createData.PregnantApplyTableIn.push(detail);

                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                oUrl = data.EUrl;
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

                    // 2021-05-04 ???????????? ?????? ??? ?????? ???????????? ??????
                    if(Flag == "C" && oUrl != ""){ //  && vExtryn == ""
                        if(common.Common.openPopup.call(oController, oUrl) == false){
                            return;
                        }
                    }

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    MessageBox.success(successMessage, {
                        onClose: function () {
                            sap.ui
                                .getCore()
                                .byId(oController.PAGEID + "_Icontabbar")
                                .setSelectedKey("1");
                            oController.onPressSearch1();
                        }
                    });
                };

                var onBeforeSave = function (fVal) {
                    if (fVal && fVal == "YES") {
                        oController._BusyDialog.open();
                        setTimeout(onProcess, 100);
                    }
                };

                MessageBox.confirm(confirmMessage, {
                    actions: ["YES", "NO"],
                    onClose: onBeforeSave
                });
            },

            handleIconTabBarSelect: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var sKey = sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .getSelectedKey();
                oController["onPressSearch" + sKey]();
            },

            getUserId: function () {
                return $.app.getController().getSessionInfoByKey("Pernr");
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20120220"});
                      return new JSONModelHelper({ name: "20060040" });
                      // return new JSONModelHelper({name: "20200277"});
                  }
                : null
        });
    }
);
