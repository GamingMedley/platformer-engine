$("#execute").bind("click", function()
  {
    var x = prompt("What do you want to execute?", "alert();");
    eval(x);
  }
);

// Align the footer.
var $footer = $("#footer");
var alignFooter = function()
  {
    $footer.css("top", ($window.height() - $footer.outerHeight()) + "px");
  };
alignFooter();
$window.bind("resize", alignFooter);

// Wait until the document is finished loading.
$document.bind("ready", function()
  {

    // Variables used
    GAMEngine.global.step = 1;

    // Resize the screen.
    GAMEngine.$screen.css({
      height: "240px",
      width: "256px"
    });

    // Position the screen.
    GAMEngine.position("center", "center");

    // Position the header.
    var $h1 = $("h1"),
      $h2 = $("h2");
    var alignHeader = function()
    {
      var height = {
          header: $h1.outerHeight() + $h2.outerHeight(),
          padding: ($window.height() - GAMEngine.$screen.outerHeight()) / 2
        };
      height = (height.padding / 2) - (height.header / 2);
      $h1.css("top", height + "px");
      $h2.css("top", height + "px");
    }
    alignHeader();
    $window.bind("resize", alignHeader);

    // Set backgrounds
    GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/bg2-2.gif")',
      collisionable: false,
      height: "240px",
      left: 0,
      position: "absolute",
      top: 0,
      width: "256px"
    });
    var $cloud = GAMEngine.createObject({
        backgroundImage: 'url("./demos/mario/cloud.gif")',
        collisionable: false,
        height: "240px",
        left: 0,
        position: "absolute",
        top: 0,
        width: "256px",
        zIndex: 5
      });
    var moveCloud = function()
      {
        $cloud.scroll(-1, 0);
        setTimeout(moveCloud, 50);
      };
    moveCloud();
    GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/qmb2.gif")',
      gravityY: 0,
      height: "224px",
      width: "16px",
      left: "0",
      position: "absolute",
      top: "0",
      zIndex: 9
    });
    GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/qmb2.gif")',
      gravityY: 0,
      height: "224px",
      width: "16px",
      left: "240px",
      position: "absolute",
      top: "0",
      zIndex: 9
    });
    GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/qmb2.gif")',
      gravityY: 0,
      height: "16px",
      width: "224px",
      left: "16px",
      position: "absolute",
      top: "0"
    });
    GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/floor2.gif")',
      height: "16px",
      top: "224px",
      width: "256px"
    });
    GAMEngine.global.$mario = GAMEngine.createObject({
      backgroundImage: 'url("./demos/mario/mario3.gif")',
      backgroundPosition: "0 0",
      data: {
        jumping: false,
        speed: 2
      },
      gravityX: 0,
      gravityY: 3,
      gravityCallback: function(e)
      {
        if (e != 0)
        {
          var $mario = $(e.target);
          var gravity = ($mario.data("gravityY") != 0 ? "Y" : "X");

          // If we're jumping,
          if ($mario.data("jumping"))
          {

            // Set to jump sprite.
            $mario.backgroundPositionX("-32px");

            // If we've reached the max jump height, fall.
            if ($mario.data("gravities" + gravity) > 25)
            {
              $mario.data("jumping", false);
              $mario.data("gravity" + gravity, -1 * $mario.data("gravity" + gravity));
            }
          }

          // If we've fallen off a ledge,
          // (gravity without jumping)
          else if (!$mario.data("collision" + gravity))
          {

            // Set to jump sprite.
            $mario.backgroundPositionX("-32px");
          }
        }
      },
      gravityCollisionX: function(e)
      {
        if (e != 0)
        {
          var $mario = $(e.target);

          // If gravity causes a collision while jumping, fall!
          if ($mario.data("jumping"))
          {
            $mario.data("jumping", false);
            $mario.data("gravityX", -1 * $mario.data("gravityX"));
          }

          // If we've collided on the ground, we're no longer falling.
          else
          {
            $mario.data("jumping", false);
            $mario.backgroundPositionX(0);
          }
        }
      },
      gravityCollisionY: function(e)
      {
        if (e != 0)
        {
          var $mario = $(e.target);

          // If gravity causes a collision while jumping, fall!
          if ($mario.data("jumping"))
          {
            $mario.data("jumping", false);
            $mario.data("gravityY", -1 * $mario.data("gravityY"));
          }

          // If we've collided on the ground, we're no longer falling.
          else
          {
            $mario.data("jumping", false);
            $mario.backgroundPositionX(0);
          }
        }
      },
      height: "16px",
      left: "120px",
      position: "absolute",
      top: "180px",
      width: "16px",
      zIndex: 1
    });

    // Set key binds.
    GAMEngine.bind(
      ["left", "right"],
      function(key, keyCode, action)
      {
        var gd = [
            GAMEngine.global.$mario.data("gravityX"),
            GAMEngine.global.$mario.data("gravityY")
          ];
        if (GAMEngine.global.$mario.data("jumping"))
          gd = [-1 * gd[0], -1 * gd[1]];
        gd.push(gd[0] != 0 ? "X" : "Y");
        if (action == "down")
        {
          if (GAMEngine.inArray(key, ["a", "d", "left", "right"]))
          {
            var left = GAMEngine.inArray(key, ["a", "left"]);
            var dir = (left ? -1 : 1) * GAMEngine.global.$mario.data("speed");
            var scroll = GAMEngine.global.$mario.safe(
                gd[2] == "Y" ? dir : 0,
                gd[2] == "X" ? dir : 0
              );
            var position = (
                gd[1] > 0 ? 0 :
                gd[1] < 0 ? 64 :
                gd[0] > 0 ? 32 :
                96
              );
            GAMEngine.global.$mario.backgroundPositionY((position + (left ? -16 : 0)).toString() + "px").move(scroll[0], scroll[1]);
          }
          if (GAMEngine.global.$mario.data("gravities" + gd[2]) == 0)
          {
            GAMEngine.global.$mario.backgroundPositionX(
              GAMEngine.global.step < 10 ?
              "-16px" :
              GAMEngine.global.step < 20 ?
              "0" :
              GAMEngine.global.step < 30 ?
              "-16px" :
              "0"
            );
            GAMEngine.global.step++;
            if (GAMEngine.global.step == 39)
              GAMEngine.global.step = 1;
          }
        }

        // on key up
        else
        {
          if (GAMEngine.global.$mario.data("gravities" + gd[2]) == 0)
            GAMEngine.global.$mario.backgroundPositionX(0);
        }
        return true;
      },
      {action: "both"}
    );
    GAMEngine.bind("space", function(key, keyCode, action)
      {

        var gd = [
            GAMEngine.global.$mario.data("gravityX"),
            GAMEngine.global.$mario.data("gravityY")
          ];
        if (GAMEngine.global.$mario.data("jumping"))
          gd = [-1 * gd[0], -1 * gd[1]];
        gd.push(gd[0] != 0 ? "X" : "Y");

        // on key down,
        if (action == "down")
        {

          // If we're not falling or already jumping, jump!
          if (GAMEngine.global.$mario.data("gravities" + gd[2]) == 0)
          {
            GAMEngine.global.$mario.data("jumping", true);
            GAMEngine.global.$mario.data("gravity" + gd[2], -1 * GAMEngine.global.$mario.data("gravity" + gd[2]));
          }
        }

        // on key up, stop jumping
        else
        {
          if (GAMEngine.global.$mario.data("jumping"))
          {
            GAMEngine.global.$mario.data("jumping", false);
            GAMEngine.global.$mario.data("gravity" + gd[2], -1 * GAMEngine.global.$mario.data("gravity" + gd[2]));
          }
        }
      },
      {action: "both", type: "once"}
    );

    // For mass JavaScript errors
    GAMEngine.bind("enter", window.close);
    GAMEngine.bind("F5", location.reload);

    GAMEngine.bind(["w", "a", "s", "d"],
      function(key)
      {
        var gd = [
            GAMEngine.global.$mario.data("gravityX"),
            GAMEngine.global.$mario.data("gravityY")
          ];
        if (GAMEngine.global.$mario.data("jumping"))
          gd = [-1 * gd[0], -1 * gd[1]];
        var to = (key == "s" ? 1 : key == "a" ? 4 : key == "w" ? 3 : 2);
        var from = (gd[1] > 0 ? 1 : gd[0] < 0 ? 4 : gd[1] < 0 ? 3 : 2);
        //gd.push(gd[0] != 0 ? "X" : "Y");
        GAMEngine.global.$mario
          .data({
            jumping: false,
            gravityX: (key == "s" || key == "w" ? 0 : key == "a" ? -3 : 3),
            gravityY: (key == "d" || key == "a" ? 0 : key == "s" ? 3 : -3)
          })
          .scroll(0,
            (to - from) * 32
          );
      },
      {type:"once"}
    );
  }
);
