sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.LicenseInfo", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		// 자격면허
		var oLicnn  = new sap.m.ComboBox({
			selectedKey : "{Licnn}",
            editable: {
			    path: "actMode",
				formatter: function(v) {
					if(v === "2" || v === "3" ) return true;
					else return false;
				}
    	    },
    	    change : oController.onChangeLicnn
		});
		
		// 발령청
		var oOrgCode  = new sap.m.ComboBox({
			selectedKey : "{OrgCode}",
            editable: {
			    path: "actMode",
				formatter: function(v) {
					if(v === "2" || v === "3" ) return true;
					else return false;
				}
    	    },
		});
		
		// 자격등급
		var oLicnl  = new sap.m.ComboBox({
			selectedKey : "{Licnl}",
            editable: {
			    path: "actMode",
				formatter: function(v) {
					if(v === "2" || v === "3" ) return true;
					else return false;
				}
    	    },
    	    items : {
    	    	path : "/Licnl",
	    		template : new sap.ui.core.Item({key : "{Code}", text : "{Text}"})
    	    }
		});
		
		Promise.all([
			common.Common.getPromise(function() {
				$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", 
			   	{
					IBukrs:  oController.getView().getModel("session").getData().Bukrs2,
					IMolga:  oController.getView().getModel("session").getData().Molga,
					ILangu:  oController.getView().getModel("session").getData().Langu,
					ICodeT : "999",
					ICodty : "07",
					NavCommonCodeList : []	
				 },
				{
                    async: false,
                    success: function (data) {
                	   if(data.NavCommonCodeList && data.NavCommonCodeList.results){
							for(var i=0; i<data.NavCommonCodeList.results.length; i++){
								oLicnn.addItem(new sap.ui.core.Item({key: data.NavCommonCodeList.results[i].Code, text:data.NavCommonCodeList.results[i].Text}));	
							}
						}
					},
                    error: function (oResponse) {
                        common.Common.log(oResponse);
                    }
                })
			}.bind(this)),
			common.Common.getPromise(function() {
				$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet", 
			   	{
					IBukrs:  oController.getView().getModel("session").getData().Bukrs2,
					IMolga:  oController.getView().getModel("session").getData().Molga,
					ILangu:  oController.getView().getModel("session").getData().Langu,
					ICodeT : "999",
					ICodty : "06",
					NavCommonCodeList : []	
				 },
				{
                    async: false,
                    success: function (data) {
                	   if(data.NavCommonCodeList && data.NavCommonCodeList.results){
							for(var i=0; i<data.NavCommonCodeList.results.length; i++){
								oOrgCode.addItem(new sap.ui.core.Item({key: data.NavCommonCodeList.results[i].Code, text:data.NavCommonCodeList.results[i].Text}));	
							}
						}
					},
                    error: function (oResponse) {
                        common.Common.log(oResponse);
                    }
                })
			}.bind(this)),
		]);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ["200px","50%","200px","50%"],
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "10px",
						cells : []
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_37064}" })], // 등록일
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [
									 		new sap.m.DatePicker({
								 	 				value : "{Begda}",
									 				valueFormat: "yyyy-MM-dd",
													displayFormat: gDtfmt,
													width: "150px",
													editable: {
													    path: "actMode",
														formatter: function(v) {
															if(v === "2" || v === "3" ) return true;
															else return false;
														}
										    	    },
									 			}),
									 		] 
									}).addStyleClass("toolbarNoBottomLine")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3
								 }).addStyleClass("Data"),
								]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_02197}", required : true })], // 자격면허
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [ oLicnn ] 
										}).addStyleClass("toolbarNoBottomLine") 
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_37065}", required : true })], // 자격등급
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [oLicnl]
										}).addStyleClass("toolbarNoBottomLine")
									 ],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
								]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_37066}" , required : true })], // 발령청
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [ oOrgCode ] 
										}).addStyleClass("toolbarNoBottomLine")
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_02049}"})], // 취득일
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [ new sap.m.DatePicker({
									 	 				value : "{GetDate}",
										 				valueFormat: "yyyy-MM-dd",
														displayFormat: gDtfmt,
														width: "150px",
														editable: {
														    path: "actMode",
															formatter: function(v) {
																if(v === "2" || v === "3" ) return true;
																else return false;
															}
											    	    },
										 			}) ] 
										}).addStyleClass("toolbarNoBottomLine")
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_18052}", required : true})], // 자격번호
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [ new sap.m.Input({
														value : "{LicnNum}",
											            editable: {
														    path: "actMode",
															formatter: function(v) {
																if(v === "2" || v === "3" ) return true;
																else return false;
															}
											    	    },
											    	    maxLength : common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordLicense", "LicnNum"),
											    	}) ] 
										}).addStyleClass("toolbarNoBottomLine")
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
			 					 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_19506}" })], // 비고
									 hAlign : "Center",
									 vAlign : "Middle",
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Toolbar({
								 	 	height : "45px",
									 	content : [ new sap.m.Input({
														value : "{Zbigo}",
											            editable: {
														    path: "actMode",
															formatter: function(v) {
																if(v === "2" || v === "3" ) return true;
																else return false;
															}
											    	    },
											    	    maxLength : common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordLicense", "Zbigo"),
											    	}) ] 
										}).addStyleClass("toolbarNoBottomLine")
									],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 }).addStyleClass("Data"),
								]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 4
								 })]
					})
					]
		});
		
		var oMainMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["10px", ,"10px"],
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({ }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oMatrix],
									 hAlign : "Begin",
									 vAlign : "Middle",
								 })
								]
					})]
		});
					
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			contentHeight : "",
			draggable : false,
			horizontalScrolling : false,
			content : [oMainMatrix],
			title : "{i18n>LABEL_02197}" , // 자격면허
			// beforeOpen : oController.onChangeLicnn,
			beforeClose :function(){
				oController.PAGEID = "Perinfo";  // PAGE ID 변경 - 첨부파일 공통 사용 위함
			}, 
			buttons : [
						new sap.m.Button({
							text : "{i18n>LABEL_00101}", // 저장
							visible : {
							    path: "actMode",
								formatter: function(v) {
									if(v === "2" || v === "3" ) return true;
									else return false;
								}
				    	    },
							press : function(){
								oController.onSaveLicense(oController._LicenseJSonModel.getProperty("/Data/actMode"));
							}
						}), 
						new sap.m.Button({
							 type : "Default",
							 text :  "{i18n>LABEL_06122}", // 닫기
							 press : function(){
							 	oController.PAGEID = "Perinfo";
							 	oDialog.close();
							 }
						 })]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		oDialog.setModel(oController._LicenseJSonModel);
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
