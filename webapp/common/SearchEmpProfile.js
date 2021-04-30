jQuery.sap.declare("common.SearchEmpProfile"); 

common.SearchEmpProfile = {
	PAGEID : "EmpProfile",
	oController : null,
	
	userId : null,
	Appye : null,
	Disty : null, // '': 평가, '1': 승진
	
	_JSONModel : new sap.ui.model.json.JSONModel(),
	_MessageJSONModel : new sap.ui.model.json.JSONModel(),
	_BusyDialog : new sap.m.BusyDialog(),
	   
	// 번역
	oBundleText : jQuery.sap.resources({
		url : "i18n/i18n.properties?" + new Date().getTime(),
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
	onBeforeOpen : function(oEvent){
		common.SearchEmpProfile.Appye = common.SearchEmpProfile.Appye ? common.SearchEmpProfile.Appye : "2020";
		
		common.SearchEmpProfile._JSONModel.setData({Data : []});
		
		if(sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV") == undefined){
			var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
					var pair = p.split(/=/);
					if (pair[0] === "s4hana") { return pair[1]; }
				})[0],
				destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
				
			var oModel = new sap.ui.model.odata.ODataModel(destination + "/sap/opu/odata/sap/ZHR_PERS_INFO_SRV/", true, undefined, undefined, undefined, undefined, undefined, false);
				oModel.setCountSupported(false); 
				oModel.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModel, "ZHR_PERS_INFO_SRV");
		}             
		
		// table 초기화
		for(var i=1; i<=8; i++){
			eval("var oTable" + i + " = sap.ui.getCore().byId(common.SearchEmpProfile.PAGEID + '_Table" + i + "');");
			eval("var oJSONModel" + i + " = oTable" + i + ".getModel();");
			eval("var vData" + i + " = {Data : []};");
			
			eval("var oColumn = oTable" + i + ".getColumns();");
			for(var j=0; j<oColumn.length; j++){
				oColumn[j].setSorted(false);
				oColumn[j].setFiltered(false); 
			}
			
			eval("oJSONModel" + i + ".setData(vData" + i + ");");
			eval("oTable" + i + ".bindRows('/Data');");
			eval("oTable" + i + ".setVisibleRowCount(1);");
		}
		
	},
	
	onAfterOpen : function(oEvent){
		var oObjectLayout = sap.ui.getCore().byId(common.SearchEmpProfile.PAGEID + "_ObjectPageLayout");	
			oObjectLayout.setSelectedSection(oObjectLayout.getSections()[0].sId);
			
		setTimeout(function(){
			common.SearchEmpProfile.onSearchUser();
		}, 100);
	},
	
	onSearchUser : function(oEvent){
		// 화면 최초 접속 시 접속한 대상자의 유저 정보 호출
		// userId가 넘어온 경우 해당 아이디의 유저 정보 호출
		var userId = "";
		
		if(common.SearchEmpProfile.userId && common.SearchEmpProfile.userId != ""){
			userId = common.SearchEmpProfile.userId;
		} else {
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");

			userId = vEmpLoginInfo[0].name == "sfdev1" ? "20060040" : vEmpLoginInfo[0].name; // 20140120
		}
		
		var oData = {};
		
		if(common.SearchEmpProfile.Disty == "1"){ // 승진에서 사원 프로파일 조회 시 EmpProfileSet 의 TBasic으로 헤더 정보를 구성함
			oData.userId = userId;
		} else { // 종합평가에서 사원 프로파일 조회
			new JSONModelHelper().url("/odata/v2/User('" + userId + "')")
								 .select("userId")
								 .select("nickname")
								 .select("title")
								 .select("custom01")
								 .select("department")
								 .select("division")
								 .select("jobCode")
								 .select("custom01")
								 .select("custom02")
								 .select("custom04")
								 .setAsync(false)
								 .attachRequestCompleted(function(){
										var data = this.getData().d;
										
										if(data){
											data.Gentd = "";
											data.Gdura = "";
											data.Jentd = "";
											data.Jdura = "";
											data.Enttp = "";
											data.Grade = "";
											data.Aprdt = "";
											data.Jkdur = "";
											data.Ages = "";
											data.Fatxt = "";
											
											oData = data;
										}
								 })
								 .attachRequestFailed(function() {
										sap.m.MessageBox.error(arguments);
										return;
								 })
								 .load();
		}

		new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + userId + "' and photoType eq '1'")
							 .select("photo")
							 .setAsync(false)
							 .attachRequestCompleted(function(){
									var data = this.getData().d;
									
									if(data && data.results.length){
										oData.photo = "data:text/plain;base64," + data.results[0].photo;
									} else {
										oData.photo = "	images/male.jpg";
									}
							 })
							 .attachRequestFailed(function() {
									oData.photo = "	images/male.jpg";
							 })
							 .load();
		
		common.SearchEmpProfile._JSONModel.setProperty("/Data", oData);
		
		setTimeout(function(){
			common.SearchEmpProfile.onPressSearch();
		}, 100);
	},
	
	onPressSearch : function(oEvent){
		for(var i=1; i<=8; i++){
			eval("var oTable" + i + " = sap.ui.getCore().byId(common.SearchEmpProfile.PAGEID + '_Table" + i + "');");
			eval("var oJSONModel" + i + " = oTable" + i + ".getModel();");
			eval("var vData" + i + " = {Data : []};");
			
			eval("var oColumn = oTable" + i + ".getColumns();");
			for(var j=0; j<oColumn.length; j++){
				oColumn[j].setSorted(false);
				oColumn[j].setFiltered(false); 
			}
		}
		
		var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
		var createData = {TBasic : [], TEducation : [], TAction : [], TEvaluation : [], TPrize : [], TDiscipline : [], TCareer : [], TCertification : [], TLanguage : []};
			createData.IEmpid = common.SearchEmpProfile._JSONModel.getProperty("/Data/userId");
			createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
			
		oModel.create("/EmpProfileSet", createData, null,
			function(data,res){
				if(data){
					var detail = ["TEducation", "TAction", "TEvaluation", "TPrize", "TDiscipline", "TCareer", "TCertification", "TLanguage"];
					for(var i=0; i<detail.length; i++){
						var oData = eval("data." + detail[i]);
						
						if(oData){
							if(oData.results && oData.results.length){
								for(var j=0; j<oData.results.length; j++){
									switch(detail[i]){
										case "TCertification":
											oData.results[j].GetDate = oData.results[j].GetDate ? new Date(common.Common.setTime(oData.results[j].GetDate)) : null;
											break;
									}
									
									eval("vData" + (i+1) + ".Data.push(oData.results[j]);");
								}
							}
						}
					}
					
					// 기본 정보
					if(data.TBasic){
						if(data.TBasic.results && data.TBasic.results.length){
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Gentd", data.TBasic.results[0].Gentd);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Gdura", data.TBasic.results[0].Gdura);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Jentd", data.TBasic.results[0].Jentd);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Jdura", data.TBasic.results[0].Jdura);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Enttp", data.TBasic.results[0].Enttp);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Grade", data.TBasic.results[0].Grade);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Aprdt", data.TBasic.results[0].Aprdt);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Jkdur", data.TBasic.results[0].Jkdur);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Ages", data.TBasic.results[0].Ages);
							common.SearchEmpProfile._JSONModel.setProperty("/Data/Fatxt", data.TBasic.results[0].Fatxt);
							
							if(common.SearchEmpProfile.Disty == "1"){ // 승진
								common.SearchEmpProfile._JSONModel.setProperty("/Data/nickname", data.TBasic.results[0].Ename);
								common.SearchEmpProfile._JSONModel.setProperty("/Data/title", "");
								common.SearchEmpProfile._JSONModel.setProperty("/Data/department", data.TBasic.results[0].Orgtx);
								common.SearchEmpProfile._JSONModel.setProperty("/Data/custom01", data.TBasic.results[0].Grade);
							}
						}
					}
				}
			},
			function (oError) {
		    	var Err = {};
		    	common.SearchEmpProfile.Error = "E";
		    	
				if (oError.response) {
					Err = window.JSON.parse(oError.response.body);
					var msg1 = Err.error.innererror.errordetails;
					if(msg1 && msg1.length) common.SearchEmpProfile.ErrorMessage = Err.error.innererror.errordetails[0].message;
					else common.SearchEmpProfile.ErrorMessage = Err.error.message.value;
				} else {
					common.SearchEmpProfile.ErrorMessage = oError.toString();
				}
			}
		);
		
		for(var i=1; i<=8; i++){
			eval("oJSONModel" + i + ".setData(vData" + i + ");");
			eval("oTable" + i + ".bindRows('/Data');");
			eval("oTable" + i + ".setVisibleRowCount(vData" + i + ".Data.length >= 11 ? 11 : vData" + i + ".Data.length);");
		}
		
		if(common.SearchEmpProfile.Error == "E"){
			common.SearchEmpProfile.Error = "";
			sap.m.MessageBox.error(common.SearchEmpProfile.ErrorMessage);
			return;
		}
	},
	
	makeContent : function(Flag){
		if(!Flag) return;
		
		var col_info = null, oTitle = "";
		
		switch(Flag){
			case "1": // 학력사항
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18007");
					  // 입학월, 졸업월, 학교명, 학위, 전공
			col_info = [{id: "Begym", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18020"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Endym", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18021"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Atext", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18022"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Stext", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18023"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ftext", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18024"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
				break;
			case "2": // 발령사항
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18008");
					  // 발령일, 유형, 사유, 발령사항, 직급, 직책, 근거
			col_info = [{id: "Begda", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18025"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Mntxt", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18026"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Mgtxt", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18027"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zzmass", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18028"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin", width : "25%"},
						{id: "Grade", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18029"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Titel", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18030"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Reasn", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18031"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
				break;
			case "3": // 평가
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18009");
					  // 평가연도, 업적평가, 역량평가, 다면평가, 업적등급, 종합평가, 조직평가
			col_info = [{id: "Zyear", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18032"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "App01", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18033"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "App02", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18034"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "1", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18035"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "1", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18036"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "App03", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18037"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
						// {id: "1", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18038"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
				break;
			case "4": // 포상
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18010");
					  // 포상일자, 유형, 명칭, 사유
			col_info = [{id: "Begda", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18039"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Awdtx", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18040"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Awdnm", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18041"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zzawrsn", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18042"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin", width : "40%"}];
				break;
			case "5": // 징계
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18011");
					  // 징계일자, 유형/명칭, 종료일자, 사유
			col_info = [{id: "Begda", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18043"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Awdtx", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18044"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Awdnm", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18045"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zzawrsn", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18042"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin", width : "40%"}];
				break;
			case "6": // 사외경력
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18012");
					  // 시작일, 종료일, 회사명, 직위, 담당업무
			col_info = [{id: "Carbg", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18046"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Cared", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18047"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Worka", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18048"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zztitle", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18049"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zzjob", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18050"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
				break;
			case "7": // 자격사항
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18013");
					  // 자격명, 자격번호, 주관, 취득일
			col_info = [{id: "Lictx", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18051"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "LicnNum", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18052"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "OrgText", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18053"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "GetDate", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18054"), plabel : "", span : 0, type : "date", sort : true, filter : true}];
				break;
			case "8": // 외국어
			oTitle = common.SearchEmpProfile.oBundleText.getText("LABEL_18014");
					  // 외국어명, 자격명, 성적, 취득일
			col_info = [{id: "Lantx", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18055"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Lantp", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18051"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Langd", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18056"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Begda", label : common.SearchEmpProfile.oBundleText.getText("LABEL_18054"), plabel : "", span : 0, type : "string", sort : true, filter : true}];
				break;
		}
		
		var oTable = new sap.ui.table.Table(common.SearchEmpProfile.PAGEID + "_Table" + Flag, {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: "None",
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			extension : [new sap.m.Toolbar({
							 height : "35px",
							 content : [new sap.m.Text({text : oTitle}).addStyleClass("Font18 Font700")]
						 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		common.makeTable.makeColumn(common.SearchEmpProfile.oController, oTable, col_info);
		
		return oTable;
	}
};
