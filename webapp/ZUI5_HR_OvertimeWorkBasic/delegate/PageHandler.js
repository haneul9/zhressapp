sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "common/ApprovalLinesHandler",
        "./OvertimeWork",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, ApprovalLinesHandler, OvertimeWork, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oDetailDialog: null,
            oApprovalDialog: null,
            
            Model: function () {
                return this.oModel;
            },

            getDetailDialog: function() {
                return this.oDetailDialog;
            },

            getApprovalDialog: function() {
                return this.oApprovalDialog;
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
                    IsPossibleExcelButton: false,   // 엑셀 버튼 활성화 여부
                    SearchConditions: { // 검색조건
                        Pernr: null,
                        Orgeh: null,
                        EnameOrOrgehTxt: null,
                        Begda: null,
                        Endda: null,
                        Apstat: null
                    },
                    List: [],       // 목록
                    ApprStats: [],  // 진행상태
                    Detail: {}      // 상세
                });

                return this;
            },

            load: function () {
                var currDate = new Date();

                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Status1", "FL");
                this.oModel.setProperty("/SearchConditions/Begda", new Date(currDate.getFullYear(), currDate.getMonth(), 1));
                this.oModel.setProperty("/SearchConditions/Endda", new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0));
                if($.app.getAuth() === $.app.Auth.ESS && (this.oController.getSessionInfoByKey("Zflag") === "X" || this.oController.getSessionInfoByKey("Zshft") === "X")) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                }

                this.oModel.setProperty(
                    "/ApprStats", 
                    ODataService.CommonCodeListHeaderSet.call(this.oController, {
                        IsContainsAll: true,
                        Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                        CodeT: OvertimeWork.ApprStat.CodeT,
                        Codty: OvertimeWork.ApprStat.Codty
                    })
                );

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
                var results = ODataService.OvertimeListSet.call(
                    this.oController, 
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/List", results);

                $.app.byId("ApprovalTable").setFirstVisibleRow(0);
                $.app.byId("ApprovalTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byId("ApprovalTable"));
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
					MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Beguz", "Enduz"),
					workbook: {columns: Common.convertColumnArrayForExcel(this.oController, $.app.getView().getColumnModel.call(this))},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_32001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
            },

            /**
             * @brief 목록 row Click event handler
             * 
             * @param rowData
             */
            pressSelectRowDetail: function (oEvent) {
                var columnId = oEvent.getParameter("columnId"),
                p = columnId ? oEvent.getParameter("rowBindingContext").getProperty() : oEvent.getSource().getBindingContext().getProperty();

                if (p.Status1 !== "AA" && columnId === "ApprovalTableStext1" && p.UrlA1) { // 결재상태
                    Common.openPopup.call(this.oController, p.UrlA1);
                } else {
                    this.loadApprovalDetail(p);
                }
            },

            loadApprovalDetail: function(rowData) {
                this.oModel.setProperty("/Detail", $.extend(true, {}, rowData));

                this.openDetailDialog();
            },

            pressSmoinLink: function(oEvent) {
                Common.openPopup.call(this.oController, oEvent.getSource().data("url"));
            },
            
            /**
             * 신청 버튼 event
             * 
             * @this {Handler}
             */
            pressChangeApprovalBtn: function() {
                if (!this.oApprovalDialog) {
                    this.oApprovalDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Approval"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oApprovalDialog);
                }

                this.oApprovalDialog.open();
            },

            openDetailDialog: function() {
                if (!this.oDetailDialog) {
                    this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Detail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDetailDialog);
                }

                this.oDetailDialog.open();
            },

            ProcessOnSuccess: function (data, conType) {
                
                switch (conType) {
                    case OvertimeWork.ProcessType.UPDATE:
                        if(data.ERetcode === "E") {
                            MessageBox.error(data.ERettext, {
                                title: this.oController.getBundleText("LABEL_00149")
                            });
                        } else {
                            // s모인 결재창을 띄운다.
                            if(data.EAppurl) {
                                Common.openPopup.call(this.oController, data.EAppurl);
                            }

                            // 목록 조회
                            this.search();

                            this.getDetailDialog().close();
                        }

                        break;
                    case OvertimeWork.ProcessType.DELETE:
                        MessageBox.success(this.oController.getBundleText("MSG_00021"), {   // 삭제되었습니다.
                            title: this.oController.getBundleText("LABEL_00149"),
                            onClose: function () {
                                // 목록 조회
                                this.search();

                                this.getDetailDialog().close();
                            }.bind(this)
                        });

                        break;
                    default:
                        break;
                }

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
             * @brief 상세팝업 신청 버튼 handler
             */
            pressApprovalBtn: function() {
                if(Common.isExternalIP()) {
                    setTimeout(function() {
                        var initData = {
                            Mode: "P",
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Empid: this.oController.getSessionInfoByKey("Pernr"),
                            Bukrs: this.oController.getSessionInfoByKey("Bukrs3"),
                            ZappSeq: "27"
                        },
                        callback = function(o) {
                            this.onRequest.call(this, o);
                        }.bind(this);
            
                        this.oController.ApprovalLinesHandler = ApprovalLinesHandler.get(this.oController, initData, callback);
                        DialogHandler.open(this.oController.ApprovalLinesHandler);
                    }.bind(this), 0);
                } else {
                    this.onRequest.call(this, null);
                }
            },

            onRequest: function(vAprdatas) {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.OvertimeApply = [Common.copyByMetadata(oModel, "OvertimeApply", oInputData)];
                    payload.OvertimeApplyTab = vAprdatas || [];

                    ODataService.OvertimeApplySetByProcess.call(
                        this.oController, 
                        OvertimeWork.ProcessType.UPDATE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                var confirmMessage = Common.isExternalIP()
                    ? this.oController.getBundleText("MSG_00060")   // 신청하시겠습니까?
                    : this.oController.getBundleText("MSG_31010");  // S모인 결재창으로 이동해 결재를 진행하셔야 합니다.\n진행하시겠습니까?

                MessageBox.show(confirmMessage, {
                    // S모인 결재창으로 이동해 결재를 진행하셔야 합니다.\n진행하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * @brief 상세팝업 삭제 버튼 handler
             */
            pressCancelApprovalBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.OvertimeApply = [Common.copyByMetadata(oModel, "OvertimeApply", oInputData)];

                    ODataService.OvertimeApplySetByProcess.call(
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

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
            searchOrgehPernr: function() {
                setTimeout(function() {
                    var oModel = this.getPageHandler().Model(),
                        initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                            Zflag: true,
                            Zshft: true
                        },
                        callback = function(o) {
                            if(o.Otype === "P" && o.Zshft !== "X" && o.Zflag !== "X") {
                                MessageBox.warning(this.oController.getBundleText("MSG_31015")); // 사무직은 선택할 수 없습니다.
                                return;
                            }

                            oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            getLinkMimicTemplate: function(columnInfo) {

                return new sap.m.Text({
                    textAlign: sap.ui.core.HorizontalAlign.Center,
                    text: {
                        parts: [
                            { path: columnInfo.id },
                            { path: "Status1" },
                            { path: "UrlA1" }
                        ],
                        formatter: function(v, Status1, UrlA1) {
                            this.toggleStyleClass("mimic-link", Status1 !== "AA" && !!UrlA1);
                            return v;
                        }
                    }
                });
            }
        };

        return Handler;
    }
);
