// make game
// width, height, how to render, the html_div containing the game.
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game_div');

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
        game.load.image('1','assets/1.png');
        game.load.image('2','assets/2.png');
        game.load.image('3','assets/3.png');
        game.load.image('4','assets/4.png');
        game.load.image('5','assets/5.png');
        game.load.image('6','assets/6.png');
        game.load.image('7','assets/7.png');
        game.load.image('8','assets/8.png');
        game.load.image('9','assets/9.png');
        game.load.image('10','assets/10.png');
        game.load.image('11','assets/11.png');
        game.load.image('12','assets/12.png');
        game.load.image('13','assets/13.png');
        game.load.image('14','assets/14.png');
        game.load.image('15','assets/15.png');
        game.load.image('16','assets/16.png');
        game.load.image('17','assets/17.png');
        game.load.image('18','assets/18.png');
        game.load.image('19','assets/19.png');
        game.load.image('20','assets/20.png');
        game.load.image('wheel','assets/wheel.png');
    },

    create: function(){
        // create the sprites, the ordering, and the positions
                game.add.sprite(201,250,'wheel');
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
        right_key.onDown.add(cycle_right,this);
        left_key.onDown.add(cycle_left,this);
    },
    update: function(){
    }
}

function create_positions() {
    return [ {x: 200, y:300},
             {x: 232, y:300},
             {x: 264, y:300},
             {x: 296, y:300},
             {x: 328, y:300},
             {x: 360, y:300},
             {x: 392, y:273},
             {x: 392, y:231},
             {x: 360, y:204},
             {x: 328, y:204},
             {x: 296, y:204},
             {x: 264, y:204},
             {x: 232, y:204},
             {x: 200, y:204},
             {x: 168, y:204},
             {x: 136, y:204},
             {x: 104, y:231},
             {x: 104, y:273},
             {x: 136, y:300},
             {x: 168, y:300}
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

function tween_sprites() {
    for (var i = 0; i < 20; i++) {
        game.add.tween(main_state.sprite_numbers[i]).to(
            {x:main_state.positions[i].x, y:main_state.positions[i].y},
            100,Phaser.Easing.Quadratic.None,true);
    }
}

// Add and start the main state
game.state.add('main',main_state);
game.state.start('main');