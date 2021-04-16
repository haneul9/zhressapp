sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"./CountryDialogHandler",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	DialogHandler,
	CountryDialogHandler,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ City: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/City/SearchList", []);

		oController.CityDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "CityDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.CityDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		return Promise.all([
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 국가 코드 목록 조회
					"/BtCodeSet",
					{
						ICodeT: "001",
						IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
						ILangu: this.oController.getSessionInfoByKey("Langu"),
						TableIn: []
					},
					{
						success: function(oData) {
							var BtCrtList = Common.getTableInResults(oData, "TableIn");
							if (BtCrtList.length) {
								var korea;
								BtCrtList = $.map(BtCrtList, function(o) {
									if (o.Code === "KR") {
										korea = o;
										return;
									}
									return o;
								});
								if (korea) {
									BtCrtList.unshift(korea);
								}
							}

							this.oModel.setProperty("/City/BtCrtList", BtCrtList);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
						}
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // Favorite City 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "008",
						IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
						ILangu: this.oController.getSessionInfoByKey("Langu"),
						TableIn01: [],
						TableIn02: [],
						TableIn03: [],
						TableIn04: [],
						TableIn05: [],
						TableIn06: [],
						TableIn07: [],
						TableIn08: [], // Favorite City List
						TableIn09: []
					},
					{
						success: function(oData) {
							this.arrangeFavoriteCityList(Common.getTableInResults(oData, "TableIn08"));
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
						}
					}
				);
			}.bind(this))
		]);
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.oModel;
	},

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	onBeforeOpen: function() {

		return Common.getPromise(function() {
			$.map(this.oModel.getProperty("/City/FavoriteList") || [], function(o) {
				$.app.byId("radio-button-group-" + o.Gtext.toLowerCase().replace(/\s/g, "")).setSelectedIndex(-1);
			});
		}.bind(this));
	},

	arrangeFavoriteCityList: function(list) {

		var GtextSet = {}, List = [];
		$.map(list, function(o) {
			if (GtextSet[o.Gtext]) {
				GtextSet[o.Gtext].push(o);
			} else {
				GtextSet[o.Gtext] = [o];
				List.push({
					Gtext: o.Gtext,
					List: GtextSet[o.Gtext]
				});
			}
		});

		this.oModel.setProperty("/City/FavoriteList", List);
	},

	helpCountryValue: function() {

		setTimeout(function() {
			var initData = {
				name: this.oModel.getProperty("/City/BtCrtT"),
				list: this.oModel.getProperty("/City/BtCrtList")
			},
			callback = function(o) {
				this.oModel.setProperty("/City/BtCrt", o.Code || "");
				this.oModel.setProperty("/City/BtCrtT", o.Text || "");
			}.bind(this);

			DialogHandler.open(CountryDialogHandler.get(this.oController, initData, callback));
		}.bind(this), 0);
	},

	search: function() {

		setTimeout(function() {
			$.app.byId("CityTable").setBusy(true, 0);

			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 국가별 도시 코드 목록 조회
				"/BtBaseSet",
				{
					ICodeT: "001",
					ICode: this.oModel.getProperty("/City/BtCrt"),
					IText: this.oModel.getProperty("/City/CityName"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [], // City List
					TableIn02: [],
					TableIn03: [],
					TableIn04: [],
					TableIn05: [],
					TableIn06: [],
					TableIn07: [],
					TableIn08: [],
					TableIn09: []
				},
				{
					success: function(oData) {
						var TableIn01 = Common.getTableInResults(oData, "TableIn01");
						this.oModel.setProperty("/City/SearchList", TableIn01);

						Common.adjustVisibleRowCount($.app.byId("CityTable").setBusy(false), 5, TableIn01.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/City/SearchList", []);

						Common.adjustVisibleRowCount($.app.byId("CityTable").setBusy(false), 1, 1);
					}
				}
			);
		}.bind(this), 0);
	},

	clickTableCell: function(oEvent) {

		this.setCityData(oEvent.getParameter("rowBindingContext").getProperty());
	},

	selectRadioButton: function(oEvent) {

		this.setCityData(oEvent.getSource().getSelectedButton().data("selectedCity"));
	},

	/*
	 * p = {
	 *		ClDmtr,
	 *		ClDmtrT,
	 *		BtCrt,
	 *		BtCrtT,
	 *		BtCity,
	 *		BtCityT,
	 *		BtState
	 *	}
	 */
	setCityData: function(p) {

		return Common.getPromise(function() {
			if (this.callback) {
				this.callback(p);
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});