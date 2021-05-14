/* global moment */
sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"common/moment-round",
	"./AirportDialogHandler",
	"./CurrencyDialogHandler",
	"./LccMapDialogHandler",
	"./TripPlaceDialogHandler",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	DialogHandler,
	momentRoundjs,
	AirportDialogHandler,
	CurrencyDialogHandler,
	LccMapDialogHandler,
	TripPlaceDialogHandler,
	MessageBox,
	JSONModel
) {
"use strict";

return {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({
		SettlementTableIn04: null,
		ExpenseDetail: null,
		CorpCardSelectList: null,
		CategorySelectList: null,
		SubcategorySelectList: null,
		SubcategoryMap: null,
		GasTypeSelectList: null,
		GasTypeMap: null,
		ExpenseAndTaxTable: null,
		TaxSelectList: null,
		TaxSelectList11: null, // 국내현금
		TaxSelectList15: null, // 국내카드
		TaxSelectList21: null, // 해외현금
		TaxSelectList25: null, // 해외카드
		TaxMap11: null, // 국내현금
		TaxMap15: null, // 국내카드
		TaxMap21: null, // 해외현금
		TaxMap25: null, // 해외카드
		Form04: null // 비행일정
	}),
	dialogTitle: null,
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, initData, callback) {

		this.oController = oController;
		this.dialogTitle = initData.dialogTitle;
		this.initData = $.extend(true, {}, initData); // 외부에 연결된 model에 영향을 주지 않기 위해 값을 복사
		this.callback = callback;

		Common.removeProperties(this.initData, "__metadata", "dialogTitle");
		this.initData.Edtfg = this.getParentModelProperty("/Header/Edtfg");

		oController.ExpenseDetailDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "ExpenseDetailDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.ExpenseDetailDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		// GIS callback function
		window.flexCallback = this.setTripDistance.bind(this);

		this.oModel.setProperty("/VisibleFactor", {
			Category: "",
			Subcategory: ""
		});
		this.oModel.setProperty("/SubcategoryMap", {
			"1,01": { forms: ["01"],       tax: true,  contentHeight: 340, label: "숙박비" },
			"2,01": { forms: ["02"],       tax: true,  contentHeight: 340, label: "택시" },
			"2,02": { forms: ["02"],       tax: true,  contentHeight: 340, label: "지하철" },
			"2,03": { forms: ["02"],       tax: true,  contentHeight: 340, label: "버스" },
			"2,04": { forms: ["02"],       tax: true,  contentHeight: 340, label: "기차" },
			"2,05": { forms: ["02"],       tax: true,  contentHeight: 340, label: "택시" },
			"2,06": { forms: ["02"],       tax: true,  contentHeight: 340, label: "지하철" },
			"2,07": { forms: ["02"],       tax: true,  contentHeight: 340, label: "버스" },
			"2,08": { forms: ["02"],       tax: true,  contentHeight: 340, label: "기차" },
			"2,09": { forms: ["02", "03"], tax: false, contentHeight: 360, label: "승용차" },
			"2,11": { forms: ["02"],       tax: true,  contentHeight: 340, label: "기차" },
			"2,12": { forms: ["02"],       tax: true,  contentHeight: 340, label: "기차" },
			"3,01": { forms: [],           tax: true,  contentHeight: 300, label: "식사/음료" },
			"4,01": { forms: [],           tax: true,  contentHeight: 300, label: "팁" },
			"4,02": { forms: [],           tax: true,  contentHeight: 300, label: "세탁비" },
			"4,03": { forms: [],           tax: true,  contentHeight: 300, label: "차량 렌트비" },
			"4,04": { forms: [],           tax: true,  contentHeight: 300, label: "통신비(로밍비)" },
			"4,05": { forms: [],           tax: true,  contentHeight: 300, label: "통행료,주차료" },
			"4,06": { forms: [],           tax: true,  contentHeight: 300, label: "기타비용" },
			"4,07": { forms: [],           tax: true,  contentHeight: 300, label: "초과 수하물비용" },
			"4,08": { forms: [],           tax: true,  contentHeight: 300, label: "Foreign Transaction Fee" },
			"4,09": { forms: [],           tax: true,  contentHeight: 300, label: "Others" },
			"5,01": { forms: ["04"],       tax: true,  contentHeight: 460, label: "항공료" },
			"6,01": { forms: [],           tax: true,  contentHeight: 300, label: "Food(Social Exp-entertain)" }
		});

		var HourSelectList = [{ value: "", text: "HH" }], MinuteSelectList = [{ value: "", text: "mm" }]; // 이동시간 Select
		$.each(new Array(24), function(hour) {
			hour = Common.lpad(hour, 2);
			HourSelectList.push({ value: hour, text: hour });
		});
		$.each(new Array(6), function(minute) {
			minute = Common.lpad(minute * 10, 2);
			MinuteSelectList.push({ value: minute, text: minute });
		});
		this.oModel.setProperty("/HourSelectList", HourSelectList);
		this.oModel.setProperty("/MinuteSelectList", MinuteSelectList);

		var Bukrs = this.oController.getSessionInfoByKey("Bukrs"),
		Langu = this.oController.getSessionInfoByKey("Langu");

		return Promise.all([
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 비용구분 코드 목록 조회
					"/BtCodeSet",
					{
						ICodeT: "005",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn: []
					},
					{
						success: function(oData) {
							var CategorySelectList = Common.getTableInResults(oData, "TableIn");
							if (CategorySelectList.length) {
								CategorySelectList = $.map(CategorySelectList, function(o) {
									return o.Code !== "0" ? o : null;
								});
							}
							this.oModel.setProperty("/CategorySelectList", CategorySelectList);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);

							this.oModel.setProperty("/CategorySelectList", []);
						}.bind(this)
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 국내현금 세금 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "006",
						ICode: "1",
						ISubCode: "1",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn01: [],
						TableIn02: [],
						TableIn03: [],
						TableIn04: [],
						TableIn05: [],
						TableIn06: [], // 세금 코드 목록
						TableIn07: [],
						TableIn08: [],
						TableIn09: []
					},
					{
						success: function(oData) {
							var TaxSelectList11 = Common.getTableInResults(oData, "TableIn06"), TaxMap11 = {};
							if (TaxSelectList11.length) {
								$.map(TaxSelectList11, function(o) {
									TaxMap11[o.Mwskz] = Common.toNumber(o.Taxrt);
								});

								// TaxSelectList11.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}

							this.oModel.setProperty("/TaxSelectList11", TaxSelectList11);
							this.oModel.setProperty("/TaxMap11", TaxMap11);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);

							this.oModel.setProperty("/TaxSelectList11", []);
							this.oModel.setProperty("/TaxMap11", {});
						}.bind(this)
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 국내카드 세금 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "006",
						ICode: "5",
						ISubCode: "1",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn01: [],
						TableIn02: [],
						TableIn03: [],
						TableIn04: [],
						TableIn05: [],
						TableIn06: [], // 세금 코드 목록
						TableIn07: [],
						TableIn08: [],
						TableIn09: []
					},
					{
						success: function(oData) {
							var TaxSelectList15 = Common.getTableInResults(oData, "TableIn06"), TaxMap15 = {};
							if (TaxSelectList15.length) {
								$.map(TaxSelectList15, function(o) {
									TaxMap15[o.Mwskz] = Common.toNumber(o.Taxrt);
								});

								// TaxSelectList15.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}

							this.oModel.setProperty("/TaxSelectList15", TaxSelectList15);
							this.oModel.setProperty("/TaxMap15", TaxMap15);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);

							this.oModel.setProperty("/TaxSelectList15", []);
							this.oModel.setProperty("/TaxMap15", {});
						}.bind(this)
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 해외현금 세금 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "006",
						ICode: "1",
						ISubCode: "2",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn01: [],
						TableIn02: [],
						TableIn03: [],
						TableIn04: [],
						TableIn05: [],
						TableIn06: [], // 세금 코드 목록
						TableIn07: [],
						TableIn08: [],
						TableIn09: []
					},
					{
						success: function(oData) {
							var TaxSelectList21 = Common.getTableInResults(oData, "TableIn06"), TaxMap21 = {};
							if (TaxSelectList21.length) {
								$.map(TaxSelectList21, function(o) {
									TaxMap21[o.Mwskz] = Common.toNumber(o.Taxrt);
								});

								// TaxSelectList21.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}

							this.oModel.setProperty("/TaxSelectList21", TaxSelectList21);
							this.oModel.setProperty("/TaxMap21", TaxMap21);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);

							this.oModel.setProperty("/TaxSelectList21", []);
							this.oModel.setProperty("/TaxMap21", {});
						}.bind(this)
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 해외카드 세금 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "006",
						ICode: "5",
						ISubCode: "2",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn01: [],
						TableIn02: [],
						TableIn03: [],
						TableIn04: [],
						TableIn05: [],
						TableIn06: [], // 세금 코드 목록
						TableIn07: [],
						TableIn08: [],
						TableIn09: []
					},
					{
						success: function(oData) {
							var TaxSelectList25 = Common.getTableInResults(oData, "TableIn06"), TaxMap25 = {};
							if (TaxSelectList25.length) {
								$.map(TaxSelectList25, function(o) {
									TaxMap25[o.Mwskz] = Common.toNumber(o.Taxrt);
								});

								// TaxSelectList25.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}

							this.oModel.setProperty("/TaxSelectList25", TaxSelectList25);
							this.oModel.setProperty("/TaxMap25", TaxMap25);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);

							this.oModel.setProperty("/TaxSelectList25", []);
							this.oModel.setProperty("/TaxMap25", {});
						}.bind(this)
					}
				);
			}.bind(this))
			// Common.encryptByJava({
			// 	input: this.getParentModelProperty("/Header/Pernr"),
			// 	success: function(GisUser) {

			// 		var protocol = document.location.protocol,
			// 		p = {
			// 			protocol: protocol,
			// 			domain: "gis",
			// 			port: protocol === "https:" ? "7002" : "7001"
			// 		},
			// 		GisParams = $.param({ callScrCls: "c3", hi: "N", checkone: "1", isCallBack: "Y", user_id: GisUser }),
			// 			GisUrl = "${protocol}//${domain}.lottechem.com:${port}/sdsgis/proxy_caller.jsp?uri=${protocol}//${domain}SBL0zHYazX9BnhspgEE4TQ==SBL0zHYazX9BnhspgEE4TQ==.lottechem.com:${port}/sdsgis/EP_gisMap.jsp?" + GisParams;

			// 		this.oModel.setProperty("/GisUser", GisUser);
			// 		this.oModel.setProperty("/GisUrl", GisUrl.replace(/\$\{protocol\}/g, p.protocol).replace(/\$\{domain\}/g, p.domain).replace(/\$\{port\}/g, p.port));
			// 	}.bind(this)
			// })
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

	getParentModel: function() {

		return this.oController.SettlementDetailDialogHandler.getModel();
	},

	getParentModelProperty: function(path) {

		return this.getParentModel().getProperty(path);
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

	// DialogHandler 호출 function
	onBeforeOpen: function() {
		Common.log("Business trip expense detail dialog handler.onBeforeOpen"); // 출장 비용 정산 상세 조회

		return Common.getPromise(true, function(resolve) {
			this.oDialog.setTitle(this.oController.getBundleText("LABEL_19522", this.dialogTitle || "")); // 비용정산항목 ({0})

			var ExpenseDetail = $.extend(true, {}, this.initData); // 최초 입력된 data 보존을 위해 값을 복사
			if (!ExpenseDetail.Category) {
				ExpenseDetail.Category = this.oModel.getProperty("/CategorySelectList/0/Code") || "";
			}
			if (!ExpenseDetail.CardPy) {
				throw new Error("CardPy 값이 없습니다.");
			}

			$.app.byId("ExpenseDetailAppDate").setMaxDate(null);
			$.app.byId("LodgePeriod").setMinDate(null).setMaxDate(null);

			this.oModel.setProperty("/ExpenseDetail", ExpenseDetail);
			this.oModel.setProperty("/ExpenseAndTaxTable", [ExpenseDetail]);
			this.initForm04(ExpenseDetail);

			var Dtfmt = this.oController.getSessionInfoByKey("Dtfmt").toUpperCase(),
			SettlementTableIn05 = this.getParentModelProperty("/SettlementTableIn05") || [],
			SettlementTableIn04 = $.map(this.getParentModelProperty("/SettlementTableIn04") || [], function(o) {
				if (o.BtCity && o.BtStartdat && o.BtEnddat) {
					var oBtStartdat = moment(o.BtStartdat || ""), oBtEnddat = moment(o.BtEnddat || ""),
					isValidPeriod = (oBtStartdat.isValid() && oBtEnddat.isValid());

					o.BtCityKey = isValidPeriod ? [o.BtCity, oBtStartdat.format(Dtfmt), oBtEnddat.format(Dtfmt)].join("") : "";
					o.BtCityKeyText = isValidPeriod ? [o.BtCityT, " (", oBtStartdat.format(Dtfmt), " ~ ", oBtEnddat.format(Dtfmt), ")"].join("") : "";

					return o;
				}
			}),
			schedule = SettlementTableIn04[0] || {};

			this.oModel.setProperty("/SettlementTableIn04", SettlementTableIn04); // 출장일정
			this.oModel.setProperty("/SettlementTableIn05", SettlementTableIn05); // 비용정산항목 : validation용으로 저장

			if (!ExpenseDetail.BtCity) {
				this.oModel.setProperty("/ExpenseDetail/BtCity", schedule.BtCity);
				this.oModel.setProperty("/ExpenseDetail/BtCityKey", schedule.BtCityKey);
			}
			if (!ExpenseDetail.BtCityKey) {
				var oBtStartdat = moment(ExpenseDetail.BtStartdat || ""), oBtEnddat = moment(ExpenseDetail.BtEnddat || ""),
				isValidPeriod = (oBtStartdat.isValid() && oBtEnddat.isValid());

				this.oModel.setProperty("/ExpenseDetail/BtCityKey", isValidPeriod ? [ExpenseDetail.BtCity, oBtStartdat.format(Dtfmt), oBtEnddat.format(Dtfmt)].join("") : "");
			}
			if (!ExpenseDetail.ClDmtr) {
				this.oModel.setProperty("/ExpenseDetail/ClDmtr", schedule.ClDmtr);
			}

			var TaxSelectList = this.oModel.getProperty("/TaxSelectList" + ExpenseDetail.ClDmtr + ExpenseDetail.CardPy);
			this.oModel.setProperty("/TaxSelectList", TaxSelectList);
			if (!ExpenseDetail.Mwskz) {
				this.oModel.setProperty("/ExpenseDetail/Mwskz", (TaxSelectList[0] || {}).Mwskz); // 세금코드
			}

			this.changeCategory.call(this);

			resolve();
		}.bind(this));
	},

	// 출장일정 변경
	changeBtCity: function(oEvent) {

		var selectedItem = oEvent ? oEvent.getParameter("selectedItem") : $.app.byId("ExpenseDetailBtCity").getSelectedItem(),
		p = selectedItem.getBindingContext().getProperty();

		setTimeout(function() {
			var startOfBtStartdat = moment(p.BtStartdat).startOf("date").toDate(),
			startOfBtEnddat = moment(p.BtEnddat).startOf("date").toDate(),
			endOfBtEnddat = moment(p.BtEnddat).endOf("date").toDate();

			$.app.byId("ExpenseDetailAppDate").setMaxDate(endOfBtEnddat); // 결제일의 경우 비용을 선결제하는 경우가 있으므로 minDate은 풀어줌
			$.app.byId("LodgePeriod").setMinDate(startOfBtStartdat).setMaxDate(endOfBtEnddat);
			this.oModel.setProperty("/ExpenseDetail/BtCity", p.BtCity);
			this.oModel.setProperty("/ExpenseDetail/BtCityT", p.BtCityT);
			this.oModel.setProperty("/ExpenseDetail/BtStartdat", startOfBtStartdat);
			this.oModel.setProperty("/ExpenseDetail/BtEnddat", startOfBtEnddat);
			this.oModel.setProperty("/ExpenseDetail/Relindex", p.Relindex);

			if (this.isAddMode()) {
				this.oModel.setProperty("/ExpenseDetail/BtCrt", p.BtCrt);
				this.oModel.setProperty("/ExpenseDetail/ClDmtr", p.ClDmtr);
				this.oModel.setProperty("/ExpenseDetail/LodgeStartdat", startOfBtStartdat);
				this.oModel.setProperty("/ExpenseDetail/LodgeEnddat", startOfBtEnddat);
				this.oModel.setProperty("/ExpenseDetail/Zzsucbacbil", p.ExptLodgeTr);
				this.oModel.setProperty("/ExpenseDetail/ZzsucbacWaers", p.ZtcWaers);

				// 법인카드
				if (this.isCardExpense()) {
					this.calculateTax();
				}
				// 현금/기타
				else {
					this.oModel.setProperty("/ExpenseDetail/AppDate", startOfBtStartdat); // 거래일자를 출장시작일로 Setting
					this.oModel.setProperty("/ExpenseDetail/ZscWaers", p.ZtcWaers);
					this.oModel.setProperty("/ExpenseDetail/ZtcWaers", p.ZtcWaers);
					this.oModel.setProperty("/ExpenseDetail/BtExpenseTr", "");
					this.oModel.setProperty("/ExpenseDetail/BtTaxbaseTr", "");
					this.oModel.setProperty("/ExpenseDetail/BtTaxTr", "");
				}
			}
		}.bind(this), 0);
	},

	// 비용구분 변경
	changeCategory: function(oEvent) {

		var userEvent = !!oEvent,
		selectedItem = userEvent ? oEvent.getParameter("selectedItem") : $.app.byId("ExpenseDetailCategory").getSelectedItem();

		setTimeout(function() {
			if (!selectedItem) {
				this.oModel.setProperty("/ExpenseDetail/CategoryT", "");
				return;
			}

			var Category = selectedItem.getKey();
			if (!Category) {
				this.oModel.setProperty("/ExpenseDetail/CategoryT", "");
				this.oModel.setProperty("/SubcategorySelectList", [{ Text: this.oController.getBundleText("MSG_19025") }]); // - 비용구분을 선택하세요 -
				this.changeSubcategory.call(this);
				return;
			} else {
				this.oModel.setProperty("/ExpenseDetail/CategoryT", selectedItem.getText());
			}

			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // Subcategory 코드 목록 조회
				"/BtCodeSet",
				{
					ICodeT: "006",
					ISubCode: Category,
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn: []
				},
				{
					success: function(oData) {
						var SubcategorySelectList = Common.getTableInResults(oData, "TableIn");
						if (!SubcategorySelectList.length) {
							SubcategorySelectList = [{ Text: this.oController.getBundleText("MSG_19025") }]; // - 비용구분을 선택하세요 -
						}
						this.oModel.setProperty("/SubcategorySelectList", SubcategorySelectList);

						if (userEvent || !this.oModel.getProperty("/ExpenseDetail/Subcategory")) {
							this.oModel.setProperty("/ExpenseDetail/Subcategory", this.oModel.getProperty("/SubcategorySelectList/0/Code") || "");
						}
						this.changeSubcategory();
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/SubcategorySelectList", []);
						this.oModel.setProperty("/ExpenseDetail/Subcategory", "");
						this.changeSubcategory();
					}.bind(this)
				}
			);
		}.bind(this), 0);
	},

	// 하위구분 변경
	changeSubcategory: function(oEvent) {

		var selectedItem = oEvent ? oEvent.getParameter("selectedItem") : $.app.byId("ExpenseDetailSubcategory").getSelectedItem();

		setTimeout(function() {
			if (!selectedItem) {
				this.oModel.setProperty("/ExpenseDetail/SubcategoryT", "");
				return;
			} else {
				this.oModel.setProperty("/ExpenseDetail/SubcategoryT", selectedItem.getText());
			}

			this.initForms();

			var Category = this.oModel.getProperty("/ExpenseDetail/Category"),
			Subcategory = selectedItem.getKey(),
			SubcategoryT = selectedItem.getText();

			// 추가 모드 : 추가 버튼 클릭으로 들어온 경우
			if (this.isAddMode()) {
				if (this.oModel.getProperty("/SubcategoryMap/${Category},${Subcategory}/tax".interpolate(Category, Subcategory))) {
					this.oModel.setProperty("/ExpenseDetail/Mwskz", ((this.oModel.getProperty("/TaxSelectList") || [])[0] || {}).Mwskz);
					this.oModel.setProperty("/ExpenseDetail/Sgtxt", SubcategoryT);
					this.oModel.setProperty("/ExpenseDetail/PayAmtTr", "0");
				}
				if (this.isCardExpense()) {
					var data = $.extend({}, this.oModel.getProperty("/ExpenseDetail"), this.initData);
					data.Sgtxt = SubcategoryT + " - " + this.initData.StoreName;
					this.oModel.setProperty("/ExpenseDetail", data); // Header
					this.oModel.setProperty("/ExpenseAndTaxTable", [data]); // 결제금액 및 세금 Table
					this.initForm04(data); // 항공료
				}
			}
			// 수정 모드 : 목록을 클릭하여 들어온 경우
			else {
				var data = $.extend(true, this.oModel.getProperty("/ExpenseDetail"), this.initData); // 최초 입력된 data 보존을 위해 값을 복사
				this.oModel.setProperty("/ExpenseDetail", data); // Header
				this.oModel.setProperty("/ExpenseAndTaxTable", [data]); // 결제금액 및 세금 Table
				this.initForm04(data); // 항공료
			}

			if (Category === "2") {
				var StartTm = this.oModel.getProperty("/ExpenseDetail/StartTm");
				if ($.isPlainObject(StartTm) && typeof StartTm.ms === "number") {
					var mStartTm = moment(StartTm.ms).subtract(9, "hours");
					this.oModel.setProperty("/ExpenseDetail/StartTm", mStartTm.format("HH:mm"));
					this.oModel.setProperty("/ExpenseDetail/StartTmHour", mStartTm.format("HH"));
					this.oModel.setProperty("/ExpenseDetail/StartTmMinute", mStartTm.format("mm"));
				} else if (/^\d\d:\d\d$/.test(StartTm)) {
					var mStartTm = moment(StartTm, "HH:mm").subtract(9, "hours");
					this.oModel.setProperty("/ExpenseDetail/StartTmHour", mStartTm.format("HH"));
					this.oModel.setProperty("/ExpenseDetail/StartTmMinute", mStartTm.format("mm"));
				}
				var DestTm = this.oModel.getProperty("/ExpenseDetail/DestTm");
				if ($.isPlainObject(DestTm) && typeof DestTm.ms === "number") {
					var mDestTm = moment(DestTm.ms).subtract(9, "hours");
					this.oModel.setProperty("/ExpenseDetail/DestTm", mDestTm.format("HH:mm"));
					this.oModel.setProperty("/ExpenseDetail/DestTmHour", mDestTm.format("HH"));
					this.oModel.setProperty("/ExpenseDetail/DestTmMinute", mDestTm.format("mm"));
				} else if (/^\d\d:\d\d$/.test(DestTm)) {
					var mDestTm = moment(DestTm, "HH:mm").subtract(9, "hours");
					this.oModel.setProperty("/ExpenseDetail/DestTmHour", mDestTm.format("HH"));
					this.oModel.setProperty("/ExpenseDetail/DestTmMinute", mDestTm.format("mm"));
				}

				if (Subcategory === "09") {
					this.retrieveFuelList();
				}
			} else {
				this.oModel.setProperty("/GasTypeSelectList", []);
			}

			this.changeDialogHeight();
			this.changeBtCity();
		}.bind(this), 0);
	},

	// 입력 form 초기화
	initForms: function() {

		this.clearForm01();
		this.clearForm02();
		this.clearForm03();
		this.clearForm04();
		this.clearExpenseAndTaxTable();
	},

	// 숙박비 form 초기화
	clearForm01: function() {

		this.oModel.setProperty("/ExpenseDetail/LodgeStartdat", null);
		this.oModel.setProperty("/ExpenseDetail/LodgeEnddat", null);
		this.oModel.setProperty("/ExpenseDetail/Zzsucbacbil", "");
		this.oModel.setProperty("/ExpenseDetail/ZlcWaers", "");
	},

	// 교통비 form 초기화
	clearForm02: function() {

		this.oModel.setProperty("/ExpenseDetail/Startpl", "");
		this.oModel.setProperty("/ExpenseDetail/Destpl", "");
		this.oModel.setProperty("/ExpenseDetail/StartTm", null);
		this.oModel.setProperty("/ExpenseDetail/StartTmHour", "");
		this.oModel.setProperty("/ExpenseDetail/StartTmMinute", "");
		this.oModel.setProperty("/ExpenseDetail/DestTm", null);
		this.oModel.setProperty("/ExpenseDetail/DestTmHour", "");
		this.oModel.setProperty("/ExpenseDetail/DestTmMinute", "");
	},

	// 교통비 - 승용차 form 초기화
	clearForm03: function() {

		this.oModel.setProperty("/ExpenseDetail/Zzkm", "");
		this.oModel.setProperty("/ExpenseDetail/Zzgasname", "");
		this.oModel.setProperty("/ExpenseDetail/GasTr", "");
		this.oModel.setProperty("/ExpenseDetail/TollTr", "");
		this.oModel.setProperty("/ExpenseDetail/ParkingTr", "");
	},

	// 항공료 form 초기화
	clearForm04: function() {

		this.oModel.setProperty("/Form04/0/FlightDate", null);
		this.oModel.setProperty("/Form04/0/Airport", "");
		this.oModel.setProperty("/Form04/0/AirportT", "");
		this.oModel.setProperty("/Form04/0/Country", "");
		this.oModel.setProperty("/Form04/0/CountryT", "");
		this.oModel.setProperty("/Form04/0/City", "");
		this.oModel.setProperty("/Form04/0/CityT", "");

		this.oModel.setProperty("/Form04/1/FlightDate", null);
		this.oModel.setProperty("/Form04/1/Airport", "");
		this.oModel.setProperty("/Form04/1/AirportT", "");
		this.oModel.setProperty("/Form04/1/Country", "");
		this.oModel.setProperty("/Form04/1/CountryT", "");
		this.oModel.setProperty("/Form04/1/City", "");
		this.oModel.setProperty("/Form04/1/CityT", "");
	},

	// 결제금액 및 세금 form 초기화
	clearExpenseAndTaxTable: function() {

		this.oModel.setProperty("/ExpenseDetail/ZtcWaers", "");
		this.oModel.setProperty("/ExpenseDetail/ZscWaers", "");
		this.oModel.setProperty("/ExpenseDetail/BtExpenseTr", "");
		this.oModel.setProperty("/ExpenseDetail/Mwskz", "");
		this.oModel.setProperty("/ExpenseDetail/BtTaxTr", "");
		this.oModel.setProperty("/ExpenseDetail/BtTaxbaseTr", "");
		this.oModel.setProperty("/ExpenseDetail/Sgtxt", "");
		this.oModel.setProperty("/ExpenseDetail/IndExpdTr", "");
	},

	initForm04: function(o) {

		this.oModel.setProperty("/Form04", [{
			Target: {
				Airport:  "DepartAirport",
				AirportT: "DepartAirportT",
				Country:  "FlDepartCrt",
				CountryT: "FlDepartCrtT",
				City:     "FlDepartCity",
				CityT:    "FlDepartCityT"
			},
			DepartDest: this.oController.getBundleText("LABEL_19642"), // 출발
			FlightDate: o.FlStartDate,
			Airport:    o.DepartAirport,
			AirportT:   o.DepartAirportT,
			Country:    o.FlDepartCrt,
			CountryT:   o.FlDepartCrtT,
			City:       o.FlDepartCity,
			CityT:      o.FlDepartCityT
		}, {
			Target: {
				Airport:  "DestAirport",
				AirportT: "DestAirportT",
				Country:  "FlDestCrt",
				CountryT: "FlDestCrtT",
				City:     "FlDestCity",
				CityT:    "FlDestCityT"
			},
			DepartDest: this.oController.getBundleText("LABEL_19643"), // 도착
			FlightDate: o.FlEndDate,
			Airport:    o.DestAirport,
			AirportT:   o.DestAirportT,
			Country:    o.FlDestCrt,
			CountryT:   o.FlDestCrtT,
			City:       o.FlDestCity,
			CityT:      o.FlDestCityT
		}]);
	},

	// Dialog 높이 변경
	changeDialogHeight: function() {

		var Category = $.app.byId("ExpenseDetailCategory").getSelectedKey(),
		Subcategory = $.app.byId("ExpenseDetailSubcategory").getSelectedKey(),
		contentHeight;

		if (!Category || !Subcategory) {
			contentHeight = 250;
		} else {
			contentHeight = this.oModel.getProperty("/SubcategoryMap/${Category},${Subcategory}/contentHeight".interpolate(Category, Subcategory));
		}
		if (this.isCardExpense()) {
			contentHeight += 50;
		}

		this.oDialog.setContentHeight(contentHeight + "px");
		setTimeout(function() {
			this.oModel.setProperty("/VisibleFactor/Category", Category);
			this.oModel.setProperty("/VisibleFactor/Subcategory", Subcategory);
		}.bind(this), 0);
	},

	// 결제일 change event handler
	changeAppDate: function() {

		var Category = this.oModel.getProperty("/ExpenseDetail/Category"),
		Subcategory = this.oModel.getProperty("/ExpenseDetail/Subcategory");
		if (Category === "2" && Subcategory === "09") { // 교통비 - 승용차 : 연료종류 목록 재조회
			this.retrieveFuelList.call(this);
		}
		this.changeTripTime.call(this);
	},

	// 출장지 선택 dialog
	selectTripPlace: function(oEvent) {

		var sPath = oEvent.getParameter("id").replace(/(ExpenseDetail)/, "/$1/");

		setTimeout(function() {
			var callback = function(PlaceName) {
				this.oModel.setProperty(sPath, PlaceName);

				var Startpl = this.oModel.getProperty("/ExpenseDetail/Startpl"),
				Destpl = this.oModel.getProperty("/ExpenseDetail/Destpl");
				this.oModel.setProperty("/ExpenseDetail/Zzkm", TripPlaceDialogHandler.getDistanceBetween(Startpl, Destpl));

				this.changeTripPlace();
			}.bind(this);

			DialogHandler.open(TripPlaceDialogHandler.get(this.oController, this.oModel.getProperty(sPath), callback));
		}.bind(this), 0);
	},

	// 출장지 선택 지도 dialog
	searchTripPlace: function(oEvent) {

		setTimeout(function() {
			var params = {
				id: "LccMap",
				cartype: "",
				fueltype: this.oModel.getProperty("/ExpenseDetail/Zzgasname"),
				lang: (this.oController.getSessionInfoByKey("Langu") || "ko").toLowerCase()
			},
			callback = function(o) {
				this.oModel.setProperty("/ExpenseDetail/Startpl", o.departure);
				this.oModel.setProperty("/ExpenseDetail/Destpl", o.destination);
				this.oModel.setProperty("/ExpenseDetail/Zzkm", o.distance);
				this.oModel.setProperty("/ExpenseDetail/TollTr", o.tollFare);
				this.oModel.setProperty("/ExpenseDetail/GasTr", o.fuelPrice);

				this.changeTripPlace();
			}.bind(this);

			DialogHandler.open(LccMapDialogHandler.get(this.oController, params, callback));
		}.bind(this), 0);
	},

	// 출장지 변경
	changeTripPlace: function() {

		var Category = this.oModel.getProperty("/ExpenseDetail/Category"),
		Subcategory = this.oModel.getProperty("/ExpenseDetail/Subcategory");
		if (Category !== "2" || Subcategory !== "09") { // 교통비 - 승용차
			return;
		}

		this.calculateCarExpenses();
	},

	changeTripTime: function(oEvent) {

		var sPath = oEvent ? oEvent.getParameter("id").replace(/(ExpenseDetail)/, "/$1/") : null; // setTimeout 때문에 oEvent 객체가 빨리 소멸되므로 미리 변수로 받음

		setTimeout(function() {
			var veryFirstDate = {year: 1970, month: 0, date: 1},
			StartTm = this.getTripTimeValues("StartTm"),
			DestTm = this.getTripTimeValues("DestTm"),
			inputStartTm = StartTm.moment,
			inputDestTm = DestTm.moment;

			if (!inputStartTm.isValid() || !inputDestTm.isValid()) {
				return;
			}
			
			inputStartTm.set(veryFirstDate);
			inputDestTm.set(veryFirstDate);
			if (inputDestTm.isSameOrBefore(inputStartTm)) {
				inputDestTm.add(1, "days");
			}

			var RowIndex = this.initData.RowIndex,
			AppDate = moment(this.oModel.getProperty("/ExpenseDetail/AppDate")).startOf("date"),
			rowIndices = $.map(this.oModel.getProperty("/SettlementTableIn05"), function(o, i) {
				if (	i === RowIndex // 수정 대상 행이면 pass
					|| !moment(o.AppDate).startOf("date").isSame(AppDate) // 거래일자가 다르면 pass
					|| o.Category !== "2" // 교통비가 아니면 pass
				) {
					return;
				}

				var gridStartTm = moment(o.StartTm.ms), gridDestTm = moment(o.DestTm.ms);
				if (!gridStartTm.isValid() || !gridDestTm.isValid()) {
					return;
				}

				gridStartTm.subtract(9, "hours").set(veryFirstDate);
				gridDestTm.subtract(9, "hours").set(veryFirstDate);
				if (gridDestTm.isSameOrBefore(gridStartTm)) {
					gridDestTm.add(1, "days");
				}

				if (    (gridStartTm.isSameOrBefore(inputStartTm) &&      inputStartTm.isBefore(gridDestTm))  // 출발시각이 기입력된 시간대 중간에 있는 경우
					||        (gridStartTm.isBefore(inputDestTm)  && inputDestTm.isSameOrBefore(gridDestTm))  // 도착시각이 기입력된 시간대 중간에 있는 경우
					|| (inputStartTm.isSameOrBefore(gridStartTm)  &&  gridDestTm.isSameOrBefore(inputDestTm)) // 입력 시간대가 기입력된 시간대를 포함하는 경우
				) {
					return i;
				}
			});

			if (rowIndices.length) {
				MessageBox.error(this.oController.getBundleText("MSG_19028"), { // 다른 정산항목과 이동시간이 겹칩니다.
					onClose: function() {
						setTimeout(function() {
							if (sPath) {
								this.oModel.setProperty(sPath, "");
								this.oModel.setProperty(sPath.replace(/(Hour|Minute)$/, ""), null);
							} else {
								this.oModel.setProperty("/ExpenseDetail/StartTmHour", "");
								this.oModel.setProperty("/ExpenseDetail/StartTmMinute", "");
								this.oModel.setProperty("/ExpenseDetail/DestTmHour", "");
								this.oModel.setProperty("/ExpenseDetail/DestTmMinute", "");
							}
						}.bind(this), 0);
					}.bind(this)
				});
				return;
			}

			this.oModel.setProperty("/ExpenseDetail/StartTm", StartTm.text);
			this.oModel.setProperty("/ExpenseDetail/DestTm", DestTm.text);
		}.bind(this), 0);
	},

	getTripTimeValues: function(id) {

		var hour = this.oModel.getProperty("/ExpenseDetail/${}Hour".interpolate(id)),
		minute = this.oModel.getProperty("/ExpenseDetail/${}Minute".interpolate(id)),
		time = hour + ":" + minute;
		return {
			text: time,
			moment: moment(time, "HH:mm")
		};
	},

	pressGIS: function() {

		var GisUrl = this.oModel.getProperty("/GisUrl");
		if (GisUrl) {
			this.oController.openWindow({ name: "gis", width: screen.availWidth, height: screen.availHeight, url: GisUrl });
		} else {
			MessageBox.error(this.oController.getBundleText("MSG_19032")); // GIS URL이 없습니다.
		}
	},

	setTripDistance: function(p) {

		if (!p) {
			MessageBox.error(this.oController.getBundleText("MSG_19033")); // GIS 정보가 없습니다.
			return;
		}

		var GisUrl = [
			"http://gis.lottechem.com:7001/sdsgis/proxy_caller.jsp",
			"uri=http://gis.lottechem.com:7001/sdsgis/EP_gisMap.jsp",
			$.param({
				zMapKey: p[0],
				callScrCls: "c3",
				hi: "N",
				user_id: this.oModel.getProperty("/GisUser"),
				checkone: 1,
				isCallBack: "Y"
			})
		].join("?");

		this.oModel.setProperty("/ExpenseDetail/Startpl", p[8]);
		this.oModel.setProperty("/ExpenseDetail/Destpl", p[13]);
		this.oModel.setProperty("/ExpenseDetail/Zzkm", Math.ceil(Common.toNumber(p[16])));
		this.oModel.setProperty("/ExpenseDetail/Gisurl", GisUrl);
		this.oModel.setProperty("/ExpenseDetail/ParkingTr", p[17]);

		this.calculateCarExpenses();
	},

	retrieveFuelList: function() {

		var Budat = Common.adjustGMTOdataFormat(this.getParentModelProperty("/Header/Budat")); // 전기일

		Promise.all([
			Common.getPromise(true, function(resolve) {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 소유 차종의 연료종류 코드 목록 조회
					"/BtSettlementSet",
					{
						IConType: "6",
						IPernr: this.getParentModelProperty("/Header/Pernr"),
						IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
						ILangu: this.oController.getSessionInfoByKey("Langu"),
						IDatum: Budat,
						TableIn08: []  // 소유 차종의 연료종류 코드 목록
					},
					{
						success: function(oData) {
							var OwnCarGasTypeList = Common.getTableInResults(oData, "TableIn08");
							if (OwnCarGasTypeList.length > 0) {
								this.oModel.setProperty("/OwnCarGasTypeDefault", OwnCarGasTypeList[0].Fuel || "");
							}
							this.oModel.setProperty("/OwnCarGasTypeList", OwnCarGasTypeList);

							resolve();
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
							
							this.oModel.setProperty("/OwnCarGasTypeList", []);
							this.oModel.setProperty("/OwnCarGasTypeDefault", "");

							resolve();
						}.bind(this)
					}
				);
			}.bind(this)),
			Common.getPromise(true, function(resolve) {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 연료종류 코드 목록 조회
					"/BtBaseSet",
					{
						ICodeT: "009",
						IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
						ILangu: this.oController.getSessionInfoByKey("Langu"),
						IDatum: Budat,
						TableIn09: []  // 연료종류 코드 목록 조회
					},
					{
						success: function(oData) {
							var GasTypeMap = {},
							GasTypeSelectList = $.map(Common.getTableInResults(oData, "TableIn09"), function(o) {
								GasTypeMap[o.Zzgasgb] = o;
								return o;
							});
							this.oModel.setProperty("/GasTypeMap", GasTypeMap);
							this.oModel.setProperty("/GasTypeSelectList", GasTypeSelectList);

							resolve();
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
							
							this.oModel.setProperty("/GasTypeMap", {});
							this.oModel.setProperty("/GasTypeSelectList", []);

							resolve();
						}.bind(this)
					}
				);
			}.bind(this))
		])
		.then(function() {
			if (this.isAddMode()) {
				var GasTypeSelectList = this.oModel.getProperty("/GasTypeSelectList"),
				defaultGasType = this.oModel.getProperty("/OwnCarGasTypeDefault") || (GasTypeSelectList[0] || {}).Zzgasgb || "";
				this.oModel.setProperty("/ExpenseDetail/Zzgasname", defaultGasType);

				this.calculateCarExpenses();
			}
		}.bind(this));
	},

	calculateCarExpenses: function() {

		var Zzgasgb = this.oModel.getProperty("/ExpenseDetail/Zzgasname"),
		GasType = this.oModel.getProperty("/GasTypeMap")[Zzgasgb] || {},
		Zzgasamt = Common.toNumber(GasType.Zzgasamt),
		ZzkmUnit = Common.toNumber(GasType.Zzkm),
		ZzkmInput = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/Zzkm")),
		GasTr = ZzkmUnit === 0 ? 0 : Zzgasamt * (ZzkmInput / ZzkmUnit),
		ParkingTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/ParkingTr")),
		TollTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/TollTr")),
		PayAmtTr = GasTr + ParkingTr + TollTr;

		this.oModel.setProperty("/ExpenseDetail/GasTr", GasTr.toFixed(2));
		this.oModel.setProperty("/ExpenseDetail/PayAmtTr", PayAmtTr.toFixed(2));
		this.oModel.setProperty("/ExpenseDetail/BtExpenseTr", PayAmtTr.toFixed(2));
	},

	// 통화 검색
	searchCurrency: function(oEvent) {

		var target = oEvent.getSource().data("target");

		setTimeout(function() {
			DialogHandler.open(CurrencyDialogHandler.get(this.oController, function(p) {
				this.oModel.setProperty(target.ZtcWaers, p.Waers);
				this.oModel.setProperty(target.ZscWaers, p.Waers);
				this.oModel.setProperty(target.Kursf, p.Erate);
			}.bind(this)));
		}.bind(this), 0);
	},

	// ExpenseAndTaxTable 요청금액 변경 : '현금/기타'만 변경 가능
	changeBtExpenseTr: function(oEvent) {

		this.oModel.setProperty("/ExpenseDetail/PayAmtTr", Common.toNumber(oEvent.getParameter("value")));
		this.calculateTax();
	},

	// ExpenseAndTaxTable 개인부담금액 변경 : '법인카드'만 변경 가능
	changeIndExpdTr: function(oEvent) {

		var IndExpdTr = Common.toNumber(oEvent.getParameter("value")),
		PayAmtTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/PayAmtTr")),
		BtTaxTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/BtTaxTr")),
		BtExpenseTr = PayAmtTr - IndExpdTr,
		BtTaxbaseTr = BtExpenseTr - BtTaxTr;

		if (BtExpenseTr < 0) {
			BtExpenseTr = PayAmtTr;
			BtTaxbaseTr = BtExpenseTr - BtTaxTr;

			this.oModel.setProperty("/ExpenseDetail/IndExpdTr", 0);

			MessageBox.error(this.oController.getBundleText("MSG_19026")); // 개인부담금액이 결제금액을 초과하였습니다.
		}

		this.oModel.setProperty("/ExpenseDetail/BtExpenseTr", BtExpenseTr);
		this.oModel.setProperty("/ExpenseDetail/BtTaxbaseTr", BtTaxbaseTr);
	},

	// 공급가액 및 세금 계산
	calculateTax: function() {

		var ClDmtr = this.oModel.getProperty("/ExpenseDetail/ClDmtr"),
		CardPy = this.oModel.getProperty("/ExpenseDetail/CardPy"),
		Mwskz = this.oModel.getProperty("/ExpenseDetail/Mwskz"),
		Taxrt = this.oModel.getProperty("/TaxMap${ClDmtr}${CardPy}/${Mwskz}".interpolate(ClDmtr, CardPy, Mwskz)) / 100,
		PayAmtTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/PayAmtTr")),
		BtTaxTr = Common.toNumber((PayAmtTr / (1 + Taxrt) * Taxrt).toFixed(2));

		this.oModel.setProperty("/ExpenseDetail/BtTaxTr", BtTaxTr);
		this.oModel.setProperty("/ExpenseDetail/BtTaxbaseTr", PayAmtTr - BtTaxTr);
	},

	// 공항 검색
	searchAirport: function(oEvent) {

		var oContext = oEvent.getSource().getBindingContext(),
		sPath = oContext.getPath(),
		mTarget = oContext.getProperty().Target;

		setTimeout(function() {
			DialogHandler.open(AirportDialogHandler.get(this.oController, function(p) {
				this.oModel.setProperty(sPath + "/Airport", p.Iatacode);
				this.oModel.setProperty(sPath + "/AirportT", p.IataTxt);
				this.oModel.setProperty(sPath + "/CountryT", p.BtCrtTxt);
				this.oModel.setProperty(sPath + "/CityT", p.BtCityTxt);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.Airport, p.Iatacode);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.AirportT, p.IataTxt);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.Country, p.BtCrt);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.CountryT, p.BtCrtTxt);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.City, p.BtCity);
				this.oModel.setProperty("/ExpenseDetail/" + mTarget.CityT, p.BtCityTxt);
			}.bind(this)));
		}.bind(this), 0);
	},

	// 비용정산항목(SettlementTableIn05) table에 저장
	setExpenseData: function() {

		var Category = this.oModel.getProperty("/ExpenseDetail/Category"),
		Subcategory = this.oModel.getProperty("/ExpenseDetail/Subcategory");

		// 교통비
		if (Category === "2") {
			if (!this.isValidForRequired("MSG_00053", "LABEL_19623", "/ExpenseDetail/Startpl", "ExpenseDetailStartpl")) { // 이동구간을 입력하세요.
				return;
			}
			if (!this.isValidForRequired("MSG_00053", "LABEL_19623", "/ExpenseDetail/Destpl", "ExpenseDetailDestpl")) { // 이동구간을 입력하세요.
				return;
			}
			if (!this.isValidForRequired("MSG_00053", "LABEL_19624", "/ExpenseDetail/StartTm", "ExpenseDetailStartTmHour")) { // 이동시간을 입력하세요.
				return;
			}
			if (!this.isValidForRequired("MSG_00053", "LABEL_19624", "/ExpenseDetail/DestTm", "ExpenseDetailDestTmHour")) { // 이동시간을 입력하세요.
				return;
			}
		}
		// 항공료
		else if (Category === "5") {
			var id = $.app.byId("Form04").getRows()[0].$().find("[data-sap-ui-colid=\"Form04DepartAirport\"]");
			if (!this.isValidForRequired("MSG_00055", "LABEL_19644", "/ExpenseDetail/DepartAirport", id)) { // 공항을 선택하세요.
				return;
			}
			id = $.app.byId("Form04").getRows()[0].$().find("[data-sap-ui-colid=\"Form04DestAirport\"]");
			if (!this.isValidForRequired("MSG_00055", "LABEL_19644", "/ExpenseDetail/DestAirport", id)) { // 공항을 선택하세요.
				return;
			}
		}

		if (Category !== "2" || Subcategory !== "09") { // 교통비 - 승용차 : 세금관련 제외
			var id = $.app.byId("ExpenseAndTaxTable").getRows()[0].$().find("[data-sap-ui-colid=\"ExpenseAndTaxTableZscWaers\"]");
			if (!this.isValidForRequired("MSG_00056", "LABEL_19611", "/ExpenseDetail/ZscWaers", id)) { // 현지통화를 선택하세요.
				return;
			}
			var PayAmtTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/PayAmtTr")),
			BtExpenseTr = Common.toNumber(this.oModel.getProperty("/ExpenseDetail/BtExpenseTr"));
			if (PayAmtTr <= 0 || BtExpenseTr <= 0) {
				var id = $.app.byId("ExpenseAndTaxTable").getRows()[0].$().find("[data-sap-ui-colid=\"ExpenseAndTaxTableBtExpenseTr\"]");
				this.showErrorMessage("MSG_00053", "LABEL_19612", id); // 결제금액을 입력하세요.
				return;
			}
			id = $.app.byId("ExpenseAndTaxTable").getRows()[0].$().find("[data-sap-ui-colid=\"ExpenseAndTaxTableMwskz\"]");
			if (!this.isValidForRequired("MSG_00056", "LABEL_19613", "/ExpenseDetail/Mwskz", id)) { // 세금코드를 선택하세요.
				return;
			}
		}

		this.oModel.setProperty("/ExpenseDetail/PayAmtLc", "");
		this.oModel.setProperty("/ExpenseDetail/ZlcWaers", "");

		this.callback(this.oModel.getProperty("/ExpenseDetail"));

		this.oDialog.close();
		this.changeToCloseState();
	},

	isValidForRequired: function(mssageCode, labelCode, propertyPath, id) {

		if (!this.oModel.getProperty(propertyPath)) {
			this.showErrorMessage(mssageCode, labelCode, id);
			return false;
		}
		return true;
	},

	showErrorMessage: function(mssageCode, labelCode, id) {

		MessageBox.error(this.getMessage(mssageCode, this.getMessage(labelCode)), {
			onClose: function() {
				$.app.byId(id).focus();
			}
		});
	},

	getMessage: function() {

		return this.oController.getBundleText.apply(this.oController, [].slice.call(arguments));
	},

	isAddMode: function() {

		return this.initData.RowIndex === -1;
	},

	isCardExpense: function() {

		return !!this.initData.ApprNo;
	},

	changeToCloseState: function() {

		this.oDialog.setContentHeight("180px");
		this.oModel.setProperty("/VisibleFactor/Category", "");
		this.oModel.setProperty("/VisibleFactor/Subcategory", "");
		this.initForms();
	}

};

});