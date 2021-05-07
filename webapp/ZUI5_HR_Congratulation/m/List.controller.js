sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox, unifiedLibrary) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",

			TableModel: new JSONModelHelper(),

			getUserId: function() {
				return this.getView().getModel("session").getData().name;
			},
			
			getUserGubun: function() {

				return this.getView().getModel("session").getData().Bukrs;
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function () {
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				this.onTableSearch();
			},
			
			onTableSearch: function () {
				//데이터를 가져와서 셋팅하는곳
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();

				oController.TableModel.setData({Data: []});

				var sendObject = {};
				
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "1";
				sendObject.ILangu = "3";
				sendObject.IBukrs = "1000";

				// Navigation property
				sendObject.TableIn = [];

				BusyIndicator.show(0);
				
				oModel.create("/CongratulationApplySet", sendObject, {
					async: true,
					success: function (oData, oResponse) {
						if (oData && oData.TableIn.results) {
							//값을 제대로 받아 왔을 때
							var rDatas = oData.TableIn.results;
							oController.TableModel.setData({ Data: rDatas }); //직접적으로 화면 테이블에 셋팅하는 작업
						}

						BusyIndicator.hide();
					},
					error: function (oResponse) {
						Common.log(oResponse);
						BusyIndicator.hide();
					}
				});
			},
			
			onPressNew: function (oEvent) { //신청버튼으로 화면을 접근했을 때
				
				sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix())
                });
			},
			
			onSelectedRow: function (oEvent) { //CellClick Event
				var oController = $.app.getController();
				var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
				var oRowData = $.extend(true, {}, oController.TableModel.getProperty(vPath));
				
				sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix()),
					data: oRowData
                });
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20130217"});
			} : null
			 
		});
	}
);
