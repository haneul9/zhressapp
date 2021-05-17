sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "HighApply"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "HighApply",
		
        NationModel: new JSONModelHelper(),
		HighApplyModel: new JSONModelHelper(),
		
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
            this.HighApplyModel.setData({FormData: []});

            if(oEvent.data){
				this.HighApplyModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : oEvent.data.Child });
				if(oEvent.data.RowData){
					this.getSupportList();
					this.onChangeSupport();
				}
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
            var oRowData = this.HighApplyModel.getProperty("/FormData");

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

			if(RowData.Status === "AA" || !RowData.Status){
				vConvertYear = String(vZyear);

				Common.makeNumbersArray({length: 2}).forEach(function(idx) {
					vConvertYear = String(vZyear - idx);
					aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
				});
			}else{
				vConvertYear = String(vZyear + 1);
				aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
	
				Common.makeNumbersArray({length: 21}).forEach(function(idx) {
					vConvertYear = String(vZyear - idx);
					aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
				});
			}

            oController.HighApplyModel.setProperty("/FormData/Zyear", RowData.Zyear ? RowData.Zyear : String(vZyear));
            oController.HighApplyModel.setProperty("/YearCombo", aYears);
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
                        oController.HighApplyModel.setProperty("/SchoolCombo", oData.NavCommonCodeList.results);
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
            sendObject.ICodeT = "002";
			sendObject.ILangu =  "3";
            sendObject.ICodty = "BT710";
            // Navigation property
            sendObject.NavCommonCodeList = [];
            // 등록학기/분기
            oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                success: function(oData, oResponse) {
                    if (oData && oData.NavCommonCodeList) {
                        Common.log(oData);
                        var rDatas = oData.NavCommonCodeList.results,
                            oComboList = [];

                        rDatas.forEach(function(ele) {
                            var oComboData = {};
                            oComboData.Reccl = ele.Code;
                            oComboData.RecclT = ele.Text;
                            oComboList.push(oComboData);
                        });
                        
                        oController.HighApplyModel.setProperty("/CycleCombo", oComboList);
                    }
                },
                error: function(oResponse) {
                    Common.log(oResponse);
                    sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                }
            });

            if(!Common.checkNull(oController.HighApplyModel.getProperty("/FormData"))){

                sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs;
                sendObject.ICodeT = "004";
				sendObject.ILangu =  "3";
                sendObject.ISubCode = oController.HighApplyModel.getProperty("/FormData/SchoolType");
                sendObject.ICodty = "ZGRADE";
                // Navigation property
                sendObject.NavCommonCodeList = [];
                // 학년
                oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                    success: function(oData, oResponse) {
                        if (oData && oData.NavCommonCodeList) {
                            Common.log(oData);
                            oController.HighApplyModel.setProperty("/GradeCombo", oData.NavCommonCodeList.results);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });

                var oGradeCombo2 = $.app.byId(oController.PAGEID + "_GradeCombo2");
                var oMajorInput = $.app.byId(oController.PAGEID + "_MajorInput");

                // 학교구분이 전문대 or 대학교일 경우 학년제 & 전공명 field활성화
                if(oController.HighApplyModel.getProperty("/FormData/SchoolType") === "SC25" || oController.HighApplyModel.getProperty("/FormData/SchoolType") === "SC24"){
                    
                    sendObject = {};
                    // Header
                    sendObject.IPernr = vPernr;
                    sendObject.IBukrs = vBukrs;
                    sendObject.ICodeT = "001";
                    sendObject.ISubCode = oController.HighApplyModel.getProperty("/FormData/SchoolType");
                    sendObject.ICodty = "BT705";
					sendObject.ILangu =  "3";
                    // Navigation property
                    sendObject.NavCommonCodeList = [];
                    //학년제
                    oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
                        success: function(oData, oResponse) {
                            if (oData && oData.NavCommonCodeList) {
                                Common.log(oData);
                                oController.HighApplyModel.setProperty("/GradeCombo2", oData.NavCommonCodeList.results);
                            }
                        },
                        error: function(oResponse) {
                            Common.log(oResponse);
                            sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                title: oController.getBundleText("LABEL_09030")
                            });
                        }
                    });
                }else {
                    oController.HighApplyModel.setProperty("/GradeCombo2", []);
                    oGradeCombo2.setEditable(false);
                    oMajorInput.setEditable(false);
                }
            }
		},

        getSupportList: function(oEvent) { //학교구분 선택
			var oController = this.getView().getController();
			var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oGradeCombo2 = $.app.byId(oController.PAGEID + "_GradeCombo2");
			var oMajorInput = $.app.byId(oController.PAGEID + "_MajorInput");
			var vPernr = oController.getUserId();
            var vBukrs = oController.HighApplyModel.getProperty("/FormData/Bukrs") ? oController.HighApplyModel.getProperty("/FormData/Bukrs") : oController.getUserGubun();
			var vKey = oEvent ? oEvent.getSource().getSelectedKey() : oController.HighApplyModel.getProperty("/FormData/SchoolType");

			if(oEvent){
				oController.HighApplyModel.setProperty("/FormData/SGubun", ""); // 지원유형 
				oController.HighApplyModel.setProperty("/FormData/Grade", ""); // 학년
				oController.HighApplyModel.setProperty("/FormData/Grdrl", ""); // 학년제
				oController.HighApplyModel.setProperty("/FormData/Majcd", ""); // 전공명
				oController.HighApplyModel.setProperty("/FormData/Reccl", ""); // 수혜주기
				oController.HighApplyModel.setProperty("/CycleCombo", []); // 수혜주기Combo
			}

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.ISubCode = vKey;
			sendObject.ICodeT = "019";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			// 지원유형 
			oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NavCommonCodeList) {
						Common.log(oData);
						oController.HighApplyModel.setProperty("/SupportCombo", oData.NavCommonCodeList.results);
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
			sendObject.ISubCode = vKey;
			sendObject.ICodty = "ZGRADE";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			// 학년
			oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NavCommonCodeList) {
						Common.log(oData);
						oController.HighApplyModel.setProperty("/GradeCombo", oData.NavCommonCodeList.results);
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
			sendObject.ISchoolType = vKey;
			sendObject.IRelation = oController.HighApplyModel.getProperty("/FormData/Relation");
			// Navigation property
			sendObject.EducationfundBaseTableIn = [];
			// 수혜주기
			oModel.create("/EducationfundBaseSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.EducationfundBaseTableIn) {
						Common.log(oData);
						var vResult = oData.EducationfundBaseTableIn.results;
						var oComboList = [];
						
						vResult.forEach(function(e) {
							if(oComboList.length === 0 || oComboList[oComboList.length-1].Schsb !== e.Schsb){
								var oComboData = {};
								oComboData.Schsb = e.Schsb;
								oComboData.SchsbT = e.SchsbT;
								oComboList.push(oComboData);
							}
						});
						
						oController.HighApplyModel.setProperty("/SupportCombo", oComboList);
						oController.HighApplyModel.setProperty("/HiddenData", vResult);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});

			// 학교구분이 전문대 or 대학교일 경우 학년제 & 전공명 field활성화
			if(vKey === "SC25" || vKey === "SC24"){
				sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IBukrs = vBukrs;
				sendObject.ICodeT = "001";
				sendObject.ISubCode = vKey;
				sendObject.ICodty = "BT705";
				sendObject.ILangu =  "3";
				// Navigation property
				sendObject.NavCommonCodeList = [];
				//학년제
				oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
					success: function(oData, oResponse) {
						if (oData && oData.NavCommonCodeList) {
							Common.log(oData);
							oController.HighApplyModel.setProperty("/GradeCombo2", oData.NavCommonCodeList.results);

							if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/Status") || oController.HighApplyModel.getProperty("/FormData/Status") === "AA")){
								oGradeCombo2.setEditable(true);
								oMajorInput.setEditable(true);
							}
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}else {
				oController.HighApplyModel.setProperty("/GradeCombo2", []);
				oGradeCombo2.setEditable(false);
				oMajorInput.setEditable(false);
			}
		},

        onChangeSupport: function(oEvent) { // 지원유형 선택시 수혜주기 값 호출
			var oController = this.getView().getController();
			var oHiddenData = oController.HighApplyModel.getProperty("/HiddenData");
			var vKey = oEvent ? oEvent.getSource().getSelectedKey() : oController.HighApplyModel.getProperty("/FormData/SGubun")
			var oLoadData = [];

			oHiddenData.forEach(function(ele) {
				if(vKey === ele.Schsb){
					oLoadData.push(ele);
				}
			});
			oController.HighApplyModel.setProperty("/CycleCombo", oLoadData);
		},

        onSearchNation: function() { // 첨단(국가검색)
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.m.HighApply");

			if (!this._NationModel) {
				this._NationModel = sap.ui.jsfragment("ZUI5_HR_StudentFundsApplyHASS.m.fragment.SearchNation", this);
				oView.addDependent(this._NationModel);
			}

			this._NationModel.open();
		},

		onSearchNationBtn: function(oEvent) { // 국가검색창에 검색
			var oController = this;
			var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = this.getUserId();
            var vBukrs = this.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.ICodeT = "009";
			sendObject.IText = oEvent.mParameters.value ? oEvent.mParameters.value : "";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			// 국가 검색
			oCodeModel.create("/CommonCodeListHeaderSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NavCommonCodeList) {
						Common.log(oData);
						oController.NationModel.setData({Data: oData.NavCommonCodeList.results});
					}else
						oController.NationModel.setData({Data: []});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onConfirmNationBtn: function(oEvent) { // 국가검색에 결과값 선택시
			var vNationText = oEvent.getParameter("selectedItem").mProperties.description;
			var vNationPath = oEvent.getParameters().selectedItem.oBindingContexts.undefined.getPath();

			this.HighApplyModel.setProperty("/FormData/SchcoT", vNationText);
			this.HighApplyModel.setProperty("/FormData/Schco", this.NationModel.getProperty(vNationPath).Code);
		},

        getHighCost1: function(oEvent) { // 입학금(첨단)
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.HighApplyModel.setProperty("/FormData/EreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getHighCostSum();
		},

		getHighCost2: function(oEvent) { // 수업료(첨단)
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.HighApplyModel.setProperty("/FormData/FreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getHighCostSum();
		},

		getHighCost3: function(oEvent) { // 운영회비(첨단)
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.HighApplyModel.setProperty("/FormData/DreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			this.getHighCostSum();
		},

		getHighCostSum: function() { // 신청금액(첨단)
			var Cost1 = this.HighApplyModel.getProperty("/FormData/EreqAmt") ? parseInt(this.HighApplyModel.getProperty("/FormData/EreqAmt")) : 0 ,
				Cost2 = this.HighApplyModel.getProperty("/FormData/FreqAmt") ? parseInt(this.HighApplyModel.getProperty("/FormData/FreqAmt")) : 0 ,
				Cost3 = this.HighApplyModel.getProperty("/FormData/DreqAmt") ? parseInt(this.HighApplyModel.getProperty("/FormData/DreqAmt")) : 0 ;

			var vSum = Cost1 + Cost2 + Cost3;

			this.HighApplyModel.setProperty("/FormData/ReqSum", String(vSum));
		},

		getScholarship: function(oEvent) { // 장학금(첨단)
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.HighApplyModel.setProperty("/FormData/Scham", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));
		},
		
		getExcepAmount: function(oEvent) { // 기타금액(첨단)
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.HighApplyModel.setProperty("/FormData/ReqAmt1", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));
		},

        checkError: function(oController) {

            var oGradeCombo2 = $.app.byId(oController.PAGEID + "_GradeCombo2");

            // 학교구분
            if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/SchoolType"))){
                MessageBox.error(oController.getBundleText("MSG_38008"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 지원유형
            if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/SGubun"))){
                MessageBox.error(oController.getBundleText("MSG_38019"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 학년
            if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/Grade"))){
                MessageBox.error(oController.getBundleText("MSG_38014"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 학교명
            if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/SchoolName"))){
                MessageBox.error(oController.getBundleText("MSG_38009"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 학년제
            if(oGradeCombo2.getEditable() === true && Common.checkNull(oController.HighApplyModel.getProperty("/FormData/Grdrl"))){
                MessageBox.error(oController.getBundleText("MSG_38015"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 전공명
            if(oGradeCombo2.getEditable() === true && Common.checkNull(oController.HighApplyModel.getProperty("/FormData/Majcd"))){
                MessageBox.error(oController.getBundleText("MSG_38016"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 신청금액
            if(Common.checkNull(oController.HighApplyModel.getProperty("/FormData/ReqSum")) || oController.HighApplyModel.getProperty("/FormData/ReqSum") === "0"){
                MessageBox.error(oController.getBundleText("MSG_38017"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

            // 첨부파일
            if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "2") === 0) {
                MessageBox.error(oController.getBundleText("MSG_38012"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            };

			return false;
		},

        onHighDialogApplyBtn: function() { // 신청
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.HighApplyModel.getProperty("/FormData");

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
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "2");
					
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38001"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38044"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onHighDialogSaveBtn: function() { // 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.HighApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date();
			delete oRowData.Regno;

			if(this.checkError(this)) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38048")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "2");

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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38003"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38048"), oController.getBundleText("LABEL_00119")],
				onClose: onPressSave
			});
        },

        onHighDialogDelBtn: function() { // 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();
			var oRowData = this.HighApplyModel.getProperty("/FormData");

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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38005"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38047"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
        },

        onBeforeOpenDetailDialog: function(oController) {
			var vStatus = oController.HighApplyModel.getProperty("/FormData/Status"),
				vAppnm = oController.HighApplyModel.getProperty("/FormData/Appnm") || "";
			var vNo="2";
            fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
                Appnm: vAppnm,
                Required: true,
                Mode: "M",
                Max: "3",
                Editable: (!vStatus || vStatus === "AA") ? true : false,
            },vNo);
			fragment.COMMON_ATTACH_FILES.resizingLabel.call(oController,vNo);
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20001008 20190204
		} : null
	});
});