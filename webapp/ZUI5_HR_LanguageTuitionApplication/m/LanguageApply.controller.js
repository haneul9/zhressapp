sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/m/MessageBox",
		"sap/ui/core/BusyIndicator"
	],
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "LanguageApply"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "LanguageApply",

			DetailModel: new JSONModelHelper(),

			getUserId: function() {
				
				return $.app.getController().getUserId();
			},
			
			getUserGubun: function() {
				
				return $.app.getController().getUserGubun();
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
                BusyIndicator.show(0);

                if(oEvent.data){
					if(Common.checkNull(oEvent.data.vGubun)){
						this.DetailModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : []});
						this.DetailModel.setProperty("/ExportData", oEvent.data.Export );
					}

					if(!oEvent.data.RowData) 
						this.DetailModel.setProperty("/FormData/Suport", this.DetailModel.getProperty("/ExportData/EPay"));

					if(oEvent.data.oTableData){
						this.DetailModel.setProperty("/FormData/ZlanguTxt", oEvent.data.oTableData.ZlanguTxt);
						this.DetailModel.setProperty("/FormData/Zlangu", oEvent.data.oTableData.Zlangu);
						this.DetailModel.setProperty("/FormData/Zlangu2Txt", oEvent.data.oTableData.ZlanguTxt);
						this.DetailModel.setProperty("/FormData/Zlangu2", oEvent.data.oTableData.Zlangu);
						this.DetailModel.setProperty("/FormData/ZltypeTxt", oEvent.data.oTableData.ZltypeTxt);
						this.DetailModel.setProperty("/FormData/Zltype", oEvent.data.oTableData.Zltype);
						this.DetailModel.setProperty("/FormData/Acqpot", oEvent.data.oTableData.Acqpot ? oEvent.data.oTableData.Acqpot : "");
						this.DetailModel.setProperty("/FormData/AcqgrdT", oEvent.data.oTableData.AcqgrdT ? oEvent.data.oTableData.AcqgrdT : "");
						this.DetailModel.setProperty("/FormData/Acqgrd", oEvent.data.oTableData.Acqgrd ? oEvent.data.oTableData.Acqgrd : "");
						this.getSupPeriod();
					}

                }

                this.onBeforeOpenFileUpload(this);
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				var oPeriodDate = $.app.byId(this.PAGEID + "_PeriodDate");

				if(Common.checkNull(this.DetailModel.getProperty("/FormData/Status"))) 
					oPeriodDate.setEditable(true);
				else
					oPeriodDate.setEditable(false)
				
                this.getComboData(this);
				BusyIndicator.hide();
			},
			
			navBack: function() {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
				});
			},

            getComboData: function(oController) { // 초기 코드값들 받아옴
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = this.getUserId();
                var vBukrs2 = this.getUserGubun();
    
                this.DetailModel.setProperty("/LanguCombo", []);
                this.DetailModel.setProperty("/ClassCombo", []);
                this.DetailModel.setProperty("/CostCombo", []);
                this.DetailModel.setProperty("/WBSCombo", []);
    
                var oSendObject = {
                    IPernr: vPernr,
                    ICodeT: "1",
                    LanguPayApplyF4TableIn: []
                };
                
                oModel.create("/LanguPayApplyF4ImportSet", oSendObject, {
                    success: function(oData, oResponse) {
                        if(oData && oData.LanguPayApplyF4TableIn){
                            oController.DetailModel.setProperty("/LanguCombo", oData.LanguPayApplyF4TableIn.results);
                            oController.DetailModel.setProperty("/ClassCombo", oData.LanguPayApplyF4TableIn.results);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
    
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
    
                oSendObject = {
                    IPernr: vPernr,
                    ICodeT: "998",
                    IBukrs: vBukrs2,
                    ICodty: "16",
                    NavCommonCodeList: []
                };
                
                oCommonModel.create("/CommonCodeListHeaderSet", oSendObject, { // 원가코드
                    success: function(oData, oResponse) {
                        if(oData && oData.NavCommonCodeList){
                            oController.DetailModel.setProperty("/CostCombo", oData.NavCommonCodeList.results);
                            oController.DetailModel.setProperty("/FormData/Kostl", oData.NavCommonCodeList.results[0].Code);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
    
                oSendObject = {
                    IPernr: vPernr,
                    ICodeT: "998",
                    IBukrs: vBukrs2,
                    ICodty: "17",
                    NavCommonCodeList: []
                };
                
                oCommonModel.create("/CommonCodeListHeaderSet", oSendObject, { // WBS
                    success: function(oData, oResponse) {
                        if(oData && oData.NavCommonCodeList){
                            oController.DetailModel.setProperty("/WBSCombo", oData.NavCommonCodeList.results);
                            oController.DetailModel.setProperty("/FormData/Plstx", oData.NavCommonCodeList.results[0].Code);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                    }
                });
            },

            getSuportPrice: function(oEvent) { //지원금액 Change
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');
    
				this.DetailModel.setProperty("/FormData/Lecbet", convertValue)
    
                var vClassPay = Number(convertValue); // 수강금액
                var vPay = Number(this.DetailModel.getProperty("/ExportData/EPay")); // 사번의 지원금액
                
                if(vClassPay > vPay || vClassPay === 0) this.DetailModel.setProperty("/FormData/Suport", String(vPay));
                else this.DetailModel.setProperty("/FormData/Suport", String(vClassPay));
            },

            getSupPeriod: function() { // 수강기간 선택시 지원기간값 가져옴
				var oController = $.app.getView("ZUI5_HR_LanguageTuitionApplication.m.LanguageApply").getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId(); 
                    
                var oSendDate = {};
				oSendDate.Lecbe =  Common.adjustGMTOdataFormat(oController.DetailModel.getProperty("/FormData/Lecbe"));
				oSendDate.Lecen =  Common.adjustGMTOdataFormat(oController.DetailModel.getProperty("/FormData/Lecen"));

                if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlangu"))) return;

                var	oSendObject = {
                    IPernr: vPernr,
                    IConType: "5",
                    IZlangu: oController.DetailModel.getProperty("/FormData/Zlangu"),
                    LanguPayApplyExport:  [],
                    LanguPayApplyTableIn:  [oSendDate]
                };
                
                oModel.create("/LanguPayApplySet", oSendObject, {
                    success: function(oData) {
                        if (oData && oData.LanguPayApplyTableIn) { //값을 제대로 받아 왔을 때
                            Common.log(oData);
                            oController.DetailModel.setProperty("/FormData/Supbg", oData.LanguPayApplyExport.results[0].ESupbg);
                            oController.DetailModel.setProperty("/FormData/Supen", oData.LanguPayApplyExport.results[0].ESupen);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
            },

			onGradeVal: function() {
				var oController = this;

				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbe"))){
					MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107")});
					return;
				};

				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "TuitionSearch"].join($.app.getDeviceSuffix())
				});
			},

			ErrorCheck: function(oController) {
				var oCostCombo = $.app.byId(oController.PAGEID + "_CostCombo");
	
				if(Common.checkNull(oCostCombo.getSelectedKey())){
					MessageBox.error(oController.getBundleText("MSG_29007"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecen"))){
					MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlaorg"))){
					MessageBox.error(oController.getBundleText("MSG_29010"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Latell"))){
					MessageBox.error(oController.getBundleText("MSG_29011"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Caldt"))){
					MessageBox.error(oController.getBundleText("MSG_29013"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbet"))){
					MessageBox.error(oController.getBundleText("MSG_29015"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
					MessageBox.error(oController.getBundleText("MSG_29017"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
					MessageBox.error(oController.getBundleText("MSG_29021"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				return false;
			},
			
			onPressReq: function() {//Dialog 신청
				var oController = this;
				var vPernr = this.getUserId();
				var vBukrs2 = this.getUserGubun();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var oSendData = this.DetailModel.getProperty("/FormData");

				if(this.ErrorCheck(this)) return;
				
				oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
				oSendData.Waers = "KRW";

				BusyIndicator.show(0);
				var onProcessApply = function (fVal) {
					if (fVal && fVal == oController.getBundleText("LABEL_29044")) { //신청
						
						// 첨부파일 저장
						var uFiles = [];
						for(var i=1; i<3; i++)	uFiles.push("00" + i);

						oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);

						var sendObject = {
							IPernr: vPernr,
							IEmpid: vPernr,
							IConType: "3",
							IBukrs: vBukrs2
						};
						sendObject.LanguPayApplyTableIn = [
							$.extend(true, Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData), {
								Lecen: new Date(oController.DetailModel.getProperty("/FormData/Lecen"))
							})
						];
						
						oModel.create("/LanguPayApplySet", sendObject, {
							async: true,
							success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_29019"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
							},
							error: function(oResponse) {
								Common.log(oResponse);
								sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
									title: oController.getBundleText("LABEL_09030")
								});
								BusyIndicator.hide();
							}
						});
					}
					BusyIndicator.hide();
				}

				sap.m.MessageBox.confirm(oController.getBundleText("MSG_29018"), {
					title: oController.getBundleText("LABEL_29001"),
					actions: [oController.getBundleText("LABEL_29044"), oController.getBundleText("LABEL_00119")],
					onClose: onProcessApply
				});
			},
			
			onPressSave: function() {// Dialog 저장
				var oController = this;
				var vPernr = this.getUserId();
				var vBukrs2 = this.getUserGubun();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var oSendData = this.DetailModel.getProperty("/FormData");

				if(this.ErrorCheck(this)) return;
				
				oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");

				BusyIndicator.show(0);
				var onProcessSave = function (fVal) {
					if (fVal && fVal == oController.getBundleText("LABEL_29026")) { //저장
						
						// 첨부파일 저장
						var uFiles = [];
						for(var i=1; i<3; i++)	uFiles.push("00" + i);

						oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);

						var sendObject = {
							IPernr:  vPernr,
							IEmpid:  vPernr,
							IConType:  "2",
							IBukrs:  vBukrs2,
							LanguPayApplyTableIn:  [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)]
						};
						
						oModel.create("/LanguPayApplySet", sendObject, {
							async: true,
							success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_29004"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
							},
							error: function(oResponse) {
								Common.log(oResponse);
								sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
									title: oController.getBundleText("LABEL_09030")
								});
								BusyIndicator.hide();
							}
						});
					}
					BusyIndicator.hide();
				}

				sap.m.MessageBox.confirm(oController.getBundleText("MSG_29003"), {
					title: oController.getBundleText("LABEL_29001"),
					actions: [oController.getBundleText("LABEL_29026"), oController.getBundleText("LABEL_00119")],
					onClose: onProcessSave
				});
			},

			onPressDelete: function() { // 삭제
				var oController = this;
				var vPernr = this.getUserId();
				var vBukrs2 = this.getUserGubun();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var oSendData = this.DetailModel.getProperty("/FormData");
				
				oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
				
				BusyIndicator.show(0);
				var onProcessDelete = function (fVal) {
					if (fVal && fVal == oController.getBundleText("LABEL_29027")) { // 삭제
						
						var sendObject = {
							IPernr: vPernr,
							IEmpid: vPernr,
							IConType: "4",
							IBukrs: vBukrs2,
							LanguPayApplyTableIn: [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)]
						};

						oModel.create("/LanguPayApplySet", sendObject, {
							success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_29006"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
							},
							error: function(oResponse) {
								Common.log(oResponse);
								sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
									title: oController.getBundleText("LABEL_09030")
								});
								BusyIndicator.hide();
							}
						});
					}
					BusyIndicator.hide();
				}

				sap.m.MessageBox.confirm(oController.getBundleText("MSG_29005"), {
					title: oController.getBundleText("LABEL_29001"),
					actions: [oController.getBundleText("LABEL_29027"), oController.getBundleText("LABEL_00119")],
					onClose: onProcessDelete
				});
			},
			
			onBeforeOpenFileUpload: function(oController) {
				var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
					vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";
				
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 영수증
					Label: oController.getBundleText("LABEL_29020"),
					Required : true,
					Appnm: vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
				},"001");
				
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 수강학원증
					Label: oController.getBundleText("LABEL_29021"),
					Required : true,
					Appnm: vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
				},"002");
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20075008 35117216 20130126
			} : null
			 
		});
	}
);
