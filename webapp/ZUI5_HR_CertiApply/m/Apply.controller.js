sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Apply"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Apply",
		
		ApplyModel: new JSONModelHelper(),
		
		getUserId: function() {

			return $.app.getController().getUserId();
		},
		
		getUserGubun  : function() {

			return $.app.getController().getUserGubun();
        },
		
		onInit: function () {

			this.setupView();

			this.getView()
				.addEventDelegate({
					onBeforeShow: this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
		},
		
		onBeforeShow: function(oEvent) {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			// var oController = $.app.getController();
            this.ApplyModel.setData({Data:{ ZformType : 0, Aptyp : 0  }});
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

        
        checkError: function() {
			var oController = this.getView().getController();
			
			// 구분
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/ZformType"))){
				MessageBox.error(oController.getBundleText("MSG_64009"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			// 수령방법
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/Aptyp"))){
				MessageBox.error(oController.getBundleText("MSG_64015"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			// 경력증명서는 인사팀 발행 또는 메일발송을 선택하여 주십시오.
			if(oController.ApplyModel.getProperty("/Data/ZformType") == "02" && oController.ApplyModel.getProperty("/Data/Aptyp") == "1"){
				MessageBox.error(oController.getBundleText("MSG_64016"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};

			// 언어
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/Zlang"))){
				MessageBox.error(oController.getBundleText("MSG_64010"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};

			// 기준년도 , 미입력 시 올해 년도 세팅
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/Zyear"))){
				oController.ApplyModel.setProperty("/Data/Zyear", new Date().getFullYear());
			};

			// 수량 , 미입력 시 1 기본 세팅
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/Zcount"))){
				oController.ApplyModel.setProperty("/Data/Zcount", "1");
			};

			// 제출처
			if(Common.checkNull(oController.ApplyModel.getProperty("/Data/Zcount"))){
				MessageBox.error(oController.getBundleText("MSG_64014"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};

			return false;
		},
		
        onDialogApplyBtn: function() { // 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_CERTI_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/Data");

			oRowData.Pernr = vPernr;

			if(this.checkError(this)) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38044")) { // 신청
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
		            sendObject.IConType = "2";
		            sendObject.ILangu = oController.getView().getModel("session").getData().Langu;
		            sendObject.IMolga = oController.getView().getModel("session").getData().Molga;
		            sendObject.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
		            sendObject.IEmpid = vPernr;
					// Navigation property
                    sendObject.TableIn = [Common.copyByMetadata(oModel, "CertiAppTableIn", oRowData)];
					
					oModel.create("/CertiAppSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38002"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38001"), {
				title: oController.getBundleText("LABEL_65001"),
				actions: [oController.getBundleText("LABEL_38044"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20001008 20190204
		} : null
	});
});