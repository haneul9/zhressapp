/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./Shift",
        "./ODataService",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, Shift, ODataService, MessageBox, MessageToast, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),
            
            oDetailDialog: null,

            tableViewHeight: 22,

            Model: function () {
                return this.oModel;
            },

            setAppkey: function(appkey) {
                this.oModel.setProperty("/Appkey", appkey);
            },

            getAppkey: function() {
                return this.oModel.getProperty("/Appkey");
            },

            setList: function(employeeList) {
                this.oModel.setProperty("/List", employeeList);

                this.tableViewHeight = 35;
                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    viewHeight: this.tableViewHeight,
                    dataCount: employeeList.length
                });
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @param {sap.ui.core.mvc.Controller} oController - Tab.controller
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsViewMode: false,
                    IsPossibleApprovalCancel: false,  // 신청취소버튼 사용가능 여부
                    IsPossibleRowDelete: false,  // 테이블 삭제버튼 사용가능 여부
                    Appkey: null,
                    InfoMessage: null,
                    MinDate: null,
                    ApprInfo: {},       // 신청정보
                    TemplateData: {
                        Schkz: null,    // 근무일정
                        Begda: null,    // 대상기간 시작일
                        Endda: null,    // 대상기간 종료일
                        Reqrs: null     // 신청사유
                    },
                    List: [],
                    Schkzs: []     // 근무일정
                });

                return this;
            },

            load: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        $.app.byId("TargetTable").clearSelection();

                        this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                        this.oModel.setProperty("/IsViewMode", this.getAppkey() ? true : false);
                        this.oModel.setProperty("/TemplateData/Schkz", null);
                        this.oModel.setProperty("/TemplateData/Begda", new Date());
                        this.oModel.setProperty("/TemplateData/Endda", new Date("9999-12-31"));
                        this.oModel.setProperty("/TemplateData/Reqrs", null);

                        var tmpSchkzs = this.oController.getStatusListHandler().Model().getProperty("/Schkzs").slice();
                        tmpSchkzs.shift();
                        this.oModel.setProperty("/Schkzs", tmpSchkzs);

                        this.loadDetailData();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            loadDetailData: function() {
                var results = ODataService.ShiftWorkScheduleHeaderSet.call(
                    this.oController, 
                    Shift.ProcessType.DETAIL,
                    { Pernr: this.oController.getSessionInfoByKey("name"), Appkey: this.oModel.getProperty("/Appkey") }
                );

                // init
                this.oModel.setProperty("/InfoMessage", null);
                this.oModel.setProperty("/MinDate", null);
                this.oModel.setProperty("/ApprInfo", {});

                if(results.ShiftWorkScheduleChangeOutline) {
                    // 신청한도일
                    var vLimday = parseInt(results.ShiftWorkScheduleChangeOutline.Limday || 0);
                    if(vLimday > 0) {
                        this.oModel.setProperty("/InfoMessage", this.oController.getBundleText("MSG_30001").interpolate(vLimday));
                        this.oModel.setProperty("/MinDate", new Date(new Date().setDate(new Date().getDate() - vLimday)));
                    }

                    // 결재정보
                    this.oModel.setProperty("/ApprInfo", results.ShiftWorkScheduleChangeOutline);
                    if(this.getAppkey()) {
                        // s-moin url binding
                        this.oModel.setProperty("/ApprInfo/EAppurl", results.EAppurl);
                        // 결재번호가 있을경우 결재상태가 AA가 아니면 조회모드를 true
                        this.oModel.setProperty("/IsViewMode", results.ShiftWorkScheduleChangeOutline.Status1 !== Shift.Approval.NONE ? true : false);
                        // 신청취소 버튼 사용 가능
                        this.oModel.setProperty("/IsPossibleApprovalCancel", true);
                    } else {
                        // 신규 작성일 경우 신청일을 현재일로 init
                        this.oModel.setProperty("/ApprInfo/Appdt", new Date());
                        // 신청취소 버튼 사용 불가
                        this.oModel.setProperty("/IsPossibleApprovalCancel", false);
                    }
                }

                // 대상자 목록
                if(this.getAppkey() && results.ShiftWorkScheduleChange.length) {
                    this.oModel.setProperty("/List", results.ShiftWorkScheduleChange.map(function(elem) {
                        return $.extend(true, elem, { 
                            stateBegda: sap.ui.core.ValueState.None,
                            stateSchkz: sap.ui.core.ValueState.None,
                            stateReqrs: sap.ui.core.ValueState.None
                        });
                    }));
                    
                    this.tableViewHeight = this.oModel.getProperty("/IsViewMode") ? 40 : 30;
                    Common.adjustViewHeightRowCount({
                        tableControl: $.app.byId("TargetTable"),
                        viewHeight: this.tableViewHeight,
                        dataCount: results.ShiftWorkScheduleChange.length
                    });
                }

                this.setIsPossibleRowDelete();
            },

            setIsPossibleRowDelete: function() {
                this.oModel.setProperty(
                    "/IsPossibleRowDelete",
                    this.oModel.getProperty("/List").length ? true : false
                );
            },

            ProcessOnSuccess: function (data, conType) {
                
                switch (conType) {
                    case Shift.ProcessType.APPROVAL_REQUEST:
                        // s모인 결재창을 띄운다.
                        if(data.EAppurl) {
                            Common.openPopup.call(this.oController, data.EAppurl);
                        }

                        // 변경신청내역 탭 refresh 및 이동
                        this.oController.changeTab(Shift.Tab.APPROVAL);

                        this.oController.oDetailDialog.close();

                        break;
                    case Shift.ProcessType.APPROVAL_CANCEL:
                        MessageBox.success(this.oController.getBundleText("MSG_30005"), {   // 신청이 취소되었습니다.
                            title: this.oController.getBundleText("LABEL_00149"),
                            onClose: function () {
                                // 변경신청내역 탭 refresh 및 이동
                                this.oController.changeTab(Shift.Tab.APPROVAL);

                                this.oController.oDetailDialog.close();
                            }.bind(this)
                        });

                        break;
                    default:
                        break;
                }

                BusyIndicator.hide();
            },

            ProcessOnFail: function (res) {
                var errData = Common.parseError(res);
                if (errData.Error && errData.Error === "E") {
                    MessageBox.error(errData.ErrorMessage, {
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                }

                BusyIndicator.hide();
            },

            DetailProcessValidation: function (detailData) {
                var validControls = {
                        Begda: { colIdx: 4, context: "/stateBegda", message: this.oController.getBundleText("MSG_30006") },    // 대상기간을 입력하세요.
                        Schkz: { colIdx: 5, context: "/stateSchkz", message: this.oController.getBundleText("MSG_30007") },    // 근무일정을 선택하세요.
                        Reqrs: { colIdx: 6, context: "/stateReqrs", message: this.oController.getBundleText("MSG_30008") }     // 신청사유를 입력하세요.
                    },
                    errInfo = {
                        colIdx: null,
                        rowIdx: null,
                        pernr: null,
                        message: null,
                        context: null
                    };

                if(Common.isEmptyArray(detailData)) {
                    MessageBox.error(this.oController.getBundleText("MSG_30010"), { // 대상자를 등록하세요.
                        title: this.oController.getBundleText("LABEL_00149")
                    });

                    return false;
                }

                detailData.some(function(elem, idx) {
                    return Object.keys(validControls).some(function(control) {
                        if(!elem[control]) {
                            errInfo = $.extend(true, validControls[control], {
                                rowIdx: idx,
                                pernr: elem.Pernr
                            });
                            
                            return true;
                        }
                    });
                });

                if(errInfo.pernr) {
                    // 해당 index로 scroll
                    $.app.byId("TargetTable").setFirstVisibleRow(errInfo.rowIdx === 0 ? 0 : errInfo.rowIdx - 1);

                    MessageBox.error(errInfo.message, {
                        title: this.oController.getBundleText("LABEL_00149"),
						onClose: function() {
                            // 해당 Input에 포커스
                            this.setTableInputFocus.call(this, errInfo);
						}.bind(this)
                    });

                    return false;
                }

                return true;
            },
            
            /**
             * 
             * vPernr과 사번이 일치하는 Row를 찾아서 Input에 focus
             * 
             * @param {Object} errInfo - 에러를 표시할 컬럼 정보
             * @param {number} errInfo.colIdx - 컬럼 인덱스
             * @param {string} errInfo.pernr - 사번
             * @param {string} errInfo.context - 컬럼 valueState context
             */
			setTableInputFocus: function(errInfo) {
				var oInput = null;

                $.app.byId("TargetTable").getRows().some(function(oRow) {
					oInput = oRow.getCells()[errInfo.colIdx];

					if(errInfo.pernr === oInput.data("Pernr")) {
						// Set valueState Error
						this.oModel.setProperty(
                            oRow.getBindingContext().getPath() + errInfo.context,
                            sap.ui.core.ValueState.Error
                        );
						// Set focus
                        oInput.focus();

						return true;
					}
				}.bind(this));
            },
            
            /**
             * @param {sap.ui.base.Event} oEvent - object of the Appkey link
             */
            pressAppkeyLink: function(oEvent) {
                Common.openPopup.call(this.oController, oEvent.getSource().data("Url"));
            },

            /**
             * 신청 버튼 event
             */
            pressApprovalBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");
                var oInputData = this.oModel.getProperty("/List");
                var vExtryn = Common.isExternalIP() === true ? "X" : "";

                if (!this.DetailProcessValidation.call(this, oInputData)) return;

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Pernr = this.oController.getSessionInfoByKey("name");
                    payload.Appkey1 = this.oModel.getProperty("/Appkey") || "";
                    payload.Extryn = vExtryn;
                    payload.ShiftWorkScheduleChange = oInputData.map(function (elem) {
                        return $.extend(true, Common.copyByMetadata(oModel, "ShiftWorkScheduleChange", elem), {
                            Begda: moment(elem.Begda).hours(10).toDate(),
                            Endda: moment(elem.Endda).hours(10).toDate()
                        });
                    });

                    ODataService.ShiftWorkScheduleHeaderSetByProcess.call(
                        this.oController, 
                        Shift.ProcessType.APPROVAL_REQUEST,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                var confirmMessage = vExtryn === "X" ? this.oController.getBundleText("MSG_00060") : this.oController.getBundleText("MSG_31010");

                MessageBox.show(confirmMessage, {
                    // S모인 결재창으로 이동해 결재를 진행하셔야 합니다.\n진행하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * 신청취소 버튼 event
             */
            pressCancelApprovalBtn: function() {
                var vAppkey = this.oModel.getProperty("/Appkey");

                if(!vAppkey) return;

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Pernr = this.oController.getSessionInfoByKey("name");
                    payload.Appkey1 = vAppkey;
                    payload.ShiftWorkScheduleChange = [];

                    ODataService.ShiftWorkScheduleHeaderSetByProcess.call(
                        this.oController, 
                        Shift.ProcessType.APPROVAL_CANCEL,
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_30004"), {
                    // 신청을 취소하고 삭제합니다.\n진행하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },
            
            /**
             * 적용 버튼 event
             */
            pressApplyTemplateBtn: function() {
                var templateData = this.oModel.getProperty("/TemplateData"),
                    vListData = this.oModel.getProperty("/List"),
                    oTable = $.app.byId("TargetTable"),
                    sIndexes = oTable.getSelectedIndices();

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                oTable.setBusyIndicatorDelay(0).setBusy(true);

                Common.getPromise(
                    function () {
                        this.oModel.setProperty(
                            "/List",
                            vListData.map(function(elem, idx) {
                                return $.extend(true, elem, 
                                    sIndexes.some(function(sIdx) { return sIdx === idx; }) 
                                        ? {
                                            Schkz: templateData.Schkz,
                                            Begda: templateData.Begda,
                                            Endda: templateData.Endda,
                                            Reqrs: templateData.Reqrs
                                        }
                                        : {}
                                );
                            })
                        );
                    }.bind(this)
                ).then(function () {
                    oTable.clearSelection().setBusy(false);
                });
            },
            
            /**
             * 등록 버튼 event
             *   [공통]부서/사원 조직도 Dialog 호출
             */
            pressAddBtn: function() {
                setTimeout(function() {
                    var DetailHandler = this.getDetailHandler(),
                        initData = {
                            autoClose: false,
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: ""
                        },
                        callback = function(o) {
                            switch(o.Otype) {
                                case "P":
                                    DetailHandler.addTargetTableByOne(o);
                                    break;
                                case "O":
                                    DetailHandler.addTargetTableByMulti(o.nodes.filter(function(node) {
                                        return node.Otype === "P";
                                    }));
                                    break;
                            }
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);

                    setTimeout(function() {
                        this.OrgOfIndividualHandler.oDialog.$().position({
                            my: "right",
                            at: "right",
                            of: window
                        });
                    }.bind(this), 300);
                }.bind(this), 0);
            },

            /**
             * 사원 단수 선택시 호출
             * 
             * @param {Object} data - 선택된 조직도 아이템(사원)
             */
            addTargetTableByOne: function(data) {
                var vListData = this.oModel.getProperty("/List");

                // 기초의 전문직 이거나, 첨단 소속일 경우 신청 불가
                if(data.Bukrs.charAt(0) === "A" || data.Zfxck2 !== "X") {
                    MessageBox.alert(this.oController.getBundleText("MSG_31012").interpolate(data.Stext));
                    return;
                }

                // 중복 체크
                if(vListData.some(function(elem) { return elem.Pernr === data.Objid; })) {
                    MessageToast.show(this.oController.getBundleText("MSG_30002"), {
                        // 중복된 대상입니다.
                        duration: 2000,
                        my: sap.ui.core.Popup.Dock.CenterCenter,
                        at: sap.ui.core.Popup.Dock.CenterCenter
                    });

                    return;
                }

                vListData.push({
                    Pernr: data.Objid,
                    Ename: data.Stext,
                    Orgtx: data.PupStext,
                    PGradeTxt: data.ZpGradeTxt,
                    Begda: new Date(),
                    Endda: new Date("9999-12-31"),
                    Schkz: null,
                    Reqrs: null,
                    stateBegda: sap.ui.core.ValueState.None,
                    stateSchkz: sap.ui.core.ValueState.None,
                    stateReqrs: sap.ui.core.ValueState.None
                });

                this.oModel.refresh();
                this.setIsPossibleRowDelete();
                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    viewHeight: this.tableViewHeight,
                    dataCount: vListData.length
                });
            },
            
            /**
             * 조직 선택시 호출
             * 
             * @param {Array} data - 선택된 조직도 아이템(Array<사원>)
             */
            addTargetTableByMulti: function(data) {
                var vListData = this.oModel.getProperty("/List"),
                    vSelectedDataLength = data.length,
                    impossibleTargets = [];

                // 기초의 전문직 이거나, 첨단 소속일 경우 신청 불가
                data = data.filter(function(elem) {
                    if(elem.Bukrs.charAt(0) === "A" || elem.Zfxck2 !== "X") {
                        impossibleTargets.push(elem.Stext);
                        return false;
                    }
                    return true;
                });

                if(impossibleTargets.length) {
                    vSelectedDataLength = data.length;

                    MessageBox.alert(this.oController.getBundleText("MSG_31013").interpolate(impossibleTargets.join("\n")));
                }

                if(vListData.length) {
                    // 중복데이터 제거
                    data = data.filter(function(elem1) {
                        return !vListData.some(function(item) {
                            return elem1.Objid === item.Pernr;
                        });
                    });
                }

                if(!data.length) return;
                if(vSelectedDataLength != data.length) {
                    MessageToast.show(this.oController.getBundleText("MSG_30011"), {
                        // 중복된 대상은 제외하고\n추가합니다.
                        duration: 2000,
                        my: sap.ui.core.Popup.Dock.CenterCenter,
                        at: sap.ui.core.Popup.Dock.CenterCenter
                    });
                }
                
                this.oModel.setProperty(
                    "/List",
                    vListData.concat(data.map(function(elem2) {
                        return {
                            Pernr: elem2.Objid,
                            Ename: elem2.Stext,
                            Orgtx: elem2.PupStext,
                            PGradeTxt: elem2.ZpGradeTxt,
                            Begda: new Date(),
                            Endda: new Date("9999-12-31"),
                            Schkz: null,
                            Reqrs: null,
                            stateBegda: sap.ui.core.ValueState.None,
                            stateSchkz: sap.ui.core.ValueState.None,
                            stateReqrs: sap.ui.core.ValueState.None
                        };
                    }))
                );

                this.oModel.refresh();
                this.setIsPossibleRowDelete();
                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    viewHeight: this.tableViewHeight,
                    dataCount: this.oModel.getProperty("/List").length
                });
            },
            
            /**
             * 삭제 버튼 event
             */
            pressDeleteBtn: function() {
                var oTable = $.app.byId("TargetTable"),
                    sIndexes = oTable.getSelectedIndices(),
                    vDetailList = this.oModel.getProperty("/List") || [];

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                this.oModel.setProperty(
                    "/List",
                    vDetailList.filter(function(elem, idx) {
                        return !sIndexes.some(function(sIndex) {
                            return sIndex === idx;
                        });
                    })
                );
                    
                oTable.clearSelection();
                this.setIsPossibleRowDelete();
                Common.adjustViewHeightRowCount({
                    tableControl: oTable,
                    viewHeight: this.tableViewHeight,
                    dataCount: this.oModel.getProperty("/List").length
                });
            },

            toggleValueState: function(oEvent) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            },

            /**
             * 대상기간 Column template
             */
            getTargetDateRange: function(columnInfo, oController) {
                var oDRS = new sap.m.DateRangeSelection(columnInfo.id, {
                    displayFormat: "{/Dtfmt}",
                    minDate: "{/MinDate}",
                    editable: "{= !${/IsViewMode}}",
                    dateValue: "{Begda}",
                    secondDateValue: "{Endda}",
                    delimiter: "~",
                    width: "100%",
                    valueState: "{stateBegda}",
                    change: oController.getDetailHandler().toggleValueState,
                    valueStateText: "{i18n>MSG_30006}",  // 대상기간을 입력하세요.
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                });
        
                oDRS.addEventDelegate({
                    onAfterRendering: function() {
                        this.$().find("input").prop("disable", true).css("color", "#ccc !important");
                    }
                }, oDRS);
        
                return oDRS;
            },

            /**
             * 근무일정 Column template
             */
            getSchkzComboBox: function(columnInfo, oController) {
                return new sap.m.ComboBox({
                    width: "100%",
                    selectedKey: "{Schkz}",
                    editable: "{= !${/IsViewMode}}",
                    valueState: "{stateSchkz}",
                    valueStateText: "{i18n>MSG_30007}",  // 근무일정을 선택하세요.
                    change: oController.getDetailHandler().toggleValueState,
                    items: {
                        path: "/Schkzs",
                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                        templateShareable: true
                    },
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                }).addStyleClass("FontFamily");
            },

            /**
             * 신청사유 Column template
             */
            getReasonInput: function(columnInfo, oController) {
                return new sap.m.Input({
                    width: "100%",
                    value: "{Reqrs}",
                    editable: "{= !${/IsViewMode}}",
                    maxLength: common.Common.getODataPropertyLength("ZHR_WORKSCHEDULE_SRV", "ShiftWorkScheduleChange", "Reqrs"),
                    valueState: "{stateReqrs}",
                    valueStateText: "{i18n>MSG_30008}",  // 신청사유를 입력하세요.
                    change: oController.getDetailHandler().toggleValueState,
                    customData: [ 
						new sap.ui.core.CustomData({ key: "Pernr", value: "{Pernr}" }) 
					]
                }).addStyleClass("FontFamily");
            }

        };

        return Handler;
    }
);
