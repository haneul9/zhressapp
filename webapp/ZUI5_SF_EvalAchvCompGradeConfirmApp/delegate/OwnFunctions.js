sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/JSONModelHelper",
	"../../common/JSONModelRequest"
], function (Common, Formatter, JSONModelHelper, JSONModelRequest) {
"use strict";

return { // 업적&역량 평가 functions

	retrieveExceptionSettings: function(oController) {

		var worker = new Worker("common/AjaxWorkerOld.js"); // Worker instance 생성
		worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
			Common.log("exception-settings success", event);
			setTimeout(function() {
				var result = event.data;
				if (result.success) {
					var settings = (((result.results || [{}])[0] || {}).d || {}).results,
					currentYear = new Date().getFullYear();

					$.each(settings, function(i, o) {
						if (Number(o.year || 0) === currentYear) {
							oController.SearchModel.setProperty("/FilterComboBoxType", o.code);
							if (o.code === "A") {
								$.app.byId("FilterComboBox").setVisible(true);
							}
							return false;
						}
					});
				} else {
					Common.log("exception-settings fail", event);
				}
			}, 0);

			worker.terminate();
			worker = undefined;
		};
		worker.postMessage({ // Worker 작업 실행
			list: [{
				url: "/odata/v2/Background_EvalException",
				data: new JSONModelRequest()
					.filter("userId eq '${oController.LoginUserId}'".interpolate(oController.LoginUserId))
					.getEncodedQueryString()
			}]
		});
	},

	retrieveGroupingCriteria: function(oController) {

		new JSONModelHelper()
			.url("./${$.app.CONTEXT_PATH}/grouping-criteria.json".interpolate($.app.CONTEXT_PATH))
			.attachRequestCompleted(function() {
				oController.GroupingCriteriaMap = this.getResult();
			})
			.attachRequestFailed(function() {
				Common.log("grouping-criteria fail", arguments);
			})
			.load();
	},

	initSearchModel: function(oController) {

		var minYear = 2020,
		suffix = oController.getBundleText("LABEL_00143"), // 년
		comboBoxItems = $.map(new Array(new Date().getFullYear() - minYear + 1), function(v, i) {
			var value = String(minYear + i);
			return {value: value, text: value + suffix};
		});

		oController.SearchModel.setData({
			EvalYears: comboBoxItems,
			Groups: null
		});
	},

	initCountModel: function(oController) {

		oController.CountModel.setData({
			Criterion: {A: 0, BC: 0, T: 0},
			Selected: {A: 0, B: 0, C: 0},
			Ratio: {A: 0, B: 0, C: 0}
		});
	},

	initEvalGradeComboModel: function(oController) {

		oController.EvalGradeComboModel.setData({
			Grades: [
				{value: "A", text: "A"},
				{value: "B", text: "B"},
				{value: "C", text: "C"}
			]
		});
		oController.getView().setModel(oController.EvalGradeComboModel, "EvalGradeComboModel");
	},

	initMessagePopover: function(oController) {

		oController.MessagePopover = new sap.m.MessagePopover("async-messages", {
			placement: sap.m.VerticalPlacementType.Bottom,
			items: {
				path: "/Messages",
				template: new sap.m.MessageItem({
					type: "{type}",
					title: "{title}"
				})
			}
		})
		.addStyleClass("custom-async-messagepopover")
		.setModel(new sap.ui.model.json.JSONModel());
	},

	// 조직 combobox items reset
	resetOrgComboBoxItems: function(orgSet) {

		this.SearchModel.setProperty("/Orgs", orgSet);
		if (orgSet.length) {
			$.app.byId("OrgComboBox").setSelectedKey(orgSet[0].value);
		}
	},

	// 그룹 combobox items reset
	resetGroupComboBoxItems: function(groupMap) {

		if (groupMap.All.count === 0) {
			this.SearchModel.setProperty("/Groups", null);
			return;
		}

		var items = [], selectedKey;
		if ((0 < groupMap.S.count && groupMap.S.count < 3) || (0 < groupMap.M.count && groupMap.M.count < 3)) {
			if (groupMap.S.count > 0 && groupMap.M.count > 0) {
				selectedKey = "S+M";
				items.push({value: "S+M", text: "S + M"});
				groupMap["S+M"].appraiseeList = (groupMap.S.appraiseeList || []).concat(groupMap.M.appraiseeList || []);
			} else {
				if (groupMap.S.count > 0) {
					selectedKey = selectedKey || "S";
					items.push({value: "S", text: "S"});
				}
				if (groupMap.M.count > 0) {
					selectedKey = selectedKey || "M";
					items.push({value: "M", text: "M"});
				}
			}
		} else {
			if (groupMap.S.count > 0) {
				selectedKey = selectedKey || "S";
				items.push({value: "S", text: "S"});
			}
			if (groupMap.M.count > 0) {
				selectedKey = selectedKey || "M";
				items.push({value: "M", text: "M"});
			}
		}
		if ((0 < groupMap.SA.count && groupMap.SA.count < 3) || (0 < groupMap.A.count && groupMap.A.count < 3)) {
			if (groupMap.SA.count > 0 && groupMap.A.count > 0) {
				selectedKey = selectedKey || "SA+A";
				items.push({value: "SA+A", text: "SA + A"});
				groupMap["SA+A"].appraiseeList = (groupMap.SA.appraiseeList || []).concat(groupMap.A.appraiseeList || []);
			} else {
				if (groupMap.SA.count > 0) {
					selectedKey = selectedKey || "SA";
					items.push({value: "SA", text: "SA"});
				}
				if (groupMap.A.count > 0) {
					selectedKey = selectedKey || "A";
					items.push({value: "A", text: "A"});
				}
			}
		} else {
			if (groupMap.SA.count > 0) {
				selectedKey = selectedKey || "SA";
				items.push({value: "SA", text: "SA"});
			}
			if (groupMap.A.count > 0) {
				selectedKey = selectedKey || "A";
				items.push({value: "A", text: "A"});
			}
		}
		if (groupMap["사무영업"].count > 0) {
			selectedKey = selectedKey || "사무영업";
			items.push({value: "사무영업", text: "사무영업"});
		}

		this.SearchModel.setProperty("/Groups", items);
		$.app.byId("GroupComboBox").setSelectedKey(selectedKey);
	},

	startGridTableUpdating: function(on, oController) {

		if (on) {
			oController.GridTableUpdateInterval = setInterval(function() {
				$.app.byId("GroupComboBox").fireChange();
			}, 300);
		} else {
			clearInterval(oController.GridTableUpdateInterval);
		}
	}

};

});