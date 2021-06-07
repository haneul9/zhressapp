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

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDet"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "MedApplyDet",

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
            _NewGubun: "",
            _MedDate: null,
            _vArr1: ["Zdbcrl", "Zdsctm", "Ziftrl", "Zfvcrl", "Mycharge", "SuppAmt", "Zmedrl", "NsuppAmt", "BaseAmt", "Zkiobd", "Zkibbm", "Zkijbd", "Zkijbm", "Znijcd", "Znijcm", "Zniiwd", "Zniiwm", "Znisdd", "Znisdm", "Znoctd", "Znoctm", "Znomrd", "Znomrm", "Znocud", "Znocum", "Znobcd", "Znobcm"],
            _vArr2: ["Ptamt", "Medsp", "Oiamt", "Znobcm", "Medpp", "Insnp", "Znobcd", "Medmp", "Inspp", "Zdbcrl", "Ziftrl", "Framt"],
            _vC: null,

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
                var vData = {
					IConType: "0",
					IBukrs: oSessionData.Bukrs2,
					IPernr: oSessionData.Pernr,
					ILangu: oSessionData.Langu,
					IDatum: moment().hours(9).toDate(),
					MedicalApplyExport: [],
					MedicalApplyTableIn: [],
					MedicalApplyTableIn0: [],
					MedicalApplyTableIn3: [],
					MedicalApplyTableIn4: [],
					MedicalApplyTableIn5: [],
					MedicalApplyTableInH: []
				};
				
                oController._SessionData = oSessionData;
				oController._ListCondJSonModel.setData({ Data: oSessionData });
                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").setModel(oController._DataModel);
                oController._SelData = {Sel1: [], Sel2: [], Sel3: [], Sel4: [], Sel5: [], Sel6: [] };
				
				$.app.getModel("ZHR_BENEFIT_SRV").create("/MedicalApplySet", vData, {
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
                this._NewGubun = oEvent.data[5];
                this.onAfterOpen();
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
                this.onAfterLoad();
            },

            onAfterOpen:function(){
                var oController=$.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oPro;
                
                oController.getSelData();
                
                oController._tData.Chk1 = (oController._tData.Zfvcgb=="X") ? true : false;
                oController._tData.Chk2 = (oController._tData.Ziftgb=="X") ? true : false;

                if (oController._tData.MedDate === null) {
                    oController._tData.MedDate = new Date();
                }

                oController._DataModel.setData({Pop1:[oController._tData],Pop2:[]});
                
                oPro = oController._DataModel.getProperty("/Pop1/0");

                oController._vArr1.forEach(function(e){
                    oPro[e] = parseInt(oPro[e]);

                    if(e=="Zmedrl"){
                        if(oPro.Zmedrl>100000000){
                            oController._vC=oPro.Zmedrl;
                            oPro.Zmedrl=oController.getBundleText("MSG_47044");
                            oController._DataModel.setProperty("/Pop1/0/"+e, oPro[e]);
                        }else{
                            oController._DataModel.setProperty("/Pop1/0/"+e, Common.numberWithCommas(oPro[e]));
                        }
                    }else{
                        oController._DataModel.setProperty("/Pop1/0/"+e, Common.numberWithCommas(oPro[e]));
                    }					
                });

                $.app.byId('ZUI5_HR_MedApply.m.MedApplyDet').bindElement("/Pop1/0");

                setTimeout(function(){	
                    if(oController._NewGubun != "O"){
                        oController.changeSel2();
                    }
                },100);
            },

            onAfterLoad: function () {
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var vStatus = oController._DataModel.getProperty("/Pop1/0/Status");
                var oChk1 = $.app.byId(oController.PAGEID + "_Chk1");
				var oChk2 = $.app.byId(oController.PAGEID + "_Chk2");
                var vAppnm = "";
                var vEdit = false;
				
				vEdit = (vStatus === "AA" || vStatus === "88" || Common.checkNull(vStatus)) && oController._onClose !== "X" ? true : false;
				if(oController._NewGubun === "X") {
					vAppnm = oController._DataModel.getProperty("/Pop1/0/Appnm");
				}
                				
				setTimeout(function () {
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
                        Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: oChk1.getSelected() && (vStatus === "AA" || vStatus === "88") && oController._onClose !== "X",
                        UseMultiCategories: true
                    }, "001");

                    COMMON_ATTACH_FILES.setAttachFile(oController, {
                        Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "002",
                        Max: "1",
                        Label: "",
                        Editable: oChk2.getSelected() && (vStatus === "AA" || vStatus === "88") && oController._onClose !== "X",
                        UseMultiCategories: true
                    }, "002");

                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: vAppnm,
                            Required: false,
                            Mode: "M",
                            Max: "7",
                            Cntnm: "009",
                            Editable: vEdit,
                            UseMultiCategories: true
                        },
                        "009"
                    );
                }, 10);
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

            getSelData: function(){
                var	oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();	
                var oSessionData=oController._SessionData;		
                var oSel = $.app.byId(oController.PAGEID+"_dSel1");
                var oSel2 = $.app.byId(oController.PAGEID+"_dSel2");

                oSel.removeAllItems();
                oSel.addItem(
                    new sap.ui.core.Item({
                        text:oController.getBundleText("LABEL_00181"),
                        key:''
                    }).addCustomData(new sap.ui.core.CustomData({
                        key:"Data",
                        value:''
                    })).addCustomData(new sap.ui.core.CustomData({
                        key:"Data",
                        value:''
                    }))
                );
                
                oSel2.removeAllItems();
                oSel2.addItem(
                    new sap.ui.core.Item({
                        text:oController.getBundleText("LABEL_00181"),
                        key:''
                    }).addCustomData(new sap.ui.core.CustomData({
                        key:"Data",
                        value:''
                    }))
                );
                
                oController._SelData.Sel1.forEach(function(e){
                    oSel.addItem(new sap.ui.core.Item({
                        text:e.Fname,
                        key:e.Fname
                    }).addCustomData(new sap.ui.core.CustomData({
                        key:"Data",
                        value:e.RelationTxt
                    })).addCustomData(new sap.ui.core.CustomData({
                        key:"Data",
                        value:e.Relation
                    })));
                });

                $.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", {
                    ICodeT:"004",
                    IPernr:oSessionData.Pernr,
                    IBukrs:oController._Bukrs,
                    ILangu:"3",
                    ICodty:"ZHOSP_TYPE",
                    NavCommonCodeList:[]
                }, 
                {
                    success:function(data){
                        if(data&&data.NavCommonCodeList.results.length){
                            data.NavCommonCodeList.results.forEach(function(e){
                                oSel2.addItem(new sap.ui.core.Item({
                                    text:e.Text,
                                    key:e.Code
                                }));
                            });
                        }
                    },
                    error:function (oError) {
                        var Err = {};				
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
                            else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
                        } else {
                            sap.m.MessageBox.alert(oError.toString());
                        }
                    }
                });
            },

            onChange: function () {
                var oController = this.getView().getController();
                var oSel = $.app.byId(oController.PAGEID + "_mSel");
				var oInp = $.app.byId(oController.PAGEID + "_mInput");
				
				oInp.setValue();
				
				if(oSel.getSelectedKey() === "1") {
					oInp.setMaxLength(50);
				} else {
					oInp.setMaxLength(10);
				}
            },

            onSearchMed: function () {
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				
                if (!oController._miniPop) {
                    oController._miniPop = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.minipop", oController);
                    $.app.getView().addDependent(oController._miniPop);
                }
                oController._miniPop.open();
            },

            initTdata: function (Flag) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
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
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				var oSel = $.app.byId(oController.PAGEID + "_dSel1");
				var oDetailModel = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel();
				var oPro = oDetailModel.getProperty("/Pop1/0");
				
                oDetailModel.setProperty("/Pop1/0/RelationTx", oSel.getSelectedItem().getCustomData()[0].getValue("Data"));
                oPro.Relation = oSel.getSelectedItem().getCustomData()[1].getValue("Data");
				
				if ((oPro.Status === "AA" || oPro.Status === "88" || Common.checkNull(oPro.Status)) && oController._onClose !== "X") {
                    if (oPro.HospType != "05") {
                        if (oPro.Relation != "01" && oPro.Relation != "02") {
                            oDetailModel.setProperty("/Pop1/0/Chk1", false);
                            oDetailModel.setProperty("/Pop1/0/Chk2", false);
                            $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                            $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
                        } else {
                            $.app.byId(oController.PAGEID + "_Chk1").setEditable(true);
                            $.app.byId(oController.PAGEID + "_Chk2").setEditable(true);
                        }
                    } else {
                        oDetailModel.setProperty("/Pop1/0/Chk1", false);
                        oDetailModel.setProperty("/Pop1/0/Chk2", false);
                        $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                        $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
                    }
                } else {
                    oDetailModel.setProperty("/Pop1/0/Chk1", false);
                    oDetailModel.setProperty("/Pop1/0/Chk2", false);
                    $.app.byId(oController.PAGEID + "_Chk1").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Chk2").setEditable(false);
                }
				
				if (vSig != "R") {
                    oController.onChk1();
                    oController.onChk2();
                }
            },

            changeSel2: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				var oSel2 = $.app.byId(oController.PAGEID + "_dSel2");
				
                if (oSel2.getSelectedKey() == "05") {
                    $.app.byId(oController.PAGEID + "_Inp1").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp1").setValue("0");
                    $.app.byId(oController.PAGEID + "_Inp2").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp2").setValue("0");
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
                    $.app.byId(oController.PAGEID + "_Inp9").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp9").setValue("0");
                }

				if(oController._NewGubun != "X") {
					oController.eqFunc();
				}
                oController.changeSel(vSig);
            },

            initFile: function (vPage) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX" + vPage),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table" + vPage),
                    oJSonModel = oAttachbox.getModel(),
                    vPath = "/Data/0",
                    vContexts = oJSonModel.getProperty(vPath);

                if (!vContexts) return;

                oTable.removeSelections(true);
            },

            onChk1: function () {
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				var oPro = oController._DataModel.getProperty("/Pop1/0");
                var vAppnm = "";

				if(oController._onDialog == "M") {
					vAppnm = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel().getProperty("/Pop1/0/Appnm");
				}

                if (oPro.Chk1) {
                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: vAppnm,
                            Mode: "S",
                            Cntnm: "001",
                            Max: "1",
                            Label: "",
                            Editable: true,
                            UseMultiCategories: true
                        },
                        "001"
					);
					
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
				var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				var oPro = oController._DataModel.getProperty("/Pop1/0");
                var vAppnm = "";

				if(oController._onDialog == "M") {
					vAppnm = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel().getProperty("/Pop1/0/Appnm");
				}

                if (oPro.Chk2) {
                    COMMON_ATTACH_FILES.setAttachFile(
                        oController,
                        {
                            Appnm: vAppnm,
                            Mode: "S",
                            Cntnm: "001",
                            Max: "1",
                            Label: "",
                            Editable: true,
                            UseMultiCategories: true
                        },
                        "002"
                    );
					
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

            onMiniAdd: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_dTable");
				
				if (oTable.getSelectedIndices().length == 0) {
                    MessageBox.alert(oController.getBundleText("MSG_47008"));	// 추가 할 의료기관을 선택 해 주세요!
                    return;
                }
				
				MessageBox.alert(oController.getBundleText("MSG_47033"), {	// 선택한 사업자번호가 영수증과 일치하는지 확인하세요!
                    onClose: function () {
                        var oData = oTable.getModel().getProperty("/oData")[oTable.getSelectedIndices()[0]];
                        $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel().setProperty("/Pop1/0/HospName", oData.HospName);
                        $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel().setProperty("/Pop1/0/Comid", oData.Comid);
                        $.app.byId($.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController().PAGEID + "_miniDialog").close();
                    }
                });
            },

            clickNotice: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
				
				function closeDialog() {
                    $.app.byId(oController.PAGEID + "_pDial").close();
                }
                function onAfterOpen() {
                    $.app.byId(oController.PAGEID + "_Input1").setValue();
                    $.app.byId(oController.PAGEID + "_Input2").setValue();
                }
                function onSaveProcess() {
                    var vData = {
                        Hname: $.app.byId(oController.PAGEID + "_Input1").getValue().trim(),
                        Comid: $.app.byId(oController.PAGEID + "_Input2").getValue().trim()
                    };
					
					$.app.getModel("ZHR_BENEFIT_SRV").create("/MedComidSaveSet", vData, {
                        success: function () {
                            MessageBox.alert(oController.getBundleText("MSG_35005"), {	// 저장 되었습니다.
                                title: oController.getBundleText("LABEL_35023"),	// 안내
                                onClose: function () {
                                    closeDialog();
                                    oController.onMini();
                                }
                            });
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
                function onSave() {
                    if ($.app.byId(oController.PAGEID + "_Input1").getValue().trim() === "") {
                        MessageBox.alert(oController.getBundleText("MSG_47012"));	// 병원명을 입력 해 주세요.
                        return;
                    }
                    if ($.app.byId(oController.PAGEID + "_Input2").getValue().trim() === "") {
                        MessageBox.alert(oController.getBundleText("MSG_47013"));	// 사업자 등록번호를 입력 해 주세요.
                        return;
                    }
                    if (isNaN($.app.byId(oController.PAGEID + "_Input2").getValue().trim())) {
                        MessageBox.alert(oController.getBundleText("MSG_47014"));	// 사업자 등록번호는 숫자만 입력 해 주세요.
                        return;
                    }
					
					MessageBox.show(oController.getBundleText("MSG_35001"), {	// 저장 하시겠습니까?
                        icon: MessageBox.Icon.INFORMATION,
                        title: oController.getBundleText("LABEL_35023"),	// 안내
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (fVal) {
                            if (fVal == "YES") {
                                onSaveProcess(oController);
                            }
                        }
                    });
                }
				
				if (!oController.oDialog4) {
                    var oContent = new sap.ui.commons.layout.MatrixLayout({
                        columns: 2,
						widths: ["30%"],
						rows: [
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells: [
									new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign: "Center",
                        				content: new sap.m.Text({ text: oController.getBundleText("LABEL_47059") }).addStyleClass("Bold")	// 의료기관명
									}).addStyleClass("LabelCell"),
									new sap.ui.commons.layout.MatrixLayoutCell({
										content: new sap.m.Input(oController.PAGEID + "_Input1", { width: "100%", maxLength: 50 })
									}).addStyleClass("DataCell")
								]
							}),
							new sap.ui.commons.layout.MatrixLayoutRow({
								cells: [
									new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign: "Center",
										content: new sap.m.Text({ text: oController.getBundleText("LABEL_47060") }).addStyleClass("Bold")	// 사업자번호
									}).addStyleClass("LabelCell"),
									new sap.ui.commons.layout.MatrixLayoutCell({
										content: new sap.m.Input(oController.PAGEID + "_Input2", { width: "100%", maxLength: 10 })
									}).addStyleClass("DataCell")
								]
							})
						]
                    });

                    var mDialog = new sap.m.Dialog(oController.PAGEID + "_pDial", {
                        content: [oContent],
                        title: oController.getBundleText("LABEL_47057"),	// 의료기관 신규등록
                        buttons: [
							new sap.m.Button({ 
								text: oController.getBundleText("LABEL_47101"),	// 저장
								press: onSave 
							}).addStyleClass("button-search btn-margin"),
							new sap.m.Button({ 
								text: oController.getBundleText("LABEL_00133"), 	// 닫기
								press: closeDialog 
							}).addStyleClass("button-delete")
						],
                        contentWidth: "480px",
                        afterOpen: onAfterOpen
                    });
					
					oController.oDialog4 = mDialog;
                    $.app.getView().addDependent(oController.oDialog4);
                }
				
				oController.oDialog4.open();
            },

            onMiniSearch: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oTable = $.app.byId(oController.PAGEID + "_dTable");
                var oSel = $.app.byId(oController.PAGEID + "_mSel");
                var oInp = $.app.byId(oController.PAGEID + "_mInput");
                var vData = { MedComidList2TableIn: [] };
                var aData = { oData: [] };
                var oJSON = oTable.getModel();
				var oCnt = 0;
				
				if (oSel.getSelectedKey() == "1") {
                    vData.IConType = "";
                    vData.IInHosp = oInp.getValue().trim();
                } else {
                    vData.IConType = "1";
                    vData.IComid = oInp.getValue().trim();
                }
				
				BusyIndicator.show(0);
				
				setTimeout(function () {
                    $.app.getModel("ZHR_BENEFIT_SRV").create("/MedComidList2Set", vData, {
                        success: function (data) {
                            if (data && data.MedComidList2TableIn.results.length) {
                                data.MedComidList2TableIn.results.forEach(function (e) {
                                    aData.oData.push(e);
                                });
							
								oJSON.setData(aData);
								oTable.bindRows("/oData");
								
								Common.adjustVisibleRowCount(oTable, 10, data.MedComidList2TableIn.results.length);
                            }
							
							oCnt = data.MedComidList2TableIn.results.length;
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
					
                    BusyIndicator.hide();
					
					if (oCnt == 0) {
                        setTimeout(function () {
                            $("#" + oController.PAGEID + "_TableRow").css("display", "none");
                            $("#" + oController.PAGEID + "_NewRow").css("display", "");
                        }, 10);
                    } else {
                        setTimeout(function () {
                            $("#" + oController.PAGEID + "_TableRow").css("display", "");
                            $("#" + oController.PAGEID + "_NewRow").css("display", "none");
                        }, 10);
                    }
                }, 100);
            },

            onCloseMini: function () {
                $.app.byId($.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController().PAGEID + "_miniDialog").close();
            },

            onFocusMini: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oInp = $.app.byId(oController.PAGEID + "_mInput");
				
				oInp.focus();
            },

            onMini: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oSel = $.app.byId(oController.PAGEID + "_mSel");
                var oInp = $.app.byId(oController.PAGEID + "_mInput");
                var oTable = $.app.byId(oController.PAGEID + "_dTable");
                var aData = { oData: [] };
				
				oSel.setSelectedKey("1");
                oInp.setValue();
                oTable.setVisibleRowCount(1);
                oTable.getModel().setData(aData);
                oTable.bindRows("/oData");
				
				setTimeout(function () {
                    $("#" + oController.PAGEID + "_TableRow").css("display", "");
                    $("#" + oController.PAGEID + "_NewRow").css("display", "none");
                }, 10);
            },

            onValid: function (oController) {
                var oMsg = "";
                var oPro;
				
				if (oController._Bukrs == "1000") {
                    oPro = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel().getProperty("/Pop1/0");
					
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
                    if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == "" || $.app.byId(oController.PAGEID + "_dSel2").getSelectedKey() == "" || $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController()._DataModel.getProperty("/Pop1")[0].DiseName.trim() == "") {
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

                    if(Common.checkNull(!oPro.Zkibbm)) oPro.Zkibbm = oPro.Zkibbm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zkijbm)) oPro.Zkijbm = oPro.Zkijbm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znijcm)) oPro.Znijcm = oPro.Znijcm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zniiwm)) oPro.Zniiwm =  oPro.Zniiwm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znisdm)) oPro.Znisdm = oPro.Znisdm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znoctm)) oPro.Znoctm = oPro.Znoctm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znomrm)) oPro.Znomrm = oPro.Znomrm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znocum)) oPro.Znocum = oPro.Znocum.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znobcm)) oPro.Znobcm = oPro.Znobcm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zkiobd)) oPro.Zkiobd = oPro.Zkiobd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zkijbd)) oPro.Zkijbd = oPro.Zkijbd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znijcd)) oPro.Znijcd = oPro.Znijcd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zniiwd)) oPro.Zniiwd = oPro.Zniiwd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znisdd)) oPro.Znisdd = oPro.Znisdd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znoctd)) oPro.Znoctd = oPro.Znoctd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znomrd)) oPro.Znomrd = oPro.Znomrd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znocud)) oPro.Znocud = oPro.Znocud.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Znobcd)) oPro.Znobcd = oPro.Znobcd.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Mycharge)) oPro.Mycharge = oPro.Mycharge.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.NsuppAmt)) oPro.NsuppAmt = oPro.NsuppAmt.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zmedrl)) oPro.Zmedrl = oPro.Zmedrl.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zdsctm)) oPro.Zdsctm = oPro.Zdsctm.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.Zdbcrl)) oPro.Zdbcrl = oPro.Zdbcrl.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.BaseAmt)) oPro.BaseAmt = oPro.BaseAmt.replace(/\,/gi, "");
                    if(Common.checkNull(!oPro.SuppAmt)) oPro.SuppAmt = oPro.SuppAmt.replace(/\,/gi, "");                
                    if(Common.checkNull(!oPro.Zfvcrl)) oPro.Zfvcrl = oPro.Zfvcrl.replace(/\,/gi, "");                
                    if(Common.checkNull(!oPro.Ziftrl)) oPro.Ziftrl = oPro.Ziftrl.replace(/\,/gi, "");
                } else {
                    oPro = $.app.byId(oController.PAGEID + "_Mat2").getModel().getProperty("/Pop2/0");
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
                    if (oPro.Gtz51 != "C" && oPro.Gtz51 != "D") {
                        if (oPro.Ptamt.trim() == "0") {
                            oMsg = oController.getBundleText("MSG_47028");
                        }
                    }
                    if (oPro.Gtz51 != "D") {
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
                }
                if (oMsg != "") {
                    MessageBox.alert(oMsg);
                    return false;
                }
                return true;
            },

            onCal: function (vSig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
                var vTmp = false;
                var oPro;
                var vData = {
                    IConType: oController._NewGubun === "O" ? "C" : "H",
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
                    if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == "") {
                        MessageBox.alert(oController.getBundleText("MSG_47034"));
                        return;
                    }
					
					oPro = oController._DataModel.getProperty("/Pop1/0");
					
					if (oPro.Zmedrl == oController.getBundleText("MSG_47044")) {
                        oPro.Zmedrl = Common.numberWithCommas(oController._vC);
                    }
					
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
						vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
                    });
					
					vData.MedicalApplyTableIn[0].Zfvcgb = vData.MedicalApplyTableIn[0].Chk1 ? "X" : "";
					vData.MedicalApplyTableIn[0].Ziftgb = vData.MedicalApplyTableIn[0].Chk2 ? "X" : "";
                    vData.MedicalApplyTableIn[0].PatiName = $.app.byId(oController.PAGEID + "_dSel1").getSelectedItem().getText();
                } else {
                    oPro = oController._DataModel.getProperty("/Pop2/0");
					
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
						vData.MedicalApplyTableIn[0][e] = String(vData.MedicalApplyTableIn[0][e]).replace(/,/gi,'');
                    });
				}
				
                delete vData.MedicalApplyTableIn[0].Close;
                delete vData.MedicalApplyTableIn[0].Chk1;
                delete vData.MedicalApplyTableIn[0].Chk2;
                delete vData.MedicalApplyTableIn[0].PayDate;

                vData.MedicalApplyTableIn[0].Waers = "KRW";
                vData.MedicalApplyTableIn[0].Bukrs = vSig;
				
				if(vSig == "1000") {
					vData.IMedDate = oController._DataModel.getProperty("/Pop1/0/MedDate");
				} else {
					vData.IMedDate = oController._DataModel.getProperty("/Pop2/0/MedDate");
				}

                oModel.create("/MedicalApplySet", vData, {
                    success: function (data) {
                        if (data && data.MedicalApplyTableIn.results.length) {
                            var oJSON, aData;

                            if (vSig == "1000") {
                                oJSON = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getModel();
                                aData = { Pop1: [], Pop2: [] };
                                data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.Pop1.push(e);
                                });
								
								oJSON.setData(aData);
                                $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").bindElement("/Pop1/0");
                                vTmp = true;
								
								setTimeout(function () {
                                    oController.changeSel2("R");
                                }, 100);
                            } else {
                                oJSON = $.app.byId(oController.PAGEID + "_Mat2").getModel();
                                aData = { Pop1: [], Pop2: [] };
                                data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.Pop2.push(e);
                                });
                                oJSON.setData(aData);
                                $.app.byId(oController.PAGEID + "_Mat2").bindElement("/Pop2/0");
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
					oController._DataModel.getProperty("/Pop1")[0].Close = oController._onClose;

					oController._DataModel.setProperty("/Pop1/0/Chk1", (vData.MedicalApplyTableIn[0].Zfvcgb == "X") ? true : false);
					oController._DataModel.setProperty("/Pop1/0/Chk2", (vData.MedicalApplyTableIn[0].Ziftgb == "X") ? true : false);
					
					oController._vArr1.forEach(function (e) {
						oPro = oController._DataModel.getProperty("/Pop1")[0];
						
						oPro[e] = parseInt(oPro[e]);

                        if (e == "Zmedrl") {
                            if (oPro.Zmedrl > 100000000) {
                                oController._vC = oPro.Zmedrl;
                                oPro.Zmedrl = oController.getBundleText("MSG_47044");
                                oController._DataModel.setProperty("/Pop1/0/" + e, oPro[e]);
                            } else {
                                oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                            }
                        } else {
                            oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                        }
                    });
                } else {
					oController._DataModel.getProperty("/Pop2")[0].Close = oController._onClose;

                    oController._vArr2.forEach(function (e) {
						oPro = oController._DataModel.getProperty("/Pop2")[0];
						

                        oPro[e] = parseInt(oPro[e]);
                        oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                    });
				}
				
                return vTmp;
            },

            onDialogBaseSaveBtn: function() {
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController._DataModel.getProperty("/Pop1/0");
                var oCal = oController.onCal(oController._Bukrs, "S");
                var oSessionData = oController._SessionData;

                if(oController.onValid(oController) === false) return;
                
                if(oCal) {
                    BusyIndicator.show(0);
                    var onProcessSave = function (fVal) {
                        if (fVal && fVal == oController.getBundleText("LABEL_70047")) { //저장
                            var sendObject = {};
                            var uFiles = [];
    
                            if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") !== 0) uFiles.push("001");
                            if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") !== 0) uFiles.push("002");
                            if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "009") !== 0) uFiles.push("009");
    
                            oSendData.Zfvcgb = (oSendData.Chk1) ? "X" : "";
                            oSendData.Ziftgb = (oSendData.Chk2) ? "X" : "";
    
                            // 첨부파일 저장
                            oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
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
                }
            },

            onDialogBaseDelBtn: function() {
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController._DataModel.getProperty("/Pop1/0");
                var oSessionData = oController._SessionData;
                
                BusyIndicator.show(0);
                var onProcessDelete = function (fVal) {
                    //삭제 클릭시 발생하는 이벤트
                    if (fVal && fVal == oController.getBundleText("LABEL_70011")) { // 삭제
                        if(Common.checkNull(!oSendData.Zkibbm)) oSendData.Zkibbm = oSendData.Zkibbm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zkijbm)) oSendData.Zkijbm = oSendData.Zkijbm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znijcm)) oSendData.Znijcm = oSendData.Znijcm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zniiwm)) oSendData.Zniiwm = oSendData.Zniiwm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znisdm)) oSendData.Znisdm = oSendData.Znisdm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znoctm)) oSendData.Znoctm = oSendData.Znoctm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znomrm)) oSendData.Znomrm = oSendData.Znomrm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znocum)) oSendData.Znocum = oSendData.Znocum.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znobcm)) oSendData.Znobcm = oSendData.Znobcm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zkiobd)) oSendData.Zkiobd = oSendData.Zkiobd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zkijbd)) oSendData.Zkijbd = oSendData.Zkijbd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znijcd)) oSendData.Znijcd = oSendData.Znijcd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zniiwd)) oSendData.Zniiwd = oSendData.Zniiwd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znisdd)) oSendData.Znisdd = oSendData.Znisdd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znoctd)) oSendData.Znoctd = oSendData.Znoctd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znomrd)) oSendData.Znomrd = oSendData.Znomrd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znocud)) oSendData.Znocud = oSendData.Znocud.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Znobcd)) oSendData.Znobcd = oSendData.Znobcd.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Mycharge)) oSendData.Mycharge = oSendData.Mycharge.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.NsuppAmt)) oSendData.NsuppAmt = oSendData.NsuppAmt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zmedrl)) oSendData.Zmedrl = oSendData.Zmedrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zdsctm)) oSendData.Zdsctm = oSendData.Zdsctm.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zdbcrl)) oSendData.Zdbcrl = oSendData.Zdbcrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.BaseAmt)) oSendData.BaseAmt = oSendData.BaseAmt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.SuppAmt)) oSendData.SuppAmt = oSendData.SuppAmt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zfvcrl)) oSendData.Zfvcrl = oSendData.Zfvcrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Ziftrl)) oSendData.Ziftrl = oSendData.Ziftrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zdbcrl)) oSendData.Zdbcrl = oSendData.Zdbcrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.BaseAmt)) oSendData.BaseAmt = oSendData.BaseAmt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.SuppAmt)) oSendData.SuppAmt = oSendData.SuppAmt.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zfvcrl)) oSendData.Zfvcrl = oSendData.Zfvcrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Ziftrl)) oSendData.Ziftrl = oSendData.Ziftrl.replace(/\,/gi, "");
                        if(Common.checkNull(!oSendData.Zdbcrl)) oSendData.Zdbcrl = oSendData.Zdbcrl.replace(/\,/gi, "");
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

            onSaveProcess: function (oController, vSig) {
                var oCal = oController.onCal(vSig);
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
                var oPro;

                if (oCal) {
					var uFiles = [];
					var vData = { IConType: "", IBukrs: vSig, IPernr: oSessionData.Pernr, ILangu: oSessionData.Langu, IMolga: oSessionData.Molga, MedicalApplyExport: [], MedicalApplyTableIn: [], MedicalApplyTableIn0: [], MedicalApplyTableIn3: [], MedicalApplyTableIn4: [], MedicalApplyTableIn5: [], MedicalApplyTableInH: [] };
					
					vData.IConType = (oController._onDialog == "M") ? "2" : "3";

                    if (vSig == "1000") {
						vData.IMedDate = oController._DataModel.getProperty("/Pop1")[0].MedDate;

						oPro = oController._DataModel.getProperty("/Pop1")[0];
						
                        if (oPro.Zmedrl == oController.getBundleText("MSG_47044")) {
                            oPro.Zmedrl = Common.numberWithCommas(oController._vC);
                        }
						
						vData.MedicalApplyTableIn.push(oPro);
						
						if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                            vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(9).toDate();
                        } else {
                            vData.MedicalApplyTableIn[0].Begda = null;
                        }
						
						oController._vArr1.forEach(function (e) {
                            vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
						});
						
						vData.MedicalApplyTableIn[0].Zfvcgb = (vData.MedicalApplyTableIn[0].Chk1) ? "X" : "";
						vData.MedicalApplyTableIn[0].Ziftgb = (vData.MedicalApplyTableIn[0].Chk2) ? "X" : "";
                    } else {
						vData.IMedDate = oController._DataModel.getProperty("/Pop2")[0].MedDate;
                        vData.MedicalApplyTableIn.push(oController._DataModel.getProperty("/Pop2")[0]);
						
						oController._vArr2.forEach(function (e) {
                            vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
                        });
					}
					
					if (vSig == "1000") {
                        oPro = oController._DataModel.getProperty("/Pop1")[0];
						
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
                                        oController._DataModel.setData({ Pop1: [{
                                            MedDate : oPro.MedDate,
                                            PatiName : oPro.PatiName,
                                            RelationTx : oPro.RelationTx,
                                            Relation : oPro.Relation,
                                            HospType : oPro.HospType,
                                            HospName : oPro.HospName,
                                            Comid : oPro.Comid,
                                            DiseName : oPro.DiseName,
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
                                        }], Pop2: [] });
                                        oController.changeSel2();
                                        oController.onAfterLoad();
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
							oPro[e] = parseInt(oPro[e]);
							
                            if (e == "Zmedrl") {
                                if (oPro.Zmedrl > 100000000) {
                                    oController._vC = oPro.Zmedrl;
                                    oPro.Zmedrl = oController.getBundleText("MSG_47044");
                                    oController._DataModel.setProperty("/Pop1/0/" + e, oPro[e]);
                                } else {
                                    oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                                }
                            } else {
                                oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                            }
                        });
                    } else {
                        oPro = oController._DataModel.getProperty("/Pop2/0");
                        oController._vArr2.forEach(function (e) {
                            $.app.byId('ZUI5_HR_MedApply.m.MedApplyDet').getController()._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                        });
                    }
                }
            },

            onSave: function (Sig) {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
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

            onLiveMoney: function (oEvent) {
                var s = oEvent.getParameter("value");
				var vTmp = false;
				var oId = $.app.byId(oEvent.getSource().getId());
				
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
				
				$.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController().eqFunc();
            },

            eqFunc: function () {
                var oController = $.app.byId("ZUI5_HR_MedApply.m.MedApplyDet").getController();
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
