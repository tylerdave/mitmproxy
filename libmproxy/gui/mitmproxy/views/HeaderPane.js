define([
        "require", 
        "dojo/_base/declare", 
        "../util/_ReactiveTemplatedWidget",
        "../MainLayout",
        "jquery",
        "bootstrap/js/popover",
        "dojo/text!./templates/HeaderPane.html",
        "dojo/text!./templates/HeaderPane-MainMenu.html"],
function(require, declare, _ReactiveTemplatedWidget, MainLayout, $, _, template, template_menu) {

	return declare([ _ReactiveTemplatedWidget ], {
		templateString: template,
        postCreate: function(){
            var $brandNode = $(this.brandNode);
            window.$brandNode = $brandNode;
            var _popoverActive = false; //false: No active popover. event: The event that initiated the popover display.
            $brandNode.popover({
                placement: "bottom",
                trigger: "manual",
                html: true,
                title: "mitmproxy",
                content: template_menu,
                container: "body"
            }).on("mouseenter click",function(e){
                    if(_popoverActive)
                        return;
                    _popoverActive = e;
                    $brandNode.popover('show');

                    /* Returns the distance of the given point to the closest point of the given box. */
                    var getDistance = function(point, box){
                        var dist_y = 0, dist_x = 0;
                        if(point.y < box.top) {
                            dist_y = box.top - point.y;
                        } else if(point.y > (box.top + box.height)) {
                            dist_y = point.y - (box.top + box.height);
                        }
                        if(point.x < box.left) {
                            dist_x = box.left - point.x;
                        } else if(point.x > (box.left + box.width)) {
                            dist_x = point.x - (box.left + box.width);
                        }
                        var dist = Math.sqrt((dist_y*dist_y) + (dist_x*dist_x));
                        return dist;
                    }
                    var onEvent = function(maxDist,e){
                        //Check if the triggering event is the one that just opened the popover
                        //This is the case if we listen for a click event.
                        if(e.originalEvent === _popoverActive.originalEvent){
                            return;
                        }
                        var tip = $brandNode.data("bs.popover").$tip;
                        var box = tip.offset();
                        box.width = tip.width();
                        box.height = tip.height();
                        var dist = getDistance({x: e.clientX,y: e.clientY}, box);
                        if(dist > (maxDist === undefined ? 100 : maxDist)){
                            $brandNode.popover("hide");
                            _popoverActive = false;
                            $(document.body).off("mousemove", onMouseMove);
                            $(document.body).off("click", onClick);
                        }
                    };
                    var onMouseMove = onEvent.bind(undefined,$brandNode.data("bs.popover").options.hideDistance);
                    var onClick = onEvent.bind(undefined,0);
                    $(document.body).on("mousemove", onMouseMove);
                    $(document.body).on("click", onClick);
            });
        },
        destroy: function(){
            $(this.brandNode).popover("destroy");
        },
		showPane: function(id){
			MainLayout.showPane(id);
		}
	});
	
});