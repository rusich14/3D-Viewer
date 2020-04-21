window.onload = function () {
  var canvasWrap = document.getElementById('viewer');
  var fileSrc = canvasWrap.getAttribute('data-src');
  var size = {
    x: canvasWrap.offsetWidth,
    y: canvasWrap.offsetHeight,
  };
  var colors = {
    white: 0xffffff,
    grey: 0xcccccc,
  };
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, size.x / size.y, 1, 1000);
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(size.x, size.y);
  renderer.setClearColor(colors.white);
  camera.position.z = 80;
  canvasWrap.appendChild(renderer.domElement);

  // scene.add(new THREE.AxesHelper(25));

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 50;
  controls.maxDistance = 250;
  controls.update();

  function directLight(lightColor, intensive, x, y, z) {
    var light = new THREE.DirectionalLight(lightColor, intensive);
    light.position.set(x, y, z);

    return light;
  }

  scene.add(directLight(colors.grey, 0.3, 10, 10, 10));
  scene.add(directLight(colors.grey, 0.1, -10, -10, -10));
  scene.add(new THREE.AmbientLight(colors.white));

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(`${fileSrc}.mtl`, (mtlParseResult) => {
    if (mtlParseResult instanceof THREE.MTLLoader.MaterialCreator) {
      const objLoader = new THREE.OBJLoader2();
      const materials = THREE.MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);

      materials.side = THREE.DoubleSide;
      objLoader.addMaterials(materials);

      objLoader.load(`${fileSrc}.obj`, (root) => {
        if (mtlParseResult instanceof THREE.MTLLoader.MaterialCreator) {
          scene.add(root);
        }
      });
    }
  });

  var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();
};
