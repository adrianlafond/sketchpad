if (typeof disbranded === "undefined") var disbranded = {};
if (typeof disbranded.backbone === "undefined") disbranded.backbone = {};

/**
 * This is a localStorage/cookie alternate Backbone sync.
 * @requires disbranded.Cookie
 * @author Adrian Lafond
 */
disbranded.backbone.cookie = function(method, model, options) {	

	switch (method) {
		case "read":
			var resp = disbranded.Cookie.getItem(model.id);
			if (resp) {
				options.success(JSON.parse(resp));
			} else {
				options.error('Item not found.');
			}
			break;
			
		//deliberate fall-through
		case "create":
		case "update":
			disbranded.Cookie.setItem(model.id, JSON.stringify(model));
			options.success(model);
			break;
			
		case "delete":
			disbranded.Cookie.removeItem(model.id);
			options.success(model);
			break;
			
		default:
			break;
	}
};