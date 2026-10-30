import * as T from 'three';

export async function initDesk(stage) {
  const host = stage.querySelector('.desk-canvas-host');
  const controls = stage.querySelector('.scene-controls');
  const htmlItems=[...stage.querySelectorAll('.desk-item')];
  const renderer = new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.25 : 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden','true');canvas.tabIndex=-1;
  host.append(canvas);
  const scene = new T.Scene();
  scene.background = new T.Color('#52644f');
  scene.fog = new T.Fog('#52644f',20,48);
  const camera = new T.OrthographicCamera(-7,7,4,-4,.1,70);
  const models = new T.Group();scene.add(models);
  const cream = material('#f3efdf'), ink = material('#334739'), sage = material('#64785c');
  const gold = material('#cfad58'), paper = material('#fff9e9'), metal = material('#34443b',.32,.45);
  function material(color,roughness=.72,metalness=0) {return new T.MeshStandardMaterial({color,roughness,metalness});}
  function box(w,h,d,mat,parent,x=0,y=0,z=0) {
    const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),mat);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function round(w,h,d,r=.05) {
    const shape=new T.Shape(),x=-w/2,y=-d/2;
    shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);
    shape.lineTo(x+w,y+d-r);shape.quadraticCurveTo(x+w,y+d,x+w-r,y+d);
    shape.lineTo(x+r,y+d);shape.quadraticCurveTo(x,y+d,x,y+d-r);
    shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
    const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:6});
    geo.rotateX(-Math.PI/2);geo.center();const pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,(pos.getX(i)+w/2)/w,(pos.getZ(i)+d/2)/d);return geo;
  }
  function slab(w,h,d,mat,parent,x=0,y=0,z=0) {const m=new T.Mesh(round(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function cylinder(r1,r2,h,mat,parent,x=0,y=0,z=0) {const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,32),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function rod(a,b,r,mat,parent) {const from=new T.Vector3(...a),to=new T.Vector3(...b),dir=to.clone().sub(from);const m=new T.Mesh(new T.CylinderGeometry(r,r,dir.length(),12),mat);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());m.castShadow=true;parent.add(m);return m;}
  function texture(draw,w=768,h=512) {const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;}
  const wood=texture((c,w,h)=>{
    c.fillStyle='#c8a572';c.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=3){c.strokeStyle=`rgba(97,62,29,${.025+(y%13)/340})`;c.lineWidth=.7+(y%4)*.2;c.beginPath();for(let x=0;x<=w;x+=12){const py=y+Math.sin(x*.012+y*.19)*2+Math.sin(x*.004+y)*3;x?c.lineTo(x,py):c.moveTo(x,py);}c.stroke();}
    for(let y=0;y<h;y+=128){c.fillStyle='#6e4c2c18';c.fillRect(0,y,w,1);}
  });
  const woodMat=new T.MeshStandardMaterial({map:wood,roughness:.78,color:'#f4e6cb'});
  const top=2.84;
  slab(8,.26,4.5,woodMat,models,0,top,0);
  slab(7.92,.07,4.42,material('#9a7646'),models,0,top-.16,0);
  for(const x of [-3.28,3.28])for(const z of [-1.62,1.62])box(.15,2.69,.15,metal,models,x,1.35,z);
  for(const x of [-3.28,3.28])box(.12,.12,3.42,metal,models,x,.28,0);
  box(6.7,.13,.12,metal,models,0,2.5,-1.6);
  const floor=new T.Mesh(new T.PlaneGeometry(70,70),material('#7b866e'));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const wall=new T.Mesh(new T.PlaneGeometry(36,20),material('#52644f'));wall.position.set(0,7,-5);scene.add(wall);
  scene.add(new T.HemisphereLight('#fff8de','#354b38',1.8));
  const sun=new T.DirectionalLight('#fff0ce',2.9);sun.position.set(-5,10,5);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.5,far:25});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun);
  const fill=new T.DirectionalLight('#d6e8df',1.1);fill.position.set(5,5,-2);scene.add(fill);
  const objects={};
  function item(key,x,z,rotation=0) {const g=new T.Group();g.position.set(x,top+.2,z);g.rotation.y=rotation;g.userData={key,baseY:top+.2};models.add(g);objects[key]=g;return g;}
  function decal(group,w,d,draw,y=.1) {const map=texture(draw);const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({map,roughness:.9}));m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;group.add(m);return m;}
  const folder=item('projects',-2.12,.35,-.14);
  slab(2.05,.05,1.38,gold,folder);slab(.75,.04,.27,gold,folder,-.53,.01,-.72);
  for(let i=0;i<3;i++)slab(1.91,.012,1.2,paper,folder,.02*i,.045+i*.018,-.03);
  slab(2.05,.025,1.18,material('#dfc88a'),folder,0,.12,.1);
  decal(folder,1.92,1.12,(c,w,h)=>{c.fillStyle='#dfc88a';c.fillRect(0,0,w,h);c.fillStyle='#7d6739';c.font='34px sans-serif';c.fillText('01 / HỒ SƠ',58,100);c.fillStyle='#263b2f';c.font='bold 87px Georgia';c.fillText('Dự án',58,290);c.strokeStyle='#aa925666';c.beginPath();c.moveTo(58,362);c.lineTo(w-58,362);c.stroke();c.font='25px sans-serif';c.fillText('NGUYỄN VĂN LINH',58,425);},.19);
  const notebook=item('notes',-.08,-.58,.1);
  slab(1.55,.15,1.92,ink,notebook);slab(1.46,.08,1.78,cream,notebook,.02,.02,0);slab(1.55,.025,1.92,sage,notebook,0,.085,0);
  decal(notebook,1.44,1.8,(c,w,h)=>{c.fillStyle='#64785c';c.fillRect(0,0,w,h);c.fillStyle='#dce0c8';c.font='25px sans-serif';c.fillText('GHI CHÉP CÁ NHÂN',60,85);c.fillStyle='#f8f1dc';c.font='italic bold 76px Georgia';c.fillText('Một vài',60,237);c.fillText('ghi chú.',60,325);c.fillStyle='#d4b665';c.fillRect(61,390,95,4);},.145);
  box(.13,.015,.4,gold,notebook,.48,.05,.99);
  const photo=item('photo',2.18,-.78,-.12);slab(1.35,.06,1.65,paper,photo);
  decal(photo,1.27,1.57,(c,w,h)=>{c.fillStyle='#fff9e9';c.fillRect(0,0,w,h);c.fillStyle='#e0e5cf';c.fillRect(38,25,w-76,355);c.fillStyle='#dab85e';c.beginPath();c.arc(550,117,48,0,Math.PI*2);c.fill();c.fillStyle='#9dac8a';c.beginPath();c.moveTo(38,290);c.quadraticCurveTo(260,180,410,285);c.quadraticCurveTo(570,340,w-38,250);c.lineTo(w-38,380);c.lineTo(38,380);c.fill();c.fillStyle='#6d876a';c.beginPath();c.moveTo(38,345);c.quadraticCurveTo(330,260,w-38,350);c.lineTo(w-38,380);c.lineTo(38,380);c.fill();c.fillStyle='#314734';c.font='italic 43px Georgia';c.fillText('Ngoài công việc',45,458);},.075);
  const card=item('contact',2.05,1.18,.11);slab(1.78,.035,.9,paper,card);
  decal(card,1.71,.84,(c,w,h)=>{c.fillStyle='#fff9e9';c.fillRect(0,0,w,h);c.fillStyle='#2b4233';c.font='bold 112px Georgia';c.fillText('Linh.',53,200);c.font='26px sans-serif';c.fillText('NGUYỄN VĂN LINH',55,290);c.strokeStyle='#bfc3aa';c.beginPath();c.moveTo(55,350);c.lineTo(w-55,350);c.stroke();c.font='27px sans-serif';c.fillText('GIỮ LIÊN LẠC',55,435);},.065);
  const keyboard=new T.Group();keyboard.position.set(-.25,top+.2,1.64);keyboard.rotation.y=-.07;models.add(keyboard);
  slab(2,.1,.63,cream,keyboard);const keys=new T.InstancedMesh(new T.BoxGeometry(.125,.035,.105),material('#e4e5d7'),44);const matrix=new T.Matrix4();let k=0;
  for(let row=0;row<4;row++)for(let col=0;col<11;col++){matrix.makeTranslation(-.83+col*.164,.075,-.22+row*.144);keys.setMatrixAt(k++,matrix);}keys.castShadow=true;keyboard.add(keys);
  const lamp=new T.Group();lamp.position.set(-3.05,top+.15,-1.46);models.add(lamp);
  cylinder(.38,.42,.08,metal,lamp,0,.04,0);rod([0,.08,0],[0,1.18,0],.035,metal,lamp);rod([0,1.18,0],[.68,1.72,0],.04,metal,lamp);
  const shade=new T.Mesh(new T.CylinderGeometry(.16,.46,.4,32,1,true),new T.MeshStandardMaterial({color:'#d6b45d',roughness:.45,metalness:.18,side:T.DoubleSide}));shade.position.set(.77,1.66,0);shade.rotation.z=-.2;shade.castShadow=true;lamp.add(shade);
  const bulb=new T.Mesh(new T.CircleGeometry(.4,32),new T.MeshBasicMaterial({color:'#ffefb4',side:T.DoubleSide}));bulb.rotation.x=Math.PI/2;bulb.position.set(.8,1.46,0);lamp.add(bulb);
  const warm=new T.PointLight('#ffdda1',.9,4);warm.position.set(.8,1.43,0);lamp.add(warm);
  const mug=new T.Group();mug.position.set(3.13,top+.15,.46);models.add(mug);cylinder(.27,.23,.43,cream,mug,0,.22,0);
  const coffee=new T.Mesh(new T.CircleGeometry(.235,32),material('#533823'));coffee.rotation.x=-Math.PI/2;coffee.position.y=.443;mug.add(coffee);
  const handle=new T.Mesh(new T.TorusGeometry(.18,.055,10,24),cream);handle.position.set(.3,.25,0);mug.add(handle);
  const plant=new T.Group();plant.position.set(3.08,top+.16,-1.7);models.add(plant);cylinder(.25,.18,.38,material('#ba9470'),plant,0,.19,0);
  for(let i=0;i<6;i++){const angle=i*Math.PI/3;rod([0,.3,0],[Math.sin(angle)*.2,.85+(i%2)*.12,Math.cos(angle)*.2],.012,ink,plant);const leaf=new T.Mesh(new T.SphereGeometry(1,10,8),sage);leaf.scale.set(.12,.3,.04);leaf.position.set(Math.sin(angle)*.2,.82+(i%2)*.12,Math.cos(angle)*.2);leaf.rotation.z=Math.sin(angle)*.6;leaf.rotation.y=angle;plant.add(leaf);}
  rod([-1.25,top+.22,1.3],[-1.6,top+.22,.55],.025,metal,models);
  const pollen=new T.Mesh(new T.SphereGeometry(.035,12,8),gold);pollen.scale.set(2.5,.25,1);pollen.position.set(-2.8,top+.17,1.6);models.add(pollen);

  const raycaster=new T.Raycaster(),ndc=new T.Vector2(),target=new T.Vector3(0,2.3,0);
  let azimuth=.32,elevation=.65,targetAzimuth=.32,targetElevation=.65,visible=false,frame=0,lastFrame=0,hovered=null,drag=null,disposed=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function paused(){return reduced.matches||document.hidden||document.body.matches('.motion-paused,.modal-open');}
  function cameraPosition(){const r=16;camera.position.set(Math.sin(azimuth)*Math.cos(elevation)*r,target.y+Math.sin(elevation)*r,Math.cos(azimuth)*Math.cos(elevation)*r);camera.lookAt(target);camera.updateMatrixWorld();}
  function fit(){if(disposed)return;const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;renderer.setSize(width,height,false);cameraPosition();models.updateMatrixWorld(true);const b=new T.Box3().setFromObject(models),min=b.min,max=b.max;let x=0,y=0;for(const xx of [min.x,max.x])for(const yy of [min.y,max.y])for(const zz of [min.z,max.z]){const p=new T.Vector3(xx,yy,zz).applyMatrix4(camera.matrixWorldInverse);x=Math.max(x,Math.abs(p.x));y=Math.max(y,Math.abs(p.y));}const aspect=width/height,half=Math.max(y*1.12,x/aspect*1.13);camera.zoom=width>760?1.2:1;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();render();}
  function render(){renderer.render(scene,camera);}
  function animate(time){frame=0;if(disposed||!visible||paused())return;if(time-lastFrame<33){frame=requestAnimationFrame(animate);return;}lastFrame=time;azimuth+=(targetAzimuth-azimuth)*.045;elevation+=(targetElevation-elevation)*.045;const base=azimuth;azimuth+=Math.sin(time*.00035)*.035;cameraPosition();azimuth=base;for(const [key,g]of Object.entries(objects)){const y=g.userData.baseY+(hovered === key ? .14 : 0);g.position.y+=(y-g.position.y)*.12;}render();frame=requestAnimationFrame(animate);}
  function update(){cancelAnimationFrame(frame);frame=0;if(disposed)return;if(visible&&!paused())frame=requestAnimationFrame(animate);else render();}
  function hit(event){const r=canvas.getBoundingClientRect();ndc.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(ndc,camera);const hits=raycaster.intersectObjects(Object.values(objects),true);for(const h of hits){let p=h.object;while(p&&!p.userData.key)p=p.parent;if(p?.userData.key)return p.userData.key;}return null;}
  function select(key){if(key==='projects')stage.querySelector('.desk-folder').click();else stage.querySelector(`.desk-item[data-desk="${key}"]`)?.click();}
  canvas.addEventListener('pointerdown',e=>{try{canvas.setPointerCapture(e.pointerId);}catch{}drag={x:e.clientX,y:e.clientY,moved:false};});
  canvas.addEventListener('pointermove',e=>{if(drag&&Math.abs(e.clientX-drag.x)>8&&Math.abs(e.clientX-drag.x)>Math.abs(e.clientY-drag.y)){drag.moved=true;if(!paused()){targetAzimuth=T.MathUtils.clamp(.32+(e.clientX-drag.x)*.003,-.05,.65);targetElevation=.65;}}if(e.pointerType==='mouse'){hovered=hit(e);canvas.style.cursor=hovered?'pointer':'grab';}});
  canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const key=hit(e);if(key)select(key);}drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});
  canvas.addEventListener('pointercancel',()=>drag=null);
  canvas.addEventListener('pointerleave',()=>{drag=null;hovered=null;});
  controls.querySelectorAll('[data-scene-action]').forEach(button=>{button.addEventListener('click',()=>select(button.dataset.sceneAction));button.addEventListener('pointerenter',()=>hovered=button.dataset.sceneAction);button.addEventListener('pointerleave',()=>hovered=null);button.addEventListener('focus',()=>hovered=button.dataset.sceneAction);button.addEventListener('blur',()=>hovered=null);});
  function cleanup(){cancelAnimationFrame(frame);resize.disconnect();viewport.disconnect();state.disconnect();document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);window.removeEventListener('pagehide',onPageHide);const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(node=>{if(node.geometry)geometries.add(node.geometry);if(node.material)for(const mat of(Array.isArray(node.material)?node.material:[node.material]))materials.add(mat);});for(const mat of materials){for(const value of Object.values(mat))if(value?.isTexture)textures.add(value);mat.dispose();}for(const g of geometries)g.dispose();for(const t of textures)t.dispose();renderer.dispose();}
  function fallback(){if(disposed)return;disposed=true;cleanup();stage.classList.remove('is-3d');stage.dataset.scene='fallback';for(const el of htmlItems)el.style.removeProperty('display');controls.hidden=true;host.replaceChildren();}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
  const resize=new ResizeObserver(fit);resize.observe(host);
  const viewport=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);update();});viewport.observe(stage);
  const state=new MutationObserver(update);state.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
  fit();for(const el of htmlItems)el.style.display='none';stage.classList.add('is-3d');stage.dataset.scene='ready';controls.hidden=false;
  fit();update();
  function onPageHide(event){if(event.persisted)return;disposed=true;cleanup();}
  window.addEventListener('pagehide',onPageHide);
}
