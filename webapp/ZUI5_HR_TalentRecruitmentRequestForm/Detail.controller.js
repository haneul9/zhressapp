sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"common/SearchOrg",
	"common/AttachFileAction"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, SearchOrg, AttachFileAction) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Detail",
		
		ApplyModel: new JSONModelHelper(),

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
			var oDeptInput = $.app.byId(this.PAGEID + "_Orgeh");

            this.ApplyModel.setData({FormData: []});
			oDeptInput.destroyTokens();
			
            if(oEvent.data.RowData){
				this.ApplyModel.setData({FormData: oEvent.data.RowData});
            }
		},
		
		onAfterShow: function() {
			this.getReasonList();
			this.onBeforeOpenDetailDialog();
			
			$("#Detail-app-title-container").remove();
            BusyIndicator.hide();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

		getReasonList: function() {
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var sendObject = {};
			var vPersonnel = "",
                oList = [];

			Common.makeNumbersArray({length: 99, isZeroStart: false}).forEach(function(idx) {
				vPersonnel = String(idx);
				oList.push({ Code: vPersonnel, Text: vPersonnel + "명" });
			});

			oController.ApplyModel.setProperty("/FormData/Reccnt", "1");
			oController.ApplyModel.setProperty("/PersonnelCombo", oList);
			
			if(!oController.ApplyModel.getProperty("/ReasonList")) {
				sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IBukrs = vBukrs;
				sendObject.ICodeT = "004";
				sendObject.ICodty = "ZHRD_RECRSN";
				// Navigation property
				sendObject.NavCommonCodeList = [];
				// 사유코드
				oModel.create("/CommonCodeListHeaderSet", sendObject, {
					success: function(oData) {
						if (oData && oData.NavCommonCodeList) {
							Common.log(oData);
							oController.ApplyModel.setProperty("/ReasonList", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}

			if(!oController.ApplyModel.getProperty("/StaffingCombo")) {
				sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IBukrs = vBukrs;
				sendObject.ICodeT = "004";
				sendObject.ICodty = "ZHRD_RECCHN";
				// Navigation property
				sendObject.NavCommonCodeList = [];
				// 채널코드
				oModel.create("/CommonCodeListHeaderSet", sendObject, {
					success: function(oData) {
						if (oData && oData.NavCommonCodeList) {
							Common.log(oData);
							oController.ApplyModel.setProperty("/StaffingCombo", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}

			if(!oController.ApplyModel.getProperty("/WorkGroup")) {
				sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IBukrs = vBukrs;
				sendObject.ICodeT = "004";
				sendObject.ICodty = "ZHRD_HGRADE";
				// Navigation property
				sendObject.NavCommonCodeList = [];
				// 직군코드
				oModel.create("/CommonCodeListHeaderSet", sendObject, {
					success: function(oData) {
						if (oData && oData.NavCommonCodeList) {
							Common.log(oData);
							oController.ApplyModel.setProperty("/WorkGroup", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}

			if(!oController.ApplyModel.getProperty("/PersonnelArea")) {
				// 인사영역
				oModel.read("/WerksListAuthSet", {
					filters: [
						new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
						new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
						new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
						new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId()),
						new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
						new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, vBukrs)
					],
					success: function (data) {
						if (data && data.results.length) {
							oController.ApplyModel.setProperty("/PersonnelArea", data.results);
						}
					},
					error: function (oResponse) {
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
				// sendObject = {};
				// // Header
				// sendObject.ICusrid = sessionStorage.getItem('ehr.odata.user.percod');
				// sendObject.ICusrse = sessionStorage.getItem('ehr.session.token');
				// sendObject.ICusrpn = sessionStorage.getItem('ehr.sf-user.name');
				// sendObject.ICmenuid = $.app.getMenuId();
				// sendObject.Percod = oController.getSessionInfoByKey("Percod");
				// sendObject.Bukrs = vBukrs;
				// // 인사영역
				// oModel.read("/WerksListAuthSet", sendObject, {
				// 	success: function(oData) {
				// 		if (oData && oData.results.length) {
				// 			Common.log(oData);
				// 			oController.ApplyModel.setProperty("/PersonnelArea", oData.results);
				// 		}
				// 	},
				// 	error: function(oResponse) {
				// 		Common.log(oResponse);
				// 		sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
				// 			title: oController.getBundleText("LABEL_09030")
				// 		});
				// 	}
				// });
			}
		},

		checkError :function() { // Error Check
			var oController = this.getView().getController();
			var oFormData = oController.ApplyModel.getProperty("/FormData");
			var oDeptInput = $.app.byId(oController.PAGEID + "_Orgeh");

			// 요청부서
			if(Common.checkNull(oDeptInput.getTokens()[0])){
				MessageBox.error(oController.getBundleText("MSG_77008"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}else {
				oController.ApplyModel.setProperty("/FormData/Orgeh", oDeptInput.getTokens()[0].mProperties.key);
			}

			// 충원사유
			if(Common.checkNull(oFormData.Recrsn)){
				MessageBox.error(oController.getBundleText("MSG_77009"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}
			
			// 상세사유
			if(Common.checkNull(oFormData.Detrsn)){
				MessageBox.error(oController.getBundleText("MSG_77010"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 담당인사영역
			if(Common.checkNull(oFormData.Werks)){
				MessageBox.error(oController.getBundleText("MSG_77011"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 채용희망일
			if(Common.checkNull(oFormData.Recda)){
				MessageBox.error(oController.getBundleText("MSG_77012"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 직군
			if(Common.checkNull(oFormData.Zhgrade)){
				MessageBox.error(oController.getBundleText("MSG_77013"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 직무
			if(Common.checkNull(oFormData.Recjob)){
				MessageBox.error(oController.getBundleText("MSG_77014"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 수행업무
			if(Common.checkNull(oFormData.Rectask)){
				MessageBox.error(oController.getBundleText("MSG_77015"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 학위
			if(Common.checkNull(oFormData.Recdegree)){
				MessageBox.error(oController.getBundleText("MSG_77016"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 전공
			if(Common.checkNull(oFormData.Recmajor)){
				MessageBox.error(oController.getBundleText("MSG_77017"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 필수경력
			if(Common.checkNull(oFormData.Reccareer)){
				MessageBox.error(oController.getBundleText("MSG_77018"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// if (AttachFileAction.getFileLength(oController) === 0) {
			// 	MessageBox.error(oController.getBundleText("MSG_59027"), { title: oController.getBundleText("LABEL_00149") });
			// 	return true;
			// }

			return false;
		},

		getBankName: function(oEvent) {
			var vBankName = oEvent.getSource().getValue();
			this.ApplyModel.setProperty("/FormData/Banka", vBankName);
		},

		// 소속부서 검색
		displayMultiOrgSearchDialog: function (oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_TalentRecruitmentRequestForm.Page");
			var oController = oView.getController();

			SearchOrg.oController = oController;
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vActionType = "Single";
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				oView.addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

        onDialogApplyBtn: function() { // 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_HRDOC_SRV");
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			if(this.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_77014")) { // 신청
												
					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IEmpid = vPernr;
					sendObject.IOrgeh = oController.ApplyModel.getProperty("/FormData/Orgeh");
					sendObject.IConType = "2";
					// Navigation property
					sendObject.EmpRecruitNav = [Common.copyByMetadata(oModel, "NewEmpRecruitTab", oRowData)];
					
					oModel.create("/NewEmpRecruitSet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_77002"), { title: oController.getBundleText("MSG_08107")});
							oController.navBack();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);

							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_77001"), {
				title: oController.getBundleText("LABEL_77001"),
				actions: [oController.getBundleText("LABEL_77014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
		},

        onDialogReAplBtn: function() { // 재신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_HRDOC_SRV");
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			if(this.checkError()) return;
			
			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_77054")) { // 재신청
												
					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IEmpid = vPernr;
					sendObject.IOrgeh = oController.ApplyModel.getProperty("/FormData/Orgeh");
					sendObject.IConType = "2";
					// Navigation property
					sendObject.EmpRecruitNav = [Common.copyByMetadata(oModel, "NewEmpRecruitTab", oRowData)];
					
					oModel.create("/NewEmpRecruitSet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_77020"), { title: oController.getBundleText("MSG_08107")});
							oController.navBack();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);

							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_77019"), {
				title: oController.getBundleText("LABEL_77001"),
				actions: [oController.getBundleText("LABEL_77054"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
		},

		onDialogDeleteBtn: function() { // 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_HRDOC_SRV");
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_77043")) { // 삭제
										
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IEmpid = vPernr;
					sendObject.ISeqnr = oController.ApplyModel.getProperty("/FormData/Seqnr");
					sendObject.IOrgeh = oController.ApplyModel.getProperty("/FormData/Orgeh");
					sendObject.IConType = "3";
					// Navigation property
					sendObject.EmpRecruitNav = [Common.copyByMetadata(oModel, "NewEmpRecruitTab", oRowData)];
					
					oModel.create("/NewEmpRecruitSet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_77004"), { title: oController.getBundleText("MSG_08107")});
							oController.navBack();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);

							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_77003"), {
				title: oController.getBundleText("LABEL_77001"),
				actions: [oController.getBundleText("LABEL_77043"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
		},

		onBeforeOpenDetailDialog: function () {
			var oController = this.getView().getController();
			var	vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "",
                vRecsta = oController.ApplyModel.getProperty("/FormData/Recsta");
				

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "3",
				Editable: !vRecsta
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: this.getView().getController().getUserId()}); 
		} : null
	});
});