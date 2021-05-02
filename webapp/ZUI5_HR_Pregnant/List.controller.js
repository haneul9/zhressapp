sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/AttachFileAction",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox) {
        "use strict";

        return CommonController.extend("ZUI5_HR_Pregnant.List", {
            PAGEID: "ZUI5_HR_Pregnant",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            UploadFileModel: new JSONModelHelper(),
            _Bukrs: "",

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

                // this.getView().addStyleClass("sapUiSizeCompact");
                // this.getView().setModel($.app.getModel("i18n"), "i18n");
            },

            onBeforeShow: function () {
                var oController = this;

                if (!oController._ListCondJSonModel.getProperty("/Data")) {
                    var vData = { Data: {} };

                    oController._ListCondJSonModel.setData(vData);
                }

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("1");
            },

            onAfterShow: function (oEvent) {
                var oController = this;

                oController.onPressSearch1(oEvent);
            },

            onChangeDate: function (oEvent, field) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vEmpLoginInfo = $.app.getModel("session").getData();
                var oData = oController._ListCondJSonModel.getProperty("/Data");

                var oField = [];
                var createData = { PregnantApplyTableIn: [] };
                createData.IBukrs = vEmpLoginInfo.Bukrs;
                createData.IPernr = vEmpLoginInfo.Pernr;
                createData.IEmpid = vEmpLoginInfo.Pernr;
                createData.ILangu = vEmpLoginInfo.Langu;

                var detail = {};

                if (oEvent.getParameters().valid == false) {
                    MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식입니다.
                    oEvent.getSource().setValue("");
                    return;
                }

                switch (field) {
                    case "Preen": // 출산(예정)일 - 저장된 데이터 여부 확인
                        if (!oData.Preen || oData.Preen == "") {
                            oController._ListCondJSonModel.setProperty("/Data/Prebg", "");
                            oController._ListCondJSonModel.setProperty("/Data/Pampm", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh2", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh2", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begshp", "");
                            oController._ListCondJSonModel.setProperty("/Data/Begsh2p", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endshp", "");
                            oController._ListCondJSonModel.setProperty("/Data/Endsh2p", "");
                            oController._ListCondJSonModel.setProperty("/Data/EditFalse", "");
                            return;
                        }

                        createData.IConType = "A";

                        detail = { Pernr: vEmpLoginInfo.Pernr, Preen: "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/" };
                        if (oData.Status1 == "AA") {
                            detail.Subty = oData.Subty;
                            detail.Objps = oData.Objps;
                            detail.Sprps = oData.Sprps;
                            detail.Begda = "/Date(" + Common.getTime(oData.Begda) + ")/";
                            detail.Endda = "/Date(" + Common.getTime(oData.Endda) + ")/";
                            detail.Seqnr = oData.Seqnr;
                        }

                        createData.PregnantApplyTableIn.push(detail);

                        // "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2",
                        oField = ["Preen", "Prebg", "Begsh2p", "Begshp", "Endsh2p", "Endshp", "Prebn"];
                        break;
                    case "Prebg": // 임신시작일
                        if (!oData.Preen || !oData.Prebg) {
                            return;
                        }

                        createData.IConType = "B";

                        detail = { Pernr: vEmpLoginInfo.Pernr, Preen: "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/", Prebg: "/Date(" + Common.getTime(new Date(oData.Prebg)) + ")/" };
                        if (oData.Status1 == "AA") {
                            detail.Subty = oData.Subty;
                            detail.Objps = oData.Objps;
                            detail.Sprps = oData.Sprps;
                            detail.Begda = "/Date(" + Common.getTime(oData.Begda) + ")/";
                            detail.Endda = "/Date(" + Common.getTime(oData.Endda) + ")/";
                            detail.Seqnr = oData.Seqnr;
                        }

                        createData.PregnantApplyTableIn.push(detail);

                        // "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2",
                        oField = ["Preen", "Prebg", "Begsh2p", "Begshp", "Endsh2p", "Endshp", "Prebn"];
                        break;
                    default:
                        // 단축근무 선택 시 현재일 이전일자는 선택 불가능
                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                        var value = oEvent.getParameters().value;
                        if (value != "") {
                            value = dateFormat.format(new Date(value)) * 1;

                            if (value < dateFormat.format(new Date()) * 1) {
                                MessageBox.error(oController.getBundleText("MSG_39019")); // 현재일 이전 일자는 선택 불가능합니다.
                                oEvent.getSource().setValue("");
                            }
                        }
                }

                if (oField.length != 0) {
                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                oController._ListCondJSonModel.setProperty("/Data/Eretcode", data.Eretcode);
                                oController._ListCondJSonModel.setProperty("/Data/Erettext", data.Erettext);

                                if (data.PregnantApplyTableIn && data.PregnantApplyTableIn.results) {
                                    var datas = data.PregnantApplyTableIn.results[0];
                                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                                    // 출산예정일, 임신시작일
                                    datas.Preen = datas.Preen ? dateFormat.format(new Date(Common.setTime(datas.Preen))) : "";
                                    datas.Prebg = datas.Prebg ? dateFormat.format(new Date(Common.setTime(datas.Prebg))) : "";

                                    // 단축근무기간
                                    datas.Begsh = datas.Begsh ? dateFormat.format(new Date(Common.setTime(datas.Begsh))) : "";
                                    datas.Endsh = datas.Endsh ? dateFormat.format(new Date(Common.setTime(datas.Endsh))) : "";
                                    datas.Begsh2 = datas.Begsh2 ? dateFormat.format(new Date(Common.setTime(datas.Begsh2))) : "";
                                    datas.Endsh2 = datas.Endsh2 ? dateFormat.format(new Date(Common.setTime(datas.Endsh2))) : "";

                                    // 신청가능기간
                                    datas.Begshp = datas.Begshp ? dateFormat.format(new Date(Common.setTime(datas.Begshp))) : "";
                                    datas.Begsh2p = datas.Begsh2p ? dateFormat.format(new Date(Common.setTime(datas.Begsh2p))) : "";
                                    datas.Endshp = datas.Endshp ? dateFormat.format(new Date(Common.setTime(datas.Endshp))) : "";
                                    datas.Endsh2p = datas.Endsh2p ? dateFormat.format(new Date(Common.setTime(datas.Endsh2p))) : "";

                                    // 태아수 없는 경우 기본값 1로 세팅
                                    datas.Prebn = datas.Prebn == "0" ? "1" : datas.Prebn;

                                    for (var i = 0; i < oField.length; i++) {
                                        oController._ListCondJSonModel.setProperty("/Data/" + oField[i], datas[oField[i]]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (oController._ListCondJSonModel.getProperty("/Data/Eretcode") == "X") {
                        MessageBox.information(oController._ListCondJSonModel.getProperty("/Data/Erettext"));
                    } else if (oController._ListCondJSonModel.getProperty("/Data/Eretcode") == "Z") {
                        MessageBox.error(oController._ListCondJSonModel.getProperty("/Data/Erettext"));
                    }

                    // 출산예정일 - 현재일 체크
                    oController.onCheckPreen();
                    // 단축근무기간 변경
                    oController.onChangePampm();
                }

                if (oController._ListCondJSonModel.getProperty("/Data/Eretcode") == "X") {
                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_FileRow")
                        .addStyleClass("displayNone");
                } else {
                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_FileRow")
                        .removeStyleClass("displayNone");
                }
            },

            // 출산(예정)일이 현재일 이전이면 임신시작일, 단축근무시간, 단축근무기간 입력 불가
            onCheckPreen: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                var oPreen = oController._ListCondJSonModel.getProperty("/Data/Preen");

                if (!oPreen || oPreen == "") return;

                oPreen = dateFormat.format(new Date(oPreen)) * 1;

                if (oPreen <= dateFormat.format(new Date()) * 1) {
                    oController._ListCondJSonModel.setProperty("/Data/EditFalse", "X");

                    var field = ["Prebg", "Pampm", "Begsh", "Endsh", "Begsh2", "Endsh2", "Begshp", "Begsh2p", "Endshp", "Endsh2p"];
                    for (var i = 0; i < field.length; i++) {
                        oController._ListCondJSonModel.setProperty("/Data/" + field[i], "");
                    }
                } else {
                    oController._ListCondJSonModel.setProperty("/Data/EditFalse", "");
                }
            },

            onPressSearch1: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var vEmpLoginInfo = $.app.getModel("session").getData();

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                // filter, sort 제거
                var oColumns = oTable.getColumns();
                for (var i = 0; i < oColumns.length; i++) {
                    oColumns[i].setFiltered(false);
                    oColumns[i].setSorted(false);
                }

                var search = function () {
                    var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                    var createData = { PregnantApplyTableIn: [] };
                    createData.IConType = "1";
                    createData.IBukrs = vEmpLoginInfo.Bukrs;
                    createData.IMolga = vEmpLoginInfo.Molga;
                    createData.IEmpid = vEmpLoginInfo.Pernr;
                    createData.IPernr = vEmpLoginInfo.Pernr;
                    createData.ILangu = vEmpLoginInfo.Langu;

                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                if (data.PregnantApplyTableIn && data.PregnantApplyTableIn.results) {
                                    for (var i = 0; i < data.PregnantApplyTableIn.results.length; i++) {
                                        data.PregnantApplyTableIn.results[i].Idx = i + 1;

                                        data.PregnantApplyTableIn.results[i].Begda = data.PregnantApplyTableIn.results[i].Begda ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begda)) : null;
                                        data.PregnantApplyTableIn.results[i].Endda = data.PregnantApplyTableIn.results[i].Endda ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endda)) : null;

                                        data.PregnantApplyTableIn.results[i].Prebg = data.PregnantApplyTableIn.results[i].Prebg ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Prebg)) : null;
                                        data.PregnantApplyTableIn.results[i].Preen = data.PregnantApplyTableIn.results[i].Preen ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Preen)) : null;

                                        // 단축근무기간 12주이내
                                        data.PregnantApplyTableIn.results[i].Begsh = data.PregnantApplyTableIn.results[i].Begsh ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh = data.PregnantApplyTableIn.results[i].Endsh ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh)) : null;
                                        // 신청가능기간
                                        data.PregnantApplyTableIn.results[i].Begshp = data.PregnantApplyTableIn.results[i].Begshp ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begshp)) : null;
                                        data.PregnantApplyTableIn.results[i].Endshp = data.PregnantApplyTableIn.results[i].Endshp ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endshp)) : null;

                                        // 단축근무기간 36주이후
                                        data.PregnantApplyTableIn.results[i].Begsh2 = data.PregnantApplyTableIn.results[i].Begsh2 ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh2)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh2 = data.PregnantApplyTableIn.results[i].Endsh2 ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh2)) : null;
                                        // 신청가능기간
                                        data.PregnantApplyTableIn.results[i].Begsh2p = data.PregnantApplyTableIn.results[i].Begsh2p ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Begsh2p)) : null;
                                        data.PregnantApplyTableIn.results[i].Endsh2p = data.PregnantApplyTableIn.results[i].Endsh2p ? new Date(Common.setTime(data.PregnantApplyTableIn.results[i].Endsh2p)) : null;

                                        vData.Data.push(data.PregnantApplyTableIn.results[i]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

                    // Common.adjustViewHeightRowCount({
                    //                 tableControl: oTable,
                    //                 viewHeight: 34,
                    //                 dataCount: vDetailList.length
                    //             });

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onSelectTable: function (oEvent, Flag) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oData;

                if (Flag && Flag == "X") {
                    oData = oEvent.getSource().getCustomData()[0].getValue();
                } else {
                    var sPath = oEvent.getParameters().rowBindingContext.sPath;
                    var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

                    oData = oTable.getModel().getProperty(sPath);
                }

                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                oData.Prebg = oData.Prebg ? dateFormat.format(oData.Prebg) : "";
                oData.Preen = oData.Preen ? dateFormat.format(oData.Preen) : "";
                oData.Begsh = oData.Begsh ? dateFormat.format(oData.Begsh) : "";
                oData.Endsh = oData.Endsh ? dateFormat.format(oData.Endsh) : "";
                oData.Begshp = oData.Begshp ? dateFormat.format(oData.Begshp) : "";
                oData.Endshp = oData.Endshp ? dateFormat.format(oData.Endshp) : "";
                oData.Begsh2 = oData.Begsh2 ? dateFormat.format(oData.Begsh2) : "";
                oData.Endsh2 = oData.Endsh2 ? dateFormat.format(oData.Endsh2) : "";
                oData.Begsh2p = oData.Begsh2p ? dateFormat.format(oData.Begsh2p) : "";
                oData.Endsh2p = oData.Endsh2p ? dateFormat.format(oData.Endsh2p) : "";

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("2");

                oController.onPressSearch2(oData);
            },

            onPressSearch2: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var vData = { Data: {} };
                if (oEvent == undefined) {
                    vData.Data.Status1 = "";
                    vData.Data.Prebn = "1";
                    vData.Data.Reqdt = new Date(); // 신규신청 시 신청일은 현재일자로 설정
                } else {
                    vData.Data = oEvent;
                }

                oController._ListCondJSonModel.setData(vData);

                // 단축근무시간 리스트
                var oPampm = sap.ui.getCore().byId(oController.PAGEID + "_Pampm");
                oPampm.destroyItems();
                var oModel = $.app.getModel("ZHR_COMMON_SRV");
                var createData = { NavCommonCodeList: [] };
                createData.ICodeT = "058";
                createData.IDatum = vData.Data.Reqdt ? "/Date(" + Common.getTime(new Date(vData.Data.Reqdt)) + ")/" : "/Date(" + Common.getTime(new Date()) + ")/";
                createData.ILangu = $.app.getModel("session").getData().Langu;

                oModel.create("/CommonCodeListHeaderSet", createData, {
					success: function (data) {
                        if (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                    oPampm.addItem(
                                        new sap.ui.core.Item({
                                            key: data.NavCommonCodeList.results[i].Code,
                                            text: data.NavCommonCodeList.results[i].Text
                                        })
                                    );
                                }
                            }
                        }
                    },
					error: function (oError) {
                        var Err = {};
                        oController.Error = "E";

                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
				});

                if (oController.Error == "E") {
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                }

                // 임신시작일 입력 가능 여부
                createData = { NavCommonCodeList: [] };
                createData.ICodeT = "058";
                createData.ICodty = "PT_MATE";
                createData.IDatum = vData.Data.Reqdt ? "/Date(" + Common.getTime(new Date(vData.Data.Reqdt)) + ")/" : "/Date(" + Common.getTime(new Date()) + ")/";
                createData.ILangu = $.app.getModel("session").getData().Langu;

                oModel.create("/CommonCodeListHeaderSet", createData, {
					success: function (data) {
                        if (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                oController._ListCondJSonModel.setProperty("/Data/Prebgyn", data.NavCommonCodeList.results[0].Code);
                            }
                        }
                    },
					error: function (oError) {
                        var Err = {};
                        oController.Error = "E";

                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
				});

                // 작성중 문서를 선택한 경우 출산일 - 현재일 체크
                if (vData.Data.Status1 == "AA") {
                    oController.onCheckPreen();
                }

                AttachFileAction.setAttachFile(oController, {
                    Appnm: vData.Data.Appnm ? vData.Data.Appnm : "",
                    Required: true,
                    Mode: "M",
                    Max: "1",
                    Editable: vData.Data.Status1 == "" || vData.Data.Status1 == "AA" ? true : false,
                    FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"]
                });
            },

            // 등록신청 이동
            onPressApply: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .setSelectedKey("2");
                oController.onPressSearch2();
            },

            // 단축근무시간 변경
            onChangePampm: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                // 단축근무 제외 선택 시 단축근무기간 초기화
                if (!oController._ListCondJSonModel.getProperty("/Data/Pampm") || oController._ListCondJSonModel.getProperty("/Data/Pampm") == "" || oController._ListCondJSonModel.getProperty("/Data/Pampm") == "9") {
                    oController._ListCondJSonModel.setProperty("/Data/Begsh", "");
                    oController._ListCondJSonModel.setProperty("/Data/Endsh", "");
                    oController._ListCondJSonModel.setProperty("/Data/Begsh2", "");
                    oController._ListCondJSonModel.setProperty("/Data/Endsh2", "");
                } else {
                    var oData = oController._ListCondJSonModel.getProperty("/Data");

                    var check = function (date) {
                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                        var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                        var date1 = dateFormat.format(new Date(date)) * 1;
                        var date2 = dateFormat.format(new Date()) * 1;

                        if (date1 < date2) {
                            return dateFormat2.format(new Date());
                        } else {
                            return date;
                        }
                    };

                    if (oData.Begshp) {
                        oController._ListCondJSonModel.setProperty("/Data/Begsh", check(oData.Begshp));
                    }

                    if (oData.Endshp) {
                        oController._ListCondJSonModel.setProperty("/Data/Endsh", check(oData.Endshp));
                    }

                    if (oData.Begsh2p) {
                        oController._ListCondJSonModel.setProperty("/Data/Begsh2", check(oData.Begsh2p));
                    }

                    if (oData.Endsh2p) {
                        oController._ListCondJSonModel.setProperty("/Data/Endsh2", check(oData.Endsh2p));
                    }
                }
            },

            // Flag : S 저장, C 신청, D 삭제
            onPressSave: function (oEvent, Flag) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");

                if (Flag != "D") {
                    // validation check
                    if (oData.Eretcode == "Z") {
                        MessageBox.error(oData.Erettext);
                        return;
                    }

                    if (!oData.Preen || oData.Preen == "") {
                        MessageBox.error(oController.getBundleText("MSG_39015")); // 출산(예정)일을 입력하여 주십시오.
                        return;
                    } else if ((!oData.EditFalse || oData.EditFalse == "") && (!oData.Prebg || oData.Prebg == "")) {
                        MessageBox.error(oController.getBundleText("MSG_39016")); // 임신시작일을 입력하여 주십시오.
                        return;
                    } else if (oData.Prebn == "" || oData.Prebn == "0") {
                        MessageBox.error(oController.getBundleText("MSG_39017")); // 태아수를 입력하여 주십시오.
                        return;
                    } else if (!oData.EditFalse || oData.EditFalse == "") {
                        if (!oData.Pampm || oData.Pampm == "") {
                            MessageBox.error(oController.getBundleText("MSG_39018")); // 단축근무시간을 선택하여 주십시오.
                            return;
                        } else if (oData.Pampm != "9") {
                            // 단축근무 제외를 선택하지 않은 경우, 단축근무기간 중 하나는 입력되어야 한다.
                            if ((oData.Begsh && !oData.Endsh) || (!oData.Begsh && oData.Endsh) || (oData.Begsh2 && !oData.Endsh2) || (!oData.Begsh2 && oData.Endsh2)) {
                                MessageBox.error(oController.getBundleText("MSG_39020")); // 단축근무기간을 입력하여 주십시오.
                                return;
                            } else if (!oData.Begsh && !oData.Endsh && !oData.Begsh2 && !oData.Endsh2) {
                                MessageBox.error(oController.getBundleText("MSG_39020")); // 단축근무기간을 입력하여 주십시오.
                                return;
                            } else {
                                // 단축근무기간과 신청가능기간 체크
                                var check = function (d1, d2, flag) {
                                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });

                                    var date1 = dateFormat.format(new Date(d1)) * 1;
                                    var date2 = dateFormat.format(new Date(d2)) * 1;

                                    if (flag == "1") {
                                        if (date1 < date2) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if (date1 > date2) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                };

                                if (oData.Begsh && oData.Endsh) {
                                    if (check(oData.Begsh, oData.Begshp, "1") == false || check(oData.Endsh, oData.Endshp, "2") == false) {
                                        MessageBox.error(oController.getBundleText("MSG_39022")); // 단축근무기간(12주이내) 값이 임신주수기준의 기간을 벗어났습니다. 확인하시기 바랍니다.
                                        return;
                                    }
                                }

                                if (oData.Begsh2 && oData.Endsh2) {
                                    if (check(oData.Begsh2, oData.Begsh2p, "1") == false || check(oData.Endsh2, oData.Endsh2p, "2") == false) {
                                        MessageBox.error(oController.getBundleText("MSG_39023")); // 단축근무기간(36주이후) 값이 임신주수기준의 기간을 벗어났습니다. 확인하시기 바랍니다.
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    if (oData.Eretcode !== "X") {
                        if (AttachFileAction.getFileLength(oController) === 0) {
                            MessageBox.error(oController.getBundleText("MSG_39021"), {
                                // 첨부파일을 업로드 해주세요.
                                title: oController.getBundleText("LABEL_00149") // 안내
                            });
                            return;
                        }
                    }
                }

                var confirmMessage = "",
                    successMessage = "";
                if (Flag == "S") {
                    confirmMessage = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
                    successMessage = oController.getBundleText("MSG_00017"); // 저장되었습니다.
                } else if (Flag == "C") {
                    confirmMessage = oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
                    successMessage = oController.getBundleText("MSG_00061"); // 신청되었습니다.
                } else {
                    confirmMessage = oController.getBundleText("MSG_39013"); // 삭제하시겠습니까?
                    successMessage = oController.getBundleText("MSG_39014"); // 삭제되었습니다.
                }

                var onProcess = function () {
                    var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                    var vExtryn = Common.isExternalIP() === true ? "X" : "";
                    
                    var createData = { PregnantApplyTableIn: [] };
                    if (Flag == "D") {
                        createData.IConType = "4";
                    } else {
                        createData.IConType = oData.Status1 == "AA" ? "2" : "3";
                        if (Flag == "C") {
                            createData.IAppck = "X";
                        }
                    }

                    createData.IPernr = $.app.getModel("session").getData().Pernr;
                    createData.IEmpid = $.app.getModel("session").getData().Pernr;
                    createData.IMolga = $.app.getModel("session").getData().Molga;
                    createData.IBukrs = $.app.getModel("session").getData().Bukrs;
                    createData.ILangu = $.app.getModel("session").getData().Langu;
                    createData.IBegda = oData.Begda ? "/Date(" + Common.getTime(oData.Begda) + ")/" : null;
                    createData.IEndda = oData.Endda ? "/Date(" + Common.getTime(oData.Endda) + ")/" : null;
                    createData.IExtryn = vExtryn;

                    var detail = {};
                    detail.Pernr = $.app.getModel("session").getData().Pernr;
                    detail.Preen = "/Date(" + Common.getTime(new Date(oData.Preen)) + ")/"; // 출산예정일
                    detail.Prebg = oData.Prebg ? "/Date(" + Common.getTime(new Date(oData.Prebg)) + ")/" : null; // 임신시작일
                    detail.Prebn = oData.Prebn; // 태아수
                    detail.Pampm = oData.Pampm; // 단축근무시간
                    detail.Mptyp = oData.Mptyp ? oData.Mptyp : ""; // 법정관리유형

                    // 단축근무기간
                    detail.Begsh = oData.Begsh ? "/Date(" + Common.getTime(new Date(oData.Begsh)) + ")/" : null;
                    detail.Endsh = oData.Endsh ? "/Date(" + Common.getTime(new Date(oData.Endsh)) + ")/" : null;
                    detail.Begshp = oData.Begshp ? "/Date(" + Common.getTime(new Date(oData.Begshp)) + ")/" : null;
                    detail.Endshp = oData.Endshp ? "/Date(" + Common.getTime(new Date(oData.Endshp)) + ")/" : null;

                    // 신청가능기간
                    detail.Begsh2 = oData.Begsh2 ? "/Date(" + Common.getTime(new Date(oData.Begsh2)) + ")/" : null;
                    detail.Endsh2 = oData.Endsh2 ? "/Date(" + Common.getTime(new Date(oData.Endsh2)) + ")/" : null;
                    detail.Begsh2p = oData.Begsh2p ? "/Date(" + Common.getTime(new Date(oData.Begsh2p)) + ")/" : null;
                    detail.Endsh2p = oData.Endsh2p ? "/Date(" + Common.getTime(new Date(oData.Endsh2p)) + ")/" : null;

                    detail.Reque = oData.Reque; // 요청사항

                    if (oData.Reqdt) {
                        detail.Reqdt = "/Date(" + Common.getTime(oData.Reqdt) + ")/"; // 신청일자
                    } else {
                        detail.Reqdt = "/Date(" + Common.getTime(new Date()) + ")/"; // 신청일자
                    }

                    if (Flag != "D") {
                        if (oData.Eretcode != "X" && AttachFileAction.getFileLength(oController) > 0) {
                            // 첨부파일 저장
                            detail.Appnm = AttachFileAction.uploadFile.call(oController);
                            if (!detail.Appnm) {
                                oController._BusyDialog.close();
                                return;
                            }
                        }
                    }

                    detail.Begda = oData.Begda ? "/Date(" + Common.getTime(oData.Begda) + ")/" : null;
                    detail.Endda = oData.Endda ? "/Date(" + Common.getTime(oData.Endda) + ")/" : null;

                    createData.PregnantApplyTableIn.push(detail);

                    oModel.create("/PregnantApplyHeaderSet", createData, {
                        success: function (data) {
                            if (data) {
                                if(Flag == "C" && data.EUrl != "" && vExtryn == ""){
									setTimeout(function() {
					                    var width = 1000, height = screen.availHeight * 0.9,
					                    left = (screen.availWidth - width) / 2,
					                    top = (screen.availHeight - height) / 2,
					                    popup = window.open(data.EUrl, "smoin-approval-popup", [
					                        "width=" + width,
					                        "height=" + height,
					                        "left=" + left,
					                        "top=" + top,
					                        "status=yes,resizable=yes,scrollbars=yes"
					                    ].join(","));
					
					                    setTimeout(function() {
					                        popup.focus();
					                    }, 500);
					                }, 0);
								}
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    MessageBox.success(successMessage, {
                        onClose: function () {
                            sap.ui
                                .getCore()
                                .byId(oController.PAGEID + "_Icontabbar")
                                .setSelectedKey("1");
                            oController.onPressSearch1();
                        }
                    });
                };

                var onBeforeSave = function (fVal) {
                    if (fVal && fVal == "YES") {
                        oController._BusyDialog.open();
                        setTimeout(onProcess, 100);
                    }
                };

                MessageBox.confirm(confirmMessage, {
                    actions: ["YES", "NO"],
                    onClose: onBeforeSave
                });
            },

            handleIconTabBarSelect: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Pregnant.List");
                var oController = oView.getController();

                var sKey = sap.ui
                    .getCore()
                    .byId(oController.PAGEID + "_Icontabbar")
                    .getSelectedKey();
                oController["onPressSearch" + sKey]();
            },

            getUserId: function () {
                return $.app.getModel("session").getData().Pernr;
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20120220"});
                      return new JSONModelHelper({ name: "20060040" });
                      // return new JSONModelHelper({name: "20200277"});
                  }
                : null
        });
    }
);
