sap.ui.define(
	[
		"../common/Common",
		"../common/CommonController",
		"../common/AttachFileAction",
		"../common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library"
	],
	function (Common, CommonController, AttachFileAction, JSONModelHelper, BusyIndicator, MessageBox, unifiedLibrary) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",

			TableModel: new JSONModelHelper(),
			DetailModel: new JSONModelHelper(),
			g_BDate: "",
			g_EDate: "",

			getUserId: function() {

				return this.getView().getModel("session").getData().name;
			},
			
			getUserGubun  : function() {

				return this.getView().getModel("session").getData().Bukrs;
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function () {
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				this.onTableSearch();
			},

			getStatusTxt: function() {
				return  new sap.ui.commons.TextView({
					text: {
						path: "Rate",
						formatter: function(v) {
							return Number(v)+"%";
						}
					},
					textAlign: "Center"
				});
			},

			getVisibleBotton: function() {
				var oController = $.app.getController();

				return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({ //처리결과에 결재완료
							text : "{StatusText}", 
							textAlign : "Center",
							visible : {
								path : "Status", 
								formatter : function(fVal){
									return fVal !== "AA";
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-4px"),
						new sap.m.FlexBox({
							justifyContent: "Center",
							items: [
								new sap.ui.commons.TextView({ //처리결과에 Text
									text : "{StatusText}", 
									textAlign : "Center"
								})
								.addStyleClass("font-14px font-regular mt-7px"),
								new sap.m.Button({ //처리결과에 삭제 버튼
									text: "{i18n>LABEL_08003}",
									press : oController.onPressCancel
								})
								.addStyleClass("ml-10px button-light-sm")
							],
							visible : {
								path : "Status", 
								formatter : function(fVal){
									return fVal === "AA"; 
								}
							}
						})
					]
				});
			},
			
			onTableSearch: function () {
				//데이터를 가져와서 셋팅하는곳
				var oController = $.app.getController();
				var oTable = $.app.byId(oController.PAGEID + "_Table");
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();

				oController.TableModel.setData({Data: []});

				var sendObject = {};
				
				// Header
				sendObject.IPernr = vPernr;
				sendObject.IConType = "1";
				sendObject.ILangu = "3";
				sendObject.IBukrs = "1000";

				// Navigation property
				sendObject.TableIn = [];

				BusyIndicator.show(0);
				
				oModel.create("/CongratulationApplySet", sendObject, {
					async: true,
					success: function (oData, oResponse) {
						var dataLength = 10;

						if (oData && oData.TableIn.results) {
							//값을 제대로 받아 왔을 때
							var rDatas = oData.TableIn.results;
							dataLength = rDatas.length;
							oController.TableModel.setData({ Data: rDatas }); //직접적으로 화면 테이블에 셋팅하는 작업
						}
						
						oTable.setVisibleRowCount(dataLength > 10 ? 10 : rDatas.length); //rowcount가 10개 미만이면 그 갯수만큼 row적용
						BusyIndicator.hide();
					},
					error: function (oResponse) {
						Common.log(oResponse);
						BusyIndicator.hide();
					}
				});
			},
			
			onStartDatePicker: function() {
				var oController = $.app.getController();
				var vBurks = oController.getUserGubun();
				var vStartDate = $.app.byId(oController.PAGEID + "_StartDatePicker");
				var vYear1 = "",
					vYear2 = "",
					vMonth1 = "",
					vMonth2 = "",
					vDate1 = "",
					vDate2 = "";
				
				if(vBurks !== "A100"){
					vYear1 = new Date().getFullYear()-1;
					vYear2 = new Date().getFullYear()+1;
					vMonth1 = new Date().getMonth();
					vDate1 = new Date().getDate();
					vDate2 = new Date().getDate()-1;
					vStartDate.setMinDate(new Date(vYear1, vMonth1, vDate1));
					vStartDate.setMaxDate(new Date(vYear2, vMonth1, vDate2));
				}else {
					var Bdate = parseInt(oController.g_BDate),
						Edate = parseInt(oController.g_EDate);

					vYear1 = new Date(new Date().setDate(new Date().getDate()-Bdate)).getFullYear();
					vMonth1 = new Date(new Date().setDate(new Date().getDate()-Bdate)).getMonth();
					vDate1 = new Date(new Date().setDate(new Date().getDate()-Bdate)).getDate();
					vStartDate.setMinDate(new Date(vYear1, vMonth1, vDate1));

					vYear2 = new Date(new Date().setDate(new Date().getDate()+Edate)).getFullYear();
					vMonth2 = new Date(new Date().setDate(new Date().getDate()+Edate)).getMonth();
					vDate2 = new Date(new Date().setDate(new Date().getDate()+Edate)).getDate();
					vStartDate.setMaxDate(new Date(vYear1, vMonth2, vDate2));
				}
			},
			
			onPressCancel: function (oEvent) {
				//삭제 버튼 클릭시 발생하는 이벤트
				var oController = $.app.getController();
				var vDatas = oController.TableModel.getData().Data;
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var oRowIndex = oEvent.getSource().getParent().getParent().getParent().getRowBindingContext().sPath.slice(6);
				var vPernr = oController.getUserId();
				
				var onProcessDelete = function (fVal) {
					//삭제 확인클릭시 발생하는 이벤트
					if (fVal && fVal == "삭제") {
						var vDelDatas = vDatas.splice(oRowIndex, 1); //해당 rowdml 칼럼을 제거해줌
						var sendObject = {
							IConType: "4",
							IPernr: vPernr,
							IBukrs: "1000",
							TableIn: vDelDatas //넘길 값들을 담아놓음
						};
						BusyIndicator.show(0);
						
						oModel.create("/CongratulationApplySet", sendObject, {
							//삭제 통신
							async: true,
							success: function (oData, oResponse) {
								//값을 제대로 받아 왔을 때
								oController.onTableSearch(); //다시 한번 화면 호출
								sap.m.MessageBox.alert(oController.getBundleText("LABEL_08003") + oController.getBundleText("LABEL_08023")); //삭제되었습니다 alert표시
								Common.log(oData);
								BusyIndicator.hide();
							},
							error: function (oResponse) {
								Common.log(oResponse);
								BusyIndicator.hide();
							}
						});
					}
				};

				sap.m.MessageBox.confirm(oController.getBundleText("MSG_02040"), {
					//confirm 삭제
					title: oController.getBundleText("LABEL_08022"),
					actions: ["삭제", "취소"],
					onClose: onProcessDelete
				});
			},

			onPressNew: function (oEvent) { //신청버튼으로 화면을 접근했을 때
				var	 oView = $.app.getView(),
					oController = $.app.getController(),
					curDate = new Date(),
					vSelectedType = "";
					
				// Data setting
				oController.DetailModel.setProperty("/FormData", {});
				
				if (!oController._DetailModel) {
					oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_Congratulation.fragment.CongratulationDetail", oController);
					oView.addDependent(oController._DetailModel);
				}

				oController.setTypeCombo(false); //경조유형 function

				vSelectedType = oController.DetailModel.getProperty("/MultiBoxData/0/Code");
				
				//들어갔을때 청첩장 첩부하는곳
				var vMsg = oController.getBundleText("MSG_08104");
				vMsg = vMsg.replace("&Cntl", oController.DetailModel.getProperty("/MultiBoxData/0/TextA"));

				oController.DetailModel.setProperty("/FormData/FilePlaceholder",vMsg);
				oController.DetailModel.setProperty("/FormData/AppDate", curDate);
				oController.DetailModel.setProperty("/FormData/Type", vSelectedType);
				oController.DetailModel.setProperty("/FormData/TextA", "CAAID");
				
				oController.onHelperCheck();
				oController.onCheckedBox(); //체크박스 체크
				oController._DetailModel.open();
				oController.onStartDatePicker();
			},

			setTypeCombo: function (isBegda) { //경조유형을 받아오는곳
				var oController = $.app.getController();
				var oCommonModel = $.app.getModel("ZHR_COMMON_SRV"),
					oCodeHeaderParams = {};
				var vPernr = oController.getUserId();
				var vBurks = oController.getUserGubun();
				var oWarningMsg = $.app.byId(oController.PAGEID + "_WarningMsg");
				var vBegda = oController.DetailModel.getProperty("/FormData/StartDate");
				
				oWarningMsg.setVisible(false);
				
				if(vBurks === "A100"){
					oCodeHeaderParams.ICodeT = "018";
					oCodeHeaderParams.ICodty = "PB120";
					oCodeHeaderParams.IPernr = vPernr;
					oCodeHeaderParams.ISubCode = "DATE";
					oCodeHeaderParams.NavCommonCodeList = [];
					
					oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
						success: function (oData, oResponse) {
							if (oData && oData.NavCommonCodeList.results) {
								//값을 제대로 받아 왔을 때
								var rDatas = oData.NavCommonCodeList.results;
								oController.g_BDate = rDatas[0].Cvalu;
								oController.g_EDate = rDatas[1].Cvalu;
							}
						},
						error: function (oResponse) {
							common.Common.log(oResponse);
						}
					});
				}

				oCodeHeaderParams = {
					ICodeT: "018",
					IPernr: vPernr,
					IBukrs: vBurks,
					IBegda: vBegda,
					NavCommonCodeList: []
				};
				
				if(vBurks === "A100"){ //들어오는 사람에 따라서 column의 변화
					delete oCodeHeaderParams.IBegda;
				}else{		
					if(!isBegda) delete oCodeHeaderParams.IBegda;
				}
				
				oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
					//경조사유형 값받아오는곳
					success: function (oData, oResponse) {
						if (oData && oData.NavCommonCodeList.results) {
							//값을 제대로 받아 왔을 때
							var rDatas = oData.NavCommonCodeList.results;
							
							oController.DetailModel.setProperty("/MultiBoxData", rDatas);
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});
				
				oCodeHeaderParams = {};
				oCodeHeaderParams.ICodeT = "018";
				oCodeHeaderParams.ICodty = "PB120";
				oCodeHeaderParams.NavCommonCodeList = [];
				
				oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
					//경조사유형에따른 상조도우미 Code값 받아오는곳
					success: function (oData, oResponse) {
						if (oData && oData.NavCommonCodeList.results) {
							//값을 제대로 받아 왔을 때
							var rDatas = oData.NavCommonCodeList.results;
							
							oController.DetailModel.setProperty("/MultiBoxDataInfo", rDatas);
						}
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});
			},
			
			onHelperCheck: function (oEvent){ //경조유형에따라 상조도우미 CheckBox호출
				var oController = $.app.getController();
				var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
				var isVisibleVehicle = false,
					isVisibleType = false;
				
				var oDeepCopyData = JSON.parse(JSON.stringify(oMultiBoxInfo));
				
				var oVehicleList = oDeepCopyData.splice(0,2);
		
				if(oController.DetailModel.getProperty("/FormData/TextA") === "CAAID" || oVehicleList.some(function(e) { return e.Code === oController.DetailModel.getProperty("/FormData").Type})){
					isVisibleVehicle = true;
				}
				
				if(oController.getUserGubun() !== "A100" && ("FMAID" === oController.DetailModel.getProperty("/FormData/TextA") || oDeepCopyData.some(function(e) { return e.Code === oController.DetailModel.getProperty("/FormData").Type && e.TextA !== "YONLY"}))){
					isVisibleType = true;
				}
				
				this.DetailModel.setProperty("/FormData/isVisibleVehicle", isVisibleVehicle);
				this.DetailModel.setProperty("/FormData/isVisibleType", isVisibleType);
				
				return;
			},

			onSelectedRow: function (oEvent) { //CellClick Event
				var oView = $.app.getView(),
					oController = $.app.getController();
				var oContext = oEvent.mParameters.rowIndex;
				var oRowData = oController.TableModel.getProperty("/Data/" + oContext);
				
				if (!oController._DetailModel) {
					oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_Congratulation.fragment.CongratulationDetail", oController);
					oView.addDependent(oController._DetailModel);
				}
				
				oController.DetailModel.setProperty("/FormData", oRowData);
				oController.setTypeCombo(false);
				oController.onHelperCheck();
				oController.onReadyPlaceholder();
				oController._DetailModel.open();
				oController.onStartDatePicker();
				
				var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");
				if(oRowData.Fgbdt) oBirthDayDate.setVisible(true);
				else oBirthDayDate.setVisible(false);
				 
			},

			onReadyPlaceholder: function(){ //경조 유형에 따라 첨부서류 변경하는곳
				var oController = $.app.getController();
				var oMultiBox = oController.DetailModel.getProperty("/MultiBoxData");
				
				oMultiBox.forEach(function(elements){ //경조사유형에 맞는 도우미코드를 찾기위한 forEach
					if(elements.Code === oController.DetailModel.getProperty("/FormData/Type")){
						if(Common.checkNull(elements.TextA)) {
							AttachFileAction.setSettingByKey(oController, {key: "InfoMessage", value: null});
							return;
						}
						var vMsg = oController.getBundleText("MSG_08104");
							vMsg = vMsg.replace("&Cntl", elements.TextA);
						
						AttachFileAction.setSettingByKey(oController, {key: "InfoMessage", value: vMsg});
						oController.DetailModel.setProperty("/FormData/FilePlaceholder",vMsg);
					}
				});
			},
			
			onPressSave: function () {
				//저장 event
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vDetailData = oController.DetailModel.getProperty("/FormData");
				var vPernr = oController.getUserId();
				
				if(oController.onErrorCheckBox()){
					return;
				}
				
				this.onCheckedBox(); //체크박스 체크
				vDetailData.Pernr = vPernr;
				vDetailData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
				vDetailData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");
				
				delete vDetailData.FilePlaceholder //필요없는 값이므로 key 삭제
				delete vDetailData.TextA; //필요없는 값이므로 key 삭제
				delete vDetailData.isVisibleType;
				delete vDetailData.isVisibleVehicle; 
				
				BusyIndicator.show(0);
				var onProcessSave = function (fVal) {
					//저장 확인클릭시 발생하는 이벤트
					if (fVal && fVal == "저장") {
						
						// 첨부파일 저장
						vDetailData.Appnm = AttachFileAction.uploadFile.call(oController);
						if(!vDetailData.Appnm) return false;
						
						var sendObject = {
							IConType: "2",
							ILangu: "3",
							IPernr: vPernr,
							IEmpid: vPernr,
							IBukrs: "1000",
							IOdkey: "",
							IDatum: new Date(),
							TableIn: [vDetailData] //넘길 값들을 담아놓음
						};
						
						oModel.create("/CongratulationApplySet", sendObject, {
							async: true,
							success: function (oData, response) {
								sap.m.MessageBox.alert(oController.getBundleText("LABEL_08002") + oController.getBundleText("LABEL_08023"));
								oController.onTableSearch();
								oController._DetailModel.close();
								Common.log(oData);
								BusyIndicator.hide();
							},
							error: function (oError) {
								sap.m.MessageBox.alert(Common.parseError(oError).ErrorMessage, {
									title: oController.getBundleText("LABEL_09030")
								});
								
								oController.onTableSearch();
								Common.log(oError);
								BusyIndicator.hide();
							}
						});
					}
					BusyIndicator.hide();
				};
				sap.m.MessageBox.confirm(oController.getBundleText("LABEL_08002") + oController.getBundleText("LABEL_08024"), {
					title: oController.getBundleText("LABEL_08022"),
					actions: ["저장", "취소"],
					onClose: onProcessSave
				});
			},
			
			onCheckedBox: function (){ //체크박스 상태여부
				var oController = $.app.getController();
				var vCheckBox = $.app.byId(oController.PAGEID+"_TypeCheck");
				var oVehicleCheckBox = $.app.byId(oController.PAGEID+"_VehicleCheck");
				
				if(vCheckBox.mProperties.selected)
					oController.DetailModel.setProperty("/FormData/Fmaid", "X");
				else
					oController.DetailModel.setProperty("/FormData/Fmaid", null);
					
				if(oVehicleCheckBox.mProperties.selected)
					oController.DetailModel.setProperty("/FormData/Caaid", "X");
				else
					oController.DetailModel.setProperty("/FormData/Caaid", null);
				
			},
			
			onPressApply: function () {
				//신청 event
				var oController = $.app.getController();
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vDetailData = oController.DetailModel.getProperty("/FormData"),
					oCopiedData = {};
				var vPernr = oController.getUserId();
				
				if(oController.onErrorCheckBox()){
					return;
				}
				
				delete vDetailData.FilePlaceholder; //필요없는 값이므로 key 삭제
				
				oCopiedData = Object.assign({}, vDetailData);

				oCopiedData.Pernr = vPernr;
				oCopiedData.StartDate = "/Date(" + Common.adjustGMT(oCopiedData.StartDate) + ")/";
				
				this.onCheckedBox(); //체크박스 체크
				oCopiedData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
				oCopiedData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");
				
				if(oCopiedData.Fgbdt) oCopiedData.Fgbdt.setDate(oCopiedData.Fgbdt.getDate() + 1)
				
				delete oCopiedData.TextA; //필요없는 값이므로 key 삭제
				delete oCopiedData.isVisibleType;
				delete oCopiedData.isVisibleVehicle;
				
				BusyIndicator.show(0);
				var onProcessSave = function (fVal) {
					//신청 클릭시 발생하는 이벤트
					if (fVal && fVal == "신청") {
						var PageMoveFunc = function(fVal){
							if(fVal && fVal == MessageBox.Action.YES) {
								setTimeout(parent._gateway.redirect("Vacation.html"), 100);
							} else {
								oController._DetailModel.close();
								oController.onTableSearch();
							}
						}; 
						
						// 첨부파일 저장
						oCopiedData.Appnm = AttachFileAction.uploadFile.call(oController);
						if(!oCopiedData.Appnm) return false;
						
						var sendObject = {
							IConType: "3",
							ILangu: "3",
							IPernr: vPernr,
							IEmpid: vPernr,
							IBukrs: "1000",
							IOdkey: "",
							IDatum: new Date(),
							TableIn: [oCopiedData] //넘길 값들을 담아놓음
						};
						
						oModel.create("/CongratulationApplySet", sendObject, {
							async: true,
							success: function (oData, response) {
								MessageBox.show(oController.getBundleText("MSG_08103"), {
									title : oController.getBundleText("LABEL_08025"),
									actions : [MessageBox.Action.YES, MessageBox.Action.NO],
									onClose : PageMoveFunc
								});
								Common.log(oData);
								BusyIndicator.hide();
							},
							error: function (oError) {
								sap.m.MessageBox.alert(Common.parseError(oError).ErrorMessage, {
									title: oController.getBundleText("LABEL_09030")
								});
								
								oController.onTableSearch();
								Common.log(oError);
								BusyIndicator.hide();
							}
						});
					}
					BusyIndicator.hide();
				};

				sap.m.MessageBox.confirm(oController.getBundleText("LABEL_08001") + oController.getBundleText("LABEL_08024"), {
					title: oController.getBundleText("LABEL_08022"),
					actions: ["신청", "취소"],
					onClose: onProcessSave
				});
			},
			
			onErrorCheckBox: function() { //필수칸 Error값여부 체크
				var oController = $.app.getController();
				var vDetailData = oController.DetailModel.getProperty("/FormData");
				var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");
				
				if (!vDetailData.StartDate) {
					MessageBox.error(oController.getBundleText("MSG_08108"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
				
				if (!vDetailData.Zname) {
					MessageBox.error(oController.getBundleText("MSG_08110"), { title: oController.getBundleText("MSG_08107") });
					return true;
				}
				
				if (!vDetailData.Type) {
					MessageBox.error(oController.getBundleText("MSG_08109"), { title: oController.getBundleText("MSG_08107") });
					return true;
				}
				
				if(oBirthDayDate.getVisible() === true){
					if (!vDetailData.Fgbdt) {
						MessageBox.error(oController.getBundleText("MSG_08115"), { title: oController.getBundleText("MSG_08107") });
						return true;
					}
				}
				
				if(AttachFileAction.getFileLength(oController) === 0) {
					MessageBox.error(oController.getBundleText("MSG_08114"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
			},
			
			onDateType: function () {
				var oController = $.app.getController();
				var vYear = new Date().getFullYear()-1;
				var vMonth = new Date().getMonth()+1;
				var vDate = new Date().getDate();
				var vType = oController.DetailModel.getProperty("/FormData/Type");
				var vMsg = oController.getBundleText("MSG_08111");
				var vDetailData = oController.DetailModel.getProperty("/FormData");
				var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDay");
				var oStartDateIconText = $.app.byId(oController.PAGEID + "_StartDateIconText");
				var vMultiList = ["1507", "1508", "1509", "1510", "1552", "1553", "1554", "1555", "4001", "4002", "4003", "4004", "4005", "4006"];
				var vType1 = ["1552", "1553", "1554", "1555", "4003", "4004", "4005", "4006"]; // 고희 & 칠순
				
				if(vMultiList.some(function(e){ return e === vDetailData.Type})){
					if(vType1.some(function(e){ return e === vType})){ //고희 & 칠순
						vMsg = vMsg.replace("year1", vYear-69);
						vMsg = vMsg.replace("year2", vYear-67);
						vMsg = vMsg.replace("month1", vMonth);
						vMsg = vMsg.replace("month2", vMonth);
						vMsg = vMsg.replace("date1", common.Common.lpad(parseInt(vDate), 2));
						vMsg = vMsg.replace("date2", common.Common.lpad(parseInt(vDate-1), 2));
						oBirthDayDate.setMinDate(new Date(vYear-69, 1, 1));
						oBirthDayDate.setMaxDate(new Date(vYear-67, 12, 0));
					}else{ //회갑 & 환갑
						vMsg = vMsg.replace("year1", vYear-59);
						vMsg = vMsg.replace("year2", vYear-57);
						vMsg = vMsg.replace("month1", vMonth);
						vMsg = vMsg.replace("month2", vMonth);
						vMsg = vMsg.replace("date1", common.Common.lpad(parseInt(vDate), 2));
						vMsg = vMsg.replace("date2", common.Common.lpad(parseInt(vDate-1), 2));
						oBirthDayDate.setMinDate(new Date(vYear-59, 1, 1));
						oBirthDayDate.setMaxDate(new Date(vYear-57, 12, 0));
					}
					sap.m.MessageBox.alert(vMsg, {
						title: oController.getBundleText("LABEL_09030")
					});
					oStartDateIconText.setVisible(true);
				}else{
					oStartDateIconText.setVisible(false);
				}
			},

			onSelectBox: function (oEvent) {
				//경조일과 경조유형 둘다 선택시 기본급,경조율,경조금액 필드
				var oController = $.app.getController();
				var vDetailData = oController.DetailModel.getProperty("/FormData");
				var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
				var vPernr = oController.getUserId();
				var vBukrs = oController.getUserGubun();
				var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
				var oTypeCheck = $.app.byId(oController.PAGEID+"_TypeCheck");
				var oVehicleCheck = $.app.byId(oController.PAGEID+"_VehicleCheck");
				var oBirthDayBox = $.app.byId(oController.PAGEID + "_BirthDayBox");
				var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDay");
				var vBirthDayBox = false;
				var oWarningMsg = $.app.byId(oController.PAGEID + "_WarningMsg");
				var vWarningMsg = false;
				var oPayload = {};
				
				if(oEvent.oSource.sId === "List_Type") this.onDateType();
				else this.setTypeCombo(true);	
				
				if(vBukrs !== "A100"){
					oController.DetailModel.setProperty("/FormData/TextA", "");
					oController.DetailModel.setProperty("/FormData/AmountT", "");
				}
				
				var vComboLength = oMultiBoxInfo.length;
				
				for(var i=0; i<vComboLength; i++){
					if(oMultiBoxInfo[i].Code === oController.DetailModel.getProperty("/FormData/Type"))
						oController.DetailModel.setProperty("/FormData/TextA", oMultiBoxInfo[i].TextA);
				}
				
				if(oController.DetailModel.getProperty("/FormData/TextA") === "YONLY" && vBukrs !== "A100") {
					oBirthDayDate.setValue("");
					vBirthDayBox = true;
				}
				oBirthDayBox.setVisible(vBirthDayBox);
				
				if(oController.DetailModel.getProperty("/FormData/TextA") === "FSVC" && vBukrs !== "A100") {
					vWarningMsg = true;
				}
				oWarningMsg.setVisible(vWarningMsg);

				this.onCheckedBox(); //체크박스 체크
				this.onHelperCheck(); //경조유형코드랑 비교하여 상조도우미 체크박스를 호출하는곳
				
				oTypeCheck.setSelected(false);
				oVehicleCheck.setSelected(false);
				
				oPayload.IOdkey = "";
				oPayload.IConType = "0";
				oPayload.IPernr = vPernr;
				oPayload.IBukrs = "1000";
				oPayload.ILangu = "3";
				oPayload.IDatum = new Date();

				oPayload.TableIn = [];
				oPayload.TableIn.push({
					Pernr: vPernr,
					StartDate: Common.adjustGMTOdataFormat(vDetailData.StartDate),
					Type: vDetailData.Type
				});
				
				this.onReadyPlaceholder();
				
				if (!vDetailData.StartDate || !vDetailData.Type) return;
				
				oModel.create("/CongratulationApplySet", oPayload, {
					success: function (oData, oResponse) {
						//값을 제대로 받아 왔을 때
						if (oController.getUserGubun() === "A100") {
							//첨단일 경우 CopayT에 값이 들어있지 않아 기본급으로 측정되기에 BasicT에서 그대로 받아서 넣어줌.
							oController.DetailModel.setProperty("/FormData/CopayT", oData.TableIn.results[0].AmountT);
						} 

						oController.DetailModel.setProperty("/FormData/BasicT", oData.TableIn.results[0].BasicT);
						oController.DetailModel.setProperty("/FormData/Rate", oData.TableIn.results[0].Rate);
						oController.DetailModel.setProperty("/FormData/AmountT", oData.TableIn.results[0].AmountT);
						oController.onCheckPress();
						Common.log(oData);
					},
					error: function (oResponse) {
						Common.log(oResponse);
					}
				});
			},
			
			onCheckPress: function () {
				var oController = $.app.getController();
				var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
				var vPernr = oController.getUserId();
				var oTypeCheck = $.app.byId(oController.PAGEID + "_TypeCheck");
				var vAppDate = oController.DetailModel.getData().FormData.AppDate;
				
				var vYear = vAppDate.getFullYear()+".";
				var vMonth = vAppDate.getMonth()+1+".";
				var vDate = vAppDate.getDate();
				var vFullDate = new Date(vYear+vMonth+vDate);
				var oCodeHeaderParams = {};
				var rAmountT = "";
				
				if(oTypeCheck.getVisible() !== true) return;
				
				if(oTypeCheck.mProperties.selected !== true && oTypeCheck.getVisible() === true){
					oCodeHeaderParams.ICodeT = "018";
					oCodeHeaderParams.ICodty = "PB120";
					oCodeHeaderParams.IPernr = vPernr;
					oCodeHeaderParams.IDatum = vFullDate;
					oCodeHeaderParams.ISubCode = "FMADM";
					oCodeHeaderParams.NavCommonCodeList = [];
					
					oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
						success: function (oData, oResponse) {
							if (oData && oData.NavCommonCodeList.results) {
								//값을 제대로 받아 왔을 때
								var rDatas = oData.NavCommonCodeList.results;
								var vAmountT = Number(rDatas[0].Text)+Number(oController.DetailModel.getProperty("/FormData/AmountT").replace(/,/g, ""));
								rAmountT = common.Common.numberWithCommas(vAmountT);
							}
						},
						error: function (oResponse) {
							common.Common.log(oResponse);
							rAmountT = oController.DetailModel.getProperty("/FormData/BasicT");
						}
					});
				}else{
					rAmountT = oController.DetailModel.getProperty("/FormData/BasicT");
				}
				
				oController.DetailModel.setProperty("/FormData/AmountT",rAmountT);
			},
			
			onBeforeOpenDetailDialog: function(oEvent) {
				var oController = $.app.getController();
				var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
					vInfoMessage = oController.DetailModel.getProperty("/FormData/FilePlaceholder"),
					vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";

				AttachFileAction.setAttachFile(oController, {
					Appnm: vAppnm,
					Mode: "M",
					Max: 3,
					Required: true,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
					FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png"],
					InfoMessage: vInfoMessage
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20190211"});//20130217 //35110041 
			} : null
			 
		});
	}
);
