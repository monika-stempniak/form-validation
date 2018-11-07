require("./style.scss");

const required = (value) => {
  console.log("val", value);
  const isValue = typeof(value) === "boolean" ? value : Boolean(value.length);
  console.log("isValue", isValue);
  return {
    isValid: isValue,
    errorMessages: isValue ? null : 'This field is required'
  }
}

class FormValidator {
	constructor(form) {
    this.form = form;
    this.virtualForm = {};
    this.createVirtualForm();
    this.addEventListeners();
  }
  createVirtualForm() {
    const formElements = this.form.querySelectorAll('form [name]');
    const tags = ["INPUT", "SELECT", "TEXTAREA"];

    const tagReference = (tagName, type) => 
      tagName === "INPUT" ? this.form.querySelectorAll(`${tagName}[type=${type}]`) : this.form.querySelectorAll(`${tagName}`);

    Array.from(formElements).forEach(element => {
      const {tagName, type, name, value, checked} = element;
      if (tags.indexOf(tagName) !== -1) {
        this.virtualForm[name] = {
          value: type === "checkbox" || type === "radio" ? checked : value,
          type,
          reference: tagReference(tagName, type),
          isValid: true,
          validators: null,
          errorMessages: null,
        }
      }
    });
  }
  addEventListeners() {
    Object.values(this.virtualForm).forEach(element => {
        Array.from(element.reference).forEach(item => {
          item.addEventListener("blur", e => {
            const {name, type, checked, value} = e.target;
            const formElement = this.virtualForm[name];
            if (type === "checkbox") {
              formElement.value = checked;
              console.log(this.virtualForm);
            } else {
              formElement.value = value;
              console.log(this.virtualForm);
            }

            if (formElement.validators) {
              formElement.validators.forEach(validator => {
                const validation = validator(formElement.value);
                Object.assign(formElement, validation);
                console.log(this.virtualForm);
                if (!validation.isValid) {
                  item.classList.add("is-not-valid");
                } else {
                  item.classList.remove("is-not-valid");
                }
              });
            }

          });
        })
    });

    // this.form.addEventListener("submit", e => {
    //   e.preventDefault();
    //   console.log("validate");
    //   this.formValidate();
    // });
  }
  setValidators(validators) {
    Object.keys(validators).forEach(key => {
      if(!this.virtualForm[key]) return; 

      Object.assign(this.virtualForm[key], {
        validators: validators[key]
      });
    });
    console.log(this.virtualForm);
  }
  // formValidate() {
  //   Object.values(this.virtualForm).forEach(element => {
  //     Array.from(element.validators).forEach(item => {
  //       console.log(item);
  //     });
  //   });
  // }
}

const form = new FormValidator(document.querySelector('form'));

form.setValidators({
  username: [required],
  email: [required],
  gender: [required],
  rodo: [required],
  regions: [required],
  remark: [required],
})

// form.createVirtualForm();
