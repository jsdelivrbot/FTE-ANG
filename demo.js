

var objetoCualquiera1 = {};

objetoCualquiera1.id = 0;
objetoCualquiera1.x = 10;
objetoCualquiera1.y = 20;
objetoCualquiera1.nombre = "pepe";
objetoCualquiera1.kah = "kah!";
var objetoCualquiera2 = {};

objetoCualquiera2.id = 2;
objetoCualquiera2.x = 10;
objetoCualquiera2.y = 20;
objetoCualquiera2.nombre = "pica";
objetoCualquiera2.kah = "kah!";

var objetoCualquiera3 = {};

objetoCualquiera3.id = 3;
objetoCualquiera3.x = 10;
objetoCualquiera3.y = 20;
objetoCualquiera3.nombre = "papas";
objetoCualquiera3.kah = "kah!";

var objetoCualquiera4 = {};

objetoCualquiera4.id = 4;
objetoCualquiera4.x = 10;
objetoCualquiera4.y = 20;
objetoCualquiera4.nombre = "con";
objetoCualquiera4.kah = "kah!";


var llaves = Object.keys(objetoCualquiera1);


var arregloCualquiera = [objetoCualquiera1,objetoCualquiera2,objetoCualquiera3,objetoCualquiera4];

var index = arregloCualquiera.find(x => x.id == '3');

console.log(index);

// console.log(typeof(llaves));


// llaves.forEach(function(item){
// 	console.log(typeof(item),item);
// })


