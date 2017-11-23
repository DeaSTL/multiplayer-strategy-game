var socket = io.connect("http://xiacon.tk:505/");
var player_list;
var world;

socket.on('player_joined',function(data){
  //adds a new player to the list with the data as the constructor
	world.add_player(new Player(data));
});
socket.on('player_left',function(data){
	world.remove_player(new Player(data));
});

socket.on('init',function(data){
	world = new World(data);
	draw_world();
});
class World{
	constructor(world){
		this.tile_array = world.tile_array;
		this.player_list = new PlayerList(world.player_list);
		this.width = world.width;
		this.height = world.height;
		this.tile_size = world.tile_size;

	}
	//Generates a world with a specific chunk width and height
	generate(width,height){
		
	}
	update_tile(tile_x,tile_y,new_tile){

	}
	//removes a player by their socket.id
	remove_player(player){
		
		this.player_list.remove(player);
	}
	add_player(player){
		this.player_list.add(player);
		
	}
	get_player_by_id(id){
		return this.player_list.list[id];
	}

}
class PlayerList{
  constructor(player_list){
    this.list = player_list.list;
  }
  add(player){
    this.list[player.id] = player;
  }
  remove(player){
    delete this.list[player.id];
  }
  draw(){

  }
}


class Player{
	constructor(player){
		this.username = player.username;
		this.tile_x = player.tile_x;
		this.tile_y = player.tile_y;
		this.gold = player.gold;
		this.id = player.id;
		this.player_char = 'X';

	}
	draw(zoom){
		rect(this.tile_x,this.tile_y,10,10);
	}
}
class Camera{
	constructor(x,y,width,height){
		this.x = y;
		this.y = y;
    	this.width = width;
    	this.height = height;
    	this.zoom = .2;


	}
	get_view_rect(){
		return {
			x:Math.round(((this.x*this.zoom)/world.tile_size)),
			y:Math.round(((this.y*this.zoom)/world.tile_size)),
			width:Math.round(((width*this.zoom)/world.tile_size)),
			height:Math.round(((height*this.zoom)/world.tile_size))
		};
	}
}

function setup(){
	colorMode(HSL);
	createCanvas(windowWidth-10,windowHeight-10);
	noStroke();
	camera = new Camera(0,0,width,height);


}
function draw(){

	//w
	if(keyIsDown(87)){
		camera.y -= 2/camera.zoom;
	}
	//s
	if(keyIsDown(83)){
		camera.y += 2/camera.zoom;
	}
	//a
	if(keyIsDown(65)){
		camera.x -= 2/camera.zoom;
	}
	//d
	if(keyIsDown(68)){
		camera.x += 2/camera.zoom;
	}
	if(world && keyIsPressed){
		draw_world();
	}

}
function draw_world(){
	background(0);
	view_area = camera.get_view_rect();
	for(var x = 0;x<view_area.width;x++){
		for(var y = 0;y<view_area.height;y++){
			real_x = x + view_area.x;
			real_y = y + view_area.y;
			current_tile = world.tile_array[real_x+","+real_y];
			if(current_tile){
				fill(current_tile.color.h,current_tile.color.s,current_tile.color.l)
				rect(
					x*current_tile.tile_size/camera.zoom,
					y*current_tile.tile_size/camera.zoom,
					current_tile.tile_size/camera.zoom,
					current_tile.tile_size/camera.zoom);
			}

				
		}
	}	
}
function mouseWheel(event){
	camera.zoom += event.delta/100;
	draw_world();
}





//draw functions
