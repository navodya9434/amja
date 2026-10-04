// Section background video
// Replaces the old animated starfield on all .starfield sections.

(function () {
  const VIDEO_SRC = 'images/photo/commonSec.mp4';

  function initBackgroundVideo(canvas) {
    const box = canvas.parentElement;
    if (!box) return;

    // Remove the old canvas
    canvas.style.display = 'none';

    // Prevent duplicate videos
    if (box.querySelector('.section-bg-video')) return;

    const video = document.createElement('video');

    video.className = 'section-bg-video';
    video.src = VIDEO_SRC;

    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';

    // Background positioning
    video.style.position = 'absolute';
    video.style.inset = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '0';
    video.style.pointerEvents = 'none';

    // Keep the existing content above the video
    box.style.position = 'relative';

    box.insertBefore(video, box.firstChild);

    // Start playback
    video.play().catch(function () {
      // Browser may delay autoplay until interaction.
    });
  }

  function boot() {
    document
      .querySelectorAll('canvas.starfield')
      .forEach(initBackgroundVideo);
  }

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot);
  }
})();