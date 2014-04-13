
// Don't mind me, I'm a Contract-Programming interface in JS
function Contract (conf) {
    // Reference this context
    var contract = this;
	contract.VERSION = '0.0.1';
    contract.conf    = conf;

    // Conf default
    if ( typeof( contract.conf ) == 'undefined' ) { contract.conf = {}; }

    // Throw errors
    this.assert = function ( conditional, e ) {
    	if (! conditional ) { e.name = 'Assertion failed'; throw e; } };

    // Set the exception handler function to the user's one, or the default
    this.exception = function ( functionName, when, e ) {
        throw( e );
    };

    // Allow override of the constructor method name
    var constructor = ( typeof( contract.conf['constructor'] ) == 'string' ) ?
        contract.conf['constructor'] : 'func';

    // Create a function. Pass me an object def
    var body = function (definition) {

        // Wrapping function definition
        return function () {

            // If there's an 'input', run it
            if (typeof definition.input != undefined ) {
                try { definition.input.apply( contract, arguments ) } catch (e) {
                    contract.exception(definition.name, 'input', e )
                };
            }

            // Run the body
            var result = definition.body.apply( contract, arguments );

            // If there's an 'output', run it
            if (typeof definition.output != undefined ) {
                try { definition.output.apply( contract, [result] ) } catch (e) {
                    contract.exception(definition.name, 'output', e )
                };
            }

            // Give the function result back to the user
            return result;
        };
    };

    this[constructor] = body(
    	'input':  function () {
    		this.assert( typeof( arguments[0] ) == 'object',
    			Error('Constructor should be passed a function') );
    	},
    	'output': function () {
    		this.assert( typeof( arguments[0] ) == 'object',
    			Error('Constructor should return a function') );
    	},
    	'body'  : body
    );
};
