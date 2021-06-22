/* eslint-disable no-undef */
sap.ui.define([
	"common/Common",	//
	"common/CommonController",
	"common/JSONModelHelper",
	"./delegate/ViewTemplates",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, ViewTemplates, MessageBox, BusyIndicator) {
	"use strict";
	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		CostModel: new JSONModelHelper(),
		FinishModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs3");
        },
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
		},
		
		onBeforeShow: function() {
			var oView = $.app.byId("ZUI5_HR_DispatchLivingCost.Page");
			this._CostApplyModel = sap.ui.jsfragment("ZUI5_HR_DispatchLivingCost.fragment.CostApply", this);
			oView.addDependent(this._CostApplyModel);
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));

			this.onTableSearch();
        },
		
        getChoice: function() {
            var oController = $.app.getController();

            return new sap.m.CheckBox({
                select: oController.onChecked.bind(oController),
                selected: {
                    path: "Check",
                    formatter: function(v) {
                        return v === "X";
                    }
                },
                visible : {
                    path : "Zflag", 
                    formatter : function(fVal){
                        return fVal === "X";
                    }
                }
            });
        },

        onChecked: function(oEvent) { // Checkbox선택시 다른Checkbox 비활성화
			var oController = this;
			var vIndex = oEvent.getSource().mBindingInfos.selected.binding.oContext.getPath().slice(6);

			oController.FinishModel.setData({FormData: []});

			this.TableModel.getProperty("/Data").forEach(function(ele, index) {
				if(index === parseInt(vIndex) && oEvent.getSource().getSelected() === true){
					oController.TableModel.setProperty("/Data/" + index + "/Check", "X");
					oController.FinishModel.setData({FormData: ele});
				}else
					oController.TableModel.setProperty("/Data/" + index + "/Check", "");
			});
        },

        getLocation: function() {
            return new sap.m.Text({
                text: {
                    parts: [{ path: "ZfwkpsT" }, { path: "ZtwkpsT" }],
                    formatter: function(v1, v2) {
                        if(v1) return v1 + " → " + v2;
                        else return "";
                    }
                }
            });
        },

        getCostPlace: function() {
            return new sap.m.Text({
                text: {
                    parts: [{ path: "ZwkplsT" }, { path: "ZlfplsT" }],
                    formatter: function(v1, v2) {
                        if(v1) return v1 + " → " + v2;
                        else return "";
                    }
                }
            });
        },

        getDatepicker: function() {
            return new sap.m.Text({
				text: {
					parts: [{ path: "Zscsym" }, { path: "Zsceym" }],
					formatter: function (v1, v2) {
						if (!v1 || !v2) return "";

						v1 = v1.substr(0,4) + "-" + v1.substr(4);
						v2 = v2.substr(0,4) + "-" + v2.substr(4);

						return v1 + " ~ " + v2;
					}
				},
				textAlign: "Center"
			});
        },

		getEalryDate: function() {
			return new sap.m.Text({
				text: {
					path: "Zseeym",
					formatter: function (v) {
						if (!v || v === "000000") return "";
						v = v.substr(0,4) + "-" + v.substr(4);

						return v;
					}
				},
				textAlign: "Center"
			});
		},
		
		getLabel: function() {
			return ViewTemplates.getLabel("header", "{i18n>LABEL_59013}", "150px"); // 파견자 생활경비
		},

        getStatus: function() {
            var oController = $.app.getController();

            return 	new sap.m.FlexBox({
                justifyContent: "Center",
                items: [
                    new sap.ui.commons.TextView({
                        text : "{StatusT}", 
                        textAlign : "Center",
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal !== "AA") return true;
                                else return false;
                            }
                        }
                    })
                    .addStyleClass("font-14px font-regular mt-4px"),
                    new sap.m.FlexBox({
                        justifyContent: "Center",
                        items: [
                            new sap.ui.commons.TextView({ //처리결과에 Text
                                text : "{StatusT}", 
                                textAlign : "Center"
                            })
                            .addStyleClass("font-14px font-regular mt-7px"),
                            new sap.m.Button({ //처리결과에 삭제 버튼
                                text: "{i18n>LABEL_38047}",
                                press : oController.onPressCancel
                            })
                            .addStyleClass("button-light-sm ml-10px")
                        ],
                        visible : {
                            path : "Status", 
                            formatter : function(fVal){
                                if(fVal === "AA") return true;
                                else return false;
                            }
                        }
                    })
                ]
            });
        },

		onPressSer: function() {
			this.onTableSearch();
		},

        onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			
            oController.TableModel.setData({Data: []}); 

			var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs;
			sendObject.IEmpid = vPernr;
            sendObject.IConType = "1";
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
			// Navigation property
			sendObject.DispatchApplyExport = [];
			sendObject.DispatchApplyTableIn1 = [];
			
			oModel.create("/DispatchApplySet", sendObject, {
				success: function(oData) {
					
					if (oData && oData.DispatchApplyTableIn1) {
						Common.log(oData);
						var rDatas = oData.DispatchApplyTableIn1.results;
						oController.TableModel.setData({Data: rDatas}); 
					}
                    
                    oController.LogModel.setData({Data: oData.DispatchApplyExport.results[0]});
					if(oData.DispatchApplyExport.results[0].EClose === "X"){
						sap.m.MessageBox.alert(oController.getBundleText("MSG_00072"), { title: oController.getBundleText("MSG_08107")});
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
			Common.adjustAutoVisibleRowCount.call(oTable);
        },

		onPressReq: function() { //신청
			var oFilesB = $.app.byId(this.PAGEID + "_FilesBox"),
				oFileB = $.app.byId(this.PAGEID + "_FileFlexBox"),
				oEarlyYears = $.app.byId(this.PAGEID + "_EarlyYears"),
				oEarlyMonth = $.app.byId(this.PAGEID + "_EarlyMonth");
				
			oFilesB.setVisible(true);
			oFileB.setVisible(false);
			oEarlyYears.setEditable(false);
			oEarlyMonth.setEditable(false);
			this.ApplyModel.setData({FormData: []});
            this.ApplyModel.setProperty("/FormData/Begda", new Date());
			this.ApplyModel.setProperty("/FormData/Zmuflg", "1");
			this.ApplyModel.setProperty("/EarlyApp", "");

			this.setZyears(this);
			this.setZmonths(this);
            this.getLocationList();
		    // this.onBeforeOpenDetailDialog();
			this._CostApplyModel.open();
		},

        onPressEnd: function() { // 조기 종료 신청
			var oController = this;
			var oFilesB = $.app.byId(this.PAGEID + "_FilesBox"),
				oFileB = $.app.byId(this.PAGEID + "_FileFlexBox"),
				oEarlyYears = $.app.byId(this.PAGEID + "_EarlyYears"),
				oEarlyMonth = $.app.byId(this.PAGEID + "_EarlyMonth");
				
			if(this.TableModel.getProperty("/Data").every(function(e) { return Common.checkNull(e.Check);})){
				sap.m.MessageBox.alert(oController.getBundleText("MSG_59016"), {
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}

			var oRowData = $.extend(true, {}, this.FinishModel.getProperty("/FormData"));
			oEarlyYears.setEditable(true);
			oEarlyMonth.setEditable(true);
			oFilesB.setVisible(false);
			oFileB.setVisible(true);

			this.ApplyModel.setData({FormData: oRowData});

			this.setZyears(this);
			this.setZmonths(this);
			this.ApplyModel.setProperty("/EarlyApp", "X");
			this.ApplyModel.setProperty("/FormData/RangYearB", oRowData.Zscsym.slice(0,4));
			this.ApplyModel.setProperty("/FormData/RangMonthB", oRowData.Zscsym.slice(4));
			this.ApplyModel.setProperty("/FormData/RangYearsE", oRowData.Zsceym.slice(0,4));
			this.ApplyModel.setProperty("/FormData/RangMonthE", oRowData.Zsceym.slice(4));
			this.ApplyModel.setProperty("/FormData/EarlyYears", Common.checkNull(oRowData.Zseeym) || oRowData.Zseeym === "000000" ? "" : oRowData.Zseeym.slice(0,4));
			this.ApplyModel.setProperty("/FormData/EarlyMonth", Common.checkNull(oRowData.Zseeym) || oRowData.Zseeym === "000000" ? "" : oRowData.Zseeym.slice(4));
			this.getDispatchCost();
            this.getLocationList();
		    // this.onBeforeOpenDetailDialog();
			this._CostApplyModel.open();
        },
		
		onSelectedRow: function(oEvent) {
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var oCopiedRow = $.extend(true, {}, oRowData);
			var oFilesB = $.app.byId(oController.PAGEID + "_FilesBox"),
				oFileB = $.app.byId(oController.PAGEID + "_FileFlexBox");
			var oEarlyYears = $.app.byId(oController.PAGEID + "_EarlyYears"),
				oEarlyMonth = $.app.byId(oController.PAGEID + "_EarlyMonth");
				
				
				
			oController.ApplyModel.setData({FormData: oCopiedRow});
			oController.setZyears(oController);
			oController.setZmonths(oController);
				
			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zseeym")) || oController.ApplyModel.getProperty("/FormData/Zseeym") === "000000"){
				oController.ApplyModel.setProperty("/EarlyApp", "");
				oFilesB.setVisible(true);
				oFileB.setVisible(false);
				oEarlyYears.setEditable(false);
				oEarlyMonth.setEditable(false);
			}else{
				oController.ApplyModel.setProperty("/EarlyApp", "X");
				oFilesB.setVisible(false);
				oFileB.setVisible(true);
				oEarlyYears.setEditable(true);
				oEarlyMonth.setEditable(true);
			}

			oController.ApplyModel.setProperty("/FormData/RangYearB", oCopiedRow.Zscsym.slice(0,4));
			oController.ApplyModel.setProperty("/FormData/RangMonthB", oCopiedRow.Zscsym.slice(4));
			oController.ApplyModel.setProperty("/FormData/RangYearsE", oCopiedRow.Zsceym.slice(0,4));
			oController.ApplyModel.setProperty("/FormData/RangMonthE", oCopiedRow.Zsceym.slice(4));
			oController.ApplyModel.setProperty("/FormData/EarlyYears", Common.checkNull(oCopiedRow.Zseeym) || oRowData.Zseeym === "000000" ? "" : oCopiedRow.Zseeym.slice(0,4));
			oController.ApplyModel.setProperty("/FormData/EarlyMonth", Common.checkNull(oCopiedRow.Zseeym) || oRowData.Zseeym === "000000" ? "" : oCopiedRow.Zseeym.slice(4));
			oController.getDispatchCost();
            oController.getLocationList();
			// oController.onBeforeOpenDetailDialog();
			oController._CostApplyModel.open();
		},

		setZyears: function(oController) {
			var vZyear = new Date().getFullYear(),
				vConvertYear = "",
				aYears = [];

			vConvertYear = String(vZyear - 1);
			aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });

			Common.makeNumbersArray({length: 5}).forEach(function(idx) {
				vConvertYear = String(vZyear + idx);
				aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
			});

			oController.ApplyModel.setProperty("/RangYearsB", aYears);
			oController.ApplyModel.setProperty("/RangYearsE", aYears);
			oController.ApplyModel.setProperty("/EarlyYears", aYears);
		},
		
		setZmonths: function(oController) {
			var vConvertMonth = "",
				aMonths = [];

			Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
				vConvertMonth = String(idx);
				aMonths.push({ Code: Common.lpad(vConvertMonth, "2"), Text: vConvertMonth + "월" });
			});

			oController.ApplyModel.setProperty("/RangMonthB", aMonths);
			oController.ApplyModel.setProperty("/RangMonthE", aMonths);
			oController.ApplyModel.setProperty("/EarlyMonth", aMonths);
		},

		getDispatchCost: function() { // 숙소비, 교통비, 회사금액
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vBukrs = oController.getUserGubun();
			var vPernr = oController.getUserId();
			var vZwkpls = oController.ApplyModel.getProperty("/FormData/Zwkpls"),
				vZlfpls = oController.ApplyModel.getProperty("/FormData/Zlfpls");

			var oSendRow = {
				Zwkpls: vZwkpls,
				Zlfpls: vZlfpls
			};

			oController.CostModel.setData({Data: []});

			var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs;
			sendObject.IEmpid = vPernr;
            sendObject.IConType = "7";
			// Navigation property
			sendObject.DispatchApplyTableIn1 = [oSendRow];
			
			oModel.create("/DispatchApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.DispatchApplyTableIn1) {
						Common.log(oData);
						var rDatas = oData.DispatchApplyTableIn1.results;

						oController.CostModel.setData({Data: rDatas});
						oController.ApplyModel.setProperty("/FormData/Zssamt", rDatas[0].Zssamt);
						oController.ApplyModel.setProperty("/FormData/Ztramt", rDatas[0].Ztramt);
						oController.ApplyModel.setProperty("/FormData/Zcoamt", rDatas[0].Zcoamt);
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

        getLocationList: function() { // 지역정보
            var oController = $.app.getController();
            var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
            var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

            var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs;
			sendObject.IPernr = vPernr;
            sendObject.IConType = "0";
			// Navigation property
			sendObject.DispatchApplyTableIn2 = [];
			sendObject.DispatchApplyTableIn3 = [];
			
			oModel.create("/DispatchApplySet", sendObject, {
				success: function(oData) {
					Common.log(oData);
                    oController.ApplyModel.setProperty("/LocationCombo1", oData.DispatchApplyTableIn2.results);
                    oController.ApplyModel.setProperty("/LocationCombo2", oData.DispatchApplyTableIn2.results);
                    oController.ApplyModel.setProperty("/LocationCombo3", oData.DispatchApplyTableIn3.results);
                    oController.ApplyModel.setProperty("/LocationCombo4", oData.DispatchApplyTableIn3.results);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },

		checkLocation1: function(oEvent) {
			this.checkLocation_1(oEvent);
		},

		checkLocation2: function(oEvent) {
			this.checkLocation_1(oEvent);
		},

		checkLocation_1: function() { // 파견지 Check
			var oController = $.app.getController();
			var oLocation1 = $.app.byId(oController.PAGEID + "_LocationCombo1");
			var oLocation2 = $.app.byId(oController.PAGEID + "_LocationCombo2");

			if(Common.checkNull(oLocation2.getSelectedKey()) || Common.checkNull(oLocation1.getSelectedKey())) return;

			if(oLocation1.getSelectedKey() === oLocation2.getSelectedKey()) {
				sap.m.MessageBox.alert(oController.getBundleText("MSG_59009"), {
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}
		},

		checkLocation3: function(oEvent) {
			this.checkLocation_2(oEvent);
		},

		checkLocation4: function(oEvent) {
			this.checkLocation_2(oEvent);
		},

		checkLocation_2: function() { // 기준지 Check
			var oController = $.app.getController();
			var oLocation3 = $.app.byId(oController.PAGEID + "_LocationCombo3");
			var oLocation4 = $.app.byId(oController.PAGEID + "_LocationCombo4");

			if(Common.checkNull(oLocation3.getSelectedKey()) || Common.checkNull(oLocation4.getSelectedKey())) return;

			if(oLocation3.getSelectedKey() === oLocation4.getSelectedKey()) {
				sap.m.MessageBox.alert(oController.getBundleText("MSG_59009"), {
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}

			this.getDispatchCost();
		},

		onChangeRadio: function(oEvent) {
			var vPath = oEvent.getSource().getBindingContext().getPath();

			if(oEvent.mParameters.selectedIndex === 0){
				this.ApplyModel.setProperty(vPath + "/Zmuflg", "1");
				this.ApplyModel.setProperty(vPath + "/ZmuflgT", this.getBundleText("LABEL_59030"));
			}else{
				this.ApplyModel.setProperty(vPath + "/Zmuflg", "2");
				this.ApplyModel.setProperty(vPath + "/ZmuflgT", this.getBundleText("LABEL_59031"));
			}
		},

		checkError: function() {
			var oController = $.app.getController();

            // 파견지
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zfwkps")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Ztwkps"))){
                MessageBox.error(oController.getBundleText("MSG_59017"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 발령일자
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zactdt"))){
                MessageBox.error(oController.getBundleText("MSG_59019"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 거주지
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zadres"))){
                MessageBox.error(oController.getBundleText("MSG_59020"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 교통비 지급 기준지
            if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zwkpls")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zlfpls"))){
                MessageBox.error(oController.getBundleText("MSG_59021"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }

            // 숙소계약기간
            if(	Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangYearB")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangMonthB")) ||
				Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangYearsE")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/RangMonthE"))	
			){
                MessageBox.error(oController.getBundleText("MSG_59022"), { title: oController.getBundleText("LABEL_00149")});
                return true;
            }else {
				oController.ApplyModel.setProperty("/FormData/Zscsym", oController.ApplyModel.getProperty("/FormData/RangYearB") + oController.ApplyModel.getProperty("/FormData/RangMonthB"));
				oController.ApplyModel.setProperty("/FormData/Zsceym", oController.ApplyModel.getProperty("/FormData/RangYearsE") + oController.ApplyModel.getProperty("/FormData/RangMonthE"));
			}

            // 조기종료월
			if(oController.ApplyModel.getProperty("/EarlyApp") === "X") {
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/EarlyYears")) || Common.checkNull(oController.ApplyModel.getProperty("/FormData/EarlyMonth"))){
					MessageBox.error(oController.getBundleText("MSG_59023"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				}else 
					oController.ApplyModel.setProperty("/FormData/Zseeym", oController.ApplyModel.getProperty("/FormData/EarlyYears") + oController.ApplyModel.getProperty("/FormData/EarlyMonth"));
			}
			
			if(Common.checkNull(oController.ApplyModel.getProperty("/EarlyApp"))) {
				// 파견 발령지
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
					MessageBox.error(oController.getBundleText("MSG_59024"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				}
	
				// 계약서
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
					MessageBox.error(oController.getBundleText("MSG_59025"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				}
	
				// 주민등록등본
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "003") === 0) {
					MessageBox.error(oController.getBundleText("MSG_59026"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				}
			}else {
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "005") === 0) {
					MessageBox.error(oController.getBundleText("MSG_59027"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				}
			}

			return false;
		},

		onPressCancel: function(oEvent) { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
			var oRowData = oController.TableModel.getProperty(vPath);

			var onPressCancel = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_59028")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IEmpid = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];
					
					oModel.create("/DispatchApplySet", sendObject, {
						success: function(oData) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_59015"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
						}
					});
				}
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_59014"), {
				title: oController.getBundleText("LABEL_59001"),
				actions: [oController.getBundleText("LABEL_59028"), oController.getBundleText("LABEL_00119")],
				onClose: onPressCancel
			});
		},

		onDialogApplyBtn: function() {
			if(this.ApplyModel.getProperty("/EarlyApp") === "X")
				this.onDialogApplyBtn2();
			else
				this.onDialogApplyBtn1();
		},

        onDialogApplyBtn1: function() { // 신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_59026")) { // 신청

					// 첨부파일 저장
					var uFiles = [];
					for(var i=1; i<4; i++)	uFiles.push("00" + i);

					if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "004") !== 0) uFiles.push("004");

					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
					oRowData.Pernr = vPernr;

					var sendObject = {};
					// Header
					sendObject.IEmpid = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "3";
					// Navigation property
                    sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];
					
					oModel.create("/DispatchApplySet", sendObject, {
						success: function(oData) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_59011"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._CostApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_59010"), {
				title: oController.getBundleText("LABEL_59001"),
				actions: [oController.getBundleText("LABEL_59026"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onDialogApplyBtn2: function() { // 조기신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_59026")) { // 신청

					// 첨부파일 저장

					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, ["005"]);
					oRowData.Pernr = vPernr;

					var sendObject = {};
					// Header
					sendObject.IEmpid = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "8";
					// Navigation property
                    sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];
					
					oModel.create("/DispatchApplySet", sendObject, {
						success: function(oData) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_59011"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._CostApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_59010"), {
				title: oController.getBundleText("LABEL_59001"),
				actions: [oController.getBundleText("LABEL_59026"), oController.getBundleText("LABEL_00119")],
				onClose: onPressApply
			});
        },

        onDialogSaveBtn: function() { // 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_59029")) { // 저장

					// 첨부파일 저장
					if(oController.ApplyModel.getProperty("/EarlyApp") === "X"){
						oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, ["005"]);
					}else {
						var uFiles = [];
						for(var i=1; i<4; i++)	uFiles.push("00" + i);
	
						if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "004") !== 0) uFiles.push("004");
	
						oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
					}

					oRowData.Pernr = vPernr;

					var sendObject = {};
					// Header
					sendObject.IEmpid = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "2";
					// Navigation property
                    sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];
					
					oModel.create("/DispatchApplySet", sendObject, {
						success: function(oData) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_59013"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._CostApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_59012"), {
				title: oController.getBundleText("LABEL_59001"),
				actions: [oController.getBundleText("LABEL_59029"), oController.getBundleText("LABEL_00119")],
				onClose: onPressSave
			});
        },

        onDialogDelBtn: function() { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_59028")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IEmpid = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.DispatchApplyTableIn1 = [Common.copyByMetadata(oModel, "DispatchApplyTableIn1", oRowData)];
					
					oModel.create("/DispatchApplySet", sendObject, {
						success: function(oData) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_59015"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._CostApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_59014"), {
				title: oController.getBundleText("LABEL_59001"),
				actions: [oController.getBundleText("LABEL_59028"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
		},
		
		onAfterCostApply: function() {
			var vStatus = this.ApplyModel.getProperty("/FormData/Status"),
				vAppnm = this.ApplyModel.getProperty("/FormData/Appnm") || "";

			if(this.ApplyModel.getProperty("/EarlyApp") === "X") {
				fragment.COMMON_ATTACH_FILES.setAttachFile(this, { // 첨부파일
					Label: this.getBundleText("LABEL_59021"),
					Required : true,
					Appnm: vAppnm,
					Mode: "S",
					ReadAsync: true,
					UseMultiCategories: true,
					Editable: this.ApplyModel.getProperty("/EarlyApp") === "X" ? true : false
				},"005");
			}else {
				setTimeout(function () {
                    fragment.COMMON_ATTACH_FILES.once.call(this, vAppnm).then(function() {
                        Promise.all([
							Common.getPromise(function () {
								fragment.COMMON_ATTACH_FILES.setAttachFile(this, {	// 파견 발령지
									Label: this.getBundleText("LABEL_59022"),
									Required : true,
									Appnm: vAppnm,
									Mode: "S",
									ReadAsync: true,
									UseMultiCategories: true,
									Editable: (!vStatus || vStatus === "AA") ? true : false
								}, "001");
							}.bind(this)),
							Common.getPromise(function () {
								fragment.COMMON_ATTACH_FILES.setAttachFile(this, {	// 계약서
									Label: this.getBundleText("LABEL_59023"),
									Required : true,
									Appnm: vAppnm,
									Mode: "S",
									ReadAsync: true,
									UseMultiCategories: true,
									Editable: (!vStatus || vStatus === "AA") ? true : false
								}, "002");
							}.bind(this)),
							Common.getPromise(function () {
								fragment.COMMON_ATTACH_FILES.setAttachFile(this, {	// 주민등록등본
									Label: this.getBundleText("LABEL_59024"),
									Required : true,
									Appnm: vAppnm,
									Mode: "S",
									ReadAsync: true,
									UseMultiCategories: true,
									Editable: (!vStatus || vStatus === "AA") ? true : false
								}, "003");
							}.bind(this)),
							Common.getPromise(function () {
								fragment.COMMON_ATTACH_FILES.setAttachFile(this, {	// 기타
									Label: this.getBundleText("LABEL_59025"),
									Appnm: vAppnm,
									Mode: "S",
									ReadAsync: true,
									UseMultiCategories: true,
									Editable: (!vStatus || vStatus === "AA") ? true : false
								}, "004");
							}.bind(this))
						]).then(function () {
                            $.app.byViewId("FilePanel").setBusy(false);
                        });
                    }.bind(this));
				}.bind(this), 100);
			}
		},

		// onBeforeOpenDetailDialog: function() {
		// 	var oController = $.app.getController();
		// 	var vStatus = oController.ApplyModel.getProperty("/FormData/Status"),
		// 		vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";

		// 	if(oController.ApplyModel.getProperty("/EarlyApp") === "X") {
		// 		fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 첨부파일
		// 			Label: oController.getBundleText("LABEL_59021"),
		// 			Required : true,
		// 			Appnm: vAppnm,
		// 			Mode: "S",
		// 			UseMultiCategories: true,
		// 			Editable: oController.ApplyModel.getProperty("/EarlyApp") === "X" ? true : false
		// 		},"005");
		// 	}else {
		// 		fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 파견 발령지
		// 			Label: oController.getBundleText("LABEL_59022"),
		// 			Required : true,
		// 			Appnm: vAppnm,
		// 			Mode: "S",
		// 			UseMultiCategories: true,
		// 			Editable: (!vStatus || vStatus === "AA") ? true : false
		// 		},"001");
				
		// 		fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 계약서
		// 			Label: oController.getBundleText("LABEL_59023"),
		// 			Required : true,
		// 			Appnm: vAppnm,
		// 			Mode: "S",
		// 			UseMultiCategories: true,
		// 			Editable: (!vStatus || vStatus === "AA") ? true : false
		// 		},"002");
	
		// 		fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 주민등록등본
		// 			Label: oController.getBundleText("LABEL_59024"),
		// 			Required : true,
		// 			Appnm: vAppnm,
		// 			Mode: "S",
		// 			UseMultiCategories: true,
		// 			Editable: (!vStatus || vStatus === "AA") ? true : false
		// 		},"003");
	
		// 		fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 기타
		// 			Label: oController.getBundleText("LABEL_59025"),
		// 			Appnm: vAppnm,
		// 			Mode: "S",
		// 			UseMultiCategories: true,
		// 			Editable: (!vStatus || vStatus === "AA") ? true : false
		// 		},"004");
		// 	}
		// },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20063005"}); // 20063005
		} : null
	});
});