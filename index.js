let scene = new THREE.Scene();
let width = window.innerWidth, height = window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera);

let sun = createSphere(10, {map: 'assets/solar/sunmap.jpg'});
let mercury = createSphere(1, {map: 'assets/mercury/mercurymap.jpg', bumpMap: 'assets/mercury/mercurybump.jpg'});
let venus = createSphere(1, {map: 'assets/venus/venusmap.jpg', bumpMap: 'assets/venus/venusbump.jpg'});
let earth = createSphere(1, {map: 'assets/earth/earthmap.jpg', bumpMap: 'assets/earth/earthbump.jpg', specularMap: 'assets/earth/earthspec.jpg'});
let mars = createSphere(1, {map: 'assets/mars/mars.jpg', bumpMap: 'assets/mars/mars_topo.jpg', normalMap: 'assets/mars/mars_normal.jpg'});
let jupiter = createSphere(1, {map: 'assets/jupiter/jupiter.jpg'});
let saturn = createSphere(1, {map: 'assets/saturn/saturnmap.jpg'}, {alphaMap: 'assets/saturn/saturnringpattern.gif', map: 'assets/saturn/saturnringcolor.jpg'});
let uranus = createSphere(1, {map: 'assets/uranus/uranusmap.jpg'}, {alphaMap: 'assets/uranus/uranusringtrans.gif', map: 'assets/uranus/uranusringcolor.jpg'});
let neptune = createSphere(1, {map: 'assets/neptune/neptunemap.jpg'});


let light = new THREE.DirectionalLight(0xffffff);
// let light = new THREE.AmbientLight(0xffffff);
light.position.set(100, 100, 100);

camera.position.z = 50;
controls.update();

mercury.position.x = 15;
venus.position.x = 18;
earth.position.x = 21;
mars.position.x = 24;
jupiter.position.x = 27;
saturn.position.x = 30;
uranus.position.x = 33;
neptune.position.x = 36;

scene.add(light);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(jupiter);
scene.add(saturn);
scene.add(uranus);
scene.add(neptune);

function animate(){
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}

function createSphere(radius, textures, ringTextures){
  let materialObj = {
    map: null,
    normalMap: null,
    bumpMap: null,
    lightMap: null,
    envMap: null,
    emissiveMap: null,
    aoMap: null,
    alphaMap: null,
    specularMap: null,
    color: 0xffffff
  };
  let group = new THREE.Group();
  let geometry = new THREE.SphereGeometry(radius, 60, 60);
  for(let m in textures){
    materialObj[m] = new THREE.TextureLoader().load(textures[m]);
    materialObj[m].wrapS = THREE.RepeatWrapping;
    materialObj[m].wrapT = THREE.RepeatWrapping;
  }

  if(ringTextures){
    let geometry = new THREE.RingGeometry(radius + 0.15, radius + 0.6, 60, 60, 0, Math.PI * 2);
    let material = new THREE.MeshPhongMaterial({
      // color: 0xffffff, 
      // alphaMap: new THREE.TextureLoader().load(ringTextures.alphaMap),
      map: new THREE.TextureLoader().load(ringTextures.map),
      side: THREE.DoubleSide
    });
    // material.map.wrapS = THREE.RepeatWrapping;
    // material.map.wrapT = THREE.RepeatWrapping;

    let ringeMesh = new THREE.Mesh(geometry, material);
    ringeMesh.rotation.x = Math.PI / 2;

    group.add(ringeMesh);
  }

  let material = new THREE.MeshPhongMaterial(materialObj);
  let mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  return group;
}

animate();