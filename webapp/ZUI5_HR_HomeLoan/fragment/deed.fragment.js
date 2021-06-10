/* eslint-disable no-undef */
sap.ui.define(["../delegate/HomeLoan"], function (HomeLoan) {
    "use strict";

    var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "deed"].join(".fragment.");

    sap.ui.jsfragment(DIALOG_DETAIL_ID, {
        createContent: function (oController) {
            var ApprovalHandler = oController.getApprovalHandler.call(oController);

            var oDialog = new sap.m.Dialog({
                contentWidth: "1200px",
                contentHeight: "96%",
                title: "차용금 증서",
                content: [this.buildContents()],
                buttons: [
                    new sap.m.Button({
                        text: "확인",
                        press: ApprovalHandler.onRequest.bind(ApprovalHandler, HomeLoan.ProcessType.APPROVAL),
                        visible: "{= !${/Detail/Header/Zhlsdt}}"
                    }).addStyleClass("button-dark"),
                    new sap.m.Button({
                        text: oController.getBundleText("LABEL_00133"), // 닫기
                        press: function () {
                            oDialog.close();
                        }
                    }).addStyleClass("button-default custom-button-divide")
                ]
            })
                .addStyleClass("custom-dialog-popup")
                .setModel(ApprovalHandler.Model());

            return oDialog;
        },

        buildContents: function () {
            return new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({
                                width: "130px",
                                text: "대출금액"
                            }),
                            new sap.m.Text({
                                text: "{/Detail/Header/Zhlrat} 원"
                            }).addStyleClass("mx-10px")
                        ]
                    }).addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ text: "상기 금액은 본인의 사택 미입주에 따른 주택자금(임차, 구입 및 신축) 융자조건으로 사내근로복지 기금으로부터 정히 차용하고 다음 사항을 성실히 이행할 것을 약속한다." }), //
                                    new sap.m.Text({ text: "1. 차용기간 및 상환조건" }),
                                    new sap.m.Text({ text: "롯데케미칼(주) 사내근로복지기금 운영요령의 규정에 따른다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "2. 사택입주 제한" }),
                                    new sap.m.Text({ text: "주택구입자금을 차용함에 따라 본인에게 사택입주 순서가 도래 할 경우에도 사택입주를 포기한다.(단, 본사 공장간 전보 시 제외)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "3. 일시 전액 상환사유 및 상환기일" }),
                                    new sap.m.Text({ text: "1) 전보 등으로 사택 입주 시(1주일로부터 1개월 이내)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "2) 본인이 회사를 퇴직할 시(퇴직금 수령 이전)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "3) 지방세(재산세부문) 세목별과세(납세)증명서 1부(요구일로부터 10일 이내)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "4) 본인이 상환 희망 시" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "4.우선변제" }),
                                    new sap.m.Text({ text: "상환사유가 발생하였으나 본인의 형편상 본 차용금을 상환하기 곤란할 경우 기금이 본인의 퇴직금 및 급여 등 수령액에서 차용금을 우선공제 하여도 이의가 없을 것임을 약속한다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "5. 재정보증 또는 담보설정" }),
                                    new sap.m.Text({ text: "본인이 차용금을 상환치 못할 경우를 대비하여 다음 각 항 중 하나의 재정보증 설정 또는 본인 소유의 부동산을 담보로 제공한다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "1) 당사 재직직원으로서 융자금 상당액 2배 이상의 퇴직급여 충당금이 적립된 2명이상의 연대 보증서(인감증명 첨부)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "2) 연간 50,000원 이상의 재산세 납부실적이 있는 외부인사 1명 또는 년간 30,000원 이상의 재산세 납부실적이 있는 외부인사 2명의 재정보증서" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "3) 보증보험회사의 보증보험증권" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "4) 현 싯가로 차용금액에 상당하는 본인 소유의 부동산을 기금명의의 근저당으로 설정하여 제출(수수료 본인부담)" }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "6. 승계" }),
                                    new sap.m.Text({ text: "본인이 약속한 본 증서는 본인의 상속인, 재산관리인, 유언집행인 및 승계인에게도 구속력을 가지며 유효하다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "7. 제출서류" }),
                                    new sap.m.Text({ text: "본 차용금을 수령함에 있어서 기금에서 요구하는 서류를 이의 없이 구비하여 제출할 것을 약속한다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "8. 비용부담" }),
                                    new sap.m.Text({ text: "본 차용금 상환을 위해 기금이 본인에 대한 권리행사나 보전을 위해 소요된 모든 비용은 본인이 부담한다." }).addStyleClass("pl-14px"),
                                    new sap.m.Text({ text: "9. 합의관할" }),
                                    new sap.m.Text({ text: "약정의 위약에 따른 소송의 필요가 생길 때에는 기금의 소재지를 관할하는 법원을 관할 법원으로 한다." }).addStyleClass("pl-14px")
                                ]
                            })
                        ]
                    }).addStyleClass("divContents borderTop borderLeft borderRight"),
                    new sap.m.HBox({
                        justifyContent: "Center",
                        items: [
                            new sap.m.Text({ text: "{/Detail/Header/ZhlsdtTxt}" }).addStyleClass("font-bold") //
                        ]
                    }).addStyleClass("divTitle borderLeft borderRight py-10px"),
                    new sap.m.HBox({
                        justifyContent: "Center",
                        items: [
                            new sap.m.Text({ text: "차 용 인 : {/Detail/Header/Ename}" }).addStyleClass("font-bold") //
                        ]
                    }).addStyleClass("divTitle borderLeft borderRight borderBottom pb-10px")
                ]
            });
        }
    });
});
