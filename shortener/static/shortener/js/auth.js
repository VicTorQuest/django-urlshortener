// Auth JavaScript - Handles validation, password toggle, and form submission

class AuthHandler {
  constructor() {
    this.init()
  }

  init() {
    this.setupPasswordToggles()
    this.setupFormValidation()
    this.setupPasswordStrength()
    this.setupFormSubmissions()
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
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          passwordInput.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  }

  // Form validation setup
  setupFormValidation() {
    const forms = document.querySelectorAll(".auth-form")

    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input[required]")

      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input))
        input.addEventListener("input", () => this.clearFieldError(input))
      })
    })
  }

  // Password strength indicator
  setupPasswordStrength() {
    const passwordInput = document.getElementById("password")
    if (passwordInput) {
      passwordInput.addEventListener("input", (e) => {
        this.updatePasswordStrength(e.target.value)
      })
    }
  }

  // Form submission handlers
  setupFormSubmissions() {
    const signupForm = document.getElementById("signupForm")
    const signinForm = document.getElementById("signinForm")

    if (signupForm) {
      signupForm.addEventListener("submit", (e) => this.handleSignup(e))
    }

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

    switch (fieldName) {
      case "username":
        if (value.length < 3) {
          isValid = false
          errorMessage = "Username must be at least 3 characters long"
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          isValid = false
          errorMessage = "Username can only contain letters, numbers, and underscores"
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        }
        break

      case "password":
        if (value.length < 8) {
          isValid = false
          errorMessage = "Password must be at least 8 characters long"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          isValid = false
          errorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }
        break

      case "loginField":
        if (value.length < 3) {
          isValid = false
          errorMessage = "Please enter your username or email"
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
      this.hideFieldError(input)
    } else {
      input.classList.add("is-invalid")
      this.showFieldError(input, errorMessage)
    }

    return isValid
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
      this.hideFieldError(input)
    }
  }

  // Update password strength indicator
  updatePasswordStrength(password) {
    const strengthFill = document.querySelector(".strength-fill")
    const strengthText = document.querySelector(".strength-text")

    if (!strengthFill || !strengthText) return

    let strength = 0
    let strengthLabel = ""

    // Check password criteria
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    // Remove all strength classes
    strengthFill.classList.remove("weak", "fair", "good", "strong")

    // Apply appropriate strength class and label
    switch (strength) {
      case 0:
      case 1:
        strengthFill.classList.add("weak")
        strengthLabel = "Weak password"
        break
      case 2:
        strengthFill.classList.add("fair")
        strengthLabel = "Fair password"
        break
      case 3:
      case 4:
        strengthFill.classList.add("good")
        strengthLabel = "Good password"
        break
      case 5:
        strengthFill.classList.add("strong")
        strengthLabel = "Strong password"
        break
    }

    strengthText.textContent = strengthLabel
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

  // Handle signup form submission
  async handleSignup(e) {
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
      const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }

      // Send signup request
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        this.showMessage(
          form,
          "Account created successfully! Please check your email to verify your account.",
          "success",
        )
        form.reset()

        // Reset password strength indicator
        const strengthFill = document.querySelector(".strength-fill")
        const strengthText = document.querySelector(".strength-text")
        if (strengthFill && strengthText) {
          strengthFill.className = "strength-fill"
          strengthText.textContent = "Password strength"
        }
      } else {
        const errorData = await response.json()
        this.showMessage(form, errorData.message || "Failed to create account. Please try again.")
      }
    } catch (error) {
      console.error("Signup error:", error)
      this.showMessage(form, "Network error. Please check your connection and try again.")
    } finally {
      this.hideLoading(submitButton)
    }
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
        loginField: formData.get("loginField"),
        password: formData.get("password"),
        rememberMe: formData.get("rememberMe") === "on",
      }

      // Send signin request
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        this.showMessage(form, "Sign in successful! Redirecting...", "success")

        // Simulate redirect after success
        setTimeout(() => {
          // window.location.href = '/dashboard';
          console.log("Would redirect to dashboard")
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

// Initialize auth handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthHandler()
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
