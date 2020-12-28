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
}
