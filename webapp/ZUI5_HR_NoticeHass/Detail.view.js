sap.ui.define([
    "../common/Common",
    "./delegate/ViewTemplates",
    "../common/PageHelper"
], function (Common, ViewTemplates, PageHelper) {
	"use strict";

    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {

            return new PageHelper({
				idPrefix: "Detail-",
                showNavButton: true,
				hideEmpInfoBox: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
							press: oController.onDialogSaveBtn.bind(oController),
							text: "{i18n>LABEL_57015}", // 임시저장
							visible: {
								path: "/Gubun",
								formatter: function(v) {
									return v === "X";
								}
							}
						}).addStyleClass("button-light mr-8px"),
						new sap.m.Button({
							press: oController.onDialogRegistBtn.bind(oController),
							text: "{i18n>LABEL_57009}", // 등록
							visible: {
								path: "/Gubun",
								formatter: function(v) {
									return v === "X";
								}
							}
						}).addStyleClass("button-dark mr-8px"),
						new sap.m.Button({
							press: oController.onDialogReBtn.bind(oController),
							text: "{i18n>LABEL_57018}", // 수정
							visible: {
								path: "/Gubun",
								formatter: function(v) {
									return v === "Y";
								}
							}
						}).addStyleClass("button-light mr-8px"),
						new sap.m.Button({
							press: oController.onDialogDeleteBtn.bind(oController),
							text: "{i18n>LABEL_57017}", // 삭제
							visible: {
								parts: [{path: "Aedtm"}, {path: "/Gubun"}],
								formatter: function(v1, v2) {
									return (v1 && v2 === "X") || v2 === "Y";
								}
							}
						}).addStyleClass("button-delete")
					]
				})
				.setModel(oController.RegistModel)
				.bindElement("/FormData")
				.addStyleClass("app-nav-button-right"),
				contentStyleClass: "app-content",
                contentContainerStyleClass: "app-content-container-wide custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)
				]
			});
		},

        ApplyingBox: function(oController) {

			return new sap.m.VBox({
				fitContainer: true,
				width: "100%",
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57008}", "130px", "Right", true), // 제목
                            new sap.m.Input({
                                width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                value: "{Title}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "NoticeManageTableIn2", "Title", false),
                                editable: {
									path: "/Gubun",
									formatter: function(v) {
										return v === "X";
									}
								}
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57011}", "130px", "Right"), // 등록자
                            new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{ApernTxt}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						visible: {
							path: "Aedtm",
							formatter: function(v) {
								return Common.checkNull(!v);
							}
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57004}", "130px", "Right"), // 등록일
							new sap.m.Text({
                                width: "250px",
                                textAlign: "Begin",
                                text: {
                                    path: "Sdate",
                                    formatter: function(v) {
                                        return v ? Common.DateFormatter(v) : "";
                                    }
                                }
                            }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57010}", "130px", "Right").addStyleClass("mr-8px"), // 최종변경일/시
                            new sap.m.Text({
                                text : {
                                    parts: [{path: "Aedtm"}, {path: "Aetim"}],
                                    formatter: function(v1, v2) {
										if(v1 && v2){
                                        	v1 = Common.DateFormatter(v1);
											v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
										}
										return v1 + " " + v2; 
                                    }
                                }, 
                                textAlign : "Begin"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						},
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57012}", "130px", "Right"), // 중요항목
                            new sap.m.CheckBox({ 
								select: oController.onChangeData.bind(oController),
                                selected: {
                                    path: "Impor",
                                    formatter: function(v) {
                                        return v === "X";
                                    }
                                },
								editable: {
									path: "/Gubun",
									formatter: function(v) {
										return v === "X";
									}
								}
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox("contentArea1", {
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57016}", "130px", "Right", true) // 내용
                            // new sap.m.TextArea({
                            //     rows: 10,
							// 	width: "630px",
							// 	value:"{Detail}",
							// 	maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "NoticeManageTableIn2", "Detail", false),
							// 	editable: {
							// 		path: "/Gubun",
							// 		formatter: function(v) {
							// 			return v === "X";
							// 		}
							// 	}
							// }).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox("contentArea2", {
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57016}", "130px", "Right", true) // 내용
                            // new sap.m.TextArea({
                            //     rows: 10,
							// 	width: "630px",
							// 	value:"{Detail}",
							// 	maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "NoticeManageTableIn2", "Detail", false),
							// 	editable: {
							// 		path: "/Gubun",
							// 		formatter: function(v) {
							// 			return v === "X";
							// 		}
							// 	}
							// }).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						fitContainer: true,
						visible: {
                            parts: [{path: "Appnm"}, {path: "/Gubun"}, {path: "Sdate"}],
                            formatter: function(v1, v2, v3) {
                                return Common.checkNull(!v1) || (Common.checkNull(v1) && v2 === "X") || Common.checkNull(v3);
                            }	
                        },
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
				]
			})
			.setModel(oController.RegistModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px");
		}
	});
});
