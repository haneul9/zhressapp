/* eslint-disable no-redeclare */
/* eslint-disable no-loop-func */
sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/SearchUser1",
		"common/SearchPrdArea",
		"common/SearchCode",
		"ZUI5_HR_ActApp/common/Common",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
    function (Common, CommonController, SearchUser1, SearchPrdArea, SearchCode, AcpAppCommon, JSONModel, BusyIndicator, MessageBox) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppPersonInfo"].join(".");

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "ActAppPersonInfo",

            ContentHeight: 0,
            OtherHeight: 90,

            _AddPersonDialog: null,
            _SerachOrgDialog: null,
            _PrdAreaSearchDialog: null,
            _SerachStellDialog: null,
            _SerachEmplyeeDialog: null,
            _CodeSearchDialog: null,
            _ChangeDateDialog: null,

            _vActionType: "",
            _vStatu: "",
            _vPersa: "",
            _vDocno: "",
            _vDocty: "",
            _vEntrs: "",
            _vReqno: "",
            _vActda: "",
            _vPernr: "",
            _vPercod: "",
            _oContext: null,

            _vPernrActda: "",
            _vPernrVoltid: "",

            _vUpdateData: null,

            _vFromPageId: "",

            _vActiveControl: null, //활성화된 발령내역 입력 항목
            _vActiveGroup: null,
            _vActiveMassn: null, //선택된 발령유형/사유
            _vSelectedTrfgr: "",
            _vSelectedPersg: "",
            _vSelectedPersk: "",
            _vSelectedBtrtl: "",
            _vSelectedZhgrade: "",
            _vSelectedAddZhgrade: "",
            _vWerksUpdateValue: "",
            _vHost_werks: "",
            _vRet_persa: "",

            _vSelectedTrfar: "",
            _vSelectedTrfgb: "",

            _vPreSelectedMassn: [],
            _vPreSelectedMassg: [],

            _vTableColumns: null,
            _vPositionnocopy: "",
            _vDefaultTableColumns: ["Docno", "VoltId", "Actda", "Pernr", "Infty", "Subty", "Objps", "Sprps", "Endda", "Begda", "Seqnr", "Numbr", "Isnew"],

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf ZUI5_HR_ActApp.ActAppPersonInfo
             */
            onInit: function () {
                this.setupView()
                    .getView().addEventDelegate({
                        onAfterShow: this.onAfterShow
                    }, this);

                this.ContentHeight = window.innerHeight - this.OtherHeight;

                var oScroller1 = $.app.byId(this.PAGEID + "_LeftScrollContainer");
                oScroller1.setHeight(this.ContentHeight + "px");
                var oScroller2 = $.app.byId(this.PAGEID + "_RightScrollContainer");
                oScroller2.setHeight(this.ContentHeight + "px");
            },

            onResizeWindow: function () {
                this.ContentHeight = window.innerHeight - this.OtherHeight;

                var oScroller1 = $.app.byId(this.PAGEID + "_LeftScrollContainer");
                oScroller1.setHeight(this.ContentHeight + "px");
                var oScroller2 = $.app.byId(this.PAGEID + "_RightScrollContainer");
                oScroller2.setHeight(this.ContentHeight + "px");

                var oGroupingInputLayout = $.app.byId(this.PAGEID + "_GroupingInputLayout");
                if (oGroupingInputLayout) {
                    oGroupingInputLayout.setHeight(this.ContentHeight - 180 + "px");
                }

                if (this._vActiveGroup && this._vActiveGroup.length > 0) {
                    oScroller2.setVertical(false);
                } else {
                    oScroller2.setVertical(true);
                }
            },

            onAfterShow: function (oEvent) {
                var oController = this;
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd"
                });

                var dataProcess = function () {
                    if (oEvent) {
                        this._vActionType = oEvent.data.actiontype;
                        this._vStatu = oEvent.data.Statu;
                        this._vReqno = oEvent.data.Reqno;
                        this._vDocno = oEvent.data.Docno;
                        this._vDocty = oEvent.data.Docty;
                        this._vEntrs = oEvent.data.Entrs;
                        this._vPersa = oEvent.data.Persa;
                        this._vActda = oEvent.data.Actda;
                        this._oContext = oEvent.data.context;
                        this._vFromPageId = oEvent.data.FromPageId;

                        this._vPercod = oEvent.data.Percod;
                        this._vPernr = oEvent.data.Pernr;
                        this._vPernrActda = oEvent.data.PernrActda;
                        this._vPernrVoltid = oEvent.data.PernrVoltId;
                    }

                    this.loadActionTypeList();

                    var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                    var oControl = $.app.byId(this.PAGEID + "_ADDPERSON_BTN");
                    var oList = $.app.byId(this.PAGEID + "_List");
                    var oSaveBtn = $.app.byId(this.PAGEID + "_SAVEPERSON_BTN");
                    var oActda = $.app.byId(this.PAGEID + "_Actda");
                    var oChangeDate = $.app.byId(this.PAGEID + "_ChangeDate");
                    var oAllSel = $.app.byId(this.PAGEID + "_ALLSELECT_BTN");
                    var oAllUnSel = $.app.byId(this.PAGEID + "_ALLUNSELECT_BTN");
                    var oPageTitle = $.app.byId(this.PAGEID + "_PAGETITLE");
                    var oIssuedTypeMatrix2 = $.app.byId(this.PAGEID + "_IssuedTypeMatrix2"); //
                    var oReasonSwitch = $.app.byId(this.PAGEID + "_Reason_Switch");
                    var oInputSwith = $.app.byId(this.PAGEID + "_Input_Switch");

                    if (oInputSwith.getState() === true) oInputSwith.setState(false);

                    oIssuedTypeMatrix2.setVisible(false);
                    oReasonSwitch.setState(false);

                    this.initInputControl(this);

                    if (this._vActionType == "200") {
                        this._vPercod = oEvent.data.Percod;
                        this._vPernr = oEvent.data.Pernr;

                        oControl.setVisible(false);
                        oAllSel.setVisible(false);
                        oAllUnSel.setVisible(false);
                        oList.setMode(sap.m.ListMode.None);
                        oSaveBtn.setEnabled(true);
                        oActda.setValue(dateFormat.format(new Date(oEvent.data.PernrActda)));
                        oActda.setEnabled(false);
                        oChangeDate.setVisible(true);

                        oPageTitle.setText(oController.getBundleText("LABEL_02253"));

                        this.setUpdateData(this, oEvent.data.Percod, oEvent.data.PernrActda, oEvent.data.PernrVoltId);
                    } else if (this._vActionType == "300") {
                        this._vPercod = oEvent.data.Percod;
                        if (this._vPercod == undefined) this._vPercod = "";

                        this._vPernr = oEvent.data.Pernr;
                        if (this._vPernr == undefined) this._vPernr = "";

                        oList.setMode(sap.m.ListMode.MultiSelect);
                        this.setMultiPersonData(this);

                        this._vUpdateData = null;

                        oControl.setVisible(false);
                        oAllSel.setVisible(true);
                        oAllUnSel.setVisible(true);
                        oSaveBtn.setEnabled(true);
                        oActda.setValue(this._vActda);
                        oActda.setEnabled(true);
                        oChangeDate.setVisible(false);

                        for (var i = 0; i < 5; i++) {
                            var oMassg = $.app.byId(this.PAGEID + "_Massg" + (i + 1));
                            oMassg.setEnabled(false);
                            oMassg.removeAllItems();
                        }

                        oPageTitle.setText(oController.getBundleText("LABEL_02254"));
                    } else if (this._vActionType == "100") {
                        this._vUpdateData = null;

                        this._vPercod = "";
                        this._vPernr = "";

                        oActda.setValue(this._vActda);
                        oActda.setEnabled(true);
                        oChangeDate.setVisible(false);

                        oList.setMode(sap.m.ListMode.MultiSelect);
                        oControl.setVisible(true);
                        oAllSel.setVisible(true);
                        oAllUnSel.setVisible(true);

                        mActionSubjectList_Temp.setData(null);

                        for (var j = 0; j < 5; j++) {
                            var oMassn1 = $.app.byId(this.PAGEID + "_Massn" + (j + 1));
                            var oMassg1 = $.app.byId(this.PAGEID + "_Massg" + (j + 1));

                            oMassn1.setEnabled(false);
                            oMassg1.setEnabled(false);
                            oMassg1.removeAllItems();
                        }

                        oSaveBtn.setEnabled(false);

                        oPageTitle.setText(oController.getBundleText("LABEL_02254"));

                        this.addPerson();
                    }

                    try {
                        var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                        var sPath = oModel.createKey("ActionReqListSet", {
                            Docno: this._vDocno
                        });

                        oModel.read(sPath, {
                            async: false,
                            success: function (oData) {
                                if (oData) {
                                    oController._vPositionnocopy = oData.Positionnocopy;
                                }
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                            }
                        });
                    } catch (ex) {
                        Common.log(ex);
                    }

                    BusyIndicator.hide();
                }.bind(this);

                BusyIndicator.show(0);

                setTimeout(dataProcess, 300);
            },

            getActionInputFieldSet: function (oController, Massn, Massg) {

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionInputFieldSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
						new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, Massn),
						new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, Massg),
						new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController._vPercod),
                        new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
                        new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                var isExists = false;
                                for (var j = 0; j < oController._vActiveControl.length; j++) {
                                    if (oController._vActiveControl[j].Fieldname == oData.results[i].Fieldname) {
                                        if (oData.results[i].Incat.substring(0, 1) == "M") {
                                            oController._vActiveControl[j].Incat = oData.results[i].Incat;
                                        }
                                        isExists = true;
                                        break;
                                    }
                                }
                                if (isExists == false) {
                                    oController._vActiveControl.push(oData.results[i]);
                                }
                            }
                        }
                    },
                    error: function (oError) {
                        var Err = {},
                            vErrMsg = "";
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            vErrMsg = Err.error.innererror.errordetails[0].message;
                        } else {
                            vErrMsg = oError;
                        }
                        Common.showErrorMessage(vErrMsg);
                    }
                });
            },

            getActionDetailLayoutInfoSet: function (oController, Massn, Massg) {

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionDetailLayoutInfoSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
						new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, Massn),
						new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, Massg),
                        new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController._vPercod),
                        new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].Itgrp == "") {
                                    continue;
                                }
                                var isExists = false;
                                for (var j = 0; j < oController._vActiveGroup.length; j++) {
                                    if (oController._vActiveGroup[j].Itgrp == oData.results[i].Itgrp) {
                                        isExists = true;
                                        break;
                                    }
                                }
                                if (isExists == false) {
                                    oController._vActiveGroup.push(oData.results[i]);
                                }
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            setUpdateData: function (oController, Percod, Actda, VoltId) {
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var vBeforeData = {
                    Orgeh_Tx: ""
                };

                oController._vUpdateData = {};

                oModel.read("/ActionSubjectListSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, Percod),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, VoltId),
                        new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(Actda))),
                        new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            oController._vUpdateData = oData.results[0];
                            if (oData.results.length == 2) {
                                vBeforeData = oData.results[1];
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                var vSelectedMassn1 = oController._vUpdateData.Massn1;
                if (vSelectedMassn1 == "") {
                    MessageBox.alert(oController.getBundleText("MSG_02056"), {
                        onClose: function () {
                            oController.navToBack();
                            return;
                        }
                    });
                }

                oController._vActiveControl = [];
                oController._vActiveMassn = [];

                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                var vActionSubjectList_Temp = {
                    ActionSubjectListSet: []
                };
                vActionSubjectList_Temp.ActionSubjectListSet.push({
                    Percod: oController._vUpdateData.Percod,
                    Ename: oController._vUpdateData.Ename,
                    Fulln: vBeforeData.Orgeh_Tx,
                    Zzjobgrtx: vBeforeData.Zzjobgr_Tx,
                    Zzcaltltx: vBeforeData.Zzcaltl_Tx,
                    Zzpsgrptx: vBeforeData.Zzpsgrp_Tx,
                    Photo: oController._vUpdateData.Photo
                });
                mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

                var vMassns = [];
                var vMassgs = [];
                for (var i = 0; i < 5; i++) {
                    vMassns.push(oController._vUpdateData["Massn" + String(i + 1)]);
                    vMassgs.push(oController._vUpdateData["Massg" + String(i + 1)]);
                }

                for (var j = 0; j < 5; j++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));

                    oMassn.setEnabled(true);

                    if (vMassns[j] != "") {
                        oMassn.setSelectedKey(vMassns[j]);

                        var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (j + 1));
                        oMassg.destroyItems();

                        oModel.read("/ActionReasonListSet", {
                            async: false,
                            filters: [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
								new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
								new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vMassns[j])
							],
                            success: function (oData) {
                                if (oData.results && oData.results.length) {
                                    oMassg.addItem(
                                        new sap.ui.core.Item({
                                            key: "0000",
                                            text: oController.getBundleText("LABEL_02035")
                                        })
                                    );
                                    for (var k = 0; k < oData.results.length; k++) {
                                        oMassg.addItem(
                                            new sap.ui.core.Item({
                                                key: oData.results[k].Massg,
                                                text: oData.results[k].Mgtxt
                                            })
                                        );
                                    }
                                }
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                            }
                        });

                        oMassg.setEnabled(true);
                        oMassg.setSelectedKey(vMassgs[j]);
                    }
                }

                //발령유형이 채용, 겸직/겸무, 휴직, 퇴사의 경우 1개의 발령유형만 선택가능하다.
                if (vSelectedMassn1 == "10" || vSelectedMassn1 == "60" || vSelectedMassn1 == "90") {
                    for (var m = 1; m < 5; m++) {
                        var oMassn2 = $.app.byId(oController.PAGEID + "_Massn" + (m + 1));
                        var oMassg2 = $.app.byId(oController.PAGEID + "_Massg" + (m + 1));
                        oMassn2.setEnabled(false);
                        oMassg2.setEnabled(false);
                    }
                }

                //활설화 입력항목을 가져온다.
                // var fMassnCompany = false;
                var fMassnCompany = true;

                for (var n = 0; n < 5; n++) {
                    if (vMassns[n] != "" && vMassgs[n] != "") {
                        oController._vActiveMassn.push({
                            Massn: vMassns[n],
                            Massg: vMassgs[n]
                        });

                        // //발령유형이 법인간 발령계획 일 떄 인사연역, 인사하위영역을 ??? 한다.
                        // if (vMassns[n] == "81" || vMassns[n] == "ZA") {
                        //     fMassnCompany = true;
                        // }
                        // //발령유형이 퇴사이고 발령사유가 전출인 경우 일 떄 인사연역, 인사하위영역을 ??? 한다.
                        // if (vMassns[n] == "92" && vMassgs[n] == "20") {
                        //     fMassnCompany = true;
                        // }

                        oController.getActionInputFieldSet(oController, vMassns[n], vMassgs[n]);

                        oController.getActionDetailLayoutInfoSet(oController, vMassns[n], vMassgs[n]);
                    }
                }

                if (oController._vActiveGroup && oController._vActiveGroup.length > 0) {
                    oController._vActiveGroup.push({
                        Itgrp: "",
                        Itgrptx: "  "
                    });

                    oController.setGroupInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
                } else {
                    oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
                }

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setEnabled(true);
                oInputSwith.setState(true);

                //발령유형이 Multi 이면 발령유형/사유 선택을 Multi 화 한다.
                var oIssuedTypeMatrix2 = $.app.byId(oController.PAGEID + "_IssuedTypeMatrix2"); //
                var oReasonSwitch = $.app.byId(oController.PAGEID + "_Reason_Switch");

                if (oController._vActiveMassn.length > 1) {
                    oIssuedTypeMatrix2.setVisible(true);
                    oReasonSwitch.setState(true);
                } else {
                    oIssuedTypeMatrix2.setVisible(false);
                    oReasonSwitch.setState(false);
                }

                for (var o = 0; o < 5; o++) {
                    var oMassn3 = $.app.byId(oController.PAGEID + "_Massn" + (o + 1));
                    var oMassg3 = $.app.byId(oController.PAGEID + "_Massg" + (o + 1));
                    if (oMassn3) {
                        oController._vPreSelectedMassn[o] = oMassn3.getSelectedKey();
                    }
                    if (oMassg3) {
                        oController._vPreSelectedMassg[o] = oMassg3.getSelectedKey();
                    }
                }
            },

            setMultiPersonData: function (oController) {
                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                var vActionSubjectList_Temp = {
                    ActionSubjectListSet: []
                };

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionSubjectListSet", {
                    async: false,
                    filters: [
                        new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
                        new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].Batyp == "A" && oData.results[i].Massn1 == "") {
                                    vActionSubjectList_Temp.ActionSubjectListSet.push({
                                        Percod: oData.results[i].Percod,
                                        Ename: oData.results[i].Ename,
                                        Fulln: oData.results[i].Orgeh_Tx,
                                        Photo: oData.results[i].Photo
                                    });
                                }
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                if (vActionSubjectList_Temp.ActionSubjectListSet.length < 1) {
                    MessageBox.alert(oController.getBundleText("MSG_02057"), {
                        onClose: function () {
                            oController.navToBack();
                            return;
                        }
                    });
                }
                mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

                for (var i = 0; i < 5; i++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                    var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));
                    oMassn.setEnabled(false);
                    if (oController._vDocty != "50") {
                        oMassg.setEnabled(false);
                    } else {
                        if (i == 0) {
                            oMassg.setEnabled(true);
                        }
                    }
                }

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setEnabled(true);

                var setSelectedItem = function () {
                    var oList = $.app.byId(oController.PAGEID + "_List");
                    oList.removeSelections(true);

                    var oItems = oList.getItems();
                    if (oItems && oItems.length) {
                        for (var i = 0; i < oItems.length; i++) {
                            oList.setSelectedItem(oItems[i], true);
                        }
                    }
                };

                setTimeout(setSelectedItem, 300);

                for (var j = 0; j < 5; j++) {
                    var oMassn2 = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                    oMassn2.setEnabled(true);
                    if (oController._vDocty != "50") oMassn2.setSelectedKey("0000");
                }
            },

            loadActionTypeList: function () {
                if (!this._vPersa || !this._vActda || !this._vDocno) {
                    return;
                }

                var aFilters = [
					new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, this._vPersa),
					new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, this._vActda),
					new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, this._vDocno)
				];

                var oController = this;

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionTypeListSet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < 5; i++) {
                                var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                                if (oMassn) {
                                    oMassn.removeAllItems();
                                    oMassn.addItem(
                                        new sap.ui.core.Item({
                                            key: "0000",
                                            text: oController.getBundleText("LABEL_02035")
                                        })
                                    );
                                    for (var j = 0; j < oData.results.length; j++) {
                                        oMassn.addItem(
                                            new sap.ui.core.Item({
                                                key: oData.results[j].Massn,
                                                text: oData.results[j].Mntxt
                                            })
                                        );
                                    }
                                }
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            navToBack: function () {
                var oController = $.app.getController(SUB_APP_ID);

                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: oController._vFromPageId,
                        data: {
                            context: oController._oContext,
                            Statu: oController._vStatu,
                            Reqno: oController._vReqno,
                            Docno: oController._vDocno,
                            Docty: oController._vDocty,
                            Entrs: oController._vEntrs
                        }
                    });
            },

            addPerson: function () {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                //각 발령대상자의 발령일을 검색조건으로 설정한다.
                var oActda = $.app.byId(oController.PAGEID + "_Actda");
                if (oActda) oController._vActda = oActda.getValue();

                SearchUser1.oController = oController;
                SearchUser1.fPersaEnabled = true;
                SearchUser1.searchAuth = "A";

                if (!oController._AddPersonDialog) {
                    oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
                    oView.addDependent(oController._AddPersonDialog);
                }
                oController._AddPersonDialog.open();
            },

            onESSelectPerson: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oTable = $.app.byId(oController.PAGEID + "_EmpSearchResult_Table");
                var sIndexs = oTable.getSelectedIndices();
                var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
                var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                var vActionSubjectList_Temp = {
                    ActionSubjectListSet: []
                };

                if (vEmpSearchResult && vEmpSearchResult.length) {
                    var vActionSubjectListSet = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");

                    if (vActionSubjectListSet && vActionSubjectListSet.length) {
                        vActionSubjectListSet.forEach(function (elem) {
                            vActionSubjectList_Temp.ActionSubjectListSet.push(elem);
                        });
                    }

                    vEmpSearchResult.forEach(function (elem, index) {
                        if (sIndexs.indexOf(index) > -1) {
                            vActionSubjectList_Temp.ActionSubjectListSet.push({
                                Percod: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Percod"),
                                Ename: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Ename"),
                                Fulln: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Fulln"),
                                Photo: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Photo"),
                                Zzjobgrtx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Zzjobgrtx"),
                                Zzcaltltx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Zzcaltltx"),
                                Zzpsgrptx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + index + "/Zzpsgrptx")
                            });
                        }
                    });
                    mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

                    var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                    oInputSwith.setEnabled(true);

                    //선택된 사용자를 리스트에서 선택한 것으로 설정하고 발령유형을 활성화한다.
                    var oList = $.app.byId(oController.PAGEID + "_List");
                    var oItems = oList.getItems();
                    if (oItems && oItems.length) {
                        for (var i = 0; i < oItems.length; i++) {
                            oList.setSelectedItem(oItems[i], true);
                        }
                    }

                    for (var j = 0; j < 5; j++) {
                        var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                        oMassn.setEnabled(true);
                        oMassn.setSelectedKey("0000");
                    }
                } else {
                    MessageBox.alert(oController.getBundleText("MSG_02050"));
                    return;
                }

                SearchUser1.onClose();
            },

            onSelectPersonList: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oList = oEvent.getSource();
                var oItems = oList.getSelectedItems();
                var fEnabled = false;

                if (oItems.length > 0) fEnabled = true;
                else fEnabled = false;

                for (var i = 0; i < 5; i++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                    oMassn.setEnabled(fEnabled);
                    if (!fEnabled) oMassn.setSelectedKey("0000");

                    var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));
                    if (!fEnabled) {
                        oMassg.setEnabled(fEnabled);
                        oMassg.removeAllItems();
                    }
                }

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                if (!fEnabled) {
                    oController.initInputControl(oController);
                    oInputSwith.setState(false);
                }

                oController._vPercod = "";
                oController._vPernr = "";

                if (oController._vActionType == "300") {
                    for (var j = 1; j < 5; j++) {
                        var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                        var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + (j + 1));
                        oMassn1.setEnabled(false);
                        oMassg1.setEnabled(false);
                    }
                }
            },

            onChangeMassn: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var vControl = oEvent.getSource();
                var vControlId = oEvent.getSource().getId();
                var oInputSwitch = $.app.byId(oController.PAGEID + "_Input_Switch");
                var str = vControlId.substring(vControlId.length - 1);
                var vprekey = oController._vPreSelectedMassn[parseInt(str) - 1];

                // 발령내역을 기입 후 발령유형 변경 시 확인 message 출력
                if (oInputSwitch.getState() == true && vprekey != vControl.getSelectedKey()) {
                    MessageBox.show(oController.getBundleText("MSG_02109"), {
                        icon: MessageBox.Icon.INFORMATION,
                        title: "Confirm",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                oInputSwitch.setState(false);
                                oController.onChangeMassnR(vControlId);
                            } else {
                                // 이전에 입력된 key 로 select 한다.
                                vControl.setSelectedKey(vprekey);
                            }
                        }
                    });
                } else if (oInputSwitch.getState() == true && vprekey == vControl.getSelectedKey()) {
                    return;
                } else {
                    oController.onChangeMassnR(vControlId);
                }
            },

            onChangeMassnR: function (vControlId) {
                var oController = $.app.getController(SUB_APP_ID);
                var vSelectedItem = null;
                var vSelectedKey = "";
                var vControl_Idx = "";

                if (vControlId) {
                    vSelectedItem = $.app.byId(vControlId).getSelectedItem();
                    vSelectedKey = vSelectedItem.getKey();
                    vControl_Idx = vControlId.substring(vControlId.length - 1);
                }

                //발령유형이 채용, 겸직/겸무, 휴직, 퇴사의 경우 1개의 발령유형만 선택가능하다.  10, 11, 15, 60, 61, 90, 91
                if (vSelectedKey != "0000") {
                    if (vControl_Idx == "1") {
                        for (var i = 2; i <= 5; i++) {
                            var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + i);
                            var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + i);

                            if (["10", "11", "60", "61", "90", "91"].indexOf(vSelectedKey) > -1) {
                                oMassn1.setEnabled(false);
                                oMassg1.setEnabled(false);
                            } else {
                                oMassn1.setEnabled(true);
                                oMassg1.setEnabled(true);
                            }
                        }
                    } else {
                        if (["10", "11", "60", "61", "90", "91"].indexOf(vSelectedKey) > -1) {
                            MessageBox.alert(oController.getBundleText("MSG_02110"));

                            for (var j = 1; j <= 5; j++) {
                                var oMassn2 = $.app.byId(oController.PAGEID + "_Massn" + j);
                                var oMassg2 = $.app.byId(oController.PAGEID + "_Massg" + j);

                                oMassn2.setEnabled(true);
                                oMassn2.setSelectedKey("0000");
                                oMassg2.setEnabled(true);
                                oMassg2.removeAllItems();
                            }

                            return;
                        }
                    }
                }

                var oMassg = $.app.byId(oController.PAGEID + "_Massg" + vControl_Idx);

                if (vSelectedKey == "0000") {
                    oMassg.setEnabled(false);
                    oMassg.removeAllItems();
                } else {
                    oMassg.removeAllItems();
                    oMassg.setEnabled(true);

                    $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionReasonListSet", {
                        async: false,
                        filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
							new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vSelectedKey)
						],
                        success: function (oData) {
                            if (oData.results && oData.results.length) {
                                oMassg.addItem(
                                    new sap.ui.core.Item({
                                        key: "0000",
                                        text: oController.getBundleText("LABEL_02035")
                                    })
                                );
                                for (var i = 0; i < oData.results.length; i++) {
                                    oMassg.addItem(
                                        new sap.ui.core.Item({
                                            key: oData.results[i].Massg,
                                            text: oData.results[i].Mgtxt
                                        })
                                    );
                                }

                                oMassg.setSelectedKey("0000");
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                        }
                    });
                }

                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                oSaveBtn.setEnabled(false);

                oController.initInputControl(oController);
            },

            onSetDefaultMassg: function (oController, vSelectedKey, vControl_Idx) {
                var oMassg = $.app.byId(oController.PAGEID + "_Massg" + vControl_Idx);

                oMassg.removeAllItems();
                oMassg.setEnabled(true);

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionReasonListSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
						new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vSelectedKey)
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            oMassg.addItem(
                                new sap.ui.core.Item({
                                    key: "0000",
                                    text: oController.getBundleText("LABEL_02035")
                                })
                            );
                            for (var i = 0; i < oData.results.length; i++) {
                                oMassg.addItem(
                                    new sap.ui.core.Item({
                                        key: oData.results[i].Massg,
                                        text: oData.results[i].Mgtxt
                                    })
                                );
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                oMassg.setSelectedKey("10");

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setState(false);
                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                oSaveBtn.setEnabled(false);
            },

            onChangeMassg: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var vControl = oEvent.getSource();
                var vControlId = oEvent.getSource().getId();
                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                var str = vControlId.substring(vControlId.length - 1);
                var vprekey = oController._vPreSelectedMassg[parseInt(str) - 1];

                // 발령내역을 기입 후 발령유형 변경 시 확인 message 출력
                if (oInputSwith.getState() == true && vprekey != vControl.getSelectedKey()) {
                    MessageBox.show(oController.getBundleText("MSG_02109"), {
                        icon: MessageBox.Icon.INFORMATION,
                        title: "Confirm",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                oInputSwith.setState(false);
                                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                                oSaveBtn.setEnabled(false);
                                //		        		oController._vPreSelectedMassg[parseInt(str) -1] = vControl.getSelectedKey();
                                oController.initInputControl(oController);
                            } else {
                                // 이전에 입력된 key 로 select 한다.
                                vControl.setSelectedKey(vprekey);
                            }
                        }
                    });
                    return;
                }
            },

            onChangeReasonSwitch: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oIssuedTypeMatrix2 = $.app.byId(oController.PAGEID + "_IssuedTypeMatrix2");

                if (oEvent.getParameter("state") == false) {
                    oIssuedTypeMatrix2.setVisible(false);
                } else {
                    oIssuedTypeMatrix2.setVisible(true);
                }
            },

            onChangeSwitch: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var vState = oEvent.getParameter("state");

                var Process = function () {
                    for (var i = 0; i < 5; i++) {
                        var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (i + 1));
                        var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (i + 1));
                        if (oMassn) {
                            oController._vPreSelectedMassn[i] = oMassn.getSelectedKey();
                        }
                        if (oMassg) {
                            oController._vPreSelectedMassg[i] = oMassg.getSelectedKey();
                        }
                    }

                    if (vState == false) {
                        MessageBox.show(oController.getBundleText("MSG_02109"), {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "Confirm",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.YES) {
                                    oController.initInputControl(oController);
                                } else {
                                    oControl.setState(true);
                                }
                            }
                        });
                        //			oController.initInputControl(oController);
                        BusyIndicator.hide();
                        return;
                    }

                    var isValid = true;
                    var vSelectMassnCnt = 0;
                    // var fMassnCompany = false;
                    var fMassnCompany = true;

                    if (oController._vPernr == "") {
                        var oList1 = $.app.byId(oController.PAGEID + "_List");
                        var mTmpModel = oList1.getModel();

                        if (oList1.getMode() == sap.m.ListMode.MultiSelect) {
                            var vSelectedItems = oList1.getSelectedContexts(true);
                            if (vSelectedItems && vSelectedItems.length) {
                                oController._vPernr = mTmpModel.getProperty(vSelectedItems[0] + "/Pernr");
                                oController._vPercod = mTmpModel.getProperty(vSelectedItems[0] + "/Percod");
                                oController._vPernrVoltid = mTmpModel.getProperty(vSelectedItems[0] + "/Voltid");
                            }
                        } else {
                            oController._vPernr = mTmpModel.getProperty("/ActionSubjectListSet/0/Pernr");
                            oController._vPercod = mTmpModel.getProperty("/ActionSubjectListSet/0/Percod");
                            oController._vPernrVoltid = mTmpModel.getProperty("/ActionSubjectListSet/0/Voltid");
                        }
                    }

                    oController.initInputControl(oController);

                    for (var j = 0; j < 5; j++) {
                        var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                        var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + (j + 1));

                        if (oMassn1 && oMassg1) {
                            if (oMassn1.getSelectedKey() != "0000" && oMassn1.getSelectedKey() != "") {
                                vSelectMassnCnt++;
                                if (oMassg1.getSelectedKey() == "0000" || oMassg1.getSelectedKey() == "") {
                                    isValid = false;
                                    break;
                                } else {
                                    oController._vActiveMassn.push({
                                        Massn: oMassn1.getSelectedKey(),
                                        Massg: oMassg1.getSelectedKey()
                                    });

                                    // if (oMassn1.getSelectedKey() == "81" || oMassn1.getSelectedKey() == "ZA") {
                                    //     fMassnCompany = false;
                                    // }

                                    // //발령유형이 퇴사이고 발령사유가 전출인 경우 일 떄 인사연역, 인사하위영역을 ??? 한다.
                                    // if (oMassn1.getSelectedKey() == "92" && oMassg1.getSelectedKey() == "20") {
                                    //     fMassnCompany = true;
                                    // }

                                    oController.getActionInputFieldSet(oController, oMassn1.getSelectedKey(), oMassg1.getSelectedKey());

                                    oController.getActionDetailLayoutInfoSet(oController, oMassn1.getSelectedKey(), oMassg1.getSelectedKey());

                                    var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                                    oSaveBtn.setEnabled(true);
                                }
                            }
                        }
                    }

                    if (vSelectMassnCnt < 1) {
                        BusyIndicator.hide();
                        oControl.setState(false);
                        MessageBox.alert(oController.getBundleText("MSG_02059"));
                        return;
                    }

                    if (!isValid) {
                        BusyIndicator.hide();
                        oControl.setState(false);
                        MessageBox.alert(oController.getBundleText("MSG_02060"));
                        return;
                    }

                    if (oController._vActiveGroup && oController._vActiveGroup.length > 0) {
                        oController._vActiveGroup.push({
                            Itgrp: "",
                            Itgrptx: "  "
                        });

                        if (oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
                            oController.setGroupInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
                        } else {
                            oController.setGroupInputFiled("N", oController, fMassnCompany);
                        }
                    } else {
                        if (oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
                            oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
                        } else {
                            oController.setInputFiled("N", oController, fMassnCompany);
                        }
                    }

                    BusyIndicator.hide();
                };

                BusyIndicator.show(0);

                setTimeout(Process, 300);
            },

            getActionSubjectTableHeaderSet: function (oController, Infty) {
                var vActionSubjectTableHeaderSet = [];

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionSubjectTableHeaderSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty),
						new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, oController._vMolga)
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vActionSubjectTableHeaderSet.push(oData.results[i]);
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return vActionSubjectTableHeaderSet;
            },

            getActionSubjectTableSet: function (oController, Infty) {
                var oActda = $.app.byId(oController.PAGEID + "_Actda");
                var vActionSubjectTableSet = [];

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionSubjectTableSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty),
						new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController._vPercod),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(oActda.getDateValue())),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vPernrVoltid ? oController._vPernrVoltid : "")
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vActionSubjectTableSet.push(oData.results[i]);
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return vActionSubjectTableSet;
            },

            makeTable: function (oController, ActiveControl, oLayout, Grouping) {
                var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);
                if (!vActionSubjectTableHeaderSet || vActionSubjectTableHeaderSet.length < 1) {
                    return;
                }
                var vActionSubjectTableSet = oController.getActionSubjectTableSet(oController, ActiveControl.Itgrp);

                var mItgrpList = new JSONModel();
                sap.ui.getCore().setModel(mItgrpList, "JSON_" + ActiveControl.Itgrp);

                var oColumnList = new sap.m.ColumnListItem();

                var oAddBtn = new sap.m.Button({
                    icon: "sap-icon://add",
                    type: "Default",
                    press: oController.addTableData,
                    customData: {
                        key: "Itgrp",
                        value: ActiveControl.Itgrp
                    }
                });
                var oDelBtn = new sap.m.Button({
                    icon: "sap-icon://less",
                    type: "Default",
                    press: oController.deleteTableData,
                    customData: {
                        key: "Itgrp",
                        value: ActiveControl.Itgrp
                    }
                });

                var oTableHeader = new sap.m.Toolbar({
                    height: "30px",
                    content: [new sap.m.ToolbarSpacer(), oAddBtn, oDelBtn]
                });

                var oTable = new sap.m.Table(oController.PAGEID + "_TABLE_" + ActiveControl.Itgrp, {
                    inset: false,
                    fixedLayout: false,
                    backgroundDesign: sap.m.BackgroundDesign.Translucent,
                    showSeparators: sap.m.ListSeparators.All,
                    noDataText: oController.getBundleText("MSG_02004"),
                    mode: sap.m.ListMode.SingleSelectLeft,
                    headerToolbar: oTableHeader
                }).addStyleClass("custom-table");

                oTable.setModel(mItgrpList);

                var vColumns = [];

                for (var i = 0; i < vActionSubjectTableHeaderSet.length; i++) {
                    var Fieldname = Common.underscoreToCamelCase(vActionSubjectTableHeaderSet[i].Fieldname),
                        TextFieldname = Fieldname + "_Tx",
                        Fieldtype = vActionSubjectTableHeaderSet[i].Inpty,
                        vMaxLength = parseInt(vActionSubjectTableHeaderSet[i].Maxlen),
                        fRequired = false;

                    if (Fieldname == "Begda" || Fieldname == "Endda") {
                        Fieldname = Fieldname + "T";
                        TextFieldname = Fieldname + "_Tx";
                    }
                    vColumns.push({
                        Fieldname: Fieldname,
                        Fieldtype: Fieldtype,
                        DefaultValue: vActionSubjectTableHeaderSet[i].Defaultval,
                        DefaultText: vActionSubjectTableHeaderSet[i].Defaulttxt
                    });

                    if (Fieldtype.substring(0, 1) == "M") {
                        fRequired = true;
                    }
                    var oColumn = new sap.m.Column({
                        header: new sap.m.Label({
                            text: vActionSubjectTableHeaderSet[i].Label,
                            required: fRequired
                        }).addStyleClass("L2PFontFamily"),
                        demandPopin: true,
                        hAlign: sap.ui.core.TextAlign.Begin,
                        minScreenWidth: "tablet"
                    });
                    oTable.addColumn(oColumn);

                    var oControl = oController.makeTableControl(
                        oController,
                        Fieldtype,
                        Fieldname,
                        TextFieldname,
                        vMaxLength,
                        vActionSubjectTableHeaderSet[i].Label,
                        ActiveControl.Itgrp
                    );
                    if (oControl) {
                        if (Fieldtype.substring(1, 2) == "1") {
                            oControl.bindProperty("selectedKey", Fieldname);
                        } else if (Fieldtype.substring(1, 2) == "2" || Fieldtype.substring(1, 2) == "5") {
                            oControl.bindProperty("value", TextFieldname);
                        } else if (Fieldtype.substring(1, 2) == "3" || Fieldtype.substring(1, 2) == "7") {
                            oControl.bindProperty("value", Fieldname);
                        } else if (Fieldtype.substring(1, 2) == "4") {
                            oControl.bindProperty("value", Fieldname);
                        } else if (Fieldtype.substring(1, 2) == "6") {
                            oControl.bindProperty("selected", {
                                path: Fieldname,
                                formatter: function (fVal) {
                                    return fVal == "X" ? true : false;
                                }
                            });
                        }

                        oColumnList.addCell(oControl);
                    }
                }

                oController._vTableColumns["C" + ActiveControl.Itgrp] = vColumns;

                var vItgrpList = {
                    TableDataList: []
                };

                if (vActionSubjectTableSet && vActionSubjectTableSet.length) {
                    for (var j = 0; j < vActionSubjectTableSet.length; j++) {
                        var vOneData = {};
                        for (var c = 0; c < oController._vDefaultTableColumns.length; c++) {
                            vOneData[oController._vDefaultTableColumns[c]] = vActionSubjectTableSet[j][oController._vDefaultTableColumns[c]];
                        }

                        for (var d = 0; d < vColumns.length; d++) {
                            var vVal = "";
                            var vTextVal = "";
                            for (var t = 1; t <= 30; t++) {
                                var idx = "00";
                                if (t < 10) {
                                    idx = "0" + t;
                                } else {
                                    idx = "" + t;
                                }
                                var vFName = vActionSubjectTableSet[j]["Field" + idx];
                                if (vFName && vFName != "") {
                                    if (vFName.toUpperCase() == "BEGDA" || vFName.toUpperCase() == "ENDDA") {
                                        vFName = vFName + "T";
                                    }
                                    if (vFName.toUpperCase() == vColumns[d].Fieldname.toUpperCase()) {
                                        vVal = vActionSubjectTableSet[j]["Value" + idx];
                                        vTextVal = vActionSubjectTableSet[j]["Valtx" + idx];
                                        break;
                                    }
                                }
                            }
                            vOneData[vColumns[d].Fieldname] = vVal;
                            vOneData[vColumns[d].Fieldname + "_Tx"] = vTextVal;
                        }
                        vItgrpList.TableDataList.push(vOneData);
                    }

                    mItgrpList.setData(vItgrpList);
                }

                oTable.bindItems("/TableDataList", oColumnList);

                if (Grouping) {
                    oLayout.addBlock(oTable);
                } else {
                    oLayout.addContent(oTable);
                }
            },

            makeTableControl: function (oController, Fieldtype, Fieldname, TextFieldname, vMaxLength, vLabelText, Itgrp) {
                var oControl = null;

                if (Fieldtype == "M1" || Fieldtype == "O1") {
                    oControl = new sap.m.ComboBox({
                        width: "95%",
                        selectedKey: {
                            path: Fieldname
                        }
                    }).addStyleClass("L2PFontFamily");

                    var mEmpCodeList = null;
                    var vAddFilter = [
                        {
                            key: "Persa",
                            value: oController._vPersa
                        },
                        {
                            key: "Actda",
                            value: oController._vActda
                        }
					];
                    mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                    var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
                    if (vEmpCodeList && vEmpCodeList.length) {
                        for (var i = 0; i < vEmpCodeList.length; i++) {
                            oControl.addItem(new sap.ui.core.Item({
                                key: vEmpCodeList[i].Ecode,
                                text: vEmpCodeList[i].Etext
                            }));
                        }
                    }
                } else if (Fieldtype == "M2" || Fieldtype == "O2") {
                    return;
                } else if (Fieldtype == "M3" || Fieldtype == "O3") {
                    oControl = new sap.m.Input({
                        width: "95%",
                        maxLength: vMaxLength,
                        value: {
                            path: Fieldname
                        }
                    }).addStyleClass("L2PFontFamily");
                } else if (Fieldtype == "M4" || Fieldtype == "O4") {
                    oControl = new sap.m.DatePicker({
                        width: "95%",
                        valueFormat: gDtfmt,
                        displayFormat: gDtfmt,
                        change: oController.changeDate.bind(oController),
                        value: {
                            path: Fieldname
                        }
                    }).addStyleClass("L2PFontFamily");
                } else if (Fieldtype == "M5" || Fieldtype == "O5") {
                    if (Fieldname == "Kostl") {
                        oControl = new sap.m.Input({
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            value: {
                                path: TextFieldname
                            },
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayKostlSearchDialog,
                            customData: {
                                key: Fieldname,
                                value: {
                                    path: Fieldname
                                }
                            }
                        }).addStyleClass("L2PFontFamily");
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Itgrp",
                                value: Itgrp
                            })
                        );
                    } else if (Fieldname == "Zzlojob") {
                        oControl = new sap.m.Input({
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            value: {
                                path: TextFieldname
                            },
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayZzlojobSearchDialog,
                            customData: {
                                key: Fieldname,
                                value: {
                                    path: Fieldname
                                }
                            }
                        }).addStyleClass("L2PFontFamily");
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Itgrp",
                                value: Itgrp
                            })
                        );
                    } else {
                        oControl = new sap.m.Input({
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            value: {
                                path: TextFieldname
                            },
                            valueHelpRequest: oController.displayTableCodeSearchDialog,
                            customData: {
                                key: Fieldname,
                                value: {
                                    path: Fieldname
                                }
                            }
                        }).addStyleClass("L2PFontFamily");
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Title",
                                value: vLabelText
                            })
                        );
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Itgrp",
                                value: Itgrp
                            })
                        );
                    }
                } else if (Fieldtype == "M6" || Fieldtype == "O6") {
                    oControl = new sap.m.CheckBox({
                        select: oController.onLiveChange,
                        Selected: {
                            path: Fieldname,
                            formatter: function (fVal) {
                                return fVal == "X" ? true : false;
                            }
                        }
                    }).addStyleClass("L2PFontFamily");
                }

                if (oControl) oControl.setTooltip(vLabelText);

                return oControl;
            },

            setInputFiled: function (pTy, pController, pFMassnCompany, pUpdateData) {
                var ty = pTy,
                    oController = pController,
                    fMassnCompany = pFMassnCompany,
                    updateData = pUpdateData,
                    fDefaulValue = false,
                    vRetireMassg = "",
                    vAus01Massn = "",
                    oScroller2 = $.app.byId(oController.PAGEID + "_RightScrollContainer");

                oScroller2.setVertical(true);

                for (var i = 1; i <= 5; i++) {
                    var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + i);
                    var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + i);

                    if (oMassn1.getSelectedKey() == "90" || oMassn1.getSelectedKey() == "91") {
                        vAus01Massn = "90";
                    }

                    if (oMassn1.getSelectedKey() == "10") {
                        vAus01Massn = "10";
                    }

                    if (oMassn1.getSelectedKey() == "92") {
                        vRetireMassg = oMassg1.getSelectedKey();
                    }
                }

                var oActionControlsLayout = $.app.byId(oController.PAGEID + "_ActionControlsLayout");

                oController._vTableColumns = {};

                // var actionFunction = function () {
                var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
                    width: "100%",
                    layoutFixed: true,
                    columns: 4,
                    widths: ["15%", "35%", "15%", "35%"]
                });

                var oRow = null,
                    oCell = null,
                    oControl = null;

                AcpAppCommon.loadCodeData(oController, oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));

                var m_idx = 0;
                if (oController._vActiveControl && oController._vActiveControl.length) {
                    for (var i = 0; i < oController._vActiveControl.length; i++) {
                        var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                            TextFieldname = Fieldname + "_Tx",
                            Fieldtype = oController._vActiveControl[i].Incat,
                            vLabel = oController._vActiveControl[i].Label,
                            vMaxLength = parseInt(oController._vActiveControl[i].Maxlen),
                            vLabelText = "";

                        if (vMaxLength == 0) {
                            vMaxLength = Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "ActionSubjectList", Fieldname);
                        }

                        if (vLabel != "") {
                            vLabelText = vLabel;
                        } else {
                            vLabelText = oController._vActiveControl[i].Label;
                        }

                        if (Fieldtype == "TB") {
                            if (m_idx > 0) {
                                oMatrixLayout.addRow(oRow);
                            }

                            if (oMatrixLayout.getRows().length > 0) {
                                oActionControlsLayout.addContent(oMatrixLayout);
                                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                            }

                            oController.makeTable(oController, oController._vActiveControl[i], oActionControlsLayout, false);

                            oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
                                width: "100%",
                                layoutFixed: true,
                                columns: 4,
                                widths: ["15%", "35%", "15%", "35%"]
                            });
                            m_idx = 0;
                            continue;
                        }

                        if (m_idx % 2 == 0) {
                            if (m_idx != 0) {
                                oMatrixLayout.addRow(oRow);
                            }
                            oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                        }

                        var vUpdateValue = "";
                        var vUpdateTextValue = "";

                        if (ty == "U") {
                            vUpdateValue = updateData[Fieldname];
                            vUpdateTextValue = updateData[TextFieldname];

                            if (Fieldtype == "D1") {
                                vUpdateValue = oController._vActiveControl[i].Dcode;
                                vUpdateTextValue = oController._vActiveControl[i].Dvalu;
                            }
                        } else {
                            if (fDefaulValue) {
                                vUpdateValue = updateData[Fieldname];
                                vUpdateTextValue = updateData[TextFieldname];
                            } else {
                                if (Fieldtype == "M4" || Fieldtype == "O4") {
                                    var vUpdateDateValue = oController._vActiveControl[i].Dcode;
                                    if (vUpdateDateValue != null && vUpdateDateValue != "") {
                                        var vDateValue = "";
                                        if (vUpdateDateValue.length == 8) {
                                            vDateValue =
                                                vUpdateDateValue.substring(0, 4) +
                                                "/" +
                                                vUpdateDateValue.substring(4, 6) +
                                                "/" +
                                                vUpdateDateValue.substring(6, 8);
                                        } else if (vUpdateDateValue.length == 10) {
                                            vDateValue = vUpdateDateValue.replace(/./g, "/");
                                            vDateValue = vDateValue.replace(/-/g, "/");
                                        }
                                        vUpdateValue = vDateValue;
                                        vUpdateTextValue = vDateValue;
                                    }
                                } else {
                                    vUpdateValue = oController._vActiveControl[i].Dcode;
                                    vUpdateTextValue = oController._vActiveControl[i].Dvalu;
                                }
                            }
                        }

                        //입력항목 라벨를 만든다.
                        var oLabel = new sap.m.Label({
                            text: vLabelText
                        });
                        if (Fieldtype.substring(0, 1) == "M") {
                            oLabel.setRequired(true);
                        } else {
                            oLabel.setRequired(false);
                        }
                        oLabel.addStyleClass("L2PFontFamily");
                        oLabel.setTooltip(vLabelText);

                        if (Fieldtype == "D2") {
                            oLabel.setText("");
                        }

                        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                            hAlign: sap.ui.commons.layout.HAlign.Begin,
                            vAlign: sap.ui.commons.layout.VAlign.Middle,
                            content: [oLabel]
                        }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
                        oRow.addCell(oCell);

                        oControl = oController.makeControl(
                            oController,
                            Fieldtype,
                            Fieldname,
                            vMaxLength,
                            vLabelText,
                            vUpdateValue,
                            vUpdateTextValue,
                            fMassnCompany,
                            vAus01Massn,
                            vRetireMassg
                        );

                        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                            hAlign: sap.ui.commons.layout.HAlign.Begin,
                            vAlign: sap.ui.commons.layout.VAlign.Middle,
                            content: oControl
                        }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
                        oRow.addCell(oCell);

                        m_idx++;
                    }
                    if (oRow.getCells().length == 2) {
                        oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableLabel L2PPaddingLeft10"));
                        oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableData L2PPaddingLeft10"));
                    }
                    oMatrixLayout.addRow(oRow);
                }

                oActionControlsLayout.addContent(oMatrixLayout);

                // oActionControlsLayout.setBusy(false);
                // BusyIndicator.hide();
                // };

                // oActionControlsLayout.setBusy(true);
                // BusyIndicator.show(0);

                // setTimeout(actionFunction, 300);
            },

            setGroupInputFiled: function (pTy, pController, pFMassnCompany, pUpdateData) {
                var ty = pTy;
                var oController = pController;
                var fMassnCompany = pFMassnCompany;
                var updateData = pUpdateData;

                var fDefaulValue = false;

                var vRetireMassg = "";

                var vAus01Massn = "";

                var oScroller2 = $.app.byId(oController.PAGEID + "_RightScrollContainer");
                oScroller2.setVertical(false);

                for (var i = 1; i <= 5; i++) {
                    var oMassn1 = $.app.byId(oController.PAGEID + "_Massn" + i);
                    var oMassg1 = $.app.byId(oController.PAGEID + "_Massg" + i);

                    if (oMassn1.getSelectedKey() == "90" || oMassn1.getSelectedKey() == "91") {
                        vAus01Massn = "90";
                    }

                    if (oMassn1.getSelectedKey() == "10") {
                        vAus01Massn = "10";
                    }

                    if (oMassn1.getSelectedKey() == "92") {
                        vRetireMassg = oMassg1.getSelectedKey();
                    }
                }

                var oActionControlsLayout = $.app.byId(oController.PAGEID + "_ActionControlsLayout");

                oController._vTableColumns = {};

                // var actionFunction = function () {
                var oGroupingInputLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_GroupingInputLayout", {
                    height: oController.ContentHeight - 180 + "px",
                    sections: []
                }).addStyleClass("act-layout-tab");

                var oRow = null,
                    oCell = null,
                    oControl = null;

                AcpAppCommon.loadCodeData(oController, oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));

                for (var g = 0; g < oController._vActiveGroup.length; g++) {
                    var oSection = new sap.uxap.ObjectPageSection({
                        title: oController._vActiveGroup[g].Itgrptx
                    });
                    var oSubSection = new sap.uxap.ObjectPageSubSection({
                        title: ""
                    });

                    var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
                        width: "100%",
                        layoutFixed: true,
                        columns: 4,
                        widths: ["15%", "35%", "15%", "35%"]
                    });

                    var m_idx = 0;

                    if (oController._vActiveControl && oController._vActiveControl.length) {
                        for (var i = 0; i < oController._vActiveControl.length; i++) {
                            if (oController._vActiveGroup[g].Itgrp != oController._vActiveControl[i].Itgrp) {
                                continue;
                            }

                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                                TextFieldname = Fieldname + "_Tx",
                                Fieldtype = oController._vActiveControl[i].Incat,
                                vLabel = oController._vActiveControl[i].Label,
                                vMaxLength = parseInt(oController._vActiveControl[i].Maxlen),
                                vLabelText = "";

                            if (vMaxLength == 0) {
                                vMaxLength = Common.getODataPropertyLength("ZHR_ACTIONAPP_SRV", "ActionSubjectList", Fieldname);
                            }

                            if (vLabel != "") vLabelText = vLabel;
                            else vLabelText = oController._vActiveControl[i].Label;

                            if (Fieldtype == "TB") {
                                if (m_idx > 0) {
                                    oMatrixLayout.addRow(oRow);
                                }
                                if (oMatrixLayout.getRows().length > 0) {
                                    oSubSection.addBlock(oMatrixLayout);
                                }

                                oController.makeTable(oController, oController._vActiveControl[i], oSubSection, true);

                                oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
                                    width: "100%",
                                    layoutFixed: true,
                                    columns: 4,
                                    widths: ["15%", "35%", "15%", "35%"]
                                });
                                m_idx = 0;
                                continue;
                            }

                            if (m_idx % 2 == 0) {
                                if (m_idx != 0) {
                                    oMatrixLayout.addRow(oRow);
                                }
                                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                            }

                            var vUpdateValue = "";
                            var vUpdateTextValue = "";

                            if (ty == "U") {
                                vUpdateValue = updateData[Fieldname];
                                vUpdateTextValue = updateData[TextFieldname];

                                if (Fieldtype == "D1") {
                                    if (Fieldname !== "Waers2") {
                                        vUpdateValue = oController._vActiveControl[i].Dcode;
                                        vUpdateTextValue = oController._vActiveControl[i].Dvalu;
                                    }
                                }
                            } else {
                                if (fDefaulValue) {
                                    vUpdateValue = updateData[Fieldname];
                                    vUpdateTextValue = updateData[TextFieldname];
                                } else {
                                    if (Fieldtype == "M4" || Fieldtype == "O4") {
                                        var vUpdateDateValue = oController._vActiveControl[i].Dcode;
                                        if (vUpdateDateValue != null && vUpdateDateValue != "") {
                                            var vDateValue = "";
                                            if (vUpdateDateValue.length == 8) {
                                                vDateValue =
                                                    vUpdateDateValue.substring(0, 4) +
                                                    "/" +
                                                    vUpdateDateValue.substring(4, 6) +
                                                    "/" +
                                                    vUpdateDateValue.substring(6, 8);
                                            } else if (vUpdateDateValue.length == 10) {
                                                vDateValue = vUpdateDateValue.replace(/./g, "/");
                                                vDateValue = vDateValue.replace(/-/g, "/");
                                            }
                                            vUpdateValue = vDateValue;
                                            vUpdateTextValue = vDateValue;
                                        }
                                    } else {
                                        vUpdateValue = oController._vActiveControl[i].Dcode;
                                        vUpdateTextValue = oController._vActiveControl[i].Dvalu;
                                    }
                                }
                            }

                            //입력항목 라벨를 만든다.
                            var oLabel = new sap.m.Label({
                                text: vLabelText
                            });
                            if (Fieldtype.substring(0, 1) == "M") {
                                oLabel.setRequired(true);
                            } else {
                                oLabel.setRequired(false);
                            }
                            oLabel.addStyleClass("L2PFontFamily");
                            oLabel.setTooltip(vLabelText);

                            if (Fieldtype == "D2") {
                                oLabel.setText("");
                            }

                            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                                hAlign: sap.ui.commons.layout.HAlign.Begin,
                                vAlign: sap.ui.commons.layout.VAlign.Middle,
                                content: [oLabel]
                            }).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
                            oRow.addCell(oCell);

                            oControl = oController.makeControl(
                                oController,
                                Fieldtype,
                                Fieldname,
                                vMaxLength,
                                vLabelText,
                                vUpdateValue,
                                vUpdateTextValue,
                                fMassnCompany,
                                vAus01Massn,
                                vRetireMassg
                            );

                            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                                hAlign: sap.ui.commons.layout.HAlign.Begin,
                                vAlign: sap.ui.commons.layout.VAlign.Middle,
                                content: oControl
                            }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
                            oRow.addCell(oCell);

                            m_idx++;
                        }
                        if (m_idx > 0) {
                            if (oRow.getCells().length == 2) {
                                oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableLabel L2PPaddingLeft10"));
                                oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableData L2PPaddingLeft10"));
                            }
                            oMatrixLayout.addRow(oRow);
                        }
                    }

                    if (oMatrixLayout.getRows().length > 0) {
                        if (g == oController._vActiveGroup.length - 1) {
                            oRow = new sap.ui.commons.layout.MatrixLayoutRow({
                                height: "30px"
                            });
                            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                                hAlign: sap.ui.commons.layout.HAlign.Begin,
                                vAlign: sap.ui.commons.layout.VAlign.Middle,
                                colSpan: 4,
                                content: new sap.ui.core.HTML({
                                    content: "<div style='height:30px'> </div>",
                                    preferDOM: false
                                })
                            });
                            oRow.addCell(oCell);

                            oMatrixLayout.addRow(oRow);
                        }
                        oSubSection.addBlock(oMatrixLayout);
                    }

                    oSection.addSubSection(oSubSection);
                    oGroupingInputLayout.addSection(oSection);
                }

                oActionControlsLayout.addContent(oGroupingInputLayout);

                // BusyIndicator.hide();
                // };

                // BusyIndicator.show(0);

                // setTimeout(actionFunction, 300);
            },

            getTextFiledValue: function (oController, Fieldname, vValue, Itgrp) {
                var vRetText = "";

                var mEmpCodeList = null;
                var vAddFilter = [
                    {
                        key: "Persa",
                        value: oController._vPersa
                    },
                    {
                        key: "Actda",
                        value: oController._vActda
                    }
				];

                if (Fieldname.toUpperCase() == "LGART") {
                    vAddFilter.push({
                        key: "Excod",
                        value: Itgrp
                    });
                }
                mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);

                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        if (vEmpCodeList[i].Ecode == vValue) {
                            vRetText = vEmpCodeList[i].Etext;
                            break;
                        }
                    }
                }

                return vRetText;
            },

            addTableData: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var vItgrp = oControl.getCustomData()[0].getValue();
                var mItgrpList = sap.ui.getCore().getModel("JSON_" + vItgrp);
                var vItgrpList = mItgrpList.getProperty("/TableDataList");
                var vTmp = {
                    TableDataList: []
                };
                var vColumns = oController._vTableColumns["C" + vItgrp];
                var oActda = $.app.byId(oController.PAGEID + "_Actda");
                var vCnt = 0;

                if (vItgrpList && vItgrpList.length) {
                    for (var i = 0; i < vItgrpList.length; i++) {
                        vTmp.TableDataList.push(vItgrpList[i]);
                    }
                    vCnt = vItgrpList.length;
                }

                var vOneData = {};
                vOneData.Docno = oController._vDocno;
                vOneData.VoltId = oController._vPernrVoltid ? oController._vPernrVoltid : "";
                vOneData.Actda = oActda.getValue();
                vOneData.Percod = oController._vPercod;
                vOneData.Infty = vItgrp;
                vOneData.Subty = "";
                vOneData.Objps = "";
                vOneData.Sprps = "";
                vOneData.Endda = null;
                vOneData.Begda = null;
                vOneData.Seqnr = "";
                vOneData.Isnew = "X";

                vOneData.Numbr = vCnt + 1;
                for (var j = 0; j < vColumns.length; j++) {
                    vOneData[vColumns[j].Fieldname] = vColumns[j].DefaultValue;
                    vOneData[vColumns[j].Fieldname + "_Tx"] = vColumns[j].DefaultText;
                }
                vTmp.TableDataList.push(vOneData);

                mItgrpList.setData(vTmp);
            },

            deleteTableData: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var vItgrp = oControl.getCustomData()[0].getValue();
                var oTable = $.app.byId(oController.PAGEID + "_TABLE_" + vItgrp);
                var vContexts = oTable.getSelectedContexts(true);
                var vNumbr = 0;

                if (vContexts && vContexts.length) {
                    vNumbr = vContexts[0].getProperty("Numbr");
                } else {
                    MessageBox.alert(oController.getBundleText("MSG_02029"));
                    return;
                }

                var mItgrpList = sap.ui.getCore().getModel("JSON_" + vItgrp);
                var vItgrpList = mItgrpList.getProperty("/TableDataList");

                var vTmp = {
                    TableDataList: []
                };

                if (vItgrpList && vItgrpList.length) {
                    for (var i = 0; i < vItgrpList.length; i++) {
                        if (vItgrpList[i].Numbr != vNumbr) {
                            vTmp.TableDataList.push(vItgrpList[i]);
                        }
                    }
                }

                oTable.removeSelections(false);
                mItgrpList.setData(vTmp);
            },

            getEmpCodeField: function (oController) {
                var vExceptionFields = [
					"Werks",
					"Btrtl",
					"Rls_orgeh",
					"Persk",
					"Rls_werks",
					"Retrs",
					"Home_staff",
					"Host_werks",
					"Host_staff",
					"Rls_zzpsgrp",
					"Entrs",
					"Schkz",
					"Trfgr",
					"Trfst",
					"Aus01",
					"Aus02",
					"Aus03",
					"Aus04",
					"Aus05",
					"Ret_persa",
					"Ret_btrtl",
					"Ret_zzjobsr"
				];
                var vEmpCodeListFields = [];

                for (var i = 0; i < oController._vActiveControl.length; i++) {
                    var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                        Fieldtype = oController._vActiveControl[i].Incat;

                    if (Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
                        var fExcep = false;
                        for (var j = 0; j < vExceptionFields.length; j++) {
                            if (Fieldname == vExceptionFields[j]) {
                                fExcep = true;
                                break;
                            }
                        }
                        if (fExcep == false) {
                            vEmpCodeListFields.push(oController._vActiveControl[i]);
                        }
                    }
                }

                return vEmpCodeListFields;
            },

            /**
             * 입력항목의 유형에 따라 달리 처리한다.
             *	M1 : select
             *	M2 : Input & Tree Popup
             *	M3 : Input only
             *	M4 : DatePicker
             *	M5 : Input & Select Dialog
             *	M6 : Single Checkbox
             * @param oController
             * @param Fieldtype
             * @param Fieldname
             * @param vMaxLength
             * @param vLabelText
             * @param vUpdateValue
             * @param vUpdateTextValue
             * @param fMassnCompany
             * @param vAus01Massn
             * @returns
             */
            makeControl: function (
                oController,
                Fieldtype,
                Fieldname,
                vMaxLength,
                vLabelText,
                vUpdateValue,
                vUpdateTextValue,
                fMassnCompany,
                vAus01Massn,
                vRetireMassg
            ) {
                var oControl = null;
                var vAddFilter = null;
                var mDataModel = null;
                var vExcod = "";
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd"
                });

                if (Fieldtype == "M1" || Fieldtype == "O1") {
                    oControl = new sap.m.ComboBox(oController.PAGEID + "_" + Fieldname, {
                        width: "95%"
                    }).addStyleClass("L2PFontFamily");

                    if (Fieldname == "Werks") {
                        //인사영역은 EmpCodeList가 아닌 별도의 Entity
                        oController._vWerksUpdateValue = vUpdateValue;
                        if (fMassnCompany) {
                            oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
                        } else {
                            oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
                        }
                        oControl.attachChange(oController.onPressWerks);
                    } else if (Fieldname == "Btrtl") {
                        //인사하위영역은 EmpCodeList가 아닌 별도의 Entity
                        if (fMassnCompany) {
                            oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vWerksUpdateValue);
                        } else {
                            oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vPersa);
                        }
                        oController._vSelectedBtrtl = vUpdateValue;
                        oControl.attachChange(oController.onPressBtrtl);
                    } else if (Fieldname == "Rls_orgeh") {
                        //해제부서는 조건이 발령유형/사유가 추가됨

                        vAddFilter = [
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            }
						];
                        mDataModel = oController.setRlsOrgehCodeData.bind(oController)(Fieldname, vAddFilter);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/ReleaseOrgListSet", new sap.ui.core.Item({
                            key: "{Rls_orgeh}",
                            text: "{Rls_orgeh_Tx}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Persg") {
                        //사원그룹

                        oController._vSelectedPersg = vUpdateValue;
                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);

                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressPersg);
                    } else if (Fieldname == "Persk") {
                        //사원하위그룹 Excod
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oController._vSelectedPersg
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oController._vSelectedPersk = vUpdateValue;

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressPersk);
                    } else if (Fieldname == "Rls_werks") {
                        //해제 인사 영역 리스트
                        vAddFilter = [
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            }
						];
                        mDataModel = oController.setRlsWerksCodeData.bind(oController)(Fieldname, vAddFilter);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/ReleasePersAreaListSet", new sap.ui.core.Item({
                            key: "{Rls_werks}",
                            text: "{Rls_werks_Tx}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressHost_werks);

                        if (vUpdateValue != "" && vUpdateValue != "0000") {
                            oController._vHost_werks = vUpdateValue;
                        }
                    } else if (Fieldname == "Retrs") {
                        //퇴직사유
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Massg",
                                value: vRetireMassg
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Home_staff") {
                        vAddFilter = [{
                            key: "Pernr",
                            value: oController._vPernr
                        }];
                        mDataModel = oController.setHomeStaffCodeData.bind(oController)(Fieldname, vAddFilter);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/HomeStaffListSet", new sap.ui.core.Item({
                            key: "{Home_staff}",
                            text: "{Home_staff_Tx}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Host_werks") {
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressHost_werks);

                        if (vUpdateValue != "" && vUpdateValue != "0000") {
                            oController._vHost_werks = vUpdateValue;
                        }
                    } else if (Fieldname == "Host_staff") {
                        if (oController._vHost_werks != "") {
                            vAddFilter = [
                                {
                                    key: "Host_werks",
                                    value: oController._vHost_werks
                                },
                                {
                                    key: "Actda",
                                    value: oController._vActda
                                }
							];
                            mDataModel = oController.setHostStaffCodeData.bind(oController)(Fieldname, vAddFilter);

                            oControl.setModel(mDataModel);
                            oControl.bindItems("/HostStaffListSet", new sap.ui.core.Item({
                                key: "{Host_staff}",
                                text: "{Host_staff_Tx}"
                            }));
                            oControl.setSelectedKey(vUpdateValue);
                        }
                    } else if (Fieldname == "Rls_zzpsgrp") {
                        //호봉단계 Excod
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Entrs") {
                        //입사구분
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        if (vUpdateValue == "") {
                            oControl.setSelectedKey(oController._vEntrs);
                        } else {
                            oControl.setSelectedKey(vUpdateValue);
                        }
                    } else if (Fieldname == "Schkz") {
                        var oListControl = $.app.byId("ActAppPersonInfo_List");
                        var selectedItems = oListControl.getMode() === "None" ? oListControl.getItems() : oListControl.getSelectedItems();
                        var oEmpModel = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                        var excods = [
                            oController._vWerksUpdateValue,
                            oController._vSelectedBtrtl
                        ];

                        var isNewHire = false;
                        for (var p = 0; p < 5; p++) {
                            var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (p + 1));
                            if (!oMassn) continue;

                            if (oMassn.getSelectedKey() == "0A") {
                                isNewHire = true;
                            }
                        }

                        if (isNewHire) {
                            excods.push(oController._vSelectedPersg);
                            excods.push(oController._vSelectedPersk);
                        } else {
                            if (oListControl.getMode() === "None") {
                                excods.push(oEmpModel.getProperty("/ActionSubjectListSet/0/Percod"));
                            } else {
                                selectedItems.forEach(function (item) {
                                    excods.push(
                                        oEmpModel.getProperty(item.getBindingContextPath() + "/Percod")
                                    );
                                });
                            }
                        }

                        //사원하위그룹 Excod
                        vExcod = excods.join("|");

                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Trfar") {
                        //호봉유형
                        oController._vSelectedTrfar = vUpdateValue;

                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);

                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressTrfar);
                    } else if (Fieldname == "Trfgb") {
                        //급여영역
                        oController._vSelectedTrfgb = vUpdateValue;

                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);

                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressTrfgb);
                    } else if (Fieldname == "Trfgr") {
                        //호봉그룹
                        vExcod =
                            oController._vMolga +
                            "|" +
                            oController._vSelectedTrfar +
                            "|" +
                            oController._vSelectedTrfgb +
                            "|" +
                            oController._vSelectedPersg +
                            "|" +
                            oController._vSelectedPersk;
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];
                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oController._vSelectedTrfgr = vUpdateValue;

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onPressTrfgr);
                    } else if (Fieldname == "Trfst") {
                        //호봉단계 Excod
                        vExcod =
                            oController._vMolga +
                            "|" +
                            oController._vSelectedTrfar +
                            "|" +
                            oController._vSelectedTrfgb +
                            "|" +
                            oController._vSelectedTrfgr +
                            "|" +
                            oController._vSelectedPersg +
                            "|" +
                            oController._vSelectedPersk;
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Aus01") {
                        //
                        vExcod = "";
                        if (vAus01Massn == "90") vExcod = "A002";
                        else {
                            if (oController._vMolga == "18") vExcod = "CZ01";
                            else vExcod = "A001";
                        }
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Aus02" || Fieldname == "Aus03" || Fieldname == "Aus04" || Fieldname == "Aus05") {
                        //
                        vExcod = "A002";
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Ret_persa") {
                        //해제 인사 영역 리스트
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            }
						];
                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                        oControl.attachChange(oController.onChangeRet_persa);

                        if (vUpdateValue != "" && vUpdateValue != "0000") {
                            oController._vRet_persa = vUpdateValue;
                        }
                    } else if (Fieldname == "Ret_btrtl" || Fieldname == "Ret_zzjobsr") {
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oController._vRet_persa
                            }
						];
                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "ZpGrade") {
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oController._vSelectedZhgrade
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "AddZpGrade") {
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oController._vSelectedAddZhgrade
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else if(Fieldname == "Plans" || Fieldname == "AddPlans"){
                    	// 포지션, 데이터 호출 시 부서코드 필터값 추가
                    	oControl.addItem(new sap.ui.core.Item({key : "0000", text : oController.getBundleText("LABEL_02035")}));
                    	
                    	// var oWerks = "", oOrgeh = "";
                    	// for(var i=0; i<oController._vActiveControl.length; i++){
                    	// 	if(oController._vActiveControl[i].Fieldname == "WERKS"){
                    	// 		oWerks = oController._vActiveControl[i].Dcode;
                    	// 	}
                    	// 	// if(Fieldname == "Plans" && oController._vActiveControl[i].Fieldname == "ORGEH"){
                    	// 	// 	oOrgeh = oController._vActiveControl[i].Dcode;
                        //     // }
                        //     // if(Fieldname == "AddPlans" && oController._vActiveControl[i].Fieldname == "ADD_ORGEH"){
                    	// 	// 	oOrgeh = oController._vActiveControl[i].Dcode;
                    	// 	// }
                    	// }
                    	
                		if(oController._vOrgeh != ""){
                			$.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
								async: false,
								filters: [
									new sap.ui.model.Filter("Field", "EQ", "Plans"),
									new sap.ui.model.Filter("Persa", "EQ", oController._vWerksUpdateValue),
									new sap.ui.model.Filter("Excod", "EQ", oController._vOrgeh),
                                    new sap.ui.model.Filter("Actda", "EQ", oController._vActda),
                                    new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
                                    new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
                                    new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
                                    new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId())
								],
								success: function(oData) {
									if (oData && oData.results.length) {
										for(var i=0; i<oData.results.length; i++){
											oControl.addItem(new sap.ui.core.Item({key : oData.results[i].Ecode, text: oData.results[i].Etext}));
										}
									}
								},
								error: function(oResponse) {
									common.Common.log(oResponse);
								}
							});
                		}
                		
                		oControl.setSelectedKey(vUpdateValue);
                    } else {
                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);
                        oControl.setSelectedKey(vUpdateValue);

                        if (Fieldname == "Zhgrade") {
                            oController._vSelectedZhgrade = vUpdateValue;
                            oControl.attachChange(oController.onChangeZhgrade);
                        } else if (Fieldname == "AddZhgrade") {
                            oController._vSelectedAddZhgrade = vUpdateValue;
                            oControl.attachChange(oController.onChangeAddZhgrade);
                        } else if (Fieldname == "AddOrgeh") {
                            oControl.attachChange(oController.onPressAddOrgeh);
                        }
                    }
                } else if (Fieldtype == "M2" || Fieldtype == "O2") {
                    if (Fieldname == "Orgeh") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayOrgSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );

                        oController._vOrgeh = vUpdateValue;
                    } else if (
                        Fieldname == "Stell" ||
                        Fieldname == "Zzstell" ||
                        Fieldname == "Add_stell" ||
                        Fieldname == "Add_zzstell" ||
                        Fieldname == "Dis_stell" ||
                        Fieldname == "Ext_stell"
                    ) {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayStellSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    } else if (Fieldname == "DisOrgeh" || Fieldname == "AddOrgeh" || Fieldname == "RlsOrgeh") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayOrgSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Orgeh",
                                value: vUpdateValue
                            })
                        );

                        oController._vOrgeh = vUpdateValue;
                    } else if (Fieldname == "Host_staff" || Fieldname == "Home_staff") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayEmplyeeSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    } else if (Fieldname == "Host_orgeh") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayOrgSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Orgeh",
                                value: vUpdateValue
                            })
                        );
                    } else if (Fieldname == "Zzprdar" || Fieldname == "Zzprdar2") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayPrdAreaSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    } else {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%"
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    }
                } else if (Fieldtype == "M3" || Fieldtype == "O3") {
                    oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                        width: "95%",
                        maxLength: vMaxLength
                    }).addStyleClass("L2PFontFamily");

                    if (Fieldname == "Ansal" || Fieldname == "Bet01" || Fieldname == "Bet02" || Fieldname == "Bet03" || Fieldname == "Bet01_v2") {
                        oControl.setType(sap.m.InputType.Number);
                        oControl.attachChange(oController.changeAmount);
                    } else {
                        oControl.setType(sap.m.InputType.Text);
                    }
                    oControl.setValue(vUpdateValue);
                } else if (Fieldtype == "M4" || Fieldtype == "O4") {
                    oControl = new sap.m.DatePicker(oController.PAGEID + "_" + Fieldname, {
                        width: "95%",
                        valueFormat: "yyyy-MM-dd",
                        displayFormat: gDtfmt,
                        change: oController.changeDate.bind(oController)
                    }).addStyleClass("L2PFontFamily");
                    if (vUpdateValue != null && vUpdateValue != "") {
                        var tDate = Common.setTime(new Date(vUpdateValue));
                        oControl.setValue(dateFormat.format(new Date(tDate)));
                    }
                } else if (Fieldtype == "M5" || Fieldtype == "O5") {
                    if (Fieldname == "Kostl") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayKostlSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    } else if (Fieldname == "Zzlojob") {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayZzlojobSearchDialog
                        }).addStyleClass("L2PFontFamily");
                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                    } else {
                        oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                            width: "95%",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            liveChange: oController.onLiveChange,
                            valueHelpRequest: oController.displayCodeSearchDialog
                        }).addStyleClass("L2PFontFamily");

                        oControl.setValue(vUpdateTextValue);
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: Fieldname,
                                value: vUpdateValue
                            })
                        );
                        oControl.addCustomData(
                            new sap.ui.core.CustomData({
                                key: "Title",
                                value: vLabelText
                            })
                        );
                    }

                    //"HOST_WERKS"
                    if (Fieldname == "Host_werks") {
                        if (vUpdateValue != "" && vUpdateValue != "0000") {
                            oController._vHost_werks = vUpdateValue;
                        }
                    }
                } else if (Fieldtype == "M6" || Fieldtype == "O6") {
                    oControl = new sap.m.CheckBox(oController.PAGEID + "_" + Fieldname, {
                        select: oController.onLiveChange
                    }).addStyleClass("L2PFontFamily");
                    if (vUpdateValue == "X") oControl.setSelected(true);
                    else oControl.setSelected(false);
                } else if (Fieldtype == "M0") {
                    oControl = new sap.m.ComboBox(oController.PAGEID + "_" + Fieldname, {
                        width: "95%",
                        enabled: false
                    }).addStyleClass("L2PFontFamily");

                    if (Fieldname == "Persg") {
                        //사원그룹
                        oController._vSelectedPersg = vUpdateValue;

                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);

                        oControl.setSelectedKey(vUpdateValue);
                    } else if (Fieldname == "Persk") {
                        //사원하위그룹 Excod
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oController._vSelectedPersg
                            }
						];

                        mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);

                        oController._vSelectedPersk = vUpdateValue;

                        oControl.setModel(mDataModel);
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oControl.setSelectedKey(vUpdateValue);
                    } else {
                        oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                        oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }), null, [
							new sap.ui.model.Filter("Field", "EQ", Fieldname)
						]);
                        oControl.setSelectedKey(vUpdateValue);
                    }
                } else if (Fieldtype == "D0" || Fieldtype == "D1") {
                    oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                        width: "95%",
                        editable: false
                    }).addStyleClass("L2PFontFamily");

                    oControl.setValue(vUpdateTextValue);

                    if (Fieldname == "Persg") {
                        //사원그룹
                        oController._vSelectedPersg = vUpdateValue;
                    }
                }

                if (oControl) oControl.setTooltip(vLabelText);

                return oControl;
            },

            setPersaData: function (oControlId, oControl, fMassnCompany, value, filter) {
                var oController = $.app.getController(SUB_APP_ID);

                try {
                    oControl.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));

                    if (oControlId == "Werks") {
                        $.app.getModel("ZHR_ACTIONAPP_SRV").read("/PersAreaListSet", {
                            async: false,
                            filters: [
								new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, (fMassnCompany) ? "2" : "1")
							],
                            success: function (oData) {
                                if (oData && oData.results) {
                                    for (var i = 0; i < oData.results.length; i++) {
                                        oControl.addItem(new sap.ui.core.Item({
                                            key: oData.results[i].Persa,
                                            text: oData.results[i].Pbtxt
                                        }));
                                    }
                                }
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                            }
                        });
                    } else if (oControlId == "Btrtl") {
                        $.app.getModel("ZHR_ACTIONAPP_SRV").read("/PersSubareaListSet", {
                            async: false,
                            filters: [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, filter)
							],
                            success: function (oData) {
                                if (oData && oData.results) {
                                    for (var i = 0; i < oData.results.length; i++) {
                                        oControl.addItem(new sap.ui.core.Item({
                                            key: oData.results[i].Btrtl,
                                            text: oData.results[i].Btext
                                        }));
                                    }
                                }
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                            }
                        });
                    }

                    if (value != "") {
                        oControl.setSelectedKey(value);
                    }
                } catch (ex) {
                    Common.log(ex);
                }
            },

            initInputControl: function (oController) {
                if (oController._vActiveControl && oController._vActiveControl.length) {
                    for (var i = 0; i < oController._vActiveControl.length; i++) {
                        var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                            oControl = $.app.byId(oController.PAGEID + "_" + Fieldname);

                        if (oControl) {
                            oControl.destroy(true);
                        }
                    }
                }

                var oMatrixLayout = $.app.byId(oController.PAGEID + "_MatrixLayout");
                if (oMatrixLayout) {
                    oMatrixLayout.removeAllRows();
                    oMatrixLayout.destroyRows();
                    oMatrixLayout.destroy();
                }

                var oGroupingInputLayout = $.app.byId(oController.PAGEID + "_GroupingInputLayout");
                if (oGroupingInputLayout) {
                    oGroupingInputLayout.destroy();
                }

                var oActionControlsLayout = $.app.byId(oController.PAGEID + "_ActionControlsLayout");
                if (oActionControlsLayout) {
                    oActionControlsLayout.destroyContent();
                }

                oController._vActiveControl = [];
                oController._vActiveGroup = [];
                oController._vActiveMassn = [];
            },

            onPressSave: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

                if (oController._vActionType == "100" || oController._vActionType == "300") {
                    var oPersonList = $.app.byId(oController.PAGEID + "_List");
                    var vContexts = oPersonList.getSelectedContexts(true);
                    if (!vContexts) {
                        MessageBox.alert(oController.getBundleText("MSG_02050"));
                        return;
                    }
                }

                var vCreateData = {};

                var oActda = $.app.byId(oController.PAGEID + "_Actda");

                vCreateData.Docno = oController._vDocno;
                vCreateData.Docty = oController._vDocty;
                vCreateData.Reqno = oController._vReqno;
                vCreateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
                vCreateData.Batyp = "A";
                vCreateData.Persa = oController._vPersa;

                for (var p = 0; p < 5; p++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (p + 1));
                    var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (p + 1));

                    if (oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
                        vCreateData["Massn" + (p + 1)] = "";
                    } else {
                        vCreateData["Massn" + (p + 1)] = oMassn.getSelectedKey();
                    }

                    if (oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
                        vCreateData["Massg" + (p + 1)] = "";
                    } else {
                        vCreateData["Massg" + (p + 1)] = oMassg.getSelectedKey();
                    }
                }

                if (vCreateData.Massn1 == "" || vCreateData.Massg1 == "") {
                    MessageBox.alert(oController.getBundleText("MSG_02062"));
                    return;
                }

                var vTableVariables = [];

                try {
                    if (oController._vActiveControl && oController._vActiveControl.length) {
                        for (var i = 0; i < oController._vActiveControl.length; i++) {
                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                                Fieldtype = oController._vActiveControl[i].Incat,
                                oControl = $.app.byId(oController.PAGEID + "_" + Fieldname);

                            var vLabel = oController._vActiveControl[i].Label;
                            var vLabelText = "";
                            if (vLabel != "") vLabelText = vLabel;
                            else vLabelText = oController.getBundleText(oController._vActiveControl[i].Label);

                            //입력항목의 유형에 따라 달리 처리한다.
                            // M1 : select
                            // M2 : Input & Tree Popup
                            // M3 : Input only
                            // M4 : DatePicker
                            // M5 : Input & Select Dialog
                            // M6 : Single Checkbox
                            if (oControl) {
                                var vMsg = "";
                                var vVal = "";
                                var oCustomData = null;

                                if (Fieldtype == "M0") {
                                    if (oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
                                        vCreateData[Fieldname] = undefined;
                                    } else {
                                        vCreateData[Fieldname] = oControl.getSelectedKey();
                                    }
                                } else if (Fieldtype == "M1") {
                                    if (oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
                                        oControl.addStyleClass("L2PSelectInvalidBorder");

                                        vMsg = oController.getBundleText("MSG_02063");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.removeStyleClass("L2PSelectInvalidBorder");

                                        if (oController._vActiveControl[i].id != "Persa") {
                                            vCreateData[Fieldname] = oControl.getSelectedKey();
                                        }
                                    }
                                } else if (Fieldtype == "M2") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02064");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var c = 0; c < oCustomData.length; c++) {
                                                var tmpFieldname = "";
                                                if (
                                                    Fieldname == "DisOrgeh" ||
                                                    Fieldname == "AddOrgeh" ||
                                                    Fieldname == "RlsOrgeh" ||
                                                    Fieldname == "HostOrgeh"
                                                )
                                                    tmpFieldname = "Orgeh";
                                                else tmpFieldname = Fieldname;

                                                if (oCustomData[c].getKey() == tmpFieldname) {
                                                    vVal = oCustomData[c].getValue();
                                                }
                                            }
                                        }
                                        vCreateData[Fieldname] = vVal;
                                        vCreateData[Fieldname + "_Tx"] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "M3") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02064");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        vCreateData[Fieldname] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "M4") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02064");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        vVal = "/Date(" + Common.getTime(oControl.getValue()) + ")/";
                                        vCreateData[Fieldname] = vVal;
                                    }
                                } else if (Fieldtype == "M5") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02064");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var d = 0; d < oCustomData.length; d++) {
                                                if (oCustomData[d].getKey() == Fieldname) {
                                                    vVal = oCustomData[d].getValue();
                                                }
                                            }
                                        }
                                        vCreateData[Fieldname] = vVal;
                                        vCreateData[Fieldname + "_Tx"] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "M6") {
                                    if (oControl.getSelected() == false) {
                                        vMsg = oController.getBundleText("MSG_02063");
                                        vMsg = vMsg.replace("&Cntl", vLabelText);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        vVal = "X";
                                        vCreateData[Fieldname] = vVal;
                                    }
                                } else if (Fieldtype == "O1") {
                                    if (oControl.getSelectedKey() !== "0000" && oControl.getSelectedKey() !== "") {
                                        oControl.removeStyleClass("L2PSelectInvalidBorder");

                                        if (oController._vActiveControl[i].id != "Persa") {
                                            vCreateData[Fieldname] = oControl.getSelectedKey();
                                        }
                                    }
                                } else if (Fieldtype == "O2") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var e = 0; e < oCustomData.length; e++) {
                                                var tmpFieldname1 = "";
                                                if (
                                                    Fieldname == "DisOrgeh" ||
                                                    Fieldname == "AddOrgeh" ||
                                                    Fieldname == "RlsOrgeh" ||
                                                    Fieldname == "HostOrgeh"
                                                )
                                                    tmpFieldname1 = "Orgeh";
                                                else tmpFieldname1 = Fieldname;

                                                if (oCustomData[e].getKey() == tmpFieldname1) {
                                                    vVal = oCustomData[e].getValue();
                                                }
                                            }
                                        }
                                        vCreateData[Fieldname] = vVal;
                                        vCreateData[Fieldname + "_Tx"] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "O3") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        vCreateData[Fieldname] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "O4") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);

                                        vVal = "/Date(" + Common.getTime(oControl.getValue()) + ")/";
                                        vCreateData[Fieldname] = vVal;
                                    }
                                } else if (Fieldtype == "O5") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var f = 0; f < oCustomData.length; f++) {
                                                if (oCustomData[f].getKey() == Fieldname) {
                                                    vVal = oCustomData[f].getValue();
                                                }
                                            }
                                        }
                                        vCreateData[Fieldname] = vVal;
                                        vCreateData[Fieldname + "_Tx"] = oControl.getValue();
                                    }
                                } else if (Fieldtype == "O6") {
                                    vVal = "";
                                    if (oControl.getSelected() == true) {
                                        vVal = "X";
                                    }
                                    vCreateData[Fieldname] = vVal;
                                } else if (Fieldtype == "D1") {
                                    if (Fieldname == "Waers2") {
                                        vCreateData.Waers2 = oControl.getValue();
                                        vCreateData.Waers2_Tx = oControl.getValue();
                                    }
                                }
                            } else {
                                if (Fieldtype == "TB") {
                                    vTableVariables.push(oController._vActiveControl[i]);
                                    var fResult = oController.onCheckTableData(oController, oController._vActiveControl[i]);
                                    if (!fResult) return;
                                }
                            }
                        }
                    }
                } catch (ex) {
                    Common.log(ex);
                }

                var dataProcess = function () {
                    var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                    var process_result = false;
                    var vActionSubjectList_Temp = null;

                    if (oController._vActionType == "100" || oController._vActionType == "300") {
                        var oPersonList = $.app.byId(oController.PAGEID + "_List");
                        var vContexts = oPersonList.getSelectedContexts(true);
                        process_result = false;

                        if (vContexts && vContexts.length) {
                            var vSelectedPernr = [];

                            for (var i = 0; i < vContexts.length; i++) {
                                vCreateData.Pernr = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Pernr");
                                vCreateData.Percod = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Percod");
                                vCreateData.Ename = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Ename");

                                vSelectedPernr.push(vCreateData.Pernr);

                                process_result = false;

                                oModel.create("/ActionSubjectListSet", vCreateData, {
                                    success: function () {
                                        process_result = true;
                                        Common.log("Sucess ActionSubjectListSet Create !!!");
                                    },
                                    error: function (oError) {
                                        var Err = {};
                                        if (oError.response) {
                                            Err = window.JSON.parse(oError.response.body);
                                            if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                                Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                            } else {
                                                Common.showErrorMessage(Err.error.message.value);
                                            }
                                        } else {
                                            Common.showErrorMessage(oError);
                                        }
                                        process_result = false;
                                    }
                                });

                                if (!process_result) {
                                    BusyIndicator.hide();
                                    return;
                                }
                            }

                            vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
                            var vNewActionSubjectList = {
                                ActionSubjectListSet: []
                            };
                            for (var m = 0; m < vActionSubjectList_Temp.length; m++) {
                                var fExits = false;
                                for (var j = 0; j < vSelectedPernr.length; j++) {
                                    if (vActionSubjectList_Temp[m].Pernr == vSelectedPernr[j]) {
                                        fExits = true;
                                        break;
                                    }
                                }
                                if (!fExits) {
                                    vNewActionSubjectList.ActionSubjectListSet.push(vActionSubjectList_Temp[m]);
                                }
                            }
                            mActionSubjectList_Temp.setData(vNewActionSubjectList);
                        } else {
                            MessageBox.alert(oController.getBundleText("MSG_02050"));
                            return;
                        }
                    } else {
                        process_result = false;

                        vCreateData.Pernr = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Pernr");
                        vCreateData.Percod = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Percod");
                        vCreateData.Ename = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Ename");
                        vCreateData.VoltId = oController._vUpdateData.VoltId;

                        var sPath = oModel.createKey("/ActionSubjectListSet", {
                            Docno: oController._vDocno,
                            Percod: vCreateData.Percod,
                            VoltId: oController._vUpdateData.VoltId,
                            Actda: Common.setTime(oActda.getDateValue())
                        });

                        oModel.update(sPath, vCreateData, {
                            success: function () {
                                process_result = true;
                                Common.log("Sucess ActionSubjectListSet Update !!!");
                            },
                            error: function (oError) {
                                var Err = {};
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                        Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                    } else {
                                        Common.showErrorMessage(Err.error.message.value);
                                    }
                                } else {
                                    Common.showErrorMessage(oError);
                                }
                                process_result = false;
                            }
                        });

                        if (!process_result) {
                            BusyIndicator.hide();

                            return;
                        }
                    }

                    for (var n = 0; n < 5; n++) {
                        var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (n + 1));
                        oMassn.setEnabled(false);
                        oMassn.setSelectedKey("0000");

                        var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (n + 1));
                        oMassg.removeAllItems();
                        oMassg.setEnabled(false);
                    }

                    var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                    oInputSwith.setState(false);

                    oController.initInputControl(oController);

                    vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");

                    if (oController._vActionType == "100" || oController._vActionType == "300") {
                        MessageBox.alert(oController.getBundleText("MSG_02020"), {
                            title: oController.getBundleText("LABEL_02093"),
                            onClose: function () {
                                BusyIndicator.hide();

                                if (vActionSubjectList_Temp == null || vActionSubjectList_Temp.length < 1) {
                                    sap.ui
                                        .getCore()
                                        .getEventBus()
                                        .publish("nav", "to", {
                                            id: oController._vFromPageId,
                                            data: {
                                                context: oController._oContext,
                                                Statu: oController._vStatu,
                                                Reqno: oController._vReqno,
                                                Docno: oController._vDocno,
                                                Docty: oController._vDocty
                                            }
                                        });
                                }
                            }
                        });
                    } else {
                        MessageBox.alert(oController.getBundleText("MSG_02020"), {
                            title: oController.getBundleText("LABEL_02093"),
                            onClose: function () {
                                BusyIndicator.hide();

                                sap.ui
                                    .getCore()
                                    .getEventBus()
                                    .publish("nav", "to", {
                                        id: oController._vFromPageId,
                                        data: {
                                            context: oController._oContext,
                                            Statu: oController._vStatu,
                                            Reqno: oController._vReqno,
                                            Docno: oController._vDocno,
                                            Docty: oController._vDocty
                                        }
                                    });
                            }
                        });
                    }
                };

                BusyIndicator.show(0);

                setTimeout(dataProcess, 300);
            },

            onCheckTableData: function (oController, ActiveControl) {
                var fResult = true;

                var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);

                var mItgrpList = sap.ui.getCore().getModel("JSON_" + ActiveControl.Itgrp);
                if (!mItgrpList) {
                    return true;
                }
                var vItgrpList = mItgrpList.getProperty("/TableDataList");

                if (vItgrpList && vItgrpList.length) {
                    for (var i = 0; i < vActionSubjectTableHeaderSet.length; i++) {
                        var Fieldname = Common.underscoreToCamelCase(vActionSubjectTableHeaderSet[i].Fieldname),
                            Fieldtype = vActionSubjectTableHeaderSet[i].Inpty,
                            vLabelText = vActionSubjectTableHeaderSet[i].Label;

                        if (Fieldtype == "M1" || Fieldtype == "M2" || Fieldtype == "M5" || Fieldtype == "M6" || Fieldtype == "M8") {
                            for (var v = 0; v < vItgrpList.length; v++) {
                                var vValue = vItgrpList[v][Fieldname];

                                if (vValue == "") {
                                    var vMsg = oController.getBundleText("MSG_02063");
                                    vMsg = vMsg.replace("&Cntl", vLabelText);
                                    MessageBox.alert(vMsg);
                                    return false;
                                }
                            }
                        } else if (Fieldtype == "M3" || Fieldtype == "M4" || Fieldtype == "M7") {
                            for (var m = 0; m < vItgrpList.length; m++) {
                                var vValue1 = vItgrpList[m][Fieldname];

                                if (vValue1 == "") {
                                    var vMsg1 = oController.getBundleText("MSG_02064");
                                    vMsg1 = vMsg1.replace("&Cntl", vLabelText);
                                    MessageBox.alert(vMsg1);
                                    return false;
                                }
                            }
                        }
                    }
                }
                return fResult;
            },

            onSaveTableData: function (oController, ActiveControl) {
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");

                var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);

                var mItgrpList = sap.ui.getCore().getModel("JSON_" + ActiveControl.Itgrp);
                if (!mItgrpList) {
                    return;
                }

                var vItgrpList = mItgrpList.getProperty("/TableDataList");

                var oActda = $.app.byId(oController.PAGEID + "_Actda");

                if (vItgrpList && vItgrpList.length) {
                    for (var v = 0; v < vItgrpList.length; v++) {
                        var vOneData = {};

                        vOneData.Docno = vItgrpList[v].Docno;
                        if (vItgrpList[v].VoltId != "") vOneData.VoltId = vItgrpList[v].VoltId;
                        vOneData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
                        vOneData.Pernr = vItgrpList[v].Pernr;
                        vOneData.Infty = vItgrpList[v].Infty;
                        vOneData.Subty = vItgrpList[v].Subty;
                        vOneData.Objps = vItgrpList[v].Objps;
                        vOneData.Sprps = vItgrpList[v].Sprps;
                        vOneData.Endda = vItgrpList[v].Endda;
                        vOneData.Begda = vItgrpList[v].Begda;
                        vOneData.Seqnr = vItgrpList[v].Seqnr;
                        vOneData.Isnew = vItgrpList[v].Isnew;
                        vOneData.Numbr = "" + vItgrpList[v].Numbr;

                        if (v == 0) {
                            vOneData.Actty = "X";
                        } else {
                            vOneData.Actty = "";
                        }

                        var fIdx = 1;

                        for (var i = 0; i < vActionSubjectTableHeaderSet.length; i++) {
                            var Fieldname = Common.underscoreToCamelCase(vActionSubjectTableHeaderSet[i].Fieldname),
                                TextFieldname = Fieldname + "_Tx";

                            if (Fieldname == "Begda" || Fieldname == "Endda") {
                                Fieldname = Fieldname + "T";
                                TextFieldname = Fieldname + "_Tx";
                            }

                            var idx = "00";
                            if (fIdx < 10) idx = "0" + fIdx;
                            else idx = "" + fIdx;

                            vOneData["Field" + idx] = Fieldname;
                            vOneData["Value" + idx] = vItgrpList[v][Fieldname];

                            var vTextValue = vItgrpList[v][TextFieldname];
                            if (vTextValue != "") {
                                vOneData["Valtx" + idx] = vItgrpList[v][TextFieldname];
                            }
                            fIdx++;
                        }
                        Common.log(vOneData);

                        var process_result = false;

                        oModel.create("/ActionSubjectTableSet", vOneData, {
                            success: function () {
                                process_result = true;
                                Common.log("Sucess ActionSubjectTableSet Create !!!");
                            },
                            error: function (oError) {
                                var Err = {};
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                        Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                    } else {
                                        Common.showErrorMessage(Err.error.message.value);
                                    }
                                } else {
                                    Common.showErrorMessage(oError);
                                }
                                process_result = false;
                            }
                        });

                        if (!process_result) {
                            BusyIndicator.hide();
                            return false;
                        }
                    }
                } else {
                    var vDelData = {};

                    vDelData.Docno = oController._vDocno;
                    vDelData.VoltId = oController._vPernrVoltid ? oController._vPernrVoltid : "";
                    vDelData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";
                    vDelData.Pernr = oController._vPernr;
                    vDelData.Infty = ActiveControl.Itgrp;
                    vDelData.Subty = "";
                    vDelData.Objps = "";
                    vDelData.Sprps = "";
                    vDelData.Endda = null;
                    vDelData.Begda = null;
                    vDelData.Seqnr = "";
                    vDelData.Isnew = "";
                    vDelData.Numbr = "001";
                    vDelData.Actty = "DA";

                    oModel.create("/ActionSubjectTableSet", vDelData, {
                        success: function () {
                            process_result = true;
                            Common.log("Sucess ActionSubjectTableSet Create !!!");
                        },
                        error: function (oError) {
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                    Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                                } else {
                                    Common.showErrorMessage(Err.error.message.value);
                                }
                            } else {
                                Common.showErrorMessage(oError);
                            }
                            process_result = false;
                        }
                    });

                    if (!process_result) {
                        BusyIndicator.hide();
                        return false;
                    }
                }
                return true;
            },

            displayMultiOrgSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);
                var oWerks = $.app.byId(oController.PAGEID + "_Werks");

                jQuery.sap.require("common.SearchOrg");

                common.SearchOrg.vPersa = (oWerks) ? oWerks.getSelectedKey() : "1000";
                common.SearchOrg.oController = oController;
                common.SearchOrg.vActionType = "Multi";
                common.SearchOrg.vCallControlId = oEvent.getSource().getId();
                common.SearchOrg.vCallControlType = "MultiInput";

                if (!oController._SerachOrgDialog) {
                    oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
                    oView.addDependent(oController._SerachOrgDialog);
                }
                oController._SerachOrgDialog.open();
            },

            displayOrgSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                jQuery.sap.require("common.SearchOrg");

                common.SearchOrg.oController = oController;
                common.SearchOrg.vActionType = "Single";
                common.SearchOrg.vCallControlId = oEvent.getSource().getId();
                common.SearchOrg.vCallControlType = "Input";
                common.SearchOrg.vNoPersa = true;

                if (!oController._SerachOrgDialog) {
                    oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
                    oView.addDependent(oController._SerachOrgDialog);
                }
                oController._SerachOrgDialog.open();
            },

            displayPrdAreaSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var mProductAreaModel = new JSONModel();
                var vProductAreaModel = {
                    PrdAreaCodeListSet: []
                };

                var vAddFilter = [
                    {
                        key: "Persa",
                        value: oController._vPersa
                    },
                    {
                        key: "Actda",
                        value: oController._vActda
                    }
				];
                var mEmpCodeList = oController.setSpecialCodeData("Zzprdar", vAddFilter, false);
                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");

                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        vProductAreaModel.PrdAreaCodeListSet.push(vEmpCodeList[i]);
                    }
                }
                mProductAreaModel.setData(vProductAreaModel);
                sap.ui.getCore().setModel(mProductAreaModel, "ProductAreaModel");

                SearchPrdArea.oController = oController;
                SearchPrdArea.vCallControlId = oEvent.getSource().getId();

                if (!oController._PrdAreaSearchDialog) {
                    oController._PrdAreaSearchDialog = sap.ui.jsfragment("fragment.ProductAreaSearch", oController);
                    oView.addDependent(oController._PrdAreaSearchDialog);
                }
                oController._PrdAreaSearchDialog.open();
            },

            displayCodeSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var mOneCodeModel = sap.ui.getCore().getModel("CodeListModel");
                mOneCodeModel.setData(null);
                var vOneCodeList = {
                    EmpCodeListSet: []
                };

                var oCustomData = oEvent.getSource().getCustomData();
                var Fieldname = oCustomData[0].getKey();

                var vTitle = oCustomData[1].getValue();

                var mEmpCodeList = null;

                var vAddFilter = [
                    {
                        key: "Persa",
                        value: oController._vPersa
                    },
                    {
                        key: "Actda",
                        value: oController._vActda
                    }
				];

                if (Fieldname == "Aus01") {
                    var vExcod = "";
                    if (oController._vMolga == "18") vExcod = "CZ01";
                    else if (oController._vMolga == "06") vExcod = "A004";
                    else vExcod = "A001";
                    vAddFilter.push({
                        key: "Excod",
                        value: vExcod
                    });

                    mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
                } else {
                    mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
                }

                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
                    }
                }
                mOneCodeModel.setData(vOneCodeList);

                SearchCode.oController = oController;
                SearchCode.vCallControlId = oEvent.getSource().getId();

                if (!oController._CodeSearchDialog) {
                    oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
                    oView.addDependent(oController._CodeSearchDialog);
                }
                oController._CodeSearchDialog.open();

                var oDialog = $.app.byId(oController.PAGEID + "_FCS_Dialog");
                oDialog.setTitle(vTitle);
            },

            displayTableCodeSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var mOneCodeModel = sap.ui.getCore().getModel("CodeListModel");
                mOneCodeModel.setData(null);
                var vOneCodeList = {
                    EmpCodeListSet: []
                };

                var oCustomData = oEvent.getSource().getCustomData();
                var Fieldname = oCustomData[0].getKey();
                var vTitle = oCustomData[1].getValue();
                var vItgrp = oCustomData[2].getValue();

                var mEmpCodeList = null;

                var vAddFilter = [
                    {
                        key: "Persa",
                        value: oController._vPersa
                    },
                    {
                        key: "Actda",
                        value: oController._vActda
                    }
				];

                if (Fieldname == "Lgart") {
                    vAddFilter.push({
                        key: "Excod",
                        value: vItgrp
                    });
                    mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
                } else {
                    mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
                }

                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");

                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
                    }
                }
                mOneCodeModel.setData(vOneCodeList);

                SearchCode.oController = oController;
                SearchCode.vCallControlId = oEvent.getSource().getId();

                if (!oController._CodeSearchDialog) {
                    oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
                    oView.addDependent(oController._CodeSearchDialog);
                }
                oController._CodeSearchDialog.open();

                var oDialog = $.app.byId(oController.PAGEID + "_FCS_Dialog");
                oDialog.setTitle(vTitle);
            },

            displayMultiStellSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);
                var oWerks = $.app.byId(oController.PAGEID + "_Werks");

                jQuery.sap.require("common.SearchStell");

                common.SearchStell.vPersa = (oWerks) ? oWerks.getSelectedKey() : "1000";
                common.SearchStell.oController = oController;
                common.SearchStell.vActionType = "Multi";
                common.SearchStell.vCallControlId = oEvent.getSource().getId();
                common.SearchStell.vCallControlType = "MultiInput";

                if (!oController._SerachStellDialog) {
                    oController._SerachStellDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", oController);
                    oView.addDependent(oController._SerachStellDialog);
                }
                oController._SerachStellDialog.open();
            },

            displayStellSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);
                var oWerks = $.app.byId(oController.PAGEID + "_Werks");

                jQuery.sap.require("common.SearchStell");

                common.SearchStell.vPersa = (oWerks) ? oWerks.getSelectedKey() : "1000";
                common.SearchStell.oController = oController;
                common.SearchStell.vActionType = "Single";
                common.SearchStell.vCallControlId = oEvent.getSource().getId();
                common.SearchStell.vCallControlType = "Input";

                if (!oController._SerachStellDialog) {
                    oController._SerachStellDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", oController);
                    oView.addDependent(oController._SerachStellDialog);
                }
                oController._SerachStellDialog.open();
            },

            _SerachKostlDialog: null,
            displayKostlSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                var vControlId = oEvent.getSource().getId();

                var oCustomData = oEvent.getSource().getCustomData();

                var vItgrp = "";
                for (var i = 0; i < oCustomData.length; i++) {
                    if (oCustomData[i].getKey() == "Itgrp") {
                        vItgrp = oCustomData[i].getValue();
                        break;
                    }
                }
                var vCompany = "";

                if (vItgrp != "") {
                    var oModel = sap.ui.getCore().getModel("JSON_" + vItgrp);
                    var pos1 = vControlId.lastIndexOf("-");
                    var idx = vControlId.substring(pos1 + 1);
                    vCompany = oModel.getProperty("/TableDataList/" + idx + "/Bukrs");

                    if (!vCompany || vCompany == "") {
                        var vMsg = oController.getBundleText("MSG_02063");
                        vMsg = vMsg.replace("&Cntl", "Company Code");
                        MessageBox.alert(vMsg);
                        return;
                    }
                }

                jQuery.sap.require("common.SearchKostl");

                common.SearchKostl.oController = oController;
                common.SearchKostl.vActionType = "Single";
                common.SearchKostl.vCallControlId = vControlId;
                common.SearchKostl.vCallControlType = "Input";
                common.SearchKostl.vCompany = vCompany;

                if (!oController._SerachKostlDialog) {
                    oController._SerachKostlDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_KOSTL", oController);
                    oView.addDependent(oController._SerachKostlDialog);
                }
                oController._SerachKostlDialog.open();
            },

            _SerachZzlojobDialog: null,
            displayZzlojobSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                jQuery.sap.require("common.SearchZzlojob");

                common.SearchZzlojob.oController = oController;
                common.SearchZzlojob.vActionType = "Single";
                common.SearchZzlojob.vCallControlId = oEvent.getSource().getId();
                common.SearchZzlojob.vCallControlType = "Input";

                if (!oController._SerachZzlojobDialog) {
                    oController._SerachZzlojobDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ZZLOJOB", oController);
                    oView.addDependent(oController._SerachZzlojobDialog);
                }
                oController._SerachZzlojobDialog.open();
            },

            displayEmplyeeSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                jQuery.sap.require("common.ActionSearchUser");

                common.ActionSearchUser.oController = oController;
                common.ActionSearchUser.vCallControlId = oEvent.getSource().getId();

                if (!oController._SerachEmplyeeDialog) {
                    oController._SerachEmplyeeDialog = sap.ui.jsfragment("fragment.ActionEmployeeSearch", oController);
                    oView.addDependent(oController._SerachEmplyeeDialog);
                }
                oController._SerachEmplyeeDialog.open();
            },

            /* Werks를 변경했을때 인사하위영역 값을 변경 한다. */
            onPressWerks: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var vWerks = oEvent.getSource().getSelectedKey();
                var oBtrtl = $.app.byId(oController.PAGEID + "_Btrtl");
                var oSchkz = $.app.byId(oController.PAGEID + "_Schkz");

                if (!oBtrtl) return;

                try {
                    oBtrtl.removeAllItems();
                    oBtrtl.destroyItems();
                    oBtrtl.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));

                    $.app.getModel("ZHR_ACTIONAPP_SRV").read("/PersSubareaListSet", {
                        async: false,
                        filters: [
							new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vWerks)
						],
                        success: function (oData) {
                            if (oData && oData.results.length) {
                                for (var i = 0; i < oData.results.length; i++) {
                                    oBtrtl.addItem(new sap.ui.core.Item({
                                        key: oData.results[i].Btrtl,
                                        text: oData.results[i].Btext
                                    }));
                                }
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                        }
                    });

                    oBtrtl.setSelectedKey("0000");
                    if (oSchkz) {
                        oSchkz.destroyItems();
                        oSchkz.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                        oSchkz.setSelectedKey("0000");
                    }
                } catch (ex) {
                    Common.log(ex);
                }
            },

            onChangeRet_persa: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oRet_persa = oEvent.getSource();
                var vPersa = oRet_persa.getSelectedKey();
                var mDataModel = null;
                var vDataModel = null;
                var vAddFilter = [
                    {
                        key: "Persa",
                        value: oController._vPersa
                    },
                    {
                        key: "Actda",
                        value: oController._vActda
                    },
                    {
                        key: "Excod",
                        value: vPersa
                    }
				];

                try {
                    var oRet_btrtl = $.app.byId(oController.PAGEID + "_Ret_btrtl");
                    if (oRet_btrtl) {
                        oRet_btrtl.removeAllItems();
                        oRet_btrtl.destroyItems();

                        mDataModel = oController.setSpecialCodeData("Ret_btrtl", vAddFilter, true);
                        vDataModel = mDataModel.getProperty("/EmpCodeListSet");
                        if (vDataModel && vDataModel.length) {
                            for (var i = 0; i < vDataModel.length; i++) {
                                oRet_btrtl.addItem(new sap.ui.core.Item({
                                    key: vDataModel[i].Ecode,
                                    text: vDataModel[i].Etext
                                }));
                            }
                        }

                        var vDefaultValue = "";
                        for (var j = 0; j < oController._vActiveControl.length; j++) {
                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[j].Fieldname);

                            if (Fieldname == "RetBtrtl") {
                                vDefaultValue = oController._vActiveControl[j].Dcode;
                                break;
                            }
                        }

                        if (vDefaultValue != "") {
                            oRet_btrtl.setSelectedKey(vDefaultValue);
                        }
                    }

                    var oRet_zzjobsr = $.app.byId(oController.PAGEID + "_Ret_zzjobsr");
                    if (oRet_zzjobsr) {
                        oRet_zzjobsr.removeAllItems();
                        oRet_zzjobsr.destroyItems();

                        mDataModel = oController.setSpecialCodeData("Ret_zzjobsr", vAddFilter, true);
                        vDataModel = mDataModel.getProperty("/EmpCodeListSet");
                        if (vDataModel && vDataModel.length) {
                            for (var k = 0; k < vDataModel.length; k++) {
                                oRet_zzjobsr.addItem(new sap.ui.core.Item({
                                    key: vDataModel[k].Ecode,
                                    text: vDataModel[k].Etext
                                }));
                            }
                        }
                    }
                } catch (ex) {
                    Common.log(ex);
                }
            },

            onPressHost_werks: function (oEvent) {
                var vWerks = oEvent.getSource().getSelectedKey();

                $.app.getController(SUB_APP_ID).onSelectHost_werks(vWerks);
            },

            onSelectHost_werks: function (vWerks) {
                var oController = $.app.getController(SUB_APP_ID);
                var oHost_staff = $.app.byId(oController.PAGEID + "_Host_staff");

                if (!oHost_staff) return;

                try {
                    oHost_staff.removeAllItems();
                    oHost_staff.destroyItems();
                    oHost_staff.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));

                    $.app.getModel("ZHR_ACTIONAPP_SRV").read("/HostStaffListSet", {
                        async: false,
                        filters: [
							new sap.ui.model.Filter("Host_werks", sap.ui.model.FilterOperator.EQ, vWerks),
							new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda)))
						],
                        success: function (oData) {
                            if (oData && oData.results.length) {
                                for (var i = 0; i < oData.results.length; i++) {
                                    oHost_staff.addItem(new sap.ui.core.Item({
                                        key: oData.results[i].Host_staff,
                                        text: oData.results[i].Host_staff_Tx
                                    }));
                                }
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                        }
                    });
                } catch (ex) {
                    Common.log(ex);
                }
            },

            onPressAllUnSelect: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oList = $.app.byId(oController.PAGEID + "_List");
                var oItems = oList.getItems();

                if (oItems && oItems.length) {
                    for (var i = 0; i < oItems.length; i++) {
                        oList.setSelectedItem(oItems[i], false);
                    }
                }

                for (var j = 0; j < 5; j++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                    oMassn.setEnabled(false);
                    oMassn.setSelectedKey("0000");

                    var oMassg = $.app.byId(oController.PAGEID + "_Massg" + (j + 1));
                    oMassg.setEnabled(false);
                    oMassg.removeAllItems();
                }

                oController.initInputControl(oController);

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setState(false);
            },

            onPressAllSelect: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oList = $.app.byId(oController.PAGEID + "_List");
                var oItems = oList.getItems();

                if (oItems && oItems.length) {
                    for (var i = 0; i < oItems.length; i++) {
                        oList.setSelectedItem(oItems[i], true);
                    }
                }

                for (var j = 0; j < 5; j++) {
                    var oMassn = $.app.byId(oController.PAGEID + "_Massn" + (j + 1));
                    oMassn.setEnabled(true);
                    oMassn.setSelectedKey("0000");
                }
            },

            replaceString: function (data, c1, c2) {
                if (data == "") return "";
                var r = "";
                for (var i = 0; i < data.length; i++) {
                    if (data.substring(i, i + 1) == c1) {
                        r += c2;
                    } else {
                        r += data.substring(i, i + 1);
                    }
                }
                return r;
            },

            setSpecialCodeData: function (Fieldname, vAddFilter, select) {
                var oController = $.app.getController(SUB_APP_ID);
                var mCodeModel = new JSONModel();
                var vCodeModel = {
                    EmpCodeListSet: []
                };

                for (var i = 0; i < vAddFilter.length; i++) {
                    if (vAddFilter[i].key == "Excod") {
                        var vExcod = vAddFilter[i].value;
                        vExcod = oController.replaceString(vExcod, "|", "");

                        if (vExcod == "") {
                            if (select == true) {
                                vCodeModel.EmpCodeListSet.push({
                                    Field: Fieldname,
                                    Ecode: "0000",
                                    Etext: oController.getBundleText("LABEL_02035")
                                });
                            }
                            mCodeModel.setData(vCodeModel);
                            return mCodeModel;
                        }
                    }
                }

                if (select == false) {
                    vCodeModel.EmpCodeListSet.push({
                        Field: Fieldname,
                        Ecode: "",
                        Etext: oController.getBundleText("LABEL_02279")
                    });
                } else {
                    vCodeModel.EmpCodeListSet.push({
                        Field: Fieldname,
                        Ecode: "0000",
                        Etext: oController.getBundleText("LABEL_02035")
                    });
                }

                var subFilters = [];
                vAddFilter.forEach(function (elem) {
                    subFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? new Date(elem.value) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
                    async: false,
                    filters: [
                        new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, Fieldname),
                        new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId()),
						new sap.ui.model.Filter({
                            filters: subFilters,
                            and: true
                        })
					],
                    success: function (oData) {
                        if (oData && oData.results) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vCodeModel.EmpCodeListSet.push(oData.results[i]);
                            }
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                mCodeModel.setData(vCodeModel);

                return mCodeModel;
            },

            setRlsOrgehCodeData: function (Fieldname, vAddFilter) {
                var mReleaseOrgListSet = new JSONModel();
                var vReleaseOrgListSet = {
                    ReleaseOrgListSet: []
                };

                vReleaseOrgListSet.ReleaseOrgListSet.push({
                    Field: Fieldname,
                    Rls_orgeh: "0000",
                    Rls_orgeh_Tx: this.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? new Date(elem.value) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ReleaseOrgListSet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vReleaseOrgListSet.ReleaseOrgListSet.push(oData.results[i]);
                            }
                            mReleaseOrgListSet.setData(vReleaseOrgListSet);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return mReleaseOrgListSet;
            },

            setRlsWerksCodeData: function (Fieldname, vAddFilter) {
                var mReleasePersAreaListSet = new JSONModel();
                var vReleasePersAreaListSet = {
                    ReleasePersAreaListSet: []
                };

                vReleasePersAreaListSet.ReleasePersAreaListSet.push({
                    Field: Fieldname,
                    Rls_werks: "0000",
                    Rls_werks_Tx: this.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? new Date(elem.value) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ReleasePersAreaListSet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vReleasePersAreaListSet.ReleasePersAreaListSet.push(oData.results[i]);
                            }
                            mReleasePersAreaListSet.setData(vReleasePersAreaListSet);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return mReleasePersAreaListSet;
            },

            setHomeStaffCodeData: function (Fieldname, vAddFilter) {
                var mHomeStaffListSet = new JSONModel();
                var vHomeStaffListSet = {
                    HomeStaffListSet: []
                };

                vHomeStaffListSet.HomeStaffListSet.push({
                    Field: Fieldname,
                    Home_staff: "0000",
                    Home_staff_Tx: this.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? new Date(elem.value) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/HomeStaffListSet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vHomeStaffListSet.HomeStaffListSet.push(oData.results[i]);
                            }
                            mHomeStaffListSet.setData(vHomeStaffListSet);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return mHomeStaffListSet;
            },

            setHostStaffCodeData: function (Fieldname, vAddFilter) {
                var mHostStaffListSet = new JSONModel();
                var vHostStaffListSet = {
                    HostStaffListSet: []
                };

                vHostStaffListSet.HostStaffListSet.push({
                    Field: Fieldname,
                    Host_staff: "0000",
                    Host_staff_Tx: this.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? new Date(elem.value) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/HostStaffListSet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vHostStaffListSet.HostStaffListSet.push(oData.results[i]);
                            }
                            mHostStaffListSet.setData(vHostStaffListSet);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return mHostStaffListSet;
            },

            onPressTrfar: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oTrfgb = $.app.byId(oController.PAGEID + "_Trfgb");
                var oTrfgr = $.app.byId(oController.PAGEID + "_Trfgr");
                var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");
                var oPersg = $.app.byId(oController.PAGEID + "_Persg");
                var oPersk = $.app.byId(oController.PAGEID + "_Persk");

                if (oTrfgb && oTrfgr && oTrfst) {
                    oTrfgr.destroyItems();

                    var vPersg = "";
                    var vPersk = "";
                    if (oPersg) vPersg = oPersg.getSelectedKey();
                    if (oPersk) vPersk = oPersk.getSelectedKey();

                    if (oControl.getSelectedKey() != "0000") {
                        var vExcod = oController._vMolga + "|" + oControl.getSelectedKey() + "|" + oTrfgb.getSelectedKey() + "|" + vPersg + "|" + vPersk;
                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);

                        oTrfgr.setModel(mDataModel);
                        oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oTrfgr.setSelectedKey("0000");
                    } else {
                        oTrfgr.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }

                    oTrfst.destroyItems();
                    oTrfst.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));
                }

                oController.onChangeCurrency2(oController);
            },

            onPressTrfgb: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oTrfar = $.app.byId(oController.PAGEID + "_Trfar");
                var oTrfgr = $.app.byId(oController.PAGEID + "_Trfgr");
                var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");
                var oPersg = $.app.byId(oController.PAGEID + "_Persg");
                var oPersk = $.app.byId(oController.PAGEID + "_Persk");

                if (oTrfar && oTrfgr && oTrfst) {
                    oTrfgr.destroyItems();

                    var vPersg = "";
                    var vPersk = "";
                    if (oPersg) vPersg = oPersg.getSelectedKey();
                    if (oPersk) vPersk = oPersk.getSelectedKey();

                    if (oControl.getSelectedKey() != "0000") {
                        var vExcod = oController._vMolga + "|" + oTrfar.getSelectedKey() + "|" + oControl.getSelectedKey() + "|" + vPersg + "|" + vPersk;
                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);

                        oTrfgr.setModel(mDataModel);
                        oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oTrfgr.setSelectedKey("0000");
                    } else {
                        oTrfgr.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }

                    oTrfst.destroyItems();
                    oTrfst.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));
                }

                oController.onChangeCurrency2(oController);
            },

            onPressTrfgr: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oTrfar = $.app.byId(oController.PAGEID + "_Trfar");
                var oTrfgb = $.app.byId(oController.PAGEID + "_Trfgb");
                var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");
                var oPersg = $.app.byId(oController.PAGEID + "_Persg");
                var oPersk = $.app.byId(oController.PAGEID + "_Persk");

                if (oTrfar && oTrfgb && oTrfst) {
                    oTrfst.destroyItems();

                    var vPersg = "";
                    var vPersk = "";
                    if (oPersg) vPersg = oPersg.getSelectedKey();
                    if (oPersk) vPersk = oPersk.getSelectedKey();

                    if (oControl.getSelectedKey() != "0000") {
                        var vExcod = [
							oController._vMolga,
							oTrfar.getSelectedKey(),
							oTrfgb.getSelectedKey(),
							oControl.getSelectedKey(),
							vPersg,
							vPersk
						].join("|");

                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("Trfst", vAddFilter, true);

                        oTrfst.setModel(mDataModel);
                        oTrfst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                    } else {
                        oTrfst.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }
            },

            onPressPersg: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oPersk = $.app.byId(oController.PAGEID + "_Persk");

                if (oPersk) {
                    oPersk.destroyItems();

                    if (oControl.getSelectedKey() != "0000") {
                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: oControl.getSelectedKey()
                            }
						];
                        var mDataModel = oController.setSpecialCodeData("Persk", vAddFilter, true);

                        oPersk.setModel(mDataModel);
                        oPersk.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oPersk.setSelectedKey("0000");
                    } else {
                        oPersk.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }
                try {
                    var oSchkz = $.app.byId(oController.PAGEID + "_Schkz");
                    if (oSchkz) {
                        oSchkz.destroyItems();
                        oSchkz.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }

                    var oTrfgr = $.app.byId(oController.PAGEID + "_Trfgr");
                    if (oTrfgr) {
                        oTrfgr.destroyItems();
                        oTrfgr.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }

                    var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");
                    if (oTrfst) {
                        oTrfst.destroyItems();
                        oTrfst.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }

                    var oBtrtl = $.app.byId(oController.PAGEID + "_Btrtl");
                    var oAbkrs = $.app.byId(oController.PAGEID + "_Abkrs");
                    if (oPersk && oAbkrs && oBtrtl) {
                        var vDeafultValue = oController.getDefaultValue(
                            oController,
                            "Abkrs",
                            oControl.getSelectedKey(),
                            oPersk.getSelectedKey(),
                            oBtrtl.getSelectedKey()
                        );
                        oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs");
                    }
                } catch (ex) {
                    Common.log(ex);
                }
            },

            setDefaultValue: function (oController, vDeafultValue, oControl, Field) {
                var Fieldtype = "";
                for (var i = 0; i < oController._vActiveControl.length; i++) {
                    if (Field.toUpperCase() == oController._vActiveControl[i].Fieldname.toUpperCase()) {
                        Fieldtype = oController._vActiveControl[i].Incat;
                        break;
                    }
                }

                var vEcode = "";
                var vEtext = "";
                if (vDeafultValue != null) {
                    vEcode = vDeafultValue.Ecode;
                    vEtext = vDeafultValue.Etext;
                }

                if (Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
                    if (vEcode == "") vEcode = "0000";
                    oControl.setSelectedKey(vEcode);
                } else if (Fieldtype == "M2" || Fieldtype == "O2" || Fieldtype == "M5" || Fieldtype == "O5") {
                    oControl.setValue(vEtext);

                    var oCustomData = oControl.getCustomData();
                    if (oCustomData) {
                        var vKey = oCustomData[0].getKey();
                        oControl.removeAllCustomData();
                        oControl.destroyCustomData();
                        oControl.addCustomData(new sap.ui.core.CustomData({
                            key: vKey,
                            value: vEcode
                        }));

                        oCustomData.forEach(function (elem) {
                            oControl.addCustomData(elem);
                        });
                    }
                }
            },

            onPressPersk: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oWerks = $.app.byId(oController.PAGEID + "_Werks");
                var oBtrtl = $.app.byId(oController.PAGEID + "_Btrtl");
                var oPersg = $.app.byId(oController.PAGEID + "_Persg");
                var oSchkz = $.app.byId(oController.PAGEID + "_Schkz");
                var excods = [];
                var vExcod = "";
                var vDeafultValue = "";
                var vAddFilter = null;
                var mDataModel = null;

                if (oSchkz && oPersg && oBtrtl && oWerks) {
                    oSchkz.destroyItems();

                    if (oControl.getSelectedKey() != "0000") {
                        excods = [
                            oWerks.getSelectedKey(),
                            oBtrtl.getSelectedKey(),
                            oPersg.getSelectedKey(),
                            oControl.getSelectedKey()
                        ];
                        vExcod = excods.join("|");
                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData("Schkz", vAddFilter, true);

                        oSchkz.setModel(mDataModel);
                        oSchkz.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        vDeafultValue = oController.getDefaultValue(
                            oController,
                            "Schkz",
                            oPersg.getSelectedKey(),
                            oControl.getSelectedKey(),
                            oBtrtl.getSelectedKey()
                        );
                        oController.setDefaultValue(oController, vDeafultValue, oSchkz, "Schkz");
                    } else {
                        oSchkz.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }

                var oTrfgr = $.app.byId(oController.PAGEID + "_Trfgr");
                var oTrfgb = $.app.byId(oController.PAGEID + "_Trfgb");
                var oTrfar = $.app.byId(oController.PAGEID + "_Trfar");
                if (oTrfgr && oPersg && oTrfgb && oTrfar) {
                    oTrfgr.destroyItems();

                    if (oControl.getSelectedKey() != "0000") {
                        vExcod = [
							oController._vMolga,
							oTrfar.getSelectedKey(),
							oTrfgb.getSelectedKey(),
							oPersg.getSelectedKey(),
							oControl.getSelectedKey()
						].join("|");

                        vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);

                        oTrfgr.setModel(mDataModel);
                        oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oTrfgr.setSelectedKey("0000");
                    } else {
                        oTrfgr.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }

                var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");
                if (oTrfst) {
                    oTrfst.destroyItems();
                    oTrfst.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));
                }

                var oAbkrs = $.app.byId(oController.PAGEID + "_Abkrs");
                if (oPersg && oAbkrs && oBtrtl) {
                    vDeafultValue = oController.getDefaultValue(
                        oController,
                        "Abkrs",
                        oPersg.getSelectedKey(),
                        oControl.getSelectedKey(),
                        oBtrtl.getSelectedKey()
                    );
                    oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs");
                }
            },

            onPressAddOrgeh: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oListControl = $.app.byId("ActAppPersonInfo_List");
                var selectedItems = oListControl.getSelectedItems();
                var oEmpModel = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                var oControl = $.app.byId(oController.PAGEID + "_AddOrgeh");
                var vPercod = "";

                if (oListControl.getMode() === "None") {
                    vPercod = oEmpModel.getProperty("/ActionSubjectListSet/0/Percod");
                } else {
                    vPercod = oEmpModel.getProperty(selectedItems[0].getBindingContextPath() + "/Percod");
                }

                // 초기화
                var detailFields = [
                    "AddZpost",
                    "AddZhgrade",
                    "AddZpGrade",
                    "AddOptio",
                    "AddAddpo",
                    "AddMss"
                ];

                detailFields.forEach(function (field) {
                    var targetControl = $.app.byId(oController.PAGEID + "_" + field);

                    if (targetControl) {
                        var constructorName = targetControl.constructor.getMetadata().getName();
                        if(constructorName === "sap.m.Input") {
                            targetControl.setValue("");
                        } else if(constructorName === "sap.m.ComboBox") {
                            targetControl.setSelectedKey("");
                        } else {
                            targetControl.setSelected(false);
                        }
                    }
                });

                var mDataModel = oController.setSpecialCodeData("AddDetail", [{
                    key: "Percod",
                    value: vPercod
                }, {
                    key: "Persa",
                    value: oController._vPersa
                }, {
                    key: "Actda",
                    value: oController._vActda
                }, {
                    key: "Excod",
                    value: oControl.getSelectedKey()
                }], true);

                var detailDataList = mDataModel.getProperty("/EmpCodeListSet");

                if (detailDataList.length) {
                    detailDataList.shift();
                    detailDataList.forEach(function (data) {
                        var oControl = $.app.byId(oController.PAGEID + "_" + data.Excod);

                        if (oControl) {
                            var constructorName = oControl.constructor.getMetadata().getName();

                            if(constructorName === "sap.m.Input") {
                                oControl.setValue(data.Etext);
                            } else if(constructorName === "sap.m.ComboBox") {
                                oControl.setSelectedKey(data.Ecode);
                            } else {
                                oControl.setSelected(data.Etext === "X" ? true : false);
                            }
                        }
                    });
                }
            },

            onPressBtrtl: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oWerks = $.app.byId(oController.PAGEID + "_Werks");
                var oBtrtl = $.app.byId(oController.PAGEID + "_Btrtl");
                var oPersg = $.app.byId(oController.PAGEID + "_Persg");
                var oPersk = $.app.byId(oController.PAGEID + "_Persk");
                var oSchkz = $.app.byId(oController.PAGEID + "_Schkz");
                var vDeafultValue = "";

                if (oSchkz && oWerks && oBtrtl) {
                    oSchkz.destroyItems();

                    if (oControl.getSelectedKey() != "0000") {
                        var oListControl = $.app.byId("ActAppPersonInfo_List");
                        var oEmpModel = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                        var excods = [
                            oWerks.getSelectedKey(),
                            oBtrtl.getSelectedKey()
                        ];

                        if (oPersg && oPersk) {
                            excods.push(oPersg.getSelectedKey());
                            excods.push(oPersk.getSelectedKey());
                        } else {
                            if (oListControl.getMode() === "None") {
                                excods.push(oEmpModel.getProperty("/ActionSubjectListSet/0/Percod"));
                            } else {
                                oListControl.getSelectedItems().forEach(function (item) {
                                    excods.push(
                                        oEmpModel.getProperty(item.getBindingContextPath() + "/Percod")
                                    );
                                });
                            }
                        }
                        var vExcod = excods.join("|");
                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vExcod
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("Schkz", vAddFilter, true);

                        oSchkz.setModel(mDataModel);
                        oSchkz.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oSchkz.setSelectedKey("0000");
                        // vDeafultValue = oController.getDefaultValue(
                        //     oController,
                        //     "Schkz",
                        //     oWerks.getSelectedKey(),
                        //     oBtrtl.getSelectedKey(),
                        //     oControl.getSelectedKey()
                        // );
                        // oController.setDefaultValue(oController, vDeafultValue, oSchkz, "Schkz");
                    } else {
                        oSchkz.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }

                var oAbkrs = $.app.byId(oController.PAGEID + "_Abkrs");
                if (oAbkrs && oWerks && oBtrtl) {
                    vDeafultValue = oController.getDefaultValue(
                        oController,
                        "Abkrs",
                        oWerks.getSelectedKey(),
                        oBtrtl.getSelectedKey(),
                        oControl.getSelectedKey()
                    );
                    oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs");
                }
            },

            getDefaultValue: function (oController, Field, Persg, Persk, Btrtl) {
                var vDefaultValue = {
                    valueSet: []
                };

                if (Persg == "" || Persg == "0000") return null;
                if (Persk == "" || Persk == "0000") return null;
                if (Btrtl == "" || Btrtl == "0000") return null;

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionDefaultValueSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(new Date(oController._vActda))),
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, Field),
						new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, Persg),
						new sap.ui.model.Filter("Persk", sap.ui.model.FilterOperator.EQ, Persk),
						new sap.ui.model.Filter("Btrtl", sap.ui.model.FilterOperator.EQ, Btrtl)
					],
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            vDefaultValue = oData.results[0];
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return vDefaultValue;
            },

            onLiveChange: function (oEvent) {
                var s = oEvent.getParameter("value");
                if (s == "") {
                    oEvent.getSource().removeAllCustomData();
                }
            },

            onChangeActda: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();

                if (oEvent.getParameter("valid") == false) {
                    MessageBox.alert(oController.getBundleText("MSG_02047"), {
                        onClose: function () {
                            oControl.setValue("");
                        }
                    });
                } else {
                    var vDate = oEvent.getParameter("value");
                    oController._vActda = vDate;
                }
            },

            onPressChangeDate: function () {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                if (!oController._ChangeDateDialog) {
                    oController._ChangeDateDialog = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ChangeDateDialog", oController);
                    oView.addDependent(oController._ChangeDateDialog);
                }
                oController._ChangeDateDialog.open();
            },

            onCDClose: function () {
                var oController = $.app.getController(SUB_APP_ID);

                if (oController._ChangeDateDialog.isOpen()) {
                    oController._ChangeDateDialog.close();
                }
            },

            onChangeActionDate: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var vUpdateData = {};
                var oCDActda = $.app.byId(oController.PAGEID + "_CD_Actda");
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var oActda = $.app.byId(oController.PAGEID + "_Actda");

                vUpdateData.Docno = oController._vDocno;
                vUpdateData.Pernr = oController._vPernr;
                vUpdateData.VoltId = oController._vPernrVoltid;
                vUpdateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
                vUpdateData.ActdaAft = "/Date(" + Common.getTime(oCDActda.getValue()) + ")/";

                var process_result = false;

                var sPath = oModel.createKey("/ActionDateSet", {
                    Docno: oController._vDocno,
                    Percod: oController._vPercod,
                    VoltId: oController._vPernrVoltid,
                    Actda: Common.setTime(oActda.getDateValue())
                });

                oModel.update(sPath, vUpdateData, {
                    success: function () {
                        process_result = true;
                        oController._vActda = oCDActda.getValue();
                        oController._vPernrActda = new Date(oCDActda.getValue());
                        oActda.setValue(oCDActda.getValue());

                        Common.log("Sucess ActionDate Update !!!");
                    },
                    error: function (oError) {
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                            } else {
                                Common.showErrorMessage(Err.error.message.value);
                            }
                        } else {
                            Common.showErrorMessage(oError);
                        }
                        process_result = false;
                    }
                });

                if (!process_result) {
                    // BusyIndicator.hide();
                    return;
                }

                MessageBox.alert(oController.getBundleText("MSG_02065"), {
                    title: oController.getBundleText("LABEL_02093")
                });

                oController.onCDClose();
            },

            onBeforeOpenChangeDateDialog: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oCDActda = $.app.byId(oController.PAGEID + "_CD_Actda");
                var oActda = $.app.byId(oController.PAGEID + "_Actda");

                oCDActda.setValue(oActda.getValue());
            },

            changeDate: function (oEvent) {
                var oControl = oEvent.getSource();
                if (oEvent.getParameter("valid") == false) {
                    MessageBox.alert(this.getBundleText("MSG_02047"), {
                        onClose: function () {
                            oControl.setValue("");
                        }
                    });
                }
            },

            onChangeZhgrade: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oZhgrade = oEvent.getSource();
                var vZhgrade = oZhgrade.getSelectedKey();
                var oZpGrade = $.app.byId(oController.PAGEID + "_ZpGrade");

                try {
                    if (oZpGrade && vZhgrade) {
                        oZpGrade.removeAllItems();
                        oZpGrade.destroyItems();

                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vZhgrade
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("ZpGrade", vAddFilter, true);
                        var vDataModel = mDataModel.getProperty("/EmpCodeListSet");

                        if (vDataModel && vDataModel.length) {
                            vDataModel.forEach(function (elem) {
                                oZpGrade.addItem(new sap.ui.core.Item({
                                    key: elem.Ecode,
                                    text: elem.Etext
                                }));
                            });
                        }
                        oZpGrade.setSelectedKey("0000");
                    }
                } catch(err) {
                    Common.log(err);
                }
            },

            onChangeAddZhgrade: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oZhgrade = oEvent.getSource();
                var vZhgrade = oZhgrade.getSelectedKey();
                var oZpGrade = $.app.byId(oController.PAGEID + "_AddZpGrade");

                try {
                    if (oZpGrade && vZhgrade) {
                        oZpGrade.removeAllItems();
                        oZpGrade.destroyItems();

                        var vAddFilter = [
                            {
                                key: "Persa",
                                value: oController._vPersa
                            },
                            {
                                key: "Actda",
                                value: oController._vActda
                            },
                            {
                                key: "Excod",
                                value: vZhgrade
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("AddZpGrade", vAddFilter, true);
                        var vDataModel = mDataModel.getProperty("/EmpCodeListSet");

                        if (vDataModel && vDataModel.length) {
                            vDataModel.forEach(function (elem) {
                                oZpGrade.addItem(new sap.ui.core.Item({
                                    key: elem.Ecode,
                                    text: elem.Etext
                                }));
                            });
                        }
                    }
                } catch (err) {
                    Common.log(err);
                }
            },

            changeAmount: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oAnsal = $.app.byId(oController.PAGEID + "_Ansal");
                var oBet01 = $.app.byId(oController.PAGEID + "_Bet01");
                var oBet02 = $.app.byId(oController.PAGEID + "_Bet02");
                var oBet03 = $.app.byId(oController.PAGEID + "_Bet03");
                var oBet01_v2 = $.app.byId(oController.PAGEID + "_Bet01_v2");
                var vControls = ["Ansal", "Bet01", "Bet02", "Bet03", "Lga01", "Lga02", "Lga03", "Bet01_v2", "Persg", "Persk", "Trfar", "Trfgb", "Waers"];
                var vFilterDatas = [];

                for (var i = 0; i < vControls.length; i++) {
                    var oControl = $.app.byId(oController.PAGEID + "_" + vControls[i]);
                    var vVal = "";
                    if (oControl) {
                        for (var c = 0; c < oController._vActiveControl.length; c++) {
                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[c].Fieldname),
                                Fieldtype = oController._vActiveControl[c].Incat;

                            if (vControls[i] == Fieldname) {
                                if (Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
                                    vVal = oControl.getSelectedKey();
                                    if (vVal == "0000") vVal = "";
                                } else if (Fieldtype == "M3" || Fieldtype == "O3") {
                                    vVal = oControl.getValue();
                                } else if (Fieldtype == "M5" || Fieldtype == "O5") {
                                    var oCustomData = oControl.getCustomData();
                                    if (oCustomData && oCustomData.length) {
                                        vVal = oCustomData[0].getValue();
                                    }
                                }
                                break;
                            }
                        }
                    }
                    vFilterDatas.push({
                        key: vControls[i],
                        value: vVal
                    });
                }

                var vCmode = "";
                var oControlId = oEvent.getSource().getId();
                if (oControlId.indexOf("Ansal") != -1) {
                    vCmode = "B";
                } else {
                    vCmode = "A";
                }

                var vOneData = {};
                vOneData.Cmode = vCmode;
                vOneData.Persa = oController._vPersa;
                vOneData.Pernr = oController._vPernr;
                vOneData.Actda = "/Date(" + Common.getTime(oController._vActda) + ")/";

                vFilterDatas.forEach(function (elem) {
                    if (elem.value != "") {
                        if (elem.key == "Bet01_v2") {
                            vOneData.Bet01 = elem.value;
                        } else {
                            vOneData[elem.key] = elem.value;
                        }
                    }
                });

                $.app.getModel("ZHR_ACTIONAPP_SRV").create("/CalculateAnsalWagetypeSet", vOneData, {
                    success: function (oData) {
                        if (oData) {
                            if (vCmode == "A") {
                                if (oAnsal) oAnsal.setValue(oData.Ansal);
                            } else {
                                if (oBet01) oBet01.setValue(oData.Bet01);
                                if (oBet02) oBet02.setValue(oData.Bet02);
                                if (oBet03) oBet03.setValue(oData.Bet03);
                                if (oBet01_v2) oBet01_v2.setValue(oData.Bet01);
                            }
                        }
                        Common.log("Sucess CalculateAnsalWagetypeSet Create !!!");
                    },
                    error: function (oError) {
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
                                Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
                            } else {
                                Common.showErrorMessage(Err.error.message.value);
                            }
                        } else {
                            Common.showErrorMessage(oError);
                        }
                    }
                });
            },

            onChangeCurrency2: function (oController) {
                var oWaers2 = $.app.byId(oController.PAGEID + "_Waers2");
                var oTrfar = $.app.byId(oController.PAGEID + "_Trfar");
                var oTrfgb = $.app.byId(oController.PAGEID + "_Trfgb");
                var oActda = $.app.byId(this.PAGEID + "_Actda");

                if (!oWaers2) return;

                var aFilters = [
					new sap.ui.model.Filter("Molga", sap.ui.model.FilterOperator.EQ, oController._vMolga),
					new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, Common.setTime(oActda.getDateValue()))
				];

                if (oTrfar) aFilters.push(new sap.ui.model.Filter("Trfar", sap.ui.model.FilterOperator.EQ, oTrfar.getSelectedKey()));
                if (oTrfgb) aFilters.push(new sap.ui.model.Filter("Trfgb", sap.ui.model.FilterOperator.EQ, oTrfgb.getSelectedKey()));

                $.app.getModel("ZHR_ACTIONAPP_SRV").read("/GetPayScaleCurrencySet", {
                    async: false,
                    filters: aFilters,
                    success: function (oData) {
                        if (oData.results && oData.results.length) {
                            oWaers2.setValue(oData.results[0].Waers);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModel({
                    name: "951009"
                });
            } : null
        });
    }
);