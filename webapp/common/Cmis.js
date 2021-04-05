// require("cmis-polyfills");

"use strict";

var __extends =
    (this && this.__extends) ||
    (function () {
        var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
                function (d, b) {
                    d.__proto__ = b;
                }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
        };
    })();
var Options = (function () {
    function Options() {
        this.succinct = true;
    }
    return Options;
}());
var HTTPError = (function (_super) {
    __extends(HTTPError, _super);
    function HTTPError(response) {
        var _this = _super.call(this, response.statusText) || this;
        _this.response = response;
        return _this;
    }
    return HTTPError;
})(Error);

var __serialize = function(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

var Cmis = (function() {
    function Cmis() {
        this.options = { succinct: true };
        this.defaultRepository = {
            repositoryId: "3868fc5f124c35d7e47cc206",
            repositoryUrl: "/cmis/3868fc5f124c35d7e47cc206",
            rootFolderUrl: "/cmis/3868fc5f124c35d7e47cc206/root"
        };
    }
    return Cmis;
}());

Cmis.prototype.setProperties = function (options, properties) {
    var i = 0;
    for (var id in properties) {
        options['propertyId[' + i + ']'] = id;
        var propertyValue = properties[id];
        if (propertyValue !== null && propertyValue !== undefined) {
            if (Object.prototype.toString.apply(propertyValue) == '[object Array]') {
                var multiProperty = propertyValue;
                for (var j = 0; j < multiProperty.length; j++) {
                    options['propertyValue[' + i + '][' + j + ']'] = multiProperty[j];
                }
            }
            else {
                options['propertyValue[' + i + ']'] = propertyValue;
            }
        }
        i++;
    }
};

Cmis.prototype.setPolicies = function (options, policies) {
    for (var i = 0; i < policies.length; i++) {
        options['policy[' + i + ']'] = policies[i];
    }
};

Cmis.prototype.setACEs = function (options, ACEs, action) {
    var i = 0;
    for (var id in ACEs) {
        options[action + 'ACEPrincipal[' + i + ']'] = id;
        var ace = ACEs[id];
        for (var j = 0; j < ace.length; j++) {
            options[action + 'ACEPermission[' + i + '][' + j + ']'] = ACEs[id][j];
        }
        i++;
    }
};

Cmis.prototype.http = function (method, url, options, multipartData) {
    var _this = this;
    var body = {};
    for (var k in this.options) {
        if (this.options[k] != null && this.options[k] !== undefined) {
            body[k] = this.options[k];
        }
    }
    for (var m in options) {
        if (options[m] != null && options[m] !== undefined) {
            body[m] = options[m];
        }
    }
    var cfg = { method: method, headers: {}, credentials: "include" };

    if (multipartData) {
        var formData = new FormData();
        var content = multipartData.content;
        if ("string" == typeof content) {
            if (typeof Blob !== "undefined") content = new Blob([content]);
        }
        formData.append("content", content, multipartData.mimeTypeExtension ? multipartData.filename + "." + multipartData.mimeTypeExtension : multipartData.filename);
        for (var j in body) {
            formData.append(j, "" + body[j]);
        }
        if (this.charset) {
            formData.append("_charset_", this.charset);
        }
        cfg.body = formData;
    } else {
        var usp = {};
        Object.keys(body).forEach(function(key) {
            if (!usp.hasOwnProperty(key) && body[key] != null && body[key] !== undefined) {
                usp[key] = body[key];
            }
        });
        if (method !== "GET") {
            cfg.body = __serialize(usp);
            cfg.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
        } else {
            url = url + "?" + __serialize(usp);
        }
    }
    var response = fetch(url, cfg).then(function (res) {
        if (res.status < 200 || res.status > 299) {
            throw new HTTPError(res);
        }
        return res;
    });
    if (this.errorHandler) {
        response.catch(function (err) {
            return _this.errorHandler(err);
        });
    }
    return response;
};

Cmis.prototype.get = function (url, options) {
    return this.http('GET', url, options);
};

Cmis.prototype.post = function (url, options, multipartData) {
    return this.http('POST', url, options, multipartData);
};

Cmis.prototype.setToken = function (token) {
    this.token = token;
    return this;
};

Cmis.prototype.setCharset = function (charset) {
    this.charset = charset;
    return this;
};

Cmis.prototype.setErrorHandler = function (handler) {
    this.errorHandler = handler;
};

Cmis.prototype.getRepositoryInfo = function () {
    return this.get(this.defaultRepository.repositoryUrl, { cmisselector: 'repositoryInfo' })
        .then(function (res) { return res.json(); });
};

Cmis.prototype.getParents = function (objectId, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    o.cmisselector = 'parents';
    o.objectId = objectId;
    return this.get(this.defaultRepository.rootFolderUrl, o).then(function (res) { return res.json(); });
};

Cmis.prototype.getChildren = function (objectId, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    o.cmisselector = 'children';
    o.objectId = objectId;
    return this.get(this.defaultRepository.rootFolderUrl, o).then(function (res) { return res.json(); });
};

Cmis.prototype.getObjectByPath = function (path, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    o.cmisselector = 'object';
    var sp = path.split('/');
    for (var i = sp.length - 1; i >= 0; i--) {
        sp[i] = encodeURIComponent(sp[i]);
    }
    return this.get(this.defaultRepository.rootFolderUrl + sp.join('/'), o).then(function (res) { return res.json(); });
};

Cmis.prototype.getObject = function (objectId, returnVersion, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    o.cmisselector = 'object';
    o.objectId = objectId;
    o.returnVersion = returnVersion;
    return this.get(this.defaultRepository.rootFolderUrl, o).then(function (res) { return res.json(); });
};

Cmis.prototype.getContentStreamURL = function (objectId, download, streamId) {
    if (download === void 0) { download = 'inline'; }
    var options = new Options();
    options.cmisselector = 'content';
    options.objectId = objectId;
    options.download = download;
    options.streamId = streamId;
    var usp = {};
    Object.keys(options).forEach(function(key) {
        if (options[key] != null && options[key] !== undefined) {
            usp[key] = options[key];
        }
    });
    Object.keys(this.options).forEach(function(key) {
        if (!usp.hasOwnProperty(key) && this.options[key] != null && this.options[key] !== undefined) {
            usp[key] = this.options[key];
        }
    }.bind(this));
    return this.defaultRepository.rootFolderUrl + "?" + __serialize(usp);
};

Cmis.prototype.createFolder = function (parentId, name, type, policies, addACEs, removeACEs) {
    if (type === void 0) { type = 'cmis:folder'; }
    if (policies === void 0) { policies = []; }
    if (addACEs === void 0) { addACEs = {}; }
    if (removeACEs === void 0) { removeACEs = {}; }
    var options = new Options();
    options.objectId = parentId;
    options.repositoryId = this.defaultRepository.repositoryId;
    options.cmisaction = 'createFolder';
    var properties = {
        'cmis:name': name,
        'cmis:objectTypeId': type
    };
    this.setProperties(options, properties);
    this.setPolicies(options, policies);
    this.setACEs(options, addACEs, 'add');
    this.setACEs(options, removeACEs, 'remove');
    return this.post(this.defaultRepository.rootFolderUrl, options).then(function (res) { return res.json(); });
};

Cmis.prototype.createDocument = function (parentId, content, input, mimeTypeExtension, versioningState, policies, addACEs, removeACEs, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    if ('string' == typeof input) {
        input = {
            'cmis:name': input
        };
    }
    var properties = input || {};
    if (!properties['cmis:objectTypeId']) {
        properties['cmis:objectTypeId'] = 'cmis:document';
    }
    if (versioningState) {
        o.versioningState = versioningState;
    }
    o.objectId = parentId;
    this.setProperties(o, properties);
    if (policies) {
        this.setPolicies(o, policies);
    }
    if (addACEs) {
        this.setACEs(o, addACEs, 'add');
    }
    if (removeACEs) {
        this.setACEs(o, removeACEs, 'remove');
    }
    o.repositoryId = this.defaultRepository.repositoryId;
    o.cmisaction = 'createDocument';
    return this.post(this.defaultRepository.rootFolderUrl, o, {
        content: content,
        filename: properties['cmis:name'],
        mimeTypeExtension: mimeTypeExtension
    }).then(function (res) { return res.json(); });
};

Cmis.prototype.deleteObject = function (objectId, allVersions) {
    if (allVersions === void 0) { allVersions = false; }
    var options = new Options();
    options.repositoryId = this.defaultRepository.repositoryId;
    options.cmisaction = 'delete';
    options.objectId = objectId;
    options.allVersions = allVersions;
    return this.post(this.defaultRepository.rootFolderUrl, options);
};

Cmis.prototype.deleteContentStream = function (objectId, options) {
    if (options === void 0) { options = {}; }
    var o = options;
    o.objectId = objectId;
    o.cmisaction = 'deleteContent';
    return this.post(this.defaultRepository.rootFolderUrl, o);
};
