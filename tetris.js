class Tetris {
  constructor(GAME_SPEED) {
    //落ちるスピード
    this.GAME_SPEED = GAME_SPEED;
    //フィールドサイズ
    this.FIELD_COL = 10;
    this.FIELD_ROW = 20;

    //ブロック1つのサイズ
    this.BLOCK_SIZE = 30;

    //スクリーンサイズ
    this.SCREEN_W =this.BLOCK_SIZE * this.FIELD_COL + 300;
    this.SCREEN_H =this.BLOCK_SIZE * this.FIELD_ROW

    //テトロミノのサイズ
    this.TETRO_SIZE = 4;
    this.can = document.getElementById("tetris");
    this.con = this.can.getContext("2d");

    this.can.width = this.SCREEN_W;
    this.can.height = this.SCREEN_H;
    this.can.style.border = "4px solid #ddbb99"

    this.TETRO_COLORS = [
      "#ffb3be", //0
      "#ffefcc" //1
    ]
    //テトロミノ本体
    this.TETRO_TYPES = [
      [], //0. 空
      [//1. I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
      ],
      [//2. L
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
      ],
      [//3. J
        [0,0,1,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,0,0,0]
      ],
      [//4. T
        [0,1,0,0],
        [1,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
      ],
      [//5. O
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
      ],
      [//6. Z
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
      ],
      [//7. S
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0]
      ],
      [//8.
        [1,0,0,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1]
      ],
      [//9.
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
      ],
      [//10.
        [0,0,0,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
      ],
      [//11.
        [1,1,0,0],
        [0,1,1,0],
        [0,0,1,1],
        [0,0,0,1]
      ],
      [//12.
        [0,1,0,0],
        [1,0,0,1],
        [1,0,0,1],
        [0,1,1,0]
      ],
    ];

    //初期位置
    this.START_X = this.FIELD_COL/2 - this.TETRO_SIZE/2;
    this.START_Y = 0;

    //テトロミノ本体
    this.tetro;

    //テトロミノ座標
    this.tetro_x = this.START_X;
    this.tetro_y = this.START_Y;

    //テトロミノ形
    this.tetro_t;

    //テトロミノ次
    this.tetro_n;

    //フィールドの中身
    this.field = [];

    //ゲームオーバーフラグ
    this.over = false;

    //消したライン数
    this.lines = 0;

    //スコア
    this.score = 0;

    //ゲームフィールドの位置
    this.OFFSET_X = 40;
    this.OFFSET_Y = 20;
  }
  //イニシャライズでスタート
  // init();

  //初期化
  init = () => {
    //フィールドのクリア
    for(let y=0; y<this.FIELD_ROW ; y++ ){
      this.field[y] = [];
      for(let x=0; x<this.FIELD_COL ; x++){
        this.field[y][x] = 0;
      }
    }
    //最初のテトロのためネクスト入れる
    this.tetro_n = Math.floor(Math.random()*(this.TETRO_TYPES.length-1) )+1;

    //テトロをセットして描画開始
    this.setTetro();
    this.drawAll();
    setInterval(this.dropTetro, this.GAME_SPEED);
  }

  //テトロをネクストで初期化
  setTetro = () => {
    this.tetro_t = this.tetro_n;
    this.tetro = this.TETRO_TYPES[this.tetro_t];
    this.tetro_n = Math.floor(Math.random()*(this.TETRO_TYPES.length-1) )+1;

    //位置を初期値にする
    this.tetro_x = this.START_X;
    this.tetro_y = this.START_Y;
  }

  //ブロック1つを描画する
  drawBlock = (x,y,c) => {
    let px = x * this.BLOCK_SIZE;
    let py = y * this.BLOCK_SIZE;
    this.con.fillStyle = this.TETRO_COLORS[c];
    this.con.fillRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);
    this.con.strokeStyle="#323324";
    this.con.strokeRect(px, py, this.BLOCK_SIZE, this.BLOCK_SIZE);
  }

  //全部描画する
  drawAll = () => {
    //フィールドの枠
    this.con.fillStyle="rgba(255,217,204)";
    this.con.fillRect(0,0,this.SCREEN_W, this.SCREEN_H);
    for(let y=0; y<this.FIELD_ROW ; y++ ){
      for(let x=0; x<this.FIELD_COL ; x++){
        if(this.field[y][x]){
          this.drawBlock(x,y,1);
        }
        else{
        }
      }
    }
    //着地点を計算
    let plus=0;
    while(this.checkMove(0,plus+1))plus++;

    //テトロミノ描画
    for(let y=0; y<this.TETRO_SIZE ; y++ ){
      for(let x=0; x<this.TETRO_SIZE ; x++){
        //テトロ本体
        if(this.tetro[y][x]){
          //着地点
          this.drawBlock(this.tetro_x+x, this.tetro_y+y+plus, 0);
          //本体
          this.drawBlock(this.tetro_x+x, this.tetro_y+y, 1);
        }
        //ネクストテトロ
        if(this.TETRO_TYPES[this.tetro_n][y][x]){
          this.drawBlock(13+x, 4+y, 1);
        }
      }
    }
    this.drawInfo();
  }

  //インフォメーション表示
  drawInfo = () => {
    let w;
    this.con.fillStyle="#e65757";
    this.con.font = "20px Arial"

    let s="NEXT";
    this.con.fillText(s,410,100);

    s = "SCORE";
    w = this.con.measureText(s).width;
    this.con.fillText(s,410,300);
    s = "" + this.score;
    w = this.con.measureText(s).width;
    this.con.fillText(s,560-w,340);

    s = "LINES";
    w = this.con.measureText(s).width;
    this.con.fillText(s,410,400);
    s = "" + this.lines;
    w = this.con.measureText(s).width;
    this.con.fillText(s,560-w,440);

    if(this.over){
      s = "GAME OVER♡";
      this.con.font = "60px Arial bold"
      let x = this.SCREEN_W/6;
      let y = this.SCREEN_H/2;
      this.con.fillStyle = "#e65757";
      this.con.fillText(s,this.tetro_x+x,y);
    }
  }

  //衝突判定
  checkMove = (mx,my,ntetro) => {
    if( ntetro == undefined ) ntetro = this.tetro;
    for(let y=0; y<this.TETRO_SIZE ; y++ ){
      for(let x=0; x<this.TETRO_SIZE ; x++ ){
        if( ntetro[y][x] ){
          let nx = this.tetro_x + mx + x;
          let ny = this.tetro_y + my + y;
          if( ny < 0 ||
              nx < 0 ||
              ny >= this.FIELD_ROW ||
              nx >= this.FIELD_COL ||
              this.field[ny][nx] )
          {
            return false;
          }
        }
      }
    }
    return true;
  }

  //回転
  rotate = () => {
    let ntetro = [];
    for(let y=0; y<this.TETRO_SIZE ; y++ ){
      ntetro[y]=[];
      for(let x=0; x<this.TETRO_SIZE ; x++){
        ntetro[y][x] = this.tetro[this.TETRO_SIZE-x-1][y];
      }
    }
    return ntetro;
  }

  //固定する処理
  fixTetro = () => {
    for(let y=0; y<this.TETRO_SIZE ; y++ ){
      for(let x=0; x<this.TETRO_SIZE ; x++){
        if(this.tetro[y][x]){
          this.field[this.tetro_y + y][this.tetro_x + x] = this.tetro_t;
        }
      }
    }
  }

  //ライン揃ったら消す
  checkLine = () => {
    let linec=0;
    for(let y=0; y<this.FIELD_ROW ; y++ ){
      let flag=true;
      for(let x=0; x<this.FIELD_COL ; x++){
        if(!this.field[y][x]){
          flag=false;
          break;
        }
      }
      if(flag){
        linec++;
        for(let ny = y; ny>0 ;ny-- ){
          for(let nx=0;nx<this.FIELD_COL ; nx++){
            this.field[ny][nx] = this.field[ny-1][nx];
          }
        }
      }
    }
    if(linec){
      lines += linec;
      this.score+=100*(2**(linec-1));
      if(this.speed<this.GAME_SPEED-10) this.speed+=10;
    }
  }

  //落ちる処理
  dropTetro = () => {
    if(this.over)return;
    if(this.checkMove(0, 1)) this.tetro_y++;
    else{
      this.fixTetro();
      this.checkLine();
      this.setTetro();
      if(!this.checkMove(0,0)) this.over=true;
    }
    this.drawAll();
  }

  //キーボードアクション
  onKey = (e) => {
    if(this.over)return;
    switch(e.keyCode){
      case 37:// 左
        if(this.checkMove(-1, 0)) this.tetro_x--;
        break;
      case 38:// 上
        // if(checkMove(0, -1))tetro_y--;
        break;
      case 39:// 右
        if(this.checkMove(1, 0)) this.tetro_x++;
        break;
      case 40:// 下
        while(this.checkMove(0, 1)) this.tetro_y++;
        break;
      case 32:// スペース
        let ntetro = this.rotate();
        if(this.checkMove(0, 0, ntetro)) this.tetro = ntetro;
        break;
    }
    this.drawAll();
  }

  onAxis = (axis) => {
    if(this.over)return;
    switch(axis){
      case 'axisLeft':// 左
        if(this.checkMove(-1, 0)) this.tetro_x--;
        break;
      case 'axisUpper':// 上
        // if(checkMove(0, -1))tetro_y--;
        break;
      case 'axisRight':// 右
        if(this.checkMove(1, 0)) this.tetro_x++;
        break;
      case 'axisUnder':// 下
        while(this.checkMove(0, 1)) this.tetro_y++;
        break;
      case 'buttonRound':// スペース
        let ntetro = this.rotate();
        if(this.checkMove(0, 0, ntetro)) this.tetro = ntetro;
        break;
    }
    this.drawAll();
  }
}

