sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"../common/ZHR_TABLES",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, ZHR_TABLES, MessageBox, BusyIndicator) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		CostModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs3;
        },
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();
			this.onInitData(this);
        },

		onInitData: function(oController) {
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					var LogData = oData.NewPostExport.results[0];
					oController.LogModel.setData({LogData: LogData});

					if(LogData.EClose === "X"){
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
			
			oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "1";
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
			// Navigation property
			sendObject.NewPostTableIn1 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rDatas1 = oData.NewPostTableIn1.results;
						oController.TableModel.setData({Data: rDatas1}); 
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

		getLocationCost: function() {
			return new sap.ui.commons.TextView({
				textAlign: "Center",
				text: {
					path: "Ztstot",
					formatter: function(v) {
						if (v == null || v == "") return "";
						return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}
				}
			})
		},
        
        getRelocation: function() {

            return new sap.m.Text({
                text: {
                    parts: [{ path: "ZfwkpsT" }, { path: "ZtwkpsT" }],
                    formatter: function(v1, v2) {
                        if(v1) return v1 + " → " + v2;
                        else return "";
                    }
                }
            })
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
                                text: "{i18n>LABEL_29027}",
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
		
		onPressReq: function() { //신청
			var oView = $.app.byId("ZUI5_HR_RelocationFee.Page");
			
			this.DetailModel.setData({FormData: []});
			this.CostModel.setData({Data: []});

			this.DetailModel.setProperty("/Bukrs", this.getUserGubun());
			
			if (!this._DetailModel) {
				this._DetailModel = sap.ui.jsfragment("ZUI5_HR_RelocationFee.fragment.Apply", this);
				oView.addDependent(this._DetailModel);
			}
			this.getTableMakeColums();
			this.getLocationList();
			this.DetailModel.setProperty("/FormData/Zfwkps","CheckNull");
			this.DetailModel.setProperty("/FormData/Ztwkps","CheckNull");
			this.onBeforeOpenDetailDialog();
			this._DetailModel.open();
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_RelocationFee.Page");
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = this.TableModel.getProperty(vPath);
            oRowData = $.extend(true, {}, oRowData);
			this.DetailModel.setProperty("/Bukrs", oRowData.Bukrs); 

			if (!this._DetailModel) {
				this._DetailModel = sap.ui.jsfragment("ZUI5_HR_RelocationFee.fragment.Apply", this);
				oView.addDependent(this._DetailModel);
			}

			this.getTableMakeColums();
			this.onTableSearch();
			this.CostModel.setData({Data: [oRowData]});
			this.DetailModel.setData({FormData: oRowData});
			this.DetailModel.setProperty("/Status", oRowData.Status);
			this.getLocationList(oRowData);
			this.getCriteria();
			this.onBeforeOpenDetailDialog();
			this._DetailModel.open();
		},

		getTableMakeColums: function() {
			var oController = $.app.getController();
			var oMidTable = $.app.byId(oController.PAGEID + "_MidTable");
			var oMidTable2 = $.app.byId(oController.PAGEID + "_MidTable2");

			if(oController.DetailModel.getProperty("/Bukrs") !== "A100") {
				oMidTable.setVisible(true);
				oMidTable2.setVisible(false);
			}else {
				oMidTable.setVisible(false);
				oMidTable2.setVisible(true);
			};
		},
		
		getLocationList: function(oRowData) {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRadioHBox = $.app.byId(oController.PAGEID + "_CheckHBox");
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			
			if(oRowData && oRowData.ZwtfmlT === oController.getBundleText("LABEL_34009")) 
				oRadioHBox.setVisible(true);
			else
				oRadioHBox.setVisible(false);
			
			if(oRowData)
				oRadioGroup.setSelectedIndex(parseInt(oRowData.Zwtfml) - 1);
			else
				oRadioGroup.setSelectedIndex(0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			sendObject.NewPostTableIn3 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn3) {
						Common.log(oData);
						oData.NewPostTableIn3.results.unshift({ Subtx1: oController.getBundleText("LABEL_00181"), Subcd: "CheckNull"});

						oController.DetailModel.setProperty("/LocationCombo1",oData.NewPostTableIn3.results);
						oController.DetailModel.setProperty("/LocationCombo2",oData.NewPostTableIn3.results);
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

		checkLocation1: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation2: function(oEvent) {
			this.checkLocation(oEvent);
		},

		checkLocation: function(oEvent) { // 부임지 Check
			var oController = $.app.getController();
			var oLocation1 = $.app.byId(oController.PAGEID + "_LocationCombo1");
			var oLocation2 = $.app.byId(oController.PAGEID + "_LocationCombo2");

			if(oLocation2.getSelectedKey() === "CheckNull" || oLocation1.getSelectedKey() === "CheckNull") return;

			if(oLocation1.getSelectedKey() === oLocation2.getSelectedKey()) {
				sap.m.MessageBox.alert(oController.getBundleText("MSG_34002"), {
					title: oController.getBundleText("LABEL_00149")
				});
				oEvent.getSource().setSelectedKey("CheckNull");
				return;
			}

			oController.getCost();
		},
		
		getCriteria: function(oEvent) { //발령일자 선택
			var oController = this;
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var sendObject = {};
			
			if(oEvent) {
				// Header
				sendObject.Pernr = vPernr;
				sendObject.Datum = moment(oController.DetailModel.getProperty("/FormData/Zactdt")).hours(10).toDate();
				// Navigation property
				sendObject.BukrsExport = [];
				
				oModel.create("/BukrsImportSet", sendObject, { // 발령일자에 따른 Bukrs
					success: function(oData, oResponse) {
						if (oData && oData.BukrsExport) {
							Common.log(oData);
							oController.DetailModel.setProperty("/Bukrs", oData.BukrsExport.results[0].Bukrs); 
							oController.getTableMakeColums();
							oController.getCost();
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
						sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
							title: oController.getBundleText("LABEL_09030")
						});
					}
				});
			}

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
            sendObject.IZactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostExport) {
						Common.log(oData);
						oController.DetailModel.setProperty("/CriAge",oData.NewPostExport.results[0].EDate); 
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

		onChangeRadio: function(oEvent) {
			var oController = this;
			var oRadioHBox = $.app.byId(oController.PAGEID + "_CheckHBox");
			var vPath = oEvent.getSource().getBindingContext().getPath();

			if(oEvent.mParameters.selectedIndex === 0)
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "1");
			else
				oController.DetailModel.setProperty(vPath + "/Zwtfml", "2");

			if(oEvent.getSource().getSelectedButton().getText() === oController.getBundleText("LABEL_34009")){
				oRadioHBox.setVisible(true);
			}else{
				oRadioHBox.setVisible(false);
			}

			oController.getCost();
		},

		getCostSum1: function(oEvent) { // 6세이상 input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zolda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		getCostSum2: function(oEvent) { // 6세미만 input
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.DetailModel.setProperty("/FormData/Zunda6", convertValue);
			oEvent.getSource().setValue(convertValue);
			this.getCost();
		},

		inputCost: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				value: {
					path: "Zmvcst",
					formatter: function(v) {
						if(v) return Common.numberWithCommas(v);
						else return ;
					}
				},
				maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zmvcst", false),
				liveChange: oController.InputTransCost.bind(oController),
				textAlign: "End",
				editable: {
					path: "/Status",
					formatter: function(v) {
						if(v === "10" || !v) return true;
						else return false; 
					}
				}
			});
		},

		inputCost2: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				value: {
					path: "Ztexme",
					formatter: function(v) {
						if(v) return Common.numberWithCommas(v);
						else return ;
					}
				},
				maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Ztexme", false),
				liveChange: oController.InputTransCost2.bind(oController),
				textAlign: "End",
				editable: {
					path: "/Status",
					formatter: function(v) {
						if(v === "10" || !v) return true;
						else return false; 
					}
				}
			});
		},

		InputTransCost: function(oEvent) { // 가재운송비 input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');
	
			if(parseInt(convertValue) > parseInt(oController.LogModel.getProperty("/LogData/EAmt"))) {
				var vMsg = oController.getBundleText("MSG_34015");
				vMsg = vMsg.replace("{Money}", Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).split(Common.numberWithCommas(oController.LogModel.getProperty("/LogData/EAmt")).slice(-4))[0]);

				oController.CostModel.setProperty("/Data/0/Zmvcst", oController.CostModel.getProperty("/Data/0/Zmvcst"));
				oEvent.getSource().setValue(Common.numberWithCommas(oController.CostModel.getProperty("/Data/0/Zmvcst")));
				
				return MessageBox.error(vMsg, { title: oController.getBundleText("LABEL_00149")});
			}

			oController.CostModel.setProperty("/Data/0/Zmvcst", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		InputTransCost2: function(oEvent) { // 여비 input
			var oController = this;
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');
	
			oController.CostModel.setProperty("/Data/0/Ztexme", convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(convertValue));
			oController.getCostSum();
		},

		getCostSum: function() { // 합계
			var oController = $.app.getController();
			var vZtexme = oController.CostModel.getProperty("/Data/0/Ztexme") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexme")) : 0, // 본인 여비
				vZtexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexo6")) : 0, // 6세이상 여비
				vZtexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztexu6")) : 0, // 6세미만 여비
				vZdexme = oController.CostModel.getProperty("/Data/0/Zdexme") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexme")) : 0, // 본인 일비
				vZdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexo6")) : 0, // 6세이상 일비
				vZdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6") ? parseInt(oController.CostModel.getProperty("/Data/0/Zdexu6")) : 0, // 6세미만 일바
				vZtsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv") ? parseInt(oController.CostModel.getProperty("/Data/0/Ztsrsv")) : 0, // 이전준비금
				vZmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? parseInt(oController.CostModel.getProperty("/Data/0/Zmvcst")) : 0, // 가재운송비
				vZbkfee = oController.CostModel.getProperty("/Data/0/Zbkfee") ? parseInt(oController.CostModel.getProperty("/Data/0/Zbkfee")) : 0, // 준개 수수료
				vZtstot = ""; // 합계

			vZtstot = vZtexme + vZtexo6 + vZtexu6 + vZdexme + vZdexo6 + vZdexu6 + vZtsrsv + vZmvcst + vZbkfee;
			oController.CostModel.setProperty("/Data/0/Ztstot", String(vZtstot));
		},

		getCost: function() { // 중간필드
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.DetailModel.getProperty("/Bukrs");
			var oRadioGroup = $.app.byId(oController.PAGEID + "_RadioGroup");
			var oSendData = {};

			if(
				oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" ||
				oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull" ||
				Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))
			) 	return;

			if(oController.DetailModel.getProperty("/FormData/Zwtfml") === "2"){
				oSendData.Zolda6 = oController.DetailModel.getProperty("/FormData/Zolda6") ? oController.DetailModel.getProperty("/FormData/Zolda6") : "0", // 6세이상 인원
				oSendData.Zunda6 = oController.DetailModel.getProperty("/FormData/Zunda6") ? oController.DetailModel.getProperty("/FormData/Zunda6") : "0" // 6세미만 인원
			};

			oSendData.Zfwkps = oController.DetailModel.getProperty("/FormData/Zfwkps"), // 현근무지
			oSendData.Ztwkps = oController.DetailModel.getProperty("/FormData/Ztwkps"), // 부임지
			oSendData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt")), // 발령일자
			oSendData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0", // 가재운송비
			oSendData.Zwtfml = String(oRadioGroup.getSelectedIndex() + 1); // 가족동반여부
			

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IGubun = "5";
			// Navigation property
			sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oSendData)];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rData = oData.NewPostTableIn1.results;
						rData[0].Zmvcst = oSendData.Zmvcst
						
						if(vBukrs === "A100")
							rData[0].Ztexme = Common.checkNull(oController.CostModel.getProperty("/Data/0/Ztexme")) ? "0" : oController.CostModel.getProperty("/Data/0/Ztexme");

						oController.CostModel.setData({Data: rData});
						oController.getCostSum();
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

		ApplyCheck: function() { // 필수값 체크
			var oController = $.app.getController();

			// 부임지 Check
			if(oController.DetailModel.getProperty("/FormData/Zfwkps") === "CheckNull" || oController.DetailModel.getProperty("/FormData/Ztwkps") === "CheckNull"){
				MessageBox.error(oController.getBundleText("MSG_34004"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 발령일자 Check
			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zactdt"))){
				MessageBox.error(oController.getBundleText("MSG_34005"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 가족동반 체크시 자녀수 Check
			if((oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")) &&
			  Common.checkNull(oController.DetailModel.getProperty("/FormData/Zolda6")))) ||
			  (oController.DetailModel.getProperty("/FormData/Zwtfml") === "2" &&
			  (parseInt(oController.DetailModel.getProperty("/FormData/Zolda6")) === 0 &&
			  parseInt(oController.DetailModel.getProperty("/FormData/Zunda6")) === 0)))
			{
				MessageBox.error(oController.getBundleText("MSG_34006"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_34013"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

        onPressCancel: function(oEvent) { // Status에 맞는 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oPath = oEvent.getSource().oParent.oParent.oParent.oBindingContexts.undefined.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34025")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "4";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34012"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
							}
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34011"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34025"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},
		
		onDialogApplyBtn: function() { // Dialog 신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			oRowData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0", // 가재운송비
			oRowData.Ztexme = oController.CostModel.getProperty("/Data/0/Ztexme"), // 여비 (본인)
			oRowData.Ztexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6"), // 여비 (6세 이상)
			oRowData.Ztexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6"), // 여비 (6세 미만)
			oRowData.Zdexme = oController.CostModel.getProperty("/Data/0/Zdexme"), // 일비 (본인)
			oRowData.Zdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6"), // 일비 (6세 이상)
			oRowData.Zdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6"), // 일비 (6세 미만)
			oRowData.Ztsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv"), // 이전 준비금
			oRowData.Ztstot = oController.CostModel.getProperty("/Data/0/Ztstot"); // 합계
			oRowData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0"; // 6세미만 인원
			};
			oRowData.Zwtfml = oRowData.Zwtfml ? oRowData.Zwtfml : "1"; // 가족동반 Radio
			oRowData.Waers = "KRW";

			if(oController.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_34022")) { //신청

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "3";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34008"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34007"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},

		onDialogSaveBtn: function() { // Dialog 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0" // 6세미만 인원
			};
			oRowData.Zmvcst = oController.CostModel.getProperty("/Data/0/Zmvcst") ? oController.CostModel.getProperty("/Data/0/Zmvcst") : "0", // 가재운송비
			oRowData.Ztexme = oController.CostModel.getProperty("/Data/0/Ztexme"), // 여비 (본인)
			oRowData.Ztexo6 = oController.CostModel.getProperty("/Data/0/Ztexo6"), // 여비 (6세 이상)
			oRowData.Ztexu6 = oController.CostModel.getProperty("/Data/0/Ztexu6"), // 여비 (6세 미만)
			oRowData.Zdexme = oController.CostModel.getProperty("/Data/0/Zdexme"), // 일비 (본인)
			oRowData.Zdexo6 = oController.CostModel.getProperty("/Data/0/Zdexo6"), // 일비 (6세 이상)
			oRowData.Zdexu6 = oController.CostModel.getProperty("/Data/0/Zdexu6"), // 일비 (6세 미만)
			oRowData.Ztsrsv = oController.CostModel.getProperty("/Data/0/Ztsrsv"), // 이전 준비금
			oRowData.Ztstot = oController.CostModel.getProperty("/Data/0/Ztstot"); // 합계
			oRowData.Zactdt = Common.setUTCDateTime(oController.DetailModel.getProperty("/FormData/Zactdt"));
			
			if(oController.ApplyCheck()) return;

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34026")) { //저장

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = oController.DetailModel.getProperty("/Bukrs");
					sendObject.IGubun = "2";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34010"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34009"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34026"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // Dialog 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var oRowData = oController.DetailModel.getProperty("/FormData");

			if(oRowData.Zwtfml === "2"){
				oRowData.Zolda6 = oRowData.Zolda6 ? oRowData.Zolda6 : "0", // 6세이상 인원
				oRowData.Zunda6 = oRowData.Zunda6 ? oRowData.Zunda6 : "0" // 6세미만 인원
			};
			oRowData.Zmvcst = oRowData.Zmvcst ? oRowData.Zmvcst : "0"; // 가재운송비

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_34025")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IGubun = "4";
					// Navigation property
					sendObject.NewPostTableIn1 = [Common.copyByMetadata(oModel, "NewPostTableIn1", oRowData)];
					
					oModel.create("/NewPostImportSet", sendObject, {
						success: function(oData, oResponse) {
							if (oData && oData.NewPostTableIn1) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_34012"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								oController._DetailModel.close();
								BusyIndicator.hide();
							}
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_34011"), {
				title: oController.getBundleText("LABEL_34001"),
				actions: [oController.getBundleText("LABEL_34025"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
				vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || ""
			
			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "10",
				Editable: (!vStatus || vStatus === "AA") ? true : false,
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20190204"}); // 20001008 20190204
		} : null
	});
});