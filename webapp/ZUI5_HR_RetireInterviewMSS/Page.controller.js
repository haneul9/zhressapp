sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/EmployeeModel",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, EmployeeModel, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		InterviewModel: new JSONModelHelper(),
        EmployeeModel: new EmployeeModel(),

		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs2");
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
			var	oController = this.getView().getController();
			var oApplyDate = sap.ui.getCore().byId(oController.PAGEID + "_ApplyDate");
			
			oApplyDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {

            this.EmployeeModel.retrieve(this.getUserId());
			this.onTableSearch();
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oApplyDate = $.app.byId(oController.PAGEID + "_ApplyDate");
			var oEnameInput = $.app.byId(oController.PAGEID + "_EnameInput");
			var vDate1 = oApplyDate.getDateValue();
			var vDate2 = oApplyDate.getSecondDateValue();
			
			var sendObject = {};
			// Header
			sendObject.IZchpnr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IZrolgb = "H";
            sendObject.IConType = "1";
			sendObject.IBegda = Common.adjustGMTOdataFormat(vDate1);
			sendObject.IEndda = vDate2;
			sendObject.IEname = Common.checkNull(oEnameInput.getValue()) ? "" : oEnameInput.getValue();
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
					}else{
						oController.TableModel.setData({Data: []}); 
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

		onPressSer: function() { //조회
			var oController = $.app.getController();
			
			oController.onTableSearch();
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_RetireInterviewMSS.Page");
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);

			var oCopyRow = $.extend(true, {}, oRowData);
			
            oController.InterviewModel.setData({FormData: oCopyRow});

			if (!oController._InterviewModel) {
                oController._InterviewModel = sap.ui.jsfragment("ZUI5_HR_RetireInterviewMSS.fragment.Interview", oController);
				oView.addDependent(oController._InterviewModel);
			};

			oController._InterviewModel.open();
		},

		checkError :function() { // Error Check
			var oController = $.app.getController();
			var oFormData = oController.InterviewModel.getProperty("/FormData");
			
			// 신청 내역
			if(Common.checkNull(oFormData.Zdtlrs)){
				MessageBox.error(oController.getBundleText("MSG_45008"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

        onDialogCompleteBtn: function() { // 면담완료
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.InterviewModel.getProperty("/FormData");

			oRowData.Zchpnr = vPernr;

			if(oController.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45023")) { // 면담완료
						
					var sendObject = {};
					// Header
					sendObject.IConType = "5";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							oController._InterviewModel.close();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_45010"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_45009"), {
				title: oController.getBundleText("LABEL_45001"),
				actions: [oController.getBundleText("LABEL_45023"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onDialogSaveBtn: function() { // 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.InterviewModel.getProperty("/FormData");

			oRowData.Zchpnr = vPernr;

			if(oController.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_45017")) { // 저장

					var sendObject = {};
					// Header
					sendObject.IConType = "6";
					// Navigation property
					sendObject.TableIn1 = [Common.copyByMetadata(oModel, "RtrintRequestTableIn1", oRowData)];
					
					oModel.create("/RtrintRequestSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_45004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._InterviewModel.close();
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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20060040"}); // 기초 퇴직예정자 20050069 ,20085002  첨단 퇴직예정자 35132129 ,35132085
		} : null											 // 기초 퇴직담당자 20130126 ,20060040  첨단 퇴직담당자 35128158 ,35110749
	});
});