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
             * @param {string} arg.Code - 코드
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
						ICode: !Common.checkNull(arg.Code) ? arg.Code : undefined,
						NavCommonCodeList: []
					},
					{
						success: function (data) {
							if (data.NavCommonCodeList) {
                                results = data.NavCommonCodeList.results;
                                
                                if(arg.IsContainsAll) {
                                    results.unshift({ Code: "ALL", Text: this.getBundleText("LABEL_00118") });  // 선택
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

            LanguageApplySet: function () {
                var results = [];

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/LanguageApplySet",
                    {
                        IConType: "1",
                        IBukrs: this.getSessionInfoByKey("Bukrs"),
                        ILangu: this.getSessionInfoByKey("Langu"),
                        IPernr: this.getSessionInfoByKey("Pernr"),
                        IEmpid: this.getSessionInfoByKey("Pernr"),
                        IDatum: Common.adjustGMTOdataFormat(new Date()),
                        LanguageApp1Nav: [],
                        LanguageApp2Nav: []
                    },
                    {
                        success: function (data) {
                            if (data.LanguageApp1Nav)
                                results = data.LanguageApp1Nav.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },
            
            LanguageApplySetByProcess: function (payload, success, error) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");

                oModel.create(
                    "/LanguageApplySet",
                    payload,
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(this, data);
                        }.bind(this),
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