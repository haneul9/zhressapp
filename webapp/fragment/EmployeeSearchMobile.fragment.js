jQuery.sap.require("common.SearchUserMobile");

sap.ui.jsfragment("fragment.EmployeeSearchMobile", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.EmployeeSearch
	 */
	createContent: function (oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
                this.getSearchHBox(oController),
				this.getList(oController),
				new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
			]
		}).addEventDelegate({
			onAfterRendering: function() {
				common.SearchUserMobile.onAfterOpenSearch();
			}
		}, this);
	},
	
	getSearchHBox: function(oController) {
			return new sap.m.FlexBox({
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						// 검색
						items: [
							new sap.m.ComboBox(oController.PAGEID + "_ES_Persa",{
								width: "100px",
								change: common.SearchUserMobile.onChangePersa
							}),
							new sap.m.Input(oController.PAGEID + "_ES_Ename", {
								width: "100%"
							})
						]
					}).addStyleClass("search-field-group pr-0"),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: common.SearchUserMobile.searchFilterBar,
								icon : "sap-icon://search"		
							}).addStyleClass("button-search")
						]
					}).addStyleClass("button-group pl-0")
				]
			})
			.addStyleClass("search-box-mobile h-auto")
	    },
	
		getList: function(oController) {
			
			return new sap.m.Table(oController.PAGEID + "_EmpSearchResult_Table",{
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				columns: [
					new sap.m.Column({
						width: "30%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "60%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.Begin
					})
				],
				items: {
					path: "/EmpSearchResultSet",
					template: new sap.m.ColumnListItem({
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ text: "{Pernr}" }),
									new sap.m.Text({ text: "{Ename}" })
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ text: "{Fulln}" }),
									new sap.m.Text({ text: "{ZpGradetx}" })
								]
							}),
							new sap.m.FlexBox({
								justifyContent: "End",
								items: [
									new sap.m.Button({
										press: common.SearchUserMobile.onESSelectPerson.bind(oController),
										icon : "sap-icon://accept"
									}).addStyleClass("button-default")
								]
							})
						]
					})
				}
			}).setModel(new sap.ui.model.json.JSONModel());
		}

});
