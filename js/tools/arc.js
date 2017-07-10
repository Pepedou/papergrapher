/**
 * Arc Tool.
 * Created by José Luis Valencia on 04/07/2017.
 */

pg.tools.registerTool({
    id: 'arc',
    name: 'Arc'
});

pg.tools.arc = function () {
    var tool;
    var options = {};

    var points = null;
    var marks = null;

    var crosshairs = null;

    var activateTool = function () {
        tool = new Tool();

        var crosshairsVertical = new Path([100, 100], [100, 200]);
        var crosshairsHorizontal = new Path([50, 150], [150, 150]);

        crosshairs = new Group([crosshairsVertical, crosshairsHorizontal]);
        crosshairs.strokeColor = 'black';
        crosshairs.position = view.center;

        tool.onMouseDown = function (event) {
            if (event.event.button > 0) return;  // only first mouse button

            if (!points) {
                points = [];
                marks = [];
            }

            if (points.length < 3) {
                points.push(event.point);
                var horizontalMark = new Path.Line(new Point(event.point.x - 5, event.point.y),
                    new Point(event.point.x + 5, event.point.y));
                var verticalMark = new Path.Line(new Point(event.point.x, event.point.y - 5),
                    new Point(event.point.x, event.point.y + 5));

                horizontalMark = pg.stylebar.applyActiveToolbarStyle(horizontalMark);
                verticalMark = pg.stylebar.applyActiveToolbarStyle(verticalMark);

                marks.push(horizontalMark);
                marks.push(verticalMark);
            }
        };

        tool.onMouseUp = function (event) {
            if (event.event.button > 0) return;  // only first mouse button

            if (!points || points.length < 3) return;

            var from = points[0];
            var to = points[1];
            var through = points[2];
            var arc = new Path.Arc(from, through, to);
            arc = pg.stylebar.applyActiveToolbarStyle(arc);

            for (var i = 0; i < marks.length; ++i) {
                marks[i].remove();
            }

            points = null;
            marks = null;

            pg.undo.snapshot('arc');
        };

        tool.onMouseMove = function (event) {
            crosshairs.position = event.point;
        };

        tool.activate();
    };

    var deactivateTool = function () {
        for (var i = 0; i < marks.length; ++i) {
            marks[i].remove();
        }

        crosshairs.remove();
        tool.remove();
    };

    return {
        options: options,
        activateTool: activateTool,
        deactivateTool: deactivateTool
    };
};
