/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "sap/m/MessageBox"
    ],
    function (Common, MessageBox) {
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
             * 근무신청 목록 조회
             */
            WorktimeApplySet: function (processType, arg) {
                var results = {
                    Worktimetab1: [],
                    Worktimetab2: []
                };

                $.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
                    "/WorktimeApplySet",
                    {
                        IConType: processType,
                        ITttyp: arg.Tttyp ? arg.Tttyp : "P",    // P: 개인, O: 일괄
                        IBukrs: this.getSessionInfoByKey("Bukrs3"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IApsta: arg.Apsta && arg.Apsta !== "ALL" ? arg.Apsta : undefined,
                        IBfchk: arg.Bfchk && arg.Bfchk === "1" ? "X" : "",
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IOrgeh: arg.Orgeh ? arg.Orgeh : undefined,
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        IEndda: arg.Endda ? moment(arg.Endda).hours(10).toDate() : undefined,
                        IDatum: arg.Datum ? moment(arg.Datum).hours(10).toDate() : undefined,
                        Worktimetab1: arg.Worktimetab1 ? arg.Worktimetab1 : [],
                        Worktimetab2: []
                    },
                    {
                        success: function (data) {
                            if (data.Worktimetab1)
                                results.Worktimetab1 = data.Worktimetab1.results;
                            if (data.Worktimetab2)
                                results.Worktimetab2 = data.Worktimetab2.results;
                        },
                        error: function (res) {
                            Common.log(res);
                            var errData = Common.parseError(res);
                            if (errData.Error && errData.Error === "E") {
                                MessageBox.error(errData.ErrorMessage, {
                                    title: this.getBundleText("LABEL_00149")
                                });
                            }
                        }.bind(this)
                    }
                );

                return results;
            },

            WorktimeApplySetByProcess: function (payload, success, error) {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

                oModel.create(
                    "/WorktimeApplySet",
                    $.extend(true, payload, {
                        IBukrs: this.getSessionInfoByKey("Bukrs3"),
                        IMolga: this.getSessionInfoByKey("Molga"),
                        IPernr: this.getSessionInfoByKey("Pernr"),
                        IOrgeh: this.getSessionInfoByKey("Orgeh"),
                        ILangu: this.getSessionInfoByKey("Langu")
                    }),
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data, payload.IConType);
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
