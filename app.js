"use strict";

/*
  Mobile Welding Job Request Form
  Complete app.js file
*/

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("jobForm");
  const steps = Array.from(
    document.querySelectorAll(".step")
  );

  const nextButton =
    document.getElementById("nextBtn");

  const backButton =
    document.getElementById("backBtn");

  const saveButton =
    document.getElementById("saveBtn");

  const submitButton =
    document.getElementById("submitBtn");

  const stepLabel =
    document.getElementById("stepLabel");

  const percentLabel =
    document.getElementById("percentLabel");

  const progressBar =
    document.getElementById("progressBar");

  const summary =
    document.getElementById("summary");

  const photoInput =
    document.getElementById("photos");

  const photoPreview =
    document.getElementById("preview");

  const finishDialog =
    document.getElementById("finishDialog");

  const downloadButton =
    document.getElementById("downloadBtn");

  const printButton =
    document.getElementById("printBtn");

  const closeDialogButton =
    document.getElementById("closeDialog");

  const STORAGE_KEY =
    "mobileWeldingJobDraftV3";

  let currentStep = 0;
  let temporaryPhotoUrls = [];

  /*
    Make sure the required HTML exists.
  */

  if (
    !form ||
    steps.length === 0 ||
    !nextButton ||
    !backButton ||
    !submitButton
  ) {
    console.error(
      "The form could not start because required HTML elements are missing."
    );

    alert(
      "The form could not start. Make sure index.html and app.js are in the same folder and are from the same version."
    );

    return;
  }

  /*
    Show the selected form step.
  */

  function showStep(stepNumber) {
    currentStep = Math.max(
      0,
      Math.min(
        stepNumber,
        steps.length - 1
      )
    );

    steps.forEach(function (step, index) {
      const isCurrentStep =
        index === currentStep;

      step.classList.toggle(
        "active",
        isCurrentStep
      );

      step.hidden =
        !isCurrentStep;
    });

    const progressPercentage =
      steps.length > 1
        ? Math.round(
            (
              currentStep /
              (steps.length - 1)
            ) * 100
          )
        : 100;

    if (stepLabel) {
      stepLabel.textContent =
        "Step " +
        (currentStep + 1) +
        " of " +
        steps.length;
    }

    if (percentLabel) {
      percentLabel.textContent =
        progressPercentage + "%";
    }

    if (progressBar) {
      progressBar.style.width =
        progressPercentage + "%";
    }

    backButton.hidden =
      currentStep === 0;

    nextButton.hidden =
      currentStep ===
      steps.length - 1;

    submitButton.hidden =
      currentStep !==
      steps.length - 1;

    clearValidationMessage();

    if (
      currentStep ===
      steps.length - 1
    ) {
      renderSummary();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /*
    Escape a field name before using
    the field name in a selector.
  */

  function escapeSelectorValue(value) {
    if (
      window.CSS &&
      typeof window.CSS.escape ===
        "function"
    ) {
      return window.CSS.escape(value);
    }

    return String(value).replace(
      /(["\\])/g,
      "\\$1"
    );
  }

  /*
    Get the names of required
    radio-button groups.
  */

  function getRequiredRadioGroups(
    section
  ) {
    const groupNames = new Set();

    const requiredRadios =
      section.querySelectorAll(
        'input[type="radio"][required]'
      );

    requiredRadios.forEach(
      function (radio) {
        if (radio.name) {
          groupNames.add(radio.name);
        }
      }
    );

    return Array.from(groupNames);
  }

  /*
    Validate the currently displayed step.
  */

  function validateCurrentStep() {
    const currentSection =
      steps[currentStep];

    clearValidationMessage();

    /*
      Validate required radio groups.
    */

    const requiredRadioGroups =
      getRequiredRadioGroups(
        currentSection
      );

    for (
      const groupName
      of requiredRadioGroups
    ) {
      const safeGroupName =
        escapeSelectorValue(
          groupName
        );

      const selectedRadio =
        currentSection.querySelector(
          'input[type="radio"][name="' +
            safeGroupName +
            '"]:checked'
        );

      if (!selectedRadio) {
        const firstRadio =
          currentSection.querySelector(
            'input[type="radio"][name="' +
              safeGroupName +
              '"]'
          );

        const target =
          firstRadio
            ? firstRadio.closest(
                "fieldset"
              )
            : currentSection;

        showValidationMessage(
          "Please choose one option before continuing.",
          target
        );

        return false;
      }
    }

    /*
      Validate required text fields,
      ZIP codes, email addresses, and
      other browser-validated fields.
    */

    const controls = Array.from(
      currentSection.querySelectorAll(
        "input, select, textarea"
      )
    );

    for (const control of controls) {
      if (
        control.disabled ||
        control.type === "hidden" ||
        control.type === "file"
      ) {
        continue;
      }

      if (!control.checkValidity()) {
        control.classList.add(
          "touched"
        );

        const errorMessage =
          control.validationMessage ||
          "Please complete this field before continuing.";

        showValidationMessage(
          errorMessage,
          control
        );

        try {
          control.reportValidity();
        } catch (error) {
          console.warn(
            "The browser could not display its normal validation message.",
            error
          );
        }

        return false;
      }
    }

    return true;
  }

  /*
    Show a visible error message.
  */

  function showValidationMessage(
    message,
    target
  ) {
    clearValidationMessage();

    const validationMessage =
      document.createElement("div");

    validationMessage.id =
      "formValidationMessage";

    validationMessage.className =
      "validation-note";

    validationMessage.setAttribute(
      "role",
      "alert"
    );

    validationMessage.textContent =
      message;

    /*
      Inline styling acts as a backup
      if the CSS validation style is missing.
    */

    validationMessage.style.margin =
      "0 0 18px";

    validationMessage.style.padding =
      "13px 15px";

    validationMessage.style.color =
      "#741710";

    validationMessage.style.background =
      "#fff0ef";

    validationMessage.style.border =
      "1px solid #d58d88";

    validationMessage.style.borderLeft =
      "5px solid #b42318";

    validationMessage.style.fontSize =
      "14px";

    validationMessage.style.fontWeight =
      "800";

    const currentSection =
      steps[currentStep];

    currentSection.insertBefore(
      validationMessage,
      currentSection.firstChild
    );

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      if (
        typeof target.focus ===
        "function"
      ) {
        setTimeout(function () {
          target.focus();
        }, 250);
      }
    }
  }

  /*
    Remove the current error message.
  */

  function clearValidationMessage() {
    const oldMessage =
      document.getElementById(
        "formValidationMessage"
      );

    if (oldMessage) {
      oldMessage.remove();
    }
  }

  /*
    Convert all form answers into
    a regular JavaScript object.
  */

  function getFormDataObject() {
    const result = {};
    const formData =
      new FormData(form);

    formData.forEach(
      function (value, fieldName) {
        /*
          Save uploaded file names.
          The actual files cannot be included
          directly inside JSON.
        */

        if (value instanceof File) {
          if (!value.name) {
            return;
          }

          if (!result[fieldName]) {
            result[fieldName] = [];
          }

          result[fieldName].push(
            value.name
          );

          return;
        }

        /*
          If multiple checkboxes have the
          same name, save the answers
          as an array.
        */

        if (
          Object.prototype
            .hasOwnProperty.call(
              result,
              fieldName
            )
        ) {
          if (
            !Array.isArray(
              result[fieldName]
            )
          ) {
            result[fieldName] = [
              result[fieldName]
            ];
          }

          result[fieldName].push(
            value
          );
        } else {
          result[fieldName] =
            value;
        }
      }
    );

    return result;
  }

  /*
    Save the draft in local storage.
  */

  function saveDraft(
    displayConfirmation
  ) {
    try {
      const formData =
        getFormDataObject();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(formData)
      );

      if (displayConfirmation) {
        showToast(
          "Draft saved on this device."
        );
      }
    } catch (error) {
      console.error(
        "The draft could not be saved.",
        error
      );

      if (displayConfirmation) {
        alert(
          "The draft could not be saved in this browser."
        );
      }
    }
  }

  /*
    Load a draft saved on the
    same device and browser.
  */

  function loadDraft() {
    let savedDraft;

    try {
      savedDraft =
        localStorage.getItem(
          STORAGE_KEY
        );
    } catch (error) {
      return;
    }

    if (!savedDraft) {
      return;
    }

    try {
      const savedData =
        JSON.parse(savedDraft);

      Object.keys(savedData).forEach(
        function (fieldName) {
          const savedValue =
            savedData[fieldName];

          const savedValues =
            Array.isArray(savedValue)
              ? savedValue
              : [savedValue];

          const matchingFields =
            Array.from(
              form.elements
            ).filter(
              function (element) {
                return (
                  element.name ===
                  fieldName
                );
              }
            );

          matchingFields.forEach(
            function (field) {
              /*
                Browsers do not allow
                file uploads to be restored.
              */

              if (
                field.type === "file"
              ) {
                return;
              }

              if (
                field.type === "radio" ||
                field.type === "checkbox"
              ) {
                field.checked =
                  savedValues.includes(
                    field.value
                  ) ||
                  savedValue === "on";
              } else {
                field.value =
                  savedValue;
              }
            }
          );
        }
      );
    } catch (error) {
      console.warn(
        "The saved draft could not be loaded.",
        error
      );
    }
  }

  /*
    Display a temporary notification.
  */

  function showToast(message) {
    let toast =
      document.getElementById(
        "formToast"
      );

    if (!toast) {
      toast =
        document.createElement("div");

      toast.id = "formToast";

      toast.style.position =
        "fixed";

      toast.style.left =
        "50%";

      toast.style.bottom =
        "24px";

      toast.style.transform =
        "translateX(-50%)";

      toast.style.zIndex =
        "9999";

      toast.style.padding =
        "12px 16px";

      toast.style.fontWeight =
        "800";

      document.body.appendChild(
        toast
      );
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(
      toast.hideTimer
    );

    toast.hideTimer =
      setTimeout(function () {
        toast.hidden = true;
      }, 2200);
  }

  /*
    Escape customer-entered text before
    adding the text to the summary.
  */

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      function (character) {
        const replacements = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };

        return replacements[
          character
        ];
      }
    );
  }

  /*
    Format checkboxes for the summary.
  */

  function displayValue(
    value,
    fallbackText
  ) {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return value || fallbackText;
  }

  /*
    Build the request summary.
  */

  function renderSummary() {
    if (!summary) {
      return;
    }

    const data =
      getFormDataObject();

    const summaryRows = [
      [
        "Customer",
        data.fullName ||
          "Not provided"
      ],
      [
        "Contact",
        (data.phone ||
          "Not provided") +
          " - " +
          (data.contactMethod || "")
      ],
      [
        "Location",
        (data.address ||
          "Not provided") +
          ", " +
          (data.city || "") +
          " " +
          (data.zip || "")
      ],
      [
        "Item",
        data.itemType ||
          "Not selected"
      ],
      [
        "Damage",
        data.damage ||
          "Not provided"
      ],
      [
        "Material",
        data.material ||
          "Unknown"
      ],
      [
        "Previous repair",
        data.previousRepair ||
          "Unknown"
      ],
      [
        "Damage length",
        data.damageLength ||
          "Not provided"
      ],
      [
        "Material thickness",
        data.thickness ||
          "Not provided"
      ],
      [
        "Truck access",
        (data.truckAccess ||
          "Unknown") +
          "; " +
          (
            data.truckDistance ||
            ""
          )
      ],
      [
        "Access concerns",
        displayValue(
          data.access,
          "None specified"
        )
      ],
      [
        "Required process",
        displayValue(
          data.process,
          "Not specified"
        )
      ],
      [
        "Qualifications",
        displayValue(
          data.requirements,
          "Not specified"
        )
      ],
      [
        "Site rules",
        displayValue(
          data.siteRules,
          "Not specified"
        )
      ],
      [
        "Requested timing",
        (data.urgency ||
          "Flexible") +
          "; " +
          (
            data.preferredDate ||
            "No preferred date"
          )
      ]
    ];

    const summaryHtml =
      summaryRows
        .map(function (row) {
          return (
            "<dt>" +
            escapeHtml(row[0]) +
            "</dt>" +
            "<dd>" +
            escapeHtml(row[1]) +
            "</dd>"
          );
        })
        .join("");

    summary.innerHTML =
      "<h3>Request summary</h3>" +
      "<dl>" +
      summaryHtml +
      "</dl>";
  }

  /*
    Release temporary browser image URLs.
  */

  function clearPhotoUrls() {
    temporaryPhotoUrls.forEach(
      function (url) {
        URL.revokeObjectURL(url);
      }
    );

    temporaryPhotoUrls = [];
  }

  /*
    Display previews of selected photos.
  */

  function renderPhotoPreviews() {
    if (
      !photoInput ||
      !photoPreview
    ) {
      return;
    }

    clearPhotoUrls();

    photoPreview.innerHTML = "";

    const selectedFiles =
      Array.from(
        photoInput.files || []
      ).slice(0, 10);

    selectedFiles.forEach(
      function (file) {
        const figure =
          document.createElement(
            "figure"
          );

        const image =
          document.createElement(
            "img"
          );

        const caption =
          document.createElement(
            "figcaption"
          );

        const temporaryUrl =
          URL.createObjectURL(file);

        temporaryPhotoUrls.push(
          temporaryUrl
        );

        image.src = temporaryUrl;

        image.alt =
          "Selected job photo";

        caption.textContent =
          file.name;

        figure.appendChild(image);
        figure.appendChild(caption);

        photoPreview.appendChild(
          figure
        );
      }
    );
  }

  /*
    Download the completed request
    as a JSON file.
  */

  function downloadRequest() {
    const data =
      getFormDataObject();

    data.createdAt =
      new Date().toISOString();

    const requestText =
      JSON.stringify(
        data,
        null,
        2
      );

    const requestFile =
      new Blob(
        [requestText],
        {
          type: "application/json"
        }
      );

    const downloadLink =
      document.createElement("a");

    const customerName =
      (
        data.fullName ||
        "customer"
      )
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );

    const fileUrl =
      URL.createObjectURL(
        requestFile
      );

    downloadLink.href = fileUrl;

    downloadLink.download =
      "welding-job-request-" +
      (
        customerName ||
        "customer"
      ) +
      ".json";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
      URL.revokeObjectURL(
        fileUrl
      );
    }, 500);
  }

  /*
    Continue button.
  */

  nextButton.addEventListener(
    "click",
    function () {
      if (validateCurrentStep()) {
        saveDraft(false);

        showStep(
          currentStep + 1
        );
      }
    }
  );

  /*
    Back button.
  */

  backButton.addEventListener(
    "click",
    function () {
      saveDraft(false);

      showStep(
        currentStep - 1
      );
    }
  );

  /*
    Save Draft button.
  */

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      function () {
        saveDraft(true);
      }
    );
  }

  /*
    Clear error messages when
    the customer edits an answer.
  */

  form.addEventListener(
    "input",
    function (event) {
      event.target.classList.remove(
        "touched"
      );

      clearValidationMessage();
    }
  );

  form.addEventListener(
    "change",
    function () {
      clearValidationMessage();
    }
  );

  /*
    Photo upload preview.
  */

  if (photoInput) {
    photoInput.addEventListener(
      "change",
      renderPhotoPreviews
    );
  }

  /*
    Finish Request button.
  */

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      if (
        !validateCurrentStep()
      ) {
        return;
      }

      saveDraft(false);
      renderSummary();

      if (
        finishDialog &&
        typeof finishDialog.showModal ===
          "function"
      ) {
        finishDialog.showModal();
      } else {
        alert(
          "Your request is ready. Use Print or download the request."
        );
      }
    }
  );

  /*
    Download Request button.
  */

  if (downloadButton) {
    downloadButton.addEventListener(
      "click",
      downloadRequest
    );
  }

  /*
    Print or Save PDF button.
  */

  if (printButton) {
    printButton.addEventListener(
      "click",
      function () {
        window.print();
      }
    );
  }

  /*
    Close completion window.
  */

  if (
    closeDialogButton &&
    finishDialog
  ) {
    closeDialogButton.addEventListener(
      "click",
      function () {
        if (
          typeof finishDialog.close ===
            "function"
        ) {
          finishDialog.close();
        }
      }
    );
  }

  /*
    Start the form.
  */

  loadDraft();
  showStep(0);
});
