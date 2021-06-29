/* eslint-disable no-undef */
jQuery.sap.includeStyleSheet("ZUI5_HR_MedApply/css/MyCss.css");

sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/PageHelper",
        "common/PickOnlyDateRangeSelection",
        "common/HoverIcon",
        "sap/ui/commons/layout/MatrixLayout",
        "sap/ui/commons/layout/MatrixLayoutRow",
        "sap/ui/commons/layout/MatrixLayoutCell"
    ],
    function (Common, ZHR_TABLES, PageHelper, PickOnlyDateRangeSelection, HoverIcon, MatrixLayout, MatrixLayoutRow, MatrixLayoutCell) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_MedApply.MedApply", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf controller.main
             */
            getControllerName: function () {
                return "ZUI5_HR_MedApply.MedApply";
            },

            /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
             * Since the Controller is given to this method, its event handlers can be attached right away.
             * @memberOf controller.main
             */
            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_BENEFIT_SRV");

                return new PageHelper({
                    contentItems: [
                        new sap.ui.core.HTML({ content: "<div style='' />" }), //
                        this.buildSearchBox(oController),
                        this.buildTableBox(oController)
                    ]
                }).setModel(oController._ListCondJSonModel);
            },

            buildSearchBox: function (oController) {
                return new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.HBox(oController.PAGEID + "_HassPer", {
                                    items: [
                                        new sap.m.Label({
                                            textAlign: "Begin",
                                            text: "{i18n>LABEL_47144}" // 부서사원
                                        }),
                                        new sap.m.Input({
                                            valueHelpRequest: function (oEvent) {
                                                oController.searchOrgehPernr.call(oController, oEvent, "X");
                                            },
                                            valueHelpOnly: true,
                                            showValueHelp: true,
                                            width: "240px"
                                        }),
                                        new sap.m.Text({
                                            width: "auto",
                                            text: "{i18n>MSG_47049}",
                                            textAlign: "Begin"
                                        }).addStyleClass("info-text-red ml-8px")
                                    ]
                                }),
                                new sap.m.Label({
                                    textAlign: "Begin",
                                    text: "{i18n>LABEL_47007}" // 신청일
                                }),
                                new PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
                                    width: "250px",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    delimiter: "~",
                                    dateValue: moment().startOf("month").hours(10).toDate(),
                                    secondDateValue: moment().hours(10).toDate()
                                }),
                                new sap.m.Label({
                                    textAlign: "Begin",
                                    text: "{i18n>LABEL_47004}" // 결재상태
                                }),
                                new sap.m.Select(oController.PAGEID + "_HeadSel", {
                                    width: "200px"
                                })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onSearch,
                                    text: "{i18n>LABEL_23010}" // 조회
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("search-box search-bg pb-7px mt-16px").bindElement("/Data");
            },

            buildTableBox: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: oController.getBundleText("MSG_05001")
                })
				.addStyleClass("mt-10px row-link")
                .attachCellClick(oController.onSelectedRow)
                .bindRows("/List");
                
                var columnModels = [
                    { id: "Chkitem", label: "선택" , plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "4%", templateGetter: "getCheckBoxTemplate", templateGetterOwner: oController },
                    { id: "Begda", label: "{i18n>LABEL_47091}" /*신청일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: false, width: "7%" },
                    { id: "MedDate", label: "{i18n>LABEL_47092}" /*진료일*/ , plabel: "", resize: true, span: 0, type: "date", sort: true, filter: false, width: "7%" },
                    { id: "PatiName", label: "{i18n>LABEL_47093}" /*환자명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: false, width: "9%" },
                    { id: "RelationTx", label: "{i18n>LABEL_47094}" /*관계*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: false, width: "7%" },
                    { id: "HospName", label: "{i18n>LABEL_47095}" /*의료기관명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: false, width: "14%", align: "Begin" },
                    { id: "DiseName", label: "{i18n>LABEL_47096}" /*진료내용*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: false, width: "16%", align: "Begin" },
                    { id: "MychargeT", label: "{i18n>LABEL_47097}" /*총 수납금액*/ , plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%" },
                    { id: "SuppAmtT", label: "{i18n>LABEL_47098}" /*회사 지원금액*/ , plabel: "", resize: true, span: 0, type: "money", sort: false, filter: false, width: "10%" },
                    { id: "PayDateT", label: "{i18n>LABEL_47099}" /*지급(예정)년월*/ , plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "8%" },
                    { id: "Status", label: "{i18n>LABEL_47100}" /*결재상태*/ , plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "8%", templateGetter: "getStatus"}
                ];

                ZHR_TABLES.makeColumn(oController, oTable, columnModels);

                var aRows = [
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                vAlign: "Bottom",
                                content: [
                                    new sap.ui.core.HTML({ content: "<span class='sub-title'>" + oBundleText.getText("LABEL_47002") + "</span>" }),	// 신청현황
                                    new HoverIcon({
                                        size: "14px",
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47001")); // ο 의료비지원 대상은 당사 임직원의 피부양자로서 건강보험증에 등록한 직계가족에 한함.<br/>(신생아 출생 등 주민등록번호의 생성 및 소멸 사유가 있는 경우 증빙서류 제출 요망)<br/>ο 대상자가 조회되지 않으면 가족사항 수정화면에서 건강보험대상에 체크하여 수정 완료 후 신청 진행.<br/>치과의 치료기관 입력 방법 : 치과 보철 치료 시 치과(보철)로 입력, 치과 일반 치료 시 치과(일반)으로 입력 요망.
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")
                                ]
                            }),
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: [
                                    new sap.m.Button({
                                        text: "{i18n>LABEL_47152}", // 일괄신청
                                        enabled: "{/isPossibleApprovalAll}",
                                        press: oController.onApprovalAll.bind(oController)
                                    }).addStyleClass("button-light"),
                                    new sap.m.Button(oController.PAGEID + "_NewBtn", {
										text: "{i18n>LABEL_47151}", // 추가
                                        press: function () {
                                            oController._NewGubun = "O";
                                            oController._MedDateChange = "X";
                                            oController.getBukrs();
                                        }
                                    }).addStyleClass("button-light ml-5px"),
                                    new sap.ui.commons.layout.HorizontalLayout(oController.PAGEID + "_NewIcon", {
                                        visible: false,
                                        content: [
											new sap.ui.core.Icon({ src: "sap-icon://message-information", color: "red", size: "15px" }),	//
											new sap.ui.core.HTML({ content: "<span style='font-size:14px;color:red;line-height:0px;'>&nbsp;" + oController.getBundleText("MSG_47040") + "</span>" })
										]
                                    })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: null
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: oTable
                            })
                        ]
                    })
                ];

                return new MatrixLayout({
                    columns: 2,
                    rows: aRows
                });
            }
        });
    }
);
