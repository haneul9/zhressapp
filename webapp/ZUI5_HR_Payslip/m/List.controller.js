/* global moment:true */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    function (Common, CommonController, JSONModel, MessageBox) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "MList",
            _ListCondJSonModel: new JSONModel(),
            _ListJSonModel: new JSONModel(),
            _DetailJSonModel: new JSONModel(),

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
                var oController = $.app.getController(),
                    curDate = new Date(),
                    vYear = [
                        { Code: "" + curDate.getFullYear(), Text: curDate.getFullYear() },
                        { Code: "" + curDate.getFullYear() - 1, Text: curDate.getFullYear() - 1 },
                        { Code: "" + curDate.getFullYear() - 2, Text: curDate.getFullYear() - 2 }
                    ],
                    vPernr = this.getSessionInfoByKey("Pernr"),
                    vMonth = [];
				
				for (var i = 1; i <= 12; i++) {
                    vMonth.push({ Code: "" + i, Text: "" + i });
                }
				
				oController._DetailJSonModel.setProperty("/Month", vMonth);
                oController._DetailJSonModel.setProperty("/Year", vYear);
                oController._DetailJSonModel.setProperty("/Data", { Year: "" + curDate.getFullYear(), Month: "" + (curDate.getMonth() + 1), Pernr: vPernr, Langu: this.getSessionInfoByKey("Langu"), Bukrs: this.getSessionInfoByKey("Bukrs") });
            },

            onAfterShow: function () {},

            getOcrsnList: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vCondiData = oController._DetailJSonModel.getProperty("/Data");
                var vData = { Data: [] };
                var oPath = "";
                var createData = { PayreasonNav: [] };

                var oSeqnr = $.app.byId(oController.PAGEID+"_Seqnr");
                oSeqnr.setValue("");

                oPath = "/PayreasonPeSet";
                createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                createData.IYear = vCondiData.Year && vCondiData.Year != "" ? vCondiData.Year : "";
                createData.IMonth = vCondiData.Month && vCondiData.Month != "" ? vCondiData.Month : "";
                createData.ILangu = vCondiData.Langu && vCondiData.Langu != "" ? vCondiData.Langu : "";
                createData.IBukrs = vCondiData.Bukrs && vCondiData.Bukrs != "" ? vCondiData.Bukrs : "";

                oModel.create(
                    oPath,
                    createData,
                    null,
                    function (data) {
                        if (data) {
                            if (data.PayreasonNav && data.PayreasonNav.results.length > 0) {
                                for (var i = 0; i < data.PayreasonNav.results.length; i++) {
                                    vData.Data.push(data.PayreasonNav.results[i]);
                                }
                                oController._DetailJSonModel.setProperty("/Data/Seqnr", data.PayreasonNav.results[0].Seqnr);
                            }else{
                                oController._DetailJSonModel.setProperty("/Data/Seqnr", ""); 
                            }
                        }else{
                            oController._DetailJSonModel.setProperty("/Data/Seqnr", "");
                        }
                    },
                    function (oError) {
                        var Err = {};
                        oController.Error = "E";
                        oController._DetailJSonModel.setProperty("/Data/Seqnr", "");
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

                oController._DetailJSonModel.setProperty("/Ocrsn", vData.Data);
            
                if (oController.Error == "E") {
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
            },

            onPressSearchDetail: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vCondiData = oController._DetailJSonModel.getProperty("/Data"),
                    vData = {},
                    oMoney1Layout = sap.ui.getCore().byId(oController.PAGEID + "_Money1Layout"),
                    oMoney2Layout = sap.ui.getCore().byId(oController.PAGEID + "_Money2Layout"),
                    oMoney3Layout = sap.ui.getCore().byId(oController.PAGEID + "_Money3Layout"),
                    oMoney4Layout = sap.ui.getCore().byId(oController.PAGEID + "_Money4Layout");
                                    
                oController._DetailJSonModel.setProperty("/Data/visibleYn", "");
                oMoney1Layout.destroyItems();
                oMoney2Layout.destroyItems();
                oMoney3Layout.destroyItems();
                oMoney4Layout.destroyItems();

                if (!vCondiData.Seqnr || vCondiData.Seqnr == "") {
                    // 조회조건을 모두 입력하시기 바랍니다.
                    MessageBox.error(oController.getBundleText("MSG_54001"));
                    return;
                }

                var search = function () {
                    var oPath = "";
                    var createData = { PayslipForm1Nav: [], PayslipForm2Nav: [], PayslipForm3Nav: [], PayslipForm4Nav: [] };

                    oPath = "/PayslipFormSet";
                    createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                    createData.ISeqnr = vCondiData.Seqnr && vCondiData.Seqnr != "" ? vCondiData.Seqnr : "";

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                vData = data;
                                oMoney1Layout.addItem(
                                    new sap.m.HBox({
                                        height: "55px",
                                        alignItems: sap.m.FlexAlignItems.Center,
                                        items: [
                                            new sap.m.Label({ width: "100%", text: oController.getBundleText("LABEL_54006"), textAlign: "Left" }).addStyleClass("sub-title"),
                                            new sap.m.Label({
                                                textAlign: "End",
                                                width: "100%",
                                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                text: "{Bet01}"
                                            }).addStyleClass("font-16px font-medium")
                                        ]
                                    })
                                        .addStyleClass("sub-con-titleBar-both")
                                        .setModel(oController._DetailJSonModel)
                                        .bindElement("/Data")
                                );

                                oMoney2Layout.addItem(
                                    new sap.m.HBox({
                                        height: "55px",
                                        alignItems: sap.m.FlexAlignItems.Center,
                                        items: [
                                            new sap.m.Label({ width: "100%", text: oController.getBundleText("LABEL_54007"), textAlign: "Left" }).addStyleClass("sub-title"),
                                            new sap.m.Label({
                                                textAlign: "End",
                                                width: "100%",
                                                //	design: "Bold",
                                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                text: "{Bet02}"
                                            }).addStyleClass("font-16px font-medium")
                                        ]
                                    })
                                        .addStyleClass("sub-con-titleBar-both")
                                        .setModel(oController._DetailJSonModel)
                                        .bindElement("/Data")
                                );

                                oMoney3Layout.addItem(
                                    new sap.m.HBox({
                                        height: "55px",
                                        alignItems: sap.m.FlexAlignItems.Center,
                                        items: [
                                            new sap.m.Label({ width: "180px", text: oController.getBundleText("LABEL_54015"), textAlign: "Left" }).addStyleClass("sub-title"),
                                            new sap.m.Label({
                                                textAlign: "End",
                                                width: "100%",
                                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                text: "{Bet04}"
                                            }).addStyleClass("font-16px font-medium")
                                        ]
                                    })
                                        .addStyleClass("sub-con-titleBar-both")
                                        .setModel(oController._DetailJSonModel)
                                        .bindElement("/Data")
                                );

                                oMoney4Layout.addItem(
                                    new sap.m.HBox({
                                        height: "55px",
                                        alignItems: sap.m.FlexAlignItems.Center,
                                        items: [new sap.m.Label({ width: "100%", text: oController.getBundleText("LABEL_54016"), textAlign: "Center" }).addStyleClass("sub-title")]
                                    })
                                        .addStyleClass("sub-con-titleBar-both")
                                        .setModel(oController._DetailJSonModel)
                                        .bindElement("/Data")
                                );
                                if (data.PayslipForm1Nav && data.PayslipForm1Nav.results.length > 0) {
                                    for (var i = 0; i < data.PayslipForm1Nav.results.length; i++) {
                                        if (data.PayslipForm1Nav.results[i].Pyitm != "") {
                                            oMoney1Layout.addItem(
                                                new sap.m.HBox({
                                                    height: "40px",
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    items: [
                                                        new sap.m.Label({ width: "180px", text: data.PayslipForm1Nav.results[i].Pyitx, textAlign: "Left" }).addStyleClass("sub-conRead-title"),
                                                        new sap.m.Text({
                                                            textAlign: "End",
                                                            width: "100%",
                                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                            text: data.PayslipForm1Nav.results[i].BetrgT
                                                        }).addStyleClass("sub-conRead-title")
                                                    ]
                                                })
                                            );
                                        }
                                    }
                                }

                                if (data.PayslipForm2Nav && data.PayslipForm2Nav.results.length > 0) {
                                    data.PayslipForm2Nav.results.forEach(function (elem) {
                                        if (elem.Pyitm != "") {
                                            oMoney2Layout.addItem(
                                                new sap.m.HBox({
                                                    height: "40px",
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    items: [
                                                        new sap.m.Label({ width: "180px", text: elem.Pyitx, textAlign: "Left" }).addStyleClass("sub-conRead-title"),
                                                        new sap.m.Text({
                                                            textAlign: "End",
                                                            width: "100%",
                                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                            text: elem.BetrgT
                                                        }).addStyleClass("sub-conRead-title")
                                                    ]
                                                })
                                            );
                                        }
                                    });
                                }

                                if (data.PayslipForm3Nav && data.PayslipForm3Nav.results.length > 0) {
                                    data.PayslipForm3Nav.results.forEach(function (elem) {
                                        if (elem.Pyitm != "") {
                                            oMoney3Layout.addItem(
                                                new sap.m.HBox({
                                                    height: "40px",
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    items: [
                                                        new sap.m.Label({ width: "180px", text: elem.Pyitx, textAlign: "Left" }).addStyleClass("sub-conRead-title"),
                                                        new sap.m.Text({
                                                            textAlign: "End",
                                                            width: "100%",
                                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                            text: elem.BetrgT
                                                        }).addStyleClass("sub-conRead-title")
                                                    ]
                                                })
                                            );
                                        }
                                    });
                                }

                                if (data.PayslipForm4Nav && data.PayslipForm4Nav.results.length > 0) {
                                    data.PayslipForm4Nav.results.forEach(function (elem) {
                                        if (elem.Pyitm != "") {
                                            oMoney4Layout.addItem(
                                                new sap.m.HBox({
                                                    height: "40px",
                                                    alignItems: sap.m.FlexAlignItems.Center,
                                                    items: [
                                                        new sap.m.Label({ width: "180px", text: elem.Pyitx, textAlign: "Left" }).addStyleClass("sub-conRead-title"),
                                                        new sap.m.Label({
                                                            textAlign: "End",
                                                            width: "100%",
                                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                            text: elem.BetrgT
                                                        }).addStyleClass("sub-conRead-title")
                                                    ]
                                                })
                                            );
                                        }
                                    });
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (vData.Znotes && vData.Znotes != "") {
                        vData.Ztitle = vData.Ztitle + "\n" + vData.Znotes;
                    }
                    oController._DetailJSonModel.setProperty("/Data/Banka", vData.Banka);
                    oController._DetailJSonModel.setProperty("/Data/Bankn", vData.Bankn);
                    oController._DetailJSonModel.setProperty("/Data/Bet01", vData.Bet01);
                    oController._DetailJSonModel.setProperty("/Data/Bet02", vData.Bet02);
                    oController._DetailJSonModel.setProperty("/Data/Bet03", vData.Bet03);
                    oController._DetailJSonModel.setProperty("/Data/Bet04", vData.Bet04);
                    oController._DetailJSonModel.setProperty("/Data/Bet05", vData.Bet05);
                    oController._DetailJSonModel.setProperty("/Data/Ename", vData.Ename);
                    oController._DetailJSonModel.setProperty("/Data/Orgtx", vData.Orgtx);
                    oController._DetailJSonModel.setProperty("/Data/Zyymm", vData.Zyymm);
                    oController._DetailJSonModel.setProperty("/Data/Ztitle", vData.Ztitle);
                    oController._DetailJSonModel.setProperty("/Data/Znotes", vData.Znotes);
                    oController._DetailJSonModel.setProperty("/Data/visibleYn", "X");
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModel({name: "20021052"}); //
                      return new JSONModel({ name: "20090028" }); //
                      // return new JSONModel({name: "35432259"}); // 첨단
                      // return new JSONModel({name: "35432260"}); // 첨단
                      // return new JSONModel({name: "35432261"}); // 첨단
                      // return new JSONModel({name: "35132259"}); // 첨단
                      // return new JSONModel({name: "35132260"}); // 첨단
                      // return new JSONModel({name: "35132261"}); // 첨단
                      // return new JSONModel({name: "981014"}); // 기초
                      // return new JSONModel({name: "991002"}); // 기초
                      // return new JSONModel({name: "991004"}); // 기초
                      // return new JSONModel({name: "8900366"}); // 기초
                      // return new JSONModel({name: "8903376"}); // 기초
                      // return new JSONModel({name: "9000290"}); // 기초
                  }
                : null
        });
    }
);
