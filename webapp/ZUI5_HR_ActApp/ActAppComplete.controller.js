sap.ui.define(
    [
        "common/Common",
        "common/CommonController",
        "ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler",
        "sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator"
    ],
    function (Common, CommonController, AcpAppCommon, SubjectHandler, JSONModel, BusyIndicator) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppComplete"].join(".");

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "ActAppComplete",
            ListSelectionType: "Multiple",
            ListSelected: true,
            ListFilter: "%20and%20(Cfmyn%20eq%20%27" + "N" + "%27%20or%20Cfmyn%20eq%20%27" + "E" + "%27%20or%20Cfmyn%20eq%20%27" + "L" + "%27)",

            _vStatu: "",
            _vPersa: "",
            _vReqno: "",
            _vDocno: "",
            _vDocty: "",
            _vActda: "",
            _vMolga: "",
            _oContext: null,

            _Columns: "",

            _vSelected_Reqno: "",
            _vSelected_Pernr: "",
            _vSelected_Percod: "",
            _vSelected_Actda: "",
            _vSelected_Docno: "",
            _vSelected_VoltId: "",

            _vSucessCnt: 0,
            _vFailCnt: 0,
            _vTotalCnt: 0,

            _vSelectedReceiveAuthPersa: "",
            _vSelectedReceiveAuthRcvid: "",
            _vSelectedReceiveAuthMalty: "",

            _TableCellHeight: 34,
            _OtherHeight: 160,
            _vRecordCount: 0,
            _vListLength: 0,

            _vFromPageId: "",
            _oCompleteProcessDialog: null,
            _oCompleteEMailDialog: null,
            _ReceiveAuthPopover: null,

            getSubjectHandler: function () {
                this.SubjectHandler = SubjectHandler.initialize(this);

                return this.SubjectHandler;
            },

            onInit: function () {
                this.setupView()
                    .getView().addEventDelegate({
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    }, this);
            },

            onBeforeShow: function (oEvent) {
                this.getSubjectHandler();
                $.app.byId(this.PAGEID + "_SubjectList").getModel().setData({});

                if (oEvent) {
                    this._vStatu = oEvent.data.Statu;
                    this._vReqno = oEvent.data.Reqno;
                    this._vDocno = oEvent.data.Docno;
                    this._vDocty = oEvent.data.Docty;
                    this._vPersa = oEvent.data.Persa;
                    this._vActda = oEvent.data.Actda;
                    this._vMolga = oEvent.data.Molga;
                    this._oContext = oEvent.data.context;

                    this._vFromPageId = oEvent.data.FromPageId;
                }

                this._vListLength = 0;
            },

            onAfterShow: function () {
                this.reloadSubjectList(this);
            },

            reloadSubjectList: function (oController) {
                var dataProcess = function () {
                    oController.SubjectHandler.setSubjectList({
                        isShowBatyp: (oController._vDocty == "20") ? false : true
                    });

                    var oSubjectModel = $.app.byId(oController.PAGEID + "_SubjectList").getModel();
                    var vSubjectList = oSubjectModel.getProperty("/ActionSubjectListSet");
                    var tempPernr = "";

                    oSubjectModel.setProperty(
                        "/ActionSubjectListSet",
                        vSubjectList.filter(function (elem) {
                            if (elem.Cfmyn === "X") {
                                tempPernr = elem.Pernr;
                                return false;
                            } else {
                                if (tempPernr === elem.Pernr) {
                                    tempPernr = "";
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        })
                    );

                    Common.adjustViewHeightRowCount({
                        tableControl: $.app.byId(oController.PAGEID + "_SubjectList"),
                        rowHeight: 37,
                        viewHeight: 75,
                        dataCount: $.app.byId(oController.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
                    });

                    $.app.byId(oController.PAGEID + "_COMPLETE_BTN").setVisible((oController._vListLength > 0) ? true : false);

                    BusyIndicator.hide();
                }.bind(this)

                BusyIndicator.show(0);
                setTimeout(dataProcess, 100);
            },

            navToBack: function () {
                var oController = $.app.getController(SUB_APP_ID);

                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: oController._vFromPageId ? oController._vFromPageId : "ZUI5_HR_ActApp.ActAppMain",
                        data: {
                            context: oController._oContext,
                            Statu: oController._vStatu,
                            Reqno: oController._vReqno,
                            Docno: oController._vDocno,
                            Docty: oController._vDocty
                        }
                    });
            },

            checkAll: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID),
                    vSelected = oEvent.getParameters().selected,
                    oModel = $.app.byId(oController.PAGEID + "_SubjectList").getModel(),
                    vTableData = oModel.getProperty("/ActionSubjectListSet");

                vTableData.forEach(function (elem, i) {
                    oModel.setProperty("/ActionSubjectListSet/" + i + "/Pchk", vSelected);
                });
            },

            toggleCheckbox: function () {
                var oController = $.app.getController(SUB_APP_ID),
                    oCheckAll = $.app.byId(oController.PAGEID + "_checkAll");

                oCheckAll.setSelected(false);
            },

            onPressComplete: function () {
                var oView = $.app.getView(SUB_APP_ID),
                    oController = $.app.getController(SUB_APP_ID),
                    oModel = $.app.getModel("ZHR_ACTIONAPP_SRV"),
                    mSubjectList = sap.ui.getCore().getModel("ActionSubjectList"),
                    vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet"),
                    filterdActSubjectListSet = [];

                // 채용이 아닐경우 
                if (oController._vDocty !== "20") {
                    // 한 개의 row만 남긴다.
                    vActionSubjectListSet.forEach(function (element, idx) {
                        if (idx % 2 === 0) filterdActSubjectListSet.push(element);
                    });
                } else {
                    filterdActSubjectListSet = vActionSubjectListSet;
                }

                // processing dialog object bind
                mSubjectList.setProperty("/filterdActSubjectListSet", filterdActSubjectListSet);

                var check_idxs = [];
                if (filterdActSubjectListSet && filterdActSubjectListSet.length) {
                    for (var i = 0; i < filterdActSubjectListSet.length; i++) {
                        if (filterdActSubjectListSet[i].Pchk == true) {
                            check_idxs.push(i);
                        }
                    }
                }

                if (check_idxs.length < 1) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_02024"));
                    return;
                }

                for (var j = 0; j < vActionSubjectListSet.length; j++) {
                    mSubjectList.setProperty("/ActionSubjectListSet/" + j + "/ProcessStatus", "W");
                    mSubjectList.setProperty("/ActionSubjectListSet/" + j + "/ProcessStatusText", "");
                    mSubjectList.setProperty("/ActionSubjectListSet/" + j + "/ProcessMsg", "");
                }
                for (var k = 0; k < filterdActSubjectListSet.length; k++) {
                    mSubjectList.setProperty("/filterdActSubjectListSet/" + k + "/ProcessStatus", "W");
                    mSubjectList.setProperty("/filterdActSubjectListSet/" + k + "/ProcessStatusText", "");
                    mSubjectList.setProperty("/filterdActSubjectListSet/" + k + "/ProcessMsg", "");
                }

                oController._vTotalCnt = check_idxs.length;
                oController._vSucessCnt = 0;
                oController._vFailCnt = 0;
                var idx = 0;

                var vCnfpr = "";

                var onCompleteAction = function () {
                    var d_idx = check_idxs[idx];
                    var createData = {};
                    var process_result = false;

                    createData.Docno = filterdActSubjectListSet[d_idx].Docno;
                    createData.Docty = filterdActSubjectListSet[d_idx].Docty;
                    createData.Reqno = filterdActSubjectListSet[d_idx].Reqno;
                    createData.Persa = filterdActSubjectListSet[d_idx].Persa;
                    createData.Percod = filterdActSubjectListSet[d_idx].Percod;
                    createData.Actda = filterdActSubjectListSet[d_idx].Actda;
                    createData.VoltId = filterdActSubjectListSet[d_idx].VoltId;
                    createData.Actty = "C";
                    if (idx == 0) {
                        createData.CfmFirst = "X";
                    } else {
                        createData.CfmFirst = "";
                    }
                    if (idx == check_idxs.length - 1) {
                        createData.CfmLast = "X";
                    } else {
                        createData.CfmLast = "";
                    }

                    try {
                        var vAuthData = {};
                        if (createData.CfmFirst == "X") {
                            vAuthData.Docno = filterdActSubjectListSet[d_idx].Docno;
                            vAuthData.Actda = filterdActSubjectListSet[d_idx].Actda;
                            vAuthData.Actty = "B";

                            oModel.create("/ActionAuthorizationSet", vAuthData, {
                                success: function () {
                                    Common.log("Success : Start Authorization");
                                },
                                error: function (oError) {
                                    Common.log(oError);
                                }
                            });
                        }

                        var sPath = oModel.createKey("/ActionSubjectListSet", {
                            Docno: filterdActSubjectListSet[d_idx].Docno,
                            Percod: filterdActSubjectListSet[d_idx].Percod,
                            VoltId: filterdActSubjectListSet[d_idx].VoltId,
                            Actda: filterdActSubjectListSet[d_idx].Actda
                        });

                        oModel.update(sPath, createData, {
                            success: function () {
                                process_result = true;
                            },
                            error: function (oError) {
                                var Err = {};
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    var msg1 = Err.error.innererror.errordetails;
                                    if (msg1 && msg1.length) mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessMsg", Err.error.innererror.errordetails[0].message);
                                    else mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessMsg", Err.error.message.value);
                                } else {
                                    mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessMsg", oError.toString());
                                }
                                process_result = false;
                            }
                        });

                        if (createData.CfmLast == "X") {
                            vAuthData.Docno = filterdActSubjectListSet[d_idx].Docno;
                            vAuthData.Actda = filterdActSubjectListSet[d_idx].Actda;
                            vAuthData.Actty = "E";

                            oModel.create("/ActionAuthorizationSet", vAuthData, {
                                success: function () {
                                    Common.log("Success : End Authorization");
                                },
                                error: function (oError) {
                                    Common.log(oError);
                                }
                            });
                        }
                    } catch (ex) {
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessMsg", ex.toString());
                        process_result = false;
                    }

                    if (process_result) {
                        vCnfpr += filterdActSubjectListSet[d_idx].Pernr + "|";
                        oController._vSucessCnt++;
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessStatusText", oController.getBundleText("LABEL_02019"));
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessStatus", "S");
                    } else {
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessStatusText", oController.getBundleText("LABEL_02020"));
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + d_idx + "/ProcessStatus", "F");
                        oController._vFailCnt++;
                    }

                    var oMessage = null;
                    if (idx + 1 < oController._vTotalCnt) {
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + check_idxs[idx + 1] + "/ProcessStatusText", oController.getBundleText("LABEL_02018"));
                        mSubjectList.setProperty("/filterdActSubjectListSet/" + check_idxs[idx + 1] + "/ProcessStatus", "P");
                        setTimeout(onCompleteAction, 300);

                        oMessage = $.app.byId(oController.PAGEID + "_CP_MESSAGE");
                        var vPer = ((idx + 1) * 100) / oController._vTotalCnt;
                        oMessage.setPercentValue(vPer);
                        oMessage.setDisplayValue(idx + 1 + " of " + oController._vTotalCnt);

                        idx = idx + 1;
                    } else {
                        var oControl = $.app.byId(oController.PAGEID + "_CP_ConfirmBtn");
                        oControl.setEnabled(true);

                        oMessage = $.app.byId(oController.PAGEID + "_CP_MESSAGE");
                        oMessage.setPercentValue(100.0);
                        oMessage.setDisplayValue(oController._vTotalCnt + " of " + oController._vTotalCnt);

                        var oPath1 = "/ActionMailConfirmPernrSet";
                        var vMailCreateData = {};
                        vMailCreateData.Docno = oController._vDocno;
                        vMailCreateData.Cnfpr = vCnfpr;

                        oModel.create(oPath1, vMailCreateData, {
                            success: function () {
                                Common.log("Sucess ActionMailRecipientListSet Create !!!");
                            },
                            error: function (oError) {
                                Common.log(oError);
                            }
                        });

                        if (oController._vTotalCnt == oController._vSucessCnt) {
                            oController.onCPClose();
                        }
                    }
                };

                var onProcessing = function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        if (!oController._oCompleteProcessDialog) {
                            oController._oCompleteProcessDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.CompleteProcessing", oController);
                            oView.addDependent(oController._oCompleteProcessDialog);
                        }

                        oController._oCompleteProcessDialog.open();

                        var oMessage = $.app.byId(oController.PAGEID + "_CP_MESSAGE");
                        oMessage.setPercentValue(0.0);
                        oMessage.setDisplayValue("");

                        var oCP_Table = $.app.byId(oController.PAGEID + "_CP_Table");
                        var oBinding = oCP_Table.getBinding("items");
                        oBinding.filter([new sap.ui.model.Filter("Pchk", sap.ui.model.FilterOperator.EQ, true)]);

                        mSubjectList.setProperty("/filterdActSubjectListSet/0/ProcessStatusText", oController.getBundleText("LABEL_02018"));
                        mSubjectList.setProperty("/filterdActSubjectListSet/0/ProcessStatus", "P");
                        setTimeout(onCompleteAction, 300);
                    }
                };

                var vMsg1 = oController.getBundleText("MSG_02025");
                var vMsg = vMsg1.replace("%CNT%", check_idxs.length) + " " + oController.getBundleText("MSG_02026");

                sap.m.MessageBox.show(vMsg, {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: oController.getBundleText("LABEL_02186"),
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: onProcessing
                });
            },

            onCPClose: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var tMsg1 = oController.getBundleText("MSG_02027");
                var tMsg2 = tMsg1.replace("%CNT1%", oController._vSucessCnt);
                var msg = tMsg2.replace("%CNT2%", oController._vFailCnt);

                if (oController._oCompleteProcessDialog && oController._oCompleteProcessDialog.isOpen()) {
                    oController._oCompleteProcessDialog.close();
                }

                msg += " " + oController.getBundleText("MSG_02028");

                sap.m.MessageBox.alert(msg, {
                    title: oController.getBundleText("LABEL_02093"),
                    onClose: function () {
                        Common.log("Count : " + oController._vTotalCnt + ", " + oController._vSucessCnt);
                        if (oController._vTotalCnt == oController._vSucessCnt) {
                            oController.navToBack();
                        } else {
                            oController.reloadSubjectList(oController);
                        }
                    }
                });
            },

            onChangeCheckBox: function (oEvent) {
                var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
                var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet"); //{ActionSubjectListSet : []};

                var vTempData = {
                    ActionSubjectListSet: []
                };

                if (vActionSubjectList && vActionSubjectList.length) {
                    for (var i = 0; i < vActionSubjectList.length; i++) {
                        var Batyp = vActionSubjectList[i].Batyp;
                        var oneData = vActionSubjectList[i];
                        if (Batyp == "A") oneData.Pchk = oEvent.getParameter("checked");
                        vTempData.ActionSubjectListSet.push(oneData);
                    }
                    mActionSubjectList.setData(vTempData);
                }
            },

            displayDetailView: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var oControl = oEvent.getSource();
                var oCustomData = oControl.getCustomData();

                oController._vSelected_Reqno = null;
                oController._vSelected_Reqno = null;
                oController._vSelected_Actda = null;
                oController._vSelected_Docno = null;

                if (oCustomData && oCustomData.length) {
                    for (var i = 0; i < oCustomData.length; i++) {
                        if (oCustomData[i].getKey() == "Reqno") {
                            oController._vSelected_Reqno = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Pernr") {
                            oController._vSelected_Pernr = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Percod") {
                            oController._vSelected_Percod = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Actda") {
                            oController._vSelected_Actda = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Docno") {
                            oController._vSelected_Docno = oCustomData[i].getValue();
                        }
                    }
                }

                if (!oController._DetailViewPopover) {
                    if (oController._vDocty == "20") {
                        oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionRecDetailView", oController);
                    } else {
                        oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
                    }
                    oView.addDependent(oController._DetailViewPopover);
                }

                oController._DetailViewPopover.openBy(oControl);
            },

            onAfterOpenPopover: function () {
                var oController = $.app.getController(SUB_APP_ID);

                if (oController._vDocty == "20") {
                    AcpAppCommon.onAfterOpenRecDetailViewPopover(oController);
                } else {
                    AcpAppCommon.onAfterOpenDetailViewPopover(oController);
                }
            },

            deletePerson: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oTable = $.app.byId(oController.PAGEID + "_CE_Table");
                var vContexts = oTable.getSelectedContexts(true);
                var oJSONModel = oTable.getModel();
                var JSONData = oJSONModel.getProperty("/ActionMailRecipientListSet");
                var vNumbr = 1;
                var vTmp = {
                    ActionMailRecipientListSet: []
                };

                if (JSONData && JSONData.length) {
                    if (vContexts && vContexts.length) {
                        for (var i = 0; i < JSONData.length; i++) {
                            var checkDel = false;
                            for (var j = 0; j < vContexts.length; j++) {
                                if (JSONData[i].Rcvid == vContexts[j].getProperty("Rcvid")) {
                                    checkDel = true;
                                    break;
                                }
                            }
                            if (checkDel) continue;

                            JSONData[i].Numbr = vNumbr++;
                            vTmp.ActionMailRecipientListSet.push(JSONData[i]);
                        }
                        oJSONModel.setData(vTmp);
                    } else {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_02029"));
                        return;
                    }
                } else {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_02030"));
                    return;
                }
            },

            onSendMail: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var mActionMailRecipientList = sap.ui.getCore().getModel("ActionMailRecipientList");
                var vActionMailRecipientList = mActionMailRecipientList.getProperty("/ActionMailRecipientListSet");
                var idx = 0;
                var processMsg = "";

                var sendmail = function () {
                    if (idx >= vActionMailRecipientList.length) {
                        BusyIndicator.hide();

                        sap.m.MessageBox.show(processMsg, {
                            icon: sap.m.MessageBox.Icon.INFORMATION,
                            title: oController.getBundleText("LABEL_02186"),
                            actions: [sap.m.MessageBox.Action.CLOSE],
                            onClose: oController.onCEClose
                        });
                        return;
                    }

                    var createData = {};
                    createData.Docno = vActionMailRecipientList[idx].Docno;
                    createData.Persa = vActionMailRecipientList[idx].Persa;
                    createData.Malty = vActionMailRecipientList[idx].Malty;
                    createData.Rcvid = vActionMailRecipientList[idx].Rcvid;
                    if (vActionMailRecipientList[idx].Rnoyn == true) {
                        createData.Rnoyn = "X";
                    } else {
                        createData.Rnoyn = "";
                    }
                    if (vActionMailRecipientList[idx].Pnryn == true) {
                        createData.Pnryn = "X";
                    } else {
                        createData.Pnryn = "";
                    }
                    if (vActionMailRecipientList[idx].Payyn == true) {
                        createData.Payyn = "X";
                    } else {
                        createData.Payyn = "";
                    }

                    $.app.getModel("ZHR_ACTIONAPP_SRV").create("/ActionMailRecipientListSet", createData, {
                        success: function (oData) {
                            if (oData) {
                                if (processMsg != "") processMsg += "\n";
                                if (oData.Type == "S") {
                                    processMsg += "[" + oController.getBundleText("MSG_02031") + "] " + oData.Message;
                                } else {
                                    processMsg += "[" + oController.getBundleText("MSG_02032") + "] " + oData.Message;
                                }
                            }
                            Common.log("Sucess ActionMailRecipientListSet Create !!!");
                        },
                        error: function (oError) {
                            var Err = {};
                            var ErrMsg = "";
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
                                else ErrMsg = Err.error.message.value;
                            } else {
                                ErrMsg = oError.toString();
                            }

                            sap.m.MessageBox.alert(ErrMsg);
                            return;
                        }
                    });

                    idx++;
                    setTimeout(sendmail, 300);
                };

                BusyIndicator.show(0);

                setTimeout(sendmail, 300);
            },

            onCEClose: function () {
                var oController = $.app.getController(SUB_APP_ID);

                if (oController._oCompleteEMailDialog && oController._oCompleteEMailDialog.isOpen()) {
                    oController._oCompleteEMailDialog.close();
                }
            },

            onBeforeOpenCompleteEMailDialog: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var mActionMailRecipientList = sap.ui.getCore().getModel("ActionMailRecipientList");
                var vActionMailRecipientList = {
                    ActionMailRecipientListSet: []
                };

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionMailRecipientListSet", {
                    async: false,
                    filters: [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno), new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                var oneData = oData.results[i];
                                if (oData.results[i].Rnoyn == "X") oneData.Rnoyn = true;
                                else oneData.Rnoyn = false;
                                if (oData.results[i].Pnryn == "X") oneData.Pnryn = true;
                                else oneData.Pnryn = false;
                                if (oData.results[i].Payyn == "X") oneData.Payyn = true;
                                else oneData.Payyn = false;
                                oneData.Numbr = i + 1;
                                vActionMailRecipientList.ActionMailRecipientListSet.push(oneData);
                            }
                        }
                    },
                    error: function (oError) {
                        Common.log(oError);

                        var Err = {};
                        var ErrMsg = "";
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
                            else ErrMsg = Err.error.message.value;
                        } else {
                            ErrMsg = oError.toString();
                        }
                        sap.m.MessageBox.alert(ErrMsg);
                        return;
                    }
                });

                mActionMailRecipientList.setData(vActionMailRecipientList);
            },

            displayReceiveAuth: function () {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var oControl = this;

                var oCustomData = oControl.getCustomData();
                if (oCustomData && oCustomData.length) {
                    for (var i = 0; i < oCustomData.length; i++) {
                        if (oCustomData[i].getKey() == "Persa") {
                            oController._vSelectedReceiveAuthPersa = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Rcvid") {
                            oController._vSelectedReceiveAuthRcvid = oCustomData[i].getValue();
                        } else if (oCustomData[i].getKey() == "Malty") {
                            oController._vSelectedReceiveAuthMalty = oCustomData[i].getValue();
                        }
                    }
                }

                if (!oController._ReceiveAuthPopover) {
                    oController._ReceiveAuthPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ReceiveAuthPopover", oController);
                    oView.addDependent(oController._ReceiveAuthPopover);
                }

                oController._ReceiveAuthPopover.openBy(oControl);
            },

            onBeforeOpenPopoverReveiveAuth: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oList = $.app.byId(oController.PAGEID + "_RA_List");
                var oListItem = $.app.byId(oController.PAGEID + "_RA_ListItem");
                var filterString = "?$filter=Persa%20eq%20%27" + oController._vSelectedReceiveAuthPersa + "%27";
                filterString += "%20and%20Rcvid%20eq%20%27" + oController._vSelectedReceiveAuthRcvid + "%27";

                oList.bindItems("/ActionMailRcvAuthSet/" + filterString, oListItem);
            },

            onResizeWindow: function () {
                $("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 140);
            },

            onInfoViewPopup: function () {
                var oContext = this.getBindingContext(),
                    oControl = this,
                    oView = $.app.getView(SUB_APP_ID),
                    oController = $.app.getController(SUB_APP_ID),
                    oTable = $.app.byId(oController.PAGEID + "_SubjectList"),
                    oSubjectModel = oTable.getModel();

                oController._vSelected_Pernr = oSubjectModel.getProperty(oContext + "/Pernr");
                oController._vSelected_Percod = oSubjectModel.getProperty(oContext + "/Percod");
                oController._vSelected_Reqno = oSubjectModel.getProperty(oContext + "/Reqno");
                oController._vSelected_Actda = oSubjectModel.getProperty(oContext + "/Actda");
                oController._vSelected_Docno = oSubjectModel.getProperty(oContext + "/Docno");
                oController._vSelected_VoltId = oSubjectModel.getProperty(oContext + "/VoltId");

                if (oController._vDocty == "20" || oController._vDocty == "50") {
                    if (!oController._DetailRecViewPopover) {
                        oController._DetailRecViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionRecDetailView", oController);
                        oView.addDependent(oController._DetailRecViewPopover);
                    }
                    oController._DetailRecViewPopover.openBy(oControl);
                } else {
                    if (!oController._DetailViewPopover) {
                        oController._DetailViewPopover = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionDetailView", oController);
                        oView.addDependent(oController._DetailViewPopover);
                    }
                    oController._DetailViewPopover.openBy(oControl);
                }
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModel({
                    name: "951009"
                });
            } : null
        });
    });