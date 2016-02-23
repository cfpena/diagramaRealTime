module.exports.policies = {
  '*': ['passport', 'sessionAuth'],
  'auth': {
     '*': ['passport']
   }

};
