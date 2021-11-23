const scheduler = require('node-schedule');
const l = require('./logger');

const memberService = require('../api/member/service');

const memberGradeUp = scheduler.scheduleJob('00 30 4 * * *', async () => {
  l.info('START runMemberGradeUp BATCH >>> ');

  // await memberService.runMemberGradeUp();

  l.info('END runMemberGradeUp BATCH <<< ');
});

module.exports = {
  scheduler,
  memberGradeUp,
};
