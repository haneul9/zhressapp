sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/AttachFileAction",
	"../../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "RelocationApply"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "RelocationApply",
		
		DetailModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),
		
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
            if(oEvent.data){
                this.DetailModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : []});
				this.DetailModel.setProperty("/Bukrs", oEvent.data.RowData ? oEvent.data.RowData.Bukrs : this.getUserGubun());
                this.LogModel.setData({Log: oEvent.data.Logi });
                if(oEvent.data.RowData) this.getCriteria();
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.getLocationList(this.DetailModel.getProperty("/FormData"));
			this.onBeforeOpenFileUpload(this);
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

        getLocationList: function(oRowData) {
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			var oPers1 = $.app.byId(oController.PAGEID + "_PersInput1"),
				oPers2 = $.app.byId(oController.PAGEID + "_PersInput2");
				
			if(!Common.checkNull(oRowData.Status)){
				oRadioGroup.setSelectedIndex(parseInt(oRowData.Zwtfml) - 1);
				if(parseInt(oRowData.Zwtfml) - 1 === 0){
					oPers1.setEditable(false);
					oPers2.setEditable(false);
				}else{
					oPers1.setEditable(true);
					oPers2.setEditable(true);
				}
			}else
				oRadioGroup.setSelectedIndex(0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			sendObject.NewPostTableIn3 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn3) {
						Common.log(oData);
						oData.NewPostTableIn3.results.unshift({ Subtx1: oController.getBundleText("LABEL_00181"), Subcd: "CheckNull"});

						oController.DetailModel.setProperty("/LocationCombo1",oData.NewPostTableIn3.results);
						oController.DetailModel.setProperty("/LocationCombo2",oData.NewPostTableIn3.results);
						if(Common.checkNull(oRowData.Status)){
							oController.DetailModel.setProperty("/FormData/Zfwkps", "CheckNull");
							oController.DetailModel.setProperty("/FormData/Ztwkps", "CheckNull");
						}	
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

		checkLocation1: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation2: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation: function(oEvent) { // 부임지 Check
			var oController = this;
			var oLocation1 = $.app.byId(oController.PAGEID + "_LocationCombo1");
			var oLocation2 = $.app.byId(oController.PAGEID + "_LocationCombo2");

			if(oLocation2.getSelectedKey() === "CheckNull" || oLocation1.getSelectedKey() === "CheckNull") return;

			if(oLocation1.getSelectedKey() === oLocation2.getSelectedKey()) {
				sap.m.MessageBox.alert(oController.getBundleText("MSG_34002"), {
					title: oController.getBundleText("LABEL_00149")
				});
				oEvent.getSource().setSelectedKey("CheckNull");
				return;
			}

			oController.getCost();
		},
		
		getCriteria: function(oEvent) { //발령일자 선택
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var sendObject = {};
			
			if(oEvent) {
				// Header
				sendObject.Pernr = vPernr;
				sendObject.Datum = Common.adjustGMTOdataFormat(oController.DetailModel.getProperty("/FormData/Zactdt"));
				// Navigation property
				sendObject.BukrsExport = [];
				
				oModel.create("/BukrsImportSet", sendObject, { // 발령일자에 따른 Bukrs
					success: function(oData, oResponse) {
						if (oData && oData.BukrsExport) {
							Common.log(oData);
							oController.DetailModel.setProperty("/Bukrs", oData.BukrsExport.results[0].Bukrs); 
							oController.getCost();
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

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
            sendObject.IZactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostExport) {
						Common.log(oData);
						oController.DetailModel.setProperty("/FormData/CriAge", oData.NewPostExport.results[0].EDate); 
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

		onChangeRadio: function(oEvent) { // 가족동반여부 check
			var oController = this;
			var vPath = oEvent.getSource().getBindingContext().getPath();
			var oPers1 = $.app.byId(oController.PAGEID + "_PersInput1"),
				oPers2 = $.app.byId(oController.PAGEID + "_PersInput2");

			if(oEvent.mParameters.selectedIndex === 0){
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "1");
				oController.DetailModel.setProperty(vPath + "/Zolda6", "");
				oController.DetailModel.setProperty(vPath + "/Zunda6", "");
				oPers1.setEditable(false);
				oPers2.setEditable(false);
				}else{
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "2");
				oPers1.setEditable(true);
				oPers2.setEditable(true);
			}
			oController.getCost();
		},

		getCostSum1: function(oEvent) { // 6세이상 input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zolda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		getCostSum2: function(oEvent) { // 6세미만 input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zunda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		InputTransCost: function(oEvent) { // 가재운송비 input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');
	
			if(parseInt(convertValue) > parseInt(oController.LogModel.getProperty("/LogData/EAmt"))) {
				var vMsg = oController.getBundleText("MSG_34015");
				vMsg = vMsg.replace("{Money}", Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).split(Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).slice(-4))[0]);

				oController.DetailModel.setProperty("/FormData/Zmvcst", oController.DetailModel.getProperty("/FormData/Zmvcst"));
				oEvent.getSource().setValue(Common.numberWithCommas(oController.DetailModel.getProperty("/FormData/Zmvcst")));
				
				return MessageBox.error(vMsg, { title: oController.getBundleText("LABEL_00149")});
			}

			oController.DetailModel.setProperty("/FormData/Zmvcst", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		InputTransCost2: function(oEvent) { // 첨단의 여비 input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.DetailModel.setProperty("/FormData/Ztexme", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		getCostSum: function() { // 합계
			var oController = this;
			var vZtexme = oController.DetailModel.getProperty("/FormData/Ztexme") ? parseInt(oController.DetailModel.getProperty("/FormData/Ztexme")) : 0, // 본인 여비
				vZtexo6 = oController.DetailModel.getProperty("/FormData/Ztexo6") ? parseInt(oController.DetailModel.getProperty("/FormData/Ztexo6")) : 0, // 6세이상 여비
				vZtexu6 = oController.DetailModel.getProperty("/FormData/Ztexu6") ? parseInt(oController.DetailModel.getProperty("/FormData/Ztexu6")) : 0, // 6세미만 여비
				vZdexme = oController.DetailModel.getProperty("/FormData/Zdexme") ? parseInt(oController.DetailModel.getProperty("/FormData/Zdexme")) : 0, // 본인 일비
				vZdexo6 = oController.DetailModel.getProperty("/FormData/Zdexo6") ? parseInt(oController.DetailModel.getProperty("/FormData/Zdexo6")) : 0, // 6세이상 일비
				vZdexu6 = oController.DetailModel.getProperty("/FormData/Zdexu6") ? parseInt(oController.DetailModel.getProperty("/FormData/Zdexu6")) : 0, // 6세미만 일바
				vZtsrsv = oController.DetailModel.getProperty("/FormData/Ztsrsv") ? parseInt(oController.DetailModel.getProperty("/FormData/Ztsrsv")) : 0, // 이전준비금
				vZmvcst = oController.DetailModel.getProperty("/FormData/Zmvcst") ? parseInt(oController.DetailModel.getProperty("/FormData/Zmvcst")) : 0, // 가재운송비
				vZbkfee = oController.DetailModel.getProperty("/FormData/Zbkfee") ? parseInt(oController.DetailModel.getProperty("/FormData/Zbkfee")) : 0, // 준개 수수료
				vZtstot = ""; // 합계

			vZtstot = vZtexme + vZtexo6 + vZtexu6 + vZdexme + vZdexo6 + vZdexu6 + vZtsrsv + vZmvcst + vZbkfee;
			oController.DetailModel.setProperty("/FormData/Ztstot", String(vZtstot));
		},

		getCost: function() { // 중간필드
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.DetailModel.getProperty("/Bukrs"); 
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			var oSendData = {};

			if(
				oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" ||
				oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull" ||
				Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))
			) 	return;

			if(oController.DetailModel.getProperty("/FormData/Zwtfml") === "2"){
				oSendData.Zolda6 = oController.DetailModel.getProperty("/FormData/Zolda6") ? oController.DetailModel.getProperty("/FormData/Zolda6") : "0", // 6세이상 인원
				oSendData.Zunda6 = oController.DetailModel.getProperty("/FormData/Zunda6") ? oController.DetailModel.getProperty("/FormData/Zunda6") : "0" // 6세미만 인원
			};

			oSendData.Zfwkps = oController.DetailModel.getProperty("/FormData/Zfwkps"), // 현근무지
			oSendData.Ztwkps = oController.DetailModel.getProperty("/FormData/Ztwkps"), // 부임지
			oSendData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt")), // 발령일자
			oSendData.Zmvcst = oController.DetailModel.getProperty("/FormData/Zmvcst") ? oController.DetailModel.getProperty("/FormData/Zmvcst") : "0", // 가재운송비
			oSendData.Zwtfml = String(oRadioGroup.getSelectedIndex() + 1); // 가족동반여부
			

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IGubun = "5";
			// Navigation property
			sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oSendData)];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rData = oData.NewPostTableIn1.results[0];

						if(vBukrs === "A100")
							oController.DetailModel.setProperty("/FormData/Ztexme", Common.checkNull(oController.DetailModel.getProperty("/FormData/Ztexme")) ? "0" : oController.DetailModel.getProperty("/FormData/Ztexme"));
						else
							oController.DetailModel.setProperty("/FormData/Ztexme", rData.Ztexme);

						oController.DetailModel.setProperty("/FormData/Ztexo6", rData.Ztexo6);
						oController.DetailModel.setProperty("/FormData/Ztexu6", rData.Ztexu6);
						oController.DetailModel.setProperty("/FormData/Zdexme", rData.Zdexme);
						oController.DetailModel.setProperty("/FormData/Zdexo6", rData.Zdexo6);
						oController.DetailModel.setProperty("/FormData/Zdexu6", rData.Zdexu6);
						oController.DetailModel.setProperty("/FormData/Ztsrsv", rData.Ztsrsv);
						oController.DetailModel.setProperty("/FormData/Zmvcst", oSendData.Zmvcst);
						oController.DetailModel.setProperty("/FormData/Ztstot", rData.Ztstot);
						oController.getCostSum();
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

		ApplyCheck: function() { // 필수값 체크
			var oController = this;

			// 부임지 Check
			if(oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" || oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull"){
				MessageBox.error(oController.getBundleText("MSG_34004"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 발령일자 Check
			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))){
				MessageBox.error(oController.getBundleText("MSG_34005"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 가족동반 체크시 자녀수 Check
			if((oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")) &&
			  Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")))) ||
			  (oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (parseInt(oController.DetailModel.getProperty("/FormData/Zolda6")) === 0 &&
			  parseInt(oController.DetailModel.getProperty("/FormData/Zunda6")) === 0)))
			{
				MessageBox.error(oController.getBundleText("MSG_34006"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_34013"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},
		
		onDialogApplyBtn: function() { // Dialog 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var oRowData = this.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0"; // 6세미만 인원
			};
			oRowData.Zwtfml = oRowData.Zwtfml ? oRowData.Zwtfml : "1"; // 가족동반 Radio
			oRowData.Waers = "KRW";

			if(this.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34022")) { //신청

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "3";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34008"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34007"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},

		onDialogSaveBtn: function() { // Dialog 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var oRowData = this.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0" // 6세미만 인원
			};
			
			if(this.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34026")) { //저장

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "2";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34010"), { title: oController.getBundleText("MSG_08107")});
                                BusyIndicator.hide();
                                oController.navBack();
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34009"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34026"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // Dialog 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var oRowData = this.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0" // 6세미만 인원
			};
			oRowData.Zmvcst = oRowData.Zmvcst ? oRowData.Zmvcst : "0"; // 가재운송비

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34025")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "4";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34012"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
                                oController.navBack();
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34011"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34025"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onBeforeOpenFileUpload: function(oController) {
			var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
				vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || ""
			
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "10",
				Editable: (!vStatus || vStatus === "AA") ? true : false,
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20001008 20190204
		} : null
	});
});