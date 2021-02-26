import Phaser, { constructor } from 'phaser'
import React from "react";

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }
    preload(){
        this.add.rectangle(100,100, 100, 100, 0xff0000)
    }
}

export default MainScene;