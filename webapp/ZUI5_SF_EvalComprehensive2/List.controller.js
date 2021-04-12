sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(Common, CommonController, MessageBox, BusyIndicator, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 종합평가 : 평가연도별 목록

	_ComprehensiveModel: new JSONModel(),

	getUserId: function() {

		return this.getView().getModel("session").getData().name;
	},

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);

		Common.log("onInit session", this.getView().getModel("session").getData());
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		var minYear = 2020, currentYear = new Date().getFullYear(),
		suffix = this.getBundleText("LABEL_00143"), // 년
		comboBoxItems = $.map(new Array(currentYear - minYear + 1), function(v, i) {
			var value = String(minYear + i);
			return {value: value, text: value + suffix};
		});

		this._ComprehensiveModel.setData({
			IAppye: String(currentYear),
			Data: [],
			EvalYears: comboBoxItems
		});

		Common.adjustVisibleRowCount($.app.byId("ListTable").setBusy(false), 1, 1);
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		setTimeout(this.onPressSearch.bind(this), 0);
	},
	
	// 평가위원회 목록 조회
	onPressSearch: function(oEvent) {
		Common.log("onPressSearch");

		BusyIndicator.show(0);

		var selectedYear = this._ComprehensiveModel.getProperty("/IAppye");
		if (!selectedYear) {
			BusyIndicator.hide();
			if (oEvent) {
				MessageBox.warning(this.getBundleText("MSG_11006"), { // 평가연도를 선택하세요.
					onClose: function() {
						$.app.byId("YearComboBox").focus();
					}
				});
			}
			return;
		}

		// List data clear
		this._ComprehensiveModel.setProperty("/Data", []);

		var oController = this,
			oModel = $.app.getModel("ZHR_APPRAISAL_SRV"),
			oPayload = {};

		// Set header
		oPayload.IOdkey = "";
		oPayload.IAppye = selectedYear;
		oPayload.IEmpid = this.getUserId();

		// Set navigation
		oPayload.TableIn = [];

		oModel.create("/CollEvaListSet", oPayload, {
			success: function(data) {
				if (data.TableIn) {
					var list = $.map(data.TableIn.results, function(o, i) {
						// 2020-11-24 상태 20이하, 평가세션 리스트에서 제외
						// if (Number(o.Evstaus || 0) < 20 && /"\[평가세션\]"/.test(o.Evcomtx)) {
						// 	return;
						// }

						o.No = i + 1;
						o.Empcnt = parseFloat(o.Empcnt);
						o.Bgtpnt = parseFloat(o.Bgtpnt);
						o.Evapnt = parseFloat(o.Evapnt);
						return o;
					});

					oController._ComprehensiveModel.setProperty("/Data", list);

					// Common.adjustVisibleRowCount($.app.byId("ListTable"), 10, list.length);
					BusyIndicator.hide();
				}
			},
			error: function(res) {
				BusyIndicator.hide();

				var errData = Common.parseError(res);
				if (errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: oController.getBundleText("LABEL_00150") // 안내
					});
					return;
				}
			}
		});
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		// return new JSONModel({name: "20090028"});
		// return new JSONModel({name: "981011"});
		// return new JSONModel({name: "926020"});
		return new JSONModel({name: "9001023"});
	} : null

});

});