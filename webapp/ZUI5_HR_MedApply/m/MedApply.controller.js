sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/DialogHandler",
        "../delegate/AllRequestFileHandler",
        "sap/m/InputBase",
        "sap/ui/core/BusyIndicator",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModelHelper, DialogHandler, AllRequestFileHandler, InputBase, BusyIndicator, MessageBox) {
        "use strict";

        return CommonController.extend("ZUI5_HR_MedApply.MedApply", {
            PAGEID: "MedApply",

            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _DataModel: new sap.ui.model.json.JSONModel(),
            _SessionData: {},

            InputBase: InputBase,
            _Bukrs: "",
            _ViewData: {},
            _SelData: { Sel1: [], Sel2: [], Sel3: [], Sel4: [], Sel5: [], Sel6: [] },
            _onDialog: "",
            _onClose: "",
            _MedDate: null,
            _FirstTime: "X",
            _NewGubun: "",
            _GubunBukrs: "",
            _vArr1: ["Mycharge", "NsuppAmt", "Zmedrl", "BaseAmt", "Zkiobd", "Zkibbm", "Zkijbd", "Zkijbm", "Znijcd", "Znijcm", "Zniiwd", "Zniiwm", "Znisdd", "Znisdm", "Znoctd", "Znoctm", "Znomrd", "Znomrm", "Znocud", "Znocum", "Znobcd", "Znobcm"],
            _vArr2: ["Ptamt", "Medsp", "Oiamt", "Znobcm", "Medpp", "Insnp", "Znobcd", "Medmp", "Inspp", "Zdbcrl", "Ziftrl", "Framt"],

            BusyDialog: new sap.m.BusyDialog().addStyleClass("centerAlign busyDialog"),

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow
                    },
                    this
                );
            },

            getSelector: function (vSig) {
                var oController = $.app.getController();
                var oSessionData = oController.getSessionModel().getData();
                var oHeadSelControl = $.app.byId(oController.PAGEID + "_HeadSel");

                oController._ListCondJSonModel.setData({ Data: oSessionData });
                oController._SessionData = oSessionData;

                oHeadSelControl.removeAllItems();
                oHeadSelControl.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"), // - ?????? -
                        key: ""
                    })
                );

                if (vSig === "A") {
                    oController._SelData.Sel1 = [];
                    oController._SelData.Sel5 = [];
                }

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/MedicalApplySet",
                    {
                        IConType: "0",
                        IBukrs: oController._Bukrs,
                        IPernr: oSessionData.Pernr,
                        ILangu: oSessionData.Langu,
                        IDatum: moment().hours(10).toDate(),
                        MedicalApplyExport: [],
                        MedicalApplyTableIn0: [],
                        MedicalApplyTableIn5: []
                    },
                    {
                        success: function (data) {
                            if (data && data.MedicalApplyTableIn0.results.length) {
                                data.MedicalApplyTableIn0.results.forEach(function (e) {
                                    oController._SelData.Sel1.push(e);
                                    oController._SelData.Sel5.push(e);
                                });
                            }
                            if (data && data.MedicalApplyTableIn5.results.length) {
                                data.MedicalApplyTableIn5.results.forEach(function (e) {
                                    oHeadSelControl.addItem(
                                        new sap.ui.core.Item({
                                            text: e.StatusText,
                                            key: e.Status
                                        })
                                    );
                                });
                                oHeadSelControl.setSelectedKey();
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                                else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            } else {
                                MessageBox.alert(oError.toString());
                            }
                        }
                    }
                );
            },

            onBeforeShow: function () {
                var oController = this;
                var oSessionData = oController.getSessionModel().getData();

                BusyIndicator.show(0);

                this._ListCondJSonModel.setData({ Data: oSessionData });
                oController._SessionData = oSessionData;
                oController._SelData = { Sel1: [], Sel2: [], Sel3: [], Sel4: [], Sel5: [], Sel6: [] };

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/MedicalBukrsImportSet",
                    {
                        Pernr: oSessionData.Pernr,
                        Datum: moment().hours(10).toDate(),
                        MedicalBukrsExport: []
                    },
                    {
                        success: function (data) {
                            if (data && data.MedicalBukrsExport.results) {
                                oController._Bukrs = data.MedicalBukrsExport.results[0].Bukrs;
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                                else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            } else {
                                MessageBox.alert(oError.toString());
                            }
                        }
                    }
                );

                $.app.byId(this.PAGEID + "_ApplyDate").setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));

                this.getSelector();
                this.onSearch();

                BusyIndicator.hide(0);
            },

            onAfterOpen3: function (vDatum) {
                vDatum.setValue();
            },

            onClose3: function () {
                var oController = $.app.getController();

                if (oController.oDialog3.isOpen()) {
                    oController.oDialog3.close();
                }
            },

            initTdata: function (Flag) {
                var oController = $.app.getController();
                var oSessionData = oController._SessionData;

                oController._tData = {
                    MedDate: null,
                    Inpdt: null,
                    Begda: moment().hours(9).toDate(),
                    Endda: moment().hours(9).toDate(),
                    HospType: "",
                    Kdsvh: "",
                    Pernr: oSessionData.Pernr,
                    Bukrs: Flag,
                    HospName: "",
                    Comid: "",
                    DiseName: "",
                    PatiName: "",
                    Remark: "",
                    Recno: "",
                    Zkiobd: "0",
                    Zkijbd: "0",
                    Znijcd: "0",
                    Zdsctm: "0",
                    Zniiwd: "0",
                    Znisdd: "0",
                    Znoctd: "0",
                    Znomrd: "0",
                    Znocud: "0",
                    Znobcd: "0",
                    Zkibbm: "0",
                    Zkijbm: "0",
                    Znijcm: "0",
                    Zniiwm: "0",
                    Znisdm: "0",
                    Znoctm: "0",
                    Znomrm: "0",
                    Znocum: "0",
                    Znobcm: "0",
                    Mycharge: "0",
                    Npayt: "0",
                    SuppAmt: "0",
                    Zmedrl: "0",
                    NsuppAmt: "0",
                    Zfvcrl: "0",
                    Ziftrl: "0",
                    Zdbcrl: "0",
                    Medsp: "0",
                    Oiamt: "0",
                    Ptamt: "0",
                    Medpp: "0",
                    Insnp: "0",
                    Medmp: "0",
                    Inspp: "0",
                    Pcamt: "0",
                    Status: "",
                    Gtz51: "",
                    Gtz51s: "",
                    StatusText: "",
                    Relation: "",
                    RelationTx: "",
                    Zfvcgb: "",
                    Ziftgb: "",
                    Chk1: false,
                    Chk2: false,
                    Zfvcum: "0",
                    Ziftum: "0",
                    BaseAmt: "0",
                    Framt: "0",
                    Close: oController._onClose
                };

                if (oController._tData.MedDate == null) {
                    oController._tData.MedDate = oController._MedDate;
                }
            },

            changeSel: function (vSig) {
                var oController = $.app.getController();
                var oDialogModel = $.app.byId(oController.PAGEID + "_Dialog").getModel();
                var oPro = oDialogModel.getProperty("/Pop1/0");
                var oSel = $.app.byId(oController.PAGEID + "_dSel1");
                var oChk1 = $.app.byId(oController.PAGEID + "_Chk1");
                var oChk2 = $.app.byId(oController.PAGEID + "_Chk2");

                oDialogModel.setProperty("/Pop1/0/RelationTx", oSel.getSelectedItem().getCustomData()[0].getValue("Data"));
                oPro.Relation = oSel.getSelectedItem().getCustomData()[1].getValue("Data");

                if (oPro.Status === "") {
                    if (oPro.HospType !== "05") {
                        if (oPro.Relation !== "01" && oPro.Relation !== "02") {
                            oDialogModel.setProperty("/Pop1/0/Chk1", false);
                            oDialogModel.setProperty("/Pop1/0/Chk2", false);
                            oChk1.setEditable(false);
                            oChk2.setEditable(false);
                        } else {
                            oChk1.setEditable(true);
                            oChk2.setEditable(true);
                        }
                    } else {
                        oDialogModel.setProperty("/Pop1/0/Chk1", false);
                        oDialogModel.setProperty("/Pop1/0/Chk2", false);
                        oChk1.setEditable(false);
                        oChk2.setEditable(false);
                    }
                } else {
                    oDialogModel.setProperty("/Pop1/0/Chk1", false);
                    oDialogModel.setProperty("/Pop1/0/Chk2", false);
                    oChk1.setEditable(false);
                    oChk2.setEditable(false);
                }

                if (vSig !== "R") {
                    oController.onChk1();
                    oController.onChk2();
                }
            },

            changeSel2: function (vSig) {
                var oController = $.app.getController();
                var oSel2 = $.app.byId(oController.PAGEID + "_dSel2");

                if (oSel2.getSelectedKey() === "05") {
                    $.app.byId(oController.PAGEID + "_Inp1").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp2").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp3").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp4").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp5").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp6").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp7").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp8").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp9").setEditable(true);

                    oController._DataModel.setProperty("/Pop1/0/Chk1", false);
                    oController._DataModel.setProperty("/Pop1/0/Chk2", false);
                } else {
                    $.app.byId(oController.PAGEID + "_Inp1").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp2").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp3").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp4").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp5").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp6").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp7").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp8").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp9").setValue("0").setEditable(false);
                }

                if (oController._onDialog !== "M") {
                    oController.eqFunc();
                }
                oController.changeSel(vSig);
            },

            initFile: function (vPage) {
                var oController = $.app.getController();
                var vContexts = $.app
                    .byId(oController.PAGEID + "_ATTACHBOX" + vPage)
                    .getModel()
                    .getProperty("/Data/0");

                if (!vContexts) return;

                $.app.byId(oController.PAGEID + "_CAF_Table" + vPage).removeSelections(true);
            },

            getBukrs: function (vDatum) {
                var oController = $.app.getController();
                var oSessionData = oController._SessionData;
                vDatum = Common.checkNull(vDatum) ? new Date() : moment(vDatum.getSource().getDateValue()).hours(10).toDate();

                oController._MedDate = vDatum;

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/MedicalBukrsImportSet",
                    {
                        Pernr: oSessionData.Pernr,
                        Datum: vDatum,
                        MedicalBukrsExport: []
                    },
                    {
                        success: function (data) {
                            if (data && data.MedicalBukrsExport.results) {
                                oController._Bukrs = data.MedicalBukrsExport.results[0].Bukrs;
                                oController.onDialog("N", oController._Bukrs);
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                                else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            } else {
                                MessageBox.alert(oError.toString());
                            }
                        }
                    }
                );
            },

            onDialog: function (New, Flag, vDatum) {
                var oController = $.app.getController();

                if(Common.checkNull(Flag)) Flag = oController.getSessionInfoByKey("Bukrs3");

                if(!Common.checkNull(vDatum)){
                    if(oController._GubunBukrs !== Flag && oController._NewGubun === "X" && oController._GubunBukrs === "A100") {
                        MessageBox.error(oController.getBundleText("MSG_47045"), { title: oController.getBundleText("LABEL_00149")});
                        return true;
                    }else if(oController._GubunBukrs !== Flag && oController._NewGubun === "X" && oController._GubunBukrs === "1000") {
                        MessageBox.error(oController.getBundleText("MSG_47046"), { title: oController.getBundleText("LABEL_00149")});
                        return true;
                    }
                    
                if (New == "N") {
                    oController.initTdata(Flag);

                    if(!Common.checkNull(vDatum)) oController._tData.MedDate = vDatum;

                    if(Flag === "A100") 
                        oController._DataModel.setData({
                            Pop1: [],
                            Pop2: [oController._tData] 
                        });
                    else
                        oController._DataModel.setData({
                            Pop1: [oController._tData],
                            Pop2: [] 
                        });
                }

                }

                oController._onDialog = New;

                BusyIndicator.show(0);

                setTimeout(function () {
                    if (Flag === "1000") {
                        sap.ui
                            .getCore()
                            .getEventBus()
                            .publish("nav", "to", {
                                id: [$.app.CONTEXT_PATH, "MedApplyDet"].join($.app.getDeviceSuffix()),
                                data: [oController._tData, oController._SelData, oController._onDialog, oController._SessionData, Flag, oController._NewGubun, oController._GubunBukrs]
                            });
                    } else if (Flag === "A100") {
                        sap.ui
                            .getCore()
                            .getEventBus()
                            .publish("nav", "to", {
                                id: [$.app.CONTEXT_PATH, "MedApplyDetA100"].join($.app.getDeviceSuffix()),
                                data: [oController._tData, oController._SelData, oController._onDialog, oController._SessionData, Flag, oController._NewGubun, oController._GubunBukrs]
                            });
                    }

                    BusyIndicator.hide();
                }, 10);
            },

            onSearch: function () {
                var oController = $.app.getController();
                oController.initTdata();

                var oSessionData = oController._SessionData;
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oCol = $.app.byId(oController.PAGEID + "_Column");
                var oSel = $.app.byId(oController.PAGEID + "_HeadSel");
                var vFirstDate = $.app.byId(oController.PAGEID + "_ApplyDate").getDateValue();
                var vSecondDate = $.app.byId(oController.PAGEID + "_ApplyDate").getSecondDateValue();
                var vData = {
                    IConType: "1",
                    IBukrs: oController._Bukrs,
                    IPernr: oSessionData.Pernr,
                    ILangu: oSessionData.Langu,
                    IMolga: oSessionData.Molga,
                    IBegda: moment(vFirstDate).hours(10).toDate(),
                    IEndda: moment(vSecondDate).hours(10).toDate(),
                    IStatus: oSel.getSelectedKey(),
                    IDatum: moment().hours(10).toDate(),
                    MedicalApplyExport: [],
                    MedicalApplyTableIn: [],
                    MedicalApplyTableIn0: [],
                    MedicalApplyTableIn3: [],
                    MedicalApplyTableIn4: [],
                    MedicalApplyTableIn5: [],
                    MedicalApplyTableInH: []
                };
                var aData = { oData: [] };
                var oJSON = new sap.ui.model.json.JSONModel();

                setTimeout(function () {
                    $.app.getModel("ZHR_BENEFIT_SRV").create("/MedicalApplySet", vData, {
                        success: function (data) {
                            if (data && data.MedicalApplyTableIn.results.length) {
                                aData.oData = data.MedicalApplyTableIn.results.map(function(o) {
                                    return $.extend(true, o, { Chkitem: false });
                                });
                            }
                            if (data && data.MedicalApplyExport.results.length) {
                                oController._onClose = data.MedicalApplyExport.results[0].Close;
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                                else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            } else {
                                MessageBox.alert(oError.toString());
                            }
                        }
                    });

                    oJSON.setData(aData);
                    oTable.setModel(oJSON);
                    oTable.bindItems("/oData", oCol);

                    oController.toggleApprovalAllBtn.call(oController);

                    if (oController._onClose === "X" && oController._FirstTime === "X") {
                        MessageBox.alert(oController.getBundleText("MSG_47040")); // ??????????????? ????????????.
                        oController._FirstTime = "";
                    }

                    if (oController._onClose === "X") {
                        $.app.byId(oController.PAGEID + "_NewBtn").setVisible(false);
                        $.app.byId(oController.PAGEID + "_NewIcon").setVisible(true);
                    } else {
                        $.app.byId(oController.PAGEID + "_NewBtn").setVisible(true);
                        $.app.byId(oController.PAGEID + "_NewIcon").setVisible(false);
                    }
                }, 10);
            },

            toggleApprovalAllBtn: function () {
                var oTable = $.app.byId(this.PAGEID + "_Table");

                if(oTable.getModel().getProperty("/oData").some(function(o) { return o.Status === "ZZ"; })) {
                    $.app.byId("requestallBtn").setEnabled(true);
                } else {
                    $.app.byId("requestallBtn").setEnabled(false);
                }
            },

            onSelectedRow: function (oEvent) {
                var oController = $.app.getController();
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var vPath = oEvent.getSource().getBindingContextPath();
                var oData = oTable.getModel().getProperty(vPath);

                oController._tData = $.extend(true, {}, oData);
                delete oController._tData.Chkitem;
                oController._tData.Close = oController._onClose;
                if (oController._Bukrs === "") {
                    oController._Bukrs = oData.Bukrs;
                }
                oController._GubunBukrs = oData.Bukrs;
                oController._NewGubun = "X";

                oController.onDialog("M", oController._GubunBukrs);
            },

            onCal: function (vSig) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
                var oController = oView.getController();
                var oSessionData = oController._SessionData;
                var vTmp = false;
                var oPro;
                var vData = {
                    IConType: "C",
                    IBukrs: vSig,
                    IPernr: oSessionData.Pernr,
                    ILangu: oSessionData.Langu,
                    IMolga: oSessionData.Molga,
                    MedicalApplyExport: [],
                    MedicalApplyTableIn: [],
                    MedicalApplyTableIn0: [],
                    MedicalApplyTableIn3: [],
                    MedicalApplyTableIn4: [],
                    MedicalApplyTableIn5: [],
                    MedicalApplyTableInH: []
                };

                if (vSig === "1000") {
                    if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() === "" || $.app.byId(oController.PAGEID + "_dSel2").getSelectedKey() === "") {
                        MessageBox.alert(oController.getBundleText("MSG_47034")); // ???????????? ???????????? ??? ??????????????? ??????????????? ????????????.
                        return;
                    }

                    oPro = $.app.getController()._DataModel.getProperty("/Pop1/0");

                    vData.MedicalApplyTableIn.push(oPro);

                    if (oPro.Begda !== "" && oPro.Begda !== null && oPro.Begda !== "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }

                    if (oPro.MedDate !== "" && oPro.MedDate !== null && oPro.MedDate !== "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
                    }

                    oController._vArr1.forEach(function (e) {
                        vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi, "");
                    });

                    vData.IMedDate = oPro.MedDate;
                    vData.MedicalApplyTableIn[0].Zfvcgb = vData.MedicalApplyTableIn[0].Chk1 ? "X" : "";
                    vData.MedicalApplyTableIn[0].Ziftgb = vData.MedicalApplyTableIn[0].Chk2 ? "X" : "";
                    vData.MedicalApplyTableIn[0].PatiName = $.app
                        .byId(oController.PAGEID + "_dSel1")
                        .getSelectedItem()
                        .getText();
                } else {
                    oPro = $.app.getController()._DataModel.getProperty("/Pop2/0");

                    vData.MedicalApplyTableIn.push(oPro);

                    if (oPro.Begda !== "" && oPro.Begda !== null && oPro.Begda !== "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }

                    if (oPro.Inpdt !== "" && oPro.Inpdt !== null && oPro.Inpdt !== "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Inpdt = moment(vData.MedicalApplyTableIn[0].Inpdt).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Inpdt = null;
                    }

                    if (oPro.MedDate !== "" && oPro.MedDate !== null && oPro.MedDate !== "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
                    }

                    oController._vArr2.forEach(function (e) {
                        vData.MedicalApplyTableIn[0][e] = String(vData.MedicalApplyTableIn[0][e]).replace(/,/gi, "");
                    });

                    vData.IMedDate = oPro.MedDate;
                }

                delete vData.MedicalApplyTableIn[0].Close;
                delete vData.MedicalApplyTableIn[0].Chk1;
                delete vData.MedicalApplyTableIn[0].Chk2;

                $.app.getModel("ZHR_BENEFIT_SRV").create("/MedicalApplySet", vData, {
                    success: function (data) {
                        if (data && data.MedicalApplyTableIn.results.length) {
                            if (vSig === "1000") {
                                var aData = { Pop1: [], Pop2: [] };
                                data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.Pop1.push(e);
                                });

                                $.app
                                    .byId(oController.PAGEID + "_Dialog")
                                    .getModel()
                                    .setData(aData);
                                $.app.byId(oController.PAGEID + "_Dialog").bindElement("/Pop1/0");

                                vTmp = true;
                                setTimeout(function () {
                                    oController.changeSel2("R");
                                }, 100);
                            } else {
                                var aData2 = { Pop1: [], Pop2: [] };
                                data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData2.Pop2.push(e);
                                });

                                $.app
                                    .byId(oController.PAGEID + "_Dialog2")
                                    .getModel()
                                    .setData(aData2);
                                $.app.byId(oController.PAGEID + "_Dialog2").bindElement("/Pop2/0");
                                vTmp = true;
                            }
                        }
                    },
                    error: function (oError) {
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            else MessageBox.alert(Err.error.innererror.errordetails[0].message);
                        } else {
                            MessageBox.alert(oError.toString());
                        }
                        vTmp = false;
                    }
                });

                if (vSig === "1000") {
                    oController._DataModel.setProperty("/Pop1/0/Close", oController._onClose);
                    oController._DataModel.setProperty("/Pop1/0/Chk1", vData.MedicalApplyTableIn[0].Zfvcgb === "X" ? true : false);
                    oController._DataModel.setProperty("/Pop1/0/Chk2", vData.MedicalApplyTableIn[0].Ziftgb === "X" ? true : false);

                    oPro = oController._DataModel.getProperty("/Pop1/0");
                    oController._vArr1.forEach(function (e) {
                        oPro[e] = parseInt(oPro[e]);
                        oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                    });
                } else {
                    oController._DataModel.setProperty("/Pop2/0/Close", oController._onClose);

                    oPro = oController._DataModel.getProperty("/Pop2/0");
                    oController._vArr2.forEach(function (e) {
                        oPro[e] = parseInt(oPro[e]);
                        oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                    });
                }

                return vTmp;
            },

            eqFunc: function () {
                var oController = $.app.getController();
                var oPro;

                if (oController._Bukrs === "1000") {
                    oPro = $.app.getController()._DataModel.getProperty("/Pop1/0");

                    oPro.Zkiobd = oPro.Zkibbm;
                    oPro.Zkijbd = oPro.Zkijbm;
                    oPro.Znijcd = oPro.Znijcm;
                    oPro.Zniiwd = Common.numberWithCommas(Math.round((parseInt(oPro.Zniiwm.replace(/\,/gi, "")) * 0.5).toFixed(1)));
                    oPro.Znisdd = oPro.Znisdm;
                    oPro.Znoctd = oPro.Znoctm;
                    oPro.Znomrd = oPro.Znomrm;
                    oPro.Znocud = oPro.Znocum;
                    oPro.Znobcd = Common.numberWithCommas(Math.round((parseInt(oPro.Znobcm.replace(/\,/gi, "")) * 0.5).toFixed(1)));
                    oPro.BaseAmt = Common.numberWithCommas(
                        parseInt(oPro.Zkiobd.replace(/\,/gi, "")) +
                            parseInt(oPro.Zkijbd.replace(/\,/gi, "")) +
                            parseInt(oPro.Znijcd.replace(/\,/gi, "")) +
                            parseInt(oPro.Zniiwd.replace(/\,/gi, "")) +
                            parseInt(oPro.Znisdd.replace(/\,/gi, "")) +
                            parseInt(oPro.Znoctd.replace(/\,/gi, "")) +
                            parseInt(oPro.Znocud.replace(/\,/gi, "")) +
                            parseInt(oPro.Znobcd.replace(/\,/gi, "")) +
                            parseInt(oPro.Znomrd.replace(/\,/gi, "")) -
                            parseInt(oPro.Zdsctm.replace(/\,/gi, ""))
                    );

                    if (parseFloat(oPro.BaseAmt.replace(/\,/gi, "")) < 0) {
                        oPro.BaseAmt = "0";
                    }
                    oPro.NsuppAmt = Common.numberWithCommas(parseInt(oPro.BaseAmt.replace(/\,/gi, "")) - parseInt(oPro.SuppAmt.replace(/\,/gi, "")));
                    oPro.Mycharge = Common.numberWithCommas(
                        parseInt(oPro.Zkibbm.replace(/\,/gi, "")) +
                            parseInt(oPro.Zkijbm.replace(/\,/gi, "")) +
                            parseInt(oPro.Znijcm.replace(/\,/gi, "")) +
                            parseInt(oPro.Zniiwm.replace(/\,/gi, "")) +
                            parseInt(oPro.Znisdm.replace(/\,/gi, "")) +
                            parseInt(oPro.Znoctm.replace(/\,/gi, "")) +
                            parseInt(oPro.Znomrm.replace(/\,/gi, "")) +
                            parseInt(oPro.Znocum.replace(/\,/gi, "")) +
                            parseInt(oPro.Znobcm.replace(/\,/gi, ""))
                    );
                } else {
                    oPro = $.app.getController()._DataModel.getProperty("/Pop2/0");

                    oPro.Znobcd = Common.numberWithCommas(Math.round((parseInt(oPro.Znobcm.replace(/\,/gi, "")) * 0.5).toFixed(1)));
                    if ($.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() !== "C" && $.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() !== "D") {
                        oPro.Medmp = Common.numberWithCommas(parseInt((parseInt(oPro.Medsp.replace(/\,/gi, "")) * 0.1 + parseInt(oPro.Medpp.replace(/\,/gi, "")) * 0.2).toFixed(1)));
                    } else {
                        oPro.Medmp = "0";
                    }

                    if (oPro.Gtz51 === "D") {
                        if (parseInt(oPro.Ziftrl.replace(/\,/gi, "")) < parseInt(oPro.Medpp.replace(/\,/gi, ""))) {
                            oPro.Framt = oPro.Ziftrl;
                        } else {
                            oPro.Framt = oPro.Medpp;
                        }
                    } else if (oPro.Gtz51 === "C") {
                        if (parseInt(oPro.Zdbcrl.replace(/\,/gi, "")) < parseInt(oPro.Medsp.replace(/\,/gi, "")) + parseInt(oPro.Znobcd.replace(/\,/gi, ""))) {
                            oPro.Framt = oPro.Zdbcrl;
                        } else {
                            oPro.Framt = Common.numberWithCommas(parseInt(oPro.Medsp.replace(/\,/gi, "")) + parseInt(oPro.Znobcd.replace(/\,/gi, "")));
                        }
                    } else {
                        oPro.Framt = parseInt(oPro.Ptamt.replace(/\,/gi, "")) - parseInt(oPro.Inspp.replace(/\,/gi, "")) - parseInt(oPro.Medmp.replace(/\,/gi, "")) - parseInt(oPro.Insnp.replace(/\,/gi, "")) - parseInt(oPro.Oiamt.replace(/\,/gi, ""));

                        if (parseFloat(oPro.Framt) < 0) {
                            oController._DataModel.setProperty("/Pop2/0/Framt", "0");
                        } else {
                            oPro.Framt = Common.numberWithCommas(parseInt(oPro.Framt));
                        }
                    }
                }
            },

            onApprovalAll: function() {
                var oTable = $.app.byId(this.PAGEID + "_Table"),
                selectedRows = oTable.getModel().getProperty("/oData").filter(function (o) {
                    return o.Chkitem;
                });

                if (!selectedRows.length) {
                    MessageBox.alert(this.getBundleText("MSG_00066")); // ?????? ????????? ???????????????.
                    return;
                }

                var initData = {
                    List: selectedRows
                };
                var callback = function () {
                    MessageBox.success(this.getBundleText("MSG_00061"), {   // ?????????????????????.
                        title: this.getBundleText("LABEL_00150"),
                        onClose: function () {
                            this.onSearch();
                            this.getAllRequestFileHandler().getDialog().close();
                        }.bind(this)
                    });
                }.bind(this);

                this.AllRequestFileHandler = AllRequestFileHandler.get(this, initData, callback);
                DialogHandler.open(this.AllRequestFileHandler);
            },

            getAllRequestFileHandler: function() {
                return this.AllRequestFileHandler;
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "991004" });
                  }
                : null
        });
    }
);
