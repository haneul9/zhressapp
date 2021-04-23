/* eslint-disable no-undef */
/* eslint-disable no-empty */
sap.ui.define(
    [
        "common/Common", //
        "common/SearchUser1",
        "common/SearchOrg",
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./OvertimeWork",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel",
        "common/moment-with-locales"
    ],
    function (Common, SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, OvertimeWork, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oDetailDialog: null,
            aColumnModel: null,
            
            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @this {Handler}
             * 
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(), 
                    IsSearch: false,
                    IsPossibleExcelButton: false,   // 엑셀 버튼 활성화 여부
                    SearchConditions: { // 검색조건
                        Pernr: null,
                        Orgeh: null,
                        Bukrs3: null,
                        EnameOrOrgehTxt: null,
                        Begda: null,
                        Endda: null,
                        Aftck: OvertimeWork.PRIOR
                    },
                    List: [],
                    Hours: [{ Code: "", Text: "HH"}].concat(Common.makeNumbersArray({ length: 24 }).map(function(h) { return { Code: Common.lpad(h, 2), Text: Common.lpad(h, 2) }; })),
                    Minutes: [{ Code: "", Text: "mm"}].concat(Common.makeNumbersArray({ length: 60 }).map(function(m) { return { Code: Common.lpad(m, 2), Text: Common.lpad(m, 2) }; })),
                    Minutes30: null, 
                    Detail: {
                        IsViewMode: false,    // 조회모드 여부
                        IsPossibleSave: false,  // 저장버튼 활성화 여부
                        IsPossibleApproval: false,  // 신청버튼 활성화 여부
                        IsPossibleDelete: false,  // 삭제버튼 활성화 여부
                        Header: {},
                        List: []
                    }  // 상세
                });

                return this;
            },

            load: function () {
                var currDate = new Date();

                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Begda", new Date(currDate.getFullYear(), currDate.getMonth(), 1));
                this.oModel.setProperty("/SearchConditions/Endda", new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0));
                if($.app.getAuth() === $.app.Auth.MSS) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
                    this.oModel.setProperty("/SearchConditions/Bukrs3", this.oController.getSessionInfoByKey("Bukrs3"));
                }
                if(this.oController.getSessionInfoByKey("Bukrs3") === "1000") {
                    this.oModel.setProperty("/Minutes30", [
                        { Code: "", Text: "mm"},    //
                        { Code: "00", Text: "00"},
                        { Code: "30", Text: "30"}
                    ]);
                } else {
                    this.oModel.setProperty("/Minutes30", this.oModel.getProperty("/Minutes"));
                }

                return this;
            },

            /**
             * @brief 검색
             * 
             * @this {Handler}
             */
            search: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        this.loadTableData();
                        this.toggleExcelBtn();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 목록 조회
             * 
             * @this {Handler}
             */
            loadTableData: function () {
                var results = ODataService.OvertimeWorkApplySet.call(
                    this.oController, 
                    OvertimeWork.ProcessType.READ, 
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/List", results.OtWorkTab1);

                $.app.byViewId("PriorTable").setFirstVisibleRow(0);
                $.app.byViewId("PriorTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("PriorTable"));
            },

            toggleExcelBtn: function() {
                this.oModel.setProperty(
                    "/IsPossibleExcelButton",
                    this.oModel.getProperty("/List").length ? true : false
                );
            },

            pressExcelDownloadBtn: function() {
				var aTableDatas = this.oModel.getProperty("/List");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Otbet", "Otent"),
					workbook: {columns: this.aColumnModel},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_32003"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
            },

            /**
             * @brief 목록 row Click event handler
             * 
             * @param rowData
             */
            pressSelectRowDetail: function (rowData) {
                this.loadApprovalDetail(rowData);
            },

            loadApprovalDetail: function(rowData) {
                var results = ODataService.OvertimeWorkApplySet.call(
                    this.oController, 
                    OvertimeWork.ProcessType.READ, 
                    {
                        Aftck: OvertimeWork.PRIOR,
                        Pernr: rowData.Pernr,
                        Begda: rowData.Begda,
                        Endda: rowData.Endda,
                        Datum: rowData.Begda,
                        OtWorkTab1: [Common.copyByMetadata($.app.getModel("ZHR_WORKTIME_APPL_SRV"), "OvertimeWorkApplyTab1", rowData)]
                    }
                );

                if(!results.OtWorkTab1.length) {
                    MessageBox.error(this.oController.getBundleText("MSG_32018"), { // 조회된 데이터가 없습니다.
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                    return;
                }

                this.oModel.setProperty("/Detail/IsViewMode", rowData.Status1 === OvertimeWork.Approval.NONE ? false : true);
                this.oModel.setProperty("/Detail/IsPossibleSave", true);
                this.oModel.setProperty("/Detail/IsPossibleApproval", true);
                this.oModel.setProperty("/Detail/IsPossibleDelete", true);
                this.oModel.setProperty("/Detail/Header", $.extend(true, results.OtWorkTab1[0], {
                    MinDate: moment().startOf("month").hours(10).toDate(),
                    Holick: results.OtWorkTab1[0].Holick === "X" ? true : false,
                    OtbetmT: results.OtWorkTab1[0].Otbetm.substring(0, 2),
                    OtbetmM: results.OtWorkTab1[0].Otbetm.substring(2, 4),
                    OtentmT: results.OtWorkTab1[0].Otentm.substring(0, 2),
                    OtentmM: results.OtWorkTab1[0].Otentm.substring(2, 4)
                }));
                this.oModel.setProperty("/Detail/List", results.OtWorkTab2.map(function(elem) {
                    return $.extend(true, elem, {
                        AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(elem.Aprsq)  // ${v}차 결재자
                    });
                }.bind(this)));

                this.openDetailDialog();
            },

            /**
             * 신청 Dialog 호출 버튼 event
             * 
             * @this {Handler}
             */
            pressOpenApprovalBtn: function() {

                this.oModel.setProperty("/Detail", {
                    IsViewMode: false,
                    IsPossibleSave: false,
                    IsPossibleApproval: false,
                    IsPossibleDelete: false,
                    Header: {
                        Status1: "",
                        Ename: this.oController.getSessionInfoByKey("Ename"),
                        Pernr: this.oController.getSessionInfoByKey("Pernr"),
                        Bukrs3: this.oController.getSessionInfoByKey("Bukrs3"),
                        OtbetmT: "00",
                        OtbetmM: "00",
                        OtentmT: "00",
                        OtentmM: "00",
                        Brkhr1: "00",
                        Brkmm1: "00",
                        MinDate: moment().startOf("month").hours(10).toDate(),
                        Begda: new Date()
                    },
                    List: []
                });

                this.openDetailDialog();
            },

            /**
             * 상세Dialog 필수입력 체크
             * 
             */
            checkFormControl: function(oEvent) {
                switch(oEvent.getSource().constructor) {
                    case common.PickOnlyDatePicker:
                        this.calculationOverWork("X");
                        break;
                    case sap.m.Select:
                        this.calculationOverWork("");
                        break;
                    default:
                        break;
                }

                this.toggleIsPossibleSave();
            },

            /**
             * @brief 저장/신청버튼 활성화 여부
             *        - 필수 항목이 모두 작성된 경우
             */
            toggleIsPossibleSave: function() {
                this.NOT_VALID_FORM_CONTROL_COUNT = 0;
                this.validControl($.app.byViewId("PriorInputForm")); // recursive call

                this.oModel.setProperty(
                    "/Detail/IsPossibleSave",
                    (this.NOT_VALID_FORM_CONTROL_COUNT === 0) ? true : false
                );
                this.oModel.setProperty(
                    "/Detail/IsPossibleApproval",
                    (this.NOT_VALID_FORM_CONTROL_COUNT === 0) ? true : false
                );
            },

            validControl: function (oControl) {
                // base case
                var childItems = oControl.getAggregation("items");
                if (oControl === null || childItems === null) return;

                // Recursion
                childItems.forEach(function (control) {
                    try {
                        var constructorName = control.constructor.getMetadata().getName();
                        if(Object.keys(OvertimeWork.ValidateProperties).indexOf(constructorName) > -1 
                            && control.getRequired() 
                            && control.getProperty(OvertimeWork.ValidateProperties[constructorName]) === "") {
                                this.NOT_VALID_FORM_CONTROL_COUNT++;
                            }
                    } catch(ex) {
                        Common.log(ex);
                    }  // Not valid control
                    this.validControl(control);
                }, this);

                return;
            },

            ProcessOnSuccess: function (data, conType, vReqes) {
                var successMessage = "";

                switch (conType) {
                    case OvertimeWork.ProcessType.CREATE:
                    case OvertimeWork.ProcessType.UPDATE:
                        successMessage = (vReqes === "X")
                            ? this.oController.getBundleText("MSG_00061")   // 신청되었습니다.
                            : this.oController.getBundleText("MSG_00017");  // 저장되었습니다.
                        break;
                    case OvertimeWork.ProcessType.DELETE:
                        successMessage = this.oController.getBundleText("MSG_00021");   // 삭제되었습니다.
                        break;
                    default:
                        break;
                }

                MessageBox.success(successMessage, {
                    title: this.oController.getBundleText("LABEL_00150"),
                    onClose: function () {
                        this.search.call(this);
                        this.oDetailDialog.close();
                    }.bind(this)
                });

                BusyIndicator.hide();
            },

            ProcessOnFail: function (res) {
                var errData = Common.parseError(res);
                if (errData.Error && errData.Error === "E") {
                    MessageBox.error(errData.ErrorMessage, {
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                }

                BusyIndicator.hide();
            },

            /**
             * 저장 버튼 event
             * 
             * @this {Handler}
             */
            pressSaveBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Aftck = OvertimeWork.PRIOR;
                    payload.Reqes = "";
                    payload.Empid = oInputData.Header.Pernr;
                    payload.Datum = Common.adjustGMTOdataFormat(oInputData.Header.Begda);
                    payload.OtWorkTab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
                            Holick: oInputData.Header.Holick === true ? "X" : "",
                            Otdat: Common.adjustGMTOdataFormat(oInputData.Header.Begda),
                            Otbetm: oInputData.Header.OtbetmT + oInputData.Header.OtbetmM,
                            Otentm: oInputData.Header.OtentmT + oInputData.Header.OtentmM
                        })
                    ];
                    payload.OtWorkTab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "OvertimeWorkApplyTab2", elem);
                    });

                    ODataService.OvertimeWorkApplySetByProcess.call(
                        this.oController, 
                        (oInputData.Header.Status1 === OvertimeWork.Approval.NONE) ? OvertimeWork.ProcessType.UPDATE : OvertimeWork.ProcessType.CREATE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00058"), {
                    // 저장하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },
            
            /**
             * 신청 버튼 event
             * 
             * @this {Handler}
             */
            pressApprovalBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Aftck = OvertimeWork.PRIOR;
                    payload.Reqes = "X";
                    payload.Empid = oInputData.Header.Pernr;
                    payload.Datum = Common.adjustGMTOdataFormat(oInputData.Header.Begda);
                    payload.OtWorkTab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
                            Holick: oInputData.Header.Holick === true ? "X" : "",
                            Otdat: Common.adjustGMTOdataFormat(oInputData.Header.Begda),
                            Otbetm: oInputData.Header.OtbetmT + oInputData.Header.OtbetmM,
                            Otentm: oInputData.Header.OtentmT + oInputData.Header.OtentmM
                        })
                    ];
                    payload.OtWorkTab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "OvertimeWorkApplyTab2", elem);
                    });

                    ODataService.OvertimeWorkApplySetByProcess.call(
                        this.oController, 
                        (oInputData.Header.Status1 === OvertimeWork.Approval.NONE) ? OvertimeWork.ProcessType.UPDATE : OvertimeWork.ProcessType.CREATE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                var confirmMessage = this.oController.getBundleText("MSG_00060");   // 신청하시겠습니까?
                //월누적연장근로시간+신청 근로시간이 20시간 초과이면 확인 메시지(예/아니요) 출력
                if(oInputData.Header.Over20 && parseInt(oInputData.Header.Over20.substring(0, 3)) > 20) {
                    confirmMessage = this.oController.getBundleText("MSG_32017");   // 월누적연장근로시간이 20시간 초과되었습니다.\n계속 진행하시겠습니까?
                }

                MessageBox.show(confirmMessage, {
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },
            
            /**
             * 삭제 버튼 event
             * 
             * @this {Handler}
             */
            pressDeleteBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Aftck = OvertimeWork.PRIOR;
                    payload.Reqes = "";
                    payload.Empid = oInputData.Header.Pernr;
                    payload.Datum = Common.adjustGMTOdataFormat(oInputData.Header.Begda);
                    payload.OtWorkTab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "OvertimeWorkApplyTab1", oInputData.Header), {
                            Holick: oInputData.Header.Holick === true ? "X" : ""
                        })
                    ];
                    payload.OtWorkTab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "OvertimeWorkApplyTab2", elem);
                    });

                    ODataService.OvertimeWorkApplySetByProcess.call(
                        this.oController, 
                        OvertimeWork.ProcessType.DELETE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00059"), {
                    // 삭제하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            openDetailDialog: function() {
                if (!this.oDetailDialog) {
                    this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "priorDetail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDetailDialog);
                }
                
                Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);

                this.oDetailDialog.open();
            },

            /**
             * 목록에서 [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernrByList: function() {
                this.searchOrgehPernr.call(this.oController, function(o) {
                    this.oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                }.bind(this));
            },

            /**
             * 대상자, 근무일, 근무시간, 예상제외시간 변경시 호출
             * 
             * @param {string} vFirst - 대상자, 근무일 변경시에 "X"로 호출한다.
             */
            calculationOverWork: function(vFirst) {

                $.app.byViewId("PriorInputForm").setBusyIndicatorDelay(0).setBusy(true);

                Common.getPromise(
                    function () {
                        // 기본정보 조회
                        var vDetailInfo = this.oModel.getProperty("/Detail/Header"),
                            results = ODataService.OvertimeWorkApplySet.call(
                            this.oController, 
                            OvertimeWork.ProcessType.CODE, 
                            {
                                Aftck: OvertimeWork.PRIOR,
                                First: vFirst,
                                Pernr: vDetailInfo.Pernr,
                                Begda: vDetailInfo.Begda,
                                Endda: vDetailInfo.Begda,
                                Datum: vDetailInfo.Begda,
                                OtWorkTab1: [{
                                    Pernr: vDetailInfo.Pernr,
                                    Otdat: Common.adjustGMTOdataFormat(vDetailInfo.Begda),
                                    Otbetm: Common.nvl(vDetailInfo.OtbetmT, "00") + Common.nvl(vDetailInfo.OtbetmM, "00"),
                                    Otentm: Common.nvl(vDetailInfo.OtentmT, "00") + Common.nvl(vDetailInfo.OtentmM, "00"),
                                    Brkhr1: Common.nvl(vDetailInfo.Brkhr1, "00"),
                                    Brkmm1: Common.nvl(vDetailInfo.Brkmm1, "00")
                                }]
                            }
                        );
                        var vOtWorkTab1 = results.OtWorkTab1[0] || {};

                        this.oModel.setProperty(
                            "/Detail/List",
                            results.OtWorkTab2.map(function(elem) {
                                return $.extend(true, elem, {
                                    AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(elem.Aprsq)  // ${v}차 결재자
                                });
                            }.bind(this))
                        );
                        this.oModel.setProperty(
                            "/Detail/Header",
                            $.extend(true, this.oModel.getProperty("/Detail/Header"), {
                                Holick: vOtWorkTab1.Holick === "X" ? true : false,   // 휴일여부
                                EntbeW: vOtWorkTab1.EntbeW,             // 입출문시간
                                ComtmW: vOtWorkTab1.ComtmW,             // 근태인정시간
                                TottmW: vOtWorkTab1.TottmW,             // 총근로시간
                                MottmW: vOtWorkTab1.MottmW,             // 월누적연장근로시간
                                Over20: vOtWorkTab1.Mottm2,             // 월누적연장근로시간(신청 총근로시간 포함)
                                Otbetm: vOtWorkTab1.Otbetm || "00",       // 근무시작시간
                                Otentm: vOtWorkTab1.Otentm || "00",       // 근무종료시간
                                Brkhr1: vOtWorkTab1.Brkhr1 || "00",       // 예상제외시간-시
                                Brkmm1: vOtWorkTab1.Brkmm1 || "00",       // 예상제외시간-분
                                OtbetmT: !Common.checkNull(vOtWorkTab1.Otbetm) ? vOtWorkTab1.Otbetm.substring(0, 2) : "00",   // 근무시작시간
                                OtbetmM: !Common.checkNull(vOtWorkTab1.Otbetm) ? vOtWorkTab1.Otbetm.substring(2, 4) : "00",   // 근무시작시간
                                OtentmT: !Common.checkNull(vOtWorkTab1.Otentm) ? vOtWorkTab1.Otentm.substring(0, 2) : "00",   // 근무종료시간
                                OtentmM: !Common.checkNull(vOtWorkTab1.Otentm) ? vOtWorkTab1.Otentm.substring(2, 4) : "00"    // 근무종료시간
                            })
                        );

                        Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
                    }.bind(this)
                ).then(function () {
                    $.app.byViewId("PriorInputForm").setBusy(false);
                });
            },

            /**
             * @brief 결재라인 추가 버튼 event handler
             */
            pressAddApprovalLine: function() {
                this.oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = null;

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }
        
                this.oController._AddPersonDialog.open();
            },

            /**
             * @brief 공통-사원검색 callback function
             */
            setSelectionTagets: function(data) {
                var vApprovalLines = this.oModel.getProperty("/Detail/List"),
                    oTargetPaths = SearchUser1.oTargetPaths;

                if(vApprovalLines.some(function(elem) { return elem.Apper === data.Pernr; })) {
                    MessageBox.warning(this.oController.getBundleText("MSG_00065")); // 중복된 결재자입니다.
                    return;
                }

                if(Common.checkNull(oTargetPaths)) {
                    // Line add
                    vApprovalLines.push({
                        Aprsq: String(vApprovalLines.length + 1),
                        AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(vApprovalLines.length + 1),  // ${v}차 결재자
                        ApstaT: "",
                        Apper: data.Pernr,
                        Apnam: data.Ename,
                        Aporx: data.Fulln,
                        ApgrdT: data.ZpGradetx
                    });
                    this.oModel.refresh();
                    Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, vApprovalLines.length);
                } else {
                    // Line modify
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apper", data.Pernr);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apnam", data.Ename);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Aporx", data.Fulln);
                    this.oModel.setProperty(oTargetPaths.sPath + "/ApgrdT", data.ZpGradetx);
                }

                this.oController.EmployeeSearchCallOwner = null;
                SearchUser1.oTargetPaths = null;
                SearchUser1.onClose();
            },

            /**
             * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
             */
            openOrgSearchDialog: function (oEvent) {
                SearchOrg.oController = this.oController;
                SearchOrg.vActionType = "Multi";
                SearchOrg.vCallControlId = oEvent.getSource().getId();
                SearchOrg.vCallControlType = "MultiInput";

                if (!this.oOrgSearchDialog) {
                    this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                    $.app.getView().addDependent(this.oOrgSearchDialog);
                }

                this.oOrgSearchDialog.open();
            },

            /**
             * @brief 결재라인 변경 버튼 event handler
             */
            pressApprovalLineModify: function(oEvent) {
                this.oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = {
                    sPath: oEvent.getSource().getBindingContext().getPath()
                };

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }
        
                this.oController._AddPersonDialog.open();
            },

            /**
             * @brief 결재라인 삭제 버튼 event handler
             */
            pressApprovalLineDelete: function(oEvent) {
                this.oModel.setProperty(
                    "/Detail/List",
                    this.oModel.getProperty("/Detail/List")
                        .filter(function(elem) {
                            return elem.Apper !== oEvent.getSource().getBindingContext().getProperty().Apper;
                        })
                        .map(function(elem, idx) {
                            return $.extend(true, elem, { 
                                AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(idx + 1) // ${v}차 결재자
                            });
                        }.bind(this))
                );

                Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
            },

            /**
             * 상세에서 [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernrByDetail: function() {
                this.searchOrgehPernr.call(this.oController, function(o) {
                    if(o.Otype === "O") {
                        MessageBox.warning(this.oController.getBundleText("MSG_32007")); // 사원을 선택하세요.
                        return;
                    }

                    this.oModel.setProperty("/Detail/Header/Pernr", o.Objid);
                    this.oModel.setProperty("/Detail/Header/Ename", o.Stext);
                    this.oModel.setProperty("/Detail/Header/Bukrs3", o.Bukrs3);

                    // 기본정보 조회
                    this.calculationOverWork("X");
                }.bind(this));
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
            searchOrgehPernr: function(callback) {
                this.EmployeeSearchCallOwner = null;
                
                setTimeout(function() {
                    var initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: ""
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            getCheckboxTemplate: function(columnInfo) {

                var oCheckBox = new sap.m.CheckBox({
                    useEntireWidth: true,
                    editable: false,
                    selected: {
                        path: columnInfo.id,
                        formatter: function(v) {
                            return v === "X" ? true : false;
                        }
                    }
                });
        
                oCheckBox.addEventDelegate({
                    onAfterRendering: function() {
                        this.toggleStyleClass("plain-text-mimic", !this.getEditable());
                    }
                }, oCheckBox);

                return oCheckBox;
            }
        };

        return Handler;
    }
);
