sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/EmployeeModel",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModelHelper, EmployeeModel, MessageBox) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "ManagerPage",

            TableModel: new JSONModelHelper(),
            DetailModel: new JSONModelHelper(),
            EmployeeModel: new EmployeeModel(),

            getUserId: function () {
                return this.getView().getModel("session").getData().name;
            },

            getUserGubun: function () {
                return this.getView().getModel("session").getData().Bukrs;
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
                var oController = this.getView().getController();
                var oApplyDate = sap.ui.getCore().byId(oController.PAGEID + "_ApplyDate");

                oApplyDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));

                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.onTableSearch();
            },

            getStatusTxt: function () {
                var oController = $.app.getController();

                return new sap.m.FlexBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.commons.TextView({
                            //반려사유
                            text: {
                                path: "Status1",
                                formatter: function (v) {
                                    var vText = "";
                                    switch (v) {
                                        // 신청
                                        case "00":
                                            vText = oController.getBundleText("LABEL_23011");
                                            break;
                                        // 반려
                                        case "88":
                                            vText = oController.getBundleText("LABEL_23023");
                                            break;
                                        // 담당자확인
                                        case "90":
                                            vText = oController.getBundleText("LABEL_23024");
                                            break;
                                        // 저장
                                        case "AA":
                                            vText = oController.getBundleText("LABEL_23012");
                                            break;
                                        // 승인
                                        case "99":
                                            vText = oController.getBundleText("LABEL_23025");
                                            break;
                                    }
                                    return vText;
                                }
                            },
                            textAlign: "Center",
                            visible: {
                                path: "UrlA1",
                                formatter: function (v) {
                                    if (!v) return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("font-14px font-regular mt-8px"),
                        new sap.m.FormattedText({
                            htmlText: {
                                parts: [{ path: "UrlA1" }, { path: "Status1" }],
                                formatter: function (v1, v2) {
                                    if (v2 === "99") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23025") + "</a>";
                                    if (v2 === "00") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23011") + "</a>";
                                    if (v2 === "90") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23024") + "</a>";
                                    if (v2 === "88") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23023") + "</a>";
                                }
                            },
                            visible: {
                                path: "UrlA1",
                                formatter: function (v) {
                                    if (v) return true;
                                    else return false;
                                }
                            }
                        })
                    ]
                });
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oApplyDate = $.app.byId(oController.PAGEID + "_ApplyDate");
                var oEnameInput = $.app.byId(oController.PAGEID + "_EnameInput");
                var vDate1 = oApplyDate.mProperties.dateValue;
                var vDate2 = oApplyDate.mProperties.secondDateValue;

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs2;
                sendObject.IGubun = "X";
                sendObject.IBegda = new Date(vDate1.setDate(vDate1.getDate() + 1));
                sendObject.IEndda = new Date(vDate2.setDate(vDate2.getDate() + 1));
                sendObject.IEname = Common.checkNull(oEnameInput.getValue()) ? "" : oEnameInput.getValue();
                // Navigation property
                sendObject.RegalsealExport = [];
                sendObject.RegalsealTableIn1 = [];

                oModel.create("/RegalsealImportSet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.RegalsealTableIn1) {
                            //값을 제대로 받아 왔을 때
                            Common.log(oData);
                            oController.TableModel.setData({ Data: oData.RegalsealTableIn1.results }); //직접적으로 화면 테이블에 셋팅하는 작업
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        if (oResponse.response.statusCode !== 400) {
                            MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    }
				});
				
				Common.adjustAutoVisibleRowCount.call(oTable);
            },

            onPressSer: function () {
                //조회
                var oController = $.app.getController();

                oController.onTableSearch();
            },

            onSelectedRow: function (oEvent) {
                var oView = $.app.byId("ZUI5_HR_SealManagement_Manager.ManagerPage");
                var oController = $.app.getController();
                var vPath = oEvent.getParameters().rowBindingContext.getPath();
                var oRowData = oController.TableModel.getProperty(vPath);
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                oController.EmployeeModel.retrieve(oRowData.Pernr);

                if (oEvent.mParameters.columnIndex === "6" && Common.checkNull(!oRowData.UrlA1)) return;

                oController.DetailModel.setData({ Data: [] });

                if (!oController._DetailModel) {
                    oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_SealManagement_Manager.fragment.ManagerApply", oController);
                    oView.addDependent(oController._DetailModel);
                }

                var sendObject = {};
                // Header
                sendObject.IPernr = oRowData.Pernr;
                sendObject.IEmpid = vPernr;
                sendObject.ISeqnr = oRowData.Seqnr;
                sendObject.IConType = "1";
                sendObject.IDatum = oRowData.Appdt;
                // Navigation property
                sendObject.RegalsealRExport = [];
                sendObject.RegalsealRTableIn1 = [];

                oModel.create("/RegalsealRImportSet", sendObject, {
                    success: function (oData) {
                        Common.log(oData);
                        if (oData && oData.RegalsealRTableIn1) {
                            oController.DetailModel.setData({ Data: oData.RegalsealRTableIn1.results[0] });
                            oController._DetailModel.open();
                        }
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });

                sendObject = {};
                // Header
                sendObject.IConType = "0";
                // Navigation property
                sendObject.RegalsealRExport = [];
                sendObject.RegalsealRTableIn2 = [];
                sendObject.RegalsealRTableIn3 = [];

                oModel.create("/RegalsealRImportSet", sendObject, {
                    success: function (oData) {
                        Common.log(oData);
                        oController.DetailModel.setProperty("/IMG", oData.RegalsealRTableIn2.results);
                        oController.DetailModel.setProperty("/UseMultiBox", oData.RegalsealRTableIn3.results);
                        oController.getIMGCode(oRowData);
                        oController._DetailModel.open();
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            getIMGCode: function (rowData) {
                var oController = $.app.getController();

                oController.DetailModel.setProperty("/ImgCode", "");

                oController.DetailModel.getProperty("/IMG").some(function (e) {
                    oController.DetailModel.setProperty("/ImgCode", e.Imgid);
                    return e.Sitxt === rowData.Sitxt;
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35117893" }); // 35117893
                  }
                : null
        });
    }
);
