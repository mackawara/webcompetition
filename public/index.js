window.addEventListener("DOMContentLoaded", async () => {
  console.log("doc loaded");
  const form = document.getElementById("myForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formValidation();
  });
  function reset() {}
  /* register(); */
  async function formValidation() {
    /* input fields */
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const bizLocation = document.getElementById("bizLocation");
    const bizDescription = document.getElementById("bizDescription");
    const phoneNumber = document.getElementById("phoneNumber");
    const fbLink = document.getElementById("fbLink");

    let inputErrors = [];

    function inputValidation(inputsField) {
      this.inputsField = inputsField;
      const small = inputsField.parentElement.querySelector("small");
      const value = this.inputsField.value;
      /* set error is the function which catches all errors and inputs the errors CSS */
      this.setError = function () {
        inputsField.parentElement.className = "input-group error";
        inputErrors.push(inputsField.name);
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
      this.regexTest = function (regex) {
        return regex.test(value);
      };
      /* function to run when the field is empty */
      this.empty = function () {
        console.log(`${inputsField.name} is empty`);
        small.innerText = inputsField.name + " cannot be empty";
        inputErrors.push(inputsField.name);
      };
      /* input the errors message into the small tag */
      this.invalid = function () {
        console.log("invalid");
        small.innerText = ` Please enter a valid  ${inputsField.name}`;

        inputErrors.push(`${inputsField.name}`);
      };
      this.setSuccess = async function () {
        /* first remove existing enty in inout errors , if any */
        const index = inputErrors.indexOf(inputsField.name);
        if (index > -1) {
          inputErrors.splice(index, 1); // 2nd parameter means remove one item only
        }
      };
      /* remove any error messages */
      small.innerText = "";
      /* add styling to show successful validation */
      inputsField.parentElement.className = "input-group success";
    }

    /* Name Validation */

    const fullNamefield = new inputValidation(fullName);
    /* check if field is empty */
    if (fullNamefield.isEmpty()) {
      fullNamefield.empty(), fullNamefield.setError();
    } else if (
      /* check name  if valid input */
      fullNamefield.tooShort(4) ||
      fullNamefield.tooLong(65)
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
      emailfield.tooShort(4) /*  ||
      emailfield.regexTest(
        /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/
      ) */
    ) {
      emailfield.invalid();
      emailfield.setError();
    } else {
      emailfield.setSuccess();
    }

    /* phoneNumber Validation */
    const phoneNumberField = new inputValidation(phoneNumber);
    const regexValue = /(\+263|0)7[7-8|1|3][0-9]{7}$/;
    if (phoneNumberField.isEmpty()) {
      phoneNumberField.empty(), phoneNumberField.setError();
    } else if (
      /* check phone number length */
      phoneNumberField.tooShort(10) ||
      phoneNumberField.tooLong(14) ||
      /* check if valid Zimbabwean number */
      regexValue.test(phoneNumber.value)
    ) {
      phoneNumberField.setError(), phoneNumberField.invalid();
    } else {
      phoneNumberField.setSuccess;
    }

    const fbLinkField = new inputValidation(fbLink);
    if (fbLinkField.isEmpty()) {
      fbLinkField.empty();
      fbLinkField.setError();
    } else if (fbLinkField.tooShort(3)) {
      fbLinkField.setError();
      fbLinkField.invalid();
    } else {
      fbLinkField.setSuccess();
    }
    const bizDescriptionField = new inputValidation(bizDescription);
    if (bizDescriptionField.isEmpty()) {
      bizDescriptionField.setError();
      bizDescriptionField.empty();
    } else if (
      bizDescriptionField.tooShort(200) ||
      bizDescriptionField.tooLong(800)
    ) {
      bizDescriptionField.invalid(), bizDescriptionField.setError();
    } else {
      bizDescriptionField.setSuccess();
    }
    const bizLocationField = new inputValidation(bizLocation);
    if (bizLocationField.isEmpty()) {
      bizLocationField.empty();
    } else if (bizLocationField.tooShort(2) || bizLocationField.tooLong(50)) {
      bizLocationField.setError(), bizLocationField.invalid();
    } else {
      bizLocationField.setSuccess();
    }

    if (inputErrors.length == 0) {
      console.log(inputErrors);
      sendRegistrationForm();
    }
  }

  /*  Sends the form Data to the back end  */
  async function sendRegistrationForm() {
    let formData = new FormData(form);
    console.log(formData);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      mode: "cors",
      redirect: "follow",
      body: formData,
    };
    const response = await fetch("/registration", options);
    const data = await response.json();
    const result = document.getElementById("results");
    result.style.display = "block";

    if (response.status == "200") {
      form.remove();
      document.getElementById(
        "confirmation"
      ).innerText = ` Thank you ${data.fullName} for participating, you will hear from our team soon!`;
      console.log("SUCCESS");
      /* for (const any in data) {
                const p = document.createElement("p");
                const personalDetails = `${any}: ${data[any]}`;
                p.innerText = personalDetails;
                result.appendChild(p);
                result.classList.remove("error");
              } */
    } else if (response.status == "409") {
      console.log(
        "Error duplicate entry. Please check if you havent already made a submission"
      );
      const confirmation = document.getElementById("registrationConfirmation");
      confirmation.innerText = data.response;
      confirmation.parentElement.classList.add("error");
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
        document.getElementById(`${any}`).parentElement.classList.add("error");

        console.log(`${any}`);
        result.appendChild(p);
      }
    }
  }
});
