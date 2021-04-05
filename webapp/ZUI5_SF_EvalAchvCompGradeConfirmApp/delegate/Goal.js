sap.ui.define([
	"../../common/Common",
	"../../common/JSONModelHelper"
], function (Common, JSONModelHelper) {
"use strict";

return { // 업적&역량 평가

	// 목표 개수, 활동 개수, 실적 개수조회
	retrieve: function(goalModels) {

		return Promise.all($.map(goalModels, function(m) {
			return m.load().promise();
		}))
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/2", {type: "Success", title: $.app.getBundleText("MSG_03016")}); // 피평가자별 목표 항목 정보 조회 완료
		})
		.catch(function() {
			if ($.app.LOG.ENABLE_FAILURE) {
				Common.log("grid data retrieval error", arguments);
			}
		});
	},

	// 목표 개수 조회
	retrieveGoal: function(pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Goal_2")
			.filter("userId eq '${pUserId}'".interpolate(pUserId))
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/goal".interpolate(pUserId), inlinecount);

				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {failure: arguments, model: this};
			});
	},

	// 활동 개수 조회
	retrieveActivity: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Activity")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pSubjectUserId}/activity".interpolate(pSubjectUserId), inlinecount);

				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {failure: arguments, model: this};
			});
	},

	// 실적 개수 조회
	retrieveAchievement: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Achievement")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pSubjectUserId}/result".interpolate(pSubjectUserId), inlinecount);

				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {failure: arguments, model: this};
			});
	}

};

});