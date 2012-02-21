///////////////////////////////////////////////////////////////////////
// disbranded.Cookie
///////////////////////////////////////////////////////////////////////

if (typeof disbranded === "undefined") var disbranded = {};

disbranded.Cookie = {};


/*
* COOKIE
* reference (for document.cookie): http://www.quirksmode.org/js/cookies.html
*/
disbranded.Cookie.key = function(n) {
	return window.localStorage ? window.localStorage.key(n) : null;
};

disbranded.Cookie.setItem = function(key, value) {
	if (window.localStorage) {
		window.localStorage.setItem(key, value);
	} else {
		var exDate = new Date();
		exDate.setTime(exDate.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
		document.cookie = key +"+"+ value +"; expires=" + exDate.toUTCString() + "; path=/";
	}
};

disbranded.Cookie.getItem = function(key) {
	if (window.localStorage) {
		return window.localStorage.getItem(key);
	} else {
		var cks = document.cookie.split(";");
		var len = cks.length;
		var cName, eIndex;
		for (var i = 0; i < len; i++) {
			eIndex = cks[i].indexOf("=");
			cName = cks[i].substr(0, eIndex);
			cName = cName.replace(/^\s+|\s+$/g,"");
			if (cName == key) {
				return unescape(cks[i].substr(eIndex + 1));
			}
		}
	}
	return null;
};

disbranded.Cookie.removeItem = function(key) {
	if (window.localStorage) {
		window.localStorage.removeItem(key);
	} else {
		document.cookie = key +"+"+ value +"; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
};

disbranded.Cookie.clear = function() {
	if (window.localStorage) {
		window.localStorage.clear();
	} else {
		var cks = document.cookie.split(";");
		var len = cks.length;
		var cName, eIndex;
		for (var i = 0; i < len; i++) {
			eIndex = cks[i].indexOf("=");
			cName = (eIndex > -1) ? cks[i].substr(0, eIndex) : cks[i];
			document.cookie = cName +"=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}
};
