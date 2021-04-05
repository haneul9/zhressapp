sap.ui.define(
    [],
    function () {
        "use strict";

        var OutLang = {
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
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.Select": "selectedKey",
                "sap.m.ComboBox": "selectedKey",
                "common.PickOnlyDatePicker": "dateValue"
            }
        };

        return OutLang;
    }
);