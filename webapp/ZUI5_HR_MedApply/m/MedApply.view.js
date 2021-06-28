/* eslint-disable no-unused-vars */
sap.ui.define(
    [
        "common/PageHelper",	//
        "common/PickOnlyDateRangeSelection"
    ],
    function (PageHelper, PickOnlyDateRangeSelection) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {

            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                jQuery.sap.includeStyleSheet("ZUI5_HR_MedApply/css/MyCssMobile.css");
				
				this.loadModel();
				
				var oInfoBox = new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    alignContent: sap.m.FlexAlignContent.End,
                    alignItems: sap.m.FlexAlignItems.End,
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
								// 신청현황
								new sap.ui.core.HTML({
									content: "<span class='sub-title ml-6px' style='font-size:16px;font-weight:bold;'>" + oController.getBundleText("LABEL_47002") + "</span>"
								})
							]
                        }),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button("requestallBtn", {
                                    text: "{i18n>LABEL_47152}", // 일괄신청
                                    enabled: false,
                                    press: oController.onApprovalAll.bind(oController)
                                }).addStyleClass("button-light"),
                                new sap.m.Button(oController.PAGEID + "_NewBtn", {
                                    press: function () {
                                        oController._NewGubun = "O";
                                        oController.getBukrs();
                                    },
                                    text: "{i18n>LABEL_47151}" // 추가
                                }).addStyleClass("button-light"),
                                new sap.ui.commons.layout.HorizontalLayout(oController.PAGEID + "_NewIcon", {
                                    visible: false,
                                    content: [
										new sap.ui.core.Icon({ src: "sap-icon://message-information", color: "red", size: "15px" }),
										new sap.ui.core.HTML({ content: "<span style='font-size:14px;color:red;line-height:0px;'>&nbsp;" + oController.getBundleText("MSG_47040") + "</span>"})	// 신청기간이 아닙니다.
									]
                                })
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");

                var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
                    inset: false,
                    noDataText: "{i18n>LABEL_00901}",
                    growing: true,
                    growingThreshold: 5,
                    mode: "None",
                    columns: [
                        new sap.m.Column({
                            width: "10%",
                            hAlign: sap.ui.core.TextAlign.Begin
                        }),
                        new sap.m.Column({
                            width: "50%",
                            hAlign: sap.ui.core.TextAlign.Begin
                        }),
                        new sap.m.Column({
                            width: "40%",
                            hAlign: sap.ui.core.TextAlign.Begin
                        })
                    ]
                }).addStyleClass("mt-4px");

                var oColumn = new sap.m.ColumnListItem(oController.PAGEID + "_Column", {
                    counter: 5,
                    press: oController.onSelectedRow,
                    type: "Active",
                    cells: [
                        new sap.m.FlexBox({
                            direction: sap.m.FlexDirection.Column,
                            items: [
                                new sap.m.CheckBox({
                                    visible: {
                                        path: "Status",
                                        formatter: function (vStatus) {
                                            return vStatus === "ZZ" ? true : false;
                                        }
                                    },
                                    selected: "{Chkitem}"
                                })
                            ]
                        }),
                        new sap.m.FlexBox({
                            direction: sap.m.FlexDirection.Column,
                            items: [
                                new sap.m.Text({
                                    text: "{PatiName}",
                                    textAlign: "Begin"
                                }),
                                new sap.m.Text({
                                    text: "{HospName}",
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.FlexBox({
                            direction: sap.m.FlexDirection.Column,
                            items: [
                                new sap.m.Text({
                                    text: {
                                        path: "MedDate",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    },
                                    textAlign: "Begin"
                                }),
                                new sap.m.Text({
                                    text: "{StatusT}",
                                    textAlign: "Begin"
                                })
                            ]
                        })
                    ]
                });

                return new PageHelper({
                    contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [
						oInfoBox,
						this.getFilter(oController),
						oTable
					]
                });
			},
			
			getFilter: function (oController) {
                var vYear = new Date().getFullYear();
                return new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                            width: "162px",
                                            delimiter: "~",
                                            dateValue: moment().startOf("month").hours(10).toDate(),
                                            secondDateValue: moment().hours(10).toDate()
                                        }),
                                        new sap.m.Select(oController.PAGEID + "_HeadSel", {}).addStyleClass("height42px ml-10px")
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button({
                                            press: oController.onSearch,
                                            icon: "sap-icon://search" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        }) // 검색
                    ]
                }).addStyleClass("search-box-mobile h-auto");
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_BENEFIT_SRV");
            }
        });
    }
);
