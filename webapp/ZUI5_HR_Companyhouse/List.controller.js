sap.ui.define(
	[
		"../common/Common",
		"../common/CommonController",
		"../common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox, unifiedLibrary) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",

			TableModel: new JSONModelHelper(),
			UsageFeeSearchModel: new JSONModelHelper(), //날짜 변환을위한 모델
			PDFViewModel: new JSONModelHelper(), //PDFView
			FeeModelTable: new JSONModelHelper(),

			getUserId: function() {

				return this.getView().getModel("session").getData().name;
			},
			
			getUserGubun  : function() {
				
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

			onBeforeShow: function (oEvent) {
				Common.log("onBeforeShow");
				
			},

			onAfterShow: function (oEvent) {
				var oController = $.app.getController();
				var oViewFlexBox = $.app.byId(this.PAGEID + "_ViewFlexBox");
				var oTable = "";
				var oUrl = "";
				
				this.initDateCreate(this);
				
				if (oController.getUserGubun() === "1000" || oController.getUserGubun() === "H600") {
					oTable = sap.ui.jsfragment("ZUI5_HR_Companyhouse.fragment.HousingfeeTable", this);
					oViewFlexBox.addItem(oTable);
				}else{
					oUrl = sap.ui.jsfragment("ZUI5_HR_Companyhouse.fragment.HousingfeeUrl", this);
					oViewFlexBox.addItem(oUrl);
				}
			},
			
			initDateCreate: function(oController) { // 년과 월로 따로 셋팅하는곳
				var vBukrs = oController.getUserGubun();
				
				oController.UsageFeeSearchModel.setData({
							Data: { Zyear: "", Zmonth: "" },
							Zyears: [],
							Zmonths: [],
							vBukrs: vBukrs
				});
				
				this.setUsageFeeZyears(this);
				this.setUsageFeeZmonths(this);
			},
			
			getMonthFormatter: function() {
				return	new sap.ui.commons.TextView({
					text: {
						path: "Zyymm",
						formatter: function(v) {
							return v ? Common.lpad(parseInt(v), 2) : "";
						}
					},
					textAlign: "Center"
				})
			},
			
			setUsageFeeZyears: function(oController) {
				var vZyear = new Date().getFullYear(),
					vConvertYear = "",
					aYears = [];
	
				Common.makeNumbersArray({length: 11}).forEach(function(idx) {
					vConvertYear = String(vZyear - idx);
					aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
				});
	
				oController.UsageFeeSearchModel.setProperty("/Data/Zyear", vZyear);
				oController.UsageFeeSearchModel.setProperty("/Zyears", aYears);
			},
			
			setUsageFeeZmonths: function(oController) {
				var vZmonth = new Date().getMonth() + 1,
					vConvertMonth = "",
					aMonths = [];
	
				Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
					vConvertMonth = String(idx);
					aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
				});
	
				oController.UsageFeeSearchModel.setProperty("/Data/Zmonth", vZmonth);
				oController.UsageFeeSearchModel.setProperty("/Zmonths", aMonths);
			},
			
			onPressSearchBtn: function() { //조회버튼
				var oController = $.app.getController(),
					oModel = $.app.getModel("ZHR_BENEFIT_SRV"),
					vPernr = oController.getUserId(),
					vMolga = oController.getView().getModel("session").getData().Molga,
					vBukrs = oController.getUserGubun(),
					vYear = oController.UsageFeeSearchModel.getProperty("/Data/Zyear"),
					vMonth = oController.UsageFeeSearchModel.getProperty("/Data/Zmonth"),
					oTable = $.app.byId(oController.PAGEID + "_Table"),
					oSearchData = {},
					vFullDate = "";
					
					BusyIndicator.show(0);
				
				if(String(vMonth).length !== 2) vFullDate = String(vYear)+"0"+String(vMonth);
				else vFullDate = String(vYear)+vMonth;
				
				oSearchData.IPernr = vPernr;
				oSearchData.IBukrs = vBukrs;
				oSearchData.IMolga = vMolga;
				oSearchData.IYyyymm = vFullDate;
				
				if(oController.getUserGubun() === "1000" || oController.getUserGubun() === "H600"){
					oSearchData.AptPayTabNav = [];
					oController.FeeModelTable.setData({Data: {}});
					
					oModel.create("/AptSet", oSearchData, {
						async: false,
						success: function (data, res) {
							if (data.AptPayTabNav) {
								var rDatas = data.AptPayTabNav.results;
								BusyIndicator.hide();
								oController.FeeModelTable.setData({Data: rDatas});
							}
						},
						error: function (res) {
							BusyIndicator.hide();
							Common.log(res);
						}
					});

					Common.adjustAutoVisibleRowCount.call(oTable);
				}else{
					oSearchData.AptPayNav = [];
					oController.PDFViewModel.setData({Data: {}});
					
					oModel.create("/AptSet", oSearchData, {
						async: false,
						success: function (data, res) {
							if (data.AptPayNav) {
								var oResult = data.AptPayNav.results[0].Url
								BusyIndicator.hide();
								oController.PDFViewModel.setProperty("/Data/rPDFView",oResult);
								Common.log(oResult);
							}
						},
						error: function (res) {
							BusyIndicator.hide();
							Common.log(res);
						}
					});
				}
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "09601976"});
			} : null
		});
	}
);
