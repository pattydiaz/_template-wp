const Project = {
  init: function() {
    loaded = true;
    Scrolling.top();
    Page.init();
    Project.build();
  },
  build: function() {
    Buttons.init();
    Parallax.init();
    // Inputs.init();
    // Slider.init();
    // Newsletter.init();
    Header.init();
    // Navigation.init();
    // Modal.init();
  }
};


document.addEventListener('DOMContentLoaded', () => {
  Project.init();
});