/* eslint-disable no-undef */
jQuery.sap.declare("zui5_hrxx_actapp2.fragment.ZKL_TableMakr");

zui5_hrxx_actapp2.fragment.ZKL_TableMakr = {

	ListTable : function(oController) {		

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ListTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 40,
			visibleRowCount : 5,
			selectionMode : sap.ui.table.SelectionMode.Single ,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly
		});
		
		oTable.attachCellClick(oController.SelectRow);
		
		oTable.setModel(oController._tableJModel);
		oTable.bindRows("/Data");
		return oTable;

	}
};