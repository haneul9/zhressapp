sap.ui.define(
    [
        "../../common/Common" //
    ],
    function (Common) {
        "use strict";

        var ODataService = {
            /**
             * 어학/시험 코드 조회
             * 
             * @param {Object} arg
             * @param {string} arg.Code - "1": 어학, "2": 시험
             * @param {string} arg.Lang - Code "2": 어학 코드
             * 
             * @returns {Array<LanguPayApplyF4TableIn>}
             * 
             * @typedef {Object} LanguPayApplyF4TableIn
             * @property {String} Code - 코드
             * @property {String} Text - 코드명
             */
            LanguPayApplyF4ImportSet: function (arg) {
                var ret = [{ Code: "ALL", Text: this.getBundleText("LABEL_00131") }];   // 전체

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/LanguPayApplyF4ImportSet",
                    {
                        IPernr: this.getSessionInfoByKey("Pernr"),
                        ICodeT: arg.Code,
                        ICode: arg.Code === "2" && arg.Lang !== "ALL" ? arg.Lang : "",
                        LanguPayApplyF4TableIn: []
                    },
                    {
                        success: function (oData) {
                            if (oData.LanguPayApplyF4TableIn) 
                                ret = ret.concat(oData.LanguPayApplyF4TableIn.results);
                        },
                        error: function (oResponse) {
                            Common.log(oResponse);
                        }
                    }
                );

                return ret;
            },
            
            /**
             * 어학비 실적 목록 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {object} searchConditions - 조회조건
             * @param {string?} searchConditions.Pernr - 선택된 사원번호
             * @param {string?} searchConditions.Orgeh - 선택된 부서코드
             * @param {date} searchConditions.Begda - 수강기간 시작일
             * @param {Endda} searchConditions.Begda - 수강기간 종료일
             * @param {string} searchConditions.Zlangu - 외국어
             * @param {string} searchConditions.Zltype - 시험
             * 
             * @returns {Array<LanguPayApplyTableIn>} - 근무일정 현황 목록
             * 
             * @typedef {Object} LanguPayApplyTableIn
             * @property {string} Obj1t - 부서명
             * @property {string} Obj2t - 과명
             * @property {string} Gradet - 직급명
             * @property {string} Ename - 성명
             * @property {string} ZlanguTxt - 어학종류
             * @property {Datetime} Lecbe - 수강기간 시작일
             * @property {Datetime} Lecen - 수강기간 종료일
             * @property {string} Zlaorg - 수강학원
             * @property {string} SuportT - 지원금액
             * @property {string} StatusT - 결재상태
             * @property {string} Status - 결재상태 코드
             */
            LanguPayApplySet: function (searchConditions) {
                var ret = [];

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/LanguPayApplySet",
                    {
                        IConType: "1",  // 조회
                        IOdkey: "",
                        IBukrs: this.getSessionInfoByKey("Bukrs2"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IPernr: searchConditions.Pernr ? searchConditions.Pernr : undefined,
                        IOrgeh: searchConditions.Orgeh ? searchConditions.Orgeh : undefined,
                        IBegda: searchConditions.Begda ? Common.adjustGMTOdataFormat(searchConditions.Begda) : undefined,
                        IEndda: searchConditions.Endda ? Common.adjustGMTOdataFormat(searchConditions.Endda) : undefined,
                        IZlangu: (searchConditions.Zlangu !== "ALL") ? searchConditions.Zlangu : undefined,
                        IZltype: (searchConditions.Zltype !== "ALL") ? searchConditions.Zltype : undefined,
                        LanguPayApplyExport: [],
                        LanguPayApplyTableIn: [],
                        LanguPayApplyTableIn3: []
                    },
                    {
                        success: function (data) {
                            if (data.LanguPayApplyTableIn) 
                                ret = data.LanguPayApplyTableIn.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return ret;
            }
        };

        return ODataService;
    }
);
