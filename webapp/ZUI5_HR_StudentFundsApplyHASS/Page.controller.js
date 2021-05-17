sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"common/SearchOrg",
	"common/SearchUser1"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, OrgOfIndividualHandler, DialogHandler, SearchOrg, SearchUser1) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		SearchModel : new JSONModelHelper(),
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),
		NationModel: new JSONModelHelper(),
		ChildrenModel: new JSONModelHelper(),
		HighApplyModel: new JSONModelHelper(),
		SupportModel: new JSONModelHelper(),

		g_ClickRow: "",
		g_HighChildMap: {},
		
		getUserId: function() {

			return this.SearchModel.getProperty("/User/Pernr") ? this.SearchModel.getProperty("/User/Pernr") : this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.SearchModel.getProperty("/User/Bukrs3") ? this.SearchModel.getProperty("/User/Bukrs3") : this.getSessionInfoByKey("Bukrs3");
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
				}, this);
		},
		
		onBeforeShow: function() {
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.Page");
			this._BaseApplyModel = sap.ui.jsfragment("ZUI5_HR_StudentFundsApplyHASS.fragment.BaseApply", this);
			oView.addDependent(this._BaseApplyModel);
			this._HighApplyModel = sap.ui.jsfragment("ZUI5_HR_StudentFundsApplyHASS.fragment.HighApply", this);
			oView.addDependent(this._HighApplyModel);
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			this.SearchModel.setData({ User: {}});
			this.onSetInfo(this.getSessionInfoByKey("Pernr"));
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			
            var vBukrs = this.getUserGubun();
            this.LogModel.setData({Bukrs: vBukrs});
			this.onChildrenData();
			this.onTableSearch();
        },

        onChildrenData: function() {
            var oController = $.app.getController();
			var oHighTable = $.app.byId(oController.PAGEID + "_HighTable");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			
			oController.ChildrenModel.setData({Data: []}); 

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "0";
			// Navigation property
			sendObject.EducationFundApplyTableIn0 = [];
			
			oModel.create("/EducationfundApplySet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.EducationFundApplyTableIn0) {
						var dataLength = 5;
						Common.log(oData);
						var rDatas = oData.EducationFundApplyTableIn0.results;
						dataLength = rDatas.length;
						oController.ChildrenModel.setData({Data: rDatas}); 
					}

					oHighTable.setVisibleRowCount(dataLength > 5 ? 5 : dataLength);
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
			var vBukrs = oController.getUserGubun();

			oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IBegda = Common.adjustGMTOdataFormat(oSearchDate.getDateValue());
			sendObject.IEndda = oSearchDate.getSecondDateValue();
            sendObject.IConType = "1";
			// Navigation property
			sendObject.EducationfundApplyExport = [];
			sendObject.EducationfundApplyTableIn = [];
			sendObject.EducationFundApplyTableIn0 = [];
			sendObject.EducationfundApplyTableIn2 = [];
			sendObject.EducationfundApplyTableIn3 = [];
			
			oModel.create("/EducationfundApplySet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.EducationfundApplyTableIn) {
						Common.log(oData);
						var rDatas = oData.EducationfundApplyTableIn.results;
						oController.TableModel.setData({Data: rDatas}); 
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					oTable.setVisibleRowCount(0);
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
        },

		getSupportCost: function() {
			return new sap.ui.commons.TextView({
				textAlign: "Center",
				text: {
					path: "Totsp",
					formatter: function(v) {
						if (v == null || v == "") return "";
						return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}
				}
			})
		},

        getPayDate: function() {

            return  new sap.ui.commons.TextView({
                text : {
                    path: "PayDate",
                    formatter: function(v) {
                        var rDate = "";

                        if(v) rDate = v.slice(1,5) + "." + v.slice(5);

                        return rDate;
                    }
                }, 
                textAlign : "Center"
            });
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
		
		setZyears: function(RowData) {
			var oController = $.app.getController();
			var vBukrs = RowData ? RowData.Bukrs : oController.getUserGubun();
			var vZyear = new Date().getFullYear(),
				vConvertYear = "",
				aYears = [];
			
			if(vBukrs !== "A100"){
				vConvertYear = String(vZyear + 1);
				aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
	
				Common.makeNumbersArray({length: 11}).forEach(function(idx) {
					vConvertYear = String(vZyear - idx);
					aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
				});
	
				oController.ApplyModel.setProperty("/FormData/Zyear", RowData ? RowData.Zyear : String(vZyear));
				oController.ApplyModel.setProperty("/YearCombo", aYears);
			}else {
				if(!RowData || RowData.Status === "AA"){
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
			}
			oController.HighApplyModel.setProperty("/FormData/Zyear", RowData ? RowData.Zyear : String(vZyear));
            oController.HighApplyModel.setProperty("/YearCombo", aYears);
		},

		onPressReq: function() { //신청
			var oController = $.app.getController();
            var vBukrs = oController.getUserGubun();
			
			oController.SupportModel.setData({Data: []});

			if(vBukrs !== "A100"){ 
				oController.ApplyModel.setData({FormData: []});
				oController.getChildInfo();
			}else {
				oController.HighApplyModel.setData({FormData: []});
				if(Common.checkNull(oController.g_HighChildMap.NameKor) || oController.g_ClickRow === "N")
					return sap.m.MessageBox.alert(oController.getBundleText("MSG_38018"), { title: oController.getBundleText("MSG_08107")});
				else{
					oController.HighApplyModel.setProperty("/FormData/Relation", oController.g_HighChildMap.Relation);
					oController.HighApplyModel.setProperty("/FormData/NameKor", oController.g_HighChildMap.NameKor);
					oController.HighApplyModel.setProperty("/FormData/RelationTx", oController.g_HighChildMap.RelationTx);
					oController.HighApplyModel.setProperty("/FormData/SchcoT", oController.getBundleText("LABEL_38051"));
					oController.HighApplyModel.setProperty("/FormData/Schco", "KR");
					oController.HighApplyModel.setProperty("/FormData/Reccn", "1");
				}
			};
			
            oController.setZyears();
            oController.getComboCodeList();
		    oController.onBeforeOpenDetailDialog();

			if(vBukrs !== "A100") oController._BaseApplyModel.open();
			else oController._HighApplyModel.open();
		},

        getChildInfo: function(oRowData) {
            var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
            var vBukrs = oController.getUserGubun();
			var vName = oController.ChildrenModel.getProperty("/Data/0/Fname");

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = oRowData ? oRowData.Bukrs : vBukrs;
			sendObject.IFname = vName;
            sendObject.IConType = "0";
			// Navigation property
			sendObject.EducationFundApplyTableIn0 = [];
			
			oModel.create("/EducationfundApplySet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.ApplyModel.setProperty("/NameCombo", oController.ChildrenModel.getProperty("/Data"));
					if(!oRowData){
						if(oController.getSessionInfoByKey("Bukrs3") !== "A100"){
							oController.ApplyModel.setProperty("/FormData/NameKor", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].Fname : "");
							oController.ApplyModel.setProperty("/FormData/RelationTx", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].KdsvhT : "");
							oController.ApplyModel.setProperty("/FormData/Relation", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].Relation : "");
						} else{
							oController.HighApplyModel.setProperty("/FormData/NameKor", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].Fname : "");
							oController.HighApplyModel.setProperty("/FormData/RelationTx", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].KdsvhT : "");
							oController.HighApplyModel.setProperty("/FormData/Relation", Common.checkNull(!oData.EducationFundApplyTableIn0.results[0]) ? oData.EducationFundApplyTableIn0.results[0].Relation : "");
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
        },
		
		onSelectedRow: function(oEvent) {
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var oCopiedRow = $.extend(true, {}, oRowData);

			if(oCopiedRow.Bukrs !== "A100"){
				oController.ApplyModel.setData({FormData: []});
				oController.ApplyModel.setData({FormData: oCopiedRow});
				oController.getChildInfo(oCopiedRow);
				oController.getComboCodeList(oCopiedRow.Bukrs);
				oController.getBaseSupportList();
			}else{
				oController.g_ClickRow = "N";
				oController.HighApplyModel.setData({FormData: oCopiedRow});
				oController.ChildrenModel.getProperty("/Data").forEach(function(ele,index) {
					oController.ChildrenModel.setProperty("/Data/" + index + "/Gubun", "X");
				});
				oController.getComboCodeList(oCopiedRow.Bukrs);
				oController.getSupportList();
				oController.onChangeSupport();
			}
			
			oController.setZyears(oCopiedRow);
			oController.onBeforeOpenDetailDialog(oCopiedRow.Bukrs);

			if(oCopiedRow.Bukrs !== "A100") oController._BaseApplyModel.open();
			else oController._HighApplyModel.open();
		},

		onHighSelectedRow: function(oEvent) { // 첨단 학자금 대상자 클릭
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.ChildrenModel.getProperty(vPath);

			oController.g_ClickRow = "Y";
			oController.ChildrenModel.getProperty("/Data").forEach(function(ele,index) {
				if(oController.ChildrenModel.getProperty(vPath) === ele)
					oController.ChildrenModel.setProperty("/Data/" + index + "/Gubun", "Y");
				else
					oController.ChildrenModel.setProperty("/Data/" + index + "/Gubun", "X");
			});

			oController.g_HighChildMap = {
				Relation: oRowData.Relation,
				NameKor: oRowData.Fname,
				RelationTx: oRowData.KdsvhT
			};
		},

		changeRelation: function(oEvent) { // 성명Combo
			var oController = $.app.getController();

			oController.ChildrenModel.getProperty("/Data").some(function(e) {
				oController.ApplyModel.setProperty("/FormData/RelationTx", e.KdsvhT);
				oController.ApplyModel.setProperty("/FormData/Relation", e.Relation);
				
				return e.Fname === oEvent.getSource().getValue();
			});
		},

		getComboCodeList: function(RowBukrs) {
			var oController = $.app.getController();
			var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
            var vBukrs = RowBukrs ? RowBukrs : oController.getUserGubun();

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
						var oCodeList = [];
						var oSchoolType = null;

						if(vBukrs !== "A100"){
							oSchoolType = $.app.byId(oController.PAGEID + "_BSchoolType"); 

							oData.NavCommonCodeList.results.forEach(function(e) {
								if(e.Code !== "00" && e.Code !== "05")
									oCodeList.push(e);
							});
						}

						if((!RowBukrs && vBukrs !== "A100") || (RowBukrs !== "A100" && vBukrs !== "A100"))
							oController.ApplyModel.setProperty("/SchoolCombo", oSchoolType.getEditable() ? oCodeList : oData.NavCommonCodeList.results);
						else
							oController.HighApplyModel.setProperty("/SchoolCombo", oData.NavCommonCodeList.results);
							
						Common.log(oData);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
			if(vBukrs !== "A100") { // 기초일 경우 신청 ComboList 가져옴
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
				sendObject.ICodty = "ZQUART";
				sendObject.ILangu =  "3";
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
			}else {
				sendObject = {};
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IBukrs = vBukrs;
				sendObject.ICodeT = "002";
				sendObject.ICodty = "BT710";
				sendObject.ILangu =  "3";
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
					sendObject.ISubCode = oController.HighApplyModel.getProperty("/FormData/SchoolType");
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
			}
		},

		getSupportList: function(oEvent) { //학교구분 선택
			var oController = $.app.getController();
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

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IFname = oController.HighApplyModel.getProperty("/FormData/NameKor");
			sendObject.IRelation = oController.HighApplyModel.getProperty("/FormData/Relation");
			sendObject.ISchoolType = vKey;
			// Navigation property
			sendObject.EducationfundBaseTableIn2 = [];
			// 해당 학력 지원이력
			oModel.create("/EducationfundBaseSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.EducationfundBaseTableIn2) {
						Common.log(oData);
						oController.SupportModel.setData({Data: oData.EducationfundBaseTableIn2.results});
					}else 
						oController.SupportModel.setData({Data: []});
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

		getBaseSupportList: function(oEvent) { // 기초에서 지원이력호출
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
            var vBukrs = oController.ApplyModel.getProperty("/FormData/Bukrs") ? oController.ApplyModel.getProperty("/FormData/Bukrs") : oController.getUserGubun();
			var vKey = oEvent ? oEvent.getSource().getSelectedKey() : oController.ApplyModel.getProperty("/FormData/SchoolType");

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IFname = oController.ApplyModel.getProperty("/FormData/NameKor");
			sendObject.IRelation = oController.ApplyModel.getProperty("/FormData/Relation");
			sendObject.ISchoolType = vKey;
			// Navigation property
			sendObject.EducationfundBaseTableIn2 = [];
			// 해당 학력 지원이력
			oModel.create("/EducationfundBaseSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.EducationfundBaseTableIn2) {
						Common.log(oData);
						oController.SupportModel.setData({Data: oData.EducationfundBaseTableIn2.results});
					}else 
						oController.SupportModel.setData({Data: []});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onChangeSupport: function(oEvent) { // 지원유형 선택시 수혜주기 값 호출
			var oController = $.app.getController();
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
		
		getCost1: function(oEvent) { // 입학금
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/EreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));	

			oController.getCostSum();		
		},

		getCost2: function(oEvent) { // 수업료
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/FreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost3: function(oEvent) { //육성회비
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/UreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost4: function(oEvent) { // 학교운영지원비
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/DreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost5: function(oEvent) { // 학생회비
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/SreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost6: function(oEvent) { // 자율학습비
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/SsreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost7: function(oEvent) { // 보충수업
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/AreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCost8: function(oEvent) { // 기타1
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.ApplyModel.setProperty("/FormData/ReqAmt1", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getCostSum();
		},

		getCostSum: function() { // 신청금액
			var oController = $.app.getController();
			var Cost1 = oController.ApplyModel.getProperty("/FormData/EreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/EreqAmt")) : 0 ,
				Cost2 = oController.ApplyModel.getProperty("/FormData/FreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/FreqAmt")) : 0 ,
				Cost3 = oController.ApplyModel.getProperty("/FormData/UreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/UreqAmt")) : 0 ,
				Cost4 = oController.ApplyModel.getProperty("/FormData/DreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/DreqAmt")) : 0 ,
				Cost5 = oController.ApplyModel.getProperty("/FormData/SreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/SreqAmt")) : 0 ,
				Cost6 = oController.ApplyModel.getProperty("/FormData/SsreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/SsreqAmt")) : 0 ,
				Cost7 = oController.ApplyModel.getProperty("/FormData/AreqAmt") ? parseInt(oController.ApplyModel.getProperty("/FormData/AreqAmt")) : 0 ,
				Cost8 = oController.ApplyModel.getProperty("/FormData/ReqAmt1") ? parseInt(oController.ApplyModel.getProperty("/FormData/ReqAmt1")) : 0 ;

			var vSum = Cost1 + Cost2 + Cost3 + Cost4 + Cost5 + Cost6 + Cost7 + Cost8;

			oController.ApplyModel.setProperty("/FormData/ReqSum", String(vSum));
			oController.ApplyModel.setProperty("/FormData/AdmSum", String(vSum));
		},

		getHighCost1: function(oEvent) { // 입학금(첨단)
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.HighApplyModel.setProperty("/FormData/EreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getHighCostSum();
		},

		getHighCost2: function(oEvent) { // 수업료(첨단)
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.HighApplyModel.setProperty("/FormData/FreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getHighCostSum();
		},

		getHighCost3: function(oEvent) { // 운영회비(첨단)
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.HighApplyModel.setProperty("/FormData/DreqAmt", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));

			oController.getHighCostSum();
		},

		getHighCostSum: function() { // 신청금액(첨단)
			var oController = $.app.getController();
			var Cost1 = oController.HighApplyModel.getProperty("/FormData/EreqAmt") ? parseInt(oController.HighApplyModel.getProperty("/FormData/EreqAmt")) : 0 ,
				Cost2 = oController.HighApplyModel.getProperty("/FormData/FreqAmt") ? parseInt(oController.HighApplyModel.getProperty("/FormData/FreqAmt")) : 0 ,
				Cost3 = oController.HighApplyModel.getProperty("/FormData/DreqAmt") ? parseInt(oController.HighApplyModel.getProperty("/FormData/DreqAmt")) : 0 ;

			var vSum = Cost1 + Cost2 + Cost3;

			oController.HighApplyModel.setProperty("/FormData/ReqSum", String(vSum));
		},

		getScholarship: function(oEvent) { // 장학금(첨단)
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.HighApplyModel.setProperty("/FormData/Scham", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));
		},
		
		getExcepAmount: function(oEvent) { // 기타금액(첨단)
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oController.HighApplyModel.setProperty("/FormData/ReqAmt1", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));
		},

		checkError: function() {
			var oController = $.app.getController();
			var vBukrs = oController.getUserGubun();

			if(vBukrs !== "A100"){
				// 구분
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SGubun"))){
					MessageBox.error(oController.getBundleText("MSG_38007"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 학교구분
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SchoolType"))){
					MessageBox.error(oController.getBundleText("MSG_38008"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 학년
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Grade"))){
					MessageBox.error(oController.getBundleText("MSG_38014"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 학교명
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/SchoolName"))){
					MessageBox.error(oController.getBundleText("MSG_38009"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 납부일자
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Paydt"))){
					MessageBox.error(oController.getBundleText("MSG_38010"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 신청금액
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/ReqSum")) || oController.ApplyModel.getProperty("/FormData/ReqSum") === "0"){
					MessageBox.error(oController.getBundleText("MSG_38017"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 비고
				if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Remark"))){
					MessageBox.error(oController.getBundleText("MSG_38011"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
	
				// 첨부파일
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
					MessageBox.error(oController.getBundleText("MSG_38012"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
			}else {
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
				if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
					MessageBox.error(oController.getBundleText("MSG_38012"), { title: oController.getBundleText("LABEL_00149")});
					return true;
				};
			}

			return false;
		},

		searchOrgehPernr : function(oController){
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.Page");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
				
				if(o.Otype == "P"){
					oController.SearchModel.setData({ User: {}});
					oController.onSetInfo(o.Objid);
					oController.onChildrenData();
					oController.getChildInfo();
					oController.g_ClickRow = "N";
                } else if(o.Otype == "O"){
                	sap.m.MessageBox.alert(oController.getBundleText("MSG_38020"), { title: oController.getBundleText("MSG_08107")});
                }
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},

		onSetInfo : function(Pernr){
			if(!Pernr) return;
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.Page");
			var oController = oView.getController();
		
			var oPhoto = "";
			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + Pernr + "' and photoType eq '1'")
				 .select("photo")
				 .setAsync(false)
				 .attachRequestCompleted(function(){
						var data = this.getData().d;
						
						if(data && data.results.length){
							oPhoto = "data:text/plain;base64," + data.results[0].photo;
						} else {
							oPhoto = "images/male.jpg";
						}
				 })
				 .attachRequestFailed(function() {
						oPhoto = "images/male.jpg";
				 })
				 .load();
				 
			var vData = {};
				vData.photo = oPhoto;

			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var createData = {TableIn : []};
				createData.IPernr = Pernr;
				createData.ILangu = $.app.getModel("session").getData().Langu;
				
			oModel.create("/HeaderSet", createData, {
				success: function(data, res){
					if(data){
						if(data.TableIn && data.TableIn.results){
							var data1 = data.TableIn.results[0];
							
							if(data1){
								Object.assign(vData, data1);
							}
						}
					}
				},
				error: function (oResponse) {
			    	Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
			oController.SearchModel.setProperty("/User", vData);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
        /**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
        displayMultiOrgSearchDialog: function (oEvent) {
            SearchOrg.oController = this.oController;
            SearchOrg.vActionType = "Multi";
            SearchOrg.vCallControlId = oEvent.getSource().getId();
            SearchOrg.vCallControlType = "MultiInput";

            if (!this.oOrgSearchDialog) {
                this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                $.app.getView().addDependent(this.oOrgSearchDialog);
            }

            this.oOrgSearchDialog.open();
        },

		onESSelectPerson : function(data){
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.Page");
			var oController = oView.getController();

			if(oController.data){
				oController.onSetInfo(data.Pernr);
				oController.onChildrenData();
				oController.getChildInfo();
			}

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},

		onPressCancel: function(oEvent) { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
			var oRowData = oController.TableModel.getProperty(vPath);

			delete oRowData.Regno;

			var onPressCancel = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38047")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38006"), { title: oController.getBundleText("MSG_08107")});
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_38005"), {
				title: oController.getBundleText("LABEL_38001"),
				actions: [oController.getBundleText("LABEL_38047"), oController.getBundleText("LABEL_00119")],
				onClose: onPressCancel
			});
		},

        onDialogApplyBtn: function() { // 신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date(),
			oRowData.Waers = "KRW",
			delete oRowData.Regno;

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38044")) { // 신청

					// 첨부파일 저장
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "001");
					
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "3";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38002"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._BaseApplyModel.close();
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

        onDialogSaveBtn: function() { // 저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date();
			delete oRowData.Regno;

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38048")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "001");

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "2";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._BaseApplyModel.close();
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

        onDialogDelBtn: function() { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.ApplyModel.getProperty("/FormData");

			delete oRowData.Regno;

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38047")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IBukrs = vBukrs;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38006"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._BaseApplyModel.close();
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

		onSearchNation: function() { // 첨단(국가검색)
			var oView = $.app.byId("ZUI5_HR_StudentFundsApplyHASS.Page");
			var oController = $.app.getController();

			if (!oController._NationModel) {
				oController._NationModel = sap.ui.jsfragment("ZUI5_HR_StudentFundsApplyHASS.fragment.SearchNation", oController);
				oView.addDependent(oController._NationModel);
			}

			oController._NationModel.open();
		},

		onSearchNationBtn: function(oEvent) { // 국가검색창에 검색
			var oController = $.app.getController();
			var oCodeModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
            var vBukrs = oController.getUserGubun();

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
			var oController = $.app.getController();
			var vNationText = oEvent.getParameter("selectedItem").mProperties.description;
			var vNationPath = oEvent.getParameters().selectedItem.oBindingContexts.undefined.getPath();

			oController.HighApplyModel.setProperty("/FormData/SchcoT", vNationText);
			oController.HighApplyModel.setProperty("/FormData/Schco", oController.NationModel.getProperty(vNationPath).Code);
		},

		onHighDialogApplyBtn: function() { // 첨단(신청)
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.HighApplyModel.getProperty("/FormData");
			
			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date(),
			oRowData.Waers = "KRW",

			delete oRowData.Regno;

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38044")) { // 신청

					// 첨부파일 저장
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "002");
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "3";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38002"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._HighApplyModel.close();
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

		onHighDialogSaveBtn: function() { // 첨단 (저장)
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.HighApplyModel.getProperty("/FormData");

			oRowData.Pernr = vPernr,
			oRowData.Begda = new Date(),
			oRowData.Endda = new Date();

			delete oRowData.Regno;

			if(oController.checkError()) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38048")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFile.call(oController, "002");
					if(!oRowData.Appnm) return false;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "2";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._HighApplyModel.close();
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

		onHighDialogDelBtn: function() { // 첨단 (삭제)
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.HighApplyModel.getProperty("/FormData");

			delete oRowData.Regno;

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38047")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = oController.getSessionInfoByKey("name");
					sendObject.IBukrs = vBukrs;
					sendObject.IConType = "4";
					// Navigation property
                    sendObject.EducationfundApplyTableIn = [Common.copyByMetadata(oModel, "EducationfundApplyTableIn", oRowData)];
					
					oModel.create("/EducationfundApplySet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_38006"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._HighApplyModel.close();
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

		onBeforeOpenDetailDialog: function(RowBukrs) {
			var oController = $.app.getController();
			var vBukrs = RowBukrs ? RowBukrs : oController.getUserGubun();
			var vStatus = "",
				vAppnm =  "";
			
			if(vBukrs !== "A100"){
				vStatus = oController.ApplyModel.getProperty("/FormData/Status");
				vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm: vAppnm,
					Required: true,
					Mode: "M",
					Max: "3",
					UseMultiCategories: true,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
				},"001");
			}else {
				vStatus = oController.HighApplyModel.getProperty("/FormData/Status");
				vAppnm = oController.HighApplyModel.getProperty("/FormData/Appnm") || "";
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
					Appnm: vAppnm,
					Required: true,
					Mode: "M",
					Max: "3",
					UseMultiCategories: true,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
				},"002");
			}
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35114489"}); // 20190018 20063005 (기초) 35111238 35114489 35111012(첨단)
		} : null
	});
});