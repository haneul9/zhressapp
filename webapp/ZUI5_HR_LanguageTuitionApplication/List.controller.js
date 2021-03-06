/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "fragment/COMMON_ATTACH_FILES"
    ],
    function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, FileHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "List",

            TableModel: new JSONModelHelper(),
            DetailModel: new JSONModelHelper(),
            GradeModel: new JSONModelHelper(),
            UploadFileModel: new JSONModelHelper(),
            TuitionSearchModel: new JSONModelHelper(),

            getUserId: function () {
                return this.getView().getModel("session").getData().name;
            },

            getUserGubun: function () {
                return this.getView().getModel("session").getData().Bukrs2;
            },

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
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.initDateCreate(this);
                this.onTableSearch();
            },

            getDateFormatter1: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        parts: [{ path: "Lecbe" }, { path: "Lecen" }],
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

            getDateFormatter2: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        parts: [{ path: "Supbg" }, { path: "Supen" }],
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
                            //??????????????? ????????????
                            text: "{StatusT}",
                            textAlign: "Center",
                            visible: {
                                path: "Status",
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
                                    //??????????????? Text
                                    text: "{StatusT}",
                                    textAlign: "Center"
                                }).addStyleClass("font-14px font-regular mt-7px"),
                                new sap.m.Button({
                                    //??????????????? ?????? ??????
                                    text: "{i18n>LABEL_29027}",
                                    press: oController.onPressCancel
                                }).addStyleClass("button-light-sm ml-10px")
                            ],
                            visible: {
                                path: "Status",
                                formatter: function (fVal) {
                                    if (fVal === "AA") return true;
                                    else return false;
                                }
                            }
                        })
                    ]
                });
            },

            initDateCreate: function (oController) {
                // ?????? ?????? ?????? ???????????????
                var vBukrs = oController.getUserGubun();

                oController.TuitionSearchModel.setData({
                    Data: { Zyear: "", Zmonth: "" },
                    Zyears: [],
                    Zmonths: [],
                    vBukrs: vBukrs
                });

                this.setTuitionZyears(this);
                this.setTuitionZmonths(this);
            },

            setTuitionZyears: function (oController) {
                var vZyear = new Date().getFullYear(),
                    vConvertYear = "",
                    aYears = [];

                vConvertYear = String(vZyear + 1);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "???" });

                Common.makeNumbersArray({ length: 11 }).forEach(function (idx) {
                    vConvertYear = String(vZyear - idx);
                    aYears.push({ Code: vConvertYear, Text: vConvertYear + "???" });
                });

                oController.TuitionSearchModel.setProperty("/Data/Zyear1", vZyear);
                oController.TuitionSearchModel.setProperty("/Zyears1", aYears);

                vZyear = new Date().getFullYear();
                vConvertYear = "";
                aYears = [];

                vConvertYear = String(vZyear + 1);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "???" });

                Common.makeNumbersArray({ length: 11 }).forEach(function (idx) {
                    vConvertYear = String(vZyear - idx);
                    aYears.push({ Code: vConvertYear, Text: vConvertYear + "???" });
                });

                oController.TuitionSearchModel.setProperty("/Data/Zyear2", vZyear);
                oController.TuitionSearchModel.setProperty("/Zyears2", aYears);
            },

            setTuitionZmonths: function (oController) {
                var vZmonth = new Date().getMonth() + 1,
                    vConvertMonth = "",
                    aMonths = [];

                Common.makeNumbersArray({ length: 12, isZeroStart: false }).forEach(function (idx) {
                    vConvertMonth = String(idx);
                    aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "???" });
                });

                oController.TuitionSearchModel.setProperty("/Data/Zmonth1", 1);
                oController.TuitionSearchModel.setProperty("/Zmonths1", aMonths);

                vZmonth = new Date().getMonth() + 1;
                vConvertMonth = "";
                aMonths = [];

                Common.makeNumbersArray({ length: 12, isZeroStart: false }).forEach(function (idx) {
                    vConvertMonth = String(idx);
                    aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "???" });
                });

                oController.TuitionSearchModel.setProperty("/Data/Zmonth2", vZmonth);
                oController.TuitionSearchModel.setProperty("/Zmonths2", aMonths);
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var vZyear1 = oController.TuitionSearchModel.getProperty("/Data/Zyear1");
                var vZyear2 = oController.TuitionSearchModel.getProperty("/Data/Zyear2");
                var vMonth1 = oController.TuitionSearchModel.getProperty("/Data/Zmonth1");
                var vMonth2 = oController.TuitionSearchModel.getProperty("/Data/Zmonth2");

                var bDate = new Date(vZyear1, vMonth1 - 1, 1);
                var eDate = new Date(vZyear2, vMonth2, 0);

                oController.TableModel.setData({ Data: [] }); //??????????????? ?????? ???????????? ???????????? ??????

                oTable.setBusyIndicatorDelay(0).setBusy(true);

                setTimeout(function() {
                    var sendObject = {};
                    // Header
                    sendObject.IPernr = vPernr;
                    sendObject.IEmpid = vPernr;
                    sendObject.IConType = "1";
                    sendObject.IBegda = new Date(bDate.setDate(bDate.getDate() + 1));
                    sendObject.IEndda = new Date(eDate.setDate(eDate.getDate() + 1));
                    sendObject.IBukrs = vBukrs2;
                    // Navigation property
                    sendObject.LanguPayApplyExport = [];
                    sendObject.LanguPayApplyTableIn = [];
                    sendObject.LanguPayApplyTableIn3 = [];

                    oModel.create("/LanguPayApplySet", sendObject, {
                        success: function (oData) {
                            if (oData && oData.LanguPayApplyTableIn) {
                                //?????? ????????? ?????? ?????? ???
                                Common.log(oData);
                                var rDatas1 = oData.LanguPayApplyTableIn.results;
                                oController.TableModel.setData({ Data: rDatas1 }); //??????????????? ?????? ???????????? ???????????? ??????
                            }

                            oController.TuitionSearchModel.setProperty("/ExportData", oData.LanguPayApplyExport.results[0]);
                            oController.UploadFileModel.setProperty("/FileData", oData.LanguPayApplyTableIn3.results);
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });

                    Common.adjustAutoVisibleRowCount.call(oTable);

                    oTable.setBusy(false);
                }, 100);
            },

            onSelectedRow: function (oEvent) {
                // Row??????
                var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
                    oController = $.app.getController();
                var oPath = oEvent.mParameters.rowBindingContext.getPath();
                var oRowData = oController.TableModel.getProperty(oPath);

                var oCopyRow = $.extend(true, oRowData, {
					Lecbet: Common.numberWithCommas(oRowData.Lecbet)
				});

                if (!oController._ApplyModel) {
                    oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionApply", oController);
                    oView.addDependent(oController._ApplyModel);
                }
				
				$.app.byId(oController.PAGEID + "_PeriodDate").setEditable(false);
				oController.DetailModel.setProperty("/FormData", oCopyRow);

				oController._ApplyModel.open();
			},
			
			onAfterApply: function() {
				this._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);

				setTimeout(function() {
					this.getComboData();
					this.onBeforeOpenDetailDialog();
					
					this._ApplyModel.setBusy(false);
				}.bind(this), 100);
			},

            onPressCancel: function (oEvent) {
                // Row??????
                var oController = $.app.getController();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oPath = oEvent.getSource().oParent.oParent.oParent.oBindingContexts.undefined.getPath();
                var oRowData = oController.TableModel.getProperty(oPath);

                BusyIndicator.show(0);
                var onProcessApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_29027")) {
                        //??????
                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "4";
                        sendObject.IBukrs = vBukrs2;
                        // Navigation property
                        sendObject.LanguPayApplyExport = [];
                        sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oRowData)];
                        sendObject.LanguPayApplyTableIn3 = [];

                        oModel.create("/LanguPayApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                MessageBox.alert(oController.getBundleText("MSG_29006"), { title: oController.getBundleText("MSG_08107") });
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                                MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                MessageBox.confirm(oController.getBundleText("MSG_29005"), {
                    title: oController.getBundleText("LABEL_29001"),
                    actions: [oController.getBundleText("LABEL_29027"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessApply
                });
            },

            onPressMenuBtn: function () {
                // ????????? (????????? ?????? ????????????)
                window.open("./ZUI5_HR_LanguageTuitionApplication/manual/LCC_FOREIGNLANG_MANUAL2.pptx");
            },

            onPressReqBtn: function () {
                // ??????
                var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
                    oController = $.app.getController();

                oController.DetailModel.setProperty("/FormData", {});
                oController.DetailModel.setProperty("/FormData/IsNew", "X");
                oController.DetailModel.setProperty("/FormData/Kostl", "");
                oController.DetailModel.setProperty("/FormData/Suport", oController.TuitionSearchModel.getProperty("/ExportData/EPay"));

                if (!oController._ApplyModel) {
                    oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionApply", oController);
                    oView.addDependent(oController._ApplyModel);
                }

                var oPeriodDate = $.app.byId(oController.PAGEID + "_PeriodDate");
                oPeriodDate.setEditable(true);

                oController._ApplyModel.open();
            },

            getComboData: function () {
                var oController = $.app.getController();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
				var sendObject = {};

				if(!oController.DetailModel.getProperty("/CostCombo")) {
					oController.DetailModel.setProperty("/CostCombo", []);

					// Header
					sendObject.IPernr = vPernr;
					sendObject.ICodeT = "998";
					sendObject.IBukrs = vBukrs2;
					sendObject.ICodty = "16";
					sendObject.ILangu = "3";
					// Navigation property
					sendObject.NavCommonCodeList = [];
	
					oCommonModel.create("/CommonCodeListHeaderSet", sendObject, {
						// ????????????
						success: function (oData) {
							if (oData && oData.NavCommonCodeList) {
								oController.DetailModel.setProperty("/CostCombo", oData.NavCommonCodeList.results);
								oController.DetailModel.setProperty("/FormData/Kostl", oData.NavCommonCodeList.results[0].Code);
							}
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});
				} else {
                    if(oController.DetailModel.getProperty("/FormData/IsNew") === "X") {
                        oController.DetailModel.setProperty("/FormData/Kostl", (oController.DetailModel.getProperty("/CostCombo")[0] || {}).Code);
                    }
				}

				if(!oController.DetailModel.getProperty("/WBSCombo")) {
					oController.DetailModel.setProperty("/WBSCombo", []);

					sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.ICodeT = "998";
					sendObject.IBukrs = vBukrs2;
					sendObject.ICodty = "17";
					sendObject.ILangu = "3";
					// Navigation property
					sendObject.NavCommonCodeList = [];
	
					oCommonModel.create("/CommonCodeListHeaderSet", sendObject, {
						// WBS
						success: function (oData) {
							if (oData && oData.NavCommonCodeList) {
								oController.DetailModel.setProperty("/WBSCombo", oData.NavCommonCodeList.results);
								oController.DetailModel.setProperty("/FormData/Plstx", oData.NavCommonCodeList.results[0].Code);
							}
						},
						error: function (oResponse) {
							Common.log(oResponse);
						}
					});
				} else {
                    if(oController.DetailModel.getProperty("/FormData/IsNew") === "X") {
                        oController.DetailModel.setProperty("/FormData/Plstx", (oController.DetailModel.getProperty("/WBSCombo")[0] || {}).Code);
                    }
				}
            },

            getSupPeriod: function () {
                // ??????????????? ?????????
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();

                var oSendDate = {};
                oSendDate.Lecbe = moment(oController.DetailModel.getProperty("/FormData/Lecbe")).hours(10).toDate();
                oSendDate.Lecen = moment(oController.DetailModel.getProperty("/FormData/Lecen")).hours(10).toDate();

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlangu"))) return;

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IConType = "5";
                sendObject.IZlangu = oController.DetailModel.getProperty("/FormData/Zlangu");
                // Navigation property
                sendObject.LanguPayApplyExport = [];
                sendObject.LanguPayApplyTableIn = [oSendDate];

                oModel.create("/LanguPayApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.LanguPayApplyExport) {
                            //?????? ????????? ?????? ?????? ???
                            Common.log(oData);
                            oController.DetailModel.setProperty("/FormData/Supbg", oData.LanguPayApplyExport.results[0].ESupbg);
                            oController.DetailModel.setProperty("/FormData/Supen", oData.LanguPayApplyExport.results[0].ESupen);
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            getSuportPrice: function (oEvent) {
                //???????????? Change
                var oController = $.app.getController();
                var inputValue = oEvent.getParameter("value").trim(),
                    convertValue = inputValue.replace(/[^\d]/g, "");

                //oController.DetailModel.setProperty("/FormData/Lecbet", convertValue);
                oEvent.getSource().setValue(Common.numberWithCommas(convertValue));

                var vClassPay = Number(oController.DetailModel.getProperty("/FormData/Lecbet").replace(/,/g, "")); // ????????????
                var vPay = Number(oController.TuitionSearchModel.getProperty("/ExportData/EPay")); // ????????? ????????????

                if (vClassPay > vPay || vClassPay === 0) oController.DetailModel.setProperty("/FormData/Suport", String(vPay));
                else oController.DetailModel.setProperty("/FormData/Suport", String(vClassPay));
            },

            ErrorCheck: function () {
                var oController = $.app.getController();
                var oCostCombo = $.app.byId(oController.PAGEID + "_CostCombo");
                var oWBSCombo = $.app.byId(oController.PAGEID + "_WBSCombo");

                if (Common.checkNull(oCostCombo.getSelectedKey()) && Common.checkNull(oWBSCombo.getSelectedKey())) {
                    MessageBox.error(oController.getBundleText("MSG_29007"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecen"))) {
                    MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlaorg"))) {
                    MessageBox.error(oController.getBundleText("MSG_29010"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Latell"))) {
                    MessageBox.error(oController.getBundleText("MSG_29011"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Caldt"))) {
                    MessageBox.error(oController.getBundleText("MSG_29013"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbet"))) {
                    MessageBox.error(oController.getBundleText("MSG_29015"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (FileHandler.getFileLength(oController, "001") === 0) {
                    MessageBox.error(oController.getBundleText("MSG_29017"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (FileHandler.getFileLength(oController, "002") === 0) {
                    MessageBox.error(oController.getBundleText("MSG_29021"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                return false;
            },

            onDialogSearchBtn: function () {
                //Dialog ???????????? ??????
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oGradeTable = $.app.byId(oController.PAGEID + "_GradeTable");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var vZlangu = oController.GradeModel.getProperty("/Data/Zlangu");
                var vZltype = oController.GradeModel.getProperty("/Data/Zltype");
                var vITepas = oController.GradeModel.getProperty("/Data/ITepas");

                oController.GradeModel.setProperty("/TableData", []);
                oController._GradeModel.setBusyIndicatorDelay(0).setBusy(true);

                setTimeout(function() {
                    var sendObject = {};
                    // Header
                    sendObject.IPernr = vPernr;
                    sendObject.IBukrs = vBukrs2;
                    sendObject.IZlangu = vZlangu === "ALL" ? "" : vZlangu;
                    sendObject.IZltype = vZltype === "ALL" ? "" : vZltype;
                    sendObject.ITepas = vITepas === "ALL" ? "" : vITepas;
                    // Navigation property
                    sendObject.LanguScoreTableIn = [];

                    oModel.create("/LanguScoreImportSet", sendObject, {
                        success: function (oData) {
                            var rDatas1;

                            if (oData && oData.LanguScoreTableIn) {
                                rDatas1 = oData.LanguScoreTableIn.results;

                                oController.GradeModel.setProperty("/TableData", rDatas1);
                            }

                            Common.adjustVisibleRowCount(oGradeTable, 10, rDatas1.length);
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });

                    oController._GradeModel.setBusy(false);
                }, 100);
            },

            onGradeVal: function () {
                // Dialog ????????????
                var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
                    oController = $.app.getController();

                oController.GradeModel.setProperty("/TableData", []);

                if (Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbe"))) {
                    MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107") });
                    return;
                }

                if (!oController._GradeModel) {
                    oController._GradeModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionSearch", oController);
                    oView.addDependent(oController._GradeModel);
                }

                oController._GradeModel.open();
            },

            onAfterSearchDialog: function() {
                this._GradeModel.setBusyIndicatorDelay(0).setBusy(true);

				setTimeout(function() {
					var oGradeTable = $.app.byId(this.PAGEID + "_GradeTable");
                    var sendObject = {
                        IPernr: this.getUserId(),
                        LanguScoreTableIn: []
                    };

                    $.app.getModel("ZHR_BENEFIT_SRV").create("/LanguScoreImportSet", sendObject, {
                        success: function (oData) {
                            var rDatas1;

                            if (oData && oData.LanguScoreTableIn) {
                                rDatas1 = oData.LanguScoreTableIn.results;

                                this.GradeModel.setProperty("/TableData", rDatas1);
                                this.onDialogCode();
                            }

                            Common.adjustVisibleRowCount(oGradeTable, 10, rDatas1.length);
                        }.bind(this),
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: this.getBundleText("LABEL_09030")
                            });
                        }.bind(this)
                    });
					
					this._GradeModel.setBusy(false);
				}.bind(this), 100);
            },

            onSelectedGradeRow: function (oEvent) {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oPath = oEvent.mParameters.rowBindingContext.getPath();
                var vZyear1 = oController.TuitionSearchModel.getProperty("/Data/Zyear1");
                var vZyear2 = oController.TuitionSearchModel.getProperty("/Data/Zyear2");
                var vMonth1 = oController.TuitionSearchModel.getProperty("/Data/Zmonth1");
                var vMonth2 = oController.TuitionSearchModel.getProperty("/Data/Zmonth2");

                var bDate = new Date(vZyear1, vMonth1 - 1, 1);
                var eDate = new Date(vZyear2, vMonth2, 0);

                if (oController.GradeModel.getProperty(oPath).Targetc === "N") return;

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IEmpid = vPernr;
                sendObject.IConType = "7";
                sendObject.IBegda = new Date(bDate.setDate(bDate.getDate() + 1));
                sendObject.IEndda = new Date(eDate.setDate(eDate.getDate() + 1));
                sendObject.IBukrs = vBukrs2;
                // Navigation property
                sendObject.LanguPayApplyTableIn = [];
                sendObject.LanguPayApplyTableIn4 = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn4", oController.GradeModel.getProperty(oPath))];

                oModel.create("/LanguPayApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.LanguPayApplyTableIn) {
                            //?????? ????????? ?????? ?????? ???
                            Common.log(oData);
                            oController.DetailModel.setProperty("/FormData/ZlanguTxt", oData.LanguPayApplyTableIn.results[0].ZlanguTxt);
                            oController.DetailModel.setProperty("/FormData/Zlangu", oData.LanguPayApplyTableIn.results[0].Zlangu);
                            oController.DetailModel.setProperty("/FormData/Zlangu2Txt", oData.LanguPayApplyTableIn.results[0].ZlanguTxt);
                            oController.DetailModel.setProperty("/FormData/Zlangu2", oData.LanguPayApplyTableIn.results[0].Zlangu);
                            oController.DetailModel.setProperty("/FormData/ZltypeTxt", oData.LanguPayApplyTableIn.results[0].ZltypeTxt);
                            oController.DetailModel.setProperty("/FormData/Zltype", oData.LanguPayApplyTableIn.results[0].Zltype);
                            oController.DetailModel.setProperty("/FormData/Acqpot", oData.LanguPayApplyTableIn.results[0].Acqpot ? oData.LanguPayApplyTableIn.results[0].Acqpot : "");
                            oController.DetailModel.setProperty("/FormData/AcqgrdT", oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt ? oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt : "");
                            oController.DetailModel.setProperty("/FormData/Acqgrd", oData.LanguPayApplyTableIn.results[0].Acqgrd ? oData.LanguPayApplyTableIn.results[0].Acqgrd : "");
                            oController.getSupPeriod();
                            oController._GradeModel.close();
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            onDialogCode: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");

                oController.GradeModel.setProperty("/Data", { Zlangu: "ALL", Zltype: "ALL", ITepas: "ALL" });
                oController.GradeModel.setProperty("/TestCombo", [{ Code: "ALL", Text: oController.getBundleText("LABEL_29043") }]);

                if(!oController.GradeModel.getProperty("/CompleteCombo")) {
                    var sendObject = {};
                    // Header
                    sendObject.IPernr = vPernr;
                    sendObject.ICodeT = "004";
                    sendObject.IBukrs = vBukrs2;
                    sendObject.ICodty = "ZHRD_TEPAS";
                    sendObject.ILangu = "3";
                    // Navigation property
                    sendObject.NavCommonCodeList = [];
    
                    oCommonModel.create("/CommonCodeListHeaderSet", sendObject, {
                        // ????????????
                        success: function (oData) {
                            if (oData && oData.NavCommonCodeList) {
                                oData.NavCommonCodeList.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_29043") });
                                oController.GradeModel.setProperty("/CompleteCombo", oData.NavCommonCodeList.results);
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });
                }

                if(!oController.GradeModel.getProperty("/LanguCombo")) {
                    sendObject = {};
                    // Header
                    sendObject.IPernr = vPernr;
                    sendObject.ICodeT = "1";
                    // Navigation property
                    sendObject.LanguPayApplyF4TableIn = [];
    
                    oModel.create("/LanguPayApplyF4ImportSet", sendObject, {
                        // ????????????
                        success: function (oData) {
                            if (oData && oData.LanguPayApplyF4TableIn) {
                                oData.LanguPayApplyF4TableIn.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_29043") });
                                oController.GradeModel.setProperty("/LanguCombo", oData.LanguPayApplyF4TableIn.results);
    
                                oController.GradeModel.setProperty("/Data/Zlangu", "ALL");
                                oController.GradeModel.setProperty("/Data/Zltype", "ALL");
                                oController.GradeModel.setProperty("/Data/ITepas", "ALL");
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });
                }
            },

            onDialogGubun: function () {
                // Dialog ????????????
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oControExam = $.app.byId("List_ExamCombo");
                var vPernr = oController.getUserId();

                oControExam.setBusyIndicatorDelay(0).setBusy(true);

                setTimeout(function() {

                    oModel.create("/LanguPayApplyF4ImportSet", {
                        IPernr: vPernr,
                        ICodeT: "2",
                        ICode: oController.GradeModel.getProperty("/Data/Zlangu"),
                        LanguPayApplyF4TableIn: []
                    }, {
                        success: function (oData) {
                            if (oData && oData.LanguPayApplyF4TableIn) {
                                oController.GradeModel.setProperty("/TestCombo", oData.LanguPayApplyF4TableIn.results);
                                oController.GradeModel.getProperty("/TestCombo").unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_29043") });
                                oController.GradeModel.setProperty("/TestCombo", oController.GradeModel.getProperty("/TestCombo"));
                                oController.GradeModel.setProperty("/Data/Zltype", "ALL");
                            }
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });

                    oControExam.setBusy(false);
                }, 100);
            },

            onDialogApplyBtn: function () {
                // Dialog ??????
                var oController = $.app.getController();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController.DetailModel.getProperty("/FormData");

                if (oController.ErrorCheck()) return;

                oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
                oSendData.Waers = "KRW";

                BusyIndicator.show(0);
                var onProcessApply = function (fVal) {
                    //?????? ????????? ???????????? ?????????
                    if (fVal && fVal == oController.getBundleText("LABEL_29044")) {
                        //??????

                        // ???????????? ??????
                        var uFiles = [];
                        for (var i = 1; i < 3; i++) uFiles.push("00" + i);

                        oSendData.Appnm = FileHandler.uploadFiles.call(oController, uFiles);

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "3";
                        sendObject.IBukrs = vBukrs2;
                        // Navigation property
                        sendObject.LanguPayApplyTableIn = [
                            $.extend(true, Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData), {
                                Lecen: new Date(oController.DetailModel.getProperty("/FormData/Lecen"))
                            })
                        ];

                        oModel.create("/LanguPayApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
                                Common.log(oData);
                                MessageBox.alert(oController.getBundleText("MSG_29019"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._ApplyModel.close();
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                                MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                MessageBox.confirm(oController.getBundleText("MSG_29018"), {
                    title: oController.getBundleText("LABEL_29001"),
                    actions: [oController.getBundleText("LABEL_29044"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessApply
                });
            },

            onDialogSaveBtn: function () {
                // Dialog ??????
                var oController = $.app.getController();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController.DetailModel.getProperty("/FormData");

                if (oController.ErrorCheck()) return;

                oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    //?????? ????????? ???????????? ?????????
                    if (fVal && fVal == oController.getBundleText("LABEL_29026")) {
                        //??????

                        // ???????????? ??????
                        var uFiles = [];
                        for (var i = 1; i < 3; i++) uFiles.push("00" + i);

                        oSendData.Appnm = FileHandler.uploadFiles.call(oController, uFiles);

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "2";
                        sendObject.IBukrs = vBukrs2;
                        // Navigation property
                        sendObject.LanguPayApplyExport = [];
                        sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)];
                        sendObject.LanguPayApplyTableIn3 = [];

                        oModel.create("/LanguPayApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
                                Common.log(oData);
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                MessageBox.alert(oController.getBundleText("MSG_29004"), { title: oController.getBundleText("MSG_08107") });
                                oController._ApplyModel.close();
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                                MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                MessageBox.confirm(oController.getBundleText("MSG_29003"), {
                    title: oController.getBundleText("LABEL_29001"),
                    actions: [oController.getBundleText("LABEL_29026"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessSave
                });
            },

            onDialogDelBtn: function () {
                // Dialog ??????
                var oController = $.app.getController();
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oSendData = oController.DetailModel.getProperty("/FormData");

                oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");

                BusyIndicator.show(0);
                var onProcessDelete = function (fVal) {
                    //?????? ????????? ???????????? ?????????
                    if (fVal && fVal == oController.getBundleText("LABEL_29027")) {
                        // ??????

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IConType = "4";
                        sendObject.IBukrs = vBukrs2;
                        // Navigation property
                        sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)];

                        oModel.create("/LanguPayApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                MessageBox.alert(oController.getBundleText("MSG_29006"), { title: oController.getBundleText("MSG_08107") });
                                oController._ApplyModel.close();
                            },
                            error: function (oResponse) {
                                Common.log(oResponse);
                                MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                                BusyIndicator.hide();
                            }
                        });
                    }
                    BusyIndicator.hide();
                };

                MessageBox.confirm(oController.getBundleText("MSG_29005"), {
                    title: oController.getBundleText("LABEL_29001"),
                    actions: [oController.getBundleText("LABEL_29027"), oController.getBundleText("LABEL_00119")],
                    onClose: onProcessDelete
                });
            },

            onBeforeOpenDetailDialog: function () {
				var oController = $.app.getController();
				var oFilePanel = $.app.byId("filePanel");
                var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
					vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";
					
				oFilePanel.setBusyIndicatorDelay(0).setBusy(true);

				setTimeout(function() {
					FileHandler.once.call(oController, vAppnm).then(function() {
						Promise.all([
							Common.getPromise(function() {
								FileHandler.setAttachFile(oController, {
									// ?????????
									Label: oController.getBundleText("LABEL_29020"),
									Required: true,
									Appnm: vAppnm,
									Mode: "S",
									UseMultiCategories: true,
									ReadAsync: true,
									Editable: !vStatus || vStatus === "AA" ? true : false
								}, "001");
							}),
							Common.getPromise(function() {
								FileHandler.setAttachFile(oController, {
									// ???????????????
									Label: oController.getBundleText("LABEL_29021"),
									Required: true,
									Appnm: vAppnm,
									Mode: "S",
									UseMultiCategories: true,
									ReadAsync: true,
									Editable: !vStatus || vStatus === "AA" ? true : false
								}, "002");
							})
						]).then(function() {
							oFilePanel.setBusy(false);
						});
					});
				}, 100);
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35117216" }); // 20075008 35117216
                  }
                : null
        });
    }
);
