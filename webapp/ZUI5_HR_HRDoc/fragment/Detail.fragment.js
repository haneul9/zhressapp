sap.ui.define(
    [
        "../../common/Common", //
        "../../common/ZHR_TABLES"
    ],
    function (Common, ZHR_TABLES) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Detail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var PageHandler = oController.PageHandler;

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1300px",
                    contentHeight: "96vh",
                    title: {
                        parts: [
                            {path: "/Detail/IsNew"},
                            {path: "/Detail/IsFinish"}
                        ],
                        formatter: function (v1, v2) {
                            return oController.getBundleText("LABEL_27021").interpolate(    // HR서류 발송 ${tx}
                                v2 === true
                                    ? oController.getBundleText("LABEL_00100")      // 조회
                                    : v1 === true
                                        ? oController.getBundleText("LABEL_00183")  // 등록
                                        : oController.getBundleText("LABEL_00102")  // 수정
                            );
                        }
                    },
                    content: [
                        this.buildSummaryBox(oController),  //
                        this.buildSubitBox(oController)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            enabled: "{/Detail/IsPossibleSave}",
                            visible: "{= !${/Detail/IsFinish}}",
                            press: PageHandler.onSaveDoc.bind(PageHandler)
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00185}", // 메일발송
                            enabled: "{/Detail/IsPossibleMail}",
                            visible: "{= !${/Detail/IsNew} && !${/Detail/IsFinish} }",
                            press: PageHandler.pressSendMail.bind(PageHandler)
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            visible: "{/Detail/IsPossibleDelete}",
                            press: PageHandler.onDeleteDoc.bind(PageHandler)
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            type: sap.m.ButtonType.Default,
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(PageHandler.Model());

                return oDialog;
            },

            buildSummaryBox: function (oController) {
                var PageHandler = oController.PageHandler;

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    // headerText: "{i18n>LABEL_27023}", // 개요
                    headerToolbar : [new sap.m.Toolbar({
				                    	 content : [new sap.m.Text({text : "{i18n>LABEL_27023}"}).addStyleClass("font-16px font-bold")]
				                     }).addStyleClass("toolbarNoBottomLine")],
                    content: new sap.m.HBox({
                        items: [
                            new sap.m.VBox({
                                width: "50%",
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_27002}", true), // 인사영역
                                            new sap.m.ComboBox({
                                                width: "310px",
                                                required: true,
                                                editable: "{/Detail/IsNew}",
                                                selectedKey: "{Persa}",
                                                selectionChange: PageHandler.checkSummaryControl.bind(PageHandler),
                                                items: {
                                                    path: "/Detail/Persas",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                }
                                            })
                                        ]
                                    }).addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_27004}", true), // 제목
                                            new sap.m.Input({
                                                width: "310px",
                                                value: "{Doctl}",
                                                editable: "{= !${/Detail/IsFinish}}",
                                                required: true,
                                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "HrDocumentsDetailOutline", "Doctl"),
                                                change: PageHandler.checkSummaryControl.bind(PageHandler)
                                            })
                                        ]
                                    }).addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_27024}", true), // Remind 주기
                                            new sap.m.RadioButtonGroup({
                                                width: "310px",
                                                columns: 4,
                                                selectedIndex: "{RmprdIdx}",
                                                editable: "{= !${/Detail/IsFinish}}",
                                                select: PageHandler.checkSummaryControl.bind(PageHandler),
                                                buttons: [
                                                    new sap.m.RadioButton({ text: "{i18n>LABEL_27025}" }), // 없음
                                                    new sap.m.RadioButton({ text: "{i18n>LABEL_27026}" }).addStyleClass("ml-0"), // 매일
                                                    new sap.m.RadioButton({ text: "{i18n>LABEL_27027}" }).addStyleClass("ml-0"), // 매주
                                                    new sap.m.RadioButton({ text: "{i18n>LABEL_27028}" }).addStyleClass("ml-0") // 격주
                                                ]
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
                                            this.getLabel("{i18n>LABEL_27003}", true), // HR서류
                                            new sap.m.ComboBox({
                                                width: "310px",
                                                required: true,
                                                editable: "{/Detail/IsNew}",
                                                selectedKey: "{Hrdoc}",
                                                selectionChange: PageHandler.checkSummaryControl.bind(PageHandler),
                                                items: {
                                                    path: "/Detail/Hrdocs",
                                                    template: new sap.ui.core.ListItem({ key: "{Hrdoc}", text: "{Hrdoctx}" })
                                                }
                                            })
                                        ]
                                    }).addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_27008}", true), // 제출기간
                                            // oDrs
                                            new sap.m.DateRangeSelection("SmbdaRange", {
                                                required: true,
                                                width: "310px",
                                                delimiter: "~",
                                                displayFormat: "{/Dtfmt}",
                                                dateValue: "{Smbda}",
                                                secondDateValue: "{Smeda}",
                                                editable: "{= !${/Detail/IsFinish}}",
                                                change: PageHandler.checkSummaryControl.bind(PageHandler)
                                            }).addDelegate({
                                                onAfterRendering: function () {
                                                    Common.disableKeyInput($.app.byId("SmbdaRange"));
                                                }
                                            })
                                        ]
                                    }).addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel(
                                                {
                                                    path: "/Detail/IsNew",
                                                    formatter: function (v) {
                                                        return v === true 
                                                                ? oController.getBundleText("LABEL_27029")  // 대상인원
                                                                : oController.getBundleText("LABEL_27040"); // 제출/대상(인원) 제출/메일발송(인원)
                                                    }
                                                },
                                                false
                                            ),
                                            new sap.m.Input({
                                                width: "200px",
                                                editable: false,
                                                value: {
                                                    parts: [
                                                        { path: "/Detail/IsNew" },
                                                        { path: "/Detail/Summary/TargetCnt" },
                                                        { path: "/Detail/Summary/CompleteCnt" },
                                                        { path: "/Detail/Summary/MailCnt" }
                                                    ],
                                                    formatter: function (v1, v2, v3, v4) {
                                                        // return v1 === true
                                                        //         ? v2
                                                        //         : [v3, v2].join(" / ");
                                                        return v1 === true
                                                                ? v2
                                                                : [v3, v4].join(" / ");
                                                    }
                                                },
                                                description: "{i18n>LABEL_27039}" // 명
                                            }),
                                            new sap.m.Text({
                                            	text : {
                                            		parts : [{path : "/Detail/Summary/TargetCnt"}, {path : "/Detail/Summary/ViewCnt"}],
                                            		formatter : function(fVal1, fVal2){ // 총 X명 / 조회건수 X명
                                            			return "(" + oController.getBundleText("LABEL_27043") + " " + fVal1 + " " + oController.getBundleText("LABEL_27039") + " / " + 
                                            				   oController.getBundleText("LABEL_27044") + " " + fVal2 + " " + oController.getBundleText("LABEL_27039") + ")";
                                            		}
                                            	},
                                            	visible : {
                                            		path : "/Detail/IsNew",
                                            		formatter : function(fVal){
                                            			return fVal == true ? false : true;
                                            		}
                                            	}
                                            }).addStyleClass("mb-8px")
                                        ]
                                    }).addStyleClass("search-field-group")
                                ]
                            }).addStyleClass("search-inner-vbox")
                        ]
                    }).addStyleClass("search-box h-auto p-0 non-scroll-y") // mt-8px
                })
                .addStyleClass("custom-panel")
                .bindElement("/Detail/Summary");
            },

            buildSubitBox: function (oController) {
                var PageHandler = oController.PageHandler;
                
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    // headerText: "{i18n>LABEL_27030}", // 제출 대상
                    // headerToolbar : [new sap.m.Toolbar({
				                //     	 content : [new sap.m.Text({text : "{i18n>LABEL_27030}"}).addStyleClass("font-16px font-bold"),  // 제출 대상
				                //     				new sap.m.ToolbarSpacer(),
				                //     				this.buildTableButtons(oController)]
				                //      }).addStyleClass("toolbarNoBottomLine")],
                    content: new sap.m.VBox({
                        alignItems: sap.m.FlexAlignItems.Start,
                        width: "100%",
                        items: [
                            this.buildTableButtons(oController), //
                            this.buildTable(oController)
                        ]
                    })
                }).addStyleClass("custom-panel mt-20px");
            },

            buildTableButtons: function (oController) {
                var PageHandler = oController.PageHandler;
				
				return new sap.m.HBox({
					width : "100%",
                    justifyContent: "SpaceBetween",
                    items: [
                    	new sap.m.HBox({
                        	justifyContent: sap.m.FlexJustifyContent.Start,
                            items: [
                                new sap.m.Text({text : "{i18n>LABEL_27030}"}).addStyleClass("font-16px font-bold paddingLeft1rem pt-7px") // 제출 대상
                            ]
                        }),
                        new sap.m.HBox({
                        	justifyContent: sap.m.FlexJustifyContent.End,
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00183}", // 등록
                                    enabled: "{/Detail/IsPossibleSave}",
                                    visible: "{= !${/Detail/IsFinish}}",
                                    press: PageHandler.pressAddTarget.bind(PageHandler)
                                }).addStyleClass("button-light"),
                                new sap.m.Button("TableIn03-remove", {
                                    text: "{i18n>LABEL_00103}", // 삭제
                                    enabled: "{/Detail/IsPossibleTargetDelete}",
                                    visible: "{= !${/Detail/IsFinish}}",
                                    press: PageHandler.pressDeleteTarget.bind(PageHandler)
                                }).addStyleClass("button-delete")
                            ]
                        }).addStyleClass("button-group")
                    ]
                });	
			
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00183}", // 등록
                                    enabled: "{/Detail/IsPossibleSave}",
                                    visible: "{= !${/Detail/IsFinish}}",
                                    press: PageHandler.pressAddTarget.bind(PageHandler)
                                }).addStyleClass("button-light"),
                                new sap.m.Button("TableIn03-remove", {
                                    text: "{i18n>LABEL_00103}", // 삭제
                                    enabled: "{/Detail/IsPossibleTargetDelete}",
                                    visible: "{= !${/Detail/IsFinish}}",
                                    press: PageHandler.pressDeleteTarget.bind(PageHandler)
                                }).addStyleClass("button-delete")
                            ]
                        }).addStyleClass("button-group")
                    ]
                });
            },

            buildTable: function (oController) {
                var PageHandler = oController.PageHandler;
                var oTable = new sap.ui.table.Table("TargetTable", {
                    width: "100%",
                    selectionMode: "{= ${/Detail/IsPossibleMail} ? 'MultiToggle' : 'None' }",
                    enableSelectAll: true,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
                })
                .addStyleClass("mt-8px") // multi-header
                .bindRows("/Detail/List");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Ztitletx", label: "{i18n>LABEL_00114}" /* 직위 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "Zhgradetx", label: "{i18n>LABEL_00137}" /* 직급구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "ZpGradetx", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "Zposttx", label: "{i18n>LABEL_00115}" /* 직책 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "Fulln", label: "{i18n>LABEL_00108}" /* 소속 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%", align: "Begin" },
                    // { id: "Pktxt", label: "{i18n>LABEL_00184}" /* 하위그룹 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%", align: "Begin" },
                    { id: "Viewk", label: "{i18n>LABEL_27042}" /* 조회여부 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "6%", templateGetter: "changeViewK", templateGetterOwner: PageHandler },
                    { id: "Mailk", label: "{i18n>LABEL_27045}" /* 메일발송여부 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "6%", templateGetter: "changeMiewK", templateGetterOwner: PageHandler },
                    { id: "Entda", label: "{i18n>LABEL_00127}" /* 입사일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "9%" },
                    { id: "Rmdda", label: "{i18n>LABEL_27013}" /* 최종 Remind*/, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Smtda", label: "{i18n>LABEL_27019}" /* 제출일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "9%" },
                    { id: "Appnm", label: "{i18n>LABEL_00192}" /* 파일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "6%", templateGetter: "getLinkFileIcon", templateGetterOwner: PageHandler }
                ]);

                return oTable;
            },

            getLabel: function (text, required) {
                return new sap.m.Label({
                    text: text,
                    width: "130px",
                    required: required,
                    design: sap.m.LabelDesign.Bold,
                    textAlign: sap.ui.core.TextAlign.Right,
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });
            }
        });
    }
);
