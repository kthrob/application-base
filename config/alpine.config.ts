import type { Alpine } from 'alpinejs';
import focus from '@alpinejs/focus';
import intersect from '@alpinejs/intersect';

export default (Alpine: Alpine) => {
  console.log('AlpineJS: ', Alpine.version);
  Alpine.plugin([intersect, focus]);

  Alpine.store('slidedown', {
    openedfosheezy: false,
    toggle() {
      this.open = !this.open;
    },
  });

  Alpine.data('slidedown-x', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
  }));
};
