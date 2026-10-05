const C='elysium-v12',A=['./','index.html','style.css','app.js','manifest.json','logo.png','icon-192.png','icon-512.png','skin-fade-classico.jpg','high-fade.jpg','mid-fade-penteado.jpg','low-fade-barba-desenhada.jpg','fade-barba-alinhada.jpg','cabelo-cacheado.jpg','topo-texturizado.jpg','corte.jpg','barba-alinhada.jpg','barba-aparada.jpg','barba.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(A.map(u=>c.add(u)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('index.html'))))});
 
