// Sign In JavaScript - Handles validation, password toggle, and form submission

class SignInHandler {
  constructor() {
    this.init()
  }

  init() {
    this.setupPasswordToggles()
    this.setupFormValidation()
    this.setupFormSubmission()
  }

  // Password visibility toggle functionality
  setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll(".password-toggle")

    toggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = button.getAttribute("data-target")
        const passwordInput = document.getElementById(targetId)
        const icon = button.querySelector("i")

        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          icon.classList.remove("bi-eye-fill")
          icon.classList.add("bi-eye-slash-fill")
        } else {
          passwordInput.type = "password"
          icon.classList.remove("bi-eye-slash-fill")
          icon.classList.add("bi-eye-fill")
        }
      })
    })
  }

  // Form validation setup
  setupFormValidation() {
    const form = document.getElementById("signinForm")
    if (!form) return

    const inputs = form.querySelectorAll("input[required]")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  // Form submission handler
  setupFormSubmission() {
    const signinForm = document.getElementById("signinForm")
    if (signinForm) {
      signinForm.addEventListener("submit", (e) => this.handleSignin(e))
    }
  }

  // Field validation
  validateField(input) {
    const value = input.value.trim()
    const fieldName = input.name
    let isValid = true
    let errorMessage = ""

    // Clear previous validation states
    input.classList.remove("is-valid", "is-invalid")
    this.removeCustomValidationIcon(input)

    switch (fieldName) {
      case "loginCredential":
        if (value.length < 1) {
          isValid = false
          errorMessage = "Please enter your username or email"
        }
        break

      case "password":
        if (value.length < 1) {
          isValid = false
          errorMessage = "Please enter your password"
        }
        break

      default:
        if (value === "") {
          isValid = false
          errorMessage = "This field is required"
        }
    }

    // Apply validation state
    if (isValid) {
      input.classList.add("is-valid")
      this.addCustomValidationIcon(input, "valid")
      this.hideFieldError(input)
    } else {
      input.classList.add("is-invalid")
      this.addCustomValidationIcon(input, "invalid")
      this.showFieldError(input, errorMessage)
    }

    return isValid
  }

  // Add custom validation icon for password fields
  addCustomValidationIcon(input, type) {
    if (input.name === "password") {
      const passwordGroup = input.closest(".password-group")
      if (passwordGroup) {
        // Remove existing validation icon
        const existingIcon = passwordGroup.querySelector(".validation-icon")
        if (existingIcon) {
          existingIcon.remove()
        }

        // Add new validation icon
        const validationIcon = document.createElement("span")
        validationIcon.className = `validation-icon ${type}`

        if (type === "valid") {
          validationIcon.innerHTML = '<i class="bi bi-check-lg"></i>'
        } else {
          validationIcon.innerHTML = '<i class="bi bi-exclamation-circle"></i>'
        }

        passwordGroup.appendChild(validationIcon)
      }
    }
  }

  // Remove custom validation icon
  removeCustomValidationIcon(input) {
    if (input.name === "password") {
      const passwordGroup = input.closest(".password-group")
      if (passwordGroup) {
        const existingIcon = passwordGroup.querySelector(".validation-icon")
        if (existingIcon) {
          existingIcon.remove()
        }
      }
    }
  }

  // Show field error
  showFieldError(input, message) {
    const feedback = input.parentNode.parentNode.querySelector(".invalid-feedback")
    if (feedback) {
      feedback.textContent = message
      feedback.style.display = "block"
    }
  }

  // Hide field error
  hideFieldError(input) {
    const feedback = input.parentNode.parentNode.querySelector(".invalid-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }
  }

  // Clear field error on input
  clearFieldError(input) {
    if (input.classList.contains("is-invalid")) {
      input.classList.remove("is-invalid")
      console.log('clearing field error')
      this.removeCustomValidationIcon(input)
      this.hideFieldError(input)
    }
  }

  // Validate entire form
  validateForm(form) {
    const inputs = form.querySelectorAll("input[required]")
    let isFormValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    return isFormValid
  }

  // Show loading state
  showLoading(button) {
    const btnText = button.querySelector(".btn-text")
    const btnLoader = button.querySelector(".btn-loader")

    btnText.style.opacity = "0"
    btnLoader.classList.remove("d-none")
    button.disabled = true
  }

  // Hide loading state
  hideLoading(button) {
    const btnText = button.querySelector(".btn-text")
    const btnLoader = button.querySelector(".btn-loader")

    btnText.style.opacity = "1"
    btnLoader.classList.add("d-none")
    button.disabled = false
  }

  // Show message
  showMessage(form, message, type = "error") {
    // Remove existing messages
    const existingMessage = form.querySelector(".success-message, .error-message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message
    const messageDiv = document.createElement("div")
    messageDiv.className = type === "success" ? "success-message" : "error-message"
    messageDiv.textContent = message

    // Insert message at the top of the form
    form.insertBefore(messageDiv, form.firstChild)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 5000)
  }

  getCookie(name) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
    return cookieValue;
  }

  // Handle signin form submission
  async handleSignin(e) {
    e.preventDefault()

    const form = e.target
    const submitButton = form.querySelector('button[type="submit"]')

    // Validate form
    if (!this.validateForm(form)) {
      form.classList.add("shake")
      setTimeout(() => form.classList.remove("shake"), 500)
      return
    }

    // Show loading state
    this.showLoading(submitButton)

    try {
      // Collect form data
      const formData = new FormData(form)
      const loginData = {
        loginCredential: formData.get("loginCredential"),
        password: formData.get("password"),
      }

      // Send signin request
      const response = await fetch("/accounts/auth/sign-in/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.getCookie('csrftoken')
        },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        this.showMessage(form, "Welcome back! Redirecting to your dashboard...", "success")

        // Simulate redirect after success
        setTimeout(() => {
          // window.location.href = '/dashboard';
          console.log("Would redirect to link dashboard")
        }, 1500)
      } else {
        const errorData = await response.json()
        this.showMessage(form, errorData.message || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Signin error:", error)
      this.showMessage(form, "Network error. Please check your connection and try again.")
    } finally {
      this.hideLoading(submitButton)
    }
  }
}

// Initialize signin handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SignInHandler()
})

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = "smooth"

// Add fade-in animation to form container
window.addEventListener("load", () => {
  const formContainer = document.querySelector(".auth-form-container")
  if (formContainer) {
    formContainer.classList.add("fade-in")
  }
})
