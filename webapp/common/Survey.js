jQuery.sap.declare("common.Survey");

jQuery.sap.require("sap.m.MessageBox");

common.Survey = {
	oController: null,
	SurveyInfo: null,
	Type: "N",

	/**
	 * @memberOf common.Survey
	 */

	initSurvey: function (oController, ty) {
		common.Survey.oController = oController;
		common.Survey.Type = ty;

		common.Survey.SurveyInfo = [];

		common.Survey.SurveyInfo.push({ id: "SURVEY_1", label: "1. 퇴사하고자 하는 이유가 무엇인가요?", value: "", requried: true });
		common.Survey.SurveyInfo.push({ id: "SURVEY_1_11_TXT", label: "11) 기타 근무조건", value: "", requried: false });
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_1_1",
			label: "회사는 공표된 비전과 가치에 따라 운영된다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({ id: "SURVEY_2_1_2", label: "회사의 커뮤니케이션은 잘 되어 있다.", value: "", requried: true });
		common.Survey.SurveyInfo.push({ id: "SURVEY_2_1_3", label: "회사에서 직원으로서의 가치를 인정받았다", value: "", requried: true });
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_2_1",
			label: "회사의 보상수준은 동종 업계와 비교했을 때 높은 수준이다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_2_2",
			label: "회사는 개인의 공헌도에 따라 공정하게 보상을 한다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({ id: "SURVEY_2_2_3", label: "회사는 주어진 책임에 준하는 보상을 한다", value: "", requried: true });
		common.Survey.SurveyInfo.push({ id: "SURVEY_2_3_1", label: "나는 동료들과 좋은 인간관계를 유지하였다", value: "", requried: true });
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_3_2",
			label: "팀의 동료들은 직무성과를 높일 수 있는 새로운 정보에 대해 공유한다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_3_3",
			label: "퇴대부분의 동료들을 나를 잘 지원해 주었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_4_1",
			label: "나의 상사는 내 역량을 발휘할 수 있는 기회를 제공해 주었다.",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_4_2",
			label: "나의 상사는 나의 업무성과에 대하여 적절한 피드백을 해주었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_4_3",
			label: "나는 전반적으로 상사를 믿고 따를 수 있었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_5_1",
			label: "나에게 주어진 직무의 중요도에 대해 만족감을 느낄 수 있었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_5_2",
			label: "나의 직무는 나의 성장과 발전에 도움이 되었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({ id: "SURVEY_2_5_3", label: "나는 내가 맡은 업무에 열정에 가지고 있다", value: "", requried: true });
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_6_1",
			label: "업무 때문에 원하는 만큼 가족과 시간을 보낼 수 없었다",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({
			id: "SURVEY_2_6_2",
			label: "업무 시간으로 인해 집안일을 할 시간이 부족하다.",
			value: "",
			requried: true
		});
		common.Survey.SurveyInfo.push({ id: "SURVEY_3", label: "3. 퇴사 후 계획", value: "", requried: true });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_1_1", label: "회사명:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_1_2", label: "직무:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_1_3", label: "직위:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_1_4", label: "연봉:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_2_1", label: "학교명:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_2_2", label: "전공:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_2_3", label: "학위:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_3_1", label: "업종:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_3_3_2", label: "사업체명:", value: "", requried: false });
		common.Survey.SurveyInfo.push({ id: "SURVEY_4", label: "4. 회사의 발전을 위해 바라는 점", value: "", requried: true });
		common.Survey.SurveyInfo.push({ id: "SURVEY_5", label: "5. 기타", value: "", requried: false });

		if (ty == "V") {
			var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
			var oPath =
				"/RetirementSurveySet/?$filter=Appno%20eq%20%27" +
				oController._vAppno +
				"%27" +
				"%20and%20Persa%20eq%20%27" +
				oController._vPersa +
				"%27";

			oModel.read(
				oPath,
				null,
				null,
				false,
				function (oData, oResponse) {
					if (oData && oData.results.length) {
						for (var i = 0; i < oData.results.length; i++) {
							common.Survey.SurveyInfo[i].value = oData.results[i].Rscrt;
						}
					}
				},
				function (oResponse) {
					common.Common.log(oResponse);
				}
			);
		}
	},

	onAfterOpen: function (oEvent) {
		var oController = common.Survey.oController;
		var oSubmitBtn = sap.ui.getCore().byId(oController.PAGEID + "_SUBMIT_BTN");

		if (common.Survey.Type == "V") {
			oSubmitBtn.setVisible(false);

			var RetireReasonCodes = ["10", "12", "28", "26", "20", "16", "24", "22", "14", "18", "30"];

			var v1 = common.Survey.SurveyInfo[0].value;
			for (var i = 0; i < RetireReasonCodes.length; i++) {
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_1_" + (i + 1));
				if (oControl) oControl.setEnabled(false);
				if (parseInt(v1) == parseInt(RetireReasonCodes[i])) {
					if (oControl) oControl.setSelected(true);
				} else {
					if (oControl) oControl.setSelected(false);
				}
			}
			var v1_1 = common.Survey.SurveyInfo[1].value;
			var oControl2 = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_1_11_TXT");
			if (oControl2) {
				oControl2.setValue(v1_1);
				oControl2.setEnabled(false);
			}

			var survey2 = [{ question: 3 }, { question: 3 }, { question: 3 }, { question: 3 }, { question: 3 }, { question: 2 }];
			var idx2 = 2;
			for (var s = 0; s < survey2.length; s++) {
				for (var q = 0; q < survey2[s].question; q++) {
					var v2 = common.Survey.SurveyInfo[idx2].value;

					for (var i = 0; i < 5; i++) {
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_2_" + (s + 1) + "_" + (q + 1) + "_" + (i + 1));
						if (oControl) oControl.setEnabled(false);
						if (parseInt(v2) == i + 1) {
							if (oControl) oControl.setSelected(true);
						} else {
							if (oControl) oControl.setSelected(false);
						}
					}
					idx2++;
				}
			}

			var v3 = common.Survey.SurveyInfo[19].value;
			for (var i = 0; i < 3; i++) {
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_3_" + (i + 1));
				if (oControl) oControl.setEnabled(false);
				if (parseInt(v3) == i + 1) {
					if (oControl) oControl.setSelected(true);
				} else {
					if (oControl) oControl.setSelected(false);
				}
			}

			var survey3 = [{ question: 4 }, { question: 3 }, { question: 2 }];
			var idx3 = 20;
			for (var s = 0; s < survey3.length; s++) {
				for (var q = 0; q < survey3[s].question; q++) {
					var v3_1 = common.Survey.SurveyInfo[idx3].value;
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_3_" + (s + 1) + "_" + (q + 1));
					if (oControl) {
						oControl.setEnabled(false);
						oControl.setValue(v3_1);
					}
					idx3++;
				}
			}

			var v4 = common.Survey.SurveyInfo[29].value;
			var oControl4 = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_4");
			if (oControl4) {
				oControl4.setEnabled(false);
				oControl4.setValue(v4);
			}

			var v5 = common.Survey.SurveyInfo[30].value;
			var oControl5 = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_5");
			if (oControl5) {
				oControl5.setEnabled(false);
				oControl5.setValue(v5);
			}
		} else {
			oSubmitBtn.setVisible(true);

			for (var i = 0; i < 12; i++) {
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_1_" + (i + 1));
				if (oControl) {
					oControl.setEnabled(true);
					oControl.setSelected(false);
				}
			}

			var survey2 = [{ question: 3 }, { question: 3 }, { question: 3 }, { question: 3 }, { question: 3 }, { question: 2 }];
			for (var s = 0; s < survey2.length; s++) {
				for (var q = 0; q < survey2[s].question; q++) {
					for (var i = 0; i < 5; i++) {
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_2_" + (s + 1) + "_" + (q + 1) + "_" + (i + 1));
						if (oControl) {
							oControl.setEnabled(true);
							oControl.setSelected(false);
						}
					}
				}
			}

			var survey3 = [{ question: 4 }, { question: 3 }, { question: 2 }];
			for (var s = 0; s < survey3.length; s++) {
				for (var q = 0; q < survey3[s].question; q++) {
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_3_" + (s + 1) + "_" + (q + 1));
					if (oControl) {
						oControl.setEnabled(false);
						oControl.setValue("");
					}
				}
			}

			for (var i = 0; i < 3; i++) {
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_3_" + (i + 1));
				if (oControl) {
					oControl.setEnabled(true);
					oControl.setSelected(false);
				}
			}

			var oControl4 = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_4");
			if (oControl4) {
				oControl4.setEnabled(true);
				oControl4.setValue("");
			}

			var oControl5 = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_5");
			if (oControl5) {
				oControl5.setEnabled(true);
				oControl5.setValue("");
			}
		}
	},

	SurveyRadio1: function (oEvent) {
		var oControl = oEvent.getSource();
		var vKey = oControl.getKey();
		var vId = oControl.getId();
		var vGroupName = oControl.getGroupName();

		for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
			if (vGroupName == common.Survey.SurveyInfo[i].id) {
				common.Survey.SurveyInfo[i].value = vKey;
				break;
			}
		}

		/*
		 * 20160527 KYJ ��Ÿ �ٹ����� CODE ���� 11->30 , oInput getID ���� , Value �ʱ�ȭ
		 */
		var oController = common.Survey.oController;
		var oInput = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_1_11_TXT");

		if (vKey == "30") {
			if (oInput) oInput.setEnabled(true);
		} else {
			if (oInput) {
				oInput.setEnabled(false);
				oInput.setValue("");
			}
		}
	},

	SurveyRadio2: function (oEvent) {
		var oControl = oEvent.getSource();
		var vKey = oControl.getKey();
		var vGroupName = oControl.getGroupName();

		for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
			if (vGroupName == common.Survey.SurveyInfo[i].id) {
				common.Survey.SurveyInfo[i].value = vKey;
				break;
			}
		}
	},

	SurveyRadio3: function (oEvent) {
		var oController = common.Survey.oController;

		var oControl = oEvent.getSource();
		var vKey = oControl.getKey();

		var vGroupName = oControl.getGroupName();

		for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
			if (vGroupName == common.Survey.SurveyInfo[i].id) {
				common.Survey.SurveyInfo[i].value = vKey;
				break;
			}
		}

		var oInputs = [];
		oInputs.push([
			oController.PAGEID + "_SURVEY_3_1_1",
			oController.PAGEID + "_SURVEY_3_1_2",
			oController.PAGEID + "_SURVEY_3_1_3",
			oController.PAGEID + "_SURVEY_3_1_4"
		]);
		oInputs.push([oController.PAGEID + "_SURVEY_3_2_1", oController.PAGEID + "_SURVEY_3_2_2", oController.PAGEID + "_SURVEY_3_2_3"]);
		oInputs.push([oController.PAGEID + "_SURVEY_3_3_1", oController.PAGEID + "_SURVEY_3_3_2"]);

		if (vKey == "1") {
			for (var i = 0; i < oInputs[0].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[0][i]);
				if (oInput) oInput.setEnabled(true);
			}
			for (var i = 0; i < oInputs[1].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[1][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
			for (var i = 0; i < oInputs[2].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[2][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
		} else if (vKey == "2") {
			for (var i = 0; i < oInputs[0].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[0][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
			for (var i = 0; i < oInputs[1].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[1][i]);
				if (oInput) oInput.setEnabled(true);
			}
			for (var i = 0; i < oInputs[2].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[2][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
		} else if (vKey == "3") {
			for (var i = 0; i < oInputs[0].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[0][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
			for (var i = 0; i < oInputs[1].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[1][i]);
				if (oInput) {
					oInput.setEnabled(false);
					oInput.setValue("");
				}
			}
			for (var i = 0; i < oInputs[2].length; i++) {
				var oInput = sap.ui.getCore().byId(oInputs[2][i]);
				if (oInput) oInput.setEnabled(true);
			}
		}
	},

	onChangeText: function (oEvent) {
		var oController = common.Survey.oController;
		var oControl = oEvent.getSource();
		var vId = oControl.getId();

		var vControlId = vId.replace(oController.PAGEID + "_", "");

		for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
			if (vControlId == common.Survey.SurveyInfo[i].id) {
				common.Survey.SurveyInfo[i].value = oControl.getValue();
				break;
			}
		}
	},

	onPressSurveyConfirm: function (oEvent) {
		var oController = common.Survey.oController;

		var vMsg = "[&ITEM&] 항목을 선택/입력 하여 주시기 바랍니다.";

		for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
			if (common.Survey.SurveyInfo[i].requried) {
				if (common.Survey.SurveyInfo[i].value == "") {
					sap.m.MessageBox.alert(vMsg.replace("&ITEM&", common.Survey.SurveyInfo[i].label));
					return;
				}
			}

			if (common.Survey.SurveyInfo[i].id == "SURVEY_1" && common.Survey.SurveyInfo[i].value == "11") {
				for (var j = 0; j < common.Survey.SurveyInfo.length; j++) {
					if (common.Survey.SurveyInfo[j].id == "SURVEY_1_11_TXT") {
						if (common.Survey.SurveyInfo[j].value == "") {
							sap.m.MessageBox.alert(vMsg.replace("&ITEM&", common.Survey.SurveyInfo[j].label));
							return;
						}
						break;
					}
				}
			}

			if (common.Survey.SurveyInfo[i].id == "SURVEY_3") {
				if (common.Survey.SurveyInfo[i].value == "1") {
					for (var j = 0; j < common.Survey.SurveyInfo.length; j++) {
						if (
							common.Survey.SurveyInfo[j].id == "SURVEY_3_1_1" ||
							common.Survey.SurveyInfo[j].id == "SURVEY_3_1_2" ||
							common.Survey.SurveyInfo[j].id == "SURVEY_3_1_3" ||
							common.Survey.SurveyInfo[j].id == "SURVEY_3_1_4"
						) {
							if (common.Survey.SurveyInfo[j].value == "") {
								sap.m.MessageBox.alert(vMsg.replace("&ITEM&", common.Survey.SurveyInfo[j].label));
								return;
							}
						}
					}
				} else if (common.Survey.SurveyInfo[i].value == "2") {
					for (var j = 0; j < common.Survey.SurveyInfo.length; j++) {
						if (
							common.Survey.SurveyInfo[j].id == "SURVEY_3_2_1" ||
							common.Survey.SurveyInfo[j].id == "SURVEY_3_2_2" ||
							common.Survey.SurveyInfo[j].id == "SURVEY_3_2_3"
						) {
							if (common.Survey.SurveyInfo[j].value == "") {
								sap.m.MessageBox.alert(vMsg.replace("&ITEM&", common.Survey.SurveyInfo[j].label));
								return;
							}
						}
					}
				} else if (common.Survey.SurveyInfo[i].value == "3") {
					for (var j = 0; j < common.Survey.SurveyInfo.length; j++) {
						if (common.Survey.SurveyInfo[j].id == "SURVEY_3_3_1" || common.Survey.SurveyInfo[j].id == "SURVEY_3_3_2") {
							if (common.Survey.SurveyInfo[j].value == "") {
								sap.m.MessageBox.alert(vMsg.replace("&ITEM&", common.Survey.SurveyInfo[j].label));
								return;
							}
						}
					}
				}
			}
		}

		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		var oPath = "/RetirementSurveySet";

		var SaveSurveyProcess = function () {
			var process_result = true;

			for (var i = 0; i < common.Survey.SurveyInfo.length; i++) {
				try {
					var createData = {};
					createData.Persa = oController._vPersa;
					createData.Appno = oController._vAppno;
					createData.Pernr = oController._vPernr;
					createData.Seqnr = i + 1 + "";
					createData.Rscrt = common.Survey.SurveyInfo[i].value;

					oModel.create(
						oPath,
						createData,
						null,
						function (oData, response) {
							process_result = true;
							common.Common.log("Sucess RetirementSurveySet Create !!!");
						},
						function (oError) {
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									common.Common.showErrorMessage(Err.error.message.value);
								}
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
						}
					);
				} catch (ex) {
					process_result = false;
					console.log(ex);
				}

				if (!process_result) {
					break;
				}
			}

			if (!process_result) {
				if (oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				return;
			}

			var oPath1 = "/RetirementApplicationAdministrationSet(Appno='" + oController._vAppno + "')";
			var updateData = {};
			updateData.Appno = oController._vAppno;
			updateData.Actty = "SV";
			updateData.Persa = oController._vPersa;
			updateData.Pernr = oController._vPernr;
			var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
			var oRC_Retda = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda");
			if (oRetda) {
				//				updateData.Retda = "\/Date(" + new Date(oRetda.getValue()).getTime() + ")\/";
				updateData.Retda = "/Date(" + common.Common.getTime(oRetda.getValue()) + ")/";
			} else {
				//				updateData.Retda = "\/Date(" + new Date(oRC_Retda.getValue()).getTime() + ")\/";
				updateData.Retda = "/Date(" + common.Common.getTime(oRC_Retda.getValue()) + ")/";
			}

			var process_result = false;

			oModel.update(
				oPath1,
				updateData,
				null,
				function (oData, response) {
					process_result = true;
					common.Common.log("Sucess RetirementApplicationAdministrationSet Update !!!");
				},
				function (oError) {
					var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if (Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(Err.error.message.value);
						}
					} else {
						common.Common.showErrorMessage(oError);
					}
					process_result = false;
				}
			);

			if (oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}

			if (!process_result) {
				return;
			}

			sap.m.MessageBox.alert("퇴직 설문을 제출하였습니다.", {
				title: "안내",
				onClose: function () {
					common.Survey.onRSClose();
					oController.setFinishedSurvey();
				}
			});
		};

		var onProcessing = function (oAction) {
			if (oAction === sap.m.MessageBox.Action.YES) {
				if (!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "처리중입니다. 잠시만 기다려 주십시오." }));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "처리중입니다. 잠시만 기다려 주십시오." }));
				}
				if (!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}

				setTimeout(SaveSurveyProcess, 300);
			}
		};

		sap.m.MessageBox.show("퇴직설문을 제출하시겠습니까?", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "퇴직설문",
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: onProcessing
		});
	},

	onRSClose: function (oEvent) {
		var oController = common.Survey.oController;

		if (oController._SurveyDialog.isOpen()) {
			oController._SurveyDialog.close();
		}
	}
};
