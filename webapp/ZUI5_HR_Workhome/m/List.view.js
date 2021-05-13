sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Workhome.m.List", {
            getControllerName: function () {
                return "ZUI5_HR_Workhome.m.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                $.app.setModel("ZHR_BATCHAPPROVAL_SRV");
                
				var oFilter = new sap.m.FlexBox({
					fitContainer: true,
					items: [
							new sap.m.FlexBox({
								items: [
									new sap.m.FlexBox({
										items: [
											new sap.m.DateRangeSelection({
			                                    displayFormat: gDtfmt,
			                                    dateValue: "{Begda}",
			                                    secondDateValue: "{Endda}",
			                                    delimiter: "~"
			                                })
										]
									}).addStyleClass("search-field-group"),
									new sap.m.FlexBox({
										items: [
											new sap.m.Button({
												icon : "sap-icon://search",
												press : oController.onPressSearch
											}).addStyleClass("button-search")
										]
									}).addStyleClass("button-group")
								]
							})
						]
				}).addStyleClass("search-box-mobile h-auto");
                
                // 신청내역
		        var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
		            inset: false,
					rememberSelections: false,
					noDataText: "{i18n>LABEL_00901}",
					growing: true,
					growingThreshold: 5,
					mode: "None",
		            columns: [
		                new sap.m.Column ({
		                    width: "35%",
		                    hAlign: "Begin"
		                }),
		                new sap.m.Column ({
		                    width: "45%",
		                    hAlign: "Begin"
		                }),
		                new sap.m.Column ({
		                    hAlign: "End"
		                })
		            ],
		            items: {
		                path: "/Data",
		                template: new sap.m.ColumnListItem({
		                    type: sap.m.ListType.Active,
		                    counter: 5,
		                    customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
		                    cells: [
		                        new sap.m.VBox({
		                        	items : [new sap.m.HBox({ // 재택근무일
												 items : [new sap.m.Text({text: "{Begda}"})] 	
											 }),
		                        			 new sap.m.HBox({
		                        			 	 items : [
		                        			 	 	new sap.m.Text({
		                        			 	 		text : {
		                        			 	 			parts : [{path : "Cancl"}, {path : "Cancltx"}],
															formatter : function(fVal1, fVal2){
																this.removeStyleClass("color-signature-blue color-signature-red");
																
																if(fVal1 == ""){ // 신규
																	this.addStyleClass("color-signature-blue");
																} else { // 취소
																	this.addStyleClass("color-signature-red");
																}
																
																return fVal2;
															}
		                        			 	 		}
		                        			 	 	}).addStyleClass("font-bold pr-5px"),
		                        			 	 	new sap.m.Text({text : " {Statust}"})
		                        			 	 ] 
		                        			 })]
		                        }),
								new sap.m.VBox({
									items : [new sap.m.HBox({  // 연락처
												 items : [new sap.m.Text({text: "{Telnum}"})] 	
											 }),
											 new sap.m.HBox({  // 신청사유
												 items : [new sap.m.Text({text: "{Bigo}", maxLines : 1})] 	
											 })]
								}).addStyleClass("pt-3px"),
		                        new sap.m.VBox({
		                        	items : [new sap.m.Button({
												 text : "{i18n>LABEL_53014}", // 삭제
												 customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
												 visible : {
												 	 parts : [{path : "Cancl"}, {path : "Status"}, {path : "Begda"}],
												 	 formatter : function(fVal1, fVal2, fVal3){
												 	 	 if(fVal1 == "" && fVal2 == "AA" && fVal3){
													 	 	 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
													 	 	 	if(dateFormat.format(new Date(fVal3)) * 1 > dateFormat.format(new Date()) * 1){
													 	 	 		return true;
													 	 	 	} else {
													 	 	 		return false;
													 	 	 	}
												 	 	 } else {
												 	 	 	return false;
												 	 	 }
												 	 }
												 },
												 press : function(oEvent){
												 	oController.onPressDelete(oEvent, "D");
												 }
											}).addStyleClass("button-light"),
											new sap.m.Button({
												text : "{i18n>LABEL_53013}", // 취소
												customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
												visible : {
													path : "Status",
													formatter : function(fVal){
														return fVal == "99" ? true : false;
													}
												},
												press : function(oEvent){
													oController.onPressDelete(oEvent, "E");
												}
											}).addStyleClass("button-light")]
		                        })
		                    ]
		                })
		            }
		        });
		        
		        oTable.setModel(new sap.ui.model.json.JSONModel());

				var oLayout = new sap.m.VBox({
					fitContainer: true,
					items: [new sap.m.FlexBox({
								justifyContent : "SpaceBetween",
								items : [new sap.m.FlexBox({
											 items : [new sap.m.Label({
														  text: "{i18n>LABEL_48065}", // 신청내역
														  design: "Bold"
													  }).addStyleClass("sub-title")]
										 }),
										 new sap.m.FlexBox({
											  alignItems : "End",
											  items : [new sap.m.Button({
														   text: "{i18n>LABEL_48045}", // 신규신청
														   press : oController.onPressNew
													  }).addStyleClass("button-light")]
										 })]
							}).addStyleClass("info-box"),
							oTable]
				});
                
                // 신청안내
				var oLayout2 = new sap.m.VBox({
					fitContainer: true,
					items: [new sap.m.FlexBox({
								items : [new sap.m.Label({
											text: "{i18n>LABEL_53008}", // 신청안내
											design: "Bold"
										}).addStyleClass("sub-title")]
							}).addStyleClass("info-box"),
							new sap.m.FlexBox({
								items : [new sap.m.FormattedText({
											 htmlText : "<span>" + "{i18n>MSG_53001}" + "</span><br/>" + // • 재택근무 1일 전까지 부서장 승인을 필수로 받아야 합니다.
													"<span class='color-info-red'>" + "{i18n>MSG_53002}" + "</span><br/>" + // • 기한 내 승인되지 않을 경우 TMS 사용이 불가합니다.
													"<span>" + "{i18n>MSG_53003}" + "</span><br/>" + // • 일정 변경을 희망할 경우 해당 일정을 선택/취소한 뒤, 신규 신청해야 합니다.
													"<span class='color-info-red'>" + "{i18n>MSG_53004}" + "</span>" // • 단, 예정된 재택근무일 포함, 사후 일정 변경은 불가하므로 반드시 사전에 부서장 승인 필요합니다.
										 }).addStyleClass("p-5px")]
							}).addStyleClass("custom-OpenHelp-msgBox mt-0 p-7px")]
				}).addStyleClass("pb-10px");
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentContainerStyleClass: "app-content-container-mobile",
                                contentItems: [oFilter, oLayout, oLayout2]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
