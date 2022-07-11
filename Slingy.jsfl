var dom = fl.getDocumentDOM();
var timeline = dom.getTimeline();
var library = dom.library;
var mx = 0;
var my = 0;
var mr = 0;

var selectedFrames = timeline.getSelectedFrames();
var currentTimeline = document.currentTimeline;

function prompt1 () {
	return prompt ("Horizontal sling speed:");
}
function prompt2 () {
	return prompt ("Vertical sling speed:");
}
function prompt3 () {
	return prompt ("Rotational shake (degrees):");
}
function prompt4 () {
	return prompt ("Fade away? (y/n):");
}
function prompt5 () {
	return prompt ("Sling Intensity:");
}
if (selectedFrames.length >= 3) {
	var str = prompt1();
	if(str.length == 1 && str.charCodeAt(0) > 64){
	}else{
		var sx = parseInt(str);
		var sy = parseInt(prompt2());
		var slingIntensity = parseInt(prompt5());
		var sr = parseInt(prompt3())*Math.PI/180;
		var fa = (prompt4() == "y");
		var is = true;
		var slingx = sx;
		var slingy = sy;
		for(var i = 0; i < selectedFrames.length; i+=3){
			var layerNum = selectedFrames[i];
			var thisLayer = timeline.layers[layerNum];
			timeline.setSelectedLayers(layerNum);
			var sf = -6;
			for(var j = selectedFrames[i+1]; j < selectedFrames[i+2]; j++){
				if(thisLayer.frames[j].startFrame == sf){
					timeline.currentFrame = j;
					timeline.insertKeyframe(j);
				}
				sf = thisLayer.frames[j].startFrame;
				timeline.setFrameProperty("tweenType","none",j);
			}
		}
		for(var j = selectedFrames[1]; j < selectedFrames[2]; j++){
			timeline.currentFrame = j;
			if(is && sr > 0){
				dom.selectAll();
				var center = dom.getTransformationPoint();
			}
			var intensity = 1;
			var sling = selectedFrames.length;
			if(fa){
				intensity = Math.pow(1-(j-selectedFrames[1])/(selectedFrames[2]-selectedFrames[1]),2);
			}
			for(var i = 0; i < selectedFrames.length; i+=3){
				var e = timeline.layers[layerNum].frames[j].elements;
				for(var k = 0; k < e.length; k++){
					if(e[k].toString() == "[object SymbolInstance]"){
						var mat = e[k].matrix;
						if((i == 0 && k == 0) || !is){
							var cenx = mat.tx;
							var ceny = mat.ty;
							
							mx = cenx + Math.sin(slingx*sx)*intensity*slingIntensity;
							my = ceny + Math.cos(slingy*sy)*intensity*slingIntensity;
							mr += sr*intensity;
							slingx += sx;
							slingy += sy;
						}
						mat.tx = mx;
						mat.ty = my;
						if(sr != 0){
							var sin = Math.sin(mr);
							var cos = Math.cos(mr);
							var a = mat.a;
							var b = mat.b;
							var c = mat.c;
							var d = mat.d;
							var tx = mat.tx;
							var ty = mat.ty;
							mat.a = a*cos - b*sin;
							mat.b = a*sin + b*cos;
							mat.c = c*cos - d*sin;
							mat.d = c*sin + d*cos;
							if(is){
								mat.tx = (tx-center.x)*cos - (ty-center.y)*sin+center.x;
								mat.ty = (tx-center.x)*sin + (ty-center.y)*cos+center.y;
							}
						}
						e[k].matrix = mat;
					}
				}
			}
		}
	}
}