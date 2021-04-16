sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "List"].join("."), { 

	createContent: function(oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
				this.getBasicTitleBox(oController),
				this.getBasicHBox(oController),
				new sap.ui.core.HTML({content : "<div style='height : 30px;'/>"}),
				this.getChangeTitleBox(oController),
				this.getChangeBox(oController),
			]
		})
		.setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
	
	getBasicHBox: function(oController) {
		
		return new sap.m.Panel({
            layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
            expanded: true,
            expandable: false,
            content: new sap.m.HBox({
				items: [
					new sap.m.VBox({
						width : "33.3%",
						items : [
							new sap.m.HBox({
								width: "100%",
                                items: [
                                    this.getLabel2("{i18n>LABEL_58002}", false), // 현재 근로소득세율
                                    new sap.m.Text({
                                    	layoutData: new sap.m.FlexItemData({ baseSize: "40%" }),
										text: "{Itpctx}"
									})
                                ]
                            }).addStyleClass("search-field-group"),
						]
					}).addStyleClass("search-inner-vbox"),
					new sap.m.VBox({
						width : "33.3%",
						items : [
							new sap.m.HBox({
								width: "100%",
                                items: [
                                    this.getLabel2("{i18n>LABEL_58003}", false), // 적용기간 시작일
                                    new sap.m.Text({
                                    	layoutData: new sap.m.FlexItemData({ baseSize: "40%" }),
										text: "{Begda}"
									})
                                ]
                            }).addStyleClass("search-field-group"),
						]
					}).addStyleClass("search-inner-vbox"),
					new sap.m.VBox({
						width : "33.3%",
						items : [
							new sap.m.HBox({
								width: "100%",
                                items: [
                                	this.getLabel2("{i18n>LABEL_58004}", false), // 적용기간 종료일
									new sap.m.Text({
										layoutData: new sap.m.FlexItemData({ baseSize: "40%" }),
										text: "{Endda}"
									})
                                ]
                            }).addStyleClass("search-field-group"),
						]
					}).addStyleClass("search-inner-vbox")
				]
			}).addStyleClass("search-box h-auto p-0")
		}).addStyleClass("custom-panel");
	},
	
	getBasicTitleBox: function(oController) {

		return new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			alignContent: sap.m.FlexAlignContent.End,
			alignItems: sap.m.FlexAlignItems.End,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.Label({
							text: "{i18n>LABEL_17003}",   // 기본정보
						})
						.addStyleClass("sub-title ml-6px")
					]
				}),
			]
		}).addStyleClass("mt-16px");
	},
	
	getChangeTitleBox: function(oController) {

		return new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			alignContent: sap.m.FlexAlignContent.End,
			alignItems: sap.m.FlexAlignItems.End,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.Label({
							text: "{i18n>LABEL_58005}", // 변경신청
						})
						.addStyleClass("sub-title ml-6px")
					]
				}),
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: oController.onPressSave,
							text: "{i18n>LABEL_38044}", // 신청
							visible : {
								path : "Compchk",
								formatter : function(v){
									return v && v != "" ? false : true ;
								}
							}
						}).addStyleClass("button-light")
					]
				})
			]
		});
	},

	getChangeBox: function(oController) {
		
		return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox({
                    			items : [
                    				new sap.m.HBox({
										items: [
											new sap.m.VBox({
												width : "100%",
												items : [
													new sap.m.HBox({
				                                        items: [
				                                            this.getLabel("{i18n>LABEL_58006}", false), // 신청가능기간
				                                            new sap.m.Text({
				                                            	layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
																text: "{Period}"
															}),
															new sap.m.Text({
				                                            	layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
																text: "{i18n>MSG_58002}"  // ※ 익월부터 가능합니다.
															}).addStyleClass("px-70px")
				                                        ]
				                                    }).addStyleClass("search-field-group noBorderBottom"),
												]
											}).addStyleClass("search-inner-vbox"),
										]
									}),
									new sap.m.HBox({
										items: [
											new sap.m.VBox({
												width : "100%",
												items : [
													new sap.m.HBox({
				                                        items: [
				                                            this.getLabel("{i18n>LABEL_58007}", false), // 신청 근로소득세율
				                                             new sap.m.RadioButtonGroup(oController.PAGEID + "_Itpct",{
			                                             	   columns : 4,
															   width : "100%",
															   layoutData: new sap.m.FlexItemData({ minWidth: "400px" }),
															   selectedIndex : {
															   		path : "Result",
															   		formatter : function(fVal){
															   			return fVal ? parseInt(fVal) : -1;
															   		}
															    },
															    editable: {
																	path : "Compchk",
																	formatter : function(v){
																		return v && v != "" ? false : true ;
																	}
																}
														    }).setModel(oController._DetailJSonModel)
														    .bindElement("/Data")
				                                        ]
				                                    }).addStyleClass("search-field-group noBorderBottom"),
												]
											}).addStyleClass("search-inner-vbox"),
										]
									}),
									new sap.m.HBox({
										items: [
											new sap.m.VBox({
												width : "100%",
												items : [
													new sap.m.HBox({
				                                        items: [
				                                            this.getLabel("{i18n>LABEL_58008}", false), // 신청상태
				                                            new sap.m.Text({
				                                            	layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
																text: "{Apstatx}"
															})
				                                        ]
				                                    }).addStyleClass("search-field-group"),
												]
											}).addStyleClass("search-inner-vbox"),
										]
									})
                    			]
                    })
		}).addStyleClass("custom-panel custom-incomeTax");
	},
	getLabel: function(text, required, width) {

		return new sap.m.Label({
			// layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			text: text,
			width: "150px",
			required: required,
			wrapping: true,
		//	design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	},
	getLabel2: function(text, required, width) {

		return new sap.m.Label({
		//	layoutData: new sap.m.FlexItemData({ baseSize: "60%" }),
			text: text,
			width : "150px",
			// width: width ? width : "20%",
			required: required,
			wrapping: true,
		//	design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	}
});