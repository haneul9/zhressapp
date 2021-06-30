/* eslint-disable no-undef */
$.sap.declare("fragment.COMMON_ATTACH_FILES");

$.sap.require("control.ODataFileUploader");
$.sap.require("sap.ui.core.util.File");
$.sap.require("sap.m.MessageBox");
$.sap.require("common.Common");

fragment.COMMON_ATTACH_FILES = {
	renderer : function(oController,vPage){
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN" + vPage, {
			name: oController.PAGEID + "UploadFile" + vPage,
			modelName: "ZHR_COMMON_SRV",
			slug: "",
			maximumFileSize: 10,
			multiple: true,
			uploadOnChange: false,
			mimeType: [], //["image","text","application"],
			fileType: "{/Settings/FileTypes}", //["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf"]
			buttonText: "{i18n>LABEL_00134}", // 업로드
			buttonOnly: true,
			//uploadUrl : "/sap/opu/odata/sap/ZL2P01GW0001_SRV/FileSet/",
			uploadComplete: $.proxy(function(oEvent){fragment.COMMON_ATTACH_FILES.uploadComplete(oEvent, vPage);}, oController),
			uploadAborted: $.proxy(function(oEvent){fragment.COMMON_ATTACH_FILES.uploadAborted(oEvent, vPage);}, oController),
			fileSizeExceed: fragment.COMMON_ATTACH_FILES.fileSizeExceed,
			typeMissmatch: fragment.COMMON_ATTACH_FILES.typeMissmatch,
			change: $.proxy(function(oEvent){fragment.COMMON_ATTACH_FILES.onFileChange(oEvent,oController, vPage);}, oController),
			visible: {
				parts: [
					{path: "/Settings/Editable"},
					{path: "/Settings/Mode"},
					{path: "/Settings/Length"}
				],
				formatter: function(v1, v2, v3) {
					if(v1 === true) {
						if(v2 === "S") {
							if(v3 < 1) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					} else {
						return false;
					}
				}
			}
		});

		var FileInfoBox = new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			alignContent: sap.m.FlexAlignContent.Center,
			alignItems: sap.m.FlexAlignItems.Center,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({					
					alignContent: sap.m.FlexAlignContent.Center,
					alignItems: sap.m.FlexAlignItems.Center,
					items: [
						new sap.m.Label({
							text: "{/Settings/Label}",
							required: "{/Settings/Required}"
						//	design: "Bold"
						}).addStyleClass("sub-title pt-9px"), // 첨부파일
						new sap.m.MessageStrip({
							text: "{/Settings/InfoMessage}",
							enableFormattedText: true,
							showIcon: true,
							showCloseButton: false,
							visible: {
								path: "/Settings/InfoMessage",
								formatter: function(v) {
									if(v) return true;
									else return false;
								}
							}
						}).addStyleClass("ml-8px")
					]
				}),
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: $.proxy(function(){this.onPressHelpBtn.bind(oController,vPage);}, oController),
							text: "{i18n>LABEL_00149}", // 안내
							visible: {
								path: "/Settings/HelpButton",
								formatter: function(v) {
									if(v === true) return true;
									else return false;
								}
							}
						}),
						oFileUploader
					],
					visible: {
						path: "/Settings/Editable",
						formatter: function(v) {
							if(v) return true;
							else return false;
						}
					}
				})
			]
		}).addStyleClass("mt-10px");
		
		var oColumns = new sap.m.ColumnListItem({
			cells: [
				new sap.m.FlexBox({
					items: [
						new sap.ui.core.Icon({
							size: "0.5rem",
							src: {
								path: "Type",
								formatter: function(v) {
									return common.Common.FileTypeIcon(v);
								}
							},
							color: "#005f28",
							visible: {
								parts: [
									{path: "Mimetype"},
									{path: "Mresource"}
								],
								formatter: function(v1, v2) {
									return parent._gateway.isMobile() && /image+\/[-+.\w]+/.test(v1) && v2 ? false : true;
								}
							}
						}),
						new sap.m.Link({
							text: "{Fname}",
							wrapping: true,
							textAlign: "Begin",
							press: fragment.COMMON_ATTACH_FILES.onDownload.bind(oController),
							visible: {
								parts: [
									{path: "Mimetype"},
									{path: "Mresource"}
								],
								formatter: function(v1, v2) {
									return parent._gateway.isMobile() && /image+\/[-+.\w]+/.test(v1) && v2 ? false : true;
								}
							}
						}).addStyleClass("ml-4px"),
						new sap.m.Image({
							width: "100%",
							lazyLoading: true,
							src: "{Mresource_convert}",
							visible: {
								parts: [
									{path: "Mimetype"},
									{path: "Mresource"}
								],
								formatter: function(v1, v2) {
									return parent._gateway.isMobile() && /image+\/[-+.\w]+/.test(v1) && v2 ? true : false;
								}
							}
						})
					]
				}),
				new sap.m.Button({
					icon: "sap-icon://decline",
					press: $.proxy(function(oEvent){fragment.COMMON_ATTACH_FILES.onDeleteAttachFileRow(oEvent,oController,vPage);}, oController),
					visible: {
						path: "/Settings/Editable",
						formatter: function(v) {
							if(v) return true;
							else return false;
						}
					}
				}).addStyleClass("button-light-sm")
			]
		});

		var oAttachFileTable = new sap.m.Table(oController.PAGEID + "_CAF_Table"+vPage, {
			inset: false,
			showNoData: false,
			// mode: "{/Settings/ListMode}",
			mode: sap.m.ListMode.None,
			columns: [
				new sap.m.Column({
					hAlign: sap.ui.core.TextAlign.Begin
				}),
				new sap.m.Column({
					width:"90px",
					hAlign: sap.ui.core.TextAlign.End,
					visible: {
						path: "/Settings/Editable",
						formatter: function(v) {
							if(v === true) {
								return true;
							} else {
								return false;
							}
						}
					}
				})
			]
		})
		.addStyleClass("mt-4px")
		.bindItems("/Data", oColumns);

		return new sap.m.FlexBox(oController.PAGEID + "_ATTACHBOX"+vPage, {
			width: "100%",
			direction: sap.m.FlexDirection.Column,
			items: [FileInfoBox, oAttachFileTable]
		})
		.setModel(new sap.ui.model.json.JSONModel());
	},

	onDownload: function(oEvent) {
		var vFileInfo = oEvent.getSource().getBindingContext().getProperty();

		if(!vFileInfo) return;

		if(common.Common.isExternalIP()) {
			// if(common.Common.isPRD() && parent._gateway.isMobile()) {
			// 	sap.m.MessageBox.alert(this.getBundleText("MSG_00074"), {	// 조회할 수 없습니다.
			// 		title: this.getBundleText("LABEL_09029")
			// 	});
			// } else {
				fragment.COMMON_ATTACH_FILES.retrieveFile(vFileInfo);
			// }
		} else {
			var popup = window.open(vFileInfo.Url, '_blank');

			if(!popup) {
				sap.m.MessageBox.alert(this.getBundleText("MSG_00073"), { // 원활한 진행을 위해 브라우저의 설정 메뉴에서 팝업차단을 해제하시기 바랍니다.
					title: this.getBundleText("LABEL_00149") // 안내
				});
	
				return false;
			} else {
				setTimeout(function() {
					popup.focus();
				}, 500);
			}
		}
	},
	
	retrieveFile: function(vFileInfo) {
		var sampleArr = common.Common.base64ToArrayBuffer(vFileInfo.Mresource);
		common.Common.saveByteArray(vFileInfo.Fname, vFileInfo.Mimetype, sampleArr);
	},

	setAttachFile: function (oController, opt, vPage) {
		var options = $.extend(
				true,
				{ 
					Editable: false, 
					FileTypes: [], 
					InfoMessage: "", 
					Label:oController.getBundleText("LABEL_00135"),
					Appnm: "",
					Mode: "S",	// S: single file, M: multi file
					Max: 2,
					Required: false,
					HelpButton: false,
					HelpTextList: [],
					UseMultiCategories: false,
					CntnmDifferent: false,
					ReadAsync: false,
					CntnmDifferentData: []
				},
				opt
			),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"+vPage),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage);

		oFileUploader.setValue("");

		options.ListMode = options.Editable ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
		options.FileTypes = ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "jpg", "bmp", "gif", "png", "txt", "pdf", "jpeg"];
		if (!common.Common.isEmptyArray(opt.FileTypes)) options.FileTypes = opt.FileTypes;

		oAttachbox.getModel().setProperty("/Settings", options);
		oAttachbox.getModel().setProperty("/DelelteDatas", []);

		this.refreshAttachFileList(oController,null,vPage);
		
		if(oController.PAGEID === "MedApply") {
			this.hideLine(oAttachbox);
		}
	},

	hideLine : function(oAttachbox){
		if(oAttachbox.getModel().getProperty("/Settings/Mode")=="S"){
			if(oAttachbox.getModel().getProperty("/Data").length!=0){
				if($("#"+oAttachbox.getId()).children()[0])
					$("#"+oAttachbox.getId()).children()[0].style.display="none";
			}
		}
	},

	availLine : function(vPage){
		if($.app.byId(this.PAGEID + "_ATTACHBOX"+vPage).getModel().getProperty("/Settings/Mode")=="S"){
			if($("#"+this.PAGEID + "_ATTACHBOX"+vPage).children()[0])
				$("#"+this.PAGEID + "_ATTACHBOX"+vPage).children()[0].style.display="";			
		}
	},

	/*
	 * @param {key : {string}, value : {any}}
	 *
	 */
	setSettingByKey: function (oController, opt, vPage) {
		var options = $.extend(true, {}, opt),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage);

		if (options.key) oAttachbox.getModel().setProperty("/Settings/" + options.key, options.value);
	},

	getFileLength: function (oController, vPage) {
		var vAttachDatas = sap.ui
			.getCore()
			.byId(oController.PAGEID + "_ATTACHBOX"+vPage)
			.getModel()
			.getProperty("/Data");

		return vAttachDatas ? vAttachDatas.length : 0;
	},

	once: function(vAppnm) {
		return common.Common.getPromise(true,
			function(resolve, reject) {
				if(!vAppnm) {
					resolve();
					return;
				}

				if (!sap.ui.getCore().getModel("_TempFiledatas_")) {
					sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "_TempFiledatas_");
				} else {
					sap.ui.getCore().getModel("_TempFiledatas_").setProperty("/Data", []);
				}

				$.app.getModel("ZHR_COMMON_SRV").read("/FileListSet", {
					async: true,
					filters: [ new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm) ],
					success: function (data) {
						if (data && data.results.length) {
							sap.ui.getCore().getModel("_TempFiledatas_").setProperty("/Data", data.results);
						}
						resolve();
					},
					error: function (res) {
						common.Common.log(res);
						reject();
					}
				});
			}
		);
	},

	getTempData: function() {
		if (!sap.ui.getCore().getModel("_TempFiledatas_")) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "_TempFiledatas_");
        }

		return sap.ui.getCore().getModel("_TempFiledatas_").getProperty("/Data") || [];
	},

	/*
	 * 첨부파일 리스트를 Binding한다.
	 */
	refreshAttachFileList: function (oController, vExistDataFlag, vPage) {
		var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN"+vPage+"-fu_input-inner"),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"+vPage),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"+vPage),
			oModel = $.app.getModel("ZHR_COMMON_SRV"),
			JSonModel = oAttachbox.getModel(),
			vAttachFileDatas = JSonModel.getProperty("/Data"),
			vAppnm = JSonModel.getProperty("/Settings/Appnm"),
			vUse = JSonModel.getProperty("/Settings/UseMultiCategories"),
			vAsync = JSonModel.getProperty("/Settings/ReadAsync"),
			vDif = JSonModel.getProperty("/Settings/CntnmDifferent"),
			vDifData = JSonModel.getProperty("/Settings/CntnmDifferentData"),
			Datas = { Data: [] },
			aTempDatas = this.getTempData();

		oAttachbox.setBusyIndicatorDelay(0).setBusy(true);
		JSonModel.setProperty("/Settings/Length", 0);
		JSonModel.setProperty("/Data", []);

		oAttachbox.setBusyIndicatorDelay(0).setBusy(true);
		JSonModel.setProperty("/Settings/Length", 0);
		JSonModel.setProperty("/Data", []);

		if(!vAppnm) {
			oAttachbox.setBusy(false);
			return;
		}

		if (f1) f1.setAttribute("value", "");

		oFileUploader.clear();
		oFileUploader.setValue("");
		oAttachFileList.removeSelections(true);

		if(vDif){
			if(vPage==vDifData.Cntnm){
				vDifData.New = false;
				vDifData.Type = vDifData.Fname.substring(vDifData.Fname.lastIndexOf(".") + 1);
				Datas.Data.push(vDifData);
			}

			JSonModel.setProperty("/Settings/Length", Datas.Data.length);
			JSonModel.setProperty("/Data", Datas.Data);
			JSonModel.refresh();

			oAttachbox.setBusy(false);
		} else {
			if(aTempDatas.length) {
				aTempDatas.forEach(function(elem) {
					elem.Url = elem.Url.replace(/retriveScpAttach/, "retriveAttach");
					elem.Mresource_convert = "data:${mimetype};base64,${resource}".interpolate(elem.Mimetype, elem.Mresource);

					if(vUse){
						if(vPage=="001"||vPage=="002"||vPage=="003"||vPage=="004"||vPage=="005"||vPage=="006"){
							if(vPage==elem.Cntnm){
								elem.New = false;
								elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
								Datas.Data.push(elem);
							}
						}else if(vPage=="009"){
							if(oController.PAGEID=="MedApply"||oController.PAGEID=="MedApplyDet"){
								if(elem.Cntnm!="001"&&elem.Cntnm!="002"){
									elem.New = false;
									elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
									Datas.Data.push(elem);
								}
							}else{
								elem.New = false;
								elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
								Datas.Data.push(elem);
							}									
						}else{
							if(elem.Cntnm =="009"){
								elem.New = false;
								elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
								Datas.Data.push(elem);
							}
						}
					}else{
						elem.New = false;
						elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
						Datas.Data.push(elem);
					}
				});

				// DB저장 전 올린 File List 를 배열에 담는다. ( 이후에 DB에 저장 된 File List 와 결합하여 보여줌 )
				if (vExistDataFlag == "X" && vAttachFileDatas) {
					vAttachFileDatas.forEach(function (elem) {
						if(elem.New === true) Datas.Data.push(elem);
					});
				}

				JSonModel.setProperty("/Settings/Length", Datas.Data.length);
				JSonModel.setProperty("/Data", Datas.Data);
				JSonModel.refresh();

				oAttachbox.setBusy(false);
			} else {
				oModel.read("/FileListSet", {
					async: vAsync || false,
					filters: [
						new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)
					],
					success: function (data) {
						if (data && data.results.length) {
							data.results.forEach(function (elem) {
								elem.Url = elem.Url.replace(/retriveScpAttach/, "retriveAttach");
								elem.Mresource_convert = "data:${mimetype};base64,${resource}".interpolate(elem.Mimetype, elem.Mresource);
	
								if(vUse){
									if(vPage=="001"||vPage=="002"||vPage=="003"||vPage=="004"||vPage=="005"||vPage=="006"){
										if(vPage==elem.Cntnm){
											elem.New = false;
											elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
											Datas.Data.push(elem);
										}
									}else if(vPage=="009"){
										if(oController.PAGEID=="MedApply"||oController.PAGEID=="MedApplyDet"){
											if(elem.Cntnm!="001"&&elem.Cntnm!="002"){
												elem.New = false;
												elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
												Datas.Data.push(elem);
											}
										}else{
											elem.New = false;
											elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
											Datas.Data.push(elem);
										}									
									}else{
										if(elem.Cntnm =="009"){
											elem.New = false;
											elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
											Datas.Data.push(elem);
										}
									}
								}else{
									elem.New = false;
									elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
									Datas.Data.push(elem);
								}
								
							});
						}
	
						// DB저장 전 올린 File List 를 배열에 담는다. ( 이후에 DB에 저장 된 File List 와 결합하여 보여줌 )
						if (vExistDataFlag == "X" && vAttachFileDatas) {
							vAttachFileDatas.forEach(function (elem) {
								if(elem.New === true) Datas.Data.push(elem);
							});
						}
	
						JSonModel.setProperty("/Settings/Length", Datas.Data.length);
						JSonModel.setProperty("/Data", Datas.Data);
						JSonModel.refresh();
	
						oAttachbox.setBusy(false);
					},
					error: function (res) {
						common.Common.log(res);
						oAttachbox.setBusy(false);
					}
				});
			}
		}

		
	},

	/*
	 * 업로드 옆에 안내 버튼을 클릭했을때 Message를 띄워줌
	 */
	onPressHelpBtn: function(vPage) {
		var oView = $.app.getView(),
			oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			JSonModel = oAttachbox.getModel(),
			oHelpTextList = JSonModel.getProperty("/Settings/HelpTextList");
		
		if (!oController._TextViewModel) {
			oController._TextViewModel = sap.ui.jsfragment("fragment.TextFlexBox", oController);
			oView.addDependent(oController._TextViewModel);
			
			var oTextFlexBox = sap.ui.getCore().byId(oController.PAGEID + "_TextFlexBox"+vPage);
			var vLength = oHelpTextList.length;
			for(var i=0; i<vLength; i++){
				if(i === 0) {
					oTextFlexBox.addItem(
						new sap.m.Label({
							text: oHelpTextList[i].Text,
							textAlign: "Begin",
							design: "Bold"
						}).addStyleClass("color-info-red ml-4px mr-4px mt-4px")
					);
				}else{
					oTextFlexBox.addItem(
						new sap.m.Text({
							text: oHelpTextList[i].Text,
							textAlign: "Begin"
						}).addStyleClass("ml-4px mr-4px")
					);
				}
			}
		}
		
		oController._TextViewModel.open();
	},

	/*
	 * 첨부파의 크기가 Max Size를 넘었을 경우의 처리내역
	 */
	fileSizeExceed: function (oEvent) {
		var sName = oEvent.getParameter("fileName"),
			fSize = oEvent.getParameter("fileSize"),
			fLimit = oEvent.getSource().getMaximumFileSize(),
			sMsg = "${name} 파일(${size} MB)은 최대 허용 크기 ${limit} MB를 초과하였습니다.";

		sap.m.MessageBox.alert(sMsg.interpolate(sName, fSize.toFixed(1), fLimit));
	},

	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch: function (oEvent) {
		var sName = oEvent.getParameter("fileName"),
			sType = oEvent.getParameter("fileType"),
			sMsg = "${name} 파일의 ${type} 은 허용된 파일 확장자가 아닙니다.";

		sap.m.MessageBox.alert(sMsg.interpolate(sName, sType));
	},

	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent, vPage) {
		var sResponse = oEvent.getParameter("response"),
			oFileUploader = sap.ui.getCore().byId(this.PAGEID + "_ATTACHFILE_BTN"+vPage);

		sap.m.MessageBox.alert(sResponse, { title: this.getBundleText("LABEL_00149") }); // 안내

		oFileUploader.setValue("");

		this.refreshAttachFileList(this, null, vPage);
	},

	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted: function () {
		sap.m.MessageBox.alert(this.getBundleText("MSG_00031"));
	},

	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역
	 */
	onFileChange: function (oEvent,oController, vPage) {
		var oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"+vPage),
			f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN"+vPage+"-fu_input-inner"),
			JSonModel = oAttachbox.getModel(),
			vFileData = JSonModel.getProperty("/Data"),
			aFileList = [],
			vMode = JSonModel.getProperty("/Settings/Mode"),
			vMax = JSonModel.getProperty("/Settings/Max"),
			files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN"+vPage+ "-fu").files;

		if (files) {
			vFileData.forEach(function(elem) {
				aFileList.push(elem);
			});

			if(vMode === "M" && (vFileData.length + files.length) > vMax) {
				oFileUploader.clear();
				oFileUploader.setValue("");
				if (f1) f1.setAttribute("value", "");

				sap.m.MessageToast.show(oController.getBundleText("MSG_00036").interpolate(vMax), { my: "center center", at: "center center"});

				return;
			}

			if(vMode === "S" && (vFileData.length + files.length) > 1) {
				oFileUploader.clear();
				oFileUploader.setValue("");
				if (f1) f1.setAttribute("value", "");

				sap.m.MessageToast.show(oController.getBundleText("MSG_00036").interpolate(1), { my: "center center", at: "center center"});

				return;
			}

			for (var i = 0; i < files.length; i++) {
				files[i].New = true;
				files[i].Fname = files[i].name;
				files[i].Type = files[i].type;

				aFileList.push(files[i]);
			}

			JSonModel.setProperty("/Settings/Length", aFileList.length);
			JSonModel.setProperty("/Data", aFileList);
		}
		
		oFileUploader.clear();
		oFileUploader.setValue("");
		if (f1) f1.setAttribute("value", "");

		if(oController.PAGEID === "MedApply") {
			fragment.COMMON_ATTACH_FILES.hideLine(oAttachbox);
		}
	},

	callDeleteFileService: function(fileInfo) {
		var oModel = $.app.getModel("ZHR_COMMON_SRV"),
			bReturnFlag = false,
			sPath = oModel.createKey("/FileListSet", {
				Appnm: fileInfo.Appnm,
				Docid: fileInfo.Docid,
				Cntnm: fileInfo.Cntnm
			});

		oModel.remove(sPath, {
			success: function () {
				bReturnFlag = true;
			},
			error: function (res) {
				bReturnFlag = false;

				var errData = common.Common.parseError(res);
				if(errData.Error && errData.Error === "E") {
					sap.m.MessageBox.error(errData.ErrorMessage, {
						title: this.getBundleText("LABEL_09029")
					});
				}
			}
		});

		return bReturnFlag;
	},

	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile: function (vPage) {
		var oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			oJSonModel = oAttachbox.getModel(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"+vPage),
			vContexts = oTable.getSelectedContexts(true);

		if (common.Common.isEmptyArray(vContexts)) {
			sap.m.MessageBox.alert(oController.getBundleText("MSG_00035")); // 삭제할 파일을 선택하세요.
			return;
		}

		oTable.removeSelections(true);

		var deleteProcess = function (fVal) {
			if(!fVal || fVal === sap.m.MessageBox.Action.NO) return;
			
			try {
				vContexts.slice().reverse().some(function(oRow) {
					var vRowData = oJSonModel.getProperty(oRow.getPath()),
						vIndex = parseInt(oRow.getPath().replace("/Data/", ""));

					// 기 저장된 파일
					if (vRowData.New === false) {
						var aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];

						aDeleteFiles.push(vRowData);
						oJSonModel.setProperty("/DelelteDatas", aDeleteFiles);
					}

					oJSonModel.getProperty("/Data").splice(vIndex, 1);
					oJSonModel.setProperty("/Settings/Length", oJSonModel.getProperty("/Data").length);
					oJSonModel.setProperty("/Data", oJSonModel.getProperty("/Data"));
				});

				sap.m.MessageToast.show(oController.getBundleText("MSG_00032"), { my: "center center", at: "center center"}); // 파일 삭제가 완료되었습니다.

			} catch (ex) {
				common.Common.log(ex);
			}
		};

		sap.m.MessageBox.show(oController.getBundleText("MSG_00033"), {
			title: oController.getBundleText("LABEL_00150"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: deleteProcess
		});
	},
	
	/*
	 * Row - 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFileRow: function (oEvent,oController,vPage) {
		var	oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"+vPage),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"+vPage),
			oJSonModel = oAttachbox.getModel(),
			vPath = oEvent.getSource().getBindingContext().getPath(),
			vContexts = oJSonModel.getProperty(vPath),
			vIndex = vPath.replace("/Data/", "");

		if(!vContexts) return;

		oTable.removeSelections(true);

		var deleteProcess =	 function (fVal) {
			if(!fVal || fVal === sap.m.MessageBox.Action.NO) return;

			try {
				if(vContexts.New === false) {
					var aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];

					aDeleteFiles.push(vContexts);
					oJSonModel.setProperty("/DelelteDatas", aDeleteFiles);
				}

				oJSonModel.getProperty("/Data").splice(vIndex, 1);
				oJSonModel.setProperty("/Data", oJSonModel.getProperty("/Data"));
				oJSonModel.setProperty("/Settings/Length", oJSonModel.getProperty("/Data").length);

				sap.m.MessageToast.show(oController.getBundleText("MSG_00032"), { my: "center center", at: "center center"}); // 파일 삭제가 완료되었습니다.
				if(oController.PAGEID=="MedApply"){
					fragment.COMMON_ATTACH_FILES.availLine.call(oController,vPage);
				}
			} catch (ex) {
				common.Common.log(ex);
			}
		};

		sap.m.MessageBox.show(oController.getBundleText("MSG_00033"), {
			title: oController.getBundleText("LABEL_00149"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: deleteProcess
		});
	},

	resizingLabel:function(vNo){
		$("#"+this.PAGEID+"_ATTACHBOX"+vNo).children()[0].childNodes[0].childNodes[0].style.width="75px";	
	},

	/*
	 * 첨부파일을 다운로드 한다.
	 */
	onDownloadAttachFile: function (oEvent) {
		var oSrc = oEvent.getSource(),
			vAseqn = "",
			vDocid = "",
			oCustomList = oSrc.getCustomData();

		if (oCustomList && oCustomList.length == 4) {
			vAseqn = oCustomList[0].getValue();
			vDocid = oCustomList[1].getValue();
		}

		document.iWorker.location.href = "/sap/bc/bsp/sap/ZUI5_HR_BSP/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
	},

	uploadFile: function (vPage) {
		var oModel = $.app.getModel("ZHR_COMMON_SRV"),
			oAttachbox = sap.ui.getCore().byId(this.PAGEID + "_ATTACHBOX"+vPage),
			vAttachDatas = oAttachbox.getModel().getProperty("/Data") || [],
			aDeleteFiles = oAttachbox.getModel().getProperty("/DelelteDatas") || [],
			vAppnm = oAttachbox.getModel().getProperty("/Settings/Appnm") || "",
			oController = this.oView.getController(),
			vPernr = oController.getSessionInfoByKey("Pernr");

		try {
			var _handleSuccess = function (data) {
				if(!vAppnm) vAppnm = $(data).find("content").next().children().eq(7).text();
				
				common.Common.log(this.getBundleText("MSG_00034") + ", " + data);
			};
			var _handleError = function (data) {
				vAppnm = null;
				var errorMsg = this.getBundleText("MSG_00031");

				common.Common.log("Error: " + data);
				sap.m.MessageToast.show(errorMsg, { my: "center center", at: "center center"});
			};

			// 파일 삭제
			if(aDeleteFiles.length) {
				var bDeleteFlag = true;
				aDeleteFiles.some(function(elem) {
					bDeleteFlag = fragment.COMMON_ATTACH_FILES.callDeleteFileService(elem);

					return !bDeleteFlag;
				});

				if(!bDeleteFlag) {
					sap.m.MessageToast.show(this.getBundleText("MSG_00031"), { my: "center center", at: "center center"});
					return;
				}
			}

			// 신규 등록된 파일만 업로드
			if (common.Common.isEmptyArray(vAttachDatas)) return;

			vAttachDatas.forEach(function (elem) {
				if(elem.New === true) {
					oModel.refreshSecurityToken();
					var oRequest = oModel._createRequest();
					var oHeaders = {
						"x-csrf-token": oRequest.headers["x-csrf-token"],
						"slug": [vAppnm, vPernr, encodeURI(elem.Fname), vPernr].join("|")
					};
	
					common.Common.log(oHeaders.slug);
					
					jQuery.ajax({
						type: "POST",
						async: false,
						url: $.app.getDestination() + "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/",
						headers: oHeaders,
						cache: false,
						contentType: elem.type,
						processData: false,
						data: elem,
						success: _handleSuccess.bind(this),
						error: _handleError.bind(this)
					});
				}
			}.bind(this));
		} catch (oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
		return vAppnm;
	},

	//싱글 파일일때만 쓸 것, 멀티파일도 가능 (2021.04~)
	uploadFiles: function (vPages) {
		var oModel = $.app.getModel("ZHR_COMMON_SRV");
		var vFiles = [];
		var dFiles = [];
		var vAppnm = "";
		var oController=this;
		var _handleSuccess = function (data) {
			if(!vAppnm) vAppnm = $(data).find("content").next().children().eq(7).text();

			common.Common.log(oController.getBundleText("MSG_00034") + ", " + data);
		};
		var _handleError = function (data) {
			vAppnm = null;
			var errorMsg = oController.getBundleText("MSG_00031");

			common.Common.log("Error: " + data);
			sap.m.MessageToast.show(errorMsg, { my: "center center", at: "center center"});
		};

		for(var i=0;i<vPages.length;i++){
			var oAttachbox = sap.ui.getCore().byId(this.PAGEID + "_ATTACHBOX"+vPages[i]),
				vAttachDatas = oAttachbox.getModel().getProperty("/Data") || [],
				aDeleteFiles = oAttachbox.getModel().getProperty("/DelelteDatas") || [],
				vPernr = "";
			
			vFiles.push(vAttachDatas);

			oController = this.oView.getController();
			vPernr = oController.getSessionInfoByKey("Pernr");
				
			vAppnm = oAttachbox.getModel().getProperty("/Settings/Appnm") || "";

			// 파일 삭제
			if(aDeleteFiles.length) {
				var bDeleteFlag = true;
				aDeleteFiles.some(function(elem) {
					bDeleteFlag = fragment.COMMON_ATTACH_FILES.callDeleteFileService(elem);
					dFiles.push(elem);
					return !bDeleteFlag;
				});

				if(!bDeleteFlag) {
					sap.m.MessageToast.show(oController.getBundleText("MSG_00031"), { my: "center center", at: "center center"});
					return;
				}
			}			
		}

		// 신규 등록된 파일만 업로드
		if (common.Common.isEmptyArray(vFiles)) return;

		vFiles.forEach(function (elem,a) {
			vFiles[a].forEach(function (elem2,b) {
				if(elem2.New === true) {
					oModel.refreshSecurityToken();
					var oRequest = oModel._createRequest();
					var oHeaders = {
						"x-csrf-token": oRequest.headers["x-csrf-token"],
						"slug": [vAppnm, vPernr, encodeURI(elem2.Fname), vPernr, vPages[a]].join("|")
					};
					if(vPages[a]=="001"||vPages[a]=="002"||vPages[a]=="003"||vPages[a]=="004"||vPages[a]=="005"||vPages[a]=="006"){
						oHeaders.slug=[vAppnm, vPernr, encodeURI(elem2.Fname), vPernr, vPages[a]].join("|");
					}else{
						oHeaders.slug=[vAppnm, vPernr, encodeURI(elem2.Fname), vPernr, parseInt(b)+3].join("|");
					}
					common.Common.log(oHeaders.slug);
					
					jQuery.ajax({
						type: "POST",
						async: false,
						url: $.app.getDestination() + "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/",
						headers: oHeaders,
						cache: false,
						contentType: elem2.type,
						processData: false,
						data: elem2,
						success: _handleSuccess.bind(this),
						error: _handleError.bind(this)
					});
				}
			}.bind(this));
		}.bind(this));

		return vAppnm;
	},

	deleteDocument: function(vPages) {
		for(var i=0;i<vPages.length;i++){
			var oAttachbox = sap.ui.getCore().byId(this.PAGEID + "_ATTACHBOX"+vPages[i]),
				vAttachDatas = oAttachbox.getModel().getProperty("/Data") || [];

			// 파일 삭제
			if(vAttachDatas.length) {
				vAttachDatas.forEach(function(elem) {
					fragment.COMMON_ATTACH_FILES.callDeleteFileService(elem);
				});
			}
		}
	}
};