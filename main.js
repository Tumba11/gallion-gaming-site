(function () {
  var nav = document.getElementById("nav");
  var video = document.getElementById("chop-video");
  var source = document.getElementById("chop-source");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (video && source && !reduce) {
    var small = window.matchMedia("(max-width: 700px)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var src = (small || saveData) ? "assets/video/hero-sm.mp4" : "assets/video/hero.mp4";
    if (source.getAttribute("src") !== src) {
      source.setAttribute("src", src);
      video.load();
    }
    var playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(function () {});
  } else if (video && reduce) {
    video.removeAttribute("autoplay");
    video.pause();
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".inview").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".inview").forEach(function (el) { el.classList.add("is-in"); });
  }
})();