const tetris = new Tetris(200);
tetris.init();

let connectedGamepadIndex;
let loopID;

addEventListener("gamepadconnected", (e) => {
    connectedGamepadIndex = e.gamepad.index;
    loopID = requestAnimationFrame(loop);
});

addEventListener("gamepaddisconnected", (e) => {
    connectedGamepadIndex = null;
    cancelAnimationFrame(loopID);
});

// standardタイプのコントローラのマッピングです。
const BUTTON_A_INDEX     = 0;
const BUTTON_B_INDEX     = 1;
const BUTTON_X_INDEX     = 2;
const BUTTON_Y_INDEX     = 3;
const BUTTON_LB_INDEX    = 4;
const BUTTON_RB_INDEX    = 5;
const BUTTON_LT_INDEX    = 6;
const BUTTON_RT_INDEX    = 7;
const BUTTON_BACK_INDEX  = 8;
const BUTTON_START_INDEX = 9;
const BUTTON_L3_INDEX    = 10;
const BUTTON_R3_INDEX    = 11;
const BUTTON_UP_INDEX    = 12;
const BUTTON_DOWN_INDEX  = 13;
const BUTTON_LEFT_INDEX  = 14;
const BUTTON_RIGHT_INDEX = 15;
const BUTTON_HOME_INDEX  = 16;

