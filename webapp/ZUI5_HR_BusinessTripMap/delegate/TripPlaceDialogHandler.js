sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(Common, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({
		PlaceName: null,
		TripPlaceList: [
			{ PlaceName: "롯데케미칼본사" },
			{ PlaceName: "한국가스안전공사가스안전교육원" },
			{ PlaceName: "롯데케미칼 대산공장" },
			{ PlaceName: "대전고용노동청" },
			{ PlaceName: "금강유역환경청" },
			{ PlaceName: "롯데케미칼연구소" },
			{ PlaceName: "롯데케미칼제1공장" },
			{ PlaceName: "롯데케미칼 울산1공장" },
			{ PlaceName: "롯데케미칼 의왕사업장" },
			{ PlaceName: "한국가스안전공사 본사" }
		],
		DistanceMap: {
			"가스공사안전교육원,대산공장": 194,
			"대산공장,가스공사안전교육원": 194,
			"대산공장,대전고용노동청": 286,
			"대산공장,대전금강유역환경청": 284,
			"대산공장,대전연구소": 286,
			"대산공장,서울본사": 270,
			"대산공장,여수공장": 808,
			"대산공장,울산공장": 808,
			"대산공장,한국가스안전공사본사": 272,
			"대전고용노동청,대산공장": 286,
			"대전금강유역환경청,대산공장": 284,
			"대전연구소,대산공장": 282,
			"대전연구소,서울본사": 320,
			"대전연구소,여수공장": 438,
			"대전연구소,울산공장": 540,
			"대전연구소,첨단의왕": 282,
			"서울본사,대산공장": 270,
			"서울본사,대전연구소": 320,
			"서울본사,여수공장": 688,
			"서울본사,울산공장": 744,
			"서울본사,첨단의왕": 60,
			"여수공장,대산공장": 808,
			"여수공장,대전연구소": 438,
			"여수공장,서울본사": 688,
			"울산공장,대산공장": 808,
			"울산공장,대전연구소": 540,
			"울산공장,서울본사": 744,
			"첨단의왕,대전연구소": 282,
			"첨단의왕,서울본사": 60,
			"한국가스안전공사본사,대산공장": 272
		}
	}),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, PlaceName, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/PlaceName", PlaceName || "");

		oController.TripPlaceDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "TripPlaceDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.TripPlaceDialog",
			type: "JS",
			controller: this.oController
		};
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

	getDistanceBetween: function(departure, destination) {

		if (!departure || !destination) {
			return 0;
		}
		return this.oModel.getProperty("/DistanceMap/" + departure + "," + destination) || 0;
	},

	onBeforeOpen: function() {

		return Common.getPromise(function() {
			var oModel = this.getModel(),
			PlaceName = oModel.getProperty("/PlaceName"),
			TripPlaceList = oModel.getProperty("/TripPlaceList");
	
			TripPlaceList.forEach(function(data) {
				data.selected = (data.PlaceName === PlaceName);
			});
			oModel.setProperty("/TripPlaceList", TripPlaceList);
		}.bind(this));
	},

	onSearch: function(oEvent) {

		oEvent.getParameter("itemsBinding").filter([
			new sap.ui.model.Filter("PlaceName", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"))
		]);
	},

	onConfirm: function(oEvent) {

		if (this.callback) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this.callback(!oSelectedItem ? "" : oSelectedItem.getBindingContext().getProperty().PlaceName);
		}
	}

};

return Handler;

});