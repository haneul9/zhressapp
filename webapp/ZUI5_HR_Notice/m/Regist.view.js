sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "Regist-",
                title: "{i18n>LABEL_57013}", // 공지사항 상세내용
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData");
		},
		
		ApplyingBox: function(oController) {
            
			return new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57008}", "105px", "Left").addStyleClass("sub-con-title"), // 제목
                            new sap.m.Input({
                                width: "250px",
                                value: "{Title}",
                                editable: false
                            })
						]
					}),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57011}", "105px", "Left").addStyleClass("sub-con-title"), // 등록자
                            new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{ApernTxt}"
                            }).addStyleClass("line-height-24")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57004}", "105px", "Left").addStyleClass("sub-con-title"), // 등록일
							new sap.m.Text({
                                width: "250px",
                                textAlign: "Begin",
                                text: {
                                    path: "Sdate",
                                    formatter: function(v) {
                                        return v ? Common.DateFormatter(v) : "";
                                    }
                                }
                            })
						]
					}),
                    new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57010}", "105px", "Left").addStyleClass("sub-con-title"), // 최종변경일/시
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
					}),
                    new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57012}", "105px", "Left").addStyleClass("sub-con-title"), // 중요항목
                            new sap.m.CheckBox({ 
                                selected: {
                                    path: "Impor",
                                    formatter: function(v) {
                                        return v === "X";
                                    }
                                },
								editable: false
                            })
						]
					}),
                    new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57016}", "105px", "Left").addStyleClass("sub-con-title"), // 내용
                            new sap.m.TextArea({
                                rows: 10,
								width: "250px",
								value:"{Detail}",
								editable: false
							}).addStyleClass("mt-8px mb-8px")
						]
					}),
					new sap.m.HBox({
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
				]
			})
			.addStyleClass("vbox-form-mobile")
			.setModel(oController.RegistModel)
			.bindElement("/FormData");
		}
	});
});