import cron from 'node-cron';
import { UserModel } from '../models/users.model';
import { CRON_SCHEDULE_TIME } from '../constants/cron.schedule';

export const cronSchedule = () => {
  cron.schedule(CRON_SCHEDULE_TIME, async () => {
    try {
      console.log('Running cron job...');

      // Logic to delete users who haven't confirmed their email
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const now = Date.now();

      const usersToDelete = await UserModel.find({
        active: 'non-active',
        createdAt: { $lt: new Date(now - expirationTime) },
      });

      if (usersToDelete.length > 0) {
        await UserModel.deleteMany({
          _id: { $in: usersToDelete.map((user) => user._id) },
        });

        console.log(
          `${usersToDelete.length} users have been deleted due to not confirming their email.`
        );
      } else {
        console.log('No users need to be deleted.');
      }
    } catch (error) {
      console.error('An error occurred while running the cron job:', error);
    }
  });
};
