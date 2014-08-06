// make game
// width, height, how to render, the html_div containing the game.
var game = new Phaser.Game(450, 300, Phaser.CANVAS, 'game_div');


/*
  The game has a single state.
  In it, we keep track of the ordering of the sprites
  simultaneously with an extra array.
  Additionally, we have an array of positions that each element
  should be at when moving linearly through the order
*/
var main_state = {

    preload: function(){
        // load the images
        for (var i = 1; i <= 20; i++) {
            game.load.image(i.toString(),'assets/'+i.toString()+'.png');
        }
        game.load.image('wheel','assets/wheel.png');
        game.load.image('button_arrow_left','assets/button_arrow_left.png');
        game.load.image('button_arrow_right','assets/button_arrow_right.png');
        game.load.image('button_arrow_rotate','assets/button_arrow_rotate.png');
        game.load.image('button_shuffle','assets/button_shuffle.png');
        game.load.image('button_reset','assets/button_reset.png');
        game.load.image('button_fullscreen','assets/button_fullscreen.png');
    },

    create: function(){        
        // create the wheel and buttons
        game.add.sprite(201,65,'wheel');
        button_arrow_left = game.add.sprite(151,210,'button_arrow_left');
        button_arrow_rotate = game.add.sprite(231,210,'button_arrow_rotate');
        button_arrow_right = game.add.sprite(311,210,'button_arrow_right');
        button_shuffle = game.add.sprite(10,10,'button_shuffle');
        button_reset = game.add.sprite(10,84,'button_reset');
        //button_fullscreen = game.add.sprite(300,10,'button_fullscreen');

        // map buttons to functions
        button_arrow_left.inputEnabled = true;
        button_arrow_right.inputEnabled = true;
        button_arrow_rotate.inputEnabled = true;
        button_shuffle.inputEnabled = true;
        button_reset.inputEnabled = true;
        //button_fullscreen.inputEnabled = true;

        button_arrow_left.events.onInputDown.add(cycle_left,this);
        button_arrow_right.events.onInputDown.add(cycle_right,this);
        button_arrow_rotate.events.onInputDown.add(rotate,this);
        button_shuffle.events.onInputDown.add(shuffle,this);
        button_reset.events.onInputDown.add(reset,this);
        //button_fullscreen.events.onInputDown.add(gofull,this);

        // create the number sprites, the ordering, and the positions
        this.current_order = [1,2,3,4,5,6,7,8,9,10,
                              11,12,13,14,15,16,17,18,19,20];
        this.positions = create_positions();
        this.sprite_numbers = [];
        for (var i = 1; i <= 20; i++) {
            this.sprite_numbers.push(game.add.sprite(0,0,i.toString()) );
        }

        position_sprites();

        // keyboard buttons
        var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        var space_key=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var s_key = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var r_key = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

        right_key.onDown.add(cycle_right,this);
        left_key.onDown.add(cycle_left,this);
        space_key.onDown.add(rotate,this);
        s_key.onDown.add(shuffle,this);
        r_key.onDown.add(reset,this);

        // scaling
        if (game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            //game.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize(true);
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            // game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // game.scale.minWidth = 666;
            // game.scale.minHeight = 400;
            // game.scale.maxWidth = 2048;
            // game.scale.maxHeight = 1536;
            // game.scale.forceLandscape = true;
            // game.scale.pageAlignHorizontally = true;
            // game.scale.setScreenSize(true);
            // game.scale.refresh();
        }
    },
    update: function(){
    }
}

function swap(lst,i,j) {
    var temp = lst[i];
    lst[i] = lst[j];
    lst[j] = temp;
}

// random integer in range [min,max)
function getRandInt(min,max) {
    return (Math.floor(Math.random() * (max-min)) + min);
}

function create_positions() {
    return [
        {x: 200, y:115},
        {x: 232, y:115},
        {x: 264, y:115},
        {x: 296, y:115},
        {x: 328, y:115},
        {x: 360, y:115},
        {x: 392, y:88},
        {x: 392, y:46},
        {x: 360, y:19},
        {x: 328, y:19},
        {x: 296, y:19},
        {x: 264, y:19},
        {x: 232, y:19},
        {x: 200, y:19},
        {x: 168, y:19},
        {x: 136, y:19},
        {x: 104, y:46},
        {x: 104, y:88},
        {x: 136, y:115},
        {x: 168, y:115}
    ];
}

function position_sprites() {
    for (var i = 0; i < 20; i++) {
        main_state.sprite_numbers[i].x = main_state.positions[i].x;
        main_state.sprite_numbers[i].y = main_state.positions[i].y;
    }
}

/*
   Calling main_state.sprite_numbers.some(game.tweens.isTweening) doesn't work,
   but then magically if I make a trivial function it does?
   What bullshit.
*/
function is_tweening_fix(x){
    return game.tweens.isTweening(x);
}

function cycle_right() {
    if (! (main_state.sprite_numbers).some(is_tweening_fix) ) {
        var temp_pos = main_state.current_order[19];
        var temp_sprite = main_state.sprite_numbers[19];
        for (var i = 19; i > 0; i--) {
            main_state.current_order[i] = main_state.current_order[i-1];
            main_state.sprite_numbers[i] = main_state.sprite_numbers[i-1];
        }
        main_state.current_order[0] = temp_pos;
        main_state.sprite_numbers[0] = temp_sprite;
        tween_sprites();
    }
}

function cycle_left() {
    if (! main_state.sprite_numbers.some(is_tweening_fix) ) {
        var temp_pos = main_state.current_order[0];
        var temp_sprite = main_state.sprite_numbers[0];
        for (var i = 0; i < 19; i++) {
            main_state.current_order[i] = main_state.current_order[i+1];
            main_state.sprite_numbers[i] = main_state.sprite_numbers[i+1];
        }
        main_state.current_order[19] = temp_pos;
        main_state.sprite_numbers[19] = temp_sprite;
        tween_sprites();
    }
}

// currently doesn't actually rotate them, just tweens to the right place
function rotate() {
    if (! main_state.sprite_numbers.some(is_tweening_fix) ) {
        swap(main_state.current_order,0,3);
        swap(main_state.current_order,1,2);
        swap(main_state.sprite_numbers,0,3);
        swap(main_state.sprite_numbers,1,2);
        tween_sprites();
    }
}

function shuffle() {
    if (! main_state.sprite_numbers.some(is_tweening_fix) ) {
        for (var i = 20; i > 0; i--) {
            var m = getRandInt(0,i);
            swap(main_state.current_order,i-1,m);
            swap(main_state.sprite_numbers,i-1,m);
        }
        tween_sprites();
    }
}

function reset() {
    if (! main_state.sprite_numbers.some(is_tweening_fix) ) {
        // just do a swapsort, n is 20 so who cares.
        for (var i = 0; i < 20; i++) {
            for (var j = i; j < 20; j++) {
                if (main_state.current_order[j] === i+1) {
                    swap(main_state.current_order,i,j);
                    swap(main_state.sprite_numbers,i,j);
                    break;
                }
            }
        }
        tween_sprites();
    }
}

function tween_sprites() {
    for (var i = 0; i < 20; i++) {
        game.add.tween(main_state.sprite_numbers[i]).to(
            {x:main_state.positions[i].x, y:main_state.positions[i].y},
            100,Phaser.Easing.Quadratic.None,true);
    }
}

// Full-screen function
function gofull() {
    //game.stage.scale.startFullScreen();
}

// Add and start the main state
game.state.add('main',main_state);
game.state.start('main');