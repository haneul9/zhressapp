sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/SearchOrg",
        "common/SearchUser1",
        "sap/m/MessageBox",
        "sap/ui/export/Spreadsheet"
    ],
    function (Common, CommonController, JSONModelHelper, SearchOrg, SearchUser1, MessageBox, Spreadsheet) {
        "use strict";

        return CommonController.extend("ZUI5_HR_DailyTimeStatus.List", {
            PAGEID: "ZUI5_HR_DailyTimeStatus",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _Columns: [],

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

                this.getView().addStyleClass("sapUiSizeCompact");
                this.getView().setModel($.app.getModel("i18n"), "i18n");
            },

            onBeforeShow: function () {
                var oController = this;

                if (!oController._ListCondJSonModel.getProperty("/Data")) {
                    var oLoginData = $.app.getModel("session").getData();

                    // 인사영역
                    var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
                    oWerks.destroyItems();

                    var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
                    var oPath = "/WerksListAuthSet?$filter=Percod eq '" + encodeURIComponent(oLoginData.Percod) + "' and Bukrs eq '" + oLoginData.Bukrs + "'";

                    oModel.read(
                        oPath,
                        null,
                        null,
                        false,
                        function (data) {
                            if (data && data.results.length) {
                                for (var i = 0; i < data.results.length; i++) {
                                    if (data.results[i].Persa == "0AL1") continue; // 전체 제외

                                    oWerks.addItem(new sap.ui.core.Item({ key: data.results[i].Persa, text: data.results[i].Pbtxt }));
                                }
                            }
                        },
                        function (Res) {
                            oController.Error = "E";
                            if (Res.response.body) {
                                var ErrorMessage = Res.response.body;
                                var ErrorJSON = JSON.parse(ErrorMessage);
                                if (ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length) {
                                    oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                } else {
                                    oController.ErrorMessage = ErrorMessage;
                                }
                            }
                        }
                    );

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                    }

                    // 소속부서
                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_Orgeh")
                        .destroyTokens();

                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });

                    var vData = {
                        Data: {
                            Werks: oLoginData.Persa,
                            Tmdat: dateFormat.format(new Date()),
                            Pernr: $.app.getModel("session").getData().Pernr,
                            Langu: $.app.getModel("session").getData().Langu,
                            Auth: $.app.getAuth()
                        }
                    };

                    sap.ui
                        .getCore()
                        .byId(oController.PAGEID + "_Orgeh")
                        .addToken(
                            new sap.m.Token({
                                key: $.app.getModel("session").getData().Orgeh,
                                text: $.app.getModel("session").getData().Stext
                            })
                        );

                    oController._ListCondJSonModel.setData(vData);
                }
            },

            onAfterShow: function (oEvent) {
                var oController = this;

                if (!oEvent.data.FromPageId) {
                    oController.onPressSearch(oEvent);
                }
            },

            SmartSizing: function () {
                // var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                // var oController = oView.getController();
            },

            onChangeDate: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                if (oEvent && oEvent.getParameters().valid == false) {
                    MessageBox.error(oController.getBundleText(""));
                    oEvent.getSource().setValue("");
                    return;
                }
            },

            onPressSearch: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");
                if (!oData.Tmdat) {
                    MessageBox.error(oController.getBundleText("MSG_43001")); // 조회일자를 입력하여 주십시오.
                    return;
                } else if (!oData.Werks) {
                    MessageBox.error(oController.getBundleText("MSG_43002")); // 사업장을 선택하여 주십시오.
                    return;
                }

                var resetTable = function (table) {
                    if (!table) return;

                    var oColumn = table.getColumns();
                    for (var i = 0; i < oColumn.length; i++) {
                        oColumn[i].setSorted(false);
                        oColumn[i].setFiltered(false);
                    }

                    table.getModel().setData({ Data: [] });
                    table.setFixedBottomRowCount(0);
                    table.setVisibleRowCount(1);
                };

                var search = function () {
                    var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHEDULE_SRV");

                    var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
                    var oJSONModel1 = oTable1.getModel();
                    var vData1 = { Data: [] };
                    resetTable(oTable1);

                    var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
                    var oJSONModel2 = oTable2.getModel();
                    var vData2 = { Data: [] };
                    resetTable(oTable2);

                    var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
                    var oJSONModel3 = oTable3.getModel();
                    var vData3 = { Data: [] };
                    resetTable(oTable3);

                    var oTable4 = sap.ui.getCore().byId(oController.PAGEID + "_Table4");
                    // var oJSONModel4 = oTable4.getModel();
                    // var vData4 = {Data : []};
                    resetTable(oTable4);

                    // 1. 근태유형그룹별 현황
                    var createData1 = { TimeGroupStatNav: [] };
                    createData1.IWerks = oData.Werks;
                    createData1.IBukrs = oData.Werks;
                    createData1.ITmdat = "/Date(" + Common.getTime(new Date(oData.Tmdat)) + ")/";
                    createData1.ILangu = oData.Langu;
                    createData1.IEmpid = oData.Pernr;
                    createData1.IAusty = $.app.getAuth();

                    var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
                    if (oOrgeh.getTokens().length > 0) {
                        createData1.IOrgeh = oOrgeh.getTokens()[0].getKey();
                    }

                    oModel.create(
                        "/TimeGroupStatusSet",
                        createData1,
                        null,
                        function (data) {
                            if (data) {
                                if (data.TimeGroupStatNav && data.TimeGroupStatNav.results) {
                                    var field = ["Empcnt", "Attcnt", "Cnt01", "Cnt02", "Cnt03", "Cnt04", "Cnt05", "Cnt06", "Cnt07", "Cnt08", "Cnt09", "Cnt10", "Cnt11", "Cnt12"];

                                    for (var i = 0; i < data.TimeGroupStatNav.results.length; i++) {
                                        for (var j = 0; j < field.length; j++) {
                                            if (j <= 1) {
                                                // eval("data.TimeGroupStatNav.results[i]." + field[j] +
                                                // 	" = (data.TimeGroupStatNav.results[i]." + field[j] + " == '-' || data.TimeGroupStatNav.results[i]." + field[j] + " == '') ?" +
                                                // 	"'-' : parseFloat(data.TimeGroupStatNav.results[i]." + field[j] + ");");
                                                data.TimeGroupStatNav.results[i][field[j]] = data.TimeGroupStatNav.results[i][field[j]] === "-" || data.TimeGroupStatNav.results[i][field[j]] === "" ? "-" : parseFloat(data.TimeGroupStatNav.results[i][field[j]]);
                                            } else {
                                                // eval("data.TimeGroupStatNav.results[i]." + field[j] +
                                                // 	" = (data.TimeGroupStatNav.results[i]." + field[j] + " == '-' || data.TimeGroupStatNav.results[i]." + field[j] + " == '') ?" +
                                                // 	"'-' : data.TimeGroupStatNav.results[i]." + field[j] + ";");
                                                data.TimeGroupStatNav.results[i][field[j]] = data.TimeGroupStatNav.results[i][field[j]] === "-" || data.TimeGroupStatNav.results[i][field[j]] === "" ? "-" : data.TimeGroupStatNav.results[i][field[j]];
                                            }
                                        }

                                        vData1.Data.push(data.TimeGroupStatNav.results[i]);
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

                    oJSONModel1.setData(vData1);
                    oTable1.bindRows("/Data");
                    oTable1.setVisibleRowCount(vData1.Data.length);
                    oTable1.setFixedBottomRowCount(1);

                    if (oController.Error == "E") {
                        oController._BusyDialog.close();
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    // 2. 근무시간현황
                    var createData2 = { WeeklyWorkingTimeNav: [] };
                    createData2.IWerks = oData.Werks;
                    createData2.IBukrs = oData.Werks;
                    createData2.ITmdat = "/Date(" + Common.getTime(new Date(oData.Tmdat)) + ")/";
                    createData2.ILangu = oData.Langu;
                    createData2.IEmpid = oData.Pernr;
                    createData2.IAusty = $.app.getAuth();

                    if (oOrgeh.getTokens().length > 0) {
                        createData2.IOrgeh = oOrgeh.getTokens()[0].getKey();
                    }

                    oModel.create(
                        "/WeeklyWorkingTimeStatusSet",
                        createData2,
                        null,
                        function (data) {
                            if (data) {
                                if (data.WeeklyWorkingTimeNav && data.WeeklyWorkingTimeNav.results) {
                                    var field = ["Empcnt", "Hrs10", "Hrs11", "Hrs20", "Hrs21", "Hrs22", "Hrs30", "Hrs31", "Hrs32", "Hrs40", "Hrs41", "Hrs42", "Hrs50"];

                                    for (var i = 0; i < data.WeeklyWorkingTimeNav.results.length; i++) {
                                        for (var j = 0; j < field.length; j++) {
                                            // eval("data.WeeklyWorkingTimeNav.results[i]." + field[j] +
                                            // 		" = parseFloat(data.WeeklyWorkingTimeNav.results[i]." + field[j] + ") == 0 ? '-' : parseFloat(data.WeeklyWorkingTimeNav.results[i]." + field[j] + ");");

                                            data.WeeklyWorkingTimeNav.results[i][field[j]] = parseFloat(data.WeeklyWorkingTimeNav.results[i][field[j]]) === 0 ? "-" : parseFloat(data.WeeklyWorkingTimeNav.results[i][field[j]]);
                                        }

                                        vData2.Data.push(data.WeeklyWorkingTimeNav.results[i]);
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

                    oJSONModel2.setData(vData2);
                    oTable2.bindRows("/Data");
                    oTable2.setVisibleRowCount(vData2.Data.length);
                    oTable2.setFixedBottomRowCount(1);

                    if (oController.Error == "E") {
                        oController._BusyDialog.close();
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    // 3. 연장근로현황
                    var createData3 = { OvertimeStatNav: [] };
                    createData3.IWerks = oData.Werks;
                    createData3.IBukrs = oData.Werks;
                    createData3.ITmdat = "/Date(" + Common.getTime(new Date(oData.Tmdat)) + ")/";
                    createData3.ILangu = oData.Langu;
                    createData3.IEmpid = oData.Pernr;
                    createData3.IAusty = $.app.getAuth();

                    if (oOrgeh.getTokens().length > 0) {
                        createData3.IOrgeh = oOrgeh.getTokens()[0].getKey();
                    }

                    oModel.create(
                        "/OvertimeStatusSet",
                        createData3,
                        null,
                        function (data) {
                            if (data) {
                                if (data.OvertimeStatNav && data.OvertimeStatNav.results) {
                                    for (var i = 0; i < data.OvertimeStatNav.results.length; i++) {
                                        vData3.Data.push(data.OvertimeStatNav.results[i]);
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

                    oJSONModel3.setData(vData3);
                    oTable3.bindRows("/Data");
                    oTable3.setVisibleRowCount(vData3.Data.length);

                    if (oController.Error == "E") {
                        oController._BusyDialog.close();
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    // 4. 개인별 근무시간 현황

                    oController._BusyDialog.close();
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            // 근태유형그룹별 현황 → 근태유형별 상세현황
            onPressDetail: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                var oFilter = oController._ListCondJSonModel.getProperty("/Data");

                var oData = oEvent.getSource().getCustomData()[0].getValue();

                if (oData.Zhgrade == "ZZ") return;

                var oFlcty = oEvent.getSource().getCustomData()[1].getValue();
                if (oFlcty == "Empcnt") {
                    // 인원수
                    oFlcty = "A";
                } else if (oFlcty == "Attcnt") {
                    // 출근
                    oFlcty = "B";
                } else {
                    oFlcty = oFlcty.substring(3, 5) * 1 + "";
                }

                if (!oController._TimeGroupStatusDialog) {
                    oController._TimeGroupStatusDialog = sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.TimeGroupStatus", oController);
                    oView.addDependent(oController._TimeGroupStatusDialog);
                }

                // 데이터 조회
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TimeGroupStatusTable");
                var oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                var oColumns = oTable.getColumns();
                for (var i = 0; i < oColumns.length; i++) {
                    oColumns[i].setSorted(false);
                    oColumns[i].setFiltered(false);
                }

                var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHEDULE_SRV");
                var createData = { TimeGroupStatDetailNav: [] };
                createData.IWerks = oFilter.Werks;
                createData.IBukrs = oFilter.Werks;
                createData.ITmdat = "/Date(" + Common.getTime(new Date(oFilter.Tmdat)) + ")/";
                createData.IZhgrade = oData.Zhgrade;
                createData.IFlcty = oFlcty;
                createData.ILangu = oFilter.Langu;
                createData.IEmpid = oFilter.Pernr;
                createData.IAusty = $.app.getAuth();

                var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
                if (oOrgeh.getTokens().length > 0) {
                    createData.IOrgeh = oOrgeh.getTokens()[0].getKey();
                }

                oModel.create(
                    "/TimeGroupStatusDetailSet",
                    createData,
                    null,
                    function (data) {
                        if (data) {
                            if (data.TimeGroupStatDetailNav && data.TimeGroupStatDetailNav.results) {
                                for (var i = 0; i < data.TimeGroupStatDetailNav.results.length; i++) {
                                    data.TimeGroupStatDetailNav.results[i].Idx = i + 1;

                                    data.TimeGroupStatDetailNav.results[i].Beguz = data.TimeGroupStatDetailNav.results[i].Beguz == "" ? "" : data.TimeGroupStatDetailNav.results[i].Beguz.substring(0, 2) + ":" + data.TimeGroupStatDetailNav.results[i].Beguz.substring(2, 4);
                                    data.TimeGroupStatDetailNav.results[i].Enduz = data.TimeGroupStatDetailNav.results[i].Enduz == "" ? "" : data.TimeGroupStatDetailNav.results[i].Enduz.substring(0, 2) + ":" + data.TimeGroupStatDetailNav.results[i].Enduz.substring(2, 4);

                                    data.TimeGroupStatDetailNav.results[i].Stdaz = parseFloat(data.TimeGroupStatDetailNav.results[i].Stdaz) == 0 ? "" : data.TimeGroupStatDetailNav.results[i].Stdaz;

                                    vData.Data.push(data.TimeGroupStatDetailNav.results[i]);
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

                oJSONModel.setData(vData);
                oTable.bindRows("/Data");
                oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

                if (oController.Error == "E") {
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }

                oController._TimeGroupStatusDialog.open();
            },

            // 근무시간현황 → 근무시간현황
            onPressTable2: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
                var sPath = oEvent.getParameters().rowBindingContext.sPath;

                var oData = oTable.getModel().getProperty(sPath);

                if (oData.Wrkty == "3") {
                    // 전체
                    return;
                }

                var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");

                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: "ZUI5_HR_WorkingTimeChart.List",
                        data: {
                            FromPageId: "ZUI5_HR_DailyTimeStatus.List",
                            Werks: oController._ListCondJSonModel.getProperty("/Data/Werks"),
                            Tmdat: oController._ListCondJSonModel.getProperty("/Data/Tmdat"),
                            Orgeh: oOrgeh.getTokens().length > 0 ? oOrgeh.getTokens()[0].getKey() : "",
                            Orgtx: oOrgeh.getTokens().length > 0 ? oOrgeh.getTokens()[0].getText() : "",
                            Wrkty: oData.Wrkty
                        }
                    });
            },

            // 연장근로현황 → 추가근무 상세현황
            onPressOvertimeStatus: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                // var oData = oEvent.getSource().getCustomData()[0].getValue();
                var oFlcty = oEvent.getSource().getCustomData()[1].getValue().substring(3, 5);
                oFlcty = oFlcty * 1 + "";

                if (!oController._OvertimeStatusDialog) {
                    oController._OvertimeStatusDialog = sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.OvertimeStatus", oController);
                    oView.addDependent(oController._OvertimeStatusDialog);
                }

                // 데이터 조회
                var oFilter = oController._ListCondJSonModel.getProperty("/Data");
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeStatusTable");
                var oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHEDULE_SRV");
                var createData = { OvertimeStatDetailNav: [] };
                createData.IWerks = oFilter.Werks;
                createData.IBukrs = oFilter.Werks;
                createData.ITmdat = "/Date(" + Common.getTime(new Date(oFilter.Tmdat)) + ")/";
                createData.IFlcty = oFlcty;
                createData.ILangu = oFilter.Langu;
                createData.IEmpid = oFilter.Pernr;
                createData.IAusty = $.app.getAuth();

                oModel.create(
                    "/OvertimeStatusDetailSet",
                    createData,
                    null,
                    function (data) {
                        if (data) {
                            if (data.OvertimeStatDetailNav && data.OvertimeStatDetailNav.results) {
                                var field = ["Hrs20", "Hrs21", "Hrs22", "Hrs30", "Hrs31", "Hrs32", "Hrs40", "Hrs41", "Hrs42", "Hrs10", "Hrs11", "Hrs50"];

                                for (var i = 0; i < data.OvertimeStatDetailNav.results.length; i++) {
                                    data.OvertimeStatDetailNav.results[i].Idx = i + 1;

                                    for (var j = 0; j < field.length; j++) {
                                        // eval("data.OvertimeStatDetailNav.results[i]." + field[j] +
                                        // 		" = (data.OvertimeStatDetailNav.results[i]." + field[j] + " == '-' || data.OvertimeStatDetailNav.results[i]." + field[j] + " == '') ?" +
                                        // 		"'-' : parseFloat(data.OvertimeStatDetailNav.results[i]." + field[j] + ");");
                                        data.OvertimeStatDetailNav.results[i][field[j]] = data.OvertimeStatDetailNav.results[i][field[j]] === "-" || data.OvertimeStatDetailNav.results[i][field[j]] === "" ? "-" : parseFloat(data.OvertimeStatDetailNav.results[i][field[j]]);
                                    }

                                    vData.Data.push(data.OvertimeStatDetailNav.results[i]);
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

                oJSONModel.setData(vData);
                oTable.bindRows("/Data");
                oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

                oController._OvertimeStatusDialog.open();
            },

            onExport: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table4");
                var oJSONModel = oTable.getModel();

                var filename = oController.getBundleText("LABEL_43045"); // 개인별 근무시간현황

                var oSettings = {
                    workbook: { columns: oController._Columns },
                    dataSource: oJSONModel.getProperty("/Data"),
                    worker: false, // We need to disable worker because we are using a MockServer as OData Service
                    fileName: filename + ".xlsx"
                };

                var oSpreadsheet = new Spreadsheet(oSettings);
                oSpreadsheet.build();
            },

            // 대상자 검색
            onSearchUser: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                SearchUser1.oController = oController;
                SearchUser1.dialogContentHeight = 480;

                if (!oController.oAddPersonDialog) {
                    oController.oAddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
                    oView.addDependent(oController.oAddPersonDialog);
                }

                oController.oAddPersonDialog.open();
            },

            // 소속부서 검색
            displayMultiOrgSearchDialog: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                SearchOrg.oController = oController;
                SearchOrg.vCallControlId = oEvent.getSource().getId();

                if (oEvent.getSource().getId() == oController.PAGEID + "_Orgeh") {
                    SearchOrg.vActionType = "Single";
                    SearchOrg.vCallControlType = "MultiInput";
                } else {
                    SearchOrg.vActionType = "Multi";
                    SearchOrg.vCallControlType = "MultiInput";
                }

                if (!oController.oOrgSearchDialog) {
                    oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
                    oView.addDependent(oController.oOrgSearchDialog);
                }

                oController.oOrgSearchDialog.open();
            },

            // 대상자 선택
            onESSelectPerson: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                var oController = oView.getController();

                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
                var oJSONModel = oTable.getModel();
                var oIndices = oTable.getSelectedIndices();

                if (oIndices.length == 0) {
                    MessageBox.error(oController.getBundleText("MSG_02050")); // 대상자를 선택해 주시기 바랍니다.
                    return;
                } else if (oIndices.length != 1) {
                    MessageBox.error(oController.getBundleText("MSG_00068")); // 대상자를 한명만 선택하여 주십시오.
                    return;
                }

                var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
                oEname.destroyTokens();

                for (var i = 0; i < oIndices.length; i++) {
                    var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
                    var detail = oJSONModel.getProperty(sPath);

                    oEname.addToken(
                        new sap.m.Token({
                            key: detail.Pernr,
                            text: detail.Ename
                        })
                    );
                }

                oController.oAddPersonDialog.close();
            },

            onTableSort: function (oEvent) {
                // var oView = sap.ui.getCore().byId("ZUI5_HR_DailyTimeStatus.List");
                // var oController = oView.getController();

                var oTable = sap.ui.getCore().byId(oEvent.getParameters().id);
                var oData = oTable.getModel().getProperty("/Data");
                var total = oData[oData.length - 1];

                var oColumn = oEvent.getParameters().column;
                var oSortOrder = oEvent.getParameters().sortOrder;

                oEvent.preventDefault();
                for (var i = 0; i < oTable.getColumns().length; i++) {
                    oTable.getColumns()[i].setSorted(false);
                }

                oColumn.setSorted(true);
                oColumn.setSortOrder(oSortOrder);

                var newData = oData.map(function (elem) {
                    return $.extend(true, {}, elem);
                });

                newData.sort(function (a, b) {
                    var item1 = a[oColumn.getSortProperty()];
                    var item2 = b[oColumn.getSortProperty()];

                    item1 = item1 == "-" ? 0 : item1;
                    item2 = item2 == "-" ? 0 : item2;

                    if (oEvent.getParameters().sortOrder == "Ascending") {
                        if (item1 > item2) {
                            return 1;
                        } else if (item1 < item2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (item1 > item2) {
                            return -1;
                        } else if (item1 < item2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });

                newData.push(total);

                oTable.getModel().setData({ Data: newData });
                oTable.bindRows("/Data");
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20053024" });
                      // return new JSONModelHelper({name: "20090028"});
                  }
                : null
        });
    }
);
