const User = require('./User');
const Employee = require('./Employee');
const Service = require('./Service');
const MasterSchedule = require('./MasterSchedule');
const TimeBlock = require('./TimeBlock');
const Appointment = require('./Appointment');
const Payment = require('./Payment');

// 1. Зв'язок Employee (Майстер) <-> MasterSchedule
// Один майстер має багато днів у графіку
Employee.hasMany(MasterSchedule, { foreignKey: 'master_id' });
MasterSchedule.belongsTo(Employee, { foreignKey: 'master_id' });

// 2. Зв'язок Employee <-> TimeBlock
// Один майстер може мати багато блокувань часу (лікарняні, обіди)
Employee.hasMany(TimeBlock, { foreignKey: 'master_id' });
TimeBlock.belongsTo(Employee, { foreignKey: 'master_id' });

// 3. Зв'язки для Appointment (Запис)
// Запис належить Клієнту
User.hasMany(Appointment, { foreignKey: 'client_id', as: 'clientAppointments' });
Appointment.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

// Запис належить Майстру
Employee.hasMany(Appointment, { foreignKey: 'master_id', as: 'masterAppointments' });
Appointment.belongsTo(Employee, { foreignKey: 'master_id', as: 'master' });

// Запис належить Послузі
Service.hasMany(Appointment, { foreignKey: 'service_id' });
Appointment.belongsTo(Service, { foreignKey: 'service_id' });

// Запис може бути створений/підтверджений Адміном (User)
User.hasMany(Appointment, { foreignKey: 'admin_id', as: 'adminAppointments' });
Appointment.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// 4. Зв'язок Appointment <-> Payment
// Один запис має одну оплату (1:1)
Appointment.hasOne(Payment, { foreignKey: 'appointment_id' });
Payment.belongsTo(Appointment, { foreignKey: 'appointment_id' });

module.exports = { User, Employee, Service, MasterSchedule, TimeBlock, Appointment, Payment };