LOCK_TIME = 100;
var locked = false;

var DIR_NORTH   = 0x00;
var DIR_EAST    = 0x01;
var DIR_SOUTH   = 0x02;
var DIR_WEST    = 0x03;

function Dungeon(){
    this.map = [
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x01,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        /*                                       ^start here                          */
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    ]
    this.geometry = [];
    this.x = 8;
    this.y = 14;
    this.orientation=DIR_NORTH;
    this.generate();
}

Dungeon.prototype.generate = function(){
    this.geometry = [];
    gi = 0;
    console.log("Creando celdas");
    for(y=0; y< 16; y++){
        ry = -8 + y;
        for(x=0; x< 16; x++){
            rx = -8 + x;
            if(this.map[gi]>0x00) this.geometry[gi] = new Cube(rx,0,ry);
            else this.geometry[gi] = undefined;
            gi++;
        }        
    }
    console.log("Uniendo celdas");
    gi=0;
    for(y=0; y< 16; y++){
        for(x=0; x< 16; x++){
            cc = this.geometry[gi];
            if(cc == undefined){
                gi++;
                continue;
            }
            if(y>=1){
                //check join south   
                tc = this.geometry[gi-16];
                if(tc != undefined){
                    tc.south = false;
                    cc.north = false;
                }
            }
            if(y<15){
                //check join south   
                tc = this.geometry[gi+16];
                if(tc != undefined){
                    tc.north = false;
                    cc.south = false;
                }
            }
            if(x>=1){
                //check join west
                tc = this.geometry[gi-1];
                if(tc != undefined){
                    tc.east = false;
                    cc.west = false;
                }            
            }
            if(x<15){
                //check join east
                tc = this.geometry[gi+1];
                if(tc != undefined){
                    tc.west = false;
                    cc.east = false;
                }            
            }
            gi++;
        }        
    }
    console.log("Celdas unidas");
}

Dungeon.prototype.render = function(){
    html = '';
    for(tg=0; tg<this.geometry.length; tg++){
        c = this.geometry[tg];
        if(c==undefined)continue;
        html += c.render();
    }
    return html;
}

function goNorth(){
    if(locked)return;
    $('wall.close'   ).removeClass('close'  ).addClass('temp'   );
    $('wall.front'   ).removeClass('front'  ).addClass('close'  );
    $('wall.current' ).removeClass('current').addClass('front'  );
    $('wall.back'    ).removeClass('back'   ).addClass('current');
    $('wall.far'     ).removeClass('far'    ).addClass('back'   );
    $('wall.temp'    ).removeClass('temp'   ).addClass('far'    );
    
    $('ceiling.close'   ).removeClass('close'  ).addClass('temp'   );
    $('ceiling.front'   ).removeClass('front'  ).addClass('close'  );
    $('ceiling.current' ).removeClass('current').addClass('front'  );
    $('ceiling.back'    ).removeClass('back'   ).addClass('current');
    $('ceiling.far'     ).removeClass('far'    ).addClass('back'   );
    $('ceiling.temp'    ).removeClass('temp'   ).addClass('far'    );

    $('ground.close'   ).removeClass('close'  ).addClass('temp'   );
    $('ground.front'   ).removeClass('front'  ).addClass('close'  );
    $('ground.current' ).removeClass('current').addClass('front'  );
    $('ground.back'    ).removeClass('back'   ).addClass('current');
    $('ground.far'     ).removeClass('far'    ).addClass('back'   );
    $('ground.temp'    ).removeClass('temp'   ).addClass('far'    );
    lock();
}


function lock(){
    locked = true;
    setTimeout(function(){
        locked = false;
    }, LOCK_TIME);
}

rotation = 0;
position_x = 0;
position_y = 0;

function applyMovement(){
    // $('scene').css('transform', `rotateY(${rotation}deg) translateX(${(rotation%360==90?-128:rotation%360==270?128:0) + position_x}px) translateZ(${position_y}px)`);
    $('scene').css('transform', 
             `rotateY(${rotation}deg) `
            +`translateX(${position_x}px) translateZ(${position_y}px)`);
    lock();   
}

var direction = 0;

function rotateLeft(){
    if(locked)return;
    if(direction==0)direction=3;
    else direction--;
    rotation -= 90;
    applyMovement();
}
function rotateRight(){
    if(locked)return;
    if(direction==3)direction=0;
    else direction++;
    rotation += 90;
    applyMovement();
}
function canMove(){
    total = 16*16;
    offset = 120;
    mi = ((position_y/512)*16)+(position_x/512);
    mi+= offset;
    mi = total-mi;
    if(dungeon.map[mi]>0x00)return true;
    return false;
}

function moveNorth(){
    if(locked)return;
    px = position_x;
    py = position_y;
    switch(direction){
        case 0:position_y += 512;break;
        case 1:position_x -= 512;break;
        case 2:position_y -= 512;break;
        case 3:position_x += 512;break;
    }    
    if(!canMove()){
        position_x = px;
        position_y = py;
        return;
    }
    applyMovement();
}
function moveSouth(){
    if(locked)return;
    px = position_x;
    py = position_y;
    switch(direction){
        case 0:position_y -= 512;break;
        case 1:position_x += 512;break;
        case 2:position_y += 512;break;
        case 3:position_x -= 512;break;
    }    
    if(!canMove()){
        position_x = px;
        position_y = py;
        return;
    }
    applyMovement();
}


function goSouth(){
    if(locked)return;
    $('wall.far'     ).removeClass('far'    ).addClass('temp'   );
    $('wall.back'    ).removeClass('back'   ).addClass('far'    );
    $('wall.current' ).removeClass('current').addClass('back'   );
    $('wall.front'   ).removeClass('front'  ).addClass('current');
    $('wall.close'   ).removeClass('close'  ).addClass('front'  );    
    $('wall.temp'    ).removeClass('temp'   ).addClass('close'  );
    
    $('ceiling.far'     ).removeClass('far'    ).addClass('temp'   );
    $('ceiling.back'    ).removeClass('back'   ).addClass('far'    );
    $('ceiling.current' ).removeClass('current').addClass('back'   );
    $('ceiling.front'   ).removeClass('front'  ).addClass('current');
    $('ceiling.close'   ).removeClass('close'  ).addClass('front'  );    
    $('ceiling.temp'    ).removeClass('temp'   ).addClass('close'  );
    
    $('ground.far'     ).removeClass('far'    ).addClass('temp'   );
    $('ground.back'    ).removeClass('back'   ).addClass('far'    );
    $('ground.current' ).removeClass('current').addClass('back'   );
    $('ground.front'   ).removeClass('front'  ).addClass('current');
    $('ground.close'   ).removeClass('close'  ).addClass('front'  );    
    $('ground.temp'    ).removeClass('temp'   ).addClass('close'  );
    lock();
}


$(document).ready(function(){
    $(document).keydown(function(e){
        switch(e.keyCode){
            //upocho
            case 38:
                // goNorth();
                moveNorth();
                break;

            //downrenta
            case 40:
                // goSouth();
                moveSouth();
                break;                    
        
            //leftete
            case 37:
                rotateLeft();
                break;

            //righteve
            case 39:
                rotateRight();
                break;
        }
    });
});    
