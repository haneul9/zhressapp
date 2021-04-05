sap.ui.define(
    [],
    function () {
        "use strict";

        var SubstituteWork = {
            /**
             * @typedef {Object} Tab - 탭 구분
             * @property {string} STATUS - 현황 탭
             * @property {string} APPROVAL - 신청내역 탭
             */
            Tab: {
                STATUS: "StatusList",
                APPROVAL: "Approval"
            },
            /**
             * @typedef {Object} ProcessType - OData호출 구분 값
             * @property {string} READ_STATUS - 현황 조회
             * @property {string} READ_APPROVAL - 변경신청내역 조회
             * @property {string} DETAIL - 변경신청 상세조회
             * @property {string} APPROVAL_REQUEST - 신청
             * @property {string} APPROVAL_CANCEL - 신청취소
             */
            ProcessType: {
                READ_STATUS: "1",
                READ_APPROVAL: "2",
                DETAIL: "3",
                APPROVAL_REQUEST: "4",
                APPROVAL_CANCEL: "5"
            },
            /**
             * @typedef {Object} Approval - 결재 상태
             * @property {string} NONE - 미결재
             * @property {string} IN_PROCESS - 결재중
             * @property {string} REJECT - 반려
             * @property {string} DONE - 결재완료
             */
            Approval: {
                NONE: "AA",
                IN_PROCESS: "00",
                REJECT: "88",
                DONE: "99"
            },
            /**
             * @typedef {Object} Tprog - 근무일정 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            Tprog: {
                CodeT: "050",
                Codty: null
            },
            /**
             * @typedef {Object} Reqrs - 신청사유 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            Reqrs: {
                CodeT: "065",
                Codty: null
            },
            /**
             * @typedef {Object} ApprStat - 결재상태 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            ApprStat: {
                CodeT: "004",
                Codty: "ZHRD_OK_G"
            }
        };

        return SubstituteWork;
    }
);