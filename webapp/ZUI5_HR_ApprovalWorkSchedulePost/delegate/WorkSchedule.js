sap.ui.define(
    [],
    function () {
        "use strict";

        var WorkSchedule = {
            PRIOR: "1",
            POST: "2",
            /**
             * @typedef {Object} Tab - 탭 구분
             * @property {string} APPROVAL - 결재
             * @property {string} HISTORY - 결재내역
             */
            Tab: {
                APPROVAL: "approval",
                HISTORY: "history"
            },
            /**
            * @typedef {Object} ProcessType - OData호출 구분 값
            * @property {string} APPROVAL - 결재
            * @property {string} HISTORY - 내역
            * @property {string} ACTION - 승인/반려
            */
           ProcessType: {
                APPROVAL: "W",
                HISTORY: "1",
                ACTION: "P"
           },
            /**
             * @typedef {Object} Approval - 진행상태
             * @property {string} SAVE - 저장
             * @property {string} REQUEST - 신청
             * @property {string} REJECT - 반려
             * @property {string} APPROVE - 승인
             */
            Approval: {
                SAVE: "AA",
                REQUEST: "00",
                REJECT: "88",
                APPROVE: "99"
            },
            /**
             * @typedef {Object} Apsta - 진행상태 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            Apsta: {
                CodeT: "022",
                Codty: ""
            }
        };

        return WorkSchedule;
    }
);