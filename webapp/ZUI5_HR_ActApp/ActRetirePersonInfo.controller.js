sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"ZUI5_HR_ActApp/common/Common",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"common/SearchUser1",
		"common/SearchPrdArea",
		"common/SearchCode"
	],
    function (Common, CommonController, AcpAppCommon, JSONModel, BusyIndicator, MessageBox, SearchUser1, SearchPrdArea, SearchCode) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRetirePersonInfo"].join(".");

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "ActRetirePersonInfo",
            Wave: "2",

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
            _vMolga: "",
            _oContext: null,

            vMassn: "90",

            _vPernrActda: "",
            _vPernrVoltid: "",

            _vUpdateData: null,

            _vFromPageId: "",

            _vActiveControl: null, //활성화된 발령내역 입력 항목
            _vActiveMassn: null, //선택된 발령유형/사유
            _vSelectedTrfgr: "",
            _vSelectedPersg: "",

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
            },

            onAfterShow: function (oEvent) {
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd"
                });

                if (oEvent) {
                    this._vActionType = oEvent.data.actiontype;
                    this._vStatu = oEvent.data.Statu;
                    this._vReqno = oEvent.data.Reqno;
                    this._vDocno = oEvent.data.Docno;
                    this._vDocty = oEvent.data.Docty;
                    this._vEntrs = oEvent.data.Entrs;
                    this._vPersa = oEvent.data.Persa;
                    this._vActda = oEvent.data.Actda;
                    this._vMolga = oEvent.data.Molga;
                    this._oContext = oEvent.data.context;
                    this._vFromPageId = oEvent.data.FromPageId;

                    this._vPernr = oEvent.data.Pernr;
                    this._vPernrActda = oEvent.data.PernrActda;
                    this._vPernrVoltid = oEvent.data.PernrVoltId;
                }

                this.loadReasonRetireList();

                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");

                var oControl = $.app.byId(this.PAGEID + "_ADDPERSON_BTN");
                var oList = $.app.byId(this.PAGEID + "_List");
                var oSaveBtn = $.app.byId(this.PAGEID + "_SAVEPERSON_BTN");
                var oActda = $.app.byId(this.PAGEID + "_Actda");
                var oChangeDate = $.app.byId(this.PAGEID + "_ChangeDate");

                var oAllSel = $.app.byId(this.PAGEID + "_ALLSELECT_BTN");
                var oAllUnSel = $.app.byId(this.PAGEID + "_ALLUNSELECT_BTN");

                var oPageTitle = $.app.byId(this.PAGEID + "_PAGETITLE");

                var oMassg = $.app.byId(this.PAGEID + "_Massg");

                this.initInputControl(this);

                if (this._vActionType == "200") {
                    this._vPernr = oEvent.data.Pernr;
                    this.setUpdateData(this, oEvent.data.Pernr, oEvent.data.PernrActda, oEvent.data.PernrVoltId);

                    oControl.setVisible(false);
                    oAllSel.setVisible(false);
                    oAllUnSel.setVisible(false);
                    oList.setMode(sap.m.ListMode.None);
                    oSaveBtn.setEnabled(true);
                    oActda.setValue(dateFormat.format(new Date(oEvent.data.PernrActda)));
                    oActda.setEnabled(false);
                    oChangeDate.setVisible(true);

                    oPageTitle.setText(this.getBundleText("LABEL_02253"));
                } else if (this._vActionType == "100") {
                    this._vUpdateData = null;

                    this._vPernr = "";

                    oActda.setValue(this._vActda);
                    oActda.setEnabled(true);
                    oChangeDate.setVisible(false);

                    oList.setMode(sap.m.ListMode.MultiSelect);
                    oControl.setVisible(true);
                    oAllSel.setVisible(true);
                    oAllUnSel.setVisible(true);

                    mActionSubjectList_Temp.setData(null);

                    oSaveBtn.setEnabled(false);

                    oMassg.setValue("");
                    oMassg.removeAllCustomData();

                    oPageTitle.setText(this.getBundleText("LABEL_02254"));

                    var oInputSwith = $.app.byId(this.PAGEID + "_Input_Switch");
                    oInputSwith.setEnabled(false);
                    oInputSwith.setState(false);

                    this.addPerson();
                }
            },

            setUpdateData: function (oController, Pernr, Actda, VoltId) {
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var vBeforeData = {
                    Orgeh_Tx: ""
                };

                oController._vUpdateData = {};

                oModel.read("/ActionSubjectListSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr),
						new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, VoltId),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(Actda))
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
                    Pernr: oController._vUpdateData.Pernr,
                    Ename: oController._vUpdateData.Ename,
                    Fulln: vBeforeData.Orgeh_Tx,
                    Zzjobgrtx: vBeforeData.Zzjobgr_Tx,
                    Zzcaltltx: vBeforeData.Zzcaltl_Tx,
                    Zzpsgrptx: vBeforeData.Zzpsgrp_Tx,
                    Photo: oController._vUpdateData.Photo,
                    Persg: vBeforeData.Persg
                });
                mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                oMassg.removeAllCustomData();
                oMassg.setValue(oController._vUpdateData.Retrs_Tx);
                oMassg.addCustomData(new sap.ui.core.CustomData({
                    key: "Massg",
                    value: oController._vUpdateData.Massg1
                }));
                oMassg.addCustomData(new sap.ui.core.CustomData({
                    key: "Retrs",
                    value: oController._vUpdateData.Retrs
                }));

                if (vBeforeData.Persg == "9") {
                    oController.vMassn = "94";
                } else {
                    oController.vMassn = "90";
                }

                //활설화 입력항목을 가져온다.
                var fMassnCompany = false;

                oModel.read("/ActionInputFieldSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
						new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, oController._vPernr),
						new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, oController.vMassn),
						new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, oController._vUpdateData.Massg1),
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

                oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);

                oMassg.setEnabled(true);

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setEnabled(true);
                oInputSwith.setState(true);
            },

            loadReasonRetireList: function () {
                var oController = this;
                var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
                var mRetirementReasonList = sap.ui.getCore().getModel("RetirementReasonList");
                var vRetirementReasonList = {
                    RetirementReasonSet: []
                };

                oModel.read("/RetirementReasonSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa)
					],
                    success: function (oData) {
                        if (oData && oData.results.length) {
                            for (var i = 0; i < oData.results.length; i++) {
                                vRetirementReasonList.RetirementReasonSet.push(oData.results[i]);
                            }
                            mRetirementReasonList.setData(vRetirementReasonList);
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
                var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
                var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                var vActionSubjectList_Temp = {
                    ActionSubjectListSet: []
                };
                var oTable = $.app.byId(oController.PAGEID + "_EmpSearchResult_Table");
                var vIDXs = oTable.getSelectedIndices();

                if (vEmpSearchResult && vEmpSearchResult.length) {
                    var vPrev_Persg = "";

                    var vActionSubjectListSet = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
                    if (vActionSubjectListSet && vActionSubjectListSet.length) {
                        for (var i = 0; i < vActionSubjectListSet.length; i++) {
                            vActionSubjectList_Temp.ActionSubjectListSet.push(vActionSubjectListSet[i]);
                            vPrev_Persg = vActionSubjectListSet[i].Persg;
                        }
                    }
                    for (var j = 0; j < vIDXs.length; j++) {
                        var vPersa = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Persa");
                        if (oController._vPersa != vPersa) {
                            MessageBox.alert(oController.getBundleText("MSG_02146"));
                            return;
                        }

                        var vPersg = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Persg");
                        if (vPersg != "9") vPersg = "1";
                        if (vPrev_Persg != "" && vPrev_Persg != vPersg) {
                            MessageBox.alert(oController.getBundleText("MSG_02147"));
                            return;
                        }
                        vPrev_Persg = vPersg;

                        vActionSubjectList_Temp.ActionSubjectListSet.push({
                            Pernr: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Pernr"),
                            Ename: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Ename"),
                            Fulln: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Fulln"),
                            Photo: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Photo"),
                            Zzjobgrtx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Zzjobgrtx"),
                            Zzcaltltx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Zzcaltltx"),
                            Zzpsgrptx: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Zzpsgrptx"),
                            Persg: mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[j] + "/Persg")
                        });
                    }

                    mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

                    var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                    oInputSwith.setEnabled(true);

                    //선택된 사용자를 리스트에서 선택한 것으로 설정하고 발령유형을 활성화한다.
                    var oList = $.app.byId(oController.PAGEID + "_List");
                    var oItems = oList.getItems();
                    if (oItems && oItems.length) {
                        for (var k = 0; k < oItems.length; k++) {
                            oList.setSelectedItem(oItems[k], true);
                        }
                    }

                    var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                    oMassg.setEnabled(true);
                    oMassg.setValue("");
                    oMassg.removeAllCustomData();
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
                var vContexts = oList.getSelectedContexts(true);
                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");

                if (oItems.length > 0) fEnabled = true;
                else fEnabled = false;

                var vPrev_Persg = "";
                if (vContexts && vContexts.length) {
                    for (var i = 0; i < vContexts.length; i++) {
                        var vPersg = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Persg");
                        if (vPersg != "9") vPersg = "1";

                        if (vPrev_Persg != "" && vPrev_Persg != vPersg) {
                            oList.setSelectedItem(oItems[i], false);
                            MessageBox.alert(oController.getBundleText("MSG_02147"));
                            return;
                        }
                        vPrev_Persg = vPersg;
                    }
                }

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                oMassg.setEnabled(fEnabled);
                if (!fEnabled) {
                    oMassg.setValue("");
                    oMassg.removeAllCustomData();
                }

                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                oInputSwith.setEnabled(fEnabled);
                if (!fEnabled) {
                    oController.initInputControl(oController);
                    oInputSwith.setState(false);
                }

                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                oSaveBtn.setEnabled(fEnabled);

                oController._vPernr = "";
            },

            onChangeMassg: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");

                if (oInputSwith) {
                    oInputSwith.setState(false);
                    oInputSwith.setEnabled(true);
                }

                oSaveBtn.setEnabled(true);

                oController.initInputControl(oController);
            },

            onChangeSwitch: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                var oControl = oEvent.getSource();
                var vPersg = "";

                if (oEvent.getParameter("state") == false) {
                    MessageBox.show(oController.getBundleText("MSG_02109"), {   // 발령내역입력 스위치가 변경되는 경우 입력했던 발령사항이 초기화 됩니다. 계속 진행하시겠습니까?
                        icon: MessageBox.Icon.INFORMATION,
                        title: "Confirm",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                oController.initInputControl(oController);
                                oSaveBtn.setEnabled(false);
                            } else {
                                oControl.setState(true);
                            }
                        }
                    });
                    return;
                } else {
                    oSaveBtn.setEnabled(true);
                }

                var fMassnCompany = false;

                oController.initInputControl(oController);

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                var vMassg = oMassg.getCustomData()[0].getValue();

                var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
                if (oController._vActionType == "100") {
                    var oPersonList = $.app.byId(oController.PAGEID + "_List");
                    var vContexts = oPersonList.getSelectedContexts(true);

                    if (vContexts && vContexts.length) {
                        vPersg = mActionSubjectList_Temp.getProperty(vContexts[0] + "/Persg");
                    }
                    oController.vMassn = "";
                    if (vPersg == "9") {
                        oController.vMassn = "94";
                    } else {
                        oController.vMassn = "90";
                    }
                } else {
                    vPersg = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Persg");
                }
                if (vPersg == "9") {
                    vMassg = "10";
                }

                if (vMassg == "") {
                    MessageBox.alert(oController.getBundleText("MSG_02059"));
                    return;
                }

                if (oController._vPernr == "") {
                    var oList1 = $.app.byId(oController.PAGEID + "_List");
                    var mTmpModel = oList1.getModel();

                    if (oList1.getMode() == sap.m.ListMode.MultiSelect) {
                        var vSelectedItems = oList1.getSelectedContexts(true);
                        if (vSelectedItems && vSelectedItems.length) {
                            oController._vPernr = mTmpModel.getProperty(vSelectedItems[0] + "/Pernr");
                        }
                    } else {
                        oController._vPernr = mTmpModel.getProperty("/ActionSubjectListSet/0/Pernr");
                    }
                }

                if (oMassg) {
                    if (vMassg != "") {
                        oController._vActiveMassn.push({
                            Massn: oController.vMassn,
                            Massg: vMassg
                        });

                        $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ActionInputFieldSet", {
                            async: false,
                            filters: [
								new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
								new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda)),
								new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, oController._vPernr),
								new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno),
								new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, oController.vMassn),
								new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, vMassg)
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
                            error: function (oResponse) {
                                Common.log(oResponse);
                            }
                        });

                        oSaveBtn.setEnabled(true);
                    } else {
                        oEvent.getSource().setState(false);
                        MessageBox.alert(oController.getBundleText("MSG_02059"));
                        return;
                    }
                }

                if (oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
                    oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
                } else {
                    oController.setInputFiled("N", oController, fMassnCompany);
                }
            },

            setInputFiled: function (pTy, pController, pFMassnCompany) {
                var ty = pTy;
                var oController = pController;
                var fMassnCompany = pFMassnCompany;

                var vRetireMassg = "";

                var actionFunction = function () {
                    var oMatrixLayout = $.app.byId(oController.PAGEID + "_MatrixLayout");
                    var oRow = null,
                        oCell = null,
                        oControl = null;
                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "yyyy-MM-dd"
                    });

                    var vWerksUpdateValue = "";
                    var vHost_werks = "";

                    if (oController._vActiveControl && oController._vActiveControl.length) {
                        AcpAppCommon.loadCodeData(oController, oController._vPersa, oController._vActda, oController._vActiveControl);

                        var idx = 0;
                        for (var i = 0; i < oController._vActiveControl.length; i++) {
                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                                TextFieldname = Fieldname + "_Tx",
                                Fieldtype = oController._vActiveControl[i].Incat;

                            if (Fieldname == "Retrs") {
                                continue;
                            }

                            if (idx % 2 == 0) {
                                if (idx != 0) {
                                    oMatrixLayout.addRow(oRow);
                                }
                                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                            }

                            var vUpdateValue = "";
                            var vUpdateTextValue = "";

                            if (ty == "U") {
                                vUpdateValue = eval("updateData." + Fieldname);
                                vUpdateTextValue = eval("updateData." + TextFieldname);
                            } else {
                                vUpdateValue = oController._vActiveControl[i].Dcode;
                                vUpdateTextValue = oController._vActiveControl[i].Dvalu;
                            }

                            var vLabel = oController._vActiveControl[i].Label;
                            var vMaxLength = parseInt(oController._vActiveControl[i].Maxlen);

                            var vLabelText = "";
                            if (vLabel != "") vLabelText = vLabel;
                            else vLabelText = oController._vActiveControl[i].Label;

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

                            //입력항목의 유형에 따라 달리 처리한다.
                            // M1 : select
                            // M2 : Input & Tree Popup
                            // M3 : Input only
                            // M4 : DatePicker
                            // M5 : Input & Select Dialog
                            // M6 : Single Checkbox

                            if (Fieldtype == "M1" || Fieldtype == "O1") {
                                oControl = new sap.m.ComboBox(oController.PAGEID + "_" + Fieldname, {
                                    width: "95%"
                                }).addStyleClass("L2PFontFamily");

                                if (Fieldname == "Werks") {
                                    //인사영역은 EmpCodeList가 아닌 별도의 Entity
                                    vWerksUpdateValue = vUpdateValue;
                                    if (fMassnCompany) {
                                        oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
                                    } else {
                                        oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
                                    }
                                    oControl.attachChange(oController.onPressWerks);
                                } else if (Fieldname == "Btrtl") {
                                    //인사하위영역은 EmpCodeList가 아닌 별도의 Entity
                                    if (fMassnCompany) {
                                        oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, vWerksUpdateValue);
                                    } else {
                                        oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vPersa);
                                    }
                                } else if (Fieldname == "Rls_orgeh") {
                                    //해제부서는 조건이 발령유형/사유가 추가됨

                                    var vAddFilter = [
                                        {
                                            key: "Actda",
                                            value: oController._vActda
                                        },
                                        {
                                            key: "Pernr",
                                            value: oController._vPernr
                                        }
									];
                                    var mDataModel = oController.setRlsOrgehCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/ReleaseOrgListSet", new sap.ui.core.Item({
                                        key: "{Rls_orgeh}",
                                        text: "{Rls_orgeh_Tx}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
                                } else if (Fieldname == "Trfgr") {
                                    //호봉그룹
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
                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

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
                                            value: oController._vSelectedTrfgr
                                        },
                                        {
                                            key: "Pernr",
                                            value: oController._vPernr
                                        }
									];

                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
                                } else if (Fieldname == "Persg") {
                                    //사원그룹
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
                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

                                    oController._vSelectedPersg = vUpdateValue;

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }));
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

                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
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
                                    mDataModel = oController.setRlsWerksCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/ReleasePersAreaListSet", new sap.ui.core.Item({
                                        key: "{Rls_werks}",
                                        text: "{Rls_werks_Tx}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
                                    oControl.attachChange(oController.onPressHost_werks);

                                    if (vUpdateValue != "" && vUpdateValue != "0000") {
                                        vHost_werks = vUpdateValue;
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

                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

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
                                    mDataModel = oController.setHomeStaffCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/HomeStaffListSet", new sap.ui.core.Item({
                                        key: "{Home_staff}",
                                        text: "{Home_staff_Tx}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
                                } else if (Fieldname == "Host_werks") {
                                    oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }), null, [
										new sap.ui.model.Filter("Field", "EQ", Fieldname)
									]);
                                    oControl.setSelectedKey(vUpdateValue);
                                    oControl.attachChange(oController.onPressHost_werks);
                                    if (vUpdateValue != "" && vUpdateValue != "0000") {
                                        vHost_werks = vUpdateValue;
                                    }
                                } else if (Fieldname == "Host_staff") {
                                    if (vHost_werks != "") {
                                        vAddFilter = [
                                            {
                                                key: "Host_werks",
                                                value: vHost_werks
                                            },
                                            {
                                                key: "Actda",
                                                value: oController._vActda
                                            }
										];
                                        mDataModel = oController.setHostStaffCodeData(Fieldname, vAddFilter);

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

                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

                                    oControl.setModel(mDataModel);
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }));
                                    oControl.setSelectedKey(vUpdateValue);
                                } else if (Fieldname == "Entrs") {
                                    //입사구분
                                    oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
                                    oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                                        key: "{Ecode}",
                                        text: "{Etext}"
                                    }), null, [
										new sap.ui.model.Filter("Field", "EQ", Fieldname)
									]);
                                    if (vUpdateValue == "") {
                                        oControl.setSelectedKey(oController._vEntrs);
                                    } else {
                                        oControl.setSelectedKey(vUpdateValue);
                                    }
                                } else if (
                                    Fieldname == "Aus01" ||
                                    Fieldname == "Aus02" ||
                                    Fieldname == "Aus03" ||
                                    Fieldname == "Aus04" ||
                                    Fieldname == "Aus05"
                                ) {
                                    //
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
                                            value: "A002"
                                        }
									];

                                    mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);

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
                                //
                            } else if (Fieldtype == "M2" || Fieldtype == "O2") {
                                if (Fieldname == "Orgeh") {
                                    oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                                        width: "95%",
                                        showValueHelp: true,
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
                                } else if (Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh") {
                                    oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                                        width: "95%",
                                        showValueHelp: true,
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
                                } else if (Fieldname == "Host_staff" || Fieldname == "Home_staff") {
                                    oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                                        width: "95%",
                                        showValueHelp: true,
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
                                oControl.setValue(vUpdateValue);
                            } else if (Fieldtype == "M4" || Fieldtype == "O4") {
                                oControl = new sap.m.DatePicker(oController.PAGEID + "_" + Fieldname, {
                                    width: "95%",
                                    valueFormat: "yyyy-MM-dd",
                                    displayFormat: gDtfmt,
                                    change: oController.changeDate
                                }).addStyleClass("L2PFontFamily");
                                if (vUpdateValue != null && vUpdateValue != "") {
                                    var tDate = Common.setTime(new Date(vUpdateValue));
                                    oControl.setValue(dateFormat.format(new Date(tDate)));
                                }
                            } else if (Fieldtype == "M5" || Fieldtype == "O5") {
                                oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
                                    width: "95%",
                                    showValueHelp: true,
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

                                if (Fieldname == "Host_werks") {
                                    if (vUpdateValue != "" && vUpdateValue != "0000") {
                                        vHost_werks = vUpdateValue;
                                    }
                                }
                            } else if (Fieldtype == "M6" || Fieldtype == "O6") {
                                oControl = new sap.m.CheckBox(oController.PAGEID + "_" + Fieldname, {
                                    select: oController.onLiveChange
                                }).addStyleClass("L2PFontFamily");
                                if (vUpdateTextValue == "X") oControl.setSelected(true);
                                else oControl.setSelected(false);
                            }

                            oControl.setTooltip(vLabelText);
                            oLabel.setLabelFor(oControl);

                            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                                hAlign: sap.ui.commons.layout.HAlign.Begin,
                                vAlign: sap.ui.commons.layout.VAlign.Middle,
                                content: oControl
                            }).addStyleClass("L2PInputTableData L2PPaddingLeft10");
                            oRow.addCell(oCell);

                            idx++;
                        }
                        oMatrixLayout.addRow(oRow);
                    }

                    BusyIndicator.hide();
                };

                BusyIndicator.show(0);

                setTimeout(actionFunction, 300);
            },

            setPersaData: function (oControlId, oControl, fMassnCompany, value, filter) {
                var oController = $.app.getController(SUB_APP_ID);
                var oPath = "";
                var oFilter = null;

                if (oControlId == "Werks") {
                    oPath = "/PersAreaListSet";
                    if (fMassnCompany) {
                        oFilter = new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "2");
                    } else {
                        oFilter = new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "1");
                    }
                } else if (oControlId == "Btrtl") {
                    oPath = "PersSubareaListSet";
                    oFilter = new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, filter);
                }

                try {
                    oControl.addItem(new sap.ui.core.Item({
                        key: "0000",
                        text: oController.getBundleText("LABEL_02035")
                    }));

                    $.app.getModel("ZHR_ACTIONAPP_SRV").read(oPath, {
                        async: false,
                        filters: [
							oFilter
						],
                        success: function (oData) {
                            if (oData && oData.results) {
                                for (var i = 0; i < oData.results.length; i++) {
                                    if (oControlId == "Werks") {
                                        oControl.addItem(new sap.ui.core.Item({
                                            key: oData.results[i].Persa,
                                            text: oData.results[i].Pbtxt
                                        }));
                                    } else if (oControlId == "Btrtl") {
                                        oControl.addItem(new sap.ui.core.Item({
                                            key: oData.results[i].Btrtl,
                                            text: oData.results[i].Btext
                                        }));
                                    }
                                }
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                        }
                    });

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
                        var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname);

                        var oControl = $.app.byId(oController.PAGEID + "_" + Fieldname);
                        if (oControl) {
                            oControl.destroy(true);
                        }
                    }
                }

                var oMatrixLayout = $.app.byId(oController.PAGEID + "_MatrixLayout");
                if (oMatrixLayout) {
                    oMatrixLayout.removeAllRows();
                    oMatrixLayout.destroyRows();
                }
                oController._vActiveControl = [];
                oController._vActiveMassn = [];
            },

            onPressSave: function () {
                var oController = $.app.getController(SUB_APP_ID);
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var oPersonList = null;
                var vContexts = null;

                if (oController._vActionType == "100") {
                    oPersonList = $.app.byId(oController.PAGEID + "_List");
                    vContexts = oPersonList.getSelectedContexts(true);
                    if (!vContexts || !vContexts.length) {
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

                vCreateData.Massn1 = oController.vMassn;

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");

                vCreateData.Massg1 = oMassg.getCustomData()[0].getValue();
                vCreateData.Retrs = oMassg.getCustomData()[1].getValue();

                if (vCreateData.Massn1 == "" || vCreateData.Massg1 == "") {
                    MessageBox.alert(oController.getBundleText("MSG_02062"));
                    return;
                }

                try {
                    if (oController._vActiveControl && oController._vActiveControl.length) {
                        for (var i = 0; i < oController._vActiveControl.length; i++) {
                            var Fieldname = Common.underscoreToCamelCase(oController._vActiveControl[i].Fieldname),
                                Fieldtype = oController._vActiveControl[i].Incat;

                            if (Fieldname == "Retrs") {
                                continue;
                            }

                            var oControl = $.app.byId(oController.PAGEID + "_" + Fieldname);

                            //입력항목의 유형에 따라 달리 처리한다.
                            // M1 : select
                            // M2 : Input & Tree Popup
                            // M3 : Input only
                            // M4 : DatePicker
                            // M5 : Input & Select Dialog
                            // M6 : Single Checkbox

                            if (oControl) {
                                if (Fieldtype == "M1") {
                                    if (oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
                                        oControl.addStyleClass("L2PSelectInvalidBorder");

                                        var vMsg = oController.getBundleText("MSG_02148");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.removeStyleClass("L2PSelectInvalidBorder");

                                        if (oController._vActiveControl[i].id != "Persa") {
                                            eval("vCreateData." + Fieldname + " = '" + oControl.getSelectedKey() + "';");
                                        }
                                    }
                                } else if (Fieldtype == "M2") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02149");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        var oCustomData = oControl.getCustomData();
                                        var vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var c = 0; c < oCustomData.length; c++) {
                                                var tmpFieldname = "";
                                                if (
                                                    Fieldname == "Dis_orgeh" ||
                                                    Fieldname == "Add_orgeh" ||
                                                    Fieldname == "Rls_orgeh" ||
                                                    Fieldname == "Host_orgeh"
                                                )
                                                    tmpFieldname = "Orgeh";
                                                else tmpFieldname = Fieldname;

                                                if (oCustomData[c].getKey() == tmpFieldname) {
                                                    vVal = oCustomData[c].getValue();
                                                }
                                            }
                                        }
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                        eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "M3") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02149");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        eval("vCreateData." + Fieldname + " = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "M4") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02149");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        vVal = "/Date(" + Common.getTime(oControl.getValue()) + ")/";
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                    }
                                } else if (Fieldtype == "M5") {
                                    if (oControl.getValue() == "") {
                                        oControl.setValueState(sap.ui.core.ValueState.Error);
                                        vMsg = oController.getBundleText("MSG_02149");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var j = 0; j < oCustomData.length; j++) {
                                                if (oCustomData[j].getKey() == Fieldname) {
                                                    vVal = oCustomData[j].getValue();
                                                }
                                            }
                                        }
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                        eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "M6") {
                                    if (oControl.getSelected() == false) {
                                        vMsg = oController.getBundleText("MSG_02148");
                                        vMsg = vMsg.replace("&Cntl", oController._vActiveControl[i].Label);
                                        MessageBox.alert(vMsg);
                                        return;
                                    } else {
                                        vVal = "X";
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                    }
                                } else if (Fieldtype == "O1") {
                                    if (oControl.getSelectedKey() !== "0000" && oControl.getSelectedKey() !== "") {
                                        oControl.removeStyleClass("L2PSelectInvalidBorder");

                                        if (oController._vActiveControl[i].id != "Persa") {
                                            eval("vCreateData." + Fieldname + " = '" + oControl.getSelectedKey() + "';");
                                        }
                                    }
                                } else if (Fieldtype == "O2") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var k = 0; k < oCustomData.length; k++) {
                                                var tmpFieldname2 = "";
                                                if (
                                                    Fieldname == "Dis_orgeh" ||
                                                    Fieldname == "Add_orgeh" ||
                                                    Fieldname == "Rls_orgeh" ||
                                                    Fieldname == "Host_orgeh"
                                                )
                                                    tmpFieldname2 = "Orgeh";
                                                else tmpFieldname2 = Fieldname;

                                                if (oCustomData[k].getKey() == tmpFieldname2) {
                                                    vVal = oCustomData[k].getValue();
                                                }
                                            }
                                        }
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                        eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "O3") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        eval("vCreateData." + Fieldname + " = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "O4") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);

                                        vVal = "/Date(" + Common.getTime(oControl.getValue()) + ")/";
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                    }
                                } else if (Fieldtype == "O5") {
                                    if (oControl.getValue() !== "") {
                                        oControl.setValueState(sap.ui.core.ValueState.None);
                                        oCustomData = oControl.getCustomData();
                                        vVal = "";
                                        if (oCustomData && oCustomData.length) {
                                            for (var m = 0; m < oCustomData.length; m++) {
                                                if (oCustomData[m].getKey() == Fieldname) {
                                                    vVal = oCustomData[m].getValue();
                                                }
                                            }
                                        }
                                        eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                        eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
                                    }
                                } else if (Fieldtype == "O6") {
                                    vVal = "";
                                    if (oControl.getSelected() == true) {
                                        vVal = "X";
                                    }
                                    eval("vCreateData." + Fieldname + " = '" + vVal + "';");
                                }
                            }
                        }
                    }

                    var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");

                    if (oController._vActionType == "100") {
                        oPersonList = $.app.byId(oController.PAGEID + "_List");
                        vContexts = oPersonList.getSelectedContexts(true);
                        var sPath = "/ActionSubjectListSet";
                        var process_result = false;

                        if (vContexts && vContexts.length) {
                            var vSelectedPernr = [];

                            for (var n = 0; n < vContexts.length; n++) {
                                vCreateData.Pernr = mActionSubjectList_Temp.getProperty(vContexts[n] + "/Pernr");
                                vCreateData.Ename = mActionSubjectList_Temp.getProperty(vContexts[n] + "/Ename");

                                var vPersg = mActionSubjectList_Temp.getProperty(vContexts[n] + "/Persg");
                                if (vPersg == "9") vCreateData.Massg1 = "10";

                                vSelectedPernr.push(vCreateData.Pernr);

                                process_result = false;

                                oModel.create(sPath, vCreateData, {
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

                                if (!process_result) return;
                            }

                            var vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
                            var vNewActionSubjectList = {
                                ActionSubjectListSet: []
                            };
                            for (var o = 0; o < vActionSubjectList_Temp.length; o++) {
                                var fExits = false;
                                for (var p = 0; p < vSelectedPernr.length; p++) {
                                    if (vActionSubjectList_Temp[o].Pernr == vSelectedPernr[p]) {
                                        fExits = true;
                                        break;
                                    }
                                }
                                if (!fExits) {
                                    vNewActionSubjectList.ActionSubjectListSet.push(vActionSubjectList_Temp[o]);
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
                        vCreateData.Ename = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Ename");
                        vCreateData.VoltId = oController._vUpdateData.VoltId;

                        sPath = oModel.createKey("/ActionSubjectListSet", {
                            Docno: oController._vDocno,
                            Pernr: vCreateData.Pernr,
                            VoltId: oController._vUpdateData.VoltId,
                            Actda: Common.setTime(oActda.getValue())
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

                        if (!process_result) return;
                    }

                    oMassg.setEnabled(false);
                    oMassg.setValue("");
                    oMassg.removeAllCustomData();

                    var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                    oInputSwith.setState(false);

                    oController.initInputControl(oController);

                    var vActionSubjectList_Temp1 = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");

                    if (oController._vActionType == "100") {
                        MessageBox.alert(oController.getBundleText("MSG_02020"), {
                            title: oController.getBundleText("LABEL_02093"),
                            onClose: function () {
                                if (vActionSubjectList_Temp1 == null || vActionSubjectList_Temp1.length < 1) {
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
                } catch (ex) {
                    Common.log(ex);
                }
            },

            displayMultiOrgSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                jQuery.sap.require("common.SearchOrg");

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
                var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        if (vEmpCodeList[i].Field == "Zzprdar" && vEmpCodeList[i].Ecode != "0000") {
                            vProductAreaModel.PrdAreaCodeListSet.push(vEmpCodeList[i]);
                        }
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

                var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
                var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
                if (vEmpCodeList && vEmpCodeList.length) {
                    for (var i = 0; i < vEmpCodeList.length; i++) {
                        if (vEmpCodeList[i].Field == Fieldname && vEmpCodeList[i].Ecode != "0000") {
                            vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
                        }
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
                oDialog.setTitle(oController.getBundleText("LABEL_02155"));
            },

            displayMultiStellSearchDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                jQuery.sap.require("common.SearchStell");

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

                jQuery.sap.require("common.SearchStell");

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

                if (oBtrtl) {
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
                    } catch (ex) {
                        Common.log(ex);
                    }
                }
            },

            onPressHost_werks: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oHost_werks = oEvent.getSource(); //$.app.byId(oController.PAGEID + "_Host_werks");
                var vWerks = oHost_werks.getSelectedKey();

                oController.onSelectHost_werks(vWerks);
            },

            onSelectHost_werks: function (vWerks) {
                var oController = $.app.getController(SUB_APP_ID);
                var oHost_staff = $.app.byId(oController.PAGEID + "_Host_staff");

                if (oHost_staff) {
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
								new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
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

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                oMassg.setValue("");
                oMassg.removeAllCustomData();

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

                var oMassg = $.app.byId(oController.PAGEID + "_Massg");
                oMassg.setValue("");
                oMassg.removeAllCustomData();
            },

            setSpecialCodeData: function (Fieldname, vAddFilter) {
                var oController = $.app.getController(SUB_APP_ID);
                var mCodeModel = new JSONModel();
                var vCodeModel = {
                    EmpCodeListSet: []
                };

                vCodeModel.EmpCodeListSet.push({
                    Field: Fieldname,
                    Ecode: "0000",
                    Etext: oController.getBundleText("LABEL_02035")
                });

                var subFilters = [];
                vAddFilter.forEach(function (elem) {
                    subFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
                        )
                    );
                });

                $.app.getModel("ZHR_COMMON_SRV").read("/EmpCodeListSet", {
                    async: false,
                    filters: [
						new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, Fieldname),
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
                            mCodeModel.setData(vCodeModel);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return mCodeModel;
            },

            setRlsOrgehCodeData: function (Fieldname, vAddFilter) {
                var oController = $.app.getController(SUB_APP_ID);
                var mReleaseOrgListSet = new JSONModel();
                var vReleaseOrgListSet = {
                    ReleaseOrgListSet: []
                };

                vReleaseOrgListSet.ReleaseOrgListSet.push({
                    Field: Fieldname,
                    Rls_orgeh: "0000",
                    Rls_orgeh_Tx: oController.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
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
                var oController = $.app.getController(SUB_APP_ID);
                var mReleasePersAreaListSet = new JSONModel();
                var vReleasePersAreaListSet = {
                    ReleasePersAreaListSet: []
                };

                vReleasePersAreaListSet.ReleasePersAreaListSet.push({
                    Field: Fieldname,
                    Rls_werks: "0000",
                    Rls_werks_Tx: oController.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
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
                var oController = $.app.getController(SUB_APP_ID);
                var mHomeStaffListSet = new JSONModel();
                var vHomeStaffListSet = {
                    HomeStaffListSet: []
                };

                vHomeStaffListSet.HomeStaffListSet.push({
                    Field: Fieldname,
                    Home_staff: "0000",
                    Home_staff_Tx: oController.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
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
                var oController = $.app.getController(SUB_APP_ID);
                var mHostStaffListSet = new JSONModel();
                var vHostStaffListSet = {
                    HostStaffListSet: []
                };

                vHostStaffListSet.HostStaffListSet.push({
                    Field: Fieldname,
                    Host_staff: "0000",
                    Host_staff_Tx: oController.getBundleText("LABEL_02035")
                });

                var aFilters = [];
                vAddFilter.forEach(function (elem) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            elem.key,
                            sap.ui.model.FilterOperator.EQ,
                            (elem.key === "Actda") ? Common.setTime(new Date(elem.value)) : elem.value
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

            onPressTrfgr: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();
                var oTrfst = $.app.byId(oController.PAGEID + "_Trfst");

                if (oTrfst) {
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
                            },
                            {
                                key: "Pernr",
                                value: oController._vPernr
                            }
						];

                        var mDataModel = oController.setSpecialCodeData("Trfst", vAddFilter);

                        oTrfst.setModel(mDataModel);
                        oTrfst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                    } else {
                        oTrfst.removeAllItems();
                        oTrfst.destroyItems();
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

                        var mDataModel = oController.setSpecialCodeData("Persk", vAddFilter);

                        oPersk.setModel(mDataModel);
                        oPersk.bindItems("/EmpCodeListSet", new sap.ui.core.Item({
                            key: "{Ecode}",
                            text: "{Etext}"
                        }));
                        oPersk.setSelectedKey("0000");
                    } else {
                        oPersk.removeAllItems();
                        oPersk.destroyItems();
                        oPersk.addItem(new sap.ui.core.Item({
                            key: "0000",
                            text: oController.getBundleText("LABEL_02035")
                        }));
                    }
                }
                try {
                    var oPrbda = $.app.byId(oController.PAGEID + "_Prbda"); //PRBDA
                    if (oPrbda) {
                        if (oControl.getSelectedKey() != "0000") {
                            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                pattern: "yyyy-MM-dd"
                            });
                            var vPrbda = null;

                            $.app.getModel("ZHR_ACTIONAPP_SRV").read("/ProbationEndDateSet", {
                                async: false,
                                filters: [
									new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
									new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oControl.getSelectedKey()),
									new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(oController._vActda))
								],
                                success: function (oData) {
                                    if (oData && oData.results.length) {
                                        vPrbda = oData.results[0].Prbda;
                                    }
                                },
                                error: function (oResponse) {
                                    Common.log(oResponse);
                                }
                            });

                            if (vPrbda != null) oPrbda.setValue(dateFormat.format(vPrbda));
                            else oPrbda.setValue("");
                        }
                    }
                } catch (ex) {
                    Common.log(ex);
                }
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
                var oModel = $.app.getModel("ZHR_ACTIONAPP_SRV");
                var vUpdateData = {};
                var oCDActda = $.app.byId(oController.PAGEID + "_CD_Actda");
                var oActda = $.app.byId(oController.PAGEID + "_Actda");

                vUpdateData.Docno = oController._vDocno;
                vUpdateData.Pernr = oController._vPernr;
                vUpdateData.VoltId = oController._vPernrVoltid;
                vUpdateData.Actda = "/Date(" + Common.getTime(oActda.getValue()) + ")/";
                vUpdateData.ActdaAft = "/Date(" + Common.getTime(oCDActda.getValue()) + ")/";

                var process_result = false;

                var sPath = oModel.createKey("/ActionDateSet", {
                    Docno: oController._vDocno,
                    Pernr: oController._vPernr,
                    VoltId: oController._vPernrVoltid,
                    Actda: Common.setTime(oActda.getValue())
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
                var oController = $.app.getController(SUB_APP_ID);
                var oControl = oEvent.getSource();

                if (oEvent.getParameter("valid") == false) {
                    MessageBox.alert(oController.getBundleText("MSG_02047"), {
                        onClose: function () {
                            oControl.setValue("");
                        }
                    });
                }
            },

            _ODialogSearchRetrs: null,
            _ORetrsControl: null,
            onDisplaySearchRetrsDialog: function (oEvent) {
                var oView = $.app.getView(SUB_APP_ID);
                var oController = $.app.getController(SUB_APP_ID);

                oController._ORetrsControl = oEvent.getSource();

                if (!oController._ODialogSearchRetrs) {
                    oController._ODialogSearchRetrs = sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.RetireReasonDialog", oController);
                    oView.addDependent(oController._ODialogSearchRetrs);
                }
                oController._ODialogSearchRetrs.open();
            },

            onSearchRetrs: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var oFilters = [];
                oFilters.push(new sap.ui.model.Filter("Mgtxt", sap.ui.model.FilterOperator.Contains, sValue));

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilters);
            },

            onConfirmRetrs: function (oEvent) {
                var oController = $.app.getController(SUB_APP_ID);
                var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts.length) {
                    var vRetrs = aContexts[0].getProperty("Massg");
                    var vRetrstx = aContexts[0].getProperty("Mgtxt");
                    var vMassg = aContexts[0].getProperty("Rmassg");
                    oController._ORetrsControl.removeAllCustomData();
                    oController._ORetrsControl.setValue(vRetrstx);
                    oController._ORetrsControl.addCustomData(new sap.ui.core.CustomData({
                        key: "Massg",
                        value: vMassg
                    }));
                    oController._ORetrsControl.addCustomData(new sap.ui.core.CustomData({
                        key: "Retrs",
                        value: vRetrs
                    }));

                    var oInputSwith = $.app.byId(oController.PAGEID + "_Input_Switch");
                    if (oInputSwith) {
                        oInputSwith.setState(false);
                        oInputSwith.setEnabled(true);
                    }

                    var oSaveBtn = $.app.byId(oController.PAGEID + "_SAVEPERSON_BTN");
                    oSaveBtn.setEnabled(false);

                    oController.initInputControl(oController);
                }

                oController.onCancelRetrs(oEvent);
            },

            onCancelRetrs: function (oEvent) {
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModel({
                    name: "951009"
                });
            } : null
        });
    }
);