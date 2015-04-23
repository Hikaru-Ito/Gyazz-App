var GyazzTag;

GyazzTag = (function() {
  var _tag_expand;

  function GyazzTag() {}

  GyazzTag.prototype.split = function(s) {
    var PAT2L, PAT2R, PAT3L, PAT3R, SPACE, inner, m, post, pre, x;
    PAT3L = '<<<3<<<';
    PAT3R = '>>>3>>>';
    PAT2L = '<<<2<<<';
    PAT2R = '>>>2>>>';
    SPACE = '<<<SPACE>>>';
    while (m = s.match(/^(.*)\[\[\[(([^\]]|\][^\]]|[^\]]\])*)\]\]\](.*)$/)) {
      x = m[0], pre = m[1], inner = m[2], x = m[3], post = m[4];
      s = '' + pre + PAT3L + (inner.replace(/\s/g, SPACE)) + PAT3R + post;
    }
    while (m = s.match(/^(.*)\[\[(([^\]]|\][^\]]|[^\]]\])*)\]\](.*)$/)) {
      x = m[0], pre = m[1], inner = m[2], x = m[3], post = m[4];
      s = '' + pre + PAT2L + (inner.replace(/\s/g, SPACE)) + PAT2R + post;
    }
    return s.split(" ").map(function(line) {
      return line.replace(new RegExp(PAT3L, 'g'), "[[[").replace(new RegExp(PAT3R, 'g'), "]]]").replace(new RegExp(PAT2L, 'g'), "[[").replace(new RegExp(PAT2R, 'g'), "]]").replace(new RegExp(SPACE, 'g'), " ");
    });
  };

  _tag_expand = function(s, wiki, title, gyazz_url) {
    var elements, matched, _i, _keywords, _ref, _results;
    if (typeof s !== 'string') {
      return;
    }
    matched = [];
    s = s.replace(/</g, "&lt");
    _keywords = [];
    elements = this.split(s).map(function(s) {
      var all, count, dummy, icons, img_url, inner, link_to, m, o, odd, post, pre, screen_name, t, target, url, wikiname, wikititle, wikiurl, _i, _results;
      while (m = s.match(/^(.*)\[\[\[(([^\]]|\][^\]]|[^\]]\])*)\]\]\](.*)$/)) {
        all = m[0], pre = m[1], inner = m[2], dummy = m[3], post = m[4];
        switch (false) {
          case !(t = inner.match(/^(https?:\/\/[^ ]+) (.*)\.(jpg|jpeg|jpe|png|gif)$/i)):
            matched.push('<img src="' + t[1] + '" border="none" height=80 ng-click="openWebPage(\''+t[1]+'\')">');
            break;
          case !(t = inner.match(/^(https?:\/\/.+)\.(jpg|jpeg|jpe|png|gif)$/i)):
            matched.push('<img src="' + t[1] + '.' + t[2] + '" border="none" height=80 ng-click="openWebPage(\''+t[1]+'.' + t[2]+'\')">');
            break;
          case !(t = inner.match(/^([0-9a-f]{32})\.(jpg|jpeg|jpe|png|gif)$/i)):
            matched.push('<img src="'+gyazz_url+'upload/' + t[1] + '.' + t[2] + '" border="none" height=80 ng-click="openWebPage(\''+gyazz_url+'upload/' + t[1] + '.' + t[2]+'\')">');
            break;
          default:
            matched.push('<b>' + inner + '</b>');
        }
        s = pre + '<<<' + (matched.length - 1) + '>>>' + post;
      }
      while (m = s.match(/^(.*)\[\[(([^\]]|\][^\]]|[^\]]\])*)\]\](.*)$/)) {
        all = m[0], pre = m[1], inner = m[2], dummy = m[3], post = m[4];
        switch (false) {
          case !(t = inner.match(/^(https?:\/\/[^ ]+) (.*)\.(jpg|jpeg|jpe|png|gif)$/i)):
            matched.push('<img src="' + t[1]+ '" border="none" ng-click="openWebPage(\'' + t[1] + '\')">');
            break;
          case !(t = inner.match(/^(https?:\/\/.+)\.(jpg|jpeg|jpe|png|gif)$/i)):
            matched.push('<img src="' + t[1] + '.' + t[2] + '" border="none" ng-click="openWebPage(\'' + t[1] + '.' + t[2] + '\')">');
            break;
          case !(t = inner.match(/^(.+)\.(png|icon)$/i)):
            link_to = null;
            img_url = null;
            if (t[1].match(/^@[\da-z_]+$/i)) {
              screen_name = t[1].replace(/^@/, '');
              link_to = 'https://twitter.com/' + screen_name;
              img_url = 'http://twiticon.herokuapp.com/' + screen_name + '/mini';
            } else {
              link_to = gyazz_url + wiki + '/' + t[1];
              img_url = link_to + '/icon';
            }
            matched.push('<img src="' + img_url + '" class="icon" height="24" border="0" alt="' + link_to + '" title="' + link_to + '" ng-click="openWebPage(\'' + link_to + '\')">');
            break;
          case !(t = inner.match(/^(.+)\.(png|icon|jpe?g|gif)[\*x×]([1-9][0-9]*)(|\.[0-9]+)$/)):
            link_to = gyazz_url + wiki + '/' + t[1];
            img_url = link_to + '/icon';
            switch (false) {
              case !t[1].match(/^@[\da-z_]+$/i):
                screen_name = t[1].replace(/^@/, '');
                link_to = 'https://twitter.com/' + screen_name;
                img_url = 'http://twiticon.herokuapp.com/' + screen_name + '/mini';
                break;
              case !t[1].match(/^https?:\/\/.+$/):
                img_url = link_to = t[1] + '.' + t[2];
            }
            count = Number(t[3]);
            icons = '<span class="link" ng-click="openWebPage(\'' + link_to + '\')">';
            (function() {
              _results = [];
              for (var _i = 0; 0 <= count ? _i < count : _i > count; 0 <= count ? _i++ : _i--){ _results.push(_i); }
              return _results;
            }).apply(this).forEach(function(i) {
              return icons += '<img src="' + img_url + '" class="icon" height="24" border="0" alt="' + t[1] + '" title="' + t[1] + '" />';
            });
            if (t[4].length > 0) {
              odd = Number('0' + t[4]);
              icons += '<img src="' + img_url + '" class="icon" height="24" width="' + (24 * odd) + '" border="0" alt="' + link_to + '" title="' + link_to + '" />';
            }
            icons += "</span>";
            matched.push(icons);
            break;
          case !(t = inner.match(/^((https?|javascript):[^ ]+) (.*)$/)):
            target = t[1].replace(/'/g, "%22");
            matched.push('<span ng-click="openWebPage(\'' + target + '\')" class="gyazz_blank_link">' + t[3] + '</span>');
            break;
          case !(t = inner.match(/^((https?|javascript):[^ ]+)$/)):
            target = t[1].replace(/'/g, "%22");
            matched.push('<span ng-click="openWebPage(\'' + target + '\')" class="gyazz_blank_link">' + t[1] + '</span>');
            break;
          case !(t = inner.match(/^@([a-zA-Z0-9_]+)$/)):
            matched.push('<span ng-click="openWebPage(\'https://twitter.com/' + t[1] + '\')" class="gyazz_blank_link">@' + t[1] + '</span>');
            break;
          case !(t = inner.match(/^(.+)::$/)):
            matched.push('<span ng-click="openWebPage(\'' +gyazz_url+ t[1] + '\')" class="gyazz_blank_link">' + t[1] + '</span>');
            break;
          case !(t = inner.match(/^(.+):::(.+)$/)):
            wikiname = t[1];
            wikititle = t[2];
            url = gyazz_url+ wikiname + '/' + (encodeURIComponent(wikititle).replace(/%2F/g, '/'));
            matched.push('<span ng-click="openWebPage(\'' +url + '\')" class="gyazz_blank_link">' + wikititle + '</span>');
            break;
          case !(t = inner.match(/^(.+)::(.+)$/)):
            wikiname = t[1];
            wikititle = t[2];
            wikiurl = gyazz_url + wikiname + '/';
            url = gyazz_url + wikiname + '/' + (encodeURIComponent(wikititle).replace(/%2F/g, '/'));
            matched.push(('<span ng-click="openWebPage(\'' +wikiurl + '\')" class="gyazz_blank_link">' + wikiname) + ('</span>::<span ng-click="openWebPage(\'' +url + '\')" class="gyazz_blank_link">' + wikititle + '</span>'));
            break;
          case !(t = inner.match(/^([a-fA-F0-9]{32})\.(\w+) (.*)$/)):
            matched.push('<span ng-click="openWebPage(\'' +gyazz_url+'upload/' + t[1] + '.' + t[2] + '\')" class="gyazz_blank_link">' + t[3] + '</span>');
            break;
          case !inner.match(/^([EW]\d+\.\d+[\d\.]*[NS]\d+\.\d+[\d\.]*|[NS]\d+\.\d+[\d\.]+[EW]\d+\.\d+[\d\.]*)(Z\d+)?$/):
            o = parseloc(inner);
            s = '<div id="map" style="width:300px;height:300px"></div>\n<div id="line1" style="position:absolute;width:300px;height:4px;\n  background-color:rgba(200,200,200,0.3);"></div>\n<div id="line2" style="position:absolute;width:4px;height:300px;\n  background-color:rgba(200,200,200,0.3);"></div>\n<script type="text/javascript">\nvar mapOptions = {\n  center: new google.maps.LatLng(' + o.lat + ',' + o.lng + '),\n  zoom: ' + (+o.zoom) + ',\n  mapTypeId: google.maps.MapTypeId.ROADMAP\n};\nvar mapdiv = document.getElementById("map");\nvar map = new google.maps.Map(mapdiv,mapOptions);\nvar linediv1 = document.getElementById("line1");\nvar linediv2 = document.getElementById("line2");\ngoogle.maps.event.addListener(map, "idle", function() {\n  linediv1.style.top = mapdiv.offsetTop+150-2;\n  linediv1.style.left = mapdiv.offsetLeft;\n  linediv2.style.top = mapdiv.offsetTop;\n  linediv2.style.left = mapdiv.offsetLeft+150-2;\n});\n// google.maps.event.addListener(map, "mouseup", function() {\n//   var latlng = map.getCenter();\n//   var o = {};\n//   o.lng = latlng.lng();\n//   o.lat = latlng.lat();\n//   o.zoom = map.getZoom();\n//   ew = "[EW]\\d+\\.\\d+[\\d\\.]*";\n//   ns = "[NS]\\d+\\.\\d+[\\d\\.]*";\n//   s = \'\\[\\[(\'+ew+ns+\'|\'+ns+ew+\')(Z\\d+)?\\]\\]\';\n//   r = new RegExp(s);\n//   for(var i=0;i<data.length;i++){\n//     data[i] = data[i].replace(r,"[[' + (locstr(o)) + ']]");\n//   }\n//   writedata();\n// });';
            matched.push(s);
            break;
          default:
            _keywords.push(inner);
            matched.push('<span ng-click="goNextPage(\'' +inner + '\')" class="gyazz_link">' + inner + '</span>');

        }
        s = pre + '<<<' + (matched.length - 1) + '>>>' + post;
      }
      return s;
    });
    (function() {
      _results = [];
      for (var _i = 0, _ref = elements.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).forEach(function(i) {
      var all, inner, m, post, pre, _results;
      _results = [];
      while (m = elements[i].match(/^(.*)<<<(\d+)>>>(.*)$/)) {
        all = m[0], pre = m[1], inner = m[2], post = m[3];
        _results.push(elements[i] = '' + pre + matched[inner] + post);
      }
      return _results;
    });
    return {
      elements: elements,
      keywords: _keywords
    };
  };

  GyazzTag.prototype.expand = function(s, wiki, title, lineno, gyazz_url) {
    var e, elements, _i, _ref, _results;
    e = _tag_expand.call(this, s, wiki, title, gyazz_url);
    elements = e.elements;
    (function() {
      _results = [];
      for (var _i = 0, _ref = elements.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).forEach(function(i) {
      return elements[i]
    });
    return elements.join(" ");
  };

  GyazzTag.prototype.keywords = function(s, wiki, title, lineno) {
    var e;
    e = _tag_expand.call(this, s, wiki, title);
    return e.keywords;
  };

  return GyazzTag;

})();

window.GyazzTag = GyazzTag;

