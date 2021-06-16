/* eslint-disable no-undef */
/* global moment:true */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, CommonController, DialogHandler, OrgOfIndividualHandler, Spreadsheet, JSONModel) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            // 출장

            PAGEID: "",
            _ListCondJSonModel: new JSONModel(),
            _ListJSonModel: new JSONModel(),
            _ApplyJSonModel: new JSONModel(),
            _UploadTableJSonModel: new JSONModel(),
            _BusyDialog: new sap.m.BusyDialog(),

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            onBeforeShow: function () {
                var oController = $.app.getController();
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.getView().getModel("session").getData().Dtfmt }),
                    curDate = new Date(),
                    IBegda = new Date(curDate.getFullYear(), curDate.getMonth(), 1),
                    IEndda = new Date(curDate.getFullYear(), curDate.getMonth(), new Date(curDate.getFullYear(), curDate.getMonth() - 1, 0).getDate());

                oController._ListCondJSonModel.setSizeLimit(5000);
                oController._ApplyJSonModel.setSizeLimit(5000);
                oController._ListCondJSonModel.setProperty("/Data", { Begda: IBegda, Endda: IEndda });
                oController._ApplyJSonModel.setProperty("/Data", {});

                Promise.all([
                    common.Common.getPromise(function () {
                        $.app.getModel("ZHR_COMMON_SRV").create(
                            "/CommonCodeListHeaderSet", //통화키
                            {
                                IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                IDatum: "/Date(" + common.Common.getTime(new Date()) + ")/",
                                IMolga: oController.getView().getModel("session").getData().Molga,
                                ILangu: oController.getView().getModel("session").getData().Langu,
                                ICodeT: "023",
                                NavCommonCodeList: []
                            },
                            {
                                async: true,
                                success: function (data) {
                                    var vData = [];
                                    if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                        Object.assign(vData, data.NavCommonCodeList.results);
                                    }
                                    oController._ApplyJSonModel.setProperty("/Waers", vData);
                                },
                                error: function (oResponse) {
                                    common.Common.log(oResponse);
                                }
                            }
                        );
                    }),
                    common.Common.getPromise(function () {
                        $.app.getModel("ZHR_PAY_RESULT_SRV").create(
                            "/TempPayDeductionSet", //임금유형 , 결재상태, 안내문
                            {
                                IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                IPernr: oController.getView().getModel("session").getData().Pernr,
                                IMode: "0",
                                ILangu: oController.getView().getModel("session").getData().Langu,
                                // IPaydt : "\/Date("+ common.Common.getTime(new Date())+")\/",
                                TempPayDeductionTableIn1: [],
                                TempPayDeductionTableIn2: [],
                                TempPayDeductionTableIn3: [],
                                TempPayDeductionExport: []
                            },
                            {
                                async: true,
                                success: function (data) {
                                    var vData = [];
                                    if (data.TempPayDeductionTableIn2 && data.TempPayDeductionTableIn2.results) {
                                        for (var i = 0; i < data.TempPayDeductionTableIn2.results.length; i++) {
                                            data.TempPayDeductionTableIn2.results[i].Lgtxt2 = data.TempPayDeductionTableIn2.results[i].Lgart + " " + data.TempPayDeductionTableIn2.results[i].Lgtxt;
                                        }
                                        Object.assign(vData, data.TempPayDeductionTableIn2.results);
                                    }
                                    oController._ListCondJSonModel.setProperty("/Lgart", vData);
                                    oController._ApplyJSonModel.setProperty("/Lgart", vData);
                                    var vData2 = [];
                                    if (data.TempPayDeductionTableIn2 && data.TempPayDeductionTableIn2.results) {
                                        Object.assign(vData2, data.TempPayDeductionTableIn3.results);
                                    }
                                    oController._ListCondJSonModel.setProperty("/Status", vData2);
                                    var vData3 = {};
                                    if (data.TempPayDeductionExport && data.TempPayDeductionExport.results) {
                                        Object.assign(vData3, data.TempPayDeductionExport.results[0]);
                                        vData3.EPaydt = data.TempPayDeductionExport.results[0].EPaydt ? dateFormat.format(new Date(common.Common.setTime(data.TempPayDeductionExport.results[0].EPaydt))) : null;
                                    }
                                    oController._ListCondJSonModel.setProperty("/Info", vData3);
                                },
                                error: function (oResponse) {
                                    common.Common.log(oResponse);
                                }
                            }
                        );
                    })
                ]);
            },

            onAfterShow: function () {},

            onPressSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");

                var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
                // var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt});
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TempPayDeductionTableIn1: [] };

                    oPath = "/TempPayDeductionSet";
                    createData.IMode = "L";
                    createData.IBurks = vCondiData.Burks && vCondiData.Burks != "" ? vCondiData.Burks : oController.getView().getModel("session").getData().Burks2;
                    createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                    createData.IOrgeh = vCondiData.Orgeh && vCondiData.Orgeh != "" ? vCondiData.Orgeh : "";
                    createData.ILgart = vCondiData.Lgart && vCondiData.Lgart != "" ? vCondiData.Lgart : "";
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;
                    createData.IStatus = vCondiData.Status && vCondiData.Status != "" ? vCondiData.Status : "";
                    createData.IBegda = vCondiData.Begda && vCondiData.Begda != "" ? "/Date(" + common.Common.getTime(new Date(vCondiData.Begda)) + ")/" : null;
                    createData.IEndda = vCondiData.Endda && vCondiData.Endda != "" ? "/Date(" + common.Common.getTime(new Date(vCondiData.Endda)) + ")/" : null;
                    createData.IEmpid = oController.getView().getModel("session").getData().Pernr;

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.TempPayDeductionTableIn1 && data.TempPayDeductionTableIn1.results.length > 0) {
                                    for (var i = 0; i < data.TempPayDeductionTableIn1.results.length; i++) {
                                        data.TempPayDeductionTableIn1.results[i].Idx = i + 1;

                                        vData.Data.push(data.TempPayDeductionTableIn1.results[i]);
                                    }
                                }
                            }
                        },
                        function (oError) {
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
                    );

                    oController._ListJSonModel.setProperty("/Data", vData.Data);
                    Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    $.app.byId(oController.PAGEID + "_Table").clearSelection();
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onSave: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs");
                var oController = oView.getController();
                var saveData = oController._ApplyJSonModel.getProperty("/Data");

                var create = function () {
                    var oPath = "";
                    var createData = { TempPayDeductionTableIn1: [] };
                    var detailData = {};
                    oPath = "/TempPayDeductionSet";
                    createData.IMode = "I";
                    createData.IEmpid = oController.getView().getModel("session").getData().Pernr;

                    Object.assign(detailData, saveData);
                    delete detailData.EnameOrOrgehTxt;
                    createData.IPernr = detailData.Pernr;
                    createData.IBukrs = detailData.Bukrs;
                    delete detailData.Bukrs;
                    delete detailData.Stext;
                    detailData.Begda = "/Date(" + common.Common.getTime(new Date(oController._ListCondJSonModel.getProperty("/Info/EPaydt"))) + ")/";
                    createData.IPaydt = detailData.Begda; // 지급공제일

                    detailData.Betrg = detailData.Betrg ? common.Common.toNumber(detailData.Betrg) : "";
                    detailData.Betrg = "" + detailData.Betrg;
                    createData.TempPayDeductionTableIn1.push(detailData);
                    var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");

                    oModel.create(oPath, createData, {
                        success: function () {},
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
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    sap.m.MessageBox.alert(oController.getBundleText("MSG_45002"), {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._RequestDialog.close();
                            // Data setting
                            oController.onPressSearch();
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_17003"), {
                    // 신청하시겠습니까?
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onDelete: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs");
                var oController = oView.getController();
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
                    createData = { TempPayDeductionTableIn1: [] },
                    vIdx = oTable.getSelectedIndices();
                if (vIdx.length < 1) {
                    sap.m.MessageBox.error(oController.getBundleText("MSG_00050")); // 삭제할 행을 선택하세요.
                    return;
                }
                for (var i = 0; i < vIdx.length; i++) {
                    var detailData = {};
                    Object.assign(detailData, oController._ListJSonModel.getProperty(oTable.getContextByIndex(vIdx[i]).sPath));
                    if (detailData.Status == "ZZ") {
                        sap.m.MessageBox.error(oController.getBundleText("MSG_50004")); // 진행상태가 중복인 것은 저장된 데이터가 아니라 삭제가 불가능합니다.
                        return;
                    }
                    if (detailData.Apernr != oController.getView().getModel("session").getData().Pernr) {
                        sap.m.MessageBox.error(oController.getBundleText("MSG_50005")); // 타인이 신청한 건은 삭제가 불가능합니다.
                        return;
                    }

                    delete detailData.Idx;
                    createData.TempPayDeductionTableIn1.push(detailData);
                }

                var create = function () {
                    var oPath = "/TempPayDeductionSet";
                    var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");

                    createData.IMode = "D";

                    oModel.create(oPath, createData, {
                        success: function () {},
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
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    sap.m.MessageBox.alert(oController.getBundleText("MSG_00021"), {
                        // 삭제되었습니다.
                        title: oController.getBundleText("LABEL_02053"),
                        onClose: function () {
                            // Data setting
                            oController.onPressSearch();
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_00051"), {
                    // 선택된 행을 삭제하시겠습니까?
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            pressRequestForm: function () {
                var oView = $.app.getView();
                var oController = $.app.getController();
                if (!oController._RequestDialog) {
                    oController._RequestDialog = sap.ui.jsfragment("ZUI5_HR_PayDeductionRequest.fragment.RequestDialog", oController);
                    oView.addDependent(oController._RequestDialog);
                }

                oController._ApplyJSonModel.setProperty("/Data", { Begda: oController._ListCondJSonModel.getProperty("/Info/EPaydt"), Waers: "KRW" });

                oController._RequestDialog.open();
            },

            changeFile: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs"),
                    oController = oView.getController(),
                    reader = new FileReader(),
                    f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];

                // Excel Table 초기화
                oController._UploadTableJSonModel.setData({ Data: [] });

                reader.onload = function (e) {
                    oController._BusyDialog.open();

                    oController.X = XLSX;

                    var data = e.target.result,
                        arr = oController.fixdata(data),
                        wb = oController.X.read(btoa(arr), { type: "base64" });

                    oController.to_json(wb);

                    oController._BusyDialog.close();
                };

                reader.readAsArrayBuffer(f);
            },

            fixdata: function (data) {
                var o = "",
                    l = 0,
                    w = 10240;
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            },

            to_json: function (workbook) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs"),
                    oController = oView.getController(),
                    oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"),
                    oModel = $.app.getModel("ZHR_PAY_RESULT_SRV"),
                    Datas = { Data: [] },
                    vData = { Data: [] },
                    createData = { TempPayDeductionTableIn1: [] },
                    rowDatas = [],
                    vMessage = "";

                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]),
                        cRowData = {};

                    if (roa && roa.length) {
                        roa.forEach(function (rowElem) {
                            cRowData = {};
                            cRowData.Pernr = rowElem.Coulmn_0; //  사번
                            cRowData.Lgart = rowElem.Coulmn_1; //  임금유형
                            cRowData.Betrg = "" + common.Common.toNumber(rowElem.Coulmn_2); //  금액
                            if (!rowElem.Coulmn_3 || rowElem.Coulmn_3 == "") {
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_50006"), { title: oController.getBundleText("LABEL_50011") }); // =통화키는 필수입력항목입니다.
                                return;
                            }
                            cRowData.Waers = rowElem.Coulmn_3; // 통화키
                            cRowData.Notes = rowElem.Coulmn_4 && rowElem.Coulmn_4 != "" ? rowElem.Coulmn_4 : "";
                            cRowData.Begda = "/Date(" + common.Common.getTime(oController._ListCondJSonModel.getProperty("/Info/EPaydt")) + ")/";

                            rowDatas.push(cRowData);
                        });
                    }
                });

                if (rowDatas.length) {
                    var oPath = "/TempPayDeductionSet";
                    createData.IMode = "U";
                    createData.IEmpid = oController.getView().getModel("session").getData().Pernr;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;
                    createData.IPaydt = "/Date(" + common.Common.getTime(oController._ListCondJSonModel.getProperty("/Info/EPaydt")) + ")/";
                    createData.TempPayDeductionTableIn1 = rowDatas;
                    createData.TempPayDeductionExport = [];

                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TempPayDeductionExport && data.TempPayDeductionExport.results) {
                                    if (data.TempPayDeductionExport.results[0].ESucc && common.Common.toNumber(data.TempPayDeductionExport.results[0].ESucc) != 0) {
                                        vMessage = oController.getBundleText("MSG_50001");
                                        vMessage = vMessage.replace("&total", data.TempPayDeductionExport.results[0].ETot);
                                        vMessage = vMessage.replace("&Success", data.TempPayDeductionExport.results[0].ESucc);
                                    }
                                    if (data.TempPayDeductionExport.results[0].EFail && common.Common.toNumber(data.TempPayDeductionExport.results[0].EFail) != 0) {
                                        if (vMessage != "") vMessage = vMessage + "/n";
                                        vMessage = vMessage + oController.getBundleText("MSG_50002");
                                        vMessage = vMessage.replace("&Fail", data.TempPayDeductionExport.results[0].EFail);
                                    }
                                }
                                if (data.TempPayDeductionTableIn1 && data.TempPayDeductionTableIn1.results.length > 0) {
                                    for (var i = 0; i < data.TempPayDeductionTableIn1.results.length; i++) {
                                        data.TempPayDeductionTableIn1.results[i].Idx = i + 1;

                                        vData.Data.push(data.TempPayDeductionTableIn1.results[i]);
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

                    oController._ListJSonModel.setProperty("/Data", vData.Data);
                    Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
                    oController._UploadTableJSonModel.setData(Datas);
                    oController._UploadTableJSonModel.refresh();

                    if (oController.Error == "E") {
                        oFileUploader.setValue("");
                        oFileUploader.setVisible(false);
                        oFileUploader.setVisible(true);
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    $.app.byId(oController.PAGEID + "_Table").clearSelection();

                    sap.m.MessageBox.alert(vMessage, {
                        // 업로드 완료하였습니다.
                        title: oController.getBundleText("LABEL_00150"), // 확인.
                        onClose: function () {}
                    });
                }

                oFileUploader.setValue("");
                oFileUploader.setVisible(false);
                oFileUploader.setVisible(true);
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             *
             * @this {Handler}
             */
            searchOrgehPernr: function () {
                // var oController = $.app.getController();
                setTimeout(
                    function () {
                        var oModel = this._ListCondJSonModel,
                            initData = {
                                Percod: this.getSessionInfoByKey("Percod"),
                                Bukrs: this.getSessionInfoByKey("Bukrs2"),
                                Langu: this.getSessionInfoByKey("Langu"),
                                Molga: this.getSessionInfoByKey("Molga"),
                                Datum: new Date(),
                                Mssty: ""
                            },
                            callback = function (o) {
                                oModel.setProperty("/Data/Pernr", o.Otype === "P" ? o.Objid : "");
                                oModel.setProperty("/Data/Orgeh", o.Otype === "O" ? o.Objid : "");
                                oModel.setProperty("/Data/EnameOrOrgehTxt", o.Stext || "");
                            };

                        this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                        DialogHandler.open(this.OrgOfIndividualHandler);
                    }.bind(this),
                    0
                );
            },

            getOrgOfIndividualHandler: function () {
                return this.OrgOfIndividualHandler;
            },

            onESSelectPerson: function (data) {
                return !this.EmployeeSearchCallOwner ? this.OrgOfIndividualHandler.setSelectionTagets(data) : this.EmployeeSearchCallOwner.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function (oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent) : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },

            searchOrgehPernrByDetail: function () {
                var oController = $.app.getController();
                setTimeout(
                    function () {
                        var oModel = this._ApplyJSonModel,
                            initData = {
                                Percod: this.getSessionInfoByKey("Percod"),
                                Bukrs: this.getSessionInfoByKey("Bukrs2"),
                                Langu: this.getSessionInfoByKey("Langu"),
                                Molga: this.getSessionInfoByKey("Molga"),
                                Datum: new Date(),
                                Mssty: ""
                            },
                            callback = function (o) {
                                if (o.Otype === "P") {
                                    oModel.setProperty("/Data/Pernr", o.Otype === "P" ? o.Objid : "");
                                    oModel.setProperty("/Data/Ename", o.Otype === "P" ? o.Stext : "");
                                    oModel.setProperty("/Data/Bukrs", o.Otype === "P" ? o.Bukrs3 : "");
                                } else {
                                    sap.m.MessageBox.error(oController.getBundleText("MSG_50003"));
                                }
                            };

                        this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                        DialogHandler.open(this.OrgOfIndividualHandler);
                    }.bind(this),
                    0
                );
            },

            clearEname: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs");
                var oController = oView.getController();
                var oModel = oController._ListCondJSonModel;
                oModel.setProperty("/Data/Pernr", "");
                oModel.setProperty("/Data/Orgeh", "");
                oModel.setProperty("/Data/EnameOrOrgehTxt", "");
            },

            clearDetailEname: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_PayDeductionRequest.Tabs");
                var oController = oView.getController();
                var oModel = oController._ApplyJSonModel;
                oModel.setProperty("/Data/Pernr", "");
                oModel.setProperty("/Data/Orgeh", "");
                oModel.setProperty("/Data/Stext", "");
            },

            pressExcelDownloadBtn: function() {
				var aTableDatas = this._ListJSonModel.getProperty("/Data");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}
				
				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Begda", "ApplyDt"),
					workbook: {columns: this.aColumnModel},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_50001"), moment().format("YYYY.MMDD"))
				}).build();
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModel({ name: "20140099" }); //
                  }
                : null
        });
    }
);
