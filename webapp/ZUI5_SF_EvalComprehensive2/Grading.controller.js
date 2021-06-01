/* global Promise:true */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/JSONModelRequest",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(Common, CommonController, JSONModelHelper, JSONModelRequest, MessageBox, BusyIndicator, JSONModel) {
"use strict";

var SUB_APP_ID = [$.app.CONTEXT_PATH, "Grading"].join(".");

return CommonController.extend(SUB_APP_ID, { // 종합평가 : 수행

	HeaderModel: new JSONModelHelper(),
	AggregateTableModel: new JSONModelHelper(),
	GradeListModel: new JSONModelHelper(),
	GradeSModel: new JSONModelHelper(),
	GradeAModel: new JSONModelHelper(),
	GradeBModel: new JSONModelHelper(),
	GradeCModel: new JSONModelHelper(),
	GradeDModel: new JSONModelHelper(),

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		this.HeaderModel.setData({});
		this.AggregateTableModel.setData({Aggregate: [], DepartmentMap: {}});
		this.GradeListModel.setData({Gradings: [], ComboBoxItems: [], GradePointMap: {}});
		this.GradeSModel.setData([]);
		this.GradeAModel.setData([]);
		this.GradeBModel.setData([]);
		this.GradeCModel.setData([]);
		this.GradeDModel.setData([]);

		Common.adjustVisibleRowCount($.app.byId("AggregateTable").setBusy(false), 2, 2);
	},

	onAfterShow: function(oEvent) {
		Common.log("onAfterShow");

		this.onLoadDetailSet(this, oEvent.data);
	},

	onLoadDetailSet: function(oController, oParam) {

		BusyIndicator.show(0);

		var oModel = $.app.getModel("ZHR_APPRAISAL_SRV"),
			Evstaus = oParam.Evstaus || "",
			editable = Number(oParam.Evstaus || 0) < 20,
			oPayload = {};

		Common.removeProperties(oParam, "__metadata", "No", "IOdkey");

		// Set header
		oPayload.IOdkey = "000";
		oPayload.IConType = $.app.ConType.READ;
		oPayload.IEvstaus = Evstaus;
		oPayload.IPclog = Common.getPCLogStructure();
		oPayload.IInput = oParam;

		// Set navigation
		oPayload.Export = [];
		oPayload.TableIn1 = [];
		oPayload.TableIn2 = [];
		oPayload.TableIn3 = [];

		oModel.create("/CollEvaDetailSet", oPayload, {
			success: function(data) {
				var promises = [];
				promises.push(Common.getPromise(function() {
					if (data.Export) {
						Common.log("data.Export.results", data.Export.results);

						oController.HeaderModel.setData(data.Export.results[0]);
					}
				}));
				promises.push(Common.getPromise(function() {
					// 부서별 평가등급 현황
					if (data.TableIn1) {
						Common.log("data.TableIn1.results", data.TableIn1.results);

						var list = data.TableIn1.results || [],
						total = {
							Sumorgtx: oController.getBundleText("LABEL_11317"), // 합계
							Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
							Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
						},
						map = {};

						$.each(list, function(i, o) {
							if (!map[o.Sumorg]) {
								map[o.Sumorg] = o;
							}
							total.Empcnt1 += o.Empcnt1; total.Evapnt1 += o.Evapnt1;
							total.Empcnt2 += o.Empcnt2; total.Evapnt2 += o.Evapnt2;
							total.Empcnt3 += o.Empcnt3; total.Evapnt3 += o.Evapnt3;
							total.Empcnt4 += o.Empcnt4; total.Evapnt4 += o.Evapnt4;
							total.Empcnt5 += o.Empcnt5; total.Evapnt5 += o.Evapnt5;
							total.Empcnt6 += o.Empcnt6; total.Evapnt6 += o.Evapnt6;
						});
						list.push(total);

						oController.AggregateTableModel.setData({
							Aggregate: list,
							DepartmentMap: map
						});

						Common.adjustVisibleRowCount($.app.byId("AggregateTable"), 5, list.length);
					}
				}));
				promises.push(Common.getPromise(function() {
					// 개인별 평가등급 현황 : Drag and Drop 영역
					if (data.TableIn2) {
						Common.log("data.TableIn2.results", data.TableIn2.results);

						var EvalYear = new Date().getFullYear(),
						list = data.TableIn2.results || [],
						guideline = {styleClass: "employee-evaluation-card-guideline"},
						map = {
							S: editable ? [guideline] : [],
							A: editable ? [guideline] : [],
							B: editable ? [guideline] : [],
							C: editable ? [guideline] : [],
							D: editable ? [guideline] : []
						};

						setTimeout(function() {
							this.retrievePhoto(list);
						}.bind(oController), 0);

						$.map(list, function(o, i) {
							if (Common.isLOCAL() && !o.Pegrade) {
								o.Pegrade = (function() { var r = Math.random() + 0.3; return r > 0.8 ? "A" : r > 0.7 ? "B" : "C"; })();
							}

							o.No = i + 1;
							o.Pyear1 = EvalYear - 1;
							o.Pyear2 = EvalYear - 2;
							o.Pyear3 = EvalYear - 3;
							o.Pernr = o.Pernr.replace(/^0+/, "");
							o.Cograde = o.Cograde || o.Pegrade;
							o.Pvgrade = o.Cograde; // ComboBox 등급 직전 선택값 저장
							o.dragable = editable;

							if (o.Cograde) {
								map[o.Cograde].unshift(o);
							}
							if (o.Evstaus === "40") {
								o.styleClass = "employee-evaluation-card-demurrer";
							}
						});

						$.map(oController.sort(list), function(o, i) {
							o.No = i + 1;
						});
						oController.GradeListModel.setProperty("/Gradings", list);

						setTimeout(oController.calculate.bind(oController), 0);

						Common.adjustVisibleRowCount($.app.byId("GradingTable"), 10, list.length);

						$.map(map, function(l, k) {
							var gridContainer = $.app.byId("GridContainer" + k);
							if (!gridContainer) {
								return;
							}

							gridContainer.removeAllDragDropConfig();

							if (editable) {
								var oView = oController.getView(), configs = oView.getDnDConfigs(oView);
								gridContainer.addDragDropConfig(configs[0]).addDragDropConfig(configs[1]);
							}
						});

						oController.GradeSModel.setData({group: "S", list: oController.sort(map.S)});
						oController.GradeAModel.setData({group: "A", list: oController.sort(map.A)});
						oController.GradeBModel.setData({group: "B", list: oController.sort(map.B)});
						oController.GradeCModel.setData({group: "C", list: oController.sort(map.C)});
						oController.GradeDModel.setData({group: "D", list: oController.sort(map.D)});
					}
				}));
				promises.push(Common.getPromise(function() {
					// 평가등급별 점수현황 : 평가리스트 종합평가 ComboBox items
					if (data.TableIn3) {
						Common.log("data.TableIn3.results", data.TableIn3.results);

						var list = data.TableIn3.results || [], map = {};
						$.map(list, function(o) {
							map[o.Cograde] = Number(o.Evapnt);
						});
						oController.GradeListModel.setProperty("/ComboBoxItems", list);
						oController.GradeListModel.setProperty("/GradePointMap", map);
					}
				}));

				Promise.all(promises)
					.then(function() {
						Common.log("sapMTabStripContainer");
						setTimeout(function() {
							// $(".sapMTabStripContainer").append("<div class=\"custom-tab-container-legend\"><img src=\"images/grade-n-icon-legend.png\" /></div>");
							$(".sapMTabStripContainer").append([
								"<div class=\"custom-tab-container-legend\">",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-s\"><span class=\"sapMLabelTextWrapper\"><bdi>S</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-a\"><span class=\"sapMLabelTextWrapper\"><bdi>A</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-b\"><span class=\"sapMLabelTextWrapper\"><bdi>B</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-c\"><span class=\"sapMLabelTextWrapper\"><bdi>C</bdi></span></span>",
									"<span class=\"sapMLabel sapUiSelectable sapMLabelMaxWidth prev-grade-d\"><span class=\"sapMLabelTextWrapper\"><bdi>D</bdi></span></span>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11428"), "</span>", // 직전 평가등급
									"<div class=\"sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer\" data-sap-ui-icon-content=\"\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11429"), "</span>", // 평가결과
									"<div class=\"sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer\" data-sap-ui-icon-content=\"\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11430"), "</span>", // 인사기록카드
									"<div class=\"employee-evaluation-card-demurrer\"></div>",
									"<span class=\"legend-text\">", oController.getBundleText("LABEL_11431"), "</span>", // 이의제기
								"</div>"
							].join(""));
						}, 0);

						BusyIndicator.hide();
					});
			},
			error: function(res) {
				var errData = Common.parseError(res);
				if (errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: oController.getBundleText("LABEL_00150") // 안내
					});
				}

				BusyIndicator.hide();
			}
		});
	},

	calculate: function() {

		var ColNameMap = {S: "1", A: "2", B: "3", C: "4", D: "5"},
		DepartmentMap = this.AggregateTableModel.getProperty("/DepartmentMap"),
		GradePointMap = this.GradeListModel.getProperty("/GradePointMap"),
		Gradings = this.GradeListModel.getProperty("/Gradings"),
		Bgtpnt = Number(this.HeaderModel.getProperty("/Bgtpnt")),
		Total = {
			Sumorgtx: this.getBundleText("LABEL_11317"), // 합계
			Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
			Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
		};

		$.each(DepartmentMap, function(k, o) {
			$.extend(o, {
				Empcnt1: 0, Empcnt2: 0, Empcnt3: 0, Empcnt4: 0, Empcnt5: 0, Empcnt6: 0,
				Evapnt1: 0, Evapnt2: 0, Evapnt3: 0, Evapnt4: 0, Evapnt5: 0, Evapnt6: 0
			});
		});
		$.each(Gradings, function(i, o) {
			var department = DepartmentMap[o.Sumorg],
			n = ColNameMap[o.Cograde],
			p = GradePointMap[o.Cograde],
			Empcnt = "Empcnt" + n,
			Evapnt = "Evapnt" + n;

			o.Evapnt = p;
			++department.Empcnt6;
			++department[Empcnt];
			++Total.Empcnt6;
			++Total[Empcnt];
			department.Evapnt6 += p;
			department[Evapnt] += p;
			Total.Evapnt6 += p;
			Total[Evapnt] += p;
		});

		$.app.byId("total-evapnt").toggleStyleClass("color-darkgreen", Total.Evapnt6 <= Bgtpnt).toggleStyleClass("color-red", Total.Evapnt6 > Bgtpnt);
		this.HeaderModel.setProperty("/Evapnt", Total.Evapnt6);
		this.AggregateTableModel.setProperty("/Aggregate/" + Object.keys(DepartmentMap).length, Total);
		this.AggregateTableModel.refresh();
	},

	onPressSave: function() {

		var Evapnt = Number(this.HeaderModel.getProperty("/Evapnt") || 0);
		if (Evapnt === 0) {
			MessageBox.error(this.getBundleText("MSG_11007")); // 평가점수 정보가 없습니다.
			return;
		}

		this.save("10", "MSG_00017"); // 저장되었습니다.
	},

	onPressConfirm: function() {

		var Bgtpnt = Number(this.HeaderModel.getProperty("/Bgtpnt") || 0),
		Evapnt = Number(this.HeaderModel.getProperty("/Evapnt") || 0);
		if (Evapnt === 0) {
			MessageBox.error(this.getBundleText("MSG_11007")); // 평가점수 정보가 없습니다.
			return;
		}
		if (Evapnt > Bgtpnt) {
			MessageBox.error(this.getBundleText("MSG_11004")); // 평가점수는 Budget점수를 초과할 수 없습니다.
			return;
		}

		var oController = this;
		MessageBox.confirm(this.getBundleText("MSG_11002"), { // 평가완료 처리하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					oController.save.bind(oController)("20", "MSG_11003"); // 평가완료 처리되었습니다.
				} else {
					BusyIndicator.hide();
				}
			}
		});
	},

	save: function(IEvstaus, successMessageCode) {

		BusyIndicator.show(0);

		var oController = this,
		oModel = $.app.getModel("ZHR_APPRAISAL_SRV"),
		oPayload = {
			IConType: $.app.ConType.UPDATE,
			IEvstaus: IEvstaus, // 진행중
			IPclog: Common.getPCLogStructure(),
			IInput: Common.copyByMetadata("ZHR_APPRAISAL_SRV", "complexType", "IInput", oController.HeaderModel.getData()),
			TableIn2: $.map(oController.GradeListModel.getProperty("/Gradings"), function(o) {
				var data = Common.copyByMetadata("ZHR_APPRAISAL_SRV", "entityType", "CollEvaDetailTableIn2", o);
				delete data.Photo;
				return data;
			})
		};

		oModel.create("/CollEvaDetailSet", oPayload, {
			success: function() {
				MessageBox.success(oController.getBundleText(successMessageCode), {
					onClose: function() {
						BusyIndicator.hide();

						if (IEvstaus === "20") {
							sap.ui.getCore().getEventBus().publish("nav", "to", {
								id: [$.app.CONTEXT_PATH, "List"].join(".")
							});
						}
					}
				});
			},
			error: function(res) {
				var errData = Common.parseError(res);
				if (errData.Error === "E") {
					MessageBox.error(errData.ErrorMessage, {
						title: oController.getBundleText("LABEL_00150") // 안내
					});
				}

				BusyIndicator.hide();
			}
		});
	},

	getSortScore: function(o) {

		var CogradePriority = {S: 5000000, A: 4000000, B: 3000000, C: 2000000, D: 1000000},
			PegradePriority = {A: 300000, B: 200000, C: 100000};
		return (CogradePriority[o.Cograde] || 0) + (PegradePriority[o.Pegrade] || 0) - (10000 - Number(o.Pepnt || 0)) - (1000 - Number(o.Cepnt || 0)) - Number(o.Mepnt || 0);
	},

	sort: function(list) {

		var oController = this;
		list.sort(function(o1, o2) {
			return oController.getSortScore(o2) - oController.getSortScore(o1);
		});
		return list;
	},

	retrievePhoto: function(list) {

		var oController = this,
		worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
		worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
			var map = {};
			$.map(list, function(o) {
				map[o.Pernr] = o;
			});

			setTimeout(function() {
				var workerMessage = event.data;
				if (workerMessage.success) {
					$.map(workerMessage.responses, function(o) {
						var results = (o.d || {}).results || [];
						if (results.length) {
							var photoData = results[0];
							map[photoData.userId].Photo = "data:${photoData.mimeType};base64,${photoData.photo}".interpolate(photoData.mimeType, photoData.photo);
						}
					});
					oController.GradeSModel.refresh();
					oController.GradeAModel.refresh();
					oController.GradeBModel.refresh();
					oController.GradeCModel.refresh();
					oController.GradeDModel.refresh();
				}
			}, 0);

			worker.terminate();
			worker = undefined;
		};
		worker.postMessage(
			$.map(list || [], function(o) { // Worker 작업 실행
				return {
					url: "/odata/v2/Photo",
					data: new JSONModelRequest()
						.select("userId")
						.select("mimeType")
						.select("photo")
						.filter("userId eq '${userId}'".interpolate(o.Pernr))
						.filter("photoType eq 1")
						.getEncodedQueryString()
				};
			})
		);
	},
	
	getLocalSessionModel: Common.isLOCAL() ? function() {
		// return new JSONModel({name: "20090028"}); // 00981011
		// return new JSONModel({name: "926020"});
		return new JSONModel({name: "9001023"});
	} : null

});

});