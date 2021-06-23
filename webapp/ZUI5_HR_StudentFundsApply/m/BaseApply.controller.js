sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"fragment/COMMON_ATTACH_FILES"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, FileHandler) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "BaseApply"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "BaseApply",
		
		ApplyModel: new JSONModelHelper(),
		
		getUserId: function() {

			return $.app.getController().getUserId();
		},
		
		getUserGubun  : function() {

			return $.app.getController().getUserGubun();
        },
		
		onInit: function () {

			this.setupView();

			this.getView()
				.addEventDelegate({
					onBeforeShow: this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
		},
		
		onBeforeShow: function(oEvent) {
			BusyIndicator.show(0);
			
            this.ApplyModel.setData({FormData: []});
            
            if(oEvent.data){
                this.ApplyModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : [] });
                this.ApplyModel.setProperty("/NameCombo", oEvent.data.Child );
                if(!oEvent.data.RowData && Common.checkNull(!this.ApplyModel.getProperty("/NameCombo")[0])){
                    this.ApplyModel.setProperty("/FormData/NameKor", this.ApplyModel.getProperty("/NameCombo")[0].Fname);
                    this.ApplyModel.setProperty("/FormData/RelationTx", this.ApplyModel.getProperty("/NameCombo")[0].KdsvhT);
                }
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
            var oRowData = this.ApplyModel.getProperty("/FormData") ? this.ApplyModel.getProperty("/FormData") : [];

            this.onBeforeOpenDetailDialog(this);
            this.setZyears(oRowData);
            this.getComboCodeList(oRowData);
			BusyIndicator.hide();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

        setZyears: function(RowData) {
            var oController = this.getView().getController();
			var vZyear = new Date().getFullYear(),
				vConvertYear = "",
				aYears = [];

            vConvertYear = String(vZyear + 1);
            aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
            });

            oController.ApplyModel.setProperty("/FormData/Zyear", RowData.Zyear ? RowData.Zyear : String(vZyear));
            oController.ApplyModel.setProperty("/YearCombo", aYears);
		},

        changeRelation: function(oEvent) { // 성명Combo
            var oController = this;

			this.ApplyModel.getProperty("/NameCombo").some(function(e) {
				oController.ApplyModel.setProperty("/FormData/RelationTx", e.KdsvhT);
				oController.ApplyModel.setProperty("/FormData/Relation", e.Relation);
				
				return e.Fname === oEvent.getSource().getValue();
			});
		},

        getComboCodeList: function(oRowData) {
			var oController = this.getView().getController();
			var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = this.getUserId();
            var vBukrs = oRowData.Bukrs ? oRowData.Bukrs : this.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.ICodeT = "001";
			sendObject.ICodty = "BT740";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			//학교구분
			oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NavCommonCodeList) {
						Common.log(oData);
                        oController.ApplyModel.setProperty("/SchoolCombo", oData.NavCommonCodeList.results);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
            sendObject = {};
            // Header
            sendObject.IPernr = vPernr;
            sendObject.IBukrs = vBukrs;
            sendObject.ICodeT = "004";
            sendObject.ICodty = "ZGRADE";
			sendObject.ILangu =  "3";
            // Navigation property
            sendObject.NavCommonCodeList = [];
            // 학년
            oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                success: function(oData, oResponse) {
                    if (oData && oData.NavCommonCodeList) {
                        Common.log(oData);
                        oController.ApplyModel.setProperty("/GradeCombo", oData.NavCommonCodeList.results);
                    }
                },
                error: function(oResponse) {
                    Common.log(oResponse);
                    sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }
            });

            sendObject = {};
            // Header
            sendObject.IPernr = vPernr;
            sendObject.IBukrs = vBukrs;
            sendObject.ICodeT = "019";
			sendObject.ILangu =  "3";
            // Navigation property
            sendObject.NavCommonCodeList = [];
            // 구분
            oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                success: function(oData, oResponse) {
                    if (oData && oData.NavCommonCodeList) {
                        Common.log(oData);
                        oController.ApplyModel.setProperty("/GubunCombo", oData.NavCommonCodeList.results);
                    }
                },
                error: function(oResponse) {
                    Common.log(oResponse);
                    sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }
            });

            sendObject = {};
            // Header
            sendObject.IPernr = vPernr;
            sendObject.IBukrs = vBukrs;
            sendObject.ICodeT = "004";
			sendObject.ILangu =  "3";
            sendObject.ICodty = "ZQUART";
            // Navigation property
            sendObject.NavCommonCodeList = [];
            // 등록학기/분기
            oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                success: function(oData, oResponse) {
                    if (oData && oData.NavCommonCodeList) {
                        Common.log(oData);
                        oController.ApplyModel.setProperty("/SemesterCombo", oData.NavCommonCodeList.results);
                    }
                },
                error: function(oResponse) {
                    Common.log(oResponse);
                    sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }
            });
		},

        getCost1: function(oEvent) { // 입학금
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/EreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));	

			this.getCostSum();		
		},

		getCost2: function(oEvent) { // 수업료
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/FreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost3: function(oEvent) { //육성회비
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/UreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost4: function(oEvent) { // 학교운영지원비
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/DreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost5: function(oEvent) { // 학생회비
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/SreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost6: function(oEvent) { // 자율학습비
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/SsreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost7: function(oEvent) { // 보충수업
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/AreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCost8: function(oEvent) { // 기타1
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/ReqAmt1", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getCostSum();
		},

		getCostSum: function() { // 신청금액
			var Cost1 = this.ApplyModel.getProperty("/FormData/EreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/EreqAmt")) : 0 ,
				Cost2 = this.ApplyModel.getProperty("/FormData/FreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/FreqAmt")) : 0 ,
				Cost3 = this.ApplyModel.getProperty("/FormData/UreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/UreqAmt")) : 0 ,
				Cost4 = this.ApplyModel.getProperty("/FormData/DreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/DreqAmt")) : 0 ,
				Cost5 = this.ApplyModel.getProperty("/FormData/SreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/SreqAmt")) : 0 ,
				Cost6 = this.ApplyModel.getProperty("/FormData/SsreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/SsreqAmt")) : 0 ,
				Cost7 = this.ApplyModel.getProperty("/FormData/AreqAmt") ? parseInt(this.ApplyModel.getProperty("/FormData/AreqAmt")) : 0 ,
				Cost8 = this.ApplyModel.getProperty("/FormData/ReqAmt1") ? parseInt(this.ApplyModel.getProperty("/FormData/ReqAmt1")) : 0 ;

			var vSum = Cost1 + Cost2 + Cost3 + Cost4 + Cost5 + Cost6 + Cost7 + Cost8;

			this.ApplyModel.setProperty("/FormData/ReqSum", String(vSum));
			this.ApplyModel.setProperty("/FormData/AdmSum", String(vSum));
		},

        checkError: function(oController) {

            // 구분
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SGubun"))){
                MessageBox.error(oController.getBundleText("MSG_38007"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 학교구분
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SchoolType"))){
                MessageBox.error(oController.getBundleText("MSG_38008"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 학년
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Grade"))){
                MessageBox.error(oController.getBundleText("MSG_38014"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 학교명
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SchoolName"))){
                MessageBox.error(oController.getBundleText("MSG_38009"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 납부일자
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Paydt"))){
                MessageBox.error(oController.getBundleText("MSG_38010"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 신청금액
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/ReqSum")) || oController.ApplyModel.getProperty("/FormData/ReqSum") === "0"){
                MessageBox.error(oController.getBundleText("MSG_38017"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 비고
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Remark"))){
                MessageBox.error(oController.getBundleText("MSG_38011"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 첨부파일
            if(FileHandler.getFileLength(oController, "001") === 0) {
                MessageBox.error(oController.getBundleText("MSG_38012"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

			return false;
		},

        onDialogApplyBtn: function() { // 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date(),
			oRowData.Waers = "KRW",
			delete oRowData.Regno;

			if(this.checkError(this)) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38044")) { // 신청

					// 첨부파일 저장
					oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
					
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "3";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38002"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38001"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38044"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onDialogSaveBtn: function() { // 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date();
			delete oRowData.Regno;

			if(this.checkError(this)) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38048")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "2";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38004"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38003"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38048"), oController.getBundleText("LABEL_00119")],
				onClose: onPressSave
			});
        },

        onDialogDelBtn: function() { // 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.ApplyModel.getProperty("/FormData");

			delete oRowData.Regno;

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38047")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38006"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38005"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38047"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
        },

        onBeforeOpenDetailDialog: function(oController) {
			var vStatus = oController.ApplyModel.getProperty("/FormData/Status"),
				vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";
			var vNo="1";
            FileHandler.setAttachFile(oController, {
                Appnm: vAppnm,
                Required: true,
                Mode: "M",
                Max: "3",
                Editable: (!vStatus || vStatus === "AA") ? true : false
            },vNo);
			FileHandler.resizingLabel.call(oController,vNo);
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20001008 20190204
		} : null
	});
});