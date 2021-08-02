sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"fragment/COMMON_ATTACH_FILES"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, FileHandler) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Detail",
		
        TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),

		g_Check: "",

		getUserId: function() {

			return $.app.getController().getUserId();
		},
		
		getUserGubun  : function() {

			return $.app.getController().getUserGubun();
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
				}, this);
		},
		
		onBeforeShow: function(oEvent) {
            Common.log("onBeforeShow");

            BusyIndicator.show(0);

            this.ApplyModel.setData({FormData: []});
			this.g_Check= "N";
            
            if(oEvent.data.RowData){
                this.ApplyModel.setData({FormData: oEvent.data.RowData});
				this.getDataColor(oEvent.data.RowData);
            }
		},
		
		onAfterShow: function() {
			this.onBeforeOpenDetailDialog();
			$("#Detail-app-title-container").remove();
            BusyIndicator.hide();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

		checkError :function() { // Error Check
			var oController = this.getView().getController();
			var oFormData = oController.ApplyModel.getProperty("/FormData");

			// 숙박기간
			if(Common.checkNull(oFormData.Begda)){
				MessageBox.error(oController.getBundleText("MSG_74009"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}
			
			// 계산하지 않았을경우
			if(oController.g_Check === "N"){
				MessageBox.error(oController.getBundleText("MSG_74005"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 연차없음일 경우
			if(oFormData.Vacprd === oController.getBundleText("LABEL_74039")){
				MessageBox.error(oController.getBundleText("MSG_74006"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 힐링휴가 중복일경우
			if(oFormData.Healdup === "X"){
				MessageBox.error(oController.getBundleText("MSG_74007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 잔여한도 0일경우
			if(oFormData.Avacnt === "0"){
				MessageBox.error(oController.getBundleText("MSG_74008"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 첨부파일 필수
			if(FileHandler.getFileLength(oController, "001") === 0){
				MessageBox.error(oController.getBundleText("MSG_74015"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		setPicker: function() {
			this.g_Check= "N";
		},

		getDataColor: function(oRowData) {
			var oController = this.getView().getController();
			var oVacText = $.app.byId(oController.PAGEID + "_VacText");
			var oHelText = $.app.byId(oController.PAGEID + "_HelText");
			var oAvaText = $.app.byId(oController.PAGEID + "_AvaText");

			if(oRowData.Vacprd === oController.getBundleText("LABEL_74039")) {
				oVacText.toggleStyleClass("info-text-red", true);
			}else {
				oVacText.toggleStyleClass("info-text-red", false);
			}
			
			if(oRowData.Healdup === "X") {
				oHelText.toggleStyleClass("info-text-red", true);
				oHelText.toggleStyleClass("color-blue", false);
			}else {
				oHelText.toggleStyleClass("info-text-red", false);
				oHelText.toggleStyleClass("color-blue", true);
			}

			if(oRowData.Avacnt === "0") {
				oAvaText.toggleStyleClass("info-text-red", true);
				oAvaText.toggleStyleClass("color-blue", false);
			}else {
				oAvaText.toggleStyleClass("info-text-red", false);
				oAvaText.toggleStyleClass("color-blue", true);
			}
		},

        onDateRange: function() { // 숙박기간 계산
            var oController = this;
			var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
			var oFormData = oController.ApplyModel.getProperty("/FormData");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			// 숙박기간
			if(Common.checkNull(oFormData.Begda)){
				MessageBox.error(oController.getBundleText("MSG_74014"), { title: oController.getBundleText("LABEL_00149")});
				return;
			}

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IConType = "2";
			// Navigation property
			sendObject.RoomChargeNav1 = [{
                Pernr: vPernr,
                Begda: moment(oSearchDate.getDateValue()).hours(10).toDate(),
                Endda: moment(oSearchDate.getSecondDateValue()).hours(10).toDate()
            }];
			
			oModel.create("/RoomChargeApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.RoomChargeNav1) {
						Common.log(oData);
						var rDatas = oData.RoomChargeNav1.results[0];
                        oController.ApplyModel.setData({FormData: rDatas});
						
						if(!Common.checkNull(oFormData.Zopni))
							oController.ApplyModel.setProperty("/FormData/Zopni", oFormData.Zopni);
							
						oController.getDataColor(rDatas);
						oController.onBeforeOpenDetailDialog();
						oController.g_Check = "Y";
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});

					oController.ApplyModel.setData({FormData: {
						Begda : oSearchDate.getDateValue(),
						Endda : oSearchDate.getSecondDateValue()
					}});
				}
			});
        },

		onDialogApplyBtn: function() { // 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			if(this.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_74010")) { // 신청
					
					// 첨부파일 저장
					oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
					oRowData.Pernr = vPernr;
										
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "3";
					// Navigation property
					sendObject.RoomChargeNav1 = [Common.copyByMetadata(oModel, "RoomChargeApplyTab1", oRowData)];
					
					oModel.create("/RoomChargeApplySet", sendObject, {
						success: function(oData) {
							if (oData && oData.RoomChargeNav1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_74011"), { title: oController.getBundleText("MSG_08107")});
								oController.navBack();
								BusyIndicator.hide();
							}
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
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_74010"), {
				title: oController.getBundleText("LABEL_74001"),
				actions: [oController.getBundleText("LABEL_74010"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
		},

		onDialogDeleteBtn: function() { // 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_74033")) { // 삭제
										
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "4";
					// Navigation property
					sendObject.RoomChargeNav1 = [Common.copyByMetadata(oModel, "RoomChargeApplyTab1", oRowData)];
					
					oModel.create("/RoomChargeApplySet", sendObject, {
						success: function(oData) {
							if (oData && oData.RoomChargeNav1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_74013"), { title: oController.getBundleText("MSG_08107")});
								oController.navBack();
								BusyIndicator.hide();
							}
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
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_74012"), {
				title: oController.getBundleText("LABEL_74001"),
				actions: [oController.getBundleText("LABEL_74033"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
		},

        onBeforeOpenDetailDialog: function() {
			var oController = this.getView().getController();
			var	vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "",
                vStatus = oController.ApplyModel.getProperty("/FormData/Status");

			FileHandler.setAttachFile(oController, { // 숙박비 영수증
				Label: oController.getBundleText("LABEL_74045"),
				Required: true,
				Appnm: vAppnm,
				Mode: "S",
				Editable: !vStatus
			},"001");
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: this.getView().getController().getUserId()}); 
		} : null
	});
});