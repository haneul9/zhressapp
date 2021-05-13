/* eslint-disable no-undef */
sap.ui.define(
	[
		"common/Common"
	], 
	function (Common) {
		"use strict";

		var ODataService = {
			
			CommonCodeListHeaderSet: function () {
				var results = [];

				$.app.getModel("ZHR_COMMON_SRV").create(
					"/CommonCodeListHeaderSet",
					{
						IPernr: this.getSessionInfoByKey("name"),
						IBukrs: this.getSessionInfoByKey("Bukrs"),
						ICodeT: "003",
						ICodty: "9911",
						NavCommonCodeList: []
					},
					{
						success: function (data) {
							if (data.NavCommonCodeList) results = data.NavCommonCodeList.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			WerksBukrsSet: function () {
				var results = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/WerksBukrsSet",
					{
						IOdkey: "",
						IDatum: moment().hours(10).toDate(),
						TableIn: []
					},
					{
						success: function (data) {
							if (data.TableIn) results = data.TableIn.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			FacilityApplySet: function (searchConditions) {
				var results = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/FacilityApplySet",
					{
						IPernr: this.getSessionInfoByKey("name"),
						IEmpid: this.getSessionInfoByKey("name"),
						IBukrs: this.getSessionInfoByKey("Bukrs"),
						IFacty: searchConditions.Facty,
						IBegda: moment(searchConditions.Zyear).startOf('year').hours(10).toDate(),
						IEndda: moment(searchConditions.Zyear).endOf('year').hours(10).toDate(),
						TableIn: []
					},
					{
						success: function (data) {
							if (data.TableIn) results = data.TableIn.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			FacilityApplySetByProcess: function (contype, sendData, success, error) {
				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/FacilityApplySet",
					{
						IConType: contype,
						IPernr: this.getSessionInfoByKey("name"),
						IEmpid: this.getSessionInfoByKey("name"),
						IBukrs: this.getSessionInfoByKey("Bukrs"),
						TableIn: [sendData]
					},
					{
						success: function (data) {
							if (typeof success === "function") success.call(null, contype, data);
						},
						error: function (res) {
							if (typeof error === "function") error.call(null, res);
						}
					}
				);
			},

			FacilityListSet: function (searchConditions) {
				var results = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/FacilityListSet",
					{
						IPernr: this.getSessionInfoByKey("name"),
						IBukrs: this.getSessionInfoByKey("Bukrs"),
						IFacty: searchConditions.Facty,
						TableIn: []
					},
					{
						success: function (data) {
							if (data.TableIn) results = data.TableIn.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			CondoUseRequestSet: function () {
				var results = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoUseRequestSet",
					{
						IOdkey: "",
						IConType: $.app.ConType.READ,
						IPernr: this.getSessionInfoByKey("name"),
						ILangu: "3",
						It: []
					},
					{
						success: function (data) {
							if (data.It) results = data.It.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			CondoUseRequestSetByProcess: function (contype, sendData, success, error) {
				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoUseRequestSet",
					{
						IOdkey: "",
						IConType: contype,
						IPernr: this.getSessionInfoByKey("name"),
						ILangu: "3",
						It: [sendData]
					},
					{
						success: function (data) {
							if (typeof success === "function") success.call(null, contype, data);
						},
						error: function (res) {
							if (typeof error === "function") error.call(null, res);
						}
					}
				);
			},

			CondoUseBookTotSet: function () {
				var results = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoUseBookTotSet",
					{
						IOdkey: "",
						IPernr: this.getSessionInfoByKey("name"),
						It: []
					},
					{
						success: function (data) {
							if (data.It) results = data.It.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			CondoBookingListSet: function (params) {
				var results = {},
					today = new Date(),
					pData = $.extend(true, { Condo: "ALL", Locat: "ALL", Zyear: today.getFullYear(), Zmonth: today.getMonth() }, params),
					vBegdaDT = pData.Begda ? pData.Begda : new Date(parseInt(pData.Zyear, 10), parseInt(pData.Zmonth, 10) - 1, 1),
					vEnddaDT = pData.Endda ? pData.Endda : new Date(parseInt(pData.Zyear, 10), parseInt(pData.Zmonth, 10), 0);

				results.startDate = vBegdaDT;
				results.list = [];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoBookingListSet",
					{
						IOdkey: "",
						ILangu: "3",
						IBukrs: this.getSessionInfoByKey("Bukrs"),
						IPernr: this.getSessionInfoByKey("name"),
						ICondo: pData.Condo === "ALL" ? "" : pData.Condo,
						ILocat: pData.Locat === "ALL" ? "" : pData.Locat,
						IBegda: moment(vBegdaDT).hours(10).toDate(),
						IEndda: moment(vEnddaDT).hours(10).toDate(),
						It: []
					},
					{
						success: function (data) {
							if (data.It) results.list = data.It.results;
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			CondoListSet: function () {
				var results = [{ Condo: "ALL", Contx: this.getBundleText("LABEL_09036") }];

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoListSet",
					{
						IOdkey: "",
						IPernr: this.getSessionInfoByKey("name"),
						ILangu: "3",
						IDatum: moment().hours(10).toDate(),
						It: []
					},
					{
						success: function (data) {
							if (data.It) results = results.concat(data.It.results);
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);

				return results;
			},

			CondoLocatListSet: function (vCondo) {
				var results = [{ Locat: "ALL", Loctx: this.getBundleText("LABEL_09036") }];

				if (!vCondo || vCondo === "ALL") return results;

				$.app.getModel("ZHR_BENEFIT_SRV").create(
					"/CondoLocatListSet",
					{
						IOdkey: "",
						ILangu: "3",
						ICondo: vCondo,
						It: []
					},
					{
						success: function (data) {
							if (data.It) results = results.concat(data.It.results);
						},
						error: function (res) {
							Common.log(res);
						}
					}
				);
			},

			YearRangeList: function () {
				var results = [],
					startYear = new Date().getFullYear() + 1;

				Common.makeNumbersArray({ length: 12 }).forEach(
					function (idx) {
						results.push({ Code: String(startYear - idx), Text: this.getBundleText("LABEL_09070").interpolate(startYear - idx) });
					}.bind(this)
				);

				return results;
			},

			MonthRangeList: function () {
				var results = [];

				Common.makeNumbersArray({ length: 12, isZeroStart: false }).forEach(
					function (idx) {
						results.push({ Code: String(idx), Text: this.getBundleText("LABEL_09071").interpolate(idx) });
					}.bind(this)
				);

				return results;
			}
		};

		return ODataService;
	}
);
