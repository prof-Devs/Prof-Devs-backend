
const funcccccc = (req, res, next) => {

    console.log('fron testing', req.user);
    next();
    //   try {
    //     if (req.user.capability.includes('create')) {
    //       next('not allowed');
    //     }
    //     else {
    //       next('Access Denied');
    //     }
    //   } catch (e) {
    //     next('AKEEEEEEEEED');
    //   }
    // }
}

module.exports = funcccccc;

