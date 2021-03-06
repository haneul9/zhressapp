/* global AbstractPortlet moment */
function WorkstimeStatusPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-workstimeStatusPortlet-list';
}

WorkstimeStatusPortlet.prototype = Object.create(AbstractPortlet.prototype);
WorkstimeStatusPortlet.prototype.constructor = WorkstimeStatusPortlet;

$.extend(WorkstimeStatusPortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				this.dismissButton(),
				this.link(true),
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-worktime" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-workstimeStatusPortlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},

lpad: function (d, width) {
    d = d + '';
    return d.length >= width ? d : new Array(width - d.length + 1).join('0') + d;
},

checkNull: function (v) {
    return v === undefined || v === null || v == '' ? true : false;
},

fill: function() {

    this._gateway.setModel('ZHR_FLEX_TIME_SRV');

    return new Promise(function(resolve, reject) {
		var url = 'ZHR_FLEX_TIME_SRV/FlexworktimeSummarySet',
        oEmpInfo = this._gateway.loginInfo();

        this._gateway.getModel('ZHR_FLEX_TIME_SRV').create('/FlexworktimeSummarySet', {
			Werks: oEmpInfo.Persa,
			Pernr: this._gateway.pernr(),
			Zyymm: moment().format('YYYYMM'),
			Langu: 'KO',
			Prcty: '1',
            FlexWorktime1Nav : []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('WorkstimeStatusPortlet.fill ${url} success'.interpolate(url), arguments).log();

                var oPortlet = this,
                list = this.$(),
                oWorkData = result,
                oMonthWorkTime = result.FlexWorktime1Nav.results,

                today = new Date(),
                vDateTime = '/Date(' + new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0).getTime() + ')/',

                oBackGround = [
                    'bg-danger',    /* bg-lcc-signature-red */
                    'bg-success'    /* bg-lcc-signature-blue */
                ],

                vCtrnm = oWorkData.Ctrnm, // ??????????????????
                vWrktm = oWorkData.Wrktm, // ????????????(??????)
                vExttm = oWorkData.Exttm, // ????????????
                vTottm = oWorkData.Tottm, // ??? ????????????
                vWorStatus = '', // ????????????
                vWorBTime = '', //????????????
                vWorETime = '', // ????????????
                vFullTime = ''; // ??????Time

                vCtrnm = vCtrnm.split(':');
                vWrktm = vWrktm.split(':');
                vExttm = vExttm.split(':');
                vTottm = vTottm.split(':');

                oMonthWorkTime.forEach(function(e) {
                    if(e.Datum == vDateTime){
                        vWorStatus = oPortlet.checkNull(e.Atext) ? '????????????' : e.Atext;
                        vWorBTime = e.Beguz;
                        vWorETime = e.Enduz;
                        vFullTime = oPortlet.checkNull(vWorBTime) && oPortlet.checkNull(vWorETime) ? '' : '(' + vWorBTime.slice(0,2) + ':' + vWorBTime.slice(-2) + '~' + vWorETime.slice(0,2) + ':' + vWorETime.slice(-2) + ')';

                        if(e.Offyn === 'X'){
                            vWorStatus = 'OFF';
                            vWorBTime = '';
                            vWorETime = '';
                            vFullTime = '';
                        }
                    }
                });

                var vCtrnmH = vCtrnm[0] !== '00' && this.checkNull(!vCtrnm[0]) ? parseFloat(vCtrnm[0]) + '??????' : (this.checkNull(vCtrnm[1]) ? '0??????' : ''),
                    vCtrnmM = vCtrnm[1] !== '00' ? (this.checkNull(vCtrnm[1]) ? '' : parseFloat(vCtrnm[1]) + '???') : '',
                    vWrktmH = vWrktm[0] !== '00' && this.checkNull(!vWrktm[0]) ? parseFloat(vWrktm[0]) + '??????' : (this.checkNull(vWrktm[1]) ? '0??????' : ''),
                    vWrktmM = vWrktm[1] !== '00' ? (this.checkNull(vWrktm[1]) ? '' : parseFloat(vWrktm[1]) + '???') : '',
                    vExttmH = vExttm[0] !== '00' && this.checkNull(!vExttm[0]) ? parseFloat(vExttm[0]) + '??????' : (this.checkNull(vExttm[1]) ? '0??????' : ''),
                    vExttmM = vExttm[1] !== '00' ? (this.checkNull(vExttm[1]) ? '' : parseFloat(vExttm[1]) + '???') : '',
                    vTottmH = vTottm[0] !== '00' && this.checkNull(!vTottm[0]) ? parseFloat(vTottm[0]) + '??????' : (this.checkNull(vTottm[1]) ? '0??????' : ''),
                    vTottmM = vTottm[1] !== '00' ? (this.checkNull(vTottm[1]) ? '' : parseFloat(vTottm[1]) + '???') : '';

                var vWorkTime = parseInt(vTottm[0]+vTottm[1]) / parseInt(vCtrnm[0]+vCtrnm[1]) * 80;
                var vBackColor = vWorkTime > 80 ? oBackGround[0] : oBackGround[1];

                list.append([
                    '<div class="today">',
                        '<div class="title">????????? ??????</div>',
                        '<div class="state">', vWorStatus + vFullTime, '</div>',
                    '</div>',
                    '<div class="blue-banner">',
                        '<div class="blue-banner-title">??? ????????????</div>',
                        '<div class="blue-banner-value">', vTottmH + ' ' + vTottmM, '</div>',
                    '</div>',
                    '<div class="statusBar">',
                        '<div class="progress">',
                            '<div class="progress-bar ' + vBackColor + '" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>',
                            '<div class="progress-line"></div>',
                        '</div>',
                        '<div class="hour-unit">',
                            '<div class="unit">0h</div>',
                            '<div class="unit mr-55px">', (vCtrnmH + vCtrnmM).split('??????')[0] + 'h', '</div>',
                        '</div>',
                    '</div>',
                    '<div class="worktime-list">',
                        '<div class="worktime-type">',
                            '<div class="sub-title">?????? ???????????? ??????</div>',
                            '<div class="time">', vCtrnmH +  ' ' + vCtrnmM, '</div>',
                        '</div>',
                        '<div class="worktime-type">',
                            '<div class="sub-title">??????????????????</div>',
                            '<div class="time">', vWrktmH + ' ' + vWrktmM, '</div>',
                        '</div>',
                        '<div class="worktime-type">',
                            '<div class="sub-title">??????????????????</div>',
                            '<div class="time">', vExttmH + ' ' + vExttmM, '</div>',
                        '</div>',
                    '</div>'
                ].join(''));

                $('.statusBar .progress-bar').animate({ width: vWorkTime + '%' }, 2000);

                this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
                this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'WorkstimeStatusPortlet.fill ' + url);

                this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
}

});