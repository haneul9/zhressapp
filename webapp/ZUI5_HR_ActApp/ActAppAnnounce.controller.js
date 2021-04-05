sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"sap/ui/model/json/JSONModel",
		"ZUI5_HR_ActApp/common/Common",
		"./delegate/SubjectHandler"
	],
    function (Common, CommonController, JSONModel, AcpAppCommon, SubjectHandler) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppAnnounce"].join(".");

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "ActAppAnnounce",
            ListSelectionType: "Multiple",
            ListSelected: true,
            ListFilter: "",

            _fUpdateFlag: false,

            _vStatu: "",
            _vPersa: "",
            _vReqno: "",
            _vDocno: "",
            _vDocty: "",
            _vActda: "",
            _vMolga: "",
            _oContext: null,

            _vSelected_Reqno: "",
            _vSelected_Pernr: "",
            _vSelected_Percod: "",
            _vSelected_Actda: "",
            _vSelected_Docno: "",
            _vSelected_VoltId: "",

            _vFromPageId: "",

            _DetailViewPopover: null,
            _PreviewDialog: null,

            getSubjectHandler: function () {
                this.SubjectHandler = SubjectHandler.initialize(this);

                return this.SubjectHandler;
            },

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf ZUI5_HR_ActApp.ActAppAnnounce
             */
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
                    this._oContext = oEvent.data.context;

                    Common.log("ActAppAnnounce Init Data : " + this._vDocno + ", " + this._vPersa + ", " + this._vReqno + ", " + this._vDocty);

                    this._vFromPageId = oEvent.data.FromPageId;

                    this.setAppGrouping(this);

                    this._fUpdateFlag = false;
                }
                this._vListLength = 0;
            },

            onAfterShow: function (oEvent) {
                if (oEvent) {
                    this.SubjectHandler.setSubjectList({
                        isShowBatyp: (this._vDocty == "20") ? false : true
                    });
                    Common.adjustViewHeightRowCount({
                        tableControl: $.app.byId(this.PAGEID + "_SubjectList"),
                        rowHeight: 37,
                        viewHeight: 50,
                        dataCount: $.app.byId(this.PAGEID + "_SubjectList").getModel().getProperty("/ActionSubjectListSet").length
                    });
                }
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

            setAppGrouping: function (oController) {
                var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
                var vActionAppGrouping = {
                    ActionAppGroupingSet: []
                };

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionAppGroupingSet", {
                    async: false,
                    filters: [new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno), new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa), new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno)],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                var oneData = {};

                                oneData.Persa = oData.results[i].Persa;
                                oneData.Reqno = oData.results[i].Reqno;
                                oneData.Docno = oData.results[i].Docno;
                                oneData.Actin = oData.results[i].Actin;
                                oneData.Acttx = oData.results[i].Acttx;
                                oneData.Grpn1 = parseInt(oData.results[i].Grpn1);
                                oneData.Grpn2 = parseInt(oData.results[i].Grpn2);
                                oneData.Grpt1 = oData.results[i].Grpt1;
                                oneData.Grpt2 = oData.results[i].Grpt2;

                                if (oData.results[i].Farea == "X") oneData.Farea = true;
                                else oneData.Farea = false;
                                if (oData.results[i].Posgr == "X") oneData.Posgr = true;
                                else oneData.Posgr = false;

                                if (oneData.Grpt1 != "") oneData.Grpt1E = true;
                                else oneData.Grpt1E = false;
                                vActionAppGrouping.ActionAppGroupingSet.push(oneData);
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                mActionAppGrouping.setData(vActionAppGrouping);
            },

            onChangeData: function () {
                $.app.getController(SUB_APP_ID)._fUpdateFlag = true;
            },

            onChangeGrpn1: function (oEvent) {
                $.app.getController(SUB_APP_ID)._fUpdateFlag = true;

                var vKey = oEvent.getSource().getSelectedKey();

                var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
                var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");

                if (vKey != "0000" && vKey != "") {
                    var vTmpGrpn1 = [];
                    for (var i = 0; i < vActionAppGrouping.length; i++) {
                        var vrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + i + "/Grpn1");
                        var isExists = false;
                        for (var j = 0; j < vTmpGrpn1.length; j++) {
                            if (vTmpGrpn1[j] == vrpn1) {
                                isExists = true;
                                break;
                            }
                        }
                        if (!isExists) {
                            vTmpGrpn1.push(vrpn1);
                        }
                    }

                    for (var k = 0; k < vTmpGrpn1.length; k++) {
                        vKey = vTmpGrpn1[k];
                        var vSameCnt = [];
                        for (var m = 0; m < vActionAppGrouping.length; m++) {
                            var vGrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + m + "/Grpn1");
                            if (vGrpn1 == vKey) {
                                vSameCnt.push(m);
                            }
                        }

                        for (var n = 0; n < vSameCnt.length; n++) {
                            if (n > 0) {
                                mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1", "");
                                mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1E", false);
                            } else {
                                mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[n] + "/Grpt1E", true);
                            }
                        }
                    }
                }
            },

            onChangeGrpn2: function (oEvent) {
                $.app.getController(SUB_APP_ID)._fUpdateFlag = true;

                var vKey = oEvent.getSource().getSelectedKey();

                if (vKey == "0000" || vKey == "") {
                    var vControlId = oEvent.getSource().getId();
                    var vIdxs = vControlId.split("-");
                    var vIdx = vIdxs[vIdxs.length - 1];

                    var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
                    mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vIdx + "/Grpt2", "");
                }
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

            onPressSave: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var UpdateData_Grouping = [];
                var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
                var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");

                if (vActionAppGrouping && vActionAppGrouping.length) {
                    for (var i = 0; i < vActionAppGrouping.length; i++) {
                        var OneData_Grouping = {};

                        OneData_Grouping.Persa = vActionAppGrouping[i].Persa;
                        OneData_Grouping.Reqno = vActionAppGrouping[i].Reqno;
                        OneData_Grouping.Docno = vActionAppGrouping[i].Docno;
                        OneData_Grouping.Actin = vActionAppGrouping[i].Actin;
                        OneData_Grouping.Acttx = vActionAppGrouping[i].Acttx;

                        if (vActionAppGrouping[i].Grpn1 == "" || vActionAppGrouping[i].Grpn1 == "0000") {
                            sap.m.MessageBox.alert(i + 1 + oController.getBundleText("MSG_02017"));
                            return;
                        } //Grpt1

                        if (vActionAppGrouping[i].Grpt1E == true && vActionAppGrouping[i].Grpt1 == "") {
                            sap.m.MessageBox.alert(oController.getBundleText("MSG_02018").replace("$NO$", i + 1));
                            return;
                        }

                        OneData_Grouping.Grpn1 = "" + vActionAppGrouping[i].Grpn1;
                        if (vActionAppGrouping[i].Grpn2 == "0000" || vActionAppGrouping[i].Grpn2 == "") {
                            OneData_Grouping.Grpn2 = "";
                        } else {
                            OneData_Grouping.Grpn2 = "" + vActionAppGrouping[i].Grpn2;
                        }

                        OneData_Grouping.Grpt1 = vActionAppGrouping[i].Grpt1;
                        OneData_Grouping.Grpt2 = vActionAppGrouping[i].Grpt2;

                        if (vActionAppGrouping[i].Farea == true) {
                            OneData_Grouping.Farea = "X";
                        } else {
                            OneData_Grouping.Farea = "";
                        }
                        if (vActionAppGrouping[i].Posgr == true) {
                            OneData_Grouping.Posgr = "X";
                        } else {
                            OneData_Grouping.Posgr = "";
                        }

                        UpdateData_Grouping.push(OneData_Grouping);
                    }
                }

                var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
                var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");

                var check_idxs = [];
                if (vActionSubjectListSet && vActionSubjectListSet.length) {
                    for (var j = 0; j < vActionSubjectListSet.length; j++) {
                        if (j % 2 === 0 && vActionSubjectListSet[j].Pchk == true) {
                            check_idxs.push(j);
                        }
                    }
                }

                if (check_idxs.length < 1) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_02019"));
                    return false;
                }

                var process_result = false;
                var sPath = "";

                try {
                    if (UpdateData_Grouping && UpdateData_Grouping.length) {
                        for (var k = 0; k < UpdateData_Grouping.length; k++) {
                            sPath = oModel.createKey("/ActionAppGroupingSet", {
                                Docno: UpdateData_Grouping[k].Docno,
                                Actin: UpdateData_Grouping[k].Actin
                            });

                            oModel.update(sPath, UpdateData_Grouping[k], {
                                success: function () {
                                    process_result = true;
                                    Common.log("Sucess ActionAppGroupingSet Update !!!");
                                },
                                error: function (oError) {
                                    process_result = false;
                                    Common.log(oError);
                                }
                            });

                            if (!process_result) {
                                return false;
                            }
                        }
                    }

                    if (vActionSubjectListSet && check_idxs.length) {
                        for (var m = 0; m < check_idxs.length; m++) {
                            var updateData = {};
                            var idx = check_idxs[m];

                            updateData.Percod = vActionSubjectListSet[idx].Percod;
                            updateData.Docno = vActionSubjectListSet[idx].Docno;
                            updateData.Docty = vActionSubjectListSet[idx].Docty;
                            updateData.Reqno = vActionSubjectListSet[idx].Reqno;
                            updateData.Persa = vActionSubjectListSet[idx].Persa;
                            updateData.Pernr = vActionSubjectListSet[idx].Pernr;
                            updateData.Actda = vActionSubjectListSet[idx].Actda;
                            updateData.VoltId = vActionSubjectListSet[idx].VoltId;
                            if (vActionSubjectListSet[idx].Pchk == true) {
                                updateData.Shayn = "X";
                            } else {
                                updateData.Shayn = "";
                            }
                            updateData.Actty = "S";

                            sPath = oModel.createKey("/ActionSubjectListSet", {
                                Docno: vActionSubjectListSet[idx].Docno,
                                Percod: vActionSubjectListSet[idx].Percod,
                                VoltId: vActionSubjectListSet[idx].VoltId,
                                Actda: vActionSubjectListSet[idx].Actda
                            });

                            oModel.update(sPath, updateData, {
                                success: function () {
                                    process_result = true;
                                    Common.log("Sucess ActionSubjectListSet Update !!!");
                                },
                                error: function (oError) {
                                    process_result = false;
                                    Common.log(oError);
                                }
                            });

                            if (!process_result) {
                                return false;
                            }
                        }
                    }

                    var oAttyn = $.app.byId(oController.PAGEID + "_Attyn");
                    var vAttyn = "";
                    if (oAttyn.getSelected()) vAttyn = "X";

                    var updateData2 = {};
                    updateData2.Docno = oController._vDocno;
                    updateData2.Attyn = vAttyn;
                    updateData2.Actty = "S";

                    sPath = oModel.createKey("/ActionPostHtmlSet", {
                        Docno: oController._vDocno,
                        Attyn: vAttyn,
                        Actty: "S"
                    });

                    oModel.update(sPath, updateData2, {
                        success: function () {
                            process_result = true;
                            Common.log("Sucess ActionPostHtmlSet Update !!!");
                        },
                        error: function (oError) {
                            process_result = false;
                            Common.log(oError);
                        }
                    });
                } catch (ex) {
                    process_result = false;
                    Common.log(ex);
                }

                if (!process_result) {
                    return false;
                }

                if (oEvent != null) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_02020"), {
                        title: oController.getBundleText("LABEL_02093")
                    });
                }
                oController._fUpdateFlag = false;
                return true;
            },

            onPressPreview: function () {
                var oController = $.app.getController(SUB_APP_ID);

                if (!oController._PreviewDialog) {
                    oController._PreviewDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionAppPreview", oController);
                    $.app.getView(SUB_APP_ID).addDependent(oController._PreviewDialog);
                }
                oController._PreviewDialog.open();
            },

            onBeforeOpenHtmlDialog: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var oAttyn = $.app.byId(oController.PAGEID + "_Attyn");
                var vAttyn = "";
                var oPanel = $.app.byId(oController.PAGEID + "_APP_HtmlPanel");
                var oHtml = new sap.ui.core.HTML({
                    preferDOM: true,
                    sanitizeContent: false
                }).addStyleClass("L2PBackgroundWhite");

                if (oAttyn.getSelected()) vAttyn = "X";

                oPanel.removeAllContent();
                oPanel.destroyContent();

                try {
                    var sPath = oModel.createKey("ActionPostHtmlSet", {
                        Docno: oController._vDocno,
                        Attyn: vAttyn,
                        Actty: "S"
                    });

                    oModel.read(sPath, {
                        async: false,
                        success: function (oData) {
                            if (oData) oHtml.setContent(oData.Htmlc);
                        },
                        error: function (oResponse) {
                            oHtml.setContent("<div><h3 style='color:darkred'>" + oController.getBundleText("MSG_02021") + "</h3></div>");
                            Common.log(oResponse);
                        }
                    });
                } catch (ex) {
                    Common.log(ex);
                }
                oPanel.addContent(oHtml);
            },

            onAAPClose: function () {
                var oController = $.app.getController(SUB_APP_ID);

                if (oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
                    oController._PreviewDialog.close();
                }
            },

            onPressAnnounce: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var vTitle = oController.getBundleText("LABEL_02258");
                var vMsg = oController.getBundleText("MSG_02022");
                var oAttyn = $.app.byId(oController.PAGEID + "_Attyn");

                var DataProcess = function () {
                    if (!oController.onPressSave()) {
                        return;
                    }

                    var createData = {
                        Docno: oController._vDocno,
                        Persa: oController._vPersa,
                        Reqno: oController._vReqno
                    };
                    createData.Reqst = "51";
                    createData.Attyn = "";
                    if (oAttyn.getSelected()) createData.Attyn = "X";

                    var msg = oController.getBundleText("MSG_02023");

                    $.app.getModel("ZHR_ACTIONAPP_SRV").create("/ActionReqChangeHistorySet", createData, {
                        success: function () {
                            sap.m.MessageBox.alert(msg, {
                                title: oController.getBundleText("LABEL_02093"),
                                onClose: function () {
                                    var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
                                    mActionReqList.setProperty(oController._oContext + "/Postc", "X");
                                    oController.navToBack();
                                }
                            });
                        },
                        error: function (oError) {
                            Common.log(oError);
                        }
                    });
                };

                sap.m.MessageBox.show(vMsg, {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: vTitle,
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            DataProcess();
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
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oCustomData = oControl.getCustomData();

                oController._vSelected_Reqno = null;
                oController._vSelected_Pernr = null;
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
                    $.app.getView(SUB_APP_ID).addDependent(oController._DetailViewPopover);
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

            onResizeWindow: function () {
                $("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
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