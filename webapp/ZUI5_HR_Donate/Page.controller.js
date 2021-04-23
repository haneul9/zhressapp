sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, PageHelper, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
        InitModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs;
        },
        
		getUserEname  : function() {

			return this.getView().getModel("session").getData().Ename;
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
            this.onInit2();
			this.onTableSearch();
        },

        getTime: function() {
            
            return new sap.m.Text({
                text: {
                    path: "ApplyTm",
                    formatter: function(v) {
                        if(v) return sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v.ms), true);
                        else return "";
                    }
                }
            })
        },
        
        onInit2: function() {
            var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IConType = "9";
			// Navigation property
			sendObject.SocialDonationExport = [];
			sendObject.SocialDonationTableIn3 = [];
			
			oModel.create("/SocialDonationImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData) {
                        Common.log(oData);
                        
                        oController.InitModel.setData({Data: oData.SocialDonationExport.results[0]});
                        oData.SocialDonationTableIn3.results.unshift({Status: "ALL", StatusText: oController.getBundleText("LABEL_33011")});
                        oController.InitModel.setProperty("/StatusCombo", oData.SocialDonationTableIn3.results);
                        oController.InitModel.setProperty("/Data/Status", "ALL");
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

        getTopText: function() {
            var oController = $.app.getController();
            var vEname = oController.getUserEname();
            var vDonate = Common.checkNull(oController.DetailModel.getProperty("/Data/Doamt")) ? "0" : oController.DetailModel.getProperty("/Data/Doamt");
            var vEname2 = "<strong style='font-size:16px; color:#333333'>" + vEname + "</strong>" ;
            var vDonate2 = "<strong style='font-size:18px; color:#0070BD'>" + Common.numberWithCommas(vDonate) + "</strong>";
            var vMsg = oController.getBundleText("MSG_33001");
            vMsg = vMsg.replace("${Ename}", vEname2);
            vMsg = vMsg.replace("${Donate}", vDonate2);
			vMsg = "<p>" + vMsg + "</p>";
			
            return vMsg;
        },
        
        getMidText: function() {
			var oController = $.app.getController();
			var vEname = oController.getUserEname();
			var vEname2 = "<strong style='font-size:16px; color:333333'>" + vEname + "</strong>" ;
            var vMsg = oController.getBundleText("MSG_33006");
            vMsg = vMsg.replace("${Ename}", vEname2);
			vMsg = "<p>" + vMsg + "</p>";

            return vMsg;
        },

        getBotText: function() {
			var oController = $.app.getController();
			var vDonate = Common.checkNull(oController.DetailModel.getProperty("/Data/Doamt")) ? "0" : oController.DetailModel.getProperty("/Data/Doamt");
			var vDonate2 = "</strong><strong style='font-size:18px; color:#0070BD'>" + Common.numberWithCommas(vDonate) + "</strong><strong style='color:#333333'>";
            var vMsg = oController.getBundleText("MSG_33007");
            vMsg = vMsg.replace("${Donate}", vDonate2);
			vMsg = "<p><strong>" + vMsg + "</strong></p>";

            return vMsg;
        },

        getDonation: function(oEvent) {
            var oController = $.app.getController();
			var oTopFormatterT = $.app.byId(oController.PAGEID + "_TopText");
			var oBotFormatterT = $.app.byId(oController.PAGEID + "_BotText");
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.DetailModel.setProperty("/Data/Doamt", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oTopFormatterT.setHtmlText(oController.getTopText());
			oBotFormatterT.setHtmlText(oController.getBotText());
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oApplyDate = $.app.byId(oController.PAGEID + "_ApplyDate");
			var vStatus = oController.InitModel.getProperty("/Data/Status");
			var vDate1 = oApplyDate.mProperties.dateValue;
			var vDate2 = oApplyDate.mProperties.secondDateValue;
			
			oController.TableModel.setData({Data: []}); 

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IStatus = vStatus === "ALL" ? "" : vStatus;
			sendObject.IBegda = vDate1;
            sendObject.IEndda = vDate2;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.SocialDonationExport = [];
			sendObject.SocialDonationTableIn1 = [];
			sendObject.SocialDonationTableIn2 = [];
			sendObject.SocialDonationTableIn3 = [];
			
			oModel.create("/SocialDonationImportSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.SocialDonationTableIn1) {
						Common.log(oData);
						var rDatas1 = oData.SocialDonationTableIn1.results;
						dataLength = rDatas1.length;
						oController.TableModel.setData({Data: rDatas1}); 
					}
					
					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength); //rowcount가 10개 미만이면 그 갯수만큼 row적용
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
		
		onPressReq: function() { //신청
			var oView = $.app.byId("ZUI5_HR_Donate.Page");
			var oController = $.app.getController();
			var vEname = oController.getUserEname();
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_Donate.fragment.DonateApply", oController);
				oView.addDependent(oController._DetailModel);
			}
			
			// Data setting
            oController.DetailModel.setData({Data: []});
            oController.DetailModel.setProperty("/Data/ApplyNm", vEname);
			
			oController.getDetailDonate();
			oController._DetailModel.open();
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_Donate.Page");
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var vEname = oController.getUserEname();
            
            oController.DetailModel.setData({Data: []});
			oController.DetailModel.setProperty("/Data/ApplyNm", vEname);
			oController.DetailModel.setProperty("/Data/Status", oRowData.Status);
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_Donate.fragment.DonateApply", oController);
				oView.addDependent(oController._DetailModel);
			}
			
			oController.getDetailDonate(oRowData);
			oController._DetailModel.open();
		},
		
		getDetailDonate: function(oRowData) { // 참여자 기부금
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oTopFormatterT = $.app.byId(oController.PAGEID + "_TopText");
			var oBotFormatterT = $.app.byId(oController.PAGEID + "_BotText");

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IConType = !oRowData ? "0" : "1";
			// Navigation property
			sendObject.SocialDonationTableIn1 = [!oRowData ? "" : oRowData];
			sendObject.SocialDonationTableIn2 = [];

			oModel.create("/SocialDonationImportSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						oController.DetailModel.setProperty("/Data", oData.SocialDonationTableIn2.results[0]);
						oController.DetailModel.setProperty("/SendData", oData.SocialDonationTableIn1.results[0]);
						oTopFormatterT.setHtmlText(oController.getTopText());
						oBotFormatterT.setHtmlText(oController.getBotText());
						oController._DetailModel.open();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
        
        onDialogApply: function() { //약정합니다
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var	oSendData = oController.DetailModel.getProperty("/SendData");

			oSendData.Doamt = oController.DetailModel.getProperty("/Data/Doamt");

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_33006")) {
					
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = oSendData.Status === "" ? "3" : "2";
					// Navigation property
					sendObject.SocialDonationTableIn1 = [oSendData];
					
					oModel.create("/SocialDonationImportSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								oController.onTableSearch();
								BusyIndicator.hide();
								sap.m.MessageBox.alert(oController.getBundleText("MSG_33011"), { title: oController.getBundleText("MSG_08107")});
								oController._DetailModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_33010"), {
				title: oController.getBundleText("LABEL_33001"),
				actions: [oController.getBundleText("LABEL_33006"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35110749"}); // 35110749
		} : null
	});
});