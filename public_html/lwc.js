var lwc = {};

lwc.init = function() {
  // rank
  $("#rank-link").click(lwc.showRanks);
  $(".rank-key").click(lwc.showSelectedRankOnly);
  $("#clear-ranks").click(lwc.clearRanks);

  // rank css
  $("#rank-std").click(function() { lwc.setRankCss("css/ranks-std.css");});
  $("#rank-alt1").click(function() { lwc.setRankCss("css/ranks-alt1.css");});
  $("#rank-alt2").click(function() { lwc.setRankCss("css/ranks-alt2.css");});
  $("#rank-alt3").click(function() { lwc.setRankCss("css/ranks-alt3.css");});

  // random home space
  $("#home-easy").click(lwc.pickEasyNode);
  $("#home-normal").click(lwc.pickNormalNode);
  $("#home-hard").click(lwc.pickHardNode);
  $("#home-epic").click(lwc.pickEpicNode);

  // murder time and time advancement
  $("#time-markers .murder-time").click(lwc.selectMurderTime);
  $("#time-markers .time-marker").click(lwc.advanceTime);

  // murder location
  $("#location-markers .marker").click(lwc.setMurderLocationOrTurnOffMarker);
};

lwc.showRanks = function() {
  $("#rank-key-container").show();
  $("#clear-ranks").show();
  lwc.resetJackTracking();
  var nodes = lwc.getSortedNodes();
  lwc.turnOnNodes(nodes);
  lwc.addFrequencyNumbersToRankKeys();
};

lwc.addFrequencyNumbersToRankKeys = function() {
  $("#rank-1-key").html($("#location-markers .rank-1").length);
  $("#rank-2-key").html($("#location-markers .rank-2").length);
  $("#rank-3-key").html($("#location-markers .rank-3").length);
  $("#rank-4-key").html($("#location-markers .rank-4").length);
  $("#rank-5-key").html($("#location-markers .rank-5").length);
  $("#rank-6-key").html($("#location-markers .rank-6").length);
  $("#rank-7-key").html($("#location-markers .rank-7").length);
  $("#rank-8-key").html($("#location-markers .rank-8").length);
  $("#rank-9-key").html($("#location-markers .rank-9").length);
  $("#rank-10-key").html($("#location-markers .rank-10").length);
  $("#rank-11-key").html($("#location-markers .rank-11").length);
  $("#rank-12-key").html($("#location-markers .rank-12").length);
  $("#rank-13-key").html($("#location-markers .rank-13").length);
  $("#rank-14-key").html($("#location-markers .rank-14").length).css("color", "#fff");
}; 

lwc.clearRanks = function() {
  lwc.clearAllMarkers();
  $("#rank-key-container").hide();
  $("#clear-ranks").hide();
};

lwc.setRankCss = function(cssHref) {
  $("link").each(function(i, link) {
    $link = $(link);
    if ($link.attr("href").match(/^css\/ranks-/)) {
      $link.attr("href",cssHref);
    }
  });
};

lwc.turnOnNodes = function(nodes, rank, ignoreNodeIfAlreadyRanked) {
  $.each(nodes, function(i, node) {
    var $nodeEl = lwc.getMarkerForNode(node);

    if (ignoreNodeIfAlreadyRanked === true) {
      if ($nodeEl.is("[class*='rank-']")) {
        return;
      }
    }

    var r = rank || node.getRank();
    lwc.showMarker($nodeEl.addClass("rank-" + r));
  });
};

lwc.resetJackTracking = function() {
  $(".red-marker").removeClass("red-marker").addClass('invisible-marker');
  lwc.setCurrentTimeVal("");
  lwc.setMurderLocation("");
  lwc.setMurderTimeId("");
  $("#murder-time-link").removeClass("hide");
  $("#murder-location-link").addClass("hide");
  $("#murder-next-link").addClass("hide");
};

lwc.pickEasyNode = function() {
  lwc.pickNodes(function(i, node) {
    return node.getNumberOfAdjacentNodes() >= 11;
  });
};

lwc.pickNormalNode = function() {
  lwc.pickNodes(function(i, node) {
    var adjacentNodes = node.getNumberOfAdjacentNodes();
    return adjacentNodes >= 8 && adjacentNodes < 11;
  });
};

