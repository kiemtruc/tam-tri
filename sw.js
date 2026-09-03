// Không gian trong đầu — cho app chạy được khi mất mạng.
// Đặt file này cùng thư mục với index.html.
const CACHE='kgtd-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
      const net=fetch(e.request).then(res=>{
        if(res&&res.status===200&&res.type==='basic') c.put(e.request,res.clone());
        return res;
      }).catch(()=>hit);
      return hit||net;
    }))
  );
});
