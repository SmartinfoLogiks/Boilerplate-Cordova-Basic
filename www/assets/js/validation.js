<<<<<<< HEAD
require(["npmjs/validatorjs/dist/validator"], function(obj) {
  window.Validator = obj;
});

=======
>>>>>>> bd6cca3681af460ab98c52e67a873436b1961aa5
function validateRule(formData, ruleObj) {
    let validation = new Validator(formData, ruleObj);

    return {
        "status": validation.passes(),
        "errors": validation.errors.all()
    };
}

function validate(formData, ruleKey) {
    let data = {
      name: 'John',
      email: 'johndoe@gmail.com',
      age: 28
    };
     
    let rules = {
      name: 'required',
      email: 'required|email',
      age: 'min:18'
    };
     
    let validation = new Validator(data, rules);

    validation.passes(); // true
    validation.fails(); // false
<<<<<<< HEAD
}
=======
}
>>>>>>> bd6cca3681af460ab98c52e67a873436b1961aa5
