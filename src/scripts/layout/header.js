let header_anim;
let header_height;

const Header = {
  
  init() {
    this.build();
  },

  build() {
    if (header.isVisible()) {
      this.height();
      this.scroll();
    }
  },

  height() {
    header_height = header.el.offsetHeight;
    body.el.style.setProperty("--hh", `${header_height}px`);

    w.on("resize", () => {
      header_height = header.el.offsetHeight;
      body.el.style.setProperty("--hh", `${header_height}px`);
    });
  },

  scroll() {
    header_anim = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: body.el,
        start: "200px 0",
        end: "100% 0",
        // markers: true,

        onUpdate: self => {
          const scrolledPastHeader = self.scroll() > header_height;
          const scrollingDown = scrolledPastHeader && self.direction === 1;
          const scrollingUp = self.direction === -1;

          const navActive = body.el.classList.contains("nav-active");

          if (self.progress > 0.0001) {
            header.el.classList.add("header--scroll");
          } else {
            header.el.classList.remove("header--scroll");
          }

          if (scrollingDown && !navActive) { header_anim.play(); }
          if (scrollingUp) { header_anim.reverse(); }
        }
      }
    });

    header_anim.to(header.el, {
      y: "-150%",
      duration: 0.4,
      ease: "power2.inOut"
    });
  },

};
