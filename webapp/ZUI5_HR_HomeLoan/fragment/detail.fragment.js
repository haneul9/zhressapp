/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/HoverIcon",
        "sap/m/InputBase"
    ],
    function (Common, HoverIcon, InputBase) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "detail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.getApprovalHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1280px",
                    contentHeight: "96%",
                    title: "주택자금융자 신청서",
                    beforeOpen: ApprovalHandler.onBeforeDetailDialog.bind(ApprovalHandler),
                    afterOpen: ApprovalHandler.onAfterDetailDialog.bind(ApprovalHandler),
                    content: [
                        this.buildRequesterInfo(), // 신청자
                        this.buildLoanInfo(ApprovalHandler), // 대출정보
                        this.buildAttachFiles(oController) // 첨부파일
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "차용금 증서",
                            press: ApprovalHandler.pressOpenDeed.bind(ApprovalHandler),
                            visible: "{= !${/Detail/IsNew}}"
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "신청",
                            press: ApprovalHandler.pressApprovalBtn.bind(ApprovalHandler),
                            visible: "{= ${/Detail/IsNew}}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: ApprovalHandler.pressSaveBtn.bind(ApprovalHandler),
                            visible: "{= !${/Detail/IsNew} && ${/Detail/Header/Status} === 'AA'}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            press: ApprovalHandler.pressDeleteBtn.bind(ApprovalHandler),
                            visible: "{= !${/Detail/IsNew} && ${/Detail/Header/Status} === 'AA'}"
                        }).addStyleClass("button-delete"),
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

            buildRequesterInfo: function () {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "신청자",
                    content: new sap.m.VBox({
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("소속", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/OrgehTxt}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("성명", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/Ename}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("입사일", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/ZentdtTxt}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("부양가족", true), //
                                                    new sap.m.Input({
                                                        maxLength: 2,
                                                        textAlign: sap.ui.core.TextAlign.End,
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        value: "{/Detail/Header/Zdptfn}",
                                                        description: "명",
                                                        liveChange: Common.setOnlyDigit
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("직급", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/ZpGradeTxt}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("생년월일", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/ZbirthTxt}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("근속년수", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/Zworyr}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("결혼여부", true), //
                                                    new sap.m.Select({
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        selectedKey: "{/Detail/Header/Zmrgfg}",
                                                        items: {
                                                            path: "/Detail/ZmrgfgDomains",
                                                            templateShareable: false,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        }
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("현 주소", true), //
                                    new sap.m.Input({
                                        maxLength: 255,
                                        layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "250px" }),
                                        width: "83%",
                                        editable: "{/Detail/Header/Edtfg}",
                                        value: "{/Detail/Header/Zptadr}"
                                    })
                                ]
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-30px")
                }).addStyleClass("custom-panel");
            },

            buildLoanInfo: function (ApprovalHandler) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "대출정보",
                    content: new sap.m.VBox({
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("대출유형", true), //
                                                    new sap.m.Select({
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        selectedKey: "{/Detail/Header/Zhltyp}",
                                                        items: {
                                                            path: "/Detail/ZhltypDomains",
                                                            templateShareable: false,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        }
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("지급은행", true), //
                                                    new sap.m.Input({
                                                        maxLength: 255,
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        value: "{/Detail/Header/BanklTxt}",
                                                        showValueHelp: "{/Detail/Header/Edtfg}",
                                                        valueHelpOnly: true,
                                                        valueHelpRequest: ApprovalHandler.searchBank.bind(ApprovalHandler)
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("지급계좌번호", true), //
                                                    new sap.m.Input({
                                                        maxLength: 15,
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        value: "{/Detail/Header/Bankn}",
                                                        liveChange: Common.setOnlyDigit
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("대출확정금액", false), //
                                                    new sap.m.Text({
                                                        layoutData: new sap.m.FlexItemData({ minWidth: "44%", styleClass: "money" }),
                                                        text: "{/Detail/Header/Zhlcat}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("대출신청금액", true), //
                                                    new sap.m.Input({
                                                        maxLength: 15,
                                                        textAlign: sap.ui.core.TextAlign.End,
                                                        width: "250px",
                                                        editable: "{/Detail/Header/Edtfg}",
                                                        value: "{/Detail/Header/Zhlrat}",
                                                        liveChange: ApprovalHandler.onChangeZhlrat.bind(ApprovalHandler)
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("기 대출금액", false), //
                                                    new sap.m.Text({
                                                        layoutData: new sap.m.FlexItemData({ minWidth: "44%", styleClass: "money" }),
                                                        text: "{/Detail/Header/Zhlpat}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("총 대출금액", false), //
                                                    new sap.m.Text({
                                                        layoutData: new sap.m.FlexItemData({ minWidth: "44%", styleClass: "money" }),
                                                        text: "{/Detail/Header/Zhltat}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("신청일", false), //
                                                    new sap.m.Text({ text: "{/Detail/Header/BegdaTxt}" }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("상환기간 및 조건", false), //
                                    new sap.m.Text({ text: "사내근로복지기금 운영 요령의 기준에 의함" }).addStyleClass("mx-10px")
                                ]
                            }).addStyleClass("search-field-group"),
                            new sap.m.HBox({
                                alignItems: sap.m.FlexAlignItems.Center,
                                visible: "{= ${/Detail/Header/Zmanager} !== null && ${/Detail/Header/Zmanager} !== '' }",
                                items: [
                                    new sap.ui.core.Icon({
                                        src: "sap-icon://information",
                                        size: "14px",
                                        color: "#0854a0"
                                    }).addStyleClass("mt-5px"),
                                    new sap.ui.core.HTML({
                                        preferDOM: false,
                                        content: "<div style='margin-left: 10px'>기타 문의사항은 <span style='color:#0070bd !important'>{/Detail/Header/Zmanager}</span>에게 연락바랍니다.</div>"
                                    })
                                ]
                            }).addStyleClass("pl-12px mt-10px")
                        ]
                    }).addStyleClass("search-box h-auto p-30px")
                }).addStyleClass("custom-panel");
            },

            buildAttachFiles: function (oController) {
                return new sap.m.Panel($.app.createId("FilePanel"), {
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "첨부파일",
                    headerToolbar: new sap.m.OverflowToolbar({
                        content: [
                            new sap.m.Title({ text: "첨부파일" }),
                            new HoverIcon({
                                src: "sap-icon://information",
                                hover: function (oEvent) {
                                    Common.onPressTableHeaderInformation.call(oController, oEvent, [
                                        "• 지방세(재산세부문) 세목별과세(납세)증명서 1부", //
                                        "• 계약서 사본 1부(주택임대차, 구입)",
                                        "• 주민등록 등본 1부",
                                        "• 통장사본 및 신분증(주민등록증 또는 운전면허증) 각 1부"
                                    ]);
                                },
                                leave: function (oEvent) {
                                    Common.onPressTableHeaderInformation.call(oController, oEvent);
                                }
                            }).addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue lh-46px")
                        ]
                    }).addStyleClass("pl-0"),
                    content: new sap.m.VBox({
                        items: [fragment.COMMON_ATTACH_FILES.renderer(oController, "001"), fragment.COMMON_ATTACH_FILES.renderer(oController, "002"), fragment.COMMON_ATTACH_FILES.renderer(oController, "003"), fragment.COMMON_ATTACH_FILES.renderer(oController, "004"), fragment.COMMON_ATTACH_FILES.renderer(oController, "005"), fragment.COMMON_ATTACH_FILES.renderer(oController, "006")]
                    }).addStyleClass("custom-multiAttach-file h-auto p-30px")
                }).addStyleClass("custom-panel");
            },

            getLabel: function (text, required, width) {
                return new sap.m.Label({
                    text: text,
                    width: width ? width : "130px",
                    required: required,
                    wrapping: true,
                    design: sap.m.LabelDesign.Bold,
                    textAlign: sap.ui.core.TextAlign.Right,
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });
            }
        });
    }
);
