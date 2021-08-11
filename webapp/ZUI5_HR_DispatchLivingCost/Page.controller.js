sap.ui.define(
    [
        "common/Common",
        "common/CommonController",
        "common/JSONModelHelper",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "common/AttachFileAction"
    ],
    function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, AttachFileAction) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            TableModel: new JSONModelHelper(),
            ApplyModel: new JSONModelHelper(),
            CostModel: new JSONModelHelper(),
            FinishModel: new JSONModelHelper(),
            LogModel: new JSONModelHelper(),

            getUserId: function () {
                return this.getSessionInfoByKey("name");
            },

            getUserGubun: function () {
                return this.getSessionInfoByKey("Bukrs3");
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
                var oView = $.app.byId("ZUI5_HR_DispatchLivingCost.Page");
                this._CostApplyModel = sap.ui.jsfragment("ZUI5_HR_DispatchLivingCost.fragment.CostApply", this);
                oView.addDependent(this._CostApplyModel);
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
                oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));

                this.onTableSearch();
            },

            getChoice: function () {
                var oController = $.app.getController();

                return new sap.m.CheckBox({
                    select: oController.onChecked.bind(oController),
                    selected: {
                        path: "Check",
                        formatter: function (v) {
                            return v === "X";
                        }
                    }
                });
            },

            onChecked: function (oEvent) {
                // Checkbox선택시 다른Checkbox 비활성화
                var oController = this;
                var vIndex = oEvent.getSource().mBindingInfos.selected.binding.oContext.getPath().slice(6);

                oController.FinishModel.setData({ FormData: [] });

                this.TableModel.getProperty("/Data").forEach(function (ele, index) {
                    if (index === parseInt(vIndex) && oEvent.getSource().getSelected() === true) {
                        oController.TableModel.setProperty("/Data/" + index + "/Check", "X");
                        oController.FinishModel.setData({ FormData: ele });
                    } else oController.TableModel.setProperty("/Data/" + index + "/Check", "");
                });
            },

            getLocation: function () {
                return new sap.m.Text({
                    text: {
                        parts: [{ path: "ZfwkpsT" }, { path: "ZtwkpsT" }],
                        formatter: function (v1, v2) {
                            if (v1) return v1 + " → " + v2;
                            else return "";
                        }
                    }
                });
            },

            getCostPlace: function () {
                return new sap.m.Text({
                    text: {
                        parts: [{ path: "ZwkplsT" }, { path: "ZlfplsT" }],
                        formatter: function (v1, v2) {
                            if (v1) return v1 + " → " + v2;
                            else return "";
                        }
                    }
                });
            },

            getDatepicker: function () {
                return new sap.m.Text({
                    text: {
                        parts: [{ path: "Zscsym" }, { path: "Zsceym" }],
                        formatter: function (v1, v2) {
                            if (!v1 || !v2) return "";

                            v1 = v1.substr(0, 4) + "-" + v1.substr(4);
                            v2 = v2.substr(0, 4) + "-" + v2.substr(4);

                            return v1 + " ~ " + v2;
                        }
                    },
                    textAlign: "Center"
                });
            },

            getTargetDate2: function() {
                return new sap.m.Text({
                    text: {
                        path: "Ztrgym",
                        formatter: function (v) {
                            return Common.checkNull(v) ? "" : v.substr(0, 4) + "-" + v.substr(4);
                        }
                    },
                    textAlign: "Center"
                });
            },

            getPayDate: function () {
                return new sap.m.Text({
                    text: {
                        path: "PayDate",
                        formatter: function (v) {
                            if (!v || v === "000000") return "";
                            v = v.substr(0, 4) + "-" + v.substr(4);

                            return v;
                        }
                    },
                    textAlign: "Center"
                });
            },

            getTargetDate: function () { // 대상연월
                var oController = $.app.getController();
                var oTargetYears = new sap.m.ComboBox({
                    width: "100%",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    change: oController.TargetYears.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/TargetYears",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{TargetYears}"
                });

                // 키보드 입력 방지
                oTargetYears.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTargetYears.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTargetYears
                );

                var oTargetMonth = new sap.m.ComboBox({
                    width: "auto",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    change: oController.TargetMonth.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/TargetMonth",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{TargetMonth}"
                });

                // 키보드 입력 방지
                oTargetMonth.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTargetMonth.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTargetMonth
                );

                return new sap.m.HBox({
                    fitContainer: true,
                    width: "100%",
                    items: [
                        oTargetYears,
                        oTargetMonth.addStyleClass("ml-3px")
                    ]
                })
                .setModel(oController.CostModel)
                .bindElement("/Data/0");
            },

            TargetYears: function(oEvent){
                var vKey = oEvent.getSource().getSelectedKey();
                this.CostModel.setProperty("/Data/0/TargetYears", vKey);
            },

            TargetMonth: function(oEvent){
                var vKey = oEvent.getSource().getSelectedKey();
                this.CostModel.setProperty("/Data/0/TargetMonth", vKey);
            },

            getMoneyInput1: function() {
                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zmnamt", false),
                    editable: false,
                    value: {
                        path: "Zmnamt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getMoneyInput2: function() {
                var oController = $.app.getController();

                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Ztramt", false),
                    liveChange: oController.getCost3.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    value: {
                        path: "Zaeamt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getMoneyInput3: function() {
                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Ztramt", false),
                    editable: false,
                    value: {
                        path: "Ztramt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getMoneyInput4: function() {
                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zdsamt", false),
                    editable: false,
                    value: {
                        path: "Zdsamt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getMoneyInput5: function() {
                var oController = $.app.getController();

                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zetamt", false),
                    liveChange: oController.getCost4.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    value: {
                        path: "Zetamt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getMoneyInput6: function() {
                return  new sap.m.Input({
                    textAlign: "End",
                    width: "100%",
                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zcoamt", false),
                    editable: false,
                    value: {
                        path: "Zcoamt",
                        formatter: function(v) {
                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                        }
                    }
                });
            },

            getStatus: function () {
                var oController = $.app.getController();

                return new sap.m.FlexBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.commons.TextView({
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
                                    //처리결과에 Text
                                    text: "{StatusT}",
                                    textAlign: "Center"
                                }).addStyleClass("font-14px font-regular mt-7px"),
                                new sap.m.Button({
                                    //처리결과에 삭제 버튼
                                    text: "{i18n>LABEL_38047}",
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

            onPressSer: function () {
                this.onTableSearch();
            },

            onTableSearch: function () {
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};
                // Header
                sendObject.IBukrs = vBukrs;
                sendObject.IEmpid = vPernr;
                sendObject.IConType = "1";
                sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
                sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
                // Navigation property
                sendObject.DispatchApplyExport = [];
                sendObject.DispatchApplyTableIn1 = [];

                oModel.create("/DispatchApplySet", sendObject, {
                    success: function (oData) {
                        if (oData && oData.DispatchApplyTableIn1) {
                            Common.log(oData);
                            var rDatas = oData.DispatchApplyTableIn1.results;
                            oController.TableModel.setData({ Data: rDatas });
                        }

                        oController.LogModel.setData({ Data: oData.DispatchApplyExport.results[0] });
                        if (oData.DispatchApplyExport.results[0].EClose === "X") {
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

                Common.adjustAutoVisibleRowCount.call(oTable);
            },

            onPressReq: function () {
                //신청
                this.ApplyModel.setData({ FormData: [] });
                this.CostModel.setData({ Data: [{}] });
                this.ApplyModel.setProperty("/FormData/Begda", new Date());
                this.ApplyModel.setProperty("/FormData/Zmuflg", "1");
                this.ApplyModel.setProperty("/MonExpenses", "");
                
                this.setZyears(this);
                this.setZmonths(this);
                this.CostModel.setProperty("/Data/0/TargetMonth", Common.lpad(new Date().getMonth()+1, "2"));
                this.CostModel.setProperty("/Data/0/TargetYears", String(new Date().getFullYear()));
                this.getLocationList();
                this._CostApplyModel.open();
            },

            onPressEnd: function () {
                // 월 생활경비 신청
                var oController = this;

                if (
                    this.TableModel.getProperty("/Data").every(function (e) {
                        return Common.checkNull(e.Check);
                    })
                ) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_59016"), {
                        title: oController.getBundleText("LABEL_00149")
                    });
                    return;
                }

                var oRowData = $.extend(true, {}, this.FinishModel.getProperty("/FormData"));

                this.CostModel.setData({ Data: [{}] });
                oRowData.Appnm = "";
                this.ApplyModel.setData({ FormData: oRowData });

                this.setZyears(this);
                this.setZmonths(this);
                this.ApplyModel.setProperty("/MonExpenses", "X");
                this.ApplyModel.setProperty("/FormData/Begda", new Date());
                this.ApplyModel.setProperty("/FormData/RangYearB", oRowData.Zscsym.slice(0, 4));
                this.ApplyModel.setProperty("/FormData/RangMonthB", oRowData.Zscsym.slice(4));
                this.ApplyModel.setProperty("/FormData/RangYearsE", oRowData.Zsceym.slice(0, 4));
                this.ApplyModel.setProperty("/FormData/RangMonthE", oRowData.Zsceym.slice(4));
                this.CostModel.setProperty("/MonExpenses", "X");
                this.CostModel.setProperty("/Data/0/Status", oRowData.Status);
                this.CostModel.setProperty("/Data/0/TargetMonth", Common.lpad(new Date().getMonth()+1, "2"));
                this.CostModel.setProperty("/Data/0/TargetYears", String(new Date().getFullYear()));
                this.CostModel.setProperty("/Data/0/Zmnamt", oRowData.Zmnamt);
                this.CostModel.setProperty("/Data/0/Zdsamt", oRowData.Zdsamt);
                this.CostModel.setProperty("/Data/0/Zaeamt", oRowData.Zaeamt);
                this.CostModel.setProperty("/Data/0/Zetamt", oRowData.Zetamt);
                this.CostModel.setProperty("/Data/0/PayDate", oRowData.PayDate);
                this.getDispatchCost();
                this.getLocationList();
                this._CostApplyModel.open();
            },

            onSelectedRow: function (oEvent) {
                var oController = $.app.getController();
                var vPath = oEvent.getParameters().rowBindingContext.getPath();
                var oRowData = oController.TableModel.getProperty(vPath);
                var oCopiedRow = $.extend(true, {}, oRowData);

                oController.ApplyModel.setData({ FormData: oCopiedRow });
                oController.CostModel.setData({ Data: [{}] });
                oController.setZyears(oController);
                oController.setZmonths(oController);

                oController.ApplyModel.setProperty("/FormData/RangYearB", oCopiedRow.Zscsym.slice(0, 4));
                oController.ApplyModel.setProperty("/FormData/RangMonthB", oCopiedRow.Zscsym.slice(4));
                oController.ApplyModel.setProperty("/FormData/RangYearsE", oCopiedRow.Zsceym.slice(0, 4));
                oController.ApplyModel.setProperty("/FormData/RangMonthE", oCopiedRow.Zsceym.slice(4));
                oController.CostModel.setProperty("/Data/0/Status", oRowData.Status);
                oController.CostModel.setProperty("/Data/0/TargetYears", oRowData.Ztrgym.slice(0, 4));
                oController.CostModel.setProperty("/Data/0/TargetMonth", oRowData.Ztrgym.slice(4));
                oController.CostModel.setProperty("/Data/0/Zmnamt", oRowData.Zmnamt);
                oController.CostModel.setProperty("/Data/0/Zdsamt", oRowData.Zdsamt);
                oController.CostModel.setProperty("/Data/0/Zaeamt", oRowData.Zaeamt);
                oController.CostModel.setProperty("/Data/0/Zetamt", oRowData.Zetamt);
                oController.CostModel.setProperty("/Data/0/PayDate", oRowData.PayDate);
                oController.getDispatchCost();
                oController.getLocationList();
                oController._CostApplyModel.open();
            },

            setZyears: function (oController) {
                var vZyear = new Date().getFullYear(),
                    vConvertYear = "",
                    aYears = [];

                vConvertYear = String(vZyear - 1);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });

                Common.makeNumbersArray({ length: 5 }).forEach(function (idx) {
                    vConvertYear = String(vZyear + idx);
                    aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
                });

                oController.ApplyModel.setProperty("/RangYearsB", aYears);
                oController.ApplyModel.setProperty("/RangYearsE", aYears);
                oController.CostModel.setProperty("/TargetYears", aYears);
            },

            setZmonths: function (oController) {
                var vConvertMonth = "",
                    aMonths = [];

                Common.makeNumbersArray({ length: 12, isZeroStart: false }).forEach(function (idx) {
                    vConvertMonth = String(idx);
                    aMonths.push({ Code: Common.lpad(vConvertMonth, "2"), Text: vConvertMonth + "월" });
                });

                oController.ApplyModel.setProperty("/RangMonthB", aMonths);
                oController.ApplyModel.setProperty("/RangMonthE", aMonths);
                oController.CostModel.setProperty("/TargetMonth", aMonths);
            },

            getCost1: function(oEvent) { // 보증금
                var oController = $.app.getController();
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0"){
                    convertValue = convertValue.slice(1);

                }
                oController.ApplyModel.setProperty("/FormData/Zdpamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));

                var vZdsamt = "0";
                if(parseInt(convertValue) > 999999) {
                    vZdsamt = convertValue.slice(0, -6) + "0000";
                }

                oController.CostModel.setProperty("/Data/0/Zdsamt", vZdsamt);
                oController.getSupAmount();
            },

            getCost2: function(oEvent) { // 월세
                var oController = $.app.getController();
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.CostModel.setProperty("/Data/0/Zmnamt", convertValue);
                oController.ApplyModel.setProperty("/FormData/Zmnamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getCost3: function(oEvent) { // 관리비
                var oController = $.app.getController();
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.CostModel.setProperty("/Data/0/Zaeamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getCost4: function(oEvent) {
                var oController = $.app.getController();
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.CostModel.setProperty("/Data/0/Zetamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getSupAmount: function() { // 회사지원금액
                var oController = $.app.getController();
                var vZmnamt = Common.checkNull(oController.CostModel.getProperty("/Data/0/Zmnamt")) ? 0 : parseInt(oController.CostModel.getProperty("/Data/0/Zmnamt")),
                    vZaeamt = Common.checkNull(oController.CostModel.getProperty("/Data/0/Zaeamt")) ? 0 : parseInt(oController.CostModel.getProperty("/Data/0/Zaeamt")),
                    vZtramt = Common.checkNull(oController.CostModel.getProperty("/Data/0/Ztramt")) ? 0 : parseInt(oController.CostModel.getProperty("/Data/0/Ztramt")),
                    vZdsamt = Common.checkNull(oController.CostModel.getProperty("/Data/0/Zdsamt")) ? 0 : parseInt(oController.CostModel.getProperty("/Data/0/Zdsamt")),
                    vZetamt = Common.checkNull(oController.CostModel.getProperty("/Data/0/Zetamt")) ? 0 : parseInt(oController.CostModel.getProperty("/Data/0/Zetamt"));
                var vSum = vZmnamt + vZaeamt + vZtramt + vZdsamt + vZetamt;

                oController.CostModel.setProperty("/Data/0/Zcoamt", String(vSum));
            },

            getDispatchCost: function () {
                // 교통비
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vBukrs = oController.getUserGubun();
                var vPernr = oController.getUserId();
                var vZwkpls = oController.ApplyModel.getProperty("/FormData/Zwkpls"),
                    vZlfpls = oController.ApplyModel.getProperty("/FormData/Zlfpls");

                var oSendRow = {
                    Zwkpls: vZwkpls,
                    Zlfpls: vZlfpls
                };

                var sendObject = {};
                // Header
                sendObject.IBukrs = vBukrs;
                sendObject.IEmpid = vPernr;
                sendObject.IConType = "7";
                // Navigation property
                sendObject.DispatchApplyTableIn1 = [oSendRow];

                    oModel.create("/DispatchApplySet", sendObject, {
                        success: function (oData) {
                        if (oData && oData.DispatchApplyTableIn1) {
                            Common.log(oData);
                            var rDatas = oData.DispatchApplyTableIn1.results;

                            oController.CostModel.setProperty("/Data/0/Ztramt", rDatas[0].Ztramt);
                            oController.getSupAmount();
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

            getLocationList: function () {
                // 지역정보
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();

                var sendObject = {};
                // Header
                sendObject.IBukrs = vBukrs;
                sendObject.IPernr = vPernr;
                sendObject.IConType = "0";
                // Navigation property
                sendObject.DispatchApplyTableIn2 = [];
                sendObject.DispatchApplyTableIn3 = [];

                oModel.create("/DispatchApplySet", sendObject, {
                    success: function (oData) {
                        Common.log(oData);
                        oController.ApplyModel.setProperty("/LocationCombo1", oData.DispatchApplyTableIn2.results);
                        oController.ApplyModel.setProperty("/LocationCombo2", oData.DispatchApplyTableIn2.results);
                        oController.ApplyModel.setProperty("/LocationCombo3", oData.DispatchApplyTableIn3.results);
                        oController.ApplyModel.setProperty("/LocationCombo4", oData.DispatchApplyTableIn3.results);
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

            checkLocation1: function (oEvent) {
                this.checkLocation_1(oEvent);
            },

            checkLocation2: function (oEvent) {
                this.checkLocation_1(oEvent);
            },

            checkLocation_1: function () {
                // 파견지 Check
                var oController = $.app.getController();
                var oLocation1 = $.app.byId(oController.PAGEID + "_LocationCombo1");
                var oLocation2 = $.app.byId(oController.PAGEID + "_LocationCombo2");

                if (Common.checkNull(oLocation2.getSelectedKey()) || Common.checkNull(oLocation1.getSelectedKey())) return;

                if (oLocation1.getSelectedKey() === oLocation2.getSelectedKey()) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_59009"), {
                        title: oController.getBundleText("LABEL_00149")
                    });
                    return;
                }
            },

            checkLocation3: function (oEvent) {
                this.checkLocation_2(oEvent);
            },

            checkLocation4: function (oEvent) {
                this.checkLocation_2(oEvent);
            },

            checkLocation_2: function () {
                // 기준지 Check
                var oController = $.app.getController();
                var oLocation3 = $.app.byId(oController.PAGEID + "_LocationCombo3");
                var oLocation4 = $.app.byId(oController.PAGEID + "_LocationCombo4");

                if (Common.checkNull(oLocation3.getSelectedKey()) || Common.checkNull(oLocation4.getSelectedKey())) return;

                if (oLocation3.getSelectedKey() === oLocation4.getSelectedKey()) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_59009"), {
                        title: oController.getBundleText("LABEL_00149")
                    });
                    return;
                }

                this.getDispatchCost();
            },

            onChangeRadio: function (oEvent) {
                var vPath = oEvent.getSource().getBindingContext().getPath();

                if (oEvent.mParameters.selectedIndex === 0) {
                    this.ApplyModel.setProperty(vPath + "/Zmuflg", "1");
                    this.ApplyModel.setProperty(vPath + "/ZmuflgT", this.getBundleText("LABEL_59030"));
                } else {
                    this.ApplyModel.setProperty(vPath + "/Zmuflg", "2");
                    this.ApplyModel.setProperty(vPath + "/ZmuflgT", this.getBundleText("LABEL_59031"));
                }
            },

            checkError: function () {
                var oController = $.app.getController();

                // 파견지
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zfwkps")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Ztwkps"))) {
                    MessageBox.error(oController.getBundleText("MSG_59017"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 발령일자
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zactdt"))) {
                    MessageBox.error(oController.getBundleText("MSG_59019"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 원생활근거지
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zadres"))) {
                    MessageBox.error(oController.getBundleText("MSG_59020"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 교통비 지급 기준지
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zwkpls")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zlfpls"))) {
                    MessageBox.error(oController.getBundleText("MSG_59021"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }   

                // 숙소계약기간
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangYearB")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangMonthB")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangYearsE")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangMonthE"))) {
                    MessageBox.error(oController.getBundleText("MSG_59022"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                } else {
                    oController.ApplyModel.setProperty("/FormData/Zscsym", oController.ApplyModel.getProperty("/FormData/RangYearB") + oController.ApplyModel.getProperty("/FormData/RangMonthB"));
                    oController.ApplyModel.setProperty("/FormData/Zsceym", oController.ApplyModel.getProperty("/FormData/RangYearsE") + oController.ApplyModel.getProperty("/FormData/RangMonthE"));
                }

                // 보증금
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zdpamt"))) {
                    MessageBox.error(oController.getBundleText("MSG_59033"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 월세
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zmnamt"))) {
                    MessageBox.error(oController.getBundleText("MSG_59034"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                // 회사지원금액
                if (Common.checkNull(oController.CostModel.getProperty("/Data/0/Zcoamt"))) {
                    MessageBox.error(oController.getBundleText("MSG_59035"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/TargetMonth")) && !Common.checkNull(oController.CostModel.getProperty("/Data/0/TargetYears"))){
                    oController.ApplyModel.setProperty("/FormData/Ztrgym", oController.CostModel.getProperty("/Data/0/TargetYears") + oController.CostModel.getProperty("/Data/0/TargetMonth"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/Zaeamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zaeamt", oController.CostModel.getProperty("/Data/0/Zaeamt"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/Ztramt"))){
                    oController.ApplyModel.setProperty("/FormData/Ztramt", oController.CostModel.getProperty("/Data/0/Ztramt"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/Zdsamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zdsamt", oController.CostModel.getProperty("/Data/0/Zdsamt"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/Zetamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zetamt", oController.CostModel.getProperty("/Data/0/Zetamt"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/Zcoamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zcoamt", oController.CostModel.getProperty("/Data/0/Zcoamt"));
                }

                if(!Common.checkNull(oController.CostModel.getProperty("/Data/0/PayDate"))){
                    oController.ApplyModel.setProperty("/FormData/PayDate", oController.CostModel.getProperty("/Data/0/PayDate"));
                }
                
                if (AttachFileAction.getFileLength(oController) === 0) {
                    MessageBox.error(oController.getBundleText("MSG_59027"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                return false;
            },

            onPressCancel: function (oEvent) {
                // 삭제
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
                var oRowData = oController.TableModel.getProperty(vPath);

                var onPressCancel = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59028")) {
                        // 삭제

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];

                        oModel.create("/DispatchApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_59015"), { title: oController.getBundleText("MSG_08107") });
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_59014"), {
                    title: oController.getBundleText("LABEL_59001"),
                    actions: [oController.getBundleText("LABEL_59028"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressCancel
                });
            },

            onDialogApplyBtn: function () {
                if (this.ApplyModel.getProperty("/MonExpenses") === "X") this.onDialogApplyBtn2();
                else this.onDialogApplyBtn1();
            },

            onDialogApplyBtn1: function () {
                // 신청
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59026")) {
                        // 신청

                        // 첨부파일 저장
                        oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
                        oRowData.Pernr = vPernr;
                        oRowData.Waers = "KRW";

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "3";
                        // Navigation property
                        sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];

                        oModel.create("/DispatchApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_59011"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._CostApplyModel.close();
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_59010"), {
                    title: oController.getBundleText("LABEL_59001"),
                    actions: [oController.getBundleText("LABEL_59026"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressApply
                });
            },

            onDialogApplyBtn2: function () {
                // 월생활경비신청
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59026")) {
                        // 첨부파일 저장
                        oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
                        oRowData.Pernr = vPernr;
                        oRowData.Waers = "KRW";
                        delete oRowData.Appkey;

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "3";
                        // Navigation property
                        sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];

                        oModel.create("/DispatchApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_59011"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._CostApplyModel.close();
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_59010"), {
                    title: oController.getBundleText("LABEL_59001"),
                    actions: [oController.getBundleText("LABEL_59026"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressApply
                });
            },

            onDialogSaveBtn: function () {
                // 저장
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressSave = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59029")) {
                        // 저장

                        // 첨부파일 저장
                        oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
                        oRowData.Pernr = vPernr;

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "2";
                        // Navigation property
                        sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];

                        oModel.create("/DispatchApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_59013"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._CostApplyModel.close();
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_59012"), {
                    title: oController.getBundleText("LABEL_59001"),
                    actions: [oController.getBundleText("LABEL_59029"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressSave
                });
            },

            onDialogDelBtn: function () {
                // 삭제
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                BusyIndicator.show(0);
                var onPressDelete = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59028")) {
                        // 삭제

                        var sendObject = {};
                        // Header
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];

                        oModel.create("/DispatchApplySet", sendObject, {
                            success: function (oData) {
                                Common.log(oData);
                                sap.m.MessageBox.alert(oController.getBundleText("MSG_59015"), { title: oController.getBundleText("MSG_08107") });
                                oController.onTableSearch();
                                BusyIndicator.hide();
                                oController._CostApplyModel.close();
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

                sap.m.MessageBox.confirm(oController.getBundleText("MSG_59014"), {
                    title: oController.getBundleText("LABEL_59001"),
                    actions: [oController.getBundleText("LABEL_59028"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressDelete
                });
            },

            onAfterCostApply: function () {
                var vStatus = this.ApplyModel.getProperty("/FormData/Status"),
                    vMonExpenses = this.ApplyModel.getProperty("/MonExpenses"),
                    vAppnm = this.ApplyModel.getProperty("/FormData/Appnm") || "";
                    

                AttachFileAction.setAttachFile(this, {
                    Appnm: vAppnm,
                    Required: true,
                    Mode: "M",
                    Max: "3",
                    Editable: vMonExpenses === "X" || (Common.checkNull(vMonExpenses) && !vStatus || vStatus === "AA")
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20063005" }); // 20063005
                  }
                : null
        });
    }
);
