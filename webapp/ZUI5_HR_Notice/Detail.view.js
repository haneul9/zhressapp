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
				contentStyleClass: "app-content",
                contentContainerStyleClass: "app-content-container-wide custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)
				]
			});
		},

        ApplyingBox: function(oController) {

			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57008}", "130px", "Right"), // 제
                            new sap.m.Input({
                                width: "100%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                value: "{Title}",
                                editable: false
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
					new sap.m.HBox(oController.PAGEID + "_RegistDateBox", {
						width: "100%",
						fitContainer: true,
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
                    new sap.m.HBox(oController.PAGEID + "_IsHideBox", {
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57012}", "130px", "Right"), // 중요항목
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
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57016}", "130px", "Right"), // 내용
                            new sap.ui.core.HTML({
								content: {
									path: "Detail",
									formatter: function(v) {
										if(!v){
											return "";
										}else{
											return /^</i.test(v) ? v : '<p style="font-size: 14px">${content}</p>'.interpolate(v);
										}
									}
								}
							})
                            // new sap.m.TextArea({
                            //     rows: 10,
							// 	width: "100%",
							// 	value:"{Detail}",
							// 	editable: false
							// }).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						fitContainer: true,
						visible: {
                            path: "Appnm",
                            formatter: function(v) {
                                return Common.checkNull(!v);
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
