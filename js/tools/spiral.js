/**
 * Spiral Tool.
 * Created by José Luis Valencia on 03/07/2017.
 */


pg.tools.registerTool({
    id: 'spiral',
    name: 'Spiral'
});

pg.tools.spiral = function () {
    var tool;

    var options = {};

    var activateTool = function () {
        tool = new Tool();
        tool.fixedDistance = 0;

        var path;
        var theta;
        var mouseDown;
        var selectionLine;


        tool.onMouseDown = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            console.log(event);
            mouseDown = event.downPoint;

            theta = 0.0;

            var x = 2 * theta * Math.cos(theta);
            var y = 2 * theta * Math.sin(theta);
            var offset = new Point(x, y);
            var point = new Point(mouseDown.x + offset.x, mouseDown.y + offset.y);

            path = pg.stylebar.applyActiveToolbarStyle(new Path(point));
            selectionLine = pg.guides.line(event.downPoint, event.point, '#009dec');
        };

        tool.onMouseDrag = function (event) {
            console.log(event.delta);
            if (event.event.button > 0) return;  // only first mouse button
            selectionLine.lastSegment.point.x = event.downPoint.x;
            selectionLine.lastSegment.point.y = event.point.y;
            var cursorIsMovingDownwards = event.delta.y >= 0;

            var spiralMatchesGuide;
            do {
                if (cursorIsMovingDownwards) {
                    theta += 0.1;
                    var x = 2 * theta * Math.cos(theta);
                    var y = 2 * theta * Math.sin(theta);
                    var offset = new Point(x, y);
                    var newPath;
                    newPath = new Point(mouseDown.x + offset.x, mouseDown.y + offset.y);
                    path.add(newPath);
                    spiralMatchesGuide = Math.abs(2 * theta - Math.abs(event.point.y - event.downPoint.y)) < 1 || event.point.y < newPath.y;
                    selectionLine.strokeColor = '#009dec';
                }
                else if (theta > 0.0) {
                    theta -= 0.1;
                    path.lastSegment.remove();
                    spiralMatchesGuide = Math.abs(2 * theta - Math.abs(event.point.y - event.downPoint.y)) < 1;
                    selectionLine.strokeColor = '#aaaaaa';
                }
                else {
                    path.segments = [];
                    spiralMatchesGuide = true;
                }
                console.log("Target: " + Math.abs(event.point.y - event.downPoint.y));
                console.log("Current: " + 2 * theta);
            } while (!spiralMatchesGuide);
        };


        tool.onMouseUp = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            path.simplify(0.1);
            selectionLine.remove();
            // pg.undo.snapshot('spiral');
        };

        tool.activate();
    };

    var deactivateTool = function () {
        tool.remove();
    };


    return {
        options: options,
        activateTool: activateTool,
        deactivateTool: deactivateTool
    };

};