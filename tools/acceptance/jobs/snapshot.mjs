// Keep audit polling below the application's 120 reads/account/minute limit.
// NPC interaction and attacks remain native; this only spaces read requests.
export function pacedSnapshot(read, interval = 650) {
 let last = 0;
 let pending = Promise.resolve();
 return () => {
  const next = pending.then(async () => {
   const delay = interval - (Date.now() - last);
   if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
   last = Date.now();
   return read();
  });
  pending = next.catch(() => {});
  return next;
 };
}
