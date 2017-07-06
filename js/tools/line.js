/**
 * Line Tool.
 * Created by José Luis Valencia on 04/07/2017.
 */

pg.tools.registerTool({
    id: 'line',
    name: 'Line'
});

pg.tools.line = function () {
    var tool;
    var options = {
        closePath: 'near start'
    };

    var components = {
        closePath: {
            type: 'list',
            label: 'Close path',
            options: ['near start', 'always', 'never']
        }
    };

    var activateTool = function () {
        var line = null;

        tool = new Tool();

        tool.onMouseDown = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            if (line) return;

            line = new Path(event.point);
            line = pg.stylebar.applyActiveToolbarStyle(line);
        };

        tool.onMouseUp = function (event) {
            if (event.event.button > 0) return;  // only first mouse button

            // accidental clicks produce a line but no segments
            // so return if an accidental click happened
            if (line.segments.length === 0) return;

            line.add(event.point);

            pg.undo.snapshot('line');
        };

        tool.onMouseMove = function (event) {
            if (!line) return;
            if (event.modifiers.shift) {
                var previousToLastSegment = line.segments[line.segments.length - 2];
                var vectorBetweenPointAndLastFixedPoint = event.point - previousToLastSegment.point;
                console.log(vectorBetweenPointAndLastFixedPoint);
                console.log(vectorBetweenPointAndLastFixedPoint.quadrant);


                if ((vectorBetweenPointAndLastFixedPoint.angle >= 45 && vectorBetweenPointAndLastFixedPoint.angle < 135)
                    || (vectorBetweenPointAndLastFixedPoint.angle >= -135 && vectorBetweenPointAndLastFixedPoint.angle < -45)) {
                    line.lastSegment.point.y = event.point.y;
                    line.lastSegment.point.x = previousToLastSegment.point.x;
                    console.log(90);
                } else {
                    line.lastSegment.point.x = event.point.x;
                    line.lastSegment.point.y = previousToLastSegment.point.y;
                    console.log(0)
                }
            } else {
                line.lastSegment.point = event.point;
            }
        };

        tool.onKeyUp = function (event) {
            if (!line) return;

            if (event.key === "escape") {
                line.lastSegment.remove();
                var nearStart = pg.math.checkPointsClose(line.firstSegment.point, line.lastSegment.point, 30);

                if (options.closePath === 'near start' && nearStart) {
                    line.closePath(true);
                } else if (options.closePath === 'always') {
                    line.closePath(true);
                }

                line = null;
            }
        };

        // setup floating tool options panel in the editor
        pg.toolOptionPanel.setup(options, components);

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
