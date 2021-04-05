sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper"
	], 
	function (Common, CommonController, JSONModelHelper) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),

		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs");
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
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var vPernr = oController.getUserId();
			
            oController.TableModel.setData({Data: []});

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IDatum = new Date();
            sendObject.IConType = "1";
			// Navigation property
			sendObject.Export = [];
			sendObject.TableIn1 = [];
			
			oModel.create("/LeaveRequestSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
                        oController.TableModel.setData({Data: rDatas});
					}
                    oController.LogModel.setData({Data: oData.Export.results[0]});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },
		
		onPressReq: function() { //신청
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LeaveReinApp"].join($.app.getDeviceSuffix()),
            });
		},
		
		onSelectedRow: function(oEvent) {
			var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
			var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));
            
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LeaveReinApp"].join($.app.getDeviceSuffix()),
                data: {
                    RowData: oRowData
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35119918"}); // 20180178  (기초 휴직) 31018948 31019137 35119918 (첨단 휴직)
		} : null                                            // 20150128  (기초 복직) 31019231 35124510 35125552 (첨단 복직)
	});
});