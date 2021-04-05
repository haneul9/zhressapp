sap.ui.define(
    [],
    function () {
        "use strict";

        var OvertimeWork = {
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
            /**
             * @typedef {Object} MealType - 식사/웰리스 구분
             * @property {string} MEAL - 식사
             * @property {string} WELLIS - 웰리스
             */
            MealType: {
                MEAL: "H",
                WELLIS: "S"
            },
            /**
             * @typedef {Object} ProcessType - OData호출 구분 값
             * @property {string} CODE - 코드조회
             * @property {string} READ - 조회
             * @property {string} UPDATE - 수정
             * @property {string} CREATE - 생성
             * @property {string} DELETE - 삭제
             * @property {string} CANCLE - 취소
             * @property {string} PRIOR - 사전신청(POP-UP)
             */
            ProcessType: {
                CODE: "0",
                READ: "1",
                UPDATE: "2",
                CREATE: "3",
                DELETE: "4",
                CANCLE: "5",
                PRIOR: "6"
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
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.Select": "selectedKey",
                "common.PickOnlyDatePicker": "dateValue"
            }
        };

        return OvertimeWork;
    }
);