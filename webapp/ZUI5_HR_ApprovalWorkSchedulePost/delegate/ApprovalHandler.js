/* eslint-disable no-undef */
/* eslint-disable no-empty */
sap.ui.define(
    [
        "common/Common", //
        "./WorkSchedule",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel",
        "common/moment-with-locales"
    ],
    function (Common, WorkSchedule, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
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
                        Bfchk: WorkSchedule.POST,
                        Pernr: null
                    },
                    List: [],
                    ListSize: 0
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("Pernr"));

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
                var results = ODataService.OvertimeAppConfirmSet.call(
                    this.oController,
                    WorkSchedule.ProcessType.APPROVAL,
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/ListSize", results.OtAppConfirmTab1.length || 0);
                this.oModel.setProperty("/List", results.OtAppConfirmTab1.map(function(elem, idx) {
                    return $.extend(true, elem, { 
                        Idx: ++idx,
                        PlanTime: elem.Beguz ? "${start} ~ ${End}".interpolate(moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm")) : "",
                        InoutTime: elem.Enttm ? "${start} ~ ${End}".interpolate(moment(elem.Enttm.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Outtm.ms).subtract(9, "hours").format("HH:mm")) : "",
                        WorkTime: elem.Wkbuz ? "${start} ~ ${End}".interpolate(moment(elem.Wkbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Wkeuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                        AddTime1: elem.Trbuz ? "${start} ~ ${End}".interpolate(moment(elem.Trbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                        AddTime2: elem.Trbu1 ? "${start} ~ ${End}".interpolate(moment(elem.Trbu1.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treu1.ms).subtract(9, "hours").format("HH:mm")) : ""
                    });
                }));

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

            ProcessOnSuccess: function (data, status) {
                var successMessage = "";
                
                switch (status) {
                    case WorkSchedule.Approval.APPROVE:
                        successMessage = this.oController.getBundleText("MSG_55012"); // 일괄 승인 되었습니다.
                        break;
                    case WorkSchedule.Approval.REJECT:
                        successMessage = this.oController.getBundleText("MSG_55013"); // 일괄 반려 되었습니다.
                        break;
                    default:
                        break;
                }

                MessageBox.success(successMessage, {
                    title: this.oController.getBundleText("LABEL_00149"),
                    onClose: function () {
                        $.app.byId("ApprovalTable").clearSelection();
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
             * @param {string} actionStatus - WorkSchedule.Approval[REJECT|APPROVE]
             */
            callActionProcess: function(actionStatus) {
                BusyIndicator.show(0);

                var payload = {};

                payload.Bfchk = WorkSchedule.POST;
                payload.Pernr = this.oController.getSessionInfoByKey("Pernr");
                payload.OtAppConfirmTab1 = this.oModel.getProperty("/List").filter(function(elem, idx) {
                    return $.app.byId("ApprovalTable").getSelectedIndices().some(function(sIdx) {
                        return sIdx === idx;
                    });
                }).map(function(elem) {
                    return $.extend(true, 
                        Common.copyByMetadata("ZHR_BATCHAPPROVAL_SRV", "entityType", "OvertimeAppConfirmTableIn", elem), 
                        { Status: actionStatus }
                    );
                });

                ODataService.OvertimeAppConfirmSetByProcess.call(
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
                if(!$.app.byId("ApprovalTable").getSelectedIndices().length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                // 일괄 승인 하시겠습니까?
                MessageBox.show(this.oController.getBundleText("MSG_55010"), {
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(action) {
                        if (!action || action === MessageBox.Action.NO) return;
                        else this.callActionProcess.call(this, WorkSchedule.Approval.APPROVE);
                    }.bind(this)
                });
            },

            /**
             * 반려버튼 event handler
             */
            pressRejectBtn: function() {
                if(!$.app.byId("ApprovalTable").getSelectedIndices().length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                // 일괄 반려 하시겠습니까?
                MessageBox.show(this.oController.getBundleText("MSG_55011"), {
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(action) {
                        if (!action || action === MessageBox.Action.NO) return;
                        else this.callActionProcess.call(this, WorkSchedule.Approval.REJECT);
                    }.bind(this)
                });
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
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_55040"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
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
