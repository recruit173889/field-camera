// Service Worker for 現場撮影アプリ
// バージョンを上げると古いキャッシュが自動削除されます
const CACHE_NAME = 'field-camera-v1';

const ASSETS = [
  '/field-camera/',
  '/field-camera/index.html',
];

// インストール時にアセットをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // 古い SW が残っていても即座に有効化
  self.skipWaiting();
});

// 有効化時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// リクエスト時: キャッシュ優先、なければネットワーク
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
