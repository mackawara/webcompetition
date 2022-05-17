window.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("myForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        formValidation();
        register();
    });
    let formData = new FormData()
    async function formValidation() {
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
            const value = this.inputsField.value
            /* set error is the function which catches all errors and inputs the errors CSS */
            this.setError = function () {
                inputsField.parentElement.className = "input-group error";
            };
            /* function to run when the field is empty */
            this.empty = function () {
                small.innerText = inputsField.name + " cannot be empty";
                inputErrors.push(inputsField.name);
            };
            /* input the errors message into the small tag */
            this.invalid = function () {
                small.innerText = ` Please enter a valid  ${inputsField.name}`;

                inputErrors.push(`${inputsField.name}`);
            };
            this.sanitise = (string) => {
                return String(string).replace(/[&<>"'`=\/]/g, function (s) {
                    return entityMap[s];
                });
            };
            this.setSuccess = function () {
                const sanitisedValue = this.sanitise(value)
                //small.innerText = message;
                inputsField.parentElement.className = "input-group success";
                formData.append(`${this.inputsField.name}`, `${sanitisedValue}`)

            };
        }
    }

    /* Sends the form Data to the back end */
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
                        "confirmation" /* add this to html */
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
            }))
    }
})
