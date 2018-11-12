require("./style.scss");

const required = (value) => {
  const isValue = typeof(value) === "boolean" ? value : Boolean(value.length);
  return {
    isValid: isValue,
    errorMessage: isValue ? "" : "This field is required."
  }
}

const checkLength = (value, requiredLength = 3) => {
  const isLongEnough = value.length > requiredLength;
  const char = requiredLength <= 1 ? "character" : "characters";
  return {
    isValid: isLongEnough,
    errorMessage: isLongEnough ? "" : `Text needs to be at least ${requiredLength} ${char} long.`
  }
}

const checkEmail = (value) => {
  const isEmailValid = value.indexOf("@") !== -1;
  return {
    isValid: isEmailValid,
    errorMessage: isEmailValid ? "" : "This should be a valid email."
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

    const errorReference = (name) => this.form.querySelector(`.${name}-error`);

    Array.from(formElements).forEach(element => {
      const {tagName, type, name, value, checked} = element;
      if (tags.indexOf(tagName) !== -1) {
        this.virtualForm[name] = {
          value: type === "checkbox" || type === "radio" ? checked : value,
          type,
          reference: tagReference(tagName, type),
          isValid: true,
          validators: null,
          errorMessages: [],
          errorFieldReference: errorReference(name),
        }
      }
    });
  }
  addEventListeners() {
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      console.log("validate");
      // this.addEventListeners();
      Object.values(this.virtualForm).forEach(element => {
        Array.from(element.reference).forEach(item => {
          // console.log(element);
          this.formValidate(element, item);
        });
      });
    });

    Object.values(this.virtualForm).forEach(element => {
        Array.from(element.reference).forEach(item => {
          // formValidate(e);
          // console.log(item);
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
            this.formValidate(formElement, item);
          });
        })
    });



  }

  formValidate(formElement, item) {
    if (formElement.validators) {
      let errorMessages = [];
      formElement.validators.forEach(validator => {
        const validation = validator(formElement.value);
        errorMessages.push(validation.errorMessage);
        console.log(errorMessages);
        Object.assign(formElement, {
          isValid: validation.isValid,
          errorMessages,
        });
        let message = "";
        formElement.errorMessages.forEach(msg => {
          message = message + " " + msg.trim();
          return message;
        });
        console.log(message);
        formElement.errorFieldReference.textContent = message;
        if (!validation.isValid) {
          item.classList.add("is-not-valid");
        } else {
          item.classList.remove("is-not-valid");
        }
      });
    }
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
}

const form = new FormValidator(document.querySelector('form'));

form.setValidators({
  username: [required, checkLength],
  email: [required, checkEmail],
  gender: [required],
  rodo: [required],
  regions: [required],
  remark: [required],
})
