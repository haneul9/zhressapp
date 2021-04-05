sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"./EvalProfileDialogHandler",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Common, CommonController, JSONModelHelper, EvalProfileDialogHandler, MessageBox, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 평가이력

	onInit: function () {
		Common.log("onInit");

		this.setupView();

		this.getEvalProfileDialogHandler().onBeforeOpen();

		Common.log("onInit session", this.getView().getModel("session").getData());
	},

	getEvalProfileDialogHandler: function() {

		return EvalProfileDialogHandler.get(this, this.retrieveSessionModel().getData().name);
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		return new JSONModel({name: "20140099"});
	} : null

});

});