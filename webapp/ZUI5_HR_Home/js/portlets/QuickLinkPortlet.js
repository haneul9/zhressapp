/* global AbstractPortlet */
function QuickLinkPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.urlList = null;
	this.urlMap = null;
}

QuickLinkPortlet.prototype = Object.create(AbstractPortlet.prototype);
QuickLinkPortlet.prototype.constructor = QuickLinkPortlet;

$.extend(QuickLinkPortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				'<button type="button" class="d-none" data-dismiss="portlet" aria-label="Close">',
					'<span aria-hidden="true" style="font-size:1.125rem;color:#333"><i class="fas fa-times" title="숨기기"></i></span>',
				'</button>',
				'<button type="button" data-quick-link-button="add" aria-label="추가" class="pb-2px">',
					'<span aria-hidden="true" style="font-size:1.125rem;color:#333"><i class="fas fa-plus" title="추가"></i></span>',
				'</button>',
				'<button type="button" data-quick-link-button="remove" aria-label="삭제" class="pb-2px">',
					'<span aria-hidden="true" style="font-size:1.125rem;color:#333"><i class="fas fa-minus" title="삭제"></i></span>',
				'</button>',
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-quick-link" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="portlet-quick-link-box"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
onceBefore: function() {

	var portlet = '[data-key="${key}"].portlet'.interpolate(this.key());
	$(document)
		.off('click', portlet + ' [data-quick-link-button="add"]')
		.on('click', portlet + ' [data-quick-link-button="add"]', this.add.bind(this));

	$(document)
		.off('click', portlet + ' [data-quick-link-button="remove"]')
		.on('click', portlet + ' [data-quick-link-button="remove"]', function() {
			var key = this.key(),
			box = $('[data-key="${key}"].portlet .portlet-quick-link-box'.interpolate(key)).toggleClass('remove-mode');
			$('[data-key="${key}"].portlet [data-quick-link-button="add"]'.interpolate(key)).prop('disabled', box.hasClass('remove-mode') || this.urlList.length === 5);
		}.bind(this));

	$(document)
		.off('click', portlet + ' [data-quick-link-seqnr]')
		.on('click', portlet + ' [data-quick-link-seqnr]', function(e) {
			this.goToLink(this.urlMap[$(e.currentTarget).data('quickLinkSeqnr')]);
		}.bind(this));

	$(document)
		.off('click', portlet + ' .btn-remove')
		.on('click', portlet + ' .btn-remove', function(e) {
			var index = $(e.currentTarget).siblings().data('quickLinkSeqnr'),
			options = {
				html: ['<p>', '</p>'].join('바로가기를 삭제하시겠습니까?'),
				confirm: function() {

					this.spinner(true);

					this.urlList.splice($.inArray(index, $.map(this.urlList, function(o) { return o.Seqnr; })), 1);

					this.save();
				}.bind(this)
			};
			this._gateway.confirm(options);
		}.bind(this));
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'R',
			IConType: '3',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn3: []
		},
		success: function(data) {
			this._gateway.prepareLog('QuickLinkPortlet.fill ${url} success'.interpolate(url), arguments).log();

			this.render(this._gateway.odataResults(data).TableIn3);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'QuickLinkPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
render: function(list) {

	this.urlList = list || [];
	this.urlMap = {};

	var key = this.key(), size = this.urlList.length;
	$('[data-key="${key}"].portlet [data-quick-link-button="remove"]'.interpolate(key)).prop('disabled', size === 0);
	$('[data-key="${key}"].portlet [data-quick-link-button="add"]'.interpolate(key)).prop('disabled', size === 5);

	var html = $.map(this.urlList, function(o) {
		this.urlMap[o.Seqnr] = o.Url;
		return [
			'<div>',
				'<button type="button" class="btn btn-light" data-quick-link-seqnr="${seqnr}" title="${url}">'.interpolate(o.Seqnr, o.Url),
					'<span>', o.Title, '</span>',
				'</button>',
				'<button type="button" class="btn btn-remove">',
					'<i class="far fa-times-circle"></i>',
				'</button>',
			'</div>'
		].join('');
	}.bind(this));

	if (size < 5) {
		$.map(new Array(5 - html.length), function() {
			html.push([
				'<div>',
					'<button type="button" class="btn btn-light" data-quick-link-button="add">',
						'<i class="fas fa-plus"></i>',
					'</button>',
				'</div>'
			].join(''));
		});
	}

	$('[data-key="${key}"].portlet .portlet-quick-link-box'.interpolate(this.key())).html(html);
},
goToLink: function(url) {

	this._gateway.openWindow({
		url: (/^http/.test(url) ? '' : 'https://') + url,
		name: url.replace(/[^a-zA-Z0-9]/g, '')
	});
},
add: function() {

	$([
		'<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="바로가기 추가 modal" aria-hidden="true">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h5 class="modal-title">바로가기 추가</h5>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body">',
						'<form>',
							'<div class="form-group">',
								'<label for="quick-link-title" class="col-form-label">제목</label>',
								'<input type="text" class="form-control" id="quick-link-title" maxlength="6" />',
								'<div class="invalid-feedback value-required">제목을 입력하세요.</div>',
							'</div>',
							'<div class="form-group">',
								'<label for="quick-link-url" class="col-form-label">URL</label>',
								'<input type="text" class="form-control" id="quick-link-url" maxlength="2000" />',
								'<div class="invalid-feedback value-required">URL을 입력하세요.</div>',
							'</div>',
						'</form>',
					'</div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-primary">저장</button>',
						'<button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('')).appendTo('body')
	.on('hidden.bs.modal', function() {
		$(this).remove();
	})
	.find('.btn-primary').on('click', function(e) {

		var title = $.trim($('#quick-link-title').val());
		if (!title) {
			title.siblings('.value-required').show();
			return;
		}
		var url = $.trim($('#quick-link-url').val());
		if (!url) {
			url.siblings('.value-required').show();
			return;
		}

		this.urlList.push({ Title: title, Url: url });

		this.save();

		$(e.currentTarget).parents('.modal').modal('hide');
	}.bind(this)).end()
	.modal();
},
save: function() {

	this.spinner(true);

	this.urlList = $.map(this.urlList, function(o, i) {
		o.Seqnr = String.lpad(i, 3, '0');
		return o;
	});

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	this._gateway.post({
		url: url,
		data: {
			IMode: 'U',
			IConType: '3',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn3: this.urlList
		},
		success: function() {
			this._gateway.prepareLog('QuickLinkPortlet.save ${url} success'.interpolate(url), arguments).log();
			this.render(this.urlList);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'QuickLinkPortlet.save ' + url, true);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			var portlet = '[data-key="${key}"].portlet'.interpolate(this.key());
			$(document).off('click', portlet + ' [data-quick-link-button="add"]');
			$(document).off('click', portlet + ' [data-quick-link-button="remove"]');
			$(document).off('click', portlet + ' [data-quick-link-seqnr]');
			$(document).off('click', portlet + ' .btn-remove');
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});