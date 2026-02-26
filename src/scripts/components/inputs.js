const Inputs = {
  
  init() {
    this.build();
  },

  build() {
    this.field();
  },

  field() {
    $$('input, textarea').forEach(el => {
      const $this = $(el);
      const $parent = $(el.closest('.input'));

      $this
        .on('focusin', () => {
          $parent.addClass('active');
        })
        .on('focusout', () => {
          if (el.value === '') {
            $parent.removeClass('active');
          }
        });
    });
  }
};
