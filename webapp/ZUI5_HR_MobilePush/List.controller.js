sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
    "common/SearchOrg",
    "common/SearchUser1",
	"sap/m/MessageBox"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, SearchOrg, SearchUser1, MessageBox) {
	"use strict";

	return CommonController.extend("ZUI5_HR_MobilePush.List", {

		/** AppPushAlarmHeaderSet : 1-Token 2-Log 3-(전체)부서장 token정보 리턴 4-(전체)비밀번호 확인 **/ 

		PAGEID: "ZUI5_HR_MobilePushList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		
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
			gDtfmt = this.getSessionInfoByKey("Dtfmt");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){			 	
				var	vData = {
					Data : {
						Key : 0,
						HeadTxt : "",
						BodyTxt : "",
						Dtfmt : oController.getSessionInfoByKey("Dtfmt")
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.resetTable(oEvent);
		},

		resetTable : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

			var column = oTable.getColumns();
			for(var i=0; i<column.length; i++){
				column[i].setSorted(false);
				column[i].setFiltered(false);
			}

			oTable.getModel().setData({Data : []});
			oTable.setVisibleRowCount(1);
		},

		// 전송대상 라디오버튼 변경 event
		onChangeKey : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			var oControl = oEvent.getSource();

			if(oEvent.getParameters().selectedIndex == 1){
				MessageBox.confirm(oController.getBundleText("MSG_72006"), { // 전 임/직원을 대상으로 하시겠습니까?
					title: oController.getBundleText("LABEL_00149"),
					actions : ["YES", "NO"],
					onClose : function(fVal){
						if(fVal && fVal == "YES"){
							oController._ListCondJSonModel.setProperty("/Data/Key", 1);
							oController.resetTable();
						} else {
							oController._ListCondJSonModel.setProperty("/Data/Key", 0);
							oControl.setSelectedIndex(0);
						}
					}
				});
			} else {
				oController._ListCondJSonModel.setProperty("/Data/Key", 0);
			}
		},

		// 내용 일괄적용
		onSetText : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oIndices = oTable.getSelectedIndices();

			if(oIndices.length == 0){
				MessageBox.alert(oController.getBundleText("MSG_72004"), { // 대상자를 선택하여 주십시오.
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}

			var oJSONModel = oTable.getModel();

			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable.getContextByIndex(oIndices[i]).sPath;

				oJSONModel.setProperty(sPath + "/HeadTxt", oController._ListCondJSonModel.getProperty("/Data/HeadTxt"));
				oJSONModel.setProperty(sPath + "/BodyTxt", oController._ListCondJSonModel.getProperty("/Data/BodyTxt"));
			}

			oTable.clearSelection();
		},
		
		// 대상자 추가
		onPressAddTarget : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			SearchUser1.oController = oController;
			SearchUser1.dialogContentHeight = 480;
			SearchUser1.searchAuth = "A";

			if (!oController.oAddPersonDialog) {
				oController.oAddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
				oView.addDependent(oController.oAddPersonDialog);
			}

			oController.oAddPersonDialog.open();
		},

		/**
		 * @brief 사원검색 팝업에서 호출되는 조직검색 팝업 호출 함수
		 *
		 * @param oEvent
		 */
		 displayMultiOrgSearchDialog: function (oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			SearchOrg.oController = oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				oView.addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

		onESSelectPerson: function(data) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			var EmpSearchResultModel = sap.ui.getCore().getModel("EmpSearchResult"),
				oSearchTable = $.app.byId(oController.PAGEID + "_EmpSearchResult_Table"),
				oIndices = oSearchTable.getSelectedIndices();

			if(oIndices.length == 0){
				MessageBox.alert(oController.getBundleText("MSG_72004"), { // 대상자를 선택하여 주십시오.
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}

			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oData = oTable.getModel().getProperty("/Data"), oNewData = [];

			// 기존데이터 추가
			for(var i=0; i<oData.length; i++){
				oData[i].Idx = oNewData.length;
				oNewData.push(oData[i]);
			}

			// 선택한 대상자 추가 - token 여부 체크
			var createData = {AppPushAlarmTokenSet : []};
			for(var i=0; i<oIndices.length; i++){
				var sPath = oSearchTable.getContextByIndex(oIndices[i]).sPath;
				var data = EmpSearchResultModel.getProperty(sPath);

				var check = "";
				for(var j=0; j<oNewData.length; j++){ // 중복 데이터 제외
					if(data.Pernr == oNewData[j].Pernr){
						check = "X";
					}
				}

				if(check == "X") continue;

				createData.AppPushAlarmTokenSet.push({Pernr : data.Pernr});
			}

			createData.IPernr = oController.getSessionInfoByKey("Pernr");
			createData.ILangu = oController.getSessionInfoByKey("Langu");
			createData.IConType = "1";

			var oModel = $.app.getModel("ZHR_COMMON_SRV");

			oModel.create("/AppPushAlarmHeaderSet", createData, {
				success: function(data, res){
					if(data){
						if(data.AppPushAlarmTokenSet && data.AppPushAlarmTokenSet.results){
							var data1 = data.AppPushAlarmTokenSet.results;
							
							for(var i=0; i<data1.length; i++){
								data1[i].Idx = oNewData.length;
								data1[i].HeadTxt = "";
								data1[i].BodyTxt = "";

								oNewData.push(data1[i]);
							}
						}
					}
				},
				error: function (oError) {
					var Err = {};
					oController.Error = "E";
							
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else oController.ErrorMessage = Err.error.message.value;
					} else {
						oController.ErrorMessage = oError.toString();
					}
				}
			});
			
			oTable.getModel().setData({Data : oNewData});
			oTable.bindRows("/Data");

			var height = parseInt(window.innerHeight - 320);
			var count = parseInt((height - 35) / 38);
			oTable.setVisibleRowCount(oNewData.length < count ? oNewData.length : count);

			if(oController.Error == "E"){
				oController.Error = "";
				MessageBox.error(oController.ErrorMessage);
				return;
			}

			oController.oAddPersonDialog.close();
		},

		// 대상자 삭제
		onPressDeleteTarget : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oIndices = oTable.getSelectedIndices();

			if(oIndices.length == 0){
				MessageBox.alert(oController.getBundleText("MSG_72004"), { // 대상자를 선택하여 주십시오.
					title: oController.getBundleText("LABEL_00149")
				});
				return;
			}
			
			var process = function(){
				var oData = oTable.getModel().getProperty("/Data"), oNewData = [];
				
				for(var i=0; i<oData.length; i++){
					var check = "";
					for(var j=0; j<oIndices.length; j++){
						var sPath = oTable.getContextByIndex(oIndices[j]).sPath;
						var data = oTable.getModel().getProperty(sPath);

						if(data.Pernr == oData[i].Pernr){
							check = "X";
						}
					}

					if(check == ""){
						oData[i].Idx = oNewData.length;
						oNewData.push(oData[i]);
					}
				}

				oTable.getModel().setData({Data : oNewData});
				oTable.bindRows("/Data");

				var height = parseInt(window.innerHeight - 320);
				var count = parseInt((height - 35) / 38);
				oTable.setVisibleRowCount(oNewData.length < count ? oNewData.length : count);

				oController._BusyDialog.close();
				MessageBox.alert(oController.getBundleText("MSG_00021"), { // 삭제되었습니다.
					title : oController.getBundleText("LABEL_00149")
				});
			};

			MessageBox.confirm(oController.getBundleText("MSG_72005"), { // 대상자를 삭제하시겠습니까?
				actions : ["YES", "NO"],
				title: oController.getBundleText("LABEL_00149"),
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(process, 100);
					}
				}
			});
		},

		// 발송
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			var oData = oController._ListCondJSonModel.getProperty("/Data");
			var createData = {AppPushAlarmLogSet : []};
			var tokenyn = "";
			
			// validation check
			if(oData.Key == 0){
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oTableData = oTable.getModel().getProperty("/Data");

				if(oTableData.length == 0){
					MessageBox.alert(oController.getBundleText("MSG_72009"), { // 대상자가 없습니다.
						title : oController.getBundleText("LABEL_00149")
					});
					return;
				}

				var target = 0;
				for(var i=0; i<oTableData.length; i++){
					if(oTableData[i].Token == ""){
						tokenyn = "N";
						continue;
					}

					if(oTableData[i].HeadTxt.trim() == "" && oTableData[i].BodyTxt.trim() == ""){
						MessageBox.alert(oController.getBundleText("MSG_72007") + "(" + oTableData[i].Pernr + ", " + oTableData[i].Ename + ")", { // 제목 또는 본문을 입력하세요.
							title : oController.getBundleText("LABEL_00149")
						});
						return;
					}
					
					target++;
				}

				if(target == 0){
					MessageBox.alert(oController.getBundleText("MSG_72011"), { // 발송 가능한 대상자가 없습니다.
						title : oController.getBundleText("LABEL_00149")
					});
					return;
				}
			} else {
				if(oData.HeadTxt.trim() == "" && oData.BodyTxt.trim() == ""){
					MessageBox.alert(oController.getBundleText("MSG_72007"), { // 제목 또는 본문을 입력하세요.
						title : oController.getBundleText("LABEL_00149")
					});
					return;
				}
			}

			var process = function(){
				createData.IPernr = oController.getSessionInfoByKey("Pernr");
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				createData.IConType = "2";

				if(oData.Key == 0){
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
					var oTableData = oTable.getModel().getProperty("/Data");
	
					for(var i=0; i<oTableData.length; i++){						
						if(oTableData[i].Token == ""){
							continue;
						}

						if(Common.sendPush({
								title: oTableData[i].HeadTxt == "" ? " " : oTableData[i].HeadTxt,
								body: oTableData[i].BodyTxt == "" ? " " : oTableData[i].BodyTxt,
								token: oTableData[i].Token
						   }) != false){
							createData.AppPushAlarmLogSet.push({Pernr : oTableData[i].Pernr, HeadTxt : oTableData[i].HeadTxt, BodyTxt : oTableData[i].BodyTxt});
						} 
					}
					
					var oModel = $.app.getModel("ZHR_COMMON_SRV");
					oModel.create("/AppPushAlarmHeaderSet", createData, {
						success: function(data, res){
							if(data){
								
							}
						},
						error: function (oError) {
							var Err = {};
							oController.Error = "E";
									
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
								else oController.ErrorMessage = Err.error.message.value;
							} else {
								oController.ErrorMessage = oError.toString();
							}
						}
					});

					oController._BusyDialog.close();

					if(oController.Error == "E"){
						oController.Error = "";
						MessageBox.error(oController.ErrorMessage);
						return;
					}

					MessageBox.success(oController.getBundleText("MSG_72012"), { // Mobile Push 발송되었습니다.
						title: oController.getBundleText("LABEL_00149"),
						onClose : function(){
							oController.resetTable();
							oController._ListCondJSonModel.setProperty("/Data/HeadTxt", "");
							oController._ListCondJSonModel.setProperty("/Data/BodyTxt", "");	
						}
					});
				} else {
					// 전체 push 발송 전 부서장 비밀번호 발송 및 확인 로직 추가					
					createData.IConType = "3";
					createData.AppPushAlarmCheckSet = [];

					var oConfirmData = [];
					var oModel = $.app.getModel("ZHR_COMMON_SRV");
					oModel.create("/AppPushAlarmHeaderSet", createData, {
						success: function(data, res){
							if(data && data.AppPushAlarmCheckSet.results.length){
								oConfirmData.push(data.AppPushAlarmCheckSet.results[0]);
							}
						},
						error: function (oError) {
							var Err = {};
							oController.Error = "E";
									
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
								else oController.ErrorMessage = Err.error.message.value;
							} else {
								oController.ErrorMessage = oError.toString();
							}
						}
					});

					oController._BusyDialog.close();

					if(oController.Error == "E"){
						oController.Error = "";
						MessageBox.error(oController.ErrorMessage);
						return;
					}

					if(oConfirmData.length > 0){
						if(oConfirmData[0].Token == ""){
										 	 // 부서장(${Ename} ${Zposttx})의 핸드폰에 Hi HR App이 설치되어 있지 않습니다. 설치 후 진행하시기 바랍니다.
							MessageBox.alert(oController.getBundleText("MSG_72014").interpolate(oConfirmData[0].Ename, oConfirmData[0].Zposttx), { 
								title : oController.getBundleText("LABEL_00149")
							});
							return;
						} else {
							if(!oController._CernmDialog){
								oController._CernmDialog = sap.ui.jsfragment("ZUI5_HR_MobilePush.fragment.Cernm", oController);
								oView.addDependent(oController._CernmDialog);
							}

							// 비밀번호 push 발송
							$.post({
								url: common.Common.getJavaOrigin($.app.getController(), "/pushAuth"),
								dataType: 'text',
								data: {
									token: oConfirmData[0].Token,
									body: oConfirmData[0].Cernm
								},
								async: false,
								success: function (data) {
									common.Common.log([].slice.call(data));
								},
								error: function () {
									common.Common.log([].slice.call(arguments));
								}
							});

							oConfirmData[0].Cernm2 = "";

							oController._CernmDialog.getModel().setData({Data : oConfirmData[0]});
							oController._CernmDialog.open();
						}
					}
				}
			};
												   // 발송이 불가능한 대상자는 제외합니다.					// Mobile Push 발송을 진행할까요?
			var confirmMessage = (tokenyn == "N" ? oController.getBundleText("MSG_72008") + "\n" : "") + oController.getBundleText("MSG_72010");

			MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				title : oController.getBundleText("LABEL_00149"),
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(process, 100);
					}
				}
			});
		},

		// 전체 푸시 발송 전 인증번호 확인
		onPushCheck : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_MobilePush.List");
			var oController = oView.getController();

			var oData = oController._CernmDialog.getModel().getProperty("/Data");
			
			if(oData.Cernm2.trim() == ""){
				MessageBox.alert(oController.getBundleText("MSG_72015"), { // 비밀번호를 입력하세요.
					title : oController.getBundleText("LABEL_00149")
				});
				return;
			}

			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var createData = {};
				createData.IPernr = oController.getSessionInfoByKey("Pernr");
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				createData.IConType = "4";
				createData.AppPushAlarmCheckSet = [{Pernr : oData.Pernr, Cernm : oData.Cernm2}];

			oModel.create("/AppPushAlarmHeaderSet", createData, {
				success: function(data, res){
					if(data){
						
					}
				},
				error: function (oError) {
					var Err = {};
					oController.Error = "E";
							
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else oController.ErrorMessage = Err.error.message.value;
					} else {
						oController.ErrorMessage = oError.toString();
					}
				}
			});

			if(oController.Error == "E"){
				oController.Error = "";
				MessageBox.error(oController.ErrorMessage);
				return;
			}

			// 전체 모바일 푸시 발송 + 로그 저장
				createData.IConType = "2";
				createData.AppPushAlarmLogSet = [{
					HeadTxt : oController._ListCondJSonModel.getProperty("/Data/HeadTxt"),
					BodyTxt : oController._ListCondJSonModel.getProperty("/Data/BodyTxt")
				}];

			if(common.Common.getOperationMode() == "PRD"){
				Common.log("PUSH : ALL");
				if(Common.sendPush({
						title: oController._ListCondJSonModel.getProperty("/Data/HeadTxt") == "" ? " " : oController._ListCondJSonModel.getProperty("/Data/HeadTxt"),
						body: oController._ListCondJSonModel.getProperty("/Data/BodyTxt") == "" ? " " : oController._ListCondJSonModel.getProperty("/Data/BodyTxt"),
						token: "/topic/news"
				}) == false){
					MessageBox.alert(oController.getBundleText("MSG_72016"), { // Mobile Push 발송 중 오류가 발생하였습니다.
						title : oController.getBundleText("LABEL_00149")
					});
					return;
				}
			}

			oModel.create("/AppPushAlarmHeaderSet", createData, {
				success: function(data, res){
					if(data){
						
					}
				},
				error: function (oError) {
					var Err = {};
					oController.Error = "E";
							
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else oController.ErrorMessage = Err.error.message.value;
					} else {
						oController.ErrorMessage = oError.toString();
					}
				}
			});

			if(oController.Error == "E"){
				oController.Error = "";
				MessageBox.error(oController.ErrorMessage);
				return;
			}

			MessageBox.success(oController.getBundleText("MSG_72012"), { // Mobile Push 발송되었습니다.
				title: oController.getBundleText("LABEL_00149"),
				onClose : function(){
					oController._ListCondJSonModel.setProperty("/Data/HeadTxt", "");
					oController._ListCondJSonModel.setProperty("/Data/BodyTxt", "");
					oController._CernmDialog.close();
				}
			});
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});