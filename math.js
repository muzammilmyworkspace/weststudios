(function(root){'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t),sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const d=Math.hypot(...a)||1;return a.map(x=>x/d)};
const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function mul(a,b){const out=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out}
function transform(m,p){return [0,1,2,3].map(r=>m[r]*p[0]+m[4+r]*p[1]+m[8+r]*p[2]+m[12+r]*(p[3]===undefined?1:p[3]))}
function perspective(fov,aspect,near=.08,far=350){const f=1/Math.tan(fov/2),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]}
function lookAt(eye,target){const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}
const PATH=[
[0,[0,1.7,7],[0,2.7,0]],[.10,[0,1.7,-10],[0,2.6,-28]],[.14,[0,1.8,-22],[5.8,3,-22]],[.225,[0,1.8,-22],[5.8,3,-22]],[.25,[0,1.8,-32],[0,2.6,-52]],
[.30,[0,1.9,-50],[-7.8,3.1,-50]],[.385,[0,1.9,-50],[-7.8,3.1,-50]],[.40,[0,1.8,-69],[0,2.8,-92]],
[.445,[0,1.8,-83],[7.6,3.2,-85]],[.475,[0,1.8,-83],[7.6,3.2,-85]],[.49,[0,1.8,-96],[-7.6,3.2,-98]],[.515,[0,1.8,-96],[-7.6,3.2,-98]],[.54,[0,1.8,-110],[7.6,3.2,-112]],[.57,[0,1.8,-110],[7.6,3.2,-112]],
[.58,[0,1.8,-123],[0,5,-145]],[.61,[0,1.8,-138],[-11.6,5,-140]],[.635,[0,1.8,-138],[-11.6,5,-140]],[.66,[0,1.8,-148],[11.6,5,-150]],[.69,[0,1.8,-148],[11.6,5,-150]],
[.712,[0,1.8,-163],[0,2.9,-193]],[.735,[0,1.8,-184],[-6.5,3,-184]],[.81,[0,1.8,-184],[-6.5,3,-184]],
[.833,[0,1.8,-205],[0,3,-228]],[.842,[4.8,1.8,-210],[0,2.8,-225]],[.853,[4.8,1.8,-220],[0,3.1,-228]],[.869,[0,1.8,-220],[0,3.1,-228]],[.912,[0,1.8,-220],[0,3.1,-228]],
[.934,[0,1.8,-238],[0,3.4,-266]],[.968,[0,1.8,-254],[0,3.4,-266]],[1,[0,1.8,-254],[0,3.4,-266]]];
function sample(p){p=clamp(p);let i=0;while(i<PATH.length-2&&p>PATH[i+1][0])i++;const a=PATH[i],b=PATH[i+1],t=smooth(clamp((p-a[0])/(b[0]-a[0])));return{eye:a[1].map((v,j)=>mix(v,b[1][j],t)),target:a[2].map((v,j)=>mix(v,b[2][j],t))}}
function panelMatrix(vp,anchor,worldWidth,worldHeight,pixelWidth,pixelHeight,yaw,width,height){const right=[Math.cos(yaw),0,-Math.sin(yaw)],up=[0,1,0];const origin=anchor.map((v,i)=>v-right[i]*worldWidth/2+up[i]*worldHeight/2);const U=transform(vp,[...right.map(x=>x*worldWidth/pixelWidth),0]),V=transform(vp,[...up.map(x=>-x*worldHeight/pixelHeight),0]),O=transform(vp,[...origin,1]);const sx=v=>(v[0]+v[3])*width/2,sy=v=>(v[3]-v[1])*height/2;return{css:[sx(U),sy(U),0,U[3],sx(V),sy(V),0,V[3],0,0,1,0,sx(O),sy(O),0,O[3]],depth:O[3],center:transform(vp,[...anchor,1])}}
const fov=aspect=>aspect>=.9?58*Math.PI/180:Math.min(84*Math.PI/180,2*Math.atan(Math.tan(29*Math.PI/180)*.9/aspect))
root.WorldMath={fov,clamp,mix,smooth,sub,dot,cross,norm,identity,mul,transform,perspective,lookAt,sample,panelMatrix,PATH};
})(typeof window!=='undefined'?window:globalThis);
