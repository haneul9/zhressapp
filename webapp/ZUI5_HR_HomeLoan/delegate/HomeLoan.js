sap.ui.define(
    [],
    function () {
        "use strict";

        var HomeLoan = {
            /**
             * @typedef {Object} Tab - 탭 구분
             * @property {string} APPROVAL - 신청내역 탭
             * @property {string} HISTORY - 대출내역 탭
             */
            Tab: {
                APPROVAL: "approval",
                HISTORY: "history"
            },
            /**
             * @typedef {Object} Approval - 결재 상태
             * @property {string} NONE - 미결재
             * @property {string} IN_MANAGER - 담당자확인
             * @property {string} IN_PROCESS - 결재중
             * @property {string} REJECT - 반려
             * @property {string} DONE - 결재완료
             */
            Approval: {
                NONE: "AA",
                IN_MANAGER: "90",
                IN_PROCESS: "00",
                REJECT: "88",
                DONE: "99"
            },
            ProcessType: {
                LIST: "0",  // 리스트
                DETAIL: "1",  // 상세조회
                SAVE: "2",  // 저장
                APPROVAL: "3",  // 신청
                DELETE: "4",  // 삭제
                HISTORY: "5"  // 대출내역
            },
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.Select": "selectedKey",
                "common.PickOnlyDatePicker": "dateValue"
            }
        };

        return HomeLoan;
    }
);