sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./OvertimeWork",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, OvertimeWork, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
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
                if($.app.getAuth() === $.app.Auth.MSS) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
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

                $.app.byViewId("ApprovalTable").setFirstVisibleRow(0);
                $.app.byViewId("ApprovalTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("ApprovalTable"));
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
            pressSelectRowDetail: function (rowData) {
                this.loadApprovalDetail(rowData);
            },

            loadApprovalDetail: function(rowData) {
                this.oModel.setProperty("/Detail", $.extend(true, {}, rowData));

                this.openDetailDialog();
            },

            pressSmoinLink: function(oEvent) {
                this.openSmoinUrl(oEvent.getSource().data("url"));
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
                            this.openSmoinUrl(data.EAppurl);

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
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.OvertimeApply = [Common.copyByMetadata(oModel, "OvertimeApply", oInputData)];

                    ODataService.OvertimeApplySetByProcess.call(
                        this.oController, 
                        OvertimeWork.ProcessType.UPDATE,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_31010"), {
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

            openSmoinUrl: function(smoinUrl) {
                if(!smoinUrl) return;

                setTimeout(function() {
                    var width = 1000, height = screen.availHeight * 0.9,
                    left = (screen.availWidth - width) / 2,
                    top = (screen.availHeight - height) / 2,
                    popup = window.open(smoinUrl, "smoin-approval-popup", [
                        "width=" + width,
                        "height=" + height,
                        "left=" + left,
                        "top=" + top,
                        "status=yes,resizable=yes,scrollbars=yes"
                    ].join(","));

                    setTimeout(function() {
                        popup.focus();
                    }, 500);
                }, 0);
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
                            Mssty: ""
                        },
                        callback = function(o) {
                            oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            getSmoinLink: function(columnInfo, oController) {
                var PageHandler = oController.getPageHandler();

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.Center,
                    items: [
                        new sap.m.Text({ 
                            text: "{Stext1}",
                            textAlign: sap.ui.core.TextAlign.Center,
                            visible: {
                                path: "Status1",
                                formatter: function(v) {
                                    return v === OvertimeWork.Approval.NONE ? true : false;
                                }
                            }
                        }),
                        new sap.m.Link({
                            text: "{Stext1}",
                            textAlign: sap.ui.core.TextAlign.Center,
                            press: PageHandler.pressSmoinLink.bind(PageHandler),
                            visible: {
                                path: "Status1",
                                formatter: function(v) {
                                    return v === OvertimeWork.Approval.NONE ? false : true;
                                }
                            },
                            customData: [
                                new sap.ui.core.CustomData({key : "url", value : "{UrlA1}"})
                            ]
                        })
                    ]
                });
            }
        };

        return Handler;
    }
);
