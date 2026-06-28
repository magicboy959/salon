INSERT IGNORE INTO `Permission` (`id`, `key`, `name`) VALUES
  ('perm-bookings-read', 'bookings.read', 'bookings read'),
  ('perm-bookings-write', 'bookings.write', 'bookings write'),
  ('perm-customers-read', 'customers.read', 'customers read'),
  ('perm-employees-write', 'employees.write', 'employees write'),
  ('perm-payments-read', 'payments.read', 'payments read'),
  ('perm-cms-write', 'cms.write', 'cms write'),
  ('perm-reports-read', 'reports.read', 'reports read'),
  ('perm-settings-write', 'settings.write', 'settings write');

INSERT IGNORE INTO `Role` (`id`, `name`) VALUES
  ('role-super-admin', 'SUPER_ADMIN'),
  ('role-admin', 'ADMIN'),
  ('role-manager', 'MANAGER'),
  ('role-barber', 'BARBER'),
  ('role-customer', 'CUSTOMER');

INSERT IGNORE INTO `RolePermission` (`roleId`, `permissionId`)
SELECT 'role-super-admin', `id` FROM `Permission`;

INSERT IGNORE INTO `User` (`id`, `name`, `email`, `passwordHash`, `twoFactorOn`, `createdAt`, `updatedAt`) VALUES
  ('admin-user', 'Alshanab Admin', 'admin@alshamyalaswad.com', '$2b$12$Z6BSBuhlRiVrXa/IzehpQ.QRYMUdV3SIwawnV4Wjs1xVzeRNelKqq', false, NOW(3), NOW(3));

INSERT IGNORE INTO `UserRole` (`userId`, `roleId`) VALUES
  ('admin-user', 'role-super-admin');

INSERT IGNORE INTO `Branch` (`id`, `name`, `address`, `latitude`, `longitude`, `phone`) VALUES
  ('main-dubai-branch', 'Dubai Satwa Branch', 'Dubai Satwa star building shop number 41', 25.231300000000000000000000000000, 55.279200000000000000000000000000, '+971 50 801 2791');

INSERT IGNORE INTO `EmailTemplate` (`id`, `key`, `subject`, `html`) VALUES
  ('email-booking-confirmation', 'booking-confirmation', 'Your appointment is confirmed', '<p>Your appointment is confirmed.</p>');

INSERT IGNORE INTO `WhatsAppTemplate` (`id`, `key`, `message`) VALUES
  ('whatsapp-booking-reminder', 'booking-reminder', 'Your appointment is coming up soon.');
