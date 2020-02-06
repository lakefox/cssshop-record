const el_default = {
  "text_decoration_color": "#eeeeee",
  "background_color": "",
  "border_color": "#000000",
  "border_radius": "0",
  "border_style": "solid",
  "border_width": "1",
  "color": "#eeeeee",
  "font_family": "sans-serif",
  "font_size": "20",
  "font_weight": "400",
  "height": "100",
  "left": "100",
  "line_height": "20",
  "padding_bottom": "0",
  "padding_left": "0",
  "padding_right": "0",
  "padding_top": "0",
  "top": "100",
  "width": "100",
  "z_index": "0",
  "background_image": "",
  "opacity": "1",
  "transform": ""
}

const postfixes = {
  "border_radius": "px",
  "border_width": "px",
  "font_size": "px",
  "height": "px",
  "left": "px",
  "line_height": "px",
  "padding_bottom": "px",
  "padding_left": "px",
  "padding_right": "px",
  "padding_top": "px",
  "top": "px",
  "width": "px",
  "background_image": "')"
}

const prefixes = {
  "background_image": "url('"
}

const el_default_buttons = {
  "Bold": false,
  "Center​": false,
  "Cover": false,
  "Italic": false,
  "Justify": false,
  "Left": true,
  "Center": false,
  "Repeat": false,
  "Right": false,
  "Line-Through": false,
  "Underline": false
}

const attrs = {
  "Bold": "font-weight",
  "Center​": "background-position",
  "Cover": "background-size",
  "Italic": "font-style",
  "Justify": "text-align",
  "Left": "text-align",
  "Center": "text-align",
  "Repeat": "background-repeat",
  "Right": "text-align",
  "Line-Through": "text-decoration-line",
  "Underline": "text-decoration-line"
}

function renderCanvas(frameNumber) {
  loadFont();
  let can = document.querySelector("#canvas");
  var name = "canvas";
  if (canvas.groupName) {
    name = canvas.groupName;
  }
  delete canvas.groupName;
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groups") {

      let div = document.createElement("div");
      div.style.position = "absolute";
      div.dataset.name = el;
      div.dataset.group = name;
      div.innerHTML = canvas[el].innerHTML || "";

      for (var style in el_default) {
        if (el_default.hasOwnProperty(style)) {
          div.style[style.replace(/_/g,"-").replace(/​/g,"")] = (prefixes[style] || "") + (canvas[el][style] || el_default[style]) + (postfixes[style] || "");
        }
      }

      for (var style in el_default_buttons) {
        if (el_default_buttons.hasOwnProperty(style)) {
          if (canvas[el][style]) {
            div.style[attrs[style]] = style.toLowerCase();
          }
        }
      }

      if (canvas[el].Repeat) {
        div.style[attrs[style]] = "repeat";
      } else {
        div.style[attrs[style]] = "no-repeat";
      }
      can.appendChild(div);
    }
  }
  canvas.groupName = name;
  if (frameNumber != undefined) {
    renderGroups(frameNumber);
  }
}

function loadFont() {
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groupName" && el != "groups") {
      if (canvas[el].font_family) {
        try {
          WebFont.load({
            google: {
              families: [canvas[el].font_family]
            }
          });
        } catch (e) {
          let doesnothing = e;
        }
      }
    }
  }
}
