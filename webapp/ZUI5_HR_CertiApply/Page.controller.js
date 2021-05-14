sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/EmployeeModel",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator"
    ],
    function (Common, CommonController, JSONModelHelper, EmployeeModel, MessageBox, BusyIndicator) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            TableModel: new JSONModelHelper(),
            ApplyModel: new JSONModelHelper(),
            LogModel: new JSONModelHelper(),
            EmployeeModel: new EmployeeModel(),

            g_ClickRow: "",

            getUserId: function () {
                return this.getSessionInfoByKey("name");
            },

            getUserGubun: function () {
                return this.getSessionInfoByKey("Bukrs2");
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
                var oView = $.app.byId("ZUI5_HR_CertiApply.Page");
                this._ApplyDialog = sap.ui.jsfragment("ZUI5_HR_CertiApply.fragment.Apply", this);
                oView.addDependent(this._ApplyDialog);
                this._DetailDialog = sap.ui.jsfragment("ZUI5_HR_CertiApply.fragment.DetailDialog", this);
                oView.addDependent(this._DetailDialog);

                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.IConType = "1";
                sendObject.ILangu = oController.getView().getModel("session").getData().Langu;
                sendObject.IMolga = oController.getView().getModel("session").getData().Molga;
                sendObject.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                sendObject.IEmpid = vPernr;
                // Navigation property
                sendObject.TableIn = [];
                sendObject.Export = [];

                oModel.create("/CertiAppSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.TableIn) {
                            var rDatas = oData.TableIn.results;
                            for (var i = 0; i < rDatas.length; i++) {
                                rDatas[i].Zcount = "" + rDatas[i].Zcount * 1;
                            }
                            oController.TableModel.setData({ Data: rDatas });
                        } else {
                            oController.TableModel.setData({ Data: [] });
                        }

                        Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            onChangeZformType: function () {
                var oController = $.app.getController();
                var ZformType = $.app.byId(oController.PAGEID + "_RadioGroup1").getSelectedIndex();
                var Aptyp = $.app.byId(oController.PAGEID + "_RadioGroup2").getSelectedIndex();
                if (ZformType == 0) oController.ApplyModel.setProperty("/Data/ZformType", "01");
                if (ZformType == 1) oController.ApplyModel.setProperty("/Data/ZformType", "02");
                if (ZformType == 2) oController.ApplyModel.setProperty("/Data/ZformType", "04");
                if (ZformType == 3) oController.ApplyModel.setProperty("/Data/ZformType", "05");
                // 구분이 경력 증명서 이면, 수령방법은 담당자 출력
                if (ZformType == 1) {
                    oController.ApplyModel.setProperty("/Data/Aptyp", "2");
                }
            },

            onChangeAptyp: function () {
                var oController = $.app.getController();
                var Aptyp = $.app.byId(oController.PAGEID + "_RadioGroup2").getSelectedIndex();
                if (Aptyp == 0) oController.ApplyModel.setProperty("/Data/Aptyp", "1");
                else if (Aptyp == 1) oController.ApplyModel.setProperty("/Data/Aptyp", "2");
                else if (Aptyp == 2) oController.ApplyModel.setProperty("/Data/Aptyp", "3");
                else oController.ApplyModel.setProperty("/Data/Aptyp", "");
            },

            onPressReq: function () {
                //신청
                var oController = $.app.getController();
                // 기본값 설정
                oController.ApplyModel.setData({ Data: { ZformType: "01", Aptyp: "1", Zlang: "1", Zcount: "1", Zyear: new Date().getFullYear() } });

                oController._ApplyDialog.open();
            },

            checkError: function () {
                var oController = $.app.getController();

                // 구분
                if (Common.checkNull(oController.ApplyModel.getProperty("/Data/ZformType"))) {
                    MessageBox.error(oController.getBundleText("MSG_65009"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 언어
                if (Common.checkNull(oController.ApplyModel.getProperty("/Data/Zlang"))) {
                    MessageBox.error(oController.getBundleText("MSG_65010"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 기준년도 , 미입력 시 올해 년도 세팅
                if (Common.checkNull(oController.ApplyModel.getProperty("/Data/Zyear"))) {
                    oController.ApplyModel.setProperty("/Data/Zyear", new Date().getFullYear());
                }

                  // 구분
                if (oController.ApplyModel.getProperty("/Data/ZformType") == "05" && 
                    oController.ApplyModel.getProperty("/Data/Zyear") * 1 < 2018 && 
                    oController.ApplyModel.getProperty("/Data/Aptyp")   != "1"  ) {
                    MessageBox.error(oController.getBundleText("MSG_65009"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }



                // 수량 , 미입력 시 1 기본 세팅
                if (Common.checkNull(oController.ApplyModel.getProperty("/Data/Zcount"))) {
                    oController.ApplyModel.setProperty("/Data/Zcount", "1");
                }

                // 수령방법
                if (Common.checkNull(oController.ApplyModel.getProperty("/Data/Aptyp"))) {
                    MessageBox.error(oController.getBundleText("MSG_65015"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }
                
                // 재발급시 재출력사유 필수 입력 
                if (oController.ApplyModel.getProperty("/Data/actmode") && 
                    oController.ApplyModel.getProperty("/Data/actmode") == "X" &&
                    Common.checkNull(oController.ApplyModel.getProperty("/Data/Reasn"))){
                    MessageBox.error(oController.getBundleText("MSG_65019"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                return false;
            },

            onDialogApplyBtn: function () {
                // 신청
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/Data");
                var vPrintData = {};
                oRowData.Pernr = vPernr;

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_38044")) {
                        // 신청

                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "2";
                        sendObject.ILangu = oController.getView().getModel("session").getData().Langu;
                        sendObject.IMolga = oController.getView().getModel("session").getData().Molga;
                        sendObject.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                        sendObject.IEmpid = vPernr;
                        sendObject.IReapp = oRowData.actmode == "X" ? "X" : "";
                        // Navigation property
                        delete oRowData.actmode;
                        oRowData.Zyear = "" + oRowData.Zyear;
                        sendObject.TableIn = [Common.copyByMetadata(oModel, "CertiAppTableIn", oRowData)];

                        oModel.create("/CertiAppSet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_38002"), { title: oController.getBundleText("MSG_08107") });
                                if (oData && oData.TableIn.results && oData.TableIn.results.length > 0) {
                                    Object.assign(vPrintData, oData.TableIn.results[0]);
                                    BusyIndicator.hide();
                                    oController._ApplyDialog.close();
                                    oController.onTableSearch();
                                }
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_38001"), {
                    title: oController.getBundleText("LABEL_65001"),
                    actions: [oController.getBundleText("LABEL_38044"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressApply
                });
            },

            onPressButton: function (oEvent) {
                // Row 의 Button 클릭
                var oController = $.app.getController();
                var vPath = oEvent.getSource().getBindingContext().sPath;
                var oRowData = oController.TableModel.getProperty(vPath);
                var oCopiedRow = $.extend(true, {}, oRowData);
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_PDF"),
                    vWidth = "1330px",
                    vHeight = "100%";
                oLayout.destroyContent();

                var onPrintPDF = function () {
                    var sendObject = {};
                    var tableIn = {};
                    tableIn.Pernr = oCopiedRow.Pernr;
                    tableIn.Subty = oCopiedRow.Subty;
                    tableIn.Objps = oCopiedRow.Objps;
                    tableIn.Sprps = oCopiedRow.Sprps;
                    tableIn.Seqnr = oCopiedRow.Seqnr;
                    tableIn.Begda = "/Date(" + Common.getTime(new Date(oCopiedRow.Begda)) + ")/";
                    tableIn.Endda = "/Date(" + Common.getTime(new Date(oCopiedRow.Endda)) + ")/";

                    // Header
                    sendObject.IUrlck = "X";
                    // Navigation property
                    sendObject.TableIn = [];
                    sendObject.TableIn.push(tableIn);
                    sendObject.Export = [];

                    oModel.create("/CertiPdfSet", sendObject, {
                        success: function (oData) {
                            if (oData && oData.Export && oData.Export.results.length > 0) {
                                var vZpdf = "data:application/pdf;base64," + oData.Export.results[0].EPdf;
                                oLayout.addContent(
                                    new sap.ui.core.HTML({
                                        content: ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + vZpdf + "' width='" + vWidth + "' height='" + vHeight + "' frameborder='0' border='0' scrolling='no'></>"],
                                        preferDOM: false
                                    })
                                );
                                oLayout.addDelegate({
                                    onAfterRendering: function () {
                                        var vHeight = document.getElementById("ZUI5_HR_CertiApply_DetailDialog").offsetHeight * 1 - 135 + "px";
                                        $("#iWorkerPDF").height(vHeight);
                                    }
                                });
                                oController._DetailDialog.open();
                                oController.onTableSearch();
                            }
                            BusyIndicator.hide();
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                            oController.onTableSearch();
                            BusyIndicator.hide();
                        }
                    });

                    BusyIndicator.hide();
                };

                var onPrintForm = function () {
                    var sendObject = {};
                    var tableIn = {};
                    // Navigation property
                    tableIn.Pernr = oCopiedRow.Pernr;
                    tableIn.Subty = oCopiedRow.Subty;
                    tableIn.Objps = oCopiedRow.Objps;
                    tableIn.Sprps = oCopiedRow.Sprps;
                    tableIn.Seqnr = oCopiedRow.Seqnr;
                    tableIn.Zyear = oCopiedRow.Zyear;
                    tableIn.ZformType = oCopiedRow.ZformType;
                    tableIn.Begda = "/Date(" + Common.getTime(new Date(oCopiedRow.Begda)) + ")/";
                    tableIn.Endda = "/Date(" + Common.getTime(new Date(oCopiedRow.Endda)) + ")/";

                    // Header
                    sendObject.IPnpesscf = "X";
                    sendObject.IPernr = oCopiedRow.Pernr;
                    sendObject.IBukrs = oController.getView().getModel("session").getData().Bukrs;
                    sendObject.IMolga = oCopiedRow.Molga;
                    sendObject.IEmpid = oController.getView().getModel("session").getData().Pernr;
                    sendObject.ILangu = oController.getView().getModel("session").getData().Langu;
                    sendObject.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                    
                    sendObject.TableIn = [];
                    sendObject.TableIn.push(tableIn);
                    sendObject.Export = [];

                    oModel.create("/CertiFormSet", sendObject, {
                        success: function (oData) {
                            if (oData && oData.Export && oData.Export.results.length > 0) {
                                // var vZpdf = "data:application/html;base64," + oData.Export.results[0].EPdfTable;
                                var vZpdf = oData.Export.results[0].EHtml;
                                oLayout.addContent(
                                    new sap.ui.core.HTML({
                                        content: ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + vZpdf + "' width='" + vWidth + "' height='" + vHeight + "' frameborder='0' border='0' scrolling='no'></>"],
                                        preferDOM: false
                                    })
                                );
                                oLayout.addDelegate({
                                    onAfterRendering: function () {
                                        var vHeight = document.getElementById("ZUI5_HR_CertiApply_DetailDialog").offsetHeight * 1 - 135 + "px";
                                        $("#iWorkerPDF").height(vHeight);
                                    }
                                });
                                oController._DetailDialog.open();
                                oController.onTableSearch();
                            }
                            BusyIndicator.hide();
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                            oController.onTableSearch();
                            BusyIndicator.hide();
                        }
                    });

                    BusyIndicator.hide();
                };

                if (oCopiedRow.Zstatus == "1") return;
                // 처리중
                else if (oCopiedRow.Zstatus == "2") {
                    // 재발급
                    // 기본값 설정
                    oCopiedRow.actmode = "X";
                    oController.ApplyModel.setData({ Data: oCopiedRow });
                    oController._ApplyDialog.open();
                } else if (oCopiedRow.Zstatus == "3") {
                    // 프린트
                    BusyIndicator.show(0);
                    // 원천징수 영수증 이며 2018년도 
                    if(oCopiedRow.ZformType == "05" && 1 * oCopiedRow.Zyear < 2018 ){
                        onPrintForm(oCopiedRow);
                    }else{
                        onPrintPDF(oCopiedRow);
                    }
                    
                }
            },

            onPressPrint: function (oRow) {
                // ESS 신청 성공 시 Print 호출
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_CERTI_SRV");
                var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_PDF"),
                    vWidth = "1330px",
                    vHeight = "100%";
                oLayout.destroyContent();

                var onPrintPDF = function () {
                    var sendObject = {};
                    var tableIn = {};
                    tableIn.Pernr = oRow.Pernr;
                    tableIn.Subty = oRow.Subty;
                    tableIn.Objps = oRow.Objps;
                    tableIn.Sprps = oRow.Sprps;
                    tableIn.Seqnr = oRow.Seqnr;
                    tableIn.Begda = "/Date(" + Common.getTime(new Date(oRow.Begda)) + ")/";
                    tableIn.Endda = "/Date(" + Common.getTime(new Date(oRow.Endda)) + ")/";

                    // Header
                    sendObject.IUrlck = "X";
                    // Navigation property
                    sendObject.TableIn = [];
                    sendObject.TableIn.push(tableIn);
                    sendObject.Export = [];

                    oModel.create("/CertiPdfSet", sendObject, {
                        success: function (oData) {
                            if (oData && oData.Export && oData.Export.results.length > 0) {
                                var vZpdf = "data:application/pdf;base64," + oData.Export.results[0].EPdf;
                                oLayout.addContent(
                                    new sap.ui.core.HTML({
                                        content: ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + vZpdf + "' width='" + vWidth + "' height='" + vHeight + "' frameborder='0' border='0' scrolling='no'></>"],
                                        preferDOM: false
                                    })
                                );
                                oLayout.addDelegate({
                                    onAfterRendering: function () {
                                        var vHeight = document.getElementById("ZUI5_HR_CertiApply_DetailDialog").offsetHeight * 1 - 135 + "px";
                                        $("#iWorkerPDF").height(vHeight);
                                    }
                                });
                                oController._DetailDialog.open();
                                oController.onTableSearch();
                            }
                            BusyIndicator.hide();
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                            sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                            oController.onTableSearch();
                            BusyIndicator.hide();
                        }
                    });

                    BusyIndicator.hide();
                };

                BusyIndicator.show(0);
                onPrintPDF();
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20140099" }); // 20190018 20063005 (기초) 35111238 35114489 35111012(첨단)
                  }
                : null
        });
    }
);
