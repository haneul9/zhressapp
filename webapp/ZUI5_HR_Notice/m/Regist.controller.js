sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
    "../../common/AttachFileAction",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, BusyIndicator) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Regist",
		
        RegistModel: new JSONModelHelper(),
		
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
			BusyIndicator.show(0);

            this.RegistModel.setData({FormData: []});

            if(oEvent.data){
				this.RegistModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : [] });
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {

			this.getDetailData(this);
            this.onBeforeOpenDetailDialog(this);
			BusyIndicator.hide();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix()),
				data: { 
                    New: "X"
                }
            });
        },

        getDetailData: function(oController) { // 상세정보
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
            var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = oController.RegistModel.getProperty("/FormData/Sdate");
			sendObject.ISeqnr = oController.RegistModel.getProperty("/FormData/Seqnr");
            sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oCopiedRow.Detail = "";
						
						oData.TableIn3.results.forEach(function(e) {
							oCopiedRow.Detail += e.Detail;
						});
						// oController.RegistModel.setData({FormData: oCopiedRow});
                        oController.RegistModel.setData({FormData: $.extend(true, oCopiedRow, {
							Detail: /^</i.test(oCopiedRow.Detail) ? oCopiedRow.Detail : "<p>${content}</p>".interpolate(oCopiedRow.Detail)
						})});
						// oController.RegistModel.setData({FormData: oCopiedRow});
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

        onBeforeOpenDetailDialog: function() {
			var oController = this.getView().getController();
			var	vSdate = oController.RegistModel.getProperty("/FormData/Sdate"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: !vSdate ? true : false
			});
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()});
		} : null
	});
});