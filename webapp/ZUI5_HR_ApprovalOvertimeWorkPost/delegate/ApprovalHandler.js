/* eslint-disable no-empty */
sap.ui.define(
    [
        "../../common/Common", //
        "./OvertimeWork",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, OvertimeWork, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oReasonDialog: null,
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
                        Aftck: OvertimeWork.POST,
                        Begda: null,
                        Endda: null
                    },
                    List: [],
                    ListSize: 0,
                    Rjres: ""     // 반려사유
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Begda", new Date(1800, 0, 1));
                this.oModel.setProperty("/SearchConditions/Endda", new Date(9999, 12, 0));

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
                var results = ODataService.OtworkConfirmSet.call(
                    this.oController,
                    OvertimeWork.ProcessType.APPROVAL,
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/ListSize", results.OtConfirmNav.length || 0);
                this.oModel.setProperty("/List", results.OtConfirmNav.map(function(elem, idx) {
                    return $.extend(true, elem, { Idx: ++idx });
                }));

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

            ProcessOnSuccess: function (data, status) {
                var successMessage = "";
                
                switch (status) {
                    case OvertimeWork.Approval.APPROVE:
                        successMessage = this.oController.getBundleText("MSG_32022"); // 일괄 승인 되었습니다.
                        break;
                    case OvertimeWork.Approval.REJECT:
                        successMessage = this.oController.getBundleText("MSG_32023"); // 일괄 반려 되었습니다.
                        break;
                    default:
                        break;
                }

                MessageBox.success(successMessage, {
                    title: this.oController.getBundleText("LABEL_00149"),
                    onClose: function () {
                        $.app.byViewId("ApprovalTable").clearSelection();
                        this.search();
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
             * @brief 신청/반려 프로세스 호출
             * 
             * @param {string} actionStatus - OvertimeWork.Approval[REJECT|APPROVE]
             */
            callActionProcess: function(actionStatus) {
                BusyIndicator.show(0);

                var payload = {};

                payload.Aftck = OvertimeWork.POST;
                payload.Pernr = this.oController.getSessionInfoByKey("Pernr");
                payload.OtConfirmNav = this.oModel.getProperty("/List").filter(function(elem, idx) {
                    return $.app.byViewId("ApprovalTable").getSelectedIndices().some(function(sIdx) {
                        return sIdx === idx;
                    });
                }).map(function(elem) {
                    return $.extend(true, 
                        Common.copyByMetadata("ZHR_BATCHAPPROVAL_SRV", "entityType", "OtworkConfirmTableIn", elem), 
                        { 
                            Status1: actionStatus,
                            Rjres: (actionStatus === OvertimeWork.Approval.REJECT) ? this.oModel.getProperty("/Rjres") : null
                        }
                    );
                }.bind(this));

                ODataService.OtworkConfirmSetByProcess.call(
                    this.oController,
                    actionStatus,
                    payload, 
                    this.ProcessOnSuccess.bind(this), 
                    this.ProcessOnFail.bind(this)
                );
            },

            /**
             * 신청버튼 event handler
             */
            pressApproveBtn: function() {
                if(!$.app.byViewId("ApprovalTable").getSelectedIndices().length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                // 일괄 승인 하시겠습니까?
                MessageBox.show(this.oController.getBundleText("MSG_32019"), {
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(action) {
                        if (!action || action === MessageBox.Action.NO) return;
                        else this.callActionProcess.call(this, OvertimeWork.Approval.APPROVE);
                    }.bind(this)
                });
            },

            /**
             * 반려버튼 event handler
             */
            pressRejectBtn: function() {
                if(!$.app.byViewId("ApprovalTable").getSelectedIndices().length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                // 일괄 반려 하시겠습니까?
                MessageBox.show(this.oController.getBundleText("MSG_32020"), {
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(action) {
                        if (!action || action === MessageBox.Action.NO) return;
                        else this.openRejectReasonDialog.call(this);
                    }.bind(this)
                });
            },

            /**
             * 반려사유 dialog open
             */
            openRejectReasonDialog: function() {
                this.oModel.setProperty("/Rjres", "");

                if(!this.oReasonDialog) {
                    this.oReasonDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "reason"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oReasonDialog);
                }

                this.oReasonDialog.open();
            },

            /**
             * 반려사유 dialog 반려 버튼 event handler
             */
            pressConfirmRejectReasonBtn: function() {
                this.callActionProcess.call(this, OvertimeWork.Approval.REJECT);
                this.oReasonDialog.close();
            },

            pressExcelDownloadBtn: function() {
				var aTableDatas = this.oModel.getProperty("/List");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
                }
                
				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Entbg", "Enten", "Otbet", "Otent"),
					workbook: {columns: this.aColumnModel},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_32049"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
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
