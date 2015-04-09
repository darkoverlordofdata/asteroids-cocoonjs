/**
 * Helpers 
 */
( function(exports) {
    var TouchableCircle, TouchableJoystick, TouchableButton, TouchableDirection, TouchableArea,extend
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    extend = function(target, src) {
        var clone, copy, copyIsArray, deep, i, length, name, options;
        i = 1;
        length = 2;
        deep = true;
        if (typeof target === 'boolean') {
            deep = target;
            i = 2;
        }
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }
        if (options = src) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && (typeof copy === 'object' || (copyIsArray = Object.prototype.toString.call(copy) === '[object Array]'))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = (src && Object.prototype.toString.call(src) === '[object Array]' ? src : []);
                    } else {
                        clone = (src && typeof src === 'object' ? src : {});
                    }
                    target[name] = extend(clone, copy);
                } else {
                    if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
	//function extend( target, src )
	//{
	//	var options, name, copy, copyIsArray, clone,
	//		i = 1,
	//		length = 2,
	//		deep = true;
	//
	//	// Handle a deep copy situation
	//	if( typeof target === "boolean" )
	//	{
	//		deep = target;
	//		// skip the boolean and the target
	//		i = 2;
	//	}
	//
	//	// Handle case when target is a string or something( possible in deep copy )
	//	//if( typeof target !== "object" && !typeof target === 'function' )
     //   // invalid operator precedence should be:
     //   if( typeof target !== "object" && typeof target !== 'function' )
	//	{
	//		target = {};
	//	}
	//	// Only deal with non-null/undefined values
	//	if( options = src )
	//	{
	//		// Extend the base object
	//		for( name in options )
	//		{
	//			src = target[name];
	//			copy = options[name];
	//
	//			// Prevent never-ending loop
	//			if( target === copy )
	//			{
	//				continue;
	//			}
	//			// Recurse if we're merging plain objects or arrays
	//			if( deep &&( typeof copy == 'object' ||( copyIsArray = Object.prototype.toString.call(  copy  ) === '[object Array]' ) ) )
	//			{
	//				if( copyIsArray )
	//				{
	//					copyIsArray = false;
	//					clone = src && Object.prototype.toString.call(  src  ) === '[object Array]' ? src : [];
	//
	//				}
	//				else
	//				{
	//					clone = src && typeof src == 'object' ? src : {};
	//				}
	//				// Never move original objects, clone them
	//				target[name] = extend( clone, copy );
	//
	//				// Don't bring in undefined values
	//			}
	//			else if( typeof copy !== 'undefined' )
	//			{
	//				target[name] = copy;
	//			}
	//		}
	//	}
	//	return target;
	//}

    // Make available to window
	exports.GameController = {

		// Default options,
		options: {
			left: {
				type: 'dpad',
				position: { left: '13%', bottom: '22%' },
				dpad: {
					up: {
						width: '7%',
						height: '15%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 38 );
							GameController.simulateKeyEvent( 'down', 38 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 38 );
						}
					},
					left: {
						width: '15%',
						height: '7%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 37 );
							GameController.simulateKeyEvent( 'down', 37 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 37 );
						}
					},
					down: {
						width: '7%',
						height: '15%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 40 );
							GameController.simulateKeyEvent( 'down', 40 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 40 );
						}
					},
					right: {
						width: '15%',
						height: '7%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 39 );
							GameController.simulateKeyEvent( 'down', 39 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 39 );
						}
					}
				},
				joystick: {
					radius: 60,
					touchMove: function( e ) {
						console.log( e );
					}
				}
			},
			right: {
				type: 'buttons',
				position: { right: '17%', bottom: '28%' },
				buttons: [
					{ offset: { x: '-13%', y: 0 }, label: 'X', radius: '7%', stroke: 2, backgroundColor: 'blue', fontColor: '#fff', touchStart: function() {
						// Blue is currently mapped to up button
						GameController.simulateKeyEvent( 'press', 88 ); // x key
						GameController.simulateKeyEvent( 'down', 88 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 88 );
					} },
					{ offset: { x: 0, y: '-11%' }, label: 'Y', radius: '7%', stroke: 2, backgroundColor: 'yellow', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 70 ); // f key
						GameController.simulateKeyEvent( 'down', 70 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 70 );
					}  },
					{ offset: { x: '13%', y: 0 }, label: 'B', radius: '7%', stroke: 2, backgroundColor: 'red', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 90 ); // z key
						GameController.simulateKeyEvent( 'down', 90 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 90 );
					} },
					{ offset: { x: 0, y: '11%' }, label: 'A', radius: '7%', stroke: 2, backgroundColor: 'green', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 67 ); // a key
						GameController.simulateKeyEvent( 'down', 67 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 67 );
					}  }
				],
				dpad: {
					up: {
						width: '7%',
						height: '15%',
						stroke: 2
					},
					left: {
						width: '15%',
						height: '7%',
						stroke: 2
					},
					down: {
						width: '7%',
						height: '15%',
						stroke: 2
					},
					right: {
						width: '15%',
						height: '7%',
						stroke: 2
					}
				},
				joystick: {
					radius: 60,
					touchMove: function( e ) {
						console.log( e );
					}
				}
			},
			touchRadius: 45
		},

		// Areas (objects) on the screen that can be touched
		touchableAreas: [],
		touchableAreasCount: 0,

		// Multi-touch
		touches: [],

		// Canvas offset on page (for coverting touch coordinates)
		offsetX: 0,
		offsetY: 0,

		// Bounding box - used for clearRect - first we determine which areas of the canvas are actually drawn to
		bound: {
			left: false,
			right: false,
			top: false,
			bottom: false
		},

		// Heavy sprites (with gradients) are cached as a canvas to improve performance
		cachedSprites: {},

		paused: false,
		game: null, // Phaser.io game object
		//init: function( game, options ) {
        //
		//	// Don't do anything if there's no touch support
         //   if (!('ontouchstart' in document.documentElement)) return;
         //   this.game = game;
        //
		//	// Merge default options and specified options
		//	options = options || {};
		//	extend( this.options, options );
        //
		//	var userAgent = navigator.userAgent.toLowerCase();
		//	// See if we should run the performanceFriendly version (for slower CPUs)
		//	this.performanceFriendly = ( userAgent.indexOf( 'iphone' ) !== -1 || userAgent.indexOf( 'android' ) !== -1 || this.options.forcePerformanceFriendly );
        //
		//	// Create a canvas that goes directly on top of the game canvas
		//	this.createOverlayCanvas();
		//},
        init: function(game, options) {
            var userAgent;
            if (!('ontouchstart' in document.documentElement)) {
                return;
            }
            this.game = game;
            options = options || {};
            extend(this.options, options);
            userAgent = navigator.userAgent.toLowerCase();
            this.performanceFriendly = userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('android') !== -1 || this.options.forcePerformanceFriendly;
            this.createOverlayCanvas();
        },

        /*
         Finds the actual 4 corners of canvas that are being used (so we don't have to clear the entire canvas each render)
         Called when each new touchableArea is added in
         @param {object} options - x, y, width, height
         */
        boundingSet: function(options) {
            var bottom, directions, height, left, radius, right, top, width;
            directions = ['left', 'right'];
            if (options.width) {
                width = this.getPixels(options.width);
                height = this.getPixels(options.height);
                left = this.getPixels(options.x);
                top = this.getPixels(options.y);
            } else {
                if (this.options.touchRadius) {
                    radius = this.getPixels(options.radius) * 2 + (this.getPixels(this.options.touchRadius) / 2);
                } else {
                    radius = options.radius;
                }
                width = height = (radius + this.getPixels(options.stroke)) * 2;
                left = this.getPixels(options.x) - (width / 2);
                top = this.getPixels(options.y) - (height / 2);
            }
            right = left + width;
            bottom = top + height;
            if (this.bound.left === false || left < this.bound.left) {
                this.bound.left = left;
            }
            if (this.bound.right === false || right > this.bound.right) {
                this.bound.right = right;
            }
            if (this.bound.top === false || top < this.bound.top) {
                this.bound.top = top;
            }
            if (this.bound.bottom === false || bottom > this.bound.bottom) {
                this.bound.bottom = bottom;
            }
        },

        //
        ///**
		// * Finds the actual 4 corners of canvas that are being used (so we don't have to clear the entire canvas each render)
		// * Called when each new touchableArea is added in
		// * @param {object} options - x, y, width, height
		// */
		//boundingSet: function( options ) {
		//	var directions = ['left', 'right'];
        //
		//	// Square - pivot is top left
		//	if( options.width )
		//	{
		//		var width = this.getPixels( options.width );
		//		var height = this.getPixels( options.height );
		//		var left = this.getPixels( options.x );
		//		var top = this.getPixels( options.y );
		//	}
		//	// Circle - pivot is center
		//	else
		//	{
		//		if( this.options.touchRadius )
		//			var radius = this.getPixels( options.radius ) * 2 + ( this.getPixels( this.options.touchRadius ) / 2 ); // size of the box the joystick can go to
		//		else
		//			var radius = options.radius;
		//		var width = height = ( radius + this.getPixels( options.stroke ) ) * 2;
		//		var left = this.getPixels( options.x ) - ( width / 2 );
		//		var top = this.getPixels( options.y ) - ( height / 2 );
		//	}
		//	var right = left + width;
		//	var bottom = top + height;
        //
		//	if( this.bound.left === false || left < this.bound.left )
		//		this.bound.left = left;
		//	if( this.bound.right === false || right > this.bound.right )
		//		this.bound.right = right;
		//	if( this.bound.top === false || top < this.bound.top )
		//		this.bound.top = top;
		//	if( this.bound.bottom === false || bottom > this.bound.bottom )
		//		this.bound.bottom = bottom;
		//},

        /*
         Creates the game controls
         */
        createOverlayCanvas: function() {
            var _this;
            _this = this;
            window.addEventListener('resize', function() {
                setTimeout((function() {
                    GameController.resize.call(_this);
                }), 1);
            });
            this.setTouchEvents();
            this.loadSide('left');
            this.loadSide('right');
            this.render();
            if (!this.touches || this.touches.length === 0) {
                this.paused = true;
            }
        },
        pixelRatio: 1,
        resize: function(firstTime) {},
        //
        ////
		///**
		// * Creates the game controls
		// */
		//createOverlayCanvas: function() {
        //
		//	var _this = this;
		//	window.addEventListener( 'resize', function() {
		//		// Wait for any other events to finish
		//		setTimeout( function() { GameController.resize.call( _this ); }, 1 );
		//	} );
        //
		//	// Set the touch events for this new canvas
		//	this.setTouchEvents();
        //
		//	// Load in the initial UI elements
		//	this.loadSide( 'left' );
		//	this.loadSide( 'right' );
        //
		//	// Starts up the rendering / drawing
		//	this.render();
        //
		//	if( ! this.touches || this.touches.length == 0 )
		//		this.paused = true; // pause until a touch event
		//},
        //
		//pixelRatio: 1,
		//resize: function( firstTime ) {
		//},

        /*
         Returns the scaled pixels. Given the value passed
         @param {int/string} value - either an integer for # of pixels, or 'x%' for relative
         @param {char} axis - x, y
         */
        getPixels: function(value, axis) {
            if (typeof value === 'undefined') {
                return 0;
            } else if (typeof value === 'number') {
                return value;
            } else {
                if (axis === 'x') {
                    return (parseInt(value) / 100) * this.game.width;
                } else {
                    return (parseInt(value) / 100) * this.game.height;
                }
            }
        },

        ///**
		// * Returns the scaled pixels. Given the value passed
		// * @param {int/string} value - either an integer for # of pixels, or 'x%' for relative
		// * @param {char} axis - x, y
		// */
		//getPixels: function( value, axis )
		//{
		//	if( typeof value === 'undefined' )
		//		return 0
		//	else if( typeof value === 'number' )
		//		return value;
		//	else // a percentage
		//	{
		//		if( axis == 'x' )
		//			return ( parseInt( value ) / 100 ) * this.game.width;
		//		else
		//			return ( parseInt( value ) / 100 ) * this.game.height;
		//	}
		//},

		///**
		// * Simulates a key press
		// * @param {string} eventName - 'down', 'up'
		// * @param {char} character
		// */
		//simulateKeyEvent: function( eventName, keyCode ) {
		//	if( typeof window.onkeydown === 'undefined' ) // No keyboard, can't simulate...
		//		return false;
        //
		//	/* If they have jQuery, use it because it works better for mobile safari */
		//	if( typeof jQuery !== 'undefined' )
		//	{
		//		var press = jQuery.Event( 'key' + eventName );
		//		press.ctrlKey = false;
		//		press.which = keyCode;
		//		press.keyCode = keyCode;
		//		// Keypress on just the canvas instead of the document
		//		$( this.options.canvas ).trigger( press );
		//		return;
		//	}
        //
		//	var oEvent = document.createEvent( 'KeyboardEvent' );
        //
		//	// Chromium Hack
		//	if( navigator.userAgent.toLowerCase().indexOf( 'chrome' ) !== -1 )
		//	{
		//		Object.defineProperty( oEvent, 'keyCode', {
		//			get : function() {
		//				return this.keyCodeVal;
		//			}
		//		} );
		//		Object.defineProperty( oEvent, 'which', {
		//			get : function() {
		//				return this.keyCodeVal;
		//			}
		//		} );
		//	}
        //
		//	if( oEvent.initKeyboardEvent )
		//	{
		//		oEvent.initKeyboardEvent( 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode );
		//	}
		//	else
		//	{
		//		oEvent.initKeyEvent( 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode );
		//	}
        //
		//	oEvent.keyCodeVal = keyCode;
        //
		//},
        //
		//setTouchEvents: function() {
		//},

        /*
         Simulates a key press
         @param {string} eventName - 'down', 'up'
         @param {char} character
         */
        simulateKeyEvent: function(eventName, keyCode) {
            var oEvent, press;
            if (typeof window.onkeydown === 'undefined') {
                return false;
            }
            if (typeof jQuery !== 'undefined') {
                press = jQuery.Event('key' + eventName);
                press.ctrlKey = false;
                press.which = keyCode;
                press.keyCode = keyCode;
                $(this.options.canvas).trigger(press);
                return;
            }
            oEvent = document.createEvent('KeyboardEvent');
            if (navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
                Object.defineProperty(oEvent, 'keyCode', {
                    get: function() {
                        return this.keyCodeVal;
                    }
                });
                Object.defineProperty(oEvent, 'which', {
                    get: function() {
                        return this.keyCodeVal;
                    }
                });
            }
            if (oEvent.initKeyboardEvent) {
                oEvent.initKeyboardEvent('key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode);
            } else {
                oEvent.initKeyEvent('key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode);
            }
            oEvent.keyCodeVal = keyCode;
        },
        setTouchEvents: function() {},

        ///**
		// * Adds the area to a list of touchable areas, draws
		// * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		// */
		//addTouchableDirection: function( options ) {
        //
		//	var direction = new TouchableDirection( options );
        //
		//	direction.id = this.touchableAreas.push( direction );
		//	this.touchableAreasCount++;
        //
		//	this.boundingSet( options );
		//},

        /*
         Adds the area to a list of touchable areas, draws
         @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
         */
        addTouchableDirection: function(options) {
            var direction;
            direction = new TouchableDirection(options);
            direction.id = this.touchableAreas.push(direction);
            this.touchableAreasCount++;
            this.boundingSet(options);
        },

        ///**
		// * Adds the circular area to a list of touchable areas, draws
		// * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		// */
		//addJoystick: function( options ) { //x, y, radius, backgroundColor, touchStart, touchEnd ) {
        //
		//	var joystick = new TouchableJoystick( options );
        //
		//	joystick.id = this.touchableAreas.push( joystick );
		//	this.touchableAreasCount++;
        //
		//	this.boundingSet( options );
		//},

        /*
         Adds the circular area to a list of touchable areas, draws
         @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
         */
        addJoystick: function(options) {
            var joystick;
            joystick = new TouchableJoystick(options);
            joystick.id = this.touchableAreas.push(joystick);
            this.touchableAreasCount++;
            this.boundingSet(options);
        },

        ///**
		// * Adds the circular area to a list of touchable areas, draws
		// * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		// */
		//addButton: function( options ) { //x, y, radius, backgroundColor, touchStart, touchEnd ) {
        //
		//	var button = new TouchableButton( options );
        //
		//	button.id = this.touchableAreas.push( button );
		//	this.touchableAreasCount++;
        //
		//	this.boundingSet( options );
		//},
        /*
         Adds the circular area to a list of touchable areas, draws
         @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
         */
        addButton: function(options) {
            var button;
            button = new TouchableButton(options);
            button.id = this.touchableAreas.push(button);
            this.touchableAreasCount++;
            this.boundingSet(options);
        },

		//addTouchableArea: function( check, callback ) {
		//},
        //
        loadButtons: function( side ) {

            var buttons, i, j, posX, posY, _this;

			//buttons = this.options[ side ].buttons;
            buttons = this.options[side].buttons;

			//_this = this;
			_this = this;

			//for( i = 0, j = buttons.length; i < j; i++ ) {
            i = 0;
            j = buttons.length;
            while (i < j) {
			//{
				if( typeof buttons[i] === 'undefined' || typeof buttons[i].offset === 'undefined' ) {

                } else {

                    posX = this.getPositionX(side);
                    posY = this.getPositionY(side);

                    buttons[i].x = posX + this.getPixels(buttons[i].offset.x, 'y');
                    buttons[i].y = posY + this.getPixels(buttons[i].offset.y, 'y');

                    this.addButton(buttons[i]);
                }
                i++;
			}
        },

        addTouchableArea: function(check, callback) {},

        //loadButtons: function(side) {
        //    var buttons, i, j, posX, posY, _this;
        //    buttons = this.options[side].buttons;
        //    _this = this;
        //    i = 0;
        //    j = buttons.length;
        //    while (i < j) {
        //        if (typeof buttons[i] === 'undefined' || typeof buttons[i].offset === 'undefined') {
        //            continue;
        //        }
        //        posX = this.getPositionX(side);
        //        posY = this.getPositionY(side);
        //        buttons[i].x = posX + this.getPixels(buttons[i].offset.x, 'y');
        //        buttons[i].y = posY + this.getPixels(buttons[i].offset.y, 'y');
        //        this.addButton(buttons[i]);
        //        i++;
        //    }
        //},

    //
	//	loadDPad: function( side ) {
	//		var dpad = this.options[ side ].dpad || {};
    //
	//		// Centered value is at this.options[ side ].position
    //
	//		var _this = this;
    //
	//		var posX = this.getPositionX( side );
	//		var posY = this.getPositionY( side );
    //
    //
	//		// If they have all 4 directions, add a circle to the center for looks
	//		if( dpad.up && dpad.left && dpad.down && dpad.right )
	//		{
	//			var options = {
	//				x: posX,
	//				y: posY,
	//				radius: dpad.right.height
	//			};
	//			var center = new TouchableCircle( options );
	//			this.touchableAreas.push( center );
	//			this.touchableAreasCount++;
	//		}
    //
	//		// Up arrow
	//		if( dpad.up !== false )
	//		{
	//			dpad.up.x = posX - this.getPixels( dpad.up.width, 'y' ) / 2;
	//			dpad.up.y = posY - ( this.getPixels( dpad.up.height, 'y' ) +  this.getPixels( dpad.left.height, 'y' ) / 2 );
	//			dpad.up.direction = 'up';
	//			this.addTouchableDirection( dpad.up );
	//		}
    //
	//		// Left arrow
	//		if( dpad.left !== false )
	//		{
	//			dpad.left.x = posX - ( this.getPixels( dpad.left.width, 'y' ) + this.getPixels( dpad.up.width, 'y' ) / 2 );
	//			dpad.left.y = posY - ( this.getPixels( dpad.left.height, 'y' ) / 2 );
	//			dpad.left.direction = 'left';
	//			this.addTouchableDirection( dpad.left );
	//		}
    //
	//		// Down arrow
	//		if( dpad.down !== false )
	//		{
	//			dpad.down.x = posX - this.getPixels( dpad.down.width, 'y' ) / 2;
	//			dpad.down.y = posY + ( this.getPixels( dpad.left.height, 'y' ) / 2 );
	//			dpad.down.direction = 'down';
	//			this.addTouchableDirection( dpad.down );
	//		}
    //
	//		// Right arrow
	//		if( dpad.right !== false )
	//		{
	//			dpad.right.x = posX + ( this.getPixels( dpad.up.width, 'y' ) / 2 );
	//			dpad.right.y = posY - this.getPixels( dpad.right.height, 'y' ) / 2;
	//			dpad.right.direction = 'right';
	//			this.addTouchableDirection( dpad.right );
	//		}
    //
	//	},
    //
	//	loadJoystick: function( side ) {
	//		var joystick = this.options[ side ].joystick;
	//		joystick.x = this.getPositionX( side );
	//		joystick.y = this.getPositionY( side );
    //
	//		this.addJoystick( joystick );
	//	},
    //
	//	/**
	//	 * Used for resizing. Currently is just an alias for loadSide
	//	 */
	//	reloadSide: function( side ) {
	//		// Load in new ones
	//		this.loadSide( side );
	//	},
    //
	//	loadSide: function( side ) {
	//		if( this.options[ side ].type === 'dpad' )
	//		{
	//			this.loadDPad( side );
	//		}
	//		else if( this.options[ side ].type === 'joystick' )
	//		{
	//			this.loadJoystick( side );
	//		}
	//		else if( this.options[ side ].type === 'buttons' )
	//		{
	//			this.loadButtons( side );
	//		}
	//	},
    //
	//	/**
	//	 * Normalize touch positions by the left and top offsets
	//	 * @param {int} x
	//	 */
	//	normalizeTouchPositionX: function( x )
	//	{
	//		return ( x - this.offsetX ) * ( this.pixelRatio );
	//	},
    //
	//	/**
	//	 * Normalize touch positions by the left and top offsets
	//	 * @param {int} y
	//	 */
	//	normalizeTouchPositionY: function( y )
	//	{
	//		return ( y - this.offsetY ) * ( this.pixelRatio );
	//	},
    //
	//	/**
	//	 * Returns the x position when given # of pixels from right (based on canvas size)
	//	 * @param {int} right
	//	 */
	//	getXFromRight: function( right ) {
	//		return this.game.width - right;
	//	},
    //
    //
	//	/**
	//	 * Returns the y position when given # of pixels from bottom (based on canvas size)
	//	 * @param {int} right
	//	 */
	//	getYFromBottom: function( bottom ) {
	//		return this.game.height - bottom;
	//	},
    //
	//	/**
	//	 * Grabs the x position of either the left or right side/controls
	//	 * @param {string} side - 'left', 'right'
	//	 */
	//	getPositionX: function( side ) {
	//		if( typeof this.options[ side ].position.left !== 'undefined' )
	//			return this.getPixels( this.options[ side ].position.left, 'x' );
	//		else
	//			return this.getXFromRight( this.getPixels( this.options[ side ].position.right, 'x' ) );
	//	},
    //
	//	/**
	//	 * Grabs the y position of either the left or right side/controls
	//	 * @param {string} side - 'left', 'right'
	//	 */
	//	getPositionY: function( side ) {
	//		if( typeof this.options[ side ].position.top !== 'undefined' )
	//			return this.getPixels( this.options[ side ].position.top, 'y' );
	//		else
	//			return this.getYFromBottom( this.getPixels( this.options[ side ].position.bottom, 'y' ) );
	//	},
    //
	//	/**
	//	 * Processes the info for each touchableArea
	//	 */
	//	renderAreas: function() {
	//		for( var i = 0, j = this.touchableAreasCount; i < j; i++ )
	//		{
	//			var area = this.touchableAreas[ i ];
    //
	//			if( typeof area === 'undefined' )
	//				continue;
    //
	//			area.draw();
    //
	//			// Go through all touches to see if any hit this area
	//			var touched = false;
	//			for( var k = 0, l = this.touches.length; k < l; k++ )
	//			{
	//				var touch = this.touches[ k ];
	//				if( typeof touch === 'undefined' )
	//					continue;
    //
	//				var x = this.normalizeTouchPositionX( touch.clientX ), y = this.normalizeTouchPositionY( touch.clientY );
    //
	//				// Check that it's in the bounding box/circle
	//				if( ( area.check( x, y ) ) !== false )
	//				{
	//					if( !touched )
	//						touched = this.touches[ k ];
	//				}
	//			}
    //
	//			if( touched )
	//			{
	//				if( !area.active )
	//					area.touchStartWrapper( touched );
	//				area.touchMoveWrapper( touched );
	//			}
	//			else if( area.active )
	//			{
	//				area.touchEndWrapper( touched );
	//			}
	//		}
	//	},
    //
	//	render: function() {
	//		// Render if the game isn't paused, or we're not in performanceFriendly mode (running when not paused keeps the semi-transparent gradients looking better for some reason)
	//		if( ! this.paused || ! this.performanceFriendly )
	//		{
	//			// Process all the info for each touchable area
	//			this.renderAreas();
	//		}
    //
     //       this.ready = true;
	//		//window.requestAnimationFrame( this.renderWrapper );
	//	},
	//	/**
	//	 * So we can keep scope, and don't have to create a new obj every requestAnimationFrame (bad for garbage collection)
	//	 */
	//	renderWrapper: function() {
	//		GameController.render();
	//	},
	//};
        loadDPad: function(side) {
            var center, dpad, options, posX, posY, _this;
            dpad = this.options[side].dpad || {};
            _this = this;
            posX = this.getPositionX(side);
            posY = this.getPositionY(side);
            if (dpad.up && dpad.left && dpad.down && dpad.right) {
                options = {
                    x: posX,
                    y: posY,
                    radius: dpad.right.height
                };
                center = new TouchableCircle(options);
                this.touchableAreas.push(center);
                this.touchableAreasCount++;
            }
            if (dpad.up !== false) {
                dpad.up.x = posX - this.getPixels(dpad.up.width, 'y') / 2;
                dpad.up.y = posY - (this.getPixels(dpad.up.height, 'y') + this.getPixels(dpad.left.height, 'y') / 2);
                dpad.up.direction = 'up';
                this.addTouchableDirection(dpad.up);
            }
            if (dpad.left !== false) {
                dpad.left.x = posX - (this.getPixels(dpad.left.width, 'y') + this.getPixels(dpad.up.width, 'y') / 2);
                dpad.left.y = posY - (this.getPixels(dpad.left.height, 'y') / 2);
                dpad.left.direction = 'left';
                this.addTouchableDirection(dpad.left);
            }
            if (dpad.down !== false) {
                dpad.down.x = posX - this.getPixels(dpad.down.width, 'y') / 2;
                dpad.down.y = posY + (this.getPixels(dpad.left.height, 'y') / 2);
                dpad.down.direction = 'down';
                this.addTouchableDirection(dpad.down);
            }
            if (dpad.right !== false) {
                dpad.right.x = posX + (this.getPixels(dpad.up.width, 'y') / 2);
                dpad.right.y = posY - this.getPixels(dpad.right.height, 'y') / 2;
                dpad.right.direction = 'right';
                this.addTouchableDirection(dpad.right);
            }
        },
        loadJoystick: function(side) {
            var joystick;
            joystick = this.options[side].joystick;
            joystick.x = this.getPositionX(side);
            joystick.y = this.getPositionY(side);
            this.addJoystick(joystick);
        },

        /*
         Used for resizing. Currently is just an alias for loadSide
         */
        reloadSide: function(side) {
            this.loadSide(side);
        },
        loadSide: function(side) {
            if (this.options[side].type === 'dpad') {
                this.loadDPad(side);
            } else if (this.options[side].type === 'joystick') {
                this.loadJoystick(side);
            } else {
                if (this.options[side].type === 'buttons') {
                    this.loadButtons(side);
                }
            }
        },

        /*
         Normalize touch positions by the left and top offsets
         @param {int} x
         */
        normalizeTouchPositionX: function(x) {
            return (x - this.offsetX) * this.pixelRatio;
        },

        /*
         Normalize touch positions by the left and top offsets
         @param {int} y
         */
        normalizeTouchPositionY: function(y) {
            return (y - this.offsetY) * this.pixelRatio;
        },

        /*
         Returns the x position when given # of pixels from right (based on canvas size)
         @param {int} right
         */
        getXFromRight: function(right) {
            return this.game.width - right;
        },

        /*
         Returns the y position when given # of pixels from bottom (based on canvas size)
         @param {int} right
         */
        getYFromBottom: function(bottom) {
            return this.game.height - bottom;
        },

        /*
         Grabs the x position of either the left or right side/controls
         @param {string} side - 'left', 'right'
         */
        getPositionX: function(side) {
            if (typeof this.options[side].position.left !== 'undefined') {
                return this.getPixels(this.options[side].position.left, 'x');
            } else {
                return this.getXFromRight(this.getPixels(this.options[side].position.right, 'x'));
            }
        },

        /*
         Grabs the y position of either the left or right side/controls
         @param {string} side - 'left', 'right'
         */
        getPositionY: function(side) {
            if (typeof this.options[side].position.top !== 'undefined') {
                return this.getPixels(this.options[side].position.top, 'y');
            } else {
                return this.getYFromBottom(this.getPixels(this.options[side].position.bottom, 'y'));
            }
        },

        /*
         Processes the info for each touchableArea
         */
        renderAreas: function() {
            var area, i, j, k, l, touch, touched, x, y;
            i = 0;
            j = this.touchableAreasCount;
            while (i < j) {
                area = this.touchableAreas[i];
                if (typeof area === 'undefined') {
                    continue;
                }
                area.draw();
                touched = false;
                k = 0;
                l = this.touches.length;
                while (k < l) {
                    touch = this.touches[k];
                    if (typeof touch === 'undefined') {
                        continue;
                    }
                    x = this.normalizeTouchPositionX(touch.clientX);
                    y = this.normalizeTouchPositionY(touch.clientY);
                    if ((area.check(x, y)) !== false) {
                        if (!touched) {
                            touched = this.touches[k];
                        }
                    }
                    k++;
                }
                if (touched) {
                    if (!area.active) {
                        area.touchStartWrapper(touched);
                    }
                    area.touchMoveWrapper(touched);
                } else {
                    if (area.active) {
                        area.touchEndWrapper(touched);
                    }
                }
                i++;
            }
        },
        render: function() {
            if (!this.paused || !this.performanceFriendly) {
                this.renderAreas();
            }
            this.ready = true;
        },

        /*
         So we can keep scope, and don't have to create a new obj every requestAnimationFrame (bad for garbage collection)
         */
        renderWrapper: function() {
            GameController.render();
        }
    };


    /*
     Superclass for touchable stuff
     */

    TouchableArea = (function() {
        function TouchableArea() {}

        TouchableArea = function() {};

        TouchableArea.prototype.touchStart = null;

        TouchableArea.prototype.touchMove = null;

        TouchableArea.prototype.touchEnd = null;

        TouchableArea.prototype.type = 'area';

        TouchableArea.prototype.id = false;

        TouchableArea.prototype.active = false;


        /*
         Sets the user-specified callback for this direction being touched
         @param {function} callback
         */

        TouchableArea.prototype.setTouchStart = function(callback) {
            this.touchStart = callback;
        };


        /*
         Called when this direction is no longer touched
         */

        TouchableArea.prototype.touchStartWrapper = function(e) {
            if (this.touchStart) {
                this.touchStart();
            }
            this.active = true;
        };


        /*
         Sets the user-specified callback for this direction no longer being touched
         @param {function} callback
         */

        TouchableArea.prototype.setTouchMove = function(callback) {
            this.touchMove = callback;
        };


        /*
         Called when this direction is moved. Make sure it's actually changed before passing to developer
         */

        TouchableArea.prototype.lastPosX = 0;

        TouchableArea.prototype.lastPosY = 0;

        TouchableArea.prototype.touchMoveWrapper = function(e) {
            if (this.touchMove && (e.clientX !== TouchableArea.prototype.lastPosX || e.clientY !== TouchableArea.prototype.lastPosY)) {
                this.touchMove();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
            this.active = true;
        };


        /*
         Sets the user-specified callback for this direction no longer being touched
         @param {function} callback
         */

        TouchableArea.prototype.setTouchEnd = function(callback) {
            this.touchEnd = callback;
        };


        /*
         Called when this direction is first touched
         */

        TouchableArea.prototype.touchEndWrapper = function(e) {
            if (this.touchEnd) {
                this.touchEnd();
            }
            this.active = false;
            GameController.render();
        };

        return TouchableArea;

    })();


    TouchableDirection = (function(_super) {
        __extends(TouchableDirection, _super);

        function TouchableDirection(options) {
            var i;
            for (i in options) {
                if (i === 'x') {
                    this[i] = GameController.getPixels(options[i], 'x');
                } else if (i === 'y' || i === 'height' || i === 'width') {
                    this[i] = GameController.getPixels(options[i], 'y');
                } else {
                    this[i] = options[i];
                }
            }
            this.draw();
        }

        TouchableDirection.prototype.bitmap = null;

        TouchableDirection.prototype.type = 'direction';


        /*
         Checks if the touch is within the bounds of this direction
         */

        TouchableDirection.prototype.check = function(touchX, touchY) {
            var distanceX, distanceY;
            distanceX = void 0;
            distanceY = void 0;
            if ((Math.abs(touchX - this.x) < (GameController.options.touchRadius / 2) || (touchX > this.x)) && (Math.abs(touchX - (this.x + this.width)) < (GameController.options.touchRadius / 2) || (touchX < this.x + this.width)) && (Math.abs(touchY - this.y) < (GameController.options.touchRadius / 2) || (touchY > this.y)) && (Math.abs(touchY - (this.y + this.height)) < (GameController.options.touchRadius / 2) || (touchY < this.y + this.height))) {
                return true;
            }
            return false;
        };

        TouchableDirection.prototype.draw = function() {
            var bitmap, cacheId, cached, ctx, gradient, opacity;
            cacheId = this.type + '' + this.id + '' + this.active;
            cached = GameController.cachedSprites[cacheId];
            gradient = null;
            if (!cached) {
                bitmap = GameController.game.add.bitmapData(this.width + 2 * this.stroke, this.height + 2 * this.stroke);
                ctx = bitmap.context;
                opacity = this.opacity || 0.9;
                if (!this.active) {
                    opacity *= 0.5;
                }
                switch (this.direction) {
                    case 'up':
                        gradient = ctx.createLinearGradient(0, 0, 0, this.height);
                        gradient.addColorStop(0, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )');
                        gradient.addColorStop(1, 'rgba( 0, 0, 0, ' + opacity + ' )');
                        break;
                    case 'left':
                        gradient = ctx.createLinearGradient(0, 0, this.width, 0);
                        gradient.addColorStop(0, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )');
                        gradient.addColorStop(1, 'rgba( 0, 0, 0, ' + opacity + ' )');
                        break;
                    case 'right':
                        gradient = ctx.createLinearGradient(0, 0, this.width, 0);
                        gradient.addColorStop(0, 'rgba( 0, 0, 0, ' + opacity + ' )');
                        gradient.addColorStop(1, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )');
                        break;
                    case 'down':
                        break;
                    default:
                        gradient = ctx.createLinearGradient(0, 0, 0, this.height);
                        gradient.addColorStop(0, 'rgba( 0, 0, 0, ' + opacity + ' )');
                        gradient.addColorStop(1, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )');
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.lineWidth = this.stroke;
                ctx.strokeStyle = 'rgba( 255, 255, 255, 0.1 )';
                ctx.strokeRect(0, 0, this.width, this.height);
                cached = GameController.cachedSprites[cacheId] = bitmap;
                GameController.game.add.sprite(this.x, this.y, cached);
            }
        };

        return TouchableDirection;

    })(TouchableArea);

    TouchableButton = (function(_super) {
        __extends(TouchableButton, _super);

        function TouchableButton(options) {
            var i;
            for (i in options) {
                if (i === 'x') {
                    this[i] = GameController.getPixels(options[i], 'x');
                } else if (i === 'x' || i === 'radius') {
                    this[i] = GameController.getPixels(options[i], 'y');
                } else {
                    this[i] = options[i];
                }
            }
            this.draw();
        }

        TouchableButton.prototype.type = 'button';


        /*
         Checks if the touch is within the bounds of this direction
         */

        TouchableButton.prototype.check = function(touchX, touchY) {
            if ((Math.abs(touchX - this.x) < this.radius + (GameController.options.touchRadius / 2)) && (Math.abs(touchY - this.y) < this.radius + (GameController.options.touchRadius / 2))) {
                return true;
            }
            return false;
        };

        TouchableButton.prototype.draw = function() {
            var bitmap, cacheId, cached, ctx, gradient, textShadowColor;
            cacheId = this.type + '' + this.id + '' + this.active;
            cached = GameController.cachedSprites[cacheId];
            if (!cached) {
                bitmap = GameController.game.add.bitmapData(2 * (this.radius + this.stroke), 2 * (this.radius + this.stroke));
                ctx = bitmap.context;
                ctx.lineWidth = this.stroke;
                gradient = ctx.createRadialGradient(this.radius, this.radius, 1, this.radius, this.radius, this.radius);
                textShadowColor = void 0;
                switch (this.backgroundColor) {
                    case 'blue':
                        gradient.addColorStop(0, 'rgba(123, 181, 197, 0.6)');
                        gradient.addColorStop(1, '#105a78');
                        textShadowColor = '#0A4861';
                        break;
                    case 'green':
                        gradient.addColorStop(0, 'rgba(29, 201, 36, 0.6)');
                        gradient.addColorStop(1, '#107814');
                        textShadowColor = '#085C0B';
                        break;
                    case 'red':
                        gradient.addColorStop(0, 'rgba(165, 34, 34, 0.6)');
                        gradient.addColorStop(1, '#520101');
                        textShadowColor = '#330000';
                        break;
                    case 'yellow':
                        gradient.addColorStop(0, 'rgba(219, 217, 59, 0.6)');
                        gradient.addColorStop(1, '#E8E10E');
                        textShadowColor = '#BDB600';
                        break;
                    case 'white':
                        break;
                    default:
                        gradient.addColorStop(0, 'rgba( 255,255,255,.3 )');
                        gradient.addColorStop(1, '#eee');
                }
                if (this.active) {
                    ctx.fillStyle = textShadowColor;
                } else {
                    ctx.fillStyle = gradient;
                }
                ctx.strokeStyle = textShadowColor;
                ctx.beginPath();
                ctx.arc(bitmap.width / 2, bitmap.width / 2, this.radius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
                if (this.label) {
                    ctx.fillStyle = textShadowColor;
                    ctx.font = 'bold ' + (this.fontSize || bitmap.height * 0.35) + 'px Verdana';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.label, bitmap.height / 2 + 2, bitmap.height / 2 + 2);
                    ctx.fillStyle = this.fontColor;
                    ctx.font = 'bold ' + (this.fontSize || bitmap.height * 0.35) + 'px Verdana';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.label, bitmap.height / 2, bitmap.height / 2);
                }
                cached = GameController.cachedSprites[cacheId] = bitmap;
                GameController.game.add.sprite(this.x, this.y, cached);
            }
        };

        return TouchableButton;

    })(TouchableArea);


    TouchableJoystick = (function(_super) {
        __extends(TouchableJoystick, _super);

        function TouchableJoystick(options) {
            var i;
            for (i in options) {
                this[i] = options[i];
            }
            this.currentX = this.currentX || this.x;
            this.currentY = this.currentY || this.y;
            return;
        }

        TouchableJoystick.prototype.type = 'joystick';


        /*
         Checks if the touch is within the bounds of this direction
         */

        TouchableJoystick.prototype.check = function(touchX, touchY) {
            if ((Math.abs(touchX - this.x) < this.radius + (GameController.getPixels(GameController.options.touchRadius) / 2)) && (Math.abs(touchY - this.y) < this.radius + (GameController.getPixels(GameController.options.touchRadius) / 2))) {
                return true;
            }
            return false;
        };


        /*
         details for the joystick move event, stored here so we're not constantly creating new objs for garbage. The object has params:
         dx - the number of pixels the current joystick center is from the base center in x direction
         dy - the number of pixels the current joystick center is from the base center in y direction
         max - the maximum number of pixels dx or dy can be
         normalizedX - a number between -1 and 1 relating to how far left or right the joystick is
         normalizedY - a number between -1 and 1 relating to how far up or down the joystick is
         */

        TouchableJoystick.prototype.moveDetails = {};


        /*
         Called when this joystick is moved
         */

        TouchableJoystick.prototype.touchMoveWrapper = function(e) {
            this.currentX = GameController.normalizeTouchPositionX(e.clientX);
            this.currentY = GameController.normalizeTouchPositionY(e.clientY);
            if (this.touchMove) {
                if (this.moveDetails.dx !== this.currentX - this.x && this.moveDetails.dy !== this.y - this.currentY) {
                    this.moveDetails.dx = this.currentX - this.x;
                    this.moveDetails.dy = this.y - this.currentY;
                    this.moveDetails.max = this.radius + (GameController.options.touchRadius / 2);
                    this.moveDetails.normalizedX = this.moveDetails.dx / this.moveDetails.max;
                    this.moveDetails.normalizedY = this.moveDetails.dy / this.moveDetails.max;
                    this.touchMove(this.moveDetails);
                }
            }
            this.active = true;
        };

        TouchableJoystick.prototype.draw = function() {
            var base, bitmap, cacheId, cached, ctx, gradient, hw;
            if (!this.id) {
                return false;
            }
            cacheId = this.type + '' + this.id + '' + this.active;
            cached = GameController.cachedSprites[cacheId];
            if (!cached) {
                this.stroke = this.stroke || 2;
                hw = 2 * (this.radius + GameController.options.touchRadius + this.stroke);
                bitmap = GameController.game.add.bitmapData(hw, hw);
                ctx = bitmap.context;
                gradient = null;
                ctx.lineWidth = this.stroke;
                if (this.active) {
                    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.radius);
                    gradient.addColorStop(0, 'rgba( 200,200,200,.5 )');
                    gradient.addColorStop(1, 'rgba( 200,200,200,.9 )');
                    ctx.strokeStyle = '#000';
                } else {
                    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.radius);
                    gradient.addColorStop(0, 'rgba( 200,200,200,.2 )');
                    gradient.addColorStop(1, 'rgba( 200,200,200,.4 )');
                    ctx.strokeStyle = 'rgba( 0,0,0,.4 )';
                }
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
                cached = GameController.cachedSprites[cacheId] = bitmap;
                GameController.game.add.sprite(this.currentX - this.radius, this.currentY - this.radius, cached);
            }
            base = GameController.game.add.bitmapData(hw, hw);
            base.context.fillStyle = '#444';
            base.context.beginPath();
            base.context.arc(0, 0, this.radius * 0.7, 0, 2 * Math.PI, false);
            base.context.fill();
            base.context.stroke();
            GameController.game.add.sprite(this.x, this.y, base);
        };

        return TouchableJoystick;

    })(TouchableArea);


    TouchableCircle = (function(_super) {
        __extends(TouchableCircle, _super);

        function TouchableCircle(options) {
            var bitmap, i;
            for (i in options) {
                if (i === 'x') {
                    this[i] = GameController.getPixels(options[i], 'x');
                } else if (i === 'x' || i === 'radius') {
                    this[i] = GameController.getPixels(options[i], 'y');
                } else {
                    this[i] = options[i];
                }
            }
            bitmap = GameController.game.add.bitmapData(this.radius, this.radius);
            bitmap.context.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
            bitmap.context.beginPath();
            bitmap.context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
            bitmap.context.fill();
            this.sprite = GameController.game.add.sprite(this.x, this.y, bitmap);
            this.draw();
            return;
        }


        /*
         No touch for this fella
         */

        TouchableCircle.prototype.check = function(touchX, touchY) {
            return false;
        };

        TouchableCircle.prototype.draw = function() {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        };

        return TouchableCircle;

    })(TouchableArea);



} )(typeof module !== "undefined" ? module.exports : window)