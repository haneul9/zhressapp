sap.ui.define(
    [
        "common/Common", //
        "./Shift"
    ],
    function (Common, Shift) {
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
             * 근무일정 현황 목록 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(Shift.ProcessType[READ_STATUS|READ_APPROVAL]) 
             * @param {object} arg - 검색조건
             * @param {string} arg.Pernr - 사번
             * @param {string} arg.Orgeh - 부서
             * @param {string} arg.Schkz - 근무일정
             * @param {Date?} arg.Begda - 시작일
             * @param {Date?} arg.Endda - 종료일
             * @param {string?} arg.Apstat - 결재상태
             * @param {string?} arg.OrgDn - 하위조직 포함여부
             * @param {string?} arg.Inday - 현재일 포함여부
             * @param {string?} arg.Appkey - 결재번호
             * 
             * @returns {Array<ShiftWorkScheduleList>|Object} - 근무일정 현황 목록
             */
            ShiftWorkScheduleHeaderSet: function (processType, arg) {
                var results = [];

                $.app.getModel("ZHR_WORKSCHEDULE_SRV").create(
                    "/ShiftWorkScheduleHeaderSet",
                    {
                        IOdkey: "",
                        IConType: processType,
                        IBukrs: "1000",
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IAppkey1: arg.Appkey ? arg.Appkey : undefined,
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : undefined,
                        ISchkz: (arg.Schkz && arg.Schkz !== "ALL") ? arg.Schkz : "",
                        IBegda: arg.Begda ? Common.adjustGMTOdataFormat(arg.Begda) : undefined,
                        IEndda: arg.Endda ? Common.adjustGMTOdataFormat(arg.Endda) : undefined,
                        IApstat: arg.Apstat ? arg.Apstat : undefined,
                        IOrgDn: arg.OrgDn === true ? "X" : "",
                        IInday: arg.Inday === true ? "X" : "",
                        ShiftWorkScheduleList: [],
                        ShiftWorkScheduleChange: [],
                        ShiftWorkScheduleChangeOutline: []
                    },
                    {
                        success: function (data) {
                            switch(processType) {
                                case Shift.ProcessType.READ_STATUS:
                                    if (data.ShiftWorkScheduleList) {
                                        results = data.ShiftWorkScheduleList.results;
                                    }
                                    break;
                                case Shift.ProcessType.READ_APPROVAL:
                                    if (data.ShiftWorkScheduleChange) {
                                        results = data.ShiftWorkScheduleChange.results;
                                    }
                                    break;
                                case Shift.ProcessType.DETAIL:
                                    results = {};
                                    results.EAppurl = data.EAppurl;
                                    if (data.ShiftWorkScheduleChangeOutline) {
                                        results.ShiftWorkScheduleChangeOutline = data.ShiftWorkScheduleChangeOutline.results[0];
                                    }
                                    if (data.ShiftWorkScheduleChange) {
                                        results.ShiftWorkScheduleChange = data.ShiftWorkScheduleChange.results;
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
             * 근무일정 현황 신청/신청취소
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(Shift.ProcessType[APPROVAL_REQUEST|APPROVAL_CANCEL]) 
             * @param {Object} payload - Create entity
             * @param {string} payload.Appkey1 - 결재번호
             * @param {string} payload.Pernr - 사번
             * @param {Array<ShiftWorkScheduleChange>} payload.ShiftWorkScheduleChange - 대상자 목록
             * @param {Function} success - 성공 callback
             * @param {Function} error - 실패 callback
             */
            ShiftWorkScheduleHeaderSetByProcess: function (processType, payload, success, error) {
                var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");

                oModel.create(
                    "/ShiftWorkScheduleHeaderSet",
                    {
                        IOdkey: "",
                        IConType: processType,
                        IBukrs: "1000",
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IAppkey1: payload.Appkey1 ? payload.Appkey1 : undefined,
                        IExtryn: payload.Extryn ? payload.Extryn : undefined,
                        IPernr: payload.Pernr ? payload.Pernr : undefined,
                        ShiftWorkScheduleChange: payload.ShiftWorkScheduleChange
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
 * @typedef {Object} Shift.ProcessType
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
 * @typedef {Object} ShiftWorkScheduleList
 * @property {string} Pernr - 사원 번호
 * @property {string} Infty - 인포타입
 * @property {string} Subty - 하위 유형
 * @property {string} Objps - 오브젝트 ID
 * @property {string} Sprps - 잠금 지시자
 * @property {dateTime} Endda - 종료일
 * @property {dateTime} Begda - 시작일
 * @property {string} Seqnr - IT 레코드 번호
 * @property {string} Ename - 사원/지원자이름
 * @property {string} Bukrs - 회사 코드
 * @property {string} Butxt - 회사 이름
 * @property {string} Objid - 조직 단위
 * @property {string} Orgtx - 부서명
 * @property {string} Persg - 사원 그룹
 * @property {string} Persk - EE 하위 그룹
 * @property {string} Molga - 국가 그루핑
 * @property {string} Btrtx - PS 텍스트
 * @property {string} Ptext - EE 하위그룹이름
 * @property {dateTime} AppBeg - 시작일
 * @property {dateTime} AppEnd - 종료일
 * @property {string} Zzhgrade - 직급구분
 * @property {string} ZzpGrade - 직급
 * @property {string} HgradeT - 직급구분명
 * @property {string} PGradeTxt - 직급명
 * @property {string} Titel - 제목
 * @property {string} Titl2 - 직함 2
 * @property {string} Schkz - WS 규칙
 * @property {string} Zterf - 시간관리상태
 * @property {decimal} Empct - 고용률
 * @property {decimal} Mostd - 월간근무시간
 * @property {decimal} Wostd - 주간근무시간
 * @property {decimal} Arbst - 일일근무시간
 * @property {decimal} Wkwdy - 근무일수
 * @property {decimal} Jrstd - 연간근무시간
 * @property {boolean} Teilk - 파트 타임 직원
 * @property {decimal} Minta - 최소근무시간/일
 * @property {decimal} Maxta - 최대근무시간/일
 * @property {decimal} Minwo - 최소근무시간/주
 * @property {decimal} Maxwo - 최대근무시간/주
 * @property {decimal} Minmo - 최소근무시간/월
 * @property {decimal} Maxmo - 최대근무시간/월
 * @property {decimal} Minja - 최소근무시간/년
 * @property {decimal} Maxja - 최대근무시간/년
 * @property {boolean} Dysch - Dyn.daily WS
 * @property {string} Kztim - 추가시간 ID
 * @property {string} Wweek - 근무주
 * @property {string} Awtyp - 참조절차
 * @property {string} ZzShift - 사무직 교대근무
 * @property {string} Rtext - DWS 규칙 텍스트
 * @property {string} ZterfTx - 20자
 * @property {string} BSchkz - WS 규칙
 * @property {string} BZterf - 시간관리상태
 * @property {string} BRtext - DWS 규칙 텍스트
 * @property {string} BZterfTx - 20자
 * @property {string} Comment - 처리결과
 * @property {string} Check - 선택
 * @property {string} IOdkey - Odata Key
 * @property {string} IPernr - 사원 번호
 * @property {string} IOrgeh - 조직 단위
 * @property {dateTime} IBegda - 시작일
 * @property {dateTime} IEndda - 종료일
 * @property {string} IConType - 처리구분
 * @property {string} IBukrs - 회사 코드
 * @property {string} ILangu - 언어
 * @property {string} IMolga - 국가 그루핑
 * @property {dateTime} IDatum - 일자
 * @property {string} IEmpid - 신청자
 * @property {string} IOrgDn - 'X'.하위조직 포함
 * @property {string} ISchkz - WS 규칙
 * @property {string} IDialogMode - Operation Dialog mode
 * @property {string} IInday - 현재일 포함건만 조회
 * @property {string} ERetcode - 메시지 유형
 * @property {string} ERettext - 메시지
 * 
 * @typedef {Object} ShiftWorkScheduleChange
 * @property {string} Pernr -사원 번호
 * @property {DateTime} Appdt -신청일
 * @property {string} Seqnr -IT 레코드 번호
 * @property {DateTime} Begda -시작일
 * @property {DateTime} Endda -종료일
 * @property {string} Apprd -대상기간
 * @property {string} Schkz -WS 규칙
 * @property {string} Rtext -DWS 규칙 텍스트
 * @property {string} Reqrs -신청사유
 * @property {string} Rejtx -담당자 반려사유
 * @property {string} Infotype -인포타입반영완료
 * @property {string} Ename -사원/지원자이름
 * @property {string} Orgtx -Full name
 * @property {string} PGradeTxt -직급명
 * @property {string} Appcnt -신청자(부서/성명/직위)
 * @property {string} Limday -신청한도일
 * @property {string} Appnm -Apply Number
 * @property {string} Appkey1 -결재키
 * @property {DateTime} ApplyDt1 -요청일
 * @property {Time} ApplyTm1 -신청시간
 * @property {string} ApplyNm1 -요청자
 * @property {DateTime} AppDate1 -결재일
 * @property {Time} AppTime1 -결재시간
 * @property {string} AppName1 -결재자사번
 * @property {string} Status1 -결재
 * @property {string} Appkey -결재키
 * @property {DateTime} ApplyDt -요청일
 * @property {Time} ApplyTm -신청시간
 * @property {string} ApplyNm -요청자
 * @property {DateTime} AppDate -결재일
 * @property {Time} AppTime -결재시간
 * @property {string} AppName -결재자사번
 * @property {string} Status -결재상태(확인필요)
 * @property {string} Comty -승인완료
 * @property {string} KostlP -코스트 센터(결재용)
 * @property {string} OrgehP -조직코드(결재용)
 * @property {string} IOdkey -OData Key
 * @property {string} IPernr -사원 번호
 * @property {string} IOrgeh -조직 단위
 * @property {DateTime} IBegda -시작일
 * @property {DateTime} IEndda -종료일
 * @property {string} IConType -처리구분
 * @property {string} IBukrs -회사 코드
 * @property {string} ILangu -언어
 * @property {string} IMolga -국가 그루핑
 * @property {DateTime} IDatum -일자
 * @property {string} IEmpid -신청자
 * @property {string} IBtStat -Settlement Status
 * @property {string} IOrgDn -'X'.하위조직 포함
 * @property {string} ISchkz -WS 규칙
 * @property {string} IDialogMode -Operation Dialog mode
 * @property {string} IInday -현재일 포함건만 조회
 * @property {string} IApstat -결재상태(확인필요)
 * @property {string} IAppkey1 -결재키
 * @property {string} ERetcode -메시지 유형
 * @property {string} ERettext -메시지 텍스트
 */
