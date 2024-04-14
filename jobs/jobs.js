const cron = require('node-cron');
const Reservation = require('../models/reservation');
const Annonce = require('../models/annonce'); 
const Tournoi = require('../models/tournoi');

// This task is scheduled to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running a job at 00:00 to delete reservations older than 6 months');
    
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

    try {
        // Delete reservations where 'jour' is older than 6 months from today
        const { deletedCount } = await Reservation.deleteMany({ jour: { $lte: sixMonthsAgo } });

        console.log(`${deletedCount} outdated reservations have been deleted.`);
    } catch (error) {
        console.error('Failed to delete outdated reservations:', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Algiers" // Set this to your timezone or the timezone relevant to the application
});




cron.schedule('0 0 * * *', async () => {
    console.log('Running a job to delete outdated annonces');

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
        const { deletedCount } = await Annonce.deleteMany({ createdAt: { $lte: sixMonthsAgo } });
        console.log(`${deletedCount} outdated annonces have been deleted.`);
    } catch (error) {
        console.error('Failed to delete outdated annonces:', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Algiers" // Adjust timezone as necessary
});





cron.schedule('0 0 * * *', async () => {
    console.log('Running a job to delete tournois that ended more than 6 months ago');

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
        const { deletedCount } = await Tournoi.deleteMany({ fin_date: { $lte: sixMonthsAgo } });
        console.log(`${deletedCount} tournois that ended more than 6 months ago have been deleted.`);
    } catch (error) {
        console.error('Failed to delete tournois:', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Algiers" // Adjust timezone as necessary
});