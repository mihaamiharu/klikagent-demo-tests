import { test, expect } from '../../../fixtures';
import { BookAppointmentPage } from '../../pages/book-appointment/BookAppointmentPage';

export { BookAppointmentPage };

test.use({
  bookAppointmentPage: async ({ page }, use) => {
    await use(new BookAppointmentPage(page));
  },
});