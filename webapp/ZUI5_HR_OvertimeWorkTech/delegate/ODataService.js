sap.ui.define(
    [
        "common/Common", //
        "./OvertimeWork",
		"sap/m/MessageBox"
    ],
    function (Common, OvertimeWork, MessageBox) {
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
                    "/CommonCodeListHeaderSet", {
                        IPernr: !Common.checkNull(arg.Pernr) ? arg.Pernr : undefined,
                        IBukrs: !Common.checkNull(arg.Bukrs) ? arg.Bukrs : undefined,
                        IMolga: !Common.checkNull(arg.Molga) ? arg.Molga : undefined,
                        ILangu: !Common.checkNull(arg.Langu) ? arg.Langu : undefined,
                        ICodeT: !Common.checkNull(arg.CodeT) ? arg.CodeT : undefined,
                        ICodty: !Common.checkNull(arg.Codty) ? arg.Codty : undefined,
                        NavCommonCodeList: []
                    }, {
                        success: function (data) {
                            if (data.NavCommonCodeList) {
                                results = data.NavCommonCodeList.results;

                                if (arg.IsContainsAll) {
                                    results.unshift({
                                        Code: "ALL",
                                        Text: this.getBundleText("LABEL_00131")
                                    }); // 전체
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
             * 연장근무(첨단) 근무시간 체크 및 목록 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - 호출구분(OvertimeWork.ProcessType[CODE|READ|PRIOR]) 
             * @param {object} arg - 검색조건
             * @param {string} arg.Pernr - 사번
             * @param {string?} arg.Orgeh - 부서
             * @param {Date?} arg.Begda - 시작일
             * @param {Date?} arg.Endda - 종료일
             * @param {Date?} arg.Datum - 일자
             * @param {Date?} arg.Aftck - 1:사전, 2:사후
             * @param {Date?} arg.First - 날짜 변경시 'X'
             * @param {Object<OvertimeWorkApplyTab1>} arg.OtWorkTab1
             * 
             * @returns {Object{OtWorkTab1:Array<OvertimeWorkApplyTab1>, OtWorkTab2:Array<OvertimeWorkApplyTab2>}
             */
            OvertimeWorkApplySet: function (processType, arg) {
                var results = {
                    OtWorkTab1: [],
                    OtWorkTab2: []
                };

                $.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
                    "/OvertimeWorkApplySet", {
                        IConType: processType,
                        IBukrs: this.getSessionInfoByKey("Bukrs3"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IAftck: arg.Aftck ? arg.Aftck : undefined,
                        IFirst: arg.First ? arg.First : undefined,
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : undefined,
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        IEndda: arg.Endda ? moment(arg.Endda).hours(10).toDate() : undefined,
                        IDatum: arg.Datum ? moment(arg.Datum).hours(10).toDate() : undefined,
                        OtWorkTab1: arg.OtWorkTab1 ? arg.OtWorkTab1 : [],
                        OtWorkTab2: []
                    }, {
                        success: function (data) {
                            if (data.OtWorkTab1)
                                results.OtWorkTab1 = data.OtWorkTab1.results;
                            if (data.OtWorkTab2)
                                results.OtWorkTab2 = data.OtWorkTab2.results;
                        },
                        error: function (res) {
                            Common.log(res);
                            if(processType !== OvertimeWork.ProcessType.READ && arg.isErrorShow === true) {
                                var errData = Common.parseError(res);
                                if (errData.Error && errData.Error === "E") {
                                    MessageBox.error(errData.ErrorMessage, {
                                        title: this.getBundleText("LABEL_00149")
                                    });
                                }
                            }
                        }.bind(this)
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
             * @param {string} payload.Empid - 신청자 사번
             * @param {string} payload.Datum - 근무일
             * @param {string} payload.Aftck - 1:사전, 2:사후
             * @param {string} payload.Reqes - 상신처리시 'X'
             * @param {Array<OvertimeWorkApplyTab1>} payload.OtWorkTab1 - 신청상세
             * @param {Array<OvertimeWorkApplyTab2>} payload.OtWorkTab2 - 결재정보
             * @param {Function} success - 성공 callback
             * @param {Function} error - 실패 callback
             */
            OvertimeWorkApplySetByProcess: function (processType, payload, success, error) {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

                // update의 경우 결제키를 삭제한다.(중복오류 발생)
                if (processType === OvertimeWork.ProcessType.UPDATE)
                    delete payload.OtWorkTab1[0].Appkey1;

                oModel.create(
                    "/OvertimeWorkApplySet", {
                        IConType: processType,
                        IBukrs: this.getSessionInfoByKey("Bukrs3"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        IPernr: payload.Empid,
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IOrgeh: this.getSessionInfoByKey("Orgeh"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IDatum: payload.Datum,
                        IAftck: payload.Aftck,
                        IReqes: payload.Reqes,
                        IExtryn: Common.isExternalIP() ? "X" : null,
                        OtWorkTab1: payload.OtWorkTab1,
                        OtWorkTab2: payload.OtWorkTab2,
                        OtWorkTab3: payload.OtWorkTab3
                    }, {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data, processType, payload.Reqes);
                        },
                        error: function (res) {
                            if (typeof error === "function") error.call(null, res);
                        }
                    }
                );
            },

            /**
             * 식사/웰리스 내역 조회
             * 
             * @param {Object} arg 
             * @param {string} arg.Pernr - 사번
             * @param {string} arg.Begda - 근무일
             * @param {string} arg.Tmtyp - H:식사, S:웰리스
             * 
             * @returns {Array<RecorderTimeInfo>}
             */
            RecorderTimeInfoSet: function (arg) {
                var results = [];

                $.app.getModel("ZHR_WORKSCHEDULE_SRV").create(
                    "/RecorderTimeInfoSet", {
                        IPernr: arg.Pernr,
                        IBukrs: this.getSessionInfoByKey("Bukrs3"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        IEndda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        ITmtyp: arg.Tmtyp,
                        RecorderInfoNav: []
                    }, {
                        success: function (data) {
                            if (data.RecorderInfoNav)
                                results = data.RecorderInfoNav.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            }
        };

        return ODataService;
    }
);

/**
* @typedef {Object} OvertimeWork.ProcessType
* @property {string} CODE - 코드조회
* @property {string} READ - 조회
* @property {string} UPDATE - 수정
* @property {string} CREATE - 생성
* @property {string} DELETE - 삭제
* @property {string} CANCLE - 취소
* @property {string} PRIOR - 사전신청(POP-UP)
* 
* @typedef {Object} NavCommonCodeList
* @property {string} Code - 코드
* @property {string} Text - 코드명
* 
* @typedef {Object} OvertimeWorkApplyTab1
* @property {Edm.String} Pernr - 사원 번호
* @property {Edm.String} Infty - 인포타입
* @property {Edm.String} Subty - 하위 유형
* @property {Edm.String} Objps - 오브젝트 ID
* @property {Edm.String} Sprps - 잠금 지시자
* @property {Edm.DateTime} Endda - 종료일
* @property {Edm.DateTime} Begda - 시작일
* @property {Edm.String} Seqnr - IT 레코드 번호
* @property {Edm.String} Ename - 사원/지원자이름
* @property {Edm.String} Bukrs - 회사 코드
* @property {Edm.String} Butxt - 회사 이름
* @property {Edm.String} Objid - 조직 단위
* @property {Edm.String} Orgtx - 부서명
* @property {Edm.String} Persg - 사원 그룹
* @property {Edm.String} Persk - EE 하위 그룹
* @property {Edm.String} Molga - 국가 그루핑
* @property {Edm.String} Btrtx - PS 텍스트
* @property {Edm.String} Ptext - EE 하위그룹이름
* @property {Edm.DateTime} AppBeg - 시작일
* @property {Edm.DateTime} AppEnd - 종료일
* @property {Edm.String} Zzhgrade - 직급구분
* @property {Edm.String} ZzpGrade - 직급
* @property {Edm.String} HgradeT - 직급구분명
* @property {Edm.String} PGradeTxt - 직급명
* @property {Edm.String} Titel - 제목
* @property {Edm.String} Titl2 - 직함 2
* @property {Edm.DateTime} Otdat - 근무일자
* @property {Edm.Time} Otbet - 시작시간
* @property {Edm.Time} Otent - 종료시간
* @property {Edm.String} Otwhr - 인정시간(시)
* @property {Edm.String} Otwmm - 인정시간(분)
* @property {Edm.String} Brkhr1 - 비근무시간(시간)
* @property {Edm.String} Brkmm1 - 비근무시간(분)
* @property {Edm.String} Brkhr2 - 비근무시간(시간)
* @property {Edm.String} Brkmm2 - 비근무시간(분)
* @property {Edm.String} Brkhr3 - 비근무시간(시간)
* @property {Edm.String} Brkmm3 - 비근무시간(분)
* @property {Edm.String} Appnm - Apply Number
* @property {Edm.String} Appkey1 - 결재키
* @property {Edm.DateTime} ApplyDt1 - 요청일
* @property {Edm.Time} ApplyTm1 - 신청시간
* @property {Edm.String} ApplyNm1 - 요청자
* @property {Edm.DateTime} AppDate1 - 결재일
* @property {Edm.Time} AppTime1 - 결재시간
* @property {Edm.String} AppName1 - 결재자사번
* @property {Edm.String} Status1 - 결재
* @property {Edm.String} Appkey - 결재키
* @property {Edm.DateTime} ApplyDt - 요청일
* @property {Edm.Time} ApplyTm - 신청시간
* @property {Edm.String} ApplyNm - 요청자
* @property {Edm.DateTime} AppDate - 결재일
* @property {Edm.Time} AppTime - 결재시간
* @property {Edm.String} AppName - 결재자사번
* @property {Edm.String} Status - 결재상태(확인필요)
* @property {Edm.String} Comty - 승인완료
* @property {Edm.String} KostlP - 코스트 센터(결재용)
* @property {Edm.String} OrgehP - 조직코드(결재용)
* @property {Edm.String} Migrs - 마이그레이션 데이터
* @property {Edm.String} Holick - 휴일여부, X 휴일
* @property {Edm.DateTime} Entbd - 입문일자
* @property {Edm.DateTime} Ented - 출문일자
* @property {Edm.Time} Entbg - 입문시간
* @property {Edm.Time} Enten - 출문시간
* @property {Edm.String} EntbeW - 입출문시간(웹출력용)
* @property {Edm.String} Comtm - 근태인정시간
* @property {Edm.String} Duptm - 근태중복시간
* @property {Edm.String} Brktm - 휴게시간
* @property {Edm.String} BrktmHr - 휴게시간(시간)
* @property {Edm.String} BrktmMm - 휴게시간(분)
* @property {Edm.String} Norwk - 평일재근
* @property {Edm.String} Tottm - 총근로시간
* @property {Edm.String} Mottm - 월누적연장근로시간
* @property {Edm.String} Mottm2 - 월누적연장근로시간(신청 총근로시간 포함)
* @property {Edm.String} ComtmW - 근태인정시간(웹출력용)
* @property {Edm.String} TottmW - 총근로시간
* @property {Edm.String} MottmW - 월누적연장근로시간
* @property {Edm.String} Horex - 휴일근무 사유
* @property {Edm.String} Rjres - 반려사유
* @property {Edm.String} StatusT - 결재상태(담당부서)
* @property {Edm.String} Status1T - 결재상태(현업)
* @property {Edm.Boolean} Mealb - 아침식사
* @property {Edm.Boolean} Meall - 점심식사
* @property {Edm.Boolean} Meald - 저녁식사
* @property {Edm.Boolean} Welld - 웰리스
* @property {Edm.String} Afreq - 사후신청여부, 사후신청 X / 미신청 SAPCE
* 
* @typedef {Object} OvertimeWorkApplyTab2
* @property {Edm.String} Mandt - 클라이언트
* @property {Edm.String} Appnm - Apply Number
* @property {Edm.String} Appsq - 신청유형
* @property {Edm.String} Aprsq - 순번
* @property {Edm.String} Apper - 결재자
* @property {Edm.String} Apsta - 결재자 진행 상태 확인
* @property {Edm.String} Rject - 반려사유
* @property {Edm.String} Crnam - 생성자
* @property {Edm.DateTime} Crdat - 생성일
* @property {Edm.Time} Crtim - 시간
* @property {Edm.String} Aenam - 변경자
* @property {Edm.DateTime} Aedtm - 변경일
* @property {Edm.Time} Aetim - 변경시간
* @property {Edm.String} Del - 미사용
* @property {Edm.String} Progr - 저장 프로그램
* @property {Edm.String} Apnam - 사원/지원자이름
* @property {Edm.String} Aporg - 조직 단위
* @property {Edm.String} Aporx - 조직명
* @property {Edm.String} Apgrd - 직급
* @property {Edm.String} ApgrdT - 직급명
* @property {Edm.String} ApstaT - 상태
* 
* @typedef {Object} RecorderTimeInfo
* @property {Edm.String} Pernr - 사원 번호
* @property {Edm.DateTime} Begda - 시작일
* @property {Edm.DateTime} Endda - 종료일
* @property {Edm.String} Tmcty - 타임유형
* @property {Edm.String} TmctyT - 출입유형명
* @property {Edm.Time} Beguz - 시작 시간
* @property {Edm.Time} Enduz - 종료 시간

*/