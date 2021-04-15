$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_LeaveBoost.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_LeaveBoost.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_LEAVE_APPL_SRV");
		
		var oHeader = new sap.m.HBox({
			width : "100%",
            justifyContent: "End",
            items: [/*new sap.m.HBox({
	                	justifyContent: "Start",
	                	width : "100%",
	                    items: [new common.EmpBasicInfoBox(oController._ListCondJSonModel).addStyleClass("ml-10px mt-15px")]
	                }),*/
	                new sap.m.HBox({
	                	justifyContent: "End",
	                	visible : {
			 	 			path : "Status1",
			 	 			formatter : function(fVal){
			 	 				return fVal == "AA" || fVal == "00" ? true : false;
			 	 			}
			 	 		},
	                    items: [/*new sap.m.Button({
						 	 	    text : oBundleText.getText("LABEL_48040"), // 대상자 변경
						 	 	    // press : oController.searchOrgehPernr,
						 	 	    visible : false
						 	    }).addStyleClass("button-light")*/,
						 		new sap.m.Button({
						 	 		text : oBundleText.getText("LABEL_00101"), // 저장
						 	 		press : function(oEvent){
						 	 			oController.onPressSave(oEvent, "S");	
						 	 		},
						 	 		visible : {
						 	 			path : "Status1",
						 	 			formatter : function(fVal){
						 	 				return fVal == "AA" || fVal == "00" ? true : false;
						 	 			}
						 	 		}
						 		}).addStyleClass("button-light"),
						 		new sap.m.Button({
						 	 		text : oBundleText.getText("LABEL_52002"), // 확정
						 	 		press : function(oEvent){
						 	 			oController.onPressSave(oEvent, "C");	
						 	 		},
						 	 		visible : {
						 	 			path : "Status1",
						 	 			formatter : function(fVal){
						 	 				return fVal == "AA" || fVal == "00" ? true : false;
						 	 			}
						 	 		}
						 		}).addStyleClass("button-dark")]
	                }).addStyleClass("button-group")]
        });
        
        // 신청안내
        var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
        	columns : 1,
        	width : "100%",
        	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52003")}).addStyleClass("sub-title")], // 신청안내
				        			 hAlign : "Begin",
				        			 vAlign : "Middle"
				        		 })]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.FormattedText({
							        			 	htmlText : "<span>" + oBundleText.getText("MSG_52001") + "</span>" + // • 연차 사용계획일자는
							        			 			   "<span class='color-signature-blue font-bold'> {Begda} ~ {Endda} </span>" +
							        			 			   "<span>" + oBundleText.getText("MSG_52002") + "</span><br/>"+ // 기간에 대하여 지정 가능합니다.
							        			 			   "<span>" + oBundleText.getText("MSG_52003") + "</span><br/>" + // • 연차 사용계획 신청 건수는 모두 일자지정 부탁드립니다.
							        			 			   "<span>" + oBundleText.getText("MSG_52004") + "</span><br/>" + // • 입력한 연차 계획은 별도로 근태 상신해주셔야 반영됩니다.
							        			 			   "<span>" + oBundleText.getText("MSG_52005") + "</span>" + // • 신청상태: 
							        			 			   "<span class='color-signature-blue font-bold'> {Statustx}</span>"
							        			})],
				        			 hAlign : "Begin",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("p-15px")]
		        	}).addStyleClass("custom-OpenHelp-msgBox")]
        });
        
        // 연차현황
        var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
        	columns : 4,
        	width : "100%",
        	widths : ["", "", "", ""],
        	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52008")}).addStyleClass("sub-title")], // 연차현황
				        			 hAlign : "Begin",
				        			 vAlign : "Middle",
				        			 colSpan : 4
				        		 })]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52004")}).addStyleClass("font-bold")], // 발생
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52005")}).addStyleClass("font-bold")], // 사용
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52006")}).addStyleClass("font-bold")], // 잔여
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Label2"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52007")}).addStyleClass("font-bold")], // 계획
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Label2")]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : "{Anzhl}"})], // 발생
				        			 hAlign : "Center",
				        			 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : "{Kverb}"})], // 사용
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : "{Remnm}"})], // 잔여
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Data"),
				        		 new sap.ui.commons.layout.MatrixLayoutCell({
				        		 	 content : [new sap.m.Text({text : "{Pronm}"})], // 계획
				        		 	 hAlign : "Center",
				        		 	 vAlign : "Middle"
				        		 }).addStyleClass("Data")]
		        	})]
        });
        
        // 연차사용계획
        var oMatrix3 = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Content3");
        
        // 서명
        var oMatrix4 = new sap.ui.commons.layout.MatrixLayout({
        	columns : 1,
        	width : "100%",
        	rows : [new sap.ui.commons.layout.MatrixLayoutRow({
		        		height : "45px",
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.m.Text({text : oBundleText.getText("LABEL_52014")}).addStyleClass("sub-title")], // 서명
				        			 hAlign : "Begin",
				        			 vAlign : "Middle"
				        		 })]
		        	}),
		        	new sap.ui.commons.layout.MatrixLayoutRow({
		        		cells : [new sap.ui.commons.layout.MatrixLayoutCell({
				        			 content : [new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Content4")],
				        			 hAlign : "Begin",
				        			 vAlign : "Middle"
				        		 })]
		        	})]
        });
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_52001")}).addStyleClass("app-title")] // 연차촉진
								  }).addStyleClass("app-title-container"),
								  oHeader,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
								  oMatrix1,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
								  oMatrix2,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
								  oMatrix3,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
								  oMatrix4,
								  new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			showHeader : false,
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});