sap.ui.define(
    [],
    function () {
        "use strict";

        var WorkSchedule = {
            PRIOR: "1",
            POST: "2",
            /**
             * @typedef {Object} Tab - 탭 구분
             * @property {string} PRIOR - 사전신청내역 탭
             * @property {string} POST - 사후신청내역 탭
             */
            Tab: {
                PRIOR: "priorApproval",
                POST: "postApproval"
            },
            ProcessType: {
                CODE: "Q",
                READ: "1",
                SAVE: "3",
                APPROVE: "C",
                APPROVE_CANCEL: "J",
                DELETE: "4"
            },
            /**
             * @typedef {Object} ApprStat - 결재상태 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            ApprStat: {
                CodeT: "022",
                Codty: ""
            },
            Tprogs: {
                CodeT: "050",
                Codty: ""
            },
            Faprss: {
                CodeT: "051",
                Codty: "P"
            },
            /**
             * @typedef {Object} Approval - 결재 상태
             * @property {string} NONE - 저장
             * @property {string} IN_PROCESS - 신청
             * @property {string} REJECT - 반려
             * @property {string} DONE - 승인
             */
            Approval: {
                NONE: "AA",
                IN_PROCESS: "00",
                REJECT: "88",
                DONE: "99"
            },
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.Select": "selectedKey",
                "sap.m.ComboBox": "selectedKey",
                "common.PickOnlyDatePicker": "dateValue"
            }
        };

        return WorkSchedule;
    }
);