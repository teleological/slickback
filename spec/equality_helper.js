(function() {

  jasmine.getEnv().addEqualityTester(function(a,b) {
    if (typeof a == 'string' && b instanceof RegExp) { return b.test(a); }
  });

}).call(this);
