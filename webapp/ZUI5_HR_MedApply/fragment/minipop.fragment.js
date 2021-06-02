sap.ui.define(
    [
        "common/ZHR_TABLES",    // 
        "sap/ui/commons/layout/MatrixLayout",
        "sap/ui/commons/layout/MatrixLayoutRow",
        "sap/ui/commons/layout/MatrixLayoutCell"
    ],
    function (ZHR_TABLES, MatrixLayout, MatrixLayoutRow, MatrixLayoutCell) {
        "use strict";
        sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.minipop", {
            createContent: function (oController) {
                
                return new sap.m.Dialog(oController.PAGEID + "_miniDialog", {
                    title: "{i18n>LABEL_47056}",    // 의료기관 검색
                    contentWidth: "660px",
                    beforeOpen: oController.onMini,
                    afterOpen: oController.onFocusMini,
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00133}", // 닫기
                            press: oController.onCloseMini
                        }).addStyleClass("button-default")
                    ],
                    content: [
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            fitContainer: true,
                            items: [
                                this.buildContent(oController)  // sap.ui.commons.layout.MatrixLayout
                            ]
                        }).addStyleClass("paddingbody")
                    ]
                });
            },

            buildContent: function(oController) {

                var oSel = new sap.m.Select(oController.PAGEID + "_mSel", {
                    width: "180px",
                    change: oController.onChange
                });
                oSel.addItem(new sap.ui.core.Item({ key: "1", text: "{i18n>LABEL_47059}" }));   // 의료기관명
                oSel.addItem(new sap.ui.core.Item({ key: "2", text: "{i18n>LABEL_47060}" }));   // 사업자번호
                oSel.setSelectedKey("1");

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_dTable", {
                    selectionMode: "Single",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>MSG_05001}"
                })
                .setModel(new sap.ui.model.json.JSONModel())
                .addStyleClass("mt-8px");

                var columnModels = [
                    { id: "HospName", label: "{i18n>LABEL_47059}" /*의료기관명*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50%" },
                    { id: "Comid", label: "{i18n>LABEL_47060}" /*사업자번호*/ , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50%" }
                ];

                ZHR_TABLES.makeColumn(oController, oTable, columnModels);

                var aMatrixRows = [
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                content: [
                                    oSel,
                                    new sap.ui.core.HTML({ content: "<span>&nbsp;</span>" }),
                                    new sap.m.Input(oController.PAGEID + "_mInput", {
                                        width: "300px",
                                        submit: oController.onMiniSearch
                                    }),
                                    new sap.ui.core.HTML({ content: "<span>&nbsp;</span>" }),
                                    new sap.m.Button({
                                        press: oController.onMiniSearch,
                                        text: "{i18n>LABEL_23010}" // 조회
                                    }).addStyleClass("button-search btn-margin mt-4px"),
                                    new sap.m.Button({
                                        press: oController.onMiniAdd,
                                        text: "{i18n>LABEL_00153}" // 추가
                                    }).addStyleClass("button-light righter btn-margin mt-4px")
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                content: [
                                    new sap.ui.core.HTML({ content: "<div style='height:2px;'/>" })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow(oController.PAGEID + "_TableRow", {
                        cells: [
                            new MatrixLayoutCell({
                                content: [
                                    oTable
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow(oController.PAGEID + "_NewRow", {
                        cells: [
                            new MatrixLayoutCell({
                                content: [
                                    // MSG_47005: ※ 의료기관명으로 조회가 안되는 경우 사업자등록번호로 다시 조회한 후에도 조회가 안되면 해당 의료기관은 등록되어 있지 않습니다.<br/>의료기관을 등록하시려면 아래의 버튼을 클릭하시기 바랍니다.
                                    // LABEL_47062: 의료기관 신규등록
                                    // MSG_47006: ※ 그외 문의사항은 의료비 담당자[ 본사/연구소: 이주혜(4288), 여수 : 박민종(2053), 대산 : 김은희(5149) ] 에게 연락하시기 바랍니다.
                                    new sap.ui.core.HTML({
                                        preferDOM: false,
                                        content:
                                            "<div style='border:1px solid rgb(140,140,140);background-color:rgb(240,240,240);border-radius:10px;padding:15px;'><span style='color:black;font-size:13px;'>" +
                                            oController.getBundleText("MSG_47005") +
                                            "</span>" +
                                            "<br/><button id='" +
                                            oController.PAGEID +
                                            "_NoticeBtn' style='width:180px;display:inline-block;' class='sapMBtnBase sapMBtn button-delete sapMBarChild'>" +
                                            "<span class='sapMBtnInner sapMBtnHoverable sapMFocusable sapMBtnText sapMBtnDefault' style='line-height:33px;'>" +
                                            oController.getBundleText("LABEL_47062") +
                                            "</span>" +
                                            "</button><br/><span style='color:black;font-size:13px;'><br/>" +
                                            oController.getBundleText("MSG_47006") +
                                            "</span></div>"
                                    })
                                ]
                            })
                        ]
                    })
                ];

                $(document).on("click", "#" + oController.PAGEID + "_NoticeBtn", oController.clickNotice);

                return new MatrixLayout({
                    rows: aMatrixRows
                });
            }
        });
    }
);
