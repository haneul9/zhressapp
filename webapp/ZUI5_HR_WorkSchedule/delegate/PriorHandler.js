/* eslint-disable no-undef */
/* eslint-disable no-empty */
sap.ui.define(
    [
        "common/Common", //
        "common/SearchUser1",
        "common/SearchOrg",
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./WorkSchedule",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, WorkSchedule, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oDetailDialog: null,
            aColumnModel: null,
            
            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @this {Handler}
             * 
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(), 
                    IsSearch: false,
                    IsPossibleExcelButton: false,   // 엑셀 버튼 활성화 여부
                    SearchConditions: { // 검색조건
                        Pernr: null,
                        Orgeh: null,
                        EnameOrOrgehTxt: null,
                        Begda: null,
                        Endda: null,
                        Apsta: null,
                        Bfchk: WorkSchedule.PRIOR
                    },
                    ApprStats: [],  // 진행상태
                    List: [],
                    Hours: Common.makeNumbersArray({ length: 24 }).map(function(h) { return { Code: Common.lpad(h, 2), Text: Common.lpad(h, 2) }; }),
                    // Minutes: [{ Code: "", Text: "mm"}].concat(Common.makeNumbersArray({ length: 60 }).map(function(m) { return { Code: Common.lpad(m, 2), Text: Common.lpad(m, 2) }; })),
                    Minutes: [
                        { Code: "00", Text: "00"},  //
                        { Code: "10", Text: "10"},
                        { Code: "20", Text: "20"},
                        { Code: "30", Text: "30"},
                        { Code: "40", Text: "40"},
                        { Code: "50", Text: "50"}
                    ],
                    Tprogs: [],
                    Faprss: [],
                    Weeks: ["LABEL_55028","LABEL_55029","LABEL_55030","LABEL_55031","LABEL_55032","LABEL_55033","LABEL_55034"],
                    Detail: {
                        IsViewMode: false,    // 조회모드 여부
                        IsPossibleSave: false,  // 저장버튼 활성화 여부
                        IsPossibleApproval: false,  // 신청버튼 활성화 여부
                        Header: {
                            List: [{ Tim00: "", Tim01: "", Tim07: "", Tim05: "", Tim02: "", Wt40: "", Wt12: "", Wtsum: "", LigbnTx: "" }]
                        },
                        List: []
                    }  // 상세
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Apsta", "ALL");
                this.oModel.setProperty("/SearchConditions/Begda", moment().subtract(14, "days").toDate());
                this.oModel.setProperty("/SearchConditions/Endda", moment().add(14, "days").toDate());
                if($.app.getAuth() === $.app.Auth.ESS) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                }

                this.oModel.setProperty(
                    "/ApprStats", 
                    ODataService.CommonCodeListHeaderSet.call(this.oController, {
                        IsContainsAll: true,
                        Bukrs: this.oController.getSessionInfoByKey("Bukrs"),
                        CodeT: WorkSchedule.ApprStat.CodeT,
                        Codty: WorkSchedule.ApprStat.Codty
                    })
                );

                this.oModel.setProperty(
                    "/Tprogs", 
                    [{ Code: "", Text: this.oController.getBundleText("LABEL_00193")}].concat(  // -- 선택 --
                        ODataService.CommonCodeListHeaderSet.call(this.oController, {
                            IsContainsAll: false,
                            Langu: this.oController.getSessionInfoByKey("Langu"),
                            Molga: this.oController.getSessionInfoByKey("Molga"),
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Bukrs: this.oController.getSessionInfoByKey("Bukrs"),
                            CodeT: WorkSchedule.Tprogs.CodeT,
                            Codty: WorkSchedule.Tprogs.Codty
                        })
                    )
                );
                
                this.oModel.setProperty(
                    "/Faprss",
                    [{ Code: "", Text: this.oController.getBundleText("LABEL_00193")}].concat(  // -- 선택 --
                        ODataService.CommonCodeListHeaderSet.call(this.oController, {
                            IsContainsAll: false,
                            Langu: this.oController.getSessionInfoByKey("Langu"),
                            Molga: this.oController.getSessionInfoByKey("Molga"),
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Bukrs: this.oController.getSessionInfoByKey("Bukrs"),
                            CodeT: WorkSchedule.Faprss.CodeT,
                            Codty: WorkSchedule.Faprss.Codty
                        })
                    )
                );

                return this;
            },

            /**
             * @brief 검색
             * 
             * @this {Handler}
             */
            search: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        this.loadTableData();
                        this.toggleExcelBtn();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 목록 조회
             * 
             * @this {Handler}
             */
            loadTableData: function () {
                var results = ODataService.WorktimeApplySet.call(
                    this.oController, 
                    WorkSchedule.ProcessType.READ, 
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty(
                    "/List", 
                    results.Worktimetab1.map(function(elem) {
                        return $.extend(true, elem, {
                            PlanTime: elem.Beguz ? "${start} ~ ${End}".interpolate(moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            InoutTime: elem.Enttm ? "${start} ~ ${End}".interpolate(moment(elem.Enttm.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Outtm.ms).subtract(9, "hours").format("HH:mm")) : "",
                            WorkTime: elem.Wkbuz ? "${start} ~ ${End}".interpolate(moment(elem.Wkbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Wkeuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            AddTime1: elem.Trbuz ? "${start} ~ ${End}".interpolate(moment(elem.Trbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            AddTime2: elem.Trbu1 ? "${start} ~ ${End}".interpolate(moment(elem.Trbu1.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treu1.ms).subtract(9, "hours").format("HH:mm")) : ""
                        });
                    })
                );

                $.app.byViewId("PriorTable").setFirstVisibleRow(0);
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("PriorTable"));
            },

            toggleExcelBtn: function() {
                this.oModel.setProperty(
                    "/IsPossibleExcelButton",
                    this.oModel.getProperty("/List").length ? true : false
                );
            },

            pressExcelDownloadBtn: function() {
				var aTableDatas = this.oModel.getProperty("/List");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Otbet", "Otent"),
					workbook: {columns: this.aColumnModel},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_55038"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
            },

            /**
             * @brief 목록 row Click event handler
             * 
             * @param rowData
             */
            pressSelectRowDetail: function (rowData) {
                this.loadApprovalDetail(rowData);
            },

            loadApprovalDetail: function(rowData) {
                this.oModel.setProperty("/Detail", {
                    IsViewMode: rowData.Status === "" || rowData.Status === "AA" ? false : true,
                    IsPossibleSave: false,
                    IsPossibleApproval: false,
                    Header: $.extend(true, {
                        MinDate: moment().toDate(),
                        IsPossibleBegda: rowData.Status === "" || rowData.Status === "AA" ? true : false,
                        WeekName: this.oController.getBundleText(this.oModel.getProperty("/Weeks")[moment(rowData.Schda).day()]),
                        List: [{ Tim00: "", Tim01: "", Tim07: "", Tim05: "", Tim02: "", Wt40: "", Wt12: "", Wtsum: "", LigbnTx: "" }]
                    }, rowData),
                    List: []
                });
                
                this.openDetailDialog();
                
                this.searchDetailData({Worktimetab1: [{ Schda: rowData.Schda, Appnm: rowData.Appnm, Pernr: rowData.Pernr }]});
                this.toggleIsPossibleSave();
            },

            /**
             * 신청 Dialog 호출 버튼 event
             * 
             * @this {Handler}
             */
            pressOpenApprovalBtn: function() {
                var vAuth = this.oModel.getProperty("/Auth");

                this.oModel.setProperty("/Detail", {
                    IsViewMode: false,
                    IsPossibleSave: false,
                    IsPossibleApproval: false,
                    Header: {
                        Status: "",
                        Ename: vAuth === $.app.Auth.HASS ? "" : this.oController.getSessionInfoByKey("Ename"),
                        Pernr: vAuth === $.app.Auth.HASS ? "" : this.oController.getSessionInfoByKey("Pernr"),
                        Bukrs3: vAuth === $.app.Auth.HASS ? "" : this.oController.getSessionInfoByKey("Bukrs3"),
                        WkbuzT: "00",
                        WkbuzM: "00",
                        WkeuzT: "00",
                        WkeuzM: "00",
                        TrbuzT: "00",
                        TrbuzM: "00",
                        TreuzT: "00",
                        TreuzM: "00",
                        Trbu1T: "00",
                        Trbu1M: "00",
                        Treu1T: "00",
                        Treu1M: "00",
                        MinDate: moment().toDate(),
                        Schda: moment().add(1, "days").toDate(),
                        WeekName: this.oController.getBundleText(this.oModel.getProperty("/Weeks")[moment().add(1, "days").day()]),
                        List: [{ Tim00: "", Tim01: "", Tim07: "", Tim05: "", Tim02: "", Wt40: "", Wt12: "", Wtsum: "", LigbnTx: "" }]
                    },
                    List: []
                });
                
                this.openDetailDialog();
                
                if(this.oModel.getProperty("/Auth") !== $.app.Auth.HASS) {
                    this.searchDetailData();
                }
                this.toggleIsPossibleSave();
            },

            pressOpenApprovalCancelBtn: function() {
                var oTable = $.app.byViewId("PriorTable"),
                    sIndexes = $.app.byViewId("PriorTable").getSelectedIndices(),
                    vDeleteTargetAppnms = [],
                    invalidTargetIndexes = [];

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                sIndexes.forEach(function(sIndex) {
                    var sPath = oTable.getRows()[sIndex].getBindingContext().getPath(),
                        rowData = this.oModel.getProperty(sPath);

                    if(rowData.Status === "00") {
                        vDeleteTargetAppnms.push(rowData.Appnm);
                    } else {
                        invalidTargetIndexes.push(++sIndex);
                    }
                }.bind(this));

                if(invalidTargetIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_55007").interpolate(invalidTargetIndexes.join(", "))); // 결재가 진행되지 않은 건만 선택바랍니다.
                    return;
                }

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.IConType = WorkSchedule.ProcessType.APPROVE_CANCEL;
                    payload.IBfchk = "X";

                    payload.Worktimetab1 = vDeleteTargetAppnms.map(function(appnm) {
                        return {
                            Status: "JJ",
                            Appnm: appnm
                        };
                    });
                    payload.Worktimetab2 = [];

                    ODataService.WorktimeApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_55008"), {
                    // 결재취소 하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            changeSchda: function(oEvent) {
                BusyIndicator.show(0);

                var oControl = oEvent.getSource();

                Common.getPromise(
                    function () {
                        this.oModel.setProperty(
                            "/Detail/Header/WeekName", 
                            this.oController.getBundleText(this.oModel.getProperty("/Weeks")[moment(oControl.getDateValue()).day()])
                        );
        
                        this.searchDetailData();
                        this.toggleIsPossibleSave();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            changeTprog: function(oEvent) {
                var oControl = oEvent.getSource();

                this.oModel.getProperty("/Tprogs").some(function(elem) {
                    if(elem.Code === oControl.getSelectedKey()) {
                        this.oModel.setProperty("/Detail/Header/Beguz", elem.Beguz);
                        this.oModel.setProperty("/Detail/Header/Beguzc", elem.Beguz.ms ? moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm") : "00:00");
                        this.oModel.setProperty("/Detail/Header/Enduz", elem.Enduz);
                        this.oModel.setProperty("/Detail/Header/Enduzc", elem.Enduz.ms ? moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm") : "00:00");

                        return true;
                    }
                }.bind(this));
            },

            searchDetailData: function(arg) {
                var vInputHeader = this.oModel.getProperty("/Detail/Header"),
                    results = ODataService.WorktimeApplySet.call(
                    this.oController, 
                    WorkSchedule.ProcessType.CODE, 
                    {
                        Bfchk: WorkSchedule.PRIOR,
                        Pernr: vInputHeader.Pernr,
                        Datum: moment(vInputHeader.Schda).hours(10).toDate(),
                        Worktimetab1: arg && arg.Worktimetab1 ? arg.Worktimetab1 : undefined
                    }
                );

                if(results.Worktimetab1.length) {
                    var vHeader = results.Worktimetab1[0];

                    if(vHeader.awart) {
                        MessageBox.alert(
                            this.oController.getBundleText("MSG_55003")   // ${name} 님의 당일근태사항(${text})이 있습니다.
                                .interpolate(vInputHeader.Ename, vHeader.Rtext),
                            { title: this.oController.getBundleText("LABEL_00149") }
                        );
                    }

                    this.oModel.setProperty("/Detail/IsViewMode", vHeader.Status === "" || vHeader.Status === "AA" ? false : true);

                    this.oModel.setProperty(
                        "/Detail/Header", 
                        $.extend(true, vInputHeader, {
                            List: [vHeader],
                            Tprog: vHeader.Tprog || "",
                            TprogB: vHeader.TprogB,
                            Beguz: vHeader.Beguz,
                            Beguzc: vHeader.Beguz.ms ? moment(vHeader.Beguz.ms).subtract(9, "hours").format("HH:mm") : "00:00",
                            Enduz: vHeader.Enduz,
                            Enduzc: vHeader.Enduz.ms ? moment(vHeader.Enduz.ms).subtract(9, "hours").format("HH:mm") : "00:00",
                            Enttm: vHeader.Enttm,
                            Enttmc: vHeader.Enttm.ms ? moment(vHeader.Enttm.ms).subtract(9, "hours").format("HH:mm") : "00:00",
                            Outtm: vHeader.Outtm,
                            Outtmc: vHeader.Outtm.ms ? moment(vHeader.Outtm.ms).subtract(9, "hours").format("HH:mm") : "00:00",
                            Wkbuz: vHeader.Wkbuz,
                            WkbuzT: !Common.checkNull(vHeader.Wkbuzc) ? vHeader.Wkbuzc.substring(0, 2) : "00",
                            WkbuzM: !Common.checkNull(vHeader.Wkbuzc) ? vHeader.Wkbuzc.substring(2, 4) : "00",
                            Wkeuz: vHeader.Wkeuz,
                            WkeuzT: !Common.checkNull(vHeader.Wkeuzc) ? vHeader.Wkeuzc.substring(0, 2) : "00",
                            WkeuzM: !Common.checkNull(vHeader.Wkeuzc) ? vHeader.Wkeuzc.substring(2, 4) : "00",
                            Trbuz: vHeader.Trbuz,
                            TrbuzT: !Common.checkNull(vHeader.Trbuzc) ? vHeader.Trbuzc.substring(0, 2) : "00",
                            TrbuzM: !Common.checkNull(vHeader.Trbuzc) ? vHeader.Trbuzc.substring(2, 4) : "00",
                            Treuz: vHeader.Treuz,
                            TreuzT: !Common.checkNull(vHeader.Treuzc) ? vHeader.Treuzc.substring(0, 2) : "00",
                            TreuzM: !Common.checkNull(vHeader.Treuzc) ? vHeader.Treuzc.substring(2, 4) : "00",
                            Trbu1: vHeader.Trbu1,
                            Trbu1T: !Common.checkNull(vHeader.Trbu1c) ? vHeader.Trbu1c.substring(0, 2) : "00",
                            Trbu1M: !Common.checkNull(vHeader.Trbu1c) ? vHeader.Trbu1c.substring(2, 4) : "00",
                            Treu1: vHeader.Treu1,
                            Treu1T: !Common.checkNull(vHeader.Treu1c) ? vHeader.Treu1c.substring(0, 2) : "00",
                            Treu1M: !Common.checkNull(vHeader.Treu1c) ? vHeader.Treu1c.substring(2, 4) : "00",
                            Faprs: vHeader.Faprs || "",
                            Ovres: vHeader.Ovres,
                            Tim00: vHeader.Tim00,
                            Tim01: vHeader.Tim01,
                            Tim02: vHeader.Tim02,
                            Tim05: vHeader.Tim05,
                            Tim07: vHeader.Tim07,
                            Wt40: vHeader.Wt40,
                            Wt12: vHeader.Wt12,
                            Wtsum: vHeader.Wtsum,
                            Lttim: vHeader.Lttim,
                            Ligbn: vHeader.Ligbn,
                            LigbnTx: vHeader.LigbnTx,
                            Cbchk: vHeader.Cbchk,
                            CbchkTx: vHeader.CbchkTx,
                            Appnm: vHeader.Appnm,
                            Status: vHeader.Status,
                            TmstaT: vHeader.TmstaT
                        })
                    );
                } else {
                    this.oModel.setProperty("/Detail/IsViewMode", false);
                    this.oModel.setProperty("/Detail/IsPossibleSave", false);
                    this.oModel.setProperty("/Detail/IsPossibleApproval", false);
                    this.oModel.setProperty("/Detail/Header", {
                        List: [{ Tim00: "", Tim01: "", Tim07: "", Tim05: "", Tim02: "", Wt40: "", Wt12: "", Wtsum: "", LigbnTx: "" }],
                        Pernr: vInputHeader.Pernr,
                        Ename: vInputHeader.Ename,
                        Schda: vInputHeader.Schda,
                        Bukrs3: vInputHeader.Bukrs3,
                        Status: "",
                        MinDate: vInputHeader.MinDate,
                        WeekName: vInputHeader.WeekName
                    });
                }

                this.oModel.setProperty(
                    "/Detail/List",
                    results.Worktimetab2.length 
                        ? results.Worktimetab2.map(function(elem) {
                            return $.extend(true, elem, {
                                AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(elem.Aprsq)  // ${v}차 결재자
                            });
                        }.bind(this))
                        : []
                );
                Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
            },

            /**
             * @brief 저장/신청버튼 활성화 여부
             *        - 필수 항목이 모두 작성된 경우
             */
            toggleIsPossibleSave: function() {
                this.NOT_VALID_FORM_CONTROL_COUNT = 0;
                this.validControl($.app.byViewId("PriorInputForm")); // recursive call

                this.oModel.setProperty(
                    "/Detail/IsPossibleSave",
                    (this.NOT_VALID_FORM_CONTROL_COUNT === 0) ? true : false
                );
                this.oModel.setProperty(
                    "/Detail/IsPossibleApproval",
                    (this.NOT_VALID_FORM_CONTROL_COUNT === 0 && this.oModel.getProperty("/Detail/List").length) ? true : false
                );
            },

            validControl: function (oControl) {
                // base case
                var childItems = oControl.getAggregation("items");
                if (oControl === null || childItems === null) return;

                // Recursion
                childItems.forEach(function (control) {
                    try {
                        var constructorName = control.constructor.getMetadata().getName();
                        if(Object.keys(WorkSchedule.ValidateProperties).indexOf(constructorName) > -1 
                            && control.getRequired() 
                            && control.getProperty(WorkSchedule.ValidateProperties[constructorName]) === "") {
                                this.NOT_VALID_FORM_CONTROL_COUNT++;
                            }
                    } catch(ex) {
                        Common.log(ex);
                    }  // Not valid control
                    this.validControl(control);
                }, this);

                return;
            },

            ProcessOnSuccess: function (data, conType) {
                var successMessage = "";

                switch (conType) {
                    case WorkSchedule.ProcessType.SAVE:
                        successMessage = this.oController.getBundleText("MSG_00017");   // 저장되었습니다.
                        break;
                    case WorkSchedule.ProcessType.APPROVE:
                        successMessage = this.oController.getBundleText("MSG_00061");   // 신청되었습니다.
                        break;
                    case WorkSchedule.ProcessType.DELETE:
                        successMessage = this.oController.getBundleText("MSG_00021");   // 삭제되었습니다.
                        break;
                    case WorkSchedule.ProcessType.APPROVE_CANCEL:
                        successMessage = this.oController.getBundleText("MSG_55009");   // 결재취소 하였습니다.
                        break;
                    default:
                        break;
                }

                MessageBox.success(successMessage, {
                    title: this.oController.getBundleText("LABEL_00150"),
                    onClose: function () {
                        if(data.Url) {
                            Common.openPopup.call(this.oController, data.Url);
                        }

                        this.search.call(this);

                        if(conType === WorkSchedule.ProcessType.SAVE) {
                            this.searchDetailData.call(this);
                        } else if(conType !== WorkSchedule.ProcessType.APPROVE_CANCEL) {
                            this.oDetailDialog.close();
                        }
                    }.bind(this)
                });

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

            /**
             * 저장 버튼 event
             * 
             * @this {Handler}
             */
            pressSaveBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.IConType = WorkSchedule.ProcessType.SAVE;
                    payload.IBfchk = "X";
                    payload.ITttyp = "P";
                    payload.IDatum = moment(oInputData.Header.Schda).hours(10).toDate();
                    payload.IEmpid = oInputData.Header.Pernr;

                    payload.Worktimetab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "WorktimeApplyTab1", oInputData.Header), {
                            Schda: moment(oInputData.Header.Schda).hours(10).toDate(),
                            Wkbuzc: oInputData.Header.WkbuzT && oInputData.Header.WkbuzM ? oInputData.Header.WkbuzT + oInputData.Header.WkbuzM : null,
                            Wkeuzc: oInputData.Header.WkeuzT && oInputData.Header.WkeuzM ? oInputData.Header.WkeuzT + oInputData.Header.WkeuzM : null,
                            Trbuzc: oInputData.Header.TrbuzT && oInputData.Header.TrbuzM ? oInputData.Header.TrbuzT + oInputData.Header.TrbuzM : null,
                            Treuzc: oInputData.Header.TreuzT && oInputData.Header.TreuzM ? oInputData.Header.TreuzT + oInputData.Header.TreuzM : null,
                            Trbu1c: oInputData.Header.Trbu1T && oInputData.Header.Trbu1M ? oInputData.Header.Trbu1T + oInputData.Header.Trbu1M : null,
                            Treu1c: oInputData.Header.Treu1T && oInputData.Header.Treu1M ? oInputData.Header.Treu1T + oInputData.Header.Treu1M : null
                        })
                    ];
                    payload.Worktimetab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "WorktimeApplyTab2", elem);
                    });

                    ODataService.WorktimeApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00058"), {
                    // 저장하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00150"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },
            
            /**
             * 신청 버튼 event
             * 
             * @this {Handler}
             */
            pressApprovalBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.IConType = WorkSchedule.ProcessType.APPROVE;
                    payload.IBfchk = "X";
                    payload.ITttyp = "P";
                    payload.IDatum = moment(oInputData.Header.Schda).hours(10).toDate();
                    payload.IEmpid = oInputData.Header.Pernr;

                    payload.Worktimetab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "WorktimeApplyTab1", oInputData.Header), {
                            Schda: moment(oInputData.Header.Schda).hours(10).toDate(),
                            Wkbuzc: oInputData.Header.WkbuzT && oInputData.Header.WkbuzM ? oInputData.Header.WkbuzT + oInputData.Header.WkbuzM : null,
                            Wkeuzc: oInputData.Header.WkeuzT && oInputData.Header.WkeuzM ? oInputData.Header.WkeuzT + oInputData.Header.WkeuzM : null,
                            Trbuzc: oInputData.Header.TrbuzT && oInputData.Header.TrbuzM && oInputData.Header.TreuzT && oInputData.Header.TreuzM ? oInputData.Header.TrbuzT + oInputData.Header.TrbuzM : null,
                            Treuzc: oInputData.Header.TrbuzT && oInputData.Header.TrbuzM && oInputData.Header.TreuzT && oInputData.Header.TreuzM ? oInputData.Header.TreuzT + oInputData.Header.TreuzM : null,
                            Trbu1c: oInputData.Header.Trbu1T && oInputData.Header.Trbu1M && oInputData.Header.Treu1T && oInputData.Header.Treu1M ? oInputData.Header.Trbu1T + oInputData.Header.Trbu1M : null,
                            Treu1c: oInputData.Header.Trbu1T && oInputData.Header.Trbu1M && oInputData.Header.Treu1T && oInputData.Header.Treu1M ? oInputData.Header.Treu1T + oInputData.Header.Treu1M : null
                        })
                    ];
                    payload.Worktimetab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "WorktimeApplyTab2", elem);
                    });

                    ODataService.WorktimeApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00060"), {  // 신청하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00150"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },
            
            /**
             * 삭제 버튼 event
             * 
             * @this {Handler}
             */
            pressDeleteBtn: function() {
                var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.IConType = WorkSchedule.ProcessType.DELETE;
                    payload.IBfchk = "X";
                    payload.ITttyp = "P";
                    payload.IDatum = moment(oInputData.Header.Schda).hours(10).toDate();
                    payload.IEmpid = oInputData.Header.Pernr;

                    payload.Worktimetab1 = [
                        $.extend(true, Common.copyByMetadata(oModel, "WorktimeApplyTab1", oInputData.Header), {
                            Schda: moment(oInputData.Header.Schda).hours(10).toDate(),
                            Wkbuzc: oInputData.Header.WkbuzT && oInputData.Header.WkbuzM ? oInputData.Header.WkbuzT + oInputData.Header.WkbuzM : null,
                            Wkeuzc: oInputData.Header.WkeuzT && oInputData.Header.WkeuzM ? oInputData.Header.WkeuzT + oInputData.Header.WkeuzM : null,
                            Trbuzc: oInputData.Header.TrbuzT && oInputData.Header.TrbuzM && oInputData.Header.TreuzT && oInputData.Header.TreuzM ? oInputData.Header.TrbuzT + oInputData.Header.TrbuzM : null,
                            Treuzc: oInputData.Header.TrbuzT && oInputData.Header.TrbuzM && oInputData.Header.TreuzT && oInputData.Header.TreuzM ? oInputData.Header.TreuzT + oInputData.Header.TreuzM : null,
                            Trbu1c: oInputData.Header.Trbu1T && oInputData.Header.Trbu1M && oInputData.Header.Treu1T && oInputData.Header.Treu1M ? oInputData.Header.Trbu1T + oInputData.Header.Trbu1M : null,
                            Treu1c: oInputData.Header.Trbu1T && oInputData.Header.Trbu1M && oInputData.Header.Treu1T && oInputData.Header.Treu1M ? oInputData.Header.Treu1T + oInputData.Header.Treu1M : null
                        })
                    ];
                    payload.Worktimetab2 = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "WorktimeApplyTab2", elem);
                    });

                    ODataService.WorktimeApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        this.ProcessOnSuccess.bind(this), 
                        this.ProcessOnFail.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00059"), {
                    // 삭제하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            openDetailDialog: function() {
                if (!this.oDetailDialog) {
                    this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "priorDetail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDetailDialog);
                }
                
                Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);

                this.oDetailDialog.open();
            },

            /**
             * 목록에서 [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernrByList: function() {
                this.searchOrgehPernr.call(this.oController, function(o) {
                    this.oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                }.bind(this));
            },

            /**
             * @brief 결재라인 추가 버튼 event handler
             */
            pressAddApprovalLine: function() {
                this.oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = null;

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }
        
                this.oController._AddPersonDialog.open();
            },

            /**
             * @brief 공통-사원검색 callback function
             */
            setSelectionTagets: function(data) {
                var vApprovalLines = this.oModel.getProperty("/Detail/List"),
                    oTargetPaths = SearchUser1.oTargetPaths;

                if(vApprovalLines.some(function(elem) { return elem.Apper === data.Pernr; })) {
                    MessageBox.warning(this.oController.getBundleText("MSG_00065")); // 중복된 결재자입니다.
                    return;
                }

                if(Common.checkNull(oTargetPaths)) {
                    // Line add
                    vApprovalLines.push({
                        Aprsq: String(vApprovalLines.length + 1),
                        AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(vApprovalLines.length + 1),  // ${v}차 결재자
                        ApstaT: "",
                        Apper: data.Pernr,
                        Apnam: data.Ename,
                        Aporx: data.Fulln,
                        ApgrdT: data.ZpGradetx
                    });
                    this.oModel.refresh();
                    Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, vApprovalLines.length);
                } else {
                    // Line modify
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apper", data.Pernr);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apnam", data.Ename);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Aporx", data.Fulln);
                    this.oModel.setProperty(oTargetPaths.sPath + "/ApgrdT", data.ZpGradetx);
                }

                this.oController.EmployeeSearchCallOwner = null;
                SearchUser1.oTargetPaths = null;
                SearchUser1.onClose();

                this.toggleIsPossibleSave();
            },

            /**
             * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
             */
            openOrgSearchDialog: function (oEvent) {
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

            /**
             * @brief 결재라인 변경 버튼 event handler
             */
            pressApprovalLineModify: function(oEvent) {
                this.oController.EmployeeSearchCallOwner = this;
                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";
                SearchUser1.oTargetPaths = {
                    sPath: oEvent.getSource().getBindingContext().getPath()
                };

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }
        
                this.oController._AddPersonDialog.open();
            },

            /**
             * @brief 결재라인 삭제 버튼 event handler
             */
            pressApprovalLineDelete: function(oEvent) {
                this.oModel.setProperty(
                    "/Detail/List",
                    this.oModel.getProperty("/Detail/List")
                        .filter(function(elem) {
                            return elem.Apper !== oEvent.getSource().getBindingContext().getProperty().Apper;
                        })
                        .map(function(elem, idx) {
                            return $.extend(true, elem, { 
                                AprsqTx: this.oController.getBundleText("LABEL_32042").interpolate(idx + 1) // ${v}차 결재자
                            });
                        }.bind(this))
                );

                Common.adjustVisibleRowCount($.app.byViewId("PriorApprovalLineTable"), 3, this.oModel.getProperty("/Detail/List").length);
                this.toggleIsPossibleSave();
            },

            /**
             * 상세에서 [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernrByDetail: function() {
                this.searchOrgehPernr.call(this.oController, function(o) {
                    if(o.Otype === "O") {
                        MessageBox.warning(this.oController.getBundleText("MSG_32007")); // 사원을 선택하세요.
                        return;
                    }

                    this.oModel.setProperty("/Detail/Header/Pernr", o.Objid);
                    this.oModel.setProperty("/Detail/Header/Ename", o.Stext);
                    this.oModel.setProperty("/Detail/Header/Bukrs3", o.Bukrs3);

                    this.searchDetailData();
                }.bind(this));
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
            searchOrgehPernr: function(callback) {
                this.EmployeeSearchCallOwner = null;
                
                setTimeout(function() {
                    var initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                            Zflag: true,
                            Zshft: true
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },
            
            /** 근무 일괄신청(사전) **/
            pressBatchApply : function(){
            	sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : $.app.CONTEXT_PATH + ".Detail",
				      data : {
				    	  FromPageId : $.app.APP_ID,
				    	  Data : {Key : WorkSchedule.Tab.PRIOR},
				    	  ApprStats : this.oModel.getProperty("/ApprStats"),
				    	  Faprss : this.oModel.getProperty("/Faprss"), // 근무사유
				    	  Tprogs : this.oModel.getProperty("/Tprogs"), // 근무일정
				    	  Hours : this.oModel.getProperty("/Hours"),
						  Minutes : this.oModel.getProperty("/Minutes")
				      }
				});
            }
        };

        return Handler;
    }
);
