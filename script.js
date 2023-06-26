class Main extends Phaser.Scene {
    constructor() {
        super('main')
    }

    SYS_setCursor(types) {
        game.canvas.style.cursor = types;
    }

    SYS_randint(min, max) {
        return Math.random() * (max - min) + min;
    }
      

    spawnM() {
        this.score_int += 1
        let x = this.SYS_randint(150, 500);
        let y = -100;
        let type = ['m1', 'm2', 'm3'][Math.floor(Math.random() * 3)];
        
        this.bd.destroy()

        let choise = this.physics.add.sprite(x, y, 'image:'+type);

        this.bd = this.add.image(0, 0, 'image:border').setOrigin(0, 0);
        

        this.m_group.push(choise);
    }

    updateM(speed) {
        let idx = 0
        for (let m of this.m_group) {
            if (m.y < 1200) {
                m.y += speed
            }
            else {
                m.destroy()
                this.m_group.splice(idx, 1);
            }
            idx += 1;
        }
    }

    slideBackground(speed) {
        if (this.bg1.y == 1560) {
            this.bg1.y = 0
            this.bg2.y = -1560
        }
        else {
            this.bg1.y += speed
            this.bg2.y += speed
        }
    }

    checkShipCollision() {
        for(let m of this.m_group) {
            this.physics.add.collider(m, this.ship, () => {
                if (!this.collide) {
                    this.impactSound.play()
                    m.destroy()
                    this.collide = true;
                }
            })
        }
        
    }

    createBtn() {
        this.btnL = this.physics.add.sprite(150, 1400, 'spritesheet:buttons', 1).setInteractive();
        this.btnR = this.physics.add.sprite(550, 1400, 'spritesheet:buttons', 0).setInteractive();
        
        for (let btn of [this.btnL, this.btnR]){btn.setScale(1.2)}

        let idxBtn = 0;

        this.leftMove = false;
        this.rightMove = false;
        
        for (let btn of [this.btnL, this.btnR]) {
            if (!idxBtn) {
                btn.on('pointerdown', () => {
                    this.leftMove = true;
                    this.rightMove = false;
                })

                btn.on('pointerup', () => {
                    this.leftMove = false;
                })
            }
            else {
                btn.on('pointerdown', () => {
                    this.rightMove = true;
                    this.leftMove = false; 
                })

                btn.on('pointerup', () => {
                    this.rightMove = false;
                })
            }
            idxBtn += 1
        }
    }

    preload() {
        // background
        this.load.image('image:border', 'assets/border.png')
        this.load.image('image:background', 'assets/background.png');
        
        
        // sprites
        this.load.image('image:ship', 'assets/ship.png');
        this.load.image('image:m1', 'assets/m1.png');
        this.load.image('image:m2', 'assets/m2.png');
        this.load.image('image:m3', 'assets/m3.png');

        // controlers
        this.load.spritesheet('spritesheet:buttons', 'assets/btn-130x120.png', {frameWidth: 130, frameHeight: 120});
        this.load.spritesheet('spritesheet:bar', 'assets/statBar-580x120.png', {frameWidth: 580, frameHeight: 120})
        
        // music ~ sound
        this.load.audio('audio:music', 'music/play-again-classic-arcade-game-116820.mp3')
        this.load.audio('audio:impact', 'music/vibrating-thud-39536.mp3')

    }

    create() {
        this.sound.add('audio:music', {volume: 0.5, loop: true}).play()
        this.impactSound = this.sound.add('audio:impact', {volume: 1, loop: false})

        this.score_int = 0
        this.textureBar = 0;
        this.shipLife = 3
        this.collide = false;
        this.onCollisionTime = false;

        this.m_group = []

        this.bg1 = this.add.image(0, 0, 'image:background').setOrigin(0, 0);
        this.bg2 = this.add.image(0, -1560, 'image:background').setOrigin(0, 0);

        this.bd = this.add.image(0, 0, 'image:border').setOrigin(0, 0);

        this.ship = this.physics.add.sprite(250, 900, 'image:ship').setOrigin(0, 0);

        this.createBtn()

        this.spawnInterval = setInterval(() => {
            this.spawnM();
        }, 2000);

        this.bar = this.physics.add.sprite(60, 100, 'spritesheet:bar', 0).setOrigin(0, 0);

        this.score = this.add.text(400, 130, '', {fontSize: 80, fontFamily: 'pixelMoney', color: "d0d058"});
        this.score.setDepth(100);
        this.score.setColor("#d0d058");


    }

    update() {
        this.bar.destroy();
        this.bar = this.physics.add.sprite(60, 100, 'spritesheet:bar', this.textureBar).setOrigin(0, 0);

        
        if (this.shipLife != 0) {
            this.score.text = this.score_int.toString();
        }

        if (this.collide) {
            if (this.shipLife-1 <= 0) {
                this.ship.destroy()
                clearInterval(this.spawnInterval)
                this.add.text(120, 750-80, 'Game Over\n\nScore: '+this.score_int.toString(), {fontSize: 80, fontFamily: 'pixelMoney'}).setTint(0xd0d058);
            }
            this.shipLife -= 1
            this.collide = false;
            this.textureBar += 1
            this.bar.setTexture(this.textureBar)
        }

        this.slideBackground(10)

        let ship_velocity = 5;

        if (this.leftMove) {
            if (this.ship.x > 40) {
                this.ship.x -= ship_velocity; 
            }
        }
        else if (this.rightMove) {
            if (this.ship.x < 500) {
                this.ship.x += ship_velocity;
            }
        }

        this.updateM(5);
        this.checkShipCollision()
    }
}
