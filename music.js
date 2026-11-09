(() => {
  "use strict";

  const tracks = Array.isArray(window.MIKA_PLAYLIST)
    ? window.MIKA_PLAYLIST.filter(t => t && t.src)
    : [];

  // One audio object for the lifetime of this page.
  const audio = new Audio();
  audio.preload = "metadata";
  audio.controls = false;
  audio.id = "mika-global-audio";

  const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5L18 12L8.5 18.5Z" fill="currentColor"/></svg>`;
  const PAUSE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>`;

  let index = 0;
  const modes = ["sequence", "random", "single"];
  let mode = "sequence";
  let hasPlayed = false;
  let dock = null;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  }

  function part(id) {
    return document.getElementById("mika-player-root")?.querySelector(`#${id}`) ?? null;
  }

  function updateDock() {
    if (!dock) return;
    const onListenPage = !!document.getElementById("mika-player-root");
    dock.hidden = !hasPlayed || onListenPage;
    const t = tracks[index];
    dock.querySelector("#mika-dock-title").textContent = t?.title || "未命名歌曲";
    dock.querySelector("#mika-dock-artist").textContent = t?.artist || "";
    const cover = dock.querySelector("#mika-dock-cover");
    if (t?.cover) {
      if (cover.getAttribute("src") !== t.cover) {
        delete cover.dataset.broken;
        cover.src = t.cover;
      }
      if (!cover.dataset.broken) cover.hidden = false;
    } else {
      cover.hidden = true;
    }
  }

  function updateTrackUI() {
    const t = tracks[index];
    if (!t) return;

    if (part("mika-music-title")) part("mika-music-title").textContent = t.title || "未命名歌曲";
    if (part("mika-music-artist")) part("mika-music-artist").textContent = t.artist || "";
    const cover = part("mika-music-cover");
    if (cover) {
      cover.hidden = !t.cover;
      if (t.cover && cover.getAttribute("src") !== t.cover) cover.src = t.cover;
    }
    updateDock();
  }

  function updateTime() {
    const length = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const current = part("mika-current");
    const duration = part("mika-duration");
    const seek = part("mika-seek");
    if (current) current.textContent = formatTime(audio.currentTime);
    if (duration) duration.textContent = length ? formatTime(length) : "--:--";
    if (seek) seek.value = length ? String(Math.round(audio.currentTime / length * 1000)) : "0";
    if (dock) {
      dock.querySelector("#mika-dock-current").textContent = formatTime(audio.currentTime);
      dock.querySelector("#mika-dock-duration").textContent = length ? formatTime(length) : "--:--";
      dock.querySelector("#mika-dock-seek").value = length ? String(Math.round(audio.currentTime / length * 1000)) : "0";
    }
  }

  function updatePlaying() {
    const card = part("mika-play")?.closest(".mika-music");
    if (card) card.classList.toggle("is-playing", !audio.paused);
    const button = part("mika-play");
    if (button) {
      button.innerHTML = audio.paused ? PLAY_ICON : PAUSE_ICON;
      button.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
      button.title = audio.paused ? "播放" : "暂停";
    }
    if (dock) {
      const miniPlay = dock.querySelector("#mika-dock-play");
      miniPlay.innerHTML = audio.paused ? PLAY_ICON : PAUSE_ICON;
      miniPlay.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
      miniPlay.title = audio.paused ? "播放" : "暂停";
    }
    updateDock();
  }

  function updateMode() {
    const button = part("mika-shuffle");
    if (!button) return;
    const label = {sequence:"顺序播放",random:"随机播放",single:"单曲循环"}[mode];
    button.dataset.mode = mode;
    button.textContent = label;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(mode !== "sequence"));
  }

  function setError(text) {
    const status = part("mika-music-status");
    if (status) status.textContent = text;
  }

  function playAudio() {
    audio.play().catch(err => {
      console.error("Music playback failed:", err);
      setError("播放失败，请检查音频文件路径与格式");
    });
  }

  function loadTrack(nextIndex, shouldPlay = false) {
    if (!tracks.length) return;
    index = (nextIndex + tracks.length) % tracks.length;
    const t = tracks[index];
    audio.pause();
    audio.src = t.src;
    audio.load();
    setError("");
    updateTrackUI();
    updateTime();
    updatePlaying();
    if (shouldPlay) playAudio();
  }

  function nextTrack() {
    if (!tracks.length) return;
    let next;
    if (mode === "random" && tracks.length > 1) {
      next = Math.floor(Math.random() * (tracks.length - 1));
      if (next >= index) next++;
    } else {
      next = (index + 1) % tracks.length;
    }
    loadTrack(next, true);
  }

  function previousTrack() {
    if (!tracks.length) return;
    loadTrack(index - 1, true);
  }

  function mountPlayer() {
    const host = document.getElementById("mika-player-root");
    if (!host) {
      updateDock();
      return;
    }
    if (host.dataset.mikaMounted === "1") {
      updateDock();
      return;
    }
    host.dataset.mikaMounted = "1";
    if (tracks.length === 0) {
      host.textContent = "歌单暂时为空";
      return;
    }

    host.innerHTML = `
      <section class="mika-music" aria-label="音乐播放器">
        <div class="mika-music__disc"><img id="mika-music-cover" alt="当前歌曲封面"></div>
        <div class="mika-music__body">
          <span class="mika-music__eyebrow">我的歌单</span>
          <h3 id="mika-music-title"></h3>
          <p id="mika-music-artist"></p>
          <div class="mika-music__controls">
            <button type="button" id="mika-prev" aria-label="上一首">上一首</button>
            <button type="button" id="mika-play" aria-label="播放">播放</button>
            <button type="button" id="mika-next" aria-label="下一首">下一首</button>
            <button type="button" id="mika-shuffle">顺序播放</button>
          </div>
          <div class="mika-music__timeline">
            <time id="mika-current">0:00</time>
            <input type="range" id="mika-seek" min="0" max="1000" step="1" value="0" aria-label="调整播放进度">
            <time id="mika-duration">--:--</time>
          </div>
          <p id="mika-music-status" class="mika-music__status" role="status"></p>
        </div>
      </section>`;

    part("mika-play").addEventListener("click", () => audio.paused ? playAudio() : audio.pause());
    part("mika-prev").addEventListener("click", previousTrack);
    part("mika-next").addEventListener("click", nextTrack);
    part("mika-shuffle").addEventListener("click", () => {
      mode = modes[(modes.indexOf(mode) + 1) % modes.length];
      updateMode();
    });
    part("mika-seek").addEventListener("input", event => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Number(event.target.value) / 1000 * audio.duration;
      }
    });
    part("mika-music-cover").addEventListener("error", event => {
      event.currentTarget.hidden = true;
    });

    updateTrackUI();
    updatePlaying();
    updateMode();
    updateTime();
    updateDock();
  }

  function init() {
    // The dock lives outside #app, so SPA route changes never delete it.
    dock = document.createElement("aside");
    dock.id = "mika-global-dock";
    dock.className = "mika-global-dock";
    dock.hidden = true;
    dock.setAttribute("aria-label", "全站音乐控制");
    dock.innerHTML = `
      <div class="mika-global-dock__row">
        <img class="mika-global-dock__cover" id="mika-dock-cover" alt="当前歌曲封面">
        <div class="mika-global-dock__meta">
          <small>☾ M1kAovo · Listen</small>
          <strong id="mika-dock-title"></strong>
          <span id="mika-dock-artist"></span>
        </div>
        <button type="button" id="mika-dock-play" class="mika-global-dock__play" aria-label="播放"></button>
        <button type="button" id="mika-dock-stop" class="mika-global-dock__close" aria-label="关闭并停止音乐" title="结束播放">×</button>
      </div>
      <div class="mika-global-dock__timeline">
        <time id="mika-dock-current">0:00</time>
        <input id="mika-dock-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="调整全站音乐进度">
        <time id="mika-dock-duration">--:--</time>
      </div>
      <div class="mika-global-dock__audio"></div>`;
    document.body.appendChild(dock);
    dock.querySelector(".mika-global-dock__audio").appendChild(audio);
    dock.querySelector("#mika-dock-play").addEventListener("click", () => audio.paused ? playAudio() : audio.pause());
    dock.querySelector("#mika-dock-seek").addEventListener("input", event => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Number(event.target.value) / 1000 * audio.duration;
      }
    });
    dock.querySelector("#mika-dock-cover").addEventListener("error", event => {
      event.currentTarget.hidden = true;
      event.currentTarget.dataset.broken = "1";
    });
    dock.querySelector("#mika-dock-stop").addEventListener("click", () => {
      audio.pause();
      audio.currentTime = 0;
      hasPlayed = false;
      updatePlaying();
    });

    audio.addEventListener("play", () => {
      hasPlayed = true;
      updatePlaying();
    });
    audio.addEventListener("pause", updatePlaying);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateTime);
    audio.addEventListener("ended", () => {
      if (mode === "single") {
        audio.currentTime = 0;
        playAudio();
      } else {
        nextTrack();
      }
    });
    audio.addEventListener("error", () => setError("音频加载失败，请检查文件是否存在"));

    if (tracks.length) loadTrack(0);
    const app = document.getElementById("app");
    if (app) new MutationObserver(mountPlayer).observe(app, {childList:true});
    mountPlayer();
    window.addEventListener("hashchange", () => requestAnimationFrame(mountPlayer));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
