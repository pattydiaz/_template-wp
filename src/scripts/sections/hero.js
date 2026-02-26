const hero = $$('.hero-animate');

const Hero = {
  
  init() {
    this.build();
  },

  build() {
    hero.forEach(h => {
      const wrapper = $(h);
      if (wrapper.isVisible()) this.animate(wrapper);
    });
  },

  animate($hero) {
    const el = $hero.el;
    const parent = $hero.closest('.hero');
    const height = el.offsetHeight;

    const bg = $hero.find('.hero-bg').el;
    const heading = $hero.find('.hero-heading').el;
    const indicator = parent.find('.hero-indicator').el;

    const tl = gsap.timeline({ paused: true });

    const addIf = (element, tweenCallback) => {
      if (element) tweenCallback();
    };

    addIf(bg, () => {
      tl.to(bg, { scale: 1.1, duration: 1, ease: 'power1.inOut' });
    });

    addIf(heading, () => {
      tl.to(heading, { scale: 0.9, duration: 1, ease: 'power1.inOut' }, "<");
    });

    addIf(indicator, () => {
      tl.to(indicator, { y: '100%', duration: 0.15, ease: 'power1.inOut' }, "<");
    });

    addIf(wave, () => {
      tl.to(wave, { maskPosition: "50% 0", WebkitMaskPosition: "50% 0", duration: 1, ease: "sine.inOut" }, "<");
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${height + 0}`,
      animation: tl,
      scrub: true,

      onLeave: () => {
        $hero.addClass("hero--hidden");
      },

      onEnterBack: () => {
        $hero.removeClass("hero--hidden");
      }
    });
  }
};
