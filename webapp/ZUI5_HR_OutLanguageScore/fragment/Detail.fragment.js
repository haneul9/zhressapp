/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/AttachFileAction",
        "common/PickOnlyDatePicker"
    ],
    function (Common, AttachFileAction, PickOnlyDatePicker) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Detail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var DetailHandler = oController.getDetailHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1000px",
                    contentHeight: "60vh",
                    title: "{= ${/IsViewMode} ? ${i18n>LABEL_51016} : ${i18n>LABEL_51002} }",    // 외부 어학 성적 등록, 조회
                    content: [
                        this.buildInfoMessage(),    //
                        this.buildInfoBox(DetailHandler),
                        new sap.m.Panel({
                            expanded: false,
                            expandable: false,
                            content: new sap.m.VBox({
                                width: "100%",
                                items: [
                                    sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
                                ]
                            }).addStyleClass("pt-30px")
                        }).addStyleClass("custom-panel mt-6px")
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: DetailHandler.onPressSaveBtn.bind(DetailHandler),
                            enabled: "{/IsPossibleSave}",
                            visible: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }"
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            press: DetailHandler.onPressDeleteBtn.bind(DetailHandler),
                            visible: "{= ${/Info/Status} === 'AA' }"
                        }).addStyleClass("button-delete"),
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                AttachFileAction.callDeleteSelectedFiles.call(oController);
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(DetailHandler.getModel());

                return oDialog;
            },

            buildInfoMessage: function () {

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.Start,
                    alignItems: sap.m.FlexAlignItems.End,
                    items: [
                        new sap.m.HBox({
                            height: "100px",
                            items: [
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#da291c"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_51002}" // B2B 사이트에서 응시한  OPIc 성적은 등록신청 불필요합니다.(응시 익월 자동 반영)
                                                }).addStyleClass("ml-6px color-info-red")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#0854a0"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_51003}" // 신청하신 성적은 익월말 내에 반영되므로 최대 2개월까지 소요될 수 있습니다. (10월 신청성적 → 11월말 내 반영)
                                                }).addStyleClass("ml-6px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#0854a0"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_51004}" // 실제 성적과 입력한 정보가 상이한 경우 반려 처리됩니다.
                                                }).addStyleClass("ml-6px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#0854a0"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_51005}" // 성적 유효기간(응시일~2년) 경과 성적은 신청 불가합니다.
                                                }).addStyleClass("ml-6px")
                                            ]
                                        })
                                    ]
                                }).addStyleClass("mb--10px")
                            ]
                        })
                    ]
                });
            },

            buildInfoBox: function (DetailHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "900px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox("LanguageInputForm", {
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_51003}", true), // 외국어/시험명
                                                    new sap.m.ComboBox({
                                                        required: true,
                                                        width: "140px",
                                                        selectedKey: "{/Info/Forcd}",
                                                        editable: "{= !${/IsViewMode}}",
                                                        items: {
                                                            path: "/Langs",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        change: DetailHandler.onChangeLang.bind(DetailHandler)
                                                    }),
                                                    new sap.m.ComboBox({
                                                        required: true,
                                                        width: "165px",
                                                        selectedKey: "{/Info/Tescd}",
                                                        editable: "{= !${/IsViewMode}}",
                                                        items: {
                                                            path: "/Exams",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        change: DetailHandler.onChangeExam.bind(DetailHandler)
                                                    }).addStyleClass("ml-5px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_51007}", true), // 수험번호
                                                    new sap.m.Input({
                                                        required: true,
                                                        width: "200px",
                                                        maxLength: 30,
                                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                                        value: "{/Info/Certn}",
                                                        change: DetailHandler.onChangeInput.bind(DetailHandler)
                                                    })
                                                ],
                                                visible: "{= ${/Info/Forcd} !== 'ALL' && ${/Info/Tescd} !== 'ALL' }"
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_51011}", true), // 응시지역
                                                    new sap.m.ComboBox({
                                                        required: true,
                                                        width: "200px",
                                                        selectedKey: "{/Info/Tesar}",
                                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                                        change: DetailHandler.onChangeInput.bind(DetailHandler),
                                                        items: {
                                                            path: "/Tesars",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        }
                                                    })
                                                ],
                                                visible: "{= ${/Info/Forcd} !== 'ALL' && ${/Info/Tescd} !== 'ALL' }"
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_51004}", false), // 유형
                                                    new sap.m.Text({
                                                        text: "{/Info/TextA}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_51008}", true), // 평가일
                                                    new PickOnlyDatePicker({
                                                        required: true,
                                                        width: "200px",
                                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                                        displayFormat: "{/Info/Dtfmt}",
                                                        placeholder: "{/Info/Dtfmt}",
                                                        dateValue: "{/Info/Evldd}",
                                                        change: DetailHandler.onChangeInput.bind(DetailHandler)
                                                    })
                                                ],
                                                visible: "{= ${/Info/Forcd} !== 'ALL' && ${/Info/Tescd} !== 'ALL' }"
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel(
                                                        "{= ${/Info/IsHSK} ? ${i18n>LABEL_51015} : ${i18n>LABEL_51014}}", 
                                                        true, 
                                                        "120px", 
                                                        "{= ${/Info/Codty} === '002' || ${/Info/IsHSK} ? true : false }"
                                                    ), // 평가기관등급, 급수
                                                    new sap.m.ComboBox({
                                                        required: true,
                                                        width: "200px",
                                                        selectedKey: "{/Info/Tesgr}",
                                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                                        change: DetailHandler.onChangeInput.bind(DetailHandler),
                                                        items: {
                                                            path: "/Tesgrs",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        visible: "{= ${/Info/Codty} === '002' || ${/Info/IsHSK} ? true : false }"
                                                    })
                                                ],
                                                visible: "{= ${/Info/Forcd} !== 'ALL' && ${/Info/Tescd} !== 'ALL' }"
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("L/C", true),
                                    new sap.m.Input({
                                        required: true,
                                        width: "100px",
                                        // type: sap.m.InputType.Number,
                                        maxLength: 4,
                                        value: "{/Info/Lcsco}",
                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                        liveChange: DetailHandler.calcTotScore.bind(DetailHandler),
                                        layoutData: new sap.m.FlexItemData({minWidth: "29.3%"})
                                    }),
                                    this.getLabel("R/C", true),
                                    new sap.m.Input({
                                        required: true,
                                        width: "100px",
                                        // type: sap.m.InputType.Number,
                                        maxLength: 4,
                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                        liveChange: DetailHandler.calcTotScore.bind(DetailHandler),
                                        value: "{/Info/Rcsco}"
                                    }).addStyleClass("ml-8px")
                                ],
                                visible: "{= ${/Info/Codty} === '001' ? true : false }"
                            }).addStyleClass("search-field-group"),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("{i18n>LABEL_51009}", false), // 총점
                                    new sap.m.Input({
                                        width: "100px",
                                        // type: sap.m.InputType.Number,
                                        maxLength: 4,
                                        editable: false,
                                        value: "{/Info/Ttsco}",
                                        layoutData: new sap.m.FlexItemData({minWidth: "29.3%"})
                                    }),
                                    this.getLabel("W/C", true, "120px", "{= ${/Info/IsHSK} === true ? true : false }"),
                                    new sap.m.Input({
                                        required: true,
                                        width: "100px",
                                        // type: sap.m.InputType.Number,
                                        maxLength: 4,
                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                        liveChange: DetailHandler.calcTotScore.bind(DetailHandler),
                                        value: "{/Info/Wcsco}",
                                        visible: "{= ${/Info/IsHSK} === true ? true : false }"
                                    }).addStyleClass("ml-8px")
                                ],
                                visible: "{= ${/Info/Codty} === '001' ? true : false }"
                            }).addStyleClass("search-field-group"),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("{i18n>LABEL_51018}", true),  // 점수
                                    new sap.m.Input({
                                        required: true,
                                        width: "100px",
                                        // type: sap.m.InputType.Number,
                                        maxLength: 4,
                                        value: "{/Info/Tcsco}",
                                        editable: "{= !${/IsViewMode} || ${/Info/Status} === 'AA' }",
                                        liveChange: DetailHandler.calcTotScore.bind(DetailHandler),
                                        layoutData: new sap.m.FlexItemData({minWidth: "29.3%"})
                                    })
                                ],
                                visible: "{= ${/Info/Forcd} === '0001' && ${/Info/Tescd} === '05' ? true : false }"
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel mt-6px");
            },

            getLabel: function(text, required, width, visible) {

                return new sap.m.Label({
                    text: text,
                    width: width ? width : "120px",
                    required: required,
                    visible: Common.isNull(visible) ? true : visible,
                    wrapping: true,
                    design: sap.m.LabelDesign.Bold,
                    textAlign: sap.ui.core.TextAlign.Right,
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });
            }
        });
    }
);
