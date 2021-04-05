/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "./WorkSchedule",
        "common/moment-with-locales"
    ],
    function (Common, WorkSchedule) {
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
             * 연장근무 사전 결재내역 조회
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} processType - RFC Action유형
             * @param {object} arg - 검색조건
             * @param {string?} arg.Pernr - 사번
             * @param {string?} arg.Orgeh - 부서
             * @param {Date} arg.Begda - 시작일
             * @param {Date} arg.Endda - 종료일
             * @param {Date} arg.Datum - 일자
             * @param {Date} arg.Apsta - 진행상태
             * @param {Date} arg.Bftck - 사전,사후
             * 
             * @returns {Object{OtConfirmNav:Array<OtworkConfirmTableIn>}
             */
            OvertimeAppConfirmSet: function (processType, arg) {
                var results = {
                    OtAppConfirmTab1: [],
                    OtAppConfirmTab2: []
                };

                $.app.getModel("ZHR_BATCHAPPROVAL_SRV").create(
                    "/OvertimeAppConfirmSet",
                    {
                        IOdkey: "",
                        IConType: processType,
                        IBfchk: arg.Bfchk === "1" ? "X" : "",
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IPernr: this.getSessionInfoByKey("Pernr"),
                        IBukrs: this.getSessionInfoByKey("Bukrs"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IPernr2: arg.Pernr ? arg.Pernr : null,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : null,
                        IApsta: arg.Apsta && (arg.Apsta !== "ALL") ? arg.Apsta : null,
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : null,
                        IEndda: arg.Endda ? moment(arg.Endda).hours(10).toDate() : null,
                        IDatum: arg.Datum ? moment(arg.Datum).hours(10).toDate() : null,
                        OtAppConfirmTab1: [],
                        OtAppConfirmTab2: []
                    },
                    {
                        success: function (data) {
                            if (data.OtAppConfirmTab1)
                                results.OtAppConfirmTab1 = data.OtAppConfirmTab1.results;
                            if (data.OtAppConfirmTab2)
                                results.OtAppConfirmTab2 = data.OtAppConfirmTab2.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },

            /**
             * 결재 승인/반려
             * 
             * @this {sap.ui.core.mvc.Controller} - Tab.controller
             * 
             * @param {string} actionStatus - 호출구분(WorkSchedule.Approval[REJECT|APPROVE]) 
             * @param {Object} payload - Create entity
             * @param {string} payload.Bftck - 1:사전, 2:사후
             * @param {Array<OtworkConfirmTableIn>} payload.OtConfirmNav - 목록정보
             * @param {Function} success - 성공 callback
             * @param {Function} error - 실패 callback
             */
            OvertimeAppConfirmSetByProcess: function(actionStatus, payload, success, error) {
                $.app.getModel("ZHR_BATCHAPPROVAL_SRV").create(
                    "/OvertimeAppConfirmSet",
                    {
                        IOdkey: "",
                        IConType: WorkSchedule.ProcessType.ACTION,
                        IBfchk: payload.Bfchk === "1" ? "X" : "",
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IPernr: payload.Pernr ? payload.Pernr : null,
                        IBukrs: this.getSessionInfoByKey("Bukrs"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        OtAppConfirmTab1: payload.OtAppConfirmTab1,
                        OtAppConfirmTab2: []
                    },
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data, actionStatus);
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

