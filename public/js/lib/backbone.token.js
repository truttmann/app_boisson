(function(root, factory) {
  // Set up Backbone appropriately for the environment.
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['underscore', 'backbone'], function(_, Backbone) {
      factory(root, _, Backbone);
    });
  } else {
    // Browser globals
    factory(root, root._, root.Backbone);
  }
}(this, function(root, _, Backbone) {


	Backbone.TokenAuth = {
			
		_token : null,
		
		reset : function(){
			this.setToken(null);
		},
	
		setToken : function(token){
			this._token = token;
			$.ajaxSetup({
 				headers : this.getHeader()
			});
		},
		
		getToken : function(){
			return this._token;
		},
		
		getHeader : function() {
			if (_.isNull(this.getToken())){
				return {};
			}
			return { "Token" : this._token };
		}
	};
	
	var parentSyncMethod = Backbone.sync;
	
	Backbone.sync = function(method, model, options) {
		var headers = Backbone.TokenAuth.getHeader();
		options.headers = headers;
		return parentSyncMethod.apply(Backbone, arguments);
	};

	return Backbone;

}));