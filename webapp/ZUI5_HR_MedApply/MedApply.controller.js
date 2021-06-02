/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/CommonController",
        "common/JSONModelHelper",
		"common/EmpBasicInfoBoxCustomHass",
		"fragment/COMMON_ATTACH_FILES",
        "sap/m/InputBase",
        "sap/ui/core/BusyIndicator",
        "common/OrgOfIndividualHandler",
        "common/DialogHandler",
        "sap/m/MessageBox"
    ],
    function (Common, ZHR_TABLES, CommonController, JSONModelHelper, EmpBasicInfoBoxCustomHass, COMMON_ATTACH_FILES, InputBase, BusyIndicator, OrgOfIndividualHandler, DialogHandler, MessageBox) {
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
            _vArr1: ["Zdbcrl", "Zdsctm", "Ziftrl", "Zfvcrl", "Mycharge", "SuppAmt", "Zmedrl", "NsuppAmt", "BaseAmt", "Zkiobd", "Zkibbm", "Zkijbd", "Zkijbm", "Znijcd", "Znijcm", "Zniiwd", "Zniiwm", "Znisdd", "Znisdm", "Znoctd", "Znoctm", "Znomrd", "Znomrm", "Znocud", "Znocum", "Znobcd", "Znobcm"],
            _vArr2: ["Ptamt", "Medsp", "Oiamt", "Znobcm", "Medpp", "Insnp", "Znobcd", "Medmp", "Inspp", "Zdbcrl", "Ziftrl", "Framt"],
            _FirstTime: "X",
            _vC: null,
            _vPernr: "",
			_Hass: "",
			_GubunBukrs: "",
			_NewGubun: "",
            _MedDateChange: "",
			
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            getStatus: function() {
                var oController = $.app.getController();
    
                return new sap.m.FlexBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.commons.TextView({
                            text : "{StatusT}", 
                            textAlign : "Center",
                            visible : {
                                path : "Status", 
                                formatter : function(fVal){
                                    return fVal !== "AA" && fVal !== "88";
                                }
                            }
                        })
                        .addStyleClass("font-14px font-regular mt-4px"),
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            items: [
                                new sap.ui.commons.TextView({ //처리결과에 Text
                                    text : "{StatusT}", 
                                    textAlign : "Center"
                                })
                                .addStyleClass("font-14px font-regular mt-7px"),
                                new sap.m.Button({ //처리결과에 삭제 버튼
                                    text: "{i18n>LABEL_38047}",
                                    press : oController.onPressCancel
                                })
                                .addStyleClass("button-light-sm ml-10px")
                            ],
                            visible : {
                                path : "Status", 
                                formatter : function(fVal){
                                    return fVal === "AA" || fVal === "88";
                                }
                            }
                        })
                    ]
                });
            },

            onESSelectPerson: function (Data) {
				var oControl = $.app.byId(this.PAGEID + "_HassPer").getItems()[1];
				
                oControl.removeAllCustomData();
                oControl.setValue(Data.Ename);
                oControl.addCustomData(new sap.ui.core.CustomData({
					value: Data.Pernr, 
					key: "Pernr"
				}));
				
				this._vPernr = Data.Pernr;

				$.app.byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog").close();
                this.OrgOfIndividualHandler.getDialog().close();
            },

            displayMultiOrgSearchDialog: function (oEvent) {
				var oController = $.app.getController();

				return !oController.EmployeeSearchCallOwner 
							? oController.OrgOfIndividualHandler.openOrgSearchDialog(oEvent) 
							: oController.EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },

            getOrgOfIndividualHandler: function () {
                return this.OrgOfIndividualHandler;
            },

            searchOrgehPernr: function (oEvent) {
                var oController = this;
                var oSessionData = oController._SessionData;
				var oControl = $.app.byId(oEvent.getSource().getId());
				
				oController._vPernr = oSessionData.Pernr;
				oControl.setValue();
                oControl.removeAllCustomData();
                oControl.addCustomData(new sap.ui.core.CustomData({ key: "Pernr", value: oController._vPernr }));

                var initData = {
                    Percod: oController.getSessionInfoByKey("Percod"),
                    Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                    Langu: oController.getSessionInfoByKey("Langu"),
                    Molga: oController.getSessionInfoByKey("Molga"),
                    Datum: new Date(),
                    Mssty: "",
                    autoClose: false
                };
                var callback = function (o) {
                    if (o.Otype == "O") {
                        MessageBox.error(oController.getBundleText("MSG_48016")); // 대상자를 선택하여 주십시오.
                        return;
                    }
					
					oController._vPernr = o.Objid;
					oControl.setValue(o.Stext);
                    oControl.removeAllCustomData();
                    oControl.addCustomData(new sap.ui.core.CustomData({ value: o.Objid, key: "Pernr" }));
					
                    oController.OrgOfIndividualHandler.getDialog().close();
                };

                this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                DialogHandler.open(this.OrgOfIndividualHandler);
            },

            getSelector: function (vSig) {
				var oController = $.app.getController();
				var oSessionData = oController._SessionData;
				var oHeadSelControl = $.app.byId(oController.PAGEID + "_HeadSel");
				
                oController._ListCondJSonModel.setData({ Data: oController.getView().getModel("session").getData() });
				oController._SessionData = oController.getView().getModel("session").getData();
				
                oHeadSelControl.removeAllItems();
                oHeadSelControl.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
                );
				
				if (vSig == "A") {
                    oController._SelData.Sel1 = [];
                    oController._SelData.Sel5 = [];
                }

                $.app.getModel("ZHR_BENEFIT_SRV").create(
					"/MedicalApplySet", 
					{
						IConType: "0",
						IBukrs: oController._Bukrs,
						IPernr: oController._vPernr,
						IEmpid: oSessionData.Pernr,
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
				var oHassPerControl = $.app.byId(oController.PAGEID + "_HassPer");
				
                oController._vPernr = oSessionData.Pernr;
                oController._SessionData = oSessionData;
				oController._ListCondJSonModel.setData({ Data: oSessionData });

                if ($.app.getAuth() === $.app.Auth.HASS) {
					oController._Hass = "X";
					
					oHassPerControl.setVisible(true);
                    oHassPerControl.getItems()[1].removeAllCustomData();
					oHassPerControl.getItems()[1].addCustomData(
						new sap.ui.core.CustomData({
							key: "Pernr",
							value: oController._vPernr
						})
					);
                } else {
                    oHassPerControl.setVisible(false);
                }

                $.app.byId(oController.PAGEID + "_HeadSel").addItem();
				
				$.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/MedicalBukrsImportSet",
                    { 
						Pernr: oController._vPernr,
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
            },

            onAfterShow: function () {
				$.app.byId(this.PAGEID + "_ApplyDate").setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
				
                this.getSelector();
                this.onSearch();
            },

            getBukrs: function (vDatum) {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                vDatum = Common.checkNull(vDatum) ? new Date() : moment(vDatum.getSource().getDateValue()).hours(10).toDate();
				
				oController._MedDate = vDatum;
				
                oModel.create(
                    "/MedicalBukrsImportSet",
                    { 
                        Pernr: oController._vPernr,
                        Datum: vDatum,
                        MedicalBukrsExport: []
                    },
                    {
                        success: function (data) {
                            if (data && data.MedicalBukrsExport.results) {
                                oController._Bukrs = data.MedicalBukrsExport.results[0].Bukrs;
                                if(oController._NewGubun === "O") {
                                    oController.onDialog("N", oController._Bukrs);
                                }else{
                                    oController.onDialog("M", oController._Bukrs);
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
                        }
                    }
                );
            },

            onAfterOpen: function () {
				var oController = $.app.getController();
								
                oController.getSelector("A");
                oController.getSelData();
				
				oController._tData.Chk1 = (oController._tData.Zfvcgb == "X") ? true : false;
				oController._tData.Chk2 = (oController._tData.Ziftgb == "X") ? true : false;
				
                oController._vArr1.forEach(function (fieldTxt) {
					var oPro = $.app.getController()._DataModel.getProperty("/Pop1/0");
					
					oPro[fieldTxt] = parseInt(oPro[fieldTxt]);
					
					if (fieldTxt === "Zmedrl" && oPro[fieldTxt] > 90000000) {
						oController._vC = oPro[fieldTxt];
						oPro[fieldTxt] = oController.getBundleText("MSG_47044");	// 한도 없음
						oController._DataModel.setProperty("/Pop1/0/" + fieldTxt, oPro[fieldTxt]);
                    } else {
						oController._DataModel.setProperty("/Pop1/0/" + fieldTxt, Common.numberWithCommas(oPro[fieldTxt]));
                    }
                });
				
				$.app.byId(oController.PAGEID + "_Dialog").bindElement("/Pop1/0");

				if(oController._Hass === "X") {
					EmpBasicInfoBoxCustomHass.setHeader(oController._vPernr);
					$.app.byId(oController.PAGEID + "_PerInfo").setVisible(true);
				} else {
					$.app.byId(oController.PAGEID + "_PerInfo").setVisible(false);
				}
				
				if (oController._NewGubun !== "O") {
					oController.changeSel2();
                }
            },

            onAfterLoad: function () {
                var oController = $.app.getController();
                var vStatus = oController._DataModel.getProperty("/Pop1/0").Status;
                var oHBtn = sap.ui.getCore().byId(oController.PAGEID + "_HideBtn");
                var oChk1 = $.app.byId(oController.PAGEID + "_Chk1");
				var oChk2 = $.app.byId(oController.PAGEID + "_Chk2");
                var vAppnm = "";
				var vEdit2 = false;
				
				vEdit2 = (vStatus === "AA" || vStatus === "88" || Common.checkNull(vStatus)) && oController._onClose !== "X" ? true : false;
				
				if(oController._onDialog === "M") {
					vAppnm = $.app.byId(oController.PAGEID + "_Dialog").getModel().getProperty("/Pop1/0").Appnm;
				}
				
                if(vEdit2) {
                    oHBtn.removeStyleClass("LabelCell border-left-no");
                } else {
                    oHBtn.addStyleClass("LabelCell border-left-no");
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
					
					COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: vAppnm,
						Required: false,
						Mode: "M",
						Max: "7",
						Cntnm: "009",
						Editable: vEdit2,
						UseMultiCategories: true
					}, "009");
                }, 10);
            },

            onAfterLoad2: function () {
                var oController = $.app.getController();
				var vStatus = oController._DataModel.getProperty("/Pop2/0").Status;
				var vEdit = true;
				var vAppnm = "";
				
				if(oController._onDialog === "M") {
					vAppnm = $.app.byId(oController.PAGEID + "_Dialog2").getModel().getProperty("/Pop2/0").Appnm;
				}

				vEdit = ((vStatus === "AA" || vStatus === "88" || Common.checkNull(vStatus)) && oController._onClose !== "X") ? true : false;
								
				setTimeout(function () {
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: vAppnm,
						Required: true,
						Mode: "M",
						Max: "15",
						Editable: vEdit
					}, "008");	
                }, 100);
            },

            onAfterOpen2: function () {
				var oController = $.app.getController();
				var oPro;
				
				oController.getSelector("A");
				
				oPro = oController._DataModel.getProperty("/Pop2/0");
				oController._vArr2.forEach(function (fieldTxt) {
					oController._DataModel.setProperty("/Pop2/0" + fieldTxt, Common.numberWithCommas(oPro[fieldTxt]));
                });
				
				if (oController._onDialog === "M") {
                    oController.getSelData2("B");
					$.app.byId(oController.PAGEID + "_dSel5").setSelectedKey(oPro.Relation);
					
					oController.onChange5("B");
					$.app.byId(oController.PAGEID + "_dSel6").setSelectedKey(oPro.PatiName);
                    $.app.byId(oController.PAGEID + "_dSel3").setSelectedKey(oPro.Gtz51);
                    $.app.byId(oController.PAGEID + "_dSel4").setSelectedKey(oPro.Gtz51s);
                } else {
                    oController.getSelData2();
				}
				
                $.app.byId(oController.PAGEID + "_Dialog2").bindElement("/Pop2/0");

				if(oController._Hass === "X") {
					$.app.byId(oController.PAGEID + "_PerInfo2").setVisible(true);
					EmpBasicInfoBoxCustomHass.setHeader(oController._vPernr);
				} else {
					$.app.byId(oController.PAGEID + "_PerInfo2").setVisible(false);
				}
            },

            onAfterOpen3: function (vDatum) {
                vDatum.setValue();
            },

            onSearchMed: function () {
                var oController = $.app.getController();
				
				if (!oController._miniPop) {
                    oController._miniPop = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.minipop", oController);
                    $.app.getView().addDependent(oController._miniPop);
                }
                oController._miniPop.open();
            },

            onClose: function () {
                var oController = $.app.getController();
				
				if (oController.oDialog.isOpen()) {
                    oController.oDialog.close();
                }
            },

            onClose2: function () {
                var oController = $.app.getController();
				
				if (oController.oDialog2.isOpen()) {
                    oController.oDialog2.close();
                }
            },

            onClose3: function () {
                var oController = $.app.getController();
				
				if (oController.oDialog3.isOpen()) {
                    oController.oDialog3.close();
                }
            },

            initTdata: function (Flag) {
                var oController = $.app.getController();
				
				oController._tData = {
                    MedDate: null,
                    Inpdt: null,
                    Begda: moment().hours(9).toDate(),
                    Endda: "/Date(" + moment().hours(9).toDate().getTime() + ")/",
                    HospType: "",
                    Kdsvh: "",
                    Pernr: oController._vPernr,
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
				
				if (oController._tData.MedDate === null) {
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
								
                oPro.Relation = oSel.getSelectedItem().getCustomData()[1].getValue("Data");
                oPro.RelationTx = oSel.getSelectedItem().getCustomData()[0].getValue("Data");
                
				if (oController._Bukrs === "1000" && (oPro.Status === "AA" || oPro.Status === "88" || Common.checkNull(oPro.Status)) && oController._onClose !== "X") {
                    if (oPro.HospType != "05") {
                        if (oPro.Relation != "01" && oPro.Relation != "02") {
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
				
				if (vSig != "R") {
                    oController.onChk1();
                    oController.onChk2();
                }
            },

            changeSel2: function (vSig) {
				var oController = $.app.getController();
				var oPop1 = oController._DataModel.getProperty("/Pop1/0");
                var oSel2 = $.app.byId(oController.PAGEID + "_dSel2");
				
				if (oSel2.getSelectedKey() == "05") {
                    $.app.byId(oController.PAGEID + "_Inp1").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp2").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp3").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp4").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp5").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp6").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp7").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp8").setValue("0").setEditable(false);
                    $.app.byId(oController.PAGEID + "_Inp9").setEditable(true);

                    oPop1.Chk1 = false;
                    oPop1.Chk2 = false;
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
				
				if(oController._onDialog !== "M") {
					oController.eqFunc();
				}
                oController.changeSel(vSig);
            },

            initFile: function (vPage) {
                var oController = $.app.getController();
                var oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX" + vPage),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table" + vPage),
                    oJSonModel = oAttachbox.getModel(),
                    vPath = "/Data/0",
                    vContexts = oJSonModel.getProperty(vPath);

                if (!vContexts) return;

                oTable.removeSelections(true);
            },

            onChk1: function () {
				var oController = $.app.getController();
				var oPop1 = $.app.byId(oController.PAGEID + "_Dialog").getModel().getProperty("/Pop1/0");
                var vAppnm = "";
				
				if(oController._onDialog === "M") {
					vAppnm = oPop1.Appnm;
				}
				
                if (oPop1.Chk1) {
					COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: true,
                        UseMultiCategories: true
					}, "001");
					COMMON_ATTACH_FILES.availLine.call(oController, "001");
					
					oPop1.Chk2 = false;
					oController.onChk2();
                } else {
					oController.initFile("001");
					
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: "",
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: false,
                        UseMultiCategories: true
					}, "001");
                }
            },

            onChk2: function () {
				var oController = $.app.getController();
				var oPop1 = oController._DataModel.getProperty("/Pop1/0");
                var vAppnm = "";
					
				if(oController._onDialog === "M") {
					vAppnm = oPop1.Appnm;
				}

				if (oPop1.Chk2) {
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: vAppnm,
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: true,
                        UseMultiCategories: true
					}, "002");
                    COMMON_ATTACH_FILES.availLine.call(oController, "002");

                    oPop1.Chk1 = false;
                    oController.onChk1();
                } else {
					oController.initFile("002");
					
                    COMMON_ATTACH_FILES.setAttachFile(oController, {
						Appnm: "",
                        Mode: "S",
                        Cntnm: "001",
                        Max: "1",
                        Label: "",
                        Editable: false,
                        UseMultiCategories: true
					}, "002");
                }
            },

            getSelData: function () {
				var oController = $.app.getController();
				var oSel = $.app.byId(oController.PAGEID + "_dSel1");
				var oSel2 = $.app.byId(oController.PAGEID + "_dSel2");
				
                oSel.removeAllItems();
                oSel.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),	// - 선택 -
                        key: ""
                    })
					.addCustomData(new sap.ui.core.CustomData({key: "Data", value: "" }))
					.addCustomData(new sap.ui.core.CustomData({key: "Data", value: "" }))
				);
				
                oSel2.removeAllItems();
                oSel2.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
					})
					.addCustomData(new sap.ui.core.CustomData({key: "Data", value: "" }))
				);
				
				oController._SelData.Sel1.forEach(function (e) {
                    oSel.addItem(
                        new sap.ui.core.Item({
                            text: e.Fname,
                            key: e.Fname
                        })
                        .addCustomData(new sap.ui.core.CustomData({key: "Data", value: e.RelationTxt}))
                        .addCustomData(new sap.ui.core.CustomData({key: "Data", value: e.Relation}))
                    );
				});
				
                $.app.getModel("ZHR_COMMON_SRV").create(
					"/CommonCodeListHeaderSet", 
					{
						ICodeT: "004",
						IPernr: oController._vPernr,
						IBukrs: oController._Bukrs,
						ICodty: "ZHOSP_TYPE",
						ILangu: "3",
						NavCommonCodeList: []
					},
					{
						success: function (data) {
							if (data && data.NavCommonCodeList.results.length) {
								data.NavCommonCodeList.results.forEach(function (e) {
									oSel2.addItem(new sap.ui.core.Item({text: e.Text, key: e.Code}));
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
					}
				);
            },

            getSelData2: function (vSig) {
                var oController = $.app.getController();
				var oSel3 = $.app.byId(oController.PAGEID + "_dSel3");
				var oSel4 = $.app.byId(oController.PAGEID + "_dSel4");
				var oSel5 = $.app.byId(oController.PAGEID + "_dSel5");
				var oSel6 = $.app.byId(oController.PAGEID + "_dSel6");
				
                if (oController._SelData.Sel3.length === 0) {
                    $.app.getModel("ZHR_COMMON_SRV").create(
						"/CommonCodeListHeaderSet",
						{
							ICodeT: "001",
							ICodty: "GTZ51",
							IBukrs: oController._Bukrs,
							IPernr: oController._vPernr, 
							ILangu: "3",
							NavCommonCodeList: []
						},
						{
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
						}
					);
				}
				
                oSel3.removeAllItems();
                oSel3.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),	// - 선택 -
                        key: ""
                    })
                );
				
				oController._SelData.Sel3.forEach(function (e) {
                    oSel3.addItem(new sap.ui.core.Item({text: e.Text, key: e.Code}));
                });
				
                oSel4.removeAllItems();
                oSel4.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),	// - 선택 -
                        key: ""
                    })
                );
				
                oSel5.removeAllItems();
                oSel5.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),	// - 선택 -
                        key: ""
					})
					.addCustomData(new sap.ui.core.CustomData({key: "Data", value: ""}))
				);
				
				var oA1 = [];
                var oA2 = [];
				
				oController._SelData.Sel5.forEach(function (e) {
                    oA1.push(e);
                });
				
				for (var i = 0; i < oA1.length; i++) {
                    if (i !== 0) {
                        if (oA1[i].Relation !== oA1[i - 1].Relation) {
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
						})
						.addCustomData(new sap.ui.core.CustomData({key: "Data", value: e}))
                    );
				});
				
                oSel6.removeAllItems();
                oSel6.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),	// - 선택 -
                        key: ""
                    })
				);
				
				if(vSig !== "B") {
					oSel3.setSelectedKey();
					oSel4.setSelectedKey();
					oSel5.setSelectedKey();
					oSel6.setSelectedKey();
				}
            },

            onDialog: function (New, Flag) {
				var oController = $.app.getController();
				
                if(oController._GubunBukrs !== Flag && oController._NewGubun === "X" && oController._GubunBukrs === "A100") {
                    MessageBox.error(oController.getBundleText("MSG_47045"), { title: oController.getBundleText("LABEL_00149")});
                    return ;
                }else if(oController._GubunBukrs !== Flag && oController._NewGubun === "X" && oController._GubunBukrs === "1000") {
                    MessageBox.error(oController.getBundleText("MSG_47046"), { title: oController.getBundleText("LABEL_00149")});
                    return ;
                }
                
                if (New === "N" || (New === "N" && oController._MedDateChange === "O" && oController._GubunBukrs !== Flag)) {
                    oController.initTdata(Flag);

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

				
				oController._onDialog = New;
				
                if (Flag === "1000") {
                    if (!oController.oDialog) {
                        oController.oDialog = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup", oController);
                        $.app.getView().addDependent(oController.oDialog);
					}
					
					setTimeout(function () {
                        if(!oController.oDialog.open()) oController.oDialog.open();
                        
                        if(oController.oDialog2) oController.oDialog2.close();
                    }, 10);
                } else if (Flag === "A100") {
                    if (!oController.oDialog2) {
                        oController.oDialog2 = sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup2", oController);
                        $.app.getView().addDependent(oController.oDialog2);
					}
					
					setTimeout(function () {
                        if(!oController.oDialog2.open()) oController.oDialog2.open();

                        if(oController.oDialog) oController.oDialog.close();
                    }, 10);
                }
            },

            oTableInit: function () {
                var oController = $.app.getController();
				var oTable = $.app.byId(oController.PAGEID + "_Table");
				
                oTable.destroyColumns();
                
                var columnModels = (oController._Bukrs === "1000") ? [
                    { id: "Begda", label: "{i18n>LABEL_47091}" /*신청일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "MedDate", label: "{i18n>LABEL_47092}" /*진료일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "PatiName", label: "{i18n>LABEL_47093}" /*환자명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "RelationTx", label: "{i18n>LABEL_47094}" /*관계*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "HospName", label: "{i18n>LABEL_47095}" /*의료기관명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%", align: "Begin" },
                    { id: "DiseName", label: "{i18n>LABEL_47096}" /*진료내용*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "18%", align: "Begin" },
                    { id: "MychargeT", label: "{i18n>LABEL_47097}" /*총 수납금액*/ , plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%", align: "End" },
                    { id: "SuppAmtT", label: "{i18n>LABEL_47098}" /*회사 지원금액*/ , plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%", align: "End" },
                    { id: "PayDateT", label: "{i18n>LABEL_47099}" /*지급(예정)년월*/ , plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "8%" },
                    { id: "StatusText", label: "{i18n>LABEL_47100}" /*결재상태*/ , plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "8%", templateGetter: "getStatus" }
                ] : [
                    { id: "Begda", label: "{i18n>LABEL_47108}" /*신청일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "MedDate", label: "{i18n>LABEL_47109}" /*진료일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "Inpdt", label: "{i18n>LABEL_47110}" /*보험사 지급일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "PatiName", label: "{i18n>LABEL_47111}" /*환자명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "RelationTx", label: "{i18n>LABEL_47112}" /*관계*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "HospName", label: "{i18n>LABEL_47113}" /*진료병원*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%", align: "Begin" },
                    { id: "Gtz51sT", label: "{i18n>LABEL_47114}" /*진료항목*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "18%", align: "Begin" },
                    { id: "FramtT", label: "{i18n>LABEL_47115}" /*회사 지원금액*/ , plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%", align: "End" },
                    { id: "PayDateT", label: "{i18n>LABEL_47116}" /*지급(예정)년월*/ , plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "8%" },
                    { id: "StatusText", label: "{i18n>LABEL_47117}" /*결재상태*/ , plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "8%", templateGetter: "getStatus" }
                ];

                ZHR_TABLES.makeColumn(oController, oTable, columnModels);
				
                // if (oController._Bukrs === "1000") {
                //     oFields = ["Begda", "MedDate", "PatiName", "RelationTx", "HospName", "DiseName", "MychargeT", "SuppAmtT", "PayDateT", "StatusText"];
                //     oWidths = ["", "", "", "", "100px", "200px", "", "", "", ""];
                //     oAligns = ["Center", "Center", "Center", "Center", "Begin", "Begin", "End", "End", "Center", "Center"];
				// 	oLabels = [];
					
                //     for (var i = 91; i < 101; i++) {
				// 		i = i < 100 ? "0" + i : i;
				// 		oLabels.push({ Label: "LABEL_47" + i, Width: oWidths[i - 91], Align: "Center" });
				// 	}
					
                //     oLabels.forEach(function (e, i) {
                //         var oCol = new sap.ui.table.Column({
                //             flexible: false,
                //             autoResizable: true,
                //             resizable: true,
                //             showFilterMenuEntry: true,
                //             filtered: false,
                //             sorted: false
                //         });
                //         oCol.setWidth(e.Width);
                //         oCol.setHAlign(e.Align);
				// 		oCol.setLabel(new sap.m.Text({ text: oBundleText.getText(e.Label), textAlign: e.Align }).addStyleClass("font-medium"));
						
                //         if (i < 2) {
                //             oCol.setTemplate(
                //                 new sap.ui.commons.TextView({
                //                     text: {
                //                         path: oFields[i],
                //                         type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                //                     },
                //                     textAlign: oAligns[i]
                //                 }).addStyleClass("FontFamily")
                //             );
                //         } else {
                //             oCol.setTemplate(new sap.ui.commons.TextView({ text: "{" + oFields[i] + "}", textAlign: oAligns[i] }).addStyleClass("FontFamily"));
                //         }
						
				// 		oTable.addColumn(oCol);
                //     });
                // } else {
                //     oFields = ["Begda", "MedDate", "Inpdt", "PatiName", "RelationTx", "HospName", "Gtz51sT", "FramtT", "PayDateT", "StatusText"];
                //     oWidths = ["", "", "", "", "", "200px", "200px", "", "", ""];
                //     oAligns = ["Center", "Center", "Center", "Center", "Center", "Begin", "Begin", "End", "Center", "Center"];
                //     oLabels = [];
					
				// 	for (var j = 108; j <= 117; j++) {
				// 		j = j < 100 ? "0" + j : j;
                //         oLabels.push({ Label: "LABEL_47" + j, Width: oWidths[j - 108], Align: "Center" });
                //     }
					
				// 	oLabels.forEach(function (e, i) {
                //         var oCol = new sap.ui.table.Column({
                //             flexible: false,
                //             autoResizable: true,
                //             resizable: true,
                //             showFilterMenuEntry: true,
                //             filtered: false,
                //             sorted: false
                //         });
                //         oCol.setWidth(e.Width);
                //         oCol.setHAlign(e.Align);
				// 		oCol.setLabel(new sap.m.Text({ text: oBundleText.getText(e.Label), textAlign: e.Align }).addStyleClass("font-medium"));
						
                //         if (i < 3) {
                //             oCol.setTemplate(
                //                 new sap.ui.commons.TextView({
                //                     text: {
                //                         path: oFields[i],
                //                         type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                //                     },
                //                     textAlign: oAligns[i]
                //                 }).addStyleClass("FontFamily")
                //             );
                //         } else {
                //             oCol.setTemplate(new sap.ui.commons.TextView({ text: "{" + oFields[i] + "}", textAlign: oAligns[i] }).addStyleClass("FontFamily"));
				// 		}
						
                //         oTable.addColumn(oCol);
                //     });
                // }
            },

            onMiniAdd: function () {
                var oController = $.app.getController();
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_dTable");
				var vSelectedIndexes = oTable.getSelectedIndices();
				
                if (vSelectedIndexes.length === 0) {
                    MessageBox.alert(oBundleText.getText("MSG_47008"));	// 추가 할 의료기관을 선택 해 주세요!
                    return;
				}
				
                MessageBox.alert(oBundleText.getText("MSG_47033"), {	// 선택한 사업자번호가 영수증과 일치하는지 확인하세요!
                    onClose: function () {
						var oData = oTable.getModel().getProperty("/oData")[vSelectedIndexes[0]];
						var oDialogModel = $.app.byId(oController.PAGEID + "_Dialog").getModel();
						
                        oDialogModel.setProperty("/Pop1/0/HospName", oData.HospName);
                        oDialogModel.setProperty("/Pop1/0/Comid", oData.Comid);
                        $.app.byId($.app.getController().PAGEID + "_miniDialog").close();
                    }
                });
            },

            clickNotice: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
                var oController = oView.getController();
				
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
                            MessageBox.alert(oBundleText.getText("MSG_35005"), {	// 저장 되었습니다.
                                title: oBundleText.getText("LABEL_35023"),	// 안내
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
					
					MessageBox.show(oBundleText.getText("MSG_35001"), {	// 저장 하시겠습니까?
                        icon: MessageBox.Icon.INFORMATION,
                        title: oBundleText.getText("LABEL_35023"),	// 안내
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
                        				content: new sap.m.Text({ text: oBundleText.getText("LABEL_47059") }).addStyleClass("Bold")	// 의료기관명
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
										content: new sap.m.Text({ text: oBundleText.getText("LABEL_47060") }).addStyleClass("Bold")	// 사업자번호
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
                        title: oBundleText.getText("LABEL_47057"),	// 의료기관 신규등록
                        buttons: [
							new sap.m.Button({ 
								text: oBundleText.getText("LABEL_47101"),	// 저장
								press: onSave 
							}).addStyleClass("button-search btn-margin"),
							new sap.m.Button({ 
								text: oBundleText.getText("LABEL_00133"), 	// 닫기
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

            onSearch: function (NoBukrs) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
				var oController = oView.getController();
				
				oController.initTdata();
				
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSessionData = oController._SessionData;
                var oSel = $.app.byId(oController.PAGEID + "_HeadSel");
                var vFirstDate = $.app.byId(oController.PAGEID + "_ApplyDate").getDateValue();
                var vSecondDate = $.app.byId(oController.PAGEID + "_ApplyDate").getSecondDateValue();
                var aData = { oData: [] };
				var oJSON = new sap.ui.model.json.JSONModel();
								
                setTimeout(function () {
                    oModel.create(
                        "/MedicalBukrsImportSet",
                        { 
							Pernr: oController._vPernr,
							Datum: moment().hours(10).toDate(), 
							MedicalBukrsExport: [] 
						},
                        {
                            success: function (data) {
                                if (data && data.MedicalBukrsExport.results) {
                                    if(NoBukrs !== "NoBukrs") {
                                        oController._Bukrs = data.MedicalBukrsExport.results[0].Bukrs;
                                    }
                                    oController.oTableInit();
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
					
                    var vData = {
                        IConType: "1",
                        IBukrs: oController._Bukrs,
                        IPernr: oController._vPernr,
                        IEmpid: oSessionData.Pernr,
                        ILangu: oSessionData.Langu,
                        IMolga: oSessionData.Molga,
                        IBegda: Common.adjustGMTOdataFormat(vFirstDate),
                        IEndda: vSecondDate,
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

                    oModel.create("/MedicalApplySet", vData, {
                        success: function (data) {
                            if (data && data.MedicalApplyTableIn.results.length) {
                                data.MedicalApplyTableIn.results.forEach(function (e) {
                                    aData.oData.push(e);
								});
								
								oTable.setVisibleRowCount(data.MedicalApplyTableIn.results.length > 10 ? 10 : data.MedicalApplyTableIn.results.length);
                            } else {
                                oTable.setVisibleRowCount(1);
							}
							
                            if (data && data.MedicalApplyExport.results.length) {
                                oController._onClose = data.MedicalApplyExport.results[0].Close;
                                oController._DataModel.setProperty("/Close", oController._onClose);
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
					oTable.bindRows("/oData");
										
					if (oController._onClose === "X" && oController._FirstTime === "X") {
                        MessageBox.alert(oController.getBundleText("MSG_47040"));	// 신청기간이 아닙니다.
                        oController._FirstTime = "";
                    }
					
					if(oController._onClose === "X") {
						$.app.byId(oController.PAGEID + "_NewBtn").setVisible(false);
						$.app.byId(oController.PAGEID + "_NewIcon").setVisible(true);
					} else {
						$.app.byId(oController.PAGEID + "_NewBtn").setVisible(true);
						$.app.byId(oController.PAGEID + "_NewIcon").setVisible(false);
					}
                }, 10);
            },

            onSelectedRow: function (oEvent) {
                var oController = $.app.getController();
                var sPath = oEvent.getParameters().rowBindingContext.sPath;
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oData = oTable.getModel().getProperty(sPath);
				
                oController._tData = $.extend(true, {}, oData);
                oController._vPernr = oData.Pernr;
                oController._tData.Close = oController._onClose;
                oController._Bukrs = oData.Bukrs;
                oController._GubunBukrs = oData.Bukrs;
                oController._NewGubun = "X";
                oController._MedDateChange = "X";

                if(oData.Bukrs === "A100") {
                    if(oController._tData.Ptamt !== "0") oController._tData.Ptamt = Common.numberWithCommas(oController._tData.Ptamt);
                    if(oController._tData.Medsp !== "0") oController._tData.Medsp = Common.numberWithCommas(oController._tData.Medsp);
                    if(oController._tData.Oiamt !== "0") oController._tData.Oiamt = Common.numberWithCommas(oController._tData.Oiamt);
                    if(oController._tData.Znobcm !== "0") oController._tData.Znobcm = Common.numberWithCommas(oController._tData.Znobcm);
                    if(oController._tData.Medpp !== "0") oController._tData.Medpp = Common.numberWithCommas(oController._tData.Medpp);
                    if(oController._tData.Insnp !== "0") oController._tData.Insnp = Common.numberWithCommas(oController._tData.Insnp);
                    if(oController._tData.Znobcd !== "0") oController._tData.Znobcd = Common.numberWithCommas(oController._tData.Znobcd);
                    if(oController._tData.Medmp !== "0") oController._tData.Medmp = Common.numberWithCommas(oController._tData.Medmp);
                    if(oController._tData.Inspp !== "0") oController._tData.Inspp = Common.numberWithCommas(oController._tData.Inspp);
                    if(oController._tData.Zdbcrl !== "0") oController._tData.Zdbcrl = Common.numberWithCommas(oController._tData.Zdbcrl);
                    if(oController._tData.Ziftrl !== "0") oController._tData.Ziftrl = Common.numberWithCommas(oController._tData.Ziftrl);
                    if(oController._tData.Framt !== "0") oController._tData.Framt = Common.numberWithCommas(oController._tData.Framt);

                    oController._DataModel.setData({
                        Pop1: [],
                        Pop2: [oController._tData] 
                    });
                }else {
                    oController._DataModel.setData({
                        Pop1: [oController._tData],
                        Pop2: [] 
                    });
                }
                
                oController.onDialog("M", oController._Bukrs);
            },

            onCloseDialog: function () {
                $.app.byId($.app.getController().PAGEID + "_Dialog").close();
            },

            onCloseDialog2: function () {
                $.app.byId($.app.getController().PAGEID + "_Dialog2").close();
            },

            onChange: function () {
                var oController = $.app.getController();
                var oSel = $.app.byId(oController.PAGEID + "_mSel");
				var oInp = $.app.byId(oController.PAGEID + "_mInput");
				
				oInp.setValue();
				
				if(oSel.getSelectedKey() === "1") {
					oInp.setMaxLength(50);
				} else {
					oInp.setMaxLength(10);
				}
            },

            onChange3: function (vSig) {
                var oController = $.app.getController();
                var oSel3 = $.app.byId(oController.PAGEID + "_dSel3");
                var oSel4 = $.app.byId(oController.PAGEID + "_dSel4");
				var oModel = $.app.getModel("ZHR_COMMON_SRV");
				
				oController._SelData.Sel4 = [];
				
                oModel.create(
					"/CommonCodeListHeaderSet",
					{
						ICodeT: "002",
						ICodty: "GTZ51",
						IBukrs: oController._Bukrs,
						IPernr: oController._vPernr,
						ICode: oSel3.getSelectedKey(),
						ILangu: "3",
						NavCommonCodeList: []
					},
					{
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
					}
				);

                oSel4.removeAllItems();
                oSel4.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
                oController._SelData.Sel4.forEach(function (e) {
                    oSel4.addItem(new sap.ui.core.Item({text: e.Text, key: e.Code}));
				});
				
				var oPro = $.app.byId(oController.PAGEID + "_Dialog2").getModel().getProperty("/Pop2/0");

                if (oSel3.getSelectedKey() === "A") {
                    oPro.Inspp = "250,000";
                } else if (oSel3.getSelectedKey() === "B") {
                    oPro.Inspp = "50,000";
                } else {
                    oPro.Inspp = "0";
				}
				
                if (oSel3.getSelectedKey() === "C" || oSel3.getSelectedKey() === "D") {
                    oPro.Inpdt = null;
				}

                if(typeof (vSig) === "object") {
                    if(vSig.getSource().getId() === "MedApply_dSel3")
                        oController._DataModel.setProperty("/Pop2/0/Gtz51", vSig.getSource().getSelectedKey());
                }
				
                if (vSig !== "B") {
                    oPro.Ptamt = "0";
                    oPro.Medsp = "0";
                    oPro.Oiamt = "0";
                    oPro.Znobcm = "0";
                    oPro.Insnp = "0";
					oPro.Medpp = "0";
					
					oSel4.setSelectedKey();
				}
                oController.onCal(oController._Bukrs);
				
                if (oController._onDialog !== "M") {
                    oController.eqFunc();
                }
            },

            onChange5: function (vSig) {
                var oController = $.app.getController();
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
                    oSel6.addItem(new sap.ui.core.Item({text: e.Fname, key: e.Fname}));
				});
				
                oSel3.removeAllItems();
                oSel3.addItem(
                    new sap.ui.core.Item({
                        text: oController.getBundleText("LABEL_00181"),
                        key: ""
                    })
				);
				
                if (oSel5.getSelectedKey() === "20" || oSel5.getSelectedKey() === "21") {
                    oController._SelData.Sel3.forEach(function (e) {
                        if (e.Code == "C") {
                            oSel3.addItem(new sap.ui.core.Item({text: e.Text, key: e.Code}));
                        }
                    });
                } else {
                    oController._SelData.Sel3.forEach(function (e) {
						oSel3.addItem(new sap.ui.core.Item({text: e.Text, key: e.Code}));
                    });
				}
				
				if(vSig !== "B") {
					oSel3.setSelectedKey();
					oSel6.setSelectedKey();
				}
				
				oController.onChange3(vSig);
            },

            onMiniSearch: function () {
                var oController = $.app.getController();
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
                    $.app.getModel("ZHR_BENEFIT_SRV").create(
						"/MedComidList2Set",
						vData,
						{
							success: function (data) {
								if (data && data.MedComidList2TableIn.results.length) {
									data.MedComidList2TableIn.results.forEach(function (e) {
										aData.oData.push(e);
									});

									oJSON.setData(aData);
									oTable.bindRows("/oData");
									oTable.setVisibleRowCount(data.MedComidList2TableIn.results.length > 10 ? 10 : data.MedComidList2TableIn.results.length);
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
						}
					);
					
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
                $.app.byId($.app.getController().PAGEID + "_miniDialog").close();
            },

            onFocusMini: function () {
                var oController = $.app.getController();
                var oInp = $.app.byId(oController.PAGEID + "_mInput");
                oInp.focus();
            },

            onMini: function () {
                var oController = $.app.getController();
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
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
				var oMsg = "";
				var oPro;
				
				oController = oView.getController();
				
				if (oController._Bukrs === "1000") {
					oPro = $.app.byId(oController.PAGEID + "_Dialog").getModel().getProperty("/Pop1/0");
					
                    if (oPro.MedDate == "" || oPro.MedDate == null) {
                        oMsg = oBundleText.getText("MSG_47011");	// 진료일을 입력 해 주세요.
                    }
                    if (oPro.Relation == "") {
                        oMsg = oBundleText.getText("MSG_47017");	// 관계를 입력 해 주세요.
                    }
                    if (oPro.HospType.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47019");	// 의료기관을 입력 해 주세요.
                    }
                    if (oPro.HospName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47012");	// 병원명을 입력 해 주세요.
                    }
                    if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == "" || $.app.byId(oController.PAGEID + "_dSel2").getSelectedKey() == "" || $.app.getController()._DataModel.getProperty("/Pop1")[0].DiseName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47034");	// 환자명을 입력하신 후 잔여한도를 확인하시기 바랍니다.
                    }

                    if (oPro.Zkibbm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oBundleText.getText("MSG_47021");	// 증빙자료를 업로드 해 주세요.
                    }
                    if (oPro.Zkijbm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oBundleText.getText("MSG_47021");	// 증빙자료를 업로드 해 주세요.
                    }
                    if (oPro.Znoctm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oBundleText.getText("MSG_47021");	// 증빙자료를 업로드 해 주세요.
                    }
                    if (oPro.Znocum.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oBundleText.getText("MSG_47021");	// 증빙자료를 업로드 해 주세요.
                    }
                    if (oPro.Znobcm.trim() != "0" && COMMON_ATTACH_FILES.getFileLength(oController, "009") === 0) {
                        oMsg = oBundleText.getText("MSG_47021");	// 증빙자료를 업로드 해 주세요.
                    }

                    if (oPro.Chk1 && COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
                        oMsg = oBundleText.getText("MSG_47031");	// 5대암 여부 첨부파일을 업로드 해 주세요.
                    }
                    if (oPro.Chk2 && COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
                        oMsg = oBundleText.getText("MSG_47032");	// 난임 여부 첨부파일을 업로드 해 주세요.
                    }
                    if (oPro.DiseName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47035");	// 진료내용을 입력 해 주세요.
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
					oPro = $.app.byId(oController.PAGEID + "_Dialog2").getModel().getProperty("/Pop2/0");
					
                    if (oPro.MedDate == "" || oPro.MedDate == null) {
                        oMsg = oBundleText.getText("MSG_47011");	// 진료일을 입력 해 주세요.
                    }
                    if (oPro.Relation == "") {
                        oMsg = oBundleText.getText("MSG_47017");	// 관계를 입력 해 주세요.
                    }
                    if (oPro.Gtz51.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47026");	// 의료비 구분을 입력 해 주세요.
                    }
                    if (oPro.Gtz51s.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47037");	// 진료항목을 입력 해 주세요.
                    }
                    if (oPro.PatiName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47018");	// 환자명을 입력 해 주세요.
                    }
                    if (oPro.Inpdt != null && oPro.Inpdt != "") {
                        if (new Date(oPro.MedDate.getFullYear(), oPro.MedDate.getMonth(), oPro.MedDate.getDate(), 9, 0, 0).getTime() > new Date(oPro.Inpdt.getFullYear(), oPro.Inpdt.getMonth(), oPro.Inpdt.getDate(), 9, 0, 0).getTime()) {
                            oMsg = oBundleText.getText("MSG_47041");	// 보험사 지급일을 진료일 이후로 입력 하십시오,
                        }
                    }
                    if (oPro.Gtz51 != "C" && oPro.Gtz51 != "D") {
                        if (oPro.Inpdt == "" || oPro.Inpdt == null) {
                            oMsg = oBundleText.getText("MSG_47015");	// 보험사 지급일을 입력 해 주세요.
                        }
                    }
                    if (oPro.HospName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47012");	// 병원명을 입력 해 주세요.
                    }
                    if (oPro.Recno.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47016");	// 영수증 번호를 입력 해 주세요.
                    }
                    if (oPro.DiseName.trim() == "") {
                        oMsg = oBundleText.getText("MSG_47027");	// 병명을 입력 해 주세요.
                    }
                    if (oPro.Gtz51 != "C" && oPro.Gtz51 != "D") {
                        if (oPro.Ptamt.trim() == "0") {
                            oMsg = oBundleText.getText("MSG_47028");	// 환자부담 총액을 입력 해 주세요.
                        }
                        if (oPro.Medsp.trim() == "0") {
                            oMsg = oBundleText.getText("MSG_47029");	// 급여 본인부담금을 입력 해 주세요.
                        }
                    }
                    if (oPro.Framt.trim() == "0") {
                        oMsg = oBundleText.getText("MSG_47036");	// 회사 지원금이 0원이면 신청 하실 수 없습니다.
                    }
                    if (COMMON_ATTACH_FILES.getFileLength(oController, "008") === 0) {
                        oMsg = oBundleText.getText("MSG_47030");	// 첨부파일을 업로드 해 주세요.
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

            onCal: function (vSig, vSig2) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
                var oController = oView.getController();
                var oSessionData = oController._SessionData;
				var vTmp = false;
				var oPro;
                var vData = { IConType: oController._NewGubun === "O" ? "C" : "H", IBukrs: vSig, IPernr: oController._vPernr, IEmpid: oSessionData.Pernr, ILangu: oSessionData.Langu, IMolga: oSessionData.Molga, MedicalApplyExport: [], MedicalApplyTableIn: [], MedicalApplyTableIn0: [], MedicalApplyTableIn3: [], MedicalApplyTableIn4: [], MedicalApplyTableIn5: [], MedicalApplyTableInH: [] };
				
				if (vSig === "1000") {
                    if ($.app.byId(oController.PAGEID + "_dSel1").getSelectedKey() == "") {
                        MessageBox.alert(oController.getBundleText("MSG_47034"));	// 환자명을 입력하신 후 잔여한도를 확인하시기 바랍니다.
                        return;
					}
					
					oPro = $.app.getController()._DataModel.getProperty("/Pop1/0");
					
                    if (oPro.Zmedrl == oController.getBundleText("MSG_47044")) {	// 한도 없음
                        oPro.Zmedrl = Common.numberWithCommas(oController._vC);
                    }
					
					vData.MedicalApplyTableIn.push(oPro);

                    if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(10).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }
                    if (oPro.MedDate != "" && oPro.MedDate != null && oPro.MedDate != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(10).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
					}
					
                    oController._vArr1.forEach(function (e) {
						vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
					});
					
					vData.IMedDate = oPro.MedDate;
					vData.MedicalApplyTableIn[0].Zfvcgb = vData.MedicalApplyTableIn[0].Chk1 ? "X" : "";
					vData.MedicalApplyTableIn[0].Ziftgb = vData.MedicalApplyTableIn[0].Chk2 ? "X" : "";
                    vData.MedicalApplyTableIn[0].PatiName = $.app.byId(oController.PAGEID + "_dSel1").getSelectedItem().getText();
                } else {
					oPro = oController._DataModel.getProperty("/Pop2/0");
					
					vData.MedicalApplyTableIn.push(oPro);
					
                    if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(10).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Begda = null;
                    }
                    if (oPro.Inpdt != "" && oPro.Inpdt != null && oPro.Inpdt != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].Inpdt = moment(vData.MedicalApplyTableIn[0].Inpdt).hours(10).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].Inpdt = null;
                    }
                    if (oPro.MedDate != "" && oPro.MedDate != null && oPro.MedDate != "Invalid Date") {
                        vData.MedicalApplyTableIn[0].MedDate = moment(vData.MedicalApplyTableIn[0].MedDate).hours(10).toDate();
                    } else {
                        vData.MedicalApplyTableIn[0].MedDate = null;
					}
					
                    oController._vArr2.forEach(function (e) {
						vData.MedicalApplyTableIn[0][e] = String(vData.MedicalApplyTableIn[0][e]).replace(/,/gi,'');
					});
					
					vData.IMedDate = oPro.MedDate;
				}
				
                delete vData.MedicalApplyTableIn[0].Close;
                delete vData.MedicalApplyTableIn[0].Chk1;
                delete vData.MedicalApplyTableIn[0].Chk2;
                delete vData.MedicalApplyTableIn[0].PayDate;

                vData.MedicalApplyTableIn[0].Waers = "KRW";
				
				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/MedicalApplySet",
					vData,
					{
						success: function (data) {
							if (data && data.MedicalApplyTableIn.results.length) {
								if (vSig == "1000") {
									var oJSON = $.app.byId(oController.PAGEID + "_Dialog").getModel();
									var aData = { Pop1: [], Pop2: [] };

									data.MedicalApplyTableIn.results.forEach(function (e) {
										aData.Pop1.push(e);
									});

									oJSON.setData(aData);
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
									
									$.app.byId(oController.PAGEID + "_Dialog2").getModel().setData(aData2);
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
					}
				);

                if (vSig === "1000") {
					oController._DataModel.setProperty("/Pop1/0/Chk1", vData.MedicalApplyTableIn[0].Zfvcgb === "X" ? true : false);
					oController._DataModel.setProperty("/Pop1/0/Chk2", vData.MedicalApplyTableIn[0].Ziftgb === "X" ? true : false);

                    oController._vArr1.forEach(function (e) {
						oPro = oController._DataModel.getProperty("/Pop1/0");
						oPro[e] = parseInt(oPro[e]);
						
						if (e === "Zmedrl" && oPro[e] > 100000000) {
							oController._vC = oPro.Zmedrl;
							oPro.Zmedrl = oController.getBundleText("MSG_47044");	// 한도 없음
							oController._DataModel.setProperty("/Pop1/0/" + e, oPro[e]);
                        } else {
							oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                        }
                    });
                } else {
                    oController._vArr2.forEach(function (e) {
						oPro = $.app.getController()._DataModel.getProperty("/Pop2/0");
						
						oPro[e] = parseInt(oPro[e]);
						oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                    });
				}
				
                return vTmp;
            },

            onSaveProcess: function (oController, vSig) {
				BusyIndicator.show(0);
				
                setTimeout(function () {
                    var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
                    var oController = oView.getController();
                    var oCal = oController.onCal(vSig, "S");
					var oSessionData = oController._SessionData;
					var oPro;
					
                    if (oCal) {
                        var vData = {
							IConType: oController._onDialog === "M" ? "2" : "3",
							IBukrs: vSig,
							IPernr: oController._vPernr,
							ILangu: oSessionData.Langu,
							IEmpid: oSessionData.Pernr,
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
							oPro = oController._DataModel.getProperty("/Pop1/0");

							vData.IMedDate = oPro.MedDate;

                            if (oPro.Zmedrl == oController.getBundleText("MSG_47044")) {	// 한도 없음
                                oPro.Zmedrl = Common.numberWithCommas(oController._vC);
							}
							
							vData.MedicalApplyTableIn.push(oPro);
							
                            if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                                vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(10).toDate();
                            } else {
                                vData.MedicalApplyTableIn[0].Begda = null;
							}
							
                            oController._vArr1.forEach(function (e) {
								vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
							});
							
							vData.MedicalApplyTableIn[0].Zfvcgb = vData.MedicalApplyTableIn[0].Chk1 ? "X" : "";
							vData.MedicalApplyTableIn[0].Ziftgb = vData.MedicalApplyTableIn[0].Chk2 ? "X" : "";
                        } else {
							vData.IMedDate = oController._DataModel.getProperty("/Pop2/0/MedDate");
							vData.MedicalApplyTableIn.push(oController._DataModel.getProperty("/Pop2/0"));
							
                            oController._vArr2.forEach(function (e) {
								vData.MedicalApplyTableIn[0][e] = vData.MedicalApplyTableIn[0][e].replace(/,/gi,'');
                            });
						}
						
                        var uFiles = [];

                        if (vSig === "1000") {
							oPro = oController._DataModel.getProperty("/Pop1/0");
							
                            if (oPro.Begda != "" && oPro.Begda != null && oPro.Begda != "Invalid Date") {
                                vData.MedicalApplyTableIn[0].Begda = moment(vData.MedicalApplyTableIn[0].Begda).hours(10).toDate();
                            } else {
                                vData.MedicalApplyTableIn[0].Begda = null;
                            }
                            if (oPro.Inpdt != "" && oPro.Inpdt != null && oPro.Inpdt != "Invalid Date") {
                                vData.MedicalApplyTableIn[0].Inpdt = moment(vData.MedicalApplyTableIn[0].Inpdt).hours(10).toDate();
                            } else {
                                vData.MedicalApplyTableIn[0].Inpdt = null;
							}
							
                            for (var i = 1; i <= 2; i++) {
								if(COMMON_ATTACH_FILES.getFileLength(oController, "00" + i) !== 0) {
									uFiles.push("00" + i);
								}
							}
							
							if(COMMON_ATTACH_FILES.getFileLength(oController, "009") !== 0) {
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
						
                        $.app.getModel("ZHR_BENEFIT_SRV").create("/MedicalApplySet", vData, {
                            success: function (data) {
                                if (data && data.MedicalApplyTableIn.results.length) {
                                    MessageBox.alert(oBundleText.getText("MSG_44002"), {	// 신청 되었습니다.
                                        title: oBundleText.getText("LABEL_35023"),	// 안내
                                        onClose: function () {
                                            if (vSig === "1000") {
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
                                                oController.onSearch("NoBukrs");
                                                oController.onAfterLoad();
                                                oController.changeSel2();
                                            } else {
                                                oController._DataModel.setData({ Pop1: [], Pop2: [{
                                                        MedDate : oPro.MedDate,
                                                        PatiName : oPro.PatiName,
                                                        RelationTx : oPro.RelationTx,
                                                        Relation : oPro.Relation,
                                                        HospType : oPro.HospType,
                                                        HospName : oPro.HospName,
                                                        Comid : oPro.Comid,
                                                        DiseName : oPro.DiseName,
                                                        Begda : oPro.Begda,
                                                        Inpdt : oPro.Inpdt,
                                                        Gtz51 : oPro.Gtz51,
                                                        Gtz51s : oPro.Gtz51s,
                                                        Recno : oPro.Recno,
                                                        Pdcnt : oPro.Pdcnt,
                                                        Remark : oPro.Remark,
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
                                                oController.onSearch("NoBukrs");
                                                oController.onAfterLoad2();
                                            }
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
						
                        if (vSig === "1000") {
							oController._DataModel.setProperty("/Pop1/0/Chk1", vData.MedicalApplyTableIn[0].Zfvcgb === "X" ? true : false);
							oController._DataModel.setProperty("/Pop1/0/Chk2", vData.MedicalApplyTableIn[0].Ziftgb === "X" ? true : false);
							
							oController._vArr1.forEach(function (e) {
								oPro = oController._DataModel.getProperty("/Pop1/0");
								
								oPro[e] = parseInt(oPro[e]);

                                if (e === "Zmedrl" && oPro[e] > 100000000) {
									oController._vC = oPro.Zmedrl;
									oPro.Zmedrl = oController.getBundleText("MSG_47044");	// 한도 없음
									oController._DataModel.setProperty("/Pop1/0/" + e, oPro[e]);
                                } else {
									oController._DataModel.setProperty("/Pop1/0/" + e, Common.numberWithCommas(oPro[e]));
                                }
                            });
                        } else {
                            oController._vArr2.forEach(function (e) {
								oPro = oController._DataModel.getProperty("/Pop2/0");
								
								oController._DataModel.setProperty("/Pop2/0/" + e, Common.numberWithCommas(oPro[e]));
                            });
                        }
					}
					
                    BusyIndicator.hide();
                }, 10);
            },

            onPressCancel: function(oEvent) {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oRowData = oTable.getModel().getProperty(vPath);

                var onPressCancel = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_47149")) { // 삭제

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = oController._vPernr;
                        sendObject.IBukrs = oController._Bukrs;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.MedicalApplyTableIn = [Common.copyByMetadata(oModel, "MedicalApplyTableIn", oRowData)];
                        
                        oModel.create("/MedicalApplySet", sendObject, {
                            success: function(oData, oResponse) {
                                    Common.log(oData);
                                    sap.m.MessageBox.alert(oController.getBundleText("MSG_57010"), { title: oController.getBundleText("MSG_08107")});
                                    oController.onSearch();
                            },
                            error: function(oResponse) {
                                Common.log(oResponse);
                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                            }
                        });
                    }
                };

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_57009"), {
                    title: oController.getBundleText("LABEL_47001"),
                    actions: [oController.getBundleText("LABEL_47149"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressCancel
                });
            },

            onSave: function (Sig) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_MedApply.MedApply");
                var oController = oView.getController();
				var oValid = oController.onValid(oController);
				
                if (oValid) {
                    MessageBox.show(oController.getBundleText("MSG_44001"), {	// 신청 하시겠습니까?
                        icon: MessageBox.Icon.INFORMATION,
                        title: oBundleText.getText("LABEL_35023"),	// 안내
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
                var oController = $.app.getController();
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
                                oController.onSearch();
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
                                oController.oDialog2.close();
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
                var oController = $.app.getController();
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
                                oController.onSearch();
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70009"), { title: oController.getBundleText("MSG_08107")});
                                oController.oDialog2.close();
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
            
            onDialogBaseSaveBtn: function() {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController._DataModel.getProperty("/Pop1/0");
                var oSessionData = oController._SessionData;

                if(oController.onValid(oController) === false) return;
                
                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_70047")) { //저장
                        var sendObject = {};
                        var uFiles = [];

                        if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") !== 0) uFiles.push("001");
                        if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") !== 0) uFiles.push("002");
                        if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "009") !== 0) uFiles.push("009");

                        // 첨부파일 저장
                        oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
                        oSendData.Waers = "KRW";
                        if(oSendData.Zmedrl === oController.getBundleText("MSG_47044")) oSendData.Zmedrl = "9992622744";
                        oSendData.Zfvcgb = (oSendData.Chk1) ? "X" : "";
                        oSendData.Ziftgb = (oSendData.Chk2) ? "X" : "";
    
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
                                oController.onSearch();
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
                                oController.oDialog.close();
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

            onDialogBaseDelBtn: function() {
                var oController = $.app.getController();
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
                        if(Common.checkNull(!oSendData.Zniiwm)) oSendData.Zniiwm =  oSendData.Zniiwm.replace(/\,/gi, "");
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
                                oController.onSearch();
                                BusyIndicator.hide();
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_70009"), { title: oController.getBundleText("MSG_08107")});
                                oController.oDialog.close();
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
                var s = oEvent.getParameter("value").trim();
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
				
                $.app.getController().eqFunc();
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
					oPro = $.app.getController()._DataModel.getProperty("/Pop2/0");
					
					oPro.Znobcd = Common.numberWithCommas(Math.round((parseInt(oPro.Znobcm.replace(/\,/gi, "")) * 0.5).toFixed(1)));
					
                    if ($.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() != "C" && $.app.byId(oController.PAGEID + "_dSel3").getSelectedKey() != "D") {
                        oPro.Medmp = Common.numberWithCommas(parseInt((parseInt(oPro.Medsp.replace(/\,/gi, "")) * 0.1 + parseInt(oPro.Medpp.replace(/\,/gi, "")) * 0.2).toFixed(1)));
                    } else {
                        oPro.Medmp = "0";
					}
					
                    if (oPro.Gtz51 == "D") {
						oPro.Framt = (parseInt(oPro.Ziftrl.replace(/\,/gi, "")) < parseInt(oPro.Medpp.replace(/\,/gi, ""))) ? oPro.Ziftrl : oPro.Medpp;
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
						oController._DataModel.setProperty("/Pop2/0/Framt", (parseFloat(oPro.Framt) < 0) ? "0" : Common.numberWithCommas(parseInt(oPro.Framt)));
                    }
                }
            },

            getUrl: function (sUrl) {
                var param = $.map(location.search.replace(/\?/, "").split(/&/), function (p) {
                    var pair = p.split(/=/);
                    if (pair[0] === "s4hana") {
                        return pair[1];
                    }
				})[0];
                var destination = Common.isPRD() || param === "legacy" ? "/s4hana" : "/s4hana-pjt";

                return destination + sUrl;
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20170097" });
                  }
                : null
        });
    }
);
