sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/AttachFileAction",
        "common/JSONModelHelper",
        "sap/ui/core/BusyIndicator",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, AttachFileAction, JSONModelHelper, BusyIndicator, MessageBox) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "CongratulationDetail",

            DetailModel: new JSONModelHelper(),
            g_BDate: "",
            g_EDate: "",

            getUserId: function () {
                return $.app.getController().getUserId();
            },

            getUserGubun: function () {
                return $.app.getController().getUserGubun();
            },

            onInit: function () {
                this.setupView();

                this.getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            onBeforeShow: function (oEvent) {
                BusyIndicator.show(0);

                var oController = this.getView().getController();
                var oIconText = $.app.byId(oController.PAGEID + "_IconText");

                this.DetailModel.setData({ FormData: {} });

                if (oEvent.data) this.DetailModel.setData({ FormData: oEvent.data });

                var vIconText = oController.getBundleText("MSG_08101");
                var rIconText = vIconText.replace(".", ". \n");
                oIconText.setText(rIconText);

                this.DetailModel.setProperty("/FormData/Dtfmt", this.getSessionInfoByKey("Dtfmt"));
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                var oController = this.getView().getController();
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");

                this.onTableSearch();
                oController.onBeforeOpenDetailDialog();
                this.onCheckedBox(); //???????????? ??????
                this.onHelperCheck();

                if (oController.DetailModel.getProperty("/FormData").Fgbdt) oBirthDayDate.setVisible(true);
                else oBirthDayDate.setVisible(false);

                BusyIndicator.hide();
            },

            navBack: function () {
                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
                    });
            },

            onTableSearch: function () {
                var oController = this.getView().getController(),
                    curDate = new Date(),
                    vSelectedType = "";
                var vMsg = oController.getBundleText("MSG_08104");

                if (!oController.DetailModel.getProperty("/MultiBoxData")) oController.setTypeCombo(oController); //???????????? function

                if (Common.isNull(oController.DetailModel.getData().FormData.Begda)) {
                    vSelectedType = oController.DetailModel.getProperty("/MultiBoxData/0/Code");
                    //??????????????? ????????? ???????????????

                    vMsg = vMsg.replace("&Cntl", oController.DetailModel.getProperty("/MultiBoxData/0/TextA"));
                    oController.DetailModel.setProperty("/FormData/FilePlaceholder", vMsg);
                    oController.DetailModel.setProperty("/FormData/Begda", curDate);
                    oController.DetailModel.setProperty("/FormData/Type", vSelectedType);
                    oController.DetailModel.setProperty("/FormData/TextA", "CAAID");
                } else {
                    oController.onReadyPlaceholder();
                }

                oController.onStartDatePicker();
            },

            onStartDatePicker: function () {
                var oController = this.getView().getController();
                var vBurks = oController.getUserGubun();
                var vStartDate = $.app.byId(oController.PAGEID + "_StartDatePicker");

                if (vBurks !== "A100") {
                    vStartDate.setMinDate(moment().subtract(1, "year").toDate());
                    vStartDate.setMaxDate(moment().add(1, "year").subtract(1, "days").toDate());
                } else {
                    vStartDate.setMinDate(moment().subtract(parseInt(oController.g_BDate), "days").toDate());
                    vStartDate.setMaxDate(moment().add(parseInt(oController.g_EDate), "days").toDate());
                }
            },

            setTypeCombo: function (oController) {
                //??????????????? ???????????????
                oController = this.getView().getController();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV"),
                    oCodeHeaderParams = {};
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oBirthDayBox = $.app.byId(oController.PAGEID + "_BirthDayBox");
                oBirthDayBox.setVisible(false);

                if (vBukrs === "A100") {
                    oCodeHeaderParams.ICodeT = "018";
                    oCodeHeaderParams.ICodty = "PB120";
                    oCodeHeaderParams.IPernr = vPernr;
                    oCodeHeaderParams.ISubCode = "DATE";
                    oCodeHeaderParams.ILangu = "3";
                    oCodeHeaderParams.NavCommonCodeList = [];

                    oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                        success: function (oData) {
                            if (oData && oData.NavCommonCodeList.results) {
                                //?????? ????????? ?????? ?????? ???
                                var rDatas = oData.NavCommonCodeList.results;
                                oController.g_BDate = rDatas[0].Cvalu;
                                oController.g_EDate = rDatas[1].Cvalu;
                            }
                        },
                        error: function (oResponse) {
                            common.Common.log(oResponse);
                        }
                    });
                }

                oCodeHeaderParams = {
                    ICodeT: "018",
                    IPernr: vPernr,
                    IBukrs: vBukrs,
                    ILangu: "3",
                    NavCommonCodeList: []
                };

                oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                    //??????????????? ??????????????????
                    success: function (oData) {
                        if (oData && oData.NavCommonCodeList.results) {
                            //?????? ????????? ?????? ?????? ???
                            var rDatas = oData.NavCommonCodeList.results;

                            oController.DetailModel.setProperty("/MultiBoxData", rDatas);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                oCodeHeaderParams = {};
                oCodeHeaderParams.ICodeT = "018";
                oCodeHeaderParams.ICodty = "PB120";
                oCodeHeaderParams.ILangu = "3";
                oCodeHeaderParams.NavCommonCodeList = [];

                oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                    //???????????????????????? ??????????????? Code??? ???????????????
                    success: function (oData) {
                        if (oData && oData.NavCommonCodeList.results) {
                            //?????? ????????? ?????? ?????? ???
                            var rDatas = oData.NavCommonCodeList.results;

                            oController.DetailModel.setProperty("/MultiBoxDataInfo", rDatas);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            onHelperCheck: function () {
                //????????????????????? ??????????????? CheckBox??????
                var oController = this.getView().getController();
                var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
                var isVisibleVehicle = false,
                    isVisibleType = false;

                var oDeepCopyData = JSON.parse(JSON.stringify(oMultiBoxInfo));

                var oVehicleList = oDeepCopyData.splice(0, 2);

                if (
                    oController.DetailModel.getProperty("/FormData/TextA") === "CAAID" ||
                    oVehicleList.some(function (e) {
                        return e.Code === oController.DetailModel.getProperty("/FormData").Type;
                    })
                ) {
                    isVisibleVehicle = true;
                }

                if (
                    oController.getUserGubun() !== "A100" &&
                    (oController.DetailModel.getProperty("/FormData/TextA") === "FMAID" ||
                        oDeepCopyData.some(function (e) {
                            return e.Code === oController.DetailModel.getProperty("/FormData").Type && e.TextA !== "YONLY";
                        }))
                ) {
                    isVisibleType = true;
                }

                this.DetailModel.setProperty("/FormData/isVisibleVehicle", isVisibleVehicle);
                this.DetailModel.setProperty("/FormData/isVisibleType", isVisibleType);

                return;
            },

            onReadyPlaceholder: function () {
                //?????? ????????? ?????? ???????????? ???????????????
                var oController = this.getView().getController();
                var oMultiBox = oController.DetailModel.getProperty("/MultiBoxData");

                oMultiBox.forEach(function (elements) {
                    //?????????????????? ?????? ?????????????????? ???????????? forEach
                    if (elements.Code === oController.DetailModel.getProperty("/FormData/Type")) {
                        if (Common.checkNull(elements.TextA)) {
                            AttachFileAction.setSettingByKey(oController, { key: "InfoMessage", value: null });
                            return;
                        }

                        var vMsg = oController.getBundleText("MSG_08104");
                        vMsg = vMsg.replace("&Cntl", elements.TextA);

                        AttachFileAction.setSettingByKey(oController, { key: "InfoMessage", value: vMsg });
                        oController.DetailModel.setProperty("/FormData/FilePlaceholder", vMsg);
                    }
                });
            },

            onPressSave: function () {
                //?????? event
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vPernr = oController.getUserId();

                if (oController.onErrorCheckBox()) {
                    return;
                }

                this.onCheckedBox(); //???????????? ??????
                vDetailData.Pernr = vPernr;
                vDetailData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
                vDetailData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");

                if (vDetailData.Fgbdt) {
                    vDetailData.Fgbdt = Common.setUTCDateTime(vDetailData.Fgbdt);
                }

                delete vDetailData.FilePlaceholder; //???????????? ???????????? key ??????
                delete vDetailData.TextA; //???????????? ???????????? key ??????
                delete vDetailData.isVisibleType;
                delete vDetailData.isVisibleVehicle;
                delete vDetailData.Dtfmt;

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    //?????? ??????????????? ???????????? ?????????
                    if (fVal && fVal == "??????") {
                        // ???????????? ??????
                        vDetailData.Appnm = AttachFileAction.uploadFile.call(oController);
                        if (!vDetailData.Appnm) return false;

                        var sendObject = {
                            IConType: "2",
                            ILangu: "3",
                            IPernr: vPernr,
                            IBukrs: "1000",
                            IOdkey: "",
                            TableIn: [Common.copyByMetadata(oModel, "CongratulationApplyTableIn", vDetailData)] //?????? ????????? ????????????
                        };

                        oModel.create("/CongratulationApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
                                sap.m.MessageBox.alert(oController.getBundleText("LABEL_08002") + oController.getBundleText("LABEL_08023"));
                                oController.onTableSearch();
                                oController.navBack();
                                Common.log(oData);
                                BusyIndicator.hide();
                            },
                            error: function (oError) {
                                sap.m.MessageBox.alert(Common.parseError(oError).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                oController.onTableSearch();
                                Common.log(oError);
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };
                sap.m.MessageBox.confirm(oController.getBundleText("LABEL_08002") + oController.getBundleText("LABEL_08024"), {
                    title: oController.getBundleText("LABEL_08022"),
                    actions: ["??????", "??????"],
                    onClose: onProcessSave
                });
            },

            onDialogDelBtn: function () {
                // ??????
                var oController = this;
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vPernr = oController.getUserId();

                delete vDetailData.FilePlaceholder; //???????????? ???????????? key ??????
                delete vDetailData.TextA; //???????????? ???????????? key ??????
                delete vDetailData.isVisibleType;
                delete vDetailData.isVisibleVehicle;
                delete vDetailData.Dtfmt;

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    if (fVal && fVal == "??????") {
                        var sendObject = {
                            IConType: "4",
                            ILangu: "3",
                            IPernr: vPernr,
                            IBukrs: "1000",
                            TableIn: [vDetailData] //?????? ????????? ????????????
                        };

                        oModel.create("/CongratulationApplySet", sendObject, {
                            success: function (oData) {
                                sap.m.MessageBox.alert(oController.getBundleText("LABEL_08003") + oController.getBundleText("LABEL_08023"));
                                oController.onTableSearch();
                                oController.navBack();
                                Common.log(oData);
                                BusyIndicator.hide();
                            },
                            error: function (oError) {
                                sap.m.MessageBox.alert(Common.parseError(oError).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                oController.onTableSearch();
                                Common.log(oError);
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };
                sap.m.MessageBox.confirm(oController.getBundleText("LABEL_08003") + oController.getBundleText("LABEL_08024"), {
                    title: oController.getBundleText("LABEL_08022"),
                    actions: ["??????", "??????"],
                    onClose: onProcessSave
                });
            },

            onCheckedBox: function () {
                //???????????? ????????????
                var oController = this.getView().getController();
                var vCheckBox = $.app.byId(oController.PAGEID + "_TypeCheck");
                var oVehicleCheckBox = $.app.byId(oController.PAGEID + "_VehicleCheck");

                if (vCheckBox.mProperties.selected) oController.DetailModel.setProperty("/FormData/Fmaid", "X");
                else oController.DetailModel.setProperty("/FormData/Fmaid", null);

                if (oVehicleCheckBox.mProperties.selected) oController.DetailModel.setProperty("/FormData/Caaid", "X");
                else oController.DetailModel.setProperty("/FormData/Caaid", null);
            },

            onPressApply: function () {
                //?????? event
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vPernr = oController.getUserId();

                if (oController.onErrorCheckBox()) {
                    return;
                }

                delete vDetailData.FilePlaceholder; //???????????? ???????????? key ??????
                delete vDetailData.Dtfmt;

                vDetailData.Pernr = vPernr;

                this.onCheckedBox(); //???????????? ??????
                vDetailData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
                vDetailData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");

                if (vDetailData.Fgbdt) {
                    vDetailData.Fgbdt = Common.setUTCDateTime(vDetailData.Fgbdt);
                }

                delete vDetailData.TextA; //???????????? ???????????? key ??????
                delete vDetailData.isVisibleType;
                delete vDetailData.isVisibleVehicle;

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    //?????? ????????? ???????????? ?????????
                    if (fVal && fVal == "??????") {
                        // ???????????? ??????
                        vDetailData.Appnm = AttachFileAction.uploadFile.call(oController);
                        if (!vDetailData.Appnm) return false;

                        var sendObject = {
                            IConType: "3",
                            ILangu: "3",
                            IPernr: vPernr,
                            IBukrs: "1000",
                            IOdkey: "",
                            TableIn: [Common.copyByMetadata(oModel, "CongratulationApplyTableIn", vDetailData)] //?????? ????????? ????????????
                        };

                        oModel.create("/CongratulationApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_44002"), { title: oController.getBundleText("LABEL_08022") });
                                oController.onTableSearch();
                                oController.navBack();
                                Common.log(oData);
                                BusyIndicator.hide();
                            },
                            error: function (oError) {
                                sap.m.MessageBox.alert(Common.parseError(oError).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                oController.onTableSearch();
                                Common.log(oError);
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                sap.m.MessageBox.confirm(oController.getBundleText("LABEL_08001") + oController.getBundleText("LABEL_08024"), {
                    title: oController.getBundleText("LABEL_08022"),
                    actions: ["??????", "??????"],
                    onClose: onProcessSave
                });
            },

            onErrorCheckBox: function () {
                //????????? Error????????? ??????
                var oController = this.getView().getController();
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");

                if (!vDetailData.StartDate) {
                    MessageBox.error(oController.getBundleText("MSG_08108"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (!vDetailData.Zname) {
                    MessageBox.error(oController.getBundleText("MSG_08110"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (!vDetailData.Type) {
                    MessageBox.error(oController.getBundleText("MSG_08109"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (oBirthDayDate.getVisible() === true) {
                    if (!vDetailData.Fgbdt) {
                        MessageBox.error(oController.getBundleText("MSG_08115"), { title: oController.getBundleText("MSG_08107") });
                        return true;
                    }
                }

                if (AttachFileAction.getFileLength(oController) === 0) {
                    MessageBox.error(oController.getBundleText("MSG_08114"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }
            },

            onDateType: function () {
                var oController = this.getView().getController();
                var vYear = new Date().getFullYear() - 1;
                var vMonth = new Date().getMonth() + 1;
                var vDate = new Date().getDate();
                var vType = oController.DetailModel.getProperty("/FormData/Type");
                var vMsg = oController.getBundleText("MSG_08111");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vMultiList = ["1507", "1508", "1509", "1510", "1552", "1553", "1554", "1555", "4001", "4002", "4003", "4004", "4005", "4006"];
                var vType1 = ["1552", "1553", "1554", "1555", "4003", "4004", "4005", "4006"]; // ?????? & ??????

                if (
                    vMultiList.some(function (e) {
                        return e === vDetailData.Type;
                    })
                ) {
                    if (
                        vType1.some(function (e) {
                            return e === vType;
                        })
                    ) {
                        //?????? & ??????
                        vMsg = vMsg.replace("year1", vYear - 69);
                        vMsg = vMsg.replace("year2", new Date(new Date().setDate(new Date().getDate() - 1)).getFullYear() - 68);
                        vMsg = vMsg.replace("month1", vMonth);
                        vMsg = vMsg.replace("month2", new Date(new Date().setDate(new Date().getDate() - 1)).getMonth() + 1);
                        vMsg = vMsg.replace("date1", Common.lpad(parseInt(vDate), 2));
                        vMsg = vMsg.replace("date2", Common.lpad(parseInt(new Date(new Date().setDate(vDate - 1)).getDate()), 2));
                    } else {
                        //?????? & ??????
                        vMsg = vMsg.replace("year1", vYear - 59);
                        vMsg = vMsg.replace("year2", new Date(new Date().setDate(new Date().getDate() - 1)).getFullYear() - 58);
                        vMsg = vMsg.replace("month1", vMonth);
                        vMsg = vMsg.replace("month2", new Date(new Date().setDate(new Date().getDate() - 1)).getMonth() + 1);
                        vMsg = vMsg.replace("date1", Common.lpad(parseInt(vDate), 2));
                        vMsg = vMsg.replace("date2", Common.lpad(parseInt(new Date(new Date().setDate(vDate - 1)).getDate()), 2));
                    }
                    var vMsg2 = oController.getBundleText("MSG_08112");
                    vMsg2 = vMsg2.replace("????????????.", "????????????. \n");
                    sap.m.MessageBox.alert(vMsg2 + vMsg, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }
            },

            onSelectBox: function (oEvent) {
                //???????????? ???????????? ?????? ????????? ?????????,?????????,???????????? ??????
                var oController = this.getView().getController();
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
                var oTypeCheck = $.app.byId(oController.PAGEID + "_TypeCheck");
                var oVehicleCheck = $.app.byId(oController.PAGEID + "_VehicleCheck");
                var oBirthDayBox = $.app.byId(oController.PAGEID + "_BirthDayBox");
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDay");
                var vBirthDayBox = false;
                var oPayload = {};

                if (oEvent.oSource.sId === "CongratulationDetail_Type") this.onDateType();

                if (vBukrs !== "A100") {
                    oController.DetailModel.setProperty("/FormData/TextA", "");
                    oController.DetailModel.setProperty("/FormData/AmountT", "");
                }

                var vComboLength = oMultiBoxInfo.length;

                for (var i = 0; i < vComboLength; i++) {
                    if (oMultiBoxInfo[i].Code === oController.DetailModel.getProperty("/FormData/Type")) oController.DetailModel.setProperty("/FormData/TextA", oMultiBoxInfo[i].TextA);
                }

                if (oController.DetailModel.getProperty("/FormData/TextA") === "YONLY" && vBukrs !== "A100") {
                    oBirthDayDate.setValue("");
                    vBirthDayBox = true;
                }
                oBirthDayBox.setVisible(vBirthDayBox);

                if (vBukrs !== "A100" && oController.DetailModel.getProperty("/FormData/TextA") === "FSVC") {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_08113"), {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }

                this.onCheckedBox(); //???????????? ??????
                this.onHelperCheck(); //????????????????????? ???????????? ??????????????? ??????????????? ???????????????

                oTypeCheck.setSelected(false);
                oVehicleCheck.setSelected(false);

                oPayload.IOdkey = "";
                oPayload.IConType = "0";
                oPayload.IPernr = vPernr;
                oPayload.IBukrs = "1000";
                oPayload.ILangu = "3";
                oPayload.IDatum = new Date();

                oPayload.TableIn = [];
                oPayload.TableIn.push({
                    Pernr: vPernr,
                    StartDate: moment(vDetailData.StartDate).hours(10).toDate(),
                    Type: vDetailData.Type
                });

                this.onReadyPlaceholder();

                if (!vDetailData.StartDate || !vDetailData.Type) return;

                oModel.create("/CongratulationApplySet", oPayload, {
                    success: function (oData) {
                        //?????? ????????? ?????? ?????? ???
                        if (oController.getUserGubun() === "A100") {
                            //????????? ?????? CopayT??? ?????? ???????????? ?????? ??????????????? ??????????????? BasicT?????? ????????? ????????? ?????????.
                            oController.DetailModel.setProperty("/FormData/CopayT", oData.TableIn.results[0].AmountT);
                        }
                        //????????? ??????
                        oController.DetailModel.setProperty("/FormData/BasicT", oData.TableIn.results[0].BasicT);
                        oController.DetailModel.setProperty("/FormData/Rate", oData.TableIn.results[0].Rate);
                        oController.DetailModel.setProperty("/FormData/AmountT", oData.TableIn.results[0].AmountT);
                        oController.onCheckPress();
                        Common.log(oData);
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            onCheckPress: function () {
                var oController = this.getView().getController();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
                var vPernr = oController.getUserId();
                var oTypeCheck = $.app.byId(oController.PAGEID + "_TypeCheck");
                var vAppDate = oController.DetailModel.getData().FormData.Begda;

                var vYear = vAppDate.getFullYear() + ".";
                var vMonth = vAppDate.getMonth() + 1 + ".";
                var vDate = vAppDate.getDate();
                var vFullDate = new Date(vYear + vMonth + vDate);
                var oCodeHeaderParams = {};
                var rAmountT = "";

                if (oTypeCheck.getVisible() !== true) return;

                if (oTypeCheck.mProperties.selected !== true && oTypeCheck.getVisible() === true) {
                    oCodeHeaderParams.ICodeT = "018";
                    oCodeHeaderParams.ICodty = "PB120";
                    oCodeHeaderParams.IPernr = vPernr;
                    oCodeHeaderParams.IDatum = vFullDate;
                    oCodeHeaderParams.ISubCode = "FMADM";
                    oCodeHeaderParams.ILangu = "3";
                    oCodeHeaderParams.NavCommonCodeList = [];

                    oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                        success: function (oData) {
                            if (oData && oData.NavCommonCodeList.results) {
                                //?????? ????????? ?????? ?????? ???
                                var rDatas = oData.NavCommonCodeList.results;
                                var vAmountT = Number(rDatas[0].Text) + Number(oController.DetailModel.getProperty("/FormData/AmountT").replace(/,/g, ""));
                                rAmountT = common.Common.numberWithCommas(vAmountT);
                            }
                        },
                        error: function (oResponse) {
                            common.Common.log(oResponse);
                            rAmountT = oController.DetailModel.getProperty("/FormData/AmountT");
                        }
                    });
                } else {
                    rAmountT = oController.DetailModel.getProperty("/FormData/AmountT");
                }

                oController.DetailModel.setProperty("/FormData/AmountT", rAmountT);
            },

            onBeforeOpenDetailDialog: function () {
                var oController = this.getView().getController();
                var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
                    vInfoMessage = oController.DetailModel.getProperty("/FormData/FilePlaceholder"),
                    vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";

                AttachFileAction.setAttachFile(oController, {
                    Appnm: vAppnm,
                    Mode: "M",
                    Max: 3,
                    Editable: !vStatus || vStatus === "AA" ? true : false,
                    InfoMessage: vInfoMessage
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20130217" }); //20130217 //35110041
                  }
                : null
        });
    }
);
