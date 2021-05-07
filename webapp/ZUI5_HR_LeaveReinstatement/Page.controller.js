sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/AttachFileAction",
        "common/JSONModelHelper",
        "common/PageHelper",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator"
    ],
    function (Common, CommonController, AttachFileAction, JSONModelHelper, PageHelper, MessageBox, BusyIndicator) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            LogModel: new JSONModelHelper(),
            TableModel: new JSONModelHelper(),
            ApplyModel: new JSONModelHelper(),
            HistoryModel: new JSONModelHelper(),
            IsFileRequired: "",

            getUserId: function () {
                return this.getView().getModel("session").getData().name;
            },

            getUserGubun: function () {
                return this.getView().getModel("session").getData().Bukrs3;
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
            },

            onBeforeShow: function () {
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IEmpid = vPernr;
                sendObject.IDatum = new Date();
                sendObject.IConType = "1";
                // Navigation property
                sendObject.Export = [];
                sendObject.TableIn1 = [];
                sendObject.TableIn2 = [];
                sendObject.TableIn3 = [];

                oModel.create("/LeaveRequestSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.TableIn1) {
                            var dataLength = 10;
                            Common.log(oData);
                            var rDatas = oData.TableIn1.results;
                            dataLength = rDatas.length;
                            oController.TableModel.setData({ Data: rDatas });
                        }

                        oController.HistoryModel.setData({ Data: oData.TableIn3.results });
                        oController.LogModel.setData({ Data: oData.Export.results[0] });
                        oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
                        if (oData.Export.results[0].ReqBtn !== "X") {
                            sap.m.MessageBox.alert(oController.getBundleText("MSG_00072"), { title: oController.getBundleText("MSG_08107") });
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            getPeriod: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        parts: [{ path: "Zlowbd" }, { path: "Zlowed" }],
                        formatter: function (v1, v2) {
                            if (!v1 || !v2) {
                                return "";
                            }

                            return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
                        }
                    },
                    textAlign: "Center"
                });
            },

            getStatus: function () {
                var oController = $.app.getController();

                return new sap.m.FlexBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.commons.TextView({
                            text: "{Status1T}",
                            textAlign: "Center",
                            visible: {
                                path: "Status1",
                                formatter: function (fVal) {
                                    if (fVal !== "AA") return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("font-14px font-regular mt-4px"),
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            items: [
                                new sap.ui.commons.TextView({
                                    //처리결과에 Text
                                    text: "{Status1T}",
                                    textAlign: "Center"
                                }).addStyleClass("font-14px font-regular mt-7px"),
                                new sap.m.Button({
                                    //처리결과에 삭제 버튼
                                    text: "{i18n>LABEL_42032}",
                                    press: oController.onPressCancel
                                }).addStyleClass("button-light-sm ml-10px")
                            ],
                            visible: {
                                path: "Status1",
                                formatter: function (fVal) {
                                    if (fVal === "AA") return true;
                                    else return false;
                                }
                            }
                        })
                    ]
                });
            },

            onPressReq: function () {
                //신청
                var oView = $.app.byId("ZUI5_HR_LeaveReinstatement.Page");
                var oController = $.app.getController();

                oController.ApplyModel.setData({ FormData: [] });

                if (!oController._ApplyModel) {
                    oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LeaveReinstatement.fragment.Apply", oController);
                    oView.addDependent(oController._ApplyModel);
                }

                var oFamilyInfoBox = $.app.byId(oController.PAGEID + "_FamilyInfoBox");
                var oSickInfoBox = $.app.byId(oController.PAGEID + "_SickInfoBox");
                var oBabyDateBox = $.app.byId(oController.PAGEID + "_BabyDateBox");
                oBabyDateBox.setVisible(false);
                oSickInfoBox.setVisible(false);
                oFamilyInfoBox.setVisible(false);

                oController.getLeaveReinCombo();
                oController.getPartnerCheck();
                oController.onBeforeOpenDetailDialog();
                oController._ApplyModel.open();
            },

            onSelectedRow: function (oEvent) {
                var oView = $.app.byId("ZUI5_HR_LeaveReinstatement.Page");
                var oController = $.app.getController();
                var vPath = oEvent.getParameters().rowBindingContext.getPath();
                var oRowData = oController.TableModel.getProperty(vPath);
                oRowData = $.extend(true, {}, oRowData);

                oController.ApplyModel.setData({ FormData: oRowData });

                if (!oController._ApplyModel) {
                    oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LeaveReinstatement.fragment.Apply", oController);
                    oView.addDependent(oController._ApplyModel);
                }

                oController.getLeaveReinCombo();
                oController.changeType();
                oController.changeUsedType();
                oController.getPartnerCheck();
                oController.onBeforeOpenDetailDialog();
                oController._ApplyModel.open();
            },

            getLeaveReinCombo: function () {
                var oController = $.app.getController();
                var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.ApplyModel.getProperty("/FormData/Bukrs") ? oController.ApplyModel.getProperty("/FormData/Bukrs") : oController.getUserGubun();

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.ICodeT = "001";
                sendObject.ICodty = "PA100";
                sendObject.ILangu =  "3";
                // Navigation property
                sendObject.NavCommonCodeList = [];
                // 휴/복직 구분
                oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.NavCommonCodeList) {
                            Common.log(oData);
                            oController.ApplyModel.setProperty("/TypeCombo", oData.NavCommonCodeList.results);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            changeType: function (oEvent) {
                // 휴/복직 구분선택
                var oController = $.app.getController();
                var oUsedTypeCombo = $.app.byId(oController.PAGEID + "_UsedTypeCombo");
                var oLeaveDate = $.app.byId(oController.PAGEID + "_LeaveDate");
                var oReinDate = $.app.byId(oController.PAGEID + "_ReinDate");
                var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.ApplyModel.getProperty("/FormData/Bukrs") ? oController.ApplyModel.getProperty("/FormData/Bukrs") : oController.getUserGubun();
                var vKeyValue = oEvent ? oEvent.getSource().getSelectedKey() : oController.ApplyModel.getProperty("/FormData/Massn");

                oController.ApplyModel.setProperty("/InfoText", "");

                if (oController.ApplyModel.getProperty("/FormData/Status1") === "AA" || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Status1"))) {
                    if (vKeyValue === "0R") {
                        // 휴직
                        oLeaveDate.setEditable(true);
                        oReinDate.setEditable(false);
                    } else {
                        oLeaveDate.setEditable(false);
                        oReinDate.setEditable(true);
                    }
                }

                if (oEvent) {
                    oController.ApplyModel.setProperty("/FormData/Massg", "");
                    oController.ApplyModel.setProperty("/FormData/Zrhsdt", null);
                    oController.ApplyModel.setProperty("/FormData/Zlowbd", null);
                }

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.ICodeT = "002";
                sendObject.ICodty = "PA100";
                sendObject.ICode = vKeyValue;
                sendObject.ILangu =  "3";
                // Navigation property
                sendObject.NavCommonCodeList = [];
                //휴/복직 사유
                oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.NavCommonCodeList) {
                            Common.log(oData);
                            oController.ApplyModel.setProperty("/UsedTypeCombo", oData.NavCommonCodeList.results);

                            if (oController.ApplyModel.getProperty("/FormData/Status1") === "AA" || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Status1"))) oUsedTypeCombo.setEditable(true);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            changeUsedType: function (oEvent) {
                // 사유 클릭시 증빙서류 안내
                var oController = $.app.getController();
                var vBukrs = oController.ApplyModel.getProperty("/FormData/Bukrs") ? oController.ApplyModel.getProperty("/FormData/Bukrs") : oController.getUserGubun();
                var oUsedCombo = oController.ApplyModel.getProperty("/UsedTypeCombo"),
                    oFamilyInfoBox = $.app.byId(oController.PAGEID + "_FamilyInfoBox"),
                    oSickInfoBox = $.app.byId(oController.PAGEID + "_SickInfoBox"),
                    oBabyDateBox = $.app.byId(oController.PAGEID + "_BabyDateBox"),
                    oPartner = $.app.byId(oController.PAGEID + "_Partner"),
                    oRelationCombo = $.app.byId(oController.PAGEID + "_RelationCombo"),
                    oMidBox = $.app.byId(oController.PAGEID + "_MidBox"),
                    oBotBox = $.app.byId(oController.PAGEID + "_BotBox");
                var vKey = oEvent ? oEvent.getSource().getSelectedKey() : oController.ApplyModel.getProperty("/FormData/Massg");

                if (oController.ApplyModel.getProperty("/FormData/Massn") === "0R") {
                    // 휴/복직구분의 값이 휴직인 경우
                    switch (vKey) {
                        case "01":
                        case "02":
                        case "03":
                        case "04":
                            oBabyDateBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                            oSickInfoBox.setVisible(true);
                            oFamilyInfoBox.setVisible(false);
                            oRelationCombo.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zfmlnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zfgbdt", null);
                            oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                            oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                            oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                            break;
                        case "09":
                        case "11":
                        case "12":
                        case "13":
                            oBabyDateBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                            oSickInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                            oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                            oFamilyInfoBox.setVisible(true);
                            oMidBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                            oBotBox.setVisible(true);
                            oPartner.setVisible(true);
                            oRelationCombo.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                            break;
                        case "14":
                            oBabyDateBox.setVisible(true);
                            oSickInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                            oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                            oFamilyInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zfmlnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zfgbdt", null);
                            oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                            oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                            oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                            oPartner.setVisible(false);
                            oRelationCombo.setVisible(false);
                            break;
                        case "15":
                            oBabyDateBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                            oSickInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                            oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                            oFamilyInfoBox.setVisible(true);
                            oMidBox.setVisible(true);
                            oBotBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                            oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                            oPartner.setVisible(false);
                            oRelationCombo.setVisible(false);
                            break;
                        case "18":
                            oBabyDateBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                            oSickInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                            oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                            oFamilyInfoBox.setVisible(true);
                            oMidBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                            oBotBox.setVisible(true);
                            oPartner.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                            oRelationCombo.setVisible(true);
                            oController.getRelationOData();
                            break;
                        default:
                            oBabyDateBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                            oSickInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                            oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                            oFamilyInfoBox.setVisible(false);
                            oController.ApplyModel.setProperty("/FormData/Zfmlnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zfgbdt", null);
                            oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                            oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                            oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                            oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                            oRelationCombo.setVisible(false);
                            oPartner.setVisible(false);
                            oMidBox.setVisible(false);
                            oBotBox.setVisible(false);
                    }
                } else {
                    oBabyDateBox.setVisible(false);
                    oController.ApplyModel.setProperty("/FormData/Zexbdt", null);
                    oSickInfoBox.setVisible(false);
                    oController.ApplyModel.setProperty("/FormData/Zdsase", "");
                    oController.ApplyModel.setProperty("/FormData/Zdtopn", "");
                    oFamilyInfoBox.setVisible(false);
                    oController.ApplyModel.setProperty("/FormData/Zfmlnm", "");
                    oController.ApplyModel.setProperty("/FormData/Zfgbdt", null);
                    oController.ApplyModel.setProperty("/FormData/Zelmnm", "");
                    oController.ApplyModel.setProperty("/FormData/Zentdt", null);
                    oController.ApplyModel.setProperty("/FormData/Kdsvh", "");
                    oController.ApplyModel.setProperty("/FormData/Zspsap", "");
                    oRelationCombo.setVisible(false);
                    oPartner.setVisible(false);
                    oMidBox.setVisible(false);
                    oBotBox.setVisible(false);
                }

                oUsedCombo.forEach(function (ele) {
                    if (ele.Code === vKey) {
                        if (vBukrs !== "A100") {
                            oController.ApplyModel.setProperty("/InfoText", ele.TextA);
                            return;
                        } else if (oController.ApplyModel.getProperty("/FormData/Massn") === "0R") {
                            var vMsg = "";

                            switch (vKey) {
                                case "01":
                                case "02":
                                case "03":
                                case "04":
                                    vMsg = ele.TextA;
                                    vMsg = vMsg.replace(vMsg, vMsg + oController.getBundleText("MSG_42024"));
                                    oController.ApplyModel.setProperty("/InfoText", vMsg.trim());
                                    break;
                                case "12":
                                case "13":
                                    vMsg = ele.TextA;
                                    vMsg = vMsg.replace(vMsg, vMsg + oController.getBundleText("MSG_42025") + oController.getBundleText("MSG_42026"));
                                    oController.ApplyModel.setProperty("/InfoText", vMsg.trim());
                                    break;
                                default:
                                    oController.ApplyModel.setProperty("/InfoText", ele.TextA);
                                    break;
                            }
                            return;
                        } else {
                            oController.ApplyModel.setProperty("/InfoText", ele.TextA);
                            return;
                        }
                    }
                });

                if (
                    oController.ApplyModel.getProperty("/UsedTypeCombo").some(function (ele) {
                        return ele.Code === vKey && parseInt(ele.Cvalu) === 1;
                    })
                )
                    oController.ApplyModel.setProperty("/IsFileRequired", true);
                else oController.ApplyModel.setProperty("/IsFileRequired", false);
                oController.onBeforeOpenDetailDialog();
            },

            getPartnerCheck: function () {
                // 배우자 육아신청여부
                var oController = $.app.getController();
                var isCombo = [];

                isCombo.push({ Text: "Y" });
                isCombo.push({ Text: "N" });

                oController.ApplyModel.setProperty("/PartnerCheckCombo", isCombo);
            },

            getLeaveTerm: function (oEvent) {
                // 복직예정일 선택시 휴직기간
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IDatum = new Date();
                sendObject.IConType = "5";
                // Navigation property
                sendObject.Export = [];

                oModel.create("/LeaveRequestSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.Export) {
                            Common.log(oData);
                            var oEndDate = new Date(oEvent.getSource().getValue());

                            oController.ApplyModel.setProperty("/FormData/Zlowbd", oData.Export.results[0].Begda);
                            oController.ApplyModel.setProperty("/FormData/Zlowed", new Date(oEndDate.setDate(oEndDate.getDate() - 1)));
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            getReinTerm: function (oEvent) {
                // 휴직기간 선택시 복직예정일
                var oController = $.app.getController();
                var oReinDate = oEvent.getSource().getSecondDateValue();
                var oCopiedDate = new Date(Common.DateFormatter(oReinDate.setDate(oReinDate.getDate())));

                oController.ApplyModel.setProperty("/FormData/Zrhsdt", oCopiedDate);
                oEvent.getSource().setSecondDateValue(oReinDate);
            },

            getRelationOData: function () {
                // 관계Combo
                var oController = $.app.getController();
                var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.ICodeT = "002";
                sendObject.ICodty = "PA102";
                sendObject.ILangu =  "3";
                sendObject.ICode = "KDSVH";
                // Navigation property
                sendObject.NavCommonCodeList = [];
                //휴/복직 사유
                oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.NavCommonCodeList) {
                            Common.log(oData);
                            oController.ApplyModel.setProperty("/RelationCombo", oData.NavCommonCodeList.results);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            onLeaveReinHistory: function () {
                // 휴/복직 발령이력 Dialog
                var oController = $.app.getController();
                var oView = $.app.byId("ZUI5_HR_LeaveReinstatement.Page");

                if (!oController._HistoryModel) {
                    oController._HistoryModel = sap.ui.jsfragment("ZUI5_HR_LeaveReinstatement.fragment.LeaveReinHistory", oController);
                    oView.addDependent(oController._HistoryModel);
                }

                var oHistoryTable = $.app.byId(oController.PAGEID + "_HistoryTable");
                var dataLength = 5;
                dataLength = oController.HistoryModel.getProperty("/Data").length;
                oHistoryTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength);

                oController._HistoryModel.open();
            },

            checkError: function (IsType) {
                // Error Check
                var oController = $.app.getController();
                var oFamilyInfoBox = $.app.byId(oController.PAGEID + "_FamilyInfoBox"),
                    oSickInfoBox = $.app.byId(oController.PAGEID + "_SickInfoBox"),
                    oBabyDateBox = $.app.byId(oController.PAGEID + "_BabyDateBox"),
                    oRelationCombo = $.app.byId(oController.PAGEID + "_RelationCombo"),
                    oMidBox = $.app.byId(oController.PAGEID + "_MidBox"),
                    oPartner = $.app.byId(oController.PAGEID + "_Partner");
                var oFormData = oController.ApplyModel.getProperty("/FormData");

                // 휴/복직 구분
                if (Common.checkNull(oFormData.Massn)) {
                    MessageBox.error(oController.getBundleText("MSG_42011"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 휴/복직 사유
                if (Common.checkNull(oFormData.Massg) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42012"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 휴직기간
                if (Common.checkNull(oFormData.Zlowbd) && Common.checkNull(oFormData.Zlowed) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42013"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 복직(예정)일
                if (Common.checkNull(oFormData.Zrhsdt) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42014"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 복직(예정)일이 휴직시작일보다 이른 경우
                if (oController.ApplyModel.getProperty("/FormData/Zlowbd") > oController.ApplyModel.getProperty("/FormData/Zrhsdt") && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42028"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 세부사유
                if (Common.checkNull(oFormData.Zdtlrs) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42015"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 출산예정일
                if (oBabyDateBox.getVisible() === true && Common.checkNull(oFormData.Zexbdt) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42016"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 성명
                if (oFamilyInfoBox.getVisible() === true && Common.checkNull(oFormData.Zfmlnm) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42017"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 생년월일
                if (oFamilyInfoBox.getVisible() === true && Common.checkNull(oFormData.Zfgbdt) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42018"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 초등학교 명
                if (oFamilyInfoBox.getVisible() === true && oMidBox.getVisible() === true && Common.checkNull(oFormData.Zelmnm) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42019"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 배우자 육아휴직 신청여부
                if (oFamilyInfoBox.getVisible() === true && oPartner.getVisible() === true && Common.checkNull(oFormData.Zspsap) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42029"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 입학일
                if (oFamilyInfoBox.getVisible() === true && oMidBox.getVisible() === true && Common.checkNull(oFormData.Zentdt) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42020"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 관계
                if (oFamilyInfoBox.getVisible() === true && oRelationCombo.getVisible() === true && Common.checkNull(oFormData.Kdsvh) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42021"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 질병 명
                if (oSickInfoBox.getVisible() === true && Common.checkNull(oFormData.Zdsase) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42022"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 의사 소견 (요약)
                if (oSickInfoBox.getVisible() === true && Common.checkNull(oFormData.Zdtopn) && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42023"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                // 첨부파일
                if (AttachFileAction.getFileLength(oController) === 0 && oController.ApplyModel.getProperty("/IsFileRequired") === true && IsType === "X") {
                    MessageBox.error(oController.getBundleText("MSG_42027"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                return false;
            },

            onPressCancel: function (oEvent) {
                // 삭제
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();
                var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
                var oRowData = oController.TableModel.getProperty(vPath);

                var onPressCancel = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_42032")) {
                        // 삭제

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.TableIn1 = [oRowData];

                        oModel.create("/LeaveRequestSet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_42006"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                            }
                        });
                    }
                };

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_42005"), {
                    title: oController.getBundleText("LABEL_42002"),
                    actions: [oController.getBundleText("LABEL_42032"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressCancel
                });
            },

            onDialogApplyBtn: function () {
                // 신청
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                if (oController.checkError("X")) return;

                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_42030")) {
                        // 신청

                        // 첨부파일 저장
                        oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

                        oRowData.Pernr = vPernr;
                        oRowData.Reqdt = new Date(new Date().setDate(new Date().getDate()));
                        oRowData.Zlowed = oRowData.Zlowed ? new Date(Common.getUTCDateTime(oRowData.Zlowed)) : oRowData.Zlowed;

                        var sendObject = {};
                        var vExtryn = Common.isExternalIP() === true ? "X" : "";
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IDatum = new Date();
                        sendObject.IConType = "3";
                        sendObject.IExtryn = vExtryn;
                        // Navigation property
                        sendObject.Export = [];
                        sendObject.TableIn1 = [Common.copyByMetadata(oModel, "LeaveRequestTableIn1", oRowData)];

                        oModel.create("/LeaveRequestSet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._ApplyModel.close();
                                if (vExtryn !== "X" && Common.checkNull(!oData.Export.results[0].Url)) {
                                    window.open(oData.Export.results[0].Url, "_blank", "height = 600, width = 900");
                                }
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_42002"), { title: oController.getBundleText("MSG_08107") });
                            },
                            error: function (oResponse) {
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_42001"), {
                    title: oController.getBundleText("LABEL_42002"),
                    actions: [oController.getBundleText("LABEL_42030"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressApply
                });
            },

            onDialogSaveBtn: function () {
                // 저장
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                oRowData.Pernr = vPernr;

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressSave = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_42031")) {
                        // 저장

                        oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
                        oRowData.Zlowed = oRowData.Zlowed ? new Date(Common.getUTCDateTime(oRowData.Zlowed)) : oRowData.Zlowed;

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "2";
                        // Navigation property
                        sendObject.TableIn1 = [Common.copyByMetadata(oModel, "LeaveRequestTableIn1", oRowData)];

                        oModel.create("/LeaveRequestSet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_42004"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._ApplyModel.close();
                            },
                            error: function (oResponse) {
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_42003"), {
                    title: oController.getBundleText("LABEL_42002"),
                    actions: [oController.getBundleText("LABEL_42031"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressSave
                });
            },

            onDialogDelBtn: function () {
                // 삭제
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                var vPernr = oController.getUserId();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                BusyIndicator.show(0);
                var onPressDelete = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_42032")) {
                        // 삭제

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.TableIn1 = [Common.copyByMetadata(oModel, "LeaveRequestTableIn1", oRowData)];

                        oModel.create("/LeaveRequestSet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_42006"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._ApplyModel.close();
                            },
                            error: function (oResponse) {
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_42005"), {
                    title: oController.getBundleText("LABEL_42002"),
                    actions: [oController.getBundleText("LABEL_42032"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressDelete
                });
            },

            onBeforeOpenDetailDialog: function () {
                var oController = $.app.getController();
                var vStatus = oController.ApplyModel.getProperty("/FormData/Status1"),
                    vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";

                AttachFileAction.setAttachFile(oController, {
                    Appnm: vAppnm,
                    Required: oController.ApplyModel.getProperty("/IsFileRequired"),
                    Mode: "M",
                    Max: "3",
                    Editable: !vStatus || vStatus === "AA" ? true : false
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35119918" }); // 20180178  (기초 휴직) 31018948 31019137 35119918 (첨단 휴직)
                  }
                : null // 20150128  (기초 복직) 31019231 35124510 35125552 (첨단 복직)
        });
    }
);
