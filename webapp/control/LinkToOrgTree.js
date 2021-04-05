/* eslint-disable no-undef */
/* global common:true */
jQuery.sap.declare("control.LinkToOrgTree");
control.LinkToOrgTree = {
	/*
	 *
	 */
	oModel : null,
	CommonController : null,
	gController : null,
	targetTable : null,
	tableLength : 0,
	addPerson : function(oController,oTable,oSessionData,tableLength,OrgOfIndividualHandler,DialogHandler,CommonController){
		this.CommonController=CommonController;
		this.gController=oController;
		this.oModel=oTable.getModel();
		this.tableLength=tableLength;
		this.targetTable=oTable;
		setTimeout(function(){
			var initData = {
				autoClose: false,
				Percod: oSessionData.Percod,
				Bukrs: oSessionData.Bukrs2,
				Langu: oSessionData.Langu,
				Molga: oSessionData.Molga,
				Datum: new Date(),
				Mssty: "",
			};
			var callback = function(o) {
				switch(o.Otype) {
					case "P":
						control.LinkToOrgTree.addTargetTableByOne(o);
						break;
					case "O":
						control.LinkToOrgTree.addTargetTableByMulti(o.nodes.filter(function(node) {
							return node.Otype === "P";
						}));
						break;
				}
			};
			OrgOfIndividualHandler=OrgOfIndividualHandler.get(oController, initData, callback);
			control.LinkToOrgTree.OrgOfIndividualHandler=OrgOfIndividualHandler;
			DialogHandler.open(OrgOfIndividualHandler);
			setTimeout(function(){
				OrgOfIndividualHandler.oDialog.$().position({
					my: "right",
					at: "right",
					of: window
				});
			},300);			
		},0);
	},

	
	addTargetTableByOne: function(data) {
		var vListData = control.LinkToOrgTree.oModel.getProperty("/List");
		// 중복 체크
		if(vListData.some(function(elem) { return elem.Pernr === data.Objid; })) {
			new sap.m.MessageToast.show(oBundleText.getText("MSG_30002"), {
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
		console.log(vListData);
		this.oModel.refresh();
		var tLength=this.oModel.getProperty("/List").length;
		tLength<=this.tableLength?this.targetTable.setVisibleRowCount(this.oModel.getProperty("/List").length):
		this.targetTable.setVisibleRowCount(this.tableLength);
	},

	getBundleText:function(key, values){
		control.LinkToOrgTree.gController.getBundleText(key, values);
	},

	// getView : function(){
	// 	control.LinkToOrgTree.getParentView();
	// },

		/**
	 * 조직 선택시 호출
	 * 
	 * @param {Array} data - 선택된 조직도 아이템(Array<사원>)
	 */
	addTargetTableByMulti: function(data) {
		var vListData = control.LinkToOrgTree.oModel.getProperty("/List"),
			vSelectedDataLength = data.length;

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
			MessageToast.show(oBundleText.getText("MSG_30011"), {
				// 중복된 대상은 제외하고\n추가합니다.
				duration: 2000,
				my: sap.ui.core.Popup.Dock.CenterCenter,
				at: sap.ui.core.Popup.Dock.CenterCenter
			});
		}
		
		control.LinkToOrgTree.oModel.setProperty(
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
					Position : elem2.Gubunt,
					stateBegda: sap.ui.core.ValueState.None,
					stateSchkz: sap.ui.core.ValueState.None,
					stateReqrs: sap.ui.core.ValueState.None,
					Chk: false
				};
			}))
		);

		control.LinkToOrgTree.oModel.refresh();
		control.LinkToOrgTree.setIsPossibleRowDelete();
	},

	
	getOrgOfIndividualHandler: function() {
		return control.LinkToOrgTree.OrgOfIndividualHandler;
	},

	displayMultiOrgSearchDialog: function(oEvent) {
		return control.LinkToOrgTree.OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
	},

	onESSelectPerson: function(data) {
		return control.LinkToOrgTree.OrgOfIndividualHandler.setSelectionTagets(data);
	}
	
};