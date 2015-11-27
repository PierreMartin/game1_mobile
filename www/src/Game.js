/* globals Phaser:false */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
};

var accelerometer = {
    x: null,
    y: null,
    z: null
};
var life = 20;
var lifeText;
var lifeTextWin;

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape.
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

        if ( navigator.accelerometer ) {
            navigator.accelerometer.watchAcceleration(function(acc) {
                accelerometer.x = acc.x;
                accelerometer.y = acc.y;
                accelerometer.z = acc.z;
            }, null, null);
        }




    },


    // this = game


    preload: function () {
        this.load.image('logo', 'asset/phaser.png');

        this.load.image('sky', 'asset/sky.png');
        this.load.image('platform', 'asset/platform.png');
        this.load.image('cloud', 'asset/clouds.png');

        this.load.image('heart', 'asset/heart.png');
        this.load.image('cactus', 'asset/cactus.png');
        this.load.spritesheet('player', 'asset/dude.png', 32, 48);
    },



    create: function () {
        var bottom  = this.world.height;  // on positionne les objets par rapport au bas du device
        var left    = this.world.width;   // on positionne les objets par rapport a la gauche du device


        //this.add.sprite(0, 0, 'sky'); 		//  Le background
        this.game.stage.backgroundColor = '#3baff0';
        //this.add.sprite(this.world.centerX, this.world.centerY, 'heart');

        //  We're going to be using physics, so enable the Arcade Physics system
	    this.physics.startSystem(Phaser.Physics.ARCADE);

	    //////////////////////////////  LES PLATFORMS : //////////////////////////////
	    platforms = this.add.group();
	    platforms.enableBody = true;

        // LE SOL :
	    var ground1 = platforms.create(-200, bottom - 32, 'platform');
	    ground1.body.immovable = true; // obstacle

	    var ground2 = platforms.create(260, bottom - 32, 'platform');
	    ground2.body.immovable = true; // obstacle

	    var ground3 = platforms.create(660, bottom - 32, 'platform');
	    ground3.body.immovable = true; // obstacle
        //ground1.scale.setTo(2, 1);

	    //  LES NUAGES :
	    var cloud1 = platforms.create(360, bottom - 100, 'cloud');
	    cloud1.body.immovable = true; // obstacle

	    var cloud2 = platforms.create(-150, bottom - 160, 'cloud');
	    cloud2.body.immovable = true; // obstacle

	    var cloud3 = platforms.create(150, bottom - 250, 'cloud');
	    cloud3.body.immovable = true; // obstacle



        ////////////////////////////// LE PLAYER : //////////////////////////////
		player = this.add.sprite(32, this.world.height - 150, 'player');

		//  We need to enable physics on the player
		this.physics.arcade.enable(player);

		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y              = 0.2;
		player.body.gravity.y             = 300;
        player.body.speed                 = 1;
		player.body.collideWorldBounds    = true; // obstacle du canvas (pas nesecaire car par la suite les platformes feront obstacle)

		//  Position de l'image du player quand on le déplace :
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);



        ////////////////////////////// LES COEURS : //////////////////////////////
        hearts = this.add.group();
        hearts.enableBody = true;

        //  On creer 12 coeurs :
        for (var i = 0; i < 12; i++) {
            //  Créer une étoile a l'intérieur du groupe étoile (on ne passe PAS par un sprite):
            var heart = hearts.create(i * 70, 0, 'heart');

            heart.body.gravity.y = 40;								  //  Leur gravité
            heart.body.bounce.y  = 0.5 + Math.random() * 0.2;		  // leur rebond en valeur aléatoire
        }


        ////////////////////////////// LES CACTUS : //////////////////////////////
        cactus = this.add.group();
        cactus.enableBody = true;

        var cactu1 = cactus.create(0, bottom-54, 'cactus');

        var cactu2 = cactus.create(170, bottom-54, 'cactus');
        var cactu3 = cactus.create(250, bottom-275, 'cactus');
        var cactu4 = cactus.create(380, bottom-54, 'cactus');

        var cactu5 = cactus.create(480, bottom-124, 'cactus');
        var cactu6 = cactus.create(110, bottom-188, 'cactus');

        cactu1.body.gravity.y = 40;
        cactu2.body.gravity.y = 40;
        cactu3.body.gravity.y = 40;
        cactu4.body.gravity.y = 40;
        cactu5.body.gravity.y = 40;
        cactu6.body.gravity.y = 40;



        ////////////////////////////// NIVEAU DE VIE : //////////////////////////////
		lifeText 		= this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
        lifeText.text   = 'Vie : ' + life;
		lifeTextWin 	= this.add.text(this.world.centerX - 80, this.world.centerY, '', { fontSize: '40px', fill: '#fff' });
    },



    update: function() {

        //  permettre au joueur + hearts + cactus d'entrer en collision avec les obstacle :
	    this.physics.arcade.collide(player, platforms);
	    this.physics.arcade.collide(hearts, platforms);
	    this.physics.arcade.collide(cactus, platforms);



        ////////////////////////////// DEPLACEMENT DU JOUEUR : //////////////////////////////
        //function onSuccess(acceleration) { console.log('Acceleration Y: ' + acceleration.y + '\n'); }
        //navigator.accelerometer.getCurrentAcceleration(onSuccess);


        player.body.velocity.x = 0; //  Initialise la vitesse du joueur (stop)

        // GESTION DEPLACEMENT DROITE GAUCHE :
        function moveDude(acceleration) {
            // player.body.velocity.x += acceleration.y * 40; // comme on est en landscape, c'est y

            if ( acceleration.y < -1 ) {
                player.body.velocity.x = -350;
                player.animations.play('left');
            } else if ( acceleration.y > 1 ) {
                player.body.velocity.x = 350;
                player.animations.play('right');
            } else {
                player.animations.stop();
                player.frame = 4;
            }
        }
        navigator.accelerometer.getCurrentAcceleration(moveDude);

        // GESTION DEPLACEMENT SAUT :
        $('body').bind('touchstart', function(e) {
            e.preventDefault();
            if ( player.body.touching.down ) {
    			player.body.velocity.y = -260;
    		}
        });



        ////////////////////////////// Si on touche des coeurs //////////////////////////////
		function touchHeart (player, heart) {
		    heart.kill();

			// on ajouter de la vie :
			life += 10;
		    lifeText.text = 'vie : ' + life;
		}
		this.physics.arcade.overlap(player, hearts, touchHeart, null, this);


        ////////////////////////////// Si on touche des cactus //////////////////////////////
		function touchCactus (player, cactu) {
		    cactu.kill();

			// on supprime de la vie :
			life -= 10;
		    lifeText.text = 'vie : ' + life;

		}
		this.physics.arcade.overlap(player, cactus, touchCactus, null, this);


        ////////////////////////////// GAGNER / PERDU //////////////////////////////
        if ( life >= 60 ) { // TODO: il faudrais changer ici et metre si tous les coeurs ont été touché...
            lifeTextWin.text = 'Gagné !!';
            player.kill();
        } else if ( life <= 0 || player.body.y > 305 ) {
            lifeTextWin.text = 'PERDU !';
            player.kill();
            lifeText.text = 'vie : 0';
            //restart();
        }
    },

   //  restart: function() {
   //     // These are just examples of what you might do
   //     player.resetPosition(); // Reset the players position
   //     score = 0;   // Reset the score to zero
   //     addMoreEnemies();  // Add more enemies to your game
   // },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the
        // game resizes. A resize could happen if for example swapping
        // orientation on a device or resizing the browser window. Note that
        // this callback is only really useful if you use a ScaleMode of RESIZE
        // and place it inside your main game state.

    }

};