// standardタイプのコントローラのマッピングです。
const AXIS_L_HORIZONTAL_INDEX = 0;
const AXIS_L_VERTICAL_INDEX   = 1;
const AXIS_R_HORIZONTAL_INDEX = 2;
const AXIS_R_VERTICAL_INDEX   = 3;

function loop(timestamp) {
  // ゲームパッドの入力情報を毎フレーム取得します。
  let gamepads = navigator.getGamepads();
  let gp = gamepads[connectedGamepadIndex];
  // ボタンが押されているかどうかを取得します。
  let aButton = gp.buttons[BUTTON_A_INDEX];

      // スティックが倒されているかどうかを取得します。
  let leftAxisHorizontal = gp.axes[AXIS_L_HORIZONTAL_INDEX];
  let leftAxisVertical = gp.axes[AXIS_L_HORIZONTAL_INDEX];
  let rightAxisHorizontal = gp.axes[AXIS_R_HORIZONTAL_INDEX];
  let rightAxisVertical = gp.axes[AXIS_R_HORIZONTAL_INDEX];
  if(leftAxisHorizontal > 0.5) {
    tetris.onAxis('axisRight')
    console.log('axisRight')
  }
  if(leftAxisHorizontal < -0.5) {
    tetris.onAxis('axisLeft')
    console.log('axisLeft')
  }
  if(leftAxisVertical > 0.5) {
    tetris.onAxis('axisUpper')
    console.log('axisUpper')
  }
  if(leftAxisVertical < -0.5) {
    tetris.onAxis('axisLower')
    console.log('axisLower')
  } 
  if(aButton.pressed) {
    tetris.onAxis('buttonRound')
    console.log('buttonRound')
  }

  requestAnimationFrame(loop);
}
window.onkeydown = tetris.onKey;