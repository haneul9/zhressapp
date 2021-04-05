sap.ui.define(
    [],
    function () {
        "use strict";

        var OvertimeWork = {
            /**
             * @typedef {Object} ProcessType - OData호출 구분 값
             * @property {string} READ - 조회
             * @property {string} UPDATE - 수정
             * @property {string} CREATE - 생성
             * @property {string} DELETE - 삭제
             */
            ProcessType: {
                READ: "1",
                UPDATE: "2",
                CREATE: "3",
                DELETE: "4"
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
             * @typedef {Object} ApprStat - 결재상태 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            ApprStat: {
                CodeT: "022",
                Codty: "AA"
            },
            /**
             * @typedef {Object} Awart - OT종류 조회 키
             * @property {string} CodeT
             * @property {string} Codty
             */
            Awart: {
                CodeT: "003",
                Codty: "2002"
            },
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.TimePicker": "value",
                "sap.m.ComboBox": "selectedKey",
                "sap.m.Select": "selectedKey",
                "common.PickOnlyDatePicker": "dateValue"
            }
        };

        return OvertimeWork;
    }
);