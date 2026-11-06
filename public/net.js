// Room messaging. Online: Supabase Realtime (broadcast + presence). Without config: tabs of one browser (for testing).
(function () {
  const cfg = window.DUNG_CONFIG || {};
  const online = !!(cfg.supabaseUrl && cfg.supabaseKey && window.supabase);
  let client = null;

  class SupabaseNet {
    constructor(code, myId, onMessage, onLeave) {
      if (!client) client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, { realtime: { params: { eventsPerSecond: 20 } } });
      this.channel = client.channel(`dung-${code}`, {
        config: { broadcast: { self: false }, presence: { key: myId } },
      });
      this.channel.on('broadcast', { event: 'm' }, ({ payload }) => onMessage(payload));
      this.channel.on('presence', { event: 'leave' }, ({ key, currentPresences }) => {
        if (!currentPresences || currentPresences.length === 0) onLeave(key);
      });
    }

    connect() {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('TIMED_OUT')), 10000);
        this.channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.channel.track({ at: Date.now() });
            resolve();
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            reject(new Error(status));
          }
        });
      });
    }

    send(msg) {
      this.channel.send({ type: 'broadcast', event: 'm', payload: msg });
    }

    close() {
      client.removeChannel(this.channel);
    }
  }

  class LocalNet {
    constructor(code, myId, onMessage, onLeave) {
      this.myId = myId;
      this.bc = new BroadcastChannel(`dung-${code}`);
      this.lastSeen = new Map();
      this.bc.onmessage = ({ data }) => {
        if (data.from) this.lastSeen.set(data.from, Date.now());
        if (data.t === 'hb') return;
        if (data.t === 'bye') { this.lastSeen.delete(data.from); onLeave(data.from); return; }
        onMessage(data);
      };
      this.hb = setInterval(() => {
        this.bc.postMessage({ t: 'hb', from: myId });
        for (const [id, at] of this.lastSeen) {
          if (Date.now() - at > 6000) { this.lastSeen.delete(id); onLeave(id); }
        }
      }, 2000);
    }

    connect() { return Promise.resolve(); }
    send(msg) { this.bc.postMessage(msg); }

    close() {
      this.bc.postMessage({ t: 'bye', from: this.myId });
      clearInterval(this.hb);
      this.bc.close();
    }
  }

  window.DungNet = { online, Net: online ? SupabaseNet : LocalNet };
})();