lwc.pickHardNode = function() {
  lwc.pickNodes(function(i, node) {
    var adjacentNodes = node.getNumberOfAdjacentNodes();
    return adjacentNodes >= 5 && adjacentNodes < 8;
  });
};

lwc.pickEpicNode = function() {
  lwc.pickNodes(function(i, node) {
    return node.getNumberOfAdjacentNodes() < 5;
  });
};

lwc.pickNodes = function(filterFn) {
  lwc.resetJackTracking();
  var allNodes = lwc.getSortedNodes();
  var filteredNodes = $(allNodes).filter(filterFn);
  lwc.randomPick(filteredNodes);
};
    
lwc.randomPick = function(nodes) {
  var min = 0;
  var max = nodes.length - 1;
  var iterations = 15;
  for (var i = 0; i < iterations; i++) {
    window.setTimeout(function() { 
      var randomIndex = getRandomInt(min, max);
      var node = nodes[randomIndex];
      lwc.showPossibleHomeSpot(node); 
    }, 350*i);
  }

  window.setTimeout(function() { 
    var randomIndex = getRandomInt(min, max);
    var node = nodes[randomIndex];
    lwc.showPossibleHomeSpot(node, true); 
  }, 350*iterations);
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

lwc.showPossibleHomeSpot = function(node, addBigVisualEffect) {
  lwc.hideMarker($("#location-markers .marker"));
  lwc.turnOnNodes([node]);
  if (addBigVisualEffect) {
    var $nodeEl = lwc.getMarkerForNode(node);
    $nodeEl.css({
      "width":"200px", 
      "height":"200px", 
      "border-radius":"100px", 
      "margin-left": "-90px", 
      "margin-top":"-90px" 
    });
    $nodeEl.animate({
      "width": "22px",
      "height": "22px",
      "border-radius": "50px",
      "margin":0
    }, 2000 );
  }
};

lwc.setMurderLocationOrTurnOffMarker = function() {
  if (lwc.isMurderTimeSet()) {
    if (!lwc.isMurderLocationSet()) {
      lwc.selectMurderLocation($(this));
    }
    else {
      var $marker = $(this);
      if ($marker.hasClass("rank-off")) {
        lwc.enableMarker($marker);
      }
      else {
        lwc.disableMarker($marker);
      }
    }
  }
};
    
lwc.selectMurderLocation = function($marker) {
  lwc.clearAllMarkers();
  lwc.setMurderLocation($marker.attr("id"));
  lwc.turnMarkerRed($marker);
  $("#murder-location-link").addClass("hide");
  $("#murder-next-link").removeClass("hide");
};
    
lwc.selectMurderTime = function() {
  if (!lwc.isMurderTimeSet()) {
    var $this = $(this);
    lwc.setMurderTimeId($this.attr("id"));
    lwc.selectTime($this);
    $("#murder-time-link").addClass("hide"); 
    $("#murder-location-link").removeClass("hide");
  }
};
    
lwc.selectTime = function($marker) {
  lwc.turnMarkerRed($marker);
  lwc.setCurrentTimeVal($marker.data("time-val"));
};
    
lwc.turnMarkerRed = function($marker) {
  $marker.removeClass("invisible-marker").addClass("red-marker");
};
    
lwc.advanceTime = function() {
  $this = $(this);
  if (lwc.isMurderTimeSet() && lwc.isMurderLocationSet() && !lwc.isAlreadySelected($this) && lwc.isNextTimeMarker($this)) {
    lwc.selectTime($this);
    lwc.showPossibleLocations(lwc.getMurderLocation(), lwc.getMovesAwayFromMurder());
  }
};
    
lwc.showPossibleLocations = function(startingLocationId, stepsAway) {
  if (stepsAway === 1) {
    var startNode = lwc.getNode(startingLocationId);
    lwc.turnOnNodes(startNode.getAdjacentNodes(), stepsAway);
  }
  else {
    var previousRankClass = "rank-" + (stepsAway - 1);
    $("." + previousRankClass).not(".rank-key").each(function(i, marker){
      lwc.turnOnNodes(lwc.getNodeForMarker($(marker)).getAdjacentNodes(), stepsAway, true);
    });
  }
};
    
lwc.getMovesAwayFromMurder = function() {
  return parseInt(lwc.getCurrentTimeVal()) - parseInt(lwc.getMurderTimeVal());
};
    
lwc.isNextTimeMarker = function($marker) {
  var markerTimeVal = parseInt($marker.data("time-val"));
  var currentTimeVal = parseInt(lwc.getCurrentTimeVal());
  return currentTimeVal+1 === markerTimeVal;
};
    
lwc.isAlreadySelected = function($marker) {
  return $marker.hasClass("red-marker");
};
    
lwc.setCurrentTimeVal = function(value) {
  $("#murder-time-link").data("current-time-val", value);
};

lwc.getCurrentTimeVal = function() {
  return $("#murder-time-link").data("current-time-val");
};

lwc.getMurderTimeVal = function() {
  return $("#"+lwc.getMurderTimeId()).data("time-val");
};

lwc.getMurderTimeId = function() {
  return $("#murder-time-link").data("murder-time-id");
};

lwc.isMurderTimeSet = function() {
  return $("#murder-time-link").data("murder-time-id") !== "";
};

lwc.setMurderTimeId = function(murderTimeId) {
  $("#murder-time-link").data("murder-time-id", murderTimeId); 
};

lwc.getMurderLocation = function() {
  return $("#murder-location-link").data("murder-location-id");
};

lwc.isMurderLocationSet = function() {
  return $("#murder-location-link").data("murder-location-id") !== "";
};

lwc.setMurderLocation = function(locationId) {
  $("#murder-location-link").data("murder-location-id", locationId);
};
    
lwc.showSelectedRankOnly = function(event) {
  var $target = $(event.target);
  var targetRank = parseInt($target.data("rank"));
  lwc.clearAllMarkers();
  var nodes = lwc.getSortedNodes();
  $.each(nodes, function(i, node) {
    var rank = node.getRank();
    if (rank === targetRank) {
      lwc.showMarker(lwc.getMarkerForNode(node).addClass("rank-" + rank));
    }
  });
};   
    
lwc.clearAllMarkers = function() {
  lwc.hideMarker($("#location-markers .marker"));
};   

lwc.disableMarker = function($marker) {
  lwc.hideMarker($marker).addClass("rank-off");
};
    
lwc.enableMarker = function($marker) {    
  lwc.showMarker($marker.removeClass("rank-off").addClass("rank-" + lwc.getMovesAwayFromMurder()));
};

lwc.hideMarker = function($marker) {
  $marker.removeClass().addClass("marker invisible-marker");
  return $marker;
};

lwc.showMarker = function($marker) {
  $marker.removeClass("invisible-marker");
  return $marker;
};

lwc.getNodeForMarker = function($marker) {
  return lwc.getNode($marker.attr("id"));
};

lwc.getMarkerForNode = function(node) {
  return $("#" + node.id);
};
    
lwc.getNodeArray = function() {
  function Node(options) {
    var self = this;

    self.id = options.id;
    self.connections = options.connections;
    self.adjacentNodeIds = options.adjacentNodes.sort();
    
    self.getAdjacentNodes = function() {
      return $.map(self.adjacentNodeIds, function(nodeId) {
        return lwc.getNode(nodeId);
      });
    };

    self.getNumberOfAdjacentNodes = function() {
      return self.adjacentNodeIds.length;
    };

    self.getNumberOfConnections = function() {
      return self.connections;
    };
    
    self.getRank = function() {
      return 16 - self.getNumberOfAdjacentNodes();
    };
  };

  return [
    new Node({id:1, adjacentNodes: [24,6,7,26,2,9,8,28], connections:2 }),
    new Node({id:2, adjacentNodes: [1,26,28,8,9,11,3], connections:2 }),
    new Node({id:3, adjacentNodes: [2,9,11,4,5], connections:2 }),
    new Node({id:4, adjacentNodes: [3,5,11,12,10,30], connections:2 }),
    new Node({id:5, adjacentNodes: [3,4,12,13,15,16,17], connections:2 }),
    new Node({id:6, adjacentNodes: [24,25,44,1,7,26], connections:2 }),
    new Node({id:7, adjacentNodes: [24,25,44,6,1,26], connections:2 }),
    new Node({id:8, adjacentNodes: [26,28,1,2,9,10], connections:2 }),
    new Node({id:9, adjacentNodes: [2,3,11,10,8,1,26,28], connections:3 }),
    new Node({id:10, adjacentNodes: [8,9,11,12,4,30], connections:2 }),
    new Node({id:11, adjacentNodes: [2,3,4,12,10,30,9], connections:2 }),
    new Node({id:12, adjacentNodes: [11,4,5,13,10,30], connections:2 }),
    new Node({id:13, adjacentNodes: [12,5,30,32,14,15,16,17], connections:2 }),
    new Node({id:14, adjacentNodes: [30,13,32,31,33,54,52], connections:2 }),
    new Node({id:15, adjacentNodes: [5,12,13,16,17,33,34,35,36], connections:2 }),
    new Node({id:16, adjacentNodes: [5,12,13,15,17,33,34,35,36], connections:2 }),
    new Node({id:17, adjacentNodes: [5,12,13,15,16,36,38,18], connections:2 }),
    new Node({id:18, adjacentNodes: [17,36,38,39,19,20], connections:3 }),
    new Node({id:19, adjacentNodes: [39,18,20], connections:2 }),
    new Node({id:20, adjacentNodes: [18,19,40,41,42,21], connections:2 }),
    new Node({id:21, adjacentNodes: [20,40,41,42,23], connections:2 }),
    new Node({id:22, adjacentNodes: [42,23,77], connections:2 }),
    new Node({id:23, adjacentNodes: [22,77,21], connections:2 }),
    new Node({id:24, adjacentNodes: [1,7,6,26,44,25,43,59], connections:3 }),
    new Node({id:25, adjacentNodes: [24,6,7,26,44,43,59], connections:3 }),
    new Node({id:26, adjacentNodes: [24,6,7,1,2,9,8,28,27,46,79,44,25,24], connections:5 }),
    new Node({id:27, adjacentNodes: [44,26,28,29,48,47,45,46,79], connections:2 }),
    new Node({id:28, adjacentNodes: [26,1,2,9,8,29,48,45,47,46,27], connections:2 }),
    new Node({id:29, adjacentNodes: [28,30,50,66,64,49,48,47,45,46], connections:2 }),
    new Node({id:30, adjacentNodes: [10,11,4,12,13,14,32,50,66,64,49,29], connections:3 }),
    new Node({id:31, adjacentNodes: [50,32,14,33,54,52,51], connections:3 }),
    new Node({id:32, adjacentNodes: [30,13,14,33,54,52,31], connections:2 }),
    new Node({id:33, adjacentNodes: [31,32,14,15,16,36,35,34,54,52], connections:2 }),
    new Node({id:34, adjacentNodes: [33,15,16,36,35,37,55,68,53,54], connections:2 }),
    new Node({id:35, adjacentNodes: [33,15,16,36,37,55,34,54,68,53], connections:2 }),
    new Node({id:36, adjacentNodes: [33,15,16,17,18,38,35,34], connections:2 }),
    new Node({id:37, adjacentNodes: [53,54,34,35,38,39,55,68], connections:2 }),
    new Node({id:38, adjacentNodes: [17,18,36,39,37], connections:2 }),
    new Node({id:39, adjacentNodes: [37,38,18,19,56], connections:3 }),
    new Node({id:40, adjacentNodes: [20,21,42,41,58,73,57], connections:2 }),
    new Node({id:41, adjacentNodes: [20,21,42,40,58,73,57], connections:2 }),
    new Node({id:42, adjacentNodes: [20,40,41,21,22,58,73,57], connections:2 }),
    new Node({id:43, adjacentNodes: [24,25,44,59], connections:2 }),
    new Node({id:44, adjacentNodes: [43,24,25,6,7,26,27,46,79,59], connections:5 }),
    new Node({id:45, adjacentNodes: [46,27,28,29,48,47,61], connections:2 }),
    new Node({id:46, adjacentNodes: [44,26,27,28,29,48,47,45,79], connections:3 }),
    new Node({id:47, adjacentNodes: [45,46,27,28,29,48,61], connections:2 }),
    new Node({id:48, adjacentNodes: [47,45,46,27,28,29,49,64,63,62], connections:3 }),
    new Node({id:49, adjacentNodes: [48,29,30,50,66,64,63,62], connections:2 }),
    new Node({id:50, adjacentNodes: [29,30,31,52,51,66,64,49], connections:3 }),
    new Node({id:51, adjacentNodes: [50,31,52,67,84,65,66], connections:2 }),
    new Node({id:52, adjacentNodes: [50,31,32,14,33,54,53,67,51], connections:4 }),
    new Node({id:53, adjacentNodes: [67,52,54,34,35,37,55,68], connections:2 }),
    new Node({id:54, adjacentNodes: [52,31,32,14,33,34,35,37,55,68,53], connections:3 }),
    new Node({id:55, adjacentNodes: [53,54,34,35,37,56,68,69,102,86], connections:2 }),
    new Node({id:56, adjacentNodes: [86,68,55,39,57,69,102], connections:3 }),
    new Node({id:57, adjacentNodes: [56,40,41,42,58,73], connections:2 }),
    new Node({id:58, adjacentNodes: [57,40,41,42,73,74,75,76], connections:3 }),
    new Node({id:59, adjacentNodes: [43,24,25,44,60,78,96,95], connections:2 }),
    new Node({id:60, adjacentNodes: [59,79,78,96,95], connections:2 }),
    new Node({id:61, adjacentNodes: [45,47], connections:2 }),
    new Node({id:62, adjacentNodes: [48,49,64,63,82,98,80], connections:2 }),
    new Node({id:63, adjacentNodes: [48,49,64,62,65,82], connections:2 }),
    new Node({id:64, adjacentNodes: [48,49,29,30,50,66,63,62], connections:2 }),
    new Node({id:65, adjacentNodes: [82,63,66,51,67,84,83], connections:3 }),
    new Node({id:66, adjacentNodes: [64,49,29,30,50,51,67,84,65], connections:2 }),
    new Node({id:67, adjacentNodes: [65,66,51,52,53,84], connections:2 }),
    new Node({id:68, adjacentNodes: [53,54,34,35,37,55,56,69,102,86], connections:2 }),
    new Node({id:69, adjacentNodes: [86,68,55,56,70,103,127,102], connections:3 }),
    new Node({id:70, adjacentNodes: [69,71,87,103], connections:2 }),
    new Node({id:71, adjacentNodes: [70,72,88,104,87], connections:3 }),
    new Node({id:72, adjacentNodes: [71,73,74,90,89,88], connections:2 }),
    new Node({id:73, adjacentNodes: [57,40,41,42,58,76,75,74,90,89,72], connections:3 }),
    new Node({id:74, adjacentNodes: [72,73,58,76,76,75,90,89], connections:2 }),
    new Node({id:75, adjacentNodes: [74,73,58,76,77,94,93,92,91,90], connections:2 }),
    new Node({id:76, adjacentNodes: [74,73,58,77,94,93,92,91,90,75], connections:2 }),
    new Node({id:77, adjacentNodes: [76,22,23,94,93,92,91,90,75], connections:2 }),
    new Node({id:78, adjacentNodes: [95,59,60,79,80,97,96], connections:3 }),
    new Node({id:79, adjacentNodes: [60,44,26,27,46,80,97,78], connections:3 }),
    new Node({id:80, adjacentNodes: [78,79,62,82,98,81,97], connections:3 }),
    new Node({id:81, adjacentNodes: [80,118], connections:2 }),
    new Node({id:82, adjacentNodes: [80,62,63,65,83,98], connections:2 }),
    new Node({id:83, adjacentNodes: [82,63,65,99,100,120], connections:2 }),
    new Node({id:84, adjacentNodes: [65,66,51,67,86,85,100,99], connections:2 }),
    new Node({id:85, adjacentNodes: [99,84,86,101,126,124,100], connections:2 }),
    new Node({id:86, adjacentNodes: [100,99,84,68,55,56,69,102,85], connections:2 }),
    new Node({id:87, adjacentNodes: [70,71,104,129], connections:2 }),
    new Node({id:88, adjacentNodes: [71,72,105,130,104], connections:2 }),
    new Node({id:89, adjacentNodes: [72,73,74,90,91,107,106,105], connections:2 }),
    new Node({id:90, adjacentNodes: [72,73,74,75,76,77,94,93,92,91,89], connections:2 }),
    new Node({id:91, adjacentNodes: [89,90,75,76,77,94,93,92,107,106,105], connections:2 }),
    new Node({id:92, adjacentNodes: [91,90,75,76,77,94,93,109,110,132,108,107], connections:2 }),
    new Node({id:93, adjacentNodes: [91,90,75,76,77,94,111,110,109,92], connections:2 }),
    new Node({id:94, adjacentNodes: [90,75,76,77,111,110,109,93,92,91], connections:2 }),
    new Node({id:95, adjacentNodes: [59,60,78,96,114,113,112], connections:2 }),
    new Node({id:96, adjacentNodes: [95,59,60,78,97,116,115,114,113,112], connections:3 }),
    new Node({id:97, adjacentNodes: [78,79,80,117,116,115,96], connections:3 }),
    new Node({id:98, adjacentNodes: [80,62,82,120,122,123,121,119,118], connections:2 }),
    new Node({id:99, adjacentNodes: [83,84,86,85,100,120], connections:2 }),
    new Node({id:100, adjacentNodes: [83,99,84,86,85,124,125,155,141,170,140,123,122,120], connections:3 }),
    new Node({id:101, adjacentNodes: [85,102,127,143,142,156,125,126,124], connections:2 }),
    new Node({id:102, adjacentNodes: [86,68,55,56,69,127,143,142,156,125,126,101], connections:2 }),
    new Node({id:103, adjacentNodes: [69,70,128,127], connections:2 }),
    new Node({id:104, adjacentNodes: [87,71,88,105,130,145,129], connections:4 }),
    new Node({id:105, adjacentNodes: [104,88,89,91,107,106,130], connections:2 }),
    new Node({id:106, adjacentNodes: [105,89,91,107,108,132,134,133,131], connections:2 }),
    new Node({id:107, adjacentNodes: [105,89,91,92,109,110,132,108,106], connections:2 }),
    new Node({id:108, adjacentNodes: [106,107,92,109,110,132,134,133,131], connections:2 }),
    new Node({id:109, adjacentNodes: [107,92,93,94,111,110,132,108], connections:2 }),
    new Node({id:110, adjacentNodes: [108,107,92,109,93,94,111,132], connections:2 }),
    new Node({id:111, adjacentNodes: [110,109,93,94,147,134], connections:2 }),
    new Node({id:112, adjacentNodes: [95,96,114,113,135,148,162], connections:2 }),
    new Node({id:113, adjacentNodes: [112,95,96,114,137,138,136,148,135], connections:2 }),
    new Node({id:114, adjacentNodes: [95,96,115,137,138,136,148,135,113], connections:3 }),
    new Node({id:115, adjacentNodes: [114,96,97,116,137], connections:2 }),
    new Node({id:116, adjacentNodes: [96,97,117,118,151,150,139,115], connections:2 }),
    new Node({id:117, adjacentNodes: [97,118,151,150,139,116], connections:2 }),
    new Node({id:118, adjacentNodes: [139,116,117,81,98,120,122,123,121,119,151,150], connections:3 }),
    new Node({id:119, adjacentNodes: [118,98,120,122,123,121,153,151], connections:2 }),
    new Node({id:120, adjacentNodes: [118,98,83,99,100,122,123,121,119], connections:2 }),
    new Node({id:121, adjacentNodes: [119,118,98,120,122,123,153,151], connections:3 }),
    new Node({id:122, adjacentNodes: [118,98,120,100,124,125,155,141,170,140,123,121,119], connections:2 }),
    new Node({id:123, adjacentNodes: [118,98,120,122,100,124,125,155,141,170,140,121,119], connections:2 }),
    new Node({id:124, adjacentNodes: [123,122,100,125,155,141,170,140], connections:2 }),
    new Node({id:125, adjacentNodes: [123,122,100,124,126,101,102,127,143,142,156,155,141,170,140], connections:2 }),
    new Node({id:126, adjacentNodes: [124,85,101,102,127,143,142,156,125], connections:3 }),
    new Node({id:127, adjacentNodes: [126,101,102,69,103,128,143,142,156,125], connections:3 }),
    new Node({id:128, adjacentNodes: [127,103,144,159,143], connections:2 }),
    new Node({id:129, adjacentNodes: [87,104,145,160,173,159,144], connections:2 }),
    new Node({id:130, adjacentNodes: [104,88,105,131,146,161,145], connections:2 }),
    new Node({id:131, adjacentNodes: [106,108,132,134,133,146,161,145,130], connections:2 }),
    new Node({id:132, adjacentNodes: [108,107,92,109,110,134,133,131], connections:2 }),
    new Node({id:133, adjacentNodes: [106,108,132,134,147,146,131], connections:2 }),
    new Node({id:134, adjacentNodes: [106,108,132,111,147,133,131], connections:2 }),
    new Node({id:135, adjacentNodes: [112,113,114,137,138,136,148,162], connections:2 }),
    new Node({id:136, adjacentNodes: [135,113,114,137,138,139,164,174,163,149,148], connections:2 }),
    new Node({id:137, adjacentNodes: [113,114,115,138,136,148,135], connections:2 }),
    new Node({id:138, adjacentNodes: [135,113,114,137,139,164,174,163,149,136], connections:2 }),
    new Node({id:139, adjacentNodes: [163,149,136,138,116,117,118,151,150,164,174], connections:2 }),
    new Node({id:140, adjacentNodes: [152,153,123,122,100,124,125,155,141,170,154], connections:2 }),
    new Node({id:141, adjacentNodes: [140,123,122,100,124,125,155,170,140], connections:2 }),
    new Node({id:142, adjacentNodes: [125,126,101,102,127,143,158,156], connections:2 }),
    new Node({id:143, adjacentNodes: [125,126,101,102,127,128,144,159,158,142,156], connections:4 }),
    new Node({id:144, adjacentNodes: [143,128,129,145,160,173,159], connections:2 }),
    new Node({id:145, adjacentNodes: [144,104,130,131,146,161,160,173,159], connections:4 }),
    new Node({id:146, adjacentNodes: [145,130,131,133,147,161], connections:2 }),
    new Node({id:147, adjacentNodes: [146,133,134,111], connections:2 }),
    new Node({id:148, adjacentNodes: [112,135,113,114,137,138,136,149,163,162], connections:3 }),
    new Node({id:149, adjacentNodes: [148,136,138,139,164,174,163,162], connections:2 }),
    new Node({id:150, adjacentNodes: [139,116,117,118,151,166,176], connections:2 }),
    new Node({id:151, adjacentNodes: [150,139,116,117,118,119,121,153,166,176], connections:3 }),
    new Node({id:152, adjacentNodes: [166,153,140,154,168,180,167,178,177,165], connections:2 }),
    new Node({id:153, adjacentNodes: [151,119,121,140,154,168,180,152], connections:2 }),
    new Node({id:154, adjacentNodes: [152,153,140,170,169,168], connections:2 }),
    new Node({id:155, adjacentNodes: [141,123,122,100,124,125,182,181,170], connections:2 }),
    new Node({id:156, adjacentNodes: [125,126,101,102,127,143,142,157,171,183], connections:2 }),
    new Node({id:157, adjacentNodes: [156,158,159,172,185,171,183], connections:2 }),
    new Node({id:158, adjacentNodes: [142,143,159,172,185,183,171,157], connections:2 }),
    new Node({id:159, adjacentNodes: [157,158,143,128,144,129,145,160,173,195,187,185,172,183,171], connections:4 }),
    new Node({id:160, adjacentNodes: [159,144,129,145,161,173], connections:3 }),
    new Node({id:161, adjacentNodes: [145,130,131,146,160], connections:3 }),
    new Node({id:162, adjacentNodes: [112,148,135,149,163], connections:2 }),
    new Node({id:163, adjacentNodes: [162,148,149,136,138,139,164,174], connections:2 }),
    new Node({id:164, adjacentNodes: [163,149,136,138,139,175,188,174], connections:3 }),
    new Node({id:165, adjacentNodes: [166,152,167,178,177,189], connections:2 }),
    new Node({id:166, adjacentNodes: [150,151,152,167,178,177,165,176], connections:2 }),
    new Node({id:167, adjacentNodes: [165,166,152,179,178,177], connections:2 }),
    new Node({id:168, adjacentNodes: [152,153,140,154,170,169,180], connections:2 }),
    new Node({id:169, adjacentNodes: [168,154,170,181,191,180], connections:2 }),
    new Node({id:170, adjacentNodes: [168,154,140,123,122,100,124,125,141,155,182,181,169], connections:3 }),
    new Node({id:171, adjacentNodes: [156,157,158,159,172,185,183], connections:2 }),
    new Node({id:172, adjacentNodes: [157,158,159,173,195,187,185,183,171], connections:2 }),
    new Node({id:173, adjacentNodes: [159,144,129,145,160,195,187,172,185], connections:2 }),
    new Node({id:174, adjacentNodes: [163,149,136,138,139,164,175,188], connections:2 }),
    new Node({id:175, adjacentNodes: [174,164,176,190,188], connections:2 }),
    new Node({id:176, adjacentNodes: [150,151,166,190,188,175], connections:2 }),
    new Node({id:177, adjacentNodes: [165,166,152,167,178,189], connections:2 }),
    new Node({id:178, adjacentNodes: [165,177,166,152,167,179,191,190,189], connections:4 }),
    new Node({id:179, adjacentNodes: [189,178,167,191,190], connections:2 }),
    new Node({id:180, adjacentNodes: [152,153,140,168,169,181,191], connections:2 }),
    new Node({id:181, adjacentNodes: [191,180,169,170,155,182], connections:2 }),
    new Node({id:182, adjacentNodes: [181,170,155,183,192], connections:2 }),
    new Node({id:183, adjacentNodes: [156,157,171,158,185,186,193,184,192,182], connections:4 }),
    new Node({id:184, adjacentNodes: [183,185,186,193,194,192,182], connections:2 }),
    new Node({id:185, adjacentNodes: [183,171,157,158,159,172,173,195,187,186,193,184,182], connections:5 }),
    new Node({id:186, adjacentNodes: [183,185,187,195,194,193,184,192,182], connections:2 }),
    new Node({id:187, adjacentNodes: [185,172,159,173,195,194,193,186], connections:2 }),
    new Node({id:188, adjacentNodes: [174,164,175,176,190], connections:2 }),
    new Node({id:189, adjacentNodes: [165,177,178,179,191,190], connections:2 }),
    new Node({id:190, adjacentNodes: [188,175,176,189,178,179,191], connections:2 }),
    new Node({id:191, adjacentNodes: [190,189,178,179,180,169,181], connections:2 }),
    new Node({id:192, adjacentNodes: [182,183,184,193,194], connections:2 }),
    new Node({id:193, adjacentNodes: [182,183,185,186,187,195,194,184,192], connections:3 }),
    new Node({id:194, adjacentNodes: [192,184,193,186,187,195], connections:2 }),
    new Node({id:195, adjacentNodes: [194,193,186,187,185,172,159,173], connections:2 })
  ];
};

lwc.nodes = lwc.getNodeArray();

lwc.getNode = function(nodeId) {
  return lwc.nodes[parseInt(nodeId)-1];
};

lwc.getSortedNodes = function() {
  function sortNodesBasedOnNumberOfAdjacentNodes(node1, node2) {
    if (node1.getNumberOfAdjacentNodes() ===  node2.getNumberOfAdjacentNodes()) {
      return node1.getNumberOfConnections() >= node2.getNumberOfConnections() ? -1 : 1;
    }
    if (node1.getNumberOfAdjacentNodes() > node2.getNumberOfAdjacentNodes()) {
      return -1;
    }
    else {
      return 1;
    }
  };
  
  var nodes = lwc.getNodeArray();
  nodes.sort(sortNodesBasedOnNumberOfAdjacentNodes);
  return nodes;
};