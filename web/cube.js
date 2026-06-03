function Face(x, y, z, size,  rx, ry , content){
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.rx = rx;
    this.ry = ry;
    this.content = content;
}

Face.prototype.render = function(){
    switch(this.content){
        case 'T': bg = "ceiling"; break;
        case 'B': bg = "ground"; break;
        case 'N': bg = "wall"; break;
        case 'S': bg = "wall"; break;
        case 'E': bg = "wall"; break;
        case 'W': bg = "wall"; break;
    }

    variation = 3;
    variation = 1+(parseInt(Math.random()*3))   ;
    if(this.content == 'W') this.content = `<img src="door2.png" style="width: 100%; height: 100%;" />`;
    
    return `<face style="`
                +`width      : ${this.size}px;`
                +`height     : ${this.size}px;`
                +`background-image: url('${bg}${variation}.jpg');`
                +`background-size : 100% 100%;`
                +`transform  : `
                    +`translateX(${this.x}px) `
                    +`translateY(${this.y}px) `
                    +`translateZ(${this.z}px) `
                    +`rotateX(${this.rx}deg) `
                    +`rotateY(${this.ry}deg) `
                    
                + `;`
            +`">${this.content}</face>`;
}

function Cube(x,y,z,size=512){
    this.size   = size;
    this.x      = x*size;
    this.y      = y*size;
    this.z      = z*size;
    
    hs = parseInt(size/2);

    this.bottom = new Face(   0, -hs,   0,size, 90,  0, "T");
    this.top    = new Face(   0,  hs,   0,size,-90,  0, "B");
    this.north  = new Face(   0,   0, -hs,size,  0,  0, "N");
    this.south  = new Face(   0,   0,  hs,size,360,180, "S");
    this.west   = new Face( -hs,   0,   0,size,  0, 90, "W");
    this.east   = new Face(  hs,   0,   0,size,  0,-90, "E");
}

Cube.prototype.render = function(){
    html = "";
    if(this.top)    html += this.top.render();
    if(this.bottom) html += this.bottom.render();
    if(this.north)  html += this.north.render();
    if(this.east)   html += this.east.render();
    if(this.south)  html += this.south.render();
    if(this.west)   html += this.west.render();
    //billboard: html += `<img src="door1.png" style="width: 100%; height: 100%;" />`;
    return `<cube style="` 
                +`width     :${this.size}px;`
                +`height    :${this.size}px;`
                +`transform :`
                    +` translateX(${this.x}px)`
                    +` translateY(${this.y}px)`
                    +` translateZ(${this.z}px)`
                +`;`
            +`">${html}</cube>`;
}

Cube.prototype.join = function(cube) {
    if(this.x == cube.x){
        if(this.z > cube.z){
            this.north = false;
            cube.south = false;
        } else {
            this.south = false;
            cube.north = false;
        }
    }
    if(this.z == cube.z){
        if(this.x > cube.x){
            this.west = false;
            cube.east = false;
        } else {
            this.east = false;
            cube.west = false;
        }
    }
}

var dungeon;

$('scene').ready(function(){
    dungeon = new Dungeon();
/*    cube1 = new Cube( 0,  0, -1, 512);//N
    cube2 = new Cube( 0,  0,  1, 512);//S
    cube3 = new Cube( 0,  0,  0, 512);//C
    cube4 = new Cube(-1,  0,  0, 512);//E
    cube5 = new Cube( 1,  0,  0, 512);//W
    cube1.join(cube3);
    cube2.join(cube3);
    cube4.join(cube3);
    cube5.join(cube3);*/
    $("scene").html(dungeon.render());
    /*$("scene").append(cube1.render());
    $("scene").append(cube2.render());
    $("scene").append(cube3.render());
    $("scene").append(cube4.render());
    $("scene").append(cube5.render());*/
});