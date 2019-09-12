svg = d3.select("#area");

for(let i=0; i<10; i++){
    svg.append("circle") //円の設置
	.attr("cx",400+200*Math.cos(Math.PI/5*i))
	.attr("cy",400+200*Math.sin(Math.PI/5*i))
	.attr("r",100)
	.attr("fill","red")
	.attr("fill-opacity",0.2)
	.attr("id",'circle'+i)
        .on("click",
	    function(){//円の動き
		d3.select("#msg").text(d3.select(this).attr("id"));
		d3.select(this).attr("fill","blue");
		d3.select(this).attr("cx",0);
		d3.select(this).attr("cy",0);
		
	    }
	   );
}

