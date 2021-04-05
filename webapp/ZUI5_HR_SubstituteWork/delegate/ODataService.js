/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "./SubstituteWork",
        "common/moment-with-locales"
    ],
    function (Common, SubstituteWork) {
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
                                    results.unshift({ Code: "ALL", Text: this.getBundleText("LABEL_00131") });  // 전체
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
             * 대체근무 현황 목록 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(SubstituteWork.ProcessType[READ_STATUS|READ_APPROVAL|DETAIL]) 
             * @param {object} arg - 검색조건
             * @param {string} arg.Pernr - 사번
             * @param {string?} arg.Orgeh - 부서
             * @param {string?} arg.Tprog - 근무일정
             * @param {Date?} arg.Begda - 시작일
             * @param {Date?} arg.Endda - 종료일
             * @param {string?} arg.Apstat - 결재상태
             * @param {string?} arg.OrgDn - 하위조직 포함여부
             * @param {string?} arg.Appkey - 결재번호
             * 
             * @returns {Array<AlterWorkApplyStatus>|Object} - 대체근무 현황 목록
             */
            AlterWorkApplyHeaderSet: function (processType, arg) {
                var results = [];

                $.app.getModel("ZHR_WORKSCHEDULE_SRV").create(
                    "/AlterWorkApplyHeaderSet",
                    {
                        IOdkey: "",
                        IConType: processType,
                        IBukrs: this.getSessionInfoByKey("Bukrs2"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IAppkey1: arg.Appkey ? arg.Appkey : undefined,
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : undefined,
                        ITprog: (arg.Tprog && arg.Tprog !== "ALL") ? arg.Tprog : "",
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        IEndda: arg.Endda ? moment(arg.Endda).hours(10).toDate() : undefined,
                        IApstat: arg.Apstat ? arg.Apstat : undefined,
                        IOrgDn: arg.OrgDn === true ? "X" : "",
                        AlterWorkApply: [],
                        AlterWorkApplyOutline: [],
                        AlterWorkApplyStatus: []
                    },
                    {
                        success: function (data) {
                            switch(processType) {
                                case SubstituteWork.ProcessType.READ_STATUS:
                                    if (data.AlterWorkApplyStatus) {
                                        results = data.AlterWorkApplyStatus.results;
                                    }
                                    break;
                                case SubstituteWork.ProcessType.READ_APPROVAL:
                                    if (data.AlterWorkApply) {
                                        results = data.AlterWorkApply.results;
                                    }
                                    break;
                                case SubstituteWork.ProcessType.DETAIL:
                                    results = {};
                                    results.EAppurl = data.EAppurl;
                                    if (data.AlterWorkApplyOutline) {
                                        results.AlterWorkApplyOutline = data.AlterWorkApplyOutline.results[0];
                                    }
                                    if (data.AlterWorkApply) {
                                        results.AlterWorkApply = data.AlterWorkApply.results;
                                    }
                                    break;
                            }
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },

            /**
             * 대체근무 신청/신청취소
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(SubstituteWork.ProcessType[APPROVAL_REQUEST|APPROVAL_CANCEL]) 
             * @param {Object} payload - Create entity
             * @param {string} payload.Appkey1 - 결재번호
             * @param {string} payload.Pernr - 사번
             * @param {Array<AlterWorkApply>} payload.AlterWorkApply - 대상자 목록
             * @param {Function} success - 성공 callback
             * @param {Function} error - 실패 callback
             */
            AlterWorkApplyHeaderSetByProcess: function (processType, payload, success, error) {
                var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");

                oModel.create(
                    "/AlterWorkApplyHeaderSet",
                    {
                        IOdkey: "",
                        IConType: processType,
                        IBukrs: this.getSessionInfoByKey("Bukrs2"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IAppkey1: payload.Appkey1 ? payload.Appkey1 : undefined,
                        IPernr: payload.Pernr ? payload.Pernr : undefined,
                        AlterWorkApply: payload.AlterWorkApply
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
 * @typedef {Object} SubstituteWork.ProcessType
 * @property {string} READ_STATUS - 현황 조회
 * @property {string} READ_APPROVAL - 변경신청내역 조회
 * @property {string} DETAIL - 변경신청 상세조회
 * @property {string} APPROVAL_REQUEST - 신청
 * @property {string} APPROVAL_CANCEL - 신청취소
 * 
 * @typedef {Object} NavCommonCodeList
 * @property {string} Code - 코드
 * @property {string} Text - 코드명
 * 
 * @typedef {Object} AlterWorkApplyStatus
 * @property {string} Zappkey - 결재키
 * @property {string} Pernr - 사원 번호
 * @property {DateTime} Appdt - 신청일
 * @property {string} Seqnr - IT 레코드 번호
 * @property {DateTime} Begda - 시작일
 * @property {DateTime} Endda - 종료일
 * @property {string} Tprog - 일일 근무 일정
 * @property {string} Ttext - 일일 WS 텍스트
 * @property {string} TprogB - 일일 근무 일정
 * @property {string} TtextB - 일일 WS 텍스트
 * @property {string} Reqrs - 신청사유
 * @property {string} ReqrsTxt - 신청사유 텍스트
 * @property {string} Reqtx - 신청사유상세
 * @property {string} Rejtx - 담당자 반려사유
 * @property {string} Infotype - 인포타입반영완료
 * @property {string} Ename - 사원/지원자이름
 * @property {string} Orgtx - Full name
 * @property {string} PGradeTxt - 직급명
 * @property {string} Limday - 신청한도일수
 * @property {string} Appnm - Apply Number
 * @property {string} Appkey1 - 결재키
 * @property {DateTime} ApplyDt1 - 요청일
 * @property {Time} ApplyTm1 - 신청시간
 * @property {string} ApplyNm1 - 요청자
 * @property {DateTime} AppDate1 - 결재일
 * @property {Time} AppTime1 - 결재시간
 * @property {string} AppName1 - 결재자사번
 * @property {string} Status1 - 결재
 * @property {string} Appkey - 결재키
 * @property {DateTime} ApplyDt - 요청일
 * @property {Time} ApplyTm - 신청시간
 * @property {string} ApplyNm - 요청자
 * @property {DateTime} AppDate - 결재일
 * @property {Time} AppTime - 결재시간
 * @property {string} AppName - 결재자사번
 * @property {string} Status - 결재상태(확인필요)
 * @property {string} Comty - 승인완료
 * @property {string} KostlP - 코스트 센터(결재용)
 * @property {string} OrgehP - 조직코드(결재용)
 * @property {string} IOdkey - OData Key
 * @property {string} IPernr - 사원 번호
 * @property {string} IOrgeh - 조직 단위
 * @property {DateTime} IBegda - 시작일
 * @property {DateTime} IEndda - 종료일
 * @property {string} IConType - 처리구분
 * @property {string} IBukrs - 회사 코드
 * @property {string} ILangu - 언어
 * @property {string} IMolga - 국가 그루핑
 * @property {DateTime} IDatum - 일자
 * @property {string} IEmpid - 신청자
 * @property {string} IOrgDn - 'X'.하위조직 포함
 * @property {string} ITprog - 일일 근무 일정
 * @property {string} IDialogMode - Operation Dialog mode
 * @property {string} IApstat - 결재상태(확인필요)
 * @property {string} IAppkey1 - 결재키
 * @property {string} EAppurl - [미사용]
 * @property {string} ERetcode - 메시지 유형
 * @property {string} ERettext - 메시지 텍스트
 * 
 * @typedef {Object} AlterWorkApply
 * @property {string} Zappkey - 결재키
 * @property {string} Pernr - 사원 번호
 * @property {DateTime} Appdt - 신청일
 * @property {string} Seqnr - IT 레코드 번호
 * @property {DateTime} Begda - 시작일
 * @property {DateTime} Endda - 종료일
 * @property {string} Tprog - 일일 근무 일정
 * @property {string} Ttext - 일일 WS 텍스트
 * @property {string} TprogB - 일일 근무 일정
 * @property {string} TtextB - 일일 WS 텍스트
 * @property {string} Reqrs - 신청사유
 * @property {string} ReqrsTxt - 신청사유 텍스트
 * @property {string} Reqtx - 신청사유상세
 * @property {string} Rejtx - 담당자 반려사유
 * @property {string} Infotype - 인포타입반영완료
 * @property {string} Ename - 사원/지원자이름
 * @property {string} Orgtx - Full name
 * @property {string} PGradeTxt - 직급명
 * @property {string} Appcnt - 신청자(부서/성명/직위)
 * @property {string} Limday - 신청한도일수
 * @property {string} Status1Txt - 결재상태 텍스트
 * @property {string} Appnm - Apply Number
 * @property {string} Appkey1 - 결재키
 * @property {DateTime} ApplyDt1 - 요청일
 * @property {Time} ApplyTm1 - 신청시간
 * @property {string} ApplyNm1 - 요청자
 * @property {DateTime} AppDate1 - 결재일
 * @property {Time} AppTime1 - 결재시간
 * @property {string} AppName1 - 결재자사번
 * @property {string} Status1 - 결재
 * @property {string} Appkey - 결재키
 * @property {DateTime} ApplyDt - 요청일
 * @property {Time} ApplyTm - 신청시간
 * @property {string} ApplyNm - 요청자
 * @property {DateTime} AppDate - 결재일
 * @property {Time} AppTime - 결재시간
 * @property {string} AppName - 결재자사번
 * @property {string} Status - 결재상태(확인필요)
 * @property {string} Comty - 승인완료
 * @property {string} KostlP - 코스트 센터(결재용)
 * @property {string} OrgehP - 조직코드(결재용)
 * @property {string} IOdkey - OData Key
 * @property {string} IPernr - 사원 번호
 * @property {string} IOrgeh - 조직 단위
 * @property {DateTime} IBegda - 시작일
 * @property {DateTime} IEndda - 종료일
 * @property {string} IConType - 처리구분
 * @property {string} IBukrs - 회사 코드
 * @property {string} ILangu - 언어
 * @property {string} IMolga - 국가 그루핑
 * @property {DateTime} IDatum - 일자
 * @property {string} IEmpid - 신청자
 * @property {string} IOrgDn - 'X'.하위조직 포함
 * @property {string} ITprog - 일일 근무 일정
 * @property {string} IDialogMode - Operation Dialog mode
 * @property {string} IApstat - 결재상태(확인필요)
 * @property {string} IAppkey1 - 결재키
 * @property {string} EAppurl - [미사용]
 * @property {string} ERetcode - 메시지 유형
 * @property {string} ERettext - 메시지 텍스트
 *
 * @typedef {Object} AlterWorkApplyOutline
 * @property {string} Zappkey - 결재키
 * @property {string} Pernr - 사원 번호
 * @property {DateTime} Appdt - 신청일
 * @property {string} Reqrs - 신청사유
 * @property {string} ReqrsTxt - 신청사유 텍스트
 * @property {string} Reqtx - 신청사유상세
 * @property {string} Rejtx - 담당자 반려사유
 * @property {string} Appcnt - 신청자(부서/성명/직위)
 * @property {string} Limday - 신청한도일수
 * @property {string} Status1Txt - 결재상태 텍스트
 * @property {string} Appnm - Apply Number
 * @property {string} Appkey1 - 결재키
 * @property {DateTime} ApplyDt1 - 요청일
 * @property {Time} ApplyTm1 - 신청시간
 * @property {string} ApplyNm1 - 요청자
 * @property {DateTime} AppDate1 - 결재일
 * @property {Time} AppTime1 - 결재시간
 * @property {string} AppName1 - 결재자사번
 * @property {string} Status1 - 결재
 * @property {string} Appkey - 결재키
 * @property {DateTime} ApplyDt - 요청일
 * @property {Time} ApplyTm - 신청시간
 * @property {string} ApplyNm - 요청자
 * @property {DateTime} AppDate - 결재일
 * @property {Time} AppTime - 결재시간
 * @property {string} AppName - 결재자사번
 * @property {string} Status - 결재상태(확인필요)
 * @property {string} Comty - 승인완료
 * @property {string} KostlP - 코스트 센터(결재용)
 * @property {string} OrgehP - 조직코드(결재용)
 * @property {string} IOdkey - OData Key
 * @property {string} IPernr - 사원 번호
 * @property {string} IOrgeh - 조직 단위
 * @property {DateTime} IBegda - 시작일
 * @property {DateTime} IEndda - 종료일
 * @property {string} IConType - 처리구분
 * @property {string} IBukrs - 회사 코드
 * @property {string} ILangu - 언어
 * @property {string} IMolga - 국가 그루핑
 * @property {DateTime} IDatum - 일자
 * @property {string} IEmpid - 신청자
 * @property {string} IOrgDn - 'X'.하위조직 포함
 * @property {string} ITprog - 일일 근무 일정
 * @property {string} IDialogMode - Operation Dialog mode
 * @property {string} IApstat - 결재상태(확인필요)
 * @property {string} IAppkey1 - 결재키
 * @property {string} EAppurl - [미사용]
 * @property {string} ERetcode - 메시지 유형
 * @property {string} ERettext - 메시지 텍스트

 */
