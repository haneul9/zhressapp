sap.ui.define([
	"./Common",
	"./JSONModelHelper"
], function (Common, JSONModelHelper) {
	"use strict";

	var c = JSONModelHelper.extend("common.EmployeeModel", {
		constructor: function() {
			JSONModelHelper.apply(this, arguments);

			this.reset();
		}
	});

	$.extend(c.prototype, {
		reset: function() {

			this.setData({
				User: {
					Pernr: "사번",
					nickname: "성명",
					Btrtx: "인사영역",
					Stext: "부서",
					PGradeTxt: "직급",
					ZtitleT: "직위",
					photo: "images/photoNotAvailable.gif"
				}
			});
			return this;
		},
		/*
		@param userId
		@example new common.EmployeeModel().retrieve(userId);
		*/
		retrieve: function() {

			var model = this.reset();

			var result = $.extend(true, this.getResult(), Common.retrieveLoginInfo());
			delete result.__metadata;

			if (!result.Pernr) {
				result.Pernr = "사번";
			}
			if (!result.nickname) {
				result.nickname = "성명";
			}
			if (!result.Btrtx) {
				result.Btrtx = "인사영역";
			}
			if (!result.Stext) {
				result.Stext = "부서";
			}
			if (!result.PGradeTxt) {
				result.PGradeTxt = "직급";
			}
			if (!result.ZtitleT) {
				result.ZtitleT = "직위";
			}
			result.photo = sessionStorage.getItem("ehr.sf-user.photo");

			model.setData({User: result}, true);

			// return Promise.all([
			// 	new JSONModelHelper()
			// 		.url("/odata/v2/User('${userId}')".interpolate(userId))
			// 		// .select("userId")     // 사번
			// 		// .select("nickname")   // 성명
			// 		// .select("department") // 부서
			// 		.attachRequestCompleted(function() {
			// 			var result = $.extend(true, this.getResult(), Common.retrieveLoginInfo());
			// 			delete result.__metadata;

			// 			if (!result.Pernr) {
			// 				result.Pernr = "사번";
			// 			}
			// 			if (!result.nickname) {
			// 				result.nickname = "성명";
			// 			}
			// 			if (!result.Btrtx) {
			// 				result.Btrtx = "인사영역";
			// 			}
			// 			if (!result.Stext) {
			// 				result.Stext = "부서";
			// 			}
			// 			if (!result.PGradeTxt) {
			// 				result.PGradeTxt = "직급";
			// 			}
			// 			if (!result.ZtitleT) {
			// 				result.ZtitleT = "직위";
			// 			}

			// 			model.setData({User: result}, true);
			// 		})
			// 		.attachRequestFailed(function() {
			// 			Common.log("User('${userId}') retrieval failure".interpolate(userId), arguments);
			// 		})
			// 		.load()
			// 		.promise(),
			// 	new JSONModelHelper()
			// 		.url("/odata/v2/Photo")
			// 		.select("mimeType")
			// 		.select("photo")
			// 		.filter("userId eq '${userId}'".interpolate(userId))
			// 		.filter("photoType eq 1")
			// 		.attachRequestCompleted(function() {
			// 			Common.log("Photo('${userId}') retrieval success".interpolate(userId), this.getResults());

			// 			var result = this.getResults()[0] || {};
			// 			if (result.photo) {
			// 				model.setData({User: {
			// 					photo: "data:${result.mimeType};base64,${result.photo}".interpolate(result.mimeType, result.photo)
			// 				}}, true);
			// 			}
			// 		})
			// 		.attachRequestFailed(function() {
			// 			Common.log("Photo('${userId}') retrieval failure".interpolate(userId), arguments);
			// 		})
			// 		.load()
			// 		.promise()
			// ])
			// .then(function() {
			// 	Common.log("User('${userId}') & Photo retrieval success".interpolate(userId));
			// });
		}
	});

	return c;

});