var io = require('socket.io')(505);
//Simplex noise library
var SimplexNoise = require('simplex-noise');
var simplex = new SimplexNoise(Math.random);
//TilesType statically accessed class
class TileType{
	//provides a color and id to the client when they decide to draw the tile
	static get GRASSY(){return {id:0,color:{h:136,s:44,l:45}}};
	static get SNOWY(){return {id:1,color:{h:172,s:0,l:100}}};
	static get WATER(){return {id:2,color:{h:205,s:61,l:51}}};
}
class PlayerList{
  constructor(){
    this.list = {};
  }
  add(player){
    this.list[player.id] = player;
  }
  remove(player){
    delete this.list[player.id];
  }
  get(id){
  	return this.list[id];
  }

}
//A single unit of the chunk and the world
class Tile{
	constructor(x,y,size,type){
		this.x = x;
		this.y = y;
		this.tile_size = size;
		//defines the player that is currently in this tile
		//this could be updated when the world is updated
		this.player;
		this.type = type;
		this.color = this.type.color;
	}
}

class World{
	constructor(){
		this.tile_array = {};
		this.player_list = new PlayerList();
		this.width;
		this.height;
		this.tile_size = 25;

	}
	//Generates a world with a specific chunk width and height
	generate(width,height){
		this.width = width;
		this.height = height;
		for(var x = 0;x<width;x++){
			for(var y = 0;y<height;y++){
				//console.log(Math.round(Math.random()*2));
				var rand_num = Math.round(simplex.noise2D(x/10,y/10)*1.9);
				if(rand_num == 0){
					this.set_tile(x,y,new Tile(x,y,this.tile_size,TileType.GRASSY));
				}
				else if(rand_num == 1){
					this.set_tile(x,y,new Tile(x,y,this.tile_size,TileType.SNOWY));
				}else{
					this.set_tile(x,y,new Tile(x,y,this.tile_size,TileType.WATER));
				}


						
				
			}
		}
	}
	set_tile(x,y,tile){
		this.tile_array[x+","+y] = tile;
	}
	get_tile(x,y){

	}
	update_tile(tile_x,tile_y,new_tile){

	}
	//removes a player by their socket.id
	remove_player(player){
		io.emit('player_left',player);
		this.player_list.remove(player);
	}
	add_player(player){
		io.emit('player_joined',player);
		this.player_list.add(player);
		
	}
	get_player_by_id(id){
		return this.player_list.list[id];
	}

}
//A class for receiving attributes about a player
class Player{
	constructor(username,id){
		this.username = username;
		this.id = id;
		this.gold = 0;
		this.tile_x = 0;
		this.tile_y = 0;
	}
}
var world = new World();
world.generate(50,50);



io.on('connection',function(socket){
	
	console.log('received connection');
	socket.emit('init',world);
	//creates a new player with a username that is specified
	new_player = new Player('username',socket.id);
	//adds a new player to the world and alerts the clients
	world.add_player(new_player);
	//emits a signal to the clients that a new player has joined
	socket.broadcast.emit('player_joined',new_player);
	//Sends the player their player object
	

	

	socket.on('disconnect',function(){
		//Deletes a player on the clients and on the server
		world.remove_player(world.player_list.get(socket.id));
	});	
	socket.on('view_area',function(data){
		data["player"] = socket.id;
		socket.broadcast.emit('view_area',data);
	});


	//deprecated
	socket.on('Butt',function(data){
		console.log('received '+data+' butt');
	});




});


