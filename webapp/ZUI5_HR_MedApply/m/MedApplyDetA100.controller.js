/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "fragment/COMMON_ATTACH_FILES",
        "sap/m/InputBase",
        "sap/ui/core/BusyIndicator",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModelHelper, COMMON_ATTACH_FILES, InputBase, BusyIndicator, MessageBox) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDetA100"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "MedApplyDetA100",
            BusyDialog: new sap.m.BusyDialog().addStyleClass("centerAlign"),
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
            _vArr1: ["Zdbcrl", "Zdsctm", "Ziftrl", "Zfvcrl", "Mycharge", "SuppAmt", "Zmedrl", "NsuppAmt", "BaseAmt", "Zkiobd", "Zkibbm", "Zkijbd", "Zkijbm", "Znijcd", "Znijcm", "Zniiwd", "Zniiwm", "Znisdd", "Znisdm", "Znoctd", "Znoctm", "Znomrd", "Znomrm", "Znocud", "Znocum", "Znobcd", "Znobcm"],
            _vArr2: ["Ptamt", "Medsp", "Oiamt", "Znobcm", "Medpp", "Insnp", "Znobcd", "Medmp", "Inspp", "Zdbcrl", "Ziftrl", "Framt"],

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            onBeforeShow: function (oEvent) {
				var oController = this;
				var oSessionData = oController.getSessionModel().getData();

                this._ListCondJSonModel.setData({ Data: oSessionData });
                oController._SessionData = oSessionData;
                oController._SelData = { Sel1: [], Sel2: [], Sel3: [], Sel4: [], Sel5: [], Sel6: [] };
				
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vData = {
                    IConType: "0",
                    IBukrs: oSessionData.Bukrs2,
                    IPernr: oSessionData.Pernr,
                    ILangu: oSessionData.Langu,
                    IDatum: "/Date(" + new Date().getTime() + ")/",
                    MedicalApplyExport: [],
                    MedicalApplyTableIn: [],
                    MedicalApplyTableIn0: [],
                    MedicalApplyTableIn3: [],
                    MedicalApplyTableIn4: [],
                    MedicalApplyTableIn5: [],
                    MedicalApplyTableInH: []
                };

                oModel.create("/MedicalApplySet", vData, {
                    success: function (data) {
                        if (data && data.MedicalApplyTableIn0.results.length) {
                            data.MedicalApplyTableIn0.results.forEach(function (e) {
                                oController._SelData.Sel1.push(e);
                                oController._SelData.Sel5.push(e);
                            });
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

                this._tData = oEvent.data[0];
                this._onDialog = oEvent.data[2];
                this._SessionData = oEvent.data[3];
                this._Bukrs = oEvent.data[4];
                this.onAfterOpen2();
            },

            navBack: function () {
                BusyIndicator.show(0);
                setTimeout(function () {
                    sap.ui.getCore().getEventBus()
                        .publish("nav", "to", {
                            id: [$.app.CONTEXT_PATH, "MedApply"].join($.app.getDeviceSuffix())
                        });
                }, 1);
            },

            onAfterShow: function () {
                this.onAfterLoad2();
            },

            onAfterOpen2: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oPro;

                if (oController._tData.MedDate === null) {
                    oController._tData.MedDate = new Date();
                }

                oController._DataModel.setData({ Pop1: [], Pop2: [oController._tData] });
                oPro = oController._DataModel.getProperty("/Pop2/0");

                oController._vArr2.forEach(function (e) {
                    oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                });

                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").setModel(oController._DataModel);
                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").bindElement("/Pop2/0");

                if (oController._onDialog == "M") {
                    oController.getSelData2("B");
                    $.app.byId(oController.PAGEID + "_dSel5").setSelectedKey(oController._DataModel.getProperty("/Pop2")[0].Relation);
                    oController.onChange5("B");
                    $.app.byId(oController.PAGEID + "_dSel6").setSelectedKey(oController._DataModel.getProperty("/Pop2")[0].PatiName);
                    $.app.byId(oController.PAGEID + "_dSel3").setSelectedKey(oController._DataModel.getProperty("/Pop2")[0].Gtz51);
                    $.app.byId(oController.PAGEID + "_dSel4").setSelectedKey(oController._DataModel.getProperty("/Pop2")[0].Gtz51s);
                } else {
                    oController.getSelData2();
                }

                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").bindElement("/Pop2/0");
            },

            onAfterLoad2: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var vAppnm = "";
				var vEdit = true;
				var oPro = oController._DataModel.getProperty("/Pop2/0");
				
				if(oController._onDialog == "M") {
					vAppnm = oPro.Appnm;
				}
				
				vEdit = ((oPro.vStatus === "AA" || oPro.vStatus === "88" || Common.checkNull(oPro.vStatus)) && oController._onClose !== "X") ? true : false;
				
				setTimeout(function () {
                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: vAppnm,
                            Required: true,
                            Mode: "M",
                            Max: "15",
                            ReadAsync: true,
                            Editable: vEdit
                        },
                        "008"
                    );
                }, 100);
            },

            getBukrs: function (vDatum) {
                var oController = this.getView().getController();
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
                                if(data.MedicalBukrsExport.results[0].Bukrs !== oController._Bukrs) 
                                    $.app.getController().onDialog("N", data.MedicalBukrsExport.results[0].Bukrs, vDatum);
                                else
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
            },

            initTdata: function (Flag) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
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
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
				var oSel = $.app.byId(oController.PAGEID + "_dSel1");
				var oMatrixModel = $.app.byId(oController.PAGEID + "_Mat").getModel();
                var oPro = oMatrixModel.getProperty("/Pop1/0");
				
				oMatrixModel.setProperty("/Pop1/0/RelationTx", oSel.getSelectedItem().getCustomData()[0].getValue("Data"));
                oPro.Relation = oSel.getSelectedItem().getCustomData()[1].getValue("Data");
				
				if (oPro.Status == "") {
                    if (oPro.HospType != "05") {
                        if (oPro.Relation != "01" && oPro.Relation != "02") {
                            oMatrixModel.setProperty("/Pop1/0/Chk1", false);
                            oMatrixModel.setProperty("/Pop1/0/Chk2", false);
                            $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                            $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
                        } else {
                            $.app.byId(oController.PAGEID + "_Chk1").setEditable(true);
                            $.app.byId(oController.PAGEID + "_Chk2").setEditable(true);
                        }
                    } else {
                        oMatrixModel.setProperty("/Pop1/0/Chk1", false);
                        oMatrixModel.setProperty("/Pop1/0/Chk2", false);
                        $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                        $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
                    }
                } else {
                    oMatrixModel.setProperty("/Pop1/0/Chk1", false);
                    oMatrixModel.setProperty("/Pop1/0/Chk2", false);
                    $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
				}
				
                if (vSig != "R") {
                    oController.onChk1();
                    oController.onChk2();
                }
            },

            changeSel2: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oSel2 = $.app.byId(oController.PAGEID + "_dSel2");
				
				if (oSel2.getSelectedKey() == "05") {
                    $.app.byId(oController.PAGEID + "_Inp1").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp2").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp3").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp3").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp4").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp4").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp5").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp5").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp6").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp6").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp7").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp7").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp8").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp8").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp9").setEditable(true);

                    oController._DataModel.getProperty("/Pop1")[0].Chk1 = false;
                    oController._DataModel.getProperty("/Pop1")[0].Chk2 = false;
                } else {
                    $.app.byId(oController.PAGEID + "_Inp1").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp2").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp3").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp4").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp5").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp6").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp7").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp8").setEditable(true);
                    $.app.byId(oController.PAGEID + "_Inp9").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp9").setValue("0");
				}
				
				if(oController._onDialog != "M") {
					oController.eqFunc();
				}
                oController.changeSel(vSig);
            },

            initFile: function (vPage) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX" + vPage),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table" + vPage),
                    oJSonModel = oAttachbox.getModel(),
                    vPath = "/Data/0",
                    vContexts = oJSonModel.getProperty(vPath);

                if (!vContexts) return;

                oTable.removeSelections(true);
            },

            onChk1: function () {
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
				var oPro = oController._DataModel.getProperty("/Pop1/0");
                var vAppnm = "";
					
				if(oController._onDialog == "M") {
					vAppnm = $.app.byId(oController.PAGEID + "_Mat").getModel().getProperty("/Pop1/0/Appnm");
				}
					
                if (oPro.Chk1) {
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
                        Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: true,
                        UseMultiCategories: true
					}, "001");
					
                    oPro.Chk2 = false;
					
					COMMON_ATTACH_FILES.availLine.call(oController, "001");
                    oController.onChk2();
                } else {
                    oController.initFile("001");

                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: "",
                            Mode: "S",
                            Cntnm: "001",
                            Max: "1",
                            Label: "",
                            Editable: false,
                            UseMultiCategories: true
                        },
                        "001"
                    );
                }
            },

            onChk2: function () {
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
				var oPro = oController._DataModel.getProperty("/Pop1/0");
                var vAppnm = "";
					
				if(oController._onDialog == "M") {
					vAppnm = $.app.byId(oController.PAGEID + "_Mat").getModel().getProperty("/Pop1/0/Appnm");
				}
				
                if (oPro.Chk2) {
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
                        Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: true,
                        UseMultiCategories: true
					}, "002");
					
                    oPro.Chk1 = false;
                    COMMON_ATTACH_FILES.availLine.call(oController, "002");
                    oController.onChk1();
                } else {
                    oController.initFile("002");

                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: "",
                            Mode: "S",
                            Cntnm: "001",
                            Max: "1",
                            Label: "",
                            Editable: false,
                            UseMultiCategories: true
                        },
                        "002"
                    );
                }
            },

            getSelData2: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
				var oSessionData = oController._SessionData;
				var oSel3 = $.app.byId(oController.PAGEID + "_dSel3");
				var oSel4 = $.app.byId(oController.PAGEID + "_dSel4");
				var oSel5 = $.app.byId(oController.PAGEID + "_dSel5");
				var oSel6 = $.app.byId(oController.PAGEID + "_dSel6");
                var vData = {
					ICodeT: "001",
					ICodty: "GTZ51",
					IBukrs: oController._Bukrs,
					IPernr: oSessionData.Pernr,
					ILangu: "3",
					NavCommonCodeList: []
				};
				
				if (oController._SelData.Sel3.length == 0) {
                    $.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", vData, {
                        success: function (data) {
                            if (data && data.NavCommonCodeList.results.length) {
                                data.NavCommonCodeList.results.forEach(function (e) {
                                    oController._SelData.Sel3.push(e);
                                });
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
				}
				
                oSel3.removeAllItems();
                oSel3.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
                );
                oController._SelData.Sel3.forEach(function (e) {
                    oSel3.addItem(
                        new sap.ui.core.Item({
                            text: e.Text,
                            key: e.Code
                        })
                    );
				});
				
                oSel4.removeAllItems();
                oSel4.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
                );
				
                oSel5.removeAllItems();
                oSel5.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    }).addCustomData(
                        new sap.ui.core.CustomData({
                            key: "Data",
                            value: ""
                        })
                    )
                );
				
				var oA1 = [], oA2 = [];
				
				oController._SelData.Sel5.forEach(function (e) {
                    oA1.push(e);
                });
				
				for (var i = 0; i < oA1.length; i++) {
                    if (i != 0) {
                        if (oA1[i].Relation != oA1[i - 1].Relation) {
                            oA2.push(oA1[i]);
                        }
                    } else {
                        oA2.push(oA1[i]);
                    }
                }
				
				oA2.forEach(function (e) {
                    oSel5.addItem(
                        new sap.ui.core.Item({
                            text: e.RelationTxt,
                            key: e.Relation
                        }).addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Data",
                                value: e
                            })
                        )
                    );
                });
                
                oSel6.removeAllItems();
                oSel6.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
				if(vSig != "B") {
					oSel3.setSelectedKey();
					oSel4.setSelectedKey();
					oSel5.setSelectedKey();
					oSel6.setSelectedKey();
				}
            },

            onChange3: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oSel3 = $.app.byId(oController.PAGEID + "_dSel3");
                var oSel4 = $.app.byId(oController.PAGEID + "_dSel4");
                var oSessionData = oController._SessionData;
                var vData = {
					ICodeT: "002",
					ICodty: "GTZ51",
					IBukrs: oController._Bukrs,
					IPernr: oSessionData.Pernr,
					ICode: oSel3.getSelectedKey(),
					ILangu: "3",
					NavCommonCodeList: []
				};
				
				oController._SelData.Sel4 = [];
				
				$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", vData, {
                    success: function (data) {
						if (data && data.NavCommonCodeList.results.length) {
							data.NavCommonCodeList.results.forEach(function (e) {
								oController._SelData.Sel4.push(e);
							});
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
				
                oSel4.removeAllItems();
                oSel4.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
                oController._SelData.Sel4.forEach(function (e) {
                    oSel4.addItem(
                        new sap.ui.core.Item({
                            text: e.Text,
                            key: e.Code
                        })
                    );
				});
				
				var oPro = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getModel().getProperty("/Pop2/0");
				
				if (oSel3.getSelectedKey() == "A") {
                    oPro.Inspp = "250,000";
                } else if (oSel3.getSelectedKey() == "B") {
                    oPro.Inspp = "50,000";
                } else {
                    oPro.Inspp = "0";
				}
				
                if (oSel3.getSelectedKey() == "C" || oSel3.getSelectedKey() == "D") {
                    oPro.Inpdt = null;
				}

                if(typeof (vSig) === "object") {
                    if(vSig.getSource().getId() === "MedApplyDetA100_dSel3")
                        oController._DataModel.setProperty("/Pop2/0/Gtz51", vSig.getSource().getSelectedKey());
                }
				
                if (vSig != "B") {
                    oPro.Ptamt = "0";
                    oPro.Medsp = "0";
                    oPro.Oiamt = "0";
                    oPro.Znobcm = "0";
                    oPro.Insnp = "0";
					oPro.Medpp = "0";
					
					oSel4.setSelectedKey();
				}
                
                oController.onCal(oController._Bukrs);
				
                if (oController._onDialog != "M") {
                    oController.eqFunc();
                }
            },

            onChange5: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oSel3 = $.app.byId(oController.PAGEID + "_dSel3");
                var oSel5 = $.app.byId(oController.PAGEID + "_dSel5");
                var oSel6 = $.app.byId(oController.PAGEID + "_dSel6");
                var sData5 = oController._SelData.Sel5;
                var sData6 = [];

                for (var i = 0; i < sData5.length; i++) {
                    if (oSel5.getSelectedKey() == sData5[i].Relation) {
                        sData6.push(sData5[i]);
                    }
				}
				
                oSel6.removeAllItems();
                oSel6.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
                sData6.forEach(function (e) {
                    oSel6.addItem(
                        new sap.ui.core.Item({
                            text: e.Fname,
                            key: e.Fname
                        })
                    );
				});
				
                oSel3.removeAllItems();
                oSel3.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
                if (oSel5.getSelectedKey() == "20" || oSel5.getSelectedKey() == "21") {
                    oController._SelData.Sel3.forEach(function (e) {
                        if (e.Code == "C") {
                            oSel3.addItem(
                                new sap.ui.core.Item({
                                    text: e.Text,
                                    key: e.Code
                                })
                            );
                        }
                    });
                } else {
                    oController._SelData.Sel3.forEach(function (e) {
                        oSel3.addItem(
                            new sap.ui.core.Item({
                                text: e.Text,
                                key: e.Code
                            })
                        );
                    });
				}
				
				if(vSig != "B") {
					oSel6.setSelectedKey();
					oSel3.setSelectedKey();
				}
				
				oController.onChange3(vSig);
            },

            onValid: function (oController) {
                var oMsg = "";
                var oPro;

                if (oController._Bukrs == "1000") {
                    oPro = $.app.byId(oController.PAGEID + "_Mat").getModel().getProperty("/Pop1/0");
					
					if (oPro.MedDate == "" || oPro.MedDate == null) {
                        oMsg = oController.getBundleText("MSG_47011");
                    }
                    if (oPro.Relation == "") {
                        oMsg = oController.getBundleText("MSG_47017");
                    }
                    if (oPro.HospType.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47019");
                    }
                    if (oPro.HospName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47012");
                    }
					if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == ""
						|| $.app.byId(oController.PAGEID + "_dSel2").getSelectedKey() == ""
						|| $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController()._DataModel.getProperty("/Pop1")[0].DiseName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47034");
                    }

                    if (oPro.Zkibbm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oController.getBundleText("MSG_47021");
                    }
                    if (oPro.Zkijbm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oController.getBundleText("MSG_47021");
                    }
                    if (oPro.Znoctm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oController.getBundleText("MSG_47021");
                    }
                    if (oPro.Znocum.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oController.getBundleText("MSG_47021");
                    }
                    if (oPro.Znobcm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oController.getBundleText("MSG_47021");
                    }

                    if (oPro.Chk1 && COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
                        oMsg = oController.getBundleText("MSG_47031");
                    }
                    if (oPro.Chk2 && COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
                        oMsg = oController.getBundleText("MSG_47032");
                    }
                    if (oPro.DiseName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47035");
                    }
                } else {
					oPro = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getModel().getProperty("/Pop2/0");
					
                    if (oPro.MedDate == "" || oPro.MedDate == null) {
                        oMsg = oController.getBundleText("MSG_47011");
                    }
                    if (oPro.Relation == "") {
                        oMsg = oController.getBundleText("MSG_47017");
                    }
                    if (oPro.Gtz51.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47026");
                    }
                    if (oPro.Gtz51s.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47037");
                    }
                    if (oPro.PatiName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47018");
                    }
                    if (oPro.Gtz51 != "C" && oPro.Gtz51 != "D") {
                        if (oPro.Inpdt == "" || oPro.Inpdt == null) {
                            oMsg = oController.getBundleText("MSG_47015");
                        }
                    }
                    if (oPro.HospName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47012");
                    }
                    if (oPro.Recno.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47016");
                    }
                    if (oPro.DiseName.trim() == "") {
                        oMsg = oController.getBundleText("MSG_47027");
                    }
                    if (oPro.Inpdt != null && oPro.Inpdt != "") {
                        if (new Date(oPro.MedDate.getFullYear(), oPro.MedDate.getMonth(), oPro.MedDate.getDate(), 9, 0, 0).getTime() > new Date(oPro.Inpdt.getFullYear(), oPro.Inpdt.getMonth(), oPro.Inpdt.getDate(), 9, 0, 0).getTime()) {
                            oMsg = oController.getBundleText("MSG_47041");
                        }
                    }
                    if (oPro.Gtz51 != "C" && oPro.Gtz51 != "D") {
                        if (oPro.Ptamt.trim() == "0") {
                            oMsg = oController.getBundleText("MSG_47028");
                        }
                        if (oPro.Medsp.trim() == "0") {
                            oMsg = oController.getBundleText("MSG_47029");
                        }
                    }
                    if (oPro.Framt.trim() == "0") {
                        oMsg = oController.getBundleText("MSG_47036");
                    }
                    if (COMMON_ATTACH_FILES.getFileLength(oController, "008") === 0) {
                        oMsg = oController.getBundleText("MSG_47030");
                    }

                    if(Common.checkNull(!oPro.Ptamt)) oPro.Ptamt = oPro.Ptamt.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Medsp)) oPro.Medsp = oPro.Medsp.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Oiamt)) oPro.Oiamt = oPro.Oiamt.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znobcm)) oPro.Znobcm =  oPro.Znobcm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Medpp)) oPro.Medpp = oPro.Medpp.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Insnp)) oPro.Insnp = oPro.Insnp.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znobcd)) oPro.Znobcd = oPro.Znobcd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Medmp)) oPro.Medmp = oPro.Medmp.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Inspp)) oPro.Inspp = oPro.Inspp.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zdbcrl)) oPro.Zdbcrl = oPro.Zdbcrl.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Ziftrl)) oPro.Ziftrl = oPro.Ziftrl.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Framt)) oPro.Framt = oPro.Framt.replace(/\,/gi, "");
                }
				
				if (oMsg != "") {
                    MessageBox.alert(oMsg);
                    return false;
                }
				
				return true;
            },

            onCal: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
                var oPro;
                var vTmp = false;
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
				
				if (vSig == "1000") {
					if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == ""
						|| $.app.byId(oController.PAGEID + "_dSel2").getSelectedKey() == "") {
                        MessageBox.alert(oController.getBundleText("MSG_47034"));
                        return;
                    }
					
					oPro = oController._DataModel.getProperty("/Pop1")[0];
                    vData.MedicalApplyTableIn.push(oPro);
					
					if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }
					
					if (oPro.MedDate != "" && oPro.MedDate != null && oPro.MedDate != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
                    }
					
					oController._vArr1.forEach(function (e) {
                        vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/\,/gi, "");
                    });
					
					vData.MedicalApplyTableIn[0].Zfvcgb = (vData.MedicalApplyTableIn[0].Chk1) ? "X" : "";
					vData.MedicalApplyTableIn[0].Ziftgb = (vData.MedicalApplyTableIn[0].Chk2) ? "X" : "";
                    vData.MedicalApplyTableIn[0].PatiName = $.app.byId(oController.PAGEID + "_dSel1").getSelectedItem().getText();
                } else {
                    oPro = oController._DataModel.getProperty("/Pop2")[0];
                    vData.MedicalApplyTableIn.push(oPro);
					
					if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }
					
					if (oPro.Inpdt != "" && oPro.Inpdt != null && oPro.Inpdt != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Inpdt = moment(vData.MedicalApplyTableIn[0].Inpdt).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Inpdt = null;
                    }
					
					if (oPro.MedDate != "" && oPro.MedDate != null && oPro.MedDate != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(9).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
                    }
					
					oController._vArr2.forEach(function (e) {
                        vData.MedicalApplyTableIn[0][e] = String(vData.MedicalApplyTableIn[0][e]).replace(/\,/gi, "");
                    });
                }
				
				delete vData.MedicalApplyTableIn[0].Close;
                delete vData.MedicalApplyTableIn[0].Chk1;
                delete vData.MedicalApplyTableIn[0].Chk2;
				
				if(vSig == "1000") {
					vData.IMedDate = oController._DataModel.getProperty("/Pop1")[0].MedDate;
				} else {
					vData.IMedDate = oController._DataModel.getProperty("/Pop2")[0].MedDate;
				}
				
				oModel.create("/MedicalApplySet", vData, {
                    success: function (data) {
                        if (data && data.MedicalApplyTableIn.results.length) {
                            var oJSON, aData;

                            if (vSig == "1000") {
                                oJSON = $.app.byId(oController.PAGEID + "_Mat").getModel();
                                aData = { Pop1: [], Pop2: [] };
								
								data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.Pop1.push(e);
                                });
								
								oJSON.setData(aData);
                                $.app.byId(oController.PAGEID + "_Mat").bindElement("/Pop1/0");
                                vTmp = true;
								
								setTimeout(function () {
                                    oController.changeSel2("R");
                                }, 100);
                            } else {
                                oJSON = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getModel();
                                aData = { Pop1: [], Pop2: [] };
								
								data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.Pop2.push(e);
                                });
								
								oJSON.setData(aData);
                                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").bindElement("/Pop2/0");
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

				if (vSig == "1000") {
					oController._DataModel.setProperty("/Pop1/0/Close", oController._onClose);
					oController._DataModel.setProperty("/Pop1/0/Chk1", vData.MedicalApplyTableIn[0].Zfvcgb == "X" ? true : false);
					oController._DataModel.setProperty("/Pop1/0/Chk2", vData.MedicalApplyTableIn[0].Ziftgb == "X" ? true : false);
					
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

            onSaveProcess: function (oController, vSig) {
                var oCal = oController.onCal(vSig);
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
				var oPro;
				var uFiles = [];

                if (oCal) {
                    var vData = {
						IConType: "",
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
					
					if(oController._onDialog == "M") {
						vData.IConType = "2";
					} else {
						vData.IConType = "3";
					}
					
					if (vSig == "1000") {
						vData.IMedDate = oController._DataModel.getProperty("/Pop1")[0].MedDate;

						oPro = oController._DataModel.getProperty("/Pop1")[0];
						vData.MedicalApplyTableIn.push(oPro);
						
                        if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                            vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                        } else {
                            vData.MedicalApplyTableIn[0].Begda = null;
						}
						
                        oController._vArr1.forEach(function (e) {
                            vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/\,/gi, "");
						});
						
						vData.MedicalApplyTableIn[0].Zfvcgb = (vData.MedicalApplyTableIn[0].Chk1) ? "X" : "";
						vData.MedicalApplyTableIn[0].Ziftgb = (vData.MedicalApplyTableIn[0].Chk2) ? "X" : "";
						
						oPro = oController._DataModel.getProperty("/Pop1/0");
						
                        if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                            vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                        } else {
                            vData.MedicalApplyTableIn[0].Begda = null;
						}
						
                        if (oPro.Inpdt != "" && oPro.Inpdt != null && oPro.Inpdt != "Invalid Date") {
                            vData.MedicalApplyTableIn[0].Inpdt = moment(vData.MedicalApplyTableIn[0].Inpdt).hours(9).toDate();
                            vData.MedicalApplyTableIn[0].Inpdt = new Date(vData.MedicalApplyTableIn[0].Inpdt + "T09:00:00");
                        } else {
                            vData.MedicalApplyTableIn[0].Inpdt = null;
                        }
						
						for (var i = 1; i <= 2; i++) {
							if(COMMON_ATTACH_FILES.getFileLength(oController, "00" + i) != 0) {
								uFiles.push("00" + i);
							}
						}
						
						if(COMMON_ATTACH_FILES.getFileLength(oController, "009") != 0) {
							uFiles.push("009");
						}
						
						vData.MedicalApplyTableIn[0].Appnm = COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
                        vData.MedicalApplyTableIn[0].PatiName = $.app.byId(oController.PAGEID + "_dSel1").getSelectedItem().getText();
                    } else {
						vData.IMedDate = oController._DataModel.getProperty("/Pop2")[0].MedDate;

						vData.MedicalApplyTableIn.push(oController._DataModel.getProperty("/Pop2")[0]);
                        oController._vArr2.forEach(function (e) {
                            vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/\,/gi, "");
						});
						
                        vData.MedicalApplyTableIn[0].Appnm = COMMON_ATTACH_FILES.uploadFile.call(oController, "008");
                    }
					
					delete vData.MedicalApplyTableIn[0].Close;
                    delete vData.MedicalApplyTableIn[0].Chk1;
                    delete vData.MedicalApplyTableIn[0].Chk2;

                    vData.MedicalApplyTableIn[0].Waers = "KRW";

                    oModel.create("/MedicalApplySet", vData, {
                        success: function (data) {
                            if (data && data.MedicalApplyTableIn.results.length) {
                                MessageBox.alert(oController.getBundleText("MSG_44002"), {
                                    title: oController.getBundleText("LABEL_35023"),
                                    onClose: function () {
                                        oController._DataModel.setData({ Pop1: [], Pop2: [{
                                            MedDate : oPro.MedDate,
                                            PatiName : oPro.PatiName,
                                            RelationTx : oPro.RelationTx,
                                            Relation : oPro.Relation,
                                            HospType : oPro.HospType,
                                            HospName : oPro.HospName,
                                            Gtz51s : oPro.Gtz51s,
                                            Gtz51 : oPro.Gtz51,
                                            Inpdt : oPro.Inpdt,
                                            Recno : oPro.Recno,
                                            Comid : oPro.Comid,
                                            DiseName : oPro.DiseName,
                                            Remark : oPro.Remark,
                                            Pdcnt : oPro.Pdcnt,
                                            Begda : oPro.Begda,
                                            Pernr: oController._vPernr,
                                            Bukrs: vSig,
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
                                            Chk1: false,
                                            Chk2: false,
                                            Zfvcum: "0",
                                            Ziftum: "0",
                                            BaseAmt: "0",
                                            Framt: "0",
                                            Appnm: "",
                                            Status: ""
                                        }]
                                    });
                                    oController.onAfterLoad2();
                                    }
                                });
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

                    if (vSig == "1000") {
						oController._DataModel.setProperty("/Pop1/0/Chk1", vData.MedicalApplyTableIn[0].Zfvcgb == "X" ? true : false);
						oController._DataModel.setProperty("/Pop1/0/Chk2", vData.MedicalApplyTableIn[0].Ziftgb == "X" ? true : false);
						
						oPro = oController._DataModel.getProperty("/Pop1/0");
						oController._vArr1.forEach(function (e) {
                            oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                        });
                    } else {
						oPro = oController._DataModel.getProperty("/Pop2/0");
                        oController._vArr2.forEach(function (e) {
                            oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                        });
                    }
                }
            },

            onSave: function (Sig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
				var oValid = oController.onValid(oController);
				
                if (oValid) {
					var oMsg = oController.getBundleText("MSG_44001");
					
                    MessageBox.show(oMsg, {
                        icon: MessageBox.Icon.INFORMATION,
                        title: oController.getBundleText("LABEL_35023"),
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (fVal) {
                            if (fVal == "YES") {
                                oController.onSaveProcess(oController, Sig);
                            }
                        }
                    });
                }
            },

            onDialogSaveBtn: function() {
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController._DataModel.getProperty("/Pop2/0");
                var oSessionData = oController._SessionData;

                if(oController.onValid(oController) === false) return;
                
                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_70047")) { //저장
                        var sendObject = {};
                        
                        // 첨부파일 저장
                        oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, ["008"]);
                        oSendData.Waers = "KRW";

                        if(oSendData.Zmedrl === oController.getBundleText("MSG_47044")) oSendData.Zmedrl = "9992622744";
    
                        // Header
                        sendObject.IPernr = oController._vPernr;
                        sendObject.IEmpid = oSessionData.Pernr;
                        sendObject.IConType = "2";
                        sendObject.IBukrs = oController._Bukrs;
                        // Navigation property
                        sendObject.MedicalApplyTableIn = [Common.copyByMetadata(oModel, "MedicalApplyTableIn", oSendData)];
                        
                        oModel.create("/MedicalApplySet", sendObject, {
                            success: function(oData, oResponse) {
                                Common.log(oData);
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
                                oController.navBack();
                            },
                            error: function(oResponse) {
                                Common.log(oResponse);
                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };
    
                sap.m.MessageBox.confirm(oController.getBundleText("MSG_70006"), {
                    title: oController.getBundleText("LABEL_47001"),
                    actions: [oController.getBundleText("LABEL_70047"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessSave
                });
            },

            onDialogDelBtn: function() {
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController._DataModel.getProperty("/Pop2/0");
                var oSessionData = oController._SessionData;

                BusyIndicator.show(0);
                var onProcessDelete = function (fVal) {
                    //삭제 클릭시 발생하는 이벤트
                    if (fVal && fVal == oController.getBundleText("LABEL_70011")) { // 삭제
                        if(Common.checkNull(!oSendData.Ptamt)) oSendData.Ptamt = oSendData.Ptamt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Medsp)) oSendData.Medsp = oSendData.Medsp.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Oiamt)) oSendData.Oiamt = oSendData.Oiamt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znobcm)) oSendData.Znobcm =  oSendData.Znobcm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Medpp)) oSendData.Medpp = oSendData.Medpp.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Insnp)) oSendData.Insnp = oSendData.Insnp.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znobcd)) oSendData.Znobcd = oSendData.Znobcd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Medmp)) oSendData.Medmp = oSendData.Medmp.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Inspp)) oSendData.Inspp = oSendData.Inspp.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zdbcrl)) oSendData.Zdbcrl = oSendData.Zdbcrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Ziftrl)) oSendData.Ziftrl = oSendData.Ziftrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Framt)) oSendData.Framt = oSendData.Framt.replace(/\,/gi, "");
                        if(oSendData.Zmedrl === oController.getBundleText("MSG_47044")) oSendData.Zmedrl = "9992622744";

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = oController._vPernr;
                        sendObject.IEmpid = oSessionData.Pernr;
                        sendObject.IConType = "4";
                        sendObject.IBukrs = oController._Bukrs;
                        // Navigation property
                        sendObject.MedicalApplyTableIn = [Common.copyByMetadata(oModel, "MedicalApplyTableIn", oSendData)];
                        
                        oModel.create("/MedicalApplySet", sendObject, {
                            success: function(oData, oResponse) {
                                Common.log(oData);
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70009"), { title: oController.getBundleText("MSG_08107")});
                                oController.navBack();
                            },
                            error: function(oResponse) {
                                Common.log(oResponse);
                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_70008"), {
                    title: oController.getBundleText("LABEL_47001"),
                    actions: [oController.getBundleText("LABEL_70011"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessDelete
                });
            },

            onLiveMoney: function (oEvent) {
                var s = oEvent.getParameter("value");
				var oId = $.app.byId(oEvent.getSource().getId());
				var vTmp = false;
				
				if(isNaN(s.replace(/\,/g, ""))) {
					vTmp = true;
				}

				if(vTmp) {
					oId.setValue("0");
				} else {
					oId.setValue(Common.numberWithCommas(String(parseInt(s.replace(/\,/g, "")))).trim());
				}
				
				if(oId.getValue().trim() == "" || oId.getValue().trim() == "NaN") {
					oId.setValue("0");
				}
				
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController().eqFunc();
            },

            eqFunc: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDetA100").getController();
                var oPro;

                if (oController._Bukrs == "1000") {
                    oPro = oController._DataModel.getProperty("/Pop1/0");
					
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
					
					if(parseFloat(oPro.BaseAmt.replace(/\,/gi, "")) < 0) {
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
					oPro = oController._DataModel.getProperty("/Pop2/0");
					
                    oPro.Znobcd = Common.numberWithCommas(Math.round((parseInt(oPro.Znobcm.replace(/\,/gi, "")) * 0.5).toFixed(1)));
					
					if ($.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() != "C" && $.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() != "D") {
                        oPro.Medmp = Common.numberWithCommas(parseInt((parseInt(oPro.Medsp.replace(/\,/gi, "")) * 0.1 + parseInt(oPro.Medpp.replace(/\,/gi, "")) * 0.2).toFixed(1)));
                    } else {
                        oPro.Medmp = "0";
                    }
					
					if (oPro.Gtz51 == "D") {
						if(parseInt(oPro.Ziftrl.replace(/\,/gi, "")) < parseInt(oPro.Medpp.replace(/\,/gi, ""))) {
							oPro.Framt = oPro.Ziftrl;
						} else {
							oPro.Framt = oPro.Medpp;
						}

                        oPro.Framt = parseInt(oPro.Medsp.replace(/\,/gi, "")) + parseInt(oPro.Medpp.replace(/\,/gi, ""));
                        oPro.Framt = Common.numberWithCommas(parseInt(oPro.Framt));
                    } else if (oPro.Gtz51 == "C") {
                        if (parseInt(oPro.Zdbcrl.replace(/\,/gi, "")) < parseInt(oPro.Medsp.replace(/\,/gi, "")) + parseInt(oPro.Znobcd.replace(/\,/gi, ""))) {
                            oPro.Framt = oPro.Zdbcrl;
                        } else {
                            oPro.Framt = Common.numberWithCommas(parseInt(oPro.Medsp.replace(/\,/gi, "")) + parseInt(oPro.Znobcd.replace(/\,/gi, "")));
                        }
                    } else {
						oPro.Framt = parseInt(oPro.Ptamt.replace(/\,/gi, "")) - parseInt(oPro.Inspp.replace(/\,/gi, "")) - parseInt(oPro.Medmp.replace(/\,/gi, "")) - parseInt(oPro.Insnp.replace(/\,/gi, "")) - parseInt(oPro.Oiamt.replace(/\,/gi, ""));
						
						if(parseFloat(oPro.Framt) < 0) {
							oController._DataModel.setProperty("/Pop2/0/Framt", "0");
						} else {
							oPro.Framt = Common.numberWithCommas(parseInt(oPro.Framt));
						}
                    }
                }
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "991004" });
                  }
                : null
        });
    }
);
