sap.ui.define([],
    function () {
        "use strict";

        var DIALOG_FORM_ID = [$.app.CONTEXT_PATH, "Form10"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_FORM_ID, {
            createContent: function (oController) {
                var PageHandler = oController.PageHandler;

                var oDialog = new sap.m.Dialog({
                    showHeader: false,
                    contentWidth: "595px",
                    contentHeight: "842px",
                    content: [
                        this.buildForm(oController) //
                    ],
                    beginButton: [
                        new sap.m.Button({
                            type: sap.m.ButtonType.Default,
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ],
                    endButton: [
                        new sap.m.Button({
                            type: sap.m.ButtonType.Default,
                            text: oController.getBundleText("LABEL_27038"), // 서명 후 제출
                            visible: "{= !${/WriteForm/isFinish} }",
                            press: PageHandler.openSignaturePad.bind(PageHandler)
                        })
                    ]
                })
                    .addStyleClass("custom-dialog-popup")
                    .setModel(oController.PageHandler.Model());

                return oDialog;
            },

            buildForm: function () {
                return new sap.m.VBox(this.createId("Form10"), {
                    items: [
                        new sap.m.HBox({
                            height: "8vh",
                            justifyContent: sap.m.FlexJustifyContent.Center,
                            alignItems: sap.m.FlexAlignItems.End,
                            items: [
                                new sap.m.Text({text: "근로계약서"}).addStyleClass("font-1_5rem")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "7vh",
                            items: [
                                new sap.m.Text({ 
                                    text: "사용자 주식회사 롯데케미칼(이하 \"갑\"이라 한다)과 근로자 {/WriteForm/Data/Ename}(이하 \"을\"이라 한다) 는 아래와 같이 근로계약을  체결하고, 본 계약을 성실히 이행 준수할 것을 서약합니다." 
                                }).addStyleClass("form-font")
                            ]
                        }).addStyleClass("mt-10px"),
                        new sap.m.HBox({
                            height: "4vh",
                            items: [
                                new sap.m.Text({ 
                                    text: "1. " 
                                }).addStyleClass("form-font"),
                                new sap.m.Text({ 
                                    text: "근로 계약 기간 : {/WriteForm/Data/Entda}부터로 한다." 
                                }).addStyleClass("form-font")
                            ]
                        }).addStyleClass("mt-10px"),
                        new sap.m.HBox({
                            height: "4vh",
                            items: [
                                new sap.m.Text({ 
                                    text: "2. " 
                                }).addStyleClass("form-font"),
                                new sap.m.Text({ 
                                    text: "수습기간 : {/WriteForm/Data/Pbbda} ~ {/WriteForm/Data/Pbeda}. {/WriteForm/Data/Prbzt}개월간" 
                                }).addStyleClass("form-font")
                            ]
                        }).addStyleClass("mt-10px"),
                        new sap.m.HBox({
                            height: "4vh",
                            items: [
                                new sap.m.Text({ 
                                    width: "30px",
                                    text: "2-1. " 
                                }).addStyleClass("form-font ml-20px"),
                                new sap.m.Text({ 
                                    text: "수습기간 중 사고를 유발하거나 또는 직원으로서 부적격 하다고 판단이 될 때는 본 계약을 해지 할 수 있다." 
                                }).addStyleClass("form-font")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "4vh",
                            items: [
                                new sap.m.Text({ 
                                    text: "3. " 
                                }).addStyleClass("form-font"),
                                new sap.m.Text({ 
                                    text: "임금 : 별도의 연봉계약서에 따른다." 
                                }).addStyleClass("form-font")
                            ]
                        }).addStyleClass("mt-10px"),
                        new sap.m.HBox({
                            height: "5vh",
                            justifyContent: sap.m.FlexJustifyContent.Center,
                            alignItems: sap.m.FlexAlignItems.End,
                            items: [
                                new sap.m.Text({text: "{/WriteForm/Data/Today}"}).addStyleClass("form-font")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "10vh",
                            items: [
                                new sap.m.VBox({
                                    width: "40%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "사용자:"}).addStyleClass("form-font"),
                                                new sap.m.Text({text: "{/WriteForm/Data/Addre}"}).addStyleClass("form-font")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "위의 사항제 동의하겠습니다."}).addStyleClass("form-font")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "※2021.01.11 15:00:00 192.168.0.1 SFADMIN(홍길동)"}).addStyleClass("form-font")
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.VBox({
                                    width: "60%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "근로자   주소 :"}).addStyleClass("form-font"),
                                                new sap.m.Text({text: "{/WriteForm/Data/AddreE}"}).addStyleClass("form-font ml-10px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "주민등록번호 :"}).addStyleClass("form-font"),
                                                new sap.m.Text({text: "{/WriteForm/Data/Regno}"}).addStyleClass("form-font ml-10px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "성             명 :"}).addStyleClass("form-font"),
                                                new sap.m.Text({text: "{/WriteForm/Data/Ename}"}).addStyleClass("form-font ml-10px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Text({text: "서             명 :"}).addStyleClass("form-font"),
                                                new sap.m.Image(this.createId("signature-img"), {
                                                    src: "{/WriteForm/signatureImg}",
                                                    width: "200px",
                                                    height: "100px"
                                                }).addStyleClass("signature-image ml-10px mt-5px")
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }).addStyleClass("mt-10px")
                    ]
                });
            }
        });
    }
);
