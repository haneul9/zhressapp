/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common",
        "common/CommonController",
        "common/JSONModelHelper",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "fragment/COMMON_ATTACH_FILES"
    ],
    function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, FileHandler) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "CostApply",

            ApplyModel: new JSONModelHelper(),

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
            },

            onBeforeShow: function (oEvent) {
                Common.log("onBeforeShow");
                BusyIndicator.show(0);
                this.ApplyModel.setData({ FormData: [] });

                if(oEvent.data){
                    if (Common.checkNull(oEvent.data.RowData)) {
                        // 새로운 신청
                        this.ApplyModel.setProperty("/FormData/Begda", new Date());
                        this.ApplyModel.setProperty("/FormData/Zmuflg", "1");
                        this.ApplyModel.setProperty("/MonExpenses", "");
                        this.setZyears(this);
                        this.setZmonths(this);
                        this.ApplyModel.setProperty("/FormData/TargetMonth", Common.lpad(new Date().getMonth()+1, "2"));
                        this.ApplyModel.setProperty("/FormData/TargetYears", String(new Date().getFullYear()));
                    } else { // RowData가 있을때
                        var oRowData = $.extend(true, {}, oEvent.data.RowData);
                        this.ApplyModel.setData({ FormData: oRowData });
                        this.setZyears(this);
                        this.setZmonths(this);
    
                        if (oEvent.data.Gubun === "E") {
                            // 월 생활경비 신청일 경우
                            this.ApplyModel.setProperty("/FormData/Appnm", "");
                            this.ApplyModel.setProperty("/MonExpenses", "X");
                            this.ApplyModel.setProperty("/FormData/Begda", new Date());
                            this.ApplyModel.setProperty("/FormData/TargetMonth", Common.lpad(new Date().getMonth()+1, "2"));
                            this.ApplyModel.setProperty("/FormData/TargetYears", String(new Date().getFullYear()));
                        } else {
                            // 데이터 상세조회
                            this.ApplyModel.setProperty("/FormData/TargetYears", oRowData.Ztrgym.slice(0, 4));
                            this.ApplyModel.setProperty("/FormData/TargetMonth", oRowData.Ztrgym.slice(4));
                        }
                        this.ApplyModel.setProperty("/FormData/RangYearB", oRowData.Zscsym.slice(0, 4));
                        this.ApplyModel.setProperty("/FormData/RangMonthB", oRowData.Zscsym.slice(4));
                        this.ApplyModel.setProperty("/FormData/RangYearsE", oRowData.Zsceym.slice(0, 4));
                        this.ApplyModel.setProperty("/FormData/RangMonthE", oRowData.Zsceym.slice(4));
                        this.getDispatchCost();
                    }
                }
            },

            onAfterShow: function () {
                this.getLocationList();
                this.onBeforeOpenDetailDialog();
                BusyIndicator.hide();
            },

            navBack: function () {
                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
                    });
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
                oController.ApplyModel.setProperty("/TargetYears", aYears);
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
                oController.ApplyModel.setProperty("/TargetMonth", aMonths);
            },

            TargetYears: function(oEvent){
                var vKey = oEvent.getSource().getSelectedKey();
                this.ApplyModel.setProperty("/FormData/TargetYears", vKey);
            },

            TargetMonth: function(oEvent){
                var vKey = oEvent.getSource().getSelectedKey();
                this.ApplyModel.setProperty("/FormData/TargetMonth", vKey);
            },

            getCost1: function(oEvent) { // 보증금
                var oController = this;
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

                oController.ApplyModel.setProperty("/FormData/Zdsamt", vZdsamt);
                oController.getSupAmount();
            },

            getCost2: function(oEvent) { // 월세
                var oController = this;
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.ApplyModel.setProperty("/FormData/Zmnamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getCost3: function(oEvent) { // 관리비
                var oController = this;
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.ApplyModel.setProperty("/FormData/Zaeamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getCost4: function(oEvent) {
                var oController = this;
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');

                if(convertValue.charAt(0) === "0")
                    convertValue = convertValue.slice(1);

                oController.ApplyModel.setProperty("/FormData/Zetamt", convertValue);
                oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
                oController.getSupAmount();
            },

            getSupAmount: function() { // 회사지원금액
                var oController = this.getView().getController();
                var vZmnamt = Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zmnamt")) ? 0 : parseInt(oController.ApplyModel.getProperty("/FormData/Zmnamt")),
                    vZaeamt = Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zaeamt")) ? 0 : parseInt(oController.ApplyModel.getProperty("/FormData/Zaeamt")),
                    vZtramt = Common.checkNull(oController.ApplyModel.getProperty("/FormData/Ztramt")) ? 0 : parseInt(oController.ApplyModel.getProperty("/FormData/Ztramt")),
                    vZdsamt = Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zdsamt")) ? 0 : parseInt(oController.ApplyModel.getProperty("/FormData/Zdsamt")),
                    vZetamt = Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zetamt")) ? 0 : parseInt(oController.ApplyModel.getProperty("/FormData/Zetamt"));
                var vSum = vZmnamt + vZaeamt + vZtramt + vZdsamt + vZetamt;

                oController.ApplyModel.setProperty("/FormData/Zcoamt", String(vSum));
            },

            getDispatchCost: function () {
                // 교통비
                var oController = this.getView().getController();
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

                            oController.ApplyModel.setProperty("/FormData/Ztramt", rDatas[0].Ztramt);
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
                var oController = this.getView().getController();
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
                var oController = this.getView().getController();
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
                var oController = this.getView().getController();
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
                // Error Check
                var oController = this.getView().getController();

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
                if (Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zcoamt"))) {
                    MessageBox.error(oController.getBundleText("MSG_59035"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/TargetMonth")) && !Common.checkNull(oController.ApplyModel.getProperty("/FormData/TargetYears"))){
                    oController.ApplyModel.setProperty("/FormData/Ztrgym", oController.ApplyModel.getProperty("/FormData/TargetYears") + oController.ApplyModel.getProperty("/FormData/TargetMonth"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zaeamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zaeamt", oController.ApplyModel.getProperty("/FormData/Zaeamt"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/Ztramt"))){
                    oController.ApplyModel.setProperty("/FormData/Ztramt", oController.ApplyModel.getProperty("/FormData/Ztramt"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zdsamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zdsamt", oController.ApplyModel.getProperty("/FormData/Zdsamt"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zetamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zetamt", oController.ApplyModel.getProperty("/FormData/Zetamt"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zcoamt"))){
                    oController.ApplyModel.setProperty("/FormData/Zcoamt", oController.ApplyModel.getProperty("/FormData/Zcoamt"));
                }

                if(!Common.checkNull(oController.ApplyModel.getProperty("/FormData/PayDate"))){
                    oController.ApplyModel.setProperty("/FormData/PayDate", oController.ApplyModel.getProperty("/FormData/PayDate"));
                }
                
                if (FileHandler.getFileLength(oController, "001") === 0) {
                    MessageBox.error(oController.getBundleText("MSG_59027"), { title: oController.getBundleText("LABEL_00149") });
                    return true;
                }

                return false;
            },

            onDialogApplyBtn: function () {
                // 신청
                if (this.ApplyModel.getProperty("/MonExpenses") === "X") this.onDialogApplyBtn2();
                else this.onDialogApplyBtn1();
            },

            onDialogApplyBtn1: function () {
                // 신청
                var oController = this.getView().getController();
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
                        oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
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
                                BusyIndicator.hide();
                                oController.navBack();
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
                var oController = this.getView().getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = oController.getUserGubun();
                var oRowData = oController.ApplyModel.getProperty("/FormData");

                if (oController.checkError()) return;

                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_59026")) {
                        // 첨부파일 저장
                        oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
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
                                BusyIndicator.hide();
                                oController.navBack();
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
                var oController = this.getView().getController();
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
                        oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
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
                                BusyIndicator.hide();
                                oController.navBack();
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
                var oController = this.getView().getController();
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
                                BusyIndicator.hide();
                                oController.navBack();
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

            onBeforeOpenDetailDialog: function () {
                var oController = this.getView().getController();
                var vStatus = oController.ApplyModel.getProperty("/FormData/Status"),
                    vMonExpenses = this.ApplyModel.getProperty("/MonExpenses"),
                    vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";

                FileHandler.setAttachFile(
                    this,
                    {
                        // 첨부파일
                        Label: this.getBundleText("LABEL_59021"),
                        Required: true,
                        Appnm: vAppnm,
                        Mode: "S",
                        ReadAsync: true,
                        UseMultiCategories: true,
                        Editable: vMonExpenses === "X" || (Common.checkNull(vMonExpenses) && !vStatus || vStatus === "AA")
                    },
                    "001"
                );
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: $.app.getController().getUserId() });
                  }
                : null
        });
    }
);
