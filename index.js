let scene = new THREE.Scene();
let width = window.innerWidth, height = window.innerHeight;
let camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 9999999999);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// renderer.setClearColor(0xffffff)
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera);
camera.position.z = 2000;
controls.update();
console.log(controls)
// let light = new THREE.DirectionalLight(0xffffff);
let light = new THREE.PointLight(0xffffff);
// let light1 = new THREE.PointLight(0xffffff);
// let light2 = new THREE.PointLight(0xffffff);
scene.add(new THREE.AmbientLight(0x333333));
// light.position.set(0, 0, 20);
// light1.position.set(20, 0, 0);
// light2.position.set(0, 20, 0);
scene.add(light);
// scene.add(light1);
// scene.add(light2);
// scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 1));

// let axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);
// scene.add(new THREE.PolarGridHelper(400, 6, 8, 64));


let solarSystem = {
  sun: createSphere(DATA.sun.equatorialRadius, 0, {map: 'assets/solar/sunmap.jpg'}),
  mercury: createSphere(DATA.mercury.equatorialRadius, 1, {map: 'assets/mercury/mercurymap.jpg', bumpMap: 'assets/mercury/mercurybump.jpg'}),
  venus: createSphere(DATA.venus.equatorialRadius, 1, {map: 'assets/venus/venusmap.jpg', bumpMap: 'assets/venus/venusbump.jpg'}),
  earth: createSphere(DATA.earth.equatorialRadius, 1, {map: 'assets/earth/earthmap.jpg', bumpMap: 'assets/earth/earthbump.jpg', specularMap: 'assets/earth/earthspec.jpg'}, null, {map: 'assets/earth/original.jpg', alphaMap: 'assets/earth/earthcloudmaptrans.jpg'}),
  mars: createSphere(DATA.mars.equatorialRadius, 1, {map: 'assets/mars/mars.jpg', bumpMap: 'assets/mars/mars_topo.jpg', normalMap: 'assets/mars/mars_normal.jpg'}),
  jupiter: createSphere(DATA.jupiter.equatorialRadius, 1, {map: 'assets/jupiter/jupiter.jpg'}),
  saturn: createSphere(DATA.saturn.equatorialRadius, 1, {map: 'assets/saturn/saturnmap.jpg'}, {alphaMap: 'assets/saturn/saturnringpattern.gif', map: 'assets/saturn/saturnringcolor.jpg'}),
  uranus: createSphere(DATA.uranus.equatorialRadius, 1, {map: 'assets/uranus/uranusmap.jpg'}, {alphaMap: 'assets/uranus/uranusringtrans.gif', map: 'assets/uranus/uranusringcolor.jpg'}),
  neptune: createSphere(DATA.neptune.equatorialRadius, 1, {map: 'assets/neptune/neptunemap.jpg'})
}
setSphereData(solarSystem, DATA);
for(let o in solarSystem){
  solarSystem[o].arc = 0;
  scene.add(solarSystem[o]);
  scene.add(addTrack(DATA[o]))
}
window.addEventListener('resize', function(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  rotate(solarSystem, DATA);

  renderer.render(scene, camera);
}

function createSphere(radius, materialType, textures, ringTextures, outerTextures){
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
    color: 0xffffff,
    bumpScale: 0.02,
    side: THREE.DoubleSide,
    specular: new THREE.Color(0x111111)
  };
  let group = new THREE.Group();
  let geometry = new THREE.SphereGeometry(radius, 60, 60);
  for(let m in textures){
    materialObj[m] = new THREE.TextureLoader().load(textures[m]);
    materialObj[m].wrapS = THREE.RepeatWrapping;
    materialObj[m].wrapT = THREE.RepeatWrapping;
  }

  if(ringTextures){
    let geometry = new _RingGeometry(radius * 1.15, radius * 1.6, 160, 1, 0, Math.PI * 2);
    console.log(geometry)
    let material = new THREE.MeshPhongMaterial({
      // color: 0xffffff, 
      alphaMap: new THREE.TextureLoader().load(ringTextures.alphaMap),
      map: new THREE.TextureLoader().load(ringTextures.map),
      side: THREE.DoubleSide,
      transparent: true
    });

    let ringeMesh = new THREE.Mesh(geometry, material);
    ringeMesh.rotation.x = Math.PI / 2;

    group.add(ringeMesh);
  }

  // if(outerTextures){
  //   let geometry = new THREE.SphereGeometry(radius * 1.1, 60, 60);
  //   let material = new THREE.MeshPhongMaterial({
  //     map: new THREE.TextureLoader().load(outerTextures.map),
  //     alphaMap: new THREE.TextureLoader().load(outerTextures.alphaMap),
  //     side: THREE.DoubleSide,
  //     transparent: true,
  //     opacity: 1,
  //     depthwrite: false
  //   });
  //   let mesh = new THREE.Mesh(geometry, material);

  //   group.add(mesh);
  // }

  let material = null;
  if(materialType === 0){
    material = new THREE.MeshBasicMaterial(materialObj);
  }else{
    material = new THREE.MeshPhongMaterial(materialObj);
  }
  let mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  // group.add(new THREE.BoxHelper(mesh.clone(), 0xffffff));

  return group;
}

function setSphereData(obj, data){
  for(let o in obj){
    obj[o].rotation.z = data[o].equatorialInclination * Math.PI * 2 / 360; // 自转倾角
  }
}
function rotate(obj, data){
  for(let o in obj){
    obj[o].rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 2 / data[o].rotationCycle); // 自转
    // 公转，使用极坐标方程
    let arc = data[o].revolutionPeriod > 0? Math.PI * 2 / data[o].revolutionPeriod: 0;
    obj[o].arc += arc;
    let radius = data[o].trackRadius || 0;
    obj[o].position.x = radius * Math.sin(obj[o].arc);
    obj[o].position.z = radius * Math.cos(obj[o].arc);
    // 公转倾角，使用三角函数
    obj[o].position.y = obj[o].position.x * Math.tan(Math.PI * 2 / 360 * data[o].orbitalInclination)
  }
}
function addTrack(data){
  // let mesh = new THREE.Mesh(new THREE.RingGeometry(data.trackRadius - 2, data.trackRadius, 100),
  //                       new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
  // mesh.rotation.x = -Math.PI / 2;
  // // 公转倾角
  // mesh.rotation.y = -Math.PI * 2 / 360 * data.orbitalInclination;
  // return mesh;
  // let curve = new THREE.EllipseCurve(0, 0, 10, 10, 0, 2 * Math.PI, false, 0);
  var curve = new THREE.EllipseCurve(
    0,  0,            // ax, aY
    data.trackRadius, data.trackRadius,           // xRadius, yRadius
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );

  var points = curve.getPoints( 50 );
  var geometry = new THREE.BufferGeometry().setFromPoints( points );

  var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

  // Create the final object to add to the scene
  var ellipse = new THREE.Line( geometry, material );
  ellipse.rotation.x = -Math.PI / 2;
  // 公转倾角
  ellipse.rotation.y = -Math.PI * 2 / 360 * data.orbitalInclination;
  return ellipse;
}

animate();