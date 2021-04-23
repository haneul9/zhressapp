sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),

		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs2");
        },

		getUserName  : function() {

			return this.getSessionInfoByKey("Ename");
        },

		getUserStext  : function() {

			return this.getSessionInfoByKey("Stext");
        },
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {

			this.onTableSearch();
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			
			oController.TableModel.setData({Data: []}); 

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IZrolgb = "E";
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/RtrintRequestSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
						dataLength = rDatas.length;
						oController.TableModel.setData({Data: rDatas}); 
					}

					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },

        getStatus: function() {
            var oController = $.app.getController();

            return 	new sap.m.FlexBox({
                justifyContent: "Center",
                items: [
                    new sap.ui.commons.TextView({
                        text : "{StatusTxt}", 
                        textAlign : "Center",
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal !== "A") return true;
                                else return false;
                            }
                        }
                    })
                    .addStyleClass("font-13px mt-4px"),
                    new sap.m.FlexBox({
                        justifyContent: "Center",
                        items: [
                            new sap.ui.commons.TextView({ //처리결과에 Text
                                text : "{StatusTxt}", 
                                textAlign : "Center"
                            })
                            .addStyleClass("font-13px mt-7px"),
                            new sap.m.Button({ //처리결과에 삭제 버튼
                                text: "{i18n>LABEL_45018}",
                                press : oController.onPressCancel
                            })
                            .addStyleClass("button-light-sm ml-10px")
                        ],
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal === "A") return true;
                                else return false;
                            }
                        }
                    })
                ]
            });
        },

		onPressReq: function() { //신청
			var oView = $.app.byId("ZUI5_HR_RetireInterview.Page");
			var oController = $.app.getController();
            var vEName = oController.getUserName();
            var vStext = oController.getUserStext();
			
            oController.ApplyModel.setData({FormData: []});
            oController.ApplyModel.setProperty("/FormData/Reqdt", new Date());
            oController.ApplyModel.setProperty("/FormData/Ename", vEName);
            oController.ApplyModel.setProperty("/FormData/Stext", vStext);
        
			if (!oController._ApplyModel) {
                oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_RetireInterview.fragment.Apply", oController);
				oView.addDependent(oController._ApplyModel);
			};

		    oController._ApplyModel.open();
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_RetireInterview.Page");
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);

            var oCopiedRow = $.extend(true, {}, oRowData);
            oController.ApplyModel.setData({FormData: oCopiedRow});

			if (!oController._ApplyModel) {
                oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_RetireInterview.fragment.Apply", oController);
				oView.addDependent(oController._ApplyModel);
			};

			oController._ApplyModel.open();
		},

		checkError :function() { // Error Check
			var oController = $.app.getController();
			var oFormData = oController.ApplyModel.getProperty("/FormData");
			
			// 신청 내역
			if(Common.checkNull(oFormData.Zdtlrs)){
				MessageBox.error(oController.getBundleText("MSG_45007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		onPressCancel: function(oEvent) { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
			var oRowData = oController.TableModel.getProperty(vPath);

			var onPressCancel = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45018")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IConType = "4";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_45006"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_45005"), {
				title: oController.getBundleText("LABEL_45001"),
				actions: [oController.getBundleText("LABEL_45018"), oController.getBundleText("LABEL_00119")],
				onClose: onPressCancel
			});
		},

        onDialogApplyBtn: function() { // 신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr;

			if(oController.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45016")) { // 신청
						
					var sendObject = {};
					// Header
					sendObject.IConType = "3";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							oController._ApplyModel.close();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_45002"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_45001"), {
				title: oController.getBundleText("LABEL_45001"),
				actions: [oController.getBundleText("LABEL_45016"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onDialogSaveBtn: function() { // 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr;

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45017")) { // 저장

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_45004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._ApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_45003"), {
				title: oController.getBundleText("LABEL_45001"),
				actions: [oController.getBundleText("LABEL_45017"), oController.getBundleText("LABEL_00119")],
				onClose: onPressSave
			});
        },

        onDialogDelBtn: function() { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45018")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IConType = "4";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_45006"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._ApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_45005"), {
				title: oController.getBundleText("LABEL_45001"),
				actions: [oController.getBundleText("LABEL_45018"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); // 기초 퇴직예정자 20050069 ,20085002  첨단 퇴직예정자 35132129 ,35132085
		} : null											 // 기초 퇴직담당자 20130126 ,20001003  첨단 퇴직담당자 35128158 ,35110749
	});
});