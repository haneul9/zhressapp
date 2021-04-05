sap.ui.define(
    [
        "common/PageHelper",
        "common/HoverIcon",
        "common/ZHR_TABLES"
    ],
    function (PageHelper, HoverIcon, ZHR_TABLES) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            
            getControllerName: function () {
                return $.app.APP_ID;
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_PROMOTION_SRV");
            },

            createContent: function (oController) {
                this.loadModel();

                return new PageHelper({
                    contentItems: [
                        this.getInfoBox(), //
                        this.getHeaderBox(oController),
                        this.getContentsBox(oController)
                    ]
                }).setModel(oController._PromotionModel);
            },

            getInfoBox: function () {
                return new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    alignContent: sap.m.FlexAlignContent.End,
                    alignItems: sap.m.FlexAlignItems.End,
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            direction: sap.m.FlexDirection.Column,
                            items: [
                                new sap.m.Label({
                                    text: "{/PromoF4/Zcomment}",
                                    design: "Bold"
                                }).addStyleClass("sub-title color-signature-gray")
                            ]
                        })
                    ]
                }).addStyleClass("mt-3px ml-3px");
            },

            getHeaderBox: function (oController) {
                return new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_13002}", // 축소/확장
                                    icon: "sap-icon://menu2",
                                    width: "130px",
                                    press: oController.onCollapseExpandPress.bind(oController)
                                }).addStyleClass("button-light"),
                                new sap.m.ComboBox({
                                    width: "400px",
                                    selectedKey: "{/PromoF4/Orgeh}",
                                    change: oController.onChangeOrgeh.bind(oController),
                                    items: {
                                        path: "/PromoF4/OrgehCodes",
                                        template: new sap.ui.core.ListItem({
                                            key: "{Orgeh}",
                                            text: "{OrgehText}",
                                            customData: [new sap.ui.core.CustomData({ key: "Zyear", value: "{Zyear}" })]
                                        })
                                    }
                                }).addStyleClass("ml-20px"),
                                new sap.m.Text({
                                    text: {
                                        parts: [
                                            { path: "/PromoList/PromoListExport/ETotal" }, //
                                            { path: "/PromoList/PromoListExport/EIng" },
                                            { path: "/PromoList/PromoListExport/EFinish" }
                                        ],
                                        formatter: function (v1, v2, v3) {
                                            return oController.getBundleText("LABEL_13055").interpolate(v1, v2, v3);
                                        }
                                    },
                                    visible: {
                                        path: "/PromoList/PromoListExport/ETotal",
                                        formatter: function (v) {
                                            if (v) return true;
                                            else return false;
                                        }
                                    }
                                }).addStyleClass("ml-20px font-18px")
                            ]
                        }).addStyleClass("search-field-group")
                    ]
                }).addStyleClass("search-box h-auto mt-8px");
            },

            getContentsBox: function (oController) {
                var SideNavBox = new sap.m.FlexBox("sideNavigationBox", {
                    width: "16%",
                    height: "100%",
                    direction: sap.m.FlexDirection.Column,
                    fitContainer: true,
                    items: [
                        new sap.tnt.SideNavigation("sideNavigation", {
                            item: new sap.tnt.NavigationList({
                                items: [
                                    new sap.tnt.NavigationListItem({
                                        key: "ALL",
                                        text: "{i18n>LABEL_13060}",
                                        select: oController.onSelectNaviAll.bind(oController),
                                        items: {
                                            path: "/PromoList/Grades",
                                            template: new sap.tnt.NavigationListItem({
                                                key: "{Grade}",
                                                text: "{GradeTxt}",
                                                select: oController.onSelectNavi.bind(oController)
                                            })
                                        }
                                    })
                                ]
                            })
                        })
                    ]
                }).addStyleClass("side-navigation-box");

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    fixedColumnCount: 5,
                    visibleRowCount: 10,
                    minAutoRowCount: 10,
                    visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto, // Auto, Fixed, Interactive
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("multi-header custom-progress-indicator mt-8px")
                    .bindRows("/PromoList/PromoListTable1")
                    .setRowSettingsTemplate(
                        new sap.ui.table.RowSettings({
                            highlight: {
                                path: "RecSeqGrade",
                                formatter: function (v) {
                                    return parseInt(v) > 0 ? sap.ui.core.MessageType.Success : sap.ui.core.MessageType.None;
                                }
                            }
                        })
					);
					
				var RecSeqGradeTooltip = [
					oController.getBundleText("MSG_13014"), // ※ 추천대상자의 서열을 숫자로 입력하세요.
					oController.getBundleText("MSG_13015") // 추천서열이 입력되지 않은경우 미추천으로 처리됩니다.
				];

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "PtypeTx", label: "{i18n>LABEL_13004}" /* 구분 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getPtypeText" },
                    { id: "Zseq", label: "{i18n>LABEL_13005}" /* 번호 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "Orgtx", label: "{i18n>LABEL_13006}" /* 부서 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "Ename", label: "{i18n>LABEL_13007}" /* 성명 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getEnameLink" },
                    { id: "RecSeqGrade", label: "{i18n>LABEL_13050}" /* 추천서열 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getRecSeqGradeInput", tooltip: RecSeqGradeTooltip },
                    { id: "PGradeTxt", label: "{i18n>LABEL_13010}" /* 현직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "GradeYr", label: "{i18n>LABEL_13011}" /* 직급년차 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "PrCnt", label: "{i18n>LABEL_13012}" /* 심사횟수 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "TotalPnt", label: "{i18n>LABEL_13044}" /* 총점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "ApointAvr", label: "{i18n>LABEL_13027}" /* 고과점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "GradePnt", label: "{i18n>LABEL_13028}" /* 직급년차점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "MgrPnt", label: "{i18n>LABEL_13029}" /* 보직점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "LanPnt", label: "{i18n>LABEL_13035}" /* 외국어점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "RpPnt", label: "{i18n>LABEL_13043}" /* 상벌점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "LicensePnt", label: "{i18n>LABEL_13066}" /* 자격점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "EduPnt", label: "{i18n>LABEL_13067}" /* 교육이수점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "IdeaPnt", label: "{i18n>LABEL_13068}" /* 제안점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "ZpostTx", label: "{i18n>LABEL_13008}" /* 직책 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "ZpostBeg", label: "{i18n>LABEL_13009}" /* 보직일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "ComBeg", label: "{i18n>LABEL_13013}" /* 자사입사일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "GrpBeg", label: "{i18n>LABEL_13014}" /* 그룹입사일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "ProBeg", label: "{i18n>LABEL_13015}" /* 승진일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "Gbdat", label: "{i18n>LABEL_13016}" /* 생년월일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "Age", label: "{i18n>LABEL_13017}" /* 나이 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "GeschTx", label: "{i18n>LABEL_13018}" /* 성별 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchH", label: "{i18n>LABEL_13019}" /* 고등학교 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchU", label: "{i18n>LABEL_13020}" /* 대학 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchUm", label: "{i18n>LABEL_13021}" /* 대학전공 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchM", label: "{i18n>LABEL_13022}" /* 대학원(석) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchMm", label: "{i18n>LABEL_13023}" /* 전공(석) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchD", label: "{i18n>LABEL_13024}" /* 대학원(박) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchDm", label: "{i18n>LABEL_13025}" /* 전공(박) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SchTitl", label: "{i18n>LABEL_13063}" /* 학위(입사전)*/, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "RGrp", label: "{i18n>LABEL_13036}" /* 상격 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "RName", label: "{i18n>LABEL_13037}" /* 포상명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "RDat", label: "{i18n>LABEL_13038}" /* 포상일자 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "RPnt", label: "{i18n>LABEL_13039}" /* 가점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "PName", label: "{i18n>LABEL_13040}" /* 징계 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "PDat", label: "{i18n>LABEL_13041}" /* 징계일자 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "PPnt", label: "{i18n>LABEL_13042}" /* 벌점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "Notes", label: "{i18n>LABEL_13045}" /* 결격사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "400px", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "EduPoint", label: "{i18n>LABEL_13046}" /* 교육학점 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "EduGrade", label: "{i18n>LABEL_13047}" /* Grade교육 이수년도*/, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getYearText" },
                    { id: "PrTest", label: "{i18n>LABEL_13048}" /* 승진자격시험 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "SGradeTx", label: "{i18n>LABEL_13049}" /* S-Grade(팀장자격) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center },
                    { id: "PrStatusTx", label: "{i18n>LABEL_13053}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center }
                ]);

                var ListBox = new sap.m.FlexBox("listBox", {
                    width: "84%",
                    direction: sap.m.FlexDirection.Column,
                    items: [
                        new sap.m.FlexBox({
                            justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({
                                            text: {
                                                path: "/PromoList/TotalListCnt",
                                                formatter: function (v) {
                                                    return oController.getBundleText("LABEL_13061").interpolate(v); // 인원(${TotalListCnt})
                                                }
                                            }
                                        }),
                                        new sap.m.CheckBox({
                                            text: "{i18n>LABEL_13064}", // 추천자만 조회
                                            selected: "{/PromoList/RecommandOnly}",
                                            select: oController.onSelectRecommandOnly.bind(oController)
                                        })
                                    ]
                                }).addStyleClass("info-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.FlexBox({
                                            direction: sap.m.FlexDirection.Column,
                                            items: [
                                                new sap.m.FlexBox({
                                                    items: [
                                                        new sap.m.Text({
                                                            text: "{i18n>LABEL_13056}" // 직급 내 추천서열 입력:
                                                        }),
                                                        new sap.m.Text({
                                                            text: {
                                                                path: "/PromoList/PromoListExport/EChu",
                                                                formatter: function (v) {
                                                                    return oController.getBundleText("LABEL_13057").interpolate(v); // ${count}명
                                                                }
                                                            }
                                                        }).addStyleClass("ml-10px color-signature-blue")
                                                    ],
                                                    visible: {
                                                        path: "/PromoList/PromoListExport/EChu",
                                                        formatter: function (v) {
                                                            if (v || v === 0) return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
                                        }).addStyleClass("text-field-group mr-30px"),
                                        new sap.m.Button({
                                            press: oController.onPressExcelDownload.bind(oController),
                                            text: "{i18n>LABEL_00129}" // Excel
                                        }).addStyleClass("button-light"),
                                        new sap.m.Button({
                                            press: oController.onPressSave.bind(oController),
                                            text: "{i18n>LABEL_00101}", // 저장
                                            visible: {
                                                path: "/PromoList/isShowProcessButtons",
                                                formatter: function (v) {
                                                    if (v) return true;
                                                    else return false;
                                                }
                                            }
                                        }).addStyleClass("button-light"),
                                        new sap.m.Button({
                                            press: oController.onPressRcmComplete.bind(oController),
                                            text: "{i18n>LABEL_13003}", // 추천완료
                                            visible: {
                                                path: "/PromoList/isShowProcessButtons",
                                                formatter: function (v) {
                                                    if (v) return true;
                                                    else return false;
                                                }
                                            }
                                        }).addStyleClass("button-light")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        }).addStyleClass("info-box mt-0"),
                        oTable
                    ]
                }).addStyleClass("side-table-box");

                return new sap.m.FlexBox({
                    items: [
                        SideNavBox, //
                        ListBox
                    ]
                }).addStyleClass("side-navi-group h-80");
            },

            _colModel: [
                { id: "PtypeTx", label: "{i18n>LABEL_13004}" /* 구분 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getPtypeText" },
                { id: "Zseq", label: "{i18n>LABEL_13005}" /* 번호 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "Orgtx", label: "{i18n>LABEL_13006}" /* 부서 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "Ename", label: "{i18n>LABEL_13007}" /* 성명 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getEnameLink" },
                { id: "RecSeqGrade", label: "{i18n>LABEL_13050}" /* 추천서열 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getRecSeqGradeInput" },
                { id: "PGradeTxt", label: "{i18n>LABEL_13010}" /* 현직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "GradeYr", label: "{i18n>LABEL_13011}" /* 직급년차 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "PrCnt", label: "{i18n>LABEL_13012}" /* 심사횟수 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "TotalPnt", label: "{i18n>LABEL_13044}" /* 총점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "ApointAvr", label: "{i18n>LABEL_13027}" /* 고과점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "GradePnt", label: "{i18n>LABEL_13028}" /* 직급년차점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "MgrPnt", label: "{i18n>LABEL_13029}" /* 보직점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "LanPnt", label: "{i18n>LABEL_13035}" /* 외국어점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "RpPnt", label: "{i18n>LABEL_13043}" /* 상벌점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "LicensePnt", label: "{i18n>LABEL_13066}" /* 자격점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "EduPnt", label: "{i18n>LABEL_13067}" /* 교육이수점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "IdeaPnt", label: "{i18n>LABEL_13068}" /* 제안점수 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "ZpostTx", label: "{i18n>LABEL_13008}" /* 직책 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "ZpostBeg", label: "{i18n>LABEL_13009}" /* 보직일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "ComBeg", label: "{i18n>LABEL_13013}" /* 자사입사일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "GrpBeg", label: "{i18n>LABEL_13014}" /* 그룹입사일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "ProBeg", label: "{i18n>LABEL_13015}" /* 승진일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "Gbdat", label: "{i18n>LABEL_13016}" /* 생년월일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "Age", label: "{i18n>LABEL_13017}" /* 나이 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "GeschTx", label: "{i18n>LABEL_13018}" /* 성별 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "50px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchH", label: "{i18n>LABEL_13019}" /* 고등학교 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchU", label: "{i18n>LABEL_13020}" /* 대학 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchUm", label: "{i18n>LABEL_13021}" /* 대학전공 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchM", label: "{i18n>LABEL_13022}" /* 대학원(석) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchMm", label: "{i18n>LABEL_13023}" /* 전공(석) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchD", label: "{i18n>LABEL_13024}" /* 대학원(박) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchDm", label: "{i18n>LABEL_13025}" /* 전공(박) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SchTitl", label: "{i18n>LABEL_13063}" /* 학위(입사전)*/, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "RGrp", label: "{i18n>LABEL_13036}" /* 상격 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "RName", label: "{i18n>LABEL_13037}" /* 포상명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "RDat", label: "{i18n>LABEL_13038}" /* 포상일자 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "RPnt", label: "{i18n>LABEL_13039}" /* 가점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "PName", label: "{i18n>LABEL_13040}" /* 징계 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "PDat", label: "{i18n>LABEL_13041}" /* 징계일자 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "PPnt", label: "{i18n>LABEL_13042}" /* 벌점 */, plabel: "", resize: true, span: 0, type: "decimal", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "Notes", label: "{i18n>LABEL_13045}" /* 결격사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "400px", align: sap.ui.core.HorizontalAlign.Begin },
                { id: "EduPoint", label: "{i18n>LABEL_13046}" /* 교육학점 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "EduGrade", label: "{i18n>LABEL_13047}" /* Grade교육 이수년도*/, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center, templateGetter: "getYearText" },
                { id: "PrTest", label: "{i18n>LABEL_13048}" /* 승진자격시험 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "SGradeTx", label: "{i18n>LABEL_13049}" /* S-Grade(팀장자격) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center },
                { id: "PrStatusTx", label: "{i18n>LABEL_13053}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "150px", align: sap.ui.core.HorizontalAlign.Center }
            ]
        });
    }
);
