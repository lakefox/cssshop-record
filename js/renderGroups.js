function play() {
  let frames = Object.keys(action.frames);
  for (var i = 0; i < frames.length; i++) {
    let frame = parseInt(frames[i]);
    setTimeout(() => {
      renderFrame(frame);
    }, frame);
  }
}

function renderFrame(frameNumber) {
  let frame = action.frames[frameNumber];
  canvas = action.artboards[frame.artboard];
  id = Object.keys(canvas)[0];
  let can = document.querySelector("#canvas");
  can.innerHTML = "";
  renderCanvas(frameNumber);
  generateCanvasElements(frameNumber);
}

function generateCanvasElements(frameNumber) {
  let frame = action.frames[frameNumber];
  let assets = frame.assets;
  if (!canvas.group) {
    canvas.groups = {};
  }
  for (var i = 0; i < assets.length; i++) {
    let asset = assets[i];
    let assetData = action.assets[asset.id][asset.position];
    canvas = action.assets[asset.id].None[0];
    canvas.groups = assetData;
    canvas.groupName = asset.id+"-"+asset.position+"-"+i;
    renderCanvas(frameNumber);
  }
}

function renderFrameGroups(frameNumber) {
  document.querySelector("#canvas").style.transform = `scale(1)`;
  let elements = document.querySelectorAll("div[data-group]");
  // Make the groups;
  for (var i = 0; i < elements.length; i++) {
    let id = elements[i].dataset.group;
    if (id != "canvas") {
      let container = document.querySelector(`div[data-container=${id}]`);
      if (container == null) {
        container = document.createElement("div");
        container.dataset.container = id;
        document.querySelector("#canvas").append(container);
      }
      container.append(elements[i]);
    }
  }

  let containers = document.querySelectorAll(`div[data-container]`);
  for (var a = 0; a < containers.length; a++) {
    let container = containers[a];
    let raw_names = container.querySelectorAll(`div[data-group]`);
    let names = [];
    for (var b = 0; b < raw_names.length; b++) {
      names.push(raw_names[b].dataset.name);
    }
    let box = getBoundingBox(canvas.groupName, names);
    let styles = action.frames[frameNumber].assets[container.dataset.container.split("-")[2]].actions;
    container.style = `position: absolute; width: ${parseInt(box.width)+"px"}; height: ${parseInt(box.height)+"px"}; left: ${styles.x}px; top: ${styles.y}px; z-index: ${styles.z}; opacity: ${styles.opacity}; transform: rotate(${styles.rotate}deg) scale(${styles.scale});`;
  }
  document.querySelector("#canvas").style.transform = `scale(1)`;
}


function renderGroups(frameNumber) {
  document.querySelector("#canvas").style.transform = `scale(1)`;
  let groups = canvas.groups || {};
  for (var a = 0; a < Object.keys(groups).length; a++) {
    let group = groups[Object.keys(groups)[a]];
    if (group.elements) {
      if (group.elements.length > 0) {
        let div = document.createElement("div");
        let box = getBoundingBox(canvas.groupName, group.elements);
        if (box != false) {
          div.style = `position: absolute; top: ${box.y+(parseInt(group.y) || 0)}px; left: ${box.x+(parseInt(group.x) || 0)}px; width: ${box.width}px; height: ${box.height}px; transform: ${Object.values(group.styles || {}).join(" ")}; z-index: ${group.zindex}; display: ${group.display};`;
          for (var b = 0; b < group.elements.length; b++) {
            let element = group.elements[b];
            let child = document.querySelector(`div[data-name="${element}"]`);
            if (child != null) {
              child.style.top = (parseInt(canvas[element].top || el_default.top)-box.y)+"px";
              child.style.left = (parseInt(canvas[element].left || el_default.left)-box.x)+"px";
              child.removeAttribute("data-group");
              div.append(child);
            }
          }
          div.dataset.name = Object.keys(groups)[a];
          div.dataset.group = canvas.groupName;
          document.querySelector(`#canvas`).append(div);
        }
      }
    }
  }
  document.querySelector("#canvas").style.transform = `scale(1)`;
  renderFrameGroups(frameNumber);
}

function getBoundingBox(group, names) {
  let ogX = window.scrollX;
  let ogY = window.scrollY;
  window.scrollTo(0,0);
  let el = document.querySelector(`[data-group="${group}"][data-name="${names[0]}"]`);
  if (el != null) {
    let box = el.getBoundingClientRect();
    box = JSON.parse(JSON.stringify(box));
    box.width = box.x + box.width;
    box.height = box.y + box.height;
    for (var i = 1; i < names.length; i++) {
      let el = document.querySelector(`[data-group="${group}"][data-name="${names[i]}"]`);
      if (el != null) {
        el = el.getBoundingClientRect();
        box.x = Math.min(box.x, el.x);
        box.y = Math.min(box.y, el.y);
        box.width = Math.max(box.width, el.x + el.width);
        box.height = Math.max(box.height, el.y + el.height);
      }
    }
    delete box.top;
    delete box.bottom;
    delete box.left;
    delete box.right;

    window.scrollTo(ogX, ogY);

    box.width = box.width-box.x;
    box.height = box.height-box.y;

    return box;
  } else {
    window.scrollTo(ogX, ogY);
    return false;
  }
}
