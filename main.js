(function () {
  var nav = document.getElementById("nav");
  var video = document.getElementById("hero-video");
  var source = document.getElementById("hero-source");
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

  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var frame = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var lastFocus = null;

    function openBox(src, alt) {
      lastFocus = document.activeElement;
      frame.src = src;
      frame.alt = alt || "";
      lightbox.hidden = false;
      requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
      closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }

    function closeBox() {
      lightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      setTimeout(function () {
        if (!lightbox.classList.contains("is-open")) {
          lightbox.hidden = true;
          frame.removeAttribute("src");
        }
      }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") closeBox();
    }

    document.querySelectorAll(".shot").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        openBox(btn.getAttribute("data-full") || (img && img.currentSrc), img ? img.alt : "");
      });
    });

    closeBtn.addEventListener("click", closeBox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeBox();
    });
  }
})();
