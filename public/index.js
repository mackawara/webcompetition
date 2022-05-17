window.addEventListener("DOMContentLoaded", async () => {
  console.log("doc loaded");
  const form = document.getElementById("myForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formValidation();
  });
  /* register(); */
  async function formValidation() {
    let formData = new FormData();
    /* input fields */
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const bizLocation = document.getElementById("bizLocation");
    const bizdescription = document.getElementById("bizDescription");
    const phoneNumber = document.getElementById("phoneNumber");
    const fblink = document.getElementById("fblink");

    let inputErrors = [];

    function inputValidation(inputsField) {
      const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;",
      };

      this.inputsField = inputsField;
      const small = inputsField.parentElement.querySelector("small");
      const value = this.inputsField.value;
      /* set error is the function which catches all errors and inputs the errors CSS */
      this.setError = function () {
        inputsField.parentElement.className = "input-group error";
      };
      /* function which checks if field is empty */
      this.isEmpty = function () {
        return value == "";
      };
      this.tooShort = function (figure) {
        /* returns true if value is tool long */

        return value.length < figure;
      };
      this.tooLong = function (figure) {
        /* returns true if value is tool long */
        return value.length > figure;
      };
      this.regexText = function (regex) {
        return !regex.test(value);
      };
      /* function to run when the field is empty */
      this.empty = function () {
        console.log(`${inputsField.name} is emtpy`);
        small.innerText = inputsField.name + " cannot be empty";
        inputErrors.push(inputsField.name);
      };
      /* input the errors message into the small tag */
      this.invalid = function () {
        console.log("invalid");
        small.innerText = ` Please enter a valid  ${inputsField.name}`;

        inputErrors.push(`${inputsField.name}`);
      };
      this.sanitise = (string) => {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
          return entityMap[s];
        });
      };
      this.setSuccess = async function () {
        console.log(` ${inputsField.name} was recorded successfully`);
        const sanitisedValue = this.sanitise(value);
        console.log(sanitisedValue);
        //small.innerText = message;
        inputsField.parentElement.className = "input-group success";
        await formData.append(`${this.inputsField.name}`, `${sanitisedValue}`);
      };
    }

    /* Name Validation */

    /* Email validation */
    const fullNamefield = new inputValidation(fullName);
    if (fullNamefield.isEmpty()) {
      fullNamefield.empty(), fullNamefield.setError();
    } else if (
      fullNamefield.tooShort(4) ||
      fullNamefield.tooLong(65) ||
      fullNamefield.regexText(
        /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/
      )
    ) {
      fullNamefield.invalid();
      fullNamefield.setError();
    } else {
      fullNamefield.setSuccess();
    }
    /* Email Validation */
    const emailfield = new inputValidation(email);
    if (emailfield.isEmpty()) {
      emailfield.empty(), emailfield.setError();
    } else if (
      emailfield.tooShort(4) ||
      emailfield.regexText(
        /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/
      )
    ) {
      emailfield.invalid();
      emailfield.setError();
    } else {
      emailfield.setSuccess();
    }

    /* phoneNumber Validation */
    const phoneNumberField = new inputValidation(phoneNumber);
    if (phoneNumberField.isEmpty()) {
      phoneNumberField.empty(), phoneNumberField.setError();
    } else if (
      phoneNumberField.tooShort(10) ||
      phoneNumberField.tooLong(14) ||
      phoneNumberField.regexText(/(\+263|0)7[7-8|1|3][0-9]{7}$/)
    ) {
      phoneNumberField.setError(), phoneNumberField.invalid();
    } else {
      phoneNumberField.setSuccess;
    }

    const fblinkField = new inputValidation(fblink);
    if (fblinkField.tooShort(3)) {
      fblinkField.setError();
      fblinkField.invalid();
    } else {
      fblinkField.setSuccess();
    }
    const bizdescriptionField = new inputValidation(bizdescription);
    if (bizdescriptionField.isEmpty()) {
      bizdescriptionField.empty();
    } else if (
      bizdescriptionField.tooShort(200) ||
      bizdescriptionField.tooLong(800)
    ) {
      bizdescriptionField.setError(), bizdescriptionField.invalid();
    } else {
      bizLocationField.setSuccess();
    }
    const bizLocationField = new inputValidation(bizLocation);
    if (bizLocationField.isEmpty()) {
      bizLocationField.empty();
    } else if (bizLocationField.tooShort(2) || bizLocationField.tooLong(50)) {
      bizLocationField.setError(), bizLocationField.invalid();
    } else {
      bizLocationField.setSuccess();
    }
  }

  /*  Sends the form Data to the back end 
      async function sendRegistrationForm() {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          redirect: "follow",
          body: JSON.stringify(formData),
        };
        fetch("/registration", options).then((response) =>
          response.json().then((data) => {
            const result = document.getElementById("results");
            result.style.display = "block";
    
            if (response.status == "200") {
              form.remove();
              document.getElementById(
                "confirmation" 
              ).innerText = ` Thank you ${data.fullName} for registering.Your details have been succssfully recorded as follows!!`;
              console.log("SUCCESS");
              for (const any in data) {
                const p = document.createElement("p");
                const personalDetails = `${any}: ${data[any]}`;
                p.innerText = personalDetails;
                result.appendChild(p);
                result.classList.remove("error");
              }
            } else if (response.status == "500") {
              console.log("Error");
              const regConfirmation = document.getElementById(
                "registrationConfirmation"
              );
              regConfirmation.innerText = data.response;
              regConfirmation.parentElement.classList.add("success");
            } else if (response.status == "422") {
              console.log("Error");
              document.getElementById(
                "registrationConfirmation"
              ).innerText = ` Your submission contains errors!!`;
              for (const any in data) {
                result.classList.add("error");
                const p = document.createElement("p");
                const personalDetails = ` ${data[any].properties.message}`;
                p.innerText = personalDetails;
                document
                  .getElementById(`${any}`)
                  .parentElement.classList.remove("success");
                document
                  .getElementById(`${any}`)
                  .parentElement.classList.add("error");
    
                console.log(`${any}`);
                result.appendChild(p);
              }
            }
          })
        );
      } */
});
