$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_WorkCalendar.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_WorkCalendar.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_FLEX_TIME_SRV");
		
		var oFilter = new sap.m.FlexBox({
            fitContainer: true,
            items: [
                new sap.m.FlexBox({
                    // 검색
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({text: oBundleText.getText("LABEL_63002")}), // 대상연월
								new sap.m.DatePicker({
									valueFormat : "yyyyMM",
						            displayFormat : "yyyy.MM",
						            value : "{Zyymm}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
								})
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch,
                                    text: oBundleText.getText("LABEL_00104") // 검색
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                })
            ]
        }).addStyleClass("search-box search-bg pb-7px mt-16px");
        
        // summary
        var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
        	columns : 8,
        	width : "100%",
        	widths : ["", "", "", "", "", "", "", ""],
        	rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
        			new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63003"), textAlign : "Center"}).addStyleClass("font-bold")], // 소정근로시간\n(평일X8H)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63004"), textAlign : "Center"}).addStyleClass("font-bold")], // 근무시간(평일)\n(A)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63005"), textAlign : "Center"}).addStyleClass("font-bold")], // 연장근로\n(B)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63006"), textAlign : "Center"}).addStyleClass("font-bold")], // 휴일근로\n(C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63007"), textAlign : "Center"}).addStyleClass("font-bold")], // 연장+휴일\n(B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63008"), textAlign : "Center"}).addStyleClass("font-bold")], // 근로시간합계\n(A+B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63009"), textAlign : "Center"}).addStyleClass("font-bold")], // 재근시간기준
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_63010"), textAlign : "Center"}).addStyleClass("font-bold")], // 비고
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2")]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Dutyt}"})], // 소정근로시간\n(평일X8H)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Workt}"})], // 근무시간(평일)\n(A)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Overt}"})], // 연장근로\n(B)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Holit}"})], // 휴일근로\n(C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Sumoh}"})], // 연장+휴일\n(B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Sumtm}"})], // 근로시간합계\n(A+B+C)
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Workt2}"})], // 재근시간기준
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({
							        			 	text : {
							        			 		parts : [{path : "Dutyc"}, {path : "DutycT"}],
							        			 		formatter : function(fVal1, fVal2){
							        			 			this.removeStyleClass("color-info-red font-bold");
							        			 			
							        			 			if(fVal1 == "2"){
							        			 				this.addStyleClass("color-info-red font-bold");
							        			 			}
							        			 			
							        			 			return fVal2;
							        			 		}
							        				}
							        			 })], // 비고
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data")]
		        	})]
        });
        
        var oLegend = new sap.m.Toolbar({
        	height : "40px",
        	content : [new sap.m.Text({text : oBundleText.getText("LABEL_63011"), width : "100px", textAlign : "Center"}).addStyleClass("bg-signature-darkgreen p-5px"), // 승인데이터
        			   new sap.m.Text({text : oBundleText.getText("LABEL_63012"), width : "100px", textAlign : "Center"}).addStyleClass("bg-signature-orange p-5px"), // 이상데이터
        			   new sap.m.Text({text : oBundleText.getText("LABEL_63013"), width : "100px", textAlign : "Center"}).addStyleClass("background-color-lightorange p-5px")] // 소명신청
        }).addStyleClass("toolbarNoBottomLine pt-10px pl-0 pr-0");
        
    	var oCalendar = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Calendar").addStyleClass("pt-10px");
    	
    	// 유의사항
    	var oInfo = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Toolbar({
									 				height : "45px",
												 	content : [new sap.m.Text({text : oBundleText.getText("LABEL_63014")}).addStyleClass("sub-title")] // 유의사항
												}).addStyleClass("toolbarNoBottomLine")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.FormattedText({
									 							 // • 출퇴근시간 허위입력, 상습적 근무태만, 비근무시간을 임의로 줄여 근무시간을 부풀리는 행위 등 제도 운영기준 위반 및 악용행위 금지
													 htmlText : "<span>" + oBundleText.getText("MSG_63001") + "</span><br/>" +
																// ▶ 적발시 인사상 징계 및 자율출퇴근제 대상에서 제외
																"<span class='color-info-red pl-10px'>" + oBundleText.getText("MSG_63002") + "</span><br/>" + 
																// ※ 일일 재근 시간이 9시간 미만이더라도 점심시간(13시) 이후 퇴근 시 휴게시간 30분 + 비근무시간 30분 자동차감
																"<span class='pl-10px'>" + oBundleText.getText("MSG_63003") + "</span><br/>" + 
																// (점심시간을 다 쉬지 못한 경우 비근무시간은 조정가능하나 
																"<span class='pl-23px'>(" + oBundleText.getText("MSG_63004") + "</span>" + 
																"<span class='color-info-red'> " + oBundleText.getText("MSG_63005") + "</span><span>)</span><br/>" + // 허위조정금지
																// • 휴게시간/비근무시간 차감 관련 세부기준 : 열린도움방 → 회사생활안내 → 자율출퇴근제 참조
																"<span>" + oBundleText.getText("MSG_63006") + "</span>"
												 })],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("p-15px")]
					}).addStyleClass("search-box search-bg"),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
		});
        
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oFilter, oMatrix1, oLegend, oCalendar, oInfo]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});