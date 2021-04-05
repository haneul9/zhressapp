sap.ui.define(
    [],
    function () {
        "use strict";

        var HRDoc = {
            /**
             * @typedef {Object} DocumentStatus - 문서상태
             * @property {string} NOT_SEND - HASS:미발송, ESS:제출요청
             * @property {string} SEND_COMPLETED - HASS:발송완료
             * @property {string} SUBMISSION_DELAY - 제출지연
             * @property {string} SUBMISSION_COMPLETED - 제출완료
             */
            DocumentStatus: {
                NOT_SEND: "10",
                SEND_COMPLETED: "20",
                SUBMISSION_DELAY: "25",
                SUBMISSION_COMPLETED: "30"
            },
            /**
             * @typedef {Object} ProcessType - [ITmode] HrDocumentsDetailHeaderSet 호출 구분 값
             * @property {string} LIST - 목록 조회
             * @property {string} DETAIL - 상세 조회
             * @property {string} SAVE - 저장
             * @property {string} DELETE - 삭제
             * @property {string} MAIL - 메일발송
             */
            ProcessType: {
                LIST: "0",
                DETAIL: "1",
                SAVE: "2",
                DELETE: "3",
                MAIL: "4"
            },
            /**
             * @typedef {Object} RemindCycle - [Rmprd] Remind 주기
             * @property {string} NONE - 없음
             * @property {string} EVERY_DAY - 매일
             * @property {string} ERVERY_WEEK - 매주
             * @property {string} ERVERY_OTHER_WEEK - 격주
             */
            RemindCycle: {
                NONE: "00",
                EVERY_DAY: "10",
                ERVERY_WEEK: "20",
                ERVERY_OTHER_WEEK: "30"
            },
            ValidateProperties: {
                "sap.m.Input": "value",
                "sap.m.ComboBox": "selectedKey",
                "sap.m.DateRangeSelection": "dateValue"
            }
        };

        return HRDoc;
    }
);