sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/AttachFileAction",
        "common/JSONModelHelper",
        "sap/ui/core/BusyIndicator",
        "sap/m/MessageBox",
        "common/OrgOfIndividualHandler",
        "common/DialogHandler",
        "common/SearchOrg",
        "common/SearchUser1"
    ],
    function (Common, CommonController, AttachFileAction, JSONModelHelper, BusyIndicator, MessageBox, OrgOfIndividualHandler, DialogHandler, SearchOrg, SearchUser1) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "List",

            TableModel: new JSONModelHelper(),
            DetailModel: new JSONModelHelper(),
            SearchModel: new JSONModelHelper(),
            g_BDate: "",
            g_EDate: "",

            getUserId: function() {

                return this.SearchModel.getProperty("/User/Pernr") ? this.SearchModel.getProperty("/User/Pernr") : this.getSessionInfoByKey("name");
            },
            
            getUserGubun  : function() {
    
                return this.SearchModel.getProperty("/User/Bukrs") ? this.SearchModel.getProperty("/User/Bukrs") : this.getSessionInfoByKey("Bukrs");
            },

            getUserGubun2: function () {
                return this.getView().getModel("session").getData().Bukrs2;
            },

            onInit: function () {
                this.setupView();

                this.getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            onBeforeShow: function () {
                Common.log("onBeforeShow");
            },

            onAfterShow: function () {
                this.SearchModel.setData({ User: {}});
                var oTable = $.app.byId(this.PAGEID + "_Table");
                Common.adjustAutoVisibleRowCount.call(oTable);
                this.DetailModel.setProperty("/Bukrs", this.getUserGubun());
            },

            getStatusTxt: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        path: "Rate",
                        formatter: function (v) {
                            return Number(v) + "%";
                        }
                    },
                    textAlign: "Center"
                });
            },

            getVisibleBotton: function () {
                var oController = $.app.getController();

                return new sap.m.FlexBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.commons.TextView({
                            //처리결과에 결재완료
                            text: "{StatusText}",
                            textAlign: "Center",
                            visible: {
                                path: "Status",
                                formatter: function (fVal) {
                                    return fVal !== "AA";
                                }
                            }
                        }).addStyleClass("font-14px font-regular mt-4px"),
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            items: [
                                new sap.ui.commons.TextView({
                                    //처리결과에 Text
                                    text: "{StatusText}",
                                    textAlign: "Center"
                                }).addStyleClass("font-14px font-regular mt-7px"),
                                new sap.m.Button({
                                    //처리결과에 삭제 버튼
                                    text: "{i18n>LABEL_08003}",
                                    press: oController.onPressCancel
                                }).addStyleClass("ml-10px button-light-sm")
                            ],
                            visible: {
                                path: "Status",
                                formatter: function (fVal) {
                                    return fVal === "AA";
                                }
                            }
                        })
                    ]
                });
            },

            onPressSer: function() {

                if(Common.checkNull(this.SearchModel.getProperty("/User/Pernr"))) {
                    MessageBox.error(this.getBundleText("MSG_08120"), { title: this.getBundleText("LABEL_00149")});
					return true;
                }

                this.onTableSearch();
            },

            onTableSearch: function () {
                //데이터를 가져와서 셋팅하는곳
                var oController = $.app.getController();
                var oTable = $.app.byId(oController.PAGEID + "_Table");
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun2();

                oController.TableModel.setData({ Data: [] });

                var sendObject = {};

                // Header
                sendObject.IPernr = vPernr;
                sendObject.IConType = "1";
                sendObject.ILangu = "3";
                sendObject.IBukrs = vBukrs2;

                // Navigation property
                sendObject.TableIn = [];

                BusyIndicator.show(0);

                oModel.create("/CongratulationApplySet", sendObject, {
                    async: false,
                    success: function (oData) {
                        if (oData && oData.TableIn.results) {
                            //값을 제대로 받아 왔을 때
                            var rDatas = oData.TableIn.results;
                            oController.TableModel.setData({ Data: rDatas }); //직접적으로 화면 테이블에 셋팅하는 작업
                        }
                        BusyIndicator.hide();
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                        BusyIndicator.hide();
                    }
                });
                Common.adjustAutoVisibleRowCount.call(oTable);
            },

            onStartDatePicker: function () {
                var oController = $.app.getController();
                var vBurks = oController.getUserGubun();
                var vStartDate = $.app.byId(oController.PAGEID + "_StartDatePicker");

                if (vBurks !== "A100") {
                    vStartDate.setMinDate(moment().subtract(1, 'year').toDate());
                    vStartDate.setMaxDate(moment().add(1, 'year').subtract(1, 'days').toDate());
                } else {
                    vStartDate.setMinDate(moment().subtract(parseInt(oController.g_BDate), 'days').toDate());
                    vStartDate.setMaxDate(moment().add(parseInt(oController.g_EDate), 'days').toDate());
                }
            },

            onPressCancel: function (oEvent) {
                //삭제 버튼 클릭시 발생하는 이벤트
                var oController = $.app.getController();
                var vDatas = oController.TableModel.getData().Data;
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oRowIndex = oEvent.getSource().getParent().getParent().getParent().getRowBindingContext().sPath.slice(6);
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun2();

                var onProcessDelete = function (fVal) {
                    //삭제 확인클릭시 발생하는 이벤트
                    if (fVal && fVal == "삭제") {
                        var vDelDatas = vDatas.splice(oRowIndex, 1); //해당 rowdml 칼럼을 제거해줌
                        var sendObject = {
                            IConType: "4",
                            IPernr: vPernr,
                            IBukrs: vBukrs2,
                            TableIn: vDelDatas //넘길 값들을 담아놓음
                        };
                        BusyIndicator.show(0);

                        oModel.create("/CongratulationApplySet", sendObject, {
                            //삭제 통신
                            async: true,
                            success: function (oData) {
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

            onPressNew: function () {
                //신청버튼으로 화면을 접근했을 때
                var oView = $.app.getView(),
                    oController = $.app.getController(),
                    curDate = new Date(),
                    vSelectedType = "";

                // Data setting
                oController.DetailModel.setData({ FormData: [] });

                if(Common.checkNull(oController.SearchModel.getProperty("/User/Pernr"))) {
                    MessageBox.error(oController.getBundleText("MSG_08119"), { title: oController.getBundleText("LABEL_00149")});
					return true;
                }

                if (!oController._DetailModel) {
                    oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CongratulationHASS.fragment.CongratulationDetail", oController);
                    oView.addDependent(oController._DetailModel);
                }

                oController.setTypeCombo(false); //경조유형 function

                vSelectedType = oController.DetailModel.getProperty("/MultiBoxData/0/Code");

                //들어갔을때 청첩장 첩부하는곳
                var vMsg = oController.getBundleText("MSG_08104");
                vMsg = vMsg.replace("&Cntl", oController.DetailModel.getProperty("/MultiBoxData/0/TextA"));

                oController.DetailModel.setProperty("/FormData/FilePlaceholder", vMsg);
                oController.DetailModel.setProperty("/FormData/Begda", curDate);
                oController.DetailModel.setProperty("/FormData/Type", vSelectedType);
                oController.DetailModel.setProperty("/FormData/TextA", "CAAID");

                oController.onHelperCheck();
                oController.onCheckedBox(); //체크박스 체크
                oController._DetailModel.open();
                oController.onStartDatePicker();
            },

            getBukrs: function(vDate) { // Bukrs가져옴
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs = "";
                
                var sendObject = {
                    Datum: moment(vDate).hours(10).toDate(),
                    Pernr: vPernr,
                    BukrsExport: []
                };

                oModel.create("/BukrsImportSet", sendObject, {
                    success: function (oData) {
                        //값을 제대로 받아 왔을 때
                        vBukrs = oData.BukrsExport.results[0].Bukrs;
                        Common.log(oData);
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return vBukrs;
            },

            setTypeCombo: function (isBegda, vChangeBukrs) {
                //경조유형을 받아오는곳
                var oController = $.app.getController();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV"),
                    oCodeHeaderParams = {};
                var vPernr = oController.getUserId();
                var vBurks = Common.checkNull(vChangeBukrs) ? oController.getUserGubun() : vChangeBukrs;
                var oWarningMsg = $.app.byId(oController.PAGEID + "_WarningMsg");
                var vBegda = oController.DetailModel.getProperty("/FormData/StartDate");

                oWarningMsg.setVisible(false);

                if (vBurks === "A100") {
                    oCodeHeaderParams.ICodeT = "018";
                    oCodeHeaderParams.ICodty = "PB120";
                    oCodeHeaderParams.IPernr = vPernr;
                    oCodeHeaderParams.ISubCode = "DATE";
                    oCodeHeaderParams.ILangu = "3";
                    oCodeHeaderParams.NavCommonCodeList = [];

                    oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                        success: function (oData) {
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
                    ILangu: "3",
                    NavCommonCodeList: []
                };

                if (vBurks === "A100") {
                    //들어오는 사람에 따라서 column의 변화
                    delete oCodeHeaderParams.IBegda;
                } else {
                    if (!isBegda) delete oCodeHeaderParams.IBegda;
                }

                oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                    //경조사유형 값받아오는곳
                    success: function (oData) {
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
                oCodeHeaderParams.ILangu = "3";
                oCodeHeaderParams.NavCommonCodeList = [];

                oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                    //경조사유형에따른 상조도우미 Code값 받아오는곳
                    success: function (oData) {
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

            searchOrgehPernr : function(oController){
                var oView = $.app.byId("ZUI5_HR_CongratulationHASS.List");
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
                    } else if(o.Otype == "O"){
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_38020"), { title: oController.getBundleText("MSG_08107")});
                    }
                };
        
                oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
                DialogHandler.open(oController.OrgOfIndividualHandler);
            },
    
            onSetInfo : function(Pernr){
                if(!Pernr) return;
                var oView = $.app.byId("ZUI5_HR_CongratulationHASS.List");
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
                var oView = $.app.byId("ZUI5_HR_CongratulationHASS.List");
                var oController = oView.getController();
    
                oController.onSetInfo(data.Pernr);
                oController.OrgOfIndividualHandler.getDialog().close();
                SearchUser1.onClose();
            },

            onHelperCheck: function () {
                //경조유형에따라 상조도우미 CheckBox호출
                var oController = $.app.getController();
                var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
                var isVisibleVehicle = false,
                    isVisibleType = false;

                var oDeepCopyData = JSON.parse(JSON.stringify(oMultiBoxInfo));

                var oVehicleList = oDeepCopyData.splice(0, 2);

                if (
                    oController.DetailModel.getProperty("/FormData/TextA") === "CAAID" ||
                    oVehicleList.some(function (e) {
                        return e.Code === oController.DetailModel.getProperty("/FormData").Type;
                    })
                ) {
                    isVisibleVehicle = true;
                }

                if (
                    oController.getUserGubun() !== "A100" &&
                    (oController.DetailModel.getProperty("/FormData/TextA") === "FMAID" ||
                        oDeepCopyData.some(function (e) {
                            return e.Code === oController.DetailModel.getProperty("/FormData").Type && e.TextA !== "YONLY";
                        }))
                ) {
                    isVisibleType = true;
                }

                this.DetailModel.setProperty("/FormData/isVisibleVehicle", isVisibleVehicle);
                this.DetailModel.setProperty("/FormData/isVisibleType", isVisibleType);

                return;
            },

            onSelectedRow: function (oEvent) {
                //CellClick Event
                var oView = $.app.getView(),
                    oController = $.app.getController();
                var oContext = oEvent.mParameters.rowIndex;
                var oRowData = oController.TableModel.getProperty("/Data/" + oContext);
                var oCopiedRow = $.extend(true, {}, oRowData);

                if (!oController._DetailModel) {
                    oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_CongratulationHASS.fragment.CongratulationDetail", oController);
                    oView.addDependent(oController._DetailModel);
                }

                oController.DetailModel.setProperty("/FormData", oCopiedRow);
                oController.setTypeCombo(false);
                oController.onHelperCheck();
                oController.onReadyPlaceholder();
                oController._DetailModel.open();
                oController.onStartDatePicker();

                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");
                if (oCopiedRow.Fgbdt) oBirthDayDate.setVisible(true);
                else oBirthDayDate.setVisible(false);
            },

            onReadyPlaceholder: function () {
                //경조 유형에 따라 첨부서류 변경하는곳
                var oController = $.app.getController();
                var oMultiBox = oController.DetailModel.getProperty("/MultiBoxData");

                oMultiBox.forEach(function (elements) {
                    //경조사유형에 맞는 도우미코드를 찾기위한 forEach
                    if (elements.Code === oController.DetailModel.getProperty("/FormData/Type")) {
                        if (Common.checkNull(elements.TextA)) {
                            AttachFileAction.setSettingByKey(oController, { key: "InfoMessage", value: null });
                            return;
                        }
                        var vMsg = oController.getBundleText("MSG_08104");
                        vMsg = vMsg.replace("&Cntl", elements.TextA);

                        AttachFileAction.setSettingByKey(oController, { key: "InfoMessage", value: vMsg });
                        oController.DetailModel.setProperty("/FormData/FilePlaceholder", vMsg);
                    }
                });
            },

            onPressSave: function () {
                //저장 event
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun2();

                if (oController.onErrorCheckBox()) {
                    return;
                }

                this.onCheckedBox(); //체크박스 체크
                vDetailData.Pernr = vPernr;
                vDetailData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
                vDetailData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");

                if (vDetailData.Fgbdt) {
                    vDetailData.Fgbdt = Common.setUTCDateTime(vDetailData.Fgbdt);
                }

                delete vDetailData.FilePlaceholder; //필요없는 값이므로 key 삭제
                delete vDetailData.TextA; //필요없는 값이므로 key 삭제
                delete vDetailData.isVisibleType;
                delete vDetailData.isVisibleVehicle;

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    //저장 확인클릭시 발생하는 이벤트
                    if (fVal && fVal == "저장") {
                        // 첨부파일 저장
                        vDetailData.Appnm = AttachFileAction.uploadFile.call(oController);
                        if (!vDetailData.Appnm) return false;

                        var sendObject = {
                            IConType: "2",
                            ILangu: "3",
                            IPernr: vPernr,
                            IEmpid: oController.getSessionInfoByKey("name"),
                            IBukrs: vBukrs2,
                            IOdkey: "",
                            IDatum: new Date(),
                            TableIn: [Common.copyByMetadata(oModel, "CongratulationApplyTableIn", vDetailData)] //넘길 값들을 담아놓음
                        };

                        oModel.create("/CongratulationApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
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

            onCheckedBox: function () {
                //체크박스 상태여부
                var oController = $.app.getController();
                var vCheckBox = $.app.byId(oController.PAGEID + "_TypeCheck");
                var oVehicleCheckBox = $.app.byId(oController.PAGEID + "_VehicleCheck");

                if (vCheckBox.mProperties.selected) oController.DetailModel.setProperty("/FormData/Fmaid", "X");
                else oController.DetailModel.setProperty("/FormData/Fmaid", null);

                if (oVehicleCheckBox.mProperties.selected) oController.DetailModel.setProperty("/FormData/Caaid", "X");
                else oController.DetailModel.setProperty("/FormData/Caaid", null);
            },

            onPressApply: function () {
                //신청 event
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun2();

                if (oController.onErrorCheckBox()) {
                    return;
                }

                delete vDetailData.FilePlaceholder; //필요없는 값이므로 key 삭제

                vDetailData.Pernr = vPernr;

                this.onCheckedBox(); //체크박스 체크
                vDetailData.Fmaid = oController.DetailModel.getProperty("/FormData/Fmaid");
                vDetailData.Caaid = oController.DetailModel.getProperty("/FormData/Caaid");

                if (vDetailData.Fgbdt) {
                    vDetailData.Fgbdt = Common.setUTCDateTime(vDetailData.Fgbdt);
                }

                delete vDetailData.TextA; //필요없는 값이므로 key 삭제
                delete vDetailData.isVisibleType;
                delete vDetailData.isVisibleVehicle;

                BusyIndicator.show(0);
                var onProcessSave = function (fVal) {
                    //신청 클릭시 발생하는 이벤트
                    if (fVal && fVal == "신청") {
                        var PageMoveFunc = function (fVal) {
                            if (fVal && fVal == MessageBox.Action.YES) {
                                setTimeout(parent._gateway.redirect("Vacation.html"), 100);
                            } else {
                                oController._DetailModel.close();
                                oController.onTableSearch();
                            }
                        };

                        // 첨부파일 저장
                        vDetailData.Appnm = AttachFileAction.uploadFile.call(oController);
                        if (!vDetailData.Appnm) return false;

                        var sendObject = {
                            IConType: "3",
                            ILangu: "3",
                            IPernr: vPernr,
                            IEmpid: oController.getSessionInfoByKey("name"),
                            IBukrs: vBukrs2,
                            IOdkey: "",
                            IDatum: new Date(),
                            TableIn: [Common.copyByMetadata(oModel, "CongratulationApplyTableIn", vDetailData)] //넘길 값들을 담아놓음
                        };

                        oModel.create("/CongratulationApplySet", sendObject, {
                            async: true,
                            success: function (oData) {
                                MessageBox.show(oController.getBundleText("MSG_08103"), {
                                    title: oController.getBundleText("LABEL_08025"),
                                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                    onClose: PageMoveFunc
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

            onErrorCheckBox: function () {
                //필수칸 Error값여부 체크
                var oController = $.app.getController();
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDayBox");
                var vBukrs = oController.DetailModel.getProperty("/Bukrs");

                if (!vDetailData.StartDate) {
                    MessageBox.error(oController.getBundleText("MSG_08108"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if(vBukrs === "A100") {
                    if (new Date(new Date().setMonth(new Date().getMonth() -1)) > vDetailData.StartDate) {
                        MessageBox.error(oController.getBundleText("MSG_08116"), { title: oController.getBundleText("MSG_08107") });
                        return true;
                    }
                }else {
                    if (new Date(new Date().setFullYear(new Date().getFullYear() -1)) > vDetailData.StartDate) {
                        MessageBox.error(oController.getBundleText("MSG_08117"), { title: oController.getBundleText("MSG_08107") });
                        return true;
                    }
                }

                if (!vDetailData.Zname) {
                    MessageBox.error(oController.getBundleText("MSG_08110"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (!vDetailData.Type) {
                    MessageBox.error(oController.getBundleText("MSG_08109"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }
                
                if (oBirthDayDate.getVisible() === true) {
                    if (!vDetailData.Fgbdt) {
                        MessageBox.error(oController.getBundleText("MSG_08115"), { title: oController.getBundleText("MSG_08107") });
                        return true;
                    }
                }

                if (!vDetailData.AmountT) {
                    MessageBox.error(oController.getBundleText("MSG_08118"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }

                if (AttachFileAction.getFileLength(oController) === 0) {
                    MessageBox.error(oController.getBundleText("MSG_08114"), { title: oController.getBundleText("MSG_08107") });
                    return true;
                }
            },

            onDateType: function () {
                var oController = $.app.getController();
                var vYear = new Date().getFullYear() - 1;
                var vMonth = new Date().getMonth() + 1;
                var vDate = new Date().getDate();
                var vType = oController.DetailModel.getProperty("/FormData/Type");
                var vMsg = oController.getBundleText("MSG_08111");
                var vDetailData = oController.DetailModel.getProperty("/FormData");
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDay");
                var oStartDateIconText = $.app.byId(oController.PAGEID + "_StartDateIconText");
                var vMultiList = ["1507", "1508", "1509", "1510", "1552", "1553", "1554", "1555", "4001", "4002", "4003", "4004", "4005", "4006"];
                var vType1 = ["1552", "1553", "1554", "1555", "4003", "4004", "4005", "4006"]; // 고희 & 칠순

                if (
                    vMultiList.some(function (e) {
                        return e === vDetailData.Type;
                    })
                ) {
                    if (
                        vType1.some(function (e) {
                            return e === vType;
                        })
                    ) {
                        //고희 & 칠순
                        vMsg = vMsg.replace("year1", vYear - 69);
                        vMsg = vMsg.replace("year2", new Date(new Date().setDate(new Date().getDate() - 1)).getFullYear() - 68);
                        vMsg = vMsg.replace("month1", vMonth);
                        vMsg = vMsg.replace("month2", new Date(new Date().setDate(new Date().getDate() - 1)).getMonth() + 1);
                        vMsg = vMsg.replace("date1", Common.lpad(parseInt(vDate), 2));
                        vMsg = vMsg.replace("date2", Common.lpad(parseInt(new Date(new Date().setDate(vDate - 1)).getDate()), 2));
                        oBirthDayDate.setMinDate(new Date(vYear - 69, 1, 1));
                        oBirthDayDate.setMaxDate(new Date(vYear - 68, 12, 0));
                    } else {
                        //회갑 & 환갑
                        vMsg = vMsg.replace("year1", vYear - 60);
                        vMsg = vMsg.replace("year2", new Date(new Date().setDate(new Date().getDate() - 1)).getFullYear() - 58);
                        vMsg = vMsg.replace("month1", vMonth);
                        vMsg = vMsg.replace("month2", new Date(new Date().setDate(new Date().getDate() - 1)).getMonth() + 1);
                        vMsg = vMsg.replace("date1", Common.lpad(parseInt(vDate), 2));
                        vMsg = vMsg.replace("date2", Common.lpad(parseInt(new Date(new Date().setDate(vDate - 1)).getDate()), 2));
                        oBirthDayDate.setMinDate(new Date(vYear - 60, 1, 1));
                        oBirthDayDate.setMaxDate(new Date(vYear - 58, 12, 0));
                    }
                    sap.m.MessageBox.alert(vMsg, {
                        title: oController.getBundleText("LABEL_09030")
                    });
                    oStartDateIconText.setVisible(true);
                } else {
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
                var vBukrs2 = oController.getUserGubun2();
                var oMultiBoxInfo = oController.DetailModel.getProperty("/MultiBoxDataInfo");
                var oTypeCheck = $.app.byId(oController.PAGEID + "_TypeCheck");
                var oVehicleCheck = $.app.byId(oController.PAGEID + "_VehicleCheck");
                var oBirthDayBox = $.app.byId(oController.PAGEID + "_BirthDayBox");
                var oBirthDayDate = $.app.byId(oController.PAGEID + "_BirthDay");
                var vBirthDayBox = false;
                var oWarningMsg = $.app.byId(oController.PAGEID + "_WarningMsg");
                var vWarningMsg = false;
                var oPayload = {};

                if (oEvent.oSource.sId === "List_Type") this.onDateType();
                else{ 
                    vBukrs = this.getBukrs(oEvent.getSource().getDateValue());
                    this.setTypeCombo(true, vBukrs);
                    this.DetailModel.setProperty("/Bukrs", vBukrs);
                } 
                if (vBukrs !== "A100") {
                    oController.DetailModel.setProperty("/FormData/TextA", "");
                    oController.DetailModel.setProperty("/FormData/AmountT", "");
                }

                var vComboLength = oMultiBoxInfo.length;

                for (var i = 0; i < vComboLength; i++) {
                    if (oMultiBoxInfo[i].Code === oController.DetailModel.getProperty("/FormData/Type")) oController.DetailModel.setProperty("/FormData/TextA", oMultiBoxInfo[i].TextA);
                }

                if (oController.DetailModel.getProperty("/FormData/TextA") === "YONLY" && vBukrs !== "A100") {
                    oBirthDayDate.setValue("");
                    vBirthDayBox = true;
                }
                oBirthDayBox.setVisible(vBirthDayBox);

                if (oController.DetailModel.getProperty("/FormData/TextA") === "FSVC" && vBukrs !== "A100") {
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
                oPayload.IBukrs = vBukrs2;
                oPayload.ILangu = "3";
                oPayload.IDatum = new Date();

                oPayload.TableIn = [];
                oPayload.TableIn.push({
                    Pernr: vPernr,
                    StartDate: moment(vDetailData.StartDate).hours(10).toDate(),
                    Type: vDetailData.Type
                });

                this.onReadyPlaceholder();

                if (!vDetailData.StartDate || !vDetailData.Type) return;

                oModel.create("/CongratulationApplySet", oPayload, {
                    success: function (oData) {
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
                var vAppDate = oController.DetailModel.getData().FormData.Begda;

                var vYear = vAppDate.getFullYear() + ".";
                var vMonth = vAppDate.getMonth() + 1 + ".";
                var vDate = vAppDate.getDate();
                var vFullDate = new Date(vYear + vMonth + vDate);
                var oCodeHeaderParams = {};
                var rAmountT = "";

                if (oTypeCheck.getVisible() !== true) return;

                if (oTypeCheck.mProperties.selected !== true && oTypeCheck.getVisible() === true) {
                    oCodeHeaderParams.ICodeT = "018";
                    oCodeHeaderParams.ICodty = "PB120";
                    oCodeHeaderParams.IPernr = vPernr;
                    oCodeHeaderParams.IDatum = vFullDate;
                    oCodeHeaderParams.ISubCode = "FMADM";
                    oCodeHeaderParams.ILangu = "3";
                    oCodeHeaderParams.NavCommonCodeList = [];

                    oCommonModel.create("/CommonCodeListHeaderSet", oCodeHeaderParams, {
                        success: function (oData) {
                            if (oData && oData.NavCommonCodeList.results) {
                                //값을 제대로 받아 왔을 때
                                var rDatas = oData.NavCommonCodeList.results;
                                var vAmountT = Number(rDatas[0].Text) + Number(oController.DetailModel.getProperty("/FormData/AmountT").replace(/,/g, ""));
                                rAmountT = common.Common.numberWithCommas(vAmountT);
                            }
                        },
                        error: function (oResponse) {
                            common.Common.log(oResponse);
                            rAmountT = oController.DetailModel.getProperty("/FormData/AmountT");
                        }
                    });
                } else {
                    rAmountT = oController.DetailModel.getProperty("/FormData/AmountT");
                }

                oController.DetailModel.setProperty("/FormData/AmountT", rAmountT);
            },

            onBeforeOpenDetailDialog: function () {
                var oController = $.app.getController();
                var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
                    vInfoMessage = oController.DetailModel.getProperty("/FormData/FilePlaceholder"),
                    vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";

                AttachFileAction.setAttachFile(oController, {
                    Appnm: vAppnm,
                    Mode: "M",
                    Max: 3,
                    Required: true,
                    Editable: !vStatus || vStatus === "AA" ? true : false,
                    InfoMessage: vInfoMessage
                });
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "20190211" }); //20130217 //35110041
                  }
                : null
        });
    }
);
