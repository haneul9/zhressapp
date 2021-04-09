sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        var ODataService = {
            /**
             * 공통코드를 조회한다.
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {object} arg - 조회조건
             * @param {string} arg.CodeT - 상위그룹
             * @param {string} arg.Codty - 하위그룹
             * @param {boolean?} arg.IsContainsAll - 전체 아이템 포함 여부
             * @param {string?} arg.Pernr - 사번
             * @param {string?} arg.Bukrs - 회사코드
             * @param {string?} arg.Molga - 국가 그루핑
             * @param {string?} arg.Langu - 언어
             * 
             * @returns {Array<NavCommonCodeList>} - 코드 목록
             */
            CommonCodeListHeaderSet: function (arg) {
				var results = [];

				$.app.getModel("ZHR_COMMON_SRV").create(
					"/CommonCodeListHeaderSet",
					{
                        IPernr: !Common.checkNull(arg.Pernr) ? arg.Pernr : undefined,
                        IBukrs: !Common.checkNull(arg.Bukrs) ? arg.Bukrs : undefined,
                        IMolga: !Common.checkNull(arg.Molga) ? arg.Molga : undefined,
                        ILangu: !Common.checkNull(arg.Langu) ? arg.Langu : undefined,
						ICodeT: !Common.checkNull(arg.CodeT) ? arg.CodeT : undefined,
						ICodty: !Common.checkNull(arg.Codty) ? arg.Codty : undefined,
						NavCommonCodeList: []
					},
					{
						success: function (data) {
							if (data.NavCommonCodeList) {
                                results = data.NavCommonCodeList.results;
                                
                                if(arg.IsContainsAll) {
                                    results.unshift({ Code: "FL", Text: this.getBundleText("LABEL_00131") });  // 전체
                                }
                            }
						}.bind(this),
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
            },
            
            /**
             * 대상자(부서) 코드 조회
             * 
             * @param {Object} arg 
             * @param {string} arg.Awart
             */
            OvertimePersonSet: function(arg) {
                var results = [];

				$.app.getModel("ZHR_WORKSCHEDULE_SRV").create(
					"/OvertimePersonSet",
					{
                        IDatum: Common.adjustGMTOdataFormat(new Date()),
                        IPernr: this.getSessionInfoByKey("Pernr"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IOrgeh: this.getSessionInfoByKey("Orgeh"),
                        IWerks: this.getSessionInfoByKey("Persa"),
                        IBukrs: this.getSessionInfoByKey("Bukrs2"),
                        IBukrsG: this.getSessionInfoByKey("Bukrs"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        IAwart: !Common.checkNull(arg.Awart) ? arg.Awart : undefined,
						OtPersonNav: []
					},
					{
						success: function (data) {
							if (data.OtPersonNav)
                                results = data.OtPersonNav.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
            },

            /**
             * 연장근무 신청내역 목록 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {object} arg - 검색조건
             * @param {string} arg.Pernr - 사번
             * @param {string?} arg.Orgeh - 부서
             * @param {Date?} arg.Begda - 시작일
             * @param {Date?} arg.Endda - 종료일
             * @param {string?} arg.Status1 - 진행상태
             * 
             * @returns {Array<OvertimeList>}
             */
            OvertimeListSet: function (arg) {
                var results = [];

                $.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
                    "/OvertimeListSet",
                    {
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : undefined,
                        IBegda: arg.Begda ? Common.adjustGMTOdataFormat(arg.Begda) : undefined,
                        IEndda: arg.Endda ? Common.adjustGMTOdataFormat(arg.Endda) : undefined,
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IStatus: arg.Status1 ? arg.Status1 : undefined,
                        NavOtList1: []
                    },
                    {
                        success: function (data) {
                            if(data.NavOtList1) 
                                results = data.NavOtList1.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },

            /**
             * 연장근무 crud
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(OvertimeWork.ProcessType[CREATE|UPDATE|DELETE]) 
             * @param {Object} payload - Create entity
             * @param {Array<OvertimeApply>} payload.OvertimeApply - 대상자 목록
             * @param {Function} success - 성공 callback
             * @param {Function} error - 실패 callback
             */
            OvertimeApplySetByProcess: function (processType, payload, success, error) {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

                oModel.create(
                    "/OvertimeApplySet",
                    {
                        IConType: processType,
                        IBukrs: this.getSessionInfoByKey("Bukrs2"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IDatum: Common.adjustGMTOdataFormat(new Date()),
                        NavOtApply1: payload.OvertimeApply
                    },
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data, processType);
                        },
                        error: function (res) {
                            if (typeof error === "function") error.call(null, res);
                        }
                    }
                );
            }
        };

        return ODataService;
    }
);

 /**
 * @typedef {Object} NavCommonCodeList
 * @property {string} Code - 코드
 * @property {string} Text - 코드명
 * 
 * @typedef {Object} OvertimeList
 * @property {Edm.String} Pernr - 사원 번호
 * @property {Edm.String} Subty - 하위 유형
 * @property {Edm.String} Objps - 오브젝트 ID
 * @property {Edm.String} Sprps - 잠금 지시자
 * @property {Edm.DateTime} Endda - 종료일
 * @property {Edm.DateTime} Begda - 시작일
 * @property {Edm.String} Seqnr - IT 레코드 번호
 * @property {Edm.String} Ename - 사원/지원자이름
 * @property {Edm.String} Beguz - 시작시간
 * @property {Edm.String} Enduz - 종료시간
 * @property {Edm.Boolean} Vtken - 전일
 * @property {Edm.String} Awart - 근무/휴무 유형
 * @property {Edm.Decimal} Abwtg - 근무/휴무 일수
 * @property {Edm.Decimal} Abrtg - 급여일수
 * @property {Edm.Decimal} Abrst - 급여 계산 시간
 * @property {Edm.Decimal} Kaltg - 달력일수
 * @property {Edm.Decimal} Stdaz - 근무시간
 * @property {Edm.DateTime} AppDate - 결재일
 * @property {Edm.String} AppName - 결재자사번
 * @property {Edm.String} Status - 결재
 * @property {Edm.DateTime} AppDate1 - 결재일
 * @property {Edm.String} AppName1 - 결재자사번
 * @property {Edm.String} Status1 - 결재
 * @property {Edm.String} Repla - 대상자
 * @property {Edm.String} Jobco - 작업내용
 * @property {Edm.String} Call - 호출
 * @property {Edm.String} Appkey - 결재키
 * @property {Edm.String} Atext - A/A 유형 텍스트
 * @property {Edm.String} Stext - 결재(status) text
 * @property {Edm.String} Stext1 - 결재(status) text
 * @property {Edm.String} UrlA - 텍스트
 * @property {Edm.String} UrlA1 - 텍스트
 * @property {Edm.String} Appkey1 - 결재키
 * @property {Edm.String} Comment - 비고
 * @property {Edm.String} Rowid - Web Row ID
 * @property {Edm.Decimal} Wtm40 - 주40시간
 * @property {Edm.Decimal} Wtm12 - 주12시간
 * @property {Edm.Decimal} Wtsum - 계
 * @property {Edm.Decimal} Wtavg - 주평균
 * @property {Edm.String} Frchk - 선택적근무제 사전신청(X/SAPCE)
 * @property {Edm.String} IPernr - 사원 번호
 * @property {Edm.String} IOrgeh - 조직 단위
 * @property {Edm.DateTime} IBegda - 시작일
 * @property {Edm.DateTime} IEndda - 종료일
 * @property {Edm.String} ILangu - 언어
 * @property {Edm.String} IStatus - 담당자결재상태
 * 
 * @typedef {Object} OvertimeApply
 * @property {Edm.String} Pernr - 사원 번호
 * @property {Edm.String} Subty - 하위 유형
 * @property {Edm.String} Objps - 오브젝트 ID
 * @property {Edm.String} Sprps - 잠금 지시자
 * @property {Edm.DateTime} Endda - 종료일
 * @property {Edm.DateTime} Begda - 시작일
 * @property {Edm.String} Seqnr - IT 레코드 번호
 * @property {Edm.String} Ename - 사원/지원자이름
 * @property {Edm.Time} Beguz - 시작 시간
 * @property {Edm.Time} Enduz - 종료 시간
 * @property {Edm.Boolean} Vtken - 전일
 * @property {Edm.String} Awart - 근무/휴무 유형
 * @property {Edm.Decimal} Abwtg - 근무/휴무 일수
 * @property {Edm.Decimal} Abrtg - 급여일수
 * @property {Edm.Decimal} Abrst - 급여 계산 시간
 * @property {Edm.Decimal} Kaltg - 달력일수
 * @property {Edm.Decimal} Stdaz - 근무시간
 * @property {Edm.DateTime} AppDate - 결재일
 * @property {Edm.String} AppName - 결재자사번
 * @property {Edm.String} Status - 결재
 * @property {Edm.DateTime} AppDate1 - 결재일
 * @property {Edm.String} AppName1 - 결재자사번
 * @property {Edm.String} Status1 - 결재
 * @property {Edm.String} Repla - 대상자
 * @property {Edm.String} Jobco - 작업내용
 * @property {Edm.String} Call - 호출
 * @property {Edm.String} Appkey - 결재키
 * @property {Edm.String} Atext - A/A 유형 텍스트
 * @property {Edm.String} Stext - 결재(status) text
 * @property {Edm.String} Stext1 - 결재(status) text
 * @property {Edm.String} UrlA - 텍스트
 * @property {Edm.String} UrlA1 - 텍스트
 * @property {Edm.String} Appkey1 - 결재키
 * @property {Edm.String} Comment - 비고
 * @property {Edm.String} Rowid - Web Row ID
 * @property {Edm.Decimal} Wtm40 - 주40시간
 * @property {Edm.Decimal} Wtm12 - 주12시간
 * @property {Edm.Decimal} Wtsum - 계
 * @property {Edm.Decimal} Wtavg - 주평균
 * @property {Edm.String} Frchk - 선택적근무제 사전신청(X/SAPCE)
 * @property {Edm.String} IOrgeh - 조직 단위
 * @property {Edm.String} IConType - 처리구분
 * @property {Edm.String} IBukrs - 회사 코드
 * @property {Edm.String} ILangu - 언어
 * @property {Edm.String} IMolga - 국가 그루핑
 * @property {Edm.DateTime} IDatum - 일자
 * @property {Edm.String} IEmpid - 신청자
 * @property {Edm.String} EAppurl - [미사용]
 * @property {Edm.String} ERetcode - 메시지 유형
 * @property {Edm.String} ERettext - 메시지 텍스트
 * @property {Edm.String} IRecall - RETCODE = 'I'로 받고 다시 본 함수를 실행할 경우 'X'
 */
