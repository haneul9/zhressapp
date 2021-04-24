sap.ui.define(
	[
		"common/Common",
		"common/CommonController",
		"common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "Detail",

			oModel: new JSONModelHelper(),

			onInit: function () {
				this.setupView()
					.getView().addEventDelegate({
						onBeforeShow: this.onBeforeShow
					}, this);
			},

			onBeforeShow: function (oEvent) {
				if (oEvent) {
					this.oModel.setProperty("/Appye", oEvent.data.Appye);

					this.load();
				}
			},

			navBack: function() {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						sap.ui.getCore().getEventBus().publish("nav", "to", {
							id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
						});
					}
				).then(function () {
					BusyIndicator.hide();
				});
			},

			load: function() {
				BusyIndicator.show(0);

				Common.getPromise(
					function () {
						$.app.getModel("ZHR_APPRAISAL_SRV").create(
							"/EvaResultAgreeSet",
							{
								IConType: "3",
								IAppye: this.oModel.getProperty("/Appye"),
								IEmpid: this.getSessionInfoByKey("Pernr"),
								TableIn2: []
							},
							{
								success: function (data) {
									if (data.TableIn2) {
										this.oModel.setProperty("/TableIn2", data.TableIn2.results);
									}
								}.bind(this),
								error: function (res) {
									Common.log(res);
								}
							}
						);
					}.bind(this)
				).then(function () {
					BusyIndicator.hide();
				});
			},

			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "35110041"});
			} : null

		});
	}
);