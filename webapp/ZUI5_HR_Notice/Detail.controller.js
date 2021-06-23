sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/EditorType"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates, RTE, EditorType) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Detail",
		
        TableModel: new JSONModelHelper(),
		RegistModel: new JSONModelHelper(),

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
            BusyIndicator.show(0);
            this.RegistModel.setData({FormData: []});

            if(oEvent.data){
                this.getDetailData(oEvent.data.vSdate, oEvent.data.vSeqnr);
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.onBeforeOpenDetailDialog();
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

		getDetailData: function(Sdate, Seqnr) { // 상세정보
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
            var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = Sdate;
			sendObject.ISeqnr = Seqnr;
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
			return new JSONModelHelper({name: this.getView().getController().getUserId()}); 
		} : null
	});
